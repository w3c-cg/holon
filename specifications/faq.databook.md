---
id: https://w3c-cg.github.io/holon/databooks/holon-faq-v1
title: "Holon Community Group — Frequently Asked Questions"
type: databook
version: 1.0.0
created: 2026-06-04
description: >
  An introductory FAQ for the W3C Holon Community Group, covering the conceptual
  foundations of holon graph architecture, its relationship to the W3C RDF stack,
  and the current status of the Community Group's work.
status: draft
publisher:
  name: W3C Holon Community Group
  url: https://www.w3.org/community/holon/
  github: https://github.com/w3c-cg/holon
editors:
  - name: Kurt Cagle
    affiliation: Semantical LLC
    url: https://www.linkedin.com/in/kurtcagle/
process:
  transformer: "Claude Sonnet 4.6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-04T00:00:00Z
  inputs:
    - iri: urn:input:cg-editorial-guidance
      role: primary
      description: "Editorial guidance and content direction from Kurt Cagle, Acting Chair"
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

---

# Holon Community Group — Frequently Asked Questions

This document provides introductory answers to common questions about the Holon Graph Architecture and the W3C Holon Community Group. It is organised to move from foundational concepts toward more technical and practical concerns. Answers will be expanded and supplemented with links to formal specifications as those documents mature.

> **Note:** This is a living document. Questions and answers will be added, revised, and linked to normative specification sections as the Community Group's work progresses. If you have a question not covered here, please open an issue at <https://github.com/w3c-cg/holon/issues>.

---

## Foundational Concepts

### What is a holon in conceptual terms?

A holon is an entity that is simultaneously a *whole* in its own right and a *part* of some larger whole. The term was coined by Arthur Koestler in his 1967 work *The Ghost in the Machine*, where he argued that this dual nature — wholeness and partness at once — is the fundamental structural pattern of all stable, complex systems, whether biological, cognitive, social, or artefactual.

In the Holon Graph Architecture, this insight is given a formal graph-theoretic expression. A holon is a bounded subgraph that has its own internal knowledge representation, its own contextual identity, its own boundary semantics, and its own set of outward-facing projections. It can contain other holons (making it a *whole* with respect to them) and be contained by outer holons (making it a *part* with respect to those). Crucially, a holon is not merely a named node or a container class — it is a first-class architectural unit with structure, behaviour, and boundary conditions of its own.

### What is a holarchy?

A holarchy is a nested hierarchy of holons. Unlike a conventional hierarchy, which is typically either top-down (a tree of commands) or bottom-up (a tree of parts), a holarchy has no absolute top or bottom: every level is simultaneously a whole and a part, and structure can be read in either direction without privileging one end.

In practical terms, a holarchy in the Holon Graph Architecture is the natural organisational pattern that emerges when holons are composed. A dataset is a holon; the collection of datasets within an enterprise knowledge graph is a holon; the enterprise itself is a holon within a broader information ecosystem. Each level has its own boundary, its own identity, and its own internal graph — but those boundaries are permeable in controlled ways through portals and projection mechanisms.

### What are portals?

A portal is the formal mechanism by which information crosses a holon's boundary. Where a boundary defines what is *inside* a holon and what is *outside*, a portal defines the *terms* on which crossing is permitted — what can pass, in which direction, under what conditions, and with what transformations applied in transit.

Portals are directional: an inbound portal governs what a holon accepts from its environment; an outbound portal governs what it exposes. A portal may enforce schema validation (using SHACL shapes), apply access controls, perform vocabulary translation, or suppress portions of a graph before passing it outward. Portals are the primary mechanism for both federation and security in a holarchic system — they make the boundary an active semantic filter rather than a passive structural line.

### What are agents?

An agent, in the holon model, is a holon that has the capacity to *act* — to initiate assertions, issue commands, modify state, and adapt its behaviour in response to its environment. Agents are not a separate architectural layer; they are holons whose internal structure includes an action-selection mechanism and a model of the world outside their boundary.

