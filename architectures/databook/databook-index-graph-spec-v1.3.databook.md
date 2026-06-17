---
id: https://w3id.org/databook/spec/index-graph-v1.3
title: "DataBook Specification Addendum: Dataset Index Named Graph"
type: databook
version: 0.2.0
created: 2026-06-17
status: draft
target_spec_version: "1.3"
description: >
  Specifies the dataset index named graph feature for DataBook v1.3.
  When a DataBook is pushed to a Jena triplestore, its frontmatter metadata
  is simultaneously written into a well-known index named graph within the
  same dataset, enabling catalog-style discovery without full graph
  introspection. Introduces the path field for hierarchical organisation
  of DataBooks within a dataset, independent of IRI key structure. Covers
  vocabulary, push behaviour, CLI flags, SPARQL patterns, delete behaviour,
  and HolonBridge integration.
graph:
  namespace: https://w3id.org/databook/ns#
  named_graph: https://w3id.org/databook/spec/index-graph-v1.3#graph
  triple_count: 43
  subjects: 10
process:
  transformer: "Claude Sonnet 4.6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  timestamp: 2026-06-17T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
  inputs:
    - iri: https://w3id.org/databook/spec/v1.2
      role: primary
      description: "DataBook spec v1.2 — base specification being extended"
---

# DataBook Specification Addendum: Dataset Index Named Graph

**Spec version target:** 1.3  
**Status:** Draft for review — v0.2.0  
**Author:** Chloe Shannon / Kurt Cagle

---

## Motivation

When a DataBook is pushed to a Jena Fuseki dataset, the RDF payload lands in a
named graph derived from the DataBook's `id` IRI. The frontmatter metadata
— title, type, version, creation date, description — exists only in the
`.databook.md` file on disk. To discover what DataBooks are loaded in a
dataset, a client must either enumerate all named graphs (expensive, noisy) or
maintain an out-of-band manifest.

The **dataset index named graph** solves this by making the push operation
write a compact catalog record for each DataBook into a single, well-known
named graph within the same dataset. The index graph is a lightweight catalog:
cheap to query, always in sync with the dataset's actual content, and fully
triplestore-resident.

A second problem is organisation: DataBook IRIs are stable keys, not
navigational paths. As the number of DataBooks in a dataset grows, there is no
inherent folder structure — nothing equivalent to GitHub's directory tree.
This addendum introduces the `path` frontmatter field to provide that
organisation layer without disturbing the IRI key structure.

---

## Specification

### 1. The Index Named Graph

Each Jena dataset has at most one index named graph. The IRI convention is:

```
urn:{dataset-name}:databook:index#graph
```

Examples:
- `urn:causalspark:databook:index#graph`
- `urn:ggsc:databook:index#graph`

The index IRI is scoped to the dataset. There is no global index spanning
multiple datasets. Cross-dataset discovery is performed by querying each
dataset's index in turn (see `databook list --all-datasets`, §6).

The index IRI may be overridden in the HolonBridge dataset profile or via the
`--index-graph` CLI flag (see §4).

> **Note:** The `#graph` fragment is intentional and consistent with the
> named graph IRI convention used elsewhere in the DataBook stack. The fragment
> distinguishes the graph IRI from the index document IRI.

### 2. The `path` Frontmatter Field

The `path` field provides hierarchical organisation of DataBooks within a
dataset, independent of the DataBook's `id` IRI. It follows the same
conventions as GitHub repository paths: forward-slash-separated segments,
no leading slash, no trailing slash.

```yaml
path: westbridge-fc/press-releases/tom-piper-signing
```

The path has three components:

| Component | Example | Role |
|---|---|---|
| Folder segments | `westbridge-fc/press-releases` | Zero or more segments forming the logical folder hierarchy |
| Terminal segment | `tom-piper-signing` | The DataBook's name within its folder; analogous to a filename without extension |

The terminal segment is the last path component. All preceding components are
folder segments. A path with no `/` is a root-level DataBook with only a
terminal segment.

