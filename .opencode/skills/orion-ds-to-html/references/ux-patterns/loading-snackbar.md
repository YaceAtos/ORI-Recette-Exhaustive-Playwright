# Loading States & Snackbar

> Voir aussi : `mode-edition.md` (snackbar apres enregistrement)

## Loading — par contexte

| Contexte | Composant | Comportement |
|----------|-----------|--------------|
| Page complete | Progress bar | Tout en haut (sous la navigation), mode indeterminate |
| Donnees d'un tableau/card | Spinner | Centre au milieu de la zone de donnees |
| Ouverture de la modale | Progress bar + spinner | Modale s'ouvre immediatement, spinner centre dans le contenu |
| Action dans une modale (save) | Progress bar | Delai 500ms, apparait au-dessus des boutons d'action |
| Telechargement | Progress bar | Tout en haut (sous la navigation), mode indeterminate |
| Boutons d'actions | — | Bouton devient `disabled` + `cursor: wait` |
| Fin d'action | Snackbar | Message de succes ou d'erreur |

## Snackbar — Feedback d'action

Positionnement : en haut de la page, centree horizontalement, sous le header. Disparait automatiquement apres quelques secondes.

| Type | Couleur | Icone | Exemple de message |
|------|---------|-------|-------------------|
| **Creation reussie** | Vert (success) | `task_alt` | "Le collaborateur a ete cree avec succes" |
| **Suppression reussie** | Vert (success) | `task_alt` | "L'element a ete supprime" |
| **Erreur** | Rouge (error) | `warning_amber` | "Erreur lors de l'action" |

## Alertes inline — Conditions non remplies

Sur les pages detail, des alertes inline (composant Alert) sont affichees a cote du titre de section quand une condition n'est pas remplie.

**Cas 1 — Une seule condition** :
- Alert dans le header de la section concernee
- Texte explicite decrivant ce qui manque

**Cas 2 — Plusieurs conditions** :
- Alert dans le header de la page (sous le titre principal)
- Liste des conditions manquantes en puces dans un bloc alert
- Chaque section concernee affiche aussi son propre alert inline
