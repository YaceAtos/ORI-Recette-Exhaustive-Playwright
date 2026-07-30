# INT2 Super Report

- Generated at: 2026-07-21T08:47:24.800Z
- Source: int2-ihm-recordings/int2-autonomous/int2-multi-agent-exhaustive.yaml
- Base URL: https://orion-int2.itsap.net
- Briques: 6
- Pages: 17
- Success pages: 17
- Error pages: 0
- Fields total: 71
- Buttons total: 145
- Links total: 529

## Brique Matrix

| Brique | Pages |
|---|---:|
| crm | 3 |
| facturation-paie | 3 |
| gestion-admin | 1 |
| gestion-marque | 6 |
| offres-tarifs | 2 |
| sap | 2 |

## Global Semantic Coverage

| Semantic Type | Count |
|---|---:|
| ui.select | 33 |
| ui.search | 27 |
| unknown | 8 |
| person.last_name | 3 |

## Page Matrix

| Page | Fields | Buttons | Links | Dialogs | Related Pages | Success |
|---|---:|---:|---:|---:|---:|---|
| /crm/pages/clients-professionnels | 3 | 14 | 31 | 0 | 8 | yes |
| /crm/pages/clients-prospects | 5 | 11 | 31 | 0 | 8 | yes |
| /crm/pages/leads | 4 | 9 | 31 | 0 | 8 | yes |
| /facturation-paie/facturation/pages/table-des-faits | 6 | 12 | 31 | 0 | 0 | yes |
| /facturation-paie/reglementaire/pages | 1 | 1 | 31 | 0 | 0 | yes |
| /facturation-paie/reglementaire/pages/organisme-financeur | 12 | 11 | 32 | 0 | 8 | yes |
| /gestion-admin/pages/collaborateur | 5 | 13 | 31 | 0 | 8 | yes |
| /gestion-marque/configuration/pages/categories | 4 | 7 | 31 | 0 | 8 | yes |
| /gestion-marque/configuration/pages/dmn | 4 | 7 | 31 | 0 | 7 | yes |
| /gestion-marque/habilitation/pages/habilitation-profils | 3 | 3 | 31 | 0 | 0 | yes |
| /gestion-marque/habilitation/pages/habilitation-users | 3 | 1 | 31 | 0 | 0 | yes |
| /gestion-marque/structure/pages/marque | 4 | 6 | 31 | 0 | 0 | yes |
| /gestion-marque/structure/pages/structure | 2 | 17 | 31 | 0 | 1 | yes |
| /offres-tarifs/pages/catalogue/familles | 4 | 13 | 31 | 0 | 8 | yes |
| /offres-tarifs/pages/catalogue/options | 6 | 10 | 31 | 0 | 8 | yes |
| /sap/ | 1 | 1 | 31 | 0 | 0 | yes |
| /sap/pages/planning | 4 | 9 | 32 | 0 | 2 | yes |

## Inter-Page Communication

### /crm/pages/clients-professionnels
- /crm/pages/clients-prospects (overlap=12)
- /gestion-admin/pages/collaborateur (overlap=11)
- /crm/pages/leads (overlap=10)
- /offres-tarifs/pages/catalogue/options (overlap=10)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=9)
- /offres-tarifs/pages/catalogue/familles (overlap=9)
- /gestion-marque/configuration/pages/categories (overlap=9)
- /sap/pages/planning (overlap=8)

### /crm/pages/clients-prospects
- /gestion-admin/pages/collaborateur (overlap=14)
- /crm/pages/leads (overlap=13)
- /crm/pages/clients-professionnels (overlap=12)
- /offres-tarifs/pages/catalogue/familles (overlap=11)
- /offres-tarifs/pages/catalogue/options (overlap=11)
- /gestion-marque/configuration/pages/categories (overlap=11)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=10)
- /sap/pages/planning (overlap=9)

