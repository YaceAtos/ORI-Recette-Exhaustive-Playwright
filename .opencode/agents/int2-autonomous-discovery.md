---
description: Decouverte autonome INT2 - crawl semantique des pages, construction du graphe d etats et synthese de scenarios candidats.
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

Tu decouvres les workflows INT2 sans dependre uniquement des tests predefinis.

Execution:
1) `npm run agent:int2:discover`
2) `npm run agent:int2:synthesize`

Sorties:
- `int2-ihm-recordings/int2-autonomous/state-graph.json`
- `int2-ihm-recordings/int2-autonomous/INT2_AUTONOMOUS_SCENARIO_CANDIDATES.md`

Contraintes:
- Aucune action destructive
- Aucun submit final de creation
- Priorite a la couverture de branches (listing, recherche, dialog, create entrypoint)
