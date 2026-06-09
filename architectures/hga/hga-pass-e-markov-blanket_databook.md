---
id: http://w3id.org/holon/spec/markov-blanket
title: "HGA Markov Blanket — Agent State Partition, Projection, and Signal Routing"
type: spec-section
version: 0.3.0
created: 2026-06-06
updated: 2026-06-09
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
domain: http://w3id.org/holon/markov/
subject:
  - Markov blanket
  - active inference
  - free energy principle
  - projection
  - agent participation state
  - signal routing
  - holarchy
  - SHACL 1.2
  - RDF 1.2 reification
description: >
  Normative vocabulary and SHACL 1.2 shapes for the HGA Markov Blanket layer.
  Defines the four-surface state partition (InternalState, ExternalState,
  SensoryState, ActiveState) that grounds agent participation in holonic
  evolution. Introduces MarkovBlanket as the formal apparatus separating an
  agent's internal model from its environment, ParticipationRecord as the
  resumable agent state snapshot, PropagationSignal as the mechanism by which
  unabsorbed prediction error traverses the holarchy (with polarity: distress
  and resolution), CoregulationRecord as the precursor condition for holonic
  emergence from agent interaction, and Utterance as a first-class active state
  emission for communicative acts. Defines bridge properties
  (hmk:generatedFromActiveState, hmk:addressedToSensoryState) that wire
  hproj:Projection and hmk:Utterance artefacts into the Markov blanket surface
  architecture without duplicating the hproj: vocabulary. Distinguishes between
  Utterances (speech acts from InternalState — requests, declarations,
  testimony) and narrative DepictionProjections (world-state renderings from the
  hproj: vocabulary). This pass is the architectural foundation for the HGA
  Projection pass (Pass E — §2) and completes the active inference loop begun
  in the Bayesian pass (Pass D — §1). Shapes validate structural integrity only;
  the mathematics of active inference are domain responsibilities.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass E — §1"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - bayesian
    - markov
  rfc2119: true
  at-risk: true
  part-of: http://w3id.org/holon/spec/
  amends:
    - http://w3id.org/holon/spec/ontology-header
    - http://w3id.org/holon/spec/core-structure
graph:
  namespace: http://w3id.org/holon/markov/
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: false
shapes:
  - http://w3id.org/holon/markov/#shapes
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-06T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

> **At risk:** This entire section may be removed or substantially modified
> before CG Report publication, pending stabilisation of the `hspec:HGAMarkov`
> conformance class. A SPARQL UPDATE fallback for every SHACL rule is
> maintained in §6 of this DataBook.

---

## 1. Design Principles

### 1.1 Scope

This section defines the Markov blanket vocabulary for the HGA. The Markov
blanket is the formal apparatus that separates an agent's internal cognitive
state from its environment in a way that makes active inference mathematically
well-defined. Without it, a holon boundary is a container edge — a topological
fact. With it, a holon boundary becomes a structured epistemic interface with
four distinct surfaces, each with defined read/write semantics.

This pass depends on:

- `holon:` core vocabulary (Pass B — §1) — `AgentHolon`, `Boundary`
- `hev:` event vocabulary (Pass C — §1) — `ObservationEvent`, `AssertionEvent`
- `hbayes:` Bayesian vocabulary (Pass D — §1) — `BeliefState`, `FreeEnergy`, `PolicySelection`

### 1.2 The Boundary / Blanket Distinction

The Markov blanket is **not** the same as `holon:Boundary`. They are
orthogonal concepts that address different concerns:

| | `holon:Boundary` | `hmk:MarkovBlanket` |
|---|---|---|
| **Concern** | Access policy — what may pass | Epistemic partition — how states relate |
| **Governs** | Portal permissions, ODRL rules | Internal/sensory/active/external surfaces |
| **Violation** | Agent crosses a boundary without permission | Internal state directly read by external agent |
| **Domain** | Architecture | Cognitive science / active inference |

A holon may have a `holon:Boundary` without a `hmk:MarkovBlanket`. An
`AgentHolon` participating in active inference MUST have both.

### 1.3 The Four-Surface Partition

A Markov blanket partitions all states associated with a system into four
mutually exclusive surfaces:

```
External η  ─writes─▶  Sensory s  ─reads─▶  Internal μ
Internal μ  ─writes─▶  Active  a  ─writes─▶  External η
```

- **Internal states (μ)** — the agent's generative model, BeliefState
  records, prior distributions, and policy repertoire. Conditionally
  independent of external states given the blanket. MUST NOT be directly
  readable by external agents; accessible only via Projections from active states.

- **External states (η)** — the containing holon, peer agents, distal events.
  Conditionally independent of internal states given the blanket. All
  influence mediated through the blanket surfaces.

- **Sensory states (s)** — the inward-facing surface. Written by external
  events; read by the internal model. `hev:ObservationEvent` payloads
  arrive here.

- **Active states (a)** — the outward-facing surface. Written by the
  internal model; read by the environment. Projections, epistemic
  actions, and **utterances** originate here. `hev:AssertionEvent`,
  `hev:CommandEvent`, and `hmk:Utterance` payloads are emitted from
  this surface.

The conditional independence property — Internal ⊥ External | Blanket — is
the invariant that makes this partition meaningful. SHACL shapes enforce the
structural preconditions; implementations maintain it at the data level.

### 1.4 Participation State

An agent's **participation record** is the minimum state required to resume
participation in a holon's evolution after suspension. It captures the
current internal state (a `hbayes:BeliefState` snapshot), the last sensory
state received, any pending active state not yet emitted, and a timestamp.
Agents that suspend participation SHOULD write a `hmk:ParticipationRecord`
to their home holon's registration graph.

### 1.5 Holonic Emergence from Agent Interaction

Two agents interacting do **not** automatically create a new holon. Emergence
requires three conditions:

1. **Persistence** — the interaction has duration exceeding a deployment threshold.
2. **Self-reference** — each agent's blanket develops a `hmk:CoregulationRecord`
   referencing the other.
3. **Boundary requirement** — the interaction generates state that neither
   agent's individual boundary can adequately contain.

`hmk:CoregulationRecord` tracks coupling strength and duration. When
`hmk:coregulationStrength` exceeds a threshold and `hmk:coregulationDuration`
exceeds a window, `hmk:emergenceCandidate` is set `true` — signalling that a
new `holon:Holon` SHOULD be constituted.

### 1.6 Relationship to `hbayes:` Vocabulary

| `hmk:` concept | `hbayes:` relationship |
|---|---|
| `hmk:InternalState` | Contains one or more `hbayes:BeliefState` records |
| `hmk:ActiveState` | Emits `hbayes:PolicySelection` results |
| `hmk:PropagationSignal` | Triggered when `hbayes:freeEnergy` exceeds threshold |
| `hmk:ParticipationRecord` | Snapshots `hbayes:BeliefState` at suspension |

### 1.7 Relationship to `hproj:` Vocabulary

The `hproj:` namespace (Pass E — §2) defines the concrete projection artefact
classes (`hproj:Projection`, `hproj:NowGraph`, `hproj:DepictionProjection`,
`hproj:OutputProduct`) and all their properties. The `hmk:` namespace does
**not** define a `Projection` class and does **not** duplicate `hproj:`
vocabulary.

Instead, `hmk:` defines two **bridge properties** that attach Markov blanket
surface semantics to existing `hproj:` artefacts:

| `hmk:` bridge property | Attaches to | Links to |
|---|---|---|
| `hmk:generatedFromActiveState` | `hproj:Projection` | `hmk:ActiveState` |
| `hmk:addressedToSensoryState` | `hproj:Projection` | `hmk:SensoryState` |

This design keeps the namespaces orthogonal: `hproj:` owns the projection
artefact vocabulary; `hmk:` owns the blanket surface wiring. An
`ActiveState` links to its current `hproj:Projection` output via
`hmk:projectionOutput`. The `hproj:Projection` artefact in turn carries
`hmk:generatedFromActiveState` and `hmk:addressedToSensoryState` to record
which blanket surfaces were involved.

The `hmk:ProjectionPurpose` concept class and its individuals
(`hmk:CurrentStatePurpose`, `hmk:PredictiveView`, `hmk:SummaryView`,
`hmk:EpistemicQuery`) represent the **epistemic intent** behind a projection —
*why* the agent is projecting — which is orthogonal to the `hproj:`
`ProjectionTypeScheme` that describes *what kind of artefact* was produced.
A `hmk:CurrentStatePurpose` projection typically produces a `hproj:NowGraph`
artefact; a `hmk:PredictiveView` projection produces a
`hproj:PredictiveProjection` (defined in Pass E — §2).

> **Note on naming:** `hmk:CurrentStatePurpose` is deliberately named to avoid
> confusion with `hproj:NowGraph`, which is a class of projection artefacts.
> The purpose individual describes epistemic intent; the class describes the
> computational output.

### 1.9 Utterances as Active State Emissions

An **utterance** is a communicative act emitted from an agent's `ActiveState`
surface and received at another agent's `SensoryState` surface. Utterances are
a third type of active state output alongside Projections and epistemic queries.

The distinction between an `hmk:Utterance` and an `hproj:Projection` is:

