---
id: http://w3id.org/holon/spec/
title: "Holon Graph Architecture — Specification Manifest v0.1"
type: spec-manifest
version: 0.1.1
created: 2026-06-04
updated: 2026-06-09
author:
  - name: Kurt Cagle
    iri: https://holongraph.com/people/kurt-cagle
    role: editor
    org: Semantical LLC
    email: kurt.cagle@gmail.com
  - name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: transformer
license:
  prose: "W3C Document License"
  ontology: "CC0-1.0"
domain: http://w3id.org/holon/
description: >
  Top-level manifest for the Holon Graph Architecture (HGA) specification.
  Contains governance statement, licence declarations, forward dependency
  register, conformance class definitions, federation scope statement, and
  the section registry linking to subordinate DataBook artefacts.
  Amendment 0.1.1: adds Pass E §1 (Markov), Pass E §2 (Projection), and
  Pass F (Media) section registry entries and conformance class declarations.
spec:
  document-iri: http://w3id.org/holon/spec/
  status: "Editor's Draft"
  normative: true
  rfc2119: true
  governance:
    path: "W3C Community Group → CG Report → WG Note → Recommendation"
    cg-name: "Holon Graph Architecture Community Group (proposed)"
    ip-policy: "W3C Community Final Specification Agreement (CFSA)"
    namespace-owner: "Kurt Cagle / Semantical LLC (pending CG transfer)"
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  timestamp: 2026-06-09T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

## Abstract

The Holon Graph Architecture (HGA) defines a framework for constructing,
validating, and navigating holonic graph structures — hierarchically organised
knowledge graphs in which each node (a *holon*) is simultaneously a whole and
a part of a larger whole. HGA specifies vocabulary, SHACL shapes, event
envelope structures, provenance patterns, portal navigation, policy bindings,
Markov blanket surfaces, projection artefacts, and media representation
sufficient to implement interoperable holonic graph servers.

This specification is authored entirely as DataBook artefacts, demonstrating
the format it normatively specifies.

---

## Status of This Document

This is an Editor's Draft and has not received W3C review. It is inappropriate
to cite this document as other than a work in progress.

The target publication path is: W3C Community Group Report → W3C Working Group
Note → W3C Recommendation. The namespace `http://w3id.org/holon/` is registered
under the W3C Permanent Identifier service pending CG establishment.

---

## 1. Licence Declarations

<!-- databook:id: licence -->
<!-- mode=normative norm=true conformance=all rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .

hspec:
    a owl:Ontology ;
    dcterms:title   "Holon Graph Architecture Specification"@en ;
    dcterms:created "2026-06-04"^^<http://www.w3.org/2001/XMLSchema#date> ;
    dcterms:creator <https://holongraph.com/people/kurt-cagle> ;
    dcterms:rights  "W3C Document License — specification prose."@en ;
    dcterms:license <https://www.w3.org/copyright/document-license-2023/> .

<http://w3id.org/holon/>
    a owl:Ontology ;
    dcterms:title   "Holon Graph Architecture Vocabulary"@en ;
    dcterms:license <https://creativecommons.org/publicdomain/zero/1.0/> ;
    dcterms:rights  "CC0-1.0 — ontology content. No rights reserved."@en .
```

The specification prose (this document and all subordinate `spec-section`
DataBooks) is published under the [W3C Document Licence](https://www.w3.org/copyright/document-license-2023/).

The ontology content (all vocabulary DataBooks) is published under
[CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/). No rights
reserved.

---

## 2. Governance Statement

<!-- databook:id: governance -->
<!-- mode=informative norm=false conformance=all -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .

hspec:governance a hspec:GovernanceRecord ;
    rdfs:label              "HGA Governance Record"@en ;
    hspec:publicationPath   "W3C Community Group → CG Report → WG Note → Recommendation" ;
    hspec:cgName            "Holon Graph Architecture Community Group (proposed)" ;
    hspec:ipPolicy          "W3C Community Final Specification Agreement (CFSA)" ;
    hspec:namespaceOwner    "Kurt Cagle / Semantical LLC" ;
    hspec:namespaceTransferCondition
        "On CG establishment, namespace governance transfers to the CG." ;
    hspec:recommendationMigrationNote
        "On W3C Recommendation, namespace migrates from http://w3id.org/holon/ to https://www.w3.org/ns/holon/ via w3id.org redirect. Term IRIs remain stable." .
```

---

## 3. Forward Dependency Register

<!-- databook:id: dependencies -->
<!-- mode=normative norm=true conformance=all rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .

