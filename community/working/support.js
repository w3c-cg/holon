/**
 * support.js — Holon Deck Presentation Runtime
 *
 * Implements the custom element host for Holons.dc.html:
 *   <x-dc>          — deck container (structural)
 *   <helmet>        — secondary <head> injection
 *   <x-import>      — lazy component loader / global scope bridge
 *   <deck-stage>    — fullscreen slide presenter
 *
 * Controls:
 *   → / ↓ / Space / PageDown   Next slide
 *   ← / ↑ / PageUp             Previous slide
 *   Home / End                  First / Last slide
 *   S                           Toggle speaker notes
 *   F                           Toggle fullscreen
 *   Click right half            Next slide
 *   Click left half             Previous slide
 */
;(function () {
  'use strict'

  // ── Helmet processor ────────────────────────────────────────────────────────
  // Moves children of <helmet> into <head>, mirroring the HTML <head> section.

  function processHelmet () {
    document.querySelectorAll('helmet').forEach(helm => {
      Array.from(helm.childNodes).forEach(node =>
        document.head.appendChild(node.cloneNode(true))
      )
      helm.style.display = 'none'
    })
  }

  // ── DeckStage custom element ─────────────────────────────────────────────────

  class DeckStage extends HTMLElement {
    constructor () {
      super()
      this._slides  = []
      this._current = 0
      this._notesVisible = false
    }

    connectedCallback () {
      this._slides = Array.from(this.querySelectorAll('section'))
      if (!this._slides.length) return
      this._build()
      this._scale()
      window.addEventListener('resize', () => this._scale())
      this._bindKeys()
      this._show(0)
    }

    // ── Build DOM ──────────────────────────────────────────────────────────────

    _build () {
      const W = parseInt(this.getAttribute('width')  || 1920)
      const H = parseInt(this.getAttribute('height') || 1080)
      this._W = W
      this._H = H

      // Host fills viewport
      Object.assign(this.style, {
        display:  'block',
        position: 'fixed',
        inset:    '0',
        background: '#0E0C0A',
        overflow: 'hidden'
      })

      // Viewport — a fixed-pixel canvas that scales to fit
      this._vp = document.createElement('div')
      Object.assign(this._vp.style, {
        position:        'absolute',
        top:             '0',
        left:            '0',
        width:           W + 'px',
        height:          H + 'px',
        transformOrigin: 'top left',
        cursor:          'pointer'
      })

      // Move each section into the viewport
      this._slides.forEach(s => {
        Object.assign(s.style, {
          display:    'none',
          width:      W + 'px',
          height:     H + 'px',
          overflow:   'hidden',
          boxSizing:  'border-box',
          position:   'relative'
        })
        this._vp.appendChild(s)
      })
      this.appendChild(this._vp)

      // ── Slide counter ────────────────────────────────────────────────────────
      this._counter = document.createElement('div')
      Object.assign(this._counter.style, {
        position:    'fixed',
        bottom:      '18px',
        right:       '28px',
        fontFamily:  "'IBM Plex Sans', sans-serif",
        fontSize:    '13px',
        letterSpacing: '0.12em',
        color:       'oklch(55% 0.02 72)',
        zIndex:      '100',
        pointerEvents: 'none',
        userSelect:  'none'
      })
      document.body.appendChild(this._counter)

      // ── Progress bar ─────────────────────────────────────────────────────────
      this._bar = document.createElement('div')
      Object.assign(this._bar.style, {
        position:   'fixed',
        bottom:     '0',
        left:       '0',
        height:     '2px',
        background: 'oklch(74% 0.14 74)',
        transition: 'width 0.3s ease',
        zIndex:     '100',
        opacity:    '0.55'
      })
      document.body.appendChild(this._bar)

      // ── Notes label (hint) ───────────────────────────────────────────────────
      this._notesHint = document.createElement('div')
      Object.assign(this._notesHint.style, {
        position:    'fixed',
        bottom:      '18px',
        left:        '28px',
        fontFamily:  "'IBM Plex Sans', sans-serif",
        fontSize:    '11px',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:       'oklch(40% 0.02 72)',
        zIndex:      '100',
        pointerEvents: 'none',
        userSelect:  'none'
      })
      this._notesHint.textContent = 'S — speaker notes'
      document.body.appendChild(this._notesHint)

      // ── Speaker notes panel ──────────────────────────────────────────────────
      this._notePanel = document.createElement('div')
      Object.assign(this._notePanel.style, {
        position:   'fixed',
        bottom:     '0',
        left:       '0',
        right:      '0',
        maxHeight:  '32vh',
        background: 'rgba(10,8,6,0.95)',
        borderTop:  '1px solid oklch(74% 0.14 74 / 0.25)',
        padding:    '20px 48px 28px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize:   '15px',
        lineHeight: '1.75',
        color:      'oklch(75% 0.02 72)',
        zIndex:     '200',
        display:    'none',
        overflowY:  'auto',
        boxSizing:  'border-box'
      })

      const notesLabel = document.createElement('div')
      Object.assign(notesLabel.style, {
        fontSize:      '10px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color:         'oklch(74% 0.14 74)',
        marginBottom:  '10px'
      })
      notesLabel.textContent = 'Speaker Notes'
      this._notePanel.appendChild(notesLabel)

      this._noteText = document.createElement('p')
      Object.assign(this._noteText.style, {
        margin: '0',
        padding: '0'
      })
      this._notePanel.appendChild(this._noteText)
      document.body.appendChild(this._notePanel)

      // ── Touch / swipe ─────────────────────────────────────────────────────────
      let touchX = 0
      this._vp.addEventListener('touchstart', e => {
        touchX = e.touches[0].clientX
      }, { passive: true })
      this._vp.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchX
        if (Math.abs(dx) > 40) dx < 0 ? this._next() : this._prev()
      }, { passive: true })

      // ── Click navigation ──────────────────────────────────────────────────────
      this._vp.addEventListener('click', e => {
        const rect = this._vp.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        x > 0.5 ? this._next() : this._prev()
      })
    }

    // ── Scale viewport to fill window ─────────────────────────────────────────

    _scale () {
      const scaleX = window.innerWidth  / this._W
      const scaleY = window.innerHeight / this._H
      const scale  = Math.min(scaleX, scaleY)
      const ox = (window.innerWidth  - this._W * scale) / 2
      const oy = (window.innerHeight - this._H * scale) / 2
      this._vp.style.transform = `translate(${ox}px,${oy}px) scale(${scale})`
    }

    // ── Navigate to slide index ───────────────────────────────────────────────

    _show (index) {
      index = Math.max(0, Math.min(index, this._slides.length - 1))
      this._slides.forEach((s, i) => {
        s.style.display = i === index ? 'block' : 'none'
      })
      this._current = index
      const slide   = this._slides[index]
      const label   = slide?.getAttribute('data-screen-label') || String(index + 1)
      const n       = this._slides.length
      this._counter.textContent = `${index + 1} / ${n}`
      this._bar.style.width     = `${((index + 1) / n) * 100}%`
      document.title            = label
      this._noteText.textContent = slide?.getAttribute('data-speaker-notes') || ''

      // Hide the hint once notes have been toggled at least once
      if (index > 0) this._notesHint.style.opacity = '0'
    }

    _next () { this._show(this._current + 1) }
    _prev () { this._show(this._current - 1) }

    _toggleNotes () {
      this._notesVisible = !this._notesVisible
      this._notePanel.style.display = this._notesVisible ? 'block' : 'none'
      this._notesHint.style.display = this._notesVisible ? 'none'  : 'block'
    }

    // ── Keyboard bindings ─────────────────────────────────────────────────────

    _bindKeys () {
      document.addEventListener('keydown', e => {
        switch (e.key) {
          case 'ArrowRight': case 'ArrowDown':
          case ' ': case 'PageDown':
            e.preventDefault(); this._next(); break

          case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
            e.preventDefault(); this._prev(); break

          case 'Home':
            e.preventDefault(); this._show(0); break

          case 'End':
            e.preventDefault(); this._show(this._slides.length - 1); break

          case 's': case 'S':
            this._toggleNotes(); break

          case 'f': case 'F':
            if (!document.fullscreenElement)
              document.documentElement.requestFullscreen?.()
            else
              document.exitFullscreen?.()
            break
        }
      })
    }
  }

  // ── x-import custom element ──────────────────────────────────────────────────
  // Resolves a component from window global scope and defines it if not yet done.

  class XImport extends HTMLElement {
    connectedCallback () {
      const name = this.getAttribute('component-from-global-scope')
      if (name && window[name] && !customElements.get(name)) {
        customElements.define(name, window[name])
      }
    }
  }

  // ── x-dc custom element ───────────────────────────────────────────────────────
  // Structural container — no behaviour beyond existing as a valid element.

  class XDC extends HTMLElement {}

  // ── Register globals before define so x-import can find them ─────────────────

  window.DeckStage         = DeckStage
  window['deck-stage']     = DeckStage

  // ── Boot ──────────────────────────────────────────────────────────────────────

  function boot () {
    processHelmet()
    if (!customElements.get('deck-stage')) customElements.define('deck-stage', DeckStage)
    if (!customElements.get('x-import'))   customElements.define('x-import',   XImport)
    if (!customElements.get('x-dc'))       customElements.define('x-dc',       XDC)
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot)
  else
    boot()

})()
