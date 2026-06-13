---
id: http://w3id.org/holon/spec/viewer
title: "HGA Viewer Pass — Vocabulary and Shapes"
type: spec-section
version: 0.1.0
created: 2026-06-13
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
domain: http://w3id.org/holon/viewer/
subject:
  - viewer context
  - viewer profile
  - stance declaration
  - prior context
  - resolution profile
  - RDF 1.2 reification
  - SHACL 1.2
description: >
  Normative vocabulary and SHACL 1.2 shapes for the HGA Viewer Pass layer.
  Defines the viewer context envelope — the formal structure that carries
  viewer identity, prior context, stance declarations, and resolution profiles
  into the Stage 8 NowGraph construction. Viewer properties are modelled as
  time-stamped, provenanced, weighted assertion events (extending hev:)
  rather than static profile fields, preserving full provenance and temporal
  evolution of viewer state. Introduces the HGAViewer conformance class
  extending HGAProjection.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass G"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - viewer
  rfc2119: true
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/viewer/
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: true
shapes:
  - http://w3id.org/holon/viewer/#shapes
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-13T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

## 1. Architecture and Design Principles

### 1.1 The Viewer Pass Seam

The HGA pipeline requires that Stage 8 (NowGraph construction) know *who
is asking* before it can produce an appropriate projection. The Viewer Pass
is the formal mechanism by which that viewer context is established and
carried into the pipeline.

The Viewer Pass sits logically **upstream** of Stage 8. It is populated
prior to or during the initial scene graph query, and is passed as an
input parameter to the `hproj:SceneProjectionActivity`. Without a Viewer
Pass, implementations MUST fall back to a generic anonymous viewer profile.

**Key design principle:** Viewer properties are NOT static profile fields.
They are **assertion events** — time-stamped, provenanced, and weighted
claims about a viewer entity that evolve over time. This preserves the
full provenance chain and supports temporal reasoning about viewer state.
The same viewer querying the same holon six months later may receive a
different projection, correctly, because their assertion stream has evolved.

### 1.2 The Four Sub-Structures

A `hview:ViewerPass` carries exactly four sub-structures:

**ViewerProfile** — who the viewer is. An agent IRI plus a stream of
assertion events about viewer properties (role, expertise, preferences,
affiliations, demographic attributes). Each property is an annotated
triple carrying provenance, timestamp, and assertionWeight.

**PriorContext** — what the viewer already knows. A set of SHACL shape
IRIs that the viewer's existing knowledge is asserted to satisfy, plus
optional named graph references to prior session DataBooks. Allows the
NowGraph to suppress shared ground and foreground the delta.

**StanceDeclaration** — which authorities the viewer recognises. An
ordered list of named graphs (by trust precedence) that the viewer accepts
as authoritative for this session. Determines how contested assertions are
resolved in the projection.

**ResolutionProfile** — at what granularity and along which dimensions
the viewer needs the projection. Binding of rendering mode, projection
depth, and foregrounded property dimensions.

### 1.3 Relationship to Existing Passes

The Viewer Pass is a bridge module. It:

- Extends `hev:AssertionEvent` reification for viewer property assertions
- Feeds `hproj:NowGraph` via `hview:viewerRef` (new bridge property)
- References `hproj:RenderingModeScheme` for resolution mode selection
- References `hproj:projectionDepth` for containment depth
- References Pass D policy vocabulary for stance precedence ordering
- Is compatible with `hmk:AgentHolon` identity modelling (Pass E §1)

### 1.4 Conformance Class

<!-- databook:id: viewer-conformance-class -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .

hspec:HGAViewer a hspec:ConformanceClass ;
    rdfs:label "HGA Viewer"@en ;
    sh:order 7 ;
    hspec:extends hspec:HGAProjection ;
    dcterms:description """Extends HGA Projection. Implementations MUST additionally support:
  (a) hview:ViewerPass envelope shape;
  (b) hview:ViewerProfile with assertion event stream;
  (c) hview:PriorContext with SHACL shape satisfaction declarations;
  (d) hview:StanceDeclaration with named graph trust ordering;
  (e) hview:ResolutionProfile binding to hproj: rendering vocabulary;
  (f) hview:ViewerAssertionReifierShape for annotated viewer properties;
  (g) hview:viewerRef bridge property on hproj:NowGraph;
  (h) Anonymous viewer fallback when no ViewerPass is supplied."""@en .