The architecture draws on Karl Friston's Active Inference framework and Free Energy Principle as a theoretical grounding for agent behaviour: an agent acts to minimise the divergence between its predictions about the world and its observations of it. In implementation terms, this means an agent holon exposes a set of *command events* as well as *assertion events*, and maintains enough internal state to reason about what actions will best reduce uncertainty. LLMs, rule engines, SPARQL-based reasoners, and human users can all function as agents within the holarchic model.

### What are places?

A place is a holon whose primary organising principle is *spatial or contextual containment* rather than data or agency. Places provide the contextual frame within which other holons — including agents and data holons — operate. They establish the shared environment, the ambient vocabulary, the access norms, and the default assumptions that apply to everything within their boundary.

The concept of place draws from both geographic information systems (where a place is a bounded region with properties) and from the philosophical tradition of *topos* — place as the condition of possibility for the things that occupy it. In a knowledge graph deployment, a place might be a department, a project context, an organisational unit, or a named information domain. Places nest naturally into holarchies and are the primary unit of governance and access control in the architecture.

---

## Internal Structure

### What are the four graphs of a holon?

Every holon is constituted by four distinct but interrelated graph layers:

**1. Knowledge Graph (Domain Layer)**
The knowledge graph contains the primary domain assertions of the holon — the facts, relationships, and data it is responsible for representing. This is the "content" of the holon in the most direct sense, and it is expressed using standard RDF triples or, where provenance annotation is needed, RDF-star reified statements.

**2. Context Graph (Entity / Annotation Layer)**
The context graph carries metadata *about* the entities and assertions in the knowledge graph — provenance, confidence, temporal scope, authorship, and annotation. It provides the epistemic frame for interpreting the domain layer: not just what is asserted, but by whom, when, with what confidence, and under what conditions.

**3. Boundary Graph (Structural / Constraint Layer)**
The boundary graph defines the holon's boundary semantics: what constitutes valid content (SHACL shapes), what portals exist and under what conditions they admit passage, and how the holon composes with neighbouring holons. The boundary graph is the architectural contract between a holon and its environment. It is the layer that makes holons interoperable without requiring shared global schemas.

**4. Projection Graph (View / Presentation Layer)**
A projection is a derived, purpose-specific view of the holon's content — a read-only subset or transformation of the knowledge and context graphs, expressed in terms appropriate for a particular consumer. A holon may have multiple projections: a summary view, a query interface, an API surface, a human-readable rendering. Projections are the mechanism by which a holon exposes its content to agents and places outside its boundary without surrendering its internal structure.

### Are holons open or closed?

Holons are *selectively open*. A holon maintains a boundary that separates its internal state from its environment, but that boundary is not hermetically sealed. Portals define the precise conditions under which information may cross the boundary — inbound or outbound, with what transformations, subject to what validations and access controls.

This selective openness is a deliberate architectural choice. Fully open systems (with no boundaries) cannot maintain coherent local semantics or provide meaningful encapsulation. Fully closed systems cannot federate, cannot receive updates, and cannot participate in larger holarchies. The portal mechanism provides a principled middle path: holons are as open as they need to be for their role in a holarchy, and no more open than their governance policy permits.

### Are holons static or dynamic?

Holons are inherently dynamic. A holon's knowledge graph can be updated as new assertions arrive or old ones are retracted; its context graph tracks the provenance of those changes; its boundary graph can be revised as governance policies evolve; and its projections are recalculated as the underlying content changes.

The architecture includes a formal event model — *assertion events* (which add or modify graph content) and *command events* (which direct agent behaviour) — to capture this dynamism in a structured way. Rather than treating updates as unstructured mutations, the holon model treats every change as a typed, provenance-stamped event that can be queried, replicated, or audited. This makes holons suitable for knowledge systems that must evolve over time without losing their history or their structural integrity.

---

## Comparison and Context

### How are holons like and unlike web pages?

