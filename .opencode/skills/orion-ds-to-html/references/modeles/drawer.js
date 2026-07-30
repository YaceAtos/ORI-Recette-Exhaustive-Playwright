// ══════════════════════════════════════════════════
// Drawer — Panneau latéral de consultation/détail
// ══════════════════════════════════════════════════
// Panneau fixe à droite. Contient :
//   - Header : titre + tags statut + bouton fermer (×)
//   - Blocs info (fond gris clair) : données clés
//   - Tabs : bascule entre vues (ex: Organigramme / Établissements)
//   - Contenu de tab : organigramme vertical OU liste de cards
//   - Footer fixe : bouton Tonal + bouton Filled
//
// Variantes :
//   1. Une seule variante — le modèle complet avec tabs interactifs

export const name = "Drawer";
export const description = "Panneau latéral de consultation. Header, blocs info, tabs interactifs, contenu variable, footer fixe avec boutons d'action.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

export const styles = `

  /* ══ Drawer ══ */

  .drw {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-left: 1px solid #dee2e9;
    width: 100%;
    height: 100%;
    min-height: 600px;
    font-family: 'Inter', sans-serif;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* ── Scroll area (tout sauf le footer) ── */
  .drw__scroll {
    flex: 1;
    overflow-y: auto;
    padding: 24px 24px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 80px; /* espace pour le footer */
  }

  /* ── Header ── */
  .drw__header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }

  .drw__title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .drw__title {
    font-size: 20px;
    font-weight: 700;
    color: #1d2024;
    line-height: 30px;
  }

  .drw__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    color: #48546d;
    cursor: pointer;
    border-radius: 4px;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    transition: color 0.15s;
  }

  .drw__close::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: transparent;
    transition: background 0.15s;
    pointer-events: none;
  }

  .drw__close:hover { color: #1d2024; }
  .drw__close:hover::after { background: rgba(29,32,36,0.06); }

  .drw__tags {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* Tag lg dans le header */
  .drw__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 32px;
    padding: 6px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
  }

  .drw__tag--success { background: #e8fdef; color: #017437; }
  .drw__tag--neutral { background: #e6e8eb; color: #1d2024; }
  .drw__tag--error   { background: #ffe5e5; color: #9f0712; }
  .drw__tag--info    { background: #e0e7ff; color: #150792; }
  .drw__tag--warning { background: #fff4e5; color: #8f2800; }

  /* ── Blocs info ── */
  .drw__infos {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex-shrink: 0;
  }

  .drw__info-block {
    background: #fafafa;
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .drw__info-title {
    font-size: 14px;
    font-weight: 500;
    color: #1d2024;
    line-height: 20px;
  }

  .drw__info-row {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #48546d;
    line-height: 16px;
  }

  /* ── Tabs ── */
  .drw__tabs {
    display: flex;
    border-bottom: 1px solid #e7e8e9;
    flex-shrink: 0;
  }

  .drw__tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    color: #1d2024;
    cursor: pointer;
    background: transparent;
    border: none;
    font-family: 'Inter', sans-serif;
    position: relative;
    transition: color 0.15s;
    padding: 0 16px;
  }

  .drw__tab::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: transparent;
    border-radius: 2px 2px 0 0;
    transition: background 0.15s;
  }

  .drw__tab--active { color: #1d2024; }
  .drw__tab--active::after { background: #013aba; }
  .drw__tab:hover:not(.drw__tab--active) { color: #48546d; }

  /* ── Contenu de tab ── */
  .drw__tab-content { display: none; flex-direction: column; gap: 16px; flex: 1; }
  .drw__tab-content--active { display: flex; }

  /* ── Organigramme ── */
  .drw__orgchart {
    background: rgba(0,0,0,0.01);
    border: 1px solid #dee2e9;
    border-radius: 6px;
    padding: 24px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    overflow: hidden;
  }

  .drw__org-node {
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    padding: 14px 18px 14px 24px;
    width: 100%;
    max-width: 320px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.04);
    display: flex;
    flex-direction: column;
    gap: 0;
    flex-shrink: 0;
  }

  .drw__org-node-title {
    font-size: 16px;
    font-weight: 700;
    color: #1d2024;
    line-height: 24px;
  }

  .drw__org-node-sub {
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    line-height: 20px;
  }

  .drw__org-tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 4px; }

  /* Connecteur vertical entre noeuds */
  .drw__org-connector {
    width: 1px;
    height: 14px;
    background: #dee2e9;
    flex-shrink: 0;
  }

  /* Boutons sous l'organigramme */
  .drw__org-actions {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
  }

  .drw__org-actions-row {
    display: flex;
    gap: 12px;
  }

  .drw__btn-outlined {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #48546d;
    background: transparent;
    border: 1px solid #dee2e9;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s;
  }

  .drw__btn-outlined::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .drw__btn-outlined:hover { border-color: #48546d; }
  .drw__btn-outlined:hover::after { background: rgba(72,84,109,0.06); }

  /* ── Liste établissements ── */
  .drw__list-count {
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    line-height: 20px;
  }

  .drw__list { display: flex; flex-direction: column; gap: 8px; }

  .drw__list-item {
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;
    position: relative;
    transition: box-shadow 0.15s;
  }

  .drw__list-item::after {
    content: ""; position: absolute; inset: 0; border-radius: 8px;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .drw__list-item:hover { box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
  .drw__list-item:hover::after { background: rgba(29,32,36,0.02); }

  .drw__list-item-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .drw__list-item-title {
    font-size: 14px;
    font-weight: 700;
    color: #1d2024;
    line-height: 20px;
  }

  .drw__list-item-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    line-height: 20px;
  }

  .drw__list-item-link {
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    color: #013aba;
    cursor: pointer;
    text-decoration: none;
    margin-top: 2px;
    transition: text-decoration 0.1s;
  }

  .drw__list-item-link:hover { text-decoration: underline; }

  /* ── Footer fixe ── */
  .drw__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    border-top: 1px solid #dee2e9;
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }

  /* Bouton tonal */
  .drw__btn-tonal {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #263f7a;
    background: #eaf0ff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: background 0.15s;
  }

  .drw__btn-tonal::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .drw__btn-tonal:hover::after { background: rgba(38,63,122,0.08); }

  /* Bouton filled */
  .drw__btn-filled {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    background: #013aba;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    transition: background 0.15s;
  }

  .drw__btn-filled::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }

  .drw__btn-filled:hover::after { background: rgba(255,255,255,0.08); }
`;

