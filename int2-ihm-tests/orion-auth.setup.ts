import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '../env.config';

/**
 * Authentification INT2 (Keycloak) — génère un storageState réutilisable.
 *
 * Fournir les identifiants via variables d'environnement :
 *   ORION_USER=... ORION_PASSWORD=... npm run orion:pipeline:run
 *
 * Sans identifiants, ce setup est ignoré (les tests détecteront le mur d'auth
 * et seront marqués "skipped: authentification requise", jamais faussement PASS).
 */

const authDir = path.resolve(__dirname, '../.orion-auth');
const statePath = path.join(authDir, 'state.json');

setup('authenticate INT2', async ({ page }) => {
  const user = process.env.ORION_USER;
  const password = process.env.ORION_PASSWORD;

  if (!user || !password) {
    console.log('ℹ ORION_USER / ORION_PASSWORD absents — authentification ignorée (mode non authentifié).');
    setup.skip(true, 'Identifiants INT2 non fournis (ORION_USER / ORION_PASSWORD).');
    return;
  }

  fs.mkdirSync(authDir, { recursive: true });

  await page.goto(ENV.baseUrl, { waitUntil: 'domcontentloaded' });

  // Attendre la page de login Keycloak (redirection SPA)
  const userField = page.locator('#username, input[name="username"], input[type="email"]').first();
  await userField.waitFor({ state: 'visible', timeout: 30000 });
  await userField.fill(user);

  const passField = page.locator('#password, input[name="password"], input[type="password"]').first();
  await passField.fill(password);

  await page.locator('#kc-login, button[type="submit"], input[type="submit"]').first().click();

  // Attendre le retour sur l'application Orion authentifiée
  await page.waitForURL(/orion-int2\.itsap\.net/, { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');

  await page.context().storageState({ path: statePath });
  console.log(`✅ Session INT2 enregistrée: ${statePath}`);
});
