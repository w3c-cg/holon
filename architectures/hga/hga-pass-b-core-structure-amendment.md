---
id: http://w3id.org/holon/spec/core-structure-amendment-01
title: "HGA Core Structure — Pass F Cross-Reference Amendment"
type: spec-amendment
version: 0.0.1
created: 2026-06-09
amends: http://w3id.org/holon/spec/core-structure
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
  Minor cross-reference amendment to hga-pass-b-core-structure.databook.md.
  Adds a cross-reference note to the holon:Holon class documentation
  noting that hmedia:appearance and hmedia:hasMedia are available on all
  holon instances when Pass F (hga-pass-f-media.databook.md) is loaded.
---

## Amendment Instructions

Apply the following changes to `hga-pass-b-core-structure.databook.md`:

### 1. In the `holon:Holon` class definition (§3 Vocabulary Declarations)

After the existing `sh:agentInstruction` on `holon:Holon`, add:

```turtle
    rdfs:seeAlso <http://w3id.org/holon/spec/media> ;
    # Cross-reference: Pass F adds hmedia:appearance and hmedia:hasMedia
    # on all holon:Holon instances. Load hga-pass-f-media.databook.md
    # to enable media attachment on holons.
```

### 2. Add a §X.Y cross-reference note to the prose section on holon:Holon

Insert the following note at the end of the `holon:Holon` documentation prose:

> **Cross-Reference (Pass F):** The `hmedia:` vocabulary (Pass F) extends all
> `holon:Holon` instances with two opt-in properties:
>
> - `hmedia:appearance` — a lang-tagged literal rendering hint describing the
>   holon's visual appearance for the AI Cartographer
> - `hmedia:hasMedia` — links the holon to an `hmedia:MediaAsset`
>
> Neither property is defined in Pass B shapes. They become available when
> `hga-pass-f-media.databook.md` is loaded. Pass B SHACL shapes remain
> unaffected — `hmedia:` properties on holons will raise `sh:Info` advisory
> notices from the Pass F shape if the property value is not a valid
> `hmedia:MediaAsset`, but will not produce Violations from Pass B shapes.

### 3. Update the file version header

Change `version: 0.1.0` to `version: 0.1.1` and add `updated: 2026-06-09`.

---

*Copyright 2026 Kurt Cagle / Semantical LLC.*
