---
id: http://w3id.org/holon/spec/events-amendment-01
title: "HGA Events — Pass F Cross-Reference Amendment"
type: spec-amendment
version: 0.0.1
created: 2026-06-09
amends: http://w3id.org/holon/spec/events
author:
  - name: Kurt Cagle
    iri: https://holongraph.com/people/kurt-cagle
    role: editor
  - name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: transformer
license:
  prose: "W3C Document License"
  ontology: "CC0-1.0"
description: >
  Minor cross-reference amendment to hga-pass-c-events.databook.md.
  Adds a cross-reference note to the hev:Event class documentation
  noting that hmedia:hasScene (repeatable) is available on all events
  when Pass F (hga-pass-f-media.databook.md) is loaded.
---

## Amendment Instructions

Apply the following changes to `hga-pass-c-events.databook.md`:

### 1. In the `hev:Event` class definition (§3 Vocabulary Declarations)

After the existing `sh:agentInstruction` on `hev:Event`, add:

```turtle
    rdfs:seeAlso <http://w3id.org/holon/spec/media> ;
    # Cross-reference: Pass F adds hmedia:hasScene (repeatable) on all
    # hev:Event instances. Load hga-pass-f-media.databook.md to enable
    # scene-descriptor attachment on events.
```

### 2. Add a §X.Y cross-reference note to the prose on hev:Event

Insert the following note at the end of the `hev:Event` documentation prose:

> **Cross-Reference (Pass F):** The `hmedia:` vocabulary (Pass F) extends all
> `hev:Event` instances with `hmedia:hasScene` — a **repeatable** property
> linking the event to one or more `hmedia:SceneDescriptor` resources.
>
> Each SceneDescriptor composites:
> - `hmedia:sceneActor` — the principal agent in the scene (→ `holon:AgentHolon`)
> - `hmedia:sceneLocation` — the setting (→ `holon:Holon`)
> - `hmedia:sceneNarrative` — prose description (or `hmedia:appearance` assembly)
> - `hmedia:cameraRef` — the rendering camera (→ `hmedia:CameraAgent`)
>
> Multiple SceneDescriptors on the same event represent concurrent observations
> from different cameras or perspectives — for example, a cinematic wide shot
> and an immersive first-person view of the same AssertionEvent.
>
> `hmedia:hasScene` is not defined in Pass C shapes. It becomes available when
> `hga-pass-f-media.databook.md` is loaded. Pass C SHACL shapes are unaffected.

### 3. Update the file version header

Change `version: 0.1.0` to `version: 0.1.1` and add `updated: 2026-06-09`.

---

*Copyright 2026 Kurt Cagle / Semantical LLC.*
