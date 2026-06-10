---
id: https://w3id.org/databook/cli/commands
title: "DataBook CLI — Command Reference (v1.4.4)"
type: databook
version: 1.4.4
created: 2026-06-09
author:
  - name: Kurt Cagle
    iri: https://holongraph.com/people/kurt-cagle
    role: orchestrator
  - name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: transformer
license: CC-BY-4.0
domain: https://w3id.org/databook/ns#
subject:
  - databook
  - databook CLI
  - command reference
description: >
  Full command reference for the DataBook CLI v1.4.4. Documents all 20
  commands extracted from bin/databook.js (release 2026-05-17). Organised
  into three groups: Document Structure (create, head, insert, drop, extract,
  convert, ingest), Triplestore (push, pull, sparql, sparql-update, validate,
  describe, clear, list), and Pipeline (process, transform, prompt, fetch,
  shacl2sparql). Each entry includes synopsis, description, all options, and
  usage examples.
process:
  transformer: "claude-sonnet-4-6"
  transformer_type: llm
  transformer_iri: https://api.anthropic.com/v1/models/claude-sonnet-4-6
  inputs:
    - iri: https://drive.google.com/file/d/133CdxBnfKMU7RQmEDsZOXeuKPom7kEa1
      role: primary
      description: "bin/databook.js (2026-05-17 release) — source of all command registrations"
    - iri: https://drive.google.com/drive/folders/1ClJ-arRv_a43dk8Ulg97uTRb4JR3reY_
      role: reference
      description: "commands/ folder (18 command module files)"
  timestamp: 2026-06-09T00:00:00Z
  agent:
    name: Chloe Shannon
    iri: https://holongraph.com/people/chloe-shannon
    role: orchestrator
---

# DataBook CLI — Command Reference

**Version:** 1.4.4 · **Source:** `bin/databook.js` (release 2026-05-17)  
**Entry point:** `databook <command> [options]`  
**Help:** `databook --help` · `databook <command> --help`

---

## Command Summary

