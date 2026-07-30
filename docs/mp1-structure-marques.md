# MP1 — Structure & Marques

> Hiérarchie organisationnelle (Marque→Regroupement→Société→Établissement→Agence) + habilitations (profils, droits, utilisateurs, groupes, cône de visibilité). CRUD structure, provisioning Keycloak/SPOK.

| Meta | Valeur |
|------|--------|
| **Tags** | structure, marques, société, établissement, agence, regroupement, habilitations, profils, droits, cône de visibilité, Keycloak, SPOK, CRUD, SP1.5, import export, RGPD, MP1 |
| **Racine Confluence** | 353206315 (MP1 Marques & Structures) |

## Pages sources
| Sujet | page_id | RG | Statut |
|---|---|---|---|
| SP1.0 référentiel marques | 362348652 | — | actif |
| SP1.1 référentiel structures | 362905609 | — | actif |
| SP1.1 écrans Société/Étb/Agence | 668598274, 675250177, 668565505, 640319526, 574750721, 566362113 | — | actif |
| SP1.5 habilitations | 362905617 | RG_HAB_* | actif |
| SP1.5 règles de gestion | 363036673 | RG_HAB_* | actif |
| SP1.5 E1.5.1 utilisateur / .2 groupe / .3 archivage / .4 profils-droits / .5 import CSV | 755531794, 754647065, 755597321, 745111553, 755466270 | RG_HAB_* | actif (E1.5.5 hors cadrage) |
| Nommer admin Marque | 368738323 | — | ⚠️ vide (A faire) |

## Nomenclature RG
- RG_HAB_LISPR_* / CREPR_* / DPREN_* : profils (liste, création, détail)
- RG_HAB_DPRCU_* / DPRDF_* / DPRDS_* / DPRME_* : matrice droits (cas d'usage, droits fins, droits spéciaux, mode édition)

## Pièges connus
- Provisioning : SPOK via Kafka (émetteurs MP3 collaborateurs, MP4 clients) ; 1 realm Keycloak/tenant.
- Cône de visibilité dynamique (hérité du contrat) : rattaché E1.5.1, non finalisé.
- Délégation temporaire/astreinte : "hors périmètre V1 probable" (interface SP5.3).
- Import/export CSV (E1.5.5) : hors cadrage. RG formelles seulement sur E1.5.4 ; E1.5.1/2/3/5 sans RG.

## Détail
→ déléguer `confluence-explorer` sur le page_id pertinent (lecture live, sourcée).
