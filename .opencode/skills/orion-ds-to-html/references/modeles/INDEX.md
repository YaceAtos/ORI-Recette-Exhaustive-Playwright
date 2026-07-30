# Modèles de blocs — Orion

Les modèles sont des **blocs de layout réutilisables**, plus grands que les composants atomiques. Là où un composant est un élément d'interface (bouton, champ, tag), un modèle est une **zone fonctionnelle** qui combine plusieurs composants pour accomplir une tâche précise.

Ils sont définis dans `modeles/{nom}.js`, au même format que les composants (`export const styles`, `export const variants`, `export const script`), et prévisualisés dans `modeles.html`.

---

## Catalogue

| Fichier | Nom | Contexte d'usage |
|---|---|---|
| `modal-list.js` | Modal List | Modales uniquement — liste d'éléments multi-champs |
| `data-table.js` | Data Table | Pages liste — tableau plat ou arborescent avec actions |
| `detail-block.js` | Detail Block | Pages détail (fiche) — sections valeur/label ou result cards |
| `drawer.js` | Drawer | Panneau latéral de consultation — liste, organigramme, tabs |
| `expansion-panel.js` | Expansion Panel | Blocs dépliables avec contenu temps/créneaux/formulaires |
| **pages/page-detail.js** | Page Détail | Fiche entité — fond `#fafafa`, sidebar, tabs, blocs détail |
| **pages/page-liste.js** | Page Liste | Liste d'éléments — fond blanc, tableau, filtres, pagination |
| **pages/page-dashboard-tableau.js** | Page Dashboard Tableau | KPIs + expansion panel historique + tableau filtré |

---

## Modal List

**Fichier :** `modeles/modal-list.js`

### Description

Bloc permettant d'ajouter, remplir et supprimer des **éléments répétables** dans une modale. Chaque élément contient plusieurs champs de formulaire. Le bloc gère deux niveaux de densité selon la complexité des données à saisir.

### Quand l'utiliser

- Dans une modale, quand l'utilisateur doit créer **plusieurs occurrences d'une même entité** (ex : ajouter plusieurs intervenants à une série, renseigner plusieurs adresses, définir plusieurs plages horaires).
- Uniquement dans les modales — jamais sur une page pleine (utiliser un tableau éditable dans ce cas).

### Variantes

#### Vide

État initial du bloc. Aucune ligne n'est affichée. Le seul élément visible est le bouton **"Ajouter un élément"**.

Utiliser cet état pour les formulaires de création (aucune donnée pré-existante).

#### Compact — 2 champs

Chaque ligne contient **2 champs** côte à côte. La poubelle est positionnée à droite de la ligne, alignée verticalement sur les champs.

- Pas de titre par ligne
- Adapté aux données courtes (nom + valeur, label + quantité, etc.)
- La modale peut rester de taille standard (≤ 560px de large)

Quand une ligne est ajoutée, la poubelle apparaît sur chaque ligne existante. Elle ne s'affiche jamais sur une ligne seule si le contexte métier impose un minimum d'un élément (à contrôler dans la logique applicative).

#### Large — 3 champs + checkbox

Chaque élément est encadré dans un **bloc distinct** (border + border-radius 6px). Il contient :

1. **Barre de titre** — un libellé automatique ("Élément 1", "Élément 2"...) à gauche, et la **poubelle** à droite sur la même ligne
2. **3 champs** sur une ligne, qui wrappent si la modale est étroite
3. Une **checkbox** libellée "Ajouter des informations complémentaires" — au clic, elle révèle des champs supplémentaires sous les 3 champs principaux

Cette variante est utilisée quand chaque élément a suffisamment de champs pour justifier une séparation visuelle claire. La modale doit être en taille LG pour accueillir ce bloc sans compression.

### Comportement

| Action | Résultat |
|---|---|
| Clic "Ajouter" | Nouvelle ligne vide ajoutée en bas de liste |
| Clic poubelle | Ligne supprimée (animation non requise en v1) |
| Checkbox cochée | Champs supplémentaires révélés sous les champs principaux |
| Checkbox décochée | Champs supplémentaires masqués (valeurs conservées en DOM) |

### Règles de composition

- Le bouton **"Ajouter"** reste toujours en bas de liste, après les lignes existantes.
- Le libellé du bouton peut être adapté au contexte : "Ajouter un intervenant", "Ajouter une adresse", etc.
- En variante Large, les titres de ligne ("Élément 1", "Élément 2"...) sont générés automatiquement et se renumérotent à la suppression.
- Les champs dans le bloc utilisent les classes du composant `form-field` (`ff`, `ff__wrapper`, `ff__label`, `ff__input`). Les CSS des deux fichiers doivent être présents dans la même page.
- Ne pas imbriquer deux Modal List dans une même modale.

