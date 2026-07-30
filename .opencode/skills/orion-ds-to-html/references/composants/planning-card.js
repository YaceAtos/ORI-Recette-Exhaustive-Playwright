// ══════════════════════════════════════════════════
// Planning Card — Intervention / RDV Commercial / Événement RH
// ══════════════════════════════════════════════════
// 3 types × 4 tailles × 2 directions × états (default, hover, focus, selected, disabled, non-pourvue)

export const name = "Planning Card";
export const description = "Carte planning. 3 types (Intervention, RDV Commercial, Événement RH) × 4 tailles (Grand, Medium, Small, Nom) × 2 directions (Verticale, Horizontale).";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_REPEAT = mi('repeat', 16, 'pc__serie-icon');
const ICON_PEOPLE = mi('people_outline', 16, 'pc__icon pc__icon--muted');
const ICON_KEY    = mi('key', 16, 'pc__icon pc__icon--muted');
const ICON_NOTE   = mi('note_alt', 16, 'pc__icon');

// ── CSS ──
export const styles = `
  /* ══ Planning Card — base ══ */
  .pc {
    position: relative;
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    cursor: default;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
  }

  .pc:hover {
    border-color: #013aba;
  }

  .pc:focus-within,
  .pc--selected {
    border-color: #013aba;
    box-shadow: 0 0 0 1px #013aba;
    outline: none;
  }

  .pc--disabled {
    opacity: 0.45;
    pointer-events: none;
  }

  /* ── Side line ── */
  .pc__side-line {
    flex-shrink: 0;
    background: #013aba;
    width: 4px;
    border-radius: 6px 0 0 6px;
  }

  /* ── Type: RDV Commercial — pas de sideline, bordure pointillée noire ── */
  .pc--rdv-commercial {
    border: 0.5px dashed #373b44;
  }

  .pc--rdv-commercial:hover {
    border-color: #1d2024;
  }

  .pc--rdv-commercial:focus-within,
  .pc--rdv-commercial.pc--selected {
    border-color: #373b44;
    box-shadow: 0 0 0 1px #373b44;
  }

  .pc--rdv-commercial .pc__body {
    padding-left: 16px;
  }

  /* ── Type: Événement RH — pas de sideline, bordure verte ── */
  .pc--evenement-rh {
    border-color: #008236;
  }

  .pc--evenement-rh:hover {
    border-color: #006a2b;
  }

  .pc--evenement-rh:focus-within,
  .pc--evenement-rh.pc--selected {
    border-color: #008236;
    box-shadow: 0 0 0 1px #008236;
  }

  /* ── Direction: Verticale (défaut) ── */
  .pc--vertical {
    flex-direction: row;
  }

  .pc--vertical .pc__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    min-width: 0;
  }

  /* ── Direction: Horizontale ── */
  .pc--horizontal {
    flex-direction: row;
  }

  .pc--horizontal .pc__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    min-width: 0;
  }

  /* ── Header ── */
  .pc__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 4px;
    min-width: 0;
  }

  .pc__name {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #1d2024;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .pc__serie-icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: #48546d;
    margin-top: 2px;
  }

  /* ── Time ── */
  .pc__time {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #48546d;
    white-space: nowrap;
  }

  /* ── Icons row ── */
  .pc__icons {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
    flex-wrap: wrap;
  }

  .pc__icon {
    width: 16px;
    height: 16px;
    color: #013aba;
    flex-shrink: 0;
  }

  .pc__icon--muted {
    color: #48546d;
  }

  /* ── Tags row (intervention: 1 tag texte) ── */
  .pc__tags {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px;
    margin-top: 4px;
    overflow: hidden;
    min-width: 0;
  }

  .pc__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    background: #eaf0ff;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #013aba;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 24px;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .pc__tag-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* ── Tags RDV Commercial: icône-only, couleurs custom ── */
  .pc__tags-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
    min-width: 0;
  }

  .pc__tags-count {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #121316;
    flex-shrink: 0;
  }

  .pc__tags-list {
    display: flex;
    gap: 2px;
    overflow: hidden;
    min-width: 0;
    flex: 1;
    mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
  }

  .pc__tag--icon-only {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 6px;
    border-radius: 6px;
    height: 24px;
    width: auto;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .pc__tag--icon-only .material-symbols-outlined {
    font-size: 16px;
    line-height: 1;
  }

  /* ── Tag Événement RH : vert ── */
  .pc__tag--rh {
    background: #e8fdef;
    color: #017437;
  }

  .pc__tag--rh .pc__tag-icon {
    color: #017437;
  }

  /* ══ Tailles ══ */

  /* ── Grand (1) ── */
  .pc--1.pc--vertical  { width: 200px; }
  .pc--1.pc--horizontal { width: 265px; }

  /* ── Medium (2) ── */
  .pc--2.pc--vertical {
    width: 200px;
  }

  .pc--2.pc--vertical .pc__body {
    padding: 6px 0 6px 8px;
    gap: 2px;
    overflow: hidden;
  }

  .pc--2.pc--vertical .pc__row {
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
  }

  .pc--2.pc--vertical .pc__row .pc__name,
  .pc--2.pc--vertical .pc__row .pc__tags,
  .pc--2.pc--vertical .pc__row .pc__tags-row {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 20px), transparent);
  }

  .pc--2.pc--vertical .pc__row .pc__time,
  .pc--2.pc--vertical .pc__row .pc__icons {
    flex-shrink: 0;
  }

  .pc--2.pc--vertical .pc__name {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  }

  .pc--2.pc--vertical .pc__time {
    flex-shrink: 0;
  }

  .pc--2.pc--horizontal {
    width: 124px;
  }

  /* ── Small (3) ── */
  .pc--3.pc--vertical {
    width: 200px;
  }

  .pc--3.pc--vertical .pc__body {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
  }

  .pc--3.pc--vertical .pc__header {
    flex: 1;
    min-width: 0;
  }

  .pc--3.pc--vertical .pc__time {
    flex-shrink: 0;
    margin-left: auto;
  }

  .pc--3.pc--horizontal {
    width: 83px;
  }

  .pc--3.pc--horizontal .pc__name {
    white-space: normal;
    word-break: break-word;
  }

  .pc--3.pc--horizontal .pc__time {
    white-space: normal;
  }

  /* ── Nom (4) ── */
  .pc--4.pc--vertical {
    width: 117px;
  }

  .pc--4.pc--vertical .pc__body {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
  }

  .pc--4.pc--horizontal {
    width: 56px;
  }

  .pc--4.pc--horizontal .pc__name {
    white-space: normal;
    word-break: break-word;
    font-size: 12px;
    line-height: 16px;
  }

  .pc .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }

  /* ── Événement RH : padding left sans sideline ── */
  .pc--evenement-rh .pc__body {
    padding-left: 16px;
  }

  /* ── Événement RH : tag icône-only inline avec l'heure ── */
  .pc__time-with-tag {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .pc__tag--icon-only-rh {
    padding: 4px 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    box-sizing: border-box;
    gap: 0;
  }
`;

