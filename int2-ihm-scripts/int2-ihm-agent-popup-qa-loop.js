const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');
const autonomousDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const profilePath = path.join(autonomousDir, 'create-flow-semantics.json');
const fallbackProfilePath = path.join(autonomousDir, 'create-flow-profile.json');
const outJson = path.join(autonomousDir, 'popup-qa-loop-report.json');
const outMd = path.join(autonomousDir, 'INT2_POPUP_QA_LOOP_REPORT.md');
const evidenceDir = path.join(autonomousDir, 'popup-qa-evidence');

const MAX_ROUTES = Number(process.env.INT2_POPUP_QA_MAX_ROUTES || '0');
const MAX_BUTTONS_PER_ROUTE = Number(process.env.INT2_POPUP_QA_MAX_BUTTONS || '24');
const PER_ACTION_TIMEOUT_MS = Number(process.env.INT2_POPUP_QA_ACTION_TIMEOUT_MS || '20000');
const STRICT_MODE = process.env.INT2_POPUP_QA_STRICT === 'true';
const ALLOW_SUBMIT = process.env.INT2_POPUP_QA_ALLOW_SUBMIT === 'true';

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sanitizeFileToken(value) {
  return String(value || 'unknown')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 96);
}

function isBlockedAction(label) {
  const v = normalizeText(label);
  if (!v) return true;
  const blocked = [
    /supprimer|delete|desactiver|destruction|quitter sans enregistrer/, 
    /import csv|export csv|telecharger/, 
    /^oui$/,
  ];
  return blocked.some((r) => r.test(v));
}

function loadProfiles() {
  const semantic = safeReadJson(profilePath);
  if (semantic && Array.isArray(semantic.profiles)) {
    return semantic.profiles.filter((p) => p && p.status === 'profiled' && p.url);
  }

  const fallback = safeReadJson(fallbackProfilePath);
  if (fallback && Array.isArray(fallback.profiles)) {
    return fallback.profiles.filter((p) => p && p.status === 'profiled' && p.url);
  }

  throw new Error(
    `Missing semantic profile files. Expected ${path.relative(rootDir, profilePath)} or ${path.relative(rootDir, fallbackProfilePath)}.`
  );
}

function buildSemanticLookup(profile) {
  const fields = Array.isArray(profile.semanticFields)
    ? profile.semanticFields
    : (Array.isArray(profile.fields) ? profile.fields : []);

  const lookup = [];
  for (const field of fields) {
    lookup.push({
      label: normalizeText(field.label || ''),
      name: normalizeText(field.name || ''),
      intent: field.intent || '',
      sampleValue: field.sampleValue || '',
    });
  }
  return lookup;
}

function sampleForIntent(intent, hint) {
  const i = normalizeText(intent);
  const h = normalizeText(hint);
  if (i.includes('email') || /email|mail/.test(h)) return 'qa.int2@example.test';
  if (i.includes('phone') || /telephone|mobile|tel/.test(h)) return '0611223344';
  if (i.includes('first') || /prenom/.test(h)) return 'Nora';
  if (i.includes('last') || /nom/.test(h)) return 'Martin';
  if (i.includes('city') || /ville/.test(h)) return 'Lyon';
  if (i.includes('address') || /adresse/.test(h)) return '12 avenue Jean Jaures';
  if (i.includes('code') || /code/.test(h)) return 'QA1024';
  if (i.includes('date') || /date|naissance/.test(h)) return '15/05/1992';
  if (i.includes('number') || /montant|volume|quantite|duree/.test(h)) return '10';
  if (/siren/.test(h)) return '732829320';
  if (/siret/.test(h)) return '73282932000074';
  return 'Valeur QA';
}

function bestSemanticValue(semanticLookup, label, name, placeholder, type) {
  const key = normalizeText(`${label} ${name} ${placeholder} ${type}`);
  for (const row of semanticLookup) {
    if (row.label && key.includes(row.label)) {
      return row.sampleValue || sampleForIntent(row.intent, key);
    }
    if (row.name && key.includes(row.name)) {
      return row.sampleValue || sampleForIntent(row.intent, key);
    }
  }
  return sampleForIntent('', key);
}

