# Time Slots (Gestion des horaires)

> Voir aussi : `modales.md` (tailles de modales), `formulaires.md` (patterns de champs)

**Regle universelle** : peut importe le cas de figure, on doit toujours avoir la main sur l'etat actif ou inactif des elements internes.

## Structure minimale

Elements toujours presents :
- Titre de section (ex: "Plage horaire preferentielle de contact") + bouton ghost "Ajouter une plage horaire"
- **Expansion panel** par jour : header = label du jour, contenu = champs de saisie
- Contenu d'un panel : form-field (label jours) + ligne avec select (heure debut) + form-field (heure fin)
- Boutons en bas du panel : ghost "Supprimer le creneau" + tonal "Ajouter un creneau"

## Structure maximale

Multiples creneaux par jour, ajout/suppression :
- Expansion panel par jour avec description dans le header (ex: "Mardi — indisponibilite — Remplissable")
- Chaque creneau = une ligne : select (jour) + select (heure debut) + form-field (heure fin) + button-icon-outlined (delete)
- Bouton "Ajouter un creneau" pour rajouter des lignes

## Variantes par contexte

| Contexte | Modale | Contenu specifique |
|----------|--------|-------------------|
| **Plages contractuelles** (collaborateur) | Large avec sidebar | Toggle actif/inactif, alert info, expansion panels, "Jours feries non travailles" multi-select |
| **Horaires d'ouverture** (etablissement) | Medium sans sidebar | Titre + bouton "Ajouter", expansion panels par jour |
| **Contact prospect/client** | Section dans modale Large | Telephones + plages horaires preferentielles + email + preference de contact (radio) |
