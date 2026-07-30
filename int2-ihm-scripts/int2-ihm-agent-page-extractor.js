const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');
const inPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'page-agent-task.json');

function textOf(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function extractDetails(page) {
  return page.evaluate(() => {
    const isVisible = (el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    };

    const txt = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();

    const allVisible = (selector) =>
      Array.from(document.querySelectorAll(selector))
        .filter((el) => isVisible(el))
        .map((el) => ({
          text: txt(el),
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: (el.className || '').toString().trim() || null,
          role: el.getAttribute('role') || null,
        }));

    const headings = allVisible('h1,h2,h3,h4').filter((x) => x.text).slice(0, 80);
    const buttons = allVisible('button,[role="button"],[role="menuitem"]').filter((x) => x.text).slice(0, 200);

    const links = Array.from(document.querySelectorAll('a[href]'))
      .filter((el) => isVisible(el))
      .map((el) => ({
        text: txt(el),
        href: el.getAttribute('href') || '',
      }))
      .slice(0, 400);

    const inputs = Array.from(document.querySelectorAll('input,textarea,select,[role="combobox"],[role="textbox"]'))
      .filter((el) => isVisible(el))
      .map((el) => {
        const tag = el.tagName.toLowerCase();
        const field = {
          tag,
          type: el.getAttribute('type') || tag,
          name: el.getAttribute('name') || null,
          id: el.id || null,
          role: el.getAttribute('role') || null,
          label: null,
          placeholder: el.getAttribute('placeholder') || null,
          ariaLabel: el.getAttribute('aria-label') || null,
          autocomplete: el.getAttribute('autocomplete') || null,
          required: el.hasAttribute('required') || el.getAttribute('aria-required') === 'true',
          disabled: el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true',
          readonly: el.hasAttribute('readonly') || el.getAttribute('aria-readonly') === 'true',
        };

        if (field.id) {
          const byFor = document.querySelector(`label[for="${field.id}"]`);
          if (byFor) field.label = txt(byFor) || null;
        }

        if (!field.label) {
          const nearestLabel = el.closest('label');
          if (nearestLabel) field.label = txt(nearestLabel) || null;
        }

        if (!field.label) {
          const parent = el.parentElement;
          if (parent) {
            const pseudo = parent.querySelector('label,.mdc-floating-label,.mat-mdc-form-field-label');
            if (pseudo) field.label = txt(pseudo) || null;
          }
        }

        return field;
      })
      .slice(0, 500);

    const options = Array.from(document.querySelectorAll('mat-option,[role="option"],option'))
      .filter((el) => isVisible(el))
      .map((el) => txt(el))
      .filter(Boolean)
      .slice(0, 300);

    const tables = Array.from(document.querySelectorAll('table'))
      .filter((el) => isVisible(el))
      .map((table) => {
        const headers = Array.from(table.querySelectorAll('th')).map((th) => txt(th)).filter(Boolean).slice(0, 80);
        const rows = table.querySelectorAll('tr').length;
        return { headers, rows };
      })
      .slice(0, 40);

    const dialogs = allVisible('[role="dialog"],dialog').slice(0, 30);
    const alerts = allVisible('[role="alert"],.error,.alert,.mat-mdc-snack-bar-label,.mdc-snackbar__label').slice(0, 80);

    const visibleTextBlocks = Array.from(document.querySelectorAll('main,section,article,form,aside,dialog'))
      .filter((el) => isVisible(el))
      .map((el) => txt(el))
      .filter((t) => t && t.length > 8)
      .slice(0, 120);

    return {
      title: document.title || '',
      url: location.href,
      headings,
      buttons,
      links,
      fields: inputs,
      options,
      tables,
      dialogs,
      alerts,
      visibleTextBlocks,
      counters: {
        headings: headings.length,
        buttons: buttons.length,
        links: links.length,
        fields: inputs.length,
        options: options.length,
        tables: tables.length,
        dialogs: dialogs.length,
        alerts: alerts.length,
        textBlocks: visibleTextBlocks.length,
      },
    };
  });
}

async function main() {
  if (!fs.existsSync(inPath)) {
    throw new Error(`Missing page agent task file: ${inPath}`);
  }

  const task = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  const result = {
    pageId: task.pageId,
    pageUrl: task.pageUrl,
    agentId: task.agentId,
    runAt: new Date().toISOString(),
    success: false,
    error: null,
    extract: null,
  };

  try {
    await page.goto(task.pageUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});

    // Safe exploration clicks for menu expansion only.
    const safeCandidates = [
      page.locator('[role="button"]:has-text("keyboard_arrow_down")').first(),
      page.locator('[role="button"]:has-text("Menu")').first(),
    ];
    for (const cand of safeCandidates) {
      if (await cand.isVisible().catch(() => false)) {
        await cand.click().catch(() => {});
        await page.waitForTimeout(200);
      }
    }

    result.extract = await extractDetails(page);
    result.success = true;
  } catch (error) {
    result.error = String(error && error.message ? error.message : error);
  }

  await context.close();
  await browser.close();

  fs.mkdirSync(path.dirname(task.outputPath), { recursive: true });
  fs.writeFileSync(task.outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
