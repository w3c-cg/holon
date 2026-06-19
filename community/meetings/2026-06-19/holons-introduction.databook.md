---
title: "Holons: An Introduction"
type: databook
format: markdown
version: 1.4
created: 2026-06-17
revised: 2026-06-18
audience: informed technical generalist
status: open
tags: [holons, systems-thinking, knowledge-graphs, databooks, AI, RDF, SHACL, community-group]
---

# Holons: An Introduction

## What Is a Holon?

A holon is any entity that is **simultaneously a whole in its own right and a part of a larger system** — neither purely reducible to its components, nor purely independent of the systems it belongs to.

The word was coined by Arthur Koestler, combining the Greek *holos* (whole) with the suffix *-on* (particle or part), to capture this dual nature.

> "I have coined the word **holon** for these Janus-faced entities which are simultaneously wholes and parts."
>
> — Arthur Koestler, *The Ghost in the Machine* (1967)

---

## Two Tendencies

Every holon exhibits two complementary but opposing tendencies:

**Self-assertive tendency**
The holon maintains its own identity, structure, and rules. It resists being dissolved into the larger system and preserves its own boundaries and integrity. It acts as an autonomous whole.

**Integrative tendency**
The holon cooperates and coordinates with other holons. It subordinates itself to the needs of the larger system it belongs to, enabling collective function. It acts as a dependent part.

Healthy systems require both tendencies in balance. Remove the self-assertive tendency and the holon is absorbed; remove the integrative tendency and the system fragments.

---

## Holarchies

When holons nest within holons, the resulting structure is called a **holarchy**.

Unlike a traditional hierarchy that ranks entities from top to bottom, a holarchy treats every level as equally real — just differently scoped. There is no absolute top or bottom; only context. Each ring is simultaneously a container and a contained.

### Nature's Holarchy

Nature is the original holarchist:

```
Atom → Molecule → Cell → Organ → Organism → Ecosystem
```

Each level is complete and functional at its own scale, and each is a component of the level above. Remove any level and the system falls apart.

### Organizations as Holarchies

```
Individual → Team → Department → Company → Industry
```

Every employee is simultaneously an autonomous individual and a member of a team, which is part of a department, which is part of a company. Systems such as **Holacracy** and **Team organizations** are built on this recognition — distributing authority while maintaining coherence.

### Emergence

Each level of a holarchy has properties that cannot be found in its parts:

- H₂O molecules have *wetness* — hydrogen and oxygen atoms don't.
- Neural networks *generate thought* — individual neurons don't think.
- Communities *produce culture* — individuals alone cannot create it.

The whole is genuinely greater than the sum of its parts.

### Technology

Software engineering has independently arrived at holonic architecture:

```
Function → Module → Service → Application → Platform
```

Each unit is self-contained (testable, deployable) and composable. Microservices, component-based design, and APIs are all expressions of the same holonic principle.

---

## Key Insights

1. **Wholeness and partness are always relative**, never absolute. Every entity exists at a scale.
2. **New properties emerge at each level** of a holarchy — properties that cannot be found in the parts below.
3. **Healthy systems balance autonomy and integration** — the self-assertive and integrative tendencies must coexist.
4. **This pattern appears across every domain** — nature, organizations, and technology all follow holonic structure.

---

## Why Holons, Why Now

Three forces are converging to make this the right moment for a structured community effort around holon architectures.

**Flat graphs aren't enough.** Existing knowledge graph architectures are powerful but flat — they lack native support for scope, temporality, and nested narrative context. Complex stateful domains (media, logistics, medicine, finance) need something more structured. The holarchy provides that structure without abandoning the open-web graph model.

**The AI integration moment.** Large language models need grounded, scoped context to reason reliably. The demand for structured, bounded context has never been higher — and the convergence of RDF 1.2, SHACL, and MCP now provides the tooling to supply it at scale. Holons are a natural fit: their four aspects map directly onto what LLMs need to reduce hallucination and reason over complex domains.

**Community over vendor.** This is not a moment for a single proprietary implementation. Shared conventions — for messaging, architecture, and interoperability — require a community effort. A W3C Community Group is the right vehicle: open, standards-adjacent, and capable of producing specifications that can later be proposed to the W3C proper.

