---
id: urn:databook:hga-holon-relations:2026-07-03-draft
title: "Holon Relations: parentHolon, imports, importsShapes, and the Root Holon"
type: databook
version: 0.5.0
created: 2026-07-03
author:
  - name: Kurt Cagle
    iri: https://holongraph.com/people/kurt-cagle
    role: orchestrator
  - name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: transformer
license: CC-BY-4.0
domain: https://w3id.org/holon/
subject:
  - holonic graph architecture
  - SHACL validation
  - holon inheritance
  - W3C Holon Community Group
description: >
  Draft architectural note defining three core holon relations —
  holon:parentHolon, holon:imports, and holon:importsShapes — the role of the
  root holon as both structural invariant and content template, and
  the forms of inheritance (transitive/structural vs. single-hop/
  deliberate) that follow from separating content visibility from
  validation composition. Prepared for review before submission to
  the W3C Holon Community Group as part of the Holon Graph Architecture
  (HGA) specification work.
shapes:
  - https://w3id.org/holon/HolonShape
  - https://w3id.org/holon/CityHolonShape
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: composite
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  inputs:
    - iri: urn:conversation:kurt-chloe:hga-holon-relations:2026-07-03
      role: primary
      description: >
        Multi-turn architecture discussion between Kurt Cagle and Chloe
        Shannon covering dataset-as-holon-boundary, active-holon session
        scoping, structural vs. cross-cutting inheritance, and shape
        composition.
  timestamp: 2026-07-03T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
  note: >
    Draft for Kurt's review prior to HCG submission. Not yet pushed to
    kurtcagle/chloe or w3c-cg/holon. v0.2.0: adopted https://w3id.org/holon/
    as the working namespace per Kurt's 2026-07-03 direction, replacing the
    provisional https://ontologist.io/ns/holon# used in v0.1.0. v0.3.0:
    renamed the associated prefix from hb: to holon: throughout (namespace
    IRI unchanged). v0.4.0: removed implementation-specific references —
    this document addresses HGA holon relations only, independent of any
    particular codebase. v0.5.0: reverted v0.4.0's flattening of author/
    process.inputs/process.agent from structured objects to plain strings —
    that flatten was the wrong fix for a reported [object Object] rendering
    issue. kurtcagle/databook's lib/reify.js and six command files require
    the structured {name, iri, role} / {iri, role, description} form to
    emit dct:creator/prov:wasAttributedTo correctly; flattening would have
    silently broken provenance reification. Root cause of the rendering
    issue is still unidentified.
---

> **Note:** This is a **draft for review**, not a submitted artifact. Kurt
> asked for this to be prepared for his own read-through before it goes to
> the W3C Holon Community Group. Nothing here has been pushed to GitHub.

## Overview

The Holon Graph Architecture treats a dataset as a holon boundary and its
named graphs as the holons within it. Two relations connect those holons —
`holon:parentHolon` for structural containment, and `holon:imports` for
cross-cutting content — and a third, `holon:importsShapes`, was introduced
specifically to prevent validation constraints from following content
relationships where they were never intended to travel.

This document lays out all three relations, the root holon that anchors
the tree, and the resolution semantics that follow from treating
"structural" and "cross-cutting" as genuinely different kinds of edges
rather than two names for the same thing.

## Terminology

| Relation | Shape | Transitive? | Governs | Cardinality |
|---|---|---|---|---|
| `holon:parentHolon` | Tree | Yes (`holon:parentHolon*`) | Content fallback *and* shape fallback | 0 or 1 per holon (root has 0) |
| `holon:imports` | DAG, cross-cutting | No — single hop only | Content visibility only | 0 or more |
| `holon:importsShapes` | DAG, cross-cutting | No — single hop only | Validation composition only | 0 or more |

> **Important:** `holon:imports` and `holon:importsShapes` are declared
> independently. A holon may import another's content without inheriting
> its shapes, import another's shapes without inheriting its content, or
> do both by declaring both edges explicitly. Neither is implied by the
> other.

## The Root Holon

Every holon dataset has exactly one root holon — the sole node with no
`holon:parentHolon` — and it plays two distinct roles that are worth naming
separately even though one node fills both.

**Invariant.** Every holon in the dataset is reachable from root by
walking `holon:parentHolon*`. This is a structural connectivity property,
checkable by a single SPARQL property-path query (see
`select-orphan-holons` below), independent of any SHACL enforcement.

**Template.** Root is the natural place to declare the base holon shape
that every other holon in the dataset composes with (via `sh:node` /
`sh:and`), so type-specific shapes only have to state what's different
about that type, not restate the base contract every time.

