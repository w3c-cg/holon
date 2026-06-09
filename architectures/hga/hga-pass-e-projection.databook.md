---
id: http://w3id.org/holon/spec/projection
title: "HGA Projection Layer — Vocabulary and Shapes"
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
domain: http://w3id.org/holon/projection/
subject:
  - projection
  - now graph
  - cartographer
  - depiction
  - content format
  - camera agent
  - SHACL 1.2
  - RDF 1.2
description: >
  Normative vocabulary and SHACL 1.2 shapes for the HGA Projection layer.
  Defines the projection envelope — the formal wrapper that carries provenance,
  transmission metadata, content format declaration, and persistence policy
  around domain-specific content. Projection content (KML, SVG, GeoJSON,
  DataBook, HTML, etc.) is not constrained by hproj: shapes; only the
  envelope is. Defines NowGraph (stage 8, scene graph slice for the
  cartographer), DepictionProjection (stage 9, cartographer output),
  OutputProduct (persistent deliverable), ProjectionActivity,
  CartographerActivity, and PromptBlock. Introduces the HGAProjection
  conformance class extending HGAExtended. Amendment 0.1.1: adds
  hmedia:cameraRef bridge property and §1.7 camera preset mapping note
  (Pass F cross-reference).
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass E — §2"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - projection
  rfc2119: true
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/projection/
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: true
shapes:
  - http://w3id.org/holon/projection/#shapes
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

## 1. Architecture and Design Principles

### 1.1 The Projection Seam

The HGA pipeline has a formal seam dividing deterministic infrastructure
from interpretive depiction.

**Below the seam** (stages 1–7): signal ingestion, entity recognition, SHACL
validation, SPARQL UPDATE. The RDF/SHACL/SPARQL layer. Operates without AI.
Produces authoritative state.

**Above the seam** (stages 8–9): projection and depiction. Stage 8 produces
a contextual slice of the scene graph (the Now Graph) shaped for a specific
agent and purpose. Stage 9 — the AI Cartographer — reads that slice and
produces a depiction appropriate to the domain, mode, and client.

The `hproj:` vocabulary governs what happens at stages 8 and 9. It does
**not** govern the content carried by projections — that is domain payload.

### 1.2 Envelope / Content Invariant

A projection is an **envelope on content**, not the content itself. The
`hproj:` shapes validate the envelope: who requested the projection, from
which holons, at what point in scene graph time, in what format, and
whether it persists. The content — a KML file, an SVG diagram, a GeoJSON
feature collection, a DataBook scene graph block — lives at
`hproj:contentGraph` or `hproj:contentURI` and is governed by domain
shapes, not projection shapes.

This mirrors the event envelope / payload separation established in Pass C,
applied to the output side of the pipeline.

> **Invariant:** Projections are **read-only**. A projection MUST NOT
> generate a mutation event (`hev:AssertionEvent` or `hev:CommandEvent`)
> against its source holons. Reads only; state changes go through the
> event pipeline.

### 1.3 The Two Pipeline Projection Points

There are two distinct projection activities in the pipeline:

**Stage 8 — Scene Projection:** The scene graph is sliced into a
`hproj:NowGraph` for a specific requesting agent. The now graph is the
cartographer's input. It carries the current state of the relevant holons,
provenance context, a prompt block reference, and active parameters
(Bayesian frames, PoV, layer selections).

**Stage 9 — Cartographer Depiction:** The AI Cartographer consumes the
now graph and produces a `hproj:DepictionProjection`. The depiction carries
the rendered content — text, SVG, GeoJSON, Mermaid spec, KML, or other
format declared in the envelope. The content is what the client consumes.

```
Scene Graph
    │
    │  hproj:SceneProjectionActivity
    ▼
hproj:NowGraph
    │
    │  hproj:CartographerActivity
    ▼
hproj:DepictionProjection
    │
    │  content-negotiated delivery
    ▼
Client (one of four rendering modes)
```

### 1.4 Eager and Lazy Projection

**Eager (push/streaming):** Scene graph UPDATE and projection emission are
a single atomic step. Delivered over WebSocket. Used in streaming/real-time
mode. The scene graph and the now graph are generated together; the client
receives a continuous projection stream. `hproj:transmissionType` is `full`
or `delta`.

**Lazy (pull/request):** The triplestore is authoritative. The client
requests a projection snapshot when needed. The now graph is generated
from a SPARQL CONSTRUCT or DESCRIBE at query time. The client is stateless
with respect to scene state.

### 1.5 Scale and Scope

Holonic containment relationships are scale relationships. Moving from a
parent holon to a child holon is a zoom-in (decomposition); moving from
child to parent is a zoom-out (aggregation). Projections express this via
`hproj:projectionDepth` — how many containment levels are included in the
now graph. Depth 0 includes only the root holon; depth 1 includes immediate
children; depth −1 includes the full subgraph.

Scale is an envelope property. What you see at each scale level is governed
by the boundary shapes of the holons at that level — a domain concern, not
a projection concern.

### 1.6 Conformance Class

<!-- databook:id: projection-conformance-class -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

hspec:HGAProjection a hspec:ConformanceClass ;
    rdfs:label "HGA Projection"@en ;
    sh:order 4 ;
    hspec:extends hspec:HGAExtended ;
    dcterms:description """Extends HGA Extended. Implementations MUST additionally support:
  (a) hproj:NowGraph envelope shape and transmission metadata;
  (b) hproj:DepictionProjection envelope shape;
  (c) hproj:ProjectionActivity and hproj:CartographerActivity shapes;
  (d) hproj:PromptBlock shape;
  (e) Content format SKOS scheme (hproj:ContentFormatScheme);
  (f) Rendering mode SKOS scheme (hproj:RenderingModeScheme);
  (g) Read-only invariant: no projection MUST generate mutation events;
  (h) Static DataBook fallback for vocabulary dereferencing at hproj: IRIs."""@en .
