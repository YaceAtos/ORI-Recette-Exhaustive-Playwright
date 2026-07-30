// ══════════════════════════════════════════════════
// Sidebar
// ══════════════════════════════════════════════════

export const name = "Sidebar";
export const description = "Navigation latérale complète d'Orion. Mode expanded (232 px) / collapsed (82 px icon-only). Sections avec sous-pages dépliables, sélection d'item, bouton toggle, item Paramètres sticky en bas.";

// ── Icônes ──
const ICONS = {
  planning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.33 2H12.67C13.4 2 14 2.6 14 3.33V13.33C14 14.07 13.4 14.67 12.67 14.67H3.33C2.6 14.67 2 14.07 2 13.33V3.33C2 2.6 2.6 2 3.33 2H4.67V0.67H6V2H10V0.67H11.33V2ZM3.33 5.33V13.33H12.67V5.33H3.33ZM4.67 7.33H6V8.67H4.67V7.33ZM7.33 7.33H8.67V8.67H7.33V7.33ZM10 7.33H11.33V8.67H10V7.33Z" fill="currentColor"/></svg>`,
  clients: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8C9.47 8 10.67 6.8 10.67 5.33C10.67 3.87 9.47 2.67 8 2.67C6.53 2.67 5.33 3.87 5.33 5.33C5.33 6.8 6.53 8 8 8ZM8 9.33C6.22 9.33 2.67 10.23 2.67 12V13.33H13.33V12C13.33 10.23 9.78 9.33 8 9.33Z" fill="currentColor"/></svg>`,
  collaborateurs: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.67 7.33C11.77 7.33 12.66 6.44 12.66 5.33C12.66 4.23 11.77 3.33 10.67 3.33C9.57 3.33 8.67 4.23 8.67 5.33C8.67 6.44 9.57 7.33 10.67 7.33ZM5.33 7.33C6.44 7.33 7.33 6.44 7.33 5.33C7.33 4.23 6.44 3.33 5.33 3.33C4.23 3.33 3.33 4.23 3.33 5.33C3.33 6.44 4.23 7.33 5.33 7.33ZM5.33 8.67C3.78 8.67 0.67 9.44 0.67 11V12.67H10V11C10 9.44 6.89 8.67 5.33 8.67ZM10.67 8.67C10.47 8.67 10.24 8.68 10 8.71C10.78 9.26 11.33 10 11.33 11V12.67H15.33V11C15.33 9.44 12.22 8.67 10.67 8.67Z" fill="currentColor"/></svg>`,
  partenariats: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33L1.33 4.67L8 8L14.67 4.67L8 1.33ZM1.33 6.67L8 10L14.67 6.67M1.33 8.67L8 12L14.67 8.67" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
  produits: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33L2 4.33V11.67L8 14.67L14 11.67V4.33L8 1.33ZM12.67 5L8 7.33L3.33 5L8 2.67L12.67 5ZM3.33 6.13L7.33 8.13V13.07L3.33 11.07V6.13ZM8.67 13.07V8.13L12.67 6.13V11.07L8.67 13.07Z" fill="currentColor"/></svg>`,
  gestionRH: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 2H4C3.27 2 2.67 2.6 2.67 3.33V12.67C2.67 13.4 3.27 14 4 14H12C12.73 14 13.33 13.4 13.33 12.67V3.33C13.33 2.6 12.73 2 12 2ZM12 12.67H4V3.33H12V12.67ZM5.33 7.33H10.67V8.67H5.33V7.33ZM5.33 9.33H8.67V10.67H5.33V9.33ZM5.33 5.33H10.67V6.67H5.33V5.33Z" fill="currentColor"/></svg>`,
  suiviQualite: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM6.67 11.33L3.33 8L4.27 7.06L6.67 9.45L11.73 4.39L12.67 5.33L6.67 11.33Z" fill="currentColor"/></svg>`,
  organisation: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="5" r="1.5" fill="currentColor"/><circle cx="5" cy="11" r="1.5" fill="currentColor"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/></svg>`,
  configuration: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.27 2L5.87 3.73C5.5 3.89 5.16 4.1 4.85 4.35L3.17 3.75L1.44 6.75L2.85 7.85C2.82 8.05 2.8 8.25 2.8 8.45C2.8 8.65 2.82 8.85 2.85 9.05L1.44 10.15L3.17 13.15L4.85 12.55C5.16 12.8 5.5 13.01 5.87 13.17L6.27 14.9H9.73L10.13 13.17C10.5 13.01 10.84 12.8 11.15 12.55L12.83 13.15L14.56 10.15L13.15 9.05C13.18 8.85 13.2 8.65 13.2 8.45C13.2 8.25 13.18 8.05 13.15 7.85L14.56 6.75L12.83 3.75L11.15 4.35C10.84 4.1 10.5 3.89 10.13 3.73L9.73 2H6.27ZM8 6.45C9.1 6.45 10 7.35 10 8.45C10 9.55 9.1 10.45 8 10.45C6.9 10.45 6 9.55 6 8.45C6 7.35 6.9 6.45 8 6.45Z" fill="currentColor"/></svg>`,
  parametres: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.07 8.62C13.09 8.42 13.11 8.21 13.11 8C13.11 7.79 13.09 7.58 13.07 7.38L14.55 6.22C14.68 6.12 14.72 5.94 14.63 5.79L13.23 3.37C13.14 3.22 12.96 3.16 12.81 3.22L11.07 3.94C10.73 3.68 10.36 3.47 9.96 3.31L9.69 1.45C9.66 1.28 9.52 1.16 9.35 1.16H6.55C6.38 1.16 6.24 1.28 6.21 1.45L5.94 3.31C5.54 3.47 5.17 3.69 4.83 3.94L3.09 3.22C2.93 3.16 2.76 3.22 2.67 3.37L1.27 5.79C1.17 5.94 1.21 6.12 1.35 6.22L2.83 7.38C2.81 7.58 2.79 7.8 2.79 8C2.79 8.2 2.81 8.42 2.83 8.62L1.35 9.78C1.22 9.88 1.17 10.06 1.27 10.21L2.67 12.63C2.76 12.78 2.94 12.84 3.09 12.78L4.83 12.06C5.17 12.32 5.54 12.53 5.94 12.69L6.21 14.55C6.24 14.72 6.38 14.84 6.55 14.84H9.35C9.52 14.84 9.66 14.72 9.69 14.55L9.96 12.69C10.36 12.53 10.73 12.31 11.07 12.06L12.81 12.78C12.97 12.84 13.14 12.78 13.23 12.63L14.63 10.21C14.72 10.06 14.68 9.88 14.55 9.78L13.07 8.62ZM7.95 10.4C6.63 10.4 5.55 9.32 5.55 8C5.55 6.68 6.63 5.6 7.95 5.6C9.27 5.6 10.35 6.68 10.35 8C10.35 9.32 9.27 10.4 7.95 10.4Z" fill="currentColor"/></svg>`,
  chevronLeft: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.47 4.94L7.42 8L10.47 11.06L9.53 12L5.53 8L9.53 4L10.47 4.94Z" fill="currentColor"/></svg>`,
  chevronRight: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.53 4.94L8.58 8L5.53 11.06L6.47 12L10.47 8L6.47 4L5.53 4.94Z" fill="currentColor"/></svg>`,
  chevronDown: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.94 5.53L8 8.58L11.06 5.53L12 6.47L8 10.47L4 6.47L4.94 5.53Z" fill="currentColor"/></svg>`,
  chevronUp: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.94 10.47L8 7.42L11.06 10.47L12 9.53L8 5.53L4 9.53L4.94 10.47Z" fill="currentColor"/></svg>`,
};

