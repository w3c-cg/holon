# W3C Holon Community Group — Inaugural Meeting Minutes (Candidate Draft)

**Date:** Friday, 19 June 2026
**Time:** 7:00–9:00 AM Pacific
**Chair:** Kurt Cagle (Acting, confirmed as Chair during this meeting — see Resolutions)
**Attendance:** ~30 participants (full roster not captured in source materials; named participants below are those identifiable from the transcript)

> **Note on this draft:** Produced from the meeting's automated summary and transcript. Speaker attribution in the source transcript labels most of the opening presentation (00:00–1:09) as "Bo Lora"; content and first-person biographical detail make clear this is Kurt Cagle throughout, and the label corrects to "Kurt Cagle" partway through the transcript. Attributed accordingly below. Nicolas (Nicky) Clarke (KPMG) and Heather Ray have since been identified and attributed; the participant who raised Stafford Beer's Viable Systems Model remains unidentified and is marked "VSM Speaker" pending confirmation at or before the 3 July meeting.

---

## Resolutions

1. **Kurt Cagle confirmed as Chair.** Nominated from the floor by Nicolas (Nicky) Clarke; no objections raised. Kurt had been serving as Acting Chair; this confirms the role on an ongoing basis, "until such time as [Kurt] finally gives up... and someone else gets to handle the day-to-day stuff."
2. **Working group structure endorsed in principle**, pending formal working-group-lead elections at a subsequent meeting (see Action Items). Five groups proposed in the pre-circulated charter; three additional areas were raised from the floor and folded into two further groups during discussion, bringing the total to seven (see §4 below).
3. **No formal votes taken on charter, IP policy, or meeting cadence** — all held open for further mailing-list discussion and confirmation at a subsequent meeting.

---

## Agenda and Discussion

### 1. Welcome and Introductions
Kurt Cagle opened the meeting, noting ~30 attendees present for an early-morning holiday session. Full round-robin introductions were largely deferred in favor of directing participants to post bios and statements of interest to the public-holon mailing list.

### 2. Presentation: "Holons — An Introduction"
Kurt Cagle presented the conceptual foundation for the Holon Graph Architecture (slides and accompanying DataBook posted to `w3c-cg/holon`, `community/working/`). Key points:

