---
name: orion-spec-explorer
description: "Explore la spec fonctionnelle Orion (SAP OuiCare) en deux temps : carte locale (docs/) pour router + nomenclature RG + pièges, puis lecture live Confluence via confluence-explorer pour le détail. Use when user asks about Orion functional spec, business rules (RG_*), screens, domains, or consistency. Triggers: 'spec Orion', 'regle metier', 'RG_', 'planning', 'intervention', 'client PP', 'PIM', 'facturation', 'cadre operationnel', 'habilitation', 'Segur', 'maquette Figma', 'OuiCare'."
---

# Orion Spec Explorer

Modèle : `docs/` = **carte** (pointeurs `page_id` Confluence + nomenclature RG + pièges). Le **détail fonctionnel n'est pas local** → lu en live via `confluence-explorer`. Prérequis : MCP Atlassian. Pas de fallback offline.

## Workflow

1. **Router** via `docs/INDEX.md` : colonne Tags → carte domaine ; ou Nomenclature RG → carte ; ou Glossaire (vocabulaire) ; ou `09-maquettes-figma.md` (écran).
2. **Lire la carte domaine** (`mpX-*.md` / `08` / `mp5-cadre-operationnel`) : `page_id`, nomenclature RG, **Pièges connus**.
3. **Répondre depuis la carte** si la question y est répondable : quel `page_id`, quelle RG existe, quel domaine, doublon/piège, statut (actif/EN COURS/A SUPPRIMER/vide).
4. **Détail** (texte exact d'une RG, flux, écran, attributs) → déléguer `confluence-explorer` sur le `page_id` pertinent → réponse **sourcée** (page_id + version). Respecter les Pièges : ne pas lire comme final une page `A SUPPRIMER` / `vide` / `BROUILLON` ; ne pas lire SP3.2 (doublon non tranché).
5. **Figma** : `09-maquettes-figma.md` → node-id → MCP Figma (`get_screenshot` / `get_metadata`, file key `EfsOdCwqfy1Yi0knogfPNc`).

## When NOT to Use

- Modifier la spec (read-only).
- Hors périmètre Orion/OuiCare.
- Valider/réparer les pointeurs `page_id` → skill `orion-spec-sync`.

## Règles

- `00-contexte`, `01-regles-transverses`, le Glossaire et la Nomenclature RG de l'INDEX = **copies pleines** (pas des cartes) : lire directement, **pas de lecture live**. Le reste (`mpX-*`, `08`, `mp5-cadre-operationnel`) = cartes → détail en live.
- Toujours commencer par `INDEX.md`, puis 1 carte. Ne pas charger plusieurs cartes sauf synthèse explicite.
- Le détail vient **uniquement de Confluence live** (la carte ne contient pas le corps). Ne jamais inventer une règle/valeur absente.
- Toute réponse de détail cite le `page_id` (et version si fournie par confluence-explorer).
- Respecter strictement la section "Pièges connus" de la carte (désambiguïsation doublons, pages obsolètes, brouillons).
- Si MCP indisponible → le signaler, ne pas deviner le contenu.

## Advanced

Voir [REFERENCE.md](./REFERENCE.md) : patterns de dispatch, structure d'une carte, usage Figma MCP.
