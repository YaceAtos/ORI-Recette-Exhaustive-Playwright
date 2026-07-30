# Tooltip

**Regle** : Tout bouton compose uniquement d'une icone, sans libelle texte visible, doit obligatoirement afficher un tooltip au survol (hover) et au focus clavier.

## Contenu

Texte court et explicite decrivant l'action declenchee par le bouton, ou un complement d'information.
Exemples : "Modifier", "Supprimer", "Telecharger", "Voir le detail".

## Cas d'application

- Boutons icone sans texte
- Icones informatives (ex. icone `info` apportant un complement d'information au survol)

## Comportement

- Apparait apres un delai court au hover (300-500 ms) pour eviter les affichages intempestifs
- Disparait des que le curseur quitte le bouton ou que le focus est perdu
- Ne doit pas masquer le contenu adjacent important (positionnement adaptatif si necessaire)
