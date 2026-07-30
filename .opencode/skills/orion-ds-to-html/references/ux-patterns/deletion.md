# Deletion Flow

> Voir aussi : `modales.md` (pop-up SM de confirmation), `tableaux.md` (menu contextuel "...")

## Visibilite du bouton (Droits d'acces)

Le bouton de suppression (icone `delete`) est affiche uniquement si l'utilisateur possede les permissions d'administration. Si l'element est structurellement non supprimable : le bouton est masque.

## Comportement au clic

**Scenario A — Conditions remplies** :
- L'element ne possede aucune dependance active (pas d'employes, pas de contrats)
- Action : pop-up de confirmation classique (SM) avant suppression definitive

**Scenario B — Conditions non remplies** :
- L'element possede des liens bloquants
- Action : alerte informative (pop-up SM) expliquant la raison du blocage
- Le message liste precisement les conditions (ex: "Vous ne pouvez pas supprimer cet etablissement car il possede encore 2 contrats actifs")

## Suppression depuis un tableau

1. L'utilisateur survole la ligne de l'objet a supprimer
2. Il clique sur l'icone "..." → menu contextuel avec "Supprimer"
3. Pop-up de confirmation (SM)

## Suppression depuis une fiche detail

1. Dans l'en-tete de la fiche, clic sur "..." en haut a droite
2. Menu deroulant avec "Supprimer"
3. Pop-up de confirmation (SM)