// ── Logo Orion ──
const LOGO_ORION = `<svg width="80" height="32" viewBox="0 0 80 32" fill="none" class="sb__logo-svg">
  <circle cx="10" cy="16" r="9" stroke="#1d2024" stroke-width="1.4" fill="none"/>
  <circle cx="10" cy="10" r="2" fill="#ccdcff"/>
  <text x="22" y="22" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#1d2024">RION</text>
</svg>`;

// ── Données de navigation ──
const NAV_DATA = [
  {
    id: "planning",
    label: "Planning",
    icon: "planning",
    section: null,
    children: [],
  },
  // ── Membres ──
  {
    id: "clients",
    label: "Clients",
    icon: "clients",
    section: "Membres",
    children: [
      { id: "clients-prospects", label: "Clients & prospects" },
      { id: "devis-contrats", label: "Devis & contrats" },
      { id: "reglements-factures", label: "Règlements & factures" },
    ],
  },
  {
    id: "collaborateurs",
    label: "Collaborateurs",
    icon: "collaborateurs",
    section: "Membres",
    children: [
      { id: "intervenant", label: "Intervenant" },
      { id: "temps-travail", label: "Temp de travail" },
      { id: "preparation-paie", label: "Préparation paie" },
      { id: "competences", label: "Compétences" },
    ],
  },
  {
    id: "partenariats",
    label: "Partenariats",
    icon: "partenariats",
    section: "Membres",
    children: [
      { id: "partenaires-apporteurs", label: "Partenaires/apporteurs" },
      { id: "retrocomissions", label: "Rétrocomissions" },
      { id: "suivi-credits", label: "Suivi crédits" },
      { id: "zone-couverture", label: "Zone de couverture" },
    ],
  },
  // ── Gestion ──
  {
    id: "produits",
    label: "Produits",
    icon: "produits",
    section: "Gestion",
    children: [
      { id: "pim", label: "PIM" },
      { id: "tarifs", label: "Tarifs" },
      { id: "cgv", label: "CGV" },
      { id: "support-commerciaux", label: "Support commerciaux" },
    ],
  },
  {
    id: "gestion-rh",
    label: "Gestion RH",
    icon: "gestionRH",
    section: "Gestion",
    children: [
      { id: "recrutement", label: "Recrutement" },
      { id: "contrat-travail", label: "Contrat de travail" },
      { id: "med-travail-urssaf", label: "Med. travail / URSSAF" },
      { id: "droit-salarie", label: "Droit du salarié" },
    ],
  },
  {
    id: "suivi-qualite",
    label: "Suivi qualité",
    icon: "suiviQualite",
    section: "Gestion",
    children: [],
  },
  // ── Autres ──
  {
    id: "organisation",
    label: "Organisation",
    icon: "organisation",
    section: "Autres",
    children: [
      { id: "marques-societes", label: "Marques & sociétés" },
      { id: "agence", label: "Agence" },
      { id: "regroupement", label: "Regroupement" },
    ],
  },
  {
    id: "configuration",
    label: "Configuration",
    icon: "configuration",
    section: "Autres",
    children: [
      { id: "droit-habilitations", label: "Droit & habilitations" },
    ],
  },
];

