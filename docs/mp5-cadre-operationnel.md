# SP5.1 — Cadre Opérationnel (MP5)

> Objet de qualification automatique du contexte d'un contrat → pré-câble facturation/paie. "Comment traiter" (circuit, document, destination), pas "qui paie" (PAP/OF → SP6.2). Immuable, 1 CO/contrat, créé par Kafka batch nocturne.

| Meta | Valeur |
|------|--------|
| **Tags** | cadre opérationnel, CO, routage, DT1, DT2, succursale, franchise, prestataire, mandataire, particulier, professionnel, DMN, Kafka, SP5.1, MP5 |
| **Racine Confluence** | 712310799 (SP5.1 E5.1.1, v28) ; parent 711131153 |

## Pages sources
| Sujet | page_id | RG | Statut |
|---|---|---|---|
| SP5.1 E5.1.1 cadre opérationnel | 712310799 | RG_CO_* | actif (v28) |
| Parent SP5.1 | 711131153 | — | actif |

## Contenu (résumé — détail exhaustif = DMN attaché)
- 5 axes : `type_entite`(SUCCURSALE/FRANCHISE), `mode_juridique`(PRESTATAIRE/MANDATAIRE), `relation_commerciale`(PARTICULIER/PROFESSIONNEL), `origine_demande`(CONTRAT_RECURRENT/MISSION_ASSISTEUR), `mode_paie_franchise`(PLEIADE/EXPORT/null).
- DT1 routage facturation (10 cas → FACTURE_CLIENT / FACTURE_PERSONNE_MORALE / NOTE_DEBIT_MANDATAIRE / FACTURE_PARTENAIRE_CENTRALISEE).
- DT2 routage paie (5 circuits : PAIE_PLEIADE_PRESTATAIRE / PAIE_MANDATAIRE / PAIE_FRANCHISE_PLEIADE / PAIE_FRANCHISE_EXPORT).
- Interdit : MANDATAIRE + PROFESSIONNEL (CO non créé + erreur).

## Nomenclature RG
- RG_CO_CI_01→05 (interface entrée), RG_CO_OBJ_01→08 (objet), RG_CO_OUT_01→06 (interface sortie). Total 19.

## Pièges connus
- Référence exhaustive DT1/DT2 = fichier `ORION_CadreOperationnel_SP5_1_V4_FR.dmn` (attaché) + captures att818413615 / att818970675.
- RIDA : paie mandataire Pléiade 2027 + export Excel franchisé = partiels (EN COURS), n'impactent pas la qualification.

## Détail
→ déléguer `confluence-explorer` sur 712310799 (+ DMN via attachments).
