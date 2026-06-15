---
id: http://w3id.org/holon/spec/provenance
title: "HGA Provenance Shapes — PROV-O Extensions and DataBook Alignment"
type: spec-section
version: 0.1.1
created: 2026-06-04
updated: 2026-06-14
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
domain: http://w3id.org/holon/provenance/
subject:
  - provenance
  - PROV-O
  - DataBook
  - SHACL 1.2
  - event envelope
description: >
  Normative PROV-O shape extensions for HGA envelope-level provenance.
  Amendment 0.1.1: adds hprov:DerivationActivity class, hprov:derivedFromHolon
  and hprov:derivationRule properties, and hprov:DerivationActivityShape for
  derived DataHolon provenance tracking.
  Defines hprov: vocabulary for HGA-specific provenance properties
  (ingest vector, pipeline stage, transformer IRI), SHACL shapes validating
  PROV-O assertions on event envelopes and DataBook process stamps, and the
  formal alignment table mapping DataBook frontmatter fields to PROV-O terms.
  Payload-level provenance uses prov: directly and is not constrained here.
spec:
  document-iri: http://w3id.org/holon/spec/
  section-number: "Pass C — §2"
  status: "Editor's Draft"
  normative: true
  conformance-class:
    - core
  rfc2119: true
  part-of: http://w3id.org/holon/spec/
graph:
  namespace: http://w3id.org/holon/provenance/
  rdf_version: "1.2"
  turtle_version: "1.2"
  reification: false
shapes:
  - http://w3id.org/holon/provenance/#shapes
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-14T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

## 1. Provenance Architecture

### 1.1 Scope

HGA provenance operates at two distinct levels:

**Envelope-level provenance** — constrained by `hprov:` shapes (this section).
Applies to the event envelope itself: who generated the event, from which
pipeline activity, derived from which source signal. Uses `prov:wasGeneratedBy`,
`prov:wasAttributedTo`, and `prov:wasDerivedFrom` on event IRIs.

**Payload-level provenance** — NOT constrained here. Domain deployments use
`prov:wasDerivedFrom` within their payload graphs to trace specific assertions
to source documents. This is domain responsibility; HGA imposes no shapes.

**DataBook process stamp provenance** — constrained by `hprov:DataBookProcessStampShape`.
The `process:` frontmatter block in every DataBook maps directly to PROV-O;
this section defines the formal alignment and validation shapes.

### 1.2 PROV-O Alignment

<!-- databook:id: prov-alignment -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```turtle
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .

hspec:databookProvAlignment a hspec:ArchitecturalDecision ;
    rdfs:label "DataBook Process Stamp — PROV-O Alignment"@en ;
    dcterms:description """
    The DataBook process stamp (process: frontmatter key) maps to PROV-O as follows:

    DataBook frontmatter field     PROV-O term
    ───────────────────────────    ──────────────────────────
    id (document IRI)          →   prov:Entity
    process block              →   prov:Activity
    process.transformer_iri    →   prov:wasAssociatedWith
    process.inputs[n].iri      →   prov:used
    process.agent.iri          →   prov:wasAttributedTo (agent)
    process.timestamp          →   prov:endedAtTime
    process.transformer_type   →   hprov:transformerType
    hprov:ingestVector         →   (HGA extension — no PROV-O equivalent)
    hprov:pipelineStage        →   (HGA extension — no PROV-O equivalent)

    An implementation that materialises DataBook process stamps as RDF MUST
    produce at minimum:
      <doc-id> a prov:Entity ;
               prov:wasGeneratedBy <activity-bnode-or-iri> .
      <activity-bnode-or-iri> a prov:Activity ;
               prov:wasAssociatedWith <transformer-iri> ;
               prov:endedAtTime <timestamp> .
    """@en .
```

---

## 2. `hprov:` Vocabulary Declarations

<!-- databook:id: provenance-vocabulary -->
<!-- databook:graph: http://w3id.org/holon/provenance/#vocabulary -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```trig
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix hdb:     <http://w3id.org/holon/databook/> .
@prefix hspec:   <http://w3id.org/holon/spec/> .
@prefix owl:     <http://www.w3.org/2002/07/owl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .

