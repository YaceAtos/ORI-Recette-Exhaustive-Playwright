// ══════════════════════════════════════════════════
// Page Détail — Fiche établissement
// ══════════════════════════════════════════════════
// Page complète avec :
//   - Sidebar Orion — composant .sb (sidebar.js), collapsed par défaut
//   - Header global (search + user)
//   - Breadcrumb
//   - Hero de la fiche (avatar, nom, tags, actions)
//   - Tabs — composant segmented-control.js (.segmented)
//   - Contenu selon l'onglet actif
//
// Variants :
//   1. Fiche de l'établissement  — blocs de détail + agences
//   2. Droits d'accès            — nav .si/.si--level-2 + tableaux de droits

export const name = "Page Détail";
export const description = "Page complète de fiche établissement. Sidebar .sb, segmented-control, blocs détail, tableau Démarches, panneau Agences, page Droits d'accès.";

const mi = (n, size = 16) =>
  `<span class="material-symbols-outlined" style="font-size:${size}px;line-height:1;display:inline-flex;align-items:center;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 20;">${n}</span>`;

// ── SVG icons sidebar (depuis sidebar.js) ──
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
  chevronRight:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.53 4.94L8.58 8L5.53 11.06L6.47 12L10.47 8L6.47 4L5.53 4.94Z" fill="currentColor"/></svg>`,
  chevronDown:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.94 5.53L8 8.58L11.06 5.53L12 6.47L8 10.47L4 6.47L4.94 5.53Z" fill="currentColor"/></svg>`,
  chevronUp:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.94 10.47L8 7.42L11.06 10.47L12 9.53L8 5.53L4 9.53L4.94 10.47Z" fill="currentColor"/></svg>`,
};

const SB_LOGO = `<svg width="80" height="32" viewBox="0 0 80 32" fill="none" class="sb__logo-svg">
  <circle cx="10" cy="16" r="9" stroke="#1d2024" stroke-width="1.4" fill="none"/>
  <circle cx="10" cy="10" r="2" fill="#ccdcff"/>
  <text x="22" y="22" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#1d2024">RION</text>
</svg>`;

