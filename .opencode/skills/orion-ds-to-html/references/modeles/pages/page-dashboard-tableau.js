// ══════════════════════════════════════════════════
// Page Dashboard Tableau — KPIs + tableau de données
// ══════════════════════════════════════════════════
// Même base que page-liste avec en plus :
//   - Expansion panel "Performance" avec cartes mensuelles
//   - KPI cards (statut + total + montant)
//   - Tableau avec checkbox, filtres, actions
//
// Variante : Factures

export const name = "Page Dashboard Tableau";
export const description = "Page liste enrichie : expansion panel KPIs historiques + cartes statuts + tableau filtré avec checkboxes.";

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
  facturation:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.33 2H2.67C1.93 2 1.33 2.6 1.33 3.33V12.67C1.33 13.4 1.93 14 2.67 14H13.33C14.07 14 14.67 13.4 14.67 12.67V3.33C14.67 2.6 14.07 2 13.33 2ZM13.33 12.67H2.67V5.33H13.33V12.67ZM4 8H12V9.33H4V8ZM4 10.67H8V12H4V10.67Z" fill="currentColor"/></svg>`,
  organisation:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="1.5" fill="currentColor"/><circle cx="11" cy="5" r="1.5" fill="currentColor"/><circle cx="5" cy="11" r="1.5" fill="currentColor"/><circle cx="11" cy="11" r="1.5" fill="currentColor"/></svg>`,
  configuration: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.27 2L5.87 3.73C5.5 3.89 5.16 4.1 4.85 4.35L3.17 3.75L1.44 6.75L2.85 7.85C2.82 8.05 2.8 8.25 2.8 8.45C2.8 8.65 2.82 8.85 2.85 9.05L1.44 10.15L3.17 13.15L4.85 12.55C5.16 12.8 5.5 13.01 5.87 13.17L6.27 14.9H9.73L10.13 13.17C10.5 13.01 10.84 12.8 11.15 12.55L12.83 13.15L14.56 10.15L13.15 9.05C13.18 8.85 13.2 8.65 13.2 8.45C13.2 8.25 13.18 8.05 13.15 7.85L14.56 6.75L12.83 3.75L11.15 4.35C10.84 4.1 10.5 3.89 10.13 3.73L9.73 2H6.27ZM8 6.45C9.1 6.45 10 7.35 10 8.45C10 9.55 9.1 10.45 8 10.45C6.9 10.45 6 9.55 6 8.45C6 7.35 6.9 6.45 8 6.45Z" fill="currentColor"/></svg>`,
  parametres:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.07 8.62C13.09 8.42 13.11 8.21 13.11 8C13.11 7.79 13.09 7.58 13.07 7.38L14.55 6.22C14.68 6.12 14.72 5.94 14.63 5.79L13.23 3.37C13.14 3.22 12.96 3.16 12.81 3.22L11.07 3.94C10.73 3.68 10.36 3.47 9.96 3.31L9.69 1.45C9.66 1.28 9.52 1.16 9.35 1.16H6.55C6.38 1.16 6.24 1.28 6.21 1.45L5.94 3.31C5.54 3.47 5.17 3.69 4.83 3.94L3.09 3.22C2.93 3.16 2.76 3.22 2.67 3.37L1.27 5.79C1.17 5.94 1.21 6.12 1.35 6.22L2.83 7.38C2.81 7.58 2.79 7.8 2.79 8C2.79 8.2 2.81 8.42 2.83 8.62L1.35 9.78C1.22 9.88 1.17 10.06 1.27 10.21L2.67 12.63C2.76 12.78 2.94 12.84 3.09 12.78L4.83 12.06C5.17 12.32 5.54 12.53 5.94 12.69L6.21 14.55C6.24 14.72 6.38 14.84 6.55 14.84H9.35C9.52 14.84 9.66 14.72 9.69 14.55L9.96 12.69C10.36 12.53 10.73 12.31 11.07 12.06L12.81 12.78C12.97 12.84 13.14 12.78 13.23 12.63L14.63 10.21C14.72 10.06 14.68 9.88 14.55 9.78L13.07 8.62ZM7.95 10.4C6.63 10.4 5.55 9.32 5.55 8C5.55 6.68 6.63 5.6 7.95 5.6C9.27 5.6 10.35 6.68 10.35 8C10.35 9.32 9.27 10.4 7.95 10.4Z" fill="currentColor"/></svg>`,
  chevronDown:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.94 5.53L8 8.58L11.06 5.53L12 6.47L8 10.47L4 6.47L4.94 5.53Z" fill="currentColor"/></svg>`,
  chevronLeft:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.47 4.94L7.42 8L10.47 11.06L9.53 12L5.53 8L9.53 4L10.47 4.94Z" fill="currentColor"/></svg>`,
  chevronRight:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5.53 4.94L8.58 8L5.53 11.06L6.47 12L10.47 8L6.47 4L5.53 4.94Z" fill="currentColor"/></svg>`,
};