hspec:DepRisk a owl:Class ; rdfs:label "Dependency Risk Level"@en .
hspec:LowRisk    a hspec:DepRisk ; rdfs:label "Low"@en .
hspec:MediumRisk a hspec:DepRisk ; rdfs:label "Medium"@en .
hspec:HighRisk   a hspec:DepRisk ; rdfs:label "High"@en .

hspec:dep-rdf12-concepts a hspec:Dependency ;
    rdfs:label        "RDF 1.2 Concepts and Abstract Syntax"@en ;
    hspec:targetIRI   <https://www.w3.org/TR/rdf12-concepts/> ;
    hspec:risk        hspec:LowRisk ;
    hspec:riskNote    "Stable; approaching Recommendation. Triple terms and reification are locked."@en .

hspec:dep-turtle12 a hspec:Dependency ;
    rdfs:label        "RDF 1.2 Turtle"@en ;
    hspec:targetIRI   <https://www.w3.org/TR/rdf12-turtle/> ;
    hspec:risk        hspec:LowRisk ;
    hspec:riskNote    "Turtle 1.2 annotation syntax (~reifier) is stable."@en .

hspec:dep-shacl12-core a hspec:Dependency ;
    rdfs:label        "SHACL 1.2 Core"@en ;
    hspec:targetIRI   <https://www.w3.org/TR/shacl12-core/> ;
    hspec:risk        hspec:LowRisk ;
    hspec:riskNote    "sh:reifierShape and sh:reificationRequired are stable. sh:intent and sh:agentInstruction carry minor at-risk status."@en .

hspec:dep-shacl12-sparql a hspec:Dependency ;
    rdfs:label        "SHACL 1.2 SPARQL Extensions"@en ;
    hspec:targetIRI   <https://www.w3.org/TR/shacl12-sparql/> ;
    hspec:risk        hspec:LowRisk ;
    hspec:riskNote    "SPARQL-based constraints are stable."@en .

hspec:dep-shacl12-rules a hspec:Dependency ;
    rdfs:label        "SHACL 1.2 Rules"@en ;
    hspec:targetIRI   <https://www.w3.org/TR/shacl12-rules/> ;
    hspec:risk        hspec:HighRisk ;
    hspec:riskNote    "SHACL 1.2 Rules is the wildcard dependency. A SPARQL UPDATE fallback MUST be maintained in parallel throughout development."@en .

hspec:dep-sparql12 a hspec:Dependency ;
    rdfs:label        "SPARQL 1.2 Query Language"@en ;
    hspec:targetIRI   <https://www.w3.org/TR/sparql12-query/> ;
    hspec:risk        hspec:MediumRisk ;
    hspec:riskNote    "Federation extensions still in development. HGA v1 explicitly defers cross-server federation."@en .

