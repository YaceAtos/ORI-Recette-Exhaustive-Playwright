# Interfaces & Flux inter-domaines (transverse)

> Cartographie des flux inter-MP (Kafka/événements), décisions d'architecture (ODR), APIs externes (SIRENE, GEOWS, iCanopée, Keycloak). Document d'architecture transverse.

| Meta | Valeur |
|------|--------|
| **Tags** | interfaces, flux, FD, micro-services, cartographie, notifications, Kafka, événements, ODR, DMN, dual-write, Outbox, Debezium, Pléiade, MSE, SIRENE, GEOWS, iCanopée, Keycloak, dépendances, transverse |
| **Racine Confluence** | 443089024 (MP Fonctionnels Transverses) |

## Pages sources
| Sujet | page_id | Statut |
|---|---|---|
| Flux de données inter-domaines | 388038693 | actif (v43, 14 flux FD_*) |
| ODR-7 événements / multi-tenant | 473432069 | actif |
| ODR-8 documents | 634355713 | EN COURS |
| ODR-9 flux externes Pléiade (MSE) | 661389324 | ⚠️ BROUILLON |
| ODR-10 alarmes | 670269441 | actif |
| ODR-11 dual-write (Outbox/Inbox) | 691339268 | ✅ APPLICABLE |
| ODR-12 moteur DMN | 719552514 | ⚠️ BROUILLON |
| MPT5 cartographie micro-services | 689537025 | actif |
| MPT3 RGPD | 415891471 | vide |

## Contenu (résumé)
- Flux FD_MPx_MPy : 14 (13 message + 1 API). Lots 0.1 (MP1→MP5/MP4 agence, MP3→MP5 collaborateur) / 0.2 (MP3→MP5 RH, absence, contrat).
- ODR-11 (applicable) : Transactional Outbox + Inbox idempotence, Debezium PostgreSQL / MSK Connect, retry `.1m/.10m/.1h` + DLT.
- ODR-12 (brouillon) : DMN 1.3 Flowable, API `/api/dmn/v1/{marque}_{regl}/evaluate/{key}`, cache L1 TTL 24h. Usages : TVA (MP2/MP6), alarmes (MP5), visites médicales (MP3), aides (MP6).
- ODR-9 (brouillon) : MSE Pléiade, ~22 types de messages (CREASA/CIVIL/MODNAIS… / CREARC/MODRC/FINCONT…), transcodif listes de valeurs, mapping IDs Orion↔Pléiade.

## Pièges connus
- ODR-9 et ODR-12 = BROUILLON (non validés). Seul ODR-11 est APPLICABLE.
- MPT3 RGPD = page vide malgré v6.
- Cadre Opérationnel SP5.1 (routage factu/paie) documenté dans `mp5-cadre-operationnel.md`.

## Détail
→ déléguer `confluence-explorer` sur le page_id pertinent (lecture live, sourcée).