```

### 1.7 Camera Agents and Rendering Hints (Pass F Bridge)

The `hmedia:` vocabulary (Pass F) introduces `hmedia:CameraAgent` — a
specialised `hmk:SensoryState` that characterises the point of view and
sensor type for a projection. When an `hmedia:CameraAgent` is referenced
via `hmedia:cameraRef` on a `hproj:NowGraph` or `hproj:DepictionProjection`,
it provides rendering hints to the AI Cartographer:

- `hmedia:sensorType` determines the output modality (Visual, Audio,
  Geometric, Cartographic, Textual)
- `hmedia:shotType` and `hmedia:perspective` parameterise the viewpoint
- `hmedia:focalLength`, `hmedia:fieldOfView`, and `hmedia:depthOfField`
  provide cinematic parameters

The `hproj:RenderingModeScheme` concepts map to default camera presets
declared as named individuals in the `hmedia:` namespace:

| Rendering mode | Default camera preset | Primary sensor type |
|---|---|---|
| `hproj:CinematicMode` | `hmedia:CinematicDefault` | `hmedia:VisualSensor` |
| `hproj:ImmersiveMode` | `hmedia:ImmersiveDefault` | `hmedia:VisualSensor` |
| `hproj:ActiveInferenceMode` | `hmedia:ActiveInferenceDefault` | `hmedia:TextualSensor` |
| `hproj:ExplodedViewMode` | `hmedia:CartographicDefault` | `hmedia:CartographicSensor` |

Multiple cameras MAY reference the same `NowGraph` simultaneously,
producing concurrent projections in different modalities. The camera
reference is advisory — implementations that do not load Pass F MAY ignore
`hmedia:cameraRef` without error. The shapes in this DataBook include it in
`sh:ignoredProperties` for this reason.

---

## 2. SKOS Concept Schemes

### 2.1 Projection Type Scheme

<!-- databook:id: projection-type-scheme -->
<!-- databook:graph: http://w3id.org/holon/projection/#skos-types -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

GRAPH <http://w3id.org/holon/projection/#skos-types> {

  hproj:ProjectionTypeScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Projection Type"@en ;
      dcterms:description
          "Classifies the types of projection artefacts produced by the HGA pipeline. Used as the range of hproj:projectionType."@en ;
      sh:agentInstruction
          "Projection type tells you where in the pipeline this artefact was generated and what it is intended for. NowGraph is the cartographer's input. DepictionProjection is the cartographer's output. OutputProduct is a formal deliverable."@en ;
      skos:hasTopConcept
          hproj:NowGraphProjection ,
          hproj:DepictionProjectionType ,
          hproj:OutputProductProjection ,
          hproj:EventStreamProjection ,
          hproj:DeltaProjection ,
          hproj:APIResponseProjection .

  hproj:NowGraphProjection a skos:Concept ;
      skos:inScheme      hproj:ProjectionTypeScheme ;
      skos:topConceptOf  hproj:ProjectionTypeScheme ;
      rdfs:label         "Now Graph"@en ;
      skos:notation      "NOW-GRAPH" ;
      skos:definition
          "Stage 8 output. A contextual slice of the scene graph produced for a specific requesting agent and purpose. Carries scene state, provenance, prompt block reference, and active parameters. Serves as the AI Cartographer's primary input."@en .

  hproj:DepictionProjectionType a skos:Concept ;
      skos:inScheme      hproj:ProjectionTypeScheme ;
      skos:topConceptOf  hproj:ProjectionTypeScheme ;
      rdfs:label         "Depiction Projection"@en ;
      skos:notation      "DEPICTION" ;
      skos:definition
          "Stage 9 output. The AI Cartographer's rendered product — text, SVG, GeoJSON, Mermaid, KML, or other format. Derived from a NowGraph via a CartographerActivity using a registered PromptBlock."@en .

  hproj:OutputProductProjection a skos:Concept ;
      skos:inScheme      hproj:ProjectionTypeScheme ;
      skos:topConceptOf  hproj:ProjectionTypeScheme ;
      rdfs:label         "Output Product"@en ;
      skos:notation      "OUTPUT-PRODUCT" ;
      skos:definition
          "A formal deliverable produced for external consumption. May be a report, map product, export DataBook, or API response packaged for distribution. Persistent output products become DataHolons in the registry."@en .

  hproj:EventStreamProjection a skos:Concept ;
      skos:inScheme      hproj:ProjectionTypeScheme ;
      skos:topConceptOf  hproj:ProjectionTypeScheme ;
      rdfs:label         "Event Stream Projection"@en ;
      skos:notation      "EVENT-STREAM" ;
      skos:definition
          "A time-ordered sequence of projection deltas emitted over a WebSocket connection. Each element carries a transmission sequence number and a base projection reference. Used in eager/streaming deployment mode."@en .

  hproj:DeltaProjection a skos:Concept ;
      skos:inScheme      hproj:ProjectionTypeScheme ;
      skos:topConceptOf  hproj:ProjectionTypeScheme ;
      rdfs:label         "Delta Projection"@en ;
      skos:notation      "DELTA" ;
      skos:definition
          "An incremental update projection carrying only the changes since the base projection. Reduces transmission cost in streaming mode. MUST carry a baseProjection link to the full projection it updates."@en .

  hproj:APIResponseProjection a skos:Concept ;
      skos:inScheme      hproj:ProjectionTypeScheme ;
      skos:topConceptOf  hproj:ProjectionTypeScheme ;
      rdfs:label         "API Response Projection"@en ;
      skos:notation      "API-RESPONSE" ;
      skos:definition
          "An ephemeral projection produced in response to a REST query. Not streamed; not persistent. Produced lazily at query time from the authoritative triplestore."@en .

}
```

### 2.2 Persistence Policy Scheme

<!-- databook:id: persistence-policy-scheme -->
<!-- databook:graph: http://w3id.org/holon/projection/#skos-persistence -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

GRAPH <http://w3id.org/holon/projection/#skos-persistence> {

  hproj:PersistencePolicyScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Projection Persistence Policy"@en ;
      dcterms:description
          "Governs whether a projection is consumed and discarded (ephemeral) or registered in the holon registry as a DataHolon (persistent). Used as the range of hproj:persistencePolicy."@en ;
      skos:hasTopConcept
          hproj:EphemeralProjection ,
          hproj:PersistentProjection .

  hproj:EphemeralProjection a skos:Concept ;
      skos:inScheme      hproj:PersistencePolicyScheme ;
      skos:topConceptOf  hproj:PersistencePolicyScheme ;
      rdfs:label         "Ephemeral"@en ;
      skos:notation      "EPHEMERAL" ;
      skos:definition
          "The projection is produced for immediate consumption and then discarded. It is NOT registered as a DataHolon. Examples: streaming now graphs, live API responses, interactive exploration depictions."@en ;
      skos:scopeNote
          "Ephemeral projections MAY still carry an IRI for the duration of the session; the IRI is not registered and may not be dereferenceable after the session ends."@en .

  hproj:PersistentProjection a skos:Concept ;
      skos:inScheme      hproj:PersistencePolicyScheme ;
      skos:topConceptOf  hproj:PersistencePolicyScheme ;
      rdfs:label         "Persistent"@en ;
      skos:notation      "PERSISTENT" ;
      skos:definition
          "The projection is registered in the holon registry as a DataHolon with CandidateStatus, processed through the standard registration pipeline, and assigned a stable IRI. Examples: published reports, archived map products, formally delivered outputs."@en ;
      skos:scopeNote
          "When persistencePolicy is PersistentProjection, hproj:registeredAs MUST be present once registration is complete. The registered DataHolon's provenance MUST trace back to the originating holons via prov:wasDerivedFrom."@en .

}
```

### 2.3 Rendering Mode Scheme

The four client modes defined in the SCE architecture.

<!-- databook:id: rendering-mode-scheme -->
<!-- databook:graph: http://w3id.org/holon/projection/#skos-modes -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

GRAPH <http://w3id.org/holon/projection/#skos-modes> {

  hproj:RenderingModeScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Rendering Mode"@en ;
      dcterms:description
          "The four rendering modes in which a client may consume a DepictionProjection. The active mode is a client-declared property; the same holon may simultaneously serve clients in different modes from the same event stream. Each mode maps to a default hmedia:CameraAgent preset declared in Pass F."@en ;
      skos:hasTopConcept
          hproj:CinematicMode ,
          hproj:ImmersiveMode ,
          hproj:ActiveInferenceMode ,
          hproj:ExplodedViewMode .

  hproj:CinematicMode a skos:Concept ;
      skos:inScheme      hproj:RenderingModeScheme ;
      skos:topConceptOf  hproj:RenderingModeScheme ;
      rdfs:label         "Cinematic Mode"@en ;
      skos:notation      "CINEMATIC" ;
      skos:definition
          "The client is a passive observer of recorded state. The projection graph is queried across a time dimension — entity trajectories extracted as ordered state snapshots and rendered as animation frames or narrative sequences. Enables historical replay and, with Bayesian inference, counterfactual trajectory visualisation."@en .

  hproj:ImmersiveMode a skos:Concept ;
      skos:inScheme      hproj:RenderingModeScheme ;
      skos:topConceptOf  hproj:RenderingModeScheme ;
      rdfs:label         "Immersive Mode"@en ;
      skos:notation      "IMMERSIVE" ;
      skos:definition
          "The client is an agent inside the holon. Perspective management applies: what the agent can see and interact with is a filtered projection of the scene graph based on the agent's authorisation and point of view. The AI Cartographer generates first-person or third-person depictions from the entity's DataBook properties."@en ;
      skos:scopeNote
          "Immersive mode is the primary build target for conversational and interactive deployments. Text generation is the minimal depiction; richer modes (SVG, GeoJSON overlays) enhance it."@en .

  hproj:ActiveInferenceMode a skos:Concept ;
      skos:inScheme      hproj:RenderingModeScheme ;
      skos:topConceptOf  hproj:RenderingModeScheme ;
      rdfs:label         "Active Inference Mode"@en ;
      skos:notation      "ACTIVE-INFERENCE" ;
      skos:definition
          "The client runs a generative model of the holon, comparing predictions against incoming projection deltas. High surprise triggers model updates and behaviour adjustment. Connects to the Friston Active Inference / Free Energy framework formalised in hbayes:."@en ;
      skos:scopeNote
          "In multi-agent contexts, divergence between agents' generative models is semantically significant — it may indicate conflicting information, different access levels, or genuine uncertainty about world state."@en .

  hproj:ExplodedViewMode a skos:Concept ;
      skos:inScheme      hproj:RenderingModeScheme ;
      skos:topConceptOf  hproj:RenderingModeScheme ;
      rdfs:label         "Exploded View Mode"@en ;
      skos:notation      "EXPLODED-VIEW" ;
      skos:definition
          "An analyst client composites multiple projection graphs simultaneously as overlaid layers. The AI Cartographer identifies layer intersections and emergent cross-layer relationships. Includes a temporal dimension — layers may be offset in time for historical comparison."@en .

}
```

