---
id: http://w3id.org/holon/spec/namespace-registry
title: "HGA Namespace and Prefix Registry"
type: spec-section
version: 0.1.1
created: 2026-06-04
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
  Canonical namespace and prefix registry for the Holon Graph Architecture.
  Defines all HGA sub-namespaces, their prefix assignments, term naming
  conventions, and content negotiation behaviour. Amendment 0.1.1 adds
  hmk: (Pass E §1 Markov blanket), hproj: (Pass E §2 Projection), and
  hmedia: (Pass F Media) namespace declarations.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass 0 — §2"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - core
  rfc2119: true
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/
  named_graph: http://w3id.org/holon/spec/namespace-registry#graph
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: false
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  timestamp: 2026-06-09T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

## 1. Namespace Design Principles

The HGA namespace scheme follows these normative conventions:

1. **Base authority**: `http://w3id.org/holon/` — W3C Permanent Identifier
   service, registered at `https://github.com/perma-id/w3id.org`.
2. **Sub-namespace paths**: kebab-case (e.g. `active-inference/`, `belief-state/`).
3. **Class term names**: PascalCase (e.g. `AssertionEvent`, `HomeHolon`).
4. **Property term names**: camelCase (e.g. `targetHolon`, `assertedAt`).
5. **Individual / instance names**: kebab-case IRIs (e.g. `hspec:hga-core`).
6. **All term IRIs**: named IRIs — NEVER blank node subjects in vocabulary definitions.
7. **Reifier IRIs**: MUST be named IRIs; blank node reifiers are non-conformant.

> **Important:** Term-level IRIs are stable and unversioned. The spec document
> IRI `http://w3id.org/holon/spec/` carries version metadata; term IRIs do not.
> Versioning is carried in `owl:Ontology` instances, not in term paths.

---

## 2. HGA Sub-Namespace and Prefix Registry

<!-- databook:id: prefix-registry -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

hspec:PrefixRegistryEntry a owl:Class ;
    rdfs:label "Prefix Registry Entry"@en .

hspec:ns-holon a hspec:PrefixRegistryEntry ;
    hspec:prefix        "holon" ;
    hspec:namespaceIRI  "http://w3id.org/holon/" ;
    hspec:conformanceClass "core" ;
    rdfs:label          "HGA Core"@en ;
    dcterms:description "Core holonic structure: Holon, AgentHolon, DataHolon, PlaceHolon, OrganisationHolon, Portal, Boundary, BoundaryLayer, Registration, status values."@en .

hspec:ns-hev a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hev" ;
    hspec:namespaceIRI  "http://w3id.org/holon/event/" ;
    hspec:conformanceClass "core" ;
    rdfs:label          "HGA Events"@en ;
    dcterms:description "Event envelope vocabulary: ObservationEvent, AssertionEvent, CommandEvent; temporal properties assertedAt, receivedAt, expiresAt, validAsOf, targetHolon. RDF 1.2 annotated triple provenance."@en .

hspec:ns-hprov a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hprov" ;
    hspec:namespaceIRI  "http://w3id.org/holon/provenance/" ;
    hspec:conformanceClass "core" ;
    rdfs:label          "HGA Provenance"@en ;
    dcterms:description "PROV-O shape extensions and HGA-specific provenance terms. IngestionActivity, transformer attribution, DataBook processing record."@en .

hspec:ns-hspec a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hspec" ;
    hspec:namespaceIRI  "http://w3id.org/holon/spec/" ;
    hspec:conformanceClass "all" ;
    rdfs:label          "HGA Specification Infrastructure"@en ;
    dcterms:description "Specification metadata, conformance classes, publication status, section registry, dependency records, governance."@en .

hspec:ns-hpol a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hpol" ;
    hspec:namespaceIRI  "http://w3id.org/holon/policy/" ;
    hspec:conformanceClass "extended" ;
    rdfs:label          "HGA Policy"@en ;
    dcterms:description "ODRL policy bindings for holons and portals: PortalPolicy, BoundaryPolicy, AccessPermission, TraversalConstraint."@en .

hspec:ns-hvc a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hvc" ;
    hspec:namespaceIRI  "http://w3id.org/holon/vc/" ;
    hspec:conformanceClass "extended" ;
    rdfs:label          "HGA Verifiable Credentials"@en ;
    dcterms:description "VerifiableCredential wrapper shapes. HolonCredential, identity attestation scaffolding. Stub pending W3C VC 2.0 stabilisation."@en .