| | `hproj:Projection` | `hmk:Utterance` |
|---|---|---|
| **What it is** | A computed view of internal state | A speech act |
| **Communicates** | What the agent knows/predicts | What the agent intends/requests |
| **Examples** | NowGraph, DepictionProjection | Request, declaration, testimony |
| **Changes world?** | Rarely — primarily observational | Often — may trigger state changes |
| **Modelled in** | `hproj:` namespace (Pass E §2) | `hmk:` namespace (this pass) |

**Narrative utterances** — descriptive prose about world state produced by a
narrator or game master — are modelled as `hproj:DepictionProjection` rather
than `hmk:Utterance`. The distinction: an Utterance is a speech act from an
agent's InternalState (communicating intent, requesting, declaring). A narrative
depiction is a rendering of world state (observational, not intentional).
"May I take the scroll?" is an Utterance. "The room is quiet" is a
DepictionProjection.

Utterance content updates the receiving agent's `hmk:SensoryState` as a
testimony observation. It does NOT directly update any external RDF triple —
the world-state change, if any, results from the *response* to the utterance,
not the utterance itself. The event graph records state changes; an unresponded
utterance leaves no annotated triple.

**Utterance intent types** (from `hmk:UtteranceIntentScheme`):

| Individual | Communicative function |
|---|---|
| `hmk:RequestIntent` | Asking for something ("May I take the scroll?") |
| `hmk:DeclarationIntent` | Asserting a commitment ("I leave with Aldric") |
| `hmk:QuestionIntent` | Seeking information ("Do you want to leave?") |
| `hmk:TestimonyIntent` | Providing unprompted information (Wight β: "Malachar does not deserve what he has made us") |
| `hmk:AcknowledgementIntent` | Social acknowledgement without propositional content |

### 1.10 PropagationSignal Polarity

The session record for The Crypt of Nightfall revealed a vocabulary gap: the
destruction of the False Amulet generated a `hmk:PropagationSignal` with
**negative** `hmk:residualError` (−0.18) — the dungeon holon registering that
a constraint had been removed and entropy was decreasing. This is architecturally
distinct from the conventional distress signal (positive residual error, model
under load).

Two subclasses formalise the distinction:

- **`hmk:DistressPropagation`** — a signal emitted when prediction error
  exceeds the blanket's local model capacity and propagates upward. Residual
  error is positive. The containing holon's model is updated with additional
  uncertainty.

- **`hmk:ResolutionPropagation`** — a signal emitted when a constraint or
  source of systemic uncertainty has been removed, reducing the holon's
  expected free energy. Residual error is negative. The containing holon's
  model is updated with reduced uncertainty. This is not an agent model
  failure; it is the dungeon (or any open holon) running its own inference
  step in response to a change that improves its generative model's fit.

A new property `hmk:signalPolarity` links a `PropagationSignal` to one of
two named individuals: `hmk:DistressSignal` or `hmk:ResolutionSignal`.

### 1.11 Sensor-Only Blankets and Camera Agents

The canonical four-surface partition (§1.3) assumes a full agent: internal
model, sensory surface, active surface, and external environment. This is
correct for `AgentHolon` participants engaged in active inference.

However, the `hmedia:` vocabulary (Pass F) introduces `hmedia:CameraAgent`
— a passive sensor that extends `hmk:SensoryState`. A camera perceives the
holon's state and produces observations (`hev:ObservationEvent`) whose
output is a media asset. It does not deliberate, plan, or emit active state
projections. It is a *perceiver*, not an *actor*.

To accommodate this pattern without weakening the full-agent invariant, a
`hmk:MarkovBlanket` MAY be declared as **sensor-only** by asserting
`hmedia:sensorOnly true`. A sensor-only blanket:

- MUST have at least one `hmk:SensoryState` (enforced `sh:Violation`)
- is NOT REQUIRED to have `hmk:ActiveState` or `hmk:InternalState` (relaxed to `sh:Warning`)
- NEED NOT shield an `AgentHolon` — it may instead reference an `hmedia:CameraAgent` via `hmk:shields` (relaxed to `sh:Warning`)

The `hmedia:sensorOnly` property is defined in the `hmedia:` namespace (Pass F)
and imported here only as a constraint guard. Processors that do not load
Pass F treat the property as unknown and apply the full four-surface rule.

This maintains backward compatibility: existing blankets without
`hmedia:sensorOnly` are unaffected. The relaxation fires only when the
property is explicitly declared.

### 1.8 Required Amendments to Prior Passes

**Amendment to Pass A (Ontology Header):** Add `hmk:` to the namespace
registry and ontology declarations. Add `hspec:HGAMarkov` conformance class.
Add `hmk:` to the import graph at level 2 (imports `holon:`, `hev:`,
`hbayes:`).

**Amendment to Pass B (Core Structure):** Add `holon:blanket`
(`owl:ObjectProperty`, domain `holon:AgentHolon`, range `hmk:MarkovBlanket`)
and `holon:participationRecord` (`owl:ObjectProperty`, domain
`holon:AgentHolon`, range `hmk:ParticipationRecord`). Add optional property
shapes to `holon:AgentHolonShape`.

---

## 2. Vocabulary Declarations

