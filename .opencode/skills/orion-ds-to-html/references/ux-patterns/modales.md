# Modales et Pop-ups

> Voir aussi : `navigation.md` (drawers et boutons), `deletion.md` (pop-up avant suppression), `mode-edition.md` (pop-up "quitter sans enregistrer")

## Pop-ups — Types

| Type | Variante | Usage |
|------|----------|-------|
| **Alerte - Warning** | Quitter sans enregistrer | Mode edition : l'utilisateur quitte avec des modifications non sauvegardees |
| **Alerte - Warning** | Quitter sans terminer | L'utilisateur quitte un processus multi-etapes en cours |
| **Erreur - Error** | Informations non conformes | Validation echouee, champs invalides |
| **Erreur - Error** | Alerte avant suppression | Confirmation avant action destructive |

**Structure d'une pop-up** :
- Icone d'alerte (warning ou error) + bouton close en haut
- Titre (bold) + message descriptif
- Footer : boutons d'action (tonal "Annuler" + filled "Confirmer")
- Toujours de taille Small (SM)

## Niveaux de modales (3 tailles)

| Niveau | Taille | Navigation interne | Usage |
|--------|--------|-------------------|-------|
| 1 | Small (SM) | Aucune | Action legere : confirmation, alerte, pop-up simple |
| 2 | Medium (MD) | Aucune | Action standard : formulaire court, edition rapide |
| 3 | Large (LG) | Navigation possible entre sections (sidebar interne) | Contenu complexe : creation multi-etapes, formulaire long |

## Boutons de modale

- Footer : bouton principal (filled) toujours a **droite**, bouton secondaire (tonal) a gauche
- La modale Large integre une sidebar de navigation interne a gauche pour les sections

## Drawers — Cas d'usage

- Drawer detail : consultation rapide d'un element (intervention, collaborateur)
- Drawer filtres : filtres avances d'un tableau

Placement des boutons : voir `navigation.md` (section Boutons du drawer).