// ══════════════════════════════════════════════════
// Données par défaut pour les tags RDV Commercial
// ══════════════════════════════════════════════════
const DEFAULT_RDV_TAGS = [
  { icon: 'child_friendly', bg: '#f1efff', color: '#5b3fc9' },
  { icon: 'cleaning_services', bg: '#f4e6dc', color: '#8b5e3c' },
  { icon: 'yard', bg: '#ddead7', color: '#3a7d22' },
  { icon: 'elderly', bg: '#e7e1df', color: '#6b5b54' },
];

// ══════════════════════════════════════════════════
// Fonction de rendu — type "intervention"
// ══════════════════════════════════════════════════
function cardIntervention({ size = 1, direction = "vertical", name = "PELET Edouard", time = "10:00 - 10:30", tag = "Garde d'enfants", tagIcon = "child_friendly", serie = true, modifier = "" } = {}) {
  const cls = ["pc", `pc--${size}`, `pc--${direction}`, modifier].filter(Boolean).join(" ");
  const tagIconHtml = tagIcon ? mi(tagIcon, 16, 'pc__tag-icon') : '';

  if (size === 4) {
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__side-line"></div>
        <div class="pc__body">
          ${serie ? ICON_REPEAT : ""}
          <span class="pc__name">${name}</span>
        </div>
      </div>
    `;
  }

  if (size === 3) {
    if (direction === "horizontal") {
      return `
        <div class="${cls}" tabindex="0">
          <div class="pc__side-line"></div>
          <div class="pc__body">
            <div class="pc__header">
              <span class="pc__name">${name}</span>
            </div>
            <span class="pc__time">${time.split(" - ")[0]}</span>
            <span class="pc__time">${time.split(" - ")[1]}</span>
            <div class="pc__icons">${ICON_PEOPLE}${ICON_KEY}${ICON_NOTE}</div>
            ${serie ? ICON_REPEAT : ""}
          </div>
        </div>
      `;
    }
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__side-line"></div>
        <div class="pc__body">
          ${serie ? ICON_REPEAT : ""}
          <span class="pc__name">${name}</span>
          <span class="pc__time">${time.split(" - ")[0]}</span>
        </div>
      </div>
    `;
  }

  if (size === 2) {
    if (direction === "horizontal") {
      return `
        <div class="${cls}" tabindex="0">
          <div class="pc__side-line"></div>
          <div class="pc__body">
            <div class="pc__header">
              <span class="pc__name">${name}</span>
            </div>
            <span class="pc__time">${time}</span>
            <div class="pc__icons">${ICON_PEOPLE}${ICON_KEY}${ICON_NOTE}</div>
            <div class="pc__tags"><span class="pc__tag">${tagIconHtml}${tag}</span></div>
          </div>
        </div>
      `;
    }
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__side-line"></div>
        <div class="pc__body">
          <div class="pc__row">
            <span class="pc__name">${name}</span>
            <span class="pc__time">${time}</span>
          </div>
          <div class="pc__row">
            <div class="pc__tags"><span class="pc__tag">${tagIconHtml}${tag}</span></div>
            <div class="pc__icons">${ICON_PEOPLE}${ICON_KEY}${ICON_NOTE}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Grand (1)
  return `
    <div class="${cls}" tabindex="0">
      <div class="pc__side-line"></div>
      <div class="pc__body">
        <div class="pc__header">
          <span class="pc__name">${name}</span>
          ${serie ? ICON_REPEAT : ""}
        </div>
        <span class="pc__time">${time}</span>
        <div class="pc__icons">${ICON_PEOPLE}${ICON_KEY}${ICON_NOTE}</div>
        <div class="pc__tags"><span class="pc__tag">${tagIconHtml}${tag}</span></div>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════════
// Fonction de rendu — type "rdv-commercial"
// ══════════════════════════════════════════════════
function renderRdvTags(tags) {
  return tags.map(t => `<span class="pc__tag--icon-only" style="background:${t.bg};color:${t.color};">${mi(t.icon, 16)}</span>`).join('');
}

function cardRdvCommercial({ size = 1, direction = "vertical", name = "PELET Edouard", time = "10:00 - 10:30", tags = DEFAULT_RDV_TAGS, modifier = "" } = {}) {
  const cls = ["pc", `pc--${size}`, `pc--${direction}`, "pc--rdv-commercial", modifier].filter(Boolean).join(" ");
  const tagsRow = `<div class="pc__tags-row"><span class="pc__tags-count">${tags.length}</span><div class="pc__tags-list">${renderRdvTags(tags)}</div></div>`;

  if (size === 4) {
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__body">
          <span class="pc__name">${name}</span>
        </div>
      </div>
    `;
  }

  if (size === 3) {
    if (direction === "horizontal") {
      return `
        <div class="${cls}" tabindex="0">
          <div class="pc__body">
            <div class="pc__header">
              <span class="pc__name">${name}</span>
            </div>
            <span class="pc__time">${time.split(" - ")[0]}</span>
            <span class="pc__time">${time.split(" - ")[1]}</span>
            <div class="pc__icons">${ICON_PEOPLE}${ICON_KEY}${ICON_NOTE}</div>
          </div>
        </div>
      `;
    }
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__body">
          <span class="pc__name">${name}</span>
          <span class="pc__time">${time.split(" - ")[0]}</span>
        </div>
      </div>
    `;
  }

  if (size === 2) {
    if (direction === "horizontal") {
      return `
        <div class="${cls}" tabindex="0">
          <div class="pc__body">
            <div class="pc__header">
              <span class="pc__name">${name}</span>
            </div>
            <span class="pc__time">${time}</span>
            ${tagsRow}
          </div>
        </div>
      `;
    }
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__body">
          <div class="pc__row">
            <span class="pc__name">${name}</span>
            <span class="pc__time">${time}</span>
          </div>
          <div class="pc__row">
            ${tagsRow}
          </div>
        </div>
      </div>
    `;
  }

  // Grand (1)
  return `
    <div class="${cls}" tabindex="0">
      <div class="pc__body">
        <div class="pc__header">
          <span class="pc__name">${name}</span>
        </div>
        <span class="pc__time">${time}</span>
        <div class="pc__icons">${ICON_PEOPLE}${ICON_KEY}${ICON_NOTE}</div>
        ${tagsRow}
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════════
// Fonction de rendu — type "evenement-rh"
// ══════════════════════════════════════════════════
function cardEvenementRh({ size = 1, direction = "vertical", time = "10:00 - 10:30", tag = "Visite médicale", tagIcon = "medication", modifier = "" } = {}) {
  const cls = ["pc", `pc--${size}`, `pc--${direction}`, "pc--evenement-rh", modifier].filter(Boolean).join(" ");
  const tagIconHtml = tagIcon ? mi(tagIcon, 16, 'pc__tag-icon') : '';
  const tagFull = `<span class="pc__tag pc__tag--rh">${tagIconHtml}${tag}</span>`;
  const tagIconOnly = `<span class="pc__tag pc__tag--rh pc__tag--icon-only-rh">${tagIconHtml}</span>`;

  if (size === 4) {
    // Nom : tag icône-only + horaire
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__body">
          <div class="pc__time-with-tag">
            ${tagIconOnly}
            <span class="pc__time">${time.split(" - ")[0]}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (size === 3) {
    if (direction === "horizontal") {
      return `
        <div class="${cls}" tabindex="0">
          <div class="pc__body">
            <div class="pc__time-with-tag">
              ${tagIconOnly}
              <span class="pc__time">${time.split(" - ")[0]}</span>
            </div>
            <span class="pc__time">${time.split(" - ")[1]}</span>
          </div>
        </div>
      `;
    }
    // Vertical small
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__body">
          <div class="pc__time-with-tag">
            ${tagIconOnly}
            <span class="pc__time">${time.split(" - ")[0]}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (size === 2) {
    if (direction === "horizontal") {
      return `
        <div class="${cls}" tabindex="0">
          <div class="pc__body">
            <span class="pc__time">${time}</span>
            <div class="pc__tags">${tagFull}</div>
          </div>
        </div>
      `;
    }
    // Vertical medium : tag icône-only à gauche de l'heure
    return `
      <div class="${cls}" tabindex="0">
        <div class="pc__body">
          <div class="pc__row">
            <div class="pc__time-with-tag">
              ${tagIconOnly}
              <span class="pc__time">${time}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Grand (1) : tag complet en dessous
  return `
    <div class="${cls}" tabindex="0">
      <div class="pc__body">
        <span class="pc__time">${time}</span>
        <div class="pc__tags">${tagFull}</div>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════════════
// Variants pour la vitrine
// ══════════════════════════════════════════════════
function sizeRow(direction, cardFn, opts = {}) {
  return `
    <div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
      ${cardFn({ size: 1, direction, ...opts })}
      ${cardFn({ size: 2, direction, ...opts })}
      ${cardFn({ size: 3, direction, ...opts })}
      ${cardFn({ size: 4, direction, ...opts })}
    </div>
  `;
}

function dualDirectionRow(cardFn, opts = {}) {
  return `
    <p style="margin:0 0 8px;font-size:13px;color:#48546d;">Verticale</p>
    ${sizeRow("vertical", cardFn, opts)}
    <div style="height:16px;"></div>
    <p style="margin:0 0 8px;font-size:13px;color:#48546d;">Horizontale</p>
    ${sizeRow("horizontal", cardFn, opts)}
  `;
}

export const variants = [
  // ── Intervention ──
  {
    label: "Intervention — Verticale",
    description: "4 tailles. Sideline bleue, nom, horaire, icônes, tag, série.",
    render: () => sizeRow("vertical", cardIntervention),
  },
  {
    label: "Intervention — Horizontale",
    description: "4 tailles. Sideline bleue, nom, horaire, icônes, tag, série.",
    render: () => sizeRow("horizontal", cardIntervention),
  },
  {
    label: "Intervention — Non pourvue",
    description: "Texte « À pourvoir » à la place du nom. Visuellement identique à la carte classique.",
    render: () => dualDirectionRow(cardIntervention, { name: "À pourvoir", modifier: "pc--non-pourvue" }),
  },

  // ── RDV Commercial ──
  {
    label: "RDV Commercial — Verticale",
    description: "4 tailles. Bordure pointillée noire, nom, horaire, icônes, tags icône-only multiples avec compteur.",
    render: () => sizeRow("vertical", cardRdvCommercial),
  },
  {
    label: "RDV Commercial — Horizontale",
    description: "4 tailles. Bordure pointillée noire, nom, horaire, icônes, tags icône-only multiples avec compteur.",
    render: () => sizeRow("horizontal", cardRdvCommercial),
  },

  // ── Événement RH ──
  {
    label: "Événement RH — Verticale",
    description: "4 tailles. Bordure verte, pas de sideline, horaire, tag vert avec icône + texte.",
    render: () => sizeRow("vertical", cardEvenementRh),
  },
  {
    label: "Événement RH — Horizontale",
    description: "4 tailles. Bordure verte, pas de sideline, horaire, tag vert avec icône + texte.",
    render: () => sizeRow("horizontal", cardEvenementRh),
  },
];
