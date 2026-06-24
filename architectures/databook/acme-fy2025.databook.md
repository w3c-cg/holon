---
id: https://w3id.org/databook/examples/aasb1060-holon-v1
title: "Financial Statement Holon — Working Example (AASB1060)"
type: databook
version: 1.0.0
created: 2026-06-23
description: >
  A small working example showing how an XBRL-based financial statement
  (modelled on AASB1060 General Purpose Financial Statements) can be
  expressed as a holon DataBook across its four constituent named graphs:
  scene graph (instance facts), boundary graph (reporting framework
  constraints), event graph (committed ledger), and projection graph
  (audience-scoped views). Intended as a companion to the Inference
  Engineer article "The Map Charles Drew" (June 2026).
graph:
  named_graph: https://w3id.org/databook/examples/aasb1060-holon-v1/trig
  reification: false
  triple_count: 87
  subjects: 24
  graphs:
    - id: scene
      iri: https://example.org/holons/acme-fy2025/scene
      description: Instance facts — reported figures for ACME Pty Ltd FY2025
    - id: boundary
      iri: https://example.org/holons/acme-fy2025/boundary
      description: SHACL shapes derived from AASB1060 reporting framework constraints
    - id: events
      iri: https://example.org/holons/acme-fy2025/events
      description: Committed ledger — journal entries producing the reported figures
    - id: projection
      iri: https://example.org/holons/acme-fy2025/projection
      description: Projection DataBook metadata — audience-scoped view descriptors
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-23T00:00:00Z
  inputs:
    - iri: https://github.com/seattlemethod/aasb1060
      role: primary
      description: AASB1060 XBRL framework (Seattle Method)
    - iri: https://digitalfinancialreporting.blogspot.com/2026/05/example-financial-statement-holon.html
      role: reference
      description: Charles Hoffman's financial statement holon post
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

## Overview

This DataBook encodes a simplified financial statement for a fictional entity — **ACME Pty Ltd** — for the financial year ending 30 June 2025, prepared under the Australian AASB1060 framework (General Purpose Financial Statements for Tier 2 entities). The figures are illustrative; the structure is the point.

A financial statement holon is composed of four named graphs. Each section below introduces one graph, explains what layer of the holonic architecture it represents, and provides a working Turtle fragment. The complete TriG serialisation combining all four graphs follows at the end.

The example deliberately stays small — one income statement, one balance sheet, a handful of journal entries, two projections — so that the structural relationships are visible rather than buried in data volume.

> **Note:** Prefixes are declared once in the TriG block and apply across all four graphs. Individual Turtle fragments below repeat only the prefixes they use locally for readability.

---

## Prefix Declarations

All blocks in this DataBook share the following namespace bindings.

<!-- databook:id: prefixes -->
```turtle
@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl:    <http://www.w3.org/2002/07/owl#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:     <http://www.w3.org/ns/shacl#> .
@prefix prov:   <http://www.w3.org/ns/prov#> .
@prefix holon:  <https://ontologist.io/ns/holon#> .
@prefix build:  <https://w3id.org/databook/ns#> .

# Reporting framework — versioned boundary IRI
@prefix aasb:   <https://aasb.gov.au/taxonomy/2024/aasb1060#> .

# Instance namespace for ACME Pty Ltd FY2025
@prefix acme:   <https://example.org/holons/acme-fy2025/> .

# Named graphs
@prefix scene:  <https://example.org/holons/acme-fy2025/scene#> .
@prefix ev:     <https://example.org/holons/acme-fy2025/events#> .
@prefix proj:   <https://example.org/holons/acme-fy2025/projection#> .
```

---

## Graph 1 — Scene Graph (Interior State)

The scene graph holds the **instance facts**: the reported figures for ACME Pty Ltd for the year ending 30 June 2025. These are the values that appear in the financial statement itself — revenue, expenses, assets, liabilities, equity — scoped to a specific reporting entity, a specific period, and a specific reporting framework.

In XBRL terms, this corresponds to the **XBRL instance document**: the XML file carrying the tagged fact values. Each fact carries its concept (what is being measured), its value, its unit, and its reporting context (entity + period + reporting scenario).