hspec:ns-hbayes a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hbayes" ;
    hspec:namespaceIRI  "http://w3id.org/holon/bayesian/" ;
    hspec:conformanceClass "bayesian" ;
    hspec:specStatus    "at-risk" ;
    rdfs:label          "HGA Bayesian"@en ;
    dcterms:description "Active inference and Bayesian update vocabulary: BeliefState, FreeEnergy, PolicySelection, prior, posterior, precision, expectedFreeEnergy."@en .

# ── Added in Pass E §1 amendment ─────────────────────────────────────────

hspec:ns-hmk a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hmk" ;
    hspec:namespaceIRI  "http://w3id.org/holon/markov/" ;
    hspec:conformanceClass "markov" ;
    rdfs:label          "HGA Markov Blanket"@en ;
    dcterms:description "Four-surface agent state partition: MarkovBlanket, InternalState, ExternalState, SensoryState, ActiveState. Utterance as first-class communicative act. PropagationSignal polarity (Distress/Resolution). ParticipationRecord, CoregulationRecord. Bridge to hproj: and hmedia:."@en .

# ── Added in Pass E §2 amendment ─────────────────────────────────────────

hspec:ns-hproj a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hproj" ;
    hspec:namespaceIRI  "http://w3id.org/holon/projection/" ;
    hspec:conformanceClass "projection" ;
    rdfs:label          "HGA Projection"@en ;
    dcterms:description "Projection envelope vocabulary: NowGraph (stage 8), DepictionProjection (stage 9), OutputProduct, ProjectionActivity, CartographerActivity, PromptBlock. Five SKOS schemes: ProjectionType, PersistencePolicy, RenderingMode (Cinematic/Immersive/ActiveInference/ExplodedView), ContentFormat (13 formats), TransmissionMode."@en .

# ── Added in Pass F ───────────────────────────────────────────────────────

hspec:ns-hmedia a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hmedia" ;
    hspec:namespaceIRI  "http://w3id.org/holon/media/" ;
    hspec:conformanceClass "media" ;
    rdfs:label          "HGA Media"@en ;
    dcterms:description "Media asset and appearance vocabulary: MediaContext (project-level asset root), MediaAsset (IRI + MIME + keywords + role), appearance (lang-tagged rendering hint), hasMedia, SceneDescriptor (repeatable event scene composite), CameraAgent (extends hmk:SensoryState). Five SKOS schemes: MediaRole, SensorType (Visual/Audio/Geometric/Cartographic/Textual), ShotType, Perspective, DepthOfField. Conformance class hspec:HGAMedia extends hspec:HGAMarkov."@en .

# ── Reserved ──────────────────────────────────────────────────────────────

hspec:ns-hfed a hspec:PrefixRegistryEntry ;
    hspec:prefix        "hfed" ;
    hspec:namespaceIRI  "http://w3id.org/holon/federation/" ;
    hspec:conformanceClass "reserved" ;
    hspec:specVersion   "v2" ;
    rdfs:label          "HGA Federation (Reserved)"@en ;
    dcterms:description "RESERVED. Cross-server federation vocabulary. Deferred to HGA Federation v1.0. Implementations MUST NOT define terms in this namespace."@en .
```

### 2.1 Summary Table

| Prefix | Namespace IRI | Conformance | Content |
|---|---|---|---|
| `holon:` | `http://w3id.org/holon/` | Core | Holons, portals, boundaries, registration |
| `hev:` | `http://w3id.org/holon/event/` | Core | Event envelopes, temporal properties |
| `hprov:` | `http://w3id.org/holon/provenance/` | Core | PROV-O extensions, ingestion activities |
| `hspec:` | `http://w3id.org/holon/spec/` | All | Spec infrastructure |
| `hpol:` | `http://w3id.org/holon/policy/` | Extended | ODRL policy bindings |
| `hvc:` | `http://w3id.org/holon/vc/` | Extended | VC wrapper shapes |
| `hbayes:` | `http://w3id.org/holon/bayesian/` | Bayesian | Active inference |
| `hmk:` | `http://w3id.org/holon/markov/` | Markov | Markov blanket surfaces, Utterance |
| `hproj:` | `http://w3id.org/holon/projection/` | Projection | NowGraph, depiction, cartographer |
| `hmedia:` | `http://w3id.org/holon/media/` | Media | Assets, appearance, scenes, cameras |
| `hfed:` | `http://w3id.org/holon/federation/` | **Reserved** | Cross-server federation (v2) |

