# Stratégie de gestion des données de test — Orion E2E

> Convention de stockage, nomenclature et bonnes pratiques pour les jeux de données Playwright.

## Principes généraux

| Stratégie | Quand | Avantage | Inconvénient |
|-----------|-------|----------|--------------|
| **API seeding** (créer via API avant le test) | Tests CRUD, chaînes complètes | Données fraîches, test isolé | Besoin d'API disponibles, plus lent |
| **Snapshot DB** (restaurer un état connu avant le run) | Suite complète, CI | Rapide, reproductible | Données figées, drift si schema évolue |
| **Données autoportantes** (le test crée ET nettoie) | Tests idempotents | Zéro dépendance externe | Plus long, cleanup complexe |
| **Fixtures statiques** (fichiers JSON/seed SQL) | Référentiels, config | Simple, versionné dans le repo | Se désynchronise du modèle réel |

## Pattern recommandé

```
┌─────────────────────────────────────────────────┐
│  Avant la suite (globalSetup)                    │
│  → Restore snapshot DB OU seed via API           │
├─────────────────────────────────────────────────┤
│  Avant chaque test (beforeEach)                  │
│  → Créer les données spécifiques via API         │
│  → Stocker les IDs créés                         │
├─────────────────────────────────────────────────┤
│  Test (actions UI)                               │
│  → Utilise les IDs créés en beforeEach           │
├─────────────────────────────────────────────────┤
│  Après chaque test (afterEach)                   │
│  → Cleanup : supprimer ou rollback via API       │
│  → OU : ne rien faire si snapshot en globalSetup │
└─────────────────────────────────────────────────┘
```

## Règles d'or

1. **Jamais dépendre de données créées par un autre test** — chaque test est autonome
2. **Créer via API, vérifier via UI** — le test UI valide le rendu, pas la création
3. **Nommer les données de test** avec un préfixe identifiable (`TEST_AUTO_`, timestamp) pour cleanup facile
4. **Séparer les données de référentiel** (stables : catalogue, structure) **des données transactionnelles** (volatiles : interventions, clients)

---

## Arborescence

```
orion-test-auto/
├── playwright.config.ts
├── global-setup.ts                ← restauration snapshot + health check
├── int2-ihm-tests/
│   ├── chaine-1-pp-domicile.spec.ts
│   ├── chaine-2-pro-multisites.spec.ts
│   ├── chaine-3-saad-sante.spec.ts
│   └── demo-annulation-intervention.spec.ts
├── int2-ihm-fixtures/
│   ├── referentiels/              ← données stables (readonly, jamais modifiées par un test)
│   │   ├── structure.json             agences, sociétés
│   │   ├── catalogue.json             produits/services
│   │   └── motifs-annulation.json     référentiel motifs
│   ├── personas/                  ← templates réutilisables (pas d'ID en dur)
│   │   ├── client-pp.json            client particulier type
│   │   ├── client-pro.json           client pro (mère + sites)
│   │   ├── intervenant.json          intervenant type
│   │   └── client-saad.json          client santé
│   └── scenarios/                 ← données spécifiques à une chaîne E2E
│       ├── chaine-1/
│       │   ├── intervention-a-modifier.json
│       │   ├── intervention-a-annuler.json
│       │   └── serie-recurrente.json
│       ├── chaine-2/
│       │   ├── sites-pro.json
│       │   └── absence-client.json
│       └── chaine-3/
│           ├── ins-patient.json
│           └── evaluation-aggir.json
├── int2-ihm-helpers/
│   ├── api-client.ts              ← wrapper API Orion (CRUD interventions, clients...)
│   ├── seed.ts                    ← fonctions de seeding (créer un jeu complet)
│   ├── cleanup.ts                 ← fonctions de nettoyage
│   └── resolve-fixtures.ts        ← résolution @ref et dates dynamiques
└── int2-ihm-screenshots/
```

## Séparation des couches

| Dossier | Responsabilité | Modifié par un test ? |
|---------|---------------|----------------------|
| `int2-ihm-fixtures/referentiels/` | Miroir du snapshot DB. Config stable. | **JAMAIS** |
| `int2-ihm-fixtures/personas/` | Templates de création (shape sans ID). | Non — utilisé comme input |
| `int2-ihm-fixtures/scenarios/` | Données spécifiques à une chaîne. Variantes. | Non — input du seeding |

## Format des fixtures

### Structure d'un fichier fixture

```json
{
  "_meta": {
    "description": "Intervention ponctuelle pour test annulation",
    "chaine": "chaine-1-pp-domicile",
    "step": "1.14",
    "idempotent": false,
    "requires": ["personas/client-pp", "personas/intervenant"]
  },
  "data": {
    "client": "@ref:personas/client-pp",
    "intervenant": "@ref:personas/intervenant",
    "produit": "@ref:referentiels/catalogue#menage-2h",
    "planification": {
      "date": "+1d",
      "heureDebut": "09:00",
      "heureFin": "11:00"
    },
    "statut": "Pourvue"
  }
}
```

### Champs `_meta` (obligatoires)

