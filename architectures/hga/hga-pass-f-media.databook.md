---
id: http://w3id.org/holon/spec/media
title: "HGA Media Vocabulary — Assets, Appearance, Scenes, and Cameras"
type: spec-section
version: 0.1.0
created: 2026-06-09
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
domain: http://w3id.org/holon/media/
subject:
  - media
  - appearance
  - scene descriptor
  - camera agent
  - SHACL 1.2
  - RDF 1.2
description: >
  Normative vocabulary and SHACL 1.2 shapes for the HGA Media layer.
  Defines hmedia:MediaContext (project-level asset root), hmedia:MediaAsset
  (addressable media resource), hmedia:appearance (lang-tagged rendering hint
  on any entity or event), hmedia:hasMedia (asset attachment), and
  hmedia:SceneDescriptor (repeatable event scene composite linked via
  hmedia:hasScene). Introduces hmedia:CameraAgent extending hmk:SensoryState
  — a passive sensor whose sensory characteristics define the rendering
  viewpoint. Adds hmedia:sensorOnly on hmk:MarkovBlanket to accommodate
  camera-only (sensor-only) Markov blankets. Defines five SKOS schemes:
  MediaRoleScheme, SensorTypeScheme, ShotTypeScheme, PerspectiveScheme,
  DepthOfFieldScheme. Declares four named camera preset individuals for
  the four hproj:RenderingModeScheme values. Includes a non-normative SPARQL
  CONSTRUCT for assembling scene narrative input bundles for the AI Cartographer.
  Introduces conformance class hspec:HGAMedia extending hspec:HGAMarkov.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass F"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - media
  rfc2119: true
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/media/
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: false
shapes:
  - http://w3id.org/holon/media/#shapes
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

### 1.1 Scope

The `hmedia:` vocabulary adds a **rendering and appearance layer** on top of the
holonic graph. It answers one question per graph element: *what does this look
like, and how should the AI Cartographer depict it?*

It is not a multimedia management system, nor a digital asset management (DAM)
vocabulary. It is a **semantic rendering hint** layer — lightweight, opt-in,
and non-intrusive. Holons and events function correctly without `hmedia:`.
Loading `hmedia:` grants the AI Cartographer access to:

- **Appearance descriptions** (`hmedia:appearance`) — lang-tagged prose hints
  attached directly to any holon or event
- **Media assets** (`hmedia:hasMedia`) — explicit named resources (images,
  audio, maps, models) attached to any holon or event
- **Scene compositions** (`hmedia:hasScene` → `hmedia:SceneDescriptor`) — event-
  level scene composites that bundle actor, location, narrative, and camera into
  a discrete rendering unit
- **Camera agents** (`hmedia:CameraAgent`) — sensor-only Markov blankets that
  characterise the rendering viewpoint

Pass F has no mandatory dependencies beyond `hmk:` (Pass E §1) and `hproj:`
(Pass E §2). Implementations that have not loaded Pass E may omit camera agents
and sensor-only blankets while still using MediaContext, MediaAsset, and
appearance properties.

### 1.2 The Appearance / Asset Distinction

Two distinct mechanisms serve different rendering needs:

**`hmedia:appearance`** is an inline, lang-tagged literal. It is *prose*, not a
resource. The AI Cartographer reads it directly as a rendering prompt fragment.

```turtle
<urn:holon:dr-chen>
    hmedia:appearance "A compact, precise woman in her early 40s wearing
        blue scrubs and wire-rimmed glasses. Moves with economical efficiency.
        Carries a tablet."@en .
```

**`hmedia:hasMedia`** points to a named `hmedia:MediaAsset` — a resolvable
external resource. The cartographer receives an asset IRI, MIME type, and
role. It may choose to embed the asset or use it as a reference.

```turtle
<urn:holon:dr-chen>
    hmedia:hasMedia <urn:media:chen-portrait-01> .

<urn:media:chen-portrait-01>
    a hmedia:MediaAsset ;
    hmedia:assetIRI "https://assets.example.org/people/chen-portrait.jpg" ;
    hmedia:mimeType "image/jpeg" ;
    hmedia:mediaRole hmedia:Primary .
```

Both MAY be present simultaneously. `hmedia:appearance` is for *generative*
depiction (the LLM produces prose or generates from the description).
`hmedia:hasMedia` is for *referential* depiction (the client retrieves an
existing asset).

### 1.3 MediaContext and Asset Portability

`hmedia:MediaContext` is a project-level asset root — a named resource that
declares a `hmedia:mediaBase` URI prefix. Assets that carry only a
relative-path `hmedia:assetIRI` are resolved against this base, making the
entire asset tree portable by changing one property.

```
hmedia:MediaContext
  hmedia:mediaBase "https://assets.holongraph.com/ggsc/"

hmedia:MediaAsset
  hmedia:assetIRI "maps/country-au-resilience.svg"   # resolved to full URI
  hmedia:inMediaContext <urn:context:ggsc-assets>
```

Implementations MAY support multiple contexts in a single graph. Assets without
`hmedia:inMediaContext` are treated as having absolute IRIs.

### 1.4 Sensor-Only Blankets and Camera Agents

A `hmedia:CameraAgent` is a subclass of `hmk:SensoryState`. It is a **passive
sensor** — it observes but does not deliberate. It cannot emit active state
projections and does not shield an `AgentHolon` in the full-agent sense.

To accommodate this, `hmk:MarkovBlanket` accepts `hmedia:sensorOnly true`,
which relaxes the four-surface requirement (see Pass E §1, §1.11). A camera
blanket has:
- One `hmk:SensoryState` — the `CameraAgent` itself
- No `hmk:ActiveState`, `hmk:InternalState`, or `hmk:shields` AgentHolon

The `CameraAgent` receives `hev:ObservationEvent` payloads (scene state
arriving at its sensory surface) and produces `hmedia:MediaAsset` outputs.
The asset production is modelled as the cartographer's depiction activity, not
as an active state emission.

```
hmk:MarkovBlanket
  hmedia:sensorOnly true
  hmk:hasSensoryStates → hmedia:CameraAgent

hmedia:CameraAgent a hmk:SensoryState
  hmedia:sensorType hmedia:VisualSensor
  hmedia:shotType   hmedia:Establishing
  hmedia:perspective hmedia:Omniscient
```

### 1.5 Scene Composition — Repeatable `hmedia:hasScene`

`hmedia:hasScene` is **repeatable**: one `hev:Event` may link to multiple
`hmedia:SceneDescriptor` instances. Each descriptor represents one camera's
rendering of that event — a wide establishing shot and a close-up character
reaction are two descriptors on the same event.

A `hmedia:SceneDescriptor` composites:
- `hmedia:sceneActor` — the principal agent (repeatable)
- `hmedia:sceneLocation` — the setting holon
- `hmedia:sceneEvent` — back-link to the event
- `hmedia:sceneNarrative` — prose description (author-supplied or LLM-generated)
- `hmedia:hasMedia` — the rendered asset (image, video, map) for this descriptor
- `hmedia:cameraRef` — the `CameraAgent` that produced this descriptor

This model allows a single event to be depicted from multiple viewpoints
simultaneously — cinematic replay, immersive first-person, and cartographic
overhead are each a separate `SceneDescriptor` on the same event node.

### 1.6 Projection Bridge

`hmedia:cameraRef` may be asserted on `hproj:NowGraph` and
`hproj:DepictionProjection` (declared in Pass E §2 as a cross-namespace bridge
property). When present, it specifies the default rendering camera for the
projection. The four `hproj:RenderingModeScheme` values map to named camera
preset individuals declared in §5 of this DataBook.

Implementations that load Pass F SHOULD assert `hmedia:cameraRef` on NowGraphs
produced for clients that have declared a rendering mode.

### 1.7 Conformance Class

<!-- databook:id: media-conformance-class -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

