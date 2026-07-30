// ══════════════════════════════════════════════════
// Page Liste — Page tableau / liste d'éléments
// ══════════════════════════════════════════════════
// Structure fixe :
//   - Sidebar Orion (.sb collapsed)
//   - Header global
//   - Breadcrumb + Titre + CTA (tonal + filled)
//   - Barre de filtres (search + segmented + selects)
//   - Tableau de données avec pagination
//
// Variante : Collaborateurs

export const name = "Page Liste";
export const description = "Page tableau/liste. Titre, CTA principal, filtres, tableau avec pagination. Point de départ des parcours utilisateurs.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

// ── SVG icons sidebar ──
const SB_ICONS = {
  planning:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.33 2H12.67C13.4 2 14 2.6 14 3.33V13.33C14 14.07 13.4 14.67 12.67 14.67H3.33C2.6 14.67 2 14.07 2 13.33V3.33C2 2.6 2.6 2 3.33 2H4.67V0.67H6V2H10V0.67H11.33V2ZM3.33 5.33V13.33H12.67V5.33H3.33ZM4.67 7.33H6V8.67H4.67V7.33ZM7.33 7.33H8.67V8.67H7.33V7.33ZM10 7.33H11.33V8.67H10V7.33Z" fill="currentColor"/></svg>`,
  clients:       `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 8C9.47 8 10.67 6.8 10.67 5.33C10.67 3.87 9.47 2.67 8 2.67C6.53 2.67 5.33 3.87 5.33 5.33C5.33 6.8 6.53 8 8 8ZM8 9.33C6.22 9.33 2.67 10.23 2.67 12V13.33H13.33V12C13.33 10.23 9.78 9.33 8 9.33Z" fill="currentColor"/></svg>`,
  collaborateurs:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.67 7.33C11.77 7.33 12.66 6.44 12.66 5.33C12.66 4.23 11.77 3.33 10.67 3.33C9.57 3.33 8.67 4.23 8.67 5.33C8.67 6.44 9.57 7.33 10.67 7.33ZM5.33 7.33C6.44 7.33 7.33 6.44 7.33 5.33C7.33 4.23 6.44 3.33 5.33 3.33C4.23 3.33 3.33 4.23 3.33 5.33C3.33 6.44 4.23 7.33 5.33 7.33ZM5.33 8.67C3.78 8.67 0.67 9.44 0.67 11V12.67H10V11C10 9.44 6.89 8.67 5.33 8.67ZM10.67 8.67C10.47 8.67 10.24 8.68 10 8.71C10.78 9.26 11.33 10 11.33 11V12.67H15.33V11C15.33 9.44 12.22 8.67 10.67 8.67Z" fill="currentColor"/></svg>`,
  partenariats:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33L1.33 4.67L8 8L14.67 4.67L8 1.33ZM1.33 6.67L8 10L14.67 6.67M1.33 8.67L8 12L14.67 8.67" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`,
  produits:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33L2 4.33V11.67L8 14.67L14 11.67V4.33L8 1.33ZM12.67 5L8 7.33L3.33 5L8 2.67L12.67 5ZM3.33 6.13L7.33 8.13V13.07L3.33 11.07V6.13ZM8.67 13.07V8.13L12.67 6.13V11.07L8.67 13.07Z" fill="currentColor"/></svg>`,
  gestionRH:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 2H4C3.27 2 2.67 2.6 2.67 3.33V12.67C2.67 13.4 3.27 14 4 14H12C12.73 14 13.33 13.4 13.33 12.67V3.33C13.33 2.6 12.73 2 12 2ZM12 12.67H4V3.33H12V12.67ZM5.33 7.33H10.67V8.67H5.33V7.33ZM5.33 9.33H8.67V10.67H5.33V9.33ZM5.33 5.33H10.67V6.67H5.33V5.33Z" fill="currentColor"/></svg>`,
  suiviQualite:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM6.67 11.33L3.33 8L4.27 7.06L6.67 9.45L11.73 4.39L12.67 5.33L6.67 11.33Z" fill="currentColor"/></svg>`,
  organisation:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="5" r="1.5" fill="currentColor"/><circle cx="5" cy="11" r="1.5" fill="currentColor"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/></svg>`,
  configuration: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.27 2L5.87 3.73C5.5 3.89 5.16 4.1 4.85 4.35L3.17 3.75L1.44 6.75L2.85 7.85C2.82 8.05 2.8 8.25 2.8 8.45C2.8 8.65 2.82 8.85 2.85 9.05L1.44 10.15L3.17 13.15L4.85 12.55C5.16 12.8 5.5 13.01 5.87 13.17L6.27 14.9H9.73L10.13 13.17C10.5 13.01 10.84 12.8 11.15 12.55L12.83 13.15L14.56 10.15L13.15 9.05C13.18 8.85 13.2 8.65 13.2 8.45C13.2 8.25 13.18 8.05 13.15 7.85L14.56 6.75L12.83 3.75L11.15 4.35C10.84 4.1 10.5 3.89 10.13 3.73L9.73 2H6.27ZM8 6.45C9.1 6.45 10 7.35 10 8.45C10 9.55 9.1 10.45 8 10.45C6.9 10.45 6 9.55 6 8.45C6 7.35 6.9 6.45 8 6.45Z" fill="currentColor"/></svg>`,
  parametres:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.07 8.62C13.09 8.42 13.11 8.21 13.11 8C13.11 7.79 13.09 7.58 13.07 7.38L14.55 6.22C14.68 6.12 14.72 5.94 14.63 5.79L13.23 3.37C13.14 3.22 12.96 3.16 12.81 3.22L11.07 3.94C10.73 3.68 10.36 3.47 9.96 3.31L9.69 1.45C9.66 1.28 9.52 1.16 9.35 1.16H6.55C6.38 1.16 6.24 1.28 6.21 1.45L5.94 3.31C5.54 3.47 5.17 3.69 4.83 3.94L3.09 3.22C2.93 3.16 2.76 3.22 2.67 3.37L1.27 5.79C1.17 5.94 1.21 6.12 1.35 6.22L2.83 7.38C2.81 7.58 2.79 7.8 2.79 8C2.79 8.2 2.81 8.42 2.83 8.62L1.35 9.78C1.22 9.88 1.17 10.06 1.27 10.21L2.67 12.63C2.76 12.78 2.94 12.84 3.09 12.78L4.83 12.06C5.17 12.32 5.54 12.53 5.94 12.69L6.21 14.55C6.24 14.72 6.38 14.84 6.55 14.84H9.35C9.52 14.84 9.66 14.72 9.69 14.55L9.96 12.69C10.36 12.53 10.73 12.31 11.07 12.06L12.81 12.78C12.97 12.84 13.14 12.78 13.23 12.63L14.63 10.21C14.72 10.06 14.68 9.88 14.55 9.78L13.07 8.62ZM7.95 10.4C6.63 10.4 5.55 9.32 5.55 8C5.55 6.68 6.63 5.6 7.95 5.6C9.27 5.6 10.35 6.68 10.35 8C10.35 9.32 9.27 10.4 7.95 10.4Z" fill="currentColor"/></svg>`,
  chevronLeft:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.47 4.94L7.42 8L10.47 11.06L9.53 12L5.53 8L9.53 4L10.47 4.94Z" fill="currentColor"/></svg>`,
};

