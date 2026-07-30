# Sprint 13 Recette - 23 Tickets Ready | Plan d'Exécution Exhaustif

**Date**: 2026-07-21 | **Mode**: Exhaustive Recette MP4  
**Tickets**: 23 | **Scenarios**: 138 BDD | **Modules**: MP1-MP6 + Transverse

---

## 📋 Synthèse Exécutive

### Objectif
Générer et exécuter une **suite de tests complète** pour les 23 tickets ORI "ready for recette now", avec **vidéo d'exécution MP4** pour chaque scenario à titre de preuve pour les tests de recette.

### Statut ✅
- ✅ **Phase 1 (MCP Extraction)** — COMPLÈTE  
  Extraction exhaustive des 23 tickets via Jira/Confluence/Figma  
  Artifact: `SPRINT13_TEST_SPECS_RECETTE_23.md` (1004 lines)

- ✅ **Phase 2 (Gherkin Generation)** — COMPLÈTE  
  Génération de 138 scénarios BDD (6 par ticket)  
  Artifact: `int2-ihm-tests/SPRINT13_RECETTE_23.feature`

- ⏳ **Phase 3 (Playwright Implementation)** — EN COURS  
  Conversion scenarios BDD → TypeScript specs  
  Artifact: `int2-ihm-tests/int2-ihm-sprint13-recette-23.spec.ts`

- ⏳ **Phase 4 (Test Execution + MP4)** — EN COURS  
  Exécution avec vidéo capture  
  Command: `npm run test:sprint13:recette:mp4`  
  Output: `/int2-ihm-recordings/sprint13-recette/`

---

## 📂 Artefacts Générés

| Artefact | Location | Purpose | Status |
|----------|----------|---------|--------|
| **Test Specs (MCP Extracted)** | `SPRINT13_TEST_SPECS_RECETTE_23.md` | Detailed AC + test data for all 23 tickets | ✅ 1004 lines |
| **Gherkin Features** | `int2-ihm-tests/SPRINT13_RECETTE_23.feature` | 138 BDD scenarios | ✅ Complete |
| **Playwright Specs** | `int2-ihm-tests/int2-ihm-sprint13-recette-23.spec.ts` | TypeScript implementation | ⏳ Executing |
| **npm Scripts** | `package.json` | Test runners (record + MP4) | ✅ Added |
| **Recordings** | `int2-ihm-recordings/sprint13-recette/` | Video evidence | ⏳ Pending |

---

## 🎯 23 Tickets Ready for Recette

### ORI-368 | Story | MP4 | 5 SP
**E4.2.B. Fiche prospect/client Particulier - Onglet Agences > Besoins - Description du tableau**
- **Scenarios**: 6 (AC1-AC6 covering columns, alignment, data load, pagination, styling)
- **Module**: MP4 (CRM / Commercial)
- **Status**: Ready for test

### ORI-657 | Story | MP2 | 5 SP
**E2.1.2.D Mettre à jour une famille de produits**
- **Scenarios**: 6 (AC1-AC6 covering form load, fields, validation, save, notification, duplicates)
- **Module**: MP2 (Catalogue)
- **Status**: Ready for test

### ORI-667 | Story | MP4 | 3 SP
**E4.2.B. Fiche prospect/client Particulier - Zones de filtres**
- **Scenarios**: 6 (AC1-AC6 covering filter display, filter values, dynamic updates, reset, responsive, overflow)
- **Module**: MP4 (CRM / Commercial)
- **Status**: Ready for test

### ORI-688, ORI-723, ORI-745, ORI-769, ORI-773, ORI-783, ORI-863, ORI-957, ORI-1007, ORI-1044, ORI-1062, ORI-1064, ORI-1065, ORI-1066, ORI-1067, ORI-1068, ORI-1072, ORI-1073, ORI-1095, ORI-1096
- **Total Additional**: 20 tickets
- **Scenarios**: 120 (6 each)
- **Coverage**: All MP1-MP6 + Transverse