<!-- databook:id: markov-vocabulary -->
<!-- databook:graph: http://w3id.org/holon/markov/#vocabulary -->
<!-- mode=normative norm=true conformance=markov rfc2119=MUST spec-status=at-risk -->
```trig
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hbayes:  <http://w3id.org/holon/bayesian/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

GRAPH <http://w3id.org/holon/markov/#vocabulary> {

  # ── Classes ──────────────────────────────────────────────────────────────────

  hmk:MarkovBlanket a owl:Class ;
      rdfs:label   "Markov Blanket"@en ;
      rdfs:comment
          "A four-surface partition separating an AgentHolon's internal states from its environment. Comprises sensory states (inward-facing, written by the environment), active states (outward-facing, written by the agent), internal states (the agent's model and beliefs, inaccessible to the environment), and external states (the rest of the world, accessible to the agent only via sensory states). All causal influence between internal and external states is mediated through the blanket surfaces."@en ;
      sh:agentInstruction
          "A MarkovBlanket is the epistemic skin of an AgentHolon. Look at hasSensoryStates to understand what the agent observes; look at hasActiveStates to understand what the agent emits. Internal states are private — they are the agent's beliefs, not directly accessible to any external agent. To know what the agent believes about the world, read its Projection, not its BeliefState directly."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:InternalState a owl:Class ;
      rdfs:label   "Internal State"@en ;
      rdfs:comment
          "A state inside the Markov blanket. Conditionally independent of external states given the blanket surfaces. Carries the agent's generative model, BeliefState records, prior distributions, and policy repertoire. MUST NOT be directly readable by external agents."@en ;
      sh:agentInstruction
          "InternalState is the agent's private cognitive workspace. It contains BeliefState records from hbayes: and the agent's policy repertoire. You cannot directly inspect another agent's InternalState; access is via the Projections the agent emits."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:ExternalState a owl:Class ;
      rdfs:label   "External State"@en ;
      rdfs:comment
          "A state outside the Markov blanket. Conditionally independent of internal states given the blanket surfaces. Represents the containing holon, peer agents, and distal events the agent cannot directly observe or act upon."@en ;
      sh:agentInstruction
          "ExternalState describes the world outside the agent. The agent cannot directly read or write these states; it receives filtered observations via SensoryState and influences the world via ActiveState."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:SensoryState a owl:Class ;
      rdfs:label   "Sensory State"@en ;
      rdfs:comment
          "The inward-facing surface of the Markov blanket. Written by external events; read by the internal model. The sole channel through which external states influence internal states. ObservationEvent payloads arrive here. The agent reads sensory states to update its BeliefState (variational inference step)."@en ;
      sh:agentInstruction
          "SensoryState is the observation landing surface. When an ObservationEvent arrives at an agent, its payload populates a SensoryState. The agent then runs its Bayesian update — computing the posterior given the observation. If constructing an ObservationEvent, its destination is the target agent's SensoryState surface."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:ActiveState a owl:Class ;
      rdfs:label   "Active State"@en ;
      rdfs:comment
          "The outward-facing surface of the Markov blanket. Written by the internal model (the output of PolicySelection); read by the environment. The sole channel through which internal states influence external states. Projections originate here. Epistemic actions (SPARQL queries, API calls, escalation events) are emitted from this surface."@en ;
      sh:agentInstruction
          "ActiveState is the action emission surface. When a PolicySelection resolves, the winning policy writes to an ActiveState. From there it generates a Projection or triggers an epistemic action (AssertionEvent, CommandEvent, or query). This is where agent decisions become external effects."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:ParticipationRecord a owl:Class ;
      rdfs:label   "Participation Record"@en ;
      rdfs:comment
          "A resumable snapshot of an agent's participation state at a given moment. Captures the current BeliefState (μ), the last SensoryState received (s), any pending ActiveState not yet emitted (a), and a timestamp. Sufficient to resume participation in a holon's evolution after suspension. Written to the agent's HomeHolon registration graph at suspension time."@en ;
      sh:agentInstruction
          "A ParticipationRecord is a checkpoint. When an agent suspends participation it writes one of these; when it resumes it reads it back. internalStateSnapshot gives the belief state at suspension; pendingActiveState gives any queued actions that must be emitted before computing the next PolicySelection."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:Utterance a owl:Class ;
      rdfs:label   "Utterance"@en ;
      rdfs:comment
          "A communicative act emitted from an agent's ActiveState surface and received at another agent's SensoryState surface. An Utterance is a speech act — it requests, declares, questions, or testifies — as distinct from a Projection (which renders internal state for observation). Utterance content populates the receiving agent's SensoryState as a testimony observation. World-state changes, if any, result from the response to the utterance, not the utterance itself: an unresponded utterance leaves no annotated triple in the shared event graph."@en ;
      sh:agentInstruction
          "An Utterance is what an agent says. It originates from an ActiveState (generatedFromActiveState) and arrives at a SensoryState (addressedToSensoryState). To understand what was said, read utteranceContent. To understand why it was said, read utteranceIntent. If there is a causedStateChange link, the utterance triggered a world-state change — follow that link to see what changed. If there is no causedStateChange, the utterance was either unresponded or its effect was purely internal to the receiving agent's belief state."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:UtteranceIntent a owl:Class ;
      rdfs:label   "Utterance Intent"@en ;
      rdfs:comment "Concept class for communicative intent individuals. Describes the speech act function of an Utterance — what the speaker is doing with the words, not what the words mean."@en .

  # ── Utterance Intent individuals ─────────────────────────────────────────────

  hmk:RequestIntent a hmk:UtteranceIntent ;
      rdfs:label   "Request"@en ;
      rdfs:comment "The speaker is asking for something — an object, permission, information, or action. A Request addressed to an agent with appropriate capacity may trigger a world-state change (the thing being requested is provided)."@en .

  hmk:DeclarationIntent a hmk:UtteranceIntent ;
      rdfs:label   "Declaration"@en ;
      rdfs:comment "The speaker is asserting a commitment or establishing a fact by the act of saying it. A Declaration creates an obligation or expectation that constrains future actions ('I leave with Aldric — we never come back.')."@en .

  hmk:QuestionIntent a hmk:UtteranceIntent ;
      rdfs:label   "Question"@en ;
      rdfs:comment "The speaker is seeking information. A Question typically triggers an Utterance in response, which may or may not carry the sought information."@en .

  hmk:TestimonyIntent a hmk:UtteranceIntent ;
      rdfs:label   "Testimony"@en ;
      rdfs:comment "The speaker is providing unprompted information from their own experience or knowledge. Testimony updates the receiving agent's InternalState (memory) without necessarily triggering a world-state change. ('Malachar does not deserve what he has made us.')"@en .

  hmk:AcknowledgementIntent a hmk:UtteranceIntent ;
      rdfs:label   "Acknowledgement"@en ;
      rdfs:comment "The speaker is signalling reception or recognition without propositional content. An Acknowledgement typically leaves no annotated triple — its entire effect is social/relational and internal to the agents involved."@en .

  hmk:NarrativeIntent a hmk:UtteranceIntent ;
      rdfs:label   "Narrative"@en ;
      rdfs:comment "The speaker is describing a state of affairs for observational purposes. Narrative utterances from a narrator or game master role are better modelled as hproj:DepictionProjection than as hmk:Utterance. This intent is reserved for cases where a narrative utterance originates from a participating agent (rather than an omniscient narrator) and carries the agent's own perspective."@en .

  hmk:DistressSignal a owl:NamedIndividual ;
      rdfs:label   "Distress Signal"@en ;
      rdfs:comment "PropagationSignal polarity: positive residual error. The emitting agent's local model could not absorb the prediction error. The containing holon's model is updated with additional uncertainty."@en .

  hmk:ResolutionSignal a owl:NamedIndividual ;
      rdfs:label   "Resolution Signal"@en ;
      rdfs:comment "PropagationSignal polarity: negative residual error. A constraint or source of systemic uncertainty has been removed. The containing holon's model is updated with reduced uncertainty. This is not a model failure — it is the holarchy registering that something has been repaired."@en .

  hmk:DistressPropagation a owl:Class ;
      rdfs:subClassOf hmk:PropagationSignal ;
      rdfs:label   "Distress Propagation"@en ;
      rdfs:comment "A PropagationSignal emitted when prediction error exceeds the blanket's local model capacity. residualError is positive. The receiving holon's model is updated with additional uncertainty load."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:ResolutionPropagation a owl:Class ;
      rdfs:subClassOf hmk:PropagationSignal ;
      rdfs:label   "Resolution Propagation"@en ;
      rdfs:comment "A PropagationSignal emitted when a constraint or uncertainty source is removed from the holarchy. residualError is negative. The receiving holon's model updates toward reduced uncertainty. Emerged from the session record of The Crypt of Nightfall — the destruction of the False Amulet generated the first observed ResolutionPropagation."@en ;
      hspec:specStatus hspec:AtRisk .

  # ── Utterance Properties ──────────────────────────────────────────────────────

  hmk:utteranceContent a owl:DatatypeProperty ;
      rdfs:label   "utterance content"@en ;
      rdfs:domain  hmk:Utterance ;
      rdfs:range   xsd:string ;
      dcterms:description
          "The literal text of the utterance. MAY be a natural language string. SHOULD be present when the utterance carries propositional content (Request, Declaration, Question, Testimony). MAY be absent for Acknowledgement utterances where the content is purely performative."@en .

  hmk:utteranceIntent a owl:ObjectProperty ;
      rdfs:label   "utterance intent"@en ;
      rdfs:domain  hmk:Utterance ;
      rdfs:range   hmk:UtteranceIntent ;
      dcterms:description
          "The communicative intent of this utterance. SHOULD reference an individual from hmk:UtteranceIntentScheme. Distinguishes what the speaker is doing (requesting, declaring, questioning) from what the words say."@en .

  hmk:inResponseTo a owl:ObjectProperty ;
      rdfs:label   "in response to"@en ;
      rdfs:domain  hmk:Utterance ;
      rdfs:range   hmk:Utterance ;
      dcterms:description
          "Links this utterance to the utterance it responds to, enabling dialogue threading. An utterance without inResponseTo is an initiating utterance. The chain of inResponseTo links reconstructs the dialogue sequence."@en .

  hmk:causedStateChange a owl:ObjectProperty ;
      rdfs:label   "caused state change"@en ;
      rdfs:domain  hmk:Utterance ;
      dcterms:description
          "Links an utterance to the annotated triple or event node representing the world-state change that resulted from this utterance being acted upon. If absent, the utterance either went unresponded or its entire effect was internal to the receiving agent's BeliefState. The state change is caused by the *response* to the utterance, not by the utterance itself — this link is a convenience attribution."@en .

  hmk:utteranceOutput a owl:ObjectProperty ;
      rdfs:label   "utterance output"@en ;
      rdfs:domain  hmk:ActiveState ;
      rdfs:range   hmk:Utterance ;
      dcterms:description
          "Links an ActiveState to the Utterance it generated. Parallel to hmk:projectionOutput. An ActiveState MAY produce either an Utterance or a Projection on a given activation, or both in sequence. Prior utterances SHOULD be archived to the event graph."@en .

  hmk:signalPolarity a owl:ObjectProperty ;
      rdfs:label   "signal polarity"@en ;
      rdfs:domain  hmk:PropagationSignal ;
      dcterms:description
          "Whether this PropagationSignal represents a distress emission (positive residualError — model under load) or a resolution emission (negative residualError — uncertainty decreasing). SHOULD reference hmk:DistressSignal or hmk:ResolutionSignal. When absent, positive residualError implies hmk:DistressSignal by default."@en .

  # ── PropagationSignal ─────────────────────────────────────────────────────────

  hmk:PropagationSignal a owl:Class ;
      rdfs:label   "Propagation Signal"@en ;
      rdfs:comment
          "A prediction error signal that has exceeded the agent's local model capacity and propagates upward through the holarchy. Generated when hbayes:freeEnergy rises above hmk:propagationThreshold. Traverses from the agent's ActiveState surface to the containing holon's SensoryState surface. The level at which the signal is finally absorbed determines the structural scope of the anomaly."@en ;
      sh:agentInstruction
          "A PropagationSignal is a surprise too large for the local model to absorb. Its forFreeEnergy link gives the energy that triggered it; propagatesTo gives the destination. The structural scope of an anomaly equals the level in the holarchy at which the signal is finally absorbed."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:CoregulationRecord a owl:Class ;
      rdfs:label   "Coregulation Record"@en ;
      rdfs:comment
          "Records persistent coupling between two agents whose Markov blankets have developed sustained mutual influence. When coregulationStrength exceeds a deployment threshold and coregulationDuration exceeds a minimum window, emergenceCandidate is set true: a signal that a new Holon SHOULD be constituted. Conditions for emergence: (1) persistence, (2) self-reference (each agent models the other), (3) shared state requiring its own boundary."@en ;
      sh:agentInstruction
          "A CoregulationRecord signals that two agents may be constituting a new holon between them. Check emergenceCandidate: if true, consider whether a new Holon should be registered. coregulationStrength [0,1] measures systematic coupling. High values indicate a productive relationship that may require its own architectural boundary."@en ;
      hspec:specStatus hspec:AtRisk .

  hmk:ProjectionPurpose a owl:Class ;
      rdfs:label   "Projection Purpose"@en ;
      rdfs:comment "Concept class for epistemic purpose individuals that describe *why* an agent generates a projection — the intent behind the act of projecting. Orthogonal to hproj:ProjectionTypeScheme, which describes the type of artefact produced. Deployments MAY extend with additional purpose individuals."@en .

  # ── Purpose individuals ───────────────────────────────────────────────────────

  hmk:CurrentStatePurpose a hmk:ProjectionPurpose ;
      rdfs:label   "Current State Purpose"@en ;
      rdfs:comment "Epistemic intent: project the agent's best estimate of the present state of the domain, with no temporal extension. Typically produces a hproj:NowGraph artefact. Note: this individual is named hmk:CurrentStatePurpose (not hmk:NowGraph) to avoid confusion with hproj:NowGraph, which is a class of projection artefacts defined in Pass E — §2."@en .

  hmk:PredictiveView a hmk:ProjectionPurpose ;
      rdfs:label   "Predictive View"@en ;
      rdfs:comment "Epistemic intent: project the agent's forward model — expected future state. Typically produces a hproj:PredictiveProjection artefact (defined in Pass E — §2)."@en .

  hmk:SummaryView a hmk:ProjectionPurpose ;
      rdfs:label   "Summary View"@en ;
      rdfs:comment "Epistemic intent: project a compressed representation of past state across a temporal window."@en .

  hmk:EpistemicQuery a hmk:ProjectionPurpose ;
      rdfs:label   "Epistemic Query"@en ;
      rdfs:comment "Epistemic intent: project to resolve uncertainty — the projection is an epistemic action whose purpose is to reduce the receiving agent's ambiguity about some state."@en .

  # ── MarkovBlanket Properties ──────────────────────────────────────────────────

  hmk:hasSensoryStates a owl:ObjectProperty ;
      rdfs:label   "has sensory states"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   hmk:SensoryState ;
      dcterms:description
          "Links a MarkovBlanket to its inward-facing SensoryState surface nodes. MUST have at least one. Multiple nodes may partition the observation channel by modality or source."@en .

  hmk:hasActiveStates a owl:ObjectProperty ;
      rdfs:label   "has active states"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   hmk:ActiveState ;
      dcterms:description
          "Links a MarkovBlanket to its outward-facing ActiveState surface nodes. MUST have at least one."@en .

  hmk:hasInternalStates a owl:ObjectProperty ;
      rdfs:label   "has internal states"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   hmk:InternalState ;
      dcterms:description
          "Links a MarkovBlanket to its InternalState nodes. SHOULD be declared for blankets participating in active inference. External agents MUST NOT follow this link to read internal state; access is via Projections only."@en .

  hmk:hasExternalStates a owl:ObjectProperty ;
      rdfs:label   "has external states"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   hmk:ExternalState ;
      dcterms:description
          "Links a MarkovBlanket to ExternalState nodes representing the portions of the environment that the blanket models. Informative."@en .

  hmk:shields a owl:ObjectProperty ;
      rdfs:label   "shields"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   holon:AgentHolon ;
      dcterms:description
          "Declares which AgentHolon's internal states this blanket shields. MUST reference exactly one AgentHolon."@en .

  hmk:participatesIn a owl:ObjectProperty ;
      rdfs:label   "participates in"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   holon:Holon ;
      dcterms:description
          "Declares the Holon(s) within which this blanket's agent is an active participant. Each participation SHOULD have a corresponding hmk:ParticipationRecord."@en .

  hmk:propagationThreshold a owl:DatatypeProperty ;
      rdfs:label   "propagation threshold"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   xsd:decimal ;
      dcterms:description
          "The hbayes:freeEnergy value above which this blanket emits a PropagationSignal. MUST be > 0."@en .

  # ── SensoryState Properties ───────────────────────────────────────────────────

  hmk:receivesFrom a owl:ObjectProperty ;
      rdfs:label   "receives from"@en ;
      rdfs:domain  hmk:SensoryState ;
      dcterms:description "Source of observations populating this SensoryState."@en .

  hmk:observationValue a owl:DatatypeProperty ;
      rdfs:label   "observation value"@en ;
      rdfs:domain  hmk:SensoryState ;
      rdfs:range   rdfs:Literal ;
      dcterms:description "The value received in the most recent update."@en .

  hmk:updateTimestamp a owl:DatatypeProperty ;
      rdfs:label   "update timestamp"@en ;
      rdfs:domain  hmk:SensoryState ;
      rdfs:range   xsd:dateTime ;
      dcterms:description "UTC timestamp of the most recent write to this SensoryState."@en .

  hmk:forBlanket a owl:ObjectProperty ;
      rdfs:label   "for blanket"@en ;
      rdfs:range   hmk:MarkovBlanket ;
      dcterms:description "Back-link from a surface state to its MarkovBlanket."@en .

  # ── ActiveState Properties ────────────────────────────────────────────────────

  hmk:emitsTo a owl:ObjectProperty ;
      rdfs:label   "emits to"@en ;
      rdfs:domain  hmk:ActiveState ;
      dcterms:description "Target of this ActiveState's output."@en .

  hmk:activationTimestamp a owl:DatatypeProperty ;
      rdfs:label   "activation timestamp"@en ;
      rdfs:domain  hmk:ActiveState ;
      rdfs:range   xsd:dateTime ;
      dcterms:description "UTC timestamp at which this ActiveState was most recently written by the internal model."@en .

  hmk:projectionOutput a owl:ObjectProperty ;
      rdfs:label   "projection output"@en ;
      rdfs:domain  hmk:ActiveState ;
      rdfs:range   hproj:Projection ;
      dcterms:description "Links an ActiveState to the hproj:Projection artefact it generated. At most one current Projection per ActiveState; prior projections SHOULD be archived to the event graph. The hproj:Projection artefact in turn carries hmk:generatedFromActiveState back-linking to this ActiveState."@en .

  hmk:triggeredPolicy a owl:ObjectProperty ;
      rdfs:label   "triggered policy"@en ;
      rdfs:domain  hmk:ActiveState ;
      rdfs:range   hbayes:PolicySelection ;
      dcterms:description "Links an ActiveState to the PolicySelection that caused it to be written."@en .

  # ── ParticipationRecord Properties ───────────────────────────────────────────

  hmk:participationTimestamp a owl:DatatypeProperty ;
      rdfs:label   "participation timestamp"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   xsd:dateTime ;
      dcterms:description "UTC timestamp at which this snapshot was taken."@en .

  hmk:agent a owl:ObjectProperty ;
      rdfs:label   "agent"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   holon:AgentHolon ;
      dcterms:description "The AgentHolon whose state this record captures."@en .

  hmk:inHolon a owl:ObjectProperty ;
      rdfs:label   "in holon"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   holon:Holon ;
      dcterms:description "The Holon within which this snapshot was taken."@en .

  hmk:internalStateSnapshot a owl:ObjectProperty ;
      rdfs:label   "internal state snapshot"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   hbayes:BeliefState ;
      dcterms:description "The BeliefState at the time of this snapshot. Sufficient for a resuming agent to reconstruct its belief distribution."@en .

  hmk:lastSensoryState a owl:ObjectProperty ;
      rdfs:label   "last sensory state"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   hmk:SensoryState ;
      dcterms:description "The SensoryState most recently received before suspension."@en .

  hmk:pendingActiveState a owl:ObjectProperty ;
      rdfs:label   "pending active state"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   hmk:ActiveState ;
      dcterms:description "An ActiveState written by the internal model but not yet emitted at suspension. A resuming agent MUST emit this state before computing its next PolicySelection."@en .

  hmk:blanketRef a owl:ObjectProperty ;
      rdfs:label   "blanket reference"@en ;
      rdfs:domain  hmk:ParticipationRecord ;
      rdfs:range   hmk:MarkovBlanket ;
      dcterms:description "Back-link to the MarkovBlanket whose state this record captures."@en .

  # ── Bridge Properties — wiring hproj:Projection into hmk: surface architecture ─
  #    These properties have domain hproj:Projection (defined in Pass E — §2).
  #    They live in hmk: because they record Markov-blanket surface connections,
  #    not because they describe the projection artefact structure.

  hmk:generatedFromActiveState a owl:ObjectProperty ;
      rdfs:label   "generated from active state"@en ;
      rdfs:comment "Links a hproj:Projection artefact to the hmk:ActiveState surface that produced it. Establishes that the projection is an authorised output of the shielded agent, not a third-party assertion about the agent's state. Domain: hproj:Projection (Pass E — §2). Range: hmk:ActiveState."@en ;
      dcterms:description
          "An hproj:Projection carrying this property was produced by the named ActiveState. The ActiveState is the outward-facing surface of a MarkovBlanket; this link records which blanket authorised the projection. SHOULD be declared on every hproj:Projection that originates from an agent participating in active inference."@en .

  hmk:addressedToSensoryState a owl:ObjectProperty ;
      rdfs:label   "addressed to sensory state"@en ;
      rdfs:comment "Links a hproj:Projection artefact to the hmk:SensoryState of a receiving agent or containing holon. Records the intended destination within the Markov blanket surface architecture. A projection MAY be addressed to multiple SensoryStates (broadcast). Domain: hproj:Projection (Pass E — §2). Range: hmk:SensoryState."@en ;
      dcterms:description
          "The receiving SensoryState is the inward-facing surface of the destination agent's blanket. Declaring this link enables SPARQL traversal of the complete projection path: ActiveState → hproj:Projection → SensoryState → BeliefState update."@en .

  hmk:projectionPurpose a owl:ObjectProperty ;
      rdfs:label   "projection purpose"@en ;
      rdfs:comment "Links a hproj:Projection artefact to an hmk:ProjectionPurpose individual describing the epistemic intent behind the projection. Domain: hproj:Projection (Pass E — §2). Range: hmk:ProjectionPurpose."@en ;
      dcterms:description
          "Purpose context. SHOULD reference an hmk:ProjectionPurpose individual (hmk:CurrentStatePurpose, hmk:PredictiveView, hmk:SummaryView, or hmk:EpistemicQuery). Orthogonal to hproj:projectionType, which records the artefact type."@en .

  # ── PropagationSignal Properties ──────────────────────────────────────────────

  hmk:propagationSource a owl:ObjectProperty ;
      rdfs:label   "propagation source"@en ;
      rdfs:domain  hmk:PropagationSignal ;
      rdfs:range   hmk:MarkovBlanket ;
      dcterms:description "The MarkovBlanket from whose ActiveState surface this signal was emitted."@en .

  hmk:propagatesTo a owl:ObjectProperty ;
      rdfs:label   "propagates to"@en ;
      rdfs:domain  hmk:PropagationSignal ;
      rdfs:range   hmk:SensoryState ;
      dcterms:description "The SensoryState of the containing Holon to which this signal propagates. Arrives as an ObservationEvent; the containing holon runs its own Bayesian update."@en .

  hmk:signalTimestamp a owl:DatatypeProperty ;
      rdfs:label   "signal timestamp"@en ;
      rdfs:domain  hmk:PropagationSignal ;
      rdfs:range   xsd:dateTime ;
      dcterms:description "UTC timestamp at which this signal was emitted."@en .

  hmk:triggeringFreeEnergy a owl:ObjectProperty ;
      rdfs:label   "triggering free energy"@en ;
      rdfs:domain  hmk:PropagationSignal ;
      rdfs:range   hbayes:FreeEnergy ;
      dcterms:description "The FreeEnergy record whose value exceeded propagationThreshold and triggered this signal."@en .

  hmk:residualError a owl:DatatypeProperty ;
      rdfs:label   "residual error"@en ;
      rdfs:domain  hmk:PropagationSignal ;
      rdfs:range   xsd:decimal ;
      dcterms:description "The signed magnitude of the prediction error propagated to the containing holon. For hmk:DistressPropagation: positive value equal to (hbayes:freeEnergy − hmk:propagationThreshold). For hmk:ResolutionPropagation: negative value representing the reduction in expected free energy at the containing holon level. The containing holon's model is updated with this signed magnitude — positive values add uncertainty load, negative values reduce it."@en .

  # ── CoregulationRecord Properties ────────────────────────────────────────────

  hmk:coregulatingAgent a owl:ObjectProperty ;
      rdfs:label   "coregulating agent"@en ;
      rdfs:domain  hmk:CoregulationRecord ;
      rdfs:range   hmk:MarkovBlanket ;
      dcterms:description "One of the agents in persistent mutual coupling. MUST reference at least two distinct blankets."@en .

  hmk:coregulationStrength a owl:DatatypeProperty ;
      rdfs:label   "coregulation strength"@en ;
      rdfs:domain  hmk:CoregulationRecord ;
      rdfs:range   xsd:decimal ;
      dcterms:description "Normalised measure of sustained mutual influence. Range [0.0, 1.0]."@en .

  hmk:coregulationDuration a owl:DatatypeProperty ;
      rdfs:label   "coregulation duration"@en ;
      rdfs:domain  hmk:CoregulationRecord ;
      rdfs:range   xsd:duration ;
      dcterms:description "Duration of the coupling window over which coregulationStrength was measured."@en .

  hmk:emergenceCandidate a owl:DatatypeProperty ;
      rdfs:label   "emergence candidate"@en ;
      rdfs:domain  hmk:CoregulationRecord ;
      rdfs:range   xsd:boolean ;
      dcterms:description "If true, interaction satisfies the three emergence conditions: persistence, self-reference, and boundary requirement. SHOULD trigger creation of a new Holon."@en .

  # ── Core vocabulary amendments ────────────────────────────────────────────────
  # These extend Pass B and are placed here because they depend on hmk:.

  holon:blanket a owl:ObjectProperty ;
      rdfs:label   "blanket"@en ;
      rdfs:domain  holon:AgentHolon ;
      rdfs:range   hmk:MarkovBlanket ;
      dcterms:description
          "Links an AgentHolon to its MarkovBlanket. An AgentHolon participating in active inference MUST declare exactly one blanket."@en .

  holon:participationRecord a owl:ObjectProperty ;
      rdfs:label   "participation record"@en ;
      rdfs:domain  holon:AgentHolon ;
      rdfs:range   hmk:ParticipationRecord ;
      dcterms:description
          "Links an AgentHolon to its most recent ParticipationRecord. A resuming agent MUST read this record before issuing a new PolicySelection."@en .

}
```