**The path does not affect the `id` IRI.** It is purely a navigational
overlay. Two DataBooks may share the same path prefix (folder) while having
entirely different IRI key structures.

**Path conventions:**

- Segments use kebab-case: `press-releases` not `PressReleases` or `press_releases`
- Segments are lowercase
- Segments should be human-meaningful and stable — path changes are a
  breaking change for any tooling that has hardcoded a path reference
- The `path` field is optional. DataBooks without a `path` are treated as
  root-level entries

**Example paths:**

```
ggsc/country-risk/kenya-2026-q2
ggsc/country-risk/brazil-2026-q2
ggsc/workflows/satellite-orbits
ggsc/named-queries/risk-by-tier
causalspark/demos/westbridge-fc-press-release
causalspark/conformance/sga-v0-7-shapes
w3c-hcg/spec/hga-named-query-v1.0
```

### 3. Vocabulary

The index graph uses `dcterms:` and `db:` terms. No additional namespace
dependencies are introduced.

<!-- databook:id: index-vocab -->
```turtle
@prefix db:      <https://w3id.org/databook/ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#> .
@prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

# ── Formalised class ──────────────────────────────────────────────────────────

db:DataBook a rdfs:Class ;
    rdfs:label   "DataBook"@en ;
    rdfs:comment "A Markdown document that simultaneously functions as a human-readable document, typed data container, and self-describing semantic artifact."@en .

db:IndexGraph a rdfs:Class ;
    rdfs:label   "DataBook Index Graph"@en ;
    rdfs:comment """A named graph within a dataset that holds catalog records
    for every DataBook that has been pushed to that dataset. There is at most
    one IndexGraph per dataset."""@en .

# ── New properties ────────────────────────────────────────────────────────────

db:indexGraph a rdf:Property ;
    rdfs:label   "index graph"@en ;
    rdfs:domain  rdfs:Resource ;
    rdfs:range   db:IndexGraph ;
    rdfs:comment "Links a dataset descriptor to its index named graph IRI."@en .

db:namedGraph a rdf:Property ;
    rdfs:label   "named graph"@en ;
    rdfs:domain  db:DataBook ;
    rdfs:range   rdfs:Resource ;
    rdfs:comment "The named graph IRI into which this DataBook's RDF content was loaded."@en .

db:path a rdf:Property ;
    rdfs:label   "path"@en ;
    rdfs:domain  db:DataBook ;
    rdfs:range   xsd:string ;
    rdfs:comment """Forward-slash-separated hierarchical path providing organisational
    context for this DataBook within its dataset. Does not affect the DataBook's id IRI.
    Follows GitHub path conventions: kebab-case segments, no leading or trailing slash."""@en .

db:indexedAt a rdf:Property ;
    rdfs:label   "indexed at"@en ;
    rdfs:domain  db:DataBook ;
    rdfs:range   xsd:dateTime ;
    rdfs:comment "The datetime at which this DataBook's catalog record was written to the index graph."@en .

db:version a rdf:Property ;
    rdfs:label   "version"@en ;
    rdfs:domain  db:DataBook ;
    rdfs:range   xsd:string ;
    rdfs:comment "Semver version string from the DataBook frontmatter."@en .
```

### 4. Catalog Record Structure

Each DataBook pushed to a dataset generates one catalog record in the index
graph. The record carries a compact projection of the DataBook's frontmatter:

<!-- databook:id: catalog-record-example -->
```turtle
@prefix db:      <https://w3id.org/databook/ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd:     <http://www.w3.org/2001/XMLSchema#> .

<urn:databook:westbridge-fc:press-release:tom-piper-signing:2026-06-17>
    a db:DataBook ;
    dcterms:title       "Westbridge FC — Tom Piper Signing" ;
    dcterms:type        "databook" ;
    dcterms:created     "2026-06-17"^^xsd:date ;
    dcterms:description "Press release DataBook for Tom Piper signing announcement." ;
    db:version          "1.0.0" ;
    db:path             "causalspark/demos/westbridge-fc-press-release" ;
    db:namedGraph       <urn:databook:westbridge-fc:press-release:tom-piper-signing:2026-06-17#graph> ;
    db:indexedAt        "2026-06-17T14:32:00Z"^^xsd:dateTime .
```

