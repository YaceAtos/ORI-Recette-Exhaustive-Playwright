# Index Scripts INT2 IHM

Ce document donne une vue claire de tous les scripts actifs et de leurs usages.

## 1) Commandes rapides (aliases)

### QA / exécution Playwright
- `npm run qa:record:int2`: enregistre la suite INT2 ciblée.
- `npm run qa:record:chains`: enregistre les chaînes de navigation.
- `npm run qa:record:working`: enregistre la suite "working".
- `npm run qa:record:exhaustive`: enregistre la suite exhaustive.
- `npm run qa:mp4:int2`: enregistrement INT2 + conversion MP4.
- `npm run qa:mp4:chains`: enregistrement chains + conversion MP4.
- `npm run qa:mp4:working`: enregistrement working + conversion MP4.
- `npm run qa:mp4:exhaustive`: enregistrement exhaustive + conversion MP4.
- `npm run qa:run:full`: exécution complète exhaustive + contrôles + rapports.

### Agents (pipeline INT2)
- `npm run agent:semantic`: extraction sémantique globale.
- `npm run agent:dataset`: génération/ajustement dataset.
- `npm run agent:discover`: découverte de pages/routes.
- `npm run agent:discover:deep`: découverte profonde.
- `npm run agent:scenarios`: construction scénarios.
- `npm run agent:synthesize`: synthèse scénarios.
- `npm run agent:gate`: contrôle JDD (gate qualité).
- `npm run agent:creation:profile`: profilage de flux création.
- `npm run agent:creation:semantics`: sémantique des formulaires.
- `npm run agent:extract:multi`: extraction multi-agent par page.
- `npm run agent:workflow`: workflow agent standard.
- `npm run agent:workflow:preprod`: workflow strict préprod.
- `npm run agent:workflow:prod`: workflow strict prod.
- `npm run agent:workflow:autonomous`: chaîne autonome complète.

### Rapports
- `npm run report:panel`: panneau exhaustif de cas.
- `npm run report:functional`: matrice fonctionnelle.
- `npm run report:functional:strict10`: matrice fonctionnelle avec garde min 10 manifests.
- `npm run report:functional:strict12`: matrice fonctionnelle avec garde min 12 manifests.
- `npm run report:super`: super-report consolidé.
- `npm run report:pptx`: export PPTX.
- `npm run report:creation-coverage`: état de couverture des créations.

## 2) Scripts Node/Bash par rôle

### A) Agents de découverte / sémantique
- `int2-ihm-scripts/int2-ihm-agent-semantic-extractor.js`
- `int2-ihm-scripts/int2-ihm-agent-discovery.js`
- `int2-ihm-scripts/int2-ihm-agent-discovery-deep.js`
- `int2-ihm-scripts/int2-ihm-agent-form-semantics.js`

### B) Génération dataset / scénarios
- `int2-ihm-scripts/int2-ihm-agent-dataset-manager.js`
- `int2-ihm-scripts/int2-ihm-agent-scenarios-builder.js`
- `int2-ihm-scripts/int2-ihm-agent-scenarios-synthesizer.js`

### C) Extraction multi-agent
- `int2-ihm-scripts/int2-ihm-agent-page-extractors-orchestrator.js`
- `int2-ihm-scripts/int2-ihm-agent-page-extractor.js`
- `int2-ihm-scripts/int2-ihm-export-sitemap-yaml.js`

### D) Gate / orchestration
- `int2-ihm-scripts/int2-ihm-agent-jdd-gate.js`
- `int2-ihm-scripts/int2-ihm-agent-workflow-orchestrator.js`

### E) Reporting
- `int2-ihm-scripts/int2-ihm-report-super.js`
- `int2-ihm-scripts/int2-ihm-report-functional-matrix.js`
- `int2-ihm-scripts/int2-ihm-report-creation-coverage.js`
- `int2-ihm-scripts/int2-ihm-report-kpi-fr.js`
- `int2-ihm-scripts/int2-ihm-report-exhaustive-panel.js`
- `int2-ihm-scripts/int2-ihm-report-exhaustive-pptx.js`

### F) Exécution média / run global
- `int2-ihm-scripts/int2-ihm-transcode-evidence-mp4.sh`
- `int2-ihm-scripts/int2-ihm-run-regression-exhaustive.sh`

## 3) Dossiers de sortie (artifacts)

- `int2-ihm-test-results/`: sorties Playwright brutes (webm, traces, screenshots).
- `int2-ihm-recordings/`: exports consolidés (mp4, manifests, yaml, markdown).
- `int2-ihm-recordings/int2-autonomous/`: artefacts autonomes (graph, profils, super-report, page-agents).

## 4) Ordre recommandé (nouveau run)

1. `npm run agent:discover`
2. `npm run agent:creation:profile`
3. `npm run agent:creation:semantics`
4. `npm run agent:extract:multi`
5. `npm run report:super`
