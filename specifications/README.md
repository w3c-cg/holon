# Holon Graph Architecture — Specifications

This directory holds specification work for the Holon Graph Architecture,
organised by the four working groups established at the 2026-07-03 HCG
meeting: **Core Architecture**, **DataBook**, **Network Architecture**, and
**Identity**.

> **Note:** This layout reflects the working-group structure as of the
> 2026-07-03 HCG meeting. Working-group boundaries are not final until
> ratified — officer/position voting and further WG scoping are on the
> agenda for the next meeting (2026-07-17). Folder names here may change
> if WG boundaries shift.

## Working Groups

| Folder | Working Group | Scope |
|---|---|---|
| [`core/`](core/) | Core Architecture | Holon vocabulary, root holon, structural/cross-cutting relations, boundary and portal semantics |
| [`databook/`](databook/) | DataBook | The DataBook document format and its role as the HGA artefact layer |
| [`network/`](network/) | Network Architecture | Federation, holon registries, bridge-to-bridge protocols |
| [`identity/`](identity/) | Identity | Verifiable credentials, access control, profiles, identity management (formerly Personalisation) |

## Folder Conventions

Each working group's folder follows the same shape:

```
{wg}/
  README.md       — scope statement for this working group
  working/         — unprocessed proposals, not yet WG-adopted
    README.md      — index of what's currently under discussion
```

**`working/` is a staging area, not a publication target.** A document in
`working/` is a proposal — it has not been reviewed or adopted by the
working group. Documents move out of `working/` (up one level, into the
WG folder directly) once the working group has actually discussed and
adopted them; links into `working/` should be expected to break over
time as documents graduate or are superseded. Nothing in `working/`
should be treated as normative.

**Naming convention for `working/` proposals:**

```
working/{yyyy-mm-dd}-{proposer}-{slug}.databook.md
```

- `yyyy-mm-dd` — the date the proposal was first drafted, not last edited
- `proposer` — surname of whoever is bringing the proposal to the WG
- `slug` — short, kebab-case description of the proposal's subject

Example: `working/2026-07-03-cagle-holon-relations.databook.md`

This keeps `working/` navigable by date and author without requiring any
tooling — a plain `ls` or GitHub file listing sorts and scans cleanly.

## Status

None of the content under `specifications/` is canonical with respect to
this Community Group. See the [repository README](../README.md) for the
group's broader position on canonicity pending public consensus.
