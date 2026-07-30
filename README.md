# Orion Test Auto — Tests E2E Playwright

Tests end-to-end automatisés sur Orion (ERP OuiCare), stack Playwright.

## Prérequis

- **Node.js LTS** (≥ 18, npm inclus) → https://nodejs.org
- Accès réseau aux environnements Orion (`orion-dev1` / `orion-int1`)

## Installation & exécution

### Raccourci tous OS (recommandé)

```bash
npm run setup      # npm install + télécharge le navigateur Chromium
npm test           # lance tous les tests (headless)
```

### macOS / Linux (bash, zsh)

```bash
npm install && npx playwright install chromium
npm test
```

### Windows — PowerShell

> ⚠️ Pas de `&&` en PowerShell 5.1 (défaut Windows 10/11) → lignes séparées.

```powershell
npm install
npx playwright install chromium
npm test
```

**Si `npx` est bloqué** (`running scripts is disabled on this system`), autoriser une fois :

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Alternative : utiliser `npm run setup` (passe par cmd.exe, contourne le souci).

## Scripts disponibles

| Script | Action |
|--------|--------|
| `npm run setup` | Installe les dépendances + le navigateur Chromium |
| `npm test` | Lance tous les tests (headless) |
| `npm run test:headed` | Lance les tests avec navigateur visible (démo) |
| `npm run report` | Ouvre le dernier rapport HTML |

Référentiel complet des scripts/aliases INT2 IHM :
- `workspace-docs/INT2_IHM_SCRIPT_INDEX.md`

Lancer un seul test :

```bash
npx playwright test transverse-creer-pap --headed
```

## Choix de l'environnement

Par défaut : `dev1`. Basculer via variable d'env `ORION_ENV` :

```bash
# macOS / Linux
ORION_ENV=int1 npm test
```

```powershell
# Windows PowerShell
$env:ORION_ENV="int1"; npm test
```

## Tests inclus

| Test | Ce qu'il montre | Env | Statut |
|------|-----------------|-----|--------|
| `demo-annulation-intervention` | Planning → modale annulation → motifs → facturation | int1 | OK |
| `cu-pap-002-demo-dev` | Listing → fiche client → wizard PAP → cascade OF/Type/CDA | dev1 | OK |
| `transverse-creer-pap` | Vérif OF/CDA → client → crée un PAP → vérifie | dev1 | OK |
| `transverse-complet-of-pap` | Crée OF + PAP (noms dynamiques) | dev1 | WIP (bloqué validation SIREN/SIRET) |

## Environnements

| Env | URL | Modules |
|-----|-----|---------|
| INT1 | `https://orion-int1.itsap.net` | Planning (MP5) |
| DEV1 | `https://orion-dev1.itsap.net` | CRM, Aides financières (MP4, MP6) |

## Structure

```
.
├── env.config.ts            # URLs + routes par module
├── playwright.config.ts     # config Playwright
├── package.json
├── int2-ihm-helpers/                 # utilitaires de navigation
├── int2-ihm-fixtures/                # données de test (referentiels + scenarios)
│   ├── referentiels/
│   └── scenarios/cu-pap-002/
├── int2-ihm-tests/                   # tests .spec.ts
├── workspace-docs/data-strategy.md         # conventions fixtures / nommage
└── workspace-docs/scenarios-transverses-e2e.md  # 3 chaînes E2E + Gherkin
```

## Note auth

`playwright.config.ts` n'embarque pas de `storageState`. Si les environnements
Orion exigent une authentification (SSO), prévoir un login préalable ou une
session enregistrée — à valider selon la config réseau/env.
