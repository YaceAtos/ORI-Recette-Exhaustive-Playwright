---
name: orion-spec-sync
description: "Valide les pointeurs de la carte Orion : vérifie que les page_id référencés dans docs/ existent encore sur Confluence et signale les pages obsolètes (A SUPPRIMER, archivées, déplacées, vides). Ne ré-extrait PAS de contenu. Use when 'valider la carte orion', 'pointeurs cassés', 'page_id obsolètes', 'audit carte orion', 'sync orion'."
---

# Orion Spec Sync — Validation des pointeurs

Sous le modèle carte, le contenu vit sur Confluence (lu live). Ce skill ne synchronise PAS de contenu : il **valide que les `page_id` de `docs/` pointent encore vers des pages réelles** et signale les pointeurs à corriger.

## When to Use

- Après un sprint (pages Confluence archivées/déplacées/renommées).
- Avant de s'appuyer sur la carte pour un livrable.
- Doute sur un pointeur (`A SUPPRIMER`, page disparue).

## When NOT to Use

- Ré-extraire / recopier du contenu domaine (anti-pattern sous modèle B — le détail reste live via `confluence-explorer`).
- Modifier la structure des cartes (décision utilisateur).

## Workflow (lecture seule Confluence)

1. Lire `docs/INDEX.md` + chaque carte (`mpX-*`, `08`, `mp5-cadre-operationnel`) → collecter tous les `page_id` (racines + Pages sources).
2. Déléguer `@confluence-explorer` : pour chaque `page_id`, vérifier existence + titre + statut (existe / 404 / archivée / déplacée). Repérer les pages réellement passées en `A SUPPRIMER` ou vidées.
3. Comparer au statut déclaré dans la carte (`actif` / `EN COURS` / `A SUPPRIMER` / `vide`).
4. Retourner un tableau :

| page_id | Carte | Existe ? | Statut Confluence | Statut carte | Action |
|---------|-------|----------|-------------------|--------------|--------|
| 969375746 | mp6 | oui | A SUPPRIMER | A SUPPRIMER | OK |
| 712310799 | mp5-CO | oui | actif v29 | actif v28 | OK (carte = pointeur, pas de re-sync contenu) |
| {id} | mpX | 404 | — | actif | **pointeur cassé → corriger** |

5. Sur validation utilisateur uniquement : mettre à jour les `page_id` cassés / statuts dans les cartes (pas de contenu).

## Règles

- Zéro écriture Confluence/Jira.
- Ne jamais recopier de contenu dans `docs/` (les cartes restent des pointeurs).
- Une divergence de **version** (v28→v29) n'est PAS un problème : la carte pointe, elle ne copie pas. Seuls comptent : page inexistante, déplacée, ou statut obsolète (A SUPPRIMER/vide non reflété).

## Fichiers de référence

- `docs/INDEX.md` + cartes `docs/*.md`
- Espace Confluence : `itsap-ouicare.atlassian.net/wiki/spaces/Orion/`