---

## 3. SHACL 1.2 Shapes

<!-- databook:id: markov-shapes -->
<!-- databook:graph: http://w3id.org/holon/markov/#shapes -->
<!-- mode=normative norm=true conformance=markov rfc2119=MUST spec-status=at-risk -->
```trig
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hbayes:  <http://w3id.org/holon/bayesian/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

GRAPH <http://w3id.org/holon/markov/#shapes> {

  # ── MarkovBlanketShape ───────────────────────────────────────────────────────

  hmk:MarkovBlanketShape a sh:NodeShape ;
      sh:targetClass hmk:MarkovBlanket ;
      sh:name   "Markov Blanket"@en ;
      sh:intent "Requires label and at least one SensoryState. ActiveState and AgentHolon link are required unless hmedia:sensorOnly true is asserted (Pass F sensor-only pattern)."@en ;
      sh:agentInstruction
          "A valid MarkovBlanket must have sensory states declared. For full agents, active states and an AgentHolon shield are also required. If hmedia:sensorOnly true is present (camera/sensor pattern from Pass F), active states and the AgentHolon shield are optional and violations are downgraded to warnings."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "MarkovBlanket MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:hasSensoryStates ; sh:minCount 1 ; sh:class hmk:SensoryState ;
          sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "MarkovBlanket MUST declare at least one SensoryState."@en ] ;
      sh:property [ sh:path hmk:propagationThreshold ; sh:maxCount 1 ;
          sh:datatype xsd:decimal ; sh:minExclusive 0.0 ; sh:severity sh:Warning ;
          sh:message "propagationThreshold MUST be > 0 if declared."@en ] ;
      sh:property [ sh:path hmk:participatesIn ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "participatesIn SHOULD reference a valid Holon IRI."@en ] ;

      # Active states — required for full agents, warning-only for sensor-only blankets
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message "MarkovBlanket MUST declare at least one ActiveState unless hmedia:sensorOnly true."@en ;
          sh:prefixes hmk: ;
          sh:select """
              PREFIX hmedia: <http://w3id.org/holon/media/>
              SELECT $this WHERE {
                  FILTER NOT EXISTS { $this hmk:hasActiveStates [] }
                  FILTER NOT EXISTS { $this hmedia:sensorOnly true }
              }
          """ ] ;

      # AgentHolon shield — required for full agents, warning-only for sensor-only blankets
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Warning ;
          sh:message "Full-agent MarkovBlanket SHOULD shield exactly one AgentHolon. Omit only if hmedia:sensorOnly true."@en ;
          sh:prefixes hmk: ;
          sh:select """
              PREFIX hmedia: <http://w3id.org/holon/media/>
              SELECT $this WHERE {
                  FILTER NOT EXISTS { $this hmk:shields [] }
                  FILTER NOT EXISTS { $this hmedia:sensorOnly true }
              }
          """ ] .

  # ── SensoryStateShape ────────────────────────────────────────────────────────

  hmk:SensoryStateShape a sh:NodeShape ;
      sh:targetClass hmk:SensoryState ;
      sh:name   "Sensory State"@en ;
      sh:intent "Requires label and updateTimestamp. SHOULD have receivesFrom and forBlanket."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "SensoryState MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:updateTimestamp ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:dateTime ; sh:severity sh:Violation ;
          sh:message "SensoryState MUST have exactly one updateTimestamp."@en ] ;
      sh:property [ sh:path hmk:receivesFrom ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "SensoryState SHOULD declare its source via receivesFrom."@en ] ;
      sh:property [ sh:path hmk:forBlanket ; sh:maxCount 1 ; sh:class hmk:MarkovBlanket ;
          sh:severity sh:Warning ;
          sh:message "SensoryState SHOULD back-link to its MarkovBlanket."@en ] .

  # ── ActiveStateShape ─────────────────────────────────────────────────────────

  hmk:ActiveStateShape a sh:NodeShape ;
      sh:targetClass hmk:ActiveState ;
      sh:name   "Active State"@en ;
      sh:intent "Requires label and activationTimestamp. SHOULD have emitsTo and forBlanket."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "ActiveState MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:activationTimestamp ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:dateTime ; sh:severity sh:Violation ;
          sh:message "ActiveState MUST have exactly one activationTimestamp."@en ] ;
      sh:property [ sh:path hmk:emitsTo ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "ActiveState SHOULD declare its emission target via emitsTo."@en ] ;
      sh:property [ sh:path hmk:projectionOutput ; sh:maxCount 1 ;
          sh:class hproj:Projection ; sh:severity sh:Warning ;
          sh:message "ActiveState SHOULD link to at most one current hproj:Projection via projectionOutput."@en ] ;
      sh:property [ sh:path hmk:triggeredPolicy ; sh:maxCount 1 ;
          sh:class hbayes:PolicySelection ; sh:severity sh:Warning ;
          sh:message "ActiveState SHOULD link to the PolicySelection that triggered it."@en ] .

  # ── ParticipationRecordShape ──────────────────────────────────────────────────

  hmk:ParticipationRecordShape a sh:NodeShape ;
      sh:targetClass hmk:ParticipationRecord ;
      sh:name   "Participation Record"@en ;
      sh:intent "Requires label, participationTimestamp, agent, and inHolon. SHOULD have internalStateSnapshot and blanketRef."@en ;
      sh:agentInstruction
          "Must declare which agent (hmk:agent), which holon (hmk:inHolon), and when (participationTimestamp). internalStateSnapshot gives the belief state at suspension. pendingActiveState flags a queued action to emit on resumption."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "ParticipationRecord MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:participationTimestamp ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:dateTime ; sh:severity sh:Violation ;
          sh:message "ParticipationRecord MUST have exactly one participationTimestamp."@en ] ;
      sh:property [ sh:path hmk:agent ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:class holon:AgentHolon ; sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "ParticipationRecord MUST reference exactly one AgentHolon."@en ] ;
      sh:property [ sh:path hmk:inHolon ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "ParticipationRecord MUST declare the containing Holon via inHolon."@en ] ;
      sh:property [ sh:path hmk:internalStateSnapshot ; sh:maxCount 1 ;
          sh:class hbayes:BeliefState ; sh:severity sh:Warning ;
          sh:message "ParticipationRecord SHOULD link to a BeliefState snapshot."@en ] ;
      sh:property [ sh:path hmk:blanketRef ; sh:maxCount 1 ;
          sh:class hmk:MarkovBlanket ; sh:severity sh:Warning ;
          sh:message "ParticipationRecord SHOULD back-link to its MarkovBlanket."@en ] ;
      sh:property [ sh:path hmk:pendingActiveState ; sh:maxCount 1 ;
          sh:class hmk:ActiveState ; sh:severity sh:Warning ;
          sh:message "pendingActiveState SHOULD reference a valid ActiveState if declared."@en ] .

  # ── ProjectionBridgeShape — validates hmk: bridge properties on hproj:Projection ─
  # Note: hproj:Projection shapes are defined in Pass E — §2.
  # This shape only validates the hmk: bridge properties when they are present.

  hmk:ProjectionBridgeShape a sh:NodeShape ;
      sh:targetSubjectsOf hmk:generatedFromActiveState ;
      sh:name   "Projection Bridge"@en ;
      sh:intent "When a projection carries hmk:generatedFromActiveState, validates that it references a valid hmk:ActiveState IRI and that hmk:projectionPurpose, if declared, references a valid hmk:ProjectionPurpose."@en ;
      sh:agentInstruction
          "This shape fires on any resource that carries hmk:generatedFromActiveState — meaning it is a projection that was produced by an ActiveState surface. It validates the Markov-blanket wiring properties only; hproj: structural requirements are enforced by the shapes in Pass E — §2."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path hmk:generatedFromActiveState ; sh:minCount 1 ;
          sh:class hmk:ActiveState ; sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "hmk:generatedFromActiveState MUST reference a valid hmk:ActiveState IRI."@en ] ;
      sh:property [ sh:path hmk:addressedToSensoryState ;
          sh:class hmk:SensoryState ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "hmk:addressedToSensoryState SHOULD reference a valid hmk:SensoryState IRI."@en ] ;
      sh:property [ sh:path hmk:projectionPurpose ; sh:maxCount 1 ;
          sh:class hmk:ProjectionPurpose ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "hmk:projectionPurpose SHOULD reference a valid hmk:ProjectionPurpose individual."@en ] .

  # ── UtteranceShape ────────────────────────────────────────────────────────────

  hmk:UtteranceShape a sh:NodeShape ;
      sh:targetClass hmk:Utterance ;
      sh:name   "Utterance"@en ;
      sh:intent "Validates an Utterance. Requires label and generatedFromActiveState. addressedToSensoryState and utteranceIntent SHOULD be present. utteranceContent SHOULD be present for non-Acknowledgement utterances."@en ;
      sh:agentInstruction
          "An Utterance must declare which ActiveState produced it (generatedFromActiveState) and which SensoryState receives it (addressedToSensoryState). utteranceIntent says what kind of speech act this is. utteranceContent carries what was said. causedStateChange, if present, links to the world-state change that resulted."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "Utterance MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:generatedFromActiveState ; sh:minCount 1 ;
          sh:class hmk:ActiveState ; sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "Utterance MUST declare the ActiveState that produced it."@en ] ;
      sh:property [ sh:path hmk:addressedToSensoryState ; sh:minCount 1 ;
          sh:class hmk:SensoryState ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "Utterance SHOULD declare the SensoryState it is addressed to."@en ] ;
      sh:property [ sh:path hmk:utteranceIntent ; sh:maxCount 1 ;
          sh:class hmk:UtteranceIntent ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "Utterance SHOULD declare its communicative intent."@en ] ;
      sh:property [ sh:path hmk:utteranceContent ; sh:maxCount 1 ;
          sh:datatype xsd:string ; sh:severity sh:Warning ;
          sh:message "utteranceContent SHOULD be present for propositional utterances."@en ] ;
      sh:property [ sh:path hmk:inResponseTo ; sh:maxCount 1 ;
          sh:class hmk:Utterance ; sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "inResponseTo SHOULD reference a valid prior Utterance."@en ] ;
      sh:property [ sh:path hmk:causedStateChange ; sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message "causedStateChange SHOULD be an IRI if declared."@en ] .

  # ── PropagationSignalShape ────────────────────────────────────────────────────

  hmk:PropagationSignalShape a sh:NodeShape ;
      sh:targetClass hmk:PropagationSignal ;
      sh:name   "Propagation Signal"@en ;
      sh:intent "Requires label, propagationSource, propagatesTo, signalTimestamp, and residualError (signed: positive for distress, negative for resolution). signalPolarity SHOULD be declared."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "PropagationSignal MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:propagationSource ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:class hmk:MarkovBlanket ; sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "PropagationSignal MUST declare exactly one propagationSource."@en ] ;
      sh:property [ sh:path hmk:propagatesTo ; sh:minCount 1 ;
          sh:class hmk:SensoryState ; sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "PropagationSignal MUST declare at least one propagatesTo SensoryState."@en ] ;
      sh:property [ sh:path hmk:signalTimestamp ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:dateTime ; sh:severity sh:Violation ;
          sh:message "PropagationSignal MUST have exactly one signalTimestamp."@en ] ;
      sh:property [ sh:path hmk:residualError ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:decimal ; sh:severity sh:Violation ;
          sh:message "PropagationSignal MUST have exactly one residualError (non-zero; positive for distress, negative for resolution)."@en ] ;
      sh:property [ sh:path hmk:signalPolarity ; sh:maxCount 1 ;
          sh:nodeKind sh:IRI ; sh:severity sh:Warning ;
          sh:message "PropagationSignal SHOULD declare signalPolarity (hmk:DistressSignal or hmk:ResolutionSignal)."@en ] ;
      sh:property [ sh:path hmk:triggeringFreeEnergy ; sh:maxCount 1 ;
          sh:class hbayes:FreeEnergy ; sh:severity sh:Warning ;
          sh:message "PropagationSignal SHOULD link to the FreeEnergy record that triggered it."@en ] ;

      # DistressPropagation MUST have positive residualError
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message "hmk:DistressPropagation MUST have positive residualError. Use hmk:ResolutionPropagation for negative values."@en ;
          sh:prefixes hmk: ;
          sh:select """
              SELECT $this WHERE {
                  $this a hmk:DistressPropagation ;
                        hmk:residualError ?err .
                  FILTER (?err <= 0.0)
              }
          """ ] ;

      # ResolutionPropagation MUST have negative residualError
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message "hmk:ResolutionPropagation MUST have negative residualError. Use hmk:DistressPropagation for positive values."@en ;
          sh:prefixes hmk: ;
          sh:select """
              SELECT $this WHERE {
                  $this a hmk:ResolutionPropagation ;
                        hmk:residualError ?err .
                  FILTER (?err >= 0.0)
              }
          """ ] .

  # ── CoregulationRecordShape ───────────────────────────────────────────────────

  hmk:CoregulationRecordShape a sh:NodeShape ;
      sh:targetClass hmk:CoregulationRecord ;
      sh:name   "Coregulation Record"@en ;
      sh:intent "Requires label, at least two distinct coregulatingAgent blankets, coregulationStrength [0,1], and coregulationDuration."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [ sh:path rdfs:label ; sh:minCount 1 ; sh:severity sh:Violation ;
          sh:message "CoregulationRecord MUST have at least one rdfs:label."@en ] ;
      sh:property [ sh:path hmk:coregulatingAgent ; sh:minCount 2 ;
          sh:class hmk:MarkovBlanket ; sh:nodeKind sh:IRI ; sh:severity sh:Violation ;
          sh:message "CoregulationRecord MUST reference at least two MarkovBlankets."@en ] ;
      sh:property [ sh:path hmk:coregulationStrength ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:decimal ; sh:minInclusive 0.0 ; sh:maxInclusive 1.0 ;
          sh:severity sh:Violation ;
          sh:message "coregulationStrength MUST be in [0.0, 1.0]."@en ] ;
      sh:property [ sh:path hmk:coregulationDuration ; sh:minCount 1 ; sh:maxCount 1 ;
          sh:datatype xsd:duration ; sh:severity sh:Violation ;
          sh:message "CoregulationRecord MUST have exactly one coregulationDuration."@en ] ;
      sh:property [ sh:path hmk:emergenceCandidate ; sh:maxCount 1 ;
          sh:datatype xsd:boolean ; sh:severity sh:Warning ;
          sh:message "emergenceCandidate MUST be xsd:boolean if declared."@en ] ;

      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message "CoregulationRecord MUST reference at least two distinct MarkovBlanket IRIs."@en ;
          sh:prefixes hmk: ;
          sh:select """
              SELECT $this WHERE {
                  { SELECT $this (COUNT(DISTINCT ?b) AS ?n)
                    WHERE { $this hmk:coregulatingAgent ?b } GROUP BY $this }
                  FILTER (?n < 2)
              }
          """ ] .

}
```