### /crm/pages/leads
- /gestion-admin/pages/collaborateur (overlap=14)
- /crm/pages/clients-prospects (overlap=13)
- /offres-tarifs/pages/catalogue/familles (overlap=12)
- /gestion-marque/configuration/pages/categories (overlap=12)
- /offres-tarifs/pages/catalogue/options (overlap=11)
- /crm/pages/clients-professionnels (overlap=10)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=10)
- /gestion-marque/configuration/pages/dmn (overlap=10)

### /facturation-paie/facturation/pages/table-des-faits
- Related: none

### /facturation-paie/reglementaire/pages
- Related: none

### /facturation-paie/reglementaire/pages/organisme-financeur
- /gestion-admin/pages/collaborateur (overlap=11)
- /crm/pages/leads (overlap=10)
- /crm/pages/clients-prospects (overlap=10)
- /offres-tarifs/pages/catalogue/familles (overlap=10)
- /gestion-marque/configuration/pages/categories (overlap=10)
- /crm/pages/clients-professionnels (overlap=9)
- /offres-tarifs/pages/catalogue/options (overlap=9)
- /gestion-marque/configuration/pages/dmn (overlap=8)

### /gestion-admin/pages/collaborateur
- /crm/pages/leads (overlap=14)
- /crm/pages/clients-prospects (overlap=14)
- /offres-tarifs/pages/catalogue/familles (overlap=12)
- /gestion-marque/configuration/pages/categories (overlap=12)
- /crm/pages/clients-professionnels (overlap=11)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=11)
- /offres-tarifs/pages/catalogue/options (overlap=11)
- /gestion-marque/configuration/pages/dmn (overlap=10)

### /gestion-marque/configuration/pages/categories
- /offres-tarifs/pages/catalogue/familles (overlap=13)
- /gestion-admin/pages/collaborateur (overlap=12)
- /crm/pages/leads (overlap=12)
- /offres-tarifs/pages/catalogue/options (overlap=12)
- /crm/pages/clients-prospects (overlap=11)
- /gestion-marque/configuration/pages/dmn (overlap=11)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=10)
- /crm/pages/clients-professionnels (overlap=9)

### /gestion-marque/configuration/pages/dmn
- /gestion-marque/configuration/pages/categories (overlap=11)
- /gestion-admin/pages/collaborateur (overlap=10)
- /crm/pages/leads (overlap=10)
- /offres-tarifs/pages/catalogue/familles (overlap=10)
- /crm/pages/clients-prospects (overlap=9)
- /offres-tarifs/pages/catalogue/options (overlap=9)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=8)

### /gestion-marque/habilitation/pages/habilitation-profils
- Related: none

### /gestion-marque/habilitation/pages/habilitation-users
- Related: none

### /gestion-marque/structure/pages/marque
- Related: none

### /gestion-marque/structure/pages/structure
- /offres-tarifs/pages/catalogue/familles (overlap=8)

### /offres-tarifs/pages/catalogue/familles
- /gestion-marque/configuration/pages/categories (overlap=13)
- /gestion-admin/pages/collaborateur (overlap=12)
- /crm/pages/leads (overlap=12)
- /crm/pages/clients-prospects (overlap=11)
- /offres-tarifs/pages/catalogue/options (overlap=11)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=10)
- /gestion-marque/configuration/pages/dmn (overlap=10)
- /crm/pages/clients-professionnels (overlap=9)

### /offres-tarifs/pages/catalogue/options
- /gestion-marque/configuration/pages/categories (overlap=12)
- /gestion-admin/pages/collaborateur (overlap=11)
- /crm/pages/leads (overlap=11)
- /crm/pages/clients-prospects (overlap=11)
- /offres-tarifs/pages/catalogue/familles (overlap=11)
- /crm/pages/clients-professionnels (overlap=10)
- /facturation-paie/reglementaire/pages/organisme-financeur (overlap=9)
- /gestion-marque/configuration/pages/dmn (overlap=9)

### /sap/
- Related: none

### /sap/pages/planning
- /crm/pages/clients-prospects (overlap=9)
- /crm/pages/clients-professionnels (overlap=8)