hspec:HGAMedia a hspec:ConformanceClass ;
    rdfs:label  "HGA Media"@en ;
    sh:order    6 ;
    hspec:extends hspec:HGAMarkov ;
    dcterms:description """Extends HGA Markov. Implementations MUST additionally support:
  (a) hmedia:MediaContext shape with hmedia:mediaBase URI;
  (b) hmedia:MediaAsset shape with IRI, MIME type, keywords, role, altText;
  (c) hmedia:appearance lang-tagged literal on any holon or event;
  (d) hmedia:hasMedia property on any holon or event;
  (e) hmedia:SceneDescriptor with repeatable hmedia:hasScene on events;
  (f) hmedia:CameraAgent extending hmk:SensoryState;
  (g) hmedia:sensorOnly on hmk:MarkovBlanket for sensor-only blankets;
  (h) hmedia:cameraRef on hproj:NowGraph and hproj:DepictionProjection;
  (i) Five SKOS schemes: MediaRole, SensorType, ShotType, Perspective, DepthOfField;
  (j) Four named camera preset individuals mapping to hproj:RenderingModeScheme."""@en .
```

---

## 2. SKOS Concept Schemes

### 2.1 Media Role Scheme

<!-- databook:id: media-role-scheme -->
<!-- databook:graph: http://w3id.org/holon/media/#skos-roles -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/media/#skos-roles> {

  hmedia:MediaRoleScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Media Role"@en ;
      dcterms:description
          "Classifies the functional role of a MediaAsset within its presentation context. Used as the range of hmedia:mediaRole."@en ;
      skos:hasTopConcept
          hmedia:Primary ,
          hmedia:Thumbnail ,
          hmedia:Background ,
          hmedia:Sprite ,
          hmedia:Audio ,
          hmedia:Video ,
          hmedia:Map ,
          hmedia:Model ,
          hmedia:Narrative .

  hmedia:Primary a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Primary"@en ;
      skos:notation     "PRIMARY" ;
      skos:definition   "The canonical visual representation of the entity. The first asset the cartographer should use when depicting the subject."@en .

  hmedia:Thumbnail a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Thumbnail"@en ;
      skos:notation     "THUMBNAIL" ;
      skos:definition   "A small preview image suitable for list views, map overlays, or compact depiction contexts. SHOULD be ≤ 256×256 pixels."@en .

  hmedia:Background a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Background"@en ;
      skos:notation     "BACKGROUND" ;
      skos:definition   "A backdrop or environment image for a location or scene. Used in immersive rendering to establish spatial context."@en .

  hmedia:Sprite a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Sprite"@en ;
      skos:notation     "SPRITE" ;
      skos:definition   "A discrete graphical element representing an agent or object in a 2D or isometric rendered scene."@en .

  hmedia:Audio a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Audio"@en ;
      skos:notation     "AUDIO" ;
      skos:definition   "A sound asset associated with the entity — ambient environment audio, voice, or sound effect. MIME types: audio/mpeg, audio/ogg, audio/wav."@en .

  hmedia:Video a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Video"@en ;
      skos:notation     "VIDEO" ;
      skos:definition   "A video asset associated with the entity — event replay, depiction animation, or documentary footage. MIME types: video/mp4, video/webm."@en .

  hmedia:Map a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Map"@en ;
      skos:notation     "MAP" ;
      skos:definition   "A geographic or schematic map asset. May be SVG, GeoJSON, KML, or raster. Used in cartographic rendering modes."@en .

  hmedia:Model a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "3D Model"@en ;
      skos:notation     "MODEL" ;
      skos:definition   "A three-dimensional model asset (GLTF, OBJ, STL). Used in geometric sensor rendering."@en .

  hmedia:Narrative a skos:Concept ;
      skos:inScheme     hmedia:MediaRoleScheme ;
      skos:topConceptOf hmedia:MediaRoleScheme ;
      rdfs:label        "Narrative"@en ;
      skos:notation     "NARRATIVE" ;
      skos:definition   "A pre-authored prose narrative asset. Used as a canonical depiction when LLM generation is not desired or available. MIME type: text/plain or text/markdown."@en .

}
```

### 2.2 Sensor Type Scheme

<!-- databook:id: sensor-type-scheme -->
<!-- databook:graph: http://w3id.org/holon/media/#skos-sensors -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/media/#skos-sensors> {

  hmedia:SensorTypeScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Media Sensor Type"@en ;
      dcterms:description
          "Classifies the sensory modality of a CameraAgent — what kind of observations it receives and what kind of media it produces."@en ;
      skos:hasTopConcept
          hmedia:VisualSensor ,
          hmedia:AudioSensor ,
          hmedia:GeometricSensor ,
          hmedia:CartographicSensor ,
          hmedia:TextualSensor .

  hmedia:VisualSensor a skos:Concept ;
      skos:inScheme     hmedia:SensorTypeScheme ;
      skos:topConceptOf hmedia:SensorTypeScheme ;
      rdfs:label        "Visual"@en ;
      skos:notation     "VISUAL" ;
      skos:definition   "The camera observes visible light and produces image or video assets. Cinematic and Immersive mode primary sensor."@en .

  hmedia:AudioSensor a skos:Concept ;
      skos:inScheme     hmedia:SensorTypeScheme ;
      skos:topConceptOf hmedia:SensorTypeScheme ;
      rdfs:label        "Audio"@en ;
      skos:notation     "AUDIO" ;
      skos:definition   "The camera captures sound and produces audio assets. Used for ambient scene audio, dialogue, or event sound signatures."@en .

  hmedia:GeometricSensor a skos:Concept ;
      skos:inScheme     hmedia:SensorTypeScheme ;
      skos:topConceptOf hmedia:SensorTypeScheme ;
      rdfs:label        "Geometric"@en ;
      skos:notation     "GEOMETRIC" ;
      skos:definition   "The sensor captures spatial geometry and produces 3D model or depth-map assets. Used for structural/architectural depictions."@en .

  hmedia:CartographicSensor a skos:Concept ;
      skos:inScheme     hmedia:SensorTypeScheme ;
      skos:topConceptOf hmedia:SensorTypeScheme ;
      rdfs:label        "Cartographic"@en ;
      skos:notation     "CARTOGRAPHIC" ;
      skos:definition   "The sensor captures geographic or schematic spatial relationships and produces map assets (GeoJSON, KML, SVG). Exploded View mode primary sensor."@en .

  hmedia:TextualSensor a skos:Concept ;
      skos:inScheme     hmedia:SensorTypeScheme ;
      skos:topConceptOf hmedia:SensorTypeScheme ;
      rdfs:label        "Textual"@en ;
      skos:notation     "TEXTUAL" ;
      skos:definition   "The sensor produces natural language descriptions. The AI Cartographer's generative mode — reads appearance properties and event state, produces prose narrative. Active Inference mode primary sensor."@en .

}
```

### 2.3 Shot Type Scheme

<!-- databook:id: shot-type-scheme -->
<!-- databook:graph: http://w3id.org/holon/media/#skos-shots -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/media/#skos-shots> {

  hmedia:ShotTypeScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Shot Type"@en ;
      dcterms:description
          "Classifies the compositional framing of a CameraAgent. Informs the AI Cartographer how much of the scene to include and how subjects should be framed in the output."@en ;
      skos:hasTopConcept
          hmedia:EstablishingShot ,
          hmedia:WideShot ,
          hmedia:MediumShot ,
          hmedia:CloseUp ,
          hmedia:OverTheShoulder ,
          hmedia:POV ,
          hmedia:BirdsEye ,
          hmedia:Isometric .

  hmedia:EstablishingShot a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Establishing Shot"@en ;
      skos:notation     "ESTABLISHING" ;
      skos:definition   "A wide view that establishes the full spatial context of the scene. Used to orient the viewer before closer shots. Typically the first shot in a sequence."@en .

  hmedia:WideShot a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Wide Shot"@en ;
      skos:notation     "WIDE" ;
      skos:definition   "A broad view that shows full figures and significant environmental context. Emphasises location over individual subjects."@en .

  hmedia:MediumShot a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Medium Shot"@en ;
      skos:notation     "MEDIUM" ;
      skos:definition   "A mid-range view showing subjects from roughly the waist up. Balances character and environment. Standard conversational framing."@en .

  hmedia:CloseUp a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Close-Up"@en ;
      skos:notation     "CLOSEUP" ;
      skos:definition   "A tight view focusing on a specific subject detail — a face, an object, a display. Emphasises emotional or information content over spatial context."@en .

  hmedia:OverTheShoulder a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Over the Shoulder"@en ;
      skos:notation     "OTS" ;
      skos:definition   "A view from behind one subject toward another. Establishes relationship and relative position. Common in dialogue depiction."@en .

  hmedia:POV a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Point of View"@en ;
      skos:notation     "POV" ;
      skos:definition   "A view from exactly the subject's eyeline. Used in immersive first-person rendering."@en .

  hmedia:BirdsEye a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Bird's Eye"@en ;
      skos:notation     "BIRDSEYE" ;
      skos:definition   "An overhead view looking straight down. Removes depth cues; emphasises spatial layout. Standard for geographic cartographic depictions."@en .

  hmedia:Isometric a skos:Concept ;
      skos:inScheme     hmedia:ShotTypeScheme ;
      skos:topConceptOf hmedia:ShotTypeScheme ;
      rdfs:label        "Isometric"@en ;
      skos:notation     "ISOMETRIC" ;
      skos:definition   "A 45-degree elevated diagonal view preserving relative scale without perspective distortion. Used in exploded-view analytical diagrams and structural depictions."@en .

}
```