---

## 4. Integration Patterns

### 4.1 Wiring a MarkovBlanket to an AgentHolon

<!-- databook:id: blanket-agent-pattern -->
<!-- mode=example norm=false -->
```turtle
PREFIX holon:  <http://w3id.org/holon/> .
PREFIX hmk:    <http://w3id.org/holon/markov/> .
PREFIX hbayes: <http://w3id.org/holon/bayesian/> .
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#> .

# ── Agent ─────────────────────────────────────────────────────────────────
<urn:agent:enrollment-monitor> a holon:AgentHolon ;
    rdfs:label "Enrolment Monitor Agent"@en ;
    holon:blanket            <urn:blanket:enrollment-monitor> ;
    holon:participationRecord <urn:pr:enrollment-monitor:2026-06-06> .

# ── Markov blanket ────────────────────────────────────────────────────────
<urn:blanket:enrollment-monitor> a hmk:MarkovBlanket ;
    rdfs:label "Blanket: Enrolment Monitor"@en ;
    hmk:shields              <urn:agent:enrollment-monitor> ;
    hmk:hasSensoryStates     <urn:sensory:enrollment-monitor:events> ;
    hmk:hasActiveStates      <urn:active:enrollment-monitor:projection> ;
    hmk:hasInternalStates    <urn:internal:enrollment-monitor:model> ;
    hmk:participatesIn       <urn:holon:university-enrollment> ;
    hmk:propagationThreshold 0.50 .

# ── Sensory surface ───────────────────────────────────────────────────────
<urn:sensory:enrollment-monitor:events> a hmk:SensoryState ;
    rdfs:label "Sensory: enrolment event stream"@en ;
    hmk:forBlanket      <urn:blanket:enrollment-monitor> ;
    hmk:receivesFrom    <urn:holon:university-enrollment> ;
    hmk:updateTimestamp "2026-06-06T00:00:00Z"^^xsd:dateTime .

# ── Active surface ────────────────────────────────────────────────────────
<urn:active:enrollment-monitor:projection> a hmk:ActiveState ;
    rdfs:label "Active: projection and signal emission"@en ;
    hmk:forBlanket          <urn:blanket:enrollment-monitor> ;
    hmk:emitsTo             <urn:holon:university-enrollment> ;
    hmk:activationTimestamp "2026-06-06T00:00:00Z"^^xsd:dateTime .

# ── Internal state ────────────────────────────────────────────────────────
<urn:internal:enrollment-monitor:model> a hmk:InternalState ;
    rdfs:label "Internal: completion confidence model"@en .

# ── Participation record ──────────────────────────────────────────────────
<urn:pr:enrollment-monitor:2026-06-06> a hmk:ParticipationRecord ;
    rdfs:label "Participation: enrolment monitor, 2026-06-06"@en ;
    hmk:agent                <urn:agent:enrollment-monitor> ;
    hmk:inHolon              <urn:holon:university-enrollment> ;
    hmk:blanketRef           <urn:blanket:enrollment-monitor> ;
    hmk:participationTimestamp "2026-06-06T00:00:00Z"^^xsd:dateTime ;
    hmk:internalStateSnapshot  <urn:belief:UIGraduating> .
```