GRAPH <http://w3id.org/holon/provenance/#vocabulary> {

  # ── Classes ───────────────────────────────────────────────────────────────

  hprov:IngestionActivity a owl:Class ;
      rdfs:label   "Ingestion Activity"@en ;
      rdfs:comment "A prov:Activity representing one run of the HGA ingestion pipeline. Carries the pipeline stage reached, the ingestion vector used, and the transformer that processed the signal."@en ;
      sh:agentInstruction
          "An IngestionActivity is a run of the pipeline. It connects a source signal (prov:used) to an output DataBook or event (prov:generated). Check ingestVector to know which of the seven ingestion pathways was used."@en ;
      rdfs:subClassOf prov:Activity .

  hprov:TransformerAgent a owl:Class ;
      rdfs:label   "Transformer Agent"@en ;
      rdfs:comment "A prov:Agent representing a transformer used in the HGA pipeline. May be an LLM, XSLT stylesheet, SPARQL processor, SHACL engine, or human reviewer."@en ;
      sh:agentInstruction
          "A TransformerAgent is anything that transforms content in the pipeline. LLMs, XSLT, SPARQL — they are all agents with provenance responsibility."@en ;
      rdfs:subClassOf prov:Agent .

  hprov:TransformerType a owl:Class ;
      rdfs:label   "Transformer Type"@en ;
      rdfs:comment "Controlled vocabulary for the type of transformer used in an IngestionActivity."@en .

  # ── TransformerType individuals ────────────────────────────────────────

  hprov:LLMTransformer a hprov:TransformerType ;
      rdfs:label      "LLM Transformer"@en ;
      skos:notation   "llm" ;
      skos:definition "A large language model (e.g. Claude). Non-deterministic. Output varies by prompt context."@en .

  hprov:XSLTTransformer a hprov:TransformerType ;
      rdfs:label      "XSLT Transformer"@en ;
      skos:notation   "xslt" ;
      skos:definition "An XSLT 2.0/3.0 stylesheet. Deterministic given identical input."@en .

  hprov:SPARQLTransformer a hprov:TransformerType ;
      rdfs:label      "SPARQL Transformer"@en ;
      skos:notation   "sparql" ;
      skos:definition "A SPARQL SELECT, CONSTRUCT, or UPDATE operation. Deterministic given identical dataset state."@en .

  hprov:SHACLTransformer a hprov:TransformerType ;
      rdfs:label      "SHACL Transformer"@en ;
      skos:notation   "shacl" ;
      skos:definition "A SHACL validation or SHACL Rules inference run."@en .

  hprov:HumanTransformer a hprov:TransformerType ;
      rdfs:label      "Human Reviewer"@en ;
      skos:notation   "human" ;
      skos:definition "A human reviewer or curator. Non-deterministic. Used in the confidence gate review queue."@en .

  hprov:CompositeTransformer a hprov:TransformerType ;
      rdfs:label      "Composite Transformer"@en ;
      skos:notation   "composite" ;
      skos:definition "A pipeline of multiple transformers. The composite carries the steps as an ordered list."@en .

  # ── HGA-specific Provenance Properties ──────────────────────────────────

  hprov:ingestVector a owl:DatatypeProperty ;
      rdfs:label   "ingest vector"@en ;
      rdfs:domain  hprov:IngestionActivity ;
      rdfs:range   xsd:integer ;
      sh:unit      <http://qudt.org/vocab/unit/UNITLESS> ;
      dcterms:description
          "The ingestion vector number (1–7) used for this activity. Vectors: 1=Transcriptional, 2=Database/SPARQL, 3=Streaming/CNL, 4=Federated RDF, 5=Multimodal, 6=Cross-holon inference, 7=Human curation."@en ;
      sh:agentInstruction
          "Ingestion vector tells you how the signal entered the pipeline. Vector 1 (transcriptional) is richest but most expensive. Vector 7 (human) is most accurate but slowest."@en .

  hprov:pipelineStage a owl:DatatypeProperty ;
      rdfs:label   "pipeline stage"@en ;
      rdfs:domain  hprov:IngestionActivity ;
      rdfs:range   xsd:integer ;
      dcterms:description
          "The highest pipeline stage reached in this activity (1–9): 1=Signal, 2=Preprocessor, 3=Pass1 entity recognition, 4=Pass2 LLM generation, 5=Confidence gate, 6=SHACL validation, 7=SPARQL UPDATE, 8=Projection, 9=Cartographer."@en .

  hprov:transformerType a owl:ObjectProperty ;
      rdfs:label   "transformer type"@en ;
      rdfs:domain  hprov:IngestionActivity ;
      rdfs:range   hprov:TransformerType ;
      dcterms:description
          "The type of transformer used in this activity. MUST be an individual from the hprov:TransformerType controlled vocabulary."@en .

  hprov:transformerIRI a owl:DatatypeProperty ;
      rdfs:label   "transformer IRI"@en ;
      rdfs:domain  hprov:IngestionActivity ;
      rdfs:range   xsd:anyURI ;
      dcterms:description
          "The dereferenceable IRI of the specific transformer used. For LLMs, this is the model API endpoint (e.g. the Anthropic API IRI). For XSLT, the stylesheet IRI. For SPARQL, the endpoint IRI."@en .

  hprov:inputRole a owl:DatatypeProperty ;
      rdfs:label   "input role"@en ;
      rdfs:range   xsd:string ;
      dcterms:description
          "The role of an input in the ingestion activity. Controlled values: primary (main source), constraint (SHACL shapes), context (prior holon DataBooks), evidence (supporting signal), reference (lookup data), template (prompt or XSLT template)."@en .

  hprov:confidenceGateOutcome a owl:DatatypeProperty ;
      rdfs:label   "confidence gate outcome"@en ;
      rdfs:domain  hprov:IngestionActivity ;
      rdfs:range   xsd:string ;
      dcterms:description
          "The outcome of the confidence gate for this ingestion activity. Controlled values: auto-registered, queued-for-review, new-entity-minted."@en .

  # ── DerivationActivity ────────────────────────────────────────────────────

  hprov:DerivationActivity a owl:Class ;
      rdfs:label   "Derivation Activity"@en ;
      rdfs:comment """A prov:Activity representing the computation of a derived DataHolon from
one or more existing DataHolons via an explicit derivation rule. Disjoint from
hprov:IngestionActivity — use IngestionActivity when the source is an external
signal entering the pipeline; use DerivationActivity when all sources are holons
already in the scene graph."""@en ;
      sh:agentInstruction
          "A DerivationActivity traces computed artefacts back to their source DataHolons and the rule that computed them. Always check derivedFromHolon to find the upstream sources and derivationRule to identify what produced this DataHolon."@en ;
      rdfs:subClassOf prov:Activity ;
      owl:disjointWith hprov:IngestionActivity .

  hprov:derivedFromHolon a owl:ObjectProperty ;
      rdfs:label   "derived from holon"@en ;
      rdfs:domain  hprov:DerivationActivity ;
      rdfs:comment "Links a DerivationActivity to each source DataHolon from which the derived artefact was computed. MUST have at least one value."@en ;
      sh:agentInstruction
          "derivedFromHolon is the upstream chain. Follow these links to find the source DataHolons whose content was combined to produce the derived artefact."@en .

  hprov:derivationRule a owl:DatatypeProperty ;
      rdfs:label   "derivation rule"@en ;
      rdfs:domain  hprov:DerivationActivity ;
      rdfs:range   xsd:anyURI ;
      rdfs:comment "The dereferenceable IRI of the derivation rule applied — a SPARQL CONSTRUCT query, a SHACL Rule, or a named derivation function. SHOULD be declared for reproducibility."@en ;
      sh:agentInstruction
          "derivationRule tells you how the derived DataHolon was computed. Dereference the IRI to find the actual SPARQL CONSTRUCT or SHACL Rule. If absent, the derivation is not reproducible from provenance alone."@en .

}
```

---

## 3. SHACL 1.2 Provenance Shapes

### 3.1 Event Envelope Provenance

<!-- databook:id: event-envelope-provenance-shapes -->
<!-- databook:graph: http://w3id.org/holon/provenance/#shapes -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```trig
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix hev:     <http://w3id.org/holon/event/> .
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

