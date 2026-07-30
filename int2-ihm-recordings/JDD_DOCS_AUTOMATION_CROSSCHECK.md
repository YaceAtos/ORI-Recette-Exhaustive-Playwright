# Orion Docs vs Automation Cross-check

- Generated at: 2026-07-20
- Scope reviewed: all files under docs/
- Sources parsed: markdown maps, JDD PDF, strategy PDF, transverse E2E DOCX

## 1. Dataset Coverage Status (Current)

Covered in current popup semantic dataset + fill flow:

- Required identity/contact fields: first name, last name, email, phone
- Address handling: address intent + autocomplete selection attempt
- Legal identifiers: SIREN/SIRET-like field support with Luhn-valid generation
- Code/tenant fields: normalized code generation for required technical identifiers
- Libelle fields: explicit label intent and business-like sample values
- Validation guards: explicit detection of blocking messages (invalid chars, address not found, required fields)

Current observed values (latest semantic generation):

- Required unknown-intent fields: 0
- Risky required fields now mapped: legalId/code/label
- Creation coverage tests: passing (13/13 in autonomous creation suite)

## 2. What Docs Require Beyond Current Repo Scope

From docs/JEUX DE DONNEES POUR TEST PROJET ORION (2).pdf, docs/Strategie_de_Test_Entreprise_Orion_v1.pdf, and docs/scenarios-transverses-e2e-LMO.docx:

- Full chain module coverage MP1 -> SP1.5 -> MP2 -> MP3 -> MP4 -> MP5 -> MP6 -> MP7
- API + Kafka contract testing and resilience testing (ordering, lag, DLQ, schema compatibility)
- Mobile Hyperion E2E coverage
- Security and negative authorization coverage (tenant isolation, role boundaries)
- Performance and volumetric testing (planning load, rule engines, exports)
- Non-regression breadth across all modules and cross-module chains

These are mostly not implemented as executable tests in this repository today.

## 3. What Is Implemented in This Repo Today

Implemented and automated:

- Web Playwright autonomous traversal and creation-safe-mode coverage on INT2
- Semantic discovery/profiling/field understanding pipeline
- JDD generation and gate checks (preprod/prod thresholds)
- Exhaustive recording + MP4/JSON artifacts + functional matrix generation

Explicitly noted as missing in repo int2-ihm-scripts/reports:

- External connectors/harness for RRULE/Kafka/SIRENE/INS/DUI/DMP

## 4. Cross-check Verdict

- Popup dataset quality: significantly improved and now aligned for major validator-sensitive fields.
- Full documentation coverage: partial relative to enterprise strategy documents.
- Remaining gap is not only data quality; it is test-domain scope (API/Kafka/mobile/security/performance).

## 5. Next Execution Priorities

1. Add API contract tests for top cross-module flows (MP3->MP5, MP4->MP5, MP5->MP6, MP1->Keycloak).
2. Add Kafka schema/contract smoke checks with synthetic fixtures.
3. Add security negative tests for role/tenant boundaries in web E2E.
4. Add dedicated performance smoke scenarios for MP5/MP6 critical paths.
5. Add a mobile placeholder matrix (Hyperion) in this repo, even before full device pipeline.

## 6. Guard Recommendation

Introduce a "docs parity gate" that fails when mandatory domains are absent from test inventory:

- web-e2e
- api-contract
- kafka-contract
- security-negative
- performance-smoke
- mobile-hyperion

This would align automation governance with the strategy PDF quality gates.