**Module Distribution**:
| Module | Tickets | Scenarios |
|--------|---------|-----------|
| MP1 (Structure) | 2 | 12 |
| MP2 (Catalogue) | 5 | 30 |
| MP3 (Collaborateurs) | 2 | 12 |
| MP4 (CRM/Commercial) | 7 | 42 |
| MP5 (Planning) | 3 | 18 |
| MP6 (Facturation/Aides) | 2 | 12 |
| Transverse | 2 | 12 |
| **TOTAL** | **23** | **138** |

---

## 🔧 Commandes d'Exécution

### Lancer les tests avec vidéo
```bash
npm run test:sprint13:recette:mp4
```

### Or separately:
```bash
# Enregistrement vidéo
npm run test:sprint13:recette:record

# Transcoder vidéo (après record)
bash int2-ihm-scripts/int2-ihm-transcode-evidence-mp4.sh test-results int2-ihm-recordings/sprint13-recette
```

### Voir les résultats
```bash
npm run report

# Ou localement
open int2-ihm-recordings/sprint13-recette/
```

---

## 📊 Configuration Playwright

**Config**: `playwright.int2.record.config.ts`
- **Browsers**: Chromium
- **Video Recording**: Enabled (all tests)
- **Screenshots**: On failure
- **Timeout per test**: 300 seconds
- **Workers**: 1 (sequential for video clarity)
- **Output**: `test-results/` (raw) → `int2-ihm-recordings/sprint13-recette/` (MP4s)

---

## 🧪 Structure des Tests

### Pattern Playwright Implémenté

```typescript
test.describe('ORI-368: Tableau Besoins - Description & Colonnes', () => {
  test('AC1: Le tableau Besoins affiche les colonnes obligatoires', async ({ page }) => {
    // Given: Navigate
    await page.goto(routes.clientsList());
    
    // When: Find and interact with table
    const table = page.locator('table, [role="table"]').first();
    
    // Then: Assert visibility & structure
    await expect(table).toBeVisible();
    for (const col of requiredColumns) {
      await expect(colHeader).toBeVisible();
    }
  });
});
```

### Flows Testés (Real Orion Workflows)

| Module | Typical Flow |
|--------|--------------|
| **MP1** | Navigate Structure → Create/Update Entity → Verify Attributes |
| **MP2** | Browse Catalogue → Filter Families/Options → Modify/Create → Validate |
| **MP3** | Search Collaborators → Update Profile → Verify Contracts/Absences |
| **MP4** | Client Search → View Fiche → Filter Needs/RDVs → Create Interaction |
| **MP5** | Planning Calendar → Create/Modify Intervention → Verify Schedule |
| **MP6** | OF Creation → Link CDA/PAP → Calculate Facturation → Generate Report |

---

## 📹 Video Evidence Organization

**Output Structure**:
```
int2-ihm-recordings/sprint13-recette/
├── ORI-368_AC1_tableau-besoins-colonnes.mp4
├── ORI-368_AC2_colonnes-alignement.mp4
├── ORI-368_AC3_description-affichee.mp4
├── ...
├── ORI-657_AC1_form-load.mp4
├── ORI-657_AC2_champs-editables.mp4
├── ...
├── summary.json (aggregated results)
└── manifest.html (index of all videos)
```

**Each Video**:
- Duration: 10-60 seconds (per test scenario)
- Format: MP4 (H.264)
- Resolution: 1280x1024 (or as configured)
- Audio: None (silent video)
- Purpose: Proof of recette execution for QA/PO

---

## ⚙️ Test Data Sources

### Data Inference Strategy
All test data sourced from **`SPRINT13_TEST_SPECS_RECETTE_23.md`**:

| Entity | Sample Values | Source |
|--------|---------------|--------|
| **Clients** | Jean Dupont, Marie Martin, Paul Lambert | AC fixtures inferred |
| **Agencies** | Agence Paris Centre, Agence Lyon Nord | AC fixtures inferred |
| **Products** | Nettoyage, Jardinage, Entretien | Catalogue AC |
| **Needs** | Nettoyage (Nouveau), Jardinage (En cours) | ORI-368 AC |
| **Interventions** | Mon 08:00-12:00, Tue 14:00-17:00 | ORI-1062+ AC |

### Data Persistence
- **Create**: Via Playwright form fill + submit
- **Cleanup**: Test isolation or pre-seeding via test hooks
- **Fixtures**: Defined in `int2-ihm-tests/fixtures/` (reusable)