GRAPH <http://w3id.org/holon/provenance/#shapes> {

  # ── EventEnvelopeProvenanceShape ────────────────────────────────────────

  hprov:EventEnvelopeProvenanceShape a sh:NodeShape ;
      sh:targetClass   hev:HolonEvent ;
      sh:name          "Event Envelope Provenance"@en ;
      sh:intent        "Validates that every event envelope carries the minimum required PROV-O provenance: wasGeneratedBy (linking to the pipeline activity) and optionally wasAttributedTo (linking to the source agent) and wasDerivedFrom (linking to the source signal)."@en ;
      sh:agentInstruction
          "Every event must be traceable to its origin. wasGeneratedBy tells you which pipeline run produced it. wasAttributedTo tells you which agent submitted it. wasDerivedFrom tells you which source document it came from."@en ;

      sh:property [
          sh:path     prov:wasGeneratedBy ;
          sh:minCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "Event envelope MUST carry prov:wasGeneratedBy linking to the generating pipeline activity."@en ;
      ] ;

      sh:property [
          sh:path     prov:wasAttributedTo ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "Event envelope SHOULD carry prov:wasAttributedTo identifying the source agent."@en ;
      ] ;

      sh:property [
          sh:path     prov:wasDerivedFrom ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Info ;
          sh:message  "Event envelope MAY carry prov:wasDerivedFrom tracing to source signals."@en ;
      ] .

  # ── IngestionActivityShape ───────────────────────────────────────────────

  hprov:IngestionActivityShape a sh:NodeShape ;
      sh:targetClass   hprov:IngestionActivity ;
      sh:name          "Ingestion Activity"@en ;
      sh:intent        "Validates that an IngestionActivity carries transformer type, transformer IRI, a start or end time, and optional ingest vector."@en ;
      sh:agentInstruction
          "An IngestionActivity is a pipeline run. Validate that you know what transformer ran, when it ran, and what it consumed."@en ;

      sh:property [
          sh:path     rdfs:label ;
          sh:minCount 1 ;
          sh:severity sh:Violation ;
          sh:message  "IngestionActivity MUST have an rdfs:label."@en ;
      ] ;

      sh:property [
          sh:path     prov:endedAtTime ;
          sh:maxCount 1 ;
          sh:datatype xsd:dateTime ;
          sh:severity sh:Violation ;
          sh:message  "prov:endedAtTime MUST be xsd:dateTime if present."@en ;
      ] ;

      sh:property [
          sh:path     prov:startedAtTime ;
          sh:maxCount 1 ;
          sh:datatype xsd:dateTime ;
          sh:severity sh:Violation ;
          sh:message  "prov:startedAtTime MUST be xsd:dateTime if present."@en ;
      ] ;

      sh:property [
          sh:path     hprov:transformerType ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:in       ( hprov:LLMTransformer
                        hprov:XSLTTransformer
                        hprov:SPARQLTransformer
                        hprov:SHACLTransformer
                        hprov:HumanTransformer
                        hprov:CompositeTransformer ) ;
          sh:severity sh:Violation ;
          sh:message  "IngestionActivity MUST declare exactly one hprov:transformerType."@en ;
      ] ;

      sh:property [
          sh:path     hprov:transformerIRI ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "IngestionActivity MUST declare exactly one hprov:transformerIRI."@en ;
      ] ;

      sh:property [
          sh:path     hprov:ingestVector ;
          sh:maxCount 1 ;
          sh:datatype xsd:integer ;
          sh:minInclusive 1 ;
          sh:maxInclusive 7 ;
          sh:severity sh:Violation ;
          sh:message  "ingestVector MUST be an integer in [1, 7] if present."@en ;
      ] ;

      sh:property [
          sh:path     hprov:pipelineStage ;
          sh:maxCount 1 ;
          sh:datatype xsd:integer ;
          sh:minInclusive 1 ;
          sh:maxInclusive 9 ;
          sh:severity sh:Violation ;
          sh:message  "pipelineStage MUST be an integer in [1, 9] if present."@en ;
      ] ;

      sh:property [
          sh:path     hprov:confidenceGateOutcome ;
          sh:maxCount 1 ;
          sh:datatype xsd:string ;
          sh:in       (
              "auto-registered"
              "queued-for-review"
              "new-entity-minted"
          ) ;
          sh:severity sh:Violation ;
          sh:message  "confidenceGateOutcome MUST be one of: auto-registered, queued-for-review, new-entity-minted."@en ;
      ] .

  # ── DataBookProvenanceShape ──────────────────────────────────────────────

  hprov:DataBookProvenanceShape a sh:NodeShape ;
      sh:targetClass   hdb:DataBook ;
      sh:name          "DataBook Provenance"@en ;
      sh:intent        "Validates that a DataBook carries minimum PROV-O provenance: the document IRI is a prov:Entity with wasGeneratedBy pointing to an activity that in turn has wasAssociatedWith pointing to a transformer."@en ;
      sh:agentInstruction
          "Every DataBook is a prov:Entity. Its process stamp should tell you who made it, with what tool, and from what inputs. Validate this before trusting the DataBook's content."@en ;

      sh:property [
          sh:path     prov:wasGeneratedBy ;
          sh:minCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "DataBook SHOULD carry prov:wasGeneratedBy."@en ;
      ] ;

      sh:property [
          sh:path     dcterms:created ;
          sh:maxCount 1 ;
          sh:or (
              [ sh:datatype xsd:date ]
              [ sh:datatype xsd:dateTime ]
          ) ;
          sh:severity sh:Violation ;
          sh:message  "dcterms:created MUST be xsd:date or xsd:dateTime if present."@en ;
      ] ;

      sh:property [
          sh:path     dcterms:creator ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Info ;
          sh:message  "dcterms:creator SHOULD reference a named IRI."@en ;
      ] .

  # ── DerivationActivityShape ─────────────────────────────────────────────────

  hprov:DerivationActivityShape a sh:NodeShape ;
      sh:targetClass   hprov:DerivationActivity ;
      sh:name          "Derivation Activity"@en ;
      sh:intent        "Validates that a DerivationActivity correctly records its source DataHolons, the derivation rule applied, and the transformer responsible. Ensures derived DataHolons have a complete, reproducible provenance trail."@en ;
      sh:agentInstruction
          "A DerivationActivity must name every source DataHolon (derivedFromHolon) and identify the transformer that ran the derivation. The derivation rule IRI is strongly recommended for reproducibility."@en ;

      sh:property [
          sh:path     rdfs:label ;
          sh:minCount 1 ;
          sh:severity sh:Violation ;
          sh:message  "DerivationActivity MUST have an rdfs:label."@en ;
      ] ;

      sh:property [
          sh:path     hprov:derivedFromHolon ;
          sh:minCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "DerivationActivity MUST carry at least one hprov:derivedFromHolon link to a source DataHolon."@en ;
      ] ;

      sh:property [
          sh:path     hprov:transformerType ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:in       ( hprov:LLMTransformer
                        hprov:XSLTTransformer
                        hprov:SPARQLTransformer
                        hprov:SHACLTransformer
                        hprov:HumanTransformer
                        hprov:CompositeTransformer ) ;
          sh:severity sh:Violation ;
          sh:message  "DerivationActivity MUST declare exactly one hprov:transformerType."@en ;
      ] ;

      sh:property [
          sh:path     hprov:transformerIRI ;
          sh:minCount 1 ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Violation ;
          sh:message  "DerivationActivity MUST declare exactly one hprov:transformerIRI."@en ;
      ] ;

      sh:property [
          sh:path     hprov:derivationRule ;
          sh:maxCount 1 ;
          sh:nodeKind sh:IRI ;
          sh:severity sh:Warning ;
          sh:message  "DerivationActivity SHOULD declare hprov:derivationRule (the SPARQL CONSTRUCT or SHACL Rule IRI) for reproducibility."@en ;
      ] ;

      sh:property [
          sh:path     prov:startedAtTime ;
          sh:maxCount 1 ;
          sh:datatype xsd:dateTime ;
          sh:severity sh:Violation ;
          sh:message  "prov:startedAtTime MUST be xsd:dateTime if present."@en ;
      ] ;

      sh:property [
          sh:path     prov:endedAtTime ;
          sh:maxCount 1 ;
          sh:datatype xsd:dateTime ;
          sh:severity sh:Violation ;
          sh:message  "prov:endedAtTime MUST be xsd:dateTime if present."@en ;
      ] .

}
```

---

## 4. DataBook Process Stamp — Formal PROV-O Mapping

The following shows the canonical materialisation of a DataBook process
stamp as PROV-O triples. Implementations MUST produce this pattern
when serialising DataBook provenance to RDF.

<!-- databook:id: process-stamp-prov-example -->
<!-- mode=example norm=false -->
```turtle
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .

