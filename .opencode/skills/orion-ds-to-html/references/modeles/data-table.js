// ══════════════════════════════════════════════════
// Data Table — Tableau de données Orion
// ══════════════════════════════════════════════════
// 2 variantes :
//   1. Simple   : tableau plat, hover bleu, actions ghost + tooltip
//   2. Arborescent : tree-view avec niveaux indentés, chevron ouvrant/fermant

export const name = "Data Table";
export const description = "Tableau de données. Hover fond bleu, actions ghost au survol avec tooltip. Variante arborescente avec niveaux dépliables.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

export const styles = `

  /* ══ Data Table ══ */
  .dt {
    width: 100%;
    border: 1px solid #dee2e9;
    border-radius: 6px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    background: #ffffff;
  }

  /* ── Header ── */
  .dt__head {
    display: flex;
    background: #eaf0ff;
  }

  .dt__th {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #263f7a;
    line-height: 20px;
    white-space: nowrap;
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
  }

  .dt__th--fill { flex: 1; min-width: 0; }

  .dt__th-sort {
    display: flex;
    align-items: center;
    color: #6683c0;
    opacity: 0.7;
    flex-shrink: 0;
  }

  .dt__th:hover .dt__th-sort { opacity: 1; }

  /* Colonne actions — header vide aligné droite */
  .dt__th--actions {
    padding: 4px 14px;
    flex-shrink: 0;
    min-width: 160px;
    justify-content: flex-end;
  }

  /* ── Corps ── */
  .dt__body { display: flex; flex-direction: column; }

  /* ── Ligne ── */
  .dt__row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dee2e9;
    position: relative;
    cursor: pointer;
    background: #ffffff;
    transition: background 0.1s;
  }

  .dt__row:last-child { border-bottom: none; }

  .dt__row:hover { background: #eaf0ff; }

  /* Actions visibles au hover */
  .dt__row .dt__actions { opacity: 0; transition: opacity 0.1s; }
  .dt__row:hover .dt__actions { opacity: 1; }

  /* ── Cellule ── */
  .dt__td {
    padding: 14px 16px;
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
  }

  .dt__td--fill { flex: 1; min-width: 0; }

  /* ── Zone d'actions ── */
  .dt__actions {
    display: flex;
    align-items: center;
    gap: 0;
    padding: 6px 14px;
    flex-shrink: 0;
    justify-content: flex-end;
    min-width: 160px;
  }

  /* Bouton icon ghost */
  .dt__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    color: #48546d;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: visible;
    flex-shrink: 0;
    transition: color 0.15s;
  }

  .dt__btn::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: transparent;
    transition: background 0.15s;
    pointer-events: none;
  }

  .dt__btn:hover::before  { background: rgba(1, 58, 186, 0.08); }
  .dt__btn:active::before { background: rgba(1, 58, 186, 0.12); }
  .dt__btn:hover { color: #013aba; }

  /* ── Tooltip ── */
  .dt__btn .dt__tooltip {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: #1d2024;
    color: #ffffff;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    padding: 4px 8px;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 10;
  }

  .dt__btn .dt__tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: #1d2024;
  }

  .dt__btn:hover .dt__tooltip { opacity: 1; }

  /* ── Tag inline ── */
  .dt__tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 6px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .dt__tag--neutral  { background: #e6e8eb; color: #1d2024; }
  .dt__tag--warning  { background: #fff4e5; color: #8f2800; }
  .dt__tag--success  { background: #e8fdef; color: #017437; }
  .dt__tag--error    { background: #ffe5e5; color: #9f0712; }
  .dt__tag--primary  { background: #eaf0ff; color: #263f7a; }

  /* ── Tag inline — utilise les classes du composant tag.js ── */
  /* (les styles .tag sont injectés via COMPOSANTS dans modeles.html) */

  /* Chip statut — utilise tag.js (.tag.tag--success/error.tag--sm) */
  /* Plus de .dt__status custom */

  /* ══ Version arborescente ══ */

  /* Chevron toggle */
  .dt__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #8e96a3;
    cursor: pointer;
    border-radius: 2px;
    transition: color 0.15s;
    position: relative;
    z-index: 1;
  }

  .dt__toggle .material-symbols-outlined {
    transition: transform 0.15s ease;
  }

  .dt__toggle--open .material-symbols-outlined {
    transform: rotate(90deg);
  }

  .dt__toggle--leaf {
    color: transparent;
    cursor: default;
    pointer-events: none;
  }

  /* Icône de type d'entité */
  .dt__icon {
    display: flex;
    align-items: center;
    color: #8e96a3;
    flex-shrink: 0;
  }

  /* Cellule nom du tree */
  .dt__td--name {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .dt__td--name span.dt__label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Rangées enfants cachées */
  .dt__children { display: none; }
  .dt__children--open { display: block; }

  /* Indentation tree-view par niveau d'imbrication */
  .dt__children--open .dt__td--name { padding-left: 24px; }
  .dt__children--open .dt__children--open .dt__td--name { padding-left: 48px; }
  .dt__children--open .dt__children--open .dt__children--open .dt__td--name { padding-left: 72px; }
  .dt__children--open .dt__children--open .dt__children--open .dt__children--open .dt__td--name { padding-left: 96px; }
  .dt__children--open .dt__children--open .dt__children--open .dt__children--open .dt__children--open .dt__td--name { padding-left: 120px; }
`;