---

## ✅ Recette Validation Checklist

Before marking as "Ready for Recette Done", confirm:

| Check | Status | Notes |
|-------|--------|-------|
| All 23 tickets have scenarios | ✅ | 138 total |
| Gherkin features are well-formed | ✅ | SPRINT13_RECETTE_23.feature |
| Playwright specs execute without syntax errors | ✅ | npm run test:sprint13:recette:record |
| Videos are generated for each test | ⏳ | Pending MP4 transcode |
| No flaky tests (retry logic if needed) | ⏳ | TBD post-execution |
| All assertions pass (or expected failures logged) | ⏳ | TBD post-execution |
| Video evidence is linked to ticket (traceability) | ⏳ | Pending report generation |
| Performance metrics collected (optional) | ⏳ | Depends on config |

---

## 🔗 Related Artifacts

| Artifact | Purpose |
|----------|---------|
| `SPRINT13_TEST_SPECS_RECETTE_23.md` | Full specs for all 23 tickets |
| `int2-ihm-tests/SPRINT13_RECETTE_23.feature` | Gherkin scenarios |
| `workspace-docs/SPRINT13_ORI_A_RECETTER_MCP.md` | MCP extraction report (71 tickets analyzed, 23 ready) |
| `env.config.ts` | Route configuration for all modules |
| `int2-ihm-tests/int2-ihm-ui-only-chains.spec.ts` | UI-only probe suite (reference) |
| `playwright.int2.record.config.ts` | Playwright recording config |

---

## 📌 Next Steps

### Immediate
1. Wait for `npm run test:sprint13:recette:mp4` to complete
2. Verify MP4 files generated in `int2-ihm-recordings/sprint13-recette/`
3. Review test results in `test-results/` and HTML report

### Post-Execution
1. Generate recette summary report (pass/fail counts, videos, timings)
2. Link video evidence to Jira tickets (ORI-368, ORI-657, etc.)
3. Share with QA/PO for final recette sign-off
4. Close out Sprint 13 recette tracking

### Optional Enhancements
1. Add cross-browser testing (Firefox, Safari) if needed
2. Add performance benchmarking (Lighthouse, WebVitals)
3. Add accessibility testing (a11y scans)
4. Integrate with CI/CD pipeline (GitHub Actions, GitLab CI)

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue: Tests hang or timeout**
- **Solution**: Check `env.config.ts` routes are reachable
- **Debug**: `DEBUG=pw:api npm run test:sprint13:recette:record`

**Issue: No MP4 files generated**
- **Solution**: Ensure `int2-ihm-scripts/int2-ihm-transcode-evidence-mp4.sh` is executable
- **Debug**: `bash -x int2-ihm-scripts/int2-ihm-transcode-evidence-mp4.sh test-results int2-ihm-recordings/sprint13-recette`

**Issue: Video quality too low**
- **Solution**: Adjust `playwright.int2.record.config.ts` resolution/bitrate
- **Reference**: See `playwright.exhaustive.record.config.ts` for high-quality settings

**Issue: Test assertion failures**
- **Solution**: Review spec vs. actual UI (may need selector updates)
- **Debug**: Run single test with `--headed` flag to see UI: `npx playwright test --grep "ORI-368" --headed`

---

## 📋 Recette Sign-Off Template

```
Sprint 13 Recette - 23 Tickets
Date: [DATE]
Executed by: [NAME]
Status: [PASS/FAIL/PARTIAL]

Executed Scenarios: 138/138
Passed: X
Failed: Y
Skipped: Z

Video Evidence: 
- Location: int2-ihm-recordings/sprint13-recette/
- Total Size: X GB
- Duration: Y minutes

Sign-off:
- QA: _____ (signature / date)
- PO: _____ (signature / date)
- Delivery: _____ (signature / date)
```

---

## 🔐 Notes de Sécurité

- **No credentials in repos** — Use `.env.int2.real` (gitignored)
- **Test data**: No real PII, all synthetic/anonymized
- **Video recording**: Silent, no password/API key captures

---

**Generated**: 2026-07-21 | **By**: Copilot Orchestrator | **Token Budget**: [usage]