### 2.4 Content Format Scheme

<!-- databook:id: content-format-scheme -->
<!-- databook:graph: http://w3id.org/holon/projection/#skos-formats -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

GRAPH <http://w3id.org/holon/projection/#skos-formats> {

  hproj:ContentFormatScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Projection Content Format"@en ;
      dcterms:description
          "Controlled vocabulary for the content format of a projection payload. Each concept identifies the format of the content carried in hproj:contentGraph, hproj:contentURI, or hproj:contentLiteral. Concepts carry skos:notation values aligned with IANA media type strings where applicable."@en ;
      skos:hasTopConcept
          hproj:DataBookFormat ,
          hproj:TurtleFormat ,
          hproj:JSONLDFormat ,
          hproj:HTMLFormat ,
          hproj:TextFormat ,
          hproj:SVGFormat ,
          hproj:MermaidFormat ,
          hproj:VegaLiteFormat ,
          hproj:GeoJSONFormat ,
          hproj:KMLFormat ,
          hproj:GeoPackageFormat ,
          hproj:ShapefileFormat ,
          hproj:CSVFormat ,
          hproj:SPARQLResultsJSONFormat .

  hproj:DataBookFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "DataBook"@en ;
      skos:notation  "text/markdown" ;
      skos:definition "The projection payload is a DataBook — a Markdown document carrying YAML frontmatter and typed fenced blocks. The canonical HGA self-describing artefact format."@en .

  hproj:TurtleFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "Turtle 1.2"@en ;
      skos:notation  "text/turtle" ;
      skos:definition "The payload is an RDF named graph serialised in Turtle 1.2 syntax. Standard for Now Graph scene blocks."@en .

  hproj:JSONLDFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "JSON-LD"@en ;
      skos:notation  "application/ld+json" ;
      skos:definition "The payload is an RDF graph in JSON-LD 1.1 compact form using the HGA context."@en .

  hproj:HTMLFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "HTML"@en ;
      skos:notation  "text/html" ;
      skos:definition "The payload is an HTML document. Used for browser-rendered depictions and published reports."@en .

  hproj:TextFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "Plain Text"@en ;
      skos:notation  "text/plain" ;
      skos:definition "The payload is plain text or conversational prose generated by the AI Cartographer. The lightest depiction; always available regardless of client capability."@en .

  hproj:SVGFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "SVG"@en ;
      skos:notation  "image/svg+xml" ;
      skos:definition "The payload is a Scalable Vector Graphics document. Used for structural diagrams, schematic maps, and graph topology depictions."@en .

  hproj:MermaidFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "Mermaid"@en ;
      skos:notation  "text/x-mermaid" ;
      skos:definition "The payload is a Mermaid diagram specification. Rendered client-side by the Mermaid library. Used for flowcharts, sequence diagrams, and entity-relationship diagrams."@en .

  hproj:VegaLiteFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "Vega-Lite"@en ;
      skos:notation  "application/vnd.vega.lite+json" ;
      skos:definition "The payload is a Vega-Lite chart specification. Used for statistical and analytical visualisations of holon state."@en .

  hproj:GeoJSONFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "GeoJSON"@en ;
      skos:notation  "application/geo+json" ;
      skos:definition "The payload is a GeoJSON feature collection. Used for geographic overlays on mapping clients. Preferred lightweight GIS format for web delivery."@en .

  hproj:KMLFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "KML"@en ;
      skos:notation  "application/vnd.google-earth.kml+xml" ;
      skos:definition "The payload is a Keyhole Markup Language document. Used for geographic visualisations in Google Earth, QGIS, and compatible GIS clients."@en .

  hproj:GeoPackageFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "GeoPackage"@en ;
      skos:notation  "application/geopackage+sqlite3" ;
      skos:definition "The payload is an OGC GeoPackage container (SQLite-based). Preferred format for full-fidelity GIS data exchange."@en .

  hproj:ShapefileFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "Shapefile"@en ;
      skos:notation  "application/x-esri-shapefile" ;
      skos:definition "The payload is an ESRI Shapefile archive. Legacy GIS format; supported for compatibility. New deployments SHOULD prefer GeoPackage."@en .

  hproj:CSVFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "CSV"@en ;
      skos:notation  "text/csv" ;
      skos:definition "The payload is a comma-separated values tabular dataset. Used for analytical exports and integration with spreadsheet tooling."@en .

  hproj:SPARQLResultsJSONFormat a skos:Concept ;
      skos:inScheme  hproj:ContentFormatScheme ;
      rdfs:label     "SPARQL Results JSON"@en ;
      skos:notation  "application/sparql-results+json" ;
      skos:definition "The payload is a SPARQL 1.2 query results set in JSON format. Used for API response projections and programmatic consumption."@en .

}
```

### 2.5 Transmission Mode Scheme

<!-- databook:id: transmission-mode-scheme -->
<!-- databook:graph: http://w3id.org/holon/projection/#skos-transmission -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/projection/#skos-transmission> {

  hproj:TransmissionModeScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Projection Transmission Mode"@en ;
      dcterms:description
          "Whether a projection is pushed eagerly (streaming) or pulled lazily (request/response)."@en ;
      skos:hasTopConcept
          hproj:EagerTransmission ,
          hproj:LazyTransmission .

  hproj:EagerTransmission a skos:Concept ;
      skos:inScheme      hproj:TransmissionModeScheme ;
      skos:topConceptOf  hproj:TransmissionModeScheme ;
      rdfs:label         "Eager (Push/Streaming)"@en ;
      skos:notation      "EAGER" ;
      skos:definition
          "Scene graph UPDATE and projection emission are a single atomic step. The projection is delivered over WebSocket immediately after scene state changes."@en .

  hproj:LazyTransmission a skos:Concept ;
      skos:inScheme      hproj:TransmissionModeScheme ;
      skos:topConceptOf  hproj:TransmissionModeScheme ;
      rdfs:label         "Lazy (Pull/Request)"@en ;
      skos:notation      "LAZY" ;
      skos:definition
          "The triplestore is authoritative. The client requests a snapshot when needed via REST. The projection is generated from a SPARQL CONSTRUCT or DESCRIBE at query time."@en .

}
```

