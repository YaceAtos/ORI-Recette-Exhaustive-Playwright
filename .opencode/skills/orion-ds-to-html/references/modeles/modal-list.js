// ══════════════════════════════════════════════════
// Modal List — Bloc de liste d'éléments pour modales
// ══════════════════════════════════════════════════
// 2 variantes :
//   - Simple  : header + lignes (2 selects + poubelle), interactif
//   - Large   : header + sous-titre + éléments numérotés avec grille et checkbox

export const name = "Modal List";
export const description = "Bloc de liste d'éléments répétables pour modales. Header titre + bouton ghost, ajout/suppression interactifs.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

export const styles = `

  /* ══ Modal List ══ */
  .ml {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  /* ── Header ── */
  .ml__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .ml__header-left { display: flex; flex-direction: column; gap: 2px; }
  .ml__title   { font-size: 14px; font-weight: 700; color: #1d2024; line-height: 20px; }
  .ml__subtitle { font-size: 14px; font-weight: 400; color: #8e96a3; line-height: 20px; }

  /* Bouton ghost "Ajouter" */
  .ml__add-btn {
    display: inline-flex;
    align-items: center;
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    font-weight: 500;
    color: #013aba;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .ml__add-btn::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }
  .ml__add-btn:hover::after  { background: rgba(1,58,186,0.08); }
  .ml__add-btn:active::after { background: rgba(1,58,186,0.10); }

  /* ── Lignes ── */
  .ml__rows { display: flex; flex-direction: column; gap: 8px; }

  /* Ligne : 2 selects flex-1 + poubelle */
  .ml__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ml__row .ml__ff { flex: 1; min-width: 0; }

  /* ── Form field dans le contexte ml (fond blanc, border gris clair) ── */
  .ml__ff {
    position: relative;
    display: flex;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
  }

  .ml__ff-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #ffffff;
    border: 1px solid #e7e8e9;
    border-radius: 6px;
    transition: border-color 0.15s;
    cursor: pointer;
    padding: 0 14px 0 16px;
    gap: 8px;
  }
  .ml__ff-wrapper:hover { border-color: #1d2024; }

  .ml__ff-value {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: #1d2024;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 40px;
  }

  .ml__ff-chevron {
    flex-shrink: 0;
    color: #48546d;
    display: flex;
    align-items: center;
  }

  /* Label : centré quand vide, flottant quand rempli */
  .ml__ff-label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-weight: 400;
    color: #48546d;
    background: transparent;
    padding: 0;
    line-height: 20px;
    pointer-events: none;
    white-space: nowrap;
    transition: all 0.15s ease;
  }

  /* Rempli : label flottant au-dessus */
  .ml__ff--filled .ml__ff-label {
    top: 0;
    transform: translateY(-50%);
    font-size: 12px;
    color: #535862;
    background: #ffffff;
    padding: 0 2px;
    left: 12px;
  }

  /* ── Bouton poubelle outlined ── */
  .ml__delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background: transparent;
    border: 1px solid #7381a2;
    border-radius: 6px;
    color: #535862;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.15s, color 0.15s;
  }
  .ml__delete::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }
  .ml__delete:hover { border-color: #b2271e; color: #b2271e; }
  .ml__delete:hover::after { background: rgba(178,39,30,0.06); }

  /* ── Version large : éléments numérotés ── */
  .ml__items { display: flex; flex-direction: column; gap: 0; }

  .ml__item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
    border-bottom: 1px solid #dee2e9;
  }
  .ml__item:first-child { padding-top: 0; }
  .ml__item:last-child  { border-bottom: none; padding-bottom: 0; }

  .ml__item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ml__item-title { font-size: 14px; font-weight: 500; color: #1d2024; line-height: 20px; }

  .ml__item-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .ml__ff--full { grid-column: 1 / -1; }

  /* Checkbox */
  .ml__checkbox-row {
    display: flex;
    align-items: center;
    gap: 8px;
    grid-column: 1 / -1;
  }
  .ml__checkbox-row input[type="checkbox"] {
    width: 16px; height: 16px;
    accent-color: #013aba; cursor: pointer; flex-shrink: 0;
  }
  .ml__checkbox-row label { font-size: 14px; color: #1d2024; cursor: pointer; line-height: 20px; }

  .ml__conditional { display: none; }
  .ml__conditional--visible { display: contents; }
`;

// ── Helpers ──

function ffSelect(label, value = '') {
  const filled = value !== '';
  return `<div class="ml__ff${filled ? ' ml__ff--filled' : ''}">
    <div class="ml__ff-wrapper">
      <span class="ml__ff-label">${label}</span>
      <span class="ml__ff-value">${value}</span>
      <span class="ml__ff-chevron">${mi('keyboard_arrow_down', 16)}</span>
    </div>
  </div>`;
}

function ffInput(label, value = '', trailing = '') {
  const filled = value !== '';
  const trailingHtml = trailing
    ? `<span style="display:flex;align-items:center;color:#48546d;flex-shrink:0;">${trailing}</span>`
    : '';
  return `<div class="ml__ff${filled ? ' ml__ff--filled' : ''}">
    <div class="ml__ff-wrapper" style="cursor:text;">
      <span class="ml__ff-label">${label}</span>
      <span class="ml__ff-value">${value}</span>
      ${trailingHtml}
    </div>
  </div>`;
}