// ─── Helpers ────────────────────────────────────────

function infoBlock(title, rows) {
  const rowsHtml = rows.map(([icon, text]) =>
    `<div class="drw__info-row">${mi(icon, 16)} ${text}</div>`
  ).join('');
  return `<div class="drw__info-block">
    <span class="drw__info-title">${title}</span>
    ${rowsHtml}
  </div>`;
}

function orgNode(title, subtitle, tags = []) {
  const tagsHtml = tags.length
    ? `<div class="drw__org-tags">${tags.map(t =>
        `<span class="drw__tag drw__tag--${t.type}" style="height:24px;padding:4px 6px;border-radius:6px;font-size:12px;">
          ${mi(t.icon || 'home_work', 14)} ${t.label}
        </span>`
      ).join('')}</div>`
    : '';
  return `<div class="drw__org-node">
    <span class="drw__org-node-title">${title}</span>
    <span class="drw__org-node-sub">${subtitle}</span>
    ${tagsHtml}
  </div>`;
}

function listItem(name, statusLabel, statusType, address, type, linkText = 'Consulter') {
  const statusIcon = statusType === 'success' ? 'mode_standby' : 'do_disturb_on';
  return `<div class="drw__list-item">
    <div class="drw__list-item-header">
      <span class="drw__list-item-title">${name}</span>
      <span class="drw__tag drw__tag--${statusType}" style="height:24px;padding:4px 6px;font-size:12px;">
        ${mi(statusIcon, 14)} ${statusLabel}
      </span>
    </div>
    <div class="drw__list-item-row">${mi('location_on', 16)} ${address}</div>
    <div class="drw__list-item-row">${mi('home_work', 16)} ${type}</div>
    <a class="drw__list-item-link" href="#" onclick="event.preventDefault()">${linkText}</a>
  </div>`;
}

// ─── Render ─────────────────────────────────────────

