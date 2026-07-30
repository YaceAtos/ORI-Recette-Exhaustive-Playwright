# MP4 — Gestion commerciale

> Clients PP/Pro, qualification lead, devis, contractualisation + socle SEGUR e-santé (INS, DUI, MSSanté, DMP). Onboarding jusqu'au contrat.

| Meta | Valeur |
|------|--------|
| **Tags** | commercial, client PP, client Pro, prospect, lead, qualification, devis, SEGUR, INS, DMP, MSSanté, DUI, iCanopée, PSC, SIRENE, multi-sites, SAAD, consentement, RGPD, MP4 |
| **Racine Confluence** | 353075280 (MP4 Clients) |

## Pages sources
| Sujet | page_id | RG | Statut |
|---|---|---|---|
| SP4.1 clients particuliers | 365265040 | RG_LEAD_*, RG_PRO_* | actif (v20) |
| SP4.1 règles de gestion | 367198249 | RG_LEAD_*/RG_PRO_*/RG_PERS_* | actif (v77) |
| E4.1.1.A1 / C2 qualif lead PP | 366444574, 683737089 | RG_LEAD_* | actif |
| E4.1.1.Ax aides financières PP | 442433537 | — | EN COURS (collecte ; calcul→MP6) |
| E4.1.2 client Pro | 396787761 | RG_PRO_* | actif |
| SP4.2 recueil besoins / SP4.3 devis | 366149649, 366346301 | — | actif |
| SP4.4 socle SEGUR | 366673921 | SC.SSI/INS/MSS/DMP, DUI.* | actif (v15) |
| E4.4.1→8 (SSI, INS, DUI, MSSanté, DMP, docs CDA, reporting, portabilité) | 712278083, 722960385, 723779599, 724140043, 837582879, 660701194, 887128065, 901283901 | idem | actif (E4.4.1 CA vides) |
| Annexe I IAM (SPOK/LDAP/Keycloak) | 997851189 | — | actif (points [À VALIDER]) |

## Nomenclature RG
- RG_LEAD_* (qualif lead), RG_PRO_* (client pro : SIREN/Luhn/SIRENE), RG_PERS_* (modales fiche).
- SEGUR : SC.SSI/*, SC.INS.*, SENTINELLE.*, DUI.*, SC.MSS/*, SC.DMP/*, MS.RPT/*, PORT/*.

## Pièges connus
- Ségur vagues Va1 (PSC, conformité INS, DUI 9 US, MSSanté config) / Va2 (reste). E4.4.1 critères d'acceptation vides.
- iCanopée = auth Pro Santé Connect (flux CIBA, Mode 2 step-up Keycloak). Orion = Référentiel d'Identités (INS).
- Aides financières PP = collecte uniquement (calcul délégué MP6 SP6.1) ; RG non codifiées.
- Lead C2 : consentement RGPD RG_LEAD_PRDP_01 = à définir. Liste services bouchonnée V1 (cône réel en V2).
- Client Pro : hiérarchie entité juridique (mère) / sites (filles), contrat attaché au site.

## Détail
→ déléguer `confluence-explorer` sur le page_id pertinent (lecture live, sourcée).
