---
id: http://w3id.org/holon/spec/ontology-header
title: "HGA Ontology Header — Namespace Declarations and Inferencing Policy"
type: spec-section
version: 0.1.1
created: 2026-06-04
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
domain: http://w3id.org/holon/
description: >
  Normative ontology header for the Holon Graph Architecture specification.
  Declares all HGA sub-namespace ontologies with versioning, imports, and
  inter-namespace dependency relationships. Amendment 0.1.1: adds hmk:
  (Pass E §1 Markov blanket), hproj: (Pass E §2 Projection), and hmedia:
  (Pass F Media) owl:Ontology declarations and import graph entries.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass A — §1"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - core
  rfc2119: true
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/
  named_graph: http://w3id.org/holon/spec/ontology-header#graph
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

## 1. Introduction

This section declares the `owl:Ontology` metadata for all HGA sub-namespaces
and establishes the normative inferencing policy that governs how SHACL shapes
and OWL axioms interact throughout the specification.

The HGA vocabulary is organised into twelve sub-namespaces (eleven active, one
reserved). Each sub-namespace is a distinct `owl:Ontology`. Namespaces may
import one another; the import graph is acyclic. Implementations load only the
namespaces required by their declared conformance class.

---

## 2. Inferencing Policy

<!-- databook:id: inferencing-policy -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```turtle
@prefix holon:   <http://w3id.org/holon/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

hspec:inferencingPolicy a hspec:ArchitecturalDecision ;
    rdfs:label "HGA Inferencing Policy"@en ;
    sh:agentInstruction "This policy governs how reasoners interact with HGA shapes. SHACL is the normative validation mechanism. OWL axioms inform but do not obligate."@en ;
    dcterms:description """
The following normative policy governs inferencing throughout the HGA specification:

(1) SHACL shapes are NORMATIVE. Conformance is assessed by SHACL 1.2 validation
    against data graphs. A processor that correctly executes SHACL validation
    is conformant regardless of whether it performs OWL reasoning.

(2) OWL 2 RL axioms are NON-NORMATIVE annotations. They inform OWL-aware
    reasoners and ontology editors but MUST NOT be relied upon for conformance.

(3) SHACL shapes MUST be self-sufficient. No SHACL shape may rely on inferred
    triples to produce a correct validation result.

(4) Inferencing is PAYLOAD-LEVEL. OWL reasoning operates on domain content.
    Inferencing over HGA infrastructure vocabulary is NOT required.

(5) OWL profile: OWL 2 RL.

(6) SHACL 1.2 Rules: used where stable. Every SHACL rule MUST have a companion
    SPARQL UPDATE fallback expression in Annex E.
"""@en .

hspec:ArchitecturalDecision a owl:Class ;
    rdfs:label "Architectural Decision Record"@en .
```

---

## 3. Ontology Declarations

All HGA sub-namespace ontologies are declared in the TriG block below.