const SB_LOGO = `<svg width="80" height="32" viewBox="0 0 80 32" fill="none"><circle cx="10" cy="16" r="9" stroke="#1d2024" stroke-width="1.4" fill="none"/><circle cx="10" cy="10" r="2" fill="#ccdcff"/><text x="22" y="22" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#1d2024">RION</text></svg>`;

export const styles = `

  /* ══ Page Liste ══ */
  .pl-page {
    display: flex;
    height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #ffffff;
    overflow: hidden;
  }

  .pl-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* ── Header global ── */
  .pl-header {
    height: 56px;
    background: #ffffff;
    border-bottom: 1px solid #dee2e9;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
  }

  .pl-header__search {
    display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px;
    background: #f5f5f7; border: 1px solid #dee2e9; border-radius: 6px;
    min-width: 200px; flex: 1; max-width: 280px;
  }
  .pl-header__search input {
    border: none; background: transparent; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #1d2024; outline: none; flex: 1;
  }
  .pl-header__search input::placeholder { color: #8e96a3; }
  .pl-header__right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .pl-header__icon-btn {
    width: 36px; height: 36px; border: none; background: transparent; color: #48546d;
    border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .pl-header__icon-btn:hover { background: #f5f5f7; }
  .pl-header__user {
    display: flex; align-items: center; gap: 8px; padding: 4px 8px;
    border-radius: 6px; cursor: pointer; transition: background 0.15s;
  }
  .pl-header__user:hover { background: #f5f5f7; }
  .pl-header__avatar {
    width: 28px; height: 28px; border-radius: 50%; background: #ced5ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #162471; flex-shrink: 0;
  }
  .pl-header__user-name { font-size: 13px; font-weight: 500; color: #1d2024; white-space: nowrap; }
  .pl-header__user-role { font-size: 11px; font-weight: 400; color: #8e96a3; white-space: nowrap; }

  /* ── Scroll zone ── */
  .pl-scroll {
    flex: 1; min-height: 0; overflow-y: auto;
    padding: 0 32px 32px;
  }

  /* ── Section titre + CTA ── */
  .pl-title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 28px 0 20px;
  }

  .pl-breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #8e96a3; margin-bottom: 6px;
  }
  .pl-breadcrumb a { color: #48546d; text-decoration: none; transition: color 0.15s; }
  .pl-breadcrumb a:hover { color: #013aba; }
  .pl-breadcrumb__sep { color: #dee2e9; }

  .pl-title {
    font-size: 32px;
    font-weight: 700;
    color: #1d2024;
    line-height: 44px;
    letter-spacing: -0.5px;
  }

  .pl-cta-group { display: flex; align-items: center; gap: 8px; }

  /* Bouton tonal */
  .pl-btn-tonal {
    display: inline-flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 16px;
    font-size: 14px; font-weight: 500; color: #263f7a;
    background: #eaf0ff; border: none; border-radius: 4px;
    cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
    position: relative; overflow: hidden;
  }
  .pl-btn-tonal::after { content:""; position:absolute; inset:0; border-radius:inherit; background:transparent; transition:background 0.15s; pointer-events:none; }
  .pl-btn-tonal:hover::after { background:rgba(38,63,122,0.08); }

  /* Bouton filled */
  .pl-btn-filled {
    display: inline-flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 16px;
    font-size: 14px; font-weight: 500; color: #ffffff;
    background: #013aba; border: none; border-radius: 4px;
    cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
    position: relative; overflow: hidden;
  }
  .pl-btn-filled::after { content:""; position:absolute; inset:0; border-radius:inherit; background:transparent; transition:background 0.15s; pointer-events:none; }
  .pl-btn-filled:hover::after { background:rgba(255,255,255,0.08); }

  /* ── Barre de filtres ── */
  .pl-filters {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }

  .pl-filters__left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
  .pl-filters__right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  /* Search bar inline */
  .pl-search {
    display: flex; align-items: center; gap: 8px;
    height: 40px; padding: 0 12px;
    background: #ffffff; border: 1px solid #7381a2; border-radius: 6px;
    width: 280px; flex-shrink: 0;
    font-size: 14px; color: #48546d;
    cursor: text; transition: border-color 0.15s;
  }
  .pl-search:hover { border-color: #1d2024; }
  .pl-search input {
    border: none; background: transparent; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #1d2024; outline: none; flex: 1;
  }
  .pl-search input::placeholder { color: #8e96a3; }

  /* Filtre select */
  .pl-filter-select {
    display: flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 12px;
    background: #ffffff; border: 1px solid #7381a2; border-radius: 6px;
    font-size: 14px; color: #48546d; cursor: pointer;
    white-space: nowrap; position: relative;
    font-family: 'Inter', sans-serif;
  }
  .pl-filter-select:hover { border-color: #1d2024; }

  /* ── Tableau ── */
  .pl-table-wrap {
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    overflow: hidden;
  }

  .pl-table-head {
    display: flex;
    background: #eaf0ff;
    border-bottom: 1px solid #dee2e9;
  }

  .pl-th {
    display: flex; align-items: center; gap: 4px;
    padding: 12px 16px;
    font-size: 14px; font-weight: 500; color: #263f7a;
    line-height: 20px; white-space: nowrap; cursor: pointer;
    user-select: none; flex-shrink: 0;
  }
  .pl-th--fill { flex: 1; min-width: 0; }
  .pl-th--actions { flex: 0 0 56px; justify-content: flex-end; }
  .pl-th__sort { color: #6683c0; opacity: 0.7; display: flex; align-items: center; }
  .pl-th:hover .pl-th__sort { opacity: 1; }

  .pl-table-body { display: flex; flex-direction: column; }

  .pl-row {
    display: flex; align-items: center;
    border-bottom: 1px solid #dee2e9;
    cursor: pointer; background: #ffffff;
    transition: background 0.1s; position: relative;
  }
  .pl-row:last-child { border-bottom: none; }
  .pl-row:hover { background: #eaf0ff; }

  /* Actions visibles au hover */
  .pl-row .pl-row-actions { opacity: 0; transition: opacity 0.1s; }
  .pl-row:hover .pl-row-actions { opacity: 1; }

  .pl-td {
    padding: 13px 16px;
    font-size: 14px; font-weight: 400; color: #48546d;
    line-height: 20px; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; flex-shrink: 0;
  }
  .pl-td--fill { flex: 1; min-width: 0; }
  .pl-td--bold { font-weight: 500; color: #1d2024; }
  .pl-td--actions {
    flex: 0 0 56px;
    display: flex; align-items: center; justify-content: flex-end;
    padding-right: 12px;
  }

  /* Bouton action ligne */
  .pl-row-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: none; background: transparent;
    color: #48546d; border-radius: 6px; cursor: pointer;
    position: relative; overflow: hidden; transition: color 0.15s;
  }
  .pl-row-btn::after { content:""; position:absolute; inset:0; border-radius:inherit; background:transparent; transition:background 0.15s; pointer-events:none; }
  .pl-row-btn:hover { color: #013aba; }
  .pl-row-btn:hover::after { background: rgba(1,58,186,0.08); }

  /* ── Pagination ── */
  .pl-pagination {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 16px; padding: 12px 0 0;
    font-size: 12px; color: #48546d;
  }

  .pl-pagination__info { white-space: nowrap; }

  .pl-pagination__nav { display: flex; align-items: center; gap: 4px; }

  .pl-page-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: none; background: transparent;
    color: #48546d; border-radius: 4px; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .pl-page-btn:hover { background: #eaf0ff; color: #013aba; }
  .pl-page-btn:disabled { opacity: 0.35; cursor: default; pointer-events: none; }

  .pl-page-size {
    display: flex; align-items: center; gap: 6px; white-space: nowrap;
  }

  .pl-page-size select {
    height: 32px; padding: 0 8px; border: 1px solid #dee2e9; border-radius: 4px;
    font-size: 12px; font-family: 'Inter', sans-serif; color: #1d2024;
    background: #ffffff; cursor: pointer; outline: none;
  }
`;