### 2.2 External Vocabulary Prefix Assignments

<!-- databook:id: external-prefix-registry -->
<!-- mode=normative norm=true conformance=core rfc2119=SHOULD -->
```turtle
@prefix owl:  <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

<http://w3id.org/holon/spec/external-prefix-registry>
    owl:imports
        <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ,
        <http://www.w3.org/2000/01/rdf-schema#> ,
        <http://www.w3.org/2002/07/owl#> ,
        <http://www.w3.org/2001/XMLSchema#> ,
        <http://www.w3.org/ns/shacl#> ,
        <http://www.w3.org/ns/prov#> ,
        <http://www.w3.org/2004/02/skos/core#> ,
        <http://www.w3.org/ns/odrl/2/> ,
        <http://purl.org/dc/terms/> ,
        <https://www.w3.org/ns/credentials/> .
```

| Prefix | Namespace IRI | Normative? |
|---|---|---|
| `rdf:` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` | Yes |
| `rdfs:` | `http://www.w3.org/2000/01/rdf-schema#` | Yes |
| `owl:` | `http://www.w3.org/2002/07/owl#` | Yes (OWL 2 RL axioms only) |
| `xsd:` | `http://www.w3.org/2001/XMLSchema#` | Yes |
| `sh:` | `http://www.w3.org/ns/shacl#` | Yes |
| `prov:` | `http://www.w3.org/ns/prov#` | Yes |
| `skos:` | `http://www.w3.org/2004/02/skos/core#` | Yes |
| `odrl:` | `http://www.w3.org/ns/odrl/2/` | Yes (Extended+) |
| `dcterms:` | `http://purl.org/dc/terms/` | Yes |
| `vc:` | `https://www.w3.org/ns/credentials/` | Yes (Extended+) |

---

## 3. w3id.org Registration Artefacts

### 3.1 `.htaccess` File

<!-- databook:id: htaccess -->
<!-- mode=printed norm=false -->
```apache
# HGA Vocabulary Namespace Registration
# Namespace: http://w3id.org/holon/
# Maintainer: Kurt Cagle <kurt.cagle@gmail.com>
# Org: Semantical LLC
# Repository: https://github.com/kurtcagle/holon-spec
# CG: W3C Holon Graph Architecture Community Group
# Updated: 2026-06-09
#
# On W3C Recommendation: update redirect target to https://www.w3.org/ns/holon/

Options +FollowSymLinks
RewriteEngine on

# --- Turtle ---
RewriteCond %{HTTP_ACCEPT} text/turtle [OR]
RewriteCond %{HTTP_ACCEPT} application/x-turtle
RewriteRule ^(.*)$ https://holongraph.com/spec/holon/$1.ttl [R=303,L]

# --- JSON-LD ---
RewriteCond %{HTTP_ACCEPT} application/ld\+json
RewriteRule ^(.*)$ https://holongraph.com/spec/holon/$1.jsonld [R=303,L]

# --- RDF/XML ---
RewriteCond %{HTTP_ACCEPT} application/rdf\+xml
RewriteRule ^(.*)$ https://holongraph.com/spec/holon/$1.rdf [R=303,L]

# --- N-Triples ---
RewriteCond %{HTTP_ACCEPT} application/n-triples
RewriteRule ^(.*)$ https://holongraph.com/spec/holon/$1.nt [R=303,L]

# --- Default: HTML spec page ---
RewriteRule ^(.*)$ https://holongraph.com/spec/holon/$1 [R=303,L]
```

### 3.2 `README.md` for w3id.org PR