### 4.2 Projection from an ActiveState

The projection artefact is typed as `hproj:NowGraph` (defined in Pass E — §2).
The `hmk:` bridge properties record which blanket surfaces were involved.
The `hproj:` structural properties (`validAt`, `projectionDepth`,
`sceneGraphBlock`, `requestingAgent`) are formally defined in Pass E — §2;
they appear here informatively to show the complete wiring.

<!-- databook:id: projection-pattern -->
<!-- mode=example norm=false -->
```turtle
PREFIX hmk:   <http://w3id.org/holon/markov/> .
PREFIX hproj: <http://w3id.org/holon/projection/> .
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX xsd:   <http://www.w3.org/2001/XMLSchema#> .

<urn:projection:enrollment-monitor:graduation-summary> a hproj:NowGraph ;
    rdfs:label "Projection: completed enrolment chain for JaneDoe"@en ;

    # ── hmk: bridge properties — Markov blanket wiring ───────────────────────
    # Which ActiveState generated this projection (authorised origin)
    hmk:generatedFromActiveState <urn:active:enrollment-monitor:projection> ;
    # Which SensoryState it is addressed to (intended receiver)
    hmk:addressedToSensoryState  <urn:sensory:department-monitor:projections> ;
    # Epistemic intent (why this projection was generated)
    hmk:projectionPurpose        hmk:CurrentStatePurpose ;

    # ── hproj: structural properties (formally defined in Pass E — §2) ───────
    hproj:validAt          "2026-06-06T00:00:00Z"^^xsd:dateTime ;
    hproj:projectionDepth  2 ;
    hproj:sceneGraphBlock  <urn:graph:projection:graduation-summary> ;
    hproj:requestingAgent  <urn:agent:enrollment-monitor> .

# ── Back-link on the ActiveState ────────────────────────────────────────────
# The ActiveState also links forward to the projection artefact.
<urn:active:enrollment-monitor:projection>
    hmk:projectionOutput <urn:projection:enrollment-monitor:graduation-summary> .
```

