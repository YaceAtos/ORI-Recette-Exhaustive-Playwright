---
description: Lance la couverture de test fonctionnelle Playwright d'un ticket Orion (headed, visible) puis met à jour les preuves, le dashboard et les rapports. Ex : /orion-ticket ORI-773
agent: orion-playwright-pipeline
---

Objectif : exécuter la couverture de test fonctionnelle **à 100 % du ticket** `$ARGUMENTS` sur INT2, en navigateur visible, avec preuves vidéo MP4.

Interprétation de `$ARGUMENTS` :
- Une clé ORI (ex : `ORI-773`) → exécuter tous les cas de ce ticket.
- Une phrase fonctionnelle (ex : « Je veux exécuter la couverture de test fonctionnelle du ticket ORI-773 ») → extraire la clé ORI et faire de même.
- Une clé + un cas (ex : `ORI-773 CT-STE-COORD-01`) → exécuter uniquement ce cas.

Étapes :
1. Extraire la clé ORI (regex `ORI-\d+`) et l'éventuel `CT-...` depuis `$ARGUMENTS`. Si aucune clé n'est trouvée, demander laquelle.
2. Construire le filtre grep : `"ORI-xxx - "` (ticket entier) ou `"ORI-xxx - CT-yyy"` (cas précis).
3. Exécuter :
   ```bash
   npm run orion:pipeline:run:headed -- --grep "<filtre>"
   ```
   (Le pipeline enchaîne automatiquement : Playwright headed → MP4 + preuves annotées → rapports → dashboard.)
4. À la fin, retourner :
   - le nombre de cas passés / bloqués-flux / bloqués-données,
   - les bugs par sévérité (bloquant/moyen/mineur),
   - le chemin du dashboard : `mon-espace/recette-sprints-11-12-13/livrables-opencode/orion-dashboard.html`,
   - et proposer de l'ouvrir (`open`).

Garde-fous : aucune écriture Jira/Confluence/Xray ; aucune soumission persistante (les boutons Enregistrer/Créer/Supprimer restent bloqués sauf `ORION_ALLOW_SUBMIT=true` confirmé).