**Frontmatter-to-catalog-record mapping:**

| Frontmatter field   | Predicate             | Datatype / note                                           |
|---------------------|-----------------------|-----------------------------------------------------------|
| `id`                | Subject IRI           | Resolves relative to base if not absolute                 |
| `title`             | `dcterms:title`       | `xsd:string`                                              |
| `type`              | `dcterms:type`        | `xsd:string`                                              |
| `version`           | `db:version`          | `xsd:string`                                              |
| `created`           | `dcterms:created`     | `xsd:date`                                                |
| `description`       | `dcterms:description` | `xsd:string`; omitted if absent                           |
| `path`              | `db:path`             | `xsd:string`; omitted if absent                           |
| `graph.named_graph` | `db:namedGraph`       | IRI; omitted if absent                                    |
| *(push timestamp)*  | `db:indexedAt`        | `xsd:dateTime`; set by push operation, not `created` date |

Fields not listed above (`author`, `process`, `shapes`, etc.) are **not**
written to the index. The index is intentionally compact — a catalog, not a
mirror of the full frontmatter.

### 5. Push Behaviour

When `databook push` loads a DataBook to a triplestore, it performs an
additional **index upsert** after the main GSP PUT succeeds. The upsert uses a
SPARQL Update `WITH … DELETE … INSERT … WHERE` against the dataset's SPARQL
Update endpoint. The upsert is not submitted if the GSP PUT fails — this
prevents stale index records.

<!-- databook:id: index-upsert-update -->
<!-- databook:label: Index upsert SPARQL Update template -->
```sparql-update
PREFIX db:      <https://w3id.org/databook/ns#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX xsd:     <http://www.w3.org/2001/XMLSchema#>

WITH <{index_graph_iri}>
DELETE { <{databook_iri}> ?p ?o }
INSERT {
    <{databook_iri}>
        a db:DataBook ;
        dcterms:title       "{title}" ;
        dcterms:type        "{type}" ;
        dcterms:created     "{created}"^^xsd:date ;
        dcterms:description "{description}" ;
        db:version          "{version}" ;
        db:path             "{path}" ;
        db:namedGraph       <{named_graph_iri}> ;
        db:indexedAt        "{indexed_at}"^^xsd:dateTime .
}
WHERE {
    OPTIONAL { <{databook_iri}> ?p ?o }
}
```

Template variables (`{...}`) are resolved from frontmatter before the update
is submitted. The DELETE clause ensures the operation is idempotent — pushing
the same DataBook twice produces one clean catalog record.

Optional triples (`dcterms:description`, `db:path`, `db:namedGraph`) are
omitted from the INSERT block when the corresponding frontmatter fields are
absent, rather than inserting empty strings.

#### New CLI flag

```
databook push <file> [options]

--index-graph <IRI>   IRI of the index named graph.
                      Default: urn:{dataset}:databook:index#graph
                      Set to "none" to suppress index writes.
```

#### HolonBridge profile integration

The HolonBridge dataset profile (`context/{fuseki-host}/{dataset}/profile.json`)
gains one optional field:

```json
{
  "indexGraph": "urn:{dataset}:databook:index#graph"
}
```

When present, HolonBridge uses this IRI for all index operations against that
dataset. When absent, the default convention applies. When set to `"none"`,
index writes are suppressed for that dataset.

### 6. Delete Behaviour

When `databook delete` removes a DataBook's named graph from the triplestore
via GSP DELETE, it also removes the corresponding catalog record from the index
graph. The removal uses a targeted SPARQL Update:

