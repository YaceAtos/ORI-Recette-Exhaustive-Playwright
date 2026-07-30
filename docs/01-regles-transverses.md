# 01 — Règles transverses UI

> Règles UX/UI communes à tous les écrans Orion : gestion des formulaires, modales multi-étapes, pagination, navigation, filtres, affichage et notifications. Applicable par tout développeur ou designer travaillant sur n'importe quel module. Référence transverse obligatoire avant tout développement front.

| Meta | Valeur |
|------|--------|
| **Tags** | UI, UX, formulaires, modales, pagination, filtres, navigation, notifications, bandeau agence, messages erreur, Angular Material, règles de gestion, transverse |
| **Source** | Confluence 443514899 (MP Transverses MPT1) ; MPT1.1 parcours user 514359319, MPT1.2 bandeau 413696001, messages erreur 380600336 — copie socle stable (offline OK) |

## Formulaires — Plages horaires

- `RG_GEN_GEST_CHAMP_01` : Fin > Début (HH:mm). Nouveau créneau pré-rempli avec heure fin précédente. Chevauchements → disabled ou erreur.
- `RG_GEN_GEST_CHAMP_02` : Jour déjà sélectionné → disabled dans autres listes (groupé "Jours déjà configurés").
- `RG_GEN_GEST_COMPO_01` : 1 seul expansion panel ouvert à la fois.
- `RG_GEN_GEST_ENR_01` : Plage vide → ignorée. Partielle → bloquée + modale erreur.

## Modales multi-étapes

- Suivant/Précédent → **pas de sauvegarde BDD**
- Enregistrer primaire → valide toutes étapes + ferme modale
- Enregistrer secondaire → enregistre, modale reste ouverte
- Bouton grisé après enregistrement, actif dès 1ère modification
- Suppression → modale confirmation → snackbar succès
- Croix avec modifs non sauvées → alerte "Quitter / Enregistrer"
- Retour écran conserve les filtres

## Pagination

- Options : 10/15/20/25 (défaut 15)
- Boutons : |< < > >| avec gestion d'inactivité aux bornes

## Navigation & Filtres

- Filtres conservés dans le même micro-service, réinitialisés si changement de domaine
- Menu latéral conditionné aux rôles, replié par défaut, parent en gras au clic
- Tooltip obligatoire sur tout bouton icône sans libellé (200ms delay)

## Affichage

- Nom : Prénom + Nom partout (sauf Planning : Nom + Prénom)
- 1 jour → nom complet, ≥2 → abréviations, tous → "Tous les jours"
- Multi-valeurs colonne : "Element, +1" (même type) ou "2 éléments" (hétérogène)

## Messages d'erreur

| Couleur | Type |
|---------|------|
| Rouge | Bloquant / Erreur |
| Bleu | Informatif |
| Orange | Alerte / Anomalie |
| Vert | Succès |

- Champ obligatoire vide → "Veuillez renseigner le champ."
- Format incorrect → "Saisie incorrecte."
- Adresse introuvable (GEOWS) → "L'adresse n'a pas été trouvée. Veuillez sélectionner le point le plus proche sur la carte."

## Notifications (transverse)

- **Acteurs** : Opérationnel / Responsable agence / Gérant franchisé
- Liste de cartes (libellé, horodate, statut)
- Filtres statut : Créée / Confirmée / Rejetée / Tout (défaut : Tout)
- Actions : Confirmer ou Rejeter (actif ssi statut = "Créée")
- Enregistrement : horodate + id utilisateur traitant
- Infos traitement visibles uniquement si statut ≠ "Créée"

## Bandeau d'en-tête — Sélection agence

- Composant transverse (tous les écrans)
- Liste les agences du cône de visibilité de l'utilisateur connecté
- Sélection agence → met à jour les écrans sensibles (planning, etc.)
