---
id: http://w3id.org/holon/spec/table-of-contents
title: "Holon Graph Architecture — Table of Contents"
type: spec-toc
version: 1.1.1
created: 2026-06-05
updated: 2026-06-09
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
domain: http://w3id.org/holon/
description: >
  Table of contents and summary index for the Holon Graph Architecture
  specification. Lists all 15 DataBook artefacts with their GDrive IDs,
  conformance classes, and status. Version 1.1.0 adds Pass F media vocabulary
  and updates hmk: and hproj: entries to reflect 0.3.0 / 0.1.1 amendments.
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  timestamp: 2026-06-09T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

# Holon Graph Architecture — Specification Table of Contents

**Status:** Editor's Draft — W3C Holon Community Group (Acting Chair: Kurt Cagle)  
**Namespace:** `http://w3id.org/holon/`  
**Repository:** https://github.com/kurtcagle/holon-spec  
**DataBook CLI:** v1.4.4  
**Last updated:** 2026-06-09

---

### HGA Primer and Vocabulary Summary

This provides an introduction to the Holon Graph Architecture (HGA), walking the reader through an example showing a medical rounds
scenario as it illustrates various components of the HGA. This assumes knowledge of RDF, SHACL, and SPARQL, and is intended primarily
to showcase a typical use case for a holonic system. 

* [Holon Graph Architecture Primer](hga-primer.databook.md)
* [HGA Vocabulary Summary](hga-vocabulary-summary_databook.md)

---

## DataBook Inventory

All 15 normative DataBook artefacts are listed below in pass order. Files are
maintained in the `hga/` folder of the W3C Holon CG Google Drive workspace.