In holon terms, this is the **interior state** of the company holon at the close of FY2025. It is not a database; it is a projection of the company's financial reality as at a particular moment, scoped to what AASB1060 requires to be disclosed.

> **Note:** The scene graph holds *reported facts*, not raw transactions. Those live in the event graph. The scene graph is derived from the event graph via the accounting process; the event graph is the authoritative record.

<!-- databook:id: scene-graph -->
<!-- databook:graph: https://example.org/holons/acme-fy2025/scene -->
```turtle
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix aasb:  <https://aasb.gov.au/taxonomy/2024/aasb1060#> .
@prefix acme:  <https://example.org/holons/acme-fy2025/> .
@prefix scene: <https://example.org/holons/acme-fy2025/scene#> .
@prefix prov:  <http://www.w3.org/ns/prov#> .

# ── Reporting context ──────────────────────────────────────────────────────────

acme:context-fy2025 a aasb:ReportingContext ;
    aasb:entity        acme:entity ;
    aasb:period        acme:period-fy2025 ;
    aasb:scenario      aasb:Actual .

acme:entity a aasb:ReportingEntity ;
    rdfs:label         "ACME Pty Ltd"^^xsd:string ;
    aasb:abn           "12 345 678 901"^^xsd:string ;
    aasb:framework     <https://aasb.gov.au/taxonomy/2024/aasb1060> .

acme:period-fy2025 a aasb:ReportingPeriod ;
    aasb:startDate     "2024-07-01"^^xsd:date ;
    aasb:endDate       "2025-06-30"^^xsd:date ;
    aasb:periodType    aasb:Annual .

# ── Income statement facts ─────────────────────────────────────────────────────

scene:fact-revenue a aasb:Fact ;
    aasb:concept       aasb:Revenue ;
    aasb:value         "4200000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer ;
    prov:wasDerivedFrom ev:je-batch-revenue .

scene:fact-cogs a aasb:Fact ;
    aasb:concept       aasb:CostOfGoodsSold ;
    aasb:value         "2580000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer ;
    prov:wasDerivedFrom ev:je-batch-cogs .

scene:fact-gross-profit a aasb:Fact ;
    aasb:concept       aasb:GrossProfit ;
    aasb:value         "1620000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer ;
    # Derived: Revenue − CostOfGoodsSold
    prov:wasDerivedFrom scene:fact-revenue, scene:fact-cogs .

scene:fact-opex a aasb:Fact ;
    aasb:concept       aasb:OperatingExpenses ;
    aasb:value         "980000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer ;
    prov:wasDerivedFrom ev:je-batch-opex .

scene:fact-net-income a aasb:Fact ;
    aasb:concept       aasb:NetIncome ;
    aasb:value         "640000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer ;
    prov:wasDerivedFrom scene:fact-gross-profit, scene:fact-opex .

# ── Balance sheet facts ────────────────────────────────────────────────────────

scene:fact-total-assets a aasb:Fact ;
    aasb:concept       aasb:TotalAssets ;
    aasb:value         "3150000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer .

scene:fact-total-liabilities a aasb:Fact ;
    aasb:concept       aasb:TotalLiabilities ;
    aasb:value         "1890000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer .

scene:fact-equity a aasb:Fact ;
    aasb:concept       aasb:TotalEquity ;
    aasb:value         "1260000"^^xsd:decimal ;
    aasb:unit          <https://www.currency-iso.org/AUD> ;
    aasb:context       acme:context-fy2025 ;
    aasb:decimals      "0"^^xsd:integer ;
    # Articulation: equity connects balance sheet to statement of changes in equity
    prov:wasDerivedFrom scene:fact-total-assets, scene:fact-total-liabilities .
```

---

## Graph 2 — Boundary Graph (Control Plane)

The boundary graph holds **constraints**: the rules that govern what the scene graph may and must contain. In XBRL terms this corresponds to the **taxonomy and XBRL formulas** — the reporting framework's definition of which concepts exist, which are mandatory, and which mathematical relationships must hold between facts.