```

---

## 2. Namespace Declarations

<!-- databook:id: viewer-prefixes -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
@prefix hview:   <http://w3id.org/holon/viewer/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hmk:     <http://w3id.org/holon/markov/> .
@prefix hpol:    <http://w3id.org/holon/policy/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
```

---

## 3. OWL Vocabulary

### 3.1 Classes

<!-- databook:id: viewer-classes -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
hview:ViewerPass a owl:Class ;
    rdfs:label "Viewer Pass"@en ;
    rdfs:comment """The top-level container for viewer context supplied to
    Stage 8 NowGraph construction. Carries exactly one ViewerProfile,
    one PriorContext, one StanceDeclaration, and one ResolutionProfile."""@en .

hview:ViewerProfile a owl:Class ;
    rdfs:label "Viewer Profile"@en ;
    rdfs:comment """Viewer identity and property assertion stream. Identifies
    the viewer as an agent IRI and carries a set of annotated property
    assertions (hview:ViewerAssertion) representing evolving viewer state."""@en .

hview:ViewerAssertion a owl:Class ;
    rdfs:subClassOf hev:AssertionEvent ;
    rdfs:label "Viewer Assertion"@en ;
    rdfs:comment """A single annotated claim about a viewer property. Extends
    hev:AssertionEvent with viewer-specific reification properties. The
    assertion triple itself uses Turtle 1.2 reification; the reifier IRI
    is typed as hview:ViewerAssertion."""@en .

hview:PriorContext a owl:Class ;
    rdfs:label "Prior Context"@en ;
    rdfs:comment """Declares which SHACL shapes the viewer's existing knowledge
    is asserted to satisfy, and optionally references prior session DataBooks.
    Used by Stage 8 to compute the delta between viewer prior knowledge and
    holon content, suppressing shared ground from the NowGraph."""@en .

hview:StanceDeclaration a owl:Class ;
    rdfs:label "Stance Declaration"@en ;
    rdfs:comment """An ordered list of named graphs (by trust precedence) that
    the viewer accepts as authoritative for this session. Resolves contested
    assertions during NowGraph construction. Precedence is expressed via
    hview:trustOrder (sh:order-style integer: lower = higher trust)."""@en .

hview:TrustEntry a owl:Class ;
    rdfs:label "Trust Entry"@en ;
    rdfs:comment """A single entry in a StanceDeclaration. Binds a named graph
    IRI to a trust level and optional authority chain reference."""@en .

hview:ResolutionProfile a owl:Class ;
    rdfs:label "Resolution Profile"@en ;
    rdfs:comment """Binds rendering mode, projection depth, and foregrounded
    property dimensions for this viewer session. Resolution is a vector,
    not a scalar: it specifies which dimensions of the holon are
    foregrounded, not merely how much detail to return."""@en .

hview:DimensionWeight a owl:Class ;
    rdfs:label "Dimension Weight"@en ;
    rdfs:comment """A weighted binding of a property or property path to
    a salience value [0.0–1.0] within a ResolutionProfile. Dimensions with
    weight 0.0 are suppressed; weight 1.0 are maximally foregrounded."""@en .
