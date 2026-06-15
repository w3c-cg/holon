---
id: http://w3id.org/holon/spec/vocabulary-summary
title: "HGA Vocabulary Summary — Classes, Properties, Shapes and Controlled Vocabularies"
type: spec-section
version: 0.2.0
created: 2026-06-04
updated: 2026-06-14
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
domain: http://w3id.org/holon/
subject:
  - holon graph architecture
  - vocabulary reference
  - class inventory
  - property inventory
  - SHACL shapes
  - SKOS
  - projection
  - markov blanket
  - media
  - camera agent
description: >
  Human-readable reference summary for the complete Holon Graph Architecture
  vocabulary. Covers all classes, properties, SHACL shapes, and controlled
  vocabulary concepts across all HGA namespaces (holon:, hev:, hprov:,
  hbayes:, hpol:, hvc:, hproj:). Presented as lists and tables without Turtle
  code. Organised by conformance class: Core, Extended, Bayesian (at-risk),
  and Projection.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Reference"
  status: "Editor's Draft"
  normative: false
  conformance-class:
    - core
    - extended
    - bayesian
    - projection
    - markov
    - media
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: false
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-09T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

## How to Use This Document

This summary provides a navigator's view of the HGA vocabulary. It does not
replace the normative DataBooks (Passes 0–E); it complements them by
presenting every class, property, and shape in one place without Turtle code.

**Conformance classes:** Every item is tagged Core, Extended, Bayesian, Projection,
Markov, or Media. A conformant Core implementation ignores all others. Projection
extends Extended. Markov extends Bayesian. Media extends Markov. Both Bayesian
and Markov conformance classes are at-risk ⚠.

**Property table columns:**

- **Prop** — local name (prefixed)
- **Kind** — O = ObjectProperty, D = DatatypeProperty
- **Range** — expected value type or class
- **Card.** — cardinality: `1` = exactly one, `0..1` = optional, `0..*` = any number, `1..*` = one or more; conditional cardinalities are noted in parentheses
- **Req.** — RFC 2119 requirement level (MUST / SHOULD / MAY)

**Shape constraint columns:**

- **Shape** — shape IRI (local name)
- **Target** — what the shape validates (class, property subjects, etc.)
- **Closed?** — `✓` if `sh:closed true` (no unexpected properties on the envelope)
- **Key MUSTs** — the most important Violation-level constraints
- **Warnings** — notable advisory constraints

---

## 1. Namespace Register

| Prefix | Namespace IRI | Conformance | Content summary |
|---|---|---|---|
| `holon:` | `http://w3id.org/holon/` | Core | Holons, portals, grounding, concern annotation |
| `hev:` | `http://w3id.org/holon/event/` | Core | Event envelopes, event types, temporal metadata |
| `hprov:` | `http://w3id.org/holon/provenance/` | Core | PROV-O extensions, ingestion provenance |
| `hdb:` | `http://w3id.org/holon/databook/` | Core | DataBook format vocabulary |
| `hspec:` | `http://w3id.org/holon/spec/` | All | Specification infrastructure |
| `hpol:` | `http://w3id.org/holon/policy/` | Extended | ODRL policy bindings |
| `hvc:` | `http://w3id.org/holon/vc/` | Extended | Verifiable Credential wrapper shapes |
| `hproj:` | `http://w3id.org/holon/projection/` | Projection | Projection envelopes, NowGraph, depiction, cartographer, prompt blocks |
| `hbayes:` | `http://w3id.org/holon/bayesian/` | Bayesian ⚠ | Active inference vocabulary |
| `hmk:` | `http://w3id.org/holon/markov/` | Markov ⚠ | Markov blanket surfaces, Utterance, PropagationSignal, ParticipationRecord |
| `hmedia:` | `http://w3id.org/holon/media/` | Media | Assets, appearance, SceneDescriptor, CameraAgent, SKOS schemes |
| `hfed:` | `http://w3id.org/holon/federation/` | **Reserved** | Cross-server federation (v2) |

External vocabularies used normatively:

| Prefix | Namespace IRI | Source |
|---|---|---|
| `rdf:` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | W3C Rec |
| `rdfs:` | `http://www.w3.org/2000/01/rdf-schema#` | W3C Rec |
| `owl:` | `http://www.w3.org/2002/07/owl#` | W3C Rec (OWL 2 RL, non-normative) |
| `xsd:` | `http://www.w3.org/2001/XMLSchema#` | W3C Rec |
| `sh:` | `http://www.w3.org/ns/shacl#` | W3C Rec (1.1) + WD (1.2) |
| `prov:` | `http://www.w3.org/ns/prov#` | W3C Rec |
| `skos:` | `http://www.w3.org/2004/02/skos/core#` | W3C Rec |
| `odrl:` | `http://www.w3.org/ns/odrl/2/` | W3C Rec |
| `dcterms:` | `http://purl.org/dc/terms/` | DCMI (stable; used in W3C Recs) |
| `vc:` | `https://www.w3.org/ns/credentials/` | W3C Rec (VC DM 2.0) |

---

## 1.1 Upper Ontology Alignment