### 2.4 Perspective Scheme

<!-- databook:id: perspective-scheme -->
<!-- databook:graph: http://w3id.org/holon/media/#skos-perspectives -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/media/#skos-perspectives> {

  hmedia:PerspectiveScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Rendering Perspective"@en ;
      dcterms:description
          "Classifies the narrative point of view of the depiction — whose perspective the AI Cartographer adopts when generating prose or selecting framing."@en ;
      skos:hasTopConcept
          hmedia:FirstPerson ,
          hmedia:ThirdPerson ,
          hmedia:Omniscient ,
          hmedia:CharacterPerspective .

  hmedia:FirstPerson a skos:Concept ;
      skos:inScheme     hmedia:PerspectiveScheme ;
      skos:topConceptOf hmedia:PerspectiveScheme ;
      rdfs:label        "First Person"@en ;
      skos:notation     "FIRST-PERSON" ;
      skos:definition   "Depiction adopts the requesting agent's point of view. The cartographer generates prose from 'I' perspective. Scene framing is from the agent's eyeline. Used in immersive mode deployments."@en .

  hmedia:ThirdPerson a skos:Concept ;
      skos:inScheme     hmedia:PerspectiveScheme ;
      skos:topConceptOf hmedia:PerspectiveScheme ;
      rdfs:label        "Third Person"@en ;
      skos:notation     "THIRD-PERSON" ;
      skos:definition   "Depiction observes from outside the principal agents. The cartographer generates prose in 'she/he/they' perspective. Scene framing shows subjects from the outside."@en .

  hmedia:Omniscient a skos:Concept ;
      skos:inScheme     hmedia:PerspectiveScheme ;
      skos:topConceptOf hmedia:PerspectiveScheme ;
      rdfs:label        "Omniscient"@en ;
      skos:notation     "OMNISCIENT" ;
      skos:definition   "Depiction has access to all available holon state, including internal state fragments visible in the projection graph. The cartographer may reference information that individual agents do not share. Used in analyst and cinematic modes."@en .

  hmedia:CharacterPerspective a skos:Concept ;
      skos:inScheme     hmedia:PerspectiveScheme ;
      skos:topConceptOf hmedia:PerspectiveScheme ;
      rdfs:label        "Character"@en ;
      skos:notation     "CHARACTER" ;
      skos:definition   "Depiction adopts the perspective of a specific named agent other than the requesting agent. Used for dialogue simulation, empathy exercises, and multi-agent narrative."@en .

}
```

### 2.5 Depth of Field Scheme

<!-- databook:id: dof-scheme -->
<!-- databook:graph: http://w3id.org/holon/media/#skos-dof -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/media/#skos-dof> {

  hmedia:DepthOfFieldScheme a skos:ConceptScheme ;
      rdfs:label    "HGA Depth of Field"@en ;
      dcterms:description
          "Classifies the depth of field rendering hint. Informs the AI Cartographer how much of the scene should appear in focus vs soft background."@en ;
      skos:hasTopConcept
          hmedia:ShallowDOF ,
          hmedia:NormalDOF ,
          hmedia:DeepDOF .

  hmedia:ShallowDOF a skos:Concept ;
      skos:inScheme     hmedia:DepthOfFieldScheme ;
      skos:topConceptOf hmedia:DepthOfFieldScheme ;
      rdfs:label        "Shallow"@en ;
      skos:notation     "SHALLOW" ;
      skos:definition   "Narrow focus plane — subject is sharp, background and foreground are soft. Emphasises a single focal subject. Common in portrait and close-up depiction."@en .

  hmedia:NormalDOF a skos:Concept ;
      skos:inScheme     hmedia:DepthOfFieldScheme ;
      skos:topConceptOf hmedia:DepthOfFieldScheme ;
      rdfs:label        "Normal"@en ;
      skos:notation     "NORMAL" ;
      skos:definition   "Standard depth of field. Subjects and immediate environment are sharp. Distant background may show mild softening. Balanced depiction."@en .

  hmedia:DeepDOF a skos:Concept ;
      skos:inScheme     hmedia:DepthOfFieldScheme ;
      skos:topConceptOf hmedia:DepthOfFieldScheme ;
      rdfs:label        "Deep"@en ;
      skos:notation     "DEEP" ;
      skos:definition   "Wide focus plane — everything from foreground to background appears sharp. Used in cartographic, establishing, and isometric depiction modes where spatial clarity throughout the frame is essential."@en .

}
```

---

## 3. Vocabulary Declarations

<!-- databook:id: media-vocabulary -->
<!-- databook:graph: http://w3id.org/holon/media/#vocabulary -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