const SB_LOGO = `<svg width="80" height="32" viewBox="0 0 80 32" fill="none"><circle cx="10" cy="16" r="9" stroke="#1d2024" stroke-width="1.4" fill="none"/><circle cx="10" cy="10" r="2" fill="#ccdcff"/><text x="22" y="22" font-family="Inter, sans-serif" font-size="18" font-weight="600" fill="#1d2024">RION</text></svg>`;

export const styles = `

  /* ══ Page Dashboard Tableau ══ */
  .pdt-page {
    display: flex;
    height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #ffffff;
    overflow: hidden;
  }

  /* ── Sidebar — remplacée par composant .sb ── */
  /* Les styles .sb sont injectés via COMPOSANTS dans modeles.html */

  /* ── Main ── */
  .pdt-main {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column; height: 100%; overflow: hidden;
  }

  /* ── Header global ── */
  .pdt-header {
    height: 56px; background: #ffffff; border-bottom: 1px solid #dee2e9;
    display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0;
  }
  .pdt-header__search {
    display: flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px;
    background: #f5f5f7; border: 1px solid #dee2e9; border-radius: 6px;
    min-width: 200px; flex: 1; max-width: 280px;
  }
  .pdt-header__search input {
    border: none; background: transparent; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #1d2024; outline: none; flex: 1;
  }
  .pdt-header__search input::placeholder { color: #8e96a3; }
  .pdt-header__right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .pdt-header__icon-btn {
    width: 36px; height: 36px; border: none; background: transparent; color: #48546d;
    border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }
  .pdt-header__user {
    display: flex; align-items: center; gap: 8px; padding: 4px 8px;
    border-radius: 6px; cursor: pointer;
  }
  .pdt-header__avatar {
    width: 28px; height: 28px; border-radius: 50%; background: #ced5ff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #162471; flex-shrink: 0;
  }
  .pdt-header__user-name { font-size: 13px; font-weight: 500; color: #1d2024; white-space: nowrap; }
  .pdt-header__user-role { font-size: 11px; font-weight: 400; color: #8e96a3; white-space: nowrap; }

  /* ── Scroll ── */
  .pdt-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 0 24px 32px; }

  /* ── Titre + filtres globaux ── */
  .pdt-title-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0 16px;
  }
  .pdt-title { font-size: 32px; font-weight: 700; color: #1d2024; line-height: 44px; letter-spacing: -0.5px; }
  .pdt-title-filters { display: flex; align-items: center; gap: 8px; }

  /* Mini select filtre (Mois / Année) */
  .pdt-filter-sm {
    display: flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 10px;
    border: 1px solid #7381a2; border-radius: 6px;
    font-size: 14px; color: #1d2024; background: #ffffff;
    cursor: pointer; font-family: 'Inter', sans-serif; position: relative;
  }
  .pdt-filter-sm__label { font-size: 11px; position: absolute; top: -8px; left: 10px; background: #fff; padding: 0 2px; color: #535862; }

  /* Bouton action dans le titre */
  /* ── Bouton tonal ── */
  .pdt-btn-tonal {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 14px;
    font-size: 14px; font-weight: 500; color: #263f7a;
    background: #eaf0ff; border: none; border-radius: 4px;
    cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
    position: relative; overflow: hidden;
  }
  .pdt-btn-tonal::after { content:""; position:absolute; inset:0; border-radius:inherit; background:transparent; transition:background 0.15s; pointer-events:none; }
  .pdt-btn-tonal:hover::after { background:rgba(38,63,122,0.08); }

  /* ── Bouton outlined ── */
  .pdt-btn-outlined {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 14px;
    font-size: 14px; font-weight: 500; color: #48546d;
    background: transparent; border: 1px solid #dee2e9; border-radius: 4px;
    cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
  }

  /* ── Expansion panel Performance ── */
  .pdt-perf {
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 6px;
    margin-bottom: 16px;
    overflow: hidden;
    background: #ffffff;
  }

  .pdt-perf__header {
    display: flex; align-items: center; justify-content: space-between;
    height: 44px; padding: 0 16px;
    cursor: pointer; user-select: none;
    background: #ffffff;
    position: relative;
  }
  .pdt-perf__header::after {
    content: ""; position: absolute; inset: 0;
    background: transparent; transition: background 0.15s; pointer-events: none;
  }
  .pdt-perf__header:hover::after { background: rgba(29,32,36,0.05); }

  .pdt-perf__title { font-size: 14px; font-weight: 500; color: #1d2024; }
  .pdt-perf__subtitle { font-size: 14px; font-weight: 400; color: #8e96a3; margin-left: 6px; }
  .pdt-perf__chevron { color: #48546d; display: flex; align-items: center; transition: transform 0.2s; }
  .pdt-perf--open .pdt-perf__chevron { transform: rotate(180deg); }

  .pdt-perf__divider { height: 1px; background: #dee2e9; }

  .pdt-perf__body {
    display: none;
    padding: 20px 16px;
    gap: 12px;
    overflow-x: auto;
  }
  .pdt-perf--open .pdt-perf__body { display: flex; }

  /* Carte mensuelle */
  .pdt-month-card {
    flex: 1; min-width: 130px;
    border: 1px solid #dee2e9; border-radius: 8px;
    padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
    background: #ffffff; flex-shrink: 0;
  }

  .pdt-month-card--current {
    border-color: #013aba;
    box-shadow: 0 0 0 1px #013aba;
  }

  .pdt-month-card__header {
    display: flex; align-items: center; justify-content: space-between;
  }

  .pdt-month-card__date {
    font-size: 13px; font-weight: 500; color: #1d2024; white-space: nowrap;
  }

  .pdt-month-card__badge {
    display: inline-flex; align-items: center;
    height: 18px; padding: 0 6px; border-radius: 999px;
    background: #eaf0ff; color: #013aba;
    font-size: 11px; font-weight: 500; white-space: nowrap;
  }

  .pdt-month-card__amount {
    font-size: 20px; font-weight: 700; color: #1d2024; line-height: 28px;
  }

  /* Barre de progression bleue */
  .pdt-month-card__bar {
    height: 3px; background: #dee2e9; border-radius: 2px; overflow: hidden;
  }
  .pdt-month-card__bar-fill {
    height: 100%; background: #013aba; border-radius: 2px;
  }

  .pdt-month-card__meta { display: flex; flex-direction: column; gap: 4px; }
  .pdt-month-card__meta-line {
    font-size: 12px; color: #48546d; line-height: 16px;
  }
  .pdt-month-card__meta-label {
    font-size: 11px; color: #8e96a3; line-height: 14px;
  }

  /* ── KPI Cards ── */
  .pdt-kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .pdt-kpi-card {
    border: 1px solid #dee2e9; border-radius: 8px;
    padding: 16px 20px;
    background: #ffffff;
    display: flex; flex-direction: column; gap: 4px;
    position: relative;
  }

  .pdt-kpi-card__header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 4px;
  }

  .pdt-kpi-card__status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 500;
  }

  .pdt-kpi-card__menu {
    width: 28px; height: 28px; border: none; background: transparent;
    color: #8e96a3; border-radius: 4px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .pdt-kpi-card__menu:hover { background: rgba(29,32,36,0.06); color: #1d2024; }

  .pdt-kpi-card__count {
    font-size: 22px; font-weight: 700; color: #1d2024; line-height: 30px;
  }

  .pdt-kpi-card__amount {
    font-size: 14px; font-weight: 400; color: #48546d;
  }

  /* ── Barre de filtres tableau ── */
  .pdt-table-filters {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }

  .pdt-table-filters__row1 {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }

  .pdt-table-filters__row2 {
    display: flex; align-items: center; gap: 8px;
    justify-content: flex-end;
  }

  .pdt-table-filters__left { display: flex; align-items: center; gap: 12px; }
  .pdt-table-filters__right { display: flex; align-items: center; gap: 8px; }

  .pdt-table-search {
    display: flex; align-items: center; gap: 8px;
    height: 36px; padding: 0 12px;
    background: #ffffff; border: 1px solid #7381a2; border-radius: 6px;
    width: 240px;
  }
  .pdt-table-search input {
    border: none; background: transparent; font-size: 14px;
    font-family: 'Inter', sans-serif; color: #1d2024; outline: none; flex: 1;
  }
  .pdt-table-search input::placeholder { color: #8e96a3; }

  .pdt-filter-select {
    display: flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 10px;
    background: #ffffff; border: 1px solid #7381a2; border-radius: 6px;
    font-size: 13px; color: #48546d; cursor: pointer;
    font-family: 'Inter', sans-serif; white-space: nowrap;
  }

  .pdt-table-actions {
    display: flex; align-items: center; gap: 8px;
  }

  .pdt-action-btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 14px;
    font-size: 14px; font-weight: 500; color: #48546d;
    background: transparent; border: 1px solid #dee2e9; border-radius: 4px;
    cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap;
    transition: border-color 0.15s, color 0.15s;
  }
  .pdt-action-btn:hover:not(:disabled) { border-color: #48546d; }
  .pdt-action-btn:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Tableau ── */
  .pdt-table-wrap {
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 8px;
    overflow: hidden;
  }

  .pdt-table-head { display: flex; background: #eaf0ff; border-bottom: 1px solid #dee2e9; }
  .pdt-th {
    display: flex; align-items: center; gap: 4px;
    padding: 12px 16px; font-size: 14px; font-weight: 500; color: #263f7a;
    line-height: 20px; white-space: nowrap; cursor: pointer; flex-shrink: 0;
  }
  .pdt-th--fill { flex: 1; min-width: 0; }
  .pdt-th--check { flex: 0 0 48px; justify-content: center; }
  .pdt-th__sort { color: #6683c0; opacity: 0.7; display: flex; align-items: center; }
  .pdt-th:hover .pdt-th__sort { opacity: 1; }

  /* Checkbox */
  .pdt-checkbox {
    width: 16px; height: 16px; border-radius: 2px;
    border: 1.5px solid #48546d; background: #ffffff;
    cursor: pointer; flex-shrink: 0; appearance: none;
    display: flex; align-items: center; justify-content: center;
    position: relative; transition: border-color 0.15s;
  }
  .pdt-checkbox:checked {
    background: #013aba; border-color: #013aba;
  }
  .pdt-checkbox:checked::after {
    content: "";
    position: absolute;
    left: 3px; top: 1px;
    width: 8px; height: 5px;
    border-left: 2px solid #fff; border-bottom: 2px solid #fff;
    transform: rotate(-45deg);
  }

  .pdt-table-body { display: flex; flex-direction: column; }

  .pdt-row {
    display: flex; align-items: center;
    border-bottom: 1px solid #dee2e9;
    cursor: pointer; background: #ffffff; transition: background 0.1s;
  }
  .pdt-row:last-child { border-bottom: none; }
  .pdt-row:hover { background: #eaf0ff; }
  .pdt-row .pdt-row-arrow { opacity: 0; transition: opacity 0.1s; }
  .pdt-row:hover .pdt-row-arrow { opacity: 1; }

  .pdt-td {
    padding: 12px 16px; font-size: 14px; font-weight: 400; color: #48546d;
    line-height: 20px; white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; flex-shrink: 0;
  }
  .pdt-td--fill { flex: 1; min-width: 0; }
  .pdt-td--check { flex: 0 0 48px; display: flex; align-items: center; justify-content: center; }
  .pdt-td--arrow { flex: 0 0 48px; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; }
  .pdt-td--num { font-variant-numeric: tabular-nums; }

  .pdt-row-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: none; background: transparent;
    color: #48546d; border-radius: 6px; cursor: pointer;
    position: relative; overflow: hidden; transition: color 0.15s;
  }
  .pdt-row-btn::after { content:""; position:absolute; inset:0; border-radius:inherit; background:transparent; transition:background 0.15s; pointer-events:none; }
  .pdt-row-btn:hover { color: #013aba; }
  .pdt-row-btn:hover::after { background: rgba(1,58,186,0.08); }

  /* ── Pagination ── */
  .pdt-pagination {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 16px; padding: 12px 0 0; font-size: 12px; color: #48546d;
  }
  .pdt-page-size { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
  .pdt-page-size select {
    height: 32px; padding: 0 8px; border: 1px solid #dee2e9; border-radius: 4px;
    font-size: 12px; font-family: 'Inter', sans-serif; color: #1d2024;
    background: #ffffff; cursor: pointer; outline: none;
  }
  .pdt-page-nav { display: flex; align-items: center; gap: 4px; }
  .pdt-page-btn {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border: none; background: transparent;
    color: #48546d; border-radius: 4px; cursor: pointer; transition: background 0.15s, color 0.15s;
  }
  .pdt-page-btn:hover { background: #eaf0ff; color: #013aba; }
  .pdt-page-btn:disabled { opacity: 0.35; cursor: default; pointer-events: none; }
`;