HGA defines five specialised Holon subtypes. Each is informatively aligned with
the PROV-O vocabulary (used normatively in HGA's provenance layer) and optionally
alignable to gUFO (Unified Foundational Ontology) for deployments that require
formal upper ontology grounding. The gUFO alignment is non-normative in HGA
itself; it becomes normative when a symbolic governance layer is applied over
an HGA deployment and requires a formal disjoint partition of the entity space.

| Holon subtype | PROV-O alignment | gUFO alignment | Role in HGA pipeline |
|---|---|---|---|
| `holon:AgentHolon` | `prov:Agent` | `gufo:Agent` | Participants that generate or receive events; hold beliefs via Markov blankets |
| `holon:OrganisationHolon` | `prov:Agent` (collective) | `gufo:Collective` | Collective entities; subclass of AgentHolon in HGA (see note) |
| `holon:PlaceHolon` | `prov:Entity` | `gufo:Site` / `gufo:SpatialRegion` | Physical or logical locations; boundary targets |
| `holon:DataHolon` | `prov:Entity` | `gufo:InformationObject` | Information-bearing artefacts; produced and consumed by the pipeline |
| `holon:ProcessHolon` | `prov:Activity` | `gufo:Process` | Ongoing workflows; pipeline runs and staged operations |

All alignments in this table are informative. Implementations that adopt gUFO
grounding MUST ensure class declarations chain to the specified gUFO upper
category; the HGA vocabulary specification does not enforce this directly.

> **Note on OrganisationHolon and AgentHolon:** In HGA, `holon:OrganisationHolon`
> is a subclass of `holon:AgentHolon` — reflecting that organisations participate
> in events and can generate or receive messages as collective actors. In
> gUFO-grounded deployments, however, `gufo:Agent` and `gufo:Collective` are
> disjoint upper categories. Implementations adopting gUFO grounding SHOULD
> treat the subclass relationship as a participation-capability inheritance
> (organisations *act* like agents at the event level) rather than an
> ontological identity claim, and SHOULD NOT infer that an
> `holon:OrganisationHolon` instance is also a `gufo:Agent` instance.

---

## 2. Class Inventory

### 2.1 Core Conformance Classes

#### `holon:Holon` — Abstract base class for all holonic entities
**Namespace:** holon: | **Conformance:** Core | **Superclass:** prov:Entity (non-normative)

A holon is simultaneously a whole entity and a part of a larger structure.
Every holon has a dereferenceable IRI, a lifecycle status, and a separation
between its infrastructure layer and its domain payload. Abstract — do not
instantiate directly; use a subtype.

**Subclasses:** HomeHolon, IndexHolon, AgentHolon, PlaceHolon, DataHolon, ProcessHolon

**Validated by:** holon:HolonShape

---

#### `holon:HomeHolon` — Root container holon for a server
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:Holon

The single root holon for a holon server. Bound to a specific server endpoint
IRI. Contains or references all other holons on that server. Every holon
server MUST have exactly one HomeHolon. Provides the vocabulary endpoint
for content-negotiated vocabulary dereferencing.

**Validated by:** holon:HomeHolonShape (extends HolonShape)

---

#### `holon:IndexHolon` — Discovery and registry holon
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:Holon

Handles registration lookup and capability advertisement. Returns a registry
DataBook on request, filtered by the requesting agent's access rights. A
HomeHolon is a specialised IndexHolon.

**Validated by:** holon:IndexHolonShape (extends HolonShape)

---

#### `holon:AgentHolon` — Agent-type holon (person, software agent, or system)
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:Holon

Represents a participant capable of generating or receiving events. Carries
agent identity and capability declarations in its payload graph. Aligned
informatively with prov:Agent.

**Subclass:** holon:OrganisationHolon

**Validated by:** holon:AgentHolonShape (extends HolonShape)

---

#### `holon:OrganisationHolon` — Collective agent holon
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:AgentHolon

Represents an organisation as a collective agent. May contain AgentHolons
and may issue or receive events on behalf of the organisation.

**Validated by:** holon:OrganisationHolonShape (extends AgentHolonShape)

---

#### `holon:PlaceHolon` — Spatial location holon
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:Holon

Represents a physical or logical place. Spatial geometry is payload content;
the infrastructure layer carries only place identity and status. GeoSPARQL
geometry bindings are a non-normative domain extension (see Annex C).

**Validated by:** holon:PlaceHolonShape (extends HolonShape)

---

#### `holon:DataHolon` — Structured data resource holon
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:Holon

Wraps a document, dataset, report, or knowledge artefact as a holon.
Navigated and consumed rather than acted upon. SHOULD declare a payloadGraph.
Informatively aligned with `prov:Entity` and `gufo:InformationObject`.

**Pipeline-internal DataHolons:** The HGA pipeline itself produces DataHolons
at multiple stages. `holon:GroundingRecord` instances (stage 2 entity grounding),
SHACL ValidationReport instances (stage 3), confidence gate outcome records
(stage 5), and `hproj:NowGraph` / `hproj:DepictionProjection` projections
registered as persistent are all DataHolons. `hproj:PromptBlock` is explicitly
typed as a `holon:DataHolon` subtype. This means the pipeline's own
infrastructure objects are first-class holons navigable via the same IRI and
portal mechanisms as domain content.

**Observed vs. derived DataHolons:** A DataHolon may be *observed* — produced
by ingesting an external artefact such as a document, database record, or sensor
output, via an `hprov:IngestionActivity` — or *derived* — computed from one or
more existing DataHolons via inference, a SPARQL CONSTRUCT, or a SHACL Rules
derivation step, via an `hprov:DerivationActivity`. Derived DataHolons SHOULD
carry `hprov:DerivationActivity` provenance recording both the source DataHolons
and the derivation rule applied. See Pass C §2 for the DerivationActivity
vocabulary and shapes.

**Subclasses:** hproj:PromptBlock, hproj:NowGraph (when persistent),
hproj:DepictionProjection (when persistent), hproj:OutputProduct

**Validated by:** holon:DataHolonShape (extends HolonShape)

---

#### `holon:ProcessHolon` — Workflow or pipeline holon
**Namespace:** holon: | **Conformance:** Core | **Superclass:** holon:Holon

Represents an ongoing process. State transitions are driven by events.
Process state and progress metadata are payload content.

**Validated by:** holon:ProcessHolonShape (extends HolonShape)

---

#### `holon:GroundingRecord` — Entity recognition result
**Namespace:** holon: | **Conformance:** Core | **Superclass:** (none)

Records a single entity grounding result from the Pass 1 entity recognition
stage. Carries the source string, the matched canonical IRI, a confidence
score, and the match type.

**Validated by:** holon:GroundingRecordShape

---

#### `holon:Portal` — Navigational link between holons
**Namespace:** holon: | **Conformance:** Extended | **Superclass:** prov:Entity (non-normative)

A first-class entity representing a directed navigational link from a source
holon to a target. Gated by zero or more PortalLocks. Ungated portals are
valid but generate a warning. A portal is a DOOR; a boundary is the WALL.

**Validated by:** holon:PortalShape

---

#### `holon:PortalLock` — Gating mechanism on a portal
**Namespace:** holon: | **Conformance:** Extended | **Superclass:** (none)

Carries an activation condition (SHACL data-state check) and/or a traversal
policy (ODRL access check). Both must pass independently for traversal to
proceed. A lock with no gate is invalid.

**Validated by:** holon:PortalLockShape

---

#### `holon:PortalTraversalRecord` — Immutable portal traversal audit record
**Namespace:** holon: | **Conformance:** Extended | **Superclass:** prov:Activity (non-normative)

Generated for every traversal attempt (whether successful or denied). Carries
portal IRI, agent, timestamp, and outcome. Denied records carry a reason.

**Validated by:** holon:PortalTraversalRecordShape

---

### 2.2 Event Classes (`hev:` namespace — Core unless noted)

#### `hev:HolonEvent` — Abstract base class for all events
All events have a targetHolon, assertedAt, receivedAt, and provenance link.
Abstract — validates via holon:HolonEventBaseShape (used as sh:node).

**Subclasses:** AssertionEvent, CommandEvent, ObservationEvent, CommandRejected, ViolationEvent, OutOfBounds, ExpansionRequest, UnresolvableTarget, PortalTraversalEvent, PortalTraversalDenied, RemoteEventEnvelope

---

#### `hev:AssertionEvent` — Declarative fact assertion
Asserts a fact is or was true. Payload is committed to the scene graph if
SHACL validation passes. Carries an assertionPayload link.
**Validated by:** hev:AssertionEventShape (closed envelope)

#### `hev:CommandEvent` — Imperative instruction
Instructs the target holon to act. Time-sensitive: carries expiresAt and
validAsOf. A valid, authorised, unexpired command generates an AssertionEvent.
**Validated by:** hev:CommandEventShape (closed envelope)

#### `hev:ObservationEvent` — Sensory or measurement input
Carries domain-specific observational data. Payload structure is governed
by the target holon's boundary shapes. SOSA mapping is a non-normative annex.
**Conformance:** Extended | **Validated by:** hev:ObservationEventShape (closed envelope)

#### `hev:CommandRejected` — Failed command (system-generated)
Generated when a command fails validation, authorisation, or expiry checks.
Carries causedBy link to the original command and a rejectionReason.
**Validated by:** hev:CommandRejectedShape

#### `hev:ViolationEvent` — SHACL validation failure (system-generated)
Generated when event payload produces sh:Violation results. Carries
violationReport link to the full SHACL report. Scene mutation is blocked.
**Validated by:** hev:ViolationEventShape

#### `hev:OutOfBounds` — Boundary scope exceeded (system-generated)
Generated when an operation targets resources outside a holon's declared
boundary.
**Validated by:** hev:OutOfBoundsShape

#### `hev:ExpansionRequest` — Territory edge reached (system-generated)
Signals that the holon graph needs extending to accommodate new context.
**Validated by:** hev:ExpansionRequestShape

#### `hev:UnresolvableTarget` — Routing failure (system-generated)
Generated when targetHolon cannot be resolved locally or forwarded remotely.
**Validated by:** hev:UnresolvableTargetShape

#### `hev:PortalTraversalEvent` — Successful portal crossing (system-generated)
**Conformance:** Extended | **Validated by:** hev:PortalTraversalEventShape

#### `hev:PortalTraversalDenied` — Blocked portal crossing (system-generated)
**Conformance:** Extended | **Validated by:** hev:PortalTraversalDeniedShape

#### `hev:RemoteEventEnvelope` — Cross-server forwarding wrapper
Wraps an event for delivery to a remote holon server via DataBook messaging.
Used in place of SPARQL SERVICE federation (v1 constraint).
**Validated by:** hev:RemoteEventEnvelopeShape

---

### 2.3 Provenance Classes (`hprov:` namespace — Core)

#### `hprov:IngestionActivity` — One pipeline run
**Superclass:** prov:Activity. Carries transformer type, transformer IRI,
pipeline stage, ingest vector, and confidence gate outcome.
**Validated by:** hprov:IngestionActivityShape

#### `hprov:TransformerAgent` — A transformer used in the pipeline
**Superclass:** prov:Agent. May be an LLM, XSLT stylesheet, SPARQL processor,
SHACL engine, or human reviewer.

#### `hprov:TransformerType` — Controlled vocabulary for transformer kinds
Enum class. Individuals: LLMTransformer, XSLTTransformer, SPARQLTransformer,
SHACLTransformer, HumanTransformer, CompositeTransformer.

---

#### `hprov:DerivationActivity` — A computed derivation run
**Superclass:** `prov:Activity` | **Conformance:** Core

Records the production of a derived DataHolon from one or more existing
DataHolons via an explicit derivation rule. Complements `hprov:IngestionActivity`
for the derived-artifact case; the two are disjoint sub-kinds of `prov:Activity`.

**Key distinction from IngestionActivity:** An `hprov:IngestionActivity` transforms
an *external signal* into HGA content. An `hprov:DerivationActivity` computes new
HGA content from *existing HGA content*. Use `DerivationActivity` when all sources
are holons already in the scene graph; use `IngestionActivity` when the source is
an external signal entering the pipeline at stage 1.

**Typical derivation sources:** A league-standing DataHolon computed from
match-result DataHolons via SPARQL CONSTRUCT; an insight assessment computed from
evidence DataHolons by a classification rule; an aggregated summary DataHolon
produced from multiple source DataHolons by a SHACL Rules step.

Key properties: `hprov:derivedFromHolon` (1..* source DataHolon IRIs, MUST);
`hprov:derivationRule` (IRI of the SPARQL CONSTRUCT, SHACL Rule, or derivation
function applied, SHOULD).

**Validated by:** hprov:DerivationActivityShape

---

### 2.4 Bayesian Classes (`hbayes:` namespace — Bayesian ⚠ at-risk)

#### `hbayes:BeliefState` — Variational distribution over hidden states
Attached to a domain assertion triple as a reification annotation. Records
prior, posterior, and precision. Used as sh:reifierShape on domain property
shapes in Bayesian deployments.
**Validated by:** hbayes:BeliefStateShape

#### `hbayes:FreeEnergy` — Information-theoretic cost of a belief update
Records complexity (KL divergence) and accuracy (expected log likelihood).
Links to the BeliefState it characterises.
**Validated by:** hbayes:FreeEnergyShape

#### `hbayes:PolicySelection` — Active inference policy choice record
Records which policy was selected based on minimum expected free energy,
the EFE value, and candidate policies considered.
**Validated by:** hbayes:PolicySelectionShape

---

### 2.5 Policy Classes (`hpol:` namespace — Extended)

#### `hpol:BoundaryPolicy` — ODRL policy for holon payload access
**Superclass:** odrl:Policy. Governs read and write access to a holon's
payload graph. Attached via hpol:holonPolicy. Default access is DenyAll.
**Validated by:** hpol:BoundaryPolicyShape

#### `hpol:PortalPolicy` — ODRL policy for portal traversal
**Superclass:** odrl:Policy. Governs traversal of a portal via the
hpol:traverse action. Attached via holon:traversalPolicy on a PortalLock.
**Validated by:** hpol:PortalPolicyShape

#### `hpol:DefaultAccessType` — Default access level enum
Individuals: hpol:AllowAll, hpol:DenyAll, hpol:ReadOnly.

---

### 2.6 Verifiable Credential Classes (`hvc:` namespace — Extended)

#### `hvc:HolonCredential` — VC whose subject is a holon
**Superclass:** vc:VerifiableCredential. Asserts authoritative claims about
a holon from a trusted issuer. credentialSubject MUST be a holon:Holon.
**Validated by:** hvc:HolonCredentialShape

#### `hvc:HolonPresentation` — VP submitted by an agent holon
**Superclass:** vc:VerifiablePresentation. Bundles HolonCredentials for
submission to a portal lock or boundary policy evaluator.
**Validated by:** hvc:HolonPresentationShape

---

### 2.7 Controlled Vocabulary Individuals

#### `holon:PortalTraversalOutcome` — Result of a traversal attempt
| IRI | Label | Meaning |
|---|---|---|
| `holon:TraversalPermitted` | Traversal Permitted | Both condition and policy passed |
| `holon:TraversalDeniedCondition` | Denied — Condition Failed | Activation condition not satisfied |
| `holon:TraversalDeniedPolicy` | Denied — Policy Denied | ODRL policy denied access |
| `holon:TraversalDeniedBoth` | Denied — Both Failed | Both gates failed simultaneously |

#### `holon:BoundaryModeType` — Open or closed payload shapes
| IRI | Label | Meaning |
|---|---|---|
| `holon:OpenBoundary` | Open Boundary | Properties beyond declared shapes permitted (default) |
| `holon:ClosedBoundary` | Closed Boundary | Only declared properties permitted |

---

### 2.8 Projection Classes (`hproj:` namespace — Projection)

#### `hproj:Projection` — Abstract base for all projection artefacts
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** prov:Entity (non-normative)

A projection is an **envelope on content** — the `hproj:` shapes validate
the wrapper (who requested it, from which holons, in what format, with what
provenance) and never touch the domain content itself. Abstract — do not
instantiate directly; use a subtype.

**Subclasses:** NowGraph, DepictionProjection, OutputProduct

**Validated by:** hproj:ProjectionBaseShape

---

#### `hproj:NowGraph` — Stage 8 scene graph slice
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** hproj:Projection

The contextual slice of the scene graph produced for a specific requesting
agent and purpose at pipeline stage 8. The AI Cartographer's primary input.
Carries a scene graph block (domain state), provenance block, prompt block
reference, and active parameter bindings (Bayesian frames, PoV, layer
selections). The pivot between the deterministic pipeline and the
interpretive cartographer layer.

**Validated by:** hproj:NowGraphShape

---

#### `hproj:DepictionProjection` — Stage 9 cartographer output
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** hproj:Projection

The AI Cartographer's rendered product — text, SVG, GeoJSON, Mermaid spec,
KML, or any declared content format. Derived from a NowGraph via a
CartographerActivity and a PromptBlock. The content is what the client
ultimately renders; the envelope records how it was made and what rendering
mode it targets.

**Validated by:** hproj:DepictionProjectionShape

---

#### `hproj:OutputProduct` — Formal deliverable projection
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** hproj:Projection

A projection designated for formal publication or delivery — a report, map
product, export DataBook, or packaged output. Persistent output products
are registered as DataHolons in the registry and assigned stable IRIs via
`hproj:registeredAs`. This closes the loop: the product of a holon becomes
a holon in its own right.

**Validated by:** hproj:OutputProductShape

---

#### `hproj:ProjectionActivity` — A pipeline projection run
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** hprov:IngestionActivity

One run of pipeline stages 8 or 9. Connects source holons, the requesting
agent, and the output projection. Identified by `hproj:projectionStageNumber`
(8 or 9).

**Validated by:** hproj:ProjectionActivityShape

---

#### `hproj:CartographerActivity` — AI Cartographer stage 9 run
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** hproj:ProjectionActivity

Specifically stage 9 — the AI Cartographer reads a NowGraph using a
registered PromptBlock and produces a DepictionProjection. Records which
NowGraph was consumed and which PromptBlock was applied.

**Validated by:** hproj:CartographerActivityShape

---

#### `hproj:PromptBlock` — Named, versioned cartographer prompt
**Namespace:** hproj: | **Conformance:** Projection | **Superclass:** holon:DataHolon

A registered prompt used by the AI Cartographer as its interpretive
instruction. Has a declared input type (what projection graph structure it
expects) and a declared output modality (what format it produces). Prompt
blocks are versioned, shareable, composable, and registered as DataHolons.
Multiple PromptBlocks may be registered for the same holon type; the client
selects the interpretive lens.

**Validated by:** hproj:PromptBlockShape

---

### 2.9 Markov Blanket Classes (`hmk:` namespace — Markov ⚠ at-risk)

#### `hmk:MarkovBlanket` — Four-surface epistemic partition for an agent
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

The formal apparatus separating an agent's internal cognitive model from its
environment. Shields an `holon:AgentHolon` via `hmk:shields`. Requires four
surfaces unless `hmedia:sensorOnly true` is asserted (sensor-only blankets omit
ActiveState and internal model). Governs what the agent perceives, believes,
and emits.

**Validated by:** hmk:MarkovBlanketShape

---

#### `hmk:SensoryState` — Inward-facing surface; receives ObservationEvent payloads
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

The boundary surface through which the environment writes to the agent's
perception. Receives `hev:ObservationEvent` payloads. Carries `hmk:updateTimestamp`
and `hmk:receivesFrom` declarations.

**Subclass:** `hmedia:CameraAgent` (Pass F)

**Validated by:** hmk:SensoryStateShape

---

#### `hmk:ActiveState` — Outward-facing surface; emits Projections and Utterances
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

The boundary surface through which the internal model writes to the environment.
Emits `hproj:Projection` artefacts and `hmk:Utterance` communicative acts.
Carries `hmk:activationTimestamp` and `hmk:emitsTo`.

**Validated by:** hmk:ActiveStateShape

---

#### `hmk:InternalState` — Private belief model; not directly readable by external agents
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

Holds the agent's generative model, belief states, and policy registers.
Not exposed in NowGraphs for external requesting agents. Access is mediated
exclusively through what the ActiveState emits.

---

#### `hmk:Utterance` — First-class communicative act from an ActiveState
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

A deliberate speech act — distinct from a `hproj:DepictionProjection`.
An Utterance may re-enter the pipeline as an `hev:AssertionEvent`; a Projection
MUST NOT. Carries `hmk:utteranceText` and `hmk:freeEnergyAtEmission`.

**Validated by:** hmk:UtteranceShape

---

#### `hmk:PropagationSignal` — Unabsorbed prediction error traversing the holarchy
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

Carries excess free energy outward through the containment hierarchy when an
agent cannot resolve it internally. Polarity declared via `hmk:propagationPolarity`
from the PropagationPolarityScheme.

**Subclasses:** `hmk:DistressPropagation` (positive free energy, concern outward),
`hmk:ResolutionPropagation` (negative free energy, stabilisation signal)

---

#### `hmk:ParticipationRecord` — Resumable agent state snapshot
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

Point-in-time snapshot of an agent's participation state in a holon — belief
state summary, active policy, last active timestamp. Enables session resumption.

---

#### `hmk:CoregulationRecord` — Precursor condition for holonic emergence
**Namespace:** hmk: | **Conformance:** Markov ⚠ | **Superclass:** (none)

Records the conditions under which two or more agents' Markov blankets have
sufficiently aligned to become candidates for holonic emergence (nested holon
formation). A CoregulationRecord does not cause emergence; it records the
precondition.

---

### 2.10 Media Classes (`hmedia:` namespace — Media)

#### `hmedia:MediaContext` — Project-level asset root
**Namespace:** hmedia: | **Conformance:** Media | **Superclass:** (none)

A named resource that declares a `hmedia:mediaBase` URI prefix for resolving
relative-path `hmedia:assetIRI` values. Not holon-bound — one context may be
shared across all holons in a deployment. Changing `mediaBase` relocates the
entire asset tree.

**Validated by:** hmedia:MediaContextShape

---

#### `hmedia:MediaAsset` — Addressable media resource
**Namespace:** hmedia: | **Conformance:** Media | **Superclass:** (none)

An external media resource with a declared IRI, MIME type, functional role,
optional keywords, and optional accessibility text. Attached to holons and
events via `hmedia:hasMedia`. IRI may be absolute or relative to a MediaContext.

**Validated by:** hmedia:MediaAssetShape

---

#### `hmedia:SceneDescriptor` — Repeatable event scene composite
**Namespace:** hmedia: | **Conformance:** Media | **Superclass:** (none)

One camera's rendering of a specific event. Composites principal actor(s),
setting, back-link to originating event, narrative prose, and the camera that
captured this view. One event may have multiple SceneDescriptors — each with a
different `hmedia:cameraRef` — representing concurrent viewpoints.

**Validated by:** hmedia:SceneDescriptorShape

---

#### `hmedia:CameraAgent` — Sensor-only SensoryState for scene rendering
**Namespace:** hmedia: | **Conformance:** Media | **Superclass:** `hmk:SensoryState`

A passive sensor that characterises the rendering viewpoint. Does not deliberate
or emit active state projections. Lives on a sensor-only MarkovBlanket
(`hmedia:sensorOnly true`). Sensor type determines output modality; shot type
and perspective govern framing.

**Validated by:** hmedia:CameraAgentShape (extends hmk:SensoryStateShape via sh:node)

---

## 3. Property Inventory

### 3.1 Core Holon Properties (`holon:` namespace)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `registrationStatus` | O | Holon | skos:Concept | 1 | MUST | Lifecycle status from LifecycleStatusScheme |
| `registeredIn` | D | Holon | xsd:anyURI | 0..1 | MAY | Named graph IRI holding registration record |
| `hostedBy` | O | Holon | HomeHolon | 0..1 | MAY | Server HomeHolon that hosts this holon |
| `contains` | O | Holon | Holon | 0..* | MAY | Holonic containment (child holon) |
| `partOf` | O | Holon | Holon | 0..* | MAY | Inverse of contains |
| `successor` | O | Holon | Holon | 0..1 | MUST (when Deprecated) | Replacement holon IRI |
| `payloadGraph` | D | Holon | xsd:anyURI | 0..1 | SHOULD | Named graph IRI for domain content |
| `boundary` | O | Holon | sh:NodeShape | 0..1 | SHOULD | Shapes graph defining payload validity |
| `boundaryMode` | O | Holon | BoundaryModeType | 0..1 | MAY | Open or closed payload shapes |
| `serverEndpoint` | D | HomeHolon | xsd:anyURI | 1 | MUST | Base IRI of hosting server |
| `registryGraph` | D | Holon | xsd:anyURI | 1 (Home/Index) | MUST | Named graph of registration records |
| `vocabularyEndpoint` | D | HomeHolon | xsd:anyURI | 1 | MUST | Vocabulary server endpoint IRI |
| `concernLevel` | O | (reifier) | skos:Concept | 1 | MUST (on reifier) | Concern level from ConcernLevelScheme |
| `sourceString` | D | GroundingRecord | xsd:string | 1 | MUST | Raw source text submitted for grounding |
| `matchedIRI` | O | GroundingRecord | IRI | 0..1 | MUST (non-NoMatch) | Canonical matched entity IRI |
| `groundingConfidence` | D | GroundingRecord | xsd:decimal | 1 | MUST | Score [0.0, 1.0]; ExactMatch=1.0, Semantic≥0.90, Fuzzy [0.50,0.90), NoMatch=0.0 |
| `matchType` | O | GroundingRecord | skos:Concept | 1 | MUST | From MatchTypeScheme |

### 3.2 Portal Properties (`holon:` namespace — Extended)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `sourceHolon` | O | Portal | Holon | 1 | MUST | Origin holon of the portal |
| `portalTarget` | D | Portal | xsd:anyURI | 1 | MUST | Target IRI (local or remote) |
| `portalLock` | O | Portal | PortalLock | 0..* | MAY | Gating lock(s) on this portal |
| `portalStatus` | O | Portal | skos:Concept | 1 | MUST | From LifecycleStatusScheme |
| `isDirectional` | D | Portal | xsd:boolean | 0..1 | MAY | One-way (true, default) or bidirectional |
| `activationCondition` | O | PortalLock | sh:NodeShape | 0..1 | MAY | Data-state SHACL check for traversal |
| `traversalPolicy` | O | PortalLock | odrl:Policy | 0..1 | MAY | ODRL policy governing access rights |
| `requiredCapability` | O | PortalLock | IRI | 0..* | MAY | Capability IRI agent must possess |
| `traversalPortal` | O | PortalTraversalRecord | Portal | 1 | MUST | Portal that was attempted |
| `traversalAgent` | O | PortalTraversalRecord | AgentHolon | 1 | MUST | Agent that attempted traversal |
| `traversalTime` | D | PortalTraversalRecord | xsd:dateTime | 1 | MUST | UTC timestamp of attempt |
| `traversalOutcome` | O | PortalTraversalRecord | PortalTraversalOutcome | 1 | MUST | Result from controlled vocabulary |
| `denialReason` | D | PortalTraversalRecord | xsd:string | 0..1 | MUST (on denial) | Human-readable failure explanation |

### 3.3 Event Envelope Properties (`hev:` namespace — Core)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `targetHolon` | O | HolonEvent | IRI | 1 | MUST | Destination holon IRI |
| `assertedAt` | D | HolonEvent | xsd:dateTime | 1 | MUST | When the fact was true in the world |
| `receivedAt` | D | HolonEvent | xsd:dateTime | 1 | MUST | When the HGA server processed the event; MUST be ≥ assertedAt |
| `expiresAt` | D | CommandEvent | xsd:dateTime | 0..1 | MAY | Command staleness threshold; rejection if receivedAt > expiresAt |
| `validAsOf` | D | CommandEvent | xsd:dateTime | 0..1 | MAY | Precondition evaluation timestamp |
| `correlationId` | D | HolonEvent | xsd:string | 0..1 | MAY | Batch correlation identifier |
| `eventSequence` | D | HolonEvent | xsd:integer | 0..1 | MAY | Ordering within a correlated batch |
| `causedBy` | O | HolonEvent | HolonEvent | 0..1 | MUST (system events) | Triggering event IRI |
| `assertionPayload` | O | AssertionEvent | IRI | 1 | MUST | Payload graph IRI carrying asserted triples |
| `commandPayload` | O | CommandEvent | IRI | 1 | MUST | Payload graph IRI carrying command instructions |
| `observationPayload` | O | ObservationEvent | IRI | 1 | MUST | Payload graph IRI for domain observation |
| `rejectionReason` | D | CommandRejected | xsd:string | 1 | MUST | Human-readable rejection explanation |
| `violationReport` | O | ViolationEvent | IRI | 1 | MUST | SHACL sh:ValidationReport IRI |
| `traversalRecord` | O | PortalTraversalEvent | IRI | 1 | MUST | PortalTraversalRecord IRI |
| `remoteTarget` | D | RemoteEventEnvelope | xsd:anyURI | 1 | MUST | Destination server base IRI |
| `eventPayload` | O | RemoteEventEnvelope | IRI | 1 | MUST | DataBook IRI to deliver |

### 3.4 Provenance Properties (`hprov:` namespace — Core)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `transformerType` | O | IngestionActivity | TransformerType | 1 | MUST | Type of transformer used |
| `transformerIRI` | D | IngestionActivity | xsd:anyURI | 1 | MUST | Dereferenceable IRI of transformer |
| `ingestVector` | D | IngestionActivity | xsd:integer | 0..1 | MAY | Ingestion pathway (1–7) |
| `pipelineStage` | D | IngestionActivity | xsd:integer | 0..1 | MAY | Highest pipeline stage reached (1–9) |
| `inputRole` | D | (prov:used) | xsd:string | 0..1 | MAY | Role of an input (primary/constraint/context/evidence/reference/template) |
| `confidenceGateOutcome` | D | IngestionActivity | xsd:string | 0..1 | MAY | Gate result: auto-registered / queued-for-review / new-entity-minted |

### 3.5 Bayesian Properties (`hbayes:` namespace — Bayesian ⚠)

| Prop | Kind | Domain | Range | Card. | Req. | Constraint |
|---|---|---|---|---|---|---|
| `prior` | D | BeliefState | xsd:decimal | 1 | MUST | Range [0.0, 1.0] |
| `posterior` | D | BeliefState | xsd:decimal | 1 | MUST | Range [0.0, 1.0] |
| `precision` | D | BeliefState | xsd:decimal | 1 | MUST | > 0; posterior precision SHOULD be ≥ prior |
| `inferenceTimestamp` | D | BeliefState | xsd:dateTime | 0..1 | MAY | When computed |
| `evidenceGraph` | D | BeliefState | xsd:anyURI | 0..1 | SHOULD | ObservationEvent payload that drove update |
| `complexity` | D | FreeEnergy | xsd:decimal | 1 | MUST | KL divergence; ≥ 0 |
| `accuracy` | D | FreeEnergy | xsd:decimal | 1 | MUST | Expected log likelihood |
| `freeEnergy` | D | FreeEnergy | xsd:decimal | 0..1 | MAY | Should ≈ complexity − accuracy |
| `forBeliefState` | O | FreeEnergy | BeliefState | 0..1 | SHOULD | Links to characterised BeliefState |
| `expectedFreeEnergy` | D | PolicySelection | xsd:decimal | 1 | MUST | G(π) for selected policy |
| `selectedPolicy` | O | PolicySelection | IRI | 1 | MUST | Policy with minimum EFE |
| `candidatePolicy` | O | PolicySelection | IRI | 0..* | SHOULD | Policies considered but not selected |
| `selectionTimestamp` | D | PolicySelection | xsd:dateTime | 0..1 | MAY | When selection was computed |

### 3.6 Policy Properties (`hpol:` namespace — Extended)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `holonPolicy` | O | Holon | BoundaryPolicy | 0..1 | MAY | Access control for holon payload |
| `defaultAccess` | O | BoundaryPolicy | DefaultAccessType | 0..1 | MAY | Default when no permission matches; default DenyAll |

### 3.7 Verifiable Credential Properties (`hvc:` namespace — Extended)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `holonCredential` | O | Holon | HolonCredential | 0..* | MAY | Credential asserting something about this holon |
| `presentedBy` | O | HolonPresentation | AgentHolon | 1 | MUST | Agent that submitted the presentation |
| `presentedTo` | O | HolonPresentation | IRI | 0..1 | MAY | Target portal lock or policy evaluator |
| `presentationTimestamp` | D | HolonPresentation | xsd:dateTime | 0..1 | MAY | UTC submission timestamp |

### 3.8 Projection Envelope Properties (`hproj:` namespace — Projection)

**Shared across all Projection subtypes:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `projectionType` | O | Projection | skos:Concept | 1 | MUST | From ProjectionTypeScheme |
| `validAt` | D | Projection | xsd:dateTime | 1 | MUST | Scene graph timestamp this projection captures |
| `expiresAt` | D | Projection | xsd:dateTime | 0..1 | MAY | Staleness threshold; absent = does not expire |
| `requestingAgent` | O | Projection | AgentHolon | 1 | MUST | Agent that requested this projection |
| `sourceHolon` | O | Projection | Holon | 0..* | MAY | Holons whose state is included |
| `contentFormat` | O | Projection | skos:Concept | 1 | MUST | From ContentFormatScheme |
| `persistencePolicy` | O | Projection | skos:Concept | 0..1 | MAY | Ephemeral or Persistent; default Ephemeral |
| `registeredAs` | O | Projection | DataHolon | 0..1 | MUST (when Persistent) | DataHolon IRI assigned on registration |
| `transmissionType` | D | Projection | xsd:string | 0..1 | MAY | "full" or "delta"; default "full" |
| `transmissionSequence` | D | Projection | xsd:integer | 0..1 | MAY | Position in an event stream |
| `baseProjection` | O | Projection | Projection | 0..1 | MUST (when delta) | Full projection this delta updates |
| `transmissionMode` | O | Projection | skos:Concept | 0..1 | MAY | From TransmissionModeScheme (Eager/Lazy) |

**NowGraph-specific:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `projectionDepth` | D | NowGraph | xsd:integer | 0..1 | MAY | Containment levels included: 0=root only, -1=full subgraph |
| `filterShape` | O | NowGraph | sh:NodeShape | 0..1 | MAY | SHACL filter selecting relevant scene triples |
| `sceneGraphBlock` | D | NowGraph | xsd:anyURI | 1 | MUST | Named graph IRI of current-state domain triples |
| `provenanceBlock` | D | NowGraph | xsd:anyURI | 0..1 | SHOULD | Named graph IRI of PROV-O trail for scene assertions |
| `promptBlock` | O | NowGraph | PromptBlock | 0..1 | SHOULD | Recommended cartographer prompt IRI |
| `parameterBlock` | D | NowGraph | xsd:anyURI | 0..1 | MAY | Named graph IRI of active Bayesian/PoV/layer bindings |

**DepictionProjection-specific:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `derivedFromNowGraph` | O | DepictionProjection | NowGraph | 1 | MUST | Source NowGraph for this depiction |
| `renderingMode` | O | DepictionProjection | skos:Concept | 1 | MUST | From RenderingModeScheme |
| `contentGraph` | D | DepictionProjection | xsd:anyURI | 0..1 | MAY | Named graph IRI for RDF content (Turtle, JSON-LD) |
| `contentURI` | D | DepictionProjection | xsd:anyURI | 0..1 | MAY | External resource IRI for non-RDF content (KML, SVG file) |
| `contentLiteral` | D | DepictionProjection | xsd:string | 0..1 | MAY | Inline string for compact depictions (prose, Mermaid, short SVG) |
| `hmedia:cameraRef` | O | NowGraph, DepictionProjection | hmedia:CameraAgent | 0..1 | MAY | Pass F bridge property; specifies default rendering camera for this projection |

**Activity and PromptBlock properties:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `projectionStageNumber` | D | ProjectionActivity | xsd:integer | 0..1 | MAY | 8 (scene projection) or 9 (cartographer) |
| `usedNowGraph` | O | CartographerActivity | NowGraph | 1 | MUST | NowGraph consumed as cartographer input |
| `usedPromptBlock` | O | CartographerActivity | PromptBlock | 1 | MUST | PromptBlock applied by cartographer |
| `expectedInputType` | O | PromptBlock | skos:Concept | 0..1 | SHOULD | Projection type this prompt expects |
| `declaredOutputModality` | O | PromptBlock | skos:Concept | 1 | MUST | Content format this prompt produces |

### 3.9 Markov Blanket Properties (`hmk:` namespace — Markov ⚠)

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `shields` | O | MarkovBlanket | AgentHolon | 0..1 | MUST (full agents) | AgentHolon this blanket epistemic-partitions |
| `hasSensoryStates` | O | MarkovBlanket | SensoryState | 1..* | MUST | Inward-facing surfaces |
| `hasActiveStates` | O | MarkovBlanket | ActiveState | 1..* | MUST (unless sensorOnly) | Outward-facing surfaces |
| `hasInternalStates` | O | MarkovBlanket | InternalState | 0..* | MAY | Private belief model surfaces |
| `propagationThreshold` | D | MarkovBlanket | xsd:decimal | 0..1 | SHOULD | Free energy level above which PropagationSignal fires |
| `participatesIn` | O | MarkovBlanket | holon:Holon | 0..* | MAY | Holons this blanket is epistemically engaged with |
| `updateTimestamp` | D | SensoryState | xsd:dateTime | 1 | MUST | UTC timestamp of last sensory surface update |
| `activationTimestamp` | D | ActiveState | xsd:dateTime | 1 | MUST | UTC timestamp of last active emission |
| `receivesFrom` | O | SensoryState | (any) | 0..* | SHOULD | Holons or agents this surface receives observations from |
| `emitsTo` | O | ActiveState | (any) | 0..* | SHOULD | Holons or agents this surface emits outputs to |
| `forBlanket` | O | SensoryState, ActiveState | MarkovBlanket | 0..1 | SHOULD | Owning blanket (back-reference) |
| `generatedFromActiveState` | O | Utterance, Projection | ActiveState | 0..1 | SHOULD | ActiveState that generated this emission |
| `addressedToSensoryState` | O | Utterance | SensoryState | 0..1 | SHOULD | Target SensoryState for this communicative act |
| `propagationPolarity` | O | PropagationSignal | skos:Concept | 0..1 | SHOULD | From PropagationPolarityScheme |
| `utteranceText` | D | Utterance | rdf:langString | 0..* | SHOULD | Lang-tagged text content of the communicative act |
| `freeEnergyAtEmission` | D | Utterance | xsd:decimal | 0..1 | MAY | Free energy level at time of emission |

### 3.10 Media Properties (`hmedia:` namespace — Media)

**MediaContext and MediaAsset:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `mediaBase` | D | MediaContext | xsd:anyURI | 1 | MUST | Base URI for resolving relative asset IRIs; SHOULD end with "/" |
| `assetIRI` | D | MediaAsset | xsd:anyURI | 1 | MUST | Absolute or relative IRI of the external media resource |
| `mimeType` | D | MediaAsset | xsd:string | 1 | MUST | IANA media type (e.g., "image/jpeg", "image/svg+xml") |
| `keywords` | D | MediaAsset | xsd:string | 0..* | MAY | Repeatable keyword tags for retrieval |
| `mediaRole` | O | MediaAsset | skos:Concept | 1 | SHOULD | Functional role from MediaRoleScheme |
| `altText` | D | MediaAsset | xsd:string | 0..1 | MAY | Accessibility description |
| `inMediaContext` | O | MediaAsset | MediaContext | 0..1 | MAY | Context that provides base URI for relative IRI resolution |

**Appearance and asset attachment (on any Holon or Event):**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `appearance` | D | Holon, Event | rdf:langString | 0..* | MAY | Lang-tagged prose rendering hint for the AI Cartographer; NOT a caption — generative input |
| `hasMedia` | O | Holon, Event | MediaAsset | 0..* | MAY | Explicit asset attachment; referential depiction (use alongside or instead of appearance) |

**MarkovBlanket extension (declared in hmedia:, referenced in hmk:):**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `sensorOnly` | D | hmk:MarkovBlanket | xsd:boolean | 0..1 | MAY | When true, relaxes four-surface requirement — blanket needs only SensoryState |

**SceneDescriptor and scene composition:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `hasScene` | O | hev:Event | SceneDescriptor | 0..* | MAY | **Repeatable** — one event may link to multiple SceneDescriptors |
| `sceneActor` | O | SceneDescriptor | holon:AgentHolon | 0..* | MAY | Principal agent in this scene view |
| `sceneLocation` | O | SceneDescriptor | holon:Holon | 0..1 | MAY | Setting holon for this scene |
| `sceneEvent` | O | SceneDescriptor | hev:Event | 0..1 | SHOULD | Back-link to originating event |
| `sceneNarrative` | D | SceneDescriptor | xsd:string | 0..1 | MAY | Prose description; author-supplied or AI Cartographer-generated |
| `cameraRef` | O | SceneDescriptor, NowGraph, DepictionProjection | CameraAgent | 0..1 | MAY/SHOULD | Rendering camera; SHOULD on SceneDescriptor |

**CameraAgent sensor properties:**

| Prop | Kind | Domain | Range | Card. | Req. | Description |
|---|---|---|---|---|---|---|
| `sensorType` | O | CameraAgent | skos:Concept | 1 | MUST | From SensorTypeScheme — determines output modality |
| `shotType` | O | CameraAgent | skos:Concept | 0..1 | SHOULD | From ShotTypeScheme — compositional framing |
| `perspective` | O | CameraAgent | skos:Concept | 0..1 | SHOULD | From PerspectiveScheme — narrative point of view |
| `focalLength` | D | CameraAgent | xsd:decimal | 0..1 | MAY | Equivalent focal length in mm (35mm) |
| `fieldOfView` | D | CameraAgent | xsd:decimal | 0..1 | MAY | Horizontal field of view in degrees |
| `depthOfField` | O | CameraAgent | skos:Concept | 0..1 | MAY | From DepthOfFieldScheme |
| `cameraDescription` | D | CameraAgent | xsd:string | 0..1 | MAY | Natural language rendering persona; read by Cartographer |


---

## 4. SHACL Shape Inventory

Shapes marked **Closed** have `sh:closed true` — no unexpected properties
are permitted on the focus node's infrastructure triples. All shapes have
`sh:nodeKind sh:IRI` unless noted.

### 4.1 Core Holon Shapes

| Shape | Target | Closed | Key MUSTs | Notable Warnings |
|---|---|---|---|---|
| `holon:HolonShape` | `holon:Holon` | No | rdfs:label (English, ≥1); registrationStatus (exactly 1, from LifecycleStatusScheme); successor present when DeprecatedStatus | dcterms:description SHOULD be present; payloadGraph SHOULD be declared |
| `holon:HomeHolonShape` | `holon:HomeHolon` | No | Inherits HolonShape; serverEndpoint (exactly 1 IRI); registryGraph (exactly 1 IRI); vocabularyEndpoint (exactly 1 IRI) | — |
| `holon:IndexHolonShape` | `holon:IndexHolon` | No | Inherits HolonShape; registryGraph (at least 1 IRI) | — |
| `holon:AgentHolonShape` | `holon:AgentHolon` | No | Inherits HolonShape | — |
| `holon:OrganisationHolonShape` | `holon:OrganisationHolon` | No | Inherits AgentHolonShape | — |
| `holon:PlaceHolonShape` | `holon:PlaceHolon` | No | Inherits HolonShape | — |
| `holon:DataHolonShape` | `holon:DataHolon` | No | Inherits HolonShape | payloadGraph SHOULD be declared |
| `holon:ProcessHolonShape` | `holon:ProcessHolon` | No | Inherits HolonShape | — |

### 4.2 Grounding and Annotation Shapes (Core)

| Shape | Target | Closed | Key MUSTs | Notes |
|---|---|---|---|---|
| `holon:GroundingRecordShape` | `holon:GroundingRecord` | No | sourceString (exactly 1 string); matchType (exactly 1, from MatchTypeScheme); groundingConfidence (exactly 1, in [0.0, 1.0]); matchedIRI required for ExactMatch/SemanticMatch/FuzzyMatch; confidence invariants per match type | 4 SPARQL constraints enforce confidence invariants |
| `holon:ConcernAnnotationShape` | reifier (no targetClass) | No | rdfs:label (English, ≥1 on reifier IRI); concernLevel (exactly 1, from ConcernLevelScheme) | Reifier MUST be a named IRI (sh:nodeKind sh:IRI) |

### 4.3 Portal and Traversal Shapes (Extended)

| Shape | Target | Closed | Key MUSTs | Warnings / SPARQL |
|---|---|---|---|---|
| `holon:PortalShape` | `holon:Portal` | No | rdfs:label; sourceHolon (1 IRI of class Holon); portalTarget (1 IRI); portalStatus (1, from LifecycleStatusScheme); portalLock references must be named PortalLock IRIs | Ungated portal (no lock) triggers warning; Deprecated/Archived status triggers violation |
| `holon:PortalLockShape` | `holon:PortalLock` | No | rdfs:label; at least one of: activationCondition, traversalPolicy, or requiredCapability | Empty lock (no gate) is Violation |
| `holon:PortalTraversalRecordShape` | `holon:PortalTraversalRecord` | No | traversalPortal (1 Portal IRI); traversalAgent (1 IRI); traversalTime (1 dateTime); traversalOutcome (1, from controlled vocabulary); denialReason required on denial outcomes | — |

### 4.4 Event Envelope Shapes (Core, all Closed)

The base shape `holon:HolonEventBaseShape` validates: rdfs:label (≥1); targetHolon (1 IRI); assertedAt (1 dateTime, with sh:reifierShape); receivedAt (1 dateTime); prov:wasGeneratedBy (1 IRI); correlationId and eventSequence are optional but typed. SPARQL constraint: receivedAt MUST NOT precede assertedAt.

| Shape | Target | Key additions to base | SPARQL constraints |
|---|---|---|---|
| `hev:AssertionEventShape` | `hev:AssertionEvent` | assertionPayload (1 IRI) | — |
| `hev:CommandEventShape` | `hev:CommandEvent` | commandPayload (1 IRI); expiresAt (0..1 dateTime) | Reject if receivedAt > expiresAt |
| `hev:ObservationEventShape` ⁺ | `hev:ObservationEvent` | observationPayload (1 IRI) | — |
| `hev:CommandRejectedShape` | `hev:CommandRejected` | causedBy (1 CommandEvent IRI); rejectionReason (1 string) | — |
| `hev:ViolationEventShape` | `hev:ViolationEvent` | causedBy (1 IRI); violationReport (1 IRI) | — |
| `hev:OutOfBoundsShape` | `hev:OutOfBounds` | causedBy (1 IRI) | — |
| `hev:ExpansionRequestShape` | `hev:ExpansionRequest` | causedBy (0..1 IRI, Warning) | — |
| `hev:UnresolvableTargetShape` | `hev:UnresolvableTarget` | causedBy (1 IRI) | — |
| `hev:PortalTraversalEventShape` ⁺ | `hev:PortalTraversalEvent` | traversalRecord (1 IRI) | — |
| `hev:PortalTraversalDeniedShape` ⁺ | `hev:PortalTraversalDenied` | traversalRecord (1 IRI); causedBy (1 IRI) | — |
| `hev:RemoteEventEnvelopeShape` | `hev:RemoteEventEnvelope` | remoteTarget (1 IRI); eventPayload (1 IRI) | — |

⁺ Extended conformance.

`hev:TemporalReifierShape` — reifier shape (no targetClass). Validates reifiers on temporal triples: MUST be a named IRI with ≥1 rdfs:label. Referenced via `sh:reifierShape` on assertedAt and receivedAt property shapes.

### 4.5 Provenance Shapes (Core)

| Shape | Target | Key MUSTs | Warnings |
|---|---|---|---|
| `hprov:EventEnvelopeProvenanceShape` | `hev:HolonEvent` | prov:wasGeneratedBy (≥1 IRI) | wasAttributedTo SHOULD be present; wasDerivedFrom MAY be present (Info) |
| `hprov:IngestionActivityShape` | `hprov:IngestionActivity` | rdfs:label; transformerType (1, from enum); transformerIRI (1 IRI); ingestVector in [1,7] if present; pipelineStage in [1,9] if present; confidenceGateOutcome from controlled string set if present | — |
| `hprov:DataBookProvenanceShape` | `hdb:DataBook` | dcterms:created MUST be date or dateTime if present | prov:wasGeneratedBy SHOULD be present; dcterms:creator SHOULD be named IRI (Info) |
| `hprov:DerivationActivityShape` | `hprov:DerivationActivity` | rdfs:label; derivedFromHolon (1..*, DataHolon IRIs); transformerType (1); transformerIRI (1) | derivationRule SHOULD be declared; prov:startedAtTime / endedAtTime SHOULD be present |

### 4.6 Bayesian Shapes (Bayesian ⚠ at-risk)

| Shape | Target | Key MUSTs | Advisory SPARQL |
|---|---|---|---|
| `hbayes:BeliefStateShape` | `hbayes:BeliefState` | rdfs:label (≥1); prior (1, in [0,1]); posterior (1, in [0,1]); precision (1, >0) | Warn if posterior probability drops substantially vs prior (heuristic) |
| `hbayes:FreeEnergyShape` | `hbayes:FreeEnergy` | rdfs:label; complexity (1, ≥0); accuracy (1) | Warn if freeEnergy ≠ complexity − accuracy beyond rounding tolerance |
| `hbayes:PolicySelectionShape` | `hbayes:PolicySelection` | rdfs:label; selectedPolicy (1 IRI); expectedFreeEnergy (1 decimal) | candidatePolicy SHOULD be present |

### 4.7 Policy Shapes (Extended)

| Shape | Target | Key MUSTs | SPARQL |
|---|---|---|---|
| `hpol:BoundaryPolicyShape` | `hpol:BoundaryPolicy` | Inherits BasePolicyShape (uid IRI; label; ≥1 permission or prohibition); defaultAccess from enum if present | Permission actions MUST be odrl:read or odrl:write only |
| `hpol:PortalPolicyShape` | `hpol:PortalPolicy` | Inherits BasePolicyShape | Permission actions MUST be hpol:traverse only |
| `hpol:ODRLPermissionShape` | `odrl:Permission` | action (1 IRI); assignee (≥1 IRI) | — |
| `hpol:ODRLConstraintShape` | `odrl:Constraint` | leftOperand (1 IRI); operator (1 IRI); rightOperand or rightOperandReference required | — |
| `hpol:HolonPolicyAttachmentShape` | subjects of hpol:holonPolicy | holonPolicy MUST be named IRI of class BoundaryPolicy | — |

### 4.8 Verifiable Credential Shapes (Extended)

| Shape | Target | Key MUSTs | Warnings |
|---|---|---|---|
| `hvc:VerifiableCredentialShape` | `vc:VerifiableCredential` | issuer (1 IRI); validFrom (1 dateTime); credentialSubject (≥1 IRI, open content); validUntil MUST be > validFrom if present | proof SHOULD be present; rdfs:label SHOULD be present |
| `hvc:HolonCredentialShape` | `hvc:HolonCredential` | Inherits VerifiableCredentialShape; credentialSubject MUST be holon:Holon | — |
| `hvc:VerifiablePresentationShape` | `vc:VerifiablePresentation` | verifiableCredential (≥1, each satisfying VerifiableCredentialShape) | holder SHOULD be present; proof SHOULD be present |
| `hvc:HolonPresentationShape` | `hvc:HolonPresentation` | Inherits VerifiablePresentationShape; presentedBy (1 AgentHolon IRI) | holder and presentedBy SHOULD match |
| `hvc:ProofShape` | objects of vc:proof | — | dcterms:created SHOULD be present |

### 4.9 Projection Shapes (Projection)

`hproj:ProjectionBaseShape` is not directly targeted — it is used via `sh:node`
in all specific projection shapes. NowGraph and DepictionProjection shapes are
`sh:closed true`; OutputProduct inherits the base shape without closure.

| Shape | Target | Closed | Key MUSTs | Warnings / SPARQL |
|---|---|---|---|---|
| `hproj:ProjectionBaseShape` | (base via sh:node) | — | rdfs:label; projectionType (1, from ProjectionTypeScheme); validAt (1 dateTime); requestingAgent (1 AgentHolon IRI); prov:wasGeneratedBy (1 IRI); contentFormat (1, from ContentFormatScheme) | SPARQL: registeredAs MUST be present when persistencePolicy=Persistent; baseProjection MUST be present for delta transmissions; advisory check that wasGeneratedBy is not a mutation event type |
| `hproj:NowGraphShape` | `hproj:NowGraph` | ✓ | Inherits base; sceneGraphBlock (1 IRI) | promptBlock SHOULD be present; provenanceBlock SHOULD be present; projectionDepth MUST be ≥ -1 if present; hmedia:cameraRef MAY be present (Pass F bridge; sh:ignoredProperties if not loaded) |
| `hproj:DepictionProjectionShape` | `hproj:DepictionProjection` | ✓ | Inherits base; derivedFromNowGraph (1 NowGraph IRI); renderingMode (1, from RenderingModeScheme); at least one of contentGraph / contentURI / contentLiteral | hmedia:cameraRef MAY be present (Pass F bridge; sh:Info advisory) |
| `hproj:OutputProductShape` | `hproj:OutputProduct` | No | Inherits base | persistencePolicy SHOULD be declared |
| `hproj:ProjectionActivityShape` | `hproj:ProjectionActivity` | No | Inherits IngestionActivityShape; projectionStageNumber MUST be 8 or 9 if present | — |
| `hproj:CartographerActivityShape` | `hproj:CartographerActivity` | No | Inherits ProjectionActivityShape; usedNowGraph (1 NowGraph IRI); usedPromptBlock (1 PromptBlock IRI) | — |
| `hproj:PromptBlockShape` | `hproj:PromptBlock` | No | Inherits DataHolonShape; declaredOutputModality (1, from ContentFormatScheme) | expectedInputType SHOULD be present |

### 4.10 Markov Blanket Shapes (Markov ⚠)

| Shape | Target | Closed | Key MUSTs | Warnings / SPARQL |
|---|---|---|---|---|
| `hmk:MarkovBlanketShape` | `hmk:MarkovBlanket` | No | rdfs:label; hasSensoryStates (1..*); hasActiveStates (1..* unless sensorOnly); shields (1 AgentHolon unless sensorOnly) | SPARQL guard: if hmedia:sensorOnly=true, relax hasActiveStates and shields to sh:Warning; propagationThreshold SHOULD be declared |
| `hmk:SensoryStateShape` | `hmk:SensoryState` | No | rdfs:label; updateTimestamp (1 dateTime) | receivesFrom SHOULD be declared; forBlanket SHOULD be present |
| `hmk:ActiveStateShape` | `hmk:ActiveState` | No | rdfs:label; activationTimestamp (1 dateTime) | emitsTo SHOULD be declared; forBlanket SHOULD be present |
| `hmk:UtteranceShape` | `hmk:Utterance` | No | rdfs:label; generatedFromActiveState (0..1 IRI, SHOULD) | utteranceText SHOULD carry at least one lang-tagged value |

### 4.11 Media Shapes (Media)

**Core shapes:**

| Shape | Target | Closed | Key MUSTs | Warnings |
|---|---|---|---|---|
| `hmedia:MediaContextShape` | `hmedia:MediaContext` | No | rdfs:label; mediaBase (exactly 1 xsd:anyURI) | — |
| `hmedia:MediaAssetShape` | `hmedia:MediaAsset` | No | rdfs:label; assetIRI (1 xsd:anyURI); mimeType (1 string) | mediaRole SHOULD be from MediaRoleScheme; altText MAY be present |
| `hmedia:SceneDescriptorShape` | `hmedia:SceneDescriptor` | No | rdfs:label | cameraRef SHOULD be present; sceneEvent SHOULD be present; SPARQL: warn if no sceneActor, sceneLocation, or sceneNarrative |
| `hmedia:CameraAgentShape` | `hmedia:CameraAgent` | No | Inherits hmk:SensoryStateShape via sh:node; sensorType (1, from SensorTypeScheme) | shotType SHOULD be declared; perspective SHOULD be declared |

**Advisory extension shapes** (opt-in; validate hmedia: additions on existing types):

| Shape | Target | Closed | Validates |
|---|---|---|---|
| `hmedia:HolonMediaExtensionShape` | `holon:Holon` | No | appearance SHOULD be rdf:langString; hasMedia SHOULD reference valid MediaAsset |
| `hmedia:EventSceneExtensionShape` | `hev:Event` | No | hasScene SHOULD reference valid SceneDescriptor; appearance SHOULD be rdf:langString |


---

## 5. SKOS Controlled Vocabulary Reference

### 5.1 Holon Lifecycle Status Scheme

Used as: `holon:registrationStatus` (cardinality 1, MUST)

| IRI | Label | Notation | Can receive events? | Notes |
|---|---|---|---|---|
| `holon:CandidateStatus` | Candidate | CANDIDATE | No (dev/test only) | Pending review; routed here from confidence gate on medium-confidence matches |
| `holon:RegisteredStatus` | Registered | REGISTERED | Yes | Canonical; authoritative in registry |
| `holon:DeprecatedStatus` | Deprecated | DEPRECATED | SHOULD NOT | Successor link required |
| `holon:ArchivedStatus` | Archived | ARCHIVED | No | Read-only historical record; no successor |
| `holon:SuspendedStatus` | Suspended | SUSPENDED | No | Temporary; reactivation possible |

### 5.2 Validation Severity Scheme

Used as: `sh:severity` on SHACL constraints; `holon:ViolationEvent` severity

| IRI | Label | Notation | SHACL alignment | Effect in HGA pipeline |
|---|---|---|---|---|
| `holon:ViolationSeverity` | Violation | VIOLATION | `sh:Violation` | Blocks scene graph mutation; generates ViolationEvent |
| `holon:WarningSeverity` | Warning | WARNING | `sh:Warning` | Logged; does NOT block mutation |
| `holon:InfoSeverity` | Info | INFO | `sh:Info` | Informational; no pipeline effect |

### 5.3 Concern Level Scheme

Used as: `holon:concernLevel` on named reifier IRIs in Turtle 1.2 annotation blocks

| IRI | Label | Notation | Domain use |
|---|---|---|---|
| `holon:HighConcern` | High Concern | HIGH | High risk/impact; route to priority path; surface prominently in depiction |
| `holon:MediumConcern` | Medium Concern | MEDIUM | Moderate risk; include in monitoring reports |
| `holon:LowConcern` | Low Concern | LOW | Informational; MAY be omitted from routine depiction |
| `holon:PositiveConcern` | Positive Concern | POSITIVE | Beneficial development; risk-reducing condition |

> Concern levels annotate **domain assertions in payload graphs** — not envelope properties like timestamps.

### 5.4 Grounding Match Type Scheme

Used as: `holon:matchType` on GroundingRecord (cardinality 1, MUST); drives confidence gate routing

| IRI | Label | Notation | Confidence range | Gate routing |
|---|---|---|---|---|
| `holon:ExactMatch` | Exact Match | EXACT | 1.0 (exactly) | Auto-register |
| `holon:SemanticMatch` | Semantic Match | SEMANTIC | ≥ 0.90 | Auto-register |
| `holon:FuzzyMatch` | Fuzzy Match | FUZZY | [0.50, 0.90) | Review queue → CandidateStatus |
| `holon:NoMatch` | No Match | NOMATCH | 0.0 (exactly) | Mint new IRI → CandidateStatus |

### 5.5 Event Type Scheme (`hev:` namespace)

Four-branch taxonomy classifying all HGA event types.

**Declarative branch** (fact assertions)
- `hev:DeclarativeEvent` → `hev:AssertionEvent`

**Imperative branch** (instructions)
- `hev:ImperativeEvent` → `hev:CommandEvent`

**Observational branch** (sensory input)
- `hev:ObservationalEvent` → `hev:ObservationEvent`

**System branch** (pipeline-generated)
- `hev:SystemEvent` →
  - `hev:CommandRejected`
  - `hev:ViolationEvent`
  - `hev:OutOfBounds`
  - `hev:ExpansionRequest`
  - `hev:UnresolvableTarget`
  - `hev:PortalTraversalEvent`
  - `hev:PortalTraversalDenied`
  - `hev:RemoteEventEnvelope`

### 5.6 Ingestion Vector Scheme (`hprov:` namespace)

Used as: `hprov:ingestVector` integer value on IngestionActivity

| Value | IRI | Label | Source type | Context richness |
|---|---|---|---|---|
| 1 | `hprov:Vector1` | Transcriptional | Documents, transcripts, logs | Highest |
| 2 | `hprov:Vector2` | Database / SPARQL | Relational databases, SPARQL Anything | Low |
| 3 | `hprov:Vector3` | Streaming Events | CNL event streams, dataset feeds | Medium |
| 4 | `hprov:Vector4` | Federated RDF | Peer RDF graphs, remote triplestores | Medium |
| 5 | `hprov:Vector5` | Multimodal | Images, audio, video, sensor data | Variable |
| 6 | `hprov:Vector6` | Cross-Holon Inference | Inference across existing holons | Derived |
| 7 | `hprov:Vector7` | Human Curation | Human reviewer or curator | Highest |

### 5.7 Transformer Type Controlled Vocabulary (`hprov:` namespace)

Used as: `hprov:transformerType` on IngestionActivity (cardinality 1, MUST)

| IRI | Label | Notation | Deterministic? |
|---|---|---|---|
| `hprov:LLMTransformer` | LLM Transformer | llm | No |
| `hprov:XSLTTransformer` | XSLT Transformer | xslt | Yes |
| `hprov:SPARQLTransformer` | SPARQL Transformer | sparql | Yes |
| `hprov:SHACLTransformer` | SHACL Transformer | shacl | Yes |
| `hprov:HumanTransformer` | Human Reviewer | human | No |
| `hprov:CompositeTransformer` | Composite Transformer | composite | Mixed |

### 5.8 Projection Type Scheme (`hproj:` namespace)

Used as: `hproj:projectionType` on Projection (cardinality 1, MUST)

| IRI | Label | Notation | Pipeline stage | Notes |
|---|---|---|---|---|
| `hproj:NowGraphProjection` | Now Graph | NOW-GRAPH | Stage 8 | Cartographer's input; scene graph slice for a specific agent |
| `hproj:DepictionProjectionType` | Depiction Projection | DEPICTION | Stage 9 | Cartographer's output; rendered content |
| `hproj:OutputProductProjection` | Output Product | OUTPUT-PRODUCT | Post-stage 9 | Formal deliverable; may become DataHolon |
| `hproj:EventStreamProjection` | Event Stream | EVENT-STREAM | Stage 8 (streaming) | Time-ordered delta sequence over WebSocket |
| `hproj:DeltaProjection` | Delta Projection | DELTA | Any | Incremental update; requires baseProjection |
| `hproj:APIResponseProjection` | API Response | API-RESPONSE | Stage 8 (lazy) | Ephemeral REST query result |

### 5.9 Persistence Policy Scheme (`hproj:` namespace)

Used as: `hproj:persistencePolicy` on Projection (optional; default Ephemeral)

| IRI | Label | Notation | Outcome | Notes |
|---|---|---|---|---|
| `hproj:EphemeralProjection` | Ephemeral | EPHEMERAL | Consumed and discarded | NOT registered as a DataHolon |
| `hproj:PersistentProjection` | Persistent | PERSISTENT | Registered as DataHolon | hproj:registeredAs MUST be set after registration |

### 5.10 Rendering Mode Scheme (`hproj:` namespace)

Used as: `hproj:renderingMode` on DepictionProjection (cardinality 1, MUST)

| IRI | Label | Notation | Client role | Key characteristic |
|---|---|---|---|---|
| `hproj:CinematicMode` | Cinematic | CINEMATIC | Passive observer | Trajectory replay across time; historical and counterfactual |
| `hproj:ImmersiveMode` | Immersive | IMMERSIVE | Agent inside holon | First-person; perspective-filtered scene; primary build target |
| `hproj:ActiveInferenceMode` | Active Inference | ACTIVE-INFERENCE | Predictive agent | Generative model vs incoming deltas; Bayesian surprise minimisation |
| `hproj:ExplodedViewMode` | Exploded View | EXPLODED-VIEW | Analyst | Multi-layer composited overlay; temporal offset supported |

### 5.11 Content Format Scheme (`hproj:` namespace)

Used as: `hproj:contentFormat` on Projection (cardinality 1, MUST) and `hproj:declaredOutputModality` on PromptBlock

| IRI | Label | MIME notation | RDF? | Notes |
|---|---|---|---|---|
| `hproj:DataBookFormat` | DataBook | text/markdown | Indirect | HGA native self-describing artefact format |
| `hproj:TurtleFormat` | Turtle 1.2 | text/turtle | Yes | RDF scene graph blocks |
| `hproj:JSONLDFormat` | JSON-LD | application/ld+json | Yes | HGA context compact form |
| `hproj:HTMLFormat` | HTML | text/html | No | Browser-rendered depictions and reports |
| `hproj:TextFormat` | Plain Text | text/plain | No | Conversational prose; always available |
| `hproj:SVGFormat` | SVG | image/svg+xml | No | Structural diagrams and schematic maps |
| `hproj:MermaidFormat` | Mermaid | text/x-mermaid | No | Client-side rendered diagrams |
| `hproj:VegaLiteFormat` | Vega-Lite | application/vnd.vega.lite+json | No | Statistical and analytical visualisations |
| `hproj:GeoJSONFormat` | GeoJSON | application/geo+json | No | Lightweight web GIS; geographic overlays |
| `hproj:KMLFormat` | KML | application/vnd.google-earth.kml+xml | No | Google Earth / QGIS compatible GIS |
| `hproj:GeoPackageFormat` | GeoPackage | application/geopackage+sqlite3 | No | Full-fidelity GIS exchange; prefer over Shapefile |
| `hproj:ShapefileFormat` | Shapefile | application/x-esri-shapefile | No | Legacy GIS; backward compatibility only |
| `hproj:CSVFormat` | CSV | text/csv | No | Tabular export and spreadsheet integration |
| `hproj:SPARQLResultsJSONFormat` | SPARQL Results JSON | application/sparql-results+json | No | Programmatic API consumption |

### 5.12 Transmission Mode Scheme (`hproj:` namespace)

Used as: `hproj:transmissionMode` on Projection (optional)

| IRI | Label | Notation | Protocol | Triplestore authoritative? |
|---|---|---|---|---|
| `hproj:EagerTransmission` | Eager (Push) | EAGER | WebSocket | Not always — see scene delta notes |
| `hproj:LazyTransmission` | Lazy (Pull) | LAZY | REST | Yes — snapshot at query time |

### 5.13 Markov Propagation Polarity Scheme (`hmk:` namespace — Markov ⚠)

Used as: `hmk:propagationPolarity` on PropagationSignal (cardinality 0..1, SHOULD)

| IRI | Label | Notation | Semantics |
|---|---|---|---|
| `hmk:DistressPropagation` | Distress | DISTRESS | Positive free energy propagating outward — agent signals concern to parent holons |
| `hmk:ResolutionPropagation` | Resolution | RESOLUTION | Negative free energy — agent has stabilised; withdrawing earlier distress signal |

### 5.14 Media Role Scheme (`hmedia:` namespace — Media)

Used as: `hmedia:mediaRole` on MediaAsset (cardinality 1, SHOULD)

| IRI | Label | Notation | Use |
|---|---|---|---|
| `hmedia:Primary` | Primary | PRIMARY | Canonical visual representation; first asset the Cartographer uses |
| `hmedia:Thumbnail` | Thumbnail | THUMBNAIL | Small preview (SHOULD be ≤ 256×256 px); for list views and overlays |
| `hmedia:Background` | Background | BACKGROUND | Backdrop for a location or scene; immersive rendering environment |
| `hmedia:Sprite` | Sprite | SPRITE | Discrete 2D/isometric graphical element for an agent or object |
| `hmedia:Audio` | Audio | AUDIO | Sound asset; ambient, voice, or effect; MIME: audio/mpeg, audio/ogg |
| `hmedia:Video` | Video | VIDEO | Video asset; replay or animation; MIME: video/mp4, video/webm |
| `hmedia:Map` | Map | MAP | Geographic or schematic map; SVG, GeoJSON, KML, or raster |
| `hmedia:Model` | 3D Model | MODEL | Three-dimensional model; GLTF, OBJ, STL |
| `hmedia:Narrative` | Narrative | NARRATIVE | Pre-authored prose; use when LLM generation not desired; MIME: text/plain or text/markdown |

### 5.15 Sensor Type Scheme (`hmedia:` namespace — Media)

Used as: `hmedia:sensorType` on CameraAgent (cardinality 1, MUST)

| IRI | Label | Notation | Output modality |
|---|---|---|---|
| `hmedia:VisualSensor` | Visual | VISUAL | Image or video assets; primary for Cinematic and Immersive modes |
| `hmedia:AudioSensor` | Audio | AUDIO | Audio assets; ambient, dialogue, or event sound |
| `hmedia:GeometricSensor` | Geometric | GEOMETRIC | 3D model or depth-map assets; structural/architectural depictions |
| `hmedia:CartographicSensor` | Cartographic | CARTOGRAPHIC | Map assets (GeoJSON, KML, SVG); primary for Exploded View mode |
| `hmedia:TextualSensor` | Textual | TEXTUAL | Natural language prose; the AI Cartographer's generative mode; primary for Active Inference |

### 5.16 Shot Type Scheme (`hmedia:` namespace — Media)

Used as: `hmedia:shotType` on CameraAgent (cardinality 0..1, SHOULD)

| IRI | Label | Notation | Framing characteristic |
|---|---|---|---|
| `hmedia:EstablishingShot` | Establishing Shot | ESTABLISHING | Full spatial context; used to orient before closer shots |
| `hmedia:WideShot` | Wide Shot | WIDE | Full figures; emphasis on environment over individual subjects |
| `hmedia:MediumShot` | Medium Shot | MEDIUM | Waist-up; balanced character and environment; default conversational |
| `hmedia:CloseUp` | Close-Up | CLOSEUP | Tight detail — face, object, display; emphasises information content |
| `hmedia:OverTheShoulder` | Over the Shoulder | OTS | Behind one subject toward another; establishes dialogue relationship |
| `hmedia:POV` | Point of View | POV | Subject's exact eyeline; used in first-person immersive rendering |
| `hmedia:BirdsEye` | Bird's Eye | BIRDSEYE | Straight down; removes depth; standard geographic/cartographic |
| `hmedia:Isometric` | Isometric | ISOMETRIC | 45° elevated diagonal; preserves scale without distortion; analytical diagrams |

### 5.17 Perspective Scheme (`hmedia:` namespace — Media)

Used as: `hmedia:perspective` on CameraAgent (cardinality 0..1, SHOULD)

| IRI | Label | Notation | Narrative standpoint |
|---|---|---|---|
| `hmedia:FirstPerson` | First Person | FIRST-PERSON | Requesting agent's eyeline; "I" perspective prose; immersive mode primary |
| `hmedia:ThirdPerson` | Third Person | THIRD-PERSON | Outside the principal agents; "she/he/they" prose; balanced depiction |
| `hmedia:Omniscient` | Omniscient | OMNISCIENT | Access to all holon state including InternalState fragments; analyst and cinematic modes |
| `hmedia:CharacterPerspective` | Character | CHARACTER | Specific named agent other than requester; dialogue simulation, empathy exercises |

### 5.18 Depth of Field Scheme (`hmedia:` namespace — Media)

Used as: `hmedia:depthOfField` on CameraAgent (cardinality 0..1, MAY)

| IRI | Label | Notation | Visual effect |
|---|---|---|---|
| `hmedia:ShallowDOF` | Shallow | SHALLOW | Narrow focus plane; subject sharp, background soft; portrait and close-up |
| `hmedia:NormalDOF` | Normal | NORMAL | Standard depth; subject and immediate environment sharp; balanced |
| `hmedia:DeepDOF` | Deep | DEEP | Full frame sharp; cartographic and establishing shots; spatial clarity throughout |

### 5.19 Camera Preset Individuals (`hmedia:` namespace — Media)

Named `hmedia:CameraAgent` individuals serving as defaults for the four
`hproj:RenderingModeScheme` values. Implementations SHOULD assert `hmedia:cameraRef`
pointing to these presets on NowGraphs produced for clients with a declared
rendering mode, unless a more specific camera is registered.

| IRI | Label | Rendering Mode | sensorType | shotType | perspective | depthOfField |
|---|---|---|---|---|---|---|
| `hmedia:CinematicDefault` | Cinematic Default Camera | `hproj:CinematicMode` | VisualSensor | EstablishingShot | Omniscient | DeepDOF |
| `hmedia:ImmersiveDefault` | Immersive Default Camera | `hproj:ImmersiveMode` | VisualSensor | MediumShot | ThirdPerson | ShallowDOF |
| `hmedia:ActiveInferenceDefault` | Active Inference Default Camera | `hproj:ActiveInferenceMode` | TextualSensor | — | Omniscient | — |
| `hmedia:CartographicDefault` | Cartographic Default Camera | `hproj:ExplodedViewMode` | CartographicSensor | BirdsEye | Omniscient | DeepDOF |


---

## 6. Cross-Reference: Class → Shape → Required Properties

A quick lookup table for each instantiable class, its validating shape, and
the minimum required properties for a conformant instance.

| Class | Shape | Required properties |
|---|---|---|
| `holon:HomeHolon` | HomeHolonShape | rdfs:label, registrationStatus, serverEndpoint, registryGraph, vocabularyEndpoint |
| `holon:IndexHolon` | IndexHolonShape | rdfs:label, registrationStatus, registryGraph |
| `holon:AgentHolon` | AgentHolonShape | rdfs:label, registrationStatus |
| `holon:OrganisationHolon` | OrganisationHolonShape | rdfs:label, registrationStatus |
| `holon:PlaceHolon` | PlaceHolonShape | rdfs:label, registrationStatus |
| `holon:DataHolon` | DataHolonShape | rdfs:label, registrationStatus (payloadGraph strongly SHOULD) |
| `holon:ProcessHolon` | ProcessHolonShape | rdfs:label, registrationStatus |
| `holon:GroundingRecord` | GroundingRecordShape | sourceString, matchType, groundingConfidence (+ matchedIRI unless NoMatch) |
| `holon:Portal` | PortalShape | rdfs:label, sourceHolon, portalTarget, portalStatus |
| `holon:PortalLock` | PortalLockShape | rdfs:label, at least one of: activationCondition / traversalPolicy / requiredCapability |
| `holon:PortalTraversalRecord` | PortalTraversalRecordShape | traversalPortal, traversalAgent, traversalTime, traversalOutcome (+ denialReason on denial) |
| `hev:AssertionEvent` | AssertionEventShape | rdfs:label, targetHolon, assertedAt, receivedAt, prov:wasGeneratedBy, assertionPayload |
| `hev:CommandEvent` | CommandEventShape | rdfs:label, targetHolon, assertedAt, receivedAt, prov:wasGeneratedBy, commandPayload |
| `hev:ObservationEvent` | ObservationEventShape | rdfs:label, targetHolon, assertedAt, receivedAt, prov:wasGeneratedBy, observationPayload |
| `hev:CommandRejected` | CommandRejectedShape | rdfs:label, targetHolon, assertedAt, receivedAt, prov:wasGeneratedBy, causedBy, rejectionReason |
| `hev:ViolationEvent` | ViolationEventShape | rdfs:label, targetHolon, assertedAt, receivedAt, prov:wasGeneratedBy, causedBy, violationReport |
| `hprov:IngestionActivity` | IngestionActivityShape | rdfs:label, transformerType, transformerIRI |
| `hprov:DerivationActivity` | DerivationActivityShape | rdfs:label, transformerType, transformerIRI, derivedFromHolon (1..*) |
| `hbayes:BeliefState` ⚠ | BeliefStateShape | rdfs:label, prior, posterior, precision |
| `hbayes:FreeEnergy` ⚠ | FreeEnergyShape | rdfs:label, complexity, accuracy |
| `hbayes:PolicySelection` ⚠ | PolicySelectionShape | rdfs:label, selectedPolicy, expectedFreeEnergy |
| `hpol:BoundaryPolicy` | BoundaryPolicyShape | odrl:uid, rdfs:label, ≥1 permission or prohibition; each permission needs action + assignee |
| `hpol:PortalPolicy` | PortalPolicyShape | odrl:uid, rdfs:label, ≥1 permission with hpol:traverse action + assignee |
| `hvc:HolonCredential` | HolonCredentialShape | vc:issuer, vc:validFrom, vc:credentialSubject (Holon IRI) |
| `hvc:HolonPresentation` | HolonPresentationShape | vc:verifiableCredential (≥1), hvc:presentedBy (AgentHolon) |
| `hproj:NowGraph` † | NowGraphShape | rdfs:label, projectionType, validAt, requestingAgent, prov:wasGeneratedBy, contentFormat, sceneGraphBlock |
| `hproj:DepictionProjection` † | DepictionProjectionShape | rdfs:label, projectionType, validAt, requestingAgent, prov:wasGeneratedBy, contentFormat, derivedFromNowGraph, renderingMode, (at least one of contentGraph / contentURI / contentLiteral) |
| `hproj:OutputProduct` † | OutputProductShape | rdfs:label, projectionType, validAt, requestingAgent, prov:wasGeneratedBy, contentFormat |
| `hproj:ProjectionActivity` † | ProjectionActivityShape | rdfs:label, transformerType, transformerIRI |
| `hproj:CartographerActivity` † | CartographerActivityShape | rdfs:label, transformerType, transformerIRI, usedNowGraph, usedPromptBlock |
| `hproj:PromptBlock` † | PromptBlockShape | rdfs:label, registrationStatus, declaredOutputModality |

⚠ Bayesian or Markov conformance class; at-risk.
† Projection conformance class.
‡ Media conformance class.

| `hmk:MarkovBlanket` ⚠ | MarkovBlanketShape | hasSensoryStates (1..*), shields (MUST unless sensorOnly), rdfs:label |
| `hmk:SensoryState` ⚠ | SensoryStateShape | rdfs:label, updateTimestamp |
| `hmk:ActiveState` ⚠ | ActiveStateShape | rdfs:label, activationTimestamp |
| `hmk:Utterance` ⚠ | UtteranceShape | rdfs:label, generatedFromActiveState (SHOULD) |
| `hmedia:MediaContext` | MediaContextShape | rdfs:label, mediaBase |
| `hmedia:MediaAsset` | MediaAssetShape | rdfs:label, assetIRI, mimeType |
| `hmedia:SceneDescriptor` | SceneDescriptorShape | rdfs:label |
| `hmedia:CameraAgent` | CameraAgentShape | rdfs:label, updateTimestamp, sensorType |

⚠ Bayesian or Markov conformance class; at-risk.
† Projection conformance class.

---

## 7. Architectural Invariants Summary

The following normative constraints apply across the whole specification:

1. **Envelope / payload separation** — Infrastructure shapes validate the holon and event envelope only. Domain content lives in `holon:payloadGraph`. Never mix the two layers.

2. **Reifier labelling** — Every named reifier IRI MUST carry at least one `rdfs:label`. Blank node reifiers are non-conformant.

3. **Named IRI identity** — All holons, portals, locks, events, and policies MUST have named IRIs. Blank nodes are not permitted as subjects in HGA infrastructure triples.

4. **Event ordering** — Implementations MUST NOT assume events arrive in `assertedAt` order. Out-of-order delivery MUST be handled without error. `assertedAt` MUST NOT be conflated with `receivedAt`.

5. **Boundary vs portal** — A boundary (SHACL shapes graph) governs what is valid *within* a holon. A portal governs *movement between* holons. These are independent mechanisms with independent failure modes.

6. **Concern level placement** — `holon:concernLevel` annotates domain assertions in payload graphs, not envelope properties.

7. **Portal traversal protocol** — Traversal proceeds in order: (1) activation condition check, (2) ODRL policy evaluation, (3) execution. Steps 1 and 2 are independent; both must pass.

8. **Vocabulary server requirement** — Every HomeHolon MUST declare a `holon:vocabularyEndpoint` and MUST serve vocabulary DataBooks with content negotiation (Turtle MUST; HTML MUST; JSON-LD SHOULD). A static DataBook fallback MUST be available without network access.

9. **SHACL self-sufficiency** — No SHACL shape in this specification relies on OWL inferred triples for correctness. All shapes are self-sufficient with asserted types only.

10. **Federation deferral** — Cross-server federation is out of scope for HGA v1. Implementations MUST NOT use SPARQL SERVICE across holon server boundaries. The namespace `http://w3id.org/holon/federation/` is reserved for v2.

11. **Projection read-only** — Projections MUST NOT generate mutation events (`hev:AssertionEvent` or `hev:CommandEvent`) against their source holons. The projection layer is strictly read-only with respect to scene graph state. All mutations go through the event pipeline (stages 1–7); projections are products of state, not causes of it.

12. **Sensor-only blankets** — A `hmk:MarkovBlanket` with `hmedia:sensorOnly true` MUST have at least one `hmk:SensoryState` but is NOT REQUIRED to declare `hmk:hasActiveStates` or `hmk:shields`. This pattern is reserved for camera agents and passive sensors (Pass F). Full-agent blankets without `hmedia:sensorOnly` retain the four-surface requirement.

13. **Appearance is generative input, not a caption** — `hmedia:appearance` is a lang-tagged prose rendering hint intended as direct input to the AI Cartographer. It is not a label, caption, or accessibility string. Multiple values per subject (different languages) are permitted. `hmedia:hasMedia` serves the referential (existing asset) use case; both may coexist on the same subject. The Cartographer reads `hmedia:appearance` to generate depiction prose; it reads `hmedia:hasMedia` to reference or embed an existing asset.


---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