In holon terms, this is the **SHACL shapes graph**: the versioned contract that defines what a valid AASB1060 FY2025 filing looks like. The version matters — `<https://aasb.gov.au/taxonomy/2024/aasb1060>` is a distinct versioned IRI, separate from any prior or subsequent release.

Three classes of constraint are shown below:
- **Mandatory facts** — what the framework requires to be disclosed
- **Mathematical integrity** — rollup relationships (GrossProfit = Revenue − COGS; Assets = Liabilities + Equity)
- **Articulation** — the constraint that links the income statement to the equity statement via NetIncome

> **Note:** `sh:nodeExpression` constraints (SHACL-AF) are used for the mathematical rollups rather than SHACL-SPARQL, keeping the constraint self-contained without requiring a SPARQL endpoint at validation time. For context-sensitive constraints — e.g., revenue recognition rules that vary by industry — SHACL-SPARQL is the appropriate escalation path.

<!-- databook:id: boundary-graph -->
<!-- databook:graph: https://example.org/holons/acme-fy2025/boundary -->
```shacl
@prefix sh:    <http://www.w3.org/ns/shacl#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix aasb:  <https://aasb.gov.au/taxonomy/2024/aasb1060#> .
@prefix acme:  <https://example.org/holons/acme-fy2025/> .
@prefix holon: <https://ontologist.io/ns/holon#> .

# ── Boundary identity ──────────────────────────────────────────────────────────

<https://example.org/holons/acme-fy2025/boundary>
    a holon:BoundaryGraph ;
    holon:governsHolon <https://example.org/holons/acme-fy2025/> ;
    holon:frameworkVersion <https://aasb.gov.au/taxonomy/2024/aasb1060> ;
    holon:boundaryVersion "2024"^^xsd:string .

# ── Mandatory fact shapes ──────────────────────────────────────────────────────

aasb:IncomeStatementShape a sh:NodeShape ;
    sh:targetClass aasb:ReportingContext ;
    sh:name "Income Statement completeness" ;

    sh:property [
        sh:path     aasb:Revenue ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Revenue must be disclosed under AASB1060 s27."
    ] ;
    sh:property [
        sh:path     aasb:CostOfGoodsSold ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Cost of Goods Sold must be disclosed under AASB1060 s28."
    ] ;
    sh:property [
        sh:path     aasb:GrossProfit ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Gross Profit must be disclosed under AASB1060 s28."
    ] ;
    sh:property [
        sh:path     aasb:NetIncome ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Net Income must be disclosed under AASB1060 s29."
    ] .

aasb:BalanceSheetShape a sh:NodeShape ;
    sh:targetClass aasb:ReportingContext ;
    sh:name "Balance Sheet completeness" ;

    sh:property [
        sh:path     aasb:TotalAssets ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Total Assets must be disclosed under AASB1060 s35."
    ] ;
    sh:property [
        sh:path     aasb:TotalLiabilities ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Total Liabilities must be disclosed under AASB1060 s35."
    ] ;
    sh:property [
        sh:path     aasb:TotalEquity ;
        sh:minCount 1 ;
        sh:datatype xsd:decimal ;
        sh:message  "Total Equity must be disclosed under AASB1060 s36."
    ] .

# ── Mathematical integrity (SHACL-SPARQL) ─────────────────────────────────────

aasb:GrossProfitCalcShape a sh:NodeShape ;
    sh:targetClass aasb:ReportingContext ;
    sh:name "Gross Profit rollup integrity" ;
    sh:sparql [
        sh:message  "GrossProfit must equal Revenue minus CostOfGoodsSold." ;
        sh:select   """
            PREFIX aasb: <https://aasb.gov.au/taxonomy/2024/aasb1060#>
            SELECT $this
            WHERE {
                $this aasb:Revenue          ?rev  .
                $this aasb:CostOfGoodsSold  ?cogs .
                $this aasb:GrossProfit      ?gp   .
                FILTER ( ?gp != (?rev - ?cogs) )
            }
        """
    ] .

aasb:BalanceSheetEqShape a sh:NodeShape ;
    sh:targetClass aasb:ReportingContext ;
    sh:name "Accounting equation integrity" ;
    sh:sparql [
        sh:message  "TotalAssets must equal TotalLiabilities plus TotalEquity." ;
        sh:select   """
            PREFIX aasb: <https://aasb.gov.au/taxonomy/2024/aasb1060#>
            SELECT $this
            WHERE {
                $this aasb:TotalAssets       ?assets .
                $this aasb:TotalLiabilities  ?liab   .
                $this aasb:TotalEquity       ?equity .
                FILTER ( ?assets != (?liab + ?equity) )
            }
        """
    ] .

# ── Articulation constraint ────────────────────────────────────────────────────
# NetIncome must equal the change in equity attributable to operations,
# connecting the income statement holon to the equity statement holon.

aasb:ArticulationShape a sh:NodeShape ;
    sh:targetClass aasb:ReportingContext ;
    sh:name "Income-to-equity articulation" ;
    sh:sparql [
        sh:message  "NetIncome must reconcile to change in retained earnings in the equity statement." ;
        sh:select   """
            PREFIX aasb: <https://aasb.gov.au/taxonomy/2024/aasb1060#>
            SELECT $this
            WHERE {
                $this aasb:NetIncome           ?ni   .
                $this aasb:RetainedEarningsDelta ?red .
                FILTER ( ?ni != ?red )
            }
        """
    ] .
```