```

### 3.2 Properties

<!-- databook:id: viewer-properties -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
# --- ViewerPass structure ---

hview:hasProfile a owl:ObjectProperty ;
    rdfs:domain hview:ViewerPass ;
    rdfs:range  hview:ViewerProfile ;
    rdfs:label  "has profile"@en .

hview:hasPriorContext a owl:ObjectProperty ;
    rdfs:domain hview:ViewerPass ;
    rdfs:range  hview:PriorContext ;
    rdfs:label  "has prior context"@en .

hview:hasStance a owl:ObjectProperty ;
    rdfs:domain hview:ViewerPass ;
    rdfs:range  hview:StanceDeclaration ;
    rdfs:label  "has stance"@en .

hview:hasResolution a owl:ObjectProperty ;
    rdfs:domain hview:ViewerPass ;
    rdfs:range  hview:ResolutionProfile ;
    rdfs:label  "has resolution"@en .

# --- ViewerProfile ---

hview:viewerAgent a owl:ObjectProperty ;
    rdfs:domain hview:ViewerProfile ;
    rdfs:label  "viewer agent"@en ;
    rdfs:comment "Links ViewerProfile to the agent IRI (person, persona, system)." .

hview:hasAssertion a owl:ObjectProperty ;
    rdfs:domain hview:ViewerProfile ;
    rdfs:range  hview:ViewerAssertion ;
    rdfs:label  "has assertion"@en .

# --- ViewerAssertion reification properties ---

hview:assertedProperty a owl:ObjectProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:label  "asserted property"@en ;
    rdfs:comment "The property being asserted about the viewer." .

hview:assertedValue a owl:DatatypeProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:label  "asserted value"@en .

hview:assertedValueIRI a owl:ObjectProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:label  "asserted value (IRI)"@en .

hview:assertedAt a owl:DatatypeProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:range  xsd:date ;
    rdfs:label  "asserted at"@en .

hview:assertedBy a owl:ObjectProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:label  "asserted by"@en ;
    rdfs:comment "The authority (person, publication, system) making this assertion." .

hview:assertionWeight a owl:DatatypeProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:range  xsd:decimal ;
    rdfs:label  "assertion weight"@en ;
    rdfs:comment """Credence value in range [0.0, 1.0]. 1.0 = certain;
    0.5 = equipoise; 0.0 = asserted false. Values below 0.3 SHOULD be
    treated as contested by implementations."""@en .

hview:assertionPolarity a owl:DatatypeProperty ;
    rdfs:domain hview:ViewerAssertion ;
    rdfs:range  xsd:boolean ;
    rdfs:label  "assertion polarity"@en ;
    rdfs:comment "true = positive assertion; false = negation." .

# --- PriorContext ---

hview:satisfiesShape a owl:ObjectProperty ;
    rdfs:domain hview:PriorContext ;
    rdfs:label  "satisfies shape"@en ;
    rdfs:comment "IRI of a SHACL NodeShape the viewer's prior knowledge satisfies." .

hview:priorSession a owl:ObjectProperty ;
    rdfs:domain hview:PriorContext ;
    rdfs:label  "prior session"@en ;
    rdfs:comment "Reference to a previous session DataBook IRI." .

hview:priorSessionDate a owl:DatatypeProperty ;
    rdfs:domain hview:PriorContext ;
    rdfs:range  xsd:date ;
    rdfs:label  "prior session date"@en .

# --- StanceDeclaration / TrustEntry ---

hview:hasTrustEntry a owl:ObjectProperty ;
    rdfs:domain hview:StanceDeclaration ;
    rdfs:range  hview:TrustEntry ;
    rdfs:label  "has trust entry"@en .

hview:trustedGraph a owl:ObjectProperty ;
    rdfs:domain hview:TrustEntry ;
    rdfs:label  "trusted graph"@en ;
    rdfs:comment "Named graph IRI accepted as authoritative." .

hview:trustOrder a owl:DatatypeProperty ;
    rdfs:domain hview:TrustEntry ;
    rdfs:range  xsd:integer ;
    rdfs:label  "trust order"@en ;
    rdfs:comment "Precedence integer. Lower value = higher trust. MUST be unique within a StanceDeclaration." .

hview:trustScope a owl:ObjectProperty ;
    rdfs:domain hview:TrustEntry ;
    rdfs:label  "trust scope"@en ;
    rdfs:comment "Optional: restricts trust to a specific property or class IRI." .

# --- ResolutionProfile ---

hview:renderingMode a owl:ObjectProperty ;
    rdfs:domain hview:ResolutionProfile ;
    rdfs:label  "rendering mode"@en ;
    rdfs:comment "Binds to hproj:RenderingModeScheme concept IRI." .

hview:projectionDepth a owl:DatatypeProperty ;
    rdfs:domain hview:ResolutionProfile ;
    rdfs:range  xsd:integer ;
    rdfs:label  "projection depth"@en ;
    rdfs:comment "-1 = full subgraph; 0 = root only; n = n containment levels." .

hview:hasDimensionWeight a owl:ObjectProperty ;
    rdfs:domain hview:ResolutionProfile ;
    rdfs:range  hview:DimensionWeight ;
    rdfs:label  "has dimension weight"@en .

hview:weightedProperty a owl:ObjectProperty ;
    rdfs:domain hview:DimensionWeight ;
    rdfs:label  "weighted property"@en .

hview:salience a owl:DatatypeProperty ;
    rdfs:domain hview:DimensionWeight ;
    rdfs:range  xsd:decimal ;
    rdfs:label  "salience"@en ;
    rdfs:comment "Foreground weight in range [0.0, 1.0]." .

# --- NowGraph bridge ---

hview:viewerRef a owl:ObjectProperty ;
    rdfs:domain hproj:NowGraph ;
    rdfs:range  hview:ViewerPass ;
    rdfs:label  "viewer ref"@en ;
    rdfs:comment """Bridge property. Links a hproj:NowGraph to the
    hview:ViewerPass that parameterised its construction. SHOULD be
    set on every NowGraph when ViewerPass conformance is active."""@en .
```

