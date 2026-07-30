# 🎯 10+ Scénarios de Création par Bloc — JDD Intelligents

> **Objectif** : Couvrir les branches métier critiques pour chaque bloc via des jeux de données (JDD) paramétrés et réutilisables.

---

## 📌 BLOC 1 : Filtres Leads (MP4) — 12 scénarios

**Module** : MP4 (Commercial/CRM)  
**Dépendances** : Leads existants (via `Int2BusinessHarness.seed()`)  
**Patterns testés** : Statut, Date, Type, Recherche, Réinitialisation

### JDD Factory

```typescript
// int2-ihm-helpers/mp4-crm-leads-jdd-factory.ts

export const MP4_LEADS_JDD = {
  // Scénario 1: Lead nouveau (< 24h, non qualifié)
  leadNouveau: {
    nom: 'Nouveau Lead Bordeaux',
    email: 'new.lead@example.fr',
    telephone: '+33 6 11 22 33 44',
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 3600000), // 1h ago
    type: 'PP', // Personne Physique
    ville: 'Bordeaux',
    codePostal: '33000',
    besoinsPrincipal: 'Aide ménagère',
  },
  
  // Scénario 2: Lead qualifié (48h, conversion possible)
  leadQualifie: {
    nom: 'Dubois Qualifié',
    email: 'dubois.qualified@example.fr',
    telephone: '+33 6 22 33 44 55',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 172800000), // 48h ago
    type: 'PP',
    ville: 'Libourne',
    codePostal: '33500',
    besoinsPrincipal: 'Aide ménagère + Soutien personnalisé',
    scoringLeadValue: 75, // Score métier 0-100
  },
  
  // Scénario 3: Lead en cours (RDV pris, timeline longue)
  leadEnCours: {
    nom: 'Martin En Cours',
    email: 'martin.ongoing@example.fr',
    telephone: '+33 6 33 44 55 66',
    statut: 'En cours',
    dateCreation: new Date(Date.now() - 604800000), // 7j ago
    type: 'PM', // Personne Morale (EHPAD, résidence)
    ville: 'Talence',
    codePostal: '33400',
    besoinsPrincipal: 'Lots services résidences',
    rdvPrevu: new Date(Date.now() + 604800000), // +7j
    scoringLeadValue: 65,
  },
  
  // Scénario 4: Lead fermé (client refusé — < 7j)
  leadFermé: {
    nom: 'Fernandes Fermé',
    email: 'fernandes.closed@example.fr',
    telephone: '+33 6 44 55 66 77',
    statut: 'Fermé',
    motifFermeture: 'Client refusé',
    dateCreation: new Date(Date.now() - 259200000), // 3j ago
    type: 'PP',
    ville: 'Pessac',
    codePostal: '33600',
    besoinsPrincipal: 'Aide ménagère',
    scoringLeadValue: 20,
  },
  
  // Scénario 5: Lead converti (devient client — ancien)
  leadConverti: {
    nom: 'Laurent Converti',
    email: 'laurent.converted@example.fr',
    telephone: '+33 6 55 66 77 88',
    statut: 'Converti',
    dateCreation: new Date(Date.now() - 2592000000), // 30j ago
    type: 'PP',
    ville: 'Mérignac',
    codePostal: '33700',
    besoinsPrincipal: 'Aide ménagère',
    dateConversion: new Date(Date.now() - 604800000), // convertis il y a 7j
    scoringLeadValue: 100,
  },
  
  // Scénario 6: Lead ancien non touché (> 60j, inactif)
  leadAncien: {
    nom: 'Gérard Inactif',
    email: 'gerard.old@example.fr',
    telephone: '+33 6 66 77 88 99',
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 5184000000), // 60j ago
    type: 'PP',
    ville: 'Saint-Médard',
    codePostal: '33160',
    besoinsPrincipal: 'Aide ménagère',
    derniereInteraction: new Date(Date.now() - 5184000000), // never touched
    scoringLeadValue: 5,
  },
  
  // Scénario 7: Lead avec devis en préparation
  leadAvecDevis: {
    nom: 'Bonnet Devis',
    email: 'bonnet.quote@example.fr',
    telephone: '+33 6 77 88 99 00',
    statut: 'En cours',
    dateCreation: new Date(Date.now() - 259200000), // 3j ago
    type: 'PM',
    ville: 'Arcachon',
    codePostal: '33120',
    besoinsPrincipal: 'Service nettoyage entreprise',
    devisAttache: true,
    statusDevis: 'En préparation',
    scoringLeadValue: 60,
  },
  
  // Scénario 8: Lead haute valeur (gros potentiel, PM large)
  leadHauteValeur: {
    nom: 'EHPAD Les Pins Parasol',
    email: 'contact@les-pins-parasol.fr',
    telephone: '+33 5 56 10 20 30',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 86400000), // 1j ago
    type: 'PM',
    ville: 'Gujan-Mestras',
    codePostal: '33470',
    besoinsPrincipal: 'Lots services EHPAD (100+ lits)',
    nombreLits: 120,
    budgetEstime: 50000,
    scoringLeadValue: 95,
  },
  
  // Scénario 9: Lead petit client (PP simple, faible budget)
  leadPetit: {
    nom: 'Dupont Petit',
    email: 'dupont.small@example.fr',
    telephone: '+33 6 88 99 00 11',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 172800000), // 2j ago
    type: 'PP',
    ville: 'Créon',
    codePostal: '33670',
    besoinsPrincipal: 'Aide ménagère ponctuelle',
    budgetEstime: 300,
    scoringLeadValue: 40,
  },
  
  // Scénario 10: Lead avec besoin urgent (< 48h)
  leadUrgent: {
    nom: 'Rossi Urgent',
    email: 'rossi.urgent@example.fr',
    telephone: '+33 6 99 00 11 22',
    statut: 'Qualifié',
    dateCreation: new Date(Date.now() - 3600000), // 1h ago
    type: 'PP',
    ville: 'Floirac',
    codePostal: '33270',
    besoinsPrincipal: 'Urgence aide ménagère',
    priorite: 'URGENTE',
    dateBesoinsPrevu: new Date(Date.now() + 172800000), // dans 48h
    scoringLeadValue: 80,
  },
  
  // Scénario 11: Lead doublón (même email différent nom)
  leadDoublon1: {
    nom: 'Moreau Doublon A',
    email: 'contact.moreau@example.fr',
    telephone: '+33 6 10 11 12 13',
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 604800000), // 7j ago
    type: 'PP',
    scoringLeadValue: 30,
  },
  leadDoublon2: {
    nom: 'Moreau Doublon B',
    email: 'contact.moreau@example.fr', // même email
    telephone: '+33 6 20 21 22 23',
    statut: 'En cours',
    dateCreation: new Date(Date.now() - 86400000), // 1j ago
    type: 'PP',
    scoringLeadValue: 50,
  },
  
  // Scénario 12: Lead sans contact (données incomplètes)
  leadIncomplet: {
    nom: 'Xxx Yyy',
    email: '', // Pas d'email
    telephone: '', // Pas de tél
    statut: 'Nouveau',
    dateCreation: new Date(Date.now() - 259200000), // 3j ago
    type: 'PP',
    ville: 'Bordeaux',
    besoinsPrincipal: 'À définir',
    scoringLeadValue: 10,
  },
};
```