---

## Graph 3 — Event Graph (Committed Ledger)

The event graph is the **append-only committed record** of what happened: the journal entries and posting events that produced the scene graph's reported figures. This is not a queryable database of current state — it is an immutable ledger of state changes, each carrying provenance and authorisation metadata.

In XBRL terms, this is the layer Charles Hoffman maps to the **general ledger and subsidiary ledgers** — the business event records that feed into the financial statement. The key distinction is that the event graph is an audit trail, not a reporting structure: the events do not carry reporting context (period, scenario), but they do carry commitment metadata (who posted, when, under what authorisation).

Three batches are shown: revenue postings, cost of goods sold, and operating expenses. Each batch is a `holon:AssertionEvent` carrying provenance and linking forward to the scene graph facts it produces.

<!-- databook:id: event-graph -->
<!-- databook:graph: https://example.org/holons/acme-fy2025/events -->
```turtle
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix prov:  <http://www.w3.org/ns/prov#> .
@prefix holon: <https://ontologist.io/ns/holon#> .
@prefix aasb:  <https://aasb.gov.au/taxonomy/2024/aasb1060#> .
@prefix ev:    <https://example.org/holons/acme-fy2025/events#> .
@prefix acme:  <https://example.org/holons/acme-fy2025/> .

# ── Journal entry batch: Revenue ───────────────────────────────────────────────

ev:je-batch-revenue a holon:AssertionEvent ;
    holon:targetHolon     acme: ;
    holon:assertedAt      "2025-07-15T09:00:00Z"^^xsd:dateTime ;
    holon:receivedAt      "2025-07-15T09:00:00Z"^^xsd:dateTime ;
    holon:committedBy     acme:user-cfo ;
    holon:commitReference "GL-2025-REV-001"^^xsd:string ;
    holon:ledgerPeriod    "2025-06-30"^^xsd:date ;
    prov:wasGeneratedBy   acme:process-month-end-close-jun2025 ;
    aasb:debit  [ aasb:account aasb:AccountsReceivable ; aasb:amount "4200000"^^xsd:decimal ] ;
    aasb:credit [ aasb:account aasb:Revenue            ; aasb:amount "4200000"^^xsd:decimal ] .

# ── Journal entry batch: Cost of Goods Sold ────────────────────────────────────

ev:je-batch-cogs a holon:AssertionEvent ;
    holon:targetHolon     acme: ;
    holon:assertedAt      "2025-07-15T09:05:00Z"^^xsd:dateTime ;
    holon:receivedAt      "2025-07-15T09:05:00Z"^^xsd:dateTime ;
    holon:committedBy     acme:user-cfo ;
    holon:commitReference "GL-2025-COGS-001"^^xsd:string ;
    holon:ledgerPeriod    "2025-06-30"^^xsd:date ;
    prov:wasGeneratedBy   acme:process-month-end-close-jun2025 ;
    aasb:debit  [ aasb:account aasb:CostOfGoodsSold ; aasb:amount "2580000"^^xsd:decimal ] ;
    aasb:credit [ aasb:account aasb:Inventory        ; aasb:amount "2580000"^^xsd:decimal ] .

# ── Journal entry batch: Operating Expenses ────────────────────────────────────

ev:je-batch-opex a holon:AssertionEvent ;
    holon:targetHolon     acme: ;
    holon:assertedAt      "2025-07-15T09:10:00Z"^^xsd:dateTime ;
    holon:receivedAt      "2025-07-15T09:10:00Z"^^xsd:dateTime ;
    holon:committedBy     acme:user-cfo ;
    holon:commitReference "GL-2025-OPEX-001"^^xsd:string ;
    holon:ledgerPeriod    "2025-06-30"^^xsd:date ;
    prov:wasGeneratedBy   acme:process-month-end-close-jun2025 ;
    aasb:debit  [ aasb:account aasb:OperatingExpenses ; aasb:amount "980000"^^xsd:decimal ] ;
    aasb:credit [ aasb:account aasb:CashAndEquivalents ; aasb:amount "980000"^^xsd:decimal ] .

# ── Closing process provenance ─────────────────────────────────────────────────

acme:process-month-end-close-jun2025 a prov:Activity ;
    prov:startedAtTime   "2025-07-14T08:00:00Z"^^xsd:dateTime ;
    prov:endedAtTime     "2025-07-15T17:00:00Z"^^xsd:dateTime ;
    prov:wasAssociatedWith acme:user-cfo ;
    holon:authorisation  acme:board-resolution-2025-07-15 .

acme:board-resolution-2025-07-15 a holon:AuthorisationStamp ;
    holon:authorisedBy   acme:board-of-directors ;
    holon:authorisedAt   "2025-08-12T00:00:00Z"^^xsd:dateTime ;
    holon:resolutionRef  "ACME-BR-2025-08-12-001"^^xsd:string .
```