GRAPH <http://w3id.org/holon/media/#vocabulary> {

  # ── Classes ────────────────────────────────────────────────────────────────

  hmedia:MediaContext a owl:Class ;
      rdfs:label   "Media Context"@en ;
      rdfs:comment "A project-level asset root that declares a base URI for resolving relative-path asset IRIs. Not holon-bound — a single MediaContext may be shared across all holons in a deployment, making the asset tree portable by changing one property."@en ;
      sh:agentInstruction
          "A MediaContext is the address book for media assets. Its mediaBase URI is the root against which relative assetIRI values are resolved. Find the project context, then look up assets by their relative paths."@en .

  hmedia:MediaAsset a owl:Class ;
      rdfs:label   "Media Asset"@en ;
      rdfs:comment "An addressable external media resource. Carries an asset IRI (absolute or relative to a MediaContext base), MIME type, optional keywords, a functional role from MediaRoleScheme, and optional accessibility text. Assets are attached to holons and events via hmedia:hasMedia."@en ;
      sh:agentInstruction
          "A MediaAsset is a resolved external resource. Check assetIRI for the full address, mimeType for how to handle it, and mediaRole for how to use it in depiction. If assetIRI is relative, combine it with the inMediaContext's mediaBase."@en .

  hmedia:SceneDescriptor a owl:Class ;
      rdfs:label   "Scene Descriptor"@en ;
      rdfs:comment "A composite scene unit linked to an event via hmedia:hasScene. One event may have multiple SceneDescriptors — each representing one camera's rendering of that event. A SceneDescriptor bundles: principal actor(s), location, back-link to the event, narrative prose, a rendered asset, and the camera that captured this view."@en ;
      sh:agentInstruction
          "A SceneDescriptor is one camera's view of an event. It composes who was there (sceneActor), where it happened (sceneLocation), what the prose says (sceneNarrative), what the rendered image is (hasMedia), and which camera captured it (cameraRef). Multiple descriptors on the same event = multiple simultaneous viewpoints."@en .

  hmedia:CameraAgent a owl:Class ;
      rdfs:label       "Camera Agent"@en ;
      rdfs:comment     "A passive sensor that extends hmk:SensoryState. A CameraAgent receives ObservationEvent payloads and characterises the rendering viewpoint. It does not deliberate or emit active state projections. CameraAgents live on sensor-only MarkovBlankets (hmedia:sensorOnly true). Sensor type determines output modality; shot type and perspective determine framing."@en ;
      rdfs:subClassOf  hmk:SensoryState ;
      sh:agentInstruction
          "A CameraAgent is a sensor, not an actor. Its sensorType tells you what kind of media it produces. Its shotType and perspective tell you how the scene is framed. Its focalLength and fieldOfView give cinematic parameters. It observes events; the AI Cartographer reads the camera properties when generating depictions."@en .

  # ── MarkovBlanket Extension ────────────────────────────────────────────────
  # hmedia:sensorOnly is declared here. The property is referenced in Pass E §1
  # (hmk:MarkovBlanketShape) as a SPARQL constraint guard. Implementations that
  # do not load Pass F treat it as an unknown property and apply the full
  # four-surface rule (correct fallback behaviour).

  hmedia:sensorOnly a owl:DatatypeProperty ;
      rdfs:label   "sensor only"@en ;
      rdfs:domain  hmk:MarkovBlanket ;
      rdfs:range   xsd:boolean ;
      dcterms:description
          "Declares that a MarkovBlanket is sensor-only — it has a SensoryState (typically a CameraAgent) but no ActiveState, InternalState, or AgentHolon shield. When true, hmk:MarkovBlanketShape relaxes its ActiveState and shields requirements from sh:Violation to sh:Warning."@en .

  # ── MediaContext Properties ────────────────────────────────────────────────

  hmedia:mediaBase a owl:DatatypeProperty ;
      rdfs:label   "media base"@en ;
      rdfs:domain  hmedia:MediaContext ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "The base URI for resolving relative-path assetIRI values in this context. MUST be a valid absolute IRI. SHOULD end with a path separator ('/')."@en .

  # ── MediaAsset Properties ──────────────────────────────────────────────────

  hmedia:assetIRI a owl:DatatypeProperty ;
      rdfs:label   "asset IRI"@en ;
      rdfs:domain  hmedia:MediaAsset ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "The IRI of the external media resource. If absolute, used directly. If relative, resolved against the hmedia:mediaBase of the asset's inMediaContext. MUST be resolvable by a conformant media client."@en .

  hmedia:mimeType a owl:DatatypeProperty ;
      rdfs:label   "MIME type"@en ;
      rdfs:domain  hmedia:MediaAsset ;
      rdfs:range   xsd:string ;
      dcterms:description
          "The IANA media type of the asset. MUST be a valid MIME type string (e.g., 'image/jpeg', 'image/svg+xml', 'audio/mpeg', 'video/mp4', 'model/gltf+json'). Governs how the asset is rendered by the client."@en .

  hmedia:keywords a owl:DatatypeProperty ;
      rdfs:label   "keywords"@en ;
      rdfs:domain  hmedia:MediaAsset ;
      rdfs:range   xsd:string ;
      dcterms:description
          "One or more keyword tags for the asset. Repeatable. Used for semantic retrieval and similarity matching. Each value SHOULD be a single lowercase term or short phrase."@en .

  hmedia:mediaRole a owl:ObjectProperty ;
      rdfs:label   "media role"@en ;
      rdfs:domain  hmedia:MediaAsset ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The functional role of this asset. MUST be a concept from hmedia:MediaRoleScheme."@en .

  hmedia:altText a owl:DatatypeProperty ;
      rdfs:label   "alt text"@en ;
      rdfs:domain  hmedia:MediaAsset ;
      rdfs:range   xsd:string ;
      dcterms:description
          "Accessibility description of the asset. SHOULD be provided for all visual assets. Used by screen readers and textual sensor cameras."@en .

  hmedia:inMediaContext a owl:ObjectProperty ;
      rdfs:label   "in media context"@en ;
      rdfs:domain  hmedia:MediaAsset ;
      rdfs:range   hmedia:MediaContext ;
      dcterms:description
          "The MediaContext that provides the base URI for resolving this asset's IRI. If absent, the assetIRI is treated as absolute."@en .

  # ── Appearance and Attachment ──────────────────────────────────────────────

  hmedia:appearance a owl:DatatypeProperty ;
      rdfs:label   "appearance"@en ;
      rdfs:comment "A lang-tagged prose description of the visual or sensory appearance of the subject. Attached directly to any holon or event. Acts as a rendering prompt fragment for the AI Cartographer. Multiple values per subject are permitted for different languages."@en ;
      dcterms:description
          "Usage: attach a short evocative prose description. Do not limit to visual — include texture, sound, scent where relevant. The AI Cartographer reads this directly as part of scene generation. For events, describe the observable dynamics of the occurrence, not just its static properties."@en ;
      sh:agentInstruction
          "appearance is your primary rendering hint for this entity. Read it before generating any depiction prose. It is NOT a caption — it is the raw material for generating the depiction. Combine it with the scene camera's perspective and shot type to produce the final output."@en .

  hmedia:hasMedia a owl:ObjectProperty ;
      rdfs:label   "has media"@en ;
      rdfs:comment "Links any holon or event to an hmedia:MediaAsset. Provides explicit asset attachment for referential depiction. Multiple assets per subject are permitted (different roles)."@en ;
      rdfs:range   hmedia:MediaAsset ;
      dcterms:description
          "Use hmedia:mediaRole on the asset to distinguish Primary, Thumbnail, Background, etc. The cartographer selects the appropriate asset by role for the active rendering context."@en .

  # ── Scene Properties ───────────────────────────────────────────────────────

  hmedia:hasScene a owl:ObjectProperty ;
      rdfs:label   "has scene"@en ;
      rdfs:domain  hev:Event ;
      rdfs:range   hmedia:SceneDescriptor ;
      dcterms:description
          "Links an event to one or more SceneDescriptors. REPEATABLE — one event may have multiple descriptors, each produced by a different CameraAgent. The property is intentionally not declared owl:FunctionalProperty."@en ;
      sh:agentInstruction
          "An event may have multiple hasScene links — one per camera viewpoint. When depicting an event, iterate all SceneDescriptors and select the one whose cameraRef matches the active rendering mode or the client's declared camera preference."@en .

  hmedia:sceneActor a owl:ObjectProperty ;
      rdfs:label   "scene actor"@en ;
      rdfs:domain  hmedia:SceneDescriptor ;
      rdfs:range   holon:AgentHolon ;
      dcterms:description
          "The principal agent in this scene. Repeatable — a scene may have multiple actors. Each actor's hmedia:appearance provides their visual description."@en .

  hmedia:sceneLocation a owl:ObjectProperty ;
      rdfs:label   "scene location"@en ;
      rdfs:domain  hmedia:SceneDescriptor ;
      rdfs:range   holon:Holon ;
      dcterms:description
          "The setting holon for this scene. The location's hmedia:appearance provides environmental context."@en .

  hmedia:sceneEvent a owl:ObjectProperty ;
      rdfs:label   "scene event"@en ;
      rdfs:domain  hmedia:SceneDescriptor ;
      rdfs:range   hev:Event ;
      dcterms:description
          "Back-link from the SceneDescriptor to the originating event. SHOULD be present. Enables bidirectional traversal from descriptor to event."@en .

  hmedia:sceneNarrative a owl:DatatypeProperty ;
      rdfs:label   "scene narrative"@en ;
      rdfs:domain  hmedia:SceneDescriptor ;
      rdfs:range   xsd:string ;
      dcterms:description
          "Prose narrative for this scene descriptor. May be author-supplied (static) or AI Cartographer-generated (dynamic). If absent, the cartographer assembles it from component hmedia:appearance values using the camera's perspective and shot type."@en .

  hmedia:cameraRef a owl:ObjectProperty ;
      rdfs:label   "camera reference"@en ;
      rdfs:comment "Links a SceneDescriptor, NowGraph, or DepictionProjection to the CameraAgent that produced or should produce this rendering. Defined here in the hmedia: namespace. Declared as a cross-namespace bridge in hproj: shapes (Pass E §2) where it appears on NowGraph and DepictionProjection as an advisory property."@en ;
      rdfs:range   hmedia:CameraAgent ;
      dcterms:description
          "On SceneDescriptor: identifies which camera captured this scene view. On NowGraph/DepictionProjection (Pass E §2 bridge): specifies the default rendering camera for the projection. Multiple SceneDescriptors on the same event each carry their own cameraRef."@en .

  # ── CameraAgent Properties ─────────────────────────────────────────────────

  hmedia:sensorType a owl:ObjectProperty ;
      rdfs:label   "sensor type"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The sensory modality of this camera. MUST be a concept from hmedia:SensorTypeScheme. Determines what kind of media the camera produces: image/video (Visual), audio (Audio), 3D model (Geometric), map (Cartographic), or prose (Textual)."@en .

  hmedia:shotType a owl:ObjectProperty ;
      rdfs:label   "shot type"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The compositional framing of this camera. MUST be a concept from hmedia:ShotTypeScheme. Informs the cartographer how much of the scene to include."@en .

  hmedia:perspective a owl:ObjectProperty ;
      rdfs:label   "perspective"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The narrative point of view adopted by this camera. MUST be a concept from hmedia:PerspectiveScheme. Informs the cartographer whose viewpoint to adopt in prose generation."@en .

  hmedia:focalLength a owl:DatatypeProperty ;
      rdfs:label   "focal length"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   xsd:decimal ;
      dcterms:description
          "Equivalent focal length in millimetres (35mm film equivalent). Advisory: 16–24mm wide; 35–50mm normal; 85–200mm telephoto. Used as a rendering hint for visual scene composition."@en .

  hmedia:fieldOfView a owl:DatatypeProperty ;
      rdfs:label   "field of view"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   xsd:decimal ;
      dcterms:description
          "Horizontal field of view in degrees. Advisory: 100–120° wide; 60–75° normal; 10–30° telephoto. Inversely related to focalLength."@en .

  hmedia:depthOfField a owl:ObjectProperty ;
      rdfs:label   "depth of field"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   skos:Concept ;
      dcterms:description
          "The depth of field rendering hint. MUST be a concept from hmedia:DepthOfFieldScheme."@en .

  hmedia:cameraDescription a owl:DatatypeProperty ;
      rdfs:label   "camera description"@en ;
      rdfs:domain  hmedia:CameraAgent ;
      rdfs:range   xsd:string ;
      dcterms:description
          "A natural language description of this camera agent's role and characteristics. Read by the AI Cartographer as a rendering persona. E.g.: 'A documentary-style camera. Observational, unobtrusive. Favours natural lighting. Captures authentic moments without staging.'"@en .

}
```

---

## 4. SHACL 1.2 Shapes

<!-- databook:id: media-shapes -->
<!-- databook:graph: http://w3id.org/holon/media/#shapes -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .

GRAPH <http://w3id.org/holon/media/#shapes> {

  # ── MediaContextShape ────────────────────────────────────────────────────────

  hmedia:MediaContextShape a sh:NodeShape ;
      sh:targetClass hmedia:MediaContext ;
      sh:name   "Media Context"@en ;
      sh:intent "Requires label and mediaBase. mediaBase MUST be a valid absolute IRI ending with a path separator."@en ;
      sh:agentInstruction
          "A MediaContext is the root for resolving asset IRIs. It needs a label and a mediaBase URI. Without mediaBase, relative assetIRIs cannot be resolved."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [
          sh:path     rdfs:label ;
          sh:minCount 1 ;
          sh:or ( [ sh:datatype xsd:string ] [ sh:datatype rdf:langString ] ) ;
          sh:severity sh:Violation ;
          sh:message  "MediaContext MUST have at least one rdfs:label."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:mediaBase ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:datatype xsd:anyURI ;
          sh:nodeKind sh:Literal ;
          sh:severity sh:Violation ;
          sh:message  "MediaContext MUST declare exactly one hmedia:mediaBase IRI."@en ;
      ] .

  # ── MediaAssetShape ──────────────────────────────────────────────────────────

  hmedia:MediaAssetShape a sh:NodeShape ;
      sh:targetClass hmedia:MediaAsset ;
      sh:name   "Media Asset"@en ;
      sh:intent "Requires label and assetIRI. mimeType MUST be declared. mediaRole SHOULD be from MediaRoleScheme."@en ;
      sh:agentInstruction
          "A MediaAsset needs an IRI address (assetIRI), a MIME type, and a label. Without mimeType the client cannot handle it. mediaRole tells the cartographer how to use the asset in depiction."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [
          sh:path     rdfs:label ;
          sh:minCount 1 ;
          sh:severity sh:Violation ;
          sh:message  "MediaAsset MUST have at least one rdfs:label."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:assetIRI ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:datatype xsd:anyURI ;
          sh:severity sh:Violation ;
          sh:message  "MediaAsset MUST declare exactly one hmedia:assetIRI."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:mimeType ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:datatype xsd:string ;
          sh:severity sh:Violation ;
          sh:message  "MediaAsset MUST declare exactly one hmedia:mimeType."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:mediaRole ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "MediaAsset SHOULD declare exactly one hmedia:mediaRole from hmedia:MediaRoleScheme."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:altText ;
          sh:maxCount 1 ;
          sh:datatype xsd:string ;
          sh:severity sh:Info ;
          sh:message  "MediaAsset MAY carry hmedia:altText for accessibility."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:inMediaContext ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    hmedia:MediaContext ;
          sh:severity sh:Info ;
          sh:message  "MediaAsset MAY declare an hmedia:inMediaContext for relative IRI resolution."@en ;
      ] .

  # ── SceneDescriptorShape ─────────────────────────────────────────────────────

  hmedia:SceneDescriptorShape a sh:NodeShape ;
      sh:targetClass hmedia:SceneDescriptor ;
      sh:name   "Scene Descriptor"@en ;
      sh:intent "Requires label. At least one sceneActor or sceneLocation SHOULD be present. cameraRef SHOULD be present for projection-linked scenes."@en ;
      sh:agentInstruction
          "A SceneDescriptor is one camera's view of an event. It should have at least an actor or a location to be meaningful. Without cameraRef the viewpoint is undefined. Check hasMedia for the rendered output."@en ;
      sh:nodeKind sh:IRI ;

      sh:property [
          sh:path     rdfs:label ;
          sh:minCount 1 ;
          sh:severity sh:Violation ;
          sh:message  "SceneDescriptor MUST have at least one rdfs:label."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:sceneActor ;
          sh:nodeKind sh:IRI ;
          sh:class    holon:AgentHolon ;
          sh:severity sh:Info ;
          sh:message  "SceneDescriptor MAY declare one or more sceneActors (AgentHolons)."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:sceneLocation ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    holon:Holon ;
          sh:severity sh:Info ;
          sh:message  "SceneDescriptor MAY declare one sceneLocation (any Holon)."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:sceneEvent ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "SceneDescriptor SHOULD carry a sceneEvent back-link to the originating event."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:sceneNarrative ;
          sh:maxCount 1 ;
          sh:datatype xsd:string ;
          sh:severity sh:Info ;
          sh:message  "SceneDescriptor MAY carry a sceneNarrative prose description."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:cameraRef ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:class    hmedia:CameraAgent ;
          sh:severity sh:Warning ;
          sh:message  "SceneDescriptor SHOULD declare a cameraRef identifying the rendering camera."@en ;
      ] ;

      # Validate: at least one of sceneActor, sceneLocation, or sceneNarrative
      sh:sparql [
          a sh:SPARQLConstraint ;
          sh:severity sh:Warning ;
          sh:message  "SceneDescriptor SHOULD have at least one of: sceneActor, sceneLocation, or sceneNarrative."@en ;
          sh:select   """
              PREFIX hmedia: <http://w3id.org/holon/media/>
              SELECT $this WHERE {
                  FILTER NOT EXISTS { $this hmedia:sceneActor    [] }
                  FILTER NOT EXISTS { $this hmedia:sceneLocation [] }
                  FILTER NOT EXISTS { $this hmedia:sceneNarrative [] }
              }
          """ ;
      ] .

  # ── CameraAgentShape ────────────────────────────────────────────────────────

  hmedia:CameraAgentShape a sh:NodeShape ;
      sh:targetClass hmedia:CameraAgent ;
      sh:name   "Camera Agent"@en ;
      sh:intent "Requires label and sensorType. shotType and perspective SHOULD be present. Inherits SensoryState requirements (label, updateTimestamp) via sh:node."@en ;
      sh:agentInstruction
          "A CameraAgent is a sensor. sensorType MUST be declared — it tells the cartographer what the camera produces. shotType and perspective govern framing and point of view. Focal length and field of view are optional cinematic refinements."@en ;
      sh:node   hmk:SensoryStateShape ;

      sh:property [
          sh:path     hmedia:sensorType ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "CameraAgent MUST declare exactly one hmedia:sensorType from hmedia:SensorTypeScheme."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:shotType ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "CameraAgent SHOULD declare a hmedia:shotType from hmedia:ShotTypeScheme."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:perspective ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "CameraAgent SHOULD declare a hmedia:perspective from hmedia:PerspectiveScheme."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:depthOfField ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Info ;
          sh:message  "CameraAgent MAY declare a hmedia:depthOfField from hmedia:DepthOfFieldScheme."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:focalLength ;
          sh:maxCount 1 ;
          sh:datatype xsd:decimal ;
          sh:minExclusive 0.0 ;
          sh:severity sh:Info ;
          sh:message  "hmedia:focalLength MUST be a positive decimal if present."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:fieldOfView ;
          sh:maxCount 1 ;
          sh:datatype xsd:decimal ;
          sh:minExclusive 0.0 ;
          sh:maxInclusive 360.0 ;
          sh:severity sh:Info ;
          sh:message  "hmedia:fieldOfView MUST be a decimal in (0, 360] if present."@en ;
      ] .

  # ── HolonMediaExtensionShape ─────────────────────────────────────────────────
  # Advisory shape. Validates that appearance is a lang-tagged literal and
  # hasMedia points to a valid MediaAsset, when these properties are asserted
  # on any Holon.

  hmedia:HolonMediaExtensionShape a sh:NodeShape ;
      sh:targetClass holon:Holon ;
      sh:name   "Holon Media Extension (advisory)"@en ;
      sh:intent "Advisory validation for hmedia:appearance and hmedia:hasMedia on holons. Properties are opt-in; their absence is not a violation."@en ;

      sh:property [
          sh:path     hmedia:appearance ;
          sh:datatype rdf:langString ;
          sh:severity sh:Warning ;
          sh:message  "hmedia:appearance on a Holon SHOULD be a lang-tagged literal (rdf:langString)."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:hasMedia ;
          sh:nodeKind sh:IRI ;
          sh:class    hmedia:MediaAsset ;
          sh:severity sh:Warning ;
          sh:message  "hmedia:hasMedia on a Holon SHOULD reference a valid hmedia:MediaAsset."@en ;
      ] .

  # ── EventSceneExtensionShape ─────────────────────────────────────────────────
  # Advisory shape. Validates that hasScene on events points to valid
  # SceneDescriptors.

  hmedia:EventSceneExtensionShape a sh:NodeShape ;
      sh:targetClass hev:Event ;
      sh:name   "Event Scene Extension (advisory)"@en ;
      sh:intent "Advisory validation for hmedia:hasScene on events. Property is opt-in. Validates that targets are SceneDescriptors."@en ;

      sh:property [
          sh:path     hmedia:hasScene ;
          sh:nodeKind sh:IRI ;
          sh:class    hmedia:SceneDescriptor ;
          sh:severity sh:Warning ;
          sh:message  "hmedia:hasScene on an Event SHOULD reference a valid hmedia:SceneDescriptor."@en ;
      ] ;

      sh:property [
          sh:path     hmedia:appearance ;
          sh:datatype rdf:langString ;
          sh:severity sh:Warning ;
          sh:message  "hmedia:appearance on an Event SHOULD be a lang-tagged literal."@en ;
      ] .

}
```