---

## 4. SHACL Shapes

### 4.1 ViewerPass Shape

<!-- databook:id: viewer-pass-shape -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
hview:ViewerPassShape a sh:NodeShape ;
    sh:targetClass hview:ViewerPass ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:hasProfile ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:class hview:ViewerProfile ;
        sh:message "A ViewerPass MUST have exactly one ViewerProfile."@en
    ] ;
    sh:property [
        sh:path hview:hasPriorContext ;
        sh:maxCount 1 ;
        sh:class hview:PriorContext ;
        sh:message "A ViewerPass MAY have at most one PriorContext."@en
    ] ;
    sh:property [
        sh:path hview:hasStance ;
        sh:maxCount 1 ;
        sh:class hview:StanceDeclaration ;
        sh:message "A ViewerPass MAY have at most one StanceDeclaration."@en
    ] ;
    sh:property [
        sh:path hview:hasResolution ;
        sh:maxCount 1 ;
        sh:class hview:ResolutionProfile ;
        sh:message "A ViewerPass MAY have at most one ResolutionProfile."@en
    ] .
```

### 4.2 ViewerProfile Shape

<!-- databook:id: viewer-profile-shape -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
hview:ViewerProfileShape a sh:NodeShape ;
    sh:targetClass hview:ViewerProfile ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:viewerAgent ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:nodeKind sh:IRI ;
        sh:message "A ViewerProfile MUST identify exactly one viewer agent IRI."@en
    ] ;
    sh:property [
        sh:path hview:hasAssertion ;
        sh:class hview:ViewerAssertion ;
        sh:message "All hasAssertion values MUST be typed hview:ViewerAssertion."@en
    ] .
```

### 4.3 ViewerAssertion Reifier Shape

This shape governs the **reifier IRI** (the `~ Event:id {| ... |}` block),
not the subject triple itself. It extends the temporal reifier pattern
from Pass C §4.

<!-- databook:id: viewer-assertion-reifier-shape -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
hview:ViewerAssertionReifierShape a sh:NodeShape ;
    sh:targetClass hview:ViewerAssertion ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:assertedAt ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:datatype xsd:date ;
        sh:message "A ViewerAssertion MUST carry exactly one assertedAt date."@en
    ] ;
    sh:property [
        sh:path hview:assertedBy ;
        sh:minCount 1 ;
        sh:nodeKind sh:IRI ;
        sh:message "A ViewerAssertion MUST identify at least one asserting authority."@en
    ] ;
    sh:property [
        sh:path hview:assertionWeight ;
        sh:maxCount 1 ;
        sh:datatype xsd:decimal ;
        sh:minInclusive 0.0 ;
        sh:maxInclusive 1.0 ;
        sh:message "assertionWeight, if present, MUST be a decimal in [0.0, 1.0]."@en
    ] ;
    sh:property [
        sh:path hview:assertionPolarity ;
        sh:maxCount 1 ;
        sh:datatype xsd:boolean
    ] .