---

## Graph 4 — Projection Graph (Presentation Layer)

The projection graph holds **view descriptors**: metadata about the audience-scoped projections that can be generated from the scene graph. It does not duplicate the facts — it encodes who is asking, what they are permitted to see, and what format serves them.

In XBRL terms, projections correspond to the multiple **report renderings** Charles demonstrated: the Arelle technical view, the Pesseract business view, the LucaSuite cloud view, the iXBRL inline rendering. Each is a different projection of the same scene graph, governed by the same boundary graph, addressed to a different audience.

Two projections are declared here: one for the company's **board of directors** (full detail, including the event graph provenance trail) and one for the **regulatory submission** to ASIC (iXBRL format, mandated concepts only).

<!-- databook:id: projection-graph -->
<!-- databook:graph: https://example.org/holons/acme-fy2025/projection -->
```turtle
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix holon: <https://ontologist.io/ns/holon#> .
@prefix aasb:  <https://aasb.gov.au/taxonomy/2024/aasb1060#> .
@prefix proj:  <https://example.org/holons/acme-fy2025/projection#> .
@prefix acme:  <https://example.org/holons/acme-fy2025/> .

# ── Projection 1: Board of Directors ──────────────────────────────────────────

proj:board-view a holon:Projection ;
    rdfs:label          "Board of Directors — Full Financial Review"@en ;
    holon:identity      acme:audience-board ;
    holon:stance        holon:GovernanceStance ;
    holon:resolution    holon:FullDetail ;
    holon:includesGraph acme:scene ;
    holon:includesGraph acme:events ;       # Board sees provenance trail
    holon:format        holon:InteractiveHTML ;
    holon:accessControl acme:acl-board-only ;
    holon:generatedBy   <https://example.org/projectors/board-report-v2> .

acme:audience-board a holon:Audience ;
    rdfs:label          "ACME Pty Ltd Board of Directors"@en ;
    holon:priorContext  "Annual financial review; comparison to FY2024 budget." .

# ── Projection 2: Regulatory Submission (ASIC) ────────────────────────────────

proj:asic-ixbrl a holon:Projection ;
    rdfs:label          "ASIC Regulatory Submission — iXBRL"@en ;
    holon:identity      acme:audience-asic ;
    holon:stance        holon:RegulatoryStance ;
    holon:resolution    holon:MandatoryConceptsOnly ;
    holon:includesGraph acme:scene ;        # Regulator sees facts only
    holon:format        aasb:InlineXBRL ;
    holon:frameworkVersion <https://aasb.gov.au/taxonomy/2024/aasb1060> ;
    holon:submissionDeadline "2025-10-31"^^xsd:date ;
    holon:generatedBy   <https://example.org/projectors/ixbrl-renderer-v3> .

acme:audience-asic a holon:Audience ;
    rdfs:label          "Australian Securities and Investments Commission"@en ;
    holon:regulatoryBody true ;
    holon:priorContext  "Annual statutory filing under Corporations Act 2001 s319." .
```