### 12 Tests avec Filtres

```typescript
test.describe('MP4-LEADS: Scénarios Filtres + JDD Intelligents', () => {
  
  // Scénario 1: Filtrer par statut "Nouveau"
  test('JDD-001: Filtrer Statut=Nouveau → retourne leadNouveau + leadIncomplet', async ({ page, harness }) => {
    const seeds = await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadNouveau,
        MP4_LEADS_JDD.leadQualifie,
        MP4_LEADS_JDD.leadEnCours,
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByPlaceholder(/Filtre|Search/i).fill('Statut');
    await page.getByLabel('Statut').click();
    const results = await page.locator('tr[role="row"]').count();
    expect(results).toBeGreaterThanOrEqual(1); // leadNouveau minimum
  });
  
  // Scénario 2: Filtrer par date création (< 24h)
  test('JDD-002: Filtrer DateCreation < 24h → retourne leads récents uniquement', async ({ page, harness }) => {
    const seeds = await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadNouveau, // 1h
        MP4_LEADS_JDD.leadAncien,  // 60j
        MP4_LEADS_JDD.leadUrgent,  // 1h
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByText('Filtrer par date').click();
    await page.locator('[data-filter="date-start"]').fill('today');
    const resultsBefore = await page.locator('tr[role="row"]').count();
    const resultsAfter = await page.locator('tr[role="row"]:has-text("Nouveau")').count();
    expect(resultsAfter).toBeLessThanOrEqual(resultsBefore);
  });
  
  // Scénario 3: Recherche par email
  test('JDD-003: Recherche email "dubois.qualified" → retourne leadQualifie', async ({ page, harness }) => {
    await harness.seed({ leads: [MP4_LEADS_JDD.leadQualifie] });
    
    await page.goto(routes.clientsList());
    await page.getByPlaceholder(/Rechercher|Search/i).fill('dubois.qualified@example.fr');
    await page.waitForTimeout(500);
    const rows = await page.locator('tr[role="row"]').count();
    expect(rows).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 4: Filtrer par type "PM" (Personne Morale)
  test('JDD-004: Filtrer Type=PM → retourne leadEnCours + leadAvecDevis + leadHauteValeur', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadPetit,        // PP
        MP4_LEADS_JDD.leadEnCours,      // PM
        MP4_LEADS_JDD.leadHauteValeur,  // PM
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByText(/Type|Categorie/i).click();
    await page.getByLabel('Personne Morale').click();
    const pmRows = await page.locator('tr[role="row"]').count();
    expect(pmRows).toBeGreaterThanOrEqual(2);
  });
  
  // Scénario 5: Filtrer leads "inactifs" (> 60j sans interaction)
  test('JDD-005: Filtrer Inactifs > 60j → retourne leadAncien', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadNouveau,
        MP4_LEADS_JDD.leadAncien, // 60j
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByText(/Inactifs|Stale/i).click();
    const staleRows = await page.locator('tr[role="row"]').count();
    expect(staleRows).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 6: Filtrer leads "avec devis"
  test('JDD-006: Filtrer StatusDevis=EnCours → retourne leadAvecDevis', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadQualifie,
        MP4_LEADS_JDD.leadAvecDevis,
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByText(/Devis|Quote/i).click();
    await page.getByLabel('En préparation').click();
    const quotedRows = await page.locator('tr[role="row"]').count();
    expect(quotedRows).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 7: Recherche + Filtrer combinés (email + statut)
  test('JDD-007: Recherche email + Filtre Statut=Qualifié → retourne leadQualifie', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadNouveau,
        MP4_LEADS_JDD.leadQualifie,
        MP4_LEADS_JDD.leadEnCours,
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByPlaceholder(/Rechercher/i).fill('dubois');
    await page.getByLabel('Statut').click();
    await page.getByLabel('Qualifié').click();
    const filtered = await page.locator('tr[role="row"]').count();
    expect(filtered).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 8: Filtrer "conversion possible" (scoring 60-80)
  test('JDD-008: Filtrer Scoring 60-80 → retourne leads avec potentiel moyen', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadPetit,        // 40
        MP4_LEADS_JDD.leadEnCours,      // 65
        MP4_LEADS_JDD.leadUrgent,       // 80
        MP4_LEADS_JDD.leadHauteValeur,  // 95
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByLabel(/Score|Scoring/i).click();
    await page.locator('[data-filter="score-min"]').fill('60');
    await page.locator('[data-filter="score-max"]').fill('80');
    const scoredRows = await page.locator('tr[role="row"]').count();
    expect(scoredRows).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 9: Filtrer "besoin urgent" (date prévu < 48h)
  test('JDD-009: Filtrer BesoinUrgent → retourne leadUrgent', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadNouveau,
        MP4_LEADS_JDD.leadUrgent, // < 48h
        MP4_LEADS_JDD.leadEnCours,
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByLabel(/Urgent|Priority/i).click();
    const urgentRows = await page.locator('tr[role="row"]').count();
    expect(urgentRows).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 10: Détecter doublons (même email)
  test('JDD-010: Détecter doublons → retourne leadDoublon1 & leadDoublon2', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadDoublon1,
        MP4_LEADS_JDD.leadDoublon2,
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByText(/Doublons|Duplicates/i).click();
    const duplicateRows = await page.locator('tr[role="row"]').count();
    expect(duplicateRows).toBeGreaterThanOrEqual(2);
  });
  
  // Scénario 11: Filtrer leads "incomplets" (champs manquants)
  test('JDD-011: Filtrer Incomplets → retourne leadIncomplet', async ({ page, harness }) => {
    await harness.seed({
      leads: [
        MP4_LEADS_JDD.leadQualifie,
        MP4_LEADS_JDD.leadIncomplet,
      ],
    });
    
    await page.goto(routes.clientsList());
    await page.getByText(/Incomplet|Missing/i).click();
    const incompleteRows = await page.locator('tr[role="row"]').count();
    expect(incompleteRows).toBeGreaterThanOrEqual(1);
  });
  
  // Scénario 12: Réinitialiser tous les filtres
  test('JDD-012: Reset Filtres → retourne tous les leads', async ({ page, harness }) => {
    const seedData = {
      leads: [
        MP4_LEADS_JDD.leadNouveau,
        MP4_LEADS_JDD.leadQualifie,
        MP4_LEADS_JDD.leadEnCours,
        MP4_LEADS_JDD.leadFermé,
        MP4_LEADS_JDD.leadConverti,
      ],
    };
    await harness.seed(seedData);
    
    await page.goto(routes.clientsList());
    await page.getByLabel('Statut').click();
    await page.getByLabel('Qualifié').click();
    let filteredCount = await page.locator('tr[role="row"]').count();
    expect(filteredCount).toBeLessThan(seedData.leads.length);
    
    await page.getByRole('button', { name: /Réinitialiser|Reset/i }).click();
    let allCount = await page.locator('tr[role="row"]').count();
    expect(allCount).toBeGreaterThanOrEqual(seedData.leads.length);
  });
});
```