```

### 4.4 StanceDeclaration Shape

<!-- databook:id: stance-declaration-shape -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
hview:StanceDeclarationShape a sh:NodeShape ;
    sh:targetClass hview:StanceDeclaration ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:hasTrustEntry ;
        sh:minCount 1 ;
        sh:class hview:TrustEntry ;
        sh:message "A StanceDeclaration MUST contain at least one TrustEntry."@en
    ] .

hview:TrustEntryShape a sh:NodeShape ;
    sh:targetClass hview:TrustEntry ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:trustedGraph ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:nodeKind sh:IRI ;
        sh:message "A TrustEntry MUST identify exactly one named graph IRI."@en
    ] ;
    sh:property [
        sh:path hview:trustOrder ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:datatype xsd:integer ;
        sh:message "A TrustEntry MUST carry exactly one trustOrder integer."@en
    ] ;
    sh:property [
        sh:path hview:trustScope ;
        sh:nodeKind sh:IRI
    ] .
```

### 4.5 ResolutionProfile Shape

<!-- databook:id: resolution-profile-shape -->
<!-- mode=normative norm=true conformance=viewer rfc2119=MUST -->
```turtle
hview:ResolutionProfileShape a sh:NodeShape ;
    sh:targetClass hview:ResolutionProfile ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:renderingMode ;
        sh:maxCount 1 ;
        sh:nodeKind sh:IRI ;
        sh:message "renderingMode, if present, MUST be a hproj:RenderingModeScheme concept IRI."@en
    ] ;
    sh:property [
        sh:path hview:projectionDepth ;
        sh:maxCount 1 ;
        sh:datatype xsd:integer ;
        sh:minInclusive -1
    ] ;
    sh:property [
        sh:path hview:hasDimensionWeight ;
        sh:class hview:DimensionWeight
    ] .

hview:DimensionWeightShape a sh:NodeShape ;
    sh:targetClass hview:DimensionWeight ;
    sh:closed true ;
    sh:ignoredProperties ( rdf:type rdfs:label rdfs:comment ) ;
    sh:property [
        sh:path hview:weightedProperty ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:nodeKind sh:IRI
    ] ;
    sh:property [
        sh:path hview:salience ;
        sh:minCount 1 ; sh:maxCount 1 ;
        sh:datatype xsd:decimal ;
        sh:minInclusive 0.0 ;
        sh:maxInclusive 1.0
    ] .
```

---

## 5. Worked Example

The following example encodes a Viewer Pass for a named individual
(`Person:JaneDoe`) approaching a political analysis holon. Her political
alignment is an opinion event asserted by a third party with moderate
confidence; her professional role is self-asserted with certainty.