---

## 5. Camera Agent Presets

Named individual `hmedia:CameraAgent` instances that serve as defaults for
the four `hproj:RenderingModeScheme` values. Implementations SHOULD assert
`hmedia:cameraRef` pointing to these presets on NowGraphs produced for clients
with a declared rendering mode, unless a more specific camera is registered.

<!-- databook:id: camera-presets -->
<!-- databook:graph: http://w3id.org/holon/media/#presets -->
<!-- mode=normative norm=true conformance=media rfc2119=SHOULD -->
```trig
@prefix hmedia:  <http://w3id.org/holon/media/> .
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/media/#presets> {

  # ── CinematicDefault ──────────────────────────────────────────────────────
  # Maps to hproj:CinematicMode

  hmedia:CinematicDefault a hmedia:CameraAgent ;
      rdfs:label          "Cinematic Default Camera"@en ;
      dcterms:description "Default camera for Cinematic rendering mode. Observational documentary style — wide establishing framing, omniscient perspective, deep depth of field. Optimised for historical trajectory replay and counterfactual visualisation."@en ;
      hmk:updateTimestamp "2026-06-09T00:00:00Z"^^xsd:dateTime ;
      hmedia:sensorType   hmedia:VisualSensor ;
      hmedia:shotType     hmedia:EstablishingShot ;
      hmedia:perspective  hmedia:Omniscient ;
      hmedia:focalLength  "24"^^xsd:decimal ;
      hmedia:fieldOfView  "84"^^xsd:decimal ;
      hmedia:depthOfField hmedia:DeepDOF ;
      hmedia:cameraDescription
          "A documentary camera. Wide, observational, and authoritative. Records the full scene from above and outside. Shows all actors in spatial context. No editorial perspective — events are reported, not interpreted. Favours clarity over drama."@en ;
      rdfs:seeAlso hproj:CinematicMode .

  # ── ImmersiveDefault ──────────────────────────────────────────────────────
  # Maps to hproj:ImmersiveMode

  hmedia:ImmersiveDefault a hmedia:CameraAgent ;
      rdfs:label          "Immersive Default Camera"@en ;
      dcterms:description "Default camera for Immersive rendering mode. Close, embodied, present. Medium shot from the requesting agent's position, third-person perspective, shallow depth of field. Optimised for conversational and interactive deployments."@en ;
      hmk:updateTimestamp "2026-06-09T00:00:00Z"^^xsd:dateTime ;
      hmedia:sensorType   hmedia:VisualSensor ;
      hmedia:shotType     hmedia:MediumShot ;
      hmedia:perspective  hmedia:ThirdPerson ;
      hmedia:focalLength  "50"^^xsd:decimal ;
      hmedia:fieldOfView  "47"^^xsd:decimal ;
      hmedia:depthOfField hmedia:ShallowDOF ;
      hmedia:cameraDescription
          "An intimate camera. Positioned at human eye level, close enough to read expressions. Focuses on the immediate participant. Background is soft and contextual. Generates warmth and presence. Prose is in third-person but close and immediate."@en ;
      rdfs:seeAlso hproj:ImmersiveMode .

  # ── ActiveInferenceDefault ────────────────────────────────────────────────
  # Maps to hproj:ActiveInferenceMode

  hmedia:ActiveInferenceDefault a hmedia:CameraAgent ;
      rdfs:label          "Active Inference Default Camera"@en ;
      dcterms:description "Default camera for Active Inference rendering mode. Textual sensor — produces natural language descriptions rather than visual media. Omniscient perspective, close reading of event state and belief update records."@en ;
      hmk:updateTimestamp "2026-06-09T00:00:00Z"^^xsd:dateTime ;
      hmedia:sensorType   hmedia:TextualSensor ;
      hmedia:perspective  hmedia:Omniscient ;
      hmedia:cameraDescription
          "A textual narrator. Has access to all projected state including belief updates and free energy records. Generates precise, information-dense prose. Flags prediction errors, highlights high-surprise events, and surfaces divergence between agent models. Clinical and analytical tone — the camera of the analyst, not the storyteller."@en ;
      rdfs:seeAlso hproj:ActiveInferenceMode .

  # ── CartographicDefault ───────────────────────────────────────────────────
  # Maps to hproj:ExplodedViewMode

  hmedia:CartographicDefault a hmedia:CameraAgent ;
      rdfs:label          "Cartographic Default Camera"@en ;
      dcterms:description "Default camera for Exploded View rendering mode. Cartographic sensor — produces map assets (GeoJSON, KML, SVG overhead diagrams). Bird's eye view, omniscient, deep depth of field. Optimised for spatial and analytical layer compositing."@en ;
      hmk:updateTimestamp "2026-06-09T00:00:00Z"^^xsd:dateTime ;
      hmedia:sensorType   hmedia:CartographicSensor ;
      hmedia:shotType     hmedia:BirdsEye ;
      hmedia:perspective  hmedia:Omniscient ;
      hmedia:depthOfField hmedia:DeepDOF ;
      hmedia:cameraDescription
          "A map-maker's lens. Sees the terrain from directly above. Reduces everything to geometric relationships — distance, adjacency, containment, path. Strips drama in favour of legibility. Where the immersive camera asks 'what does it feel like?', this camera asks 'where is it, and what is next to it?'"@en ;
      rdfs:seeAlso hproj:ExplodedViewMode .

}
```

