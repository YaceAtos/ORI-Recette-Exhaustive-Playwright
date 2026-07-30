# Mode edition

> Voir aussi : `modales.md` (pop-up Warning), `loading-snackbar.md` (snackbar de succes/echec), `navigation.md` (drawers)

## Etat initial (Mode lecture)

- La sticky bar est fixee en bas au centre, visible au scroll
- Elle affiche "Mode edition inactif" et un bouton "Passer en mode edition" (style tonal, icone `edit`)
- Elle n'apparait que si l'utilisateur a les droits d'ecriture

## Activation du mode edition

Au clic sur "Passer en mode edition" :
1. Les zones non editables (hors perimetre) recoivent un **overlay blanc a 40%** et leurs boutons passent en `disabled`
2. La zone editable est encadree par un **contour** (stroke 2px, couleur outline/outline)
3. La sticky bar affiche "Mode edition actif" (pastille verte) et les boutons `[Annuler]` et `[Verifier et enregistrer (badge)]`
4. Le bouton `[Verifier et enregistrer]` est disabled si aucune modification effectuee
5. Dans certains cas, plusieurs boutons peuvent etre ajoutes

## Tracking & Drawer

- Chaque modification incremente par ordre chronologique un **badge compteur** sur le bouton "Verifier et enregistrer"
- Un clic sur ce bouton ouvre un **drawer lateral droit** obligeant l'utilisateur a revoir ses modifications
- Chaque ligne peut etre supprimee individuellement (x)
- Le drawer se ferme via une croix sans quitter le mode edition

## Validation ou Annulation

**Pour enregistrer** :
- Le bouton "Confirmer l'enregistrement" du drawer valide les changements
- Succes : snackbar verte ("Modifications publiees") + reset a l'etat initial
- Echec : snackbar rouge

**Pour annuler** :
- Le bouton "Annuler" quitte le mode
- Si modifications > 0 : pop-up Warning ("Quitter sans enregistrer ?") — voir `modales.md`
- Si 0 modification : retour a l'etat initial direct

## Comportement visuel & Navigation

Tout clic de navigation (sidebar/breadcrumb) declenche la pop-up Warning si des modifications sont en cours avant de rediriger l'utilisateur.
