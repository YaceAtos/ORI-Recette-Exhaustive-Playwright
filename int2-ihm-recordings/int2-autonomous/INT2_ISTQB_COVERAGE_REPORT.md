# INT2 / Orion — Rapport de couverture ISTQB (mode dégradé)

> ⚠️ **Limite de scope** — Analyse limitée aux RG déjà présentes dans hybrid-report.json (Excel Sprint 11-12-13 → Playwright). Accès Confluence live actuellement bloqué (espace Orion non autorisé) : impossible de vérifier l'exhaustivité par rapport à l'univers complet des RG définies fonctionnellement. À relancer en mode complet dès accès restauré.

- Généré le : 2026-08-05T13:53:49.303Z
- Règles de gestion (RG) analysées : 207
- Cas de test analysés : 252
- Score de complétude moyen (toutes RG) : 19.5%

## Distribution par technique ISTQB

| Technique | Cas de test | % |
|---|---:|---:|
| Use Case / Scenario | 96 | 38.1% |
| Decision Table | 88 | 34.9% |
| Boundary/Equivalence | 40 | 15.9% |
| State Transition | 28 | 11.1% |

## Règles couvertes par une seule technique (158) — risque d'angle mort

> Ces RG ne sont vérifiées que sous UN seul angle (ex: partition seule, sans table de décision ni transition d'état). Recommandation ISTQB : croiser au moins 2 techniques pour les RG à enjeu (obligatoire + combinaison de conditions par exemple).

| RG | Module | Technique unique | Cas de test | Complétude |
|---|---|---|---:|---:|
| RG_FAM_UPD_13 | MP2 | Use Case / Scenario | 1 | 0% |
| RG_OPT_CREATE_07 | MP2 | Decision Table | 1 | 0% |
| RG_INT_NOTIF_01 | MP3 | Use Case / Scenario | 1 | 0% |
| RG_INT_CPTA_1 | MP3 | Use Case / Scenario | 1 | 0% |
| RG_BSN_TRILST_02 | MP4 | Use Case / Scenario | 1 | 0% |
| RG_BSN_QUAL_01 | MP4 | Use Case / Scenario | 1 | 0% |
| RG_BSN_QUAL_07 | MP4 | Boundary/Equivalence | 1 | 0% |
| RG_BSN_QUAL_05 | MP4 | Use Case / Scenario | 1 | 0% |
| RG_PLA_TLP_01 | MP5 | Use Case / Scenario | 1 | 0% |
| RG_MOD_SIN_07 | MP5 | Use Case / Scenario | 1 | 0% |
| RG_MOD_SIN_08 | MP5 | Use Case / Scenario | 1 | 0% |
| RG_STRUCT_OBLG_4_TAB | MP1 | Use Case / Scenario | 1 | 3% |
| RG_OPT_CREATE_16 | MP2 | State Transition | 1 | 3% |
| RG_FAM_UPD_02 | MP2 | Use Case / Scenario | 2 | 3% |
| RG_BSN_QUAL_06 | MP4 | State Transition | 2 | 3% |
| RG_INT_CPTL_1 | MP3 | Use Case / Scenario | 1 | 4% |
| RG_INT_CPTP_1 | MP3 | Boundary/Equivalence | 1 | 5% |
| RG_INT_CPTO_1 | MP3 | Use Case / Scenario | 1 | 5% |
| RG_BSN_ACT_01 | MP4 | Decision Table | 1 | 5% |
| RG_BSN_QUAL_04 | MP4 | Decision Table | 1 | 5% |
| RG_GEN_PREC_01 | MP4 | Decision Table | 1 | 5% |
| RG_MOD | MP5 | Use Case / Scenario | 3 | 6% |
| RG_STE_ADRESS_HERIT_ETAB | MP1 | Use Case / Scenario | 1 | 6% |
| RG_FAM_UPD_01 | MP2 | Use Case / Scenario | 1 | 6% |
| RG_OPT_LIST_12 | MP2 | Use Case / Scenario | 1 | 6% |
| RG_OPT_LIST_10 | MP2 | Use Case / Scenario | 1 | 6% |
| RG_CONT_TickResto_44 | MP3 | Boundary/Equivalence | 2 | 6% |
| RG_INT_CPTD_1 | MP3 | Boundary/Equivalence | 1 | 6% |
| RG_INT_CPTV_1 | MP3 | Use Case / Scenario | 1 | 6% |
| RG_INT_ABSANN_1 | MP3 | State Transition | 1 | 6% |

_... et 128 de plus, voir istqb-coverage.json_

## Règles à faible complétude (< 50%, 179)

| RG | Module | Complétude moyenne | Cas bloquants |
|---|---|---:|---|
| RG_FAM_UPD_13 | MP2 | 0% | ORI-657/CT-PIM-D-07 |
| RG_OPT_CREATE_07 | MP2 | 0% | ORI-1067/CT-OPT-B-10 |
| RG_INT_NOTIF_01 | MP3 | 0% | ORI-91/CT-NOTIF-14 |
| RG_INT_CPTA_1 | MP3 | 0% | ORI-936/CT-CPT-03 |
| RG_BSN_TRILST_02 | MP4 | 0% | ORI-368/CT-BSN-03 |
| RG_BSN_QUAL_01 | MP4 | 0% | ORI-1068/CT-RND-01 |
| RG_BSN_QUAL_07 | MP4 | 0% | ORI-1068/CT-RND-05 |
| RG_BSN_QUAL_05 | MP4 | 0% | ORI-1068/CT-RND-08 |
| RG_PLA_TLP_01 | MP5 | 0% | ORI-688/CT-PTG-04 |
| RG_CRT_SIN_07 | MP5 | 0% | ORI-728/CT-DIS-01, ORI-728/CT-DIS-02, ORI-728/CT-DIS-06 |
| RG_CRT_SIN_08 | MP5 | 0% | ORI-728/CT-DIS-01, ORI-728/CT-DIS-03, ORI-728/CT-DIS-04 |
| RG_MOD_SIN_07 | MP5 | 0% | ORI-728/CT-DIS-07 |
| RG_MOD_SIN_08 | MP5 | 0% | ORI-728/CT-DIS-07 |
| RG_NOTIFCREA_02 | MP3 | 2% | ORI-91/CT-NOTIF-01, ORI-91/CT-NOTIF-02, ORI-91/CT-NOTIF-03 |
| RG_BSN_MODIF_01 | MP4 | 3% | ORI-368/CT-BSN-04, ORI-368/CT-BSN-06 |
| RG_STRUCT_OBLG_4_TAB | MP1 | 3% | ORI-783/CT-ETAB-01 |
| RG_OPT_CREATE_16 | MP2 | 3% | ORI-1067/CT-OPT-B-09 |
| RG_FAM_UPD_02 | MP2 | 3% | ORI-657/CT-PIM-D-01, ORI-657/CT-PIM-D-07 |
| RG_BSN_QUAL_06 | MP4 | 3% | ORI-1068/CT-RND-06, ORI-1068/CT-RND-07 |
| RG_INT_CPTL_1 | MP3 | 4% | ORI-936/CT-CPT-09 |
| RG_INT_CPTP_1 | MP3 | 5% | ORI-936/CT-CPT-07 |
| RG_INT_CPTO_1 | MP3 | 5% | ORI-936/CT-CPT-08 |
| RG_BSN_ACT_01 | MP4 | 5% | ORI-368/CT-BSN-04 |
| RG_BSN_QUAL_04 | MP4 | 5% | ORI-1068/CT-RND-03 |
| RG_GEN_PREC_01 | MP4 | 5% | ORI-1068/CT-RND-03 |
| RG_CTR_INT_01 | MP5 | 5% | ORI-452/CT-DUR-01, ORI-452/CT-DUR-02, ORI-452/CT-DUR-03 |
| RG_MOD | MP5 | 6% | ORI-728/CT-DIS-07, ORI-750/CT-ERR-07, ORI-750/CT-ERR-07 |
| RG_FAM_UPD_09 | MP2 | 6% | ORI-657/CT-PIM-D-04, ORI-657/CT-PIM-D-06 |
| RG_STE_ADRESS_HERIT_ETAB | MP1 | 6% | ORI-773/CT-STE-COORD-03 |
| RG_FAM_UPD_01 | MP2 | 6% | ORI-657/CT-PIM-D-01 |

_... et 149 de plus, voir istqb-coverage.json_

## Règles bien couvertes (≥80% complétude, ≥2 techniques croisées, 0)

| RG | Module | Techniques | Complétude |
|---|---|---|---:|
