---
id: https://w3c-cg.github.io/holon/README
title: "W3C Holon Community Group"
type: cg-readme
version: 1.0.0
created: 2026-06-04
status: draft
description: >
  Repository README for the W3C Holon Community Group, providing an
  overview of the Holon Graph Architecture, CG scope, leadership,
  and participation information.
publisher:
  name: W3C Holon Community Group
  url: https://www.w3.org/community/holon/
  github: https://github.com/w3c-cg/holon
leadership:
  - role: Acting Chair
    name: Kurt Cagle
    affiliation: Semantical LLC
    url: https://www.linkedin.com/in/kurtcagle/
editors:
  - name: Kurt Cagle
    affiliation: Semantical LLC
    url: https://www.linkedin.com/in/kurtcagle/
license: https://www.w3.org/community/about/agreements/fsa/
---

# Holon Community Group

Welcome to the repository for the **W3C Holon Community Group** (Holon CG). This is the working home for specifications, reference implementations, use cases, and community discussion surrounding the Holon Graph Architecture — a framework for modelling knowledge systems as self-similar, boundary-respecting structures that are simultaneously parts and wholes. We are glad you are here, and we warmly invite your participation.

## About the Holon Graph Architecture

The concept of the holon originates with Arthur Koestler's 1967 work *The Ghost in the Machine*, in which he observed that every stable structure in nature and cognition is simultaneously a whole in its own right and a constituent part of some larger whole. A cell is a complete biological unit; it is also an organ component. A word is a complete linguistic unit; it is also a sentence component. Koestler called these dual-natured entities *holons*, and he proposed that any complex, adaptive system is best understood as a *holarchy* — a nested hierarchy of holons — rather than as either a flat collection of parts or a monolithic whole. The Holon Graph Architecture applies this insight to knowledge representation, treating every node in a graph not merely as a typed resource but as an entity with its own internal structure, boundary semantics, and behavioural scope. The result is a graph model in which containment, delegation, and emergence are first-class architectural concerns rather than modelling conventions.

In practical terms, the architecture grounds these ideas in the W3C RDF 1.2 technology stack — Turtle, SPARQL 1.2, SHACL, and related specifications — and integrates them with Karl Friston's Free Energy Principle and Active Inference framework. Each holon maintains an internal model of its environment and acts to minimise surprise across its boundary; holons compose hierarchically, propagating assertions and commands through well-defined interfaces rather than through unrestricted global state. This makes the architecture well-suited to knowledge graphs that must reason under uncertainty, adapt to changing contexts, and operate across distributed or federated deployments. Reference tooling is being developed for both Node.js and Python environments, targeting the full RDF 1.2 pipeline from ingestion and SHACL validation through SPARQL query and inference.

The Holon Community Group was established to provide a neutral, open forum within W3C for developing and standardising the vocabulary, ontology patterns, and architectural conventions that make holonic graph systems interoperable. The group's scope includes a core Holon Ontology (expressed in OWL/RDFS), canonical SHACL shape libraries for boundary and composition constraints, a DataBook specification for self-describing holonic knowledge artefacts, and best-practice guidance for applying holonic patterns to real-world knowledge graph deployments. The CG welcomes contributions from ontologists, knowledge graph practitioners, AI researchers, and semantic web engineers, and aims to produce community group reports suitable for eventual transition to W3C Working Group status.

## Documentation

There are several documents that help to describe and specify the various aspects of the Holonic Architecture.

* [Frequently Askedd Questions](documentation/FAQ.md)
* _More to come_

---

> **⚠️ Work in Progress**
>
> This repository and the specifications it contains are under active development. Documents, ontologies, and reference implementations will be added and revised iteratively. All content should be treated as a draft until explicitly marked otherwise. We welcome issues, pull requests, and discussion — please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidance.

---

## Repository Contents

| Resource | Description |
|---|---|
| *(specifications/)* | Formal specification documents — forthcoming |
| *(ontology/)* | Holon Core Ontology in Turtle/OWL — forthcoming |
| *(shapes/)* | SHACL shape libraries — forthcoming |
| *(examples/)* | Reference DataBooks and worked examples — forthcoming |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to this work |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community participation expectations |
| [LICENSE.md](LICENSE.md) | Licence terms |

---

## Leadership

| Role | Name | Affiliation |
|---|---|---|
| Acting Chair | [Kurt Cagle](https://www.linkedin.com/in/kurtcagle/) | Semantical LLC |

*Chair status is provisional pending formal confirmation at the group's inaugural meeting.*

## Editors

| Specification | Editor | Affiliation |
|---|---|---|
| Holon Core Ontology | [Kurt Cagle](https://www.linkedin.com/in/kurtcagle/) | Semantical LLC |
| SHACL Shape Libraries | [Kurt Cagle](https://www.linkedin.com/in/kurtcagle/) | Semantical LLC |
| DataBook Specification | [Kurt Cagle](https://www.linkedin.com/in/kurtcagle/) | Semantical LLC |

*Editor assignments will be updated as specifications are scoped and additional contributors join.*

---

## Community Group Links

- **W3C Holon Community Group:** <https://www.w3.org/community/holon/>
- **Join the group:** <https://www.w3.org/community/holon/join>
- **Mailing list:** <https://lists.w3.org/Archives/Public/public-holon/>
- **GitHub repository:** <https://github.com/w3c-cg/holon>

---

## Participation and Licence

By contributing to this repository, you agree to the terms of the [W3C Community Contributor License Agreement (CLA)](https://www.w3.org/community/about/agreements/cla/). Contributions under the CLA allow the Community Group to publish specifications that participants and the broader community can implement freely.

This work is produced by participants in the [W3C Holon Community Group](https://www.w3.org/community/holon/). It is governed by the [W3C Community Group Process](https://www.w3.org/community/about/process/). W3C Community Group specifications are not W3C Standards and do not carry W3C endorsement.

Copyright © 2025–2026 the Contributors to the Holon Community Group specification, published by the [W3C Holon Community Group](https://www.w3.org/community/holon/) under the [W3C Community Final Specification Agreement (FSA)](https://www.w3.org/community/about/agreements/fsa/). A human-readable [summary](https://www.w3.org/community/about/agreements/fsa-deed/) is available.