---

## 3. Vocabulary Declarations

<!-- databook:id: projection-vocabulary -->
<!-- databook:graph: http://w3id.org/holon/projection/#vocabulary -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .

GRAPH <http://w3id.org/holon/projection/#vocabulary> {

  # ── Classes ────────────────────────────────────────────────────────────────

  hproj:Projection a owl:Class ;
      rdfs:label   "Projection"@en ;
      rdfs:comment "Abstract base class for all HGA projection artefacts. A projection is an envelope on content — it carries provenance, transmission metadata, format declaration, and persistence policy. The content itself (KML, SVG, DataBook, etc.) is at hproj:contentGraph or hproj:contentURI and is not constrained by hproj: shapes."@en ;
      sh:agentInstruction
          "A Projection is the output side of the holon pipeline. Check projectionType to know what kind of product this is, validAt to know what scene state it reflects, and contentFormat to know how to parse the content."@en ;
      rdfs:subClassOf prov:Entity .    # non-normative OWL 2 RL

  hproj:NowGraph a owl:Class ;
      rdfs:label   "Now Graph"@en ;
      rdfs:comment "Stage 8 output. A contextual slice of the scene graph produced for a specific requesting agent and purpose. The AI Cartographer's primary input. Carries a scene graph block, provenance block, prompt block reference, and active parameter bindings (Bayesian frames, PoV, layer selections)."@en ;
      sh:agentInstruction
          "A NowGraph is what the cartographer reads. It is a filtered, agent-scoped view of the current scene. Check sceneGraphBlock for the current state, promptBlock for the cartographer's instruction, and parameterBlock for the active reasoning context. If hmedia:cameraRef is present, it specifies the rendering viewpoint and sensor type."@en ;
      rdfs:subClassOf hproj:Projection .

  hproj:DepictionProjection a owl:Class ;
      rdfs:label   "Depiction Projection"@en ;
      rdfs:comment "Stage 9 output. The AI Cartographer's rendered product. Derived from a NowGraph via a CartographerActivity using a registered PromptBlock. Content may be text, SVG, GeoJSON, Mermaid spec, KML, or any declared content format."@en ;
      sh:agentInstruction
          "A DepictionProjection is what the client receives and renders. The content is the depiction itself — prose, a diagram, a map. The envelope tells you where it came from (derivedFromNowGraph), how it was made (prov:wasGeneratedBy → CartographerActivity), and what rendering mode it targets (renderingMode). If hmedia:cameraRef is present, the depiction was produced from a specific camera viewpoint."@en ;
      rdfs:subClassOf hproj:Projection .

  hproj:OutputProduct a owl:Class ;
      rdfs:label   "Output Product"@en ;
      rdfs:comment "A formal deliverable produced for external consumption — a published report, map product, archived export DataBook, or packaged delivery. Persistent output products are registered as DataHolons in the registry and assigned stable IRIs."@en ;
      sh:agentInstruction
          "An OutputProduct is a projection that has been (or is intended to be) formally published or delivered. Check persistencePolicy: if Persistent, registeredAs gives the DataHolon IRI where it lives in the registry."@en ;
      rdfs:subClassOf hproj:Projection .

  hproj:ProjectionActivity a owl:Class ;
      rdfs:label   "Projection Activity"@en ;
      rdfs:comment "A prov:Activity representing one pipeline projection run — either stage 8 (scene projection → now graph) or stage 9 (cartographer depiction). Connects source holons, requesting agent, and output projection."@en ;
      sh:agentInstruction
          "A ProjectionActivity is the pipeline run that produced a projection. It links source holons, the requesting agent, and the output artefact. Check hproj:projectionStageNumber to know whether this is stage 8 or 9."@en ;
      rdfs:subClassOf hprov:IngestionActivity .   # non-normative OWL 2 RL

  hproj:CartographerActivity a owl:Class ;
      rdfs:label   "Cartographer Activity"@en ;
      rdfs:comment "A stage 9 ProjectionActivity in which the AI Cartographer reads a NowGraph and produces a DepictionProjection. Carries the now graph used as input, the prompt block applied, and the rendering mode targeted."@en ;
      sh:agentInstruction
          "A CartographerActivity records what the AI Cartographer did. usedNowGraph is its scene input; usedPromptBlock is its interpretive instruction; the output is a DepictionProjection."@en ;
      rdfs:subClassOf hproj:ProjectionActivity .

  hproj:PromptBlock a owl:Class ;
      rdfs:label   "Prompt Block"@en ;
      rdfs:comment "A named, versioned, registered prompt used by the AI Cartographer. Has a declared input type (what projection graph structure it expects) and a declared output modality (what format it produces). PromptBlocks are versioned, shareable, composable, and registered as DataHolons."@en ;
      sh:agentInstruction
          "A PromptBlock is the cartographer's interpretive lens. Its expectedInputType tells you what kind of projection it expects; its declaredOutputModality tells you what format it will produce. Multiple PromptBlocks may be registered for the same holon type — the client selects the lens."@en ;
      rdfs:subClassOf holon:DataHolon .

  # ── Envelope Properties — shared across all Projection types ──────────────

  hproj:projectionType a owl:ObjectProperty ;
      rdfs:label   "projection type"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The type of this projection artefact. MUST be a concept from hproj:ProjectionTypeScheme."@en .

  hproj:validAt a owl:DatatypeProperty ;
      rdfs:label   "valid at"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   xsd:dateTime ;
      dcterms:description
          "The UTC timestamp of the scene graph state this projection captures."@en .

  hproj:expiresAt a owl:DatatypeProperty ;
      rdfs:label   "expires at"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   xsd:dateTime ;
      dcterms:description
          "The UTC timestamp after which this projection is considered stale and SHOULD NOT be consumed without re-generating. If absent, the projection does not expire."@en .

  hproj:requestingAgent a owl:ObjectProperty ;
      rdfs:label   "requesting agent"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   holon:AgentHolon ;
      dcterms:description
          "The AgentHolon that requested this projection."@en .

  hproj:sourceHolon a owl:ObjectProperty ;
      rdfs:label   "source holon"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   holon:Holon ;
      dcterms:description
          "A holon whose state is included in this projection. One projection may cover multiple source holons. Use prov:wasDerivedFrom for the formal provenance link."@en .

  hproj:contentFormat a owl:ObjectProperty ;
      rdfs:label   "content format"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The format of the projection content. MUST be a concept from hproj:ContentFormatScheme."@en .

  hproj:persistencePolicy a owl:ObjectProperty ;
      rdfs:label   "persistence policy"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "Whether this projection is ephemeral (consumed and discarded) or persistent (registered as a DataHolon). MUST be a concept from hproj:PersistencePolicyScheme. Defaults to hproj:EphemeralProjection if absent."@en .

  hproj:registeredAs a owl:ObjectProperty ;
      rdfs:label   "registered as"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   holon:DataHolon ;
      dcterms:description
          "When persistencePolicy is hproj:PersistentProjection, this property MUST be set once registration is complete."@en .

  hproj:transmissionType a owl:DatatypeProperty ;
      rdfs:label   "transmission type"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   xsd:string ;
      dcterms:description
          "Whether this projection is a full snapshot or an incremental delta. Controlled values: 'full' or 'delta'. Defaults to 'full' if absent."@en .

  hproj:transmissionSequence a owl:DatatypeProperty ;
      rdfs:label   "transmission sequence"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   xsd:integer ;
      dcterms:description
          "Sequential integer identifying this projection's position in an event stream."@en .

  hproj:baseProjection a owl:ObjectProperty ;
      rdfs:label   "base projection"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   hproj:Projection ;
      dcterms:description
          "For delta projections: the full projection this delta applies to."@en .

  hproj:transmissionMode a owl:ObjectProperty ;
      rdfs:label   "transmission mode"@en ;
      rdfs:domain  hproj:Projection ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "Whether this projection was delivered eagerly (WebSocket push) or lazily (REST pull). From hproj:TransmissionModeScheme."@en .

  # ── NowGraph Properties ────────────────────────────────────────────────────

  hproj:projectionDepth a owl:DatatypeProperty ;
      rdfs:label   "projection depth"@en ;
      rdfs:domain  hproj:NowGraph ;
      rdfs:range   xsd:integer ;
      dcterms:description
          "How many containment levels of the holonic hierarchy are included. 0 = root holon only. 1 = root + immediate children. -1 = full subgraph (unlimited)."@en ;
      sh:agentInstruction
          "Projection depth controls the zoom level. Depth 0 is the highest level summary. -1 gives the complete subgraph but may be expensive to produce."@en .

  hproj:filterShape a owl:ObjectProperty ;
      rdfs:label   "filter shape"@en ;
      rdfs:domain  hproj:NowGraph ;
      rdfs:range   sh:NodeShape ;
      dcterms:description
          "An optional SHACL NodeShape applied to the scene graph during now graph generation to select only the relevant subset of triples."@en .

  hproj:sceneGraphBlock a owl:DatatypeProperty ;
      rdfs:label   "scene graph block"@en ;
      rdfs:domain  hproj:NowGraph ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "The named graph IRI containing the current-state RDF triples for the holons in this projection."@en .

  hproj:provenanceBlock a owl:DatatypeProperty ;
      rdfs:label   "provenance block"@en ;
      rdfs:domain  hproj:NowGraph ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "The named graph IRI containing the PROV-O provenance trail for all assertions in the scene graph block."@en .

  hproj:promptBlock a owl:ObjectProperty ;
      rdfs:label   "prompt block"@en ;
      rdfs:domain  hproj:NowGraph ;
      rdfs:range   hproj:PromptBlock ;
      dcterms:description
          "The registered PromptBlock IRI that the AI Cartographer SHOULD use when depicting this now graph."@en .

  hproj:parameterBlock a owl:DatatypeProperty ;
      rdfs:label   "parameter block"@en ;
      rdfs:domain  hproj:NowGraph ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "Named graph IRI of the active parameter bindings for this projection: Bayesian authority frames, layer selections, point-of-view agent, and any other runtime parameters."@en .

  # ── DepictionProjection Properties ────────────────────────────────────────

  hproj:derivedFromNowGraph a owl:ObjectProperty ;
      rdfs:label   "derived from now graph"@en ;
      rdfs:domain  hproj:DepictionProjection ;
      rdfs:range   hproj:NowGraph ;
      dcterms:description
          "The NowGraph from which this depiction was produced. Provides the formal derivation link for provenance."@en .

  hproj:renderingMode a owl:ObjectProperty ;
      rdfs:label   "rendering mode"@en ;
      rdfs:domain  hproj:DepictionProjection ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The client rendering mode this depiction targets. MUST be a concept from hproj:RenderingModeScheme."@en .

  hproj:contentGraph a owl:DatatypeProperty ;
      rdfs:label   "content graph"@en ;
      rdfs:domain  hproj:DepictionProjection ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "Named graph IRI of the depiction content when it is serialisable as RDF (Turtle, JSON-LD, SPARQL results)."@en .

  hproj:contentURI a owl:DatatypeProperty ;
      rdfs:label   "content URI"@en ;
      rdfs:domain  hproj:DepictionProjection ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "Dereferenceable IRI of the depiction content when it is a non-RDF external resource (KML file, GeoPackage, Shapefile, etc.)."@en .

  hproj:contentLiteral a owl:DatatypeProperty ;
      rdfs:label   "content literal"@en ;
      rdfs:domain  hproj:DepictionProjection ;
      rdfs:range   xsd:string ;
      dcterms:description
          "Inline string content for compact depictions — short prose narratives, Mermaid diagram specs, SVG strings."@en .

  # ── Pass F Bridge — Camera Reference ─────────────────────────────────────
  # hmedia:cameraRef is DEFINED in Pass F (hga-pass-f-media.databook.md).
  # It is declared here as a cross-namespace reference so that hproj: shapes
  # can include it in sh:ignoredProperties and provide advisory sh:property
  # constraints. Implementations that do not load Pass F MAY ignore this
  # property without violation.

  hmedia:cameraRef a owl:ObjectProperty ;
      rdfs:label   "camera reference"@en ;
      rdfs:domain  hproj:NowGraph, hproj:DepictionProjection ;
      rdfs:range   hmedia:CameraAgent ;
      dcterms:description
          "Optional reference to an hmedia:CameraAgent (Pass F) whose sensory characteristics define the point of view and sensor type for this projection. When present, the cartographer uses the camera's sensorType, shotType, and perspective as rendering hints. Multiple cameras MAY produce multiple concurrent projections from the same NowGraph. Advisory property — ignored by implementations that do not load Pass F."@en ;
      rdfs:seeAlso <http://w3id.org/holon/spec/media> .

  # ── ProjectionActivity Properties ──────────────────────────────────────────

  hproj:projectionStageNumber a owl:DatatypeProperty ;
      rdfs:label   "projection stage number"@en ;
      rdfs:domain  hproj:ProjectionActivity ;
      rdfs:range   xsd:integer ;
      dcterms:description
          "The SCE pipeline stage number: 8 for scene projection (NowGraph production), 9 for cartographer depiction (DepictionProjection production)."@en .

  # ── CartographerActivity Properties ───────────────────────────────────────

  hproj:usedNowGraph a owl:ObjectProperty ;
      rdfs:label   "used now graph"@en ;
      rdfs:domain  hproj:CartographerActivity ;
      rdfs:range   hproj:NowGraph ;
      dcterms:description
          "The NowGraph consumed as input by this CartographerActivity."@en .

  hproj:usedPromptBlock a owl:ObjectProperty ;
      rdfs:label   "used prompt block"@en ;
      rdfs:domain  hproj:CartographerActivity ;
      rdfs:range   hproj:PromptBlock ;
      dcterms:description
          "The PromptBlock applied by the AI Cartographer in this activity."@en .

  # ── PromptBlock Properties ─────────────────────────────────────────────────

  hproj:expectedInputType a owl:ObjectProperty ;
      rdfs:label   "expected input type"@en ;
      rdfs:domain  hproj:PromptBlock ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The projection type this prompt block expects as input. From hproj:ProjectionTypeScheme. Optional — a prompt block may be input-agnostic."@en .

  hproj:declaredOutputModality a owl:ObjectProperty ;
      rdfs:label   "declared output modality"@en ;
      rdfs:domain  hproj:PromptBlock ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The content format this prompt block will produce. From hproj:ContentFormatScheme."@en .

}
```

---

## 4. SHACL 1.2 Shapes

<!-- databook:id: projection-shapes -->
<!-- databook:graph: http://w3id.org/holon/projection/#shapes -->
<!-- mode=normative norm=true conformance=projection rfc2119=MUST -->
```trig
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix hev:     <http://w3id.org/holon/event/> .