---

## Beyond Containment: Lateral Connections

In addition to nesting, holons can also connect **laterally** — through interconnected doorways at the same level.

Such connections help focus on differing domains of concern, while still bearing a relationship to the original holon:

- Rooms are holons; hallways connect them laterally.
- Concepts are holons; relationships connect them.
- Cities are holons; routes connect them.

These lateral connections let us navigate between different domains while maintaining context.

---

## Holons as Graphs

Holons naturally form **graphs**. These graphs are:

- **Self-contained:** a clear boundary defines what belongs to the holon. This is a conceptual property — the holon graph model is format-agnostic and does not require the RDF stack, though RDF 1.2 named graphs are a natural implementation vehicle.
- **Temporal:** they record a history of events — changes to the state of items within the graph over time.

### Agents and Trajectories

Items that change within a graph are called **agents** — the observables within the holon. Each time an agent changes state, that is an event. The complete ordered sequence of events for a given agent is its **trajectory** within the holon.

---

## Scope and Entity Declaration

A containing holon may **declare** entities — agents and other items — that its contained holons can **reference**. This is the graph equivalent of scope.

A holon may also include another holon to gain the scope of its already-declared entities, with restrictions on what can be referenced.

### Example: Shared Entities

An employee entity declared within a company holon can be referenced by both an HR holon and an R&D holon — for entirely different purposes:

- **HR Holon** references Employee for: benefits and roles
- **R&D Holon** references Employee for: projects and skills

This is one reason why holons and **semantic graphs** work so well together — both treat entities as meaningful across multiple contexts simultaneously.

---

## The Four Aspects of a Holon

Every holon consists of four design partitions. These are conceptual partitions that define how a holon is structured and observed — not necessarily formal graph structures.

### 1. Scene Graph

The Scene is the **knowledge graph** for the holon — the stage on which the narrative is enacted. It contains:

- **Agents** (characters) — the entities that act and change state
- **Props** — objects that agents interact with
- **Scenery** — the environment and backdrop
- **Portals** — connections to other holons
- **Originating states** — baseline values from which changes are measured

### Agents

An agent is an entity whose **state changes are worth tracking** within a holon. Every agent is an entity; every entity can also be a holon in its own right. Scale is always relative — a person is an agent within an organisation holon, and simultaneously a holon with their own scene, events, and boundary.

The scene graph distinguishes three kinds of entity:

**Agents** are entities whose state the holon tracks over time. Each state change produces an event; the ordered sequence of events for an agent is its **trajectory**.

**Props** are entities the holon references but does not track independently. A prop participates in events — acquired, used, transferred, destroyed — but has no trajectory of its own.

**Scenery** is environmental context the holon assumes without tracking. A room is scenery; a door within it may be a prop or an agent depending on whether its state matters to the holon.

The same entity can be an agent in one holon and a prop in another — agenthood is a scoping decision, not an intrinsic property.

**Holon Agents and AI Agents**

In current AI usage, *agent* implies autonomy and goal-directedness. In holon usage, *agent* means any entity with a trackable identity and state — which includes people, organisations, documents, devices, and physical objects, not only autonomous systems. Where the two coincide — an AI system operating as a tracked entity within a holon — the holon architecture provides exactly what the AI agent needs: a scene, an event log, a boundary, and cameras.

### 2. Event Graph

The Event Graph represents **changes** — what agents say or do, mutations of agent state, invalidation events, clock events, and more. In a stage play, this is the action log of the scene over time. It is also known as the **context graph**.

Event types include:

| Event | Description |
|---|---|
| `act` | An agent speaks, moves, or performs an action |
| `mutate` | An agent's state is updated |
| `invalidate` | A resource or state is retired |
| `clock` | System time advances |

### 3. Boundary

The Boundary represents **constraints** and performs mutations. It governs what may change and how:

- A character can walk through a door, but not a wall
- A key is required to unlock that door (conditional)
- A resource, once used, may not be usable again

In RDF 1.2, this is implemented via **SHACL shapes and rules** — a formal language for expressing permitted and constrained changes within a graph.

### 4. Projection Layer