// ═══════════════════════════════════════════
// Helpers communs
// ═══════════════════════════════════════════

function tag(label, type = 'neutral') {
  return `<span class="dt__tag dt__tag--${type}">${label}</span>`;
}

// Statut Active/Inactive — composant tag.js (.tag.tag--success/error.tag--sm)
const TAG_ICON_SM = (iconName) =>
  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="display:inline-flex;flex-shrink:0;"><path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM8.67 11.33H7.33V7.33H8.67V11.33ZM8.67 6H7.33V4.67H8.67V6Z" fill="currentColor"/></svg>`;

function statusTag(active) {
  return active
    ? `<span class="tag tag--success tag--sm">${TAG_ICON_SM()}<span>Active</span></span>`
    : `<span class="tag tag--error tag--sm">${TAG_ICON_SM()}<span>Inactive</span></span>`;
}

function actionBtn(icon, tooltip) {
  return `<button class="dt__btn" type="button">
    ${mi(icon, 16)}
    <span class="dt__tooltip">${tooltip}</span>
  </button>`;
}

// ═══════════════════════════════════════════
// VARIANTE 1 — Tableau simple
// ═══════════════════════════════════════════
function renderSimple() {
  const cols = [
    { label: 'Période de congés', sort: true, cls: 'dt__td--fill' },
    { label: 'Total',             sort: false, cls: '', style: 'width:80px;' },
    { label: 'Statut',            sort: true,  cls: '', style: 'width:160px;' },
    { label: 'Créé le',           sort: true,  cls: '', style: 'width:180px;' },
  ];

  const rows = [
    { cells: ['02/06/2026 – 06/06/2026', '5 j', { type: 'warning', label: 'À valider' }, '12/02/2026 09:00'] },
    { cells: ['14/04/2026 – 18/04/2026', '5 j', { type: 'warning', label: 'À valider' }, '12/03/2026 09:14'] },
    { cells: ['21/07/2026 – 31/07/2026', '9 j', { type: 'success', label: 'Validé'   }, '08/01/2026 08:32'] },
  ];

  const thHtml = cols.map(c => `
    <div class="dt__th ${c.cls}" ${c.style ? `style="${c.style}"` : ''}>
      ${c.label}
      ${c.sort ? `<span class="dt__th-sort">${mi('import_export', 16)}</span>` : ''}
    </div>`).join('') +
    `<div class="dt__th dt__th--actions"></div>`;

  // Toutes les lignes ont les 4 boutons — dernier = arrow_forward "Ouvrir"
  const actions = `${actionBtn('cancel', 'Refusé')}${actionBtn('task_alt', 'Validé')}${actionBtn('remove_circle_outline', 'Annulé')}${actionBtn('arrow_forward', 'Ouvrir')}`;

  const bodyHtml = rows.map(r => {
    const [periode, total, statut, date] = r.cells;
    return `<div class="dt__row">
      <div class="dt__td dt__td--fill">${periode}</div>
      <div class="dt__td" style="width:80px;">${total}</div>
      <div class="dt__td" style="width:160px;">${tag(statut.label, statut.type)}</div>
      <div class="dt__td" style="width:180px;">${date}</div>
      <div class="dt__actions">${actions}</div>
    </div>`;
  }).join('');

  return `<div class="dt">
    <div class="dt__head">${thHtml}</div>
    <div class="dt__body">${bodyHtml}</div>
  </div>`;
}