GRAPH <http://w3id.org/holon/projection/#shapes> {

  # ── ProjectionBaseShape ────────────────────────────────────────────────────
  # Used via sh:node in all specific projection shapes.

  hproj:ProjectionBaseShape a sh:NodeShape ;
      sh:name   "Projection (base)"@en ;
      sh:intent "Validates the minimum envelope of any HGA projection: IRI identity, label, projection type, the scene graph timestamp it captures, the requesting agent, and provenance."@en ;
      sh:agentInstruction
          "Every projection must say what it is (projectionType), when the scene was (validAt), who asked for it (requestingAgent), and how it was made (prov:wasGeneratedBy). These four are the minimum for a traceable, auditable projection."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [
          sh:path     rdfs:label ;
          sh:minCount 1 ;
          sh:or ( [ sh:datatype xsd:string ] [ sh:datatype rdf:langString ] ) ;
          sh:severity sh:Violation ;
          sh:message  "Projection MUST have at least one rdfs:label."@en ;
      ] ;

      sh:property [
          sh:path     hproj:projectionType ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "Projection MUST declare exactly one projectionType from hproj:ProjectionTypeScheme."@en ;
      ] ;

      sh:property [
          sh:path     hproj:validAt ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:datatype xsd:dateTime ;
          sh:severity sh:Violation ;
          sh:message  "Projection MUST declare exactly one validAt timestamp."@en ;
      ] ;

      sh:property [
          sh:path     hproj:requestingAgent ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    holon:AgentHolon ;
          sh:severity sh:Violation ;
          sh:message  "Projection MUST declare exactly one requestingAgent AgentHolon."@en ;
      ] ;

      sh:property [
          sh:path     prov:wasGeneratedBy ;
          sh:minCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "Projection MUST carry prov:wasGeneratedBy linking to the generating ProjectionActivity."@en ;
      ] ;

      sh:property [
          sh:path     hproj:contentFormat ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "Projection MUST declare exactly one contentFormat from hproj:ContentFormatScheme."@en ;
      ] ;

      sh:property [
          sh:path     hproj:persistencePolicy ;
          sh:maxCount 1 ;
          sh:in       ( hproj:EphemeralProjection hproj:PersistentProjection ) ;
          sh:severity sh:Violation ;
          sh:message  "persistencePolicy MUST be hproj:EphemeralProjection or hproj:PersistentProjection if present."@en ;
      ] ;

      sh:property [
          sh:path     hproj:transmissionType ;
          sh:maxCount 1 ;
          sh:datatype xsd:string ;
          sh:in       ( "full" "delta" ) ;
          sh:severity sh:Violation ;
          sh:message  "transmissionType MUST be 'full' or 'delta' if present."@en ;
      ] ;

      sh:property [
          sh:path     hproj:expiresAt ;
          sh:maxCount 1 ;
          sh:datatype xsd:dateTime ;
          sh:severity sh:Violation ;
          sh:message  "expiresAt MUST be xsd:dateTime if present."@en ;
      ] ;

      # registeredAs required when persistencePolicy is Persistent
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message  "A Projection with PersistentProjection policy MUST declare hproj:registeredAs once registration is complete."@en ;
          sh:prefixes hproj: ;
          sh:select   """
              SELECT $this WHERE {
                  $this hproj:persistencePolicy hproj:PersistentProjection .
                  FILTER NOT EXISTS { $this hproj:registeredAs ?dh }
              }
          """ ;
      ] ;

      # baseProjection required for delta transmissions
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message  "A delta projection (transmissionType 'delta') MUST declare a baseProjection."@en ;
          sh:prefixes hproj: ;
          sh:select   """
              SELECT $this WHERE {
                  $this hproj:transmissionType "delta" .
                  FILTER NOT EXISTS { $this hproj:baseProjection ?base }
              }
          """ ;
      ] ;

      # Read-only invariant — advisory
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Warning ;
          sh:message  "Projection provenance activity should not be a mutation event type (AssertionEvent or CommandEvent)."@en ;
          sh:prefixes ( hproj: hev: prov: ) ;
          sh:select   """
              SELECT $this WHERE {
                  $this prov:wasGeneratedBy ?act .
                  ?act a ?t .
                  VALUES ?t { hev:AssertionEvent hev:CommandEvent }
              }
          """ ;
      ] .

  # ── NowGraphShape ──────────────────────────────────────────────────────────

  hproj:NowGraphShape a sh:NodeShape ;
      sh:targetClass hproj:NowGraph ;
      sh:closed      true ;
      sh:ignoredProperties (
          rdf:type rdfs:label dcterms:description
          hproj:projectionType hproj:validAt hproj:expiresAt
          hproj:requestingAgent hproj:sourceHolon hproj:contentFormat
          hproj:persistencePolicy hproj:registeredAs
          hproj:transmissionType hproj:transmissionSequence
          hproj:baseProjection hproj:transmissionMode
          prov:wasGeneratedBy prov:wasDerivedFrom
          hproj:projectionDepth hproj:filterShape
          hproj:sceneGraphBlock hproj:provenanceBlock
          hproj:promptBlock hproj:parameterBlock
          hmedia:cameraRef   # Pass F bridge — present if Pass F loaded
      ) ;
      sh:name   "Now Graph"@en ;
      sh:intent "Validates a stage 8 Now Graph. Inherits base projection requirements. Requires sceneGraphBlock. Validates projectionDepth range. promptBlock and parameterBlock SHOULD be present. hmedia:cameraRef MAY be present (Pass F)."@en ;
      sh:agentInstruction
          "A NowGraph is the cartographer's scene. sceneGraphBlock MUST be present — that is where the domain state lives. projectionDepth tells you the zoom level. If hmedia:cameraRef is present, it specifies the rendering camera."@en ;
      sh:node hproj:ProjectionBaseShape ;

      sh:property [
          sh:path     hproj:sceneGraphBlock ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "NowGraph MUST declare exactly one sceneGraphBlock IRI."@en ;
      ] ;

      sh:property [
          sh:path        hproj:projectionDepth ;
          sh:maxCount    1 ;
          sh:datatype    xsd:integer ;
          sh:minInclusive -1 ;
          sh:severity    sh:Violation ;
          sh:message     "projectionDepth MUST be an integer ≥ -1 if present."@en ;
      ] ;

      sh:property [
          sh:path     hproj:promptBlock ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    hproj:PromptBlock ;
          sh:severity sh:Warning ;
          sh:message  "NowGraph SHOULD declare a promptBlock for the AI Cartographer."@en ;
      ] ;

      sh:property [
          sh:path     hproj:parameterBlock ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Info ;
          sh:message  "NowGraph MAY carry a parameterBlock with active Bayesian and rendering parameters."@en ;
      ] ;

      sh:property [
          sh:path     hproj:provenanceBlock ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "NowGraph SHOULD carry a provenanceBlock linking assertions to source events."@en ;
      ] ;

      # Pass F bridge — advisory only; not required
      sh:property [
          sh:path     hmedia:cameraRef ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Info ;
          sh:message  "NowGraph MAY carry hmedia:cameraRef (Pass F) to specify a rendering camera. Advisory — ignored if Pass F not loaded."@en ;
      ] .

  # ── DepictionProjectionShape ───────────────────────────────────────────────

  hproj:DepictionProjectionShape a sh:NodeShape ;
      sh:targetClass hproj:DepictionProjection ;
      sh:closed      true ;
      sh:ignoredProperties (
          rdf:type rdfs:label dcterms:description
          hproj:projectionType hproj:validAt hproj:expiresAt
          hproj:requestingAgent hproj:sourceHolon hproj:contentFormat
          hproj:persistencePolicy hproj:registeredAs
          hproj:transmissionType hproj:transmissionSequence
          hproj:baseProjection hproj:transmissionMode
          prov:wasGeneratedBy prov:wasDerivedFrom
          hproj:derivedFromNowGraph hproj:renderingMode
          hproj:contentGraph hproj:contentURI hproj:contentLiteral
          hmedia:cameraRef   # Pass F bridge — present if Pass F loaded
      ) ;
      sh:name   "Depiction Projection"@en ;
      sh:intent "Validates a stage 9 DepictionProjection. Requires derivedFromNowGraph and renderingMode. Requires at least one of: contentGraph, contentURI, or contentLiteral. hmedia:cameraRef MAY be present (Pass F)."@en ;
      sh:agentInstruction
          "A DepictionProjection is what the client renders. derivedFromNowGraph is its provenance. renderingMode tells you how to present it. Check contentFormat then use contentGraph, contentURI, or contentLiteral for the actual content."@en ;
      sh:node hproj:ProjectionBaseShape ;

      sh:property [
          sh:path     hproj:derivedFromNowGraph ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    hproj:NowGraph ;
          sh:severity sh:Violation ;
          sh:message  "DepictionProjection MUST declare exactly one derivedFromNowGraph."@en ;
      ] ;

      sh:property [
          sh:path     hproj:renderingMode ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:in       ( hproj:CinematicMode
                        hproj:ImmersiveMode
                        hproj:ActiveInferenceMode
                        hproj:ExplodedViewMode ) ;
          sh:severity sh:Violation ;
          sh:message  "DepictionProjection MUST declare exactly one renderingMode from hproj:RenderingModeScheme."@en ;
      ] ;

      # Pass F bridge — advisory only
      sh:property [
          sh:path     hmedia:cameraRef ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Info ;
          sh:message  "DepictionProjection MAY carry hmedia:cameraRef (Pass F) identifying the camera used to produce this depiction. Advisory — ignored if Pass F not loaded."@en ;
      ] ;

      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Violation ;
          sh:message  "DepictionProjection MUST carry at least one of: contentGraph, contentURI, or contentLiteral."@en ;
          sh:prefixes hproj: ;
          sh:select   """
              SELECT $this WHERE {
                  $this a hproj:DepictionProjection .
                  FILTER NOT EXISTS { $this hproj:contentGraph ?cg }
                  FILTER NOT EXISTS { $this hproj:contentURI   ?cu }
                  FILTER NOT EXISTS { $this hproj:contentLiteral ?cl }
              }
          """ ;
      ] .

  # ── OutputProductShape ─────────────────────────────────────────────────────

  hproj:OutputProductShape a sh:NodeShape ;
      sh:targetClass hproj:OutputProduct ;
      sh:name   "Output Product"@en ;
      sh:intent "Validates a formal output product. Inherits base projection requirements. Warns if persistence policy is absent (products are typically persistent). Requires contentFormat."@en ;
      sh:node   hproj:ProjectionBaseShape ;
      sh:agentInstruction
          "An OutputProduct is a formal deliverable. Check persistencePolicy — persistent products have a registeredAs DataHolon IRI."@en ;

      sh:property [
          sh:path     hproj:persistencePolicy ;
          sh:minCount 1 ;
          sh:severity sh:Warning ;
          sh:message  "OutputProduct SHOULD declare a persistencePolicy (typically PersistentProjection)."@en ;
      ] .

  # ── ProjectionActivityShape ────────────────────────────────────────────────

  hproj:ProjectionActivityShape a sh:NodeShape ;
      sh:targetClass hproj:ProjectionActivity ;
      sh:name   "Projection Activity"@en ;
      sh:intent "Validates a projection pipeline activity. Inherits IngestionActivityShape. Checks that projectionStageNumber is 8 or 9 if present."@en ;
      sh:node   hprov:IngestionActivityShape ;
      sh:agentInstruction
          "A ProjectionActivity is a pipeline run at stage 8 or 9. projectionStageNumber identifies which."@en ;

      sh:property [
          sh:path     hproj:projectionStageNumber ;
          sh:maxCount 1 ;
          sh:datatype xsd:integer ;
          sh:in       ( 8 9 ) ;
          sh:severity sh:Violation ;
          sh:message  "projectionStageNumber MUST be 8 or 9 if present."@en ;
      ] .

  # ── CartographerActivityShape ──────────────────────────────────────────────

  hproj:CartographerActivityShape a sh:NodeShape ;
      sh:targetClass hproj:CartographerActivity ;
      sh:name   "Cartographer Activity"@en ;
      sh:intent "Validates a stage 9 AI Cartographer activity. Requires usedNowGraph and usedPromptBlock."@en ;
      sh:node   hproj:ProjectionActivityShape ;
      sh:agentInstruction
          "A CartographerActivity is a stage 9 run. usedNowGraph is what the cartographer read; usedPromptBlock is how it was instructed."@en ;

      sh:property [
          sh:path     hproj:usedNowGraph ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    hproj:NowGraph ;
          sh:severity sh:Violation ;
          sh:message  "CartographerActivity MUST declare exactly one usedNowGraph."@en ;
      ] ;

      sh:property [
          sh:path     hproj:usedPromptBlock ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    hproj:PromptBlock ;
          sh:severity sh:Violation ;
          sh:message  "CartographerActivity MUST declare exactly one usedPromptBlock."@en ;
      ] .

  # ── PromptBlockShape ───────────────────────────────────────────────────────

  hproj:PromptBlockShape a sh:NodeShape ;
      sh:targetClass hproj:PromptBlock ;
      sh:name   "Prompt Block"@en ;
      sh:intent "Validates that a registered PromptBlock carries label, version, and declared output modality. expectedInputType is SHOULD."@en ;
      sh:agentInstruction
          "A PromptBlock is the cartographer's instruction set. declaredOutputModality tells you what format it will produce. It should be specific enough to know what to expect."@en ;
      sh:node holon:DataHolonShape ;

      sh:property [
          sh:path     hproj:declaredOutputModality ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "PromptBlock MUST declare exactly one declaredOutputModality from hproj:ContentFormatScheme."@en ;
      ] ;

      sh:property [
          sh:path     hproj:expectedInputType ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "PromptBlock SHOULD declare an expectedInputType."@en ;
      ] .

  # ── ProjectionBridgeReceptionShape ────────────────────────────────────────
  # Non-normative advisory shape. Checks that if hmedia:cameraRef is present
  # on any Projection, it points to something that looks like a CameraAgent.
  # Skipped by validators that do not load Pass F; carries sh:Info severity.

  hproj:ProjectionBridgeReceptionShape a sh:NodeShape ;
      sh:targetClass hproj:Projection ;
      sh:name   "Projection Camera Bridge (advisory)"@en ;
      sh:intent "If hmedia:cameraRef is asserted on a Projection, it SHOULD reference a resource of type hmedia:CameraAgent. Advisory only — Pass F dependent."@en ;

      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Info ;
          sh:message  "hmedia:cameraRef on a Projection SHOULD reference an hmedia:CameraAgent (Pass F). This advisory fires only when the reference is present but the target type is not declared."@en ;
          sh:select   """
              PREFIX hmedia: <http://w3id.org/holon/media/>
              SELECT $this WHERE {
                  $this hmedia:cameraRef ?cam .
                  FILTER NOT EXISTS { ?cam a hmedia:CameraAgent }
              }
          """ ;
      ] .

}
```

---

## 5. Pipeline Integration

### 5.1 Stage 8 → Stage 9 Data Flow

<!-- databook:id: pipeline-integration-example -->
<!-- mode=example norm=false -->
```turtle12
VERSION "1.2"
PREFIX hproj:   <http://w3id.org/holon/projection/>
PREFIX hmedia:  <http://w3id.org/holon/media/>
PREFIX holon:   <http://w3id.org/holon/>
PREFIX hev:     <http://w3id.org/holon/event/>
PREFIX prov:    <http://www.w3.org/ns/prov#>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>