// ─── Helpers ─────────────────────────────────────

function renderSidebar() {
  const NAV = [
    { id:'planning',      label:'Planning',       icon:'planning',      section:null },
    { id:'clients',       label:'Clients',        icon:'clients',       section:'Membres' },
    { id:'collaborateurs',label:'Collaborateurs', icon:'collaborateurs',section:'Membres', active:true },
    { id:'partenariats',  label:'Partenariats',   icon:'partenariats',  section:'Membres' },
    { id:'produits',      label:'Produits',       icon:'produits',      section:'Gestion' },
    { id:'gestionRH',     label:'Gestion RH',     icon:'gestionRH',     section:'Gestion' },
    { id:'suiviQualite',  label:'Suivi qualité',  icon:'suiviQualite',  section:'Gestion' },
    { id:'organisation',  label:'Organisation',   icon:'organisation',  section:'Gestion' },
    { id:'configuration', label:'Configuration',  icon:'configuration', section:'Gestion' },
  ];

  let currentSection = null;
  let navHtml = '';
  for (const item of NAV) {
    if (item.section && item.section !== currentSection) {
      currentSection = item.section;
      navHtml += `<div class="sb__section-label">${currentSection}</div>`;
    }
    navHtml += `<div class="sb__nav-item${item.active ? ' sb__nav-item--selected' : ''}">
      <div class="sb__nav-item-row" data-tooltip="${item.label}">
        <span class="sb__nav-icon">${SB_ICONS[item.icon]}</span>
        <span class="sb__nav-label">${item.label}</span>
      </div>
    </div>`;
  }

  return `<aside class="sb" id="pl-sb" data-expanded="false" style="height:100%;flex-shrink:0;">
    <div class="sb__header">
      <div class="sb__logo">${SB_LOGO}</div>
      <button class="sb__toggle" id="pl-sb-toggle">${SB_ICONS.chevronLeft}</button>
    </div>
    <nav class="sb__nav">${navHtml}</nav>
    <div class="sb__footer">
      <div class="sb__nav-item sb__nav-item--footer">
        <div class="sb__nav-item-row" data-tooltip="Paramètres">
          <span class="sb__nav-icon">${SB_ICONS.parametres}</span>
          <span class="sb__nav-label">Paramètres</span>
        </div>
      </div>
    </div>
  </aside>`;
}