// ── Render helpers ──
function renderSidebar(instanceId) {
  const id = instanceId;

  // Sections groupées
  let currentSection = null;
  let navHtml = "";

  for (const item of NAV_DATA) {
    // Section header
    if (item.section && item.section !== currentSection) {
      currentSection = item.section;
      navHtml += `<div class="sb__section-label" data-section="${currentSection}">${currentSection}</div>`;
    } else if (!item.section && currentSection !== null) {
      currentSection = null;
    }

    const hasChildren = item.children && item.children.length > 0;
    const isPlanning = item.id === "planning";

    // Level 1 item
    navHtml += `<div class="sb__nav-item${isPlanning ? " sb__nav-item--selected" : ""}" data-nav-id="${item.id}" data-has-children="${hasChildren}">
      <div class="sb__nav-item-row">
        <span class="sb__nav-icon">${ICONS[item.icon]}</span>
        <span class="sb__nav-label">${item.label}</span>
        ${hasChildren ? `<span class="sb__nav-chevron">${ICONS.chevronDown}</span>` : ""}
      </div>
      ${hasChildren ? `<div class="sb__nav-children" data-parent="${item.id}">
        ${item.children.map(
          (child) => `<div class="sb__nav-child" data-child-id="${child.id}" data-parent-id="${item.id}">
            <span class="sb__nav-child-label">${child.label}</span>
          </div>`
        ).join("")}
      </div>` : ""}
    </div>`;
  }

  return `<aside class="sb" id="${id}" data-expanded="true">
    <div class="sb__header">
      <div class="sb__logo">${LOGO_ORION}</div>
      <button class="sb__toggle" title="Réduire la sidebar">
        ${ICONS.chevronLeft}
      </button>
    </div>
    <nav class="sb__nav">
      ${navHtml}
    </nav>
    <div class="sb__footer">
      <div class="sb__nav-item sb__nav-item--footer" data-nav-id="parametres" data-has-children="false">
        <div class="sb__nav-item-row">
          <span class="sb__nav-icon">${ICONS.parametres}</span>
          <span class="sb__nav-label">Paramètres</span>
        </div>
      </div>
    </div>
  </aside>`;
}