<!-- databook:id: ontology-declarations -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```trig
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix hdb:     <http://w3id.org/holon/databook/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix hpol:    <http://w3id.org/holon/policy/> .
@prefix hvc:     <http://w3id.org/holon/vc/> .
@prefix hbayes:  <http://w3id.org/holon/bayesian/> .
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix hfed:    <http://w3id.org/holon/federation/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix odrl:    <http://www.w3.org/ns/odrl/2/> .

# ── Core ──────────────────────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/#ontology> {

  <http://w3id.org/holon/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/holon> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Core Vocabulary"@en ;
      dcterms:title    "Holon Graph Architecture — Core Vocabulary"@en ;
      dcterms:description
          "Core holonic structure: Holon, HomeHolon, IndexHolon, AgentHolon, PlaceHolon, OrganisationHolon, DataHolon, Portal, PortalLock, Boundary, BoundaryLayer, Registration, and GroundingRecord. Also carries the SKOS concept schemes: lifecycle status, validation severity, concern level, and match type."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGACore ;
      sh:agentInstruction
          "The core HGA vocabulary defines holonic infrastructure — the containers, navigational links, agents, and places that form the skeleton of a holonic graph."@en ;
      owl:imports
          <http://www.w3.org/2000/01/rdf-schema#> ,
          <http://www.w3.org/2002/07/owl#> ,
          <http://www.w3.org/ns/shacl#> ,
          <http://www.w3.org/ns/prov#> ,
          <http://www.w3.org/2004/02/skos/core#> ,
          <http://purl.org/dc/terms/> .
}

# ── Events ────────────────────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/event/#ontology> {

  <http://w3id.org/holon/event/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/event> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Event Vocabulary"@en ;
      dcterms:description
          "Event envelope vocabulary: ObservationEvent, AssertionEvent, CommandEvent, CommandRejected, ViolationEvent, OutOfBounds, ExpansionRequest, UnresolvableTarget, RemoteEventEnvelope; temporal properties; targetHolon routing. RDF 1.2 annotated triple provenance. Pass F adds hmedia:hasScene (repeatable) on events — see hga-pass-f-media for details."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGACore ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://www.w3.org/ns/prov#> ,
          <http://www.w3.org/2001/XMLSchema#> .
}

# ── Provenance ────────────────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/provenance/#ontology> {

  <http://w3id.org/holon/provenance/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/provenance> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Provenance Vocabulary"@en ;
      dcterms:description
          "PROV-O shape extensions and HGA-specific provenance terms. IngestionActivity, transformer attribution, DataBook processing record. Envelope-level provenance only."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGACore ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://w3id.org/holon/event/> ,
          <http://www.w3.org/ns/prov#> .
}

# ── DataBook ──────────────────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/databook/#ontology> {

  <http://w3id.org/holon/databook/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/databook> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA DataBook Vocabulary"@en ;
      dcterms:description
          "Vocabulary for the DataBook portable artefact format. Document types, block processing modes, directive properties, manifest structure."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGACore ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://purl.org/dc/terms/> ,
          <http://www.w3.org/ns/prov#> .
}

# ── Specification Infrastructure ──────────────────────────────────────────────

GRAPH <http://w3id.org/holon/spec/#ontology> {

  <http://w3id.org/holon/spec/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/spec> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Specification Infrastructure"@en ;
      dcterms:description
          "Specification metadata, conformance classes, publication status, section registry, dependency records, governance."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGACore ;
      owl:imports
          <http://w3id.org/holon/databook/> ,
          <http://purl.org/dc/terms/> ,
          <http://www.w3.org/ns/shacl#> .
}

# ── Policy ────────────────────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/policy/#ontology> {

  <http://w3id.org/holon/policy/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/policy> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Policy Vocabulary"@en ;
      dcterms:description
          "ODRL 2.2 policy bindings for holon boundaries and portals. PortalPolicy, BoundaryPolicy, AccessPermission, TraversalConstraint."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGAExtended ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://www.w3.org/ns/odrl/2/> ,
          <http://www.w3.org/ns/shacl#> .
}

# ── Verifiable Credentials ────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/vc/#ontology> {

  <http://w3id.org/holon/vc/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/vc> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Verifiable Credential Stubs"@en ;
      dcterms:description
          "SHACL 1.2 shapes for VC Data Model 2.0 credential wrappers. Stub pending W3C VC 2.0 stabilisation."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGAExtended ;
      owl:imports
          <http://w3id.org/holon/> ,
          <https://www.w3.org/ns/credentials/> ,
          <http://www.w3.org/ns/shacl#> .
}

# ── Bayesian / Active Inference ───────────────────────────────────────────────

GRAPH <http://w3id.org/holon/bayesian/#ontology> {

  <http://w3id.org/holon/bayesian/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/bayesian> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Bayesian Vocabulary"@en ;
      dcterms:description
          "Structural vocabulary for Bayesian belief states and Active Inference constructs. BeliefState, FreeEnergy, PolicySelection. At-risk pending conformance class stabilisation."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGABayesian ;
      hspec:specStatus hspec:AtRisk ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://w3id.org/holon/event/> ,
          <http://www.w3.org/ns/shacl#> ,
          <http://www.w3.org/2001/XMLSchema#> .
}

# ── Markov Blanket ─────────────────────────────────────────────────────────
# Added Pass E §1

GRAPH <http://w3id.org/holon/markov/#ontology> {

  <http://w3id.org/holon/markov/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/markov> ;
      owl:versionInfo  "0.3.0"^^xsd:string ;
      rdfs:label       "HGA Markov Blanket Vocabulary"@en ;
      dcterms:title    "Holon Graph Architecture — Markov Blanket and Agent Surface Vocabulary"@en ;
      dcterms:description
          "Four-surface agent state partition (InternalState, ExternalState, SensoryState, ActiveState) with hmk:MarkovBlanket as the enclosing structure. Introduces hmk:Utterance as a first-class communicative act distinct from hproj:Projection. Defines hmk:PropagationSignal with hmk:DistressPropagation and hmk:ResolutionPropagation polarity subclasses. Adds hmk:ParticipationRecord, hmk:CoregulationRecord, and bridge properties to hproj: and hmedia:. Sensor-only blanket pattern via hmedia:sensorOnly advisory property (Pass F)."@en ;
      dcterms:created  "2026-06-06"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGAMarkov ;
      sh:agentInstruction
          "The Markov blanket vocabulary partitions agent state into four mutually exclusive surfaces. A full agent has all four surfaces; a camera (sensor-only) has only SensoryState. Utterances are first-class communicative acts emitted from ActiveState. PropagationSignals carry polarity — DistressPropagation (positive free energy) vs ResolutionPropagation (negative)."@en ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://w3id.org/holon/event/> ,
          <http://w3id.org/holon/bayesian/> ,
          <http://www.w3.org/ns/shacl#> ,
          <http://www.w3.org/2001/XMLSchema#> .
}

# ── Projection ────────────────────────────────────────────────────────────────
# Added Pass E §2

GRAPH <http://w3id.org/holon/projection/#ontology> {

  <http://w3id.org/holon/projection/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/projection> ;
      owl:versionInfo  "0.1.1"^^xsd:string ;
      rdfs:label       "HGA Projection Vocabulary"@en ;
      dcterms:title    "Holon Graph Architecture — Projection Layer Vocabulary"@en ;
      dcterms:description
          "Projection envelope vocabulary: NowGraph (stage 8), DepictionProjection (stage 9), OutputProduct, ProjectionActivity, CartographerActivity, PromptBlock. Five SKOS schemes: ProjectionType, PersistencePolicy, RenderingMode (Cinematic/Immersive/ActiveInference/ExplodedView), ContentFormat (13 formats), TransmissionMode. Amendment 0.1.1 adds hmedia:cameraRef advisory bridge property."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGAProjection ;
      sh:agentInstruction
          "The projection vocabulary governs what happens at stages 8 and 9 of the HGA pipeline. NowGraph is the cartographer's input (stage 8); DepictionProjection is the rendered output (stage 9). Projections are read-only envelopes — they MUST NOT generate mutation events. hmedia:cameraRef (Pass F) provides camera rendering hints."@en ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://w3id.org/holon/event/> ,
          <http://w3id.org/holon/provenance/> ,
          <http://www.w3.org/ns/prov#> ,
          <http://www.w3.org/2004/02/skos/core#> ,
          <http://www.w3.org/ns/shacl#> ,
          <http://www.w3.org/2001/XMLSchema#> .
}

# ── Media ─────────────────────────────────────────────────────────────────────
# Added Pass F

GRAPH <http://w3id.org/holon/media/#ontology> {

  <http://w3id.org/holon/media/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/0.1/media> ;
      owl:versionInfo  "0.1.0"^^xsd:string ;
      rdfs:label       "HGA Media Vocabulary"@en ;
      dcterms:title    "Holon Graph Architecture — Media Asset and Appearance Vocabulary"@en ;
      dcterms:description
          "Media asset and visual representation vocabulary. Defines hmedia:MediaContext (project-level asset root with mediaBase URI for portability), hmedia:MediaAsset (addressable asset with IRI, MIME type, keywords, role, altText), hmedia:appearance (lang-tagged rendering hint on any entity or event), hmedia:hasMedia (asset attachment on any holon or event), hmedia:SceneDescriptor (repeatable event scene composite linking actor, location, narrative, camera), and hmedia:CameraAgent (extends hmk:SensoryState with sensor type, shot type, perspective, focal length, field of view, depth of field). Introduces hmedia:sensorOnly on hmk:MarkovBlanket for camera/sensor-only blankets. Five SKOS schemes: MediaRoleScheme, SensorTypeScheme (Visual/Audio/Geometric/Cartographic/Textual), ShotTypeScheme, PerspectiveScheme, DepthOfFieldScheme. Non-normative SPARQL CONSTRUCT for scene narrative assembly from component appearance properties."@en ;
      dcterms:created  "2026-06-09"^^xsd:date ;
      dcterms:license  <https://creativecommons.org/publicdomain/zero/1.0/> ;
      dcterms:creator  <https://holongraph.com/people/kurt-cagle> ;
      hspec:conformanceClass hspec:HGAMedia ;
      sh:agentInstruction
          "The media vocabulary adds a rendering/appearance layer on top of the holonic graph. hmedia:appearance on an entity tells you what it looks like; hmedia:SceneDescriptor composites an event scene from actor appearance, location appearance, and camera characteristics. CameraAgent is a sensor — its sensorType determines what kind of media is produced (image, audio, 3D model, map, narrative text). Multiple cameras may observe the same holon simultaneously."@en ;
      owl:imports
          <http://w3id.org/holon/> ,
          <http://w3id.org/holon/event/> ,
          <http://w3id.org/holon/markov/> ,
          <http://w3id.org/holon/projection/> ,
          <http://www.w3.org/2004/02/skos/core#> ,
          <http://www.w3.org/ns/shacl#> ,
          <http://www.w3.org/2001/XMLSchema#> .
}

# ── Federation (Reserved) ─────────────────────────────────────────────────────

GRAPH <http://w3id.org/holon/federation/#ontology> {

  <http://w3id.org/holon/federation/> a owl:Ontology ;
      owl:versionIRI   <http://w3id.org/holon/spec/2.0/federation> ;
      owl:versionInfo  "0.0.0-reserved"^^xsd:string ;
      rdfs:label       "HGA Federation (Reserved)"@en ;
      dcterms:description
          "RESERVED. This namespace is deferred to HGA Federation v1.0. Implementations MUST NOT define terms in this namespace."@en ;
      dcterms:created  "2026-06-04"^^xsd:date ;
      hspec:specVersion "v2" .
}
```