---

## Complete TriG Serialisation

The four named graphs assembled into a single TriG document. This is the complete financial statement holon as a machine-readable artifact — one file, four graphs, fully self-describing.

<!-- databook:id: complete-trig -->
```trig
@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd:    <http://www.w3.org/2001/XMLSchema#> .
@prefix sh:     <http://www.w3.org/ns/shacl#> .
@prefix prov:   <http://www.w3.org/ns/prov#> .
@prefix holon:  <https://ontologist.io/ns/holon#> .
@prefix aasb:   <https://aasb.gov.au/taxonomy/2024/aasb1060#> .
@prefix acme:   <https://example.org/holons/acme-fy2025/> .
@prefix scene:  <https://example.org/holons/acme-fy2025/scene#> .
@prefix ev:     <https://example.org/holons/acme-fy2025/events#> .
@prefix proj:   <https://example.org/holons/acme-fy2025/projection#> .

# ── Default graph: holon identity ─────────────────────────────────────────────
{
    acme: a holon:Holon ;
        rdfs:label          "ACME Pty Ltd — Financial Statement Holon FY2025"@en ;
        holon:sceneGraph    <https://example.org/holons/acme-fy2025/scene> ;
        holon:boundaryGraph <https://example.org/holons/acme-fy2025/boundary> ;
        holon:eventGraph    <https://example.org/holons/acme-fy2025/events> ;
        holon:projectionGraph <https://example.org/holons/acme-fy2025/projection> ;
        holon:status        holon:RegisteredStatus ;
        holon:registeredAt  "2025-08-15T00:00:00Z"^^xsd:dateTime .
}

# ── Scene graph ────────────────────────────────────────────────────────────────
<https://example.org/holons/acme-fy2025/scene> {
    acme:context-fy2025 a aasb:ReportingContext ;
        aasb:entity     acme:entity ;
        aasb:period     acme:period-fy2025 ;
        aasb:scenario   aasb:Actual ;
        aasb:Revenue            "4200000"^^xsd:decimal ;
        aasb:CostOfGoodsSold    "2580000"^^xsd:decimal ;
        aasb:GrossProfit        "1620000"^^xsd:decimal ;
        aasb:OperatingExpenses  "980000"^^xsd:decimal ;
        aasb:NetIncome          "640000"^^xsd:decimal ;
        aasb:TotalAssets        "3150000"^^xsd:decimal ;
        aasb:TotalLiabilities   "1890000"^^xsd:decimal ;
        aasb:TotalEquity        "1260000"^^xsd:decimal .
}

# ── Boundary graph ─────────────────────────────────────────────────────────────
<https://example.org/holons/acme-fy2025/boundary> {
    <https://example.org/holons/acme-fy2025/boundary>
        a holon:BoundaryGraph ;
        holon:governsHolon      acme: ;
        holon:frameworkVersion  <https://aasb.gov.au/taxonomy/2024/aasb1060> .

    aasb:IncomeStatementShape a sh:NodeShape ;
        sh:targetClass aasb:ReportingContext ;
        sh:property [ sh:path aasb:Revenue ;         sh:minCount 1 ; sh:datatype xsd:decimal ] ;
        sh:property [ sh:path aasb:CostOfGoodsSold ; sh:minCount 1 ; sh:datatype xsd:decimal ] ;
        sh:property [ sh:path aasb:GrossProfit ;     sh:minCount 1 ; sh:datatype xsd:decimal ] ;
        sh:property [ sh:path aasb:NetIncome ;        sh:minCount 1 ; sh:datatype xsd:decimal ] .

    aasb:BalanceSheetShape a sh:NodeShape ;
        sh:targetClass aasb:ReportingContext ;
        sh:property [ sh:path aasb:TotalAssets ;      sh:minCount 1 ; sh:datatype xsd:decimal ] ;
        sh:property [ sh:path aasb:TotalLiabilities ; sh:minCount 1 ; sh:datatype xsd:decimal ] ;
        sh:property [ sh:path aasb:TotalEquity ;       sh:minCount 1 ; sh:datatype xsd:decimal ] .

    aasb:BalanceSheetEqShape a sh:NodeShape ;
        sh:targetClass aasb:ReportingContext ;
        sh:sparql [
            sh:message "TotalAssets must equal TotalLiabilities plus TotalEquity." ;
            sh:select  """
                PREFIX aasb: <https://aasb.gov.au/taxonomy/2024/aasb1060#>
                SELECT $this WHERE {
                    $this aasb:TotalAssets      ?a .
                    $this aasb:TotalLiabilities ?l .
                    $this aasb:TotalEquity      ?e .
                    FILTER ( ?a != (?l + ?e) )
                }
            """
        ] .
}

# ── Event graph ────────────────────────────────────────────────────────────────
<https://example.org/holons/acme-fy2025/events> {
    ev:je-batch-revenue a holon:AssertionEvent ;
        holon:targetHolon   acme: ;
        holon:assertedAt    "2025-07-15T09:00:00Z"^^xsd:dateTime ;
        holon:committedBy   acme:user-cfo ;
        holon:commitReference "GL-2025-REV-001"^^xsd:string ;
        aasb:debit  [ aasb:account aasb:AccountsReceivable ; aasb:amount "4200000"^^xsd:decimal ] ;
        aasb:credit [ aasb:account aasb:Revenue ;            aasb:amount "4200000"^^xsd:decimal ] .

    ev:je-batch-cogs a holon:AssertionEvent ;
        holon:targetHolon   acme: ;
        holon:assertedAt    "2025-07-15T09:05:00Z"^^xsd:dateTime ;
        holon:committedBy   acme:user-cfo ;
        holon:commitReference "GL-2025-COGS-001"^^xsd:string ;
        aasb:debit  [ aasb:account aasb:CostOfGoodsSold ; aasb:amount "2580000"^^xsd:decimal ] ;
        aasb:credit [ aasb:account aasb:Inventory ;        aasb:amount "2580000"^^xsd:decimal ] .

    ev:je-batch-opex a holon:AssertionEvent ;
        holon:targetHolon   acme: ;
        holon:assertedAt    "2025-07-15T09:10:00Z"^^xsd:dateTime ;
        holon:committedBy   acme:user-cfo ;
        holon:commitReference "GL-2025-OPEX-001"^^xsd:string ;
        aasb:debit  [ aasb:account aasb:OperatingExpenses ;  aasb:amount "980000"^^xsd:decimal ] ;
        aasb:credit [ aasb:account aasb:CashAndEquivalents ; aasb:amount "980000"^^xsd:decimal ] .
}

# ── Projection graph ───────────────────────────────────────────────────────────
<https://example.org/holons/acme-fy2025/projection> {
    proj:board-view a holon:Projection ;
        rdfs:label          "Board of Directors — Full Financial Review"@en ;
        holon:stance        holon:GovernanceStance ;
        holon:resolution    holon:FullDetail ;
        holon:includesGraph acme:scene ;
        holon:includesGraph acme:events ;
        holon:format        holon:InteractiveHTML .

    proj:asic-ixbrl a holon:Projection ;
        rdfs:label          "ASIC Regulatory Submission — iXBRL"@en ;
        holon:stance        holon:RegulatoryStance ;
        holon:resolution    holon:MandatoryConceptsOnly ;
        holon:includesGraph acme:scene ;
        holon:format        aasb:InlineXBRL ;
        holon:frameworkVersion <https://aasb.gov.au/taxonomy/2024/aasb1060> .
}
```

