# Tableaux

> Voir aussi : `navigation.md` (clic ligne → destination), `deletion.md` (suppression depuis tableau)

## Multi-elements dans une case

L'affichage de multiples elements dans une cellule se fait de deux facons :

| Affichage | Quand | Tri |
|-----------|-------|-----|
| **A** — `"Element, +1"` | Les elements sont de meme valeur. Le premier par ordre alphabetique est mis en avant. | Tri sur le texte de la case |
| **B** — `"2 elements"` | Les elements ne sont pas de meme valeur, aucun ne peut etre mis en avant. | Tri sur le texte "2 statuts" |

## Filtres

Les filtres persistent au sein d'un micro-service. **Perdus** lors du changement de micro-service (evite la confusion inter-contexte).

## Tooltip sur colonnes

Les icones d'action en bout de ligne (edit, delete, open) doivent toujours avoir un tooltip. Voir `tooltip.md`.