function statusTag(label, type) {
  const ICON_SM = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM8.67 11.33H7.33V7.33H8.67V11.33ZM8.67 6H7.33V4.67H8.67V6Z" fill="currentColor"/></svg>`;
  return `<span class="tag tag--${type} tag--sm">${ICON_SM}<span>${label}</span></span>`;
}

// ─── Données de démo ──────────────────────────────

const ROWS = [
  { nom:'AZOUZI',      prenom:'Mélissa',  type:'Intervenant',              ddn:'17/04/1995', statut:{l:'Actif',t:'success'},             tel:'06 11 11 11 11', etat:'Complète',   date:'20/09/2025 15:54' },
  { nom:'VAN PEE',     prenom:'Nahuël',   type:'Intervenant',              ddn:'20/06/1997', statut:{l:'En cours de recrutement',t:'info'}, tel:'06 21 21 21 21', etat:'Complète',   date:'17/08/2025 12:04' },
  { nom:'GUIMPIED',    prenom:'Clémence', type:'Intervenant, Opération…',  ddn:'20/08/1997', statut:{l:'En attente de contrat',t:'warning'}, tel:'06 18 18 18 18', etat:'Complète', date:'16/08/2025 17:44' },
  { nom:'REVEL',       prenom:'Fabrice',  type:'Intervenant',              ddn:'12/01/1987', statut:{l:'Inactif',t:'error'},              tel:'06 14 14 14 14', etat:'Complète',   date:'20/12/2025 15:44' },
  { nom:'WALLABREGUE', prenom:'Katia',    type:'Intervenant',              ddn:'18/04/1988', statut:{l:'Inactif',t:'error'},              tel:'06 32 32 32 32', etat:'Complète',   date:'06/07/2025 12:24' },
  { nom:'BAGUET',      prenom:'Claire',   type:'Intervenant',              ddn:'10/07/1999', statut:{l:'Nouveau',t:'info'},               tel:'06 17 17 17 17', etat:'Incomplète', date:'09/09/2025 16:52' },
  { nom:'DUPONT',      prenom:'Chaïma',   type:'Intervenant',              ddn:'19/08/2001', statut:{l:'Nouveau',t:'info'},               tel:'06 01 01 01 01', etat:'Complète',   date:'02/06/2025 11:08' },
  { nom:'BERLIND',     prenom:'Charlène', type:'Intervenant, Opération…',  ddn:'26/08/2003', statut:{l:'Actif',t:'success'},             tel:'06 08 08 08 08', etat:'Complète',   date:'20/08/2025 09:16' },
  { nom:'SEVERIN',     prenom:'Paul',     type:'Intervenant',              ddn:'06/10/1996', statut:{l:'Actif',t:'success'},             tel:'06 26 08 26 08', etat:'Complète',   date:'15/08/2025 10:18' },
  { nom:'GHAUTIER',    prenom:'Tatiana',  type:'Intervenant',              ddn:'18/11/1996', statut:{l:'En attente de contrat',t:'warning'}, tel:'06 26 72 26 72', etat:'Complète', date:'18/08/2025 18:14' },
  { nom:'PASQUIET',    prenom:'Julie',    type:'Intervenant, Opération…',  ddn:'14/02/1984', statut:{l:'En attente de contrat',t:'warning'}, tel:'07 44 84 76 09', etat:'Complète', date:'19/08/2025 12:20' },
  { nom:'COTTEN',      prenom:'Morgane',  type:'Intervenant',              ddn:'09/12/1982', statut:{l:'Inactif',t:'error'},              tel:'07 43 34 09 16', etat:'Incomplète', date:'28/07/2025 09:45' },
  { nom:'GHEZAIL',     prenom:'George',   type:'Intervenant',              ddn:'14/02/1984', statut:{l:'Actif',t:'success'},             tel:'06 17 17 17 17', etat:'Complète',   date:'20/09/2025 08:38' },
  { nom:'GHEZAIL',     prenom:'George',   type:'Intervenant',              ddn:'06/10/1996', statut:{l:'En cours de recrutement',t:'info'}, tel:'06 14 14 14 14', etat:'Complète', date:'20/09/2025 08:38' },
];