// ═══════════════════════════════════════════
// VARIANTE 2 — Tableau arborescent
// ═══════════════════════════════════════════

let _treeId = 0;
function treeId() { return 'tr-' + (++_treeId); }

function treeRow({ icon, nameHtml, rattachees = '', statutHtml = '', etat = '', hasChildren = false, id = '', childrenHtml = '', actionsHtml = null } = {}) {
  const toggleHtml = hasChildren
    ? `<span class="dt__toggle" onclick="dtToggle('${id}')">${mi('chevron_right', 16)}</span>`
    : `<span class="dt__toggle dt__toggle--leaf">${mi('chevron_right', 16)}</span>`;

  // Actions par défaut sur toutes les lignes
  const actions = actionsHtml !== null
    ? actionsHtml
    : `${actionBtn('edit', 'Modifier')}${actionBtn('arrow_forward', 'Ouvrir')}`;

  return `
    <div class="dt__row">
      <div class="dt__td dt__td--name">
        ${toggleHtml}
        <span class="dt__icon">${mi(icon, 16)}</span>
        <span class="dt__label">${nameHtml}</span>
      </div>
      <div class="dt__td" style="width:160px;">${rattachees}</div>
      <div class="dt__td" style="width:120px;">${statutHtml}</div>
      <div class="dt__td" style="width:120px;">${etat}</div>
      <div class="dt__actions">${actions}</div>
    </div>
    ${hasChildren ? `<div class="dt__children" id="${id}">${childrenHtml}</div>` : ''}
  `;
}