hspec:Dependency a owl:Class ; rdfs:label "Specification Dependency"@en .
```

> **Important:** The SHACL 1.2 Rules dependency carries HIGH risk. Every inferencing
> rule defined in this specification MUST have a SPARQL UPDATE fallback expression.

---

## 4. Conformance Classes

<!-- databook:id: conformance -->
<!-- mode=normative norm=true conformance=all rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

hspec:ConformanceClass a owl:Class ;
    rdfs:label "HGA Conformance Class"@en .

hspec:HGACore a hspec:ConformanceClass ;
    rdfs:label  "HGA Core"@en ;
    sh:order    1 ;
    dcterms:description """Minimum conformance. Implementations MUST support:
  (a) HomeHolon and IndexHolon structure with static DataBook fallback;
  (b) AgentHolon, PlaceHolon, OrganisationHolon shapes;
  (c) AssertionEvent and CommandEvent envelope shapes (closed);
  (d) PROV-O provenance shapes on event envelopes;
  (e) Reifier IRI (not blank node) constraint on all reification;
  (f) rdfs:label MUST on all reifier IRIs;
  (g) SKOS concept schemes for status, severity, and match-type;
  (h) Content negotiation: Turtle and HTML MUST, JSON-LD Compact SHOULD."""@en .

hspec:HGAExtended a hspec:ConformanceClass ;
    rdfs:label      "HGA Extended"@en ;
    sh:order        2 ;
    hspec:extends   hspec:HGACore ;
    dcterms:description """Extends Core. Implementations MUST additionally support:
  (a) Portal and PortalLock shapes;
  (b) ODRL policy bindings on holons and portals;
  (c) VerifiableCredential wrapper shapes;
  (d) ObservationEvent envelope shape;
  (e) SPARQL UPDATE fallbacks for all SHACL rules in this class."""@en .

hspec:HGABayesian a hspec:ConformanceClass ;
    rdfs:label      "HGA Bayesian"@en ;
    sh:order        3 ;
    hspec:extends   hspec:HGAExtended ;
    hspec:specStatus hspec:AtRisk ;
    dcterms:description """Extends Extended. Implementations MUST additionally support:
  (a) BeliefState, FreeEnergy, and PolicySelection shapes;
  (b) SPARQL-based precision invariant constraints;
  (c) Active inference event annotation shapes;
  (d) SPARQL UPDATE fallbacks for all Bayesian SHACL rules."""@en .

# ── Added in Pass E §1 ────────────────────────────────────────────────────

hspec:HGAMarkov a hspec:ConformanceClass ;
    rdfs:label      "HGA Markov"@en ;
    sh:order        4 ;
    hspec:extends   hspec:HGABayesian ;
    dcterms:description """Extends Bayesian. Implementations MUST additionally support:
  (a) hmk:MarkovBlanket four-surface partition shapes;
  (b) hmk:Utterance as first-class communicative act;
  (c) hmk:PropagationSignal with Distress/Resolution polarity subclasses;
  (d) hmk:ParticipationRecord and hmk:CoregulationRecord shapes;
  (e) Sensor-only blanket pattern (hmedia:sensorOnly advisory — optional if Pass F not loaded);
  (f) Bridge properties: hmk:generatedFromActiveState, hmk:addressedToSensoryState."""@en .

# ── Added in Pass E §2 ────────────────────────────────────────────────────

hspec:HGAProjection a hspec:ConformanceClass ;
    rdfs:label      "HGA Projection"@en ;
    sh:order        5 ;
    hspec:extends   hspec:HGAExtended ;
    dcterms:description """Extends Extended. Implementations MUST additionally support:
  (a) hproj:NowGraph envelope shape and transmission metadata;
  (b) hproj:DepictionProjection envelope shape;
  (c) hproj:ProjectionActivity and hproj:CartographerActivity shapes;
  (d) hproj:PromptBlock shape;
  (e) Content format SKOS scheme (hproj:ContentFormatScheme);
  (f) Rendering mode SKOS scheme (hproj:RenderingModeScheme);
  (g) Read-only invariant: no projection MUST generate mutation events;
  (h) hmedia:cameraRef advisory property (ignored if Pass F not loaded)."""@en .

# ── Added in Pass F ───────────────────────────────────────────────────────

hspec:HGAMedia a hspec:ConformanceClass ;
    rdfs:label      "HGA Media"@en ;
    sh:order        6 ;
    hspec:extends   hspec:HGAMarkov ;
    dcterms:description """Extends Markov. Implementations MUST additionally support:
  (a) hmedia:MediaContext (project-level asset root with mediaBase URI);
  (b) hmedia:MediaAsset with IRI, MIME type, keywords, role, altText;
  (c) hmedia:appearance lang-tagged literal on any entity or event;
  (d) hmedia:hasMedia property on any holon or event;
  (e) hmedia:SceneDescriptor with repeatable hmedia:hasScene on events;
  (f) hmedia:CameraAgent extending hmk:SensoryState;
  (g) hmedia:sensorOnly on hmk:MarkovBlanket for camera-only blankets;
  (h) Five SKOS schemes: MediaRole, SensorType, ShotType, Perspective, DepthOfField."""@en .

hspec:AtRisk a hspec:SpecStability ;
    rdfs:label   "At Risk"@en ;
    rdfs:comment "Feature may be removed or substantially modified before publication."@en .

hspec:SpecStability a owl:Class ;
    rdfs:label "Specification Stability"@en .
```

An implementation is conformant at a given level if and only if it correctly
implements all MUST requirements for that class and all classes it extends.

---

## 5. Federation Scope Statement

<!-- databook:id: federation-scope -->
<!-- mode=normative norm=true conformance=all rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix hfed:    <http://w3id.org/holon/federation/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .

hfed: a owl:Ontology ;
    rdfs:label       "HGA Federation Namespace (Reserved)"@en ;
    hspec:specVersion "v2" ;
    dcterms:description "Reserved namespace for cross-server holon federation. All terms deferred to HGA Federation v1.0."@en .

hspec:federationScope a hspec:ScopeStatement ;
    rdfs:label       "Federation Scope Statement"@en ;
    dcterms:description """Cross-server holon federation is explicitly OUT OF SCOPE for HGA v1.
Rationale: SPARQL 1.2 federation specifications remain in development.
HGA Federation v1.0 will track the final SPARQL 1.2 federation Recommendations.

HGA v1 normative constraints on federation:
  (a) Implementations MUST NOT use the SPARQL 1.2 SERVICE keyword to query
      across holon server boundaries in v1 deployments.
  (b) Cross-server event routing MUST use hev:RemoteEventEnvelope.
  (c) The namespace http://w3id.org/holon/federation/ is RESERVED.
  (d) Worst-case fallback: SPARQL 1.1 SERVICE for read-only cross-server
      queries where both endpoints are known and trusted."""@en .