<!-- databook:id: viewer-pass-example -->
<!-- mode=example norm=false -->
```turtle12
@prefix hview:   <http://w3id.org/holon/viewer/> .
@prefix hproj:   <http://w3id.org/holon/projection/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix Person:  <https://example.org/person/> .
@prefix Pub:     <https://example.org/publication/> .
@prefix Org:     <https://example.org/org/> .
@prefix Role:    <https://example.org/role/> .
@prefix Concept: <https://example.org/concept/> .
@prefix Schema:  <https://schema.org/> .
@prefix hshape:  <http://w3id.org/holon/shape/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

## Viewer Pass container

<https://example.org/viewer/pass/jane-2026-06-13> a hview:ViewerPass ;
    rdfs:label "Jane Doe — Viewer Pass, 2026-06-13"@en ;
    hview:hasProfile    <https://example.org/viewer/profile/jane> ;
    hview:hasPriorContext <https://example.org/viewer/prior/jane> ;
    hview:hasStance     <https://example.org/viewer/stance/jane> ;
    hview:hasResolution <https://example.org/viewer/resolution/jane-analyst> .

## Viewer Profile — identity + assertion stream

<https://example.org/viewer/profile/jane> a hview:ViewerProfile ;
    rdfs:label "Jane Doe viewer profile"@en ;
    hview:viewerAgent Person:JaneDoe ;

    # Political alignment — third-party opinion assertion, moderate confidence
    hview:hasAssertion <https://example.org/viewer/assert/pa1> .

Person:JaneDoe Schema:hasProperty Schema:politicalAlignment
    ~ <https://example.org/viewer/assert/pa1> {|
        a hview:ViewerAssertion ;
        hview:assertedValue    Concept:PoliticalAlignment_LoyalLiberals ;
        hview:assertedAt       "2026-03-15"^^xsd:date ;
        hview:assertedBy       Pub:NewYorkTimes ;
        hview:assertionWeight  0.65 ;
        hview:assertionPolarity true
    |} .

    # Professional role — self-asserted, certain
    # (hasAssertion triple omitted for brevity; same pattern)

Person:JaneDoe Schema:jobTitle "Senior Policy Analyst"
    ~ <https://example.org/viewer/assert/role1> {|
        a hview:ViewerAssertion ;
        hview:assertedAt       "2025-09-01"^^xsd:date ;
        hview:assertedBy       Person:JaneDoe ;
        hview:assertionWeight  1.0 ;
        hview:assertionPolarity true
    |} .

Person:JaneDoe Schema:memberOf Org:BrookingsInstitution
    ~ <https://example.org/viewer/assert/org1> {|
        a hview:ViewerAssertion ;
        hview:assertedAt       "2025-09-01"^^xsd:date ;
        hview:assertedBy       Org:BrookingsInstitution ;
        hview:assertionWeight  0.95 ;
        hview:assertionPolarity true
    |} .

## Prior Context — what Jane already knows

<https://example.org/viewer/prior/jane> a hview:PriorContext ;
    hview:satisfiesShape hshape:PolicyAnalystDomainShape ;
    hview:satisfiesShape hshape:USPoliticalOntologyShape ;
    hview:priorSession   <https://example.org/session/jane-2026-06-01> ;
    hview:priorSessionDate "2026-06-01"^^xsd:date .

## Stance Declaration — which graphs Jane trusts, in what order

<https://example.org/viewer/stance/jane> a hview:StanceDeclaration ;
    rdfs:label "Jane's authority stance — Brookings-first"@en ;
    hview:hasTrustEntry [
        a hview:TrustEntry ;
        hview:trustedGraph <https://data.brookings.edu/graph/primary> ;
        hview:trustOrder   1
    ] ;
    hview:hasTrustEntry [
        a hview:TrustEntry ;
        hview:trustedGraph <https://example.org/graph/pew-research> ;
        hview:trustOrder   2
    ] ;
    hview:hasTrustEntry [
        a hview:TrustEntry ;
        hview:trustedGraph <https://example.org/graph/nyt-political> ;
        hview:trustOrder   3 ;
        hview:trustScope   Schema:politicalAlignment
    ] .

## Resolution Profile — analyst view, financial + policy dimensions

<https://example.org/viewer/resolution/jane-analyst> a hview:ResolutionProfile ;
    hview:renderingMode    hproj:ImmersiveMode ;
    hview:projectionDepth  2 ;
    hview:hasDimensionWeight [
        a hview:DimensionWeight ;
        hview:weightedProperty Schema:politicalAlignment ;
        hview:salience 0.9
    ] ;
    hview:hasDimensionWeight [
        a hview:DimensionWeight ;
        hview:weightedProperty Schema:memberOf ;
        hview:salience 0.8
    ] ;
    hview:hasDimensionWeight [
        a hview:DimensionWeight ;
        hview:weightedProperty Schema:jobTitle ;
        hview:salience 0.7
    ] .

## NowGraph linkage (bridge)

<https://example.org/nowgraph/jane-2026-06-13> a hproj:NowGraph ;
    hview:viewerRef <https://example.org/viewer/pass/jane-2026-06-13> .
```

---

## 6. Processing Notes

### 6.1 Anonymous Viewer Fallback

When no `hview:ViewerPass` is supplied to a `hproj:SceneProjectionActivity`,
implementations MUST construct a minimal anonymous pass:

```turtle
<urn:hview:anonymous> a hview:ViewerPass ;
    hview:hasProfile [
        a hview:ViewerProfile ;
        hview:viewerAgent <urn:hview:anonymous-agent>
    ] .
```

All four sub-structures are optional except `hview:hasProfile`. The anonymous
profile carries no assertions, no stance, and no resolution constraints.
The NowGraph is projected at default rendering mode and depth 1.