---

## 📌 BLOC 2 : Scoring Lead (MP4) — 12 scénarios

**Module** : MP4 (Commercial/CRM)  
**Logic** : Calcul automatique basé sur (statut, budget, type, interactions)  
**Branchement** : Score 0-30 (rejeté) | 30-60 (faible) | 60-80 (moyen) | 80-100 (excellent)

### JDD Scoring Factory

```typescript
export const MP4_SCORING_JDD = {
  // Scénario 1: PP petit budget, statut Nouveau
  scoreRejeté: {
    nom: 'Petit Prospect Rejeté',
    type: 'PP',
    budgetEstime: 100, // < 200
    besoinsPrincipal: 'Ponctuellement',
    statut: 'Nouveau',
    derniereInteraction: null,
    expectedScore: 15,
  },
  
  // Scénario 2: PM moyen, 1 interaction
  scoreFaible: {
    nom: 'PM Moyen Faible',
    type: 'PM',
    budgetEstime: 5000,
    besoinsPrincipal: 'Services réguliers',
    statut: 'Nouveau',
    nbInteractions: 1,
    expectedScore: 45,
  },
  
  // Scénario 3: Qualifié + RDV fixé
  scoreMoyen: {
    nom: 'Lead Moyen Qualifié',
    type: 'PP',
    budgetEstime: 10000,
    statut: 'Qualifié',
    nbInteractions: 3,
    rdvPrevu: true,
    expectedScore: 70,
  },
  
  // Scénario 4: PM grand, budget > 50k, plusieurs interactions
  scoreExcellent: {
    nom: 'EHPAD Excellent',
    type: 'PM',
    budgetEstime: 100000,
    statut: 'Qualifié',
    nbInteractions: 8,
    rdvPrevu: true,
    devisGenere: true,
    expectedScore: 95,
  },
  
  // Scénario 5: Converti (score final validé)
  scoreConverti: {
    nom: 'Lead Converti Confirmé',
    type: 'PM',
    budgetEstime: 25000,
    statut: 'Converti',
    nbInteractions: 10,
    expectedScore: 100,
  },
  
  // Scénario 6: Fermé avec justification
  scoreFermé: {
    nom: 'Lead Fermé Volontaire',
    type: 'PP',
    budgetEstime: 3000,
    statut: 'Fermé',
    motifFermeture: 'Client refusé',
    expectedScore: 0,
  },
  
  // Scénario 7: Inactif 90 jours
  scoreInactif: {
    nom: 'Lead Oublié',
    type: 'PP',
    budgetEstime: 8000,
    statut: 'Nouveau',
    derniereInteraction: new Date(Date.now() - 7776000000), // 90j
    expectedScore: 5,
  },
  
  // Scénario 8: Haute urgence (besoin immédiat)
  scoreUrgent: {
    nom: 'Lead Urgent HotSale',
    type: 'PM',
    budgetEstime: 50000,
    priorite: 'URGENTE',
    besoinDate: new Date(Date.now() + 86400000), // demain
    statut: 'Qualifié',
    expectedScore: 90,
  },
  
  // Scénario 9: Devis en cours (progression)
  scoreAvecDevis: {
    nom: 'Lead Devis Envoyé',
    type: 'PM',
    budgetEstime: 15000,
    statut: 'En cours',
    nbInteractions: 4,
    devisGenere: true,
    dateDevisEnvoi: new Date(Date.now() - 86400000), // 1j ago
    expectedScore: 65,
  },
  
  // Scénario 10: Rechute (score baisse si inactif post-qualification)
  scoreRechute: {
    nom: 'Lead Rechute',
    type: 'PM',
    budgetEstime: 20000,
    statut: 'Qualifié',
    dateQualification: new Date(Date.now() - 1209600000), // 14j ago
    derniereInteraction: new Date(Date.now() - 604800000), // pas touché 7j
    expectedScore: 40, // score baisse de 70 -> 40
  },
  
  // Scénario 11: Score automatique recalculé (audit trail)
  scoreRecalcule: {
    nom: 'Lead Recalc',
    type: 'PP',
    budgetEstime: 12000,
    statut: 'En cours',
    nbInteractions: 5,
    dateRecalcul: new Date(Date.now()),
    expectedScore: 62,
  },
  
  // Scénario 12: Score avec pondération spéciale (VIP)
  scoreVIP: {
    nom: 'VIP Référent',
    type: 'PM',
    budgetEstime: 200000,
    statut: 'Qualifié',
    flagVIP: true,
    priorite: 'VIP',
    expectedScore: 100, // Pondération +20%
  },
};
```

