---
id: http://w3id.org/holon/spec/table-of-contents
title: "HGA Specification — Table of Contents"
type: databook
version: 1.0.1
created: 2026-06-07
author:
  - name: Kurt Cagle
    iri: https://holongraph.com/people/kurt-cagle
    role: editor
    org: Semantical LLC
  - name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: transformer
license:
  prose: "W3C Document License"
  ontology: "CC0-1.0"
description: >
  Master table of contents for the Holon Graph Architecture (HGA)
  specification DataBooks. Lists all DataBook files in canonical pass
  order with IRIs, GDrive links, conformance classes, namespaces,
  and one-line descriptions. Intended as the navigational entry point
  for the W3C Holon Community Group (HGCG) editors and reviewers.
spec:
  document-iri: http://w3id.org/holon/spec/
  status: "Editor's Draft"
  cg: https://www.w3.org/community/holon/
  acting-chair: Kurt Cagle
  path: hga/hga-table-of-contents.databook.md
---

---

## Holon Graph Architecture — Specification DataBooks

**Status:** Editor's Draft · W3C Holon Community Group  
**Base IRI:** `http://w3id.org/holon/spec/`  
**Repository:** [GDrive/hga/](https://drive.google.com/drive/folders/1Uipto3dReB26JwJ3nrYt2-yc_5iaB_TP)

Each DataBook is a self-describing Markdown file containing normative
OWL 2 vocabulary, SHACL 1.2 shapes, SPARQL fallbacks, and prose
specification. DataBooks are processed in pass order; later passes
depend on earlier ones.

---

## Pass 0 — Foundation

| # | File | IRI | Conformance class | Link |
|---|---|---|---|---|
| 0.1 | `hga-pass0-manifest.databook.md` | `http://w3id.org/holon/spec/manifest` | core | [↗](https://drive.google.com/file/d/1rHxOZfFksq_RTAt8j2p7kv6UcK9JLfiT/view) |
| 0.2 | `hga-pass0-namespace-registry.databook.md` | `http://w3id.org/holon/spec/namespace-registry` | core | [↗](https://drive.google.com/file/d/1VibLQzVMgi9Iyuw3HEzzBu5BgNurXeuE/view) |

### [0.1 — Manifest](hga-pass0-namespace-registry.databook.md)
**Path:** `hga/hga-pass0-manifest.databook.md`  
**Namespace:** `hspec:` = `http://w3id.org/holon/spec/`

Enumerates all DataBook files in the HGA specification, their document
IRIs, conformance classes, and inter-DataBook dependency relationships.
The canonical entry point for automated processors and specification
navigation. Declares the `hspec:` vocabulary for conformance classes,
at-risk markers, and DataBook metadata.

### [0.2 — Namespace Registry](hga-pass0-namespace-registry.databook.md)
**Path:** `hga/hga-pass0-namespace-registry.databook.md`  
**Namespace:** `hspec:` = `http://w3id.org/holon/spec/`

Declares all nine HGA sub-namespaces (`holon:`, `hev:`, `hprov:`,
`hbayes:`, `hpol:`, `hvc:`, `hmk:`, `hproj:`, `hspec:`) with their
canonical base URIs, preferred prefixes, stability levels, and
namespace-level `owl:Ontology` declarations. All namespace IRIs resolve
to `http://w3id.org/holon/{sub}/`.

---

## Pass A — Vocabulary Infrastructure

| # | File | IRI | Conformance class | Link |
|---|---|---|---|---|
| A.1 | `hga-pass-a-ontology-header.databook.md` | `http://w3id.org/holon/spec/ontology-header` | core | [↗](https://drive.google.com/file/d/1wC7Xang1CZ-hKbJiiey8qTmgfVbNBKtg/view) |
| A.2 | `hga-pass-a-skos-taxonomies.databook.md` | `http://w3id.org/holon/spec/skos-taxonomies` | core | [↗](https://drive.google.com/file/d/1SZyZ16zr9Ie8xPnD0PtgnaUX-WOQFuIa/view) |

### [A.1 — Ontology Header](https://drive.google.com/file/d/1wC7Xang1CZ-hKbJiiey8qTmgfVbNBKtg/view)
**Path:** `hga/hga-pass-a-ontology-header.databook.md`  
**Namespace:** `holon:` = `http://w3id.org/holon/`

Declares all HGA sub-namespace `owl:Ontology` resources with
versioning, `owl:imports` chains, and inter-namespace dependency graph.
Establishes the normative inferencing policy: SHACL 1.2 shapes are
primary; OWL 2 RL axioms are non-normative annotations. Shapes are
self-sufficient without OWL reasoning. Every SHACL rule carries a
companion SPARQL UPDATE fallback.

### [A.2 — SKOS Taxonomies](https://drive.google.com/file/d/1SZyZ16zr9Ie8xPnD0PtgnaUX-WOQFuIa/view)
**Path:** `hga/hga-pass-a-skos-taxonomies.databook.md`  
**Namespace:** `holon:` = `http://w3id.org/holon/`

Declares all controlled vocabulary `skos:ConceptScheme` instances used
across the HGA: `RegistrationStatusScheme`, `ConfidenceLevelScheme`,
`BoundaryLayerScheme`, and supporting concept individuals. All concept
IRIs live in the `holon:` namespace. Provides the SKOS backbone that
later passes reference via `skos:inScheme`.

---

## Pass B — Core Structure

| # | File | IRI | Conformance class | Link |
|---|---|---|---|---|
| B.1 | `hga-pass-b-core-structure.databook.md` | `http://w3id.org/holon/spec/core-structure` | core | [↗](https://drive.google.com/file/d/1ur0Tn10Z32fsKE0-WxQGeKlH1Rw17bM6/view) |
| B.2 | `hga-pass-b-portals.databook.md` | `http://w3id.org/holon/spec/portals` | core | [↗](https://drive.google.com/file/d/1X9cEr8vxOTXpAwhIrtbpqTaB7fr9cBPw/view) |

### [B.1 — Core Structure](https://drive.google.com/file/d/1ur0Tn10Z32fsKE0-WxQGeKlH1Rw17bM6/view)
**Path:** `hga/hga-pass-b-core-structure.databook.md`  
**Namespace:** `holon:` = `http://w3id.org/holon/`

Defines the primary structural vocabulary: `holon:Holon`,
`holon:AgentHolon`, `holon:DataHolon`, `holon:Boundary`,
`holon:BoundaryLayer`, `holon:Registration`, `holon:registrationStatus`,
and the `holon:blanket` / `holon:participationRecord` extensions for
agent participation (added by Pass E §1 amendment). The structural
foundation of the holarchy — every other pass depends on this one.

### [B.2 — Portals](https://drive.google.com/file/d/1X9cEr8vxOTXpAwhIrtbpqTaB7fr9cBPw/view)
**Path:** `hga/hga-pass-b-portals.databook.md`  
**Namespace:** `holon:` = `http://w3id.org/holon/`

Defines `holon:Portal`, `holon:PortalLock`, `holon:portalStatus`,
`holon:portalTarget`, `holon:traversalCondition`, and the portal
traversal vocabulary. Portals are typed, directional edges between
holons with access policy binding points and optional lock conditions
(satisfied by `hpol:` Policy statements). Includes `PortalShape` SHACL
validation and SPARQL traversal queries.

---

## Pass C — Events and Provenance

| # | File | IRI | Conformance class | Link |
|---|---|---|---|---|
| C.1 | `hga-pass-c-events.databook.md` | `http://w3id.org/holon/spec/events` | core | [↗](https://drive.google.com/file/d/11tPZVdQZ_MG_B2fjnU8IWjMJEw3HhFmG/view) |
| C.2 | `hga-pass-c-provenance.databook.md` | `http://w3id.org/holon/spec/provenance` | core | [↗](https://drive.google.com/file/d/1SLRh-6qQhghEKr-oglSPDxCHCdgTfekz/view) |

### [C.1 — Events](https://drive.google.com/file/d/11tPZVdQZ_MG_B2fjnU8IWjMJEw3HhFmG/view)
**Path:** `hga/hga-pass-c-events.databook.md`  
**Namespace:** `hev:` = `http://w3id.org/holon/event/`

Defines the `hev:` event vocabulary: `ObservationEvent`,
`AssertionEvent`, `CommandEvent`, and the RDF 1.2 annotated triple
mechanism for recording state changes. Establishes the principle that
the event graph records only state changes — missed actions leave no
triple. Largest DataBook in the spec (53 KB); covers event typing,
annotation syntax, SHACL shapes, and full SPARQL query suite.

### [C.2 — Provenance](https://drive.google.com/file/d/1SLRh-6qQhghEKr-oglSPDxCHCdgTfekz/view)
**Path:** `hga/hga-pass-c-provenance.databook.md`  
**Namespace:** `hprov:` = `http://w3id.org/holon/provenance/`

Defines the `hprov:` vocabulary for DataBook ingestion activities,
transformer attribution, processing timestamps, and agent identity.
Implements W3C PROV-O patterns (`prov:Activity`, `prov:wasGeneratedBy`,
`prov:wasAssociatedWith`) within the HGA DataBook processing context.
All event nodes in the specification carry `prov:wasGeneratedBy` links
to `hprov:IngestionActivity` instances.

---

## Pass D — Cognition and Policy

| # | File | IRI | Conformance class | Link |
|---|---|---|---|---|
| D.1 | `hga-pass-d-bayesian.databook.md` | `http://w3id.org/holon/spec/bayesian` | bayesian | [↗](https://drive.google.com/file/d/1sbB_y08j4KcYTO7OztJ8PMENsx-ooPXV/view) |
| D.2 | `hga-pass-d-policy.databook.md` | `http://w3id.org/holon/spec/policy` | extended | [↗](https://drive.google.com/file/d/1alEr3V-Ou9tSFdeHDkMNBxb4rPFb4Vot/view) |
| D.3 | `hga-pass-d-vc.databook.md` | `http://w3id.org/holon/spec/verifiable-credentials` | extended | [↗](https://drive.google.com/file/d/1oqoOFkmsbNlQ04Qwr6jvzouUJ-kXLSqf/view) |

### [D.1 — Bayesian / Active Inference](https://drive.google.com/file/d/1sbB_y08j4KcYTO7OztJ8PMENsx-ooPXV/view)
**Path:** `hga/hga-pass-d-bayesian.databook.md`  
**Namespace:** `hbayes:` = `http://w3id.org/holon/bayesian/`

Defines `hbayes:BeliefState`, `hbayes:FreeEnergy`, `hbayes:PolicySelection`,
`hbayes:prior`, `hbayes:posterior`, `hbayes:precision`, and
`hbayes:freeEnergy`. Provides the formal structures for active inference
within holonic agents — the mathematical layer grounding `hmk:`
Markov blanket dynamics. Conformance class `hspec:HGABayesian` is a
prerequisite for Pass E.

### [D.2 — Policy (ODRL)](https://drive.google.com/file/d/1alEr3V-Ou9tSFdeHDkMNBxb4rPFb4Vot/view)
**Path:** `hga/hga-pass-d-policy.databook.md`  
**Namespace:** `hpol:` = `http://w3id.org/holon/policy/`

Defines `hpol:` ODRL-based boundary access control vocabulary:
`HolonPolicy`, `PermissionGrant`, `DutyObligation`, `ProhibitionRule`.
Integrates with `holon:PortalLock` and `holon:Boundary` to provide
formal access control semantics for holon traversal. At-risk pending
ODRL 3.0 stabilisation.

### [D.3 — Verifiable Credentials](https://drive.google.com/file/d/1oqoOFkmsbNlQ04Qwr6jvzouUJ-kXLSqf/view)
**Path:** `hga/hga-pass-d-vc.databook.md`  
**Namespace:** `hvc:` = `http://w3id.org/holon/vc/`

Defines `hvc:HolonCredential` and supporting stub vocabulary for W3C
Verifiable Credentials integration. Provides identity attestation
scaffolding for holonic agents and DataBook authorship claims. Currently
a stub — full implementation pending W3C VC 2.0 stabilisation.

---

## Pass E — Agent Surfaces and Projection

| # | File | IRI | Version | Conformance class | Link |
|---|---|---|---|---|---|
| E.1 | `hga-pass-e-markov-blanket_databook.md` | `http://w3id.org/holon/spec/markov-blanket` | 0.2.0 | markov | [↗](https://drive.google.com/file/d/1OKHFShLSU7xICquo9UwfyuKqHO7K11me/view) |
| E.2 | `hga-pass-e-projection.databook.md` | `http://w3id.org/holon/spec/projection` | 0.1.0 | projection | [↗](https://drive.google.com/file/d/1Ka9zAvV3eqPdefISlHekK9HRZUjPj013/view) |

### [E.1 — Markov Blanket (v0.2.0)](https://drive.google.com/file/d/1OKHFShLSU7xICquo9UwfyuKqHO7K11me/view)
**Path:** `hga/hga-pass-e-markov-blanket_databook.md`  
**Namespace:** `hmk:` = `http://w3id.org/holon/markov/`

Defines the four-surface agent state partition: `hmk:MarkovBlanket`,
`hmk:InternalState`, `hmk:ExternalState`, `hmk:SensoryState`,
`hmk:ActiveState`. Introduces `hmk:Utterance` as a first-class
communicative act distinct from `hproj:Projection`, with
`hmk:UtteranceIntent` individuals (Request, Declaration, Question,
Testimony, Acknowledgement, Narrative). Adds `hmk:PropagationSignal`
polarity via `hmk:DistressPropagation` / `hmk:ResolutionPropagation`
subclasses and `hmk:signalPolarity`. Defines `hmk:ParticipationRecord`,
`hmk:CoregulationRecord`, and bridge properties
(`hmk:generatedFromActiveState`, `hmk:addressedToSensoryState`) wiring
`hproj:Projection` and `hmk:Utterance` into the blanket surface
architecture. Updated 2026-06-07.

### [E.2 — Projection (v0.1.0)](https://drive.google.com/file/d/1Ka9zAvV3eqPdefISlHekK9HRZUjPj013/view)
**Path:** `hga/hga-pass-e-projection.databook.md`  
**Namespace:** `hproj:` = `http://w3id.org/holon/projection/`

Defines the `hproj:` projection artefact vocabulary: `Projection`
(abstract), `NowGraph` (crystallised prior, Stage 8), `PredictiveProjection`
(open holon forward model), `DepictionProjection` (Stage 9 prose
rendering), `OutputProduct`, `ProjectionActivity`, `CartographerActivity`,
`PromptBlock`. Five SKOS schemes: ProjectionTypeScheme (7 concepts),
PersistencePolicyScheme, RenderingModeScheme (Cinematic / Immersive /
ActiveInference / ExplodedView), ContentFormatScheme (13 formats),
TransmissionModeScheme. Reception bridge via `hproj:ProjectionBridgeReceptionShape`.

---

## Conformance Classes

| Class IRI | Required passes | Description |
|---|---|---|
| `hspec:HGACore` | 0, A, B | Structural holarchy only |
| `hspec:HGAExtended` | 0, A, B, C, D | Events, provenance, policy |
| `hspec:HGABayesian` | 0–D incl. D.1 | Active inference layer |
| `hspec:HGAMarkov` | 0–D + E.1 | Markov blanket surfaces |
| `hspec:HGAProjection` | 0–D + E.2 | Projection artefacts |

---

## Namespace Summary

| Prefix | Base URI | Defined in |
|---|---|---|
| `holon:` | `http://w3id.org/holon/` | B.1, B.2 |
| `hev:` | `http://w3id.org/holon/event/` | C.1 |
| `hprov:` | `http://w3id.org/holon/provenance/` | C.2 |
| `hbayes:` | `http://w3id.org/holon/bayesian/` | D.1 |
| `hpol:` | `http://w3id.org/holon/policy/` | D.2 |
| `hvc:` | `http://w3id.org/holon/vc/` | D.3 |
| `hmk:` | `http://w3id.org/holon/markov/` | E.1 |
| `hproj:` | `http://w3id.org/holon/projection/` | E.2 |
| `hspec:` | `http://w3id.org/holon/spec/` | 0.1, 0.2, A.1 |

---

*Kurt Cagle (Acting Chair, W3C Holon CG) · kurt.cagle@gmail.com*  
*Chloe Shannon · chloe@holongraph.com*  
*Copyright 2026 Kurt Cagle / Semantical LLC · CC0-1.0 (ontology)*