// ─── Render ───────────────────────────────────────

function renderPageListe() {
  const header = `<header class="pl-header">
    <div class="pl-header__search">${mi('search',16)}<input type="text" placeholder="Rechercher" readonly></div>
    <div class="pl-header__right">
      <button class="pl-header__icon-btn">${mi('notifications',20)}</button>
      <button class="pl-header__icon-btn">${mi('chat',20)}</button>
      <div class="pl-header__user">
        <div class="pl-header__avatar">CW</div>
        <div>
          <div class="pl-header__user-name">Charles WALLABREGUE</div>
          <div class="pl-header__user-role">Intitulé du poste</div>
        </div>
      </div>
    </div>
  </header>`;

  const titleRow = `<div class="pl-title-row">
    <div>
      <h1 class="pl-title">Collaborateurs</h1>
    </div>
    <div class="pl-cta-group">
      <button class="pl-btn-tonal">${mi('filter_list',16)} Voir les candidats</button>
      <button class="pl-btn-filled">${mi('add',16)} Créer</button>
    </div>
  </div>`;

  const filters = `<div class="pl-filters">
    <div class="pl-filters__left">
      <div class="pl-search">
        ${mi('search',16)}
        <input type="text" placeholder="Rechercher un collaborateur" readonly>
      </div>
      <!-- Segmented control type -->
      <div class="segmented" style="height:40px;">
        <button class="segmented__item segmented__item--active" style="padding:0 20px;">Intervenant</button>
        <button class="segmented__item" style="padding:0 20px;">Opérationnel agence</button>
        <button class="segmented__item" style="padding:0 20px;">Tous</button>
      </div>
    </div>
    <div class="pl-filters__right">
      <div class="pl-filter-select">Statut du collaborateur ${mi('keyboard_arrow_down',14)}</div>
      <div class="pl-filter-select">Etat de la fiche ${mi('keyboard_arrow_down',14)}</div>
      <div class="pl-filter-select">Agence 02-Viarmes ${mi('keyboard_arrow_down',14)}</div>
    </div>
  </div>`;

  const cols = [
    { label: 'Nom',                    sort: true, width: '120px' },
    { label: 'Prénom',                 sort: true, width: '120px' },
    { label: 'Type',                   sort: true, fill: true },
    { label: 'Date de naissance',      sort: true, width: '160px' },
    { label: 'Statut du collaborateur',sort: true, width: '200px' },
    { label: 'Téléphone',              sort: true, width: '150px' },
    { label: 'Etat de la fiche',       sort: true, width: '130px' },
    { label: 'Dernière modification',  sort: true, width: '180px' },
    { label: '', width: '56px', actions: true },
  ];

  const thHtml = cols.map(c => {
    if (c.actions) return `<div class="pl-th pl-th--actions"></div>`;
    const cls = c.fill ? 'pl-th pl-th--fill' : 'pl-th';
    const style = c.width && !c.fill ? `style="width:${c.width};"` : '';
    return `<div class="${cls}" ${style}>${c.label}${c.sort ? `<span class="pl-th__sort">${mi('import_export',14)}</span>` : ''}</div>`;
  }).join('');

  const rowsHtml = ROWS.map(r => {
    const tds = [
      `<div class="pl-td pl-td--bold" style="width:120px;">${r.nom}</div>`,
      `<div class="pl-td" style="width:120px;">${r.prenom}</div>`,
      `<div class="pl-td pl-td--fill">${r.type}</div>`,
      `<div class="pl-td" style="width:160px;">${r.ddn}</div>`,
      `<div class="pl-td" style="width:200px;">${statusTag(r.statut.l, r.statut.t)}</div>`,
      `<div class="pl-td" style="width:150px;">${r.tel}</div>`,
      `<div class="pl-td" style="width:130px;">${r.etat}</div>`,
      `<div class="pl-td" style="width:180px;">${r.date}</div>`,
    ].join('');
    const action = `<div class="pl-td pl-td--actions pl-row-actions">
      <button class="pl-row-btn" title="Ouvrir">${mi('arrow_forward',16)}</button>
    </div>`;
    return `<div class="pl-row">${tds}${action}</div>`;
  }).join('');

  const table = `<div class="pl-table-wrap">
    <div class="pl-table-head">${thHtml}</div>
    <div class="pl-table-body">${rowsHtml}</div>
  </div>`;

  const pagination = `<div class="pl-pagination">
    <div class="pl-page-size">
      Éléments par page :
      <select><option>15</option><option>25</option><option>50</option></select>
    </div>
    <div class="pl-pagination__info">1–15 sur 102</div>
    <div class="pl-pagination__nav">
      <button class="pl-page-btn" disabled>${mi('keyboard_double_arrow_left',16)}</button>
      <button class="pl-page-btn" disabled>${mi('keyboard_arrow_left',16)}</button>
      <button class="pl-page-btn">${mi('keyboard_arrow_right',16)}</button>
      <button class="pl-page-btn">${mi('keyboard_double_arrow_right',16)}</button>
    </div>
  </div>`;

  return `<div class="pl-page">
    ${renderSidebar()}
    <div class="pl-main">
      ${header}
      <div class="pl-scroll">
        ${titleRow}
        ${filters}
        ${table}
        ${pagination}
      </div>
    </div>
  </div>`;
}

export const variants = [
  {
    label: 'Page liste',
    isPage: true,
    render: renderPageListe,
  },
];

export const script = `
  // Toggle sidebar expand/collapse
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('#pl-sb-toggle');
    if (!btn) return;
    const sb = document.getElementById('pl-sb');
    if (!sb) return;
    const isExp = sb.dataset.expanded === 'true';
    sb.dataset.expanded = isExp ? 'false' : 'true';
    const chevL = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.47 4.94L7.42 8L10.47 11.06L9.53 12L5.53 8L9.53 4L10.47 4.94Z" fill="currentColor"/></svg>';
    const chevR = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.53 4.94L8.58 8L5.53 11.06L6.47 12L10.47 8L6.47 4L5.53 4.94Z" fill="currentColor"/></svg>';
    btn.innerHTML = isExp ? chevR : chevL;
    sb.querySelectorAll('.sb__nav-item-row').forEach(row => {
      const lbl = row.querySelector('.sb__nav-label');
      if (lbl) row.setAttribute('data-tooltip', lbl.textContent.trim());
    });
  });
`;