<!-- databook:id: w3id-readme -->
<!-- mode=printed norm=false -->
```markdown
# http://w3id.org/holon/

**Namespace for the Holon Graph Architecture (HGA) Vocabulary**

This namespace is maintained by Kurt Cagle / Semantical LLC under the
W3C Holon Community Group (Acting Chair: Kurt Cagle).

- **Specification**: https://holongraph.com/spec/holon/
- **Repository**: https://github.com/kurtcagle/holon-spec
- **Maintainer**: kurt.cagle@gmail.com
- **Licence (ontology)**: CC0-1.0
- **Licence (spec prose)**: W3C Document License

## Sub-namespaces

| Path | Content |
|---|---|
| `/holon/` | Core: Holon, Portal, Boundary, Agent, Place |
| `/holon/event/` | Event envelopes and temporal properties |
| `/holon/provenance/` | PROV-O shape extensions |
| `/holon/spec/` | Specification infrastructure |
| `/holon/policy/` | ODRL policy bindings |
| `/holon/vc/` | Verifiable Credential stubs |
| `/holon/bayesian/` | Active inference vocabulary |
| `/holon/markov/` | Markov blanket surfaces and Utterance |
| `/holon/projection/` | NowGraph, depiction, cartographer |
| `/holon/media/` | Media assets, appearance, cameras (Pass F) |
| `/holon/federation/` | RESERVED — federation v2 |
```

---

## 4. Migration Bridge — `ontologist.io` to `w3id.org/holon/`

All existing deployments using `https://ontologist.io/ns/holon#` MUST load
this bridge graph to maintain conformance.

<!-- databook:id: migration-bridge -->
<!-- databook:graph: http://w3id.org/holon/spec/migration-bridge#graph -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```turtle
@prefix old:   <https://ontologist.io/ns/holon#> .
@prefix holon: <http://w3id.org/holon/> .
@prefix hev:   <http://w3id.org/holon/event/> .
@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

<http://w3id.org/holon/spec/migration-bridge#graph>
    a owl:Ontology ;
    rdfs:label       "HGA Namespace Migration Bridge"@en ;
    dcterms:description "owl:equivalentClass and owl:equivalentProperty declarations bridging the legacy https://ontologist.io/ns/holon# namespace to the canonical http://w3id.org/holon/ namespace."@en ;
    owl:imports <http://w3id.org/holon/> , <http://w3id.org/holon/event/> .

old:AssertionEvent  owl:equivalentClass hev:AssertionEvent .
old:CommandEvent    owl:equivalentClass hev:CommandEvent .
old:CommandRejected owl:equivalentClass hev:CommandRejected .
old:ViolationEvent  owl:equivalentClass hev:ViolationEvent .
old:GroundingRecord owl:equivalentClass holon:GroundingRecord .
old:Agent           owl:equivalentClass holon:AgentHolon .
old:Location        owl:equivalentClass holon:PlaceHolon .
old:Organisation    owl:equivalentClass holon:OrganisationHolon .

old:targetHolon         owl:equivalentProperty hev:targetHolon .
old:assertedAt          owl:equivalentProperty hev:assertedAt .
old:receivedAt          owl:equivalentProperty hev:receivedAt .
old:groundingConfidence owl:equivalentProperty holon:groundingConfidence .
old:matchedIRI          owl:equivalentProperty holon:matchedIRI .
old:sourceString        owl:equivalentProperty holon:sourceString .
old:matchType           owl:equivalentProperty holon:matchType .
```

---

## 5. JSON-LD 1.1 Context Stub

<!-- databook:id: jsonld-context -->
<!-- mode=reference norm=false conformance=core -->
```json-ld
{
  "@context": {
    "@version": 1.1,
    "holon":   "http://w3id.org/holon/",
    "hev":     "http://w3id.org/holon/event/",
    "hprov":   "http://w3id.org/holon/provenance/",
    "hspec":   "http://w3id.org/holon/spec/",
    "hpol":    "http://w3id.org/holon/policy/",
    "hvc":     "http://w3id.org/holon/vc/",
    "hbayes":  "http://w3id.org/holon/bayesian/",
    "hmk":     "http://w3id.org/holon/markov/",
    "hproj":   "http://w3id.org/holon/projection/",
    "hmedia":  "http://w3id.org/holon/media/",
    "rdf":     "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs":    "http://www.w3.org/2000/01/rdf-schema#",
    "owl":     "http://www.w3.org/2002/07/owl#",
    "xsd":     "http://www.w3.org/2001/XMLSchema#",
    "sh":      "http://www.w3.org/ns/shacl#",
    "prov":    "http://www.w3.org/ns/prov#",
    "skos":    "http://www.w3.org/2004/02/skos/core#",
    "odrl":    "http://www.w3.org/ns/odrl/2/",
    "dcterms": "http://purl.org/dc/terms/",
    "vc":      "https://www.w3.org/ns/credentials/"
  }
}
```

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
