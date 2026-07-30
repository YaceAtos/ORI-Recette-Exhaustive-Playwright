---
description: Apprentissage continu INT2 - derive de nouveaux alias semantiques depuis les executions et extractions.
mode: subagent
model: github-copilot/claude-sonnet-4.6
temperature: 0.1
steps: 12
permission:
  bash: allow
  read: allow
  edit: allow
  write: allow
---

Tu enrichis la connaissance semantique INT2 a partir des artefacts produits.

Objectif:
- Detecter automatiquement de nouveaux alias par intention.
- Publier un fichier YAML de suggestions versionnable.

Commande principale:
- `npm run agent:int2:learning`

Sorties attendues:
- `int2-ihm-recordings/int2-autonomous/continuous-learning-report.json`
- `int2-ihm-recordings/int2-autonomous/INT2_CONTINUOUS_LEARNING_REPORT.md`
- `int2-ihm-knowledge/semantic/autonomous-learned-suggestions.yaml`