| Command | Synopsis | Group |
|---|---|---|
| [`create`](#create) | `create [inputs...]` | Document Structure |
| [`head`](#head) | `head [input]` | Document Structure |
| [`insert`](#insert) | `insert <databook> [file]` | Document Structure |
| [`drop`](#drop) | `drop <databook>` | Document Structure |
| [`extract`](#extract) | `extract [input]` | Document Structure |
| [`convert`](#convert) | `convert [input]` | Document Structure |
| [`ingest`](#ingest) | `ingest [input]` | Document Structure |
| [`push`](#push) | `push <file>` | Triplestore |
| [`pull`](#pull) | `pull [file]` | Triplestore |
| [`sparql`](#sparql) | `sparql [source]` | Triplestore |
| [`sparql-update`](#sparql-update) | `sparql-update [source]` | Triplestore |
| [`validate`](#validate) | `validate <source>` | Triplestore |
| [`describe`](#describe) | `describe [file]` | Triplestore |
| [`clear`](#clear) | `clear [file]` | Triplestore |
| [`list`](#list) | `list` | Triplestore |
| [`process`](#process) | `process [source]` | Pipeline |
| [`transform`](#transform) | `transform [source]` | Pipeline |
| [`prompt`](#prompt) | `prompt [source]` | Pipeline |
| [`fetch`](#fetch) | `fetch <source>` | Pipeline |
| [`shacl2sparql`](#shacl2sparql) | `shacl2sparql <source>` | Pipeline |

---

## Common Flags

These flags appear on most commands:

| Flag | Description |
|---|---|
| `--dry-run` | Print the resolved plan or request without executing |
| `-v, --verbose` | Emit per-block or per-request detail |
| `-q, --quiet` | Suppress info and warning messages |
| `--encoding <enc>` | Output encoding: `utf8` (default), `utf8bom`, `utf16` |
| `-a, --auth <credential>` | Basic/Bearer credential or bare base64 for triplestore auth |
| `-s, --server <n>` | Named server from `processors.toml` (use `"list"` to show all) |
| `-d, --dataset <n>` | Fuseki dataset name on localhost (shorthand for `--endpoint http://localhost:3030/<n>/sparql`) |
| `-e, --endpoint <url>` | Explicit SPARQL endpoint URL |
| `-o, --output <file>` | Write output to file instead of stdout |

Environment variable `DATABOOK_DEBUG=1` enables full stack traces on error.

---

## Document Structure Commands

Commands that operate on DataBook files locally — creating, editing, and extracting from `.databook.md` documents without requiring a triplestore.

---

### `create`

```
databook create [inputs...] [options]
```

Wrap one or more data files into a well-formed DataBook document. Accepts Turtle, SHACL, SPARQL, TriG, JSON-LD, JSON, YAML, CSV, XML, XSLT, XQuery, plain text, and prompt files. Auto-detects format from extension. Counts RDF triples and subjects, detects RDF version, and generates a full frontmatter block. With no inputs, produces a skeleton DataBook when `-o` is supplied.

**Source module:** `commands/create.js`

**Options:**

| Flag | Description |
|---|---|
| `-C, --config <file>` | Config YAML carrying metabindings, per-input annotations, and a template path |
| `--set <k=v>` | Frontmatter NVP override; dot-path supported (`graph.triple_count=47`); repeatable |
| `--template <file>` | Markdown prose template (overrides `config template:` field) |
| `--format <blocktype>` | Global format fallback for inputs whose extension is unrecognised |
| `-o, --output <file>` | Output path; default: `{first-input-stem}.databook.md`; `"-"` for stdout |
| `--force` | Overwrite output file if it already exists |
| `--dry-run` | Print resolved input plan without producing output |
| `--no-infer` | Require explicit role annotation for all inputs (no default-role inference) |
| `--registry <file>` | Additional plugin registry DataBook (repeatable) |
| `--encoding <enc>` | |
| `-v, --verbose` | Emit per-input handler resolution details |
| `-q, --quiet` | Suppress warnings |

**Template resolution order:** `(1)` `--template` flag → `(2)` `config template:` field → `(3)` bundled `templates/default.databook.md` → `(4)` inline builder.

**Extension → fence label mapping (selected):**

| Extension | Label | Extension | Label |
|---|---|---|---|
| `.ttl`, `.turtle` | `turtle` | `.shacl.ttl`, `.shapes.ttl` | `shacl` |
| `.ttl12` | `turtle12` | `.sparql`, `.rq` | `sparql` |
| `.trig` | `trig` | `.ru`, `.su` | `sparql-update` |
| `.jsonld`, `.json-ld` | `json-ld` | `.xsl`, `.xslt` | `xslt` |
| `.json` | `json` | `.xq`, `.xquery` | `xquery` |
| `.yaml`, `.yml` | `yaml` | `.prompt` | `prompt` |
| `.csv`, `.tsv` | `csv` | `.databook.md`, `.md` | `databook` |

**Examples:**
```bash
databook create ontology.ttl
databook create ontology.ttl shapes.shacl.ttl -C project.yaml -o output.databook.md
databook create -C pipeline/stage1.yaml -o output/stage1.databook.md
databook create ontology.ttl --set id=https://example.org/my-db-v1 --set version=2.0.0
databook create ontology.ttl --dry-run
```

---

### `head`

```
databook head [input] [options]
```

Dual-mode command for DataBook frontmatter. In **read mode** (no mutation flags), extracts and prints frontmatter as JSON, YAML, XML, or Turtle. In **update mode** (`--set` / `--json` / `--yaml` / `--file` present), patches frontmatter in-place using deep merge (or full replace with `--replace`).

**Source module:** `commands/head.js`

**Read-mode options:**

| Flag | Description |
|---|---|
| `--block-id <id>` | Return metadata for a specific block only |
| `-f, --format <fmt>` | Output format: `json` (default), `yaml`, `xml`, `turtle` |

**Update-mode options:**

| Flag | Description |
|---|---|
| `--set <key=value>` | Set a frontmatter key by dot-path (repeatable). Supports `@now` (ISO timestamp) and `@today` (YYYY-MM-DD) tokens |
| `--json <string>` | Inline JSON patch object |
| `--yaml <string>` | Inline YAML patch object |
| `--file <path>` | Path to `.json` or `.yaml` patch file |
| `--replace` | Replace entire frontmatter (default: deep merge) |
| `--dry-run` | Print patched document to stdout without writing |

**Shared options:** `-o`, `--encoding`, `-q`

**Examples:**
```bash
# Read mode
databook head source.databook.md
databook head source.databook.md --format turtle
databook head source.databook.md --block-id shapes-block --format yaml
cat source.databook.md | databook head --format json

# Update mode
databook head source.databook.md --set version=1.3.0
databook head source.databook.md --set modified=@now --set version=2.0.0
databook head source.databook.md --set graph.triple_count=47
databook head source.databook.md --json '{"license":"CC-BY-4.0"}'
databook head source.databook.md --file patch.yaml --dry-run
databook head source.databook.md --set version=2.0.0 -o updated.databook.md
```

---

### `insert`

```
databook insert <databook> [file] [options]
```

Add content to an existing DataBook without re-running `create`. Two modes:

**Block mode** (`--id` required, `[file]` required) — Wraps `[file]` as a new named fenced block. Language label is inferred from file extension. Position controlled by `--before` / `--after`; defaults to append.

**Prose mode** (`--id` absent, `--markdown` required, `[file]` ignored) — Edits body prose without touching any data blocks.

**Source module:** `commands/insert.js`

**Options:**

| Flag | Description |
|---|---|
| `--id <block-id>` | ID for the new block (required in block mode; omit for prose mode) |
| `--lang <language>` | Fence language label (inferred from extension if omitted) |
| `--before <block-id>` | Block mode: insert before this existing block |
| `--after <block-id>` | Block mode: insert after this existing block (default: append) |
| `--markdown <text\|@path>` | Block mode: prose to prepend before the new fence; Prose mode: new body prose. Prefix with `@` to read from file |
| `--markdown-mode <mode>` | Prose mode placement: `append` (default) \| `prepend` \| `replace` |
| `--force` | Block mode: overwrite existing block if `--id` already exists |
| `-o, --output <file>` | Output path (default: overwrites source DataBook) |
| `--dry-run` | Print result without writing |
| `--encoding <enc>` | |
| `-q, --quiet` | |

**`--markdown-mode` values:**

| Value | Behaviour |
|---|---|
| `append` | Add prose after the last block, or end of body |
| `prepend` | Insert prose after frontmatter, before existing content |
| `replace` | Strip all non-block prose; new prose first, then blocks |

**Examples:**
```bash
# Block mode
databook insert onto.databook.md shapes.ttl --id shapes-v2
databook insert onto.databook.md shapes.ttl --id shapes-v2 --after ontology-block
databook insert onto.databook.md shapes.ttl --id shapes-v2 \
  --markdown "SHACL validation layer for schema v2."
databook insert onto.databook.md shapes.ttl --id shapes-v2 --force

# Prose mode
databook insert onto.databook.md --markdown "Updated overview text."
databook insert onto.databook.md --markdown @intro.md --markdown-mode prepend
databook insert onto.databook.md --markdown @new-body.md --markdown-mode replace
```

---

### `drop`

```
databook drop <databook> [options]
```

Remove one or more named blocks from a DataBook. Removes the block's annotation lines, fenced content, and closing fence. The frontmatter is not modified. Multiple blocks can be dropped in one pass; they are removed in reverse document order so line numbers stay consistent. Consecutive blank lines left by removal are collapsed to at most two.

**Source module:** `commands/drop.js`

**Options:**

| Flag | Description |
|---|---|
| `--id <block-id>` | Block ID to remove (required; repeatable) |
| `--remove-prose` | Also remove the prose section that precedes each dropped block (from end of previous block to the block's first annotation line) |
| `--ignore-missing` | Silently skip `--id` values that do not exist (default: error) |
| `-o, --output <file>` | Output path (default: overwrites source DataBook) |
| `--dry-run` | Print result without writing |
| `--encoding <enc>` | |
| `-q, --quiet` | |

**Examples:**
```bash
databook drop onto.databook.md --id shapes-v2
databook drop onto.databook.md --id shapes-v2 --remove-prose
databook drop onto.databook.md --id shapes-v2 --id old-queries --remove-prose
databook drop onto.databook.md --id shapes-v2 --dry-run
databook drop onto.databook.md --id shapes-v2 -o trimmed.databook.md
databook drop onto.databook.md --id shapes-v2 --ignore-missing
```

---

### `extract`

```
databook extract [input] [options]
```

Emit raw block content to stdout or a file. The `--list` flag lists all named block IDs and labels in a DataBook and exits — this is the local-file equivalent of `databook list` (which queries the triplestore). Fragment IRI syntax (`file.databook.md#block-id`) is supported in `[input]`.

**Source module:** `commands/extract.js`

**Options:**

| Flag | Description |
|---|---|
| `-b, --block-id <id>` | Block to extract (overridden by `#fragment` syntax in `[input]`) |
| `-o, --output <path>` | Output file; use `"."` to auto-name from block-id + label extension |
| `--with-metadata` | Include `<!-- databook:* -->` comment lines in output |
| `--fence` | Wrap output in fence markers (` ``` label ... ``` `) |
| `--type` | Print Content-Type header to stderr |
| `--to <format>` | Convert extracted block to another format before output |
| `--list` | List all named block IDs and labels, then exit |
| `--encoding <enc>` | |
| `-q, --quiet` | |

> **Note:** `databook extract --list` inspects a local `.databook.md` file. To list DataBooks pushed to a triplestore, use `databook list`.

**Examples:**
```bash
databook extract source.databook.md#primary-graph | riot --syntax=turtle -
databook extract source.databook.md --block-id primary-graph -o graph.ttl
databook extract source.databook.md --list
databook extract source.databook.md#sparql-block --to csv -o results.csv
```

---

### `convert`

```
databook convert [input] [options]
```

Convert a DataBook block to another serialisation format. The `--list` flag shows all blocks and their available target formats.

**Source module:** `commands/convert.js`

**Options:**

| Flag | Description |
|---|---|
| `-b, --block-id <id>` | Block to convert (overridden by `#fragment` syntax) |
| `--to <format>` | Target format (required) |
| `--from <format>` | Input format override (required for stdin) |
| `-o, --output <path>` | Output file; `"."` to auto-name. Default: stdout |
| `--encoding <enc>` | |
| `--list` | List all blocks and their convertible target formats, then exit |
| `-q, --quiet` | Suppress info and lossy-conversion warnings |

**RDF input formats:** `turtle`, `turtle12`, `trig`, `shacl`, `json-ld`  
**RDF output formats:** `turtle`, `turtle12`, `ntriples`, `trig`, `json-ld`, `yaml-ld`, `xml-rdf`, `csv`, `tsv`, `markdown`, `yaml`  
**SPARQL result output formats:** `csv`, `tsv`, `markdown`, `yaml`, `json`

**Examples:**
```bash
databook convert source.databook.md#primary-graph --to json-ld
cat graph.ttl | databook convert - --from turtle --to json-ld
databook convert source.databook.md --list
databook convert source.databook.md#sparql-results --to csv -o results.csv
```

---

### `ingest`

```
databook ingest [input] [options]
```

Phase 1 algorithmic conversion: promote a plain Markdown document to a DataBook. Scans fenced code blocks and uplifts those with recognised semantic labels (`turtle`, `turtle12`, `trig`, `json-ld`, `shacl`, `sparql`, `sparql-update`, `prompt`, `manifest`). Generates required frontmatter with auto-derived IRI, triple count, and process stamp. Display-only labels (`javascript`, `python`, `bash`, etc.) are kept as-is.

**Source module:** `commands/ingest.js`

**Phase 2 enrichment** (run `prompt` after ingest):
```bash
databook prompt output.databook.md \
  --prompt "Write a concise description" \
  --patch frontmatter.description
```

**Options:**

| Flag | Description |
|---|---|
| `-o, --output <file>` | Output path (default: `{stem}.databook.md`; `"-"` for stdout) |
| `--id <iri>` | Override generated document IRI |
| `--base-iri <iri>` | Base IRI for RDF triple counting (default: `https://example.org/`) |
| `--namespace <iri>` | `graph.namespace` to inject into frontmatter |
| `--domain <iri>` | `domain` to inject into frontmatter |
| `--version <v>` | Override version (default: `1.0.0`) |
| `--source-iri <iri>` | Override source document IRI in `process.inputs` |
| `--encoding <enc>` | |
| `--dry-run` | Print block classification plan without producing output |
| `-v, --verbose` | Emit per-block classification details |
| `-q, --quiet` | |

**Examples:**
```bash
databook ingest article.md -o article.databook.md
databook ingest gov-policy.md \
  --namespace https://vocab.example.org/gov# \
  --base-iri https://vocab.example.org/ \
  -o gov-policy.databook.md
databook ingest article.md --dry-run
cat article.md | databook ingest - -o article.databook.md
```

---

## Triplestore Commands

Commands that communicate with a SPARQL 1.1/1.2 triplestore — loading data, running queries, and validating graphs. All use Jena Fuseki 6.0 as the reference triplestore. Endpoint targeting is consistent across all commands: use `-d <dataset>` for local Fuseki, `-s <server>` for a named entry in `processors.toml`, or `-e <url>` for an explicit SPARQL endpoint URL.

---

### `push`

```
databook push <file> [options]
```

Transfer RDF blocks from a DataBook to a SPARQL triplestore via the SPARQL Graph Store Protocol (GSP). Each block is loaded into its declared named graph (`graph.named_graph` in frontmatter, or `databook:graph` comment, or overridden by `--graph`). SPARQL Update blocks (`sparql-update` label) are submitted as SPARQL Update operations. Applies CRLF normalisation before loading. By default, also pushes a `#meta` graph containing the frontmatter as RDF.

**Source module:** `commands/push.js`

**Options:**

| Flag | Description |
|---|---|
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `--gsp-endpoint <url>` | Explicit GSP (data) endpoint URL if different from query endpoint |
| `-b, --block-id <id>` | Push only this block (repeatable; default: all RDF blocks) |
| `-g, --graph <iri>` | Override named graph IRI (single-block pushes only) |
| `--meta` / `--no-meta` | Push / suppress frontmatter as `#meta` graph (default: on) |
| `--merge` | Use GSP POST (merge into graph) instead of PUT (replace graph) |
| `-a, --auth <credential>` | |
| `--dry-run` | Print requests without sending |
| `-v, --verbose` | Log per-block status |

**Examples:**
```bash
databook push ontology.databook.md -d myds
databook push ontology.databook.md -e http://localhost:3030/ds/sparql --dry-run
databook push ontology.databook.md -b primary-block -g https://example.org/my-graph
databook push ontology.databook.md -d myds --no-meta
DATABOOK_FUSEKI_AUTH="Basic dXNlcjpwYXNz" \
  databook push file.databook.md -e http://host/ds/sparql
```

---

### `pull`

```
databook pull [file] [options]
```

Retrieve RDF from a SPARQL triplestore into a DataBook. Four retrieval modes: named-graph fetch (GSP GET), embedded SPARQL block execution (`--id`), external query file (`--query`), and full DataBook recovery by IRI (`--databook-id`). With `--wrap` (default on), wraps the result in a new provenance-stamped DataBook; with `--no-wrap`, emits raw content.

**Source module:** `commands/pull.js`

**Options:**

| Flag | Description |
|---|---|
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `-g, --graph <iri>` | Named graph IRI to fetch (repeatable) |
| `-i, --id <id>` | `databook:id` of an embedded SPARQL block in `[file]` to execute |
| `-Q, --query <file>` | Path to external `.sparql` / `.rq` query file |
| `--replace-block <id>` | Block in `[file]` to replace with pull results (requires `--output`) |
| `--databook-id <iri>` | Recover all blocks for this DataBook IRI — no source file required |
| `--infer` | Use inference-enabled endpoint |
| `-f, --format <fmt>` | Output format: `turtle`, `trig`, `json`, `csv`, `tsv` |
| `--stats` | Recompute `graph.triple_count` and `graph.subjects` after pull |
| `--wrap` / `--no-wrap` | Wrap result in a new DataBook / emit raw content (default: `--wrap`) |
| `-o, --output <file>` | |
| `-a, --auth <credential>` | |
| `--encoding <enc>` | |
| `--dry-run` | |
| `-v, --verbose` | Log endpoint, query, status, result size |

> **Migration note:** `--fragment` is now `--id` / `-i`; `--out` is now `--output` / `-o`; `--block-id` is now `--replace-block`.

**Examples:**
```bash
# Named graph fetch
databook pull sensors.databook.md -d myds \
  --graph https://example.org/sensors

# Execute embedded SPARQL block
databook pull sensors.databook.md -e http://host/sparql \
  -i sensor-construct --replace-block sensor-graph --stats -o sensors.databook.md

# External query file
databook pull onto.databook.md -e http://host/sparql \
  -Q queries/extract.sparql -o result.ttl

# Full DataBook recovery
databook pull --databook-id urn:databook:sensors-v1.0.0 \
  -e http://localhost:3030/ds/sparql -o recovered.databook.md
```

---

### `sparql`

```
databook sparql [source] [options]
```

Execute a SPARQL SELECT, CONSTRUCT, or ASK query against a triplestore. Query source is one of: `source#id` (fragment syntax), `-i`/`--id` (embedded block), or `-Q`/`--query` (external file). With `--wrap` (default on), wraps results in a provenance-stamped output DataBook.

**Source module:** `commands/sparql.js`

**Options:**

| Flag | Description |
|---|---|
| `-i, --id <id>` | Embedded `sparql` block ID in source DataBook (or use `source#id`) |
| `-Q, --query <file>` | External `.sparql` / `.rq` query file |
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `-g, --graph <iri>` | Restrict query to named graph (repeatable) |
| `--wrap` / `--no-wrap` | Wrap results in DataBook / emit raw (default: `--wrap`) |
| `-f, --format <fmt>` | `json`, `turtle`, `trig`, `csv`, `tsv`, `markdown` |
| `-o, --output <file>` | |
| `-a, --auth <credential>` | |
| `--dry-run` | Print query without sending |
| `-v, --verbose` | Log request details |
| `-q, --quiet` | |
| `--encoding <enc>` | |

**Examples:**
```bash
databook sparql queries.databook.md#select-sensors -d myds
databook sparql queries.databook.md -i select-sensors \
  -e http://localhost:3030/ds/sparql
databook sparql -Q queries/all.sparql -d myds -f json
databook sparql queries.databook.md#construct-graph -d myds \
  --no-wrap -o result.ttl
```

---

### `sparql-update`

```
databook sparql-update [source] [options]
```

Execute a SPARQL INSERT DATA, DELETE WHERE, DROP, or other update operation against a triplestore. Update source is one of: `source#id` (fragment syntax), `-i`/`--id` (embedded `sparql-update` block), or `-Q`/`--query` (external `.sparql` / `.ru` file).

**Source module:** `commands/sparql-update.js`

**Options:**

| Flag | Description |
|---|---|
| `-i, --id <id>` | Embedded `sparql-update` block ID in source DataBook |
| `-Q, --query <file>` | External `.sparql` / `.ru` update file |
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `-a, --auth <credential>` | |
| `--dry-run` | Print update without sending |
| `-v, --verbose` | Log request details |
| `-q, --quiet` | Suppress success summary line |

**Examples:**
```bash
databook sparql-update updates.databook.md#insert-labels -d myds
databook sparql-update -Q updates/correct-dates.ru -d myds
databook sparql-update updates.databook.md#delete-orphans -d myds --dry-run
```

---

### `validate`

```
databook validate <source> [options]
```

Run SHACL validation against RDF blocks in a DataBook. Resolves a SHACL shapes graph from a file, a DataBook block reference (`shapes.databook.md#shapes-block`), or a plain `.ttl` file. Produces a SHACL validation report as a DataBook (default) or raw Turtle/JSON-LD. The `--fail-on-violation` flag enables non-zero exit code for pipeline integration.

**Source module:** `commands/validate.js`

**Engine resolution (`--processor auto` order):**
1. `JENA_HOME/bin/shacl` or `shacl` on PATH
2. `pyshacl` on PATH

**Options:**

| Flag | Description |
|---|---|
| `-b, --block-id <id>` | Validate only this block (default: all RDF blocks) |
| `--shapes <ref>` | SHACL shapes: `file#block-id` or plain `.ttl` file (required) |
| `-s, --server <n>` | |
| `-e, --endpoint <url>` | Remote SHACL validation endpoint (not yet implemented — falls back to local engine) |
| `--wrap` / `--no-wrap` | Wrap report in a DataBook / emit raw (default: `--wrap`) |
| `-f, --format <fmt>` | Report format: `turtle` (default), `json-ld` |
| `--fail-on-violation` | Exit code 1 if report contains `sh:Violation` |
| `-o, --output <file>` | |
| `-a, --auth <credential>` | (For future remote endpoint use) |
| `--dry-run` | Print plan without validating |
| `-v, --verbose` | Log engine resolution and block details |
| `-q, --quiet` | Suppress CONFORMS/VIOLATION summary line |
| `--encoding <enc>` | |

**Examples:**
```bash
databook validate data.databook.md \
  --shapes shapes.databook.md#person-shapes
databook validate data.databook.md \
  --block-id primary-graph --shapes shapes.ttl
databook validate data.databook.md \
  --shapes shapes.ttl --fail-on-violation --no-wrap
databook validate data.databook.md \
  --shapes shapes.databook.md#org-shapes -o report.databook.md
```

---

### `describe`

```
databook describe [file] [options]
```

Retrieve a Concise Bounded Description (CBD) of one or more named resources from a SPARQL triplestore using SPARQL DESCRIBE. Results are wrapped in a provenance-stamped DataBook by default. Phase 2 SHACL-guided CONSTRUCT retrieval is planned; `--shapes` currently falls back to standard DESCRIBE.

**Source module:** `commands/describe.js`

**Options:**

| Flag | Description |
|---|---|
| `--iri <iri>` | IRI to describe (required; repeatable) |
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `-g, --graph <iri>` | Restrict DESCRIBE to a named graph |
| `--shapes <ref>` | SHACL shapes for guided CONSTRUCT — Phase 2, not yet implemented |
| `--symmetric` | Documents intent: symmetric CBD (Jena default behaviour) |
| `--wrap` / `--no-wrap` | Wrap result in DataBook / emit raw Turtle/TriG (default: `--wrap`) |
| `-f, --format <fmt>` | `turtle` (default), `trig`, `json-ld` |
| `-o, --output <file>` | |
| `-a, --auth <credential>` | |
| `--dry-run` | Print query without sending |
| `-v, --verbose` | |
| `-q, --quiet` | |
| `--encoding <enc>` | |

**Examples:**
```bash
databook describe -d myds --iri https://example.org/ns#Observatory
databook describe -d myds \
  --iri https://example.org/ns#Observatory \
  --iri https://example.org/ns#Station
databook describe -d myds \
  --iri https://example.org/ns#Observatory \
  --graph https://example.org/graphs/geodetic
databook describe -d myds \
  --iri https://example.org/ns#Observatory --no-wrap
databook describe data.databook.md -d myds \
  --iri https://example.org/ns#Observatory -o desc.databook.md
```

---

### `clear`

```
databook clear [file] [options]
```

Remove named graphs from a triplestore. When `[file]` is supplied, derives the named graph IRIs from the DataBook's blocks (same logic as `push`). Without a file, `--graph` targets a specific named graph directly. `--all` issues a SPARQL `DROP ALL` for the dataset — prompts for confirmation unless `--force` is also set.

**Source module:** `commands/clear.js` *(registered in bin; not in commands folder listing)*

**Options:**

| Flag | Description |
|---|---|
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `--gsp-endpoint <url>` | Explicit GSP (data) endpoint URL |
| `-g, --graph <iri>` | Explicit named graph IRI to delete (no DataBook required) |
| `-b, --block-id <id>` | Clear only this block's named graph |
| `--meta` / `--no-meta` | Also clear / suppress `#meta` graph deletion (default: on when file given) |
| `--all` | DROP ALL graphs in the dataset — **destructive**; prompts for confirmation |
| `--force` | Skip confirmation when used with `--all` |
| `-a, --auth <credential>` | |
| `--dry-run` | Print DELETE requests without sending |
| `-v, --verbose` | Log per-graph status |

**Examples:**
```bash
databook clear test/observatory.databook.md -d myds
databook clear -d myds \
  --graph https://w3id.org/databook/test/observatory-v1#primary-graph
databook clear test/observatory.databook.md -d myds --all --force
databook clear test/observatory.databook.md -d myds --dry-run --verbose
```

---

### `list`

```
databook list [options]
```

List DataBooks that have been pushed to the triplestore by querying `#meta` graphs. Shows ID, title, version, push timestamp, and triple count. The `-f sparql` flag prints the catalogue query itself for inspection or custom use.

> **Important:** `databook list` queries the **triplestore** for DataBooks pushed via `databook push --meta`. It does NOT inspect a local `.databook.md` file. To list the blocks defined in a local file, use `databook extract <file> --list`.

The IRI shown in the ID column can be passed directly to `databook pull --databook-id` for full document recovery.

**Source module:** `commands/list.js`

**Options:**

| Flag | Description |
|---|---|
| `-s, --server <n>` | |
| `-d, --dataset <n>` | |
| `-e, --endpoint <url>` | |
| `-f, --format <fmt>` | `table` (default), `json`, `sparql` |
| `-a, --auth <credential>` | |
| `-v, --verbose` | Show full IRI when truncated in table view |
| `-q, --quiet` | Suppress count summary line |

**Output formats:**

| Format | Description |
|---|---|
| `table` | Aligned columns: ID (truncated), Title, Version, Pushed, Triples |
| `json` | Machine-readable array with full IRIs — suitable for scripting |
| `sparql` | Print the catalogue query and exit — for custom use or debugging |

**Examples:**
```bash
databook list -d ds
databook list -e http://localhost:3030/ds/sparql
databook list -e http://localhost:3030/ds/sparql --format json
databook list -d ds --format json | jq '.[0].id'
databook list --format sparql
```

---

## Pipeline Commands

Commands that orchestrate multi-step transformations, compile shapes to queries, retrieve DataBooks from HTTP registries, and integrate with LLMs.

---

### `process`

```
databook process [source] [options]
```

Execute a `processor-registry` DataBook as a DAG pipeline. The pipeline is declared in a separate process DataBook (`-P`); the source DataBook provides the input data. Stages are executed in topological order derived from `build:dependsOn` relationships. Output is a new provenance-stamped DataBook.

For single-operation SPARQL or SHACL, use the dedicated commands (`sparql`, `validate`) rather than `process`.

**Source module:** `commands/process.js`

**Options:**

| Flag | Description |
|---|---|
| `-P, --process <file>` | Process DataBook declaring the pipeline (required) |
| `--pipeline <id>` | `build:Target` IRI or fragment ID to execute |
| `--params <source>` | Parameter source: inline JSON string, `.json`/`.yaml` file, or fragment ref |
| `--interpolate` | Enable `{{variable}}` template interpolation in payloads |
| `--source-block <id>` | Use only this block as input |
| `-C, --config <file>` | Config YAML for output DataBook frontmatter |
| `--set <k=v>` | Frontmatter NVP override (repeatable) |
| `-o, --output <file>` | Output DataBook path (default: `{source-stem}-output.databook.md`) |
| `--force` | Overwrite output if it exists |
| `--encoding <enc>` | |
| `--to <format>` | Convert all output blocks to another format |
| `--dry-run` | Print execution plan without processing |
| `-v, --verbose` | Emit per-stage execution details |
| `-q, --quiet` | |

**Examples:**
```bash
databook process source.databook.md \
  -P pipeline.databook.md -o output.databook.md
databook process source.databook.md \
  -P pipeline.databook.md --dry-run
databook process source.databook.md \
  -P pipeline.databook.md --params '{"type":"ex:Person"}'
```

---

### `transform`

```
databook transform [source] [options]
```

Apply an XSLT 3.0 stylesheet to XML content from a DataBook or plain XML file. Both the source XML and the XSLT stylesheet can be specified as DataBook block references (with `--block-id` and `--xslt-block-id` respectively) or as plain files.

**Source module:** `commands/transform.js`

**Processor resolution (`--processor auto` order):**
1. `SAXON_JAR` env var → `java [JVM_ARGS] -jar $SAXON_JAR`
2. `saxon` on PATH
3. `xsltproc` on PATH

**Options:**

| Flag | Description |
|---|---|
| `--xslt <file>` | XSLT DataBook or plain `.xslt`/`.xsl` stylesheet file (required) |
| `-b, --block-id <id>` | Block ID to extract from source DataBook |
| `--xslt-block-id <id>` | Block ID to extract from XSLT DataBook |
| `--param <name=value>` | XSLT parameter (repeatable) |
| `--to <format>` | Output method: `html` \| `xml` \| `text` (default: auto) |
| `--processor <mode>` | `auto` \| `saxon` \| `xsltproc` (default: `auto`) |
| `--encoding <enc>` | |
| `-o, --output <file>` | |

**Examples:**
```bash
databook transform source.databook.md --xslt stylesheet.xslt -o output.html
databook transform source.databook.md \
  --block-id xml-block --xslt transforms.databook.md \
  --xslt-block-id html-transform -o result.html
databook transform source.databook.md \
  --xslt stylesheet.xslt --param env=production --to html
```

---

### `prompt`

```
databook prompt [source] [options]
```

Send a DataBook (or a specific block within it) as context to an Anthropic LLM and write the response to a new provenance-stamped output DataBook. Three prompt-source modes: inline text (`--prompt`), file (`--prompt-file`), or a named `prompt` fenced block in the source DataBook (`--prompt-block`). Supports `{{variable}}` interpolation in prompt blocks via `--interpolate` + `--param`.

The `--patch` and `--patch-block` flags write the LLM response directly into the source DataBook's frontmatter or a named block rather than producing a separate output file.

**Source module:** `commands/prompt.js`  
**Requires:** `ANTHROPIC_API_KEY` environment variable.

**Options:**

| Flag | Description |
|---|---|
| `-p, --prompt <text>` | Inline prompt text |
| `--prompt-file <file>` | Read prompt from a plain text file |
| `--prompt-block <id>` | Use a `prompt` fenced block from the source DataBook as the prompt |
| `-b, --block-id <id>` | Send only this block as context (default: full DataBook) |
| `--param <name=value>` | `{{variable}}` interpolation value (repeatable) |
| `--interpolate` | Enable `{{variable}}` substitution in prompt block content |
| `--patch <field>` | Write response to a frontmatter field (e.g. `frontmatter.description`) |
| `--patch-block <id>` | Replace or create a named block with the response |
| `--patch-mode <mode>` | Patch strategy: `replace` (default) \| `merge` (for list fields) |
| `--model <model>` | Anthropic model ID (default: `claude-sonnet-4-6`) |
| `--max-tokens <n>` | Maximum response tokens (default: `4096`) |
| `--system <text>` | Override system prompt |
| `--encoding <enc>` | |
| `-o, --output <file>` | Write output DataBook to file (default: stdout) |
| `--dry-run` | Print resolved context and prompt without calling the API |
| `-v, --verbose` | Log request details to stderr |
| `-q, --quiet` | Suppress spinner and completion summary |

**Patch modes:**

| Mode | Use case |
|---|---|
| `--patch frontmatter.FIELD` | Write response to a frontmatter scalar or list field |
| `--patch-block BLOCK-ID` | Replace or create a named fenced block |
| `--patch-mode merge` | For list fields: append to existing values rather than replacing |

**Examples:**
```bash
# Standard output DataBook
databook prompt onto.databook.md \
  --prompt "Summarise the class hierarchy" \
  -o summary.databook.md

# Prompt block with interpolation
databook prompt data.databook.md \
  --prompt-block analysis-prompt \
  --interpolate --param domain=Infrastructure \
  -o analysis.databook.md

# Patch frontmatter in-place
databook prompt onto.databook.md \
  --prompt "Write a concise 2-sentence description" \
  --patch frontmatter.description

# Patch a named block
databook prompt data.databook.md \
  --prompt "Suggest SHACL shapes" \
  --patch-block suggested-shapes

# Merge into a list field
databook prompt onto.databook.md \
  --prompt "Suggest 3 additional subject tags" \
  --patch frontmatter.subject --patch-mode merge

# Bare prompt — no source DataBook
databook prompt \
  --prompt "Generate a SKOS scheme for ISO 3166 country codes" \
  -o country-codes.databook.md
```

---

### `fetch`

```
databook fetch <source> [options]
```

Retrieve a DataBook (or a specific block) from an HTTP URL or a registry alias (prefixed with `@`). Registry aliases are resolved from `processors.toml`. Supports optional local caching; use `--no-cache` to force fresh retrieval. `--wrap` packages a fetched single block in a new provenance-stamped DataBook.

**Source module:** `commands/fetch.js`

**Options:**

| Flag | Description |
|---|---|
| `-b, --block-id <id>` | Extract only this block (overrides `#fragment` in source IRI) |
| `-f, --format <type>` | Output format when extracting a single block |
| `--wrap` / `--no-wrap` | Wrap fetched block in a new DataBook / emit raw |
| `--verify-id` | Fail (not just warn) if returned document `id` does not match requested IRI |
| `-s, --server <n>` | Named server from `processors.toml` for auth context |
| `-a, --auth <credential>` | Bearer token or `user:pass` for HTTP auth |
| `--timeout <ms>` | Request timeout in milliseconds (default: `30000`) |
| `--no-cache` | Bypass local DataBook cache and force fresh retrieval |
| `-o, --out <file>` | Output path (default: inferred from document IRI slug; `"-"` for stdout) |
| `--encoding <enc>` | |
| `-v, --verbose` | Log fetch details to stderr |

**Examples:**
```bash
databook fetch https://w3id.org/databook/specs/cli-conventions \
  -o conventions.databook.md
databook fetch https://example.org/databooks/shapes-v1#person-shape \
  --format turtle
databook fetch @my-shapes -o shapes.databook.md
databook fetch @cli-conventions --no-cache -o conventions.databook.md
```

---

### `shacl2sparql`

```
databook shacl2sparql <source> [options]
```

Compile SHACL NodeShapes to SPARQL retrieval queries. For each shape, generates a SELECT query that retrieves all focus nodes satisfying the shape, and/or a CONSTRUCT query that returns all matching triples. Compiled queries can be printed to stdout, written to a file, or inserted directly back into the source DataBook as named `sparql` blocks.

Supports SHACL 1.2 Core including Node Expressions: `sh:values`, `sh:this`, `sh:path`, `sh:filterShape`, `sh:intersection`, `sh:union`, `sh:distinct`, `sh:limit`, `sh:offset`.

> **Note:** `sh:maxCount` uses a subquery + HAVING. `sh:xone` emits a comment.

**Source module:** `commands/shacl2sparql.js`

**Options:**

| Flag | Description |
|---|---|
| `-b, --block-id <id>` | SHACL block to compile (default: first `shacl`/`turtle` block) |
| `--data-block <id>` | Turtle data block whose graph IRI to inject as a FROM clause |
| `--from-graph <iri>` | Explicit FROM graph IRI (repeatable) |
| `--shape <iri>` | Compile only this named shape IRI (default: all shapes) |
| `--type <type>` | Query type: `select` (default) \| `construct` \| `both` |
| `--insert` | Insert generated SPARQL block(s) into source DataBook in-place |
| `--prefix <id>` | Block ID prefix for generated blocks (default: `select-` / `construct-`) |
| `-o, --output <file>` | Output file (default: stdout; or in-place DataBook with `--insert`) |
| `--encoding <enc>` | |
| `--dry-run` | Print generated queries without writing |
| `-v, --verbose` | Log shape extraction and block insertion details |
| `-q, --quiet` | |

**Examples:**
```bash
# Print SELECT queries for all shapes
databook shacl2sparql shapes.databook.md

# CONSTRUCT queries for a specific SHACL block
databook shacl2sparql shapes.databook.md \
  -b person-shapes --type construct

# Insert generated queries back into the DataBook
databook shacl2sparql shapes.databook.md --insert

# Generate queries with a FROM clause from a data block
databook shacl2sparql shapes.databook.md \
  --data-block primary-graph --insert

# Compile only one named shape
databook shacl2sparql shapes.databook.md \
  --insert --shape https://example.org/PersonShape

# Compile a plain .ttl file, output both query types
databook shacl2sparql shapes.ttl --type both -o queries.sparql
```

---

<!-- databook:id: command-registry -->
```turtle
@prefix dcli: <https://w3id.org/databook/cli/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dct:  <http://purl.org/dc/terms/> .

dcli:create   a dcli:Command ; dct:identifier "create" ;
  rdfs:label "create"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Wrap data files into a DataBook document"@en .
dcli:head     a dcli:Command ; dct:identifier "head" ;
  rdfs:label "head"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Read or patch DataBook frontmatter"@en .
dcli:insert   a dcli:Command ; dct:identifier "insert" ;
  rdfs:label "insert"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Insert a block or edit prose in an existing DataBook"@en .
dcli:drop     a dcli:Command ; dct:identifier "drop" ;
  rdfs:label "drop"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Remove named blocks from a DataBook"@en .
dcli:extract  a dcli:Command ; dct:identifier "extract" ;
  rdfs:label "extract"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Emit raw block content to stdout or a file"@en .
dcli:convert  a dcli:Command ; dct:identifier "convert" ;
  rdfs:label "convert"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Convert a DataBook block to another format"@en .
dcli:ingest   a dcli:Command ; dct:identifier "ingest" ;
  rdfs:label "ingest"@en ; dcli:group dcli:DocumentStructure ;
  dct:description "Convert a plain Markdown document to a DataBook"@en .
dcli:push     a dcli:Command ; dct:identifier "push" ;
  rdfs:label "push"@en ; dcli:group dcli:Triplestore ;
  dct:description "Transfer RDF blocks from a DataBook to a triplestore via GSP"@en .
dcli:pull     a dcli:Command ; dct:identifier "pull" ;
  rdfs:label "pull"@en ; dcli:group dcli:Triplestore ;
  dct:description "Retrieve RDF from a triplestore into a DataBook"@en .
dcli:sparql   a dcli:Command ; dct:identifier "sparql" ;
  rdfs:label "sparql"@en ; dcli:group dcli:Triplestore ;
  dct:description "Execute a SPARQL SELECT, CONSTRUCT, or ASK query"@en .
dcli:sparqlUpdate a dcli:Command ; dct:identifier "sparql-update" ;
  rdfs:label "sparql-update"@en ; dcli:group dcli:Triplestore ;
  dct:description "Execute a SPARQL INSERT, DELETE, or DROP update"@en .
dcli:validate a dcli:Command ; dct:identifier "validate" ;
  rdfs:label "validate"@en ; dcli:group dcli:Triplestore ;
  dct:description "Run SHACL validation against RDF blocks"@en .
dcli:describe a dcli:Command ; dct:identifier "describe" ;
  rdfs:label "describe"@en ; dcli:group dcli:Triplestore ;
  dct:description "Retrieve SPARQL DESCRIBE descriptions for named resources"@en .
dcli:clear    a dcli:Command ; dct:identifier "clear" ;
  rdfs:label "clear"@en ; dcli:group dcli:Triplestore ;
  dct:description "Remove named graphs from a triplestore"@en .
dcli:list     a dcli:Command ; dct:identifier "list" ;
  rdfs:label "list"@en ; dcli:group dcli:Triplestore ;
  dct:description "List DataBooks pushed to the triplestore"@en .
dcli:process  a dcli:Command ; dct:identifier "process" ;
  rdfs:label "process"@en ; dcli:group dcli:Pipeline ;
  dct:description "Execute a processor-registry DataBook as a DAG pipeline"@en .
dcli:transform a dcli:Command ; dct:identifier "transform" ;
  rdfs:label "transform"@en ; dcli:group dcli:Pipeline ;
  dct:description "Apply an XSLT stylesheet to XML content"@en .
dcli:prompt   a dcli:Command ; dct:identifier "prompt" ;
  rdfs:label "prompt"@en ; dcli:group dcli:Pipeline ;
  dct:description "Send a DataBook to an LLM and write the response to an output DataBook"@en .
dcli:fetch    a dcli:Command ; dct:identifier "fetch" ;
  rdfs:label "fetch"@en ; dcli:group dcli:Pipeline ;
  dct:description "Retrieve a DataBook or block from an HTTP URL or registry alias"@en .
dcli:shacl2sparql a dcli:Command ; dct:identifier "shacl2sparql" ;
  rdfs:label "shacl2sparql"@en ; dcli:group dcli:Pipeline ;
  dct:description "Compile SHACL shapes to SPARQL SELECT/CONSTRUCT queries"@en .
```

---

*Copyright 2026 Kurt Cagle / Semantical LLC. Specification prose: W3C Document License.*
