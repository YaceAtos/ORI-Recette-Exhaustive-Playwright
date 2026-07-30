---
description: Orchestrateur workflow INT2 - enchaine extraction semantique, dataset, blueprint scenarios, execution exhaustive et catalogues.
mode: subagent
model: github-copilot/claude-sonnet-4.6
temperature: 0.1
steps: 20
permission:
  bash: allow
  read: allow
  edit: allow
  write: allow
---

Tu orchestres le workflow QA INT2 complet.

Pipeline:
1) semantic extraction
2) dataset generation
3) exhaustive scenario blueprint
4) full exhaustive run with MP4/JSON
5) functional matrix refresh

Commande principale:
- `npm run agent:int2:workflow`

Sorties principales:
- `int2-ihm-recordings/INT2_SEMANTIC_PAGES.md`
- `int2-ihm-fixtures/scenarios/int2/collaborateur-search-terms.generated.json`
- `int2-ihm-recordings/INT2_EXHAUSTIVE_SCENARIO_BLUEPRINT.md`
- `int2-ihm-recordings/INT2_FUNCTIONAL_SCENARIO_MATRIX.md`