### Dépendances composants

| Composant | Usage |
|---|---|
| `composants/form-field.js` | Tous les champs du bloc (`ff`, `ff--float`, `ff--focus`) |
| `composants/button.js` | Optionnel — si le bouton "Ajouter" doit être stylisé en `.btn--outlined` |

---

## Règles générales de composition

- Un modèle **ne remplace jamais un composant** — il en orchestre plusieurs.
- Les modèles sont conçus pour un **contexte d'usage précis** (modale, page liste, formulaire plein écran). Ne pas les transposer hors contexte sans vérification.
- Tous les modèles sont **standalone** dans leurs fichiers HTML générés : les CSS des composants dépendants sont copiés inline.
- Les scripts interactifs des modèles **complètent** ceux des composants (ne pas les dupliquer — inclure les deux).

---

## Data Table

**Fichier :** `modeles/data-table.js`

### Description

Tableau de données Orion. Deux variantes : tableau plat et tableau arborescent (tree-view). Le hover sur une ligne révèle des boutons d'action ghost avec tooltip.

### Quand l'utiliser

- Sur les pages de liste (interventions, congés, intervenants, structures) — jamais dans une modale.
- Utiliser la variante **Simple** pour des données homogènes sans hiérarchie.
- Utiliser la variante **Arborescente** pour des données structurées (groupements > sociétés > établissements > agences).

### Variantes

#### Simple

Tableau à colonnes fixes. Structure :

- **Header** : fond `#eaf0ff`, texte `#263f7a` 500, icône `import_export` cliquable pour le tri
- **Lignes** : fond blanc, texte `#48546d`, border-bottom `#dee2e9`
- **Hover ligne** : fond `#eaf0ff` sur toute la ligne, les boutons d'action apparaissent
- **Colonne actions** : 4 boutons `button-icon-ghost` 36×36, radius 6px, visibles uniquement au hover
- **Tooltip** : apparaît au-dessus du bouton au survol (`bottom: calc(100% + 6px)`, fond `#1d2024`)

Boutons d'action standards : `cancel` (Refusé), `task_alt` (Validé), `remove_circle_outline` (Annulé), `edit` (Modifier). Les icônes et tooltips sont adaptés au contexte métier.

#### Arborescente

Tableau avec tree-view. Chaque ligne peut avoir des enfants, révélés par un chevron cliquable.

**Indentation** : chaque niveau enfant ajoute 24px de padding-left via les sélecteurs CSS `.dt__children .dt__row`, `.dt__children .dt__children .dt__row`, etc.

**Chevron** : `chevron_right` 16px, tourne à 90° (`dt__toggle--open`) quand le nœud est ouvert. Les nœuds feuilles affichent un chevron transparent (non interactif).

**Icônes par type d'entité :**

| Entité | Icône Material |
|---|---|
| Regroupement | `group` |
| Société | `domain` |
| Établissement | `domain` (+ tag "Étab. principale/secondaire") |
| Agence | `storefront` |

**Tags inline** dans la cellule Nom : `tag--neutral` (`#e6e8eb`) pour "Étab. principale" / "Étab. secondaire".

**Statut chip** : pill avec icône + texte. `dt__status--active` (`#e8fdef` / `#017437`), `dt__status--inactive` (`#ffe5e5` / `#9f0712`).

### Comportement

| Action | Résultat |
|---|---|
| Hover sur une ligne | Fond `#eaf0ff`, boutons d'action visibles (`opacity: 1`) |
| Clic sur le chevron | Nœud ouvert/fermé, chevron tourne, enfants affichés/masqués |
| Clic sur un bouton d'action | À connecter à la logique métier (hors scope du modèle) |
| Hover sur un bouton d'action | Tooltip affiché au-dessus avec le nom de l'action |

### Règles de composition