hspec:ScopeStatement a owl:Class ;
    rdfs:label "Scope Statement"@en .
```

---

## 6. Section Registry

<!-- databook:id: section-registry -->
<!-- mode=normative norm=true conformance=all -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

hspec:pass0-manifest a hspec:SpecSection ;
    rdfs:label           "Pass 0: Manifest"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/" ;
    sh:order             0 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass0-namespace-registry a hspec:SpecSection ;
    rdfs:label           "Pass 0: Namespace and Prefix Registry"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/namespace-registry" ;
    sh:order             1 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass-a-ontology-header a hspec:SpecSection ;
    rdfs:label           "Pass A: Ontology Header"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/ontology-header" ;
    sh:order             2 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass-a-skos-taxonomies a hspec:SpecSection ;
    rdfs:label           "Pass A: SKOS Taxonomies"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/skos-taxonomies" ;
    sh:order             3 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass-b-core-structure a hspec:SpecSection ;
    rdfs:label           "Pass B: Core Holonic Structure"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/core-structure" ;
    sh:order             4 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass-b-portals a hspec:SpecSection ;
    rdfs:label           "Pass B: Portals and Portal Locks"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/portals" ;
    sh:order             5 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGAExtended .

hspec:pass-c-events a hspec:SpecSection ;
    rdfs:label           "Pass C: Event Envelopes and Observation"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/events" ;
    sh:order             6 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass-c-provenance a hspec:SpecSection ;
    rdfs:label           "Pass C: Provenance Shapes"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/provenance" ;
    sh:order             7 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGACore .

hspec:pass-d-bayesian a hspec:SpecSection ;
    rdfs:label           "Pass D: Bayesian and Active Inference Shapes"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/bayesian" ;
    sh:order             8 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGABayesian ;
    hspec:specStatus     hspec:AtRisk .

hspec:pass-d-policy a hspec:SpecSection ;
    rdfs:label           "Pass D: ODRL Policy Bindings"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/policy" ;
    sh:order             9 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGAExtended .

hspec:pass-d-vc a hspec:SpecSection ;
    rdfs:label           "Pass D: Verifiable Credential Stubs"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/vc-stubs" ;
    sh:order             10 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGAExtended .

# ── Added in Pass E §1 ────────────────────────────────────────────────────

hspec:pass-e-markov-blanket a hspec:SpecSection ;
    rdfs:label           "Pass E §1: Markov Blanket"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/markov-blanket" ;
    sh:order             11 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGAMarkov .

# ── Added in Pass E §2 ────────────────────────────────────────────────────

hspec:pass-e-projection a hspec:SpecSection ;
    rdfs:label           "Pass E §2: Projection Layer"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/projection" ;
    sh:order             12 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGAProjection .

# ── Added in Pass F ───────────────────────────────────────────────────────

hspec:pass-f-media a hspec:SpecSection ;
    rdfs:label           "Pass F: Media Vocabulary"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/media" ;
    sh:order             13 ;
    hspec:normative      true ;
    hspec:conformanceClass hspec:HGAMedia .

# ── Annexes ───────────────────────────────────────────────────────────────

hspec:annex-migration a hspec:SpecAnnex ;
    rdfs:label           "Annex A: Migration from ontologist.io Namespace"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/annex-migration" ;
    sh:order             100 ;
    hspec:normative      false .

hspec:annex-sosa-mapping a hspec:SpecAnnex ;
    rdfs:label           "Annex B: SOSA/SSN Mapping"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/annex-sosa" ;
    sh:order             101 ;
    hspec:normative      false .

hspec:annex-geosparql-mapping a hspec:SpecAnnex ;
    rdfs:label           "Annex C: GeoSPARQL Mapping"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/annex-geosparql" ;
    sh:order             102 ;
    hspec:normative      false .

hspec:annex-ggsc-deployment a hspec:SpecAnnex ;
    rdfs:label           "Annex D: GGSC Conformance Deployment Example"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/annex-ggsc" ;
    sh:order             103 ;
    hspec:normative      false .

hspec:annex-sparql-fallbacks a hspec:SpecAnnex ;
    rdfs:label           "Annex E: SPARQL UPDATE Fallbacks for SHACL Rules"@en ;
    dcterms:identifier   "http://w3id.org/holon/spec/annex-sparql-fallbacks" ;
    sh:order             104 ;
    hspec:normative      false .
```

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
