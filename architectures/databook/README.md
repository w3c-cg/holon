# DataBook

**DataBook** is a document format for semantic documents — Markdown files that carry
typed RDF/SPARQL/SHACL payloads alongside human-readable prose and self-describing
YAML frontmatter.

Namespace: `https://w3id.org/databook/ns#`

---

## Reference Implementation

The canonical CLI implementation of DataBook lives at
**[kurtcagle/databook](https://github.com/kurtcagle/databook)**.

This repository (`w3c-cg/holon`) previously vendored two separate, independently
drifting copies of that implementation. Both have been removed in favor of a single
upstream source — see [Migration Note](#migration-note) below.

```bash
git clone https://github.com/kurtcagle/databook.git
cd databook
npm install -g .
# or: node bin/databook.js <command>
```

**Requires Node.js ≥ 18.0.0** (uses native `fetch`).

For installation details, command reference (`head`, `push`, `pull`, `process`,
`validate`, and others), configuration (`processors.toml`), authentication, and
exit codes, see the [kurtcagle/databook README](https://github.com/kurtcagle/databook#readme).

### Version pinning

Spec text or CG artifacts that need to cite implementation behavior as of a specific
point should reference a **tagged release** of `kurtcagle/databook` rather than
`main`, e.g.:

> Reference implementation: [`kurtcagle/databook@v1.5.1`](https://github.com/kurtcagle/databook/releases/tag/v1.5.1)

This keeps the spec's implementation citation stable even as the CLI continues to
evolve.

---

## Databook Reference Guides

* [Databook Handbook](databook-handbook.databook.md) — how to set up the various components of a DataBook.
* [Databook CLI Commands](databook-cli-commands.databook.md) — reference page for DataBook CLI commands.
* [Databook CLI Primer](databook-cli-primer.databook.md) — a primer for using the DataBook CLI.

---

## DataBook Spec References

- [Conventions](https://w3id.org/databook/specs/cli-conventions-v1) — stdin/stdout, fragment addressing, `processors.toml`, exit codes
- [head spec](https://w3id.org/databook/specs/cli-head-v1)
- [push spec](https://w3id.org/databook/specs/cli-push)
- [pull spec](https://w3id.org/databook/specs/cli-pull)
- [process spec](https://w3id.org/databook/specs/cli-process-v1)

---

## Migration Note

As of 2026-07, this directory no longer vendors a runnable copy of the DataBook CLI.
Two copies previously existed here:

- `architectures/databook/{lib,commands}` — an incomplete mirror (`lib/` contained
  only `compact.js`; the rest of what `commands/*.js` imported didn't exist in this
  tree, so it could never actually run).
- `architectures/databook/implementations/js/` — a complete but older, independently
  diverged copy of the same CLI.

Neither reliably reflected the current state of the implementation, and fixes made
to one didn't propagate to the other or to upstream. Both are retired; the single
source of truth is [kurtcagle/databook](https://github.com/kurtcagle/databook).