// ─── Helpers ────────────────────────────────────────

function rowStatusTag(label, type) {
  const ICON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM8.67 11.33H7.33V7.33H8.67V11.33ZM8.67 6H7.33V4.67H8.67V6Z" fill="currentColor"/></svg>`;
  return `<span class="tag tag--${type} tag--sm">${ICON}<span>${label}</span></span>`;
}

// ─── Render Sidebar expanded ────────────────────────

function renderSidebar() {
  // Utilise le composant .sb (sidebar.js) — expanded par défaut
  const NAV = [
    { id:'planning',      label:'Planning',       icon:'planning',      section: null },
    { id:'clients',       label:'Clients',        icon:'clients',       section:'Membres' },
    { id:'collaborateurs',label:'Collaborateurs', icon:'collaborateurs',section:'Membres' },
    { id:'partenariats',  label:'Partenariats',   icon:'partenariats',  section:'Membres' },
    { id:'produits',      label:'Produits',       icon:'produits',      section:'Gestion' },
    { id:'gestionRH',     label:'Gestion RH',     icon:'gestionRH',     section:'Gestion' },
    { id:'suiviQualite',  label:'Suivi qualité',  icon:'suiviQualite',  section:'Gestion' },
    { id:'facturation',   label:'Facturation',    icon:'facturation',   section:'Gestion', active: true, open: true,
      children: [
        { id:'table-faits', label:'Table de faits' },
        { id:'factures',    label:'Factures', active: true },
      ]
    },
    { id:'organisation',  label:'Organisation',   icon:'organisation',  section:'Autres' },
    { id:'configuration', label:'Configuration',  icon:'configuration', section:'Autres' },
  ];

  let currentSection = null;
  let navHtml = '';
  for (const item of NAV) {
    if (item.section && item.section !== currentSection) {
      currentSection = item.section;
      navHtml += `<div class="sb__section-label">${currentSection}</div>`;
    }
    const hasChildren = item.children && item.children.length > 0;
    const chevron = hasChildren
      ? `<span class="sb__nav-chevron">${item.open ? SB_ICONS.chevronDown : SB_ICONS.chevronDown}</span>`
      : '';
    const openClass = item.open ? ' sb__nav-item--open' : '';
    const selectedClass = item.active && !hasChildren ? ' sb__nav-item--selected' : '';
    const childSelectedClass = item.active && hasChildren ? ' sb__nav-item--child-selected' : '';
    navHtml += `<div class="sb__nav-item${selectedClass}${childSelectedClass}${openClass}" data-has-children="${hasChildren}">
      <div class="sb__nav-item-row" data-tooltip="${item.label}">
        <span class="sb__nav-icon">${SB_ICONS[item.icon] || ''}</span>
        <span class="sb__nav-label">${item.label}</span>
        ${chevron}
      </div>
      ${hasChildren ? `<div class="sb__nav-children" data-parent="${item.id}">
        ${(item.children || []).map(c =>
          `<div class="sb__nav-child${c.active ? ' sb__nav-child--selected' : ''}" data-child-id="${c.id}">
            <span class="sb__nav-child-label">${c.label}</span>
          </div>`
        ).join('')}
      </div>` : ''}
    </div>`;
  }

  return `<aside class="sb" id="pdt-sb" data-expanded="true" style="height:100%;flex-shrink:0;">
    <div class="sb__header">
      <div class="sb__logo">${SB_LOGO}</div>
      <button class="sb__toggle" id="pdt-sb-toggle">${SB_ICONS.chevronLeft}</button>
    </div>
    <nav class="sb__nav">${navHtml}</nav>
    <div class="sb__footer">
      <div class="sb__nav-item sb__nav-item--footer" data-has-children="false">
        <div class="sb__nav-item-row" data-tooltip="Paramètres">
          <span class="sb__nav-icon">${SB_ICONS.parametres}</span>
          <span class="sb__nav-label">Paramètres</span>
        </div>
      </div>
    </div>
  </aside>`;
}

