---
description: Prepare ou execute le pipeline Playwright Orion local avec enrichissement MCP en lecture seule.
agent: orion-playwright-pipeline
---

Prepare le pipeline Orion local pour `$ARGUMENTS`.

1. Execute `npm run orion:pipeline:prepare`.
2. Lis les cles `issueKeys` et `confluencePageIds` de `int2-ihm-recordings/orion-pipeline/test-catalog.json`.
3. Utilise `jira-explorer` et `confluence-explorer` en lecture seule pour construire `atlassian-source-bundle.json` selon le schema local.
4. N appelle aucun outil de creation, edition, commentaire, transition ou publication Atlassian/Xray.
5. Relance `npm run orion:pipeline:prepare` pour enrichir le catalogue.
6. Si `$ARGUMENTS` contient `run`, execute `npm run orion:pipeline:run`. Si une cle ORI est fournie, ajoute `-- --grep "ORI-xxx"`.
7. Retourne les chemins des CSV, PPTX, JSON/JUnit/HTML et les compteurs de couverture/execution.
