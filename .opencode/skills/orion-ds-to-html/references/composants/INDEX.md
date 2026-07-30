# Composants — Index

Liste des 22 composants atomiques du design system Orion. **Charger le `.js` du composant uniquement quand il est utilise dans la maquette.**

---

## Quand charger quoi

| Composant | Fichier | Utiliser quand... |
|-----------|---------|-------------------|
| **Sidebar** | `sidebar.js` | Toute maquette d'ecran complet (pas les modales seules). Navigation laterale obligatoire. |
| **Button** | `button.js` | Toute action utilisateur : CTA, validation, annulation, navigation. 4 types : Filled (primaire), Tonal (secondaire), Outlined (tertiaire), Ghost (discret). |
| **Button Icon** | `button-icon.js` | Action representee par une icone seule (edit, delete, close, more_vert). Tooltip obligatoire. |
| **Form Field** | `form-field.js` | Tout champ de saisie : input texte, select, textarea. Label flottant, helper text optionnel. |
| **Tag** | `tag.js` | Afficher un statut, une categorie, un label colore. 6 couleurs semantiques (info, success, warning, error, neutral, brand). |
| **Alert** | `alert.js` | Message contextuel : information, avertissement, erreur, succes. Banniere avec icone + texte + actions optionnelles. |
| **Modal** | `modal.js` | Toute fenetre modale : confirmation (SM), formulaire (MD), creation multi-etapes (LG avec sidebar). |
| **Search Bar** | `search-bar.js` | Recherche dans un tableau ou une liste. Autocompletion avec dropdown filtrable. |
| **Segmented Control** | `segmented-control.js` | Filtrer le contenu d'un tableau (ex: Tous/Termines/En cours) OU naviguer entre sections d'une page detail. Toujours au-dessus du contenu filtre. |
| **Tabs** | `tabs.js` | Naviguer entre 2 contenus differents dans un drawer ou un bloc restreint. Usage rare — preferer Segmented Control pour les pages. |
| **Pagination** | `pagination.js` | Bas de tout tableau de donnees. Selecteur de lignes/page + navigation. |
| **Breadcrumb** | `breadcrumb.js` | Haut de page, sous le header. Fil d'Ariane pour situer l'utilisateur dans la hierarchie de navigation. |
| **Row Item** | `row-item.js` | Cellule de tableau (data-table). 6 types : Default, Expandable, Tag, Icon, Checkbox, User. |
| **Result Card** | `result-card.js` | Afficher une liste de resultats : selection parmi plusieurs elements, liste d'adresses, liste d'utilisateurs, bloc de contenu riche. Tres polyvalent. |
| **Expansion Panel** | `expansion-panel.js` | Contenu depliable : plages horaires, sections de formulaire, details supplementaires. Header cliquable + toggle/tag optionnels. |
| **Chips** | `chips.js` | Selection multiple filtrable. Tags interactifs avec selection/deselection. Ex: competences, categories de produit. |
| **Tooltip** | `tooltip.js` | Small : bulle contextuelle au survol d'un bouton icone. Large : panneau d'information au clic (header + liste + fermeture). |
| **Drag & Drop** | `drag-drop.js` | Zone d'import de fichiers. Depot par glisser-deposer ou via bouton "Parcourir". |
| **DatePicker** | `datepicker.js` | Selection de date via calendrier mensuel. Associe a un form-field de type date. |
| **Planning Card** | `planning-card.js` | Exclusivement dans les grilles planning. 3 types (Intervention, RDV Commercial, Evenement RH) x 4 tailles x 2 directions. |
| **Planning Card Period** | `planning-card-period.js` | Exclusivement dans les grilles planning. Blocs de periode (astreinte orange, absence violet). |
| **Sidebar Item** | `sidebar-item.js` | Sous-composant de la Sidebar. Ne pas utiliser seul — deja integre dans `sidebar.js`. |

---

## Regles d'usage

1. **Toujours verifier** si un composant existe avant d'ecrire du HTML/CSS custom
2. **Copier le CSS** du `styles` export dans le `<style>` de la maquette pour chaque composant utilise
3. **Copier le JS** du `script` export dans le `<script>` (si present)
4. **Adapter le contenu** des `variants[].render()` au contexte reel (ne jamais copier les donnees d'exemple)
5. **Ne jamais recreer** un composant from scratch si son equivalent existe dans cette liste

## Composants par contexte de page

### Page liste (tableau de donnees)
`sidebar` + `breadcrumb` + `search-bar` + `segmented-control` + `row-item` + `pagination` + `tag` + `button` + `button-icon`

### Page detail
`sidebar` + `breadcrumb` + `segmented-control` + `tag` + `button` + `button-icon` + `expansion-panel` + `result-card` + `chips`

### Modale de creation (LG)
`modal` + `form-field` + `button` + `tag` + `expansion-panel` + `alert`

### Modale simple (SM/MD)
`modal` + `button` + `alert` + `form-field`

### Drawer
`button` + `button-icon` + `form-field` + `tag` + `tabs` + `result-card`

### Planning
`sidebar` + `planning-card` + `planning-card-period` + `segmented-control` + `button` + `button-icon`