---

## 4. Namespace Import Graph

<!-- databook:id: import-graph -->
<!-- mode=informative norm=false -->
```turtle
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix hdb:     <http://w3id.org/holon/databook/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix hpol:    <http://w3id.org/holon/policy/> .
@prefix hvc:     <http://w3id.org/holon/vc/> .
@prefix hbayes:  <http://w3id.org/holon/bayesian/> .
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .

# External roots (no HGA imports)
<http://www.w3.org/ns/prov#>               rdfs:label "PROV-O"@en .
<http://www.w3.org/ns/shacl#>              rdfs:label "SHACL 1.2"@en .
<http://www.w3.org/2004/02/skos/core#>    rdfs:label "SKOS"@en .
<http://www.w3.org/ns/odrl/2/>             rdfs:label "ODRL 2.2"@en .
<http://purl.org/dc/terms/>               rdfs:label "Dublin Core Terms"@en .
<https://www.w3.org/ns/credentials/>      rdfs:label "VC Data Model 2.0"@en .

# HGA level 0 — imports externals only
<http://w3id.org/holon/>
    owl:imports
        <http://www.w3.org/ns/prov#> ,
        <http://www.w3.org/ns/shacl#> ,
        <http://www.w3.org/2004/02/skos/core#> ,
        <http://purl.org/dc/terms/> .

# HGA level 1 — imports holon: only
<http://w3id.org/holon/event/>      owl:imports <http://w3id.org/holon/> .
<http://w3id.org/holon/databook/>   owl:imports <http://w3id.org/holon/> .
<http://w3id.org/holon/provenance/> owl:imports <http://w3id.org/holon/> .

# HGA level 2
<http://w3id.org/holon/spec/>       owl:imports <http://w3id.org/holon/databook/> .
<http://w3id.org/holon/policy/>     owl:imports <http://w3id.org/holon/> , <http://www.w3.org/ns/odrl/2/> .
<http://w3id.org/holon/vc/>         owl:imports <http://w3id.org/holon/> , <https://www.w3.org/ns/credentials/> .
<http://w3id.org/holon/bayesian/>   owl:imports <http://w3id.org/holon/> , <http://w3id.org/holon/event/> .

# HGA level 3
<http://w3id.org/holon/markov/>
    owl:imports
        <http://w3id.org/holon/> ,
        <http://w3id.org/holon/event/> ,
        <http://w3id.org/holon/bayesian/> .

<http://w3id.org/holon/projection/>
    owl:imports
        <http://w3id.org/holon/> ,
        <http://w3id.org/holon/event/> ,
        <http://w3id.org/holon/provenance/> .

# HGA level 4 — imports markov + projection
<http://w3id.org/holon/media/>
    owl:imports
        <http://w3id.org/holon/> ,
        <http://w3id.org/holon/event/> ,
        <http://w3id.org/holon/markov/> ,
        <http://w3id.org/holon/projection/> .
```

The import graph is a directed acyclic graph (DAG). `holon:` is the root HGA
namespace and imports only external W3C vocabularies. `hmedia:` is the deepest
node — it imports both `hmk:` (Markov blanket) and `hproj:` (projection).
No cycles exist.

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