# The DataBook document itself
<http://w3id.org/holon/spec/namespace-registry>
    a prov:Entity ;
    prov:wasGeneratedBy   <urn:activity:namespace-registry-gen-001> ;
    prov:wasAttributedTo  <https://holongraph.com/people/chloe-shannon> ;
    dcterms:created       "2026-06-04"^^xsd:date .

# The generating activity (from process: stamp)
<urn:activity:namespace-registry-gen-001>
    a prov:Activity , hprov:IngestionActivity ;
    rdfs:label             "Namespace Registry DataBook Generation"@en ;
    prov:wasAssociatedWith <https://api.anthropic.com/v1/models/claude-sonnet-4-6> ;
    prov:endedAtTime       "2026-06-04T00:00:00Z"^^xsd:dateTime ;
    hprov:transformerType  hprov:LLMTransformer ;
    hprov:transformerIRI   <https://api.anthropic.com/v1/models/claude-sonnet-4-6> ;
    hprov:pipelineStage    4 ;
    prov:used [
        a prov:Entity ;
        rdfs:label        "HGA specification design session"@en ;
        hprov:inputRole   "primary" ;
    ] .

# The orchestrating agent
<https://holongraph.com/people/chloe-shannon>
    a prov:Agent , hprov:TransformerAgent ;
    rdfs:label "Chloe Shannon"@en .
