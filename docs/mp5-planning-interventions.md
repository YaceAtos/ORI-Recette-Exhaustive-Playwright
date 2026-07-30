# MP5 — Planning & Interventions

> Vues planning (clients/intervenants), CRUD interventions, séries RRULE, annulation/modification, pointage/forçage, matching, absences, notifications. Flux temps réel vers facturation/paie.

| Meta | Valeur |
|------|--------|
| **Tags** | planning, interventions, RRULE, séries récurrentes, annulation, modification, pointage, forçage, matching, absences, intermissions, notifications, Kafka, batch, MP5 |
| **Racine Confluence** | 353173556 (MP5 Gestion opérationnelle SAP) ; SP5.2 362840116 |

## Pages sources
| Sujet | page_id | RG | Statut |
|---|---|---|---|
| SP5.2 interventions & activités planifiables | 362840116 | RG_GIN_* | actif |
| Intermissions E5.2.1.L2 | 975962130 | RG_INT_* | EN COURS (non finalisé 23/06) |
| CR ateliers flux MP5↔MP6 / absences | 956497962, 981794846, 983760897, 1004470361, 1009188906 | — | décisions actées |
| Cadre Opérationnel SP5.1 | 712310799 | RG_CO_* | → `mp5-cadre-operationnel.md` |

## Nomenclature RG
- RG_GIN_RPL_* (modifier intervention), RG_GIN_DPG_* (annuler), RG_INT_* (intermissions : règle 1/4h, seuil 15 min, calcul trajet, recalcul).

## Pièges connus
- Décisions ateliers (sourcées CR) : pointages forcés → MP6 immédiat ; annulation facturable → DMN CGV → retour durée MP6→MP5 ; "intervention facturée = bloquée" (Kafka MP6→MP5 désactive Modifier/Annuler/Forcer) ; absences (attente vs validé, cascade annulation, batch fin de journée).
- Intermissions = spec non finalisée (6 questions ouvertes au 23/06, critères d'acceptation vides). Ne pas figer.

## Détail
→ déléguer `confluence-explorer` sur le page_id pertinent (lecture live, sourcée).