// ── CSS ──
export const styles = `
  /* ═══════════ CONTAINER ═══════════ */
  .sb {
    display: flex;
    flex-direction: column;
    width: 232px;
    height: 832px;
    background: #ffffff;
    border-right: 1px solid #e7e8e9;
    border-radius: 0;
    font-family: 'Inter', sans-serif;
    transition: width 0.25s cubic-bezier(.4,0,.2,1);
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  .sb[data-expanded="false"] {
    width: 82px;
    overflow: visible;
  }

  /* ═══════════ COLLAPSED ═══════════ */
  .sb[data-expanded="false"] {
    width: 82px;
  }

  /* ── Header ── */
  .sb__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 8px 16px;
    flex-shrink: 0;
  }

  .sb__logo {
    display: flex;
    align-items: center;
    overflow: hidden;
    transition: opacity 0.2s;
  }

  .sb__logo-svg {
    flex-shrink: 0;
  }

  .sb[data-expanded="false"] .sb__logo {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .sb__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    background: #eaf0ff;
    color: #3366cc;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .sb__toggle:hover {
    background: #ccdcff;
  }

  .sb[data-expanded="false"] .sb__header {
    justify-content: center;
    padding: 16px 8px 8px 8px;
  }

  /* ── Nav ── */
  .sb__nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .sb__nav::-webkit-scrollbar {
    width: 4px;
  }

  .sb__nav::-webkit-scrollbar-thumb {
    background: #d0d5dd;
    border-radius: 2px;
  }

  /* ── Section labels ── */
  .sb__section-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: #7a859b;
    padding: 12px 12px 4px 12px;
    letter-spacing: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sb[data-expanded="false"] .sb__section-label {
    font-size: 0;
    padding: 6px 0;
    border-top: 1px solid #e7e8e9;
    margin: 4px 12px 0 12px;
  }

  /* ═══════════ NAV ITEM (Level 1) ═══════════ */
  .sb__nav-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-radius: 6px;
    position: relative;
    transition: background-color 0.15s;
  }

  .sb__nav-item-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    min-height: 40px;
    box-sizing: border-box;
    transition: background-color 0.15s;
  }

  .sb__nav-item-row:hover {
    background: rgba(29, 32, 36, 0.06);
  }

  .sb__nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #1d2024;
  }

  .sb__nav-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    transition: opacity 0.2s, width 0.2s;
  }

  .sb__nav-chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #48546d;
    transition: transform 0.2s;
  }

  /* Chevron rotation quand ouvert */
  .sb__nav-item--open > .sb__nav-item-row > .sb__nav-chevron {
    transform: rotate(180deg);
  }

  /* ── Selected state (Level 1) ── */
  .sb__nav-item--selected > .sb__nav-item-row {
    background: #ccdcff;
  }

  .sb__nav-item--selected > .sb__nav-item-row .sb__nav-label {
    font-weight: 700;
  }

  .sb__nav-item--selected > .sb__nav-item-row:hover {
    background: #ccdcff;
  }

  /* ── Open with children selected (parent bg) ── */
  .sb__nav-item--child-selected > .sb__nav-item-row {
    background: #ccdcff;
  }

  .sb__nav-item--child-selected > .sb__nav-item-row .sb__nav-label {
    font-weight: 700;
  }

  /* ═══════════ NAV CHILDREN (Level 2) ═══════════ */
  .sb__nav-children {
    display: none;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
  }

  .sb__nav-item--open > .sb__nav-children {
    display: flex;
  }

  .sb__nav-child {
    display: flex;
    align-items: center;
    padding: 8px 12px 8px 36px;
    border-radius: 6px;
    cursor: pointer;
    min-height: 36px;
    box-sizing: border-box;
    transition: background-color 0.15s;
  }

  .sb__nav-child:hover {
    background: rgba(29, 32, 36, 0.06);
  }

  .sb__nav-child-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Child selected (Level 2) ── */
  .sb__nav-child--selected {
    background: #eaf0ff;
  }

  .sb__nav-child--selected:hover {
    background: #eaf0ff !important;
  }

  .sb__nav-child--selected .sb__nav-child-label {
    font-weight: 500;
  }

  /* ═══════════ FOOTER (Paramètres) ═══════════ */
  .sb__footer {
    border-top: 1px solid #e7e8e9;
    padding: 8px;
    flex-shrink: 0;
  }

  .sb__nav-item--footer .sb__nav-item-row:hover {
    background: rgba(29, 32, 36, 0.06);
  }

  /* ═══════════ COLLAPSED MODE ═══════════ */
  .sb[data-expanded="false"] .sb__nav-label,
  .sb[data-expanded="false"] .sb__nav-chevron,
  .sb[data-expanded="false"] .sb__nav-child-label {
    display: none;
  }

  .sb[data-expanded="false"] .sb__nav-item-row {
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 12px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .sb[data-expanded="false"] .sb__nav {
    overflow: visible;
  }

  .sb[data-expanded="false"] .sb__nav-children {
    display: none !important;
  }

  .sb[data-expanded="false"] .sb__nav-item--selected > .sb__nav-item-row,
  .sb[data-expanded="false"] .sb__nav-item--child-selected > .sb__nav-item-row {
    background: #ccdcff;
    border-radius: 8px;
  }

  /* Tooltip au survol en mode collapsed */
  .sb[data-expanded="false"] .sb__nav-item-row {
    position: relative;
  }

  .sb[data-expanded="false"] .sb__nav-item-row::after {
    content: attr(data-tooltip);
    position: absolute;
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
    background: #1d2024;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 1000;
  }

  .sb[data-expanded="false"] .sb__nav-item-row:hover::after {
    opacity: 1;
  }
`;