Root should be treated as a **real but minimal holon** — it carries its
own `dct:title` and `dct:description` like any other holon, rather than
being a null structural artefact. What it should *not* accumulate is
runtime or session state (SHACL toggle flags, active-holon caches,
federation registry entries) — those stay in server configuration, not
in root's own graph. Root holds identity and a pointer to its shapes
graph; nothing else.

## Structural Inheritance — `holon:parentHolon`

`holon:parentHolon` is the administrative spine: city → state → country,
chapter → book → series. It is transitive by design, and two things fall
out of that transitivity for free, without any additional declaration:

1. **Content fallback.** A holon's read scope includes everything visible
   at each ancestor, walking `holon:parentHolon*` to root.
2. **Shape fallback.** A holon with no `holon:shapesGraph` of its own
   inherits the nearest ancestor's, walking the same chain.

Both resolutions reuse one traversal. There is no separate "shape parent"
concept — a holon's shape ancestry and its content ancestry follow the
same tree, because containment implies both by default.

## Cross-Cutting Content — `holon:imports`

Not every relationship a holon needs is on its structural spine. A city's
administrative parent is its state, but it may also need context from a
metro region, a watershed authority, or a trade bloc — none of which
"contain" it in the tree sense. `holon:imports` covers this: content from
outside the ancestry, added deliberately, one hop at a time.

It is kept **non-transitive on purpose**. If it were transitive, a city
importing a metro region would silently pull in everything the metro
region itself imports — cross-cutting relationships would compound in a
way nobody chose and nobody can predict by looking at the city's own
declarations. Non-transitivity means every hop is visible in the data;
nothing arrives as a side effect of something two hops away.

`holon:imports` **never** affects validation. Importing a holon for its
content is a query-time convenience with no write-time consequence.

## Shape Composition — `holon:importsShapes`

`holon:importsShapes` is the same non-transitive, single-hop pattern as
`holon:imports`, applied to a different graph: instead of pulling in a
target holon's content, it pulls in the target's *shapes graph* as a
composable SHACL constraint (via `sh:node` on the importing holon's own
shape).

This was split out from `holon:imports` deliberately, not merged into it,
because the two have different failure modes. An unwanted content import
means a query returns more than expected — low cost, easy to notice. An
unwanted shape import means a write can be rejected for a reason that
traces back to a holon nobody realised was in scope, or — worse — silently
*accepted* under looser tolerances a borrowed shape happens to allow.
Composition via `sh:node` is additive (SHACL doesn't support "override" —
the more restrictive shape always wins), so importing shapes is a
one-way tightening operation: a holon can add constraints beyond what it
imports, but can never opt out of one it imported.

## Why the Split Matters — Worked Example

A concrete case for the distinction: cities within states within
countries, where a city also needs content from a cross-border metro
region.

- **City → state → country** is the `holon:parentHolon` spine. Transitive,
  so a city automatically gets its state's and country's content and
  shapes with zero explicit declarations.
- **City → metro region** is *not* on that spine — the metro region is
  not the city's administrative parent. The city declares
  `holon:imports <metro>` to get the metro region's economic/cultural
  context for querying.
- The city does **not** declare `holon:importsShapes <metro>`. The metro
  region's shapes were authored for aggregate, cross-jurisdictional
  data — not for validating an individual city record. Without the
  split, importing the metro's content for querying would also silently
  bind the city's writes to a validation contract meant for a different
  kind of entity.

Net effect: nothing outside a holon's ancestry can ever affect what makes
its writes valid, unless `holon:importsShapes` was declared on that specific
holon, pointing at that specific source, explicitly.

## Resolution Semantics

Two resolvers, structurally identical, walking different edges for
different purposes:

```text
resolveReadScope(holon):
    scope = { holon }
    scope += ancestors(holon, via=parentHolon, transitive=true)
    scope += targets(holon, via=imports, transitive=false)
    return scope

resolveShapesScope(holon):
    shapesGraph = holon.shapesGraph
                  or nearestAncestor(holon, via=parentHolon).shapesGraph
    composed = { shapesGraph }
    composed += targets(holon, via=importsShapes, transitive=false).shapesGraph
    return composed
```

`resolveReadScope` governs what a query can see. `resolveShapesScope`
governs what a write must satisfy. They are never the same call, and a
holon's presence in one does not imply its presence in the other.

## Worked Example (Turtle)