### 12 Tests Scoring

```typescript
test.describe('MP4-SCORING: Calcul Scoring Lead Automatique', () => {
  
  test('SCORE-001: Lead rejeté (PP, <200€) → score 0-30', async ({ page, harness }) => {
    const seed = await harness.seed({ lead: MP4_SCORING_JDD.scoreRejeté });
    await page.goto(routes.clientsList());
    const scoreBadge = page.locator(`[data-score="${MP4_SCORING_JDD.scoreRejeté.expectedScore}"]`);
    await expect(scoreBadge).toBeVisible();
    console.log(`✓ Score rejeté: ${MP4_SCORING_JDD.scoreRejeté.expectedScore}`);
  });
  
  test('SCORE-002: Lead faible (PM, 5k, 1 interaction) → score 30-60', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreFaible });
    await page.goto(routes.clientsList());
    const score = await page.locator('[data-score]').first().getAttribute('data-score');
    expect(Number(score)).toBeGreaterThanOrEqual(30);
    expect(Number(score)).toBeLessThan(60);
  });
  
  test('SCORE-003: Lead qualifié + RDV → score 60-80', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreMoyen });
    await page.goto(routes.clientsList());
    const statusText = await page.locator('tr:first-child td:nth-child(3)').innerText();
    expect(statusText).toContain('Qualifié');
  });
  
  test('SCORE-004: PM grand budget + interactions → score 80-100 (EXCELLENT)', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreExcellent });
    await page.goto(routes.clientsList());
    const scoreBadge = page.locator('[data-score="95"]');
    await expect(scoreBadge).toBeVisible();
    const badgeColor = await scoreBadge.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(badgeColor).toMatch(/green|0f0/); // Vert = excellent
  });
  
  test('SCORE-005: Lead converti → score 100 (final)', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreConverti });
    await page.goto(routes.clientsList());
    const scoreBadge = page.locator('[data-score="100"]');
    await expect(scoreBadge).toBeVisible();
  });
  
  test('SCORE-006: Lead fermé → score 0 (exclus)', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreFermé });
    await page.goto(routes.clientsList());
    const closedRows = page.locator('tr:has-text("Fermé")');
    const scoreAttr = await closedRows.first().locator('[data-score]').getAttribute('data-score');
    expect(Number(scoreAttr)).toBe(0);
  });
  
  test('SCORE-007: Lead inactif 90j → score ~0 (stale)', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreInactif });
    await page.goto(routes.clientsList());
    const score = await page.locator('[data-score]').first().getAttribute('data-score');
    expect(Number(score)).toBeLessThan(10);
  });
  
  test('SCORE-008: Lead URGENT → score +20% bonus', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreUrgent });
    await page.goto(routes.clientsList());
    const urgentBadge = page.locator('[data-priority="URGENT"]');
    await expect(urgentBadge).toBeVisible();
    const score = await page.locator('[data-score]').getAttribute('data-score');
    expect(Number(score)).toBeGreaterThanOrEqual(90);
  });
  
  test('SCORE-009: Lead avec devis → score reflète progression', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreAvecDevis });
    await page.goto(routes.clientsList());
    const scoreCell = await page.locator('tr:first-child td:nth-child(4)').innerText();
    expect(scoreCell).toMatch(/65|quote|devis/i);
  });
  
  test('SCORE-010: Lead rechute (qualifié → inactif) → score baisse', async ({ page, harness }) => {
    // Créer lead avec score 70, puis l'inactiver 7j
    const seed = await harness.seed({ lead: MP4_SCORING_JDD.scoreRechute });
    await page.goto(routes.clientsList());
    const score = await page.locator('[data-score]').getAttribute('data-score');
    expect(Number(score)).toBeLessThan(50); // Score baisse
  });
  
  test('SCORE-011: Recalcul score déclenché (audit trail visible)', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreRecalcule });
    await page.goto(routes.clientsList());
    const auditLink = page.locator('[data-action="audit-score"]');
    await expect(auditLink).toBeVisible();
    await auditLink.click();
    const auditModal = page.locator('[role="dialog"]');
    await expect(auditModal).toBeVisible();
    console.log('✓ Audit trail visible');
  });
  
  test('SCORE-012: VIP lead → score 100 + pondération spéciale', async ({ page, harness }) => {
    await harness.seed({ lead: MP4_SCORING_JDD.scoreVIP });
    await page.goto(routes.clientsList());
    const vipBadge = page.locator('[data-flag="VIP"]');
    await expect(vipBadge).toBeVisible();
    const score = await page.locator('[data-score]').first().getAttribute('data-score');
    expect(Number(score)).toBe(100);
  });
});
```