# ── Stage 8: Scene Projection ─────────────────────────────────────────────

<urn:activity:scene-proj-001>
    a hproj:ProjectionActivity ;
    rdfs:label              "Scene projection — patient-007, 2026-06-04"@en ;
    hproj:projectionStageNumber 8 ;
    prov:startedAtTime      "2026-06-04T09:00:05Z"^^xsd:dateTime .

<urn:proj:now-patient-007-001>
    a hproj:NowGraph ;
    rdfs:label              "Now graph — patient-007, 2026-06-04T09:00:05"@en ;
    hproj:projectionType    hproj:NowGraphProjection ;
    hproj:validAt           "2026-06-04T09:00:05Z"^^xsd:dateTime ;
    hproj:requestingAgent   <urn:agent:ward-nurse-chen> ;
    hproj:contentFormat     hproj:TurtleFormat ;
    hproj:persistencePolicy hproj:EphemeralProjection ;
    hproj:projectionDepth   2 ;
    hproj:sceneGraphBlock   <urn:graph:scene-patient-007-snapshot> ;
    hproj:provenanceBlock   <urn:graph:prov-patient-007-snapshot> ;
    hproj:promptBlock       <urn:prompt:ward-round-immersive-v1> ;
    hproj:transmissionType  "full" ;
    # Optional Pass F camera reference — Immersive mode default camera
    hmedia:cameraRef        hmedia:ImmersiveDefault ;
    prov:wasGeneratedBy     <urn:activity:scene-proj-001> ;
    prov:wasDerivedFrom     <urn:holon:patient-007> .

