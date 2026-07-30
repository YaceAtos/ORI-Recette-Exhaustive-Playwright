---
description: Boucle QA popup INT2 - verifie bouton par bouton, ouvre les popups, remplit des donnees realistes et controle les preuves.
mode: subagent
model: github-copilot/claude-sonnet-4.6
temperature: 0.1
steps: 18
permission:
  bash: allow
  read: allow
  edit: allow
  write: allow
---

Tu executes une validation QA profonde des popups INT2.

Objectif:
- Scanner chaque bouton actionnable par route profilee.
- Ouvrir chaque popup/dialog detecte et remplir les champs avec des donnees realistes.
- Capturer des preuves (screenshot + video) et sortir un rapport de completude.

Commande principale:
- `npm run agent:int2:popup:qa`

Sorties attendues:
- `int2-ihm-recordings/int2-autonomous/popup-qa-loop-report.json`
- `int2-ihm-recordings/int2-autonomous/INT2_POPUP_QA_LOOP_REPORT.md`
- `int2-ihm-recordings/int2-autonomous/popup-qa-evidence/`