---

## 6. Pipeline Integration

### 6.1 Full Media Scene — Example Data

The following example continues the patient-007 scenario from Pass E §2,
adding media properties to the existing holons and constructing a SceneDescriptor
on the ward round AssertionEvent.

<!-- databook:id: media-example -->
<!-- mode=example norm=false -->
```turtle12
VERSION "1.2"
PREFIX hmedia:  <http://w3id.org/holon/media/>
PREFIX hmk:     <http://w3id.org/holon/markov/>
PREFIX holon:   <http://w3id.org/holon/>
PREFIX hev:     <http://w3id.org/holon/event/>
PREFIX hproj:   <http://w3id.org/holon/projection/>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>

# ── Media Context ────────────────────────────────────────────────────────────

<urn:media:ctx:ward-assets>
    a hmedia:MediaContext ;
    rdfs:label      "Ward 7 Asset Context"@en ;
    hmedia:mediaBase "https://assets.hospital-demo.org/ward7/" .

# ── MediaAssets ───────────────────────────────────────────────────────────────

<urn:media:asset:chen-portrait>
    a hmedia:MediaAsset ;
    rdfs:label          "Dr Chen — portrait"@en ;
    hmedia:assetIRI     "people/chen-portrait.jpg" ;
    hmedia:mimeType     "image/jpeg" ;
    hmedia:mediaRole    hmedia:Primary ;
    hmedia:altText      "Dr Chen in blue scrubs standing at a nursing station"@en ;
    hmedia:keywords     "chen", "doctor", "portrait" ;
    hmedia:inMediaContext <urn:media:ctx:ward-assets> .

<urn:media:asset:ward7-map>
    a hmedia:MediaAsset ;
    rdfs:label          "Ward 7 — floor plan"@en ;
    hmedia:assetIRI     "maps/ward7-floor.svg" ;
    hmedia:mimeType     "image/svg+xml" ;
    hmedia:mediaRole    hmedia:Map ;
    hmedia:altText      "Schematic floor plan of Ward 7 showing patient rooms and nursing station"@en ;
    hmedia:inMediaContext <urn:media:ctx:ward-assets> .

# ── Appearance on Holons ──────────────────────────────────────────────────────

<urn:agent:ward-nurse-chen>
    hmedia:appearance
        "Dr Mei Chen. Mid-forties, precise economy of movement. Blue scrubs, wire-rimmed glasses, hair pulled back. Carries a tablet in her left hand. Her expression is alert and professionally composed — warm when she chooses to show it, efficient when there is work to do."@en ;
    hmedia:hasMedia <urn:media:asset:chen-portrait> .

<urn:holon:patient-007>
    hmedia:appearance
        "Room 7C. The patient lies in a raised hospital bed, mid-sixties, male, pallid but breathing steadily. A cardiac monitor beeps softly at regular intervals. An IV drip stands to his left. Natural light from a half-open blind falls across the bed in pale stripes."@en .

<urn:holon:ward7-nursing-station>
    hmedia:appearance
        "A curved nursing station of pale laminate and brushed steel. Three monitors display patient telemetry in amber and green. A whiteboard on the wall shows ward assignments in erasable marker. The corridor behind it is quiet — early morning rounds."@en ;
    hmedia:hasMedia <urn:media:asset:ward7-map> .

# ── Camera Agent — Sensor-Only Blanket ───────────────────────────────────────

<urn:mk:blanket:immersive-ward-cam>
    a hmk:MarkovBlanket ;
    rdfs:label              "Ward Immersive Camera Blanket"@en ;
    hmedia:sensorOnly       true ;
    hmk:hasSensoryStates    <urn:camera:immersive-ward-cam> .

<urn:camera:immersive-ward-cam>
    a hmedia:CameraAgent ;
    rdfs:label              "Ward Immersive Camera"@en ;
    hmk:updateTimestamp     "2026-06-09T00:00:00Z"^^xsd:dateTime ;
    hmedia:sensorType       hmedia:VisualSensor ;
    hmedia:shotType         hmedia:MediumShot ;
    hmedia:perspective      hmedia:ThirdPerson ;
    hmedia:focalLength      "50"^^xsd:decimal ;
    hmedia:fieldOfView      "47"^^xsd:decimal ;
    hmedia:depthOfField     hmedia:ShallowDOF ;
    hmedia:cameraDescription
        "A clinical camera. Eye-level, unobtrusive. Favours the nurse's hands and the monitor readouts. Captures competence and care in equal measure."@en .

# ── AssertionEvent with SceneDescriptor ───────────────────────────────────────

<urn:event:ward-round-assertion-001>
    a hev:AssertionEvent ;
    rdfs:label              "Ward round assertion — patient 007 stable"@en ;
    hev:assertedAt          "2026-06-09T09:00:05Z"^^xsd:dateTime ;
    hev:targetHolon         <urn:holon:patient-007> ;
    hmedia:appearance
        "Dr Chen leans over the bedside terminal, taps twice, and straightens. 'Blood pressure stable,' she says to no one in particular. The monitor agrees."@en ;
    hmedia:hasScene         <urn:scene:ward-round-001-immersive> .

<urn:scene:ward-round-001-immersive>
    a hmedia:SceneDescriptor ;
    rdfs:label              "Ward round scene — immersive view"@en ;
    hmedia:sceneActor       <urn:agent:ward-nurse-chen> ;
    hmedia:sceneLocation    <urn:holon:patient-007> ;
    hmedia:sceneEvent       <urn:event:ward-round-assertion-001> ;
    hmedia:cameraRef        <urn:camera:immersive-ward-cam> ;
    hmedia:sceneNarrative
        "Dr Chen at patient 007's bedside. She reviews vitals on the terminal. Blood pressure is within normal range. The patient is stable. She makes a note and moves on."@en .
```