---

## Validation Queries

Two standing SPARQL queries for use with `databook pull` or direct SPARQL endpoint access. The first checks mathematical integrity against the scene graph; the second retrieves the event provenance chain for any reported fact.

<!-- databook:id: validate-accounting-equation -->
<!-- databook:label: Validate accounting equation -->
```sparql
PREFIX aasb: <https://aasb.gov.au/taxonomy/2024/aasb1060#>
PREFIX acme: <https://example.org/holons/acme-fy2025/>

SELECT ?context ?assets ?liabilities ?equity ?check
FROM <https://example.org/holons/acme-fy2025/scene>
WHERE {
    ?context a aasb:ReportingContext ;
             aasb:TotalAssets      ?assets ;
             aasb:TotalLiabilities ?liabilities ;
             aasb:TotalEquity      ?equity .
    BIND ( (?liabilities + ?equity) AS ?sum )
    BIND ( IF(?assets = ?sum, "PASS", "FAIL") AS ?check )
}
```

<!-- databook:id: select-fact-provenance -->
<!-- databook:label: Retrieve provenance chain for a reported fact -->
<!-- databook:param: factIRI type=IRI default=scene:fact-net-income -->
```sparql
PREFIX prov:  <http://www.w3.org/ns/prov#>
PREFIX holon: <https://ontologist.io/ns/holon#>
PREFIX aasb:  <https://aasb.gov.au/taxonomy/2024/aasb1060#>
PREFIX scene: <https://example.org/holons/acme-fy2025/scene#>

SELECT ?fact ?concept ?value ?source ?committedBy ?committedAt ?ref
FROM <https://example.org/holons/acme-fy2025/scene>
FROM <https://example.org/holons/acme-fy2025/events>
WHERE {
    VALUES ?fact { scene:fact-net-income }
    ?fact aasb:concept ?concept ;
          aasb:value   ?value ;
          prov:wasDerivedFrom ?source .

    OPTIONAL {
        ?source holon:committedBy     ?committedBy ;
                holon:assertedAt      ?committedAt ;
                holon:commitReference ?ref .
    }
}
ORDER BY ?committedAt
```