The Projection Layer is how the holon is seen **from outside** — mediated by cameras within the scene.

A **camera** is a designated observation point within the scene — a defined perspective or query that selects and filters what is visible from a given vantage. Multiple projections are typical for any given holon:

- **Audience view** — the holon as seen from outside
- **Aerial map** — spatial layout of agents from above
- **Agent POV** — the scene as experienced by a specific agent

There will usually be multiple cameras, and thus multiple concurrent projections, for any holon.

### Understanding Cameras

The camera metaphor is deliberate and precise. In a stage production, a camera does not create the scene — it observes it. It has a position, an angle, and a field of view. It can be static or tracking. Multiple cameras can cover the same scene simultaneously, each producing a different output without disturbing what the actors are doing.

In a holon, a camera is a named, declared observation point — a formally specified perspective that selects a slice of the scene graph and presents it to an observer. Technically, a camera corresponds to a SPARQL CONSTRUCT or SELECT query bound to a named projection IRI. But the richer way to think of it is as a **first-class entity within the scene** — something that has an identity, a location relative to agents and props, and a defined field of view.

This matters for three reasons:

**Cameras are scoped, not global.** A camera does not see everything in the scene — it sees what its position and angle allow. An HR holon's camera on an employee shows benefits and role history. An R&D holon's camera on the same employee shows project contributions and skill assessments. Same agent, same underlying data, different projections. Neither camera is more correct than the other; they are addressing different concerns.

**Cameras are persistent, not one-shot.** A camera defined within a holon continues to observe as the event graph evolves. When an agent changes state — a new event is logged — cameras pointing at that agent update their view accordingly. This makes cameras the mechanism by which a holon presents a **live, current view** to the outside world, rather than a static snapshot.

**Cameras are composable.** A camera in a containing holon can aggregate the projections of cameras in its contained holons. A company-level camera might compose the outputs of department-level cameras into a single organisational view. This mirrors how holarchies work: each level provides its own perspective, and those perspectives can be stacked.

The set of cameras defined for a holon constitutes its **projection layer** — the sum of the ways it can be observed from outside. Defining the right cameras is an ontological act: it requires understanding what questions observers will ask, what aspects of the scene are relevant to each, and what should remain opaque.

### Cameras and Portals: Two Kinds of Boundary

Cameras bear the same relationship to projections that portals bear to holons. A **portal** connects one holon to another, allowing agent evolution in the source holon to inform the destination — without exposing the source's internal structure. A **camera** connects a holon to its observers, allowing agent state changes to be projected outward in curated form — without exposing the scene graph directly.

Both are mediation boundaries. Neither carries internal state directly — both carry the *effects* of evolution: what changed, from whose perspective, and to what degree of resolution the receiving side is entitled to see.

In a federated holon network, portals carry events between holons, and cameras determine what those events look like to the receiving side. A destination holon does not see the source's scene — it sees what the source's cameras are pointing at, delivered through the portal. This separation of concerns is what makes holon architectures composable at scale: each holon controls its own projection, and federation is a matter of connecting projections rather than merging graphs.

---

## Open and Closed Holons

Holons can be **open** or **closed**.

### Open Holons

An open holon:
- Accepts events
- Validates inputs
- Presents dynamic views

This is analogous to a **live, in-memory object**.

Open holons use several mechanisms to determine their evolution:

**Bayesian Priors**
Actions informed by previous behaviors — the holon uses history to anticipate what to do next.

**Active Inference**
Measures *surprise* — the degree by which the expected state differs from the active state — driving the system toward lower uncertainty.

**State Machines**
Rules-based transitions define what states are reachable and under what conditions they may be entered.

**External Actors**
Agents controlled from outside the holon — humans or other systems that directly direct its evolution.

### Closed Holons

A closed holon:
- No longer accepts events
- Represents a complete narrative arc
- Or represents an interrupted state caused by violations that could not be recovered from

This is analogous to a **persisted object**.

Once closed, a holon becomes a **record** of that narrative — the script of a play, the transcript of a meeting.

---

## Databooks

Serialising holons is complex. Several holon implementations are moving toward a **databook** approach.