- La colonne "Nom" est `flex: 1` (prend l'espace disponible). Toutes les autres colonnes ont une largeur fixe en `px`.
- Les boutons d'action sont toujours dans une colonne dédiée à droite (`dt__actions`, `min-width: 160px`).
- Un tableau ne doit jamais avoir de scroll horizontal — adapter le nombre de colonnes à l'espace disponible.
- Ne pas mélanger la variante simple et la variante arborescente sur une même page.

### Dépendances composants

| Composant | Usage |
|---|---|
| `composants/tag.js` | Tags dans les cellules (statuts, types) |
| `composants/button-icon.js` | Boutons d'action ghost dans la colonne actions |

---

## Detail Block

**Fichier :** `modeles/detail-block.js`

### Description

Bloc de contenu utilisé sur les pages détail (fiche collaborateur, fiche société, fiche client, etc.). Carte blanche avec header, sections séparées par des dividers, et deux modes d'affichage des données.

### Quand l'utiliser

- Sur les pages de type "fiche" avec de nombreuses informations à afficher
- Jamais dans une modale (utiliser Modal List à la place)
- Un même écran peut contenir plusieurs Detail Blocks côte à côte ou empilés (un par catégorie d'information)

### Variantes

#### Champs texte

Affichage structuré de données sous forme valeur/label. Structure :

- **Header** : titre 18px bold + alert inline optionnelle + bouton ghost "Modifier" (icône `edit`)
- **Description** sous le titre : texte 14px `#717680`
- **Sections** séparées par des dividers `#dee2e9`, chacune avec un titre 14px 500 `#535862`
- **Grille de champs** (`db__grid`) : `flex` sur toute la largeur, colonnes `flex: 1` égales
- **Champ** : valeur 14px 500 `#1d2024` + label 14px `#a4a7ae` en dessous
- **"Non renseigné"** : texte italic, couleur `#8f2800` (warning) — classe `db__value--empty`
- **Chips** pour les listes (compétences, langues…) : fond `#eaf0ff`, couleur `#263f7a`, radius 16px, hauteur 30px — format "**Niveau** : Nom"
- **Champ avec éléments inline** (`db__field-row`) : valeur + tag star + bouton outlined mini "Disponibilités"

#### Result cards

Affichage de listes d'éléments liés (rendez-vous, interventions, documents) sous forme de cartes imbriquées. Structure :

- **Header** : titre 18px bold + bouton ghost "+ Action" (icône `add`)
- **Sous-sections titrées** ("A venir", "Historique") : 18px 500, séparent les groupes
- **Grille 2 colonnes** (`db__cards-grid`) : gap 32px horizontal, 16px vertical
- **Card** : border `#dee2e9`, radius 8px, padding 24px×14px, shadow xs
  - Header : date 16px 500 + horaires 14px + tag statut + bouton `button-icon-outlined` arrow_forward 36×36
  - 2 colonnes d'infos avec icônes Material Symbols
  - Tags activités avec couleurs spécifiques

**Couleurs des tags activités :**

| Activité | Fond | Texte |
|---|---|---|
| Garde d'enfants | `#e7e1df` | `#794f3f` |
| Ménage | `#fce9ef` | `#d01a5d` |
| Jardinage | `#ddead7` | `#4d7f34` |

### Comportement

| Action | Résultat |
|---|---|
| Clic bouton "Modifier" | Ouvre la modale d'édition (hors scope du modèle) |
| Clic bouton "+ Nouveau" | Ouvre la modale de création (hors scope du modèle) |
| Hover sur une card | Box-shadow renforcé + overlay sombre 2% |
| Clic arrow_forward d'une card | Navigation vers le détail (hors scope du modèle) |

### Règles de composition

- Le nombre de colonnes dans `db__grid` s'adapte au contenu — toujours `flex: 1` par colonne.
- Si une colonne est vide (padding visuel), utiliser `<div class="db__field"></div>`.
- La première section ne doit pas avoir de padding-top — classe `db__section:first-of-type`.
- La dernière section ne doit pas avoir de border-bottom — classe `db__section:last-child`.
- Les alerts inline dans le header sont optionnelles — n'apparaissent que si une validation métier l'exige.

### Dépendances composants

| Composant | Usage |
|---|---|
| `composants/tag.js` | Tags statut dans les cards |
| `composants/alert.js` | Alert inline dans le header |
| `composants/chips.js` | Chips de liste (compétences, langues) |
| `composants/button.js` | Boutons ghost (Modifier, Nouveau) et outlined mini |

---

## Drawer

**Fichier :** `modeles/drawer.js`

### Description

Panneau latéral fixe (position droite de l'écran). Permet de consulter les informations d'un élément sans quitter la page courante. Contient un header, des blocs d'informations clés, des tabs pour basculer entre vues, et un footer avec les actions principales.

### Quand l'utiliser

- Pour afficher le détail d'un élément sélectionné dans un tableau ou une liste, sans navigation complète
- Jamais en pleine page — toujours en superposition de la page courante
- Quand les données sont en lecture seule ou ne nécessitent qu'une action simple (Modifier / Consulter)

### Structure

**Header**
- Titre 20px bold + bouton fermer (×) alignés à droite
- Tags de statut (taille lg 32px) : Active (success), nombre d'entités (neutral), etc.

**Blocs info** — `drw__info-block`
- Fond `#fafafa`, radius 6px, padding `8px 12px`
- Titre de bloc 14px 500 + lignes icône+texte 12px
- Autant de blocs que nécessaire (un par catégorie : identifiant, représentant légal, etc.)

**Tabs** — `drw__tabs` + `drw__tab`
- Barre de tabs pleine largeur, divider `#e7e8e9`
- Tab actif : indicateur bleu `#013aba` 2px en bas, texte `#1d2024`
- Tab inactif : texte `#1d2024`, pas d'indicateur
- Contenu switché via JS (`drwSwitch()`)

**Contenu de tab — Organigramme**
- Fond `rgba(0,0,0,0.01)`, border `#dee2e9`, radius 6px
- Nœuds (`drw__org-node`) connectés par des traits verticaux 1px `#dee2e9`
- Chaque nœud : titre 16px bold + sous-titre 14px + tags optionnels
- Boutons "Créer" outlined en bas de l'organigramme

**Contenu de tab — Liste**
- Compteur de résultats en haut
- Cards empilées (`drw__list-item`) : titre + tag statut + lignes infos + lien "Consulter"
- Hover : box-shadow renforcé + overlay sombre 2%

**Footer fixe**
- Position `absolute bottom:0`, border-top `#dee2e9`, padding `16px 32px`
- Bouton Tonal (secondaire) + Bouton Filled (principal) alignés à droite
- Le footer masque le scroll — `padding-bottom: 80px` dans `.drw__scroll`

### Comportement

| Action | Résultat |
|---|---|
| Clic sur un tab | Contenu switché, indicateur actif mis à jour |
| Clic sur le bouton fermer | `display:none` sur `.drw` (à connecter à la logique de l'app) |
| Hover sur une card de liste | Shadow + overlay |
| Clic "Consulter" | Navigation vers la fiche (hors scope du modèle) |
| Clic "Modifier" / "Consulter" (footer) | Actions principales (hors scope du modèle) |

### Intégration dans une page

Le drawer est prévu pour être positionné en superposition à droite de l'écran dans l'application réelle :

```css
.drawer-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 560px;
  height: 100vh;
  z-index: 200;
  box-shadow: -4px 0 24px rgba(0,0,0,0.08);
}
```

Dans la page de modèles, il est rendu dans une `preview-card` de hauteur fixe (700px) sans padding, pour simuler l'aspect panneau latéral.

### Règles de composition

- Un seul drawer ouvert à la fois sur une page
- Le titre du drawer = nom de l'entité consultée
- Les tabs sont optionnels — si une seule vue, retirer les tabs et afficher le contenu directement
- Le footer est toujours présent si des actions sont disponibles. S'il n'y a pas d'action : supprimer le footer et retirer le `padding-bottom` du scroll
- Les blocs info sont limités à 2–3 maximum pour ne pas surcharger le header

### Dépendances composants

| Composant | Usage |
|---|---|
| `composants/tag.js` | Tags statut dans le header et les listes |
| `composants/button.js` | Boutons footer (Tonal + Filled) et outlined dans l'organigramme |
| `composants/tabs.js` | Référence pour le style des tabs |

---

## Règles UX transversales

### Filtres de tableau — Segmented control vs Select

Les statuts ou types d'éléments peuvent être filtrés de deux façons selon le nombre d'options disponibles.

**Utiliser le segmented control (`.segmented`)** quand :
- ≤ 4 options au total (incluant "Tous")
- Les labels sont courts : "Réalisé", "En cours", "Terminé", "Tous"
- Les options sont exhaustives et mutuellement exclusives
- Le filtre est le point d'entrée principal de la page

Exemple : `Tous | Intervenant | Opérationnel agence`

**Utiliser un select (`.ff--select`)** quand :
- \> 4 options
- Les labels sont longs ou variables (noms d'agences, types complexes)
- Le filtre est secondaire par rapport à la recherche

**Règle systématique** : le segmented control inclut toujours un onglet "Tous" en première position, sélectionné par défaut.

### Fond de page

| Type de page | Fond |
|---|---|
| Page liste / tableau | `#ffffff` blanc |
| Page détail / fiche | `#fafafa` gris très clair (style dashboard) |
| Page dashboard tableau (KPIs) | `#ffffff` blanc |