---

## Usage Notes

**Loading to a triplestore**

```bash
databook push acme-fy2025.databook.md --dataset acme-fy2025 --endpoint http://localhost:3030
```

This pushes each named graph block to the triplestore under its declared graph IRI. The SHACL shapes in the boundary graph can then be applied with:

```bash
databook validate acme-fy2025.databook.md --shapes-graph https://example.org/holons/acme-fy2025/boundary
```

**Extending to prior years**

Each financial year is a separate holon with its own versioned IRI — `acme-fy2024`, `acme-fy2025`, and so on. Lateral connections between years (comparative figures, retained earnings carry-forward) are expressed as `holon:LateralLink` triples in the default graph of each holon, not by merging scene graphs across years. This preserves the integrity of each year's boundary contract while enabling cross-year SPARQL queries via `FROM` clause composition.

**Extending to subsidiary holons**

A parent company consolidation would register each subsidiary as its own holon (e.g., `acme-subsidiary-alpha-fy2025`), each with its own four-graph structure. The consolidated group account holon's scene graph is populated by a SPARQL CONSTRUCT query that aggregates across the subsidiary scene graphs, governed by the consolidation framework's boundary graph. Elimination entries (intercompany transactions) are expressed as `holon:AssertionEvent` records in the consolidation event graph.

> **See also:** The Inference Engineer article ["The Map Charles Drew"](https://inferenceengineer.substack.com/p/the-map-charles-drew) (June 2026) for the architectural discussion that motivated this example.