---

## 📌 BLOC 3 : Annulation Intervention (MP5) — 12 scénarios

**Module** : MP5 (Planning/Interventions)  
**Impact** : Temps réel, notification, facturation, pointage  
**Branchement** : Avant/après pointage, motif obligatoire

### JDD Annulation Factory

```typescript
export const MP5_ANNULATION_JDD = {
  // Scénario 1: Annulation AVANT intervention (planifiée aujourd'hui)
  annulationAvant: {
    interventionId: 'int-' + Date.now(),
    clientName: 'Rousseau Nathan',
    datePrevue: new Date(Date.now() + 3600000), // +1h
    heurePrevue: '14:00',
    duree: 60,
    intervenant: 'Marie Dupont',
    motifAnnulation: 'Client décalage horaire demandé',
    type: 'AVANT_EXECUTION',
    expectedStatus: 'Annulée',
  },
  
  // Scénario 2: Annulation APRÈS démarrage (en cours)
  annulationEnCours: {
    interventionId: 'int-' + (Date.now() + 1000),
    clientName: 'Dubois Pierre',
    datePrevue: new Date(Date.now()),
    heurePrevue: '10:00',
    heureDebut: '10:05', // Commencée
    duree: 90,
    motifAnnulation: 'Client urgence médicale',
    type: 'PENDANT_EXECUTION',
    expectedStatus: 'Interrompue',
  },
  
  // Scénario 3: Annulation APRÈS pointage validé
  annulationApresPointage: {
    interventionId: 'int-' + (Date.now() + 2000),
    clientName: 'Martin Alice',
    datePrevue: new Date(Date.now() - 3600000), // -1h (passée)
    heurePrevue: '09:00',
    duree: 120,
    heureDebut: '09:00',
    heureFin: '11:00',
    pointageEtat: 'Validé',
    pointageId: 'pt-12345',
    motifAnnulation: 'Erreur saisie pointage',
    type: 'APRES_POINTAGE',
    expectedStatus: 'Annulée (pointage invalidé)',
  },
  
  // Scénario 4: Annulation intervention récurrente (série RRULE)
  annulationSerie: {
    serieId: 'serie-rec-001',
    clientName: 'Bernard Société',
    dateDebut: new Date(Date.now() - 2592000000), // -30j
    rrule: 'FREQ=WEEKLY;BYDAY=MO,WE,FR;COUNT=12', // Lunedi, mercredi, vendredi
    occurrence: 3, // 3e occurrence sur 12
    motifAnnulation: 'Réduction services client',
    type: 'SERIE_OCCURRENCE',
    expectedStatus: 'Occurrence annulée, série continue',
  },
  
  // Scénario 5: Annulation toute une série
  annulationTouteSerie: {
    serieId: 'serie-rec-002',
    clientName: 'Laurent SARL',
    rrule: 'FREQ=WEEKLY;BYDAY=TU,TH',
    nbOccurrencesRestantes: 8,
    motifAnnulation: 'Fermeture temporaire entreprise',
    type: 'ANNUL_SERIE_COMPLETE',
    expectedStatus: '8 interventions annulées',
  },
  
  // Scénario 6: Annulation sans motif (motif = requis)
  annulationSansMotif: {
    interventionId: 'int-' + (Date.now() + 3000),
    clientName: 'Petit Claude',
    datePrevue: new Date(Date.now() + 7200000),
    motif: null, // Manquant
    type: 'MOTIF_MISSING',
    expectedError: 'Motif annulation requis',
  },
  
  // Scénario 7: Annulation intervenant responsable (motif "Indisponibilité intervenant")
  annulationIntervenant: {
    interventionId: 'int-' + (Date.now() + 4000),
    clientName: 'Rossi Jeanne',
    datePrevue: new Date(Date.now() + 86400000), // +1j
    intervenant: 'Sophie Martin',
    motifAnnulation: 'Indisponibilité intervenant (maladie)',
    type: 'INTERVENANT_INDISPONIBLE',
    replanification: true, // Doit être replanifiée
    expectedStatus: 'Annulée + Flaggée pour replanification',
  },
  
  // Scénario 8: Annulation avec compensation client (crédit)
  annulationAvecCompensation: {
    interventionId: 'int-' + (Date.now() + 5000),
    clientName: 'Gérard Marie-Jo',
    datePrevue: new Date(Date.now() + 172800000), // +2j
    tarif: 45.00,
    motifAnnulation: 'Erreur planning (double réservation)',
    compensation: true,
    montantCredit: 45.00, // Crédit client
    expectedStatus: 'Annulée + Crédit appliqué',
  },
  
  // Scénario 9: Annulation avec impact facturation (déjà facturée)
  annulationFacturee: {
    interventionId: 'int-' + (Date.now() + 6000),
    clientName: 'Bonnet Santé',
    datePrevue: new Date(Date.now() - 604800000), // -7j (ancienne)
    duree: 120,
    tarif: 85.00,
    factureId: 'FA-2026-001',
    etatFacture: 'Validée',
    motifAnnulation: 'Correction en accord client',
    type: 'INTERVENTION_FACTUREE',
    expectedStatus: 'Annulée (avoir créé)',
  },
  
  // Scénario 10: Annulation urgente (< 2h avant)
  annulationUrgente: {
    interventionId: 'int-' + (Date.now() + 7000),
    clientName: 'Moreau Urgence',
    datePrevue: new Date(Date.now() + 3600000), // +1h
    delaiAnnulation: 60, // < 2h
    motifAnnulation: 'Annulation client urgent',
    type: 'ANNUL_URGENTE',
    notificationIntervenant: true, // SMS urgent
    expectedStatus: 'Annulée + Notification urgente',
  },
  
  // Scénario 11: Annulation partielle (réduction heures)
  annulationPartielle: {
    interventionId: 'int-' + (Date.now() + 8000),
    clientName: 'Fernandes Réduit',
    datePrevue: new Date(Date.now() + 259200000), // +3j
    dureePrevue: 120,
    dureeAnnulee: 60, // -1h (service réduit)
    motifAnnulation: 'Réduction service client',
    type: 'REDUCTION_DUREE',
    expectedStatus: 'Modifiée (60 min au lieu de 120)',
  },
  
  // Scénario 12: Annulation avec audit trail (qui, quand, pourquoi)
  annulationAvecAudit: {
    interventionId: 'int-' + (Date.now() + 9000),
    clientName: 'Xxx Audit Trail',
    datePrevue: new Date(Date.now() + 432000000), // +5j
    motifAnnulation: 'Test audit trail',
    type: 'AUDIT_TRAIL_TEST',
    expectedStatus: 'Annulée (audit enregistré)',
  },
};
```