### 4.4 Utterance from an ActiveState

Shows an Utterance emitted from Lana's combat ActiveState — a Request that
caused a world-state change when Malachar responded to it.

<!-- databook:id: utterance-pattern -->
<!-- mode=example norm=false -->
```turtle
PREFIX hmk:  <http://w3id.org/holon/markov/> .
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#> .

# ── Lana's utterance: asking for the True Amulet ─────────────────────────────
<urn:rpg:utterance/lana-asks-for-amulet> a hmk:Utterance ;
    rdfs:label "Lana asks Malachar for the True Amulet"@en ;
    hmk:generatedFromActiveState <urn:rpg:active/lana:combat> ;
    hmk:addressedToSensoryState  <urn:rpg:sensory/malachar:hearing> ;
    hmk:utteranceIntent          hmk:RequestIntent ;
    hmk:utteranceContent         "Ask for the true amulet."^^xsd:string ;
    hmk:causedStateChange        <urn:rpg:event/Boss_MalacharGivesAmulet> .
    # causedStateChange links to the annotated triple event node:
    # char:Lana dung:hasItem item:AmuletNightfall ~ ev:Boss_MalacharGivesAmulet {| ... |}

# ── Wight β's testimony: unprompted information ───────────────────────────────
<urn:rpg:utterance/wight-testimony> a hmk:Utterance ;
    rdfs:label "Wight β testifies: Malachar does not deserve what he has made us"@en ;
    hmk:generatedFromActiveState <urn:rpg:active/wightB:speech> ;
    hmk:addressedToSensoryState  <urn:rpg:sensory/lana:hearing> ;
    hmk:utteranceIntent          hmk:TestimonyIntent ;
    hmk:utteranceContent         "Malachar does not deserve what he has made us."^^xsd:string .
    # No causedStateChange — testimony updated Lana's InternalState (memory)
    # but did not directly change any external triple. The world-state change
    # (Lana retrieving the hidden potion) was a subsequent action, not caused
    # by this utterance alone.

# ── Dialogue thread: Lana asks Aldric if he wants to leave ───────────────────
<urn:rpg:utterance/lana-asks-aldric> a hmk:Utterance ;
    rdfs:label "Lana asks Aldric whether he wants to leave"@en ;
    hmk:generatedFromActiveState <urn:rpg:active/lana:combat> ;
    hmk:addressedToSensoryState  <urn:rpg:sensory/aldric:hearing> ;
    hmk:utteranceIntent          hmk:QuestionIntent ;
    hmk:utteranceContent         "Aldric. Do you want to leave?"^^xsd:string .

<urn:rpg:utterance/aldric-answers> a hmk:Utterance ;
    rdfs:label "Aldric replies to Lana's question"@en ;
    hmk:generatedFromActiveState <urn:rpg:active/aldric:speech> ;
    hmk:addressedToSensoryState  <urn:rpg:sensory/lana:hearing> ;
    hmk:utteranceIntent          hmk:QuestionIntent ;  # responding question with question
    hmk:utteranceContent         "I don't know what I am outside this room."^^xsd:string ;
    hmk:inResponseTo             <urn:rpg:utterance/lana-asks-aldric> .
    # inResponseTo threads the dialogue — enabling reconstruction of the
    # full exchange from the utterance graph.
```

### 4.5 ResolutionPropagation — Inverse Signal Pattern

Shows a `hmk:ResolutionPropagation` emitted when the False Amulet is
destroyed — the dungeon holon registering reduced uncertainty rather than
increased load.

