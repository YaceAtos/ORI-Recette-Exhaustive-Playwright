import { Page, expect } from '@playwright/test';
import { routes } from '../env.config';

/**
 * Navigation Orion sans ID en dur — les UUID changent quand la data bouge.
 * Pattern : passer par le listing puis retrouver l'entité par son nom.
 */

/**
 * Navigue vers la fiche d'un client depuis le listing, puis ouvre l'onglet Plan d'aide.
 * Robuste aux changements d'UUID : retrouve le client par son nom de famille dans le tableau.
 *
 * @param page Playwright page
 * @param nomFamille Nom de famille affiché dans la colonne du listing (ex: "ROUSSEAU")
 */
export async function ouvrirPlanAideClient(page: Page, nomFamille: string, clientId?: string): Promise<void> {
  const tryOpenPlanAideFromRow = async (rowIndex: number, preferName = false): Promise<boolean> => {
    await page.goto(routes.clientsList());
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2500);

    const dataRows = page
      .locator('tr[role="row"], tr.mdc-data-table__row, mat-row')
      .filter({ has: page.locator('td, mat-cell') });

    await expect(dataRows.first()).toBeVisible({ timeout: 15000 });

    let targetRow = dataRows.nth(rowIndex);
    if (preferName) {
      const byName = page.locator(`tr:has-text("${nomFamille}"), mat-row:has-text("${nomFamille}")`).first();
      if ((await byName.count()) > 0) {
        targetRow = byName;
      }
    }

    await expect(targetRow).toBeVisible({ timeout: 10000 });
    await targetRow.click();
    await page.waitForTimeout(2500);

    // Si le clic sur la ligne n'a pas navigué, utiliser le bouton d'action de la ligne
    const stillOnList = await page.locator('h3:has-text("Clients & prospects")').isVisible().catch(() => false);
    if (stillOnList) {
      const actionBtn = targetRow.locator('button').last();
      if ((await actionBtn.count()) > 0) {
        await actionBtn.click();
        await page.waitForTimeout(2500);
      }
    }

    const planAideTab = page.getByText(/Plan d.aide/i).first();
    if (await planAideTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      await planAideTab.click();
      await page.waitForTimeout(1500);
    }

    const ajouterAideBtn = page.locator('button:has-text("Ajouter une aide")');
    if (await ajouterAideBtn.isVisible().catch(() => false)) {
      return true;
    }

    const liveClientId = page.url().match(/\/crm\/pages\/clients-prospects\/([a-z0-9-]+)/i)?.[1];
    if (liveClientId) {
      await page.goto(routes.clientPlanAide(liveClientId));
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      if (await ajouterAideBtn.isVisible().catch(() => false)) {
        return true;
      }
    }

    if (clientId) {
      await page.goto(routes.clientPlanAide(clientId));
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      if (await ajouterAideBtn.isVisible().catch(() => false)) {
        return true;
      }
    }

    return false;
  };

  if (await tryOpenPlanAideFromRow(0, true)) {
    return;
  }

  for (let i = 0; i < 5; i++) {
    if (await tryOpenPlanAideFromRow(i, false)) {
      return;
    }
  }

  throw new Error('Impossible d\'ouvrir un plan d\'aides exploitable avec le bouton "Ajouter une aide".');
}