> **Standing Issue SI-G-01:** Whether a missing ViewerPass should generate
> a `sh:Warning`-level `hev:ViolationEvent` rather than silently triggering
> the anonymous fallback is deferred for future resolution. The silent
> fallback is the current default. Implementations MAY emit a warning log
> entry when the fallback is invoked; they MUST NOT reject the request.

### 6.2 Assertion Weight Semantics

`hview:assertionWeight` is an independent property. It is NOT declared
`owl:sameAs` or `rdfs:subPropertyOf` `holon:concernLevel` (Pass D §1).
Both use the same [0.0, 1.0] credence scale by convention, but they
govern different domains: `holon:concernLevel` annotates domain assertions
within holon payload graphs; `hview:assertionWeight` annotates viewer
property assertions within viewer profiles. Conflating them would allow
viewer-context triples to be interpreted as domain-level Bayesian
evidence, which is architecturally incorrect.

Implementations processing both properties SHOULD treat the scales as
analogous for human-readable display purposes but MUST NOT merge the
two property chains in inference or SPARQL queries without explicit
mapping declared in a separate alignment DataBook.

A viewer property with `hview:assertionWeight` < 0.3 is contested and
SHOULD be surfaced as such in the projection rather than silently resolved.

### 6.3 Stance Conflict Resolution

When two `hview:TrustEntry` instances cover the same assertion and the
`hview:trustScope` does not disambiguate, the lower `hview:trustOrder`
integer wins. Ties are a validation error (caught by `hview:TrustEntryShape`
uniqueness constraint — implementations MAY add a SPARQL-based uniqueness
check as an extension).

### 6.4 Prior Context Delta Computation

At Stage 8, the scene projection engine SHOULD:

1. Collect all `hview:satisfiesShape` IRIs from `hview:PriorContext`
2. SPARQL-query the target holon for triples whose SHACL shape membership
   is a superset of the viewer's declared satisfied shapes
3. Suppress those triples from the NowGraph (shared ground)
4. Include only the delta — triples in shapes the viewer does NOT satisfy

This minimises NowGraph size and focuses the Cartographer on what is
actually new to this viewer.

#### 6.4.1 Fallback: Vocabulary Query Approach

The primary delta computation (§6.4) assumes the holon has been annotated
with SHACL shape membership — i.e., that individual resources carry
`sh:shapesGraph` or equivalent shape declarations linking them to the
`hview:satisfiesShape` IRIs. When this annotation is absent or incomplete,
implementations MUST fall back to the vocabulary query approach:

**Step 1 — Property path extraction.** For each `hview:satisfiesShape` IRI
`S` in the viewer's `hview:PriorContext`, retrieve the `sh:path` values
from all `sh:property` constraints on `S`. These are the property IRIs the
shape governs.

```sparql
SELECT ?path WHERE {
  ?shape sh:property/sh:path ?path .
  VALUES ?shape { <S1> <S2> ... }
}
```

**Step 2 — Vocabulary saturation.** For each extracted property path,
collect all `rdfs:domain` / `rdfs:range` class IRIs and walk the
`rdfs:subClassOf` / `owl:equivalentClass` hierarchy to produce the full
set of class IRIs the viewer is asserted to be familiar with. This
constitutes the viewer's **known vocabulary set** `V`.

**Step 3 — Delta identification.** Query the target holon for triples
whose predicate or subject/object type falls outside `V`:

```sparql
CONSTRUCT { ?s ?p ?o }
WHERE {
  ?s ?p ?o .
  FILTER NOT EXISTS {
    VALUES ?knownPred { <p1> <p2> ... }
    FILTER (?p = ?knownPred)
  }
}
```

**Step 4 — NowGraph population.** Include the delta triples in the
NowGraph. Suppress known-vocabulary triples unless their specific
*values* are new (i.e., the predicate is known but the object IRI has
not appeared in any prior session DataBook referenced via
`hview:priorSession`).

> **Note:** The vocabulary fallback is inherently coarser than the
> shape-membership approach. It suppresses by predicate familiarity
> rather than by structural pattern satisfaction. Implementations SHOULD
> log when the fallback is invoked and SHOULD treat its output as
> `sh:Warning`-level rather than normative delta. Holon authors are
> encouraged to annotate resources with shape membership to enable the
> primary approach.

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C
Document License. Ontology content: CC0-1.0.*