function delBtn(selector = '.ml__row') {
  return `<button class="ml__delete" type="button" title="Supprimer"
    onclick="(this.closest('${selector}'))?.remove()">
    ${mi('delete', 16)}
  </button>`;
}

function rowHtml(comp = '', niv = '') {
  return `<div class="ml__row">
    ${ffSelect('Compétences', comp)}
    ${ffSelect('Niveau', niv)}
    ${delBtn('.ml__row')}
  </div>`;
}

const ICON_CAL = mi('calendar_today', 16);

function largeItem(num, intitule, isSelect, niveau, date, checked, partial, autreIntitule) {
  const cbId   = `ml-cb-${num}`;
  const condId = `ml-cond-${num}`;
  const intituleHtml = isSelect ? ffSelect('Intitulé du diplôme', intitule) : ffInput('Intitulé du diplôme', intitule);
  const autreHtml = autreIntitule
    ? `<div class="ml__ff--full">${ffInput('Autre intitulé', autreIntitule)}</div>` : '';
  return `<div class="ml__item">
    <div class="ml__item-header">
      <span class="ml__item-title">Diplôme n°${num}</span>
      ${delBtn('.ml__item')}
    </div>
    <div class="ml__item-grid">
      ${intituleHtml}
      ${ffInput('Niveau', niveau)}
      ${autreHtml}
      <div class="ml__ff--full">${ffInput("Date d'obtention", date, ICON_CAL)}</div>
      <div class="ml__checkbox-row">
        <input type="checkbox" id="${cbId}" ${checked ? 'checked' : ''}
          onchange="document.getElementById('${condId}').classList.toggle('ml__conditional--visible',this.checked)">
        <label for="${cbId}">Obtention partielle du diplôme</label>
      </div>
      <div class="ml__conditional${checked ? ' ml__conditional--visible' : ''}" id="${condId}">
        <div class="ml__ff--full">${ffInput('Partie obtenue', partial)}</div>
      </div>
    </div>
  </div>`;
}

function renderSimple() {
  const rows = [
    ['Ménage',                    'Intermédiaire'],
    ["Garde d'enfants",           'Débutant'],
    ['Sénior avec accompagnement','Expert'],
  ].map(([c, n]) => rowHtml(c, n)).join('');

  return `<div class="ml" id="ml-simple">
    <div class="ml__header">
      <div class="ml__header-left">
        <span class="ml__title">Compétences</span>
      </div>
      <button class="ml__add-btn" type="button" onclick="mlAddRow()">Ajouter une compétence</button>
    </div>
    <div class="ml__rows" id="ml-simple-rows">${rows}</div>
  </div>`;
}

function renderLarge() {
  return `<div class="ml">
    <div class="ml__header">
      <div class="ml__header-left">
        <span class="ml__title">Diplômes</span>
        <span class="ml__subtitle">Facultatif</span>
      </div>
      <button class="ml__add-btn" type="button">Ajouter un diplôme</button>
    </div>
    <div class="ml__items">
      ${largeItem(1,'Licence aides à la personnes',false,'BAC +2','12/08/2019',false,'','')}
      ${largeItem(2,'Licence aides à la personnes',false,'BAC +3','23/09/2021',true,'Accompagnement','')}
      ${largeItem(3,'Autre diplôme',true,'BAC +3','23/09/2021',true,'Accompagnement','BTS sanitaire et sociale')}
    </div>
  </div>`;
}

export const variants = [
  {
    label: 'Simple — interactif',
    description: "Header titre + bouton ghost. Lignes : 2 selects 50/50 + poubelle. Ajout et suppression interactifs.",
    render: renderSimple,
  },
  {
    label: 'Large — éléments numérotés',
    description: "Header avec sous-titre. Éléments numérotés, grille 2 colonnes, checkbox conditionnelle.",
    render: renderLarge,
  },
];

export const script = `
  function mlAddRow() {
    const rows = document.getElementById('ml-simple-rows');
    if (!rows) return;
    const mi = (n, size) => '<span class="material-symbols-outlined" style="font-size:'+size+'px;line-height:1;font-variation-settings:\\'FILL\\' 0,\\'wght\\' 400,\\'GRAD\\' 0,\\'opsz\\' 20;">'+n+'</span>';
    const ff = (label) => '<div class="ml__ff"><div class="ml__ff-wrapper" style="cursor:pointer;"><span class="ml__ff-label">'+label+'</span><span class="ml__ff-value"></span>'+mi('keyboard_arrow_down',16)+'</div></div>';
    const row = document.createElement('div');
    row.className = 'ml__row';
    row.innerHTML =
      ff('Compétences') +
      ff('Niveau') +
      '<button class="ml__delete" type="button" title="Supprimer" onclick="this.closest(\\'.ml__row\\').remove()">'+mi('delete',16)+'</button>';
    rows.appendChild(row);
  }
`;
