# MP2 — Catalogue Produits (PIM)

> PIM : hiérarchie Catégorie→Famille→Produit (service / bien physique / package), options, frais, TVA. Multi-niveaux siège/local. Alimente devis, planning, facturation.

| Meta | Valeur |
|------|--------|
| **Tags** | catalogue, PIM, produit, famille, catégorie, package, service, bien physique, frais, options, remises, majorations, TVA, unité de facturation, compétences, CRUD, DMN, MP2 |
| **Racine Confluence** | 353140760 (MP2 Offres & Tarifs) |

## Pages sources
| Sujet | page_id | RG | Statut |
|---|---|---|---|
| SP2.1 PIM | 720896001 | — | actif |
| E2.1.1 catégories | 796131335 | — | actif |
| E2.1.2 familles | 730398722 | — | actif |
| E2.1.3 produit (A liste / B créer / C consulter / D MAJ) | 723320839, 723320854, 731414530, 731938817, 730365954 | RG_PROD_LIST_*, RG_PRODUIT_CREATE_*, RG_PROD_CONSULT_*, RG_PROD_UPD_* | actif |
| E2.1.4 options | 769720321 | — | ⚠️ incohérent (décrit des frais) |
| E2.1.5 frais | 769589249 | — | EN COURS (squelette) |
| SP2.2 Tarif / SP2.3 CGV | 721649669, 720470027 | — | vide (v1) |

## Nomenclature RG
- RG_PROD_LIST_01→17 (liste), RG_PRODUIT_CREATE_01→16 (création), RG_PROD_CONSULT_01→10 (consultation), RG_PROD_UPD_01→14 (MAJ).

## Pièges connus
- "Produit = Service" (décidé 18/03). Type (Service/Bien/Package) = 1er champ, conditionne le formulaire dynamique.
- Package non rattaché à une famille (en attente validation) ; bouton "Créer package" masqué.
- Versioning TVA avec date d'effet = ABANDONNÉ (RG_PROD_UPD_10 + CA barrés Confluence).
- Remises/Majorations E2.1.6 = page absente. Validation franchisé + traçabilité historique = hors MVP.

## Détail
→ déléguer `confluence-explorer` sur le page_id pertinent (lecture live, sourcée).