Web pages and holons share a structural intuition: both are bounded documents with an address (a URL or IRI), both can link to other documents, and both are intended to be consumed by agents (browsers, crawlers, humans, or software clients).

The differences, however, are significant. A web page is fundamentally a *presentation artefact* — its content is designed for human rendering, its links are navigation anchors, and its semantics are largely implicit. A holon is a *semantic artefact* — its content is formally typed, its links are typed RDF relationships, and its boundary conditions and composition rules are explicit and machine-readable.

A web page has one primary view. A holon has multiple projections for different consumers. A web page is essentially static once served. A holon is a dynamic entity with an event model and update semantics. A web page has no formal mechanism for validating what it accepts or exposes. A holon's portals enforce schema validation and access control at the boundary. In short: a web page is where you *go*; a holon is what you *reason with*.

### Do you need a knowledge graph engine to run a holon?

Not necessarily — though a knowledge graph engine (a triplestore with SPARQL support) is the natural and recommended infrastructure for deploying holons at scale.

For simple use cases, a holon's knowledge graph can be stored as static Turtle files, queried with a local SPARQL library (rdflib in Python, or an equivalent Node.js library), and validated with a standalone SHACL processor. No persistent triplestore is required for read-only or single-user scenarios.

For production deployments — particularly where holons are updated dynamically, federated across organisational boundaries, or queried by multiple concurrent agents — a triplestore such as Apache Jena (the reference implementation for this architecture) provides the necessary query, update, and transaction infrastructure. The architecture does not mandate a specific engine, but it is designed around the SPARQL 1.2 and RDF 1.2 standards, so any conformant engine can serve as the substrate.

### How do DataBooks fit into the holon architecture?

A DataBook is the primary portable artefact format of the Holon Graph Architecture. It is a Markdown document that simultaneously carries human-readable prose, structured YAML metadata (including identity, provenance, and graph parameters), and typed fenced blocks containing Turtle, SPARQL, SHACL, JSON-LD, prompts, or other payloads.