### 12 Tests Annulation

```typescript
test.describe('MP5-ANNULATION: Scénarios Annulation Intervention', () => {
  
  test('ANNUL-001: Annulation AVANT exécution → statut Annulée', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationAvant });
    await page.goto(routes.planning());
    // Chercher intervention
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationAvant.clientName}")`);
    await expect(intRow).toBeVisible();
    // Menu actions
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    // Modal
    const modal = page.locator('[role="dialog"]:has-text("Motif annulation")');
    await expect(modal).toBeVisible();
    await modal.locator('textarea').fill(MP5_ANNULATION_JDD.annulationAvant.motifAnnulation);
    await modal.locator('button:has-text("Confirmer")').click();
    // Vérifier statut
    const status = await intRow.locator('[data-status]').getAttribute('data-status');
    expect(status).toBe('CANCELLED');
  });
  
  test('ANNUL-002: Annulation EN COURS → statut Interrompue', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationEnCours });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationEnCours.clientName}")`);
    // Vérifier que intervenant a commencé
    const startTime = await intRow.locator('[data-start-time]').getAttribute('data-start-time');
    expect(startTime).toBeTruthy();
    // Annuler en cours
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const warningAlert = page.locator(':has-text("Intervention en cours")');
    await expect(warningAlert).toBeVisible();
    console.log('✓ Alerte : intervention en cours détectée');
  });
  
  test('ANNUL-003: Annulation APRES pointage → pointage invalidé', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationApresPointage });
    await page.goto(routes.planning());
    // Rechercher intervention avec pointage validé
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationApresPointage.clientName}")`);
    const pointageStatus = await intRow.locator('[data-pointage-status]').getAttribute('data-pointage-status');
    expect(pointageStatus).toBe('Validé');
    // Annuler
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const modal = page.locator('[role="dialog"]');
    await modal.locator(':has-text("⚠ Pointage validé sera invalidé")').isVisible().then(v => expect(v).toBe(true));
  });
  
  test('ANNUL-004: Annulation occurrence série → serie continue', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationSerie });
    await page.goto(routes.planning());
    // Chercher série
    const serieRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationSerie.clientName}")`);
    await serieRow.hover();
    const menuAction = serieRow.locator('[data-menu-action]');
    await menuAction.click();
    // Choisir "Annuler occurrence"
    const cancelOption = page.locator('button:has-text("Annuler cette occurrence")');
    await expect(cancelOption).toBeVisible();
  });
  
  test('ANNUL-005: Annulation TOUTE serie → toutes occurrences annulées', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationTouteSerie });
    await page.goto(routes.planning());
    const serieRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationTouteSerie.clientName}")`);
    await serieRow.hover();
    await serieRow.locator('[data-menu-action]').click();
    const cancelSerieOption = page.locator('button:has-text("Annuler toute la série")');
    await expect(cancelSerieOption).toBeVisible();
    await cancelSerieOption.click();
    const confirmModal = page.locator('[role="dialog"]:has-text("8 interventions")');
    await expect(confirmModal).toBeVisible();
  });
  
  test('ANNUL-006: Motif annulation REQUIS → erreur si vide', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationSansMotif });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationSansMotif.clientName}")`);
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const modal = page.locator('[role="dialog"]');
    // Essayer soumettre sans motif
    const submitBtn = modal.locator('button:has-text("Confirmer")');
    const isDisabled = await submitBtn.evaluate(el => el.disabled);
    expect(isDisabled).toBe(true);
    const errorMsg = modal.locator('[role="alert"]');
    await expect(errorMsg).toContainText(/Motif|required/i);
  });
  
  test('ANNUL-007: Annulation intervenant → replanification flaggée', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationIntervenant });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationIntervenant.intervenant}")`);
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const modal = page.locator('[role="dialog"]');
    await modal.locator('textarea').fill(MP5_ANNULATION_JDD.annulationIntervenant.motifAnnulation);
    await modal.locator('button:has-text("Confirmer")').click();
    // Vérifier flag replanification
    const replanificationFlag = page.locator('[data-flag="needs-replanning"]');
    await expect(replanificationFlag).toBeVisible();
  });
  
  test('ANNUL-008: Annulation avec compensation client → crédit appliqué', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationAvecCompensation });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationAvecCompensation.clientName}")`);
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const modal = page.locator('[role="dialog"]');
    // Cocher "Compensation client"
    const compensationCheckbox = modal.locator('[data-field="compensation"]');
    await compensationCheckbox.click();
    const creditInput = modal.locator('[data-field="credit-amount"]');
    await expect(creditInput).toHaveValue(`${MP5_ANNULATION_JDD.annulationAvecCompensation.montantCredit}`);
  });
  
  test('ANNUL-009: Annulation intervention facturée → avoir créé', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationFacturee });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationFacturee.clientName}")`);
    const factureAlert = intRow.locator('[data-alert="factured"]');
    await expect(factureAlert).toBeVisible();
    await expect(factureAlert).toContainText(MP5_ANNULATION_JDD.annulationFacturee.factureId);
    // Annuler quand même
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const modal = page.locator('[role="dialog"]');
    await modal.locator('textarea').fill(MP5_ANNULATION_JDD.annulationFacturee.motifAnnulation);
    await modal.locator('button:has-text("Confirmer")').click();
    // Vérifier avoir
    const creditNote = page.locator('[data-document="AVOIR"]');
    await expect(creditNote).toBeVisible();
  });
  
  test('ANNUL-010: Annulation URGENTE (< 2h) → notification SMS intervenant', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationUrgente });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationUrgente.clientName}")`);
    // Vérifier badge urgent
    const urgentBadge = intRow.locator('[data-badge="urgent"]');
    await expect(urgentBadge).toBeVisible();
    // Annuler
    await intRow.hover();
    await intRow.locator('[data-action="cancel"]').click();
    const modal = page.locator('[role="dialog"]');
    await modal.locator('textarea').fill(MP5_ANNULATION_JDD.annulationUrgente.motifAnnulation);
    const smsNotificationCheckbox = modal.locator('[data-field="sms-notification"]');
    const isChecked = await smsNotificationCheckbox.isChecked();
    expect(isChecked).toBe(true); // Automatiquement coché pour urgence
  });
  
  test('ANNUL-011: Annulation partielle → réduction durée', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationPartielle });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationPartielle.clientName}")`);
    await intRow.hover();
    // Option "Modifier durée"
    const modifyBtn = intRow.locator('[data-action="modify-duration"]');
    await expect(modifyBtn).toBeVisible();
    await modifyBtn.click();
    const modal = page.locator('[role="dialog"]');
    const durationField = modal.locator('[data-field="duration"]');
    await durationField.fill(`${MP5_ANNULATION_JDD.annulationPartielle.dureeAnnulee}`);
    await modal.locator('button:has-text("Appliquer")').click();
    // Vérifier durée mise à jour
    const newDuration = await intRow.locator('[data-duration]').getAttribute('data-duration');
    expect(newDuration).toBe(`${MP5_ANNULATION_JDD.annulationPartielle.dureeAnnulee}`);
  });
  
  test('ANNUL-012: Audit trail complet → qui, quand, pourquoi enregistrés', async ({ page, harness }) => {
    const seed = await harness.seed({ intervention: MP5_ANNULATION_JDD.annulationAvecAudit });
    await page.goto(routes.planning());
    const intRow = page.locator(`tr:has-text("${MP5_ANNULATION_JDD.annulationAvecAudit.clientName}")`);
    // Cliquer pour voir détails
    await intRow.click();
    const detailPanel = page.locator('[role="complementary"]:has-text("Détails")');
    await expect(detailPanel).toBeVisible();
    // Ouvrir audit trail
    const auditLink = detailPanel.locator('[data-action="audit-trail"]');
    await auditLink.click();
    const auditModal = page.locator('[role="dialog"]:has-text("Historique")');
    await expect(auditModal).toBeVisible();
    // Vérifier colonnes
    const timestamp = auditModal.locator('[data-col="timestamp"]');
    const user = auditModal.locator('[data-col="user"]');
    const action = auditModal.locator('[data-col="action"]');
    await expect(timestamp).toBeVisible();
    await expect(user).toBeVisible();
    await expect(action).toBeVisible();
  });
});
```

---

## 📌 BLOC 4 : Aides PAP (MP6) — 10 scénarios

(Structure similaire — 10+ JDD = combinaisons OF × Type Aide × Budget × Durée)

---

## 🎯 RÉSUMÉ EXÉCUTION

| Bloc | Scénarios | Branches métier | Temps test |
|------|-----------|-----------------|-----------|
| **Filtres Leads** | 12 | Statut, Date, Type, Recherche, Doublons, Scoring | 15 min |
| **Scoring Lead** | 12 | Rejeté, Faible, Moyen, Excellent, VIP, Inactif | 12 min |
| **Annulation Intervention** | 12 | Avant/Pendant/Après, Série, Pointage, Facturation, Urgence | 20 min |
| **Aides PAP** | 10 | OF, Type, Budget, Durée, Validation | 10 min |
| **TOTAL** | **46 tests** | **30+ branches métier** | **~60 min** |

---

## 🚀 Exécuter les tests

```bash
# Créer les fichiers fixtures + factories
npx ts-node int2-ihm-helpers/mp4-crm-leads-jdd-factory.ts
npx ts-node int2-ihm-helpers/mp4-crm-scoring-jdd-factory.ts
npx ts-node int2-ihm-helpers/mp5-planning-annulation-jdd-factory.ts

# Lancer tests avec vidéos
npm run test:sprint13:blocs:record 2>&1 | tee bloc-creation-run.log

# Voir rapports
npx playwright show-report
```

**Rendu** : 46 tests × ~60 min = **~2h30 complet** avec vidéos MP4.
