# MP6 — Facturation & Aides

> Règlothèque aides (OF, CDA, PAP), collecte facturation (table de faits), routage DMN. SP6.1 aides / SP6.2 facturation / SP6.3 paie.

| Meta | Valeur |
|------|--------|
| **Tags** | facturation, aides financières, PEC, règlothèque, organisme financeur, OF, APA, PCH, PAJE, crédit impôt, CAF, URSSAF, CDA, PAP, plan d'aide, table de faits, collecte, EN_ANOMALIE, cockpit, DMN routage, CI_ENT, paie, SP6.3, Pléiade, OGUST, PeopleDoc, bulletin, cotisations, mandataire, MP6, MP7-legacy |
| **Racine Confluence** | 353173557 (MP6 Facturation client et Paie) |

## Pages sources
| Sujet | page_id | RG | Statut |
|---|---|---|---|
| SP6.1 aides financeurs | 363954207 | — | actif |
| SP6.2 collecte facturation | 363757650 | — | actif |
| SP6.3 paie (Pléiade/OGUST, mandataire) | 363757660 | — | actif |
| SP6.4 rapports | 364019802 | — | actif |
| Table de faits E6.2.1.A | 926941197 | RG_IHM_* | actif (v50) |
| IHM cockpit drawer E6.2.1.B | 969375746 | RG_IHM_* | ⚠️ A SUPPRIMER (fusion) |
| CI_ENT_01 (MP5) / _02 (MP4) / _03 (paie mand.) | 1027571738, 1027506196, 1027211292 | — | vide (v1) |

## Contenu (résumé)
- Table de faits = 3 couches : (1) accumulation Kafka temps réel, (2) IHM cockpit lecture seule, (3) émission consommateurs (hors scope). 6 blocs / 102 attributs (V3.3). ORION-FIRST. DMN `MP6_DT_RoutageFacturation_V4`.
- 6 blocs : 1 identité/cycle · 2 contractuel/acteurs · 3 réalisation · 4 aide/PEC (CAS1 PREST+PP) ou conditions commerciales (CAS2 PREST+PM) · 5 produit/tarif/montants · 6 paie mandataire (CAS3 MAND+PP).
- Statuts fait : COLLECTE / EN_ANOMALIE (motif DMN, correction à la source, +7 JOURS) / ARCHIVE.

## Nomenclature RG
- RG_IHM_PANEL_01→11, RG_IHM_STATUT_05, RG_IHM_NOTIF_01/02, RG_IHM_READONLY_01, RG_IHM_NAV_01→03 (EN SUSPENS). Critères CA_TF_25→37.

## Pièges connus
- IHM 969375746 marquée "A SUPPRIMER" → ne pas lire comme finale (convergente avec 926941197).
- CI_ENT (3 pages filles) vides → spec interfaces entrée à rédiger.
- Routage facturation/paie réel = porté par Cadre Opérationnel SP5.1 (`mp5-cadre-operationnel.md`) ; PAP stocké MP6, double lecture SP6.2 (CO + PAP).
- Navigation TF↔Factures (RG_IHM_NAV) = EN SUSPENS. Notifications push = hors périmètre (VG QO-08).
- Paye = SP6.3 (sous MP6). « MP7 » (tags/flux) = ancienne numérotation, pas un macro-process distinct. Routage paie = DT2 du Cadre Opérationnel (`mp5-cadre-operationnel.md`) ; flux externe Pléiade = ODR-9 (`08-interfaces-flux.md`).

## Détail
→ déléguer `confluence-explorer` sur le page_id pertinent (lecture live, sourcée).
