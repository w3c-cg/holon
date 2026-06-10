# Proposed Charter of the Holon Community Group

*W3C Holon Community Group — Founding Document*
*Kurt Cagle, Acting Chair*

---

## Preamble

Systems are everywhere. So are the boundaries between them.

Every meaningful structure — a cell, an organisation, a conversation, a software service, a city — exists simultaneously as a whole in its own right and as a part of some larger whole. This is not a metaphor. It is a structural property of the world we inhabit and the systems we build.

The concept of the *holon* — introduced by Arthur Koestler and extended across systems theory, cybernetics, and complexity science — names this property precisely. A holon is an entity that is both whole and part: irreducible downward, bounded upward, and coherent across the boundary that defines it.

The Holon Community Group (HCG) exists to give that concept a rigorous, implementable, and interoperable specification — one that can serve architects, developers, ontologists, standards bodies, and the broader web community.

---

## Article I — Foundational Principles

### 1.1 The Holon as Whole/Part System

A holon is the manifestation of a whole/part system: a system that can simultaneously be represented as a unified entity. It achieves this by establishing a *boundary* — a delineation that partitions what is *contained* (inside the system) from what is *containing* (outside the system).

This boundary is the holon's defining structural feature. It is not merely a line of demarcation but an active interface: it mediates, filters, and translates everything that crosses it.

### 1.2 Nesting and Adjacency

Holons may be *nested*, forming containment hierarchies in which inner holons inherit conceptual characteristics from the holons that contain them. Shared knowledge propagates inward; boundary constraints apply outward.

Holons may also be *adjacent* — connected without nesting — forming lateral relationships that preserve the integrity of each participating holon while enabling coordinated behaviour.

Both nesting and adjacency are first-class structural relationships in a holon-based architecture.

### 1.3 Semi-Permeability and Mediated Closure

Holons are semi-porous. Information crossing a holon boundary is mediated by that boundary. The internal state of a holon is not directly observable or manipulable from outside; it is accessible only through inbound or outbound messages that represent that state in some fashion.

This makes holons *closed but mediated*, rather than open. The distinction matters: closure protects *tensional integrity* — the holon's capacity to maintain stable coherence under perturbation — while mediation ensures the holon remains capable of processing signals and participating in larger systems.

### 1.4 Holons as Modelling Abstractions

Holons are meta-architectural. They specify a *design pattern*, not an implementation.

Specific implementations may express holons as dynamic bounded hypergraphs, object models, category-theoretic constructs, event-driven applications, RDF named graphs, or other formalisms appropriate to their domain. The holon pattern is substrate-neutral: it describes the structural properties that any valid implementation must preserve, not the machinery by which those properties are achieved.

### 1.5 Passive and Active Holons

*Passive holons* are historical records — stable, immutable representations of a system state at a point in time.

*Active holons* are state machines. They maintain coherence over an extended lifecycle, respond to signals, update their internal state, and project that state through their boundary. An active holon is a *living graph*: a dynamic structure through which agents trace trajectories, crossing boundaries and leaving provenance trails as they do so.

### 1.6 Temporal Coherence

Holons are not solely spatial or structural abstractions — they are temporal ones. Every holon has a lifecycle: inception, active maintenance, and archival or dissolution. This temporal dimension distinguishes holon-based architectures from static ontologies and is integral to their expressive power. The history of a holon — its event log, its state transitions, its boundary crossings — is part of the holon itself.

### 1.7 Declarative Verifiability

A well-formed holon-based architecture is formally verifiable through declarative means before it is instantiated. Constraint algebras, shape languages, and formal validation profiles allow architects to test boundary conditions, inheritance behaviour, and message contracts without committing to action. This "test before commit" property is not an optional feature of holon-based architectures; it is a governance principle.

### 1.8 Boundary Crossing, Consent, and Provenance

Where holons mediate agents — whether human or artificial — boundary crossing implies consent and carries provenance. Holon-based architectures provide a natural substrate for access control, data sovereignty, and auditability. The boundary is not merely a technical feature; it is a site of accountability.

---

## Article II — Purpose and Scope

The Holon Community Group (HCG) is established to pursue the following interconnected objectives:

**2.1 Nomenclature and Ontology**
Establish a consistent nomenclature — comprising both a formal ontology and a supporting taxonomy — to systematically represent the key components of a holon-based architecture (HBA). This nomenclature shall be precise enough to support specification and implementation, and accessible enough to support adoption across disciplines.

**2.2 Theoretical Foundations**
Establish an underlying theoretical algebra for holon-based architectures, drawing on systems theory, graph theory, category theory, and related formal frameworks. This algebra shall provide the mathematical substrate from which architectural properties can be derived and verified.

**2.3 Implementation Reference**
Identify and test different implementations of holon-based architectures across technology stacks, serialisation formats, and deployment environments. The HCG does not endorse a single canonical platform; pluralism of implementation is a design goal, not a limitation.

**2.4 Use Cases and Domain Application**
Identify use cases for holon-based architectures that demonstrate their applicability across industries and organisational contexts. These cases shall serve as both validation tests for the architecture and entry points for domain communities considering adoption.

**2.5 Web Infrastructure**
Develop a web infrastructure that treats holon-based architectures analogously to web pages — addressable, linkable, navigable, and renderable — while orienting that infrastructure toward scenarios, states, and events rather than documents.

**2.6 Neurosymbolic Integration**
Determine how holon-based architectures can serve as a key model for neurosymbolic processing: the grounding semantic layers establishing a world model and record of truth, with AI systems acting as transformers or *animae* of that truth into different representations and modalities.

The HCG holds that this design pattern can significantly mitigate the effects of AI hallucination, at the cost of topical constraint — a trade-off well understood in computing and well worth making in high-stakes applications.

**2.7 Interoperability as First Principle**
Holon-based architectures shall be designed to interoperate with existing web standards — including RDF, JSON-LD, HTTP, SPARQL, SHACL, and their successors — rather than requiring wholesale adoption of new infrastructure. The holon pattern composes with the web; it does not compete with it.

---

## Article III — Scope and Limits

The objectives described in Article II are broad by design. Systems thinking is general; its applications are particular. The HCG does not seek to prescribe the domains to which holon-based architectures apply, nor to restrict the implementation choices of those who adopt them.

What the HCG *does* commit to is the following:

- The HCG produces **specifications** and **reference implementations**, not platforms.
- The HCG works through **open processes**, with outputs available under open licences.
- The HCG engages with existing standards communities rather than duplicating their work.
- The HCG treats holon-based architecture as a **general-purpose systems pattern** — applicable to AI and equally applicable without it.

---

## Article IV — Establishment

It is for the reasons set forth above — the structural generality of the holon concept, its applicability across domains and implementations, its capacity to ground both human and artificial reasoning in coherent, verifiable systems — that we establish the **Holon Community Group**.

---

*Adopted by the founding membership of the W3C Holon Community Group.*
*June 2026*
