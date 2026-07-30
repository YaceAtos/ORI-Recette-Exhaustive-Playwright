# INT2 Full Business Inputs Retrieved From Docs

## Sources parsed
- docs/JEUX DE DONNEES POUR TEST PROJET ORION (2).pdf
- docs/Strategie_de_Test_Entreprise_Orion_v1.pdf
- docs/mp1-structure-marques.md
- docs/mp2-catalogue-produits.md
- docs/mp3-collaborateurs.md
- docs/mp4-gestion-commerciale.md
- docs/mp5-cadre-operationnel.md
- docs/mp5-planning-interventions.md
- docs/mp6-facturation-aides.md

## 1) Mandatory data baseline (retrieved)

### MP1 Structure
- Minimum volume: 2 marques, 3 societes, 5 agences.
- Constraints: SIREN/SIRET valid, unique, full hierarchy Marque -> Societe -> Etablissement -> Agence.
- Negative controls: invalid SIREN/SIRET rejected, orphan attachments blocked.

### SP1.5 Habilitations
- Minimum volume: 5 profils, 10 utilisateurs, persona x agence coverage.
- Required checks: permissions by persona (CRUD, read-only, forbidden), cone de visibilite, Keycloak sync.

### MP2 Catalogue
- Minimum volume: 3 categories, 5 families, 10 products.
- Product examples required by chains are present in docs:
  - Menage 2h
  - Nettoyage bureaux 3h
  - Aide toilette 1h
- Tax checks: VAT 5.5%, 10%, 20% coherence.

### MP3 Collaborateurs
- Minimum volume: 10 intervenants, 10 contrats, varied competences/disponibilites.
- Matching signals: competence compatibility, zone, absences, contract validity.
- Events mentioned: collaborateur/conge/autre_absence propagated by Kafka.

### MP4 Commercial/SEGUR
- Minimum volume: 20 clients PP, 5 clients Pro, 10 prospects, 5 devis.
- Required business checks:
  - Pro flow with SIREN + SIRENE enrichment.
  - SEGUR flow INS states (Provisoire -> Recuperee -> Validee -> Qualifiee), consent, DUI, DMP/MSSante.

### MP5 Planning
- Required business checks:
  - CRUD interventions.
  - Recurrence RRULE (RFC 5545), 12-month generation.
  - Annulation matrix motif x delai => billing status impact.
  - Absence flow from MP4 -> MP5 via Kafka.

### MP6 Facturation/Aides
- Required business checks:
  - Chain OF -> CDA -> PAP -> eligibility -> PEC calculation.
  - Table de faits status transitions (COLLECTE / EN_ANOMALIE / ARCHIVE).
  - Interplay with MP5 realized interventions / pointage.

## 2) Canonical cross-module chains (retrieved)
- C1: Client particulier domicile.
- C2: Client professionnel multi-sites.
- C3: Client sante SAAD.

These are explicitly identified in strategy and are aligned with the transverse scenarios document.

## 3) Non-negotiable technical prerequisites for 100% real E2E (retrieved)

### Environment strategy
- INT is the execution environment for functional/E2E smoke with seed API + baseline snapshot.
- Recommended data lifecycle:
  - globalSetup: MP3 seed
  - beforeEach: MP4/MP5 seed
  - afterEach: cleanup
  - MP6: snapshot config + PAP seed

### External/system dependencies called out by docs
- RRULE batch: trigger via API or mocked trigger with deterministic verification.
- Kafka contracts/observability: production+consumption checks, DLQ handling.
- External APIs: SIRENE, GEOWS, iCanopee/INSi.
- SEGUR sandbox/virtualization for INS/DUI/DMP flows.

### Test architecture expectations
- API-first seeding and cleanup.
- Contract-first validation for API and Kafka (OpenAPI/Pact style).
- Deterministic assertions for sensitive calculations (RRULE, PEC, billing states).

## 4) Concrete high-priority scenario controls retrieved

- SC-MP4-02: Client Pro SIRENE auto-enrichment -> site -> contrat.
- SC-MP4-03: INS lifecycle Provisoire -> Recuperee -> Validee -> Qualifiee.
- SC-MP5-01: RRULE batch 100 series -> 12 months, holiday exclusions.
- SC-MP5-03: Annulation motif x delai -> correct billing status.
- SC-MP5-04: Kafka client absence valid -> UPSERT, invalid -> DLQ.
- SC-MP6-01: OF -> CDA (APA) -> PAP -> eligibility -> PEC calculation.

## 5) Implementation checklist for strict true-business automation

1. Implement API seed/cleanup service for entities used by C1/C2/C3.
2. Add RRULE batch trigger + status verification adapter.
3. Add Kafka assertion adapter (topic read + DLQ checks for expected events).
4. Add SIRENE and iCanopee/INSi test adapters (sandbox or virtualized endpoints).
5. Replace UI soft-check placeholders by hard business assertions on created IDs and resulting states.
6. Record one dedicated MP4 per chain only after all hard assertions pass.

## 6) What this retrieval gives us now
- Full dataset and business coverage targets by module.
- Full list of blocking dependencies that must be wired for true 100% E2E.
- Direct mapping from strategy controls to executable chain assertions.
