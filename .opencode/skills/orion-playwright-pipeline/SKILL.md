---
name: orion-playwright-pipeline
description: Genere et execute localement le pipeline de recette Orion avec Playwright, depuis le classeur Sprint 11-13 vers les contrats ORI/RG, CSV Jira/Xray et rapports PPTX. Utiliser quand l utilisateur demande le pipeline autonome, une execution Playwright Orion, un plan de test, une strategie de test ou des exports TP/TE/TS/TC sans publication distante.
---

# Pipeline Playwright Orion

## Quick start

```bash
npm run orion:pipeline:prepare
npm run orion:pipeline:run -- --grep "ORI-773"
```

## When to Use / When NOT to Use

- Utiliser pour ingestion Excel, tracabilite ORI/RG, execution Playwright et rapports locaux.
- Ne pas utiliser pour publier, modifier ou commenter dans Jira, Confluence ou Xray.
- Ne pas utiliser pour creer des donnees persistantes sans autorisation explicite.

## Workflow

1. Executer `npm run orion:pipeline:prepare`.
2. Verifier `CATALOG_SUMMARY.md` et `traceability.json`.
3. Traiter `ticket-seulement` comme une couverture a confirmer, pas comme une automatisation exacte.
4. Executer `npm run orion:pipeline:run` ou cibler un ticket avec `--grep`.
5. Lire `EXECUTION_SUMMARY.md`, le rapport HTML, le CSV et le PPTX de bilan.
6. En cas d echec, utiliser le JSON Playwright, la trace et la capture avant toute correction.

## References locales

- `TP-LOCAL-SPRINT-11-12-13` : plan de test.
- `TE-LOCAL-INT2-SPRINT-11-12-13` : execution.
- `TS-ORI-xxx` : test set par ticket.
- `TC-ORI-xxx-CT-...-Rligne` : cas de test unique.

## Exigences

- Node.js, Playwright, `exceljs` et `pptxgenjs`.
- Le classeur source est `docs/CAS DE TEST DES US SPRINT 11 12 13 (version 1).xlsx`.
- Les resultats restent dans le workspace local.