async function closeAnyOverlay(page) {
  const candidates = [
    page.getByRole('button', { name: /Fermer|Retour|Annuler|close|Quitter sans enregistrer/i }).first(),
    page.locator('[role="dialog"] button:has-text("Fermer")').first(),
    page.locator('button:has-text("Annuler")').first(),
  ];

  for (const c of candidates) {
    if (await c.isVisible().catch(() => false)) {
      await c.click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(200);
}

async function collectActionButtons(page) {
  const labels = await page.evaluate(() => {
    const visible = (el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };

    const raw = Array.from(document.querySelectorAll('button, [role="button"], [role="menuitem"]'))
      .filter((el) => visible(el))
      .map((el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    const unique = [];
    const seen = new Set();
    for (const r of raw) {
      if (seen.has(r)) continue;
      seen.add(r);
      unique.push(r);
    }

    return unique;
  });

  return labels
    .filter((label) => !isBlockedAction(label))
    .slice(0, MAX_BUTTONS_PER_ROUTE);
}

async function extractDialogFields(page) {
  return page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], dialog') || document.body;
    const visible = (el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };

    const text = (v) => String(v || '').replace(/\s+/g, ' ').trim();
    const fields = Array.from(dialog.querySelectorAll('input, textarea, select, [role="combobox"], [role="textbox"]'))
      .filter((el) => visible(el))
      .slice(0, 80)
      .map((el) => {
        const id = el.getAttribute('id') || '';
        const forLabel = id ? (document.querySelector(`label[for="${id}"]`)?.textContent || '') : '';
        const nearestLabel = el.closest('label')?.textContent || '';
        const label = text(el.getAttribute('aria-label') || forLabel || nearestLabel || '');
        return {
          label,
          name: text(el.getAttribute('name') || ''),
          placeholder: text(el.getAttribute('placeholder') || ''),
          type: text(el.getAttribute('type') || el.tagName.toLowerCase()),
          required: el.hasAttribute('required') || el.getAttribute('aria-required') === 'true',
          disabled: el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true',
        };
      });

    return {
      hasDialog: !!document.querySelector('[role="dialog"], dialog'),
      fields,
      heading: text((dialog.querySelector('h1, h2, h3') || {}).textContent || ''),
    };
  });
}

async function fillDialogWithRealData(page, fields, semanticLookup) {
  let filled = 0;

  for (const field of fields) {
    if (field.disabled) continue;

    const value = bestSemanticValue(semanticLookup, field.label, field.name, field.placeholder, field.type);
    const labelRe = field.label ? new RegExp(escapeRegExp(field.label), 'i') : null;
    const placeholderRe = field.placeholder ? new RegExp(escapeRegExp(field.placeholder), 'i') : null;

    const candidates = [];
    if (labelRe) candidates.push(page.getByLabel(labelRe).first());
    if (placeholderRe) candidates.push(page.getByPlaceholder(placeholderRe).first());

    if (field.name) {
      candidates.push(page.locator(`input[name="${field.name}"], textarea[name="${field.name}"], select[name="${field.name}"]`).first());
    }

    let target = null;
    for (const c of candidates) {
      if (await c.isVisible().catch(() => false)) {
        target = c;
        break;
      }
    }

    if (!target) continue;

    const t = normalizeText(field.type);
    if (t.includes('select') || t.includes('combobox')) {
      await target.click().catch(() => {});
      const opt = page.locator('mat-option:visible, [role="option"]:visible, option').first();
      if (await opt.isVisible().catch(() => false)) {
        await opt.click().catch(() => {});
        filled += 1;
      }
      continue;
    }

    if (t.includes('radio')) {
      await target.click().catch(() => {});
      filled += 1;
      continue;
    }

    await target.fill(String(value)).catch(() => {});
    if (field.required || String(value).length > 0) {
      filled += 1;
    }
  }

  return filled;
}

async function maybeSubmit(page) {
  if (!ALLOW_SUBMIT) {
    return { attempted: false, submitted: false };
  }

  const submit = page.getByRole('button', { name: /Enregistrer|Valider|Soumettre|Submit|Suivant/i }).first();
  if (await submit.isVisible().catch(() => false)) {
    await submit.click().catch(() => {});
    await page.waitForTimeout(700);
    return { attempted: true, submitted: true };
  }

  return { attempted: true, submitted: false };
}

async function clickAction(page, label) {
  const roleBtn = page.getByRole('button', { name: new RegExp(escapeRegExp(label), 'i') }).first();
  if (await roleBtn.isVisible().catch(() => false)) {
    await roleBtn.click().catch(() => {});
    return true;
  }

  const roleItem = page.getByRole('menuitem', { name: new RegExp(escapeRegExp(label), 'i') }).first();
  if (await roleItem.isVisible().catch(() => false)) {
    await roleItem.click().catch(() => {});
    return true;
  }

  const fallback = page.locator(`button:has-text("${label}"), [role="button"]:has-text("${label}"), [role="menuitem"]:has-text("${label}")`).first();
  if (await fallback.isVisible().catch(() => false)) {
    await fallback.click().catch(() => {});
    return true;
  }

  return false;
}

async function run() {
  const profiles = loadProfiles();
  const routes = MAX_ROUTES > 0 ? profiles.slice(0, MAX_ROUTES) : profiles;

  fs.mkdirSync(evidenceDir, { recursive: true });

  const report = {
    generatedAt: new Date().toISOString(),
    strictMode: STRICT_MODE,
    allowSubmit: ALLOW_SUBMIT,
    totalRoutes: routes.length,
    routes: [],
    summary: {
      totalButtonsInspected: 0,
      totalButtonsClicked: 0,
      totalDialogsDetected: 0,
      totalDialogsFilled: 0,
      missingEvidenceCount: 0,
    },
  };

  for (let i = 0; i < routes.length; i += 1) {
    const route = routes[i];
    const routeId = route.id || `/route-${i + 1}`;
    const routeToken = sanitizeFileToken(routeId);
    const semanticLookup = buildSemanticLookup(route);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      recordVideo: {
        dir: evidenceDir,
        size: { width: 1440, height: 900 },
      },
    });
    const page = await context.newPage();

    const routeResult = {
      routeId,
      url: route.url,
      actions: [],
      summary: {
        buttonsInspected: 0,
        buttonsClicked: 0,
        dialogsDetected: 0,
        dialogsFilled: 0,
        missingEvidence: 0,
      },
      videoPath: null,
      status: 'ok',
      errors: [],
    };

    try {
      await page.goto(route.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

      const actionLabels = await collectActionButtons(page);
      routeResult.summary.buttonsInspected = actionLabels.length;
      report.summary.totalButtonsInspected += actionLabels.length;

      for (let j = 0; j < actionLabels.length; j += 1) {
        const label = actionLabels[j];
        const actionId = `${routeToken}_a${String(j + 1).padStart(3, '0')}`;
        const screenshotPath = path.join(evidenceDir, `${actionId}.png`);
        const beforeUrl = page.url();

        const actionResult = {
          label,
          clicked: false,
          dialogDetected: false,
          fieldsDetected: 0,
          fieldsFilled: 0,
          submitAttempted: false,
          submitSent: false,
          screenshotPath: path.relative(rootDir, screenshotPath),
          navigationChanged: false,
          error: null,
        };

        try {
          await Promise.race([
            (async () => {
              const clicked = await clickAction(page, label);
              actionResult.clicked = clicked;
              if (!clicked) return;

              routeResult.summary.buttonsClicked += 1;
              report.summary.totalButtonsClicked += 1;

              await page.waitForTimeout(650);

              const dialog = await extractDialogFields(page);
              actionResult.dialogDetected = dialog.hasDialog;
              actionResult.fieldsDetected = dialog.fields.length;
              actionResult.navigationChanged = page.url() !== beforeUrl;

              if (dialog.hasDialog) {
                routeResult.summary.dialogsDetected += 1;
                report.summary.totalDialogsDetected += 1;

                const filled = await fillDialogWithRealData(page, dialog.fields, semanticLookup);
                actionResult.fieldsFilled = filled;

                if (filled > 0) {
                  routeResult.summary.dialogsFilled += 1;
                  report.summary.totalDialogsFilled += 1;
                }

                const submit = await maybeSubmit(page);
                actionResult.submitAttempted = submit.attempted;
                actionResult.submitSent = submit.submitted;
              }

              await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
              await closeAnyOverlay(page);
            })(),
            new Promise((_, reject) => {
              setTimeout(() => reject(new Error(`action-timeout>${PER_ACTION_TIMEOUT_MS}ms`)), PER_ACTION_TIMEOUT_MS);
            }),
          ]);
        } catch (error) {
          actionResult.error = String(error && error.message ? error.message : error);
          routeResult.errors.push(`${label}: ${actionResult.error}`);
          await closeAnyOverlay(page).catch(() => {});
        }

        if (!fs.existsSync(screenshotPath)) {
          routeResult.summary.missingEvidence += 1;
          report.summary.missingEvidenceCount += 1;
        }

        routeResult.actions.push(actionResult);
      }
    } catch (error) {
      routeResult.status = 'error';
      routeResult.errors.push(String(error && error.message ? error.message : error));
    }

    const video = page.video();
    await context.close();
    await browser.close();

    if (video) {
      const videoTarget = path.join(evidenceDir, `${routeToken}.webm`);
      await video.saveAs(videoTarget).catch(() => {});
      routeResult.videoPath = path.relative(rootDir, videoTarget);
      if (!fs.existsSync(videoTarget)) {
        routeResult.summary.missingEvidence += 1;
        report.summary.missingEvidenceCount += 1;
      }
    }

    report.routes.push(routeResult);
  }

  fs.mkdirSync(autonomousDir, { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push('# INT2 Popup QA Loop Report');
  lines.push('');
  lines.push(`- Generated at: ${report.generatedAt}`);
  lines.push(`- Strict mode: ${report.strictMode}`);
  lines.push(`- Submit allowed: ${report.allowSubmit}`);
  lines.push(`- Routes tested: ${report.totalRoutes}`);
  lines.push(`- Buttons inspected: ${report.summary.totalButtonsInspected}`);
  lines.push(`- Buttons clicked: ${report.summary.totalButtonsClicked}`);
  lines.push(`- Dialogs detected: ${report.summary.totalDialogsDetected}`);
  lines.push(`- Dialogs filled: ${report.summary.totalDialogsFilled}`);
  lines.push(`- Missing evidence: ${report.summary.missingEvidenceCount}`);
  lines.push('');

  lines.push('| Route | Buttons | Clicked | Dialogs | Filled | Missing Evidence | Video |');
  lines.push('|---|---:|---:|---:|---:|---:|---|');
  for (const route of report.routes) {
    lines.push(`| ${route.routeId} | ${route.summary.buttonsInspected} | ${route.summary.buttonsClicked} | ${route.summary.dialogsDetected} | ${route.summary.dialogsFilled} | ${route.summary.missingEvidence} | ${route.videoPath || 'none'} |`);
  }

  fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

  console.log(`INT2 popup QA loop report generated: ${outJson}`);
  console.log(`INT2 popup QA loop markdown generated: ${outMd}`);

  if (STRICT_MODE && report.summary.missingEvidenceCount > 0) {
    console.error(`INT2 popup QA strict mode failed: missing evidence count=${report.summary.missingEvidenceCount}`);
    process.exit(1);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