<!-- databook:id: index-delete-update -->
<!-- databook:label: Index record removal SPARQL Update -->
```sparql-update
PREFIX db: <https://w3id.org/databook/ns#>

WITH <{index_graph_iri}>
DELETE { <{databook_iri}> ?p ?o }
WHERE  { <{databook_iri}> ?p ?o }
```

As with push, the index update fires after a successful GSP DELETE, not before.

#### Index repair

For DataBooks deleted out-of-band (direct Fuseki admin, GSP DELETE without
going through the CLI), a reconciliation command is provided:

```
databook index --repair --dataset <sparql-endpoint> [--index-graph <IRI>]
```

This command queries the index graph for all `db:namedGraph` values, performs
an ASK against each to confirm the named graph exists in the dataset, and
issues targeted DELETE updates for any stale records.

### 7. Discovery Queries

Once populated, the index graph supports lightweight discovery without touching
any data graphs.

<!-- databook:id: query-list-all -->
<!-- databook:label: List all indexed DataBooks -->
```sparql
PREFIX db:      <https://w3id.org/databook/ns#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?id ?title ?type ?version ?created ?path ?namedGraph WHERE {
    GRAPH <urn:{dataset}:databook:index#graph> {
        ?id a db:DataBook ;
            dcterms:title   ?title ;
            dcterms:type    ?type ;
            db:version      ?version ;
            dcterms:created ?created .
        OPTIONAL { ?id db:path      ?path      }
        OPTIONAL { ?id db:namedGraph ?namedGraph }
    }
}
ORDER BY ?path ?title
```

<!-- databook:id: query-by-path-prefix -->
<!-- databook:label: List DataBooks under a folder path -->
```sparql
PREFIX db:      <https://w3id.org/databook/ns#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?id ?title ?version ?path WHERE {
    GRAPH <urn:{dataset}:databook:index#graph> {
        ?id a db:DataBook ;
            dcterms:title ?title ;
            db:version    ?version ;
            db:path       ?path .
        FILTER(STRSTARTS(?path, "{folder_prefix}/") || ?path = "{folder_prefix}")
    }
}
ORDER BY ?path ?title
```

<!-- databook:id: query-graph-iri -->
<!-- databook:label: Resolve DataBook IRI to named graph IRI -->
```sparql
PREFIX db: <https://w3id.org/databook/ns#>

SELECT ?namedGraph WHERE {
    GRAPH <urn:{dataset}:databook:index#graph> {
        <{databook_iri}> db:namedGraph ?namedGraph .
    }
}
```

The `query-graph-iri` pattern is the key primitive for `databook pull
--databook-id`: resolve the DataBook IRI to its named graph IRI, then pull
the graph content via GSP GET. If the index graph does not exist or the
DataBook IRI is not found in it, fall back to a `DESCRIBE <{databook_iri}>`
against the SPARQL endpoint.

### 8. CLI Integration

#### `databook list --dataset`

The existing `databook list` command (which currently reads local filesystem)
gains a `--dataset` flag to query a live triplestore index:

```
databook list --dataset <sparql-endpoint> [options]

Options:
  --dataset <url>              SPARQL SELECT endpoint of the target dataset
  --index-graph <IRI>          Index graph IRI (default: resolved from profile
                               or urn:{dataset}:databook:index#graph)
  --path <prefix>              Filter to DataBooks under this folder path
  --type <type>                Filter by DataBook type
  --all-datasets               Query all datasets known to HolonBridge in turn
  --format table|json|turtle   Output format (default: table)
  --tree                       Display results as a path tree (table only)
```

When `--tree` is set, output is rendered as a directory-style tree grouped by
path hierarchy. DataBooks without a `path` appear at the root level:

```
(root)
  causalspark-demo-overview (v1.0.0, 2026-06-17)
causalspark/
  demos/
    westbridge-fc-press-release (v1.0.0, 2026-06-17)
  conformance/
    sga-v0-7-shapes (v0.3.0, 2026-06-12)
ggsc/
  country-risk/
    kenya-2026-q2 (v1.1.0, 2026-05-14)
    brazil-2026-q2 (v1.0.0, 2026-05-09)
  named-queries/
    risk-by-tier (v1.0.0, 2026-04-30)
```