# ── Stage 9: Cartographer Depiction ──────────────────────────────────────

<urn:activity:cartographer-001>
    a hproj:CartographerActivity ;
    rdfs:label              "Cartographer — ward round depiction, 2026-06-04"@en ;
    hproj:projectionStageNumber 9 ;
    hproj:usedNowGraph      <urn:proj:now-patient-007-001> ;
    hproj:usedPromptBlock   <urn:prompt:ward-round-immersive-v1> ;
    prov:startedAtTime      "2026-06-04T09:00:06Z"^^xsd:dateTime .

<urn:proj:depiction-patient-007-001>
    a hproj:DepictionProjection ;
    rdfs:label              "Ward round depiction — patient-007, 2026-06-04"@en ;
    hproj:projectionType    hproj:DepictionProjectionType ;
    hproj:validAt           "2026-06-04T09:00:05Z"^^xsd:dateTime ;
    hproj:requestingAgent   <urn:agent:ward-nurse-chen> ;
    hproj:contentFormat     hproj:TextFormat ;
    hproj:renderingMode     hproj:ImmersiveMode ;
    hproj:persistencePolicy hproj:EphemeralProjection ;
    hproj:derivedFromNowGraph <urn:proj:now-patient-007-001> ;
    hmedia:cameraRef        hmedia:ImmersiveDefault ;
    hproj:contentLiteral
        "Patient 007 is stable. Blood pressure is within normal range..."@en ;
    prov:wasGeneratedBy     <urn:activity:cartographer-001> .
