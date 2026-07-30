# Orion — Spécification fonctionnelle (carte LLM)

> Application SaaS de gestion des services à la personne (OuiCare) : structure juridique → catalogue → commercial → planning → facturation.
> **Modèle** : `docs/` = carte (métadonnées + pointeurs `page_id` Confluence + nomenclature RG + pièges). Le détail fonctionnel n'est PAS stocké ici — il est lu en live sur Confluence via `confluence-explorer`. Prérequis : MCP Atlassian actif.

## Navigation (agent)

- Entité / règle / "qu'est-ce que" → colonne Tags ci-dessous → ouvrir la carte domaine.
- Écran / visuel → `09-maquettes-figma.md` → node-id → MCP Figma.
- Vocabulaire → Glossaire (bas).
- Code RG → Nomenclature RG (bas) → carte domaine.
- **DÉTAIL fonctionnel** (texte de règle, flux, écran) : non local. La carte donne le `page_id` → déléguer `confluence-explorer` (lecture live, sourcée). Respecter les "Pièges connus" de la carte (doublons, pages vides/A SUPPRIMER, brouillons).

## Fichiers

| MP / type | Fichier | page_id racine | Contenu (carte) | Tags |
|-----------|---------|----------------|-----------------|------|
| Transverse | `00-contexte-produit.md` | 139689990 | Vision, personas, périmètre, stack (copie) | Orion, OuiCare, SaaS, SAP, personas, stack, Angular, Keycloak, micro-services, RRULE |
| Transverse | `01-regles-transverses.md` | 443514899 | RG UI génériques (pagination, modales, erreurs, bandeau, notifications) — copie | UI, formulaires, modales, pagination, filtres, navigation, notifications, bandeau agence, messages erreur, transverse |
| MP1 | `mp1-structure-marques.md` | 353206315 | Hiérarchie marque/société/agence, habilitations, Keycloak/SPOK | structure, marques, société, établissement, agence, habilitations, profils, droits, cône de visibilité, Keycloak, SPOK, SP1.5, RGPD, MP1 |
| MP2 | `mp2-catalogue-produits.md` | 353140760 | PIM : catégories/familles/produits, options, frais, TVA | catalogue, PIM, produit, famille, catégorie, package, service, bien physique, frais, options, TVA, compétences, DMN, MP2 |
| MP3 | `mp3-collaborateurs.md` | 353206316 | Intervenants, opérationnels, contrats, GTA, ATT, paie | collaborateurs, intervenant, opérationnel agence, contrat, GTA, absences, compétences, ATT, paie, UKG, Pléiade, RGPD, MP3 |
| MP4 | `mp4-gestion-commerciale.md` | 353075280 | Clients PP/Pro, qualification, devis, socle SEGUR | commercial, client PP, client Pro, prospect, lead, devis, SEGUR, INS, DMP, MSSanté, DUI, iCanopée, SIRENE, SAAD, consentement, MP4 |
| MP5 | `mp5-planning-interventions.md` | 353173556 | Planning, CRUD interventions, RRULE, pointage, absences, flux MP5↔MP6 | planning, interventions, RRULE, annulation, pointage, forçage, matching, absences, intermissions, notifications, Kafka, batch, MP5 |
| MP5 | `mp5-cadre-operationnel.md` | 712310799 | SP5.1 Cadre Opérationnel : routage facturation/paie (5 axes, DT1/DT2, DMN) | cadre opérationnel, CO, routage, DT1, DT2, succursale, franchise, prestataire, mandataire, DMN, SP5.1, MP5 |
| MP6 | `mp6-facturation-aides.md` | 353173557 | Aides (OF/CDA/PAP), collecte facturation (table de faits), paie SP6.3, DMN routage | facturation, aides financières, PEC, organisme financeur, OF, APA, PCH, CDA, PAP, table de faits, collecte, EN_ANOMALIE, cockpit, CI_ENT, paie, SP6.3, Pléiade, OGUST, mandataire, MP6, MP7-legacy |
| Transverse | `08-interfaces-flux.md` | 443089024 | Flux inter-domaines (FD_*), ODR, APIs externes | interfaces, flux, FD, micro-services, cartographie, Kafka, ODR, DMN, dual-write, Outbox, Debezium, Pléiade, MSE, SIRENE, GEOWS, iCanopée, Keycloak, transverse |
| Transverse | `09-maquettes-figma.md` | Figma EfsOdCwqfy1Yi0knogfPNc | Index node-id Figma par écran | Figma, maquettes, node-id, écrans, design, file key |

## Nomenclature RG (→ carte)

- `RG_HAB_*` → mp1 (habilitations)
- `RG_PROD_*`, `RG_PRODUIT_CREATE_*` → mp2 (catalogue)
- `RG_LEAD_*`, `RG_PRO_*`, `RG_PERS_*` + `SC.SSI/INS/MSS/DMP.*`, `DUI.*` → mp4 (commercial/Ségur)
- `RG_GIN_*`, `RG_INT_*` → mp5-planning
- `RG_CO_*` → mp5-cadre-operationnel
- `RG_IHM_*`, `CA_TF_*` → mp6 (table de faits)
- `RG_GEN_*` (UI génériques : formulaires/plages horaires, modales, pagination, erreurs, notifications) → `01-regles-transverses` (copie pleine, lecture directe)
- MP3 : RG à capter (doublon SP3.2 non tranché).

## Glossaire

| Terme | Définition |
|-------|-----------|
| Marque | Entité commerciale racine (ex: OuiCare, OuiHelp). 1 instance Orion = 1 marque |
| Société | Entité juridique (SIREN). Succursale ou franchisée |
| Établissement | Entité légale SIRET (principal ou secondaire) |
| Agence | Unité de production opérationnelle. Porte zones géo + activités |
| Regroupement | Niveau organisationnel pur (aucune règle métier) |
| Intervenant | Collaborateur réalisant les prestations chez les clients |
| Opérationnel agence | Collaborateur gérant le planning/commercial en agence |
| Cône de visibilité | Périmètre agences/sociétés accessible à un utilisateur |
| Profil | Gabarit de droits (cas d'usage × autorisation LS ou L/E) |
| Série d'interventions | Suite récurrente d'interventions (RRULE iCalendar) |
| CO | Cadre Opérationnel (qualification contrat → routage factu/paie, SP5.1) |
| PEC | Prise En Charge (aide financière client) |
| OF | Organisme Financeur (conseil départemental, Carsat, MSA, mutuelle…) |
| PAP | Plan d'Aide Personnalisé |
| SAP | Services À la Personne (pas le logiciel SAP) |
| PP / PM | Personne Physique (particulier) / Personne Morale (professionnel) |
| Paye | Sous-process SP6.3 (page_id 363757660), sous MP6 « Facturation client et Paie ». « MP7 » dans tags/flux = ancienne numérotation, pas un macro-process distinct |

## Source

- Confluence : `itsap-ouicare.atlassian.net/wiki/spaces/Orion/` (racine doc fonctionnelle 353140758)
- Jira : projet ORI
- Figma : `EfsOdCwqfy1Yi0knogfPNc` (Orion — Maquettes)
- Lecture détail : `confluence-explorer` (MCP Atlassian). Validation pointeurs : skill `orion-spec-sync`.