export const styles = `

  /* ══ Page Détail — layout ══ */
  .pd-page {
    display: flex;
    height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #fafafa;
    overflow: hidden;
  }

  /* ── Contenu principal ── */
  .pd-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  /* ── Header global ── */
  .pd-header {
    height: 56px;
    background: #ffffff;
    border-bottom: 1px solid #dee2e9;
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
  }

  .pd-header__search {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 12px;
    background: #f5f5f7;
    border: 1px solid #dee2e9;
    border-radius: 6px;
    min-width: 200px;
    flex: 1;
    max-width: 280px;
  }

  .pd-header__search input {
    border: none;
    background: transparent;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    color: #1d2024;
    outline: none;
    flex: 1;
  }

  .pd-header__search input::placeholder { color: #8e96a3; }

  .pd-header__right {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
  }

  .pd-header__icon-btn {
    width: 36px; height: 36px;
    border: none; background: transparent; color: #48546d;
    border-radius: 6px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .pd-header__icon-btn:hover { background: #f5f5f7; }

  .pd-header__user {
    display: flex; align-items: center; gap: 8px; padding: 4px 8px;
    border-radius: 6px; cursor: pointer; transition: background 0.15s;
  }
  .pd-header__user:hover { background: #f5f5f7; }

  .pd-header__avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: #ced5ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #162471; flex-shrink: 0;
  }

  .pd-header__user-info { display: flex; flex-direction: column; }
  .pd-header__user-name { font-size: 13px; font-weight: 500; color: #1d2024; line-height: 16px; white-space: nowrap; }
  .pd-header__user-role { font-size: 11px; font-weight: 400; color: #8e96a3; line-height: 14px; white-space: nowrap; }

  /* ── Scroll zone ── */
  .pd-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 48px;
  }

  /* Wrapper max-width */
  .pd-inner {
    max-width: 1500px;
    width: 100%;
    margin: 0 auto;
  }

  /* ── Breadcrumb ── */
  .pd-breadcrumb {
    padding: 20px 24px 0;
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: #8e96a3;
  }
  .pd-breadcrumb a { color: #48546d; text-decoration: none; transition: color 0.15s; }
  .pd-breadcrumb a:hover { color: #013aba; }
  .pd-breadcrumb__sep { color: #dee2e9; }
  .pd-breadcrumb__current { color: #1d2024; }

  /* ── Hero ── */
  .pd-hero {
    margin: 12px 24px 0;
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    padding: 20px 24px;
    display: flex; align-items: center; gap: 24px;
  }
  .pd-hero__content { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
  .pd-hero__avatar {
    width: 62px; height: 62px; border-radius: 50%;
    background: #ced5ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 700; color: #162471; flex-shrink: 0;
  }
  .pd-hero__info { display: flex; flex-direction: column; gap: 2px; }
  .pd-hero__title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .pd-hero__title { font-size: 20px; font-weight: 700; color: #1d2024; line-height: 30px; white-space: nowrap; }
  .pd-hero__siret { font-size: 14px; font-weight: 400; color: #535862; line-height: 20px; }
  .pd-hero__actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }

  /* Tag dans le hero */
  .pd-tag {
    display: inline-flex; align-items: center; gap: 4px;
    height: 28px; padding: 4px 6px; border-radius: 6px;
    font-size: 12px; font-weight: 400; line-height: 16px; white-space: nowrap; flex-shrink: 0;
  }
  .pd-tag--neutral { background: #e6e8eb; color: #1d2024; }
  .pd-tag--error   { background: #ffe5e5; color: #9f0712; height: 32px; }
  .pd-tag--success { background: #e8fdef; color: #017437; }
  .pd-tag--info    { background: #e0e7ff; color: #150792; }

  /* Boutons hero */
  .pd-btn-ghost {
    display: inline-flex; align-items: center; gap: 4px;
    height: 36px; padding: 0 14px; font-size: 14px; font-weight: 500;
    color: #013aba; background: transparent; border: none; border-radius: 4px;
    cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
    position: relative; overflow: hidden;
  }
  .pd-btn-ghost::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: transparent; transition: background 0.15s; pointer-events: none; }
  .pd-btn-ghost:hover::after { background: rgba(1,58,186,0.08); }

  .pd-icon-btn {
    width: 36px; height: 36px; border: none; background: transparent;
    color: #48546d; border-radius: 6px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s; position: relative; overflow: hidden;
  }
  .pd-icon-btn:hover { background: rgba(29,32,36,0.06); }

  /* ── Segmented (tabs) — wrapper ── */
  .pd-tabs-wrap { margin: 12px 24px 0; }

  /* ── Section title ── */
  .pd-section-title {
    font-size: 18px; font-weight: 700; color: #1d2024;
    line-height: 28px; padding: 20px 24px 0;
  }

  /* ── Layout 2 colonnes ── */
  .pd-content {
    display: flex; gap: 16px;
    padding: 16px 24px 0;
    align-items: flex-start;
  }
  .pd-col-left  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
  .pd-col-right { width: 484px; flex-shrink: 0; display: flex; flex-direction: column; gap: 12px; }

  /* ── Tableau Démarches ── */
  .pd-table-section {
    background: #ffffff; border: 1px solid #e7e8e9; border-radius: 8px;
    padding: 24px; display: flex; flex-direction: column; gap: 16px;
  }
  .pd-table-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .pd-filter {
    display: flex; align-items: center; height: 36px; padding: 0 10px;
    border: 1px solid #dee2e9; border-radius: 6px; background: #ffffff;
    font-size: 13px; font-weight: 400; color: #48546d;
    font-family: 'Inter', sans-serif; gap: 4px; cursor: pointer; white-space: nowrap;
  }
  .pd-filter--has-value { border-color: #013aba; color: #013aba; }

  .pd-table { width: 100%; border: 1px solid #dee2e9; border-radius: 6px; overflow: hidden; font-family: 'Inter', sans-serif; }
  .pd-table-head { display: flex; background: #eaf0ff; }
  .pd-table-th { padding: 10px 16px; font-size: 14px; font-weight: 500; color: #263f7a; line-height: 20px; white-space: nowrap; flex: 1; }
  .pd-table-th--sm { flex: 0 0 130px; }
  .pd-table-th--action { flex: 0 0 48px; }
  .pd-table-row { display: flex; align-items: center; border-top: 1px solid #dee2e9; transition: background 0.1s; cursor: pointer; }
  .pd-table-row:hover { background: #eaf0ff; }
  .pd-table-td { padding: 12px 16px; font-size: 14px; font-weight: 400; color: #48546d; line-height: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
  .pd-table-td--sm { flex: 0 0 130px; }
  .pd-table-td--action { flex: 0 0 48px; display: flex; align-items: center; justify-content: center; }

  /* ── Panneau droit : agences ── */
  .pd-right-block { background: #ffffff; border: 1px solid #dee2e9; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
  .pd-right-block__header { display: flex; align-items: center; gap: 6px; padding: 20px 24px 0; }
  .pd-right-block__title { font-size: 18px; font-weight: 700; color: #1d2024; line-height: 28px; }
  .pd-right-block__count { font-size: 14px; font-weight: 400; color: #48546d; line-height: 20px; }
  .pd-right-block__cards { display: flex; flex-direction: column; gap: 12px; padding: 16px 24px; }
  .pd-agency-card {
    background: #ffffff; border: 1px solid #dee2e9; border-radius: 8px;
    padding: 14px 24px; box-shadow: 0 1px 1px rgba(0,0,0,0.04);
    display: flex; flex-direction: column; gap: 8px; cursor: pointer; transition: box-shadow 0.15s;
  }
  .pd-agency-card:hover { box-shadow: 0 2px 4px rgba(0,0,0,0.08); }
  .pd-agency-card__header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .pd-agency-card__name { font-size: 16px; font-weight: 500; color: #1d2024; line-height: 24px; }
  .pd-agency-card__row { display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 400; color: #535862; line-height: 20px; }
  .pd-agency-card__infos { display: flex; gap: 32px; align-items: flex-start; }
  .pd-agency-card__col { display: flex; flex-direction: column; gap: 0; flex-shrink: 0; }
  .pd-agency-card__col--flex { flex: 1; min-width: 0; }
  .pd-agency-card__tags { display: flex; flex-wrap: wrap; gap: 4px; padding: 4px 0; }
  .pd-agency-tag { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 4px 6px; border-radius: 6px; background: #e6e8eb; color: #1d2024; font-size: 12px; font-weight: 400; line-height: 16px; white-space: nowrap; }
  .pd-agency-card__link { font-size: 14px; color: #013aba; text-decoration: underline; cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; padding: 0; }
  .pd-right-block__footer { border-top: 1px solid #dee2e9; padding: 12px; display: flex; align-items: center; justify-content: center; }
  .pd-right-block__footer-btn { font-size: 14px; font-weight: 400; color: #0c3289; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; }

  /* ── Nav droits d'accès : sidebar-item contraint en largeur ── */
  .pd-nav-left {
    width: 229px;
    flex-shrink: 0;
    align-self: flex-start;
    background: #ffffff;
    border: 1px solid #e7e8e9;
    border-radius: 8px;
    padding: 8px;
    overflow: hidden; /* empêche les sous-items de déborder */
  }

  /* Forcer .si à ne pas dépasser sa div parente */
  .pd-nav-left .si {
    width: 100%;
  }

  .pd-nav-left .si--level-2 {
    width: 100%;
  }

  .pd-nav-section-label {
    font-size: 11px; font-weight: 600; color: #8e96a3;
    padding: 10px 12px 4px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* ── Droits d'accès : tables ── */
  .pd-rights-content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
  .pd-rights-table { background: #ffffff; border: 1px solid #dee2e9; border-radius: 8px; overflow: hidden; }
  .pd-rights-table__header { padding: 16px 24px 12px; }
  .pd-rights-table__title { font-size: 16px; font-weight: 600; color: #1d2024; }
  .pd-rights-table__desc { font-size: 13px; color: #8e96a3; margin-top: 2px; }
  .pd-rights-head { display: flex; background: #eaf0ff; border-top: 1px solid #dee2e9; padding: 10px 16px; }
  .pd-rights-th { flex: 1; font-size: 14px; font-weight: 500; color: #263f7a; display: flex; align-items: center; gap: 4px; }
  .pd-rights-th--name { flex: 2; }
  .pd-rights-row {
    display: flex; align-items: center; border-top: 1px solid #dee2e9; padding: 10px 16px;
    transition: background 0.1s; cursor: pointer;
  }
  .pd-rights-row:hover { background: #f5f8ff; }
  .pd-rights-td { flex: 1; font-size: 14px; color: #48546d; display: flex; align-items: center; justify-content: center; }
  .pd-rights-td--name { flex: 2; flex-direction: column; align-items: flex-start; justify-content: center; gap: 2px; }
  .pd-rights-td--name .pd-rights-label { font-size: 14px; color: #1d2024; display: flex; align-items: center; gap: 6px; }
  .pd-rights-td--name .pd-rights-sublabel { font-size: 12px; color: #8e96a3; }

  /* Radio custom */
  .pd-radio {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid #dee2e9; background: transparent;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pd-radio--checked { border-color: #013aba; background: #013aba; }
  .pd-radio--checked::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #fff; }

  /* Badge "Droit maître" */
  .pd-badge-master {
    display: inline-flex; align-items: center; height: 20px; padding: 0 6px;
    background: #eaf0ff; color: #013aba; border-radius: 999px;
    font-size: 11px; font-weight: 500; white-space: nowrap;
  }

  /* Bouton "Élévation possible" */
  .pd-btn-elevation {
    display: inline-flex; align-items: center; gap: 4px;
    height: 28px; padding: 0 10px;
    border: 1px solid #dee2e9; border-radius: 4px;
    font-size: 12px; color: #013aba; cursor: pointer;
    background: transparent; font-family: 'Inter', sans-serif;
  }
`;

