# 09 — Index maquettes Figma

> Index de référence des node-id Figma pour le projet Orion (file key `EfsOdCwqfy1Yi0knogfPNc`). Recense les écrans disponibles : Planning Vue Clients, Vue Intervenants, composants partagés, interventions. Utilisé par les agents pour accéder aux maquettes via les outils figma_get_screenshot / figma_get_design_context.

| Meta | Valeur |
|------|--------|
| **Tags** | Figma, maquettes, node-id, planning, Vue Clients, Vue Intervenants, interventions, client, collaborateur, PIM, structure, marque, habilitation, aides, facturation, composants, écrans |
| **Source** | Figma `EfsOdCwqfy1Yi0knogfPNc` (file key) — pointeurs node-id |

## Fichier source

**File key** : `EfsOdCwqfy1Yi0knogfPNc`
**URL** : `https://www.figma.com/design/EfsOdCwqfy1Yi0knogfPNc/Orion---Maquettes`

## Planning — Vue Clients

| Écran | node-id |
|-------|---------|
| Vue Jour | `3919-87892` |
| Vue Semaine | `3919-88349` |
| Vue Mois | `3919-88843` |
| Filtres | `3919-88141` |
| Jour (colorisation) | `5663-48145` |
| Semaine (colorisation) | `5663-49201` |
| Mois (colorisation) | `5663-49690` |
| Intervention annulée | `14758-297538` |
| État pointages | `19077-235953` |
| Infobulles/icônes pointage | `19891-143283` |
| Filtre statuts | `20575-92188` |
| Filtre types éléments | `20575-92157` |

## Planning — Vue Intervenants

| Écran | node-id |
|-------|---------|
| Vue Jour | `3919-82384` |
| Vue Semaine | `3919-84129` |
| Vue Mois | `3919-84954` |
| Filtres | `3919-83444` |
| Jour (colorisation) | `5663-43113` |
| Semaine (colorisation) | `5663-43687` |
| Mois (colorisation) | `5663-45171` |
| Zone "À pourvoir" | `5663-50812` |

## Planning — Composants partagés

| Composant | node-id |
|-----------|---------|
| Types éléments planning | `3919-83349` |
| Minification éléments | `3919-83430` |

## Interventions

| Écran | node-id |
|-------|---------|
| Modifier intervention | `19858-100866` |

## Commercial — Client (MP4)

| Écran | node-id | Description |
|-------|---------|-------------|
| Liste clients | `7768-176042` | Tableau paginé avec filtres |
| Liste leads | `9002-236311` | Tableau leads paginé |
| Créer prospect PP | `11826-111918` | Formulaire prospect particulier (ORI-193, 390, 392) |
| Création lead/prospect | `11851-70754` | Parcours création |
| Agences et services prospect | `13230-94513` | Association agences au prospect PP |
| Client Pro liste + éligibilité | `9947-36639` | Liste consultation Pro (🚧 en cours) |
| Créer un lead (contact) | `7768-156100` | Formulaire lead (🚧 en cours) |

## Collaborateur (MP3)

| Écran | node-id | Description |
|-------|---------|-------------|
| Consulter fiche intervenant | `3231-118068` | Fiche complète (ORI-227) : profil, coordonnées, identité, qualifications |
| Liste collaborateurs | `3231-126256` | Tableau liste avec filtres et pagination |
| Fiche détaillée | `5354-187578` | Vue complète profil + planning + cartes KPI |

## Catalogue PIM (MP2)

| Écran | node-id | Description |
|-------|---------|-------------|
| Consulter/Créer famille produits | `17107-21893` | CRUD famille de produits |

## Structure & Marque (MP1)

| Écran | node-id | Description |
|-------|---------|-------------|
| Sociétés et Agences | `11623-196772` | CRUD structure (ORI-57, 56) |
| Établissements | `11623-198366` | Gestion établissements (ORI-505, 506, 507) |
| Structure — ORI-411 | `11623-198192` | Complément structure |
| Structure — ORI-260 | `14306-35165` | Complément structure |
| Structure — ORI-741 | `17189-130926` | Complément structure |
| Fiche marque | `1646-57630` | Détail marque |
| Image de marque | `1083-11623` | Paramétrage image marque |
| Liste marques | `7365-129660` | Consultation + recherche (ORI-43, 128) |

## Habilitations (MP1)

| Écran | node-id | Description |
|-------|---------|-------------|
| Gestion habilitations | `22284-159890` | Profils et droits (ORI-856, 858) |

## Aides & Facturation (MP6)

| Écran | node-id | Description |
|-------|---------|-------------|
| Liste Organismes Financeurs | `8616-23418` | Tableau OF |
| Créer organisme financeur | `7120-298948` | Formulaire création OF |
| Lier établissement / OF | `8452-47127` | Association (ORI-342) |
| Configuration dispositif aides | `11649-29195` | Config aides (ORI-616, 585, 587, 586) |
| Configuration Plan aide perso | `20277-59685` | PAP personnalisé |
| Collecte interventions (Facturation) | `23211-28391` | Écran collecte pour facturation |

## Pages Figma — Référence navigation

| Page | Page-id | Domaine |
|------|---------|---------|
| Planning | `175-24959` | 06 |
| Client | `7768-133467` | 05 |
| Collaborateur | `203-4562` | 04 |
| PIM | `14664-818` | 03 |
| Structure | `11376-170360` | 02 |
| Marque | `730-17533` | 02 |
| Habilitation | `22284-154073` | 02 |
| Aides | `5565-148241` | 07 |
| Facturation | `23211-25269` | 07 |
| Recherche | `3231-129058` | transverse |
| Cartographie | `18822-53947` | — |
| Intégration IA | `13006-368772` | — |

## Utilisation

Pour obtenir un screenshot d'un écran :
```
figma_get_screenshot(fileKey="EfsOdCwqfy1Yi0knogfPNc", nodeId="<node-id>")
```

Pour obtenir le code de référence :
```
figma_get_design_context(fileKey="EfsOdCwqfy1Yi0knogfPNc", nodeId="<node-id>")
```