<!-- databook:id: resolution-propagation-pattern -->
<!-- mode=example norm=false -->
```turtle
PREFIX hmk:    <http://w3id.org/holon/markov/> .
PREFIX hbayes: <http://w3id.org/holon/bayesian/> .
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#> .

<urn:rpg:signal/false-amulet-destroyed> a hmk:ResolutionPropagation ;
    rdfs:label "Resolution: False Amulet destroyed — dungeon entropy decreasing"@en ;
    hmk:propagationSource   <urn:rpg:blanket/lana> ;
    hmk:propagatesTo        <urn:rpg:sensory/gm:observations> ;
    hmk:signalTimestamp     "2026-06-06T21:52:00Z"^^xsd:dateTime ;
    hmk:residualError       -0.18 ;   # negative: uncertainty reducing
    hmk:signalPolarity      hmk:ResolutionSignal .
    # The dungeon open holon receives this signal and updates its own
    # generative model: one constraint enabling Malachar's persistence
    # has been removed. Expected future free energy decreases.
    # This is the dungeon running an inference step — not Lana's model
    # updating, but the containing holon registering a structural change.
```

### 4.3 PropagationSignal Routing

<!-- databook:id: propagation-signal-pattern -->
<!-- mode=example norm=false -->
```turtle
PREFIX hmk:    <http://w3id.org/holon/markov/> .
PREFIX hbayes: <http://w3id.org/holon/bayesian/> .
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#> .

# GPA dip at UIAddArtMajor (FE = −0.23) exceeds threshold (−0.50):
# residualError = (−0.23) − (−0.50) = 0.27 above threshold.

<urn:signal:enrollment-monitor:gpa-dip-2024> a hmk:PropagationSignal ;
    rdfs:label "Propagation: GPA dip at UIAddArtMajor exceeds threshold"@en ;
    hmk:propagationSource   <urn:blanket:enrollment-monitor> ;
    hmk:propagatesTo        <urn:sensory:department-monitor:signals> ;
    hmk:signalTimestamp     "2024-06-01T00:00:00Z"^^xsd:dateTime ;
    hmk:residualError       0.27 ;
    hmk:triggeringFreeEnergy <urn:fe:ArtMajor> .
    # The department-level SensoryState updates the department's BeliefState
    # with magnitude 0.27. If the department model also cannot absorb it,
    # a further PropagationSignal traverses to the university level.
```

### 4.4 CoregulationRecord and Holonic Emergence

<!-- databook:id: coregulation-pattern -->
<!-- mode=example norm=false -->
```turtle
PREFIX hmk:  <http://w3id.org/holon/markov/> .
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX xsd:  <http://www.w3.org/2001/XMLSchema#> .

<urn:coreg:advisor-a:advisor-b:2026> a hmk:CoregulationRecord ;
    rdfs:label "Coregulation: Advisor A and Advisor B, 2026"@en ;
    hmk:coregulatingAgent    <urn:blanket:advisor-a>,
                             <urn:blanket:advisor-b> ;
    hmk:coregulationStrength 0.74 ;
    hmk:coregulationDuration "P6M"^^xsd:duration ;
    hmk:emergenceCandidate   true .
    # emergenceCandidate: true → a new Holon should be constituted for
    # the shared advisor interaction. Their joint student caseload and
    # co-authored recommendations require a boundary of their own.
```

---

## 5. Conformance Class Declaration

<!-- databook:id: markov-conformance-class -->
<!-- mode=normative norm=true conformance=markov rfc2119=MUST spec-status=at-risk -->
```turtle
PREFIX hspec: <http://w3id.org/holon/spec/> .
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
PREFIX dcterms: <http://purl.org/dc/terms/> .
PREFIX sh:    <http://www.w3.org/ns/shacl#> .

hspec:HGAMarkov a hspec:ConformanceClass ;
    rdfs:label "HGA Markov"@en ;
    sh:order 4 ;
    hspec:extends hspec:HGABayesian ;
    hspec:specStatus hspec:AtRisk ;
    dcterms:description """Extends Bayesian. Implementations MUST additionally support:
  (a) MarkovBlanket, SensoryState, ActiveState, InternalState, ExternalState shapes;
  (b) ParticipationRecord shape and checkpoint protocol;
  (c) Projection shape including predictive projection SPARQL constraint;
  (d) PropagationSignal shape and holarchy routing semantics;
  (e) CoregulationRecord shape and emergence candidate flag;
  (f) holon:blanket and holon:participationRecord property shapes on AgentHolon;
  (g) SPARQL UPDATE fallbacks for all Markov SHACL rules."""@en .

hspec:pass-e-markov-blanket a hspec:SpecSection ;
    rdfs:label "Pass E §1: Markov Blanket, Projection, and Signal Routing"@en ;
    dcterms:identifier "http://w3id.org/holon/spec/markov-blanket" ;
    sh:order 9 ;
    hspec:normative true ;
    hspec:conformanceClass hspec:HGAMarkov ;
    hspec:specStatus hspec:AtRisk .
```

---

## 6. SPARQL UPDATE Fallbacks

For Jena 6.0 deployments where SHACL 1.2 Rules are unavailable.
Execute against the relevant named graph. Test on a copy before production use.

<!-- databook:id: markov-sparql-fallbacks -->
<!-- mode=informative norm=false spec-status=stable -->
```sparql
PREFIX hmk:    <http://w3id.org/holon/markov/>
PREFIX hbayes: <http://w3id.org/holon/bayesian/>
PREFIX holon:  <http://w3id.org/holon/>
PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#>

# ── F1: Flag MarkovBlankets missing a SensoryState ────────────────────────
INSERT { GRAPH <urn:hmk:violations> {
    ?b hmk:violates "MarkovBlanket-MissingSensoryState" . }}
WHERE { ?b a hmk:MarkovBlanket .
        FILTER NOT EXISTS { ?b hmk:hasSensoryStates [] } } ;

# ── F2: Flag MarkovBlankets missing an ActiveState ────────────────────────
INSERT { GRAPH <urn:hmk:violations> {
    ?b hmk:violates "MarkovBlanket-MissingActiveState" . }}
WHERE { ?b a hmk:MarkovBlanket .
        FILTER NOT EXISTS { ?b hmk:hasActiveStates [] } } ;

# ── F3: Flag bridge projections missing generatedFromActiveState ──────────
# (hmk:ProjectionBridgeShape equivalent — fires on any resource
#  that carries hmk:addressedToSensoryState without the required source)
INSERT { GRAPH <urn:hmk:violations> {
    ?p hmk:violates "Projection-MissingGeneratedFromActiveState" . }}
WHERE { ?p hmk:addressedToSensoryState [] .
        FILTER NOT EXISTS { ?p hmk:generatedFromActiveState [] } } ;

# ── F5: Flag DistressPropagation with non-positive residualError ───────────
INSERT { GRAPH <urn:hmk:violations> {
    ?s hmk:violates "DistressPropagation-NonPositiveResidual" . }}
WHERE { ?s a hmk:DistressPropagation ; hmk:residualError ?e .
        FILTER (?e <= 0.0) } ;

# ── F5b: Flag ResolutionPropagation with non-negative residualError ─────────
INSERT { GRAPH <urn:hmk:violations> {
    ?s hmk:violates "ResolutionPropagation-NonNegativeResidual" . }}
WHERE { ?s a hmk:ResolutionPropagation ; hmk:residualError ?e .
        FILTER (?e >= 0.0) } ;

# ── F8: Flag Utterances missing generatedFromActiveState ──────────────────
INSERT { GRAPH <urn:hmk:violations> {
    ?u hmk:violates "Utterance-MissingActiveState" . }}
WHERE { ?u a hmk:Utterance .
        FILTER NOT EXISTS { ?u hmk:generatedFromActiveState [] } } ;

# ── F9: Flag full-agent blankets missing ActiveState ──────────────────────
# (sensor-only blankets exempt via hmedia:sensorOnly true)
INSERT { GRAPH <urn:hmk:violations> {
    ?b hmk:violates "Blanket-MissingActiveState" . }}
WHERE {
    ?b a hmk:MarkovBlanket .
    FILTER NOT EXISTS { ?b hmk:hasActiveStates [] }
    FILTER NOT EXISTS {
        ?b <http://w3id.org/holon/media/sensorOnly> true
    }
} ;

# ── F6: Flag CoregulationRecords with fewer than two distinct blankets ────
INSERT { GRAPH <urn:hmk:violations> {
    ?c hmk:violates "CoregulationRecord-InsufficientAgents" . }}
WHERE { ?c a hmk:CoregulationRecord .
        { SELECT ?c (COUNT(DISTINCT ?b) AS ?n)
          WHERE { ?c hmk:coregulatingAgent ?b } GROUP BY ?c }
        FILTER (?n < 2) } ;

# ── F7: Auto-set emergenceCandidate where deployment thresholds exceeded ──
# Adjust ?strengthThreshold (default 0.70) and duration (default P3M).
INSERT { GRAPH ?g { ?c hmk:emergenceCandidate true . }}
WHERE { GRAPH ?g {
    ?c a hmk:CoregulationRecord ;
       hmk:coregulationStrength ?str ;
       hmk:coregulationDuration ?dur .
    FILTER NOT EXISTS { ?c hmk:emergenceCandidate [] }
    FILTER (xsd:decimal(?str) >= 0.70)
    FILTER (?dur >= "P3M"^^xsd:duration) } }
```

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