- **Origin of the term:** Arthur Koestler, *The Ghost in the Machine* (1967) — "holon" from Greek *holos* (whole) + *-on* (part), describing entities that are simultaneously autonomous wholes and parts of larger systems (the "Janus-faced" property).
- **Tensegrity:** drawing on Buckminster Fuller and, by analogy, Feynman — holonic systems are held together by balanced opposing tensions between autonomy and integration, not rigid structure.
- **Holarchies:** nested hierarchies (atoms→molecules→cells→organisms→ecosystems; also organizational: teams→departments→companies) with no fixed top or bottom — each level more specialized going down, more general going up. Emergence: each level exhibits properties absent at the level below (molecular properties from atoms, thought from neurons, culture from communities).
- **Motivation from generative AI:** LLMs characterized as powerful but unbounded pattern-generation ("daydreaming") systems, prone to hallucination and high compute cost when scope is too broad. Holonic scoping proposed as the bounding mechanism — smaller, focused, explicitly structured contexts reduce both hallucination and cost.
- **Limits of flat knowledge graphs:** necessary but insufficient — poor representation of temporality and relationship metadata. "Context graphs" proposed as the term for graphs that capture time, spatial awareness, and richer relationship annotation.
- **Relevant standards:** RDF 1.2 (in progress toward full approval), SHACL (Shape Constraint Language) as both validation standard and boundary-enforcement mechanism, MCP as a wrapping/integration architecture for services.
- **Standards vs. implementations:** explicit framing that the group's goal is shared conventions, naming, and interoperability patterns — not a single reference product. "We're discovering object-oriented programming all over again... it's not a moment for a single implementation."
- **Named graphs as holon containers:** a holon proposed as representable via a named graph — identifier plus contained triples, defining a boundary with rules for crossing it. Named graphs are temporal (can record event histories) and referenceable.
- **Agents vs. entities:** an agent = a tracked node whose state changes over time, forming a trajectory within a holon. An entity may or may not be tracked as an agent; all agents are entities, not all entities are agents. Explicitly distinguished from "AI agent" in the current industry sense (wrapped API orchestrators).
- **Cross-context reference:** the same entity can be declared at one holon scope and referenced from multiple containing or lateral contexts (e.g., an employee viewed differently from HR vs. R&D holons).
- **Four partitions of a holon:** Scene Graph (initial agents/components/starting conditions), Event Graph/Log (state changes over time — utterances, movements, mutations, invalidation), Boundary (SHACL-enforced constraints on permissible actions/transitions — portals as passable constraints, e.g. requiring a key), Projection Layer (observer-specific external views; not part of the holon's internal state, composable, generated via SPARQL/transformation).
- **Open vs. closed holons:** open holons continue accepting events; closed holons are historical records (example given: a meeting transcript as a closed holon).
- **Evolution mechanisms:** Bayesian priors from history, active inference (minimizing "surprise" — degree of deviation from expected state), deterministic rule-based state transitions, and external-actor-directed evolution (actor = driver, agent = driven). Noted that multi-agent systems are more volatile than single-agent systems as each agent minimizes its own surprise, sometimes at others' expense.
- **DataBooks:** Markdown-based substrate with metadata headers capturing provenance and purpose; a mechanism for representing holons (not all DataBooks are holons) and for messaging.
- **Grounding LLMs with holons:** central claim that a major cause of hallucination is insufficient scoping; holons + DataBooks function as a "rulebook" passed to an LLM. Referenced a prior simulation ("Straits of Influence," Feb 2026) and cited comparative cost analysis showing up to ~98% reduction in token/compute cost when using holons as transformers against a persistent store rather than raw knowledge-graph queries. A "holon bridge" concept (connecting holons to persistent triple stores or other databases) was introduced as still in development.
- **Applications cited:** media/gaming, decision support, supply chain, medical monitoring, drone/robotic traffic, journalism, education, marketing, financial monitoring, distributed private data.

### 3. Goals and W3C Process
Stated goals: refine the models, establish shared messaging/core-architecture conventions, identify candidate implementations and points of commonality, and lay groundwork for a federated data web built on top of the existing Web. Explicit statement that the Community Group operates independent of formal W3C endorsement at this stage, with the aspiration that sufficiently mature work could later be submitted through W3C process. IP rights alignment with W3C norms flagged as an open item for a subsequent meeting.

### 4. Working Groups
Five groups proposed in the charter:
- I. Core Architecture
- II. DataBook Standard
- III. Network Architecture
- IV. Validation / Verification / Security
- V. Industry Utilization

Floor discussion raised two additional areas:
- **Ontology alignment** with BFO and UFO (raised from the floor), which Kurt proposed folding into a broader **Hierarchical / Meta-Ontology group**, incorporating Derek Cabrera's DSRP (Cornell) as an additional meta-ontological framework alongside BFO/UFO.
- **VSM Speaker** *(identity to be confirmed — see note at top of this document)* proposed the same group's remit extend to outreach and alignment with other **systems-practice communities** (VSM practice groups, IEEE initiatives, university consortia) rather than ontology-only alignment — accepted by Kurt as a good addition to the group's scope.
- **Nicolas (Nicky) Clarke**, affiliated with KPMG, volunteered to serve as a **governance bridge**, offering existing implementation work and standards/practice experience to support alignment and adoption. (Same participant who nominated Kurt as Chair — see Resolutions §1.)

- **A "Formal Foundations" group** was proposed by Kurt as a further addition — mathematical underpinnings and foundational material for the architecture, explicitly including category theory and active inference / the free energy principle (Karl Friston and related work), raised and affirmed from the floor.
- **A "Personalisation/Internationalisation" group** — regionalization and localization were raised from the floor as a principle that should be reflected explicitly in the charter (see §6 below), and Kurt agreed this warranted its own working group rather than remaining a charter principle alone, given the stated goal of a genuinely global (not Euro-/US-centric) effort.

No formal vote was taken on the working group list; participants were directed to post interest statements and bios to the mailing list ahead of chair elections at a subsequent meeting. Seven groups were on the table by the end of discussion: Core Architecture, DataBook Standard, Network Architecture, Validation/Verification/Security, Industry Utilization, Hierarchical/Meta-Ontology Alignment, Formal Foundations, and Personalisation/Internationalisation. **Dormancy principle discussed:** groups without a confirmed lead would not proceed without one (this principle was discussed but not formally minuted as a resolution in this meeting — confirm before treating as settled).

### 5. Meeting Cadence
Proposed: twice monthly, alternating Fridays, to balance time zones across Europe, the Americas, and (as membership grows) Asia; an optional third session as needed for broader time-zone coverage. Target meeting length of approximately one hour going forward (this inaugural session was deliberately over-scheduled). No formal vote; general agreement from the floor.

### 6. Charter
Kurt noted the charter had already been circulated to the mailing list and displayed it briefly. Participants asked to review and propose additions/removals via the list; formal charter discussion and adoption deferred to a subsequent meeting. A participant raised **regionalization/localization** as a principle that should be reflected explicitly in the charter, to avoid a Euro-/US-centric result — agreed by Kurt as a good addition, and subsequently formalized as its own working group (Personalisation/Internationalisation — see §4).

### 7. GitHub Access and Implementations
Kurt described a staged approach to repository access: write access limited until working group and committee chairs are formally established, to avoid broad access before governance is in place. A folder structure for implementations, DataBook materials, and HGA reference material is being added. Participants with existing or semi-complete implementations were encouraged to contribute what their organizations' IP constraints allow — explicitly framed as seed contributions ("I want to make a forest"), not a requirement for complete or production systems.

### 8. IP Policy
Flagged as an open item, deferred to a subsequent meeting. Participants asked to check with their own organizations in the interim on constraints around publishing code and specifications.

### 9. Open Floor
- A participant asked whether a Google Form/spreadsheet would help centralize working-group interest and lead nominations; volunteered to prepare and circulate one, with the aim of collecting input early in the following week.
- General expressions of appreciation for the effort behind the inaugural meeting.

### 10. Closing
Kurt Cagle formally inaugurated the Holon Community Group and closed the meeting, noting he would coordinate with Heather, Nicky (Nikki), and other volunteers on follow-up organizational tasks.

---

## Action Items

| # | Action | Owner |
|---|--------|-------|
| 1 | Upload the presentation deck shown during the meeting to the GitHub repository, with reference links | Kurt Cagle |
| 2 | Post interest statements and bios to the mailing list for consideration in working-group chair elections and role assignments | All interested participants |
| 3 | Manage staged GitHub repository access — limit write access until working groups and chairs are established; add folders for implementations and reference materials | Kurt Cagle |
| 4 | Publish the agenda for each session at least 48 hours in advance; collect participant-submitted agenda items ahead of time | Kurt Cagle |
| 5 | Coordinate with Heather, Nicky (Nikki), and other volunteers on community group setup and follow-up organizational tasks | Kurt Cagle |
| 6 | Prepare and circulate a Google Form/spreadsheet to centralize working-group interest and lead nominations | **Heather Ray** — ✅ Completed: HCG participation/sign-up survey launched, plus a shared workspace doc for agenda and admin tasks: https://docs.google.com/document/d/1flTw8fsZVcvVqOBlzDUWKM2ue-D-xPRelUu-Q_Tep0o/edit?usp=sharing |
| 7 | Review the draft charter and propose additions/removals via the mailing list ahead of formal adoption | All participants |
| 8 | Check with home organizations on constraints around publishing code/specs, ahead of IP policy discussion | All participants |

---

## Next Meeting
Confirmed as **Friday, 3 July 2026**, with a further session **Friday, 17 July 2026**, consistent with the proposed twice-monthly cadence (see §5).

---

*Draft prepared from meeting summary and full transcript. Please review for accuracy — particularly the "Bo Lora" attribution issue noted above, unnamed speaker attributions, and the dormancy-rule and next-meeting-date items flagged as needing confirmation — before this is posted as approved minutes.*