| Champ | Rôle |
|-------|------|
| `description` | Ce que représente la donnée (1 ligne) |
| `chaine` | Chaîne E2E associée |
| `step` | Étape dans la chaîne (ref `scenarios-transverses-e2e.md`) |
| `idempotent` | `true` si le test ne modifie rien, `false` sinon |
| `requires` | Dépendances (autres fixtures nécessaires au seeding) |

## Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Fichier fixture | `{entite}-{variante}.json` | `intervention-a-annuler.json` |
| Dossier scénario | `chaine-{N}/` | `chaine-1/` |
| Référence croisée | `@ref:{chemin}#fragment` | `@ref:referentiels/catalogue#menage-2h` |
| Dates dynamiques | `+Nd`, `-Nd`, `today` | `"+1d"` = demain |
| Données en BDD | Préfixe `TEST_AUTO_` | `TEST_AUTO_Client_1718...` |
| ID tracing | `_testRunId` injecté au runtime | UUID généré par le runner |

## Dates dynamiques

| Expression | Signification |
|------------|--------------|
| `today` | Date du jour |
| `+1d` | Demain |
| `-7d` | Il y a 7 jours |
| `+1M` | Mois prochain |
| `startOfWeek` | Lundi de la semaine courante |
| `endOfMonth` | Dernier jour du mois |

Résolues au runtime par `int2-ihm-helpers/resolve-fixtures.ts`.

## Résolution au runtime

```typescript
// int2-ihm-helpers/seed.ts — pseudo-code
async function seedFromFixture(fixturePath: string, apiClient: ApiClient) {
  const fixture = loadFixture(fixturePath);

  // 1. Résoudre les @ref (charger les fixtures liées)
  const resolved = resolveRefs(fixture.data, FIXTURES_ROOT);

  // 2. Remplacer les dates dynamiques
  resolved.planification.date = resolveDynamicDate(resolved.planification.date);

  // 3. Ajouter le préfixe TEST_AUTO_ + timestamp
  resolved.nom = `TEST_AUTO_${Date.now()}_${resolved.nom}`;

  // 4. Créer via API
  const created = await apiClient.post('/interventions', resolved);

  // 5. Retourner l'ID + fonction cleanup
  return {
    id: created.id,
    data: created,
    cleanup: () => apiClient.delete(`/interventions/${created.id}`)
  };
}
```

---

## Application à Orion

### Mapping couches → stratégie

| Couche Orion | Données | Stratégie |
|--------------|---------|-----------|
| Structure (MP1) | Agences, sociétés, marque | **Snapshot DB** — inclus dans le baseline |
| Catalogue (MP2) | Produits, familles, options | **Snapshot DB** — inclus dans le baseline |
| Collaborateurs (MP3) | Intervenants, dispos | **Seed API** au globalSetup |
| Commercial (MP4) | Clients PP/Pro | **Seed API** en beforeEach |
| Planning (MP5) | Interventions, séries | **Seed API** en beforeEach + cleanup afterEach |
| Facturation (MP6) | OF, CDA, PAP | **Snapshot DB** (config) + seed API (PAP) |
| SEGUR (MP4.4) | INS, DUI | **Mock iCanopée** + données pré-injectées |

### Cycle de vie en CI (pipeline vendredi)

```
1. Démarrer env AWS (stop → start)
2. Restaurer snapshot DB "baseline-vX"
3. Health check API (GET /api/sap/... → 200)
4. Exécuter tests Playwright
   - globalSetup : seed intervenants + clients de base
   - Chaque test : seed spécifique → test UI → cleanup
5. Générer rapport HTML
6. Stopper env AWS
```

### API Orion découvertes

```
GET  /api/sap/intervention/interventions/{uuid}            → détail intervention
GET  /api/sap/intervention/interventions/annulation/init   → init formulaire annulation
POST /api/sap/intervention/interventions                   → création (à confirmer)
PUT  /api/sap/intervention/interventions/{uuid}            → modification (à confirmer)
```

> À compléter : explorer les endpoints clients, séries, intervenants.

### Convention données de test vs données réelles

| Critère | Données de test | Données réelles |
|---------|----------------|-----------------|
| Préfixe nom | `TEST_AUTO_` | — |
| Durée de vie | Supprimées en afterEach | Permanentes |
| Noms | Fictifs (DUPONT Test, MARTIN Auto) | Réalistes |
| Dates | Toujours futures (+1d, +7d) | Passées et futures |
| SIREN/NIR | Faux (000000000) | Vrais |

---

## Règles anti-patterns

| Anti-pattern | Pourquoi c'est mauvais | Bonne pratique |
|---|---|---|
| ID en dur dans les fixtures | Casse si DB recréée | Créer via API → récupérer l'ID |
| Dates absolues (`"2026-06-15"`) | Test passe aujourd'hui, casse demain | Dates relatives (`"+1d"`) |
| Un fichier `all-data.json` monstre | Impossible à maintenir | 1 fichier = 1 entité = 1 variante |
| Test qui dépend de l'exécution d'un autre | Ordre d'exécution non garanti | Chaque test se seed lui-même |
| Cleanup oublié | Pollution progressive de la DB | `afterEach` systématique ou snapshot |
| Données réalistes (vrais noms) | RGPD + confusion avec prod | Noms fictifs + préfixe `TEST_AUTO_` |