```

### 4.1 Derived DataHolon — DerivationActivity Example

The following example shows provenance for a monthly average temperature
DataHolon computed from a set of daily sensor reading DataHolons via a
SPARQL CONSTRUCT query. This illustrates the observed → derived chain: each
daily reading is an independently ingested DataHolon; the monthly summary is
derived from them by aggregation.

<!-- databook:id: derivation-activity-example -->
<!-- mode=example norm=false -->
```turtle
@prefix prov:    <http://www.w3.org/ns/prov#> .
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix holon:   <http://w3id.org/holon/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex:      <https://example.org/holons/> .

# ── Derived DataHolon ────────────────────────────────────────────────────────
# Monthly temperature summary computed from daily observations

ex:temp-summary-2026-05
    a holon:DataHolon ;
    rdfs:label               "Station A — Monthly Temperature Summary, May 2026"@en ;
    holon:registrationStatus holon:RegisteredStatus ;
    prov:wasGeneratedBy      ex:activity-monthly-avg-2026-05 ;
    prov:wasDerivedFrom      ex:temp-reading-2026-05-01 ,
                             ex:temp-reading-2026-05-02 .
    # (remaining daily readings omitted for brevity)

# ── DerivationActivity ───────────────────────────────────────────────────────

ex:activity-monthly-avg-2026-05
    a prov:Activity , hprov:DerivationActivity ;
    rdfs:label               "Monthly Average Derivation — Station A, May 2026"@en ;
    prov:startedAtTime       "2026-06-01T00:00:00Z"^^xsd:dateTime ;
    prov:endedAtTime         "2026-06-01T00:00:02Z"^^xsd:dateTime ;
    prov:wasAssociatedWith   <urn:engine:sparql-processor-v3> ;
    hprov:transformerType    hprov:SPARQLTransformer ;
    hprov:transformerIRI     <urn:engine:sparql-processor-v3> ;
    hprov:derivedFromHolon   ex:temp-reading-2026-05-01 ;
    hprov:derivedFromHolon   ex:temp-reading-2026-05-02 ;
    hprov:derivationRule     <urn:rule:monthly-temperature-average-v1> ;
    hprov:pipelineStage      7 .