### 6.2 Non-Normative SPARQL CONSTRUCT — Scene Input Bundle

The following CONSTRUCT query assembles a minimal scene input bundle for the
AI Cartographer from a SceneDescriptor and its linked appearance properties.
This is the input the Cartographer reads when `hmedia:sceneNarrative` is absent
and must be generated.

<!-- databook:id: scene-construct -->
<!-- mode=non-normative norm=false -->
```sparql
# Non-normative: assemble scene narrative input bundle for AI Cartographer.
# Executes against the NowGraph scene block for a given event.
# Result graph is passed as context to the Cartographer's PromptBlock.

PREFIX hmedia:  <http://w3id.org/holon/media/>
PREFIX holon:   <http://w3id.org/holon/>
PREFIX hev:     <http://w3id.org/holon/event/>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>

CONSTRUCT {
  ?scene
      hmedia:sceneActor         ?actor ;
      hmedia:sceneLocation      ?location ;
      hmedia:cameraRef          ?camera .

  ?actor
      rdfs:label                ?actorLabel ;
      hmedia:appearance         ?actorAppearance .

  ?location
      rdfs:label                ?locationLabel ;
      hmedia:appearance         ?locationAppearance .

  ?event
      hmedia:appearance         ?eventAppearance .

  ?camera
      hmedia:sensorType         ?sensorType ;
      hmedia:shotType           ?shotType ;
      hmedia:perspective        ?perspective ;
      hmedia:cameraDescription  ?cameraDesc .
}
WHERE {
  ?event  hmedia:hasScene    ?scene .
  ?scene  hmedia:sceneActor  ?actor .

  OPTIONAL { ?scene     hmedia:sceneLocation     ?location }
  OPTIONAL { ?scene     hmedia:cameraRef         ?camera }
  OPTIONAL { ?actor     rdfs:label               ?actorLabel ;
                        hmedia:appearance         ?actorAppearance .
             FILTER(LANG(?actorAppearance) = "en") }
  OPTIONAL { ?location  rdfs:label               ?locationLabel ;
                        hmedia:appearance         ?locationAppearance .
             FILTER(LANG(?locationAppearance) = "en") }
  OPTIONAL { ?event     hmedia:appearance         ?eventAppearance .
             FILTER(LANG(?eventAppearance) = "en") }
  OPTIONAL { ?camera    hmedia:sensorType         ?sensorType ;
                        hmedia:shotType           ?shotType ;
                        hmedia:perspective        ?perspective ;
                        hmedia:cameraDescription  ?cameraDesc }
}
```

