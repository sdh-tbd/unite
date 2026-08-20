---
status: proposed
---

# Use a dedicated search service rather than Sanity's native GROQ search

The site is search-first: search is the primary way caregivers, providers, and AAC users find
educational material, device manuals, and IFU documents, across ~15 markets and multiple
languages. Sanity remains the content source of truth, but search will be served by a dedicated
search index synced from Sanity, because GROQ text search cannot fold diacritics, has no
language analyzers, and has no typo tolerance — three gaps that are individually awkward and
collectively disqualifying for this audience and this content.

## Why not Sanity's native search

Sanity's GROQ search is much stronger than its reputation suggests. It has BM25 relevance
scoring via `| score()`, a query syntax with phrases and exclusions, prefix and general
wildcards, `boost()` for business rules, semantic search via dataset embeddings, hybrid
text+semantic ranking, and match highlighting. For a single-language content site it would be a
sound default, and the zero-infrastructure argument is real.

Three specific limitations rule it out here. All are documented by Sanity in
[Search text content with GROQ](https://www.sanity.io/docs/content-lake/search-content-with-groq).

**1. No diacritic folding.** Sanity's docs are explicit: matching "folds case, but not
diacritics". `"configurá" match "configura"` is `false`, and so is the reverse. Users routinely
type without accents, especially on mobile. Across Spanish, French, German, and the Nordic
languages this means silent zero-result failures on ordinary queries. Sanity's documented
workaround is to precompute accent-stripped shadow fields and normalise the query the same way —
which means maintaining a denormalised search index inside the CMS, for every searchable field
in every locale. That is the cost of an external index without the benefits.

**2. No language analyzers, so compounds break.** `match` tokenises and requires whole tokens to
be present. Searching `pizza` does not match `pizzaparty`. Appending `*` to the user's last
token (`pizza*`) handles prefixes and is the normal autocomplete approach, but German and the
Nordic languages compound in the middle: finding `Kommunikationshilfsmittel` from `Hilfsmittel`
requires a leading wildcard (`*hilfsmittel*`), which Sanity's docs specifically warn is slow
because it must scan many terms. Per-language analyzers with stemming and compound
decomposition solve this properly; GROQ has no equivalent.

**3. No typo tolerance.** There is no fuzzy matching in GROQ. For this audience that is an
accessibility problem, not a polish problem — see below.

There is also no query analytics, which for a search-first site is the feedback loop that tells
you where content is missing.

## Latency: search defeats Sanity's CDN

Raw query speed is not the issue. `match` is on Sanity's documented list of
[optimizable filter expressions](https://www.sanity.io/docs/developer-guides/high-performance-groq),
and dataset growth has "no impact" on optimized filtered queries. A single search-results-page
query would perform fine.

Per-keystroke typeahead is a different workload, and three documented properties compound
against it (see [API CDN](https://www.sanity.io/docs/content-lake/api-cdn)):

1. **Cache keys are full request URLs including query parameters.** Search terms are long-tail
   and near-unique; in typeahead every keystroke is a distinct cache key. Cache hit rate for
   search is structurally poor in a way it is not for page content.
2. **The fast global edge layer excludes our traffic.** Sanity's docs state the short-lived
   global CDN "does not cache private datasets or POST queries." Scored search queries are long
   enough to be sent as POST. That leaves seven regional POPs — and exactly one in Europe
   (Saint-Ghislain, Belgium) for all our European markets.
3. **Cache misses hit the direct API, which is rate limited**: 500 requests/second per IP and
   500 concurrent queries per dataset.

Point 3 is the sharpest constraint. If search is proxied through Next.js route handlers — which
it must be, to keep tokens server-side and enforce market scoping — then all users across all
markets share the server's egress IP, making 500 req/s a platform-wide ceiling whose failure
mode is HTTP 429 under peak load. Querying browser-direct would spread load across end-user IPs,
but would move market scoping to the client, which is unacceptable for regulated device
documentation.

Additionally, `score()` (BM25) and `text::semanticSimilarity()` do not appear in the optimizable
expression list, and leading wildcards — required for the compound-word case above — are
explicitly documented as slow.

No like-for-like published benchmark between Sanity and Algolia was found; this section argues
from documented architecture rather than measured latency.

## Typo tolerance as an accessibility requirement

This is the part most likely to be challenged, so the sourcing matters.

**WCAG does not require it.** SC 3.3.3 Error Suggestion (Level AA) is scoped to *input errors*,
defined as "information provided by the user that is not accepted" by the system. A search box
that accepts a misspelling and returns zero results has not produced an input error — the input
was accepted. The intent and examples are about form validation. Do not cite WCAG for this; it
does not survive reading.
[Understanding SC 3.3.3](https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html)

**W3C COGA does, explicitly.** *Making Content Usable for People with Cognitive and Learning
Disabilities*, [§4.3.6 "Provide Search"](https://www.w3.org/TR/coga-usable/#provide-search-pattern):

> Provide a friendly search capability. Ideally search should include: autocomplete, grouping of
> results when appropriate with headings for each group, ability to easily find previous
> searches, and spell-checking.

> Search is most useful when it corrects misspellings, finds appropriate or related content, and
> provides suggested auto-corrected versions of the search terms.

§4.3.6.5 lists under *Use:* "Search with spell check or suggested terms." Persona scenario
[§6.6.2, "Kwame Scenario 2: Finding the Right Words to Use for Searching"](https://www.w3.org/TR/coga-usable/#kwame-scenario-2-finding-the-right-words-to-use-for-searching)
describes the exact user: *"Kwame finds there are times when he spells words incorrectly. He
appreciates error corrections, word completion, and systems that accept mistakes."*

The honest caveat: COGA is **supplemental and non-normative**. [§4.1](https://www.w3.org/TR/coga-usable/#introduction)
states it provides guidance "beyond the requirements of" WCAG. It is not a conformance target.
But the same section states that implementing these patterns is *"essential for some people with
cognitive and learning disabilities to be able to use content independently"* — and for an AAC
company, that population is the primary audience, not an edge case.

So the requirement is justified as: *W3C COGA §4.3.6 explicitly names spell-checking and
misspelling correction as components of accessible search, and identifies these patterns as
essential for independent use by users with cognitive and learning disabilities.* Not as a legal
obligation.

## Requirements for whichever service is chosen

- Per-language analyzers with stemming and compound handling, not one index for all languages
- Diacritic-insensitive matching in both directions
- Typo tolerance enabled by default
- Market × language scoping enforced **in the index**, so a caregiver in one market cannot
  surface a device manual not approved for that market
- Zero-result query analytics per market, as the early-warning signal for content gaps
- Sanity stays the source of truth; the index is a projection, rebuildable from scratch

## Considered options

- **Sanity GROQ search only** — rejected for the three reasons above. Would be the right call for
  a single-language content site.
- **Algolia** — strongest turnkey multi-language ranking and typo tolerance; fastest to working.
  Hosted, per-operation pricing.
- **Typesense** — self-hostable, solid typo tolerance, lower cost; less refined ranking control.
- **Elasticsearch** — most powerful and most tunable, but only viable with a named owner.
  Unowned Elastic degrades badly over time.

Vendor is not yet decided; the decision recorded here is *dedicated search service rather than
GROQ*, which is the part that shapes the architecture.

## Consequences

- A sync pipeline from Sanity to the index becomes infrastructure that must be owned, monitored,
  and made re-runnable. Index drift is a new failure mode that did not exist before.
- Search relevance becomes independently testable and tunable — which for regulated device
  documentation is a benefit, since "can users find the correct IFU" becomes measurable.
- Instrument zero-result searches from day one, regardless of which vendor is chosen.