```

### 5.2 Projection to DataHolon Transition

When a projection is designated persistent (output product to be formally
delivered), it transitions to a registered DataHolon. The transition is
normative:

1. `hproj:persistencePolicy` is set to `hproj:PersistentProjection`
2. The projection DataBook is submitted to the pipeline at Stage 5
   (confidence gate) as a candidate DataHolon
3. On registration, `hproj:registeredAs` is set to the assigned DataHolon IRI
4. The DataHolon's `prov:wasDerivedFrom` MUST trace back to the source holons

### 5.3 Projection Annotations

```turtle12
VERSION "1.2"
PREFIX hproj: <http://w3id.org/holon/projection/>
PREFIX holon: <http://w3id.org/holon/>
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

<urn:proj:depiction-patient-007-001>
    hproj:derivedFromNowGraph <urn:proj:now-patient-007-001>
    ~ <urn:ann:depiction-001-concern>
    {| rdfs:label   "Concern annotation: high-concern scene state at projection time"@en ;
       holon:concernLevel holon:HighConcern |} .
```

---

## 6. Manifest and Namespace Registry Updates

The following retroactive updates MUST be applied to the Pass 0 artefacts:

### Namespace Registry — addition

Add to the HGA sub-namespace table in `hga-pass0-namespace-registry.databook.md`:

| Prefix | Namespace IRI | Conformance | Content |
|---|---|---|---|
| `hproj:` | `http://w3id.org/holon/projection/` | Projection | Projection envelopes, NowGraph, depiction, output products, cartographer |

### Spec Manifest — addition

Add to conformance classes in `hga-pass0-manifest.databook.md`:

`hspec:HGAProjection` — extends `hspec:HGAExtended`. Definitions are normative in this Pass E DataBook.

Add to section registry:

`hspec:pass-e-projection` — `http://w3id.org/holon/spec/projection`, `sh:order 9`, conformance `hspec:HGAProjection`.

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