# ── Source DataHolons (observed via IngestionActivity, not shown) ────────────

ex:temp-reading-2026-05-01
    a holon:DataHolon ;
    rdfs:label "Station A — Daily Temperature Reading, 1 May 2026"@en ;
    holon:registrationStatus holon:RegisteredStatus .

ex:temp-reading-2026-05-02
    a holon:DataHolon ;
    rdfs:label "Station A — Daily Temperature Reading, 2 May 2026"@en ;
    holon:registrationStatus holon:RegisteredStatus .
```

---

## 5. Ingestion Vector Reference

The seven ingestion vectors are formally enumerated below as
`hprov:IngestionVector` SKOS concepts. This table is normative for
the values of `hprov:ingestVector`.

<!-- databook:id: ingest-vector-scheme -->
<!-- databook:graph: http://w3id.org/holon/provenance/#skos -->
<!-- mode=normative norm=true conformance=core rfc2119=MUST -->
```trig
@prefix hprov:   <http://w3id.org/holon/provenance/> .
@prefix skos:    <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

GRAPH <http://w3id.org/holon/provenance/#skos> {

  hprov:IngestVectorScheme a skos:ConceptScheme ;
      rdfs:label     "HGA Ingestion Vector Scheme"@en ;
      dcterms:description
          "Classifies the seven ingestion pathways into the HGA pipeline. Each vector has a characteristic source type, primary challenge, and context richness."@en .

  hprov:Vector1 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 1 — Transcriptional"@en ;
      skos:notation      "1" ;
      skos:definition    "Source: documents, transcripts, logs. Primary challenge: computational cost. Context richness: highest. Applies the two-pass entity recognition pipeline."@en .

  hprov:Vector2 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 2 — Database / SPARQL"@en ;
      skos:notation      "2" ;
      skos:definition    "Source: relational databases, SPARQL Anything endpoints. Primary challenge: schema mapping. Context richness: low."@en .

  hprov:Vector3 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 3 — Streaming Events"@en ;
      skos:notation      "3" ;
      skos:definition    "Source: CNL event streams, dataset feeds. Primary challenge: ontology alignment. Context richness: medium."@en .

  hprov:Vector4 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 4 — Federated RDF"@en ;
      skos:notation      "4" ;
      skos:definition    "Source: peer RDF graphs, remote triplestores. Primary challenge: trust calibration. Context richness: medium."@en .

  hprov:Vector5 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 5 — Multimodal"@en ;
      skos:notation      "5" ;
      skos:definition    "Source: images, audio, video, sensor data. Primary challenge: preprocessing model selection. Context richness: variable."@en .

  hprov:Vector6 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 6 — Cross-Holon Inference"@en ;
      skos:notation      "6" ;
      skos:definition    "Source: derived by intersection or inference across existing holons. Primary challenge: intersection detection. Context richness: derived."@en .

  hprov:Vector7 a skos:Concept ;
      skos:inScheme      hprov:IngestVectorScheme ;
      skos:topConceptOf  hprov:IngestVectorScheme ;
      rdfs:label         "Vector 7 — Human Curation"@en ;
      skos:notation      "7" ;
      skos:definition    "Source: human reviewer or curator. Primary challenge: process overhead. Context richness: highest. Applied in the confidence gate review queue for high-stakes domains."@en .

}
```

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document
License. Ontology content: CC0-1.0.*