<!-- databook:id: worked-example-holons -->
<!-- databook:label: City/state/country spine with cross-cutting metro import -->
```turtle
@prefix holon:   <https://w3id.org/holon/> .
@prefix dct:  <http://purl.org/dc/terms/> .

# --- Root holon: real but minimal ----------------------------------------
<urn:holon:root> a holon:Holon ;
    dct:title       "Atlas — Root Holon" ;
    dct:description "Anchors this dataset's holon tree; carries only
                      identity and a pointer to the base shapes graph." ;
    holon:shapesGraph  <urn:holon:root:shapes> .

# --- Administrative spine: holon:parentHolon, transitive --------------------
<urn:holon:country:example-country> a holon:Holon ;
    dct:title      "Example Country" ;
    holon:parentHolon <urn:holon:root> .

<urn:holon:state:example-state> a holon:Holon ;
    dct:title      "Example State" ;
    holon:parentHolon <urn:holon:country:example-country> .

<urn:holon:city:example-city> a holon:Holon ;
    dct:title      "Example City" ;
    holon:parentHolon <urn:holon:state:example-state> ;
    # Cross-cutting CONTENT import only — metro is not the administrative
    # parent, and its shapes are deliberately NOT imported (see below).
    holon:imports     <urn:holon:region:example-metro> .

# --- Cross-cutting region: outside the administrative tree ---------------
<urn:holon:region:example-metro> a holon:Holon ;
    dct:title       "Example Metro Region" ;
    dct:description "Cross-jurisdictional region; not an administrative
                      parent of any single city in it." ;
    holon:parentHolon  <urn:holon:root> ;
    holon:shapesGraph  <urn:holon:region:example-metro:shapes> .
```

> **Note:** The city's `holon:importsShapes` is intentionally absent from
> this example. That absence is the point — see "Why the Split Matters"
> above.

## Base Holon Shape (SHACL)

<!-- databook:id: holon-base-shapes -->
<!-- databook:label: Root-declared base shape composed by type-specific shapes -->
```shacl
@prefix sh:   <http://www.w3.org/ns/shacl#> .
@prefix holon:   <https://w3id.org/holon/> .
@prefix dct:  <http://purl.org/dc/terms/> .
@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .

holon:HolonShape a sh:NodeShape ;
    sh:targetClass holon:Holon ;
    sh:property [
        sh:path     holon:parentHolon ;
        sh:maxCount 1 ;
        sh:class    holon:Holon ;
    ] ;
    sh:property [
        sh:path     dct:title ;
        sh:minCount 1 ;
        sh:datatype xsd:string ;
    ] .

# Type-specific shape composes the base via sh:node rather than
# restating dct:title / holon:parentHolon constraints.
holon:CityHolonShape a sh:NodeShape ;
    sh:node     holon:HolonShape ;
    sh:property [
        sh:path     holon:population ;
        sh:datatype xsd:integer ;
    ] .
```

## Validation Query — Root Connectivity Invariant

<!-- databook:id: select-orphan-holons -->
<!-- databook:label: Every holon should be reachable from root -->
```sparql
PREFIX holon: <https://w3id.org/holon/>

SELECT ?orphan WHERE {
  ?orphan a holon:Holon .
  FILTER NOT EXISTS { ?orphan holon:parentHolon* <urn:holon:root> }
}
```

> **Note:** An empty result set confirms the connectivity invariant holds.
> Whether this should additionally be SHACL-enforced (`sh:minCount 1` on
> `holon:parentHolon` for every holon except root) or left as a checked
> convention is one of the open questions below.

## Open Questions for HCG Discussion

1. **Namespace — decided, pending registration outcome.** This draft now
   uses `holon:` bound to `https://w3id.org/holon/` per Kurt's direction
   (2026-07-03): a single terminating `/` rather than a `#` fragment
   separator, so that context-head-based forms (JSON-LD `@context`,
   YAML-LD) can treat the namespace uniformly without a second
   terminator character — particularly since `#` also carries comment
   semantics in Turtle/SPARQL, which has proven a source of friction.
   This is contingent on the `w3id.org/holon` registration PR
   (`perma-id/w3id.org#6300`) being accepted; if `/holon/` is denied as
   too generic, the fallback is `/holon-graph/`, applied uniformly here.
2. **Enforcement level of the root-connectivity invariant.** Checked
   convention (the SPARQL query above) vs. SHACL-enforced
   (`sh:minCount 1` on `holon:parentHolon` for all non-root holons).
3. **Is exactly one root per dataset the right cardinality**, given
   dataset-as-holon-boundary? (Current position: yes — multiple roots
   within one dataset would blur the boundary that decision established.
   Worth stating explicitly in the spec rather than leaving implicit.)
4. **Should `holon:importsShapes` require the source holon's shapes to be
   explicitly marked composable** (e.g. `holon:shapesComposable true`), or
   is any holon's shapes graph fair game for import by default? The
   metro-region example assumes the latter; a CG reviewer may reasonably
   want the former to prevent a shapes graph authored for one purpose
   being silently reused for an unintended one.