// ─── Helpers communs ──────────────────────────────────

function pdTag(label, type = 'neutral', icon = '') {
  return `<span class="pd-tag pd-tag--${type}">${icon ? mi(icon, 16) : ''}${label}</span>`;
}

function dbField(value, label, empty = false) {
  const cls = empty ? 'db__value db__value--empty' : 'db__value';
  return `<div class="db__field">
    <span class="${cls}">${empty ? 'Non renseigné' : value}</span>
    <span class="db__label">${label}</span>
  </div>`;
}

function dbSection(title, alertType, alertText, contentHtml) {
  let alertHtml = '';
  if (alertType === 'warning') alertHtml = `<span class="db__alert db__alert--warning">${mi('notification_important',16)} ${alertText}</span>`;
  else if (alertType === 'success') alertHtml = `<span class="db__alert" style="background:#e8fdef;color:#017437;">${mi('check_circle',16)} ${alertText}</span>`;
  return `<div class="db">
    <div class="db__header">
      <div class="db__header-left">
        <div class="db__title-row"><span class="db__title">${title}</span>${alertHtml}</div>
      </div>
      <button class="db__header-btn">${mi('edit',16)} Modifier</button>
    </div>
    ${contentHtml}
  </div>`;
}

function agencyCard(name, status, type, address) {
  const icon = type === 'success' ? 'mode_standby' : 'mode_night';
  return `<div class="pd-agency-card">
    <div class="pd-agency-card__header">
      <span class="pd-agency-card__name">${name}</span>
      ${pdTag(status, type, icon)}
    </div>
    <div class="pd-agency-card__row">${mi('location_on',16)} ${address}</div>
    <div class="pd-agency-card__infos">
      <div class="pd-agency-card__col"><div class="pd-agency-card__row">${mi('domain',16)} Département</div></div>
      <div class="pd-agency-card__col pd-agency-card__col--flex"><div class="pd-agency-card__row">${mi('mail',16)} Adresse.email@domain.com</div></div>
    </div>
    <div class="pd-agency-card__tags">
      <span class="pd-agency-tag">${mi('child_friendly',14)} Garde d'enfants</span>
      <span class="pd-agency-tag">${mi('cleaning_services',14)} Ménage</span>
      <span class="pd-agency-tag">${mi('grass',14)} Jardinage</span>
      <span class="pd-agency-tag">+3</span>
    </div>
    <button class="pd-agency-card__link">Consulter</button>
  </div>`;
}