// ─── Render Page ────────────────────────────────────

function renderPageDashboard() {

  const header = `<header class="pdt-header">
    <div class="pdt-header__search">${mi('search',16)}<input type="text" placeholder="Rechercher" readonly></div>
    <div class="pdt-header__right">
      <button class="pdt-header__icon-btn">${mi('notifications',20)}</button>
      <button class="pdt-header__icon-btn">${mi('chat',20)}</button>
      <div class="pdt-header__user">
        <div class="pdt-header__avatar">CW</div>
        <div>
          <div class="pdt-header__user-name">Charles WALLABREGUE</div>
          <div class="pdt-header__user-role">Intitulé du poste</div>
        </div>
      </div>
    </div>
  </header>`;

  // ── Titre + filtres globaux ──
  const titleRow = `<div class="pdt-title-row">
    <h1 class="pdt-title">Factures</h1>
    <div class="pdt-title-filters">
      <div class="pdt-filter-sm">
        <span class="pdt-filter-sm__label">Mois</span>
        Mai ${mi('keyboard_arrow_down',14)}
      </div>
      <div class="pdt-filter-sm">
        <span class="pdt-filter-sm__label">Année</span>
        2026 ${mi('keyboard_arrow_down',14)}
      </div>
      <button class="pdt-btn-tonal">${mi('check_circle',16)} Clôturer</button>
    </div>
  </div>`;

  // ── Expansion panel Performance ──
  const months = [
    { label: 'Janvier', year: '2026', amount: '3 200 €', fill: 100, meta: [{ val:'2 900 €', lbl:'PEC OF' }] },
    { label: 'Février', year: '2026', amount: '3 200 €', fill: 100, meta: [{ val:'2 900 €', lbl:'PEC OF' }] },
    { label: 'Mars',    year: '2026', amount: '3 200 €', fill: 100, meta: [{ val:'2 900 €', lbl:'PEC OF' }] },
    { label: 'Avril',   year: '2026', amount: '3 200 €', fill: 100, meta: [{ val:'2 900 €', lbl:'PEC OF' }] },
    { label: 'Mai',     year: '2026', amount: '3 200 €', fill: 17,  current: true, badge: 'En cours', pct: '17 %',
      meta: [{ val:'2 900 €', lbl:'Factures non émises' }, { val:'2 900 €', lbl:'PEC OF attendue' }] },
    { label: 'Juin',    year: '2026', amount: '0 €', fill: 0, meta: [{ val:'–', lbl:'PEC OF' }] },
  ];

  const monthCards = months.map(m => `
    <div class="pdt-month-card${m.current ? ' pdt-month-card--current' : ''}">
      <div class="pdt-month-card__header">
        <span class="pdt-month-card__date">${m.label} <span style="color:#8e96a3;font-weight:400;">${m.year}</span></span>
        ${m.badge ? `<span class="pdt-month-card__badge">${m.badge}</span>` : ''}
      </div>
      <div class="pdt-month-card__amount">${m.amount}${m.pct ? `<span style="font-size:14px;font-weight:400;color:#8e96a3;margin-left:8px;">${m.pct}</span>` : ''}</div>
      <div class="pdt-month-card__bar"><div class="pdt-month-card__bar-fill" style="width:${m.fill}%;"></div></div>
      <div class="pdt-month-card__meta">
        ${m.meta.map(x => `<span class="pdt-month-card__meta-line">${x.val}</span><span class="pdt-month-card__meta-label">${x.lbl}</span>`).join('')}
      </div>
    </div>`).join('');

  const perfPanel = `<div class="pdt-perf pdt-perf--open" id="pdt-perf">
    <div class="pdt-perf__header" onclick="pdtTogglePerf()">
      <div>
        <span class="pdt-perf__title">Performance</span>
        <span class="pdt-perf__subtitle">6 mois</span>
      </div>
      <span class="pdt-perf__chevron">${SB_ICONS.chevronDown}</span>
    </div>
    <div class="pdt-perf__divider"></div>
    <div class="pdt-perf__body">${monthCards}</div>
  </div>`;

  // ── KPI Cards — tags composant avec icônes spécifiques ──
  const KPI_ICONS = {
    success: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM6.67 11.33L3.33 8L4.27 7.06L6.67 9.45L11.73 4.39L12.67 5.33L6.67 11.33Z" fill="currentColor"/></svg>`,
    info:    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><path d="M13.33 2.67H2.67C1.93 2.67 1.33 3.27 1.33 4V10.67C1.33 11.4 1.93 12 2.67 12H6L8 14L10 12H13.33C14.07 12 14.67 11.4 14.67 10.67V4C14.67 3.27 14.07 2.67 13.33 2.67ZM13.33 10.67H9.45L8 12.12L6.55 10.67H2.67V4H13.33V10.67Z" fill="currentColor"/></svg>`,
    warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><path d="M8.67 2H7.33L1.33 12.67H14.67L8.67 2ZM8 5.33L11.07 10.67H4.93L8 5.33ZM7.33 8H8.67V9.33H7.33V8ZM7.33 10H8.67V11.33H7.33V10Z" fill="currentColor"/></svg>`,
    error:   `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0;"><path d="M12.5 3.5L8 8M8 8L3.5 12.5M8 8L3.5 3.5M8 8L12.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  };

  const kpis = [
    { tagType:'success', tagLabel:'Émises',     icon:'success', count:'8 factures',  amount:'1 840 €' },
    { tagType:'info',    tagLabel:'À émettre',  icon:'info',    count:'5 factures',  amount:'1 150 €' },
    { tagType:'warning', tagLabel:'À valider',  icon:'warning', count:'3 factures',  amount:'690 €'   },
    { tagType:'error',   tagLabel:'À corriger', icon:'error',   count:'1 facture',   amount:'230 €'   },
  ];

  const kpiCards = kpis.map(k => `
    <div class="pdt-kpi-card">
      <div class="pdt-kpi-card__header">
        <span class="tag tag--${k.tagType} tag--sm">${KPI_ICONS[k.icon]}<span>${k.tagLabel}</span></span>
        <button class="pdt-kpi-card__menu">${mi('more_vert',16)}</button>
      </div>
      <div class="pdt-kpi-card__count">${k.count}</div>
      <div class="pdt-kpi-card__amount">${k.amount}</div>
    </div>`).join('');

  const kpiRow = `<div class="pdt-kpi-row">${kpiCards}</div>`;

  // ── Filtres tableau — 2 lignes ──
  const tableFilters = `<div class="pdt-table-filters">
    <div class="pdt-table-filters__row1">
      <div class="pdt-table-filters__left">
        <div class="pdt-table-search">
          ${mi('search',16)}
          <input type="text" placeholder="Rechercher" readonly>
        </div>
      </div>
      <div class="pdt-table-filters__right">
        <div class="pdt-filter-select">Type ${mi('keyboard_arrow_down',14)}</div>
        <div class="pdt-filter-select">Statuts ${mi('keyboard_arrow_down',14)}</div>
      </div>
    </div>
    <div class="pdt-table-filters__row2">
      <div class="pdt-table-actions">
        <button class="pdt-action-btn" id="pdt-btn-export" disabled>${mi('download',14)} Exporter les factures</button>
        <button class="pdt-action-btn" id="pdt-btn-validate" disabled>${mi('check_circle',14)} Valider la sélection</button>
      </div>
    </div>
  </div>`;

  // ── Tableau ──
  const ROWS_DATA = [
    { id:'FAC-2026-0142', client:'Marcelle AURIOL', agence:'O2 Care Services, Paris 15e', ht:'297,39 €', ttc:'297,39 €', lignes:2,  statut:{l:'À valider',t:'warning'} },
    { id:'FAC-2026-0142', client:'Marcelle AURIOL', agence:'O2 Care Services, Paris 15e', ht:'297,39 €', ttc:'297,39 €', lignes:4,  statut:{l:'À corriger',t:'error'},   arrow:true },
    { id:'FAC-2026-0142', client:'Marcelle AURIOL', agence:'O2 Care Services, Paris 15e', ht:'297,39 €', ttc:'297,39 €', lignes:12, statut:{l:'Émise',t:'success'} },
    { id:'FAC-2026-0142', client:'Marcelle AURIOL', agence:'O2 Care Services, Paris 15e', ht:'297,39 €', ttc:'297,39 €', lignes:8,  statut:{l:'À émettre',t:'info'} },
    { id:'FAC-2026-0142', client:'Marcelle AURIOL', agence:'O2 Care Services, Paris 15e', ht:'297,39 €', ttc:'297,39 €', lignes:6,  statut:{l:'À valider',t:'warning'} },
  ];

  const thHtml = `
    <div class="pdt-th pdt-th--check"><input type="checkbox" class="pdt-checkbox"></div>
    <div class="pdt-th" style="width:150px;">Facture ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th pdt-th--fill">Client ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th" style="width:220px;">Agence ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th" style="width:120px;">Montant HT ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th" style="width:120px;">Montant TTC ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th" style="width:80px;">Lignes ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th" style="width:140px;">Statut ${mi('import_export',14)}<span class="pdt-th__sort"></span></div>
    <div class="pdt-th" style="width:48px;"></div>`;

  const rowsHtml = ROWS_DATA.map(r => `
    <div class="pdt-row">
      <div class="pdt-td pdt-td--check"><input type="checkbox" class="pdt-checkbox"></div>
      <div class="pdt-td" style="width:150px;">${r.id}</div>
      <div class="pdt-td pdt-td--fill">${r.client}</div>
      <div class="pdt-td" style="width:220px;">${r.agence}</div>
      <div class="pdt-td pdt-td--num" style="width:120px;">${r.ht}</div>
      <div class="pdt-td pdt-td--num" style="width:120px;">${r.ttc}</div>
      <div class="pdt-td pdt-td--num" style="width:80px;">${r.lignes}</div>
      <div class="pdt-td" style="width:140px;">${rowStatusTag(r.statut.l, r.statut.t)}</div>
      <div class="pdt-td pdt-td--arrow pdt-row-arrow">
        <button class="pdt-row-btn">${mi('arrow_forward',16)}</button>
      </div>
    </div>`).join('');

  const table = `<div class="pdt-table-wrap">
    <div class="pdt-table-head">${thHtml}</div>
    <div class="pdt-table-body">${rowsHtml}</div>
  </div>`;

  const pagination = `<div class="pdt-pagination">
    <div class="pdt-page-size">
      Éléments par page :
      <select><option>15</option><option>25</option><option>50</option></select>
    </div>
    <div>1–15 sur 102</div>
    <div class="pdt-page-nav">
      <button class="pdt-page-btn" disabled>${mi('keyboard_double_arrow_left',16)}</button>
      <button class="pdt-page-btn" disabled>${mi('keyboard_arrow_left',16)}</button>
      <button class="pdt-page-btn">${mi('keyboard_arrow_right',16)}</button>
      <button class="pdt-page-btn">${mi('keyboard_double_arrow_right',16)}</button>
    </div>
  </div>`;

  return `<div class="pdt-page">
    ${renderSidebar()}
    <div class="pdt-main">
      ${header}
      <div class="pdt-scroll">
        ${titleRow}
        ${perfPanel}
        ${kpiRow}
        ${tableFilters}
        ${table}
        ${pagination}
      </div>
    </div>
  </div>`;
}

export const variants = [
  {
    label: 'Dashboard Factures',
    isPage: true,
    render: renderPageDashboard,
  },
];

export const script = `
  // Toggle sidebar .sb expand/collapse
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('#pdt-sb-toggle');
    if (!btn) return;
    const sb = document.getElementById('pdt-sb');
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

  // Toggle expansion panel Performance
  function pdtTogglePerf() {
    const el = document.getElementById('pdt-perf');
    if (el) el.classList.toggle('pdt-perf--open');
  }

  // Activer les boutons d'action quand une checkbox est cochée
  document.addEventListener('change', function(e) {
    const cb = e.target.closest('.pdt-checkbox');
    if (!cb) return;
    const anyChecked = document.querySelectorAll('.pdt-table-body .pdt-checkbox:checked').length > 0;
    const btnExport   = document.getElementById('pdt-btn-export');
    const btnValidate = document.getElementById('pdt-btn-validate');
    if (btnExport)   btnExport.disabled   = !anyChecked;
    if (btnValidate) btnValidate.disabled = !anyChecked;
  });
`;