#### `databook pull` — index-assisted mode

With the index in place, `databook pull --databook-id` becomes a two-step
triplestore operation:

1. Query the index graph with `query-graph-iri` to resolve
   `{databook_iri}` → `{named_graph_iri}`
2. Pull the named graph content via GSP GET and reconstruct the DataBook

#### `databook delete` — index record removal

`databook delete` issues the index DELETE update (§6) after a successful GSP
DELETE. The `--index-graph` flag follows the same conventions as `push`.

### 9. HolonBridge `/datasets` Response

`GET /datasets` is annotated with index graph metadata:

```json
{
  "datasets": [
    {
      "name": "causalspark",
      "sparqlEndpoint": "http://localhost:3030/causalspark/sparql",
      "indexGraph": "urn:causalspark:databook:index#graph",
      "indexedDataBooks": 6
    }
  ]
}
```

A new `GET /datasets/{name}/index` endpoint exposes the index graph as JSON,
including path information:

```
GET /datasets/{name}/index[?path={prefix}]

Response 200:
[
  {
    "id": "urn:databook:westbridge-fc:press-release:tom-piper-signing:2026-06-17",
    "title": "Westbridge FC — Tom Piper Signing",
    "type": "databook",
    "version": "1.0.0",
    "created": "2026-06-17",
    "path": "causalspark/demos/westbridge-fc-press-release",
    "namedGraph": "urn:databook:westbridge-fc:press-release:tom-piper-signing:2026-06-17#graph",
    "indexedAt": "2026-06-17T14:32:00Z"
  }
]
```

The optional `?path=` query parameter filters results to DataBooks whose
`db:path` starts with the given prefix, using the `query-by-path-prefix`
SPARQL pattern.

---

## Validation Checklist Additions (for DataBook Spec §Validation)

**Frontmatter — when `path` is present:**

- [ ] `path` uses forward slashes only — no backslashes, no leading or trailing slash
- [ ] All path segments are kebab-case and lowercase
- [ ] `path` terminal segment is meaningful and stable

**Push-time index checks:**

- [ ] Index graph IRI resolved from profile or CLI flag before push begins
- [ ] Index upsert submitted only after GSP PUT succeeds
- [ ] Optional triples (`dcterms:description`, `db:path`, `db:namedGraph`) omitted from INSERT when corresponding frontmatter fields are absent
- [ ] `db:indexedAt` set to push timestamp (UTC ISO 8601), not `created` date
- [ ] Upsert response status 200 or 204; non-success logged as warning but does not fail the push

**Delete-time index checks:**

- [ ] Index DELETE update submitted only after GSP DELETE succeeds
- [ ] Confirm record is removed: re-query index for `<{databook_iri}>` and expect empty result set

---

## Summary of Spec Changes

| Section | Change |
|---|---|
| §Frontmatter Reference | Add `path` field (optional); add to recommended fields table |
| §Vocabulary | Add `db:IndexGraph`, `db:indexGraph`, `db:namedGraph`, `db:path`, `db:indexedAt`, `db:version`; formalise `db:DataBook` |
| §Push Behaviour (new) | Document index upsert as standard post-push step; `--index-graph` CLI flag; profile `indexGraph` field |
| §Delete Behaviour (new) | Document index record removal on delete; `databook index --repair` command |
| §CLI — `databook list` | Add `--dataset`, `--index-graph`, `--path`, `--all-datasets`, `--tree` flags |
| §CLI — `databook pull` | Document index-assisted two-step resolution |
| §CLI — `databook delete` | Add index record removal |
| §CLI — `databook index --repair` | New subcommand for index reconciliation |
| §Validation | Add `path` field checks; push-time and delete-time index checklist |
| §HolonBridge Integration | `GET /datasets` annotation; new `GET /datasets/{name}/index` endpoint with `?path=` filter |
