# UX Patterns — Index

Regles d'ergonomie applicatives d'Orion. **Ce fichier est toujours charge.** Les fichiers detailles ne sont charges qu'en cas de besoin selon le type de maquette.

---

## Sommaire — Quand charger quoi

| Fichier | Contenu | Charger si la maquette contient... |
|---------|---------|-----------------------------------|
| `navigation.md` | Drawer vs page detail, clic ligne, boutons drawer | Un tableau avec navigation, un drawer, une page detail |
| `modales.md` | Pop-ups (warning/error), 3 tailles de modales, boutons footer | Une modale, une pop-up de confirmation, un formulaire de creation |
| `tableaux.md` | Multi-elements dans une case, filtres persistants | Un tableau de donnees (data-table) |
| `tooltip.md` | Regle tooltip obligatoire, delai, positionnement | Des boutons icone-only (button-icon) |
| `mode-edition.md` | Sticky bar, overlay, tracking badge, drawer recap, validation | Un ecran avec mode edition (gestion des droits, configuration) |
| `loading-snackbar.md` | Progress bar, spinner, snackbar succes/erreur, alertes inline | Des etats de chargement, des feedbacks d'action, des alertes conditionnelles |
| `deletion.md` | Visibilite bouton, scenarios A/B, flux tableau et fiche | Un bouton/action de suppression |
| `formulaires.md` | 3 niveaux d'obligation, asterisques, statuts, saisie adresse/documents/numeros | Un formulaire, une modale de creation, des champs de saisie |
| `time-slots.md` | Expansion panels, creneaux, structure min/max, 3 variantes contextuelles | Des plages horaires (contrat, ouverture, contact) |
| `data-masking.md` | Masquage partiel (type A) et absolu (type B), regles de blocs | Des donnees sensibles (RGPD, sante, finance) |
| `historique.md` | Tableau recent-first, 15 lignes, export | Une section historique |

---

## Regles universelles (toujours applicables)

- **Tooltip** : tout bouton icone-only doit avoir un tooltip (hover 300-500ms)
- **Boutons footer** : principal (filled) toujours a droite, secondaire (tonal) a gauche
- **Filtres** : persistent dans un micro-service, perdus au changement de micro-service
- **Contenu max** : page detail limitee a 1500px de large
- **Navigation** : une ligne de tableau = une seule destination (jamais de chaine)
- **Snackbar** : feedback apres toute action (creation, suppression, erreur) — en haut, centree

---

## Icones — Reference principale

Toutes les icones utilisent **Material Symbols Outlined**. Utiliser ces noms exacts.

### Status et Alertes

| Icone | Description | Usage |
|-------|------------|-------|
| `mode_standby` | Actif | Element en cours, active |
| `mode_night` | Inactif | Element desactive |
| `task_alt` | Valide | Action reussie ou approuvee |
| `notification_important` | Warning | Anomalie non bloquante |
| `warning_amber` | Erreur | Probleme bloquant |
| `hourglass_bottom` | En attente | Traitement en cours |
| `payment` / `credit_card_off` | Facture / non facture | Etat de facturation |

### Actions et Commandes

| Icone | Description | Usage |
|-------|------------|-------|
| `add` | Ajouter / Creer | Nouvel element |
| `delete` | Supprimer | Effacer definitivement |
| `edit` | Modifier | Editer un champ ou bloc |
| `arrow_forward` | Ouvrir / Voir detail | Navigation vers page ou drawer |
| `close` | Fermer / Refuser | Fermer un element, non-conformite |
| `file_download` | Telecharger | Exporter un fichier |
| `file_upload` | Upload | Importer un fichier |
| `save` | Enregistrer | Sauvegarder |
| `playlist_add_check` | Selectionner tout | Action groupee |

### Entites et Navigation

| Icone | Description | Usage |
|-------|------------|-------|
| `person` | Profil / Personne | Client, collaborateur, prospect |
| `contact_page` | Contrat / Fiche | Page de detail d'une personne |
| `category` | Regroupement | Societe, etablissement, agence |
| `home_work` | Etablissement | Lieu physique |
| `villa` | Domicile client | Lieu d'intervention |
| `storefront` | Agence | Point de vente |
| `workspaces` | Organisation | Mise en relation d'entites |
| `account_tree` | Organigramme | Structure arborescente |
| `list` | Liste / Catalogue | Annuaire |
| `extension` | Modules | Configuration de modules |
| `connected_tv` | Telegestion | Pointage electronique |
| `tune` | Configuration | Reglages |
| `file_present` | Documents | Dossier ou gabarit |
| `home` | Domicile | Foyer, lieu de vie |
| `star_border` / `star` | Favori | Favori actif/inactif |

### Donnees et Contacts

| Icone | Description | Usage |
|-------|------------|-------|
| `location_on` | Adresse | Localisation geographique |
| `payment` | Facturation | Paiement, grille tarifaire |
| `calendar_month` | Dates | Periode contractuelle |
| `percent` | Pourcentage | Taux, remise |
| `numbers` | Reference | Identifiant numerique |
| `phone` | Telephone | Contact telephonique |
| `mail` | Email | Adresse mail |
| `alternate_email` | Email secondaire | Login identifiant |
| `euro_symbol` | Montant | Valeur financiere |
| `feed` | Notes / Activite | Journal, commentaires |
| `info` | Information | Tooltip, complement |
| `history` | Historique | Log, suivi |

### Temps et Planification

| Icone | Description | Usage |
|-------|------------|-------|
| `exit_to_app` / `output` | Creneau | Debut/fin d'un creneau |
| `repeat` | Recurrence | Evenement repetitif |
| `schedule` | Duree prevue | Horaire contractuel |
| `timelapse` | Duree | Barre de temps progressive |
| `today` | Evenement unique | Non repetable |
| `event_busy` | Annule / Indispo | Ressource indisponible |

### Specifique

| Icone | Description | Usage |
|-------|------------|-------|
| `auto_awesome` | IA / Prediction | Suggestions automatiques |

---

*Source : Figma Orion Maquettes, page "Notion transverses" — Mis a jour le 24 juin 2026*
