---
title: "HGA Agents: Entities, Trajectories, and Scope"
type: databook
format: markdown
version: 1.0
created: 2026-06-18
revised: 2026-06-18
audience: technical
status: draft
tags: [holons, agents, entities, trajectories, HGA, scene-graph, AI-agents]
---

# HGA Agents: Entities, Trajectories, and Scope

## Definition

An agent is an entity whose **state changes are worth tracking** within a holon. This is a deliberately functional definition — whether something is an agent depends not on what it is, but on what the containing holon needs to know about it.

Formally:

- Every agent is an entity
- Every holon is an entity
- An agent may itself be a holon
- Whether an entity is treated as an agent is a scoping decision made by the containing holon

Scale is always relative. A person is an agent within an organisation holon, and simultaneously a holon with their own scene, events, boundary, and cameras. Neither relationship precludes the other.

---

## Agents, Props, and Scenery

The scene graph distinguishes three categories of entity by their relationship to tracking:

**Agents** are entities whose state the holon tracks over time. Each state change produces an event; the ordered sequence of events for an agent is its **trajectory**. Agents are the dynamic substrate of the holon — what happens to and through them constitutes the holon's narrative.

**Props** are entities the holon references but does not track independently. A prop participates in events — it can be acquired, used, transferred, or destroyed — but the holon maintains no trajectory for it. The prop's state is implicit in the events that involve it.

**Scenery** is environmental context the holon assumes without tracking. A room is scenery; a door within it may be a prop or an agent depending on whether its state (locked, unlocked, broken) is relevant to the holon's purpose.

### The Contextual Nature of Agenthood

The same entity can occupy different roles in different holons:

- A **key** in a dungeon holon is typically a prop — it participates in events (picked up, used, dropped) but has no independent trajectory. In a logistics holon tracking provenance and custody of physical objects, the same key is an agent with a full trajectory from manufacture through retirement.
- A **potion** consumed in combat is a prop in the combat holon — destroyed by an event recorded on the consuming character. In a supply chain holon tracking alchemical inventory, the same potion is an agent tracked from production through custody to consumption.
- A **document** is scenery in a holon where it provides background context, a prop in a holon where it is referenced but not tracked, and an agent in a holon where its revision history, access log, or approval state matters.

The principle: **an entity becomes an agent when the containing holon declares it as one.** This is a scoping decision, not an ontological claim.

---

## Trajectories

An agent's **trajectory** is the ordered sequence of events that record its state changes within a holon. A trajectory is:

- **Bounded** — it begins when the agent is declared within the holon and ends when the holon closes or the agent is retired
- **Append-only** — events are added to the trajectory but not modified; the event graph is a record, not a mutable state
- **Queryable** — the current state of an agent is derived by traversing its trajectory; point-in-time states are recoverable by truncating the traversal

In RDF 1.2, a trajectory is naturally represented as a named graph of reified events, where each event carries a timestamp, an agent IRI, and a typed payload describing the state change.

---

## Holon Agents vs. AI Agents

The word *agent* carries significant weight in current AI discourse, where it typically refers to an autonomous system capable of taking actions in pursuit of goals — an LLM with tool access, a planning system, a robotic controller.

Holon agents are a related but distinct concept:

| Dimension | AI Agent | Holon Agent |
|---|---|---|
| Defining property | Autonomy and goal-directedness | Trackable identity and state |
| Examples | LLM with tools, planning system | Person, organisation, document, device, AI system |
| Relationship to holons | May operate within a holon | Is declared within a holon |
| Trajectory | May or may not be tracked | Always tracked (by definition) |

An AI agent is almost always a holon agent. A holon agent is not necessarily an AI agent. Where the two coincide — an autonomous AI system declared as a tracked entity within a holon — the holon architecture provides exactly the scaffolding required: a scene to act in, an event log of its actions, a boundary constraining what it may do, and cameras projecting its behaviour to observers.

This distinction matters for governance. A holon boundary can constrain what an AI agent is permitted to do, make its actions auditable via the event graph, and expose its behaviour to oversight via cameras — all without requiring the AI agent to be aware of the holon structure it operates within.

---

## Agent Identity

Agent identity is persistent across events and must be stable within a holon. In RDF 1.2, agents are identified by IRI. Key properties:

- An agent IRI is **scoped to the holon** — the same real-world entity may have different agent IRIs in different holons, corresponding to the different aspects of its identity that each holon tracks
- Agent IRIs must be **dereferenceable** within the holon's named graph structure
- An agent that is itself a holon exposes a **portal IRI** through which its containing holon can reference its state without accessing its internal structure

---

## Relation to the Four Aspects

Agents touch all four aspects of a holon:

| Aspect | Agent relationship |
|---|---|
| Scene Graph | Agents are declared here; their originating states are baseline values |
| Event Graph | Agent state changes are recorded here as typed events |
| Boundary | Constraints govern what state changes are permitted for each agent |
| Projection Layer | Cameras select which agent states and trajectories are visible to observers |

---

*Holon Community Group — HGA Model Reference · 2026*
*For introduction-level treatment see: holons-introduction.databook.md*