function renderTree() {
  const thHtml = `
    <div class="dt__th dt__td--name" style="flex:1;min-width:0;">Nom ${mi('import_export', 14)}</div>
    <div class="dt__th" style="width:160px;">Entités rattachées ${mi('import_export', 14)}</div>
    <div class="dt__th" style="width:120px;">Statut ${mi('import_export', 14)}</div>
    <div class="dt__th" style="width:120px;">Etat de la fiche ${mi('import_export', 14)}</div>
    <div class="dt__th dt__th--actions"></div>
  `;

  // Niveau 3 — enfants de Niv 2
  const niv3Children = treeId();
  const niv3Html = ['Nom du regroupement Niv 3','Nom du regroupement Niv 3','Nom du regroupement Niv 3','Nom du regroupement Niv 3'].map(n =>
    treeRow({ indent: 0, icon: 'group', nameHtml: n, rattachees: tag('2–4 sociétés', 'primary') })
  ).join('');

  // Niveau 2 — enfant de Niv 1 (2ème)
  const niv2Id = treeId();
  const societyId = treeId();

  // Agences — enfants d'établissement
  const agencesHtml = `
    ${treeRow({ indent: 0, icon: 'storefront', nameHtml: 'Agence', statutHtml: statusTag(true), etat: 'Incomplète' })}
    ${treeRow({ indent: 0, icon: 'storefront', nameHtml: 'Agence', statutHtml: statusTag(true), etat: 'Complète' })}
    ${treeRow({ indent: 0, icon: 'storefront', nameHtml: 'Agence', statutHtml: statusTag(true), etat: 'Complète' })}
  `;

  const etab1Id = treeId();
  const etab2Id = treeId();

  // Établissements — enfants de société hover (row-9)
  const niv4Id = treeId();
  const niv4Children = `
    ${treeRow({ indent: 0, icon: 'domain', nameHtml: `Nom de l'établissement ${tag('Étab. principale','neutral')} 732 829 320 00045`, rattachees: tag('3 agences','primary'), statutHtml: statusTag(false), etat: 'Complète', hasChildren: true, id: etab1Id, childrenHtml: agencesHtml,
      actionsHtml: '' })}
    ${treeRow({ indent: 0, icon: 'domain', nameHtml: `Nom de l'établissement ${tag('Étab. secondaire','neutral')} 732 829 320 00045`, rattachees: tag('3 agences','primary'), statutHtml: statusTag(true), etat: 'Incomplète', hasChildren: false })}
  `;

  const societyChildren = `
    ${treeRow({ indent: 0, icon: 'group', nameHtml: 'Nom du regroupement Niv 4', rattachees: tag('2 établissements','primary'), hasChildren: true, id: niv4Id, childrenHtml: niv4Children })}
  `;

  // Société (hover row-9)
  const societyRow = treeRow({
    indent: 0, icon: 'domain',
    nameHtml: 'Nom de la société 732 829 320',
    rattachees: tag('1 regroupement','primary'),
    statutHtml: statusTag(true),
    etat: 'Complète',
    hasChildren: true, id: societyId, childrenHtml: societyChildren,
    actionsHtml: `${actionBtn('add_home','Ajouter')}<span class="dt__btn" style="opacity:0.5;cursor:default;">${mi('account_tree',16)}</span>${actionBtn('arrow_forward','Ouvrir')}`
  });

  const societyRow2 = treeRow({
    indent: 0, icon: 'domain',
    nameHtml: 'Nom de la société 732 829 320',
    rattachees: tag('2 agences','primary'),
    statutHtml: statusTag(false),
    etat: 'Complète',
  });

  // Niv 2 children (expand du 2ème Niv 1)
  const niv2Children = `
    ${niv3Html}
    ${societyRow}
    ${societyRow2}
  `;

  const niv1_2_children = `
    ${treeRow({ indent: 0, icon: 'group', nameHtml: 'Nom du regroupement Niv 2', rattachees: tag('4 regroupements','primary'), hasChildren: true, id: niv2Id, childrenHtml: niv2Children })}
  `;

  const bodyHtml = `
    ${treeRow({ indent: 0, icon: 'group', nameHtml: 'Nom du regroupement Niv 1', rattachees: tag('3 regroupements','primary'), hasChildren: false })}
    ${treeRow({ indent: 0, icon: 'group', nameHtml: 'Nom du regroupement Niv 1', rattachees: tag('1 regroupement','primary'), hasChildren: true, id: niv2Id + '-a', childrenHtml: niv1_2_children })}
  `;

  return `<div class="dt">
    <div class="dt__head">${thHtml}</div>
    <div class="dt__body">${bodyHtml}</div>
  </div>`;
}

// ── Variants ──
export const variants = [
  {
    label: 'Simple',
    description: 'Tableau plat. Hover fond bleu, 4 boutons d\'action ghost avec tooltip au survol.',
    render: renderSimple,
  },
  {
    label: 'Arborescent',
    description: 'Tree-view : chevron ouvrant/fermant des enfants indentés. Icônes par type d\'entité.',
    render: renderTree,
  },
];

export const script = `
  function dtToggle(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isOpen = el.classList.contains('dt__children--open');
    el.classList.toggle('dt__children--open', !isOpen);
    // Rotate chevron
    const row = el.previousElementSibling;
    if (row) {
      const toggle = row.querySelector('.dt__toggle');
      if (toggle) toggle.classList.toggle('dt__toggle--open', !isOpen);
    }
  }
`;