> **Implementation note:** The Cartographer receives this bundle as the
> `hproj:sceneGraphBlock` of a NowGraph scoped to the event. It combines the
> actor's `hmedia:appearance`, the location's `hmedia:appearance`, and the
> event's `hmedia:appearance` with the camera's perspective and shot type to
> produce `hmedia:sceneNarrative` prose. The Cartographer SHOULD write the
> result back to the SceneDescriptor via a `hev:AssertionEvent` in the HGA
> pipeline if the narrative should be persisted.

---

## 7. SPARQL Fallbacks

The following UPDATE statements serve as fallbacks when SHACL 1.2 Rules are
unavailable. They populate the violation tracking graph `urn:hmedia:violations`.

<!-- databook:id: media-sparql-fallbacks -->
<!-- mode=normative norm=true conformance=media rfc2119=MUST -->
```sparql
PREFIX hmedia:  <http://w3id.org/holon/media/>
PREFIX rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

# ── MF1: Flag MediaContext missing mediaBase ───────────────────────────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?c hmedia:violates "MediaContext-MissingMediaBase" . }}
WHERE { ?c a hmedia:MediaContext .
        FILTER NOT EXISTS { ?c hmedia:mediaBase [] } } ;

# ── MF2: Flag MediaAsset missing assetIRI ─────────────────────────────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?a hmedia:violates "MediaAsset-MissingAssetIRI" . }}
WHERE { ?a a hmedia:MediaAsset .
        FILTER NOT EXISTS { ?a hmedia:assetIRI [] } } ;

# ── MF3: Flag MediaAsset missing mimeType ─────────────────────────────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?a hmedia:violates "MediaAsset-MissingMimeType" . }}
WHERE { ?a a hmedia:MediaAsset .
        FILTER NOT EXISTS { ?a hmedia:mimeType [] } } ;

# ── MF4: Flag CameraAgent missing sensorType ──────────────────────────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?cam hmedia:violates "CameraAgent-MissingSensorType" . }}
WHERE { ?cam a hmedia:CameraAgent .
        FILTER NOT EXISTS { ?cam hmedia:sensorType [] } } ;

# ── MF5: Flag SceneDescriptor missing label ───────────────────────────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?s hmedia:violates "SceneDescriptor-MissingLabel" . }}
WHERE { ?s a hmedia:SceneDescriptor .
        FILTER NOT EXISTS { ?s rdfs:label [] } } ;

# ── MF6: Flag appearance literals that are not lang-tagged ────────────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?e hmedia:violates "Appearance-NotLangTagged" . }}
WHERE { ?e hmedia:appearance ?v .
        FILTER(DATATYPE(?v) != rdf:langString) } ;

# ── MF7: Flag sensorOnly blankets that still have an ActiveState ──────────
# (sensor-only blankets MUST NOT have ActiveState — it's a modelling error)
INSERT { GRAPH <urn:hmedia:violations> {
    ?b hmedia:violates "SensorOnly-HasActiveState" . }}
WHERE { ?b a <http://w3id.org/holon/markov/MarkovBlanket> ;
           hmedia:sensorOnly true ;
           <http://w3id.org/holon/markov/hasActiveStates> [] } ;

# ── MF8: Flag SceneDescriptors with no actor/location/narrative ───────────
INSERT { GRAPH <urn:hmedia:violations> {
    ?s hmedia:violates "SceneDescriptor-EmptyScene" . }}
WHERE { ?s a hmedia:SceneDescriptor .
        FILTER NOT EXISTS { ?s hmedia:sceneActor    [] }
        FILTER NOT EXISTS { ?s hmedia:sceneLocation [] }
        FILTER NOT EXISTS { ?s hmedia:sceneNarrative [] } }
```

---

## 8. Manifest and Namespace Registry Updates

The following retroactive updates MUST be applied to the Pass 0 artefacts.
All changes are captured in the amended versions of those DataBooks (v0.1.1).

### Namespace Registry

`hspec:ns-hmedia` has been added to `hga-pass0-namespace-registry.databook.md`:

| Prefix | Namespace IRI | Conformance | Content |
|---|---|---|---|
| `hmedia:` | `http://w3id.org/holon/media/` | Media | Assets, appearance, scenes, cameras |

### Spec Manifest

`hspec:HGAMedia` has been added to `hga-pass0-manifest.databook.md`:

```turtle
hspec:HGAMedia a hspec:ConformanceClass ;
    sh:order    6 ;
    hspec:extends hspec:HGAMarkov .
```

`hspec:pass-f-media` has been added to the section registry at `sh:order 13`.

### Ontology Header

`<http://w3id.org/holon/media/>` `owl:Ontology` declaration has been added to
`hga-pass-a-ontology-header.databook.md` with `owl:imports holon:, hev:, hmk:, hproj:`.

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