// ─── Sidebar composant .sb ────────────────────────────

function renderSidebar(activeSection = 'organisation') {
  const NAV = [
    { id:'planning',      label:'Planning',       icon:'planning',      section: null },
    { id:'clients',       label:'Clients',        icon:'clients',       section:'Membres' },
    { id:'collaborateurs',label:'Collaborateurs', icon:'collaborateurs',section:'Membres' },
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
    const selected = item.id === activeSection;
    navHtml += `<div class="sb__nav-item${selected ? ' sb__nav-item--selected' : ''}">
      <div class="sb__nav-item-row" data-tooltip="${item.label}">
        <span class="sb__nav-icon">${SB_ICONS[item.icon]}</span>
        <span class="sb__nav-label">${item.label}</span>
      </div>
    </div>`;
  }

  return `<aside class="sb" id="pd-sb" data-expanded="false" style="height:100%;flex-shrink:0;">
    <div class="sb__header">
      <div class="sb__logo">${SB_LOGO}</div>
      <button class="sb__toggle" id="pd-sb-toggle">${SB_ICONS.chevronLeft}</button>
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

// ─── Header commun ────────────────────────────────────

function renderHeader() {
  return `<header class="pd-header">
    <div class="pd-header__search">${mi('search',16)}<input type="text" placeholder="Rechercher" readonly></div>
    <div class="pd-header__right">
      <button class="pd-header__icon-btn">${mi('notifications',20)}</button>
      <button class="pd-header__icon-btn">${mi('chat',20)}</button>
      <div class="pd-header__user">
        <div class="pd-header__avatar">CW</div>
        <div class="pd-header__user-info">
          <span class="pd-header__user-name">Charles WALLABREGUE</span>
          <span class="pd-header__user-role">Intitulé du poste</span>
        </div>
      </div>
    </div>
  </header>`;
}

function renderHero() {
  return `<div class="pd-hero">
    <div class="pd-hero__content">
      <div class="pd-hero__avatar">CD</div>
      <div class="pd-hero__info">
        <div class="pd-hero__title-row">
          <span class="pd-hero__title">Nom de l'établissement</span>
          ${pdTag('Établissement principale','neutral')}
          ${pdTag('Inactif','error','mode_night')}
        </div>
        <span class="pd-hero__siret">SIRET : 123447167891514</span>
      </div>
    </div>
    <div class="pd-hero__actions">
      <button class="pd-btn-ghost">${mi('add_home',16)} Créer un regroupement</button>
      <button class="pd-btn-ghost">${mi('add_business',16)} Créer une agence</button>
      <button class="pd-icon-btn">${mi('more_vert',20)}</button>
    </div>
  </div>`;
}

// ─── Variant 1 : Fiche ───────────────────────────────

function renderFiche() {
  const tabs = `<div class="pd-tabs-wrap">
    <div class="segmented" data-pd-nav="true">
      <button class="segmented__item segmented__item--active">Fiche de l'établissement</button>
      <button class="segmented__item" onclick="pdGoTo(1)">Droits d'accès</button>
      <button class="segmented__item">Collaborateurs</button>
      <button class="segmented__item">Facturation</button>
    </div>
  </div>`;

  const aspectsJuridiques = dbSection('Aspects juridique','warning','Informations incomplète', `
    <div class="db__section"><div class="db__grid">${dbField('SARL','Code FINESS')}${dbField('—','Code NAF')}</div></div>
    <div class="db__section"><div class="db__grid">${dbField('12345','Code NAF')}${dbField('Libellé du service','Libellé NAF')}</div></div>
    <div class="db__section"><div class="db__grid">${dbField('12/08/2009','Date de début')}${dbField('12/08/2029','Date de fin')}</div></div>
    <div class="db__section"><div class="db__grid">${dbField('Nom de la ville',"Numéro d'immatriculation URSSAF")}${dbField('10 000€','Centre de rattachement URSSAF')}${dbField('Syntec','Centre de paiement URSSAF')}</div></div>
    <div class="db__section" style="border-bottom:none;padding-bottom:0;"><div class="db__grid">${dbField('750012345',"Date d'immatriculation URSSAF")}</div></div>`);

  const coordsLegales = dbSection('Coordonnées légales','warning','Informations incomplète', `
    <div class="db__section" style="border-bottom:none;padding-bottom:0;"><div class="db__grid">${dbField('18 rue George Sand, 44326, Nom de la ville','Adresse')}${dbField('France','Pays')}</div></div>`);

  const famillesProduits = dbSection('Familles de produits','success','Informations complète', `
    <div class="db__section" style="border-bottom:none;padding-bottom:0;"><div class="db__chips">
      <span class="db__chip">Dépendance mandataire</span>
      <span class="db__chip">Famille prestataire</span>
      <span class="db__chip">Vie quotidienne</span>
    </div></div>`);

  const demarches = `<div class="pd-table-section">
    <span class="db__title">Démarches</span>
    <div class="pd-table-filters">
      <div class="pd-filter pd-filter--has-value">Type ${mi('keyboard_arrow_down',14)}<span style="font-size:11px;background:#013aba;color:#fff;border-radius:999px;padding:1px 6px;margin-left:2px;">+2 sélectionnés</span></div>
      <div class="pd-filter">Date de création ${mi('keyboard_arrow_down',14)}<span style="font-size:12px;color:#48546d;margin-left:2px;">Plus récents</span></div>
      <div class="pd-filter">Date d'obtention ${mi('keyboard_arrow_down',14)}<span style="font-size:12px;color:#48546d;margin-left:2px;">Plus récents</span></div>
    </div>
    <div class="pd-table">
      <div class="pd-table-head">
        <div class="pd-table-th">Type de démarches</div>
        <div class="pd-table-th pd-table-th--sm">Date d'obtention</div>
        <div class="pd-table-th pd-table-th--sm">Date de fin de validité</div>
        <div class="pd-table-th">Activité concerné</div>
        <div class="pd-table-th pd-table-th--action"></div>
      </div>
      <div class="pd-table-row"><div class="pd-table-td">Extrait de Kbis</div><div class="pd-table-td pd-table-td--sm">12/07/2022</div><div class="pd-table-td pd-table-td--sm">12/07/2032</div><div class="pd-table-td">Accompagnement PA</div><div class="pd-table-td pd-table-td--action">${mi('arrow_forward',16)}</div></div>
      <div class="pd-table-row"><div class="pd-table-td">Contrat de franchise</div><div class="pd-table-td pd-table-td--sm">12/07/2022</div><div class="pd-table-td pd-table-td--sm">12/07/2032</div><div class="pd-table-td">Assistance PA</div><div class="pd-table-td pd-table-td--action">${mi('arrow_forward',16)}</div></div>
    </div>
  </div>`;

  const rightPanel = `<div class="pd-right-block">
    <div class="pd-right-block__header"><span class="pd-right-block__title">Agences</span><span class="pd-right-block__count">(8)</span></div>
    <div class="pd-right-block__cards">
      ${agencyCard("Nom de l'agence",'Active','success',"3 rue des sapins d'andalousie, 23400 Petit-Village")}
      ${agencyCard("Nom de l'agence",'Inactive','error',"3 rue des sapins d'andalousie, 23400 Petit-Village")}
      ${agencyCard("Nom de l'agence",'Active','success',"3 rue des sapins d'andalousie, 23400 Petit-Village")}
    </div>
    <div class="pd-right-block__footer"><button class="pd-right-block__footer-btn">Voir toutes les agences</button></div>
  </div>`;

  return `<div class="pd-page">
    ${renderSidebar('organisation')}
    <div class="pd-main">
      ${renderHeader()}
      <div class="pd-scroll">
        <div class="pd-inner">
          <nav class="pd-breadcrumb"><a href="#">Structures</a><span class="pd-breadcrumb__sep">/</span><span class="pd-breadcrumb__current">Nom de l'établissement</span></nav>
          ${renderHero()}
          ${tabs}
          <h2 class="pd-section-title">Fiche de l'établissement</h2>
          <div class="pd-content">
            <div class="pd-col-left">${aspectsJuridiques}${coordsLegales}${famillesProduits}${demarches}</div>
            <div class="pd-col-right">${rightPanel}</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── Variant 2 : Droits d'accès ───────────────────────

function siItem(label, { selected = false, open = false, children = [] } = {}) {
  const hasChildren = children.length > 0;
  const chevron = hasChildren
    ? `<span class="si__icon si__icon--trailing">${open ? SB_ICONS.chevronUp : SB_ICONS.chevronDown}</span>`
    : '';
  const isSelected = selected && !hasChildren;
  const isOpen = hasChildren && open;

  const childrenHtml = hasChildren ? `<div style="display:${open?'flex':'none'};flex-direction:column;gap:2px;padding-top:2px;">
    ${children.map(c => `<div class="si si--level-2${c.active?' si--selected':''}">
      <div class="si__item"><div class="si__content"><div class="si__label-row"><div class="si__label-left"><span class="si__label">${c.label}</span></div></div></div></div>
    </div>`).join('')}
  </div>` : '';

  return `<div>
    <div class="si${isSelected||isOpen?' si--selected':''}">
      <div class="si__item"><div class="si__content">
        <div class="si__label-row">
          <div class="si__label-left"><span class="si__label">${label}</span></div>
          ${chevron}
        </div>
      </div></div>
    </div>
    ${childrenHtml}
  </div>`;
}

function radio(checked = false) {
  return `<div class="pd-radio${checked?' pd-radio--checked':''}"></div>`;
}

function rightsRow(label, subtitle = '', nonAccorde = false, lecture = false, lecEcrit = false, statut = '', isMaster = false) {
  const badgeHtml = isMaster ? `<span class="pd-badge-master">Droit maître</span>` : '';
  const statutHtml = statut === 'elevation'
    ? `<button class="pd-btn-elevation">${mi('arrow_upward',12)} Élévation possible</button>`
    : '';
  return `<div class="pd-rights-row">
    <div class="pd-rights-td pd-rights-td--name">
      <div class="pd-rights-label">${label}${badgeHtml}</div>
      ${subtitle ? `<div class="pd-rights-sublabel">${subtitle}</div>` : ''}
    </div>
    <div class="pd-rights-td">${radio(nonAccorde)}</div>
    <div class="pd-rights-td">${radio(lecture)}</div>
    <div class="pd-rights-td">${radio(lecEcrit)}</div>
    <div class="pd-rights-td">${statutHtml}</div>
  </div>`;
}

function renderDroits() {
  const tabs = `<div class="pd-tabs-wrap">
    <div class="segmented" data-pd-nav="true">
      <button class="segmented__item" onclick="pdGoTo(0)">Fiche de l'établissement</button>
      <button class="segmented__item segmented__item--active">Droits d'accès</button>
      <button class="segmented__item">Collaborateurs</button>
      <button class="segmented__item">Facturation</button>
    </div>
  </div>`;

  const navLeft = `<div class="pd-nav-left">
    <div class="pd-nav-section-label">Opérationnel &amp; exploitation</div>
    ${siItem('Gestion des collaborateurs', { open:true, children:[
      { label:'Intervenant', active:true },
      { label:'Opé. agence', active:false },
    ]})}
    ${siItem('Gestion des clients',  { children:[{ label:'Clients & prospects', active:false }] })}
    ${siItem('Gestion du planning',  { children:[{ label:'Planning', active:false }] })}
    <div class="pd-nav-section-label">Facturation, Paie &amp; flux administratif</div>
    ${siItem('Libellé de la catégorie', { children:[{ label:'Sous-item', active:false }] })}
    ${siItem('Libellé de la catégorie', { children:[{ label:'Sous-item', active:false }] })}
    ${siItem('Libellé de la catégorie', { children:[{ label:'Sous-item', active:false }] })}
    <div class="pd-nav-section-label">Paramétrage &amp; référentiel</div>
    ${siItem('Libellé de la catégorie', { children:[{ label:'Sous-item', active:false }] })}
    ${siItem('Libellé de la catégorie', { children:[{ label:'Sous-item', active:false }] })}
    ${siItem('Configuration',           { children:[{ label:'Sous-item', active:false }] })}
  </div>`;

  const rightsHead = `<div class="pd-rights-head">
    <div class="pd-rights-th pd-rights-th--name">Nom du droit</div>
    <div class="pd-rights-th">Non accordé ${mi('info',14)}</div>
    <div class="pd-rights-th">Lecture seule ${mi('info',14)}</div>
    <div class="pd-rights-th">Lecture/Écriture ${mi('info',14)}</div>
    <div class="pd-rights-th">Statut ${mi('info',14)}</div>
  </div>`;

  const tableGestion = `<div class="pd-rights-table">
    <div class="pd-rights-table__header">
      <div class="pd-rights-table__title">Gestion des collaborateurs - intervenant</div>
      <div class="pd-rights-table__desc">Permet l'accès aux écrans de gestion des collaborateurs - intervenant</div>
    </div>
    ${rightsHead}
    ${rightsRow('Profil minimum','Prend automatiquement le niveau le plus élevé des droits ci-dessous',true,false,false,'',true)}
    ${rightsRow('Coordonnées personnelles','',false,false,true)}
    ${rightsRow('Données RH','',false,true,false,'elevation')}
    ${rightsRow('Données bancaires','',false,false,true)}
    ${rightsRow('Nom du droit','',false,true,false,'elevation')}
    ${rightsRow('Nom du droit','',true,false,false,'elevation')}
  </div>`;

  const tableSpeciaux = `<div class="pd-rights-table">
    <div class="pd-rights-table__header">
      <div class="pd-rights-table__title">Droits spéciaux</div>
    </div>
    <div class="pd-rights-head">
      <div class="pd-rights-th pd-rights-th--name">Nom du droit ${mi('import_export',14)}</div>
      <div class="pd-rights-th">Non accordé ${mi('info',14)}</div>
      <div class="pd-rights-th">Accordé ${mi('info',14)}</div>
      <div class="pd-rights-th">Statut ${mi('info',14)}</div>
    </div>
    <div class="pd-rights-row">
      <div class="pd-rights-td pd-rights-td--name"><div class="pd-rights-label">NIR en création uniquement</div></div>
      <div class="pd-rights-td">${radio(false)}</div>
      <div class="pd-rights-td">${radio(true)}</div>
      <div class="pd-rights-td">
        <span style="background:#e6e8eb;color:#48546d;font-size:12px;border-radius:4px;padding:3px 8px;">Mode édition · Inactif</span>
        <button style="margin-left:8px;display:inline-flex;align-items:center;gap:4px;height:28px;padding:0 10px;background:#013aba;color:#fff;border:none;border-radius:4px;font-size:12px;font-family:Inter,sans-serif;cursor:pointer;">${mi('edit',12)} Passer en mode édition</button>
      </div>
    </div>
  </div>`;

  return `<div class="pd-page">
    ${renderSidebar('organisation')}
    <div class="pd-main">
      ${renderHeader()}
      <div class="pd-scroll">
        <div class="pd-inner">
          <nav class="pd-breadcrumb"><a href="#">Profils</a><span class="pd-breadcrumb__sep">/</span><span class="pd-breadcrumb__current">Chargé de clientèle</span></nav>
          ${renderHero()}
          ${tabs}
          <h2 class="pd-section-title">Droits d'accès</h2>
          <div class="pd-content">
            ${navLeft}
            <div class="pd-rights-content">${tableGestion}${tableSpeciaux}</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── Exports ──────────────────────────────────────────

export const variants = [
  {
    label: 'Fiche de l\'établissement',
    isPage: true,
    render: renderFiche,
  },
  {
    label: 'Droits d\'accès',
    isPage: true,
    render: renderDroits,
  },
];

export const script = `
  // Toggle sidebar expand/collapse
  document.addEventListener('click', function(e) {
    const toggleBtn = e.target.closest('#pd-sb-toggle');
    if (!toggleBtn) return;
    const sb = document.getElementById('pd-sb');
    if (!sb) return;
    const isExpanded = sb.dataset.expanded === 'true';
    sb.dataset.expanded = isExpanded ? 'false' : 'true';
    const chevL = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.47 4.94L7.42 8L10.47 11.06L9.53 12L5.53 8L9.53 4L10.47 4.94Z" fill="currentColor"/></svg>';
    const chevR = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.53 4.94L8.58 8L5.53 11.06L6.47 12L10.47 8L6.47 4L5.53 4.94Z" fill="currentColor"/></svg>';
    toggleBtn.innerHTML = isExpanded ? chevR : chevL;
    sb.querySelectorAll('.sb__nav-item-row').forEach(row => {
      const lbl = row.querySelector('.sb__nav-label');
      if (lbl) row.setAttribute('data-tooltip', lbl.textContent.trim());
    });
  });

  // pdGoTo : définie ici pour coexister avec window.pdGoTo de modeles.html
  // Les deux font la même chose — celle-ci ne remplace pas l'autre
  function pdGoTo(variantIdx) {
    if (window.pdGoTo) window.pdGoTo(variantIdx);
  }
`;