In holonic terms, a DataBook is itself a holon: it has a boundary (its document structure), an identity (its `id` IRI), a knowledge layer (its data blocks), a context layer (its frontmatter metadata and provenance stamp), and a projection layer (its human-readable prose sections). DataBooks are the mechanism by which holon content is authored, exchanged, validated, pushed to triplestores, and fed to LLMs. A pipeline of DataBooks — where the output of one becomes the input of the next — is a holarchy of portable knowledge artefacts. See the [DataBook specification](https://github.com/kurtcagle/databook) for full details.

### Do holons have to use W3C stack technologies?

No — but the W3C RDF stack (Turtle, SPARQL, SHACL, RDF-star, OWL) is the reference implementation substrate and the basis on which formal specifications are being developed by the Community Group.

The *conceptual* model of holons — bounded, composable, self-similar knowledge structures with portal-mediated boundaries — is substrate-independent. It could in principle be expressed using property graphs (LPG), JSON-LD frames, or other knowledge representation systems. However, the formal specifications this Community Group is producing target the RDF 1.2 stack specifically, because RDF provides the open-world semantics, the globally addressable IRIs, and the standards-based interoperability that holarchic federation requires. Implementations using other substrates are welcome and may produce compatible community notes, but they are outside the primary normative scope.

---

## Operations and Governance

### How are holons secured?

Security in the holon architecture operates at the boundary, through the portal mechanism, rather than as a layer applied uniformly to the whole system.

Each portal in a holon's boundary graph carries an access policy — expressed using standard vocabulary compatible with W3C Access Control and related specifications — that governs who or what may traverse it, in which direction, and under what conditions. A portal can require authentication, enforce role-based access, limit the graph fragments that pass through, or apply vocabulary transformations that strip sensitive identifiers before exposure.

Because security policy is modelled as graph data (in the boundary graph), it is queryable, auditable, and subject to the same versioning and provenance mechanisms as the rest of the holon's content. Encryption of individual DataBook blocks is also supported for transit and storage scenarios. Full formal security profiles are under development by the Community Group.

### Can you use holons with LLMs?

Yes — and this is one of the architecture's most actively developed application areas. LLMs interact with holons in two principal modes.

First, an LLM can function as an *agent* within a holarchy: receiving projections from holons as context, issuing assertion events to update knowledge graphs, and using command events to direct other agents or request information. The DataBook format was specifically designed to be LLM-legible — its combination of prose context, formal data blocks, and SHACL shapes gives a language model the semantic scaffolding it needs to reason reliably about graph content, validate its own outputs, and produce provenance-stamped artefacts.

Second, LLMs can be used to *populate and transform* holon content: converting natural language descriptions into Turtle triples, generating SHACL shapes from prose constraints, translating between vocabularies, and annotating existing graph content with derived metadata. The `databook prompt` command in the DataBook CLI provides a standardised interface for this pattern, wrapping LLM interactions in a full provenance-stamped DataBook pipeline.

---

## Practical and Strategic Questions

### What are some use cases for holons?

The holon architecture is applicable wherever knowledge needs to be represented as composable, boundary-respecting, federated structures that can evolve over time and be consumed by both humans and machines. Illustrative use cases include:

- **Enterprise knowledge graphs** — where departments, projects, and data domains map naturally to holons within an organisational holarchy, with portal-mediated federation replacing brittle schema unification.
- **Scientific data management** — where datasets, experiments, and publications form a holarchy with explicit provenance, and projections expose curated views to different research communities.
- **Regulatory compliance and audit** — where holons model regulatory obligations, organisational responses, and evidence artefacts, with boundary graphs encoding the validation constraints for each compliance domain.
- **Geospatial and smart infrastructure** — where places, sensors, services, and their relationships are modelled as a holarchy of place holons, with dynamic agent holons mediating operational responses.
- **AI-augmented knowledge work** — where LLM agents operate within a holarchic knowledge environment, grounded by formal graph content and constrained by SHACL boundary conditions.

> **See also:** A dedicated use case document is in preparation and will be linked here when published.

### What support exists for holons?

At present, the Holon Graph Architecture and its associated tooling are being actively defined and developed by Kurt Cagle and collaborators at Semantical LLC, with this Community Group serving as the standards venue for that work. Reference implementations include the DataBook CLI (published at <https://github.com/kurtcagle/databook>), and formal ontology and SHACL shape libraries are in preparation.

This Community Group is the primary venue for questions, discussion, issue reporting, and contribution. We are at an early stage, and the shape of the support ecosystem — reference implementations, tooling, documentation, training materials — will be determined by the community's needs and contributions. If you have a use case, an implementation question, or a proposed contribution, the best path is to open an issue or start a discussion on the GitHub repository.

### Are holons currently a standard?

Not yet. The Holon Graph Architecture is currently a *Community Group specification in active development* — it is not a W3C Recommendation or any other form of formal standard.

The W3C Community Group Process allows groups to develop and publish Community Group Reports, which are public specifications produced by W3C community participants. These reports are not endorsed by W3C and do not carry the same normative weight as W3C Recommendations, but they are a recognised pathway for developing specifications that may eventually be proposed to a W3C Working Group for formal standardisation. The Holon CG intends to produce Community Group Reports covering the core ontology, SHACL shape libraries, DataBook specification, and portal/agent/place vocabularies, with formal standardisation as a longer-term goal contingent on adoption and community support.

---

## Document History

| Version | Date | Notes |
|---|---|---|
| 1.0.0 | 2026-06-04 | Initial draft — Kurt Cagle (Acting Chair) |

---

*This document is published by the [W3C Holon Community Group](https://www.w3.org/community/holon/) under the [W3C Community Final Specification Agreement (FSA)](https://www.w3.org/community/about/agreements/fsa/). It is not a W3C Standard and does not carry W3C endorsement. Copyright © 2026 the Contributors to the Holon Community Group.*