| # | File | Pass | Version | Conformance | Status |
|---|---|---|---|---|---|
| 0a | [hga-pass0-manifest](#pass-0-manifest) | Pass 0 | 0.1.1 | All | ✓ Active |
| 0b | [hga-pass0-namespace-registry](#pass-0-namespace-registry) | Pass 0 | 0.1.1 | Core | ✓ Active |
| A1 | [hga-pass-a-ontology-header](#pass-a-ontology-header) | Pass A | 0.1.1 | Core | ✓ Active |
| A2 | [hga-pass-a-skos-taxonomies](#pass-a-skos-taxonomies) | Pass A | 0.1.0 | Core | ✓ Active |
| B1 | [hga-pass-b-core-structure](#pass-b-core-structure) | Pass B | 0.1.1¹ | Core | ✓ Active |
| B2 | [hga-pass-b-portals](#pass-b-portals) | Pass B | 0.1.0 | Extended | ✓ Active |
| C1 | [hga-pass-c-events](#pass-c-events) | Pass C | 0.1.1¹ | Core | ✓ Active |
| C2 | [hga-pass-c-provenance](#pass-c-provenance) | Pass C | 0.1.0 | Core | ✓ Active |
| D1 | [hga-pass-d-bayesian](#pass-d-bayesian) | Pass D | 0.1.0 | Bayesian | ⚠ At Risk |
| D2 | [hga-pass-d-policy](#pass-d-policy) | Pass D | 0.1.0 | Extended | ✓ Active |
| D3 | [hga-pass-d-vc](#pass-d-vc) | Pass D | 0.1.0 | Extended | ✓ Active |
| E1 | [hga-pass-e-markov-blanket](#pass-e-markov-blanket) | Pass E | 0.3.0 | Markov | ✓ Active |
| E2 | [hga-pass-e-projection](#pass-e-projection) | Pass E | 0.1.1 | Projection | ✓ Active |
| F1 | [hga-pass-f-media](#pass-f-media) | Pass F | 0.1.0 | Media | 🔵 New |
| T | [hga-table-of-contents](#table-of-contents) | — | 1.1.0 | — | ✓ Active |

¹ Minor amendment pending — applies cross-reference note only; SHACL shapes unchanged.

---

## Conformance Class Hierarchy

| Class | sh:order | Extends | Defined In |
|---|---|---|---|
| `hspec:HGACore` | 1 | — | Pass 0 Manifest |
| `hspec:HGAExtended` | 2 | HGACore | Pass 0 Manifest |
| `hspec:HGABayesian` | 3 | HGAExtended | Pass 0 Manifest |
| `hspec:HGAMarkov` | 4 | HGABayesian | Pass 0 Manifest |
| `hspec:HGAProjection` | 5 | HGAExtended | Pass 0 Manifest |
| `hspec:HGAMedia` | 6 | HGAMarkov | Pass 0 Manifest |

---

## Namespace Registry

| Prefix | Namespace IRI | Conformance | DataBook |
|---|---|---|---|
| `holon:` | `http://w3id.org/holon/` | Core | Pass B §1 |
| `hev:` | `http://w3id.org/holon/event/` | Core | Pass C §1 |
| `hprov:` | `http://w3id.org/holon/provenance/` | Core | Pass C §2 |
| `hdb:` | `http://w3id.org/holon/databook/` | Core | (DataBook spec) |
| `hspec:` | `http://w3id.org/holon/spec/` | All | Pass 0 §1 |
| `hpol:` | `http://w3id.org/holon/policy/` | Extended | Pass D §2 |
| `hvc:` | `http://w3id.org/holon/vc/` | Extended | Pass D §3 |
| `hbayes:` | `http://w3id.org/holon/bayesian/` | Bayesian | Pass D §1 |
| `hmk:` | `http://w3id.org/holon/markov/` | Markov | Pass E §1 |
| `hproj:` | `http://w3id.org/holon/projection/` | Projection | Pass E §2 |
| `hmedia:` | `http://w3id.org/holon/media/` | Media | Pass F |
| `hfed:` | `http://w3id.org/holon/federation/` | **Reserved** | — |

---

## DataBook Summaries

### [Pass 0: Manifest](hga-pass0-manifest.databook.md)

**File:** `hga-pass0-manifest.databook.md` · **Version:** 0.1.1  
**Conformance:** All ·

Top-level specification manifest. Governance statement, licence declarations
(W3C Document License prose; CC0-1.0 ontology), forward dependency register
(6 working drafts with risk assessments), 6 conformance class definitions
(Core through Media), federation scope statement, section registry (13 normative
DataBooks + annexes).

**Amendment 0.1.1:** Added `hspec:HGAMarkov`, `hspec:HGAProjection`, and
`hspec:HGAMedia` conformance class declarations; added section registry entries
for Pass E §1, Pass E §2, and Pass F.

---

### [Pass 0: Namespace Registry](hga-pass0-namespace-registry.databook.md)

**File:** `hga-pass0-namespace-registry.databook.md` · **Version:** 0.1.1  
**Conformance:** Core ·

Canonical namespace and prefix registry. Namespace design principles, 11 active
`hspec:PrefixRegistryEntry` instances, summary table, external vocabulary
assignments (10 W3C vocabularies), `.htaccess` content negotiation rules,
`README.md` for w3id.org PR, migration bridge from legacy `ontologist.io`
namespace, JSON-LD 1.1 context stub.

**Amendment 0.1.1:** Added `hspec:ns-hmk` (Markov), `hspec:ns-hproj`
(Projection), and `hspec:ns-hmedia` (Media) PrefixRegistryEntry instances;
updated summary table to 11 active namespaces; updated JSON-LD context stub and
w3id.org README sub-namespaces table.

---

### [Pass A §1: Ontology Header](hga-pass-a-ontology-header.databook.md)

**File:** `hga-pass-a-ontology-header.databook.md` · **Version:** 0.1.1  
**Conformance:** Core ·

Normative ontology header for all HGA sub-namespaces. Inferencing policy (SHACL
normative, OWL 2 RL non-normative, self-sufficient shapes, OWL 2 RL profile),
`owl:Ontology` declarations for all 11 active namespaces in TriG named graphs,
namespace import graph (4-level DAG). GGSC namespace reconciliation annex.

**Amendment 0.1.1:** Added `hmk:`, `hproj:`, and `hmedia:` `owl:Ontology`
declarations with full `owl:imports`, descriptions, and `sh:agentInstruction`.
Updated import graph to show 4-level DAG (`hmedia:` is deepest node, importing
both `hmk:` and `hproj:`).

---

### [Pass A §2: SKOS Taxonomies](hga-pass-a-skos-taxonomies.databook.md)

**File:** `hga-pass-a-skos-taxonomies.databook.md` · **Version:** 0.1.0  
**Conformance:** Core ·

Four normative SKOS concept schemes for the HGA vocabulary: `holon:LifecycleStatusScheme`
(Candidate/Registered/Deprecated), `holon:ValidationSeverityScheme`
(Violation/Warning/Info), `holon:ConcernLevelScheme` (Low/Medium/High/Critical),
`holon:MatchTypeScheme` (Exact/Fuzzy/No). SHACL shapes validate `skos:ConceptScheme`
and `skos:Concept` integrity. **Not amended** — `hmedia:` defines its own SKOS
schemes internally in Pass F.

---

### [Pass B §1: Core Structure](hga-pass-b-core-structure.databook.md)

**File:** `hga-pass-b-core-structure.databook.md` · **Version:** 0.1.1¹  
**Conformance:** Core ·

Core holonic structure vocabulary and SHACL shapes. Seven holon classes
(Holon, HomeHolon, IndexHolon, AgentHolon, PlaceHolon, OrganisationHolon,
DataHolon), BoundaryLayer, GroundingRecord. Containment, membership, and
registration properties. Reifier IRI labelling invariant.

**Amendment 0.1.1¹:** Cross-reference note — `hmedia:appearance` and
`hmedia:hasMedia` (Pass F) are available as opt-in properties on all
`holon:Holon` instances. SHACL shapes unchanged.

---

### [Pass B §2: Portals](hga-pass-b-portals.databook.md)

**File:** `hga-pass-b-portals.databook.md` · **Version:** 0.1.0  
**Conformance:** Extended ·

Portal and PortalLock vocabulary and SHACL shapes. Bidirectional portal model,
portal lock conditions, traversal guards, portal activation. **Not amended** —
no media properties on portals in Pass F.

---

### [Pass C §1: Events](hga-pass-c-events.databook.md)

**File:** `hga-pass-c-events.databook.md` · **Version:** 0.1.1¹  
**Conformance:** Core ·

Event envelope vocabulary and SHACL shapes (closed). ObservationEvent,
AssertionEvent, CommandEvent, CommandRejected, ViolationEvent, OutOfBounds,
ExpansionRequest, UnresolvableTarget, RemoteEventEnvelope. Temporal properties,
`targetHolon` routing, RDF 1.2 reification annotation patterns.

**Amendment 0.1.1¹:** Cross-reference note — `hmedia:hasScene` (repeatable,
Pass F) is available on all `hev:Event` instances. Each SceneDescriptor
composites actor, location, narrative, and camera reference for the event.
SHACL shapes unchanged.

---

### [Pass C §2: Provenance](hga-pass-c-provenance.databook.md)

**File:** `hga-pass-c-provenance.databook.md` · **Version:** 0.1.0  
**Conformance:** Core ·

PROV-O shape extensions for HGA event envelopes. IngestionActivity, transformer
attribution, DataBook processing stamp. Envelope-level provenance only; payload
provenance uses `prov:` directly. **Not amended** — provenance records the *act*
of generating media but has no direct structural changes required.

---

### [Pass D §1: Bayesian](hga-pass-d-bayesian.databook.md)

**File:** `hga-pass-d-bayesian.databook.md` · **Version:** 0.1.0  
**Conformance:** Bayesian (⚠ At Risk) ·

Bayesian and Active Inference vocabulary following Friston's Free Energy
Principle. BeliefState (prior/posterior/precision), FreeEnergy
(complexity/accuracy), PolicySelection (expectedFreeEnergy). SPARQL-based
precision invariant constraints. At-risk pending conformance class stabilisation.
**Not amended** — no media dependency.

---

### [Pass D §2: Policy](hga-pass-d-policy.databook.md)

**File:** `hga-pass-d-policy.databook.md` · **Version:** 0.1.0  
**Conformance:** Extended ·

ODRL 2.2 policy bindings for holons and portals. PortalPolicy, BoundaryPolicy,
AccessPermission, TraversalConstraint. Policy may eventually govern media asset
access but no structural changes required in Pass F. **Not amended.**

---

### [Pass D §3: Verifiable Credentials](hga-pass-d-vc.databook.md)

**File:** `hga-pass-d-vc.databook.md` · **Version:** 0.1.0  
**Conformance:** Extended ·

VC Data Model 2.0 credential wrapper shapes. `vc:VerifiableCredential`,
`vc:VerifiablePresentation`, issuer, validFrom, validUntil, proof. credentialSubject
shape is open (sh:closed false). **Not amended** — no media dependency.

---

### [Pass E §1: Markov Blanket](hga-pass-e-markov-blanket_databook.md)

**File:** `hga-pass-e-markov-blanket_databook.md` · **Version:** 0.3.0  
**Conformance:** Markov ·

Markov blanket four-surface agent state partition. MarkovBlanket,
InternalState, ExternalState, SensoryState, ActiveState. Utterance as
first-class communicative act. PropagationSignal with Distress/Resolution
polarity. ParticipationRecord, CoregulationRecord. Bridge properties to `hproj:`
and `hmedia:`.

**Amendment 0.3.0:** Added §1.11 "Sensor-Only Blankets and Camera Agents" design
principle; added `hmedia:sensorOnly` property; amended `hmk:MarkovBlanketShape`
to relax ActiveState and AgentHolon-shield constraints to SPARQL-guarded
sh:Warning when `hmedia:sensorOnly true`; added F9 SPARQL fallback for
sensor-only blanket detection.

---

### [Pass E §2: Projection](hga-pass-e-projection.databook.md)

**File:** `hga-pass-e-projection.databook.md` · **Version:** 0.1.1  
**Conformance:** Projection ·

Projection envelope vocabulary. NowGraph (stage 8), DepictionProjection (stage 9),
OutputProduct, ProjectionActivity, CartographerActivity, PromptBlock. Five SKOS
schemes: ProjectionType, PersistencePolicy, RenderingMode (4 modes),
ContentFormat (13 formats), TransmissionMode. Read-only invariant shape.

**Amendment 0.1.1:** Added §1.7 "Camera Agents and Rendering Hints" design note
with RenderingModeScheme → CameraAgent preset mapping table; added
`hmedia:cameraRef` property declaration in §3 (cross-namespace bridge reference);
added `hmedia:cameraRef` to `sh:ignoredProperties` in both NowGraphShape and
DepictionProjectionShape; added optional `sh:property` constraints (sh:Info
severity) for `hmedia:cameraRef` in both shapes; added
`hproj:ProjectionBridgeReceptionShape` (advisory); updated prefixes to include
`hmedia:`.

---

### [Pass F: Media](hga-pass-f-media.databook.md)

**File:** `hga-pass-f-media.databook.md` · **Version:** 0.1.0  
**Conformance:** Media ·

Media asset and visual representation vocabulary. New conformance class
`hspec:HGAMedia` extends `hspec:HGAMarkov`.

**Vocabulary:**

| Term | Type | Description |
|---|---|---|
| `hmedia:MediaContext` | Class | Project-level asset root with `hmedia:mediaBase` URI |
| `hmedia:MediaAsset` | Class | Addressable asset (IRI, MIME, keywords, role, altText) |
| `hmedia:appearance` | Property | Lang-tagged rendering hint on any entity or event |
| `hmedia:hasMedia` | Property | Links any holon or event to `hmedia:MediaAsset` |
| `hmedia:SceneDescriptor` | Class | Repeatable event scene composite |
| `hmedia:hasScene` | Property | Repeatable: on `hev:Event` → `hmedia:SceneDescriptor` |
| `hmedia:CameraAgent` | Class | Extends `hmk:SensoryState`; passive sensor |
| `hmedia:sensorOnly` | Property | Boolean on `hmk:MarkovBlanket` for camera-only blankets |
| `hmedia:cameraRef` | Property | Links NowGraph / DepictionProjection to CameraAgent |

**SKOS schemes:** MediaRoleScheme (9 roles), SensorTypeScheme (5 types),
ShotTypeScheme (8 shot types), PerspectiveScheme (4 perspectives),
DepthOfFieldScheme (3 values).

**Non-normative:** SPARQL CONSTRUCT for scene narrative assembly from component
`hmedia:appearance` literals.

---

### [Table of Contents](hga-table-of-contents.databook.md)

**File:** `hga-table-of-contents.databook.md` · **Version:** 1.1.0  
**Conformance:** — ·

This document. **Version 1.1.0:** Added Pass F row; added `hmedia:` to namespace
table; added `hspec:HGAMedia` to conformance class table; updated amendment notes
for E.1, E.2, B.1, C.1.

---

## Amendment Log

| DataBook | Version | Date | What changed |
|---|---|---|---|
| `hga-pass-e-markov-blanket` | 0.1.0 → 0.2.0 | 2026-06-06 | Initial build |
| `hga-pass-e-markov-blanket` | 0.2.0 → 0.3.0 | 2026-06-09 | Sensor-only pattern; sensorOnly; F9 fallback |
| `hga-pass-e-projection` | 0.1.0 → 0.1.1 | 2026-06-09 | §1.7 camera note; hmedia:cameraRef bridge |
| `hga-pass0-namespace-registry` | 0.1.0 → 0.1.1 | 2026-06-09 | hmk, hproj, hmedia entries |
| `hga-pass0-manifest` | 0.1.0 → 0.1.1 | 2026-06-09 | HGAMarkov, HGAProjection, HGAMedia; Pass E/F sections |
| `hga-pass-a-ontology-header` | 0.1.0 → 0.1.1 | 2026-06-09 | hmk, hproj, hmedia owl:Ontology declarations |
| `hga-pass-b-core-structure` | 0.1.0 → 0.1.1¹ | 2026-06-09 | Cross-reference note only |
| `hga-pass-c-events` | 0.1.0 → 0.1.1¹ | 2026-06-09 | Cross-reference note only |
| `hga-pass-f-media` | (new) 0.1.0 | 2026-06-09 | Initial build |
| `hga-table-of-contents` | 1.0.0 → 1.1.0 | 2026-06-09 | Pass F additions throughout |

¹ Amendment note produced — apply manually to existing file.

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