A databook uses **markdown as its substrate**, containing:
- A publishing-oriented **metadata header** (YAML frontmatter)
- Zero or more **code blocks**
- Structured markdown prose

```markdown
---
title: "Employee Holon"
type: databook
state: open
---

# Scene Graph

Agents, props, scenery, portals…

# Event Log

act, mutate, invalidate, clock…

```sparql
SELECT ?agent WHERE {
  ?agent a hol:Character .
}
```

Databooks can carry **all components of an in-flight holon**, or serve as **data holons** — storing taxonomy, schema, queries, update patterns, and other application metadata.

They serve as the **messaging substrate** of a holon architecture, equivalent to:
- An HTML document
- A play script
- A musical score

A triple store or object database can be abstracted as a **deep databook**, or as a store of multiple databooks.

---

## Holons and AI

### Grounding LLMs with Holons

One major cause of LLM **hallucinations** is a lack of scope — too much ambiguity in entity resolution. A set of databooks can provide that scope, identifying:

| Databook capability | Holon aspect |
|---|---|
| Entities currently in play | Scene Graph |
| History of each entity | Event Graph |
| Rules for state transitions | Boundary |
| How information is projected to the user | Projection Layer |

This will not completely eliminate hallucinations, but will make them considerably less likely — especially for chat interactions.

### AI as Author

AI systems can help **compose** both data-centered and holon databooks, using a `skills.md` architecture alongside MCP — minimising authoring cost and complexity considerably.

### Holon Bridges

Holon Bridges provide mechanisms for **retrieving and updating** various data stores, especially when coupled with agentic systems and chat. Dialog-based AI especially benefits from the cues databooks provide in terms of generating final output.

---

## Arenas for Holons

Holons provide a structured foundation for complex, stateful systems across many domains:

- Media and gaming generation and presentation
- Decision support
- Supply chain management
- Medical system monitoring
- Robotic and drone traffic control systems
- Journalism and education
- Marketing and market tracking
- Financial system monitoring
- Distributed private data meshes
- Many others

---

## Holon Community Group

### Goals

1. Refine these models
2. Establish conventions for messaging and holon core architectures
3. Identify different potential implementations and points of commonality between them
4. Develop the foundations for a federated distributed data web, built on top of the World Wide Web

*Year-one success: agreed core vocabulary, at least one reference implementation, and a stable databook format specification open to all participants.*

### Considerations

**Interoperability**
The focus is on interoperability. While early implementations will likely use the RDF 1.2 stack, the architecture itself should be **data-format agnostic**.

**W3C Status**
HCG specifications are not a W3C Endorsed Recommendation, though parts may be presented to the W3C for consideration under their processes at a later date.

**IP Rights**
IP rights policies are yet to be decided, though likely will align with W3C policies with regard to licensing.

### Proposed Working Groups

| Group | Focus | First-year remit |
|---|---|---|
| I — Holon Core Architecture | Foundational models | Define the canonical holon model, vocabulary, and reference patterns across implementations |
| II — Databooks | Messaging substrate | Establish the databook format specification — metadata conventions, code block patterns, and exchange protocols |
| III — Holon Network Architecture | Federation | Design federation and distribution protocols for connected holon systems across the web |
| IV — Validation / Verification / Security | Constraints | Define constraint languages, verification rules, and security boundaries — SHACL and beyond |
| V — Industry Utilisation | Domain applications | Develop domain-specific profiles and reference implementations for target sectors |

Suggestions are open for other groups, or for consolidating these.

### Meeting Cadence

The Holon Community Group meets twice monthly, on alternating Fridays, 7:00–9:00 AM Pacific / 15:00–17:00 GMT / 16:00–18:00 CET. This schedule makes meetings accessible to participants in Western and Central Europe without unreasonable early starts on the Pacific coast.

A third monthly session will be scheduled at a time accessible to participants in Eastern Europe, the Middle East, and the Asia-Pacific region. The time for this session will be determined once membership distribution is established.

All meetings are open to HCG members. Agendas are published to the GitHub repository at least 48 hours in advance. Minutes are published to the repository within one week of each meeting.

Working groups meet independently at cadences agreed by their members, and report to the full group at each plenary session.

---

*Holon Community Group · 2026*