// ── Script ──
const CHEVRON_LEFT_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.47 4.94L7.42 8L10.47 11.06L9.53 12L5.53 8L9.53 4L10.47 4.94Z" fill="currentColor"/></svg>`;
const CHEVRON_RIGHT_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.53 4.94L8.58 8L5.53 11.06L6.47 12L10.47 8L6.47 4L5.53 4.94Z" fill="currentColor"/></svg>`;

export const script = `
  document.querySelectorAll(".sb").forEach((sidebar) => {
    const chevronLeft = '${CHEVRON_LEFT_SVG.replace(/'/g, "\\'")}';
    const chevronRight = '${CHEVRON_RIGHT_SVG.replace(/'/g, "\\'")}';

    // ── Toggle expand/collapse ──
    const toggleBtn = sidebar.querySelector(".sb__toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isExpanded = sidebar.getAttribute("data-expanded") === "true";
        sidebar.setAttribute("data-expanded", isExpanded ? "false" : "true");
        toggleBtn.innerHTML = isExpanded ? chevronRight : chevronLeft;
      });
    }

    // ── Tooltips pour mode collapsed ──
    sidebar.querySelectorAll(".sb__nav-item-row").forEach((row) => {
      const label = row.querySelector(".sb__nav-label");
      if (label) row.setAttribute("data-tooltip", label.textContent);
    });

    // ── Sélection & sous-menus ──
    function clearSelection() {
      sidebar.querySelectorAll(".sb__nav-item--selected").forEach((el) => el.classList.remove("sb__nav-item--selected"));
      sidebar.querySelectorAll(".sb__nav-item--child-selected").forEach((el) => el.classList.remove("sb__nav-item--child-selected"));
      sidebar.querySelectorAll(".sb__nav-child--selected").forEach((el) => el.classList.remove("sb__nav-child--selected"));
    }

    // Level 1
    sidebar.querySelectorAll(".sb__nav-item").forEach((navItem) => {
      const row = navItem.querySelector(".sb__nav-item-row");
      const hasChildren = navItem.getAttribute("data-has-children") === "true";

      row.addEventListener("click", () => {
        if (hasChildren) {
          const wasOpen = navItem.classList.contains("sb__nav-item--open");
          if (!wasOpen) {
            sidebar.querySelectorAll(".sb__nav-item--open").forEach((el) => {
              if (el !== navItem) el.classList.remove("sb__nav-item--open");
            });
          }
          navItem.classList.toggle("sb__nav-item--open");
          clearSelection();
          navItem.classList.add("sb__nav-item--child-selected");
          if (!wasOpen) {
            const firstChild = navItem.querySelector(".sb__nav-child");
            if (firstChild) firstChild.classList.add("sb__nav-child--selected");
          }
        } else {
          clearSelection();
          sidebar.querySelectorAll(".sb__nav-item--open").forEach((el) => el.classList.remove("sb__nav-item--open"));
          navItem.classList.add("sb__nav-item--selected");
        }
      });
    });

    // Level 2
    sidebar.querySelectorAll(".sb__nav-child").forEach((child) => {
      child.addEventListener("click", (e) => {
        e.stopPropagation();
        const parentId = child.getAttribute("data-parent-id");
        const parentItem = sidebar.querySelector('.sb__nav-item[data-nav-id="' + parentId + '"]');
        clearSelection();
        if (parentItem) parentItem.classList.add("sb__nav-item--child-selected");
        child.classList.add("sb__nav-child--selected");
      });
    });
  });
`;

// ── Variants ──
export const variants = [
  {
    title: "Sidebar ouverte — Planning sélectionné",
    render: () => `
      <div style="display:flex; gap:24px; align-items:flex-start;">
        ${renderSidebar("sb-demo-1")}
      </div>
    `,
  },
  {
    title: "Sidebar ouverte & fermée côte à côte",
    render: () => {
      // Version collapsed manuelle — on va laisser le script gérer via le bouton toggle
      return `
        <div style="display:flex; gap:24px; align-items:flex-start;">
          ${renderSidebar("sb-demo-2")}
          ${renderSidebar("sb-demo-3")}
        </div>
      `;
    },
  },
];