function renderDrawer() {
  const header = `
    <div class="drw__header">
      <div class="drw__title-row">
        <span class="drw__title">Nom de la société</span>
        <button class="drw__close" type="button" title="Fermer" onclick="drwClose()">
          ${mi('close', 20)}
        </button>
      </div>
      <div class="drw__tags">
        <span class="drw__tag drw__tag--success">${mi('mode_standby', 20)} Active</span>
        <span class="drw__tag drw__tag--neutral">${mi('home_work', 20)} 4 Établissements</span>
      </div>
    </div>`;

  const infos = `
    <div class="drw__infos">
      ${infoBlock("Numéro d'identification", [
        ['numbers', '123 456 789 00045'],
      ])}
      ${infoBlock('Représentant légale', [
        ['phone', '+33 01234567'],
        ['mail', 'Adresse.email@gmail.com'],
      ])}
    </div>`;

  const tabs = `
    <div class="drw__tabs" id="drw-tabs">
      <button class="drw__tab drw__tab--active" data-tab="organigramme"
        onclick="drwSwitch(this,'organigramme')">Organigramme</button>
      <button class="drw__tab" data-tab="etablissements"
        onclick="drwSwitch(this,'etablissements')">Établissements</button>
    </div>`;

  // Tab 1 — Organigramme
  const organigramme = `
    <div class="drw__tab-content drw__tab-content--active" id="drw-tab-organigramme">
      <div class="drw__orgchart">
        ${orgNode('O2 Jardibrico', 'ID du regroupement')}
        <div class="drw__org-connector"></div>
        ${orgNode('Franchisé', 'ID du regroupement')}
        <div class="drw__org-connector"></div>
        ${orgNode('Region 1', 'ID du regroupement', [{ label: '32 sociétés', type: 'info', icon: 'home_work' }])}
        <div class="drw__org-connector"></div>
        ${orgNode('Nom de la société', '', [{ label: '4 Établissements', type: 'info', icon: 'home_work' }])}
        <div class="drw__org-actions">
          <div class="drw__org-connector"></div>
          <div class="drw__org-actions-row">
            <button class="drw__btn-outlined" type="button">${mi('add', 16)} Créer un établissement</button>
            <button class="drw__btn-outlined" type="button">${mi('add', 16)} Créer un regroupement</button>
          </div>
        </div>
      </div>
    </div>`;

  // Tab 2 — Établissements
  const etablissements = `
    <div class="drw__tab-content" id="drw-tab-etablissements">
      <p class="drw__list-count">4 établissements au sein de la société</p>
      <div class="drw__list">
        ${listItem("Nom de l'établissement", 'Active', 'success', "3 rue des sapins d'andalousie, 23400 Petit-Village", 'Etablissement principal')}
        ${listItem("Nom de l'établissement", 'Active', 'success', "3 rue des sapins d'andalousie, 23400 Petit-Village", 'Etablissement principal')}
        ${listItem("Nom de l'établissement", 'Inactive', 'error', "3 rue des sapins d'andalousie, 23400 Petit-Village", 'Etablissement principal')}
        ${listItem("Nom de l'établissement", 'Active', 'success', "3 rue des sapins d'andalousie, 23400 Petit-Village", 'Etablissement principal')}
      </div>
    </div>`;

  const footer = `
    <div class="drw__footer">
      <button class="drw__btn-tonal" type="button">Modifier</button>
      <button class="drw__btn-filled" type="button">Consulter</button>
    </div>`;

  return `<div class="drw" id="drw-main">
    <div class="drw__scroll">
      ${header}
      ${infos}
      ${tabs}
      ${organigramme}
      ${etablissements}
    </div>
    ${footer}
  </div>`;
}

// ─── Render public — bouton + overlay injecté dans le body ───────────────────

function renderDrawerTrigger() {
  // Le HTML du panneau complet (sera injecté dans l'overlay)
  const panelHtml = renderDrawer()
    .replace(
      `onclick="this.closest('.drw')?.style.setProperty('display','none')"`,
      `onclick="drwClose()"`
    );

  return `
    <div style="display:flex;align-items:center;justify-content:center;padding:16px;">
      <button
        onclick="drwOpen()"
        style="display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 20px;
               background:#013aba;color:#fff;border:none;border-radius:4px;
               font-size:14px;font-weight:500;font-family:Inter,sans-serif;cursor:pointer;">
        <span class="material-symbols-outlined" style="font-size:18px;line-height:1;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">open_in_new</span>
        Ouvrir le drawer
      </button>
    </div>

    <!-- Overlay + panneau — injectés une seule fois -->
    <div id="drw-overlay-wrap" style="display:none;position:fixed;inset:0;z-index:1000;">
      <!-- Fond noir transparent -->
      <div
        id="drw-backdrop"
        onclick="drwClose()"
        style="position:absolute;inset:0;background:rgba(0,0,0,0.45);">
      </div>
      <!-- Panneau lateral droit -->
      <div
        id="drw-panel"
        style="position:absolute;top:0;right:0;width:554px;height:100%;
               box-shadow:-4px 0 24px rgba(0,0,0,0.12);overflow:hidden;">
        ${panelHtml}
      </div>
    </div>`;
}

export const variants = [
  {
    label: 'Drawer',
    description: "Bouton d'ouverture. Le drawer s'ouvre à droite par-dessus la page avec un overlay sombre.",
    render: renderDrawerTrigger,
  },
];

export const script = `
  function drwOpen() {
    const wrap = document.getElementById('drw-overlay-wrap');
    if (wrap) {
      wrap.style.display = 'block';
      // Empêche le scroll du body pendant que le drawer est ouvert
      document.body.style.overflow = 'hidden';
    }
  }

  function drwClose() {
    const wrap = document.getElementById('drw-overlay-wrap');
    if (wrap) {
      wrap.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function drwSwitch(btn, tabId) {
    const tabs = btn.closest('.drw__tabs');
    tabs.querySelectorAll('.drw__tab').forEach(t => t.classList.remove('drw__tab--active'));
    btn.classList.add('drw__tab--active');

    const scroll = btn.closest('.drw__scroll');
    scroll.querySelectorAll('.drw__tab-content').forEach(c => c.classList.remove('drw__tab-content--active'));

    const target = scroll.querySelector('#drw-tab-' + tabId);
    if (target) target.classList.add('drw__tab-content--active');
  }
`;
