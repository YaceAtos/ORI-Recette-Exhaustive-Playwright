// ══════════════════════════════════════════════════
// Tooltip
// ══════════════════════════════════════════════════

export const name = "Tooltip";
export const description = "Tooltip contextuel. Small : bulle simple au survol (icône « i »). Large : panneau avec header, liste d'éléments et croix de fermeture, ouvert au clic.";

// ── Icônes ──
const ICON_CLOSE = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="tt__close-icon">
  <path d="M6 6L16 16" stroke="#1d2024" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M16 6L6 16" stroke="#1d2024" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

const ICON_INFO = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="tt__trigger-icon">
  <path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM8.67 11.33H7.33V7.33H8.67V11.33ZM8.67 6H7.33V4.67H8.67V6Z" fill="currentColor"/>
</svg>`;

const ICON_HOME_WORK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="tt__tag-icon">
  <path d="M11 6V2H2V14H7V8H14V14H11V6Z" stroke="currentColor" stroke-width="1" fill="none"/>
  <path d="M4 4H6V6H4V4Z" fill="currentColor"/>
  <path d="M4 8H6V10H4V8Z" fill="currentColor"/>
  <path d="M9 10H11V12H9V10Z" fill="currentColor"/>
  <path d="M8 4H10V6H8V4Z" fill="currentColor"/>
</svg>`;

// ── CSS ──
export const styles = `
  /* ── Container commun ── */
  .tt {
    background: #ffffff;
    border: 1px solid #dee2e9;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── Small ── */
  .tt--small {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
  }

  .tt--small .tt__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
    white-space: nowrap;
  }

  /* ── Large ── */
  .tt--large {
    width: 287px;
    display: flex;
    flex-direction: column;
  }

  /* Header */
  .tt__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    height: 56px;
    border-bottom: 1px solid #dee2e9;
  }

  .tt__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #1d2024;
    white-space: nowrap;
  }

  .tt__close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    outline: none;
    transition: opacity 0.15s;
  }

  .tt__close:hover {
    opacity: 0.6;
  }

  .tt__close-icon {
    width: 22px;
    height: 22px;
    display: block;
  }

  /* Content / liste */
  .tt__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px;
  }

  .tt__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .tt__row-label {
    flex: 1;
    min-width: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
  }

  /* Tag dans les lignes */
  .tt__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 6px;
    background: #e0e7ff;
    flex-shrink: 0;
  }

  .tt__tag-icon {
    width: 16px;
    height: 16px;
    color: #150792;
    display: block;
    flex-shrink: 0;
  }

  .tt__tag-text {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #150792;
    white-space: nowrap;
  }

  /* ── Trigger (démo) ── */
  .tt-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .tt-trigger__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 50%;
    outline: none;
    color: #7381a2;
    transition: color 0.15s;
  }

  .tt-trigger__btn:hover {
    color: #48546d;
  }

  .tt__trigger-icon {
    width: 16px;
    height: 16px;
    display: block;
  }

  /* Popup positionné */
  .tt-popup {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: none;
  }

  /* Small : hover */
  .tt-trigger:hover .tt-popup--hover {
    display: block;
  }

  /* Large : clic toggle via classe */
  .tt-popup--click.tt-popup--open {
    display: block;
  }

  /* ── Helpers démo ── */
  .tt-demo-row {
    display: flex;
    align-items: flex-start;
    gap: 32px;
  }

  .tt-demo-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .tt-demo-label {
    font-size: 12px;
    color: #86868b;
    margin-bottom: 4px;
    text-align: center;
  }
`;

// ── Fonctions de rendu ──

function tooltipSmall({ text = "Nom du libelle" } = {}) {
  return `<div class="tt tt--small">
    <span class="tt__text">${text}</span>
  </div>`;
}

function tooltipLarge({
  title = "Zones de couvertures",
  items = [
    { label: "Nom du libelle", tag: "Label du tag" },
    { label: "Nom du libelle", tag: "Label du tag" },
  ],
  showHeader = true,
  showTags = true,
} = {}) {
  const headerHtml = showHeader
    ? `<div class="tt__header">
        <span class="tt__title">${title}</span>
        <button class="tt__close" type="button" aria-label="Fermer">${ICON_CLOSE}</button>
      </div>`
    : "";

  const rowsHtml = items.map(item => {
    const tagHtml = showTags && item.tag
      ? `<span class="tt__tag">${ICON_HOME_WORK}<span class="tt__tag-text">${item.tag}</span></span>`
      : "";
    return `<div class="tt__row">
      <span class="tt__row-label">${item.label}</span>
      ${tagHtml}
    </div>`;
  }).join("");

  return `<div class="tt tt--large">
    ${headerHtml}
    <div class="tt__content">${rowsHtml}</div>
  </div>`;
}

// Trigger interactif small (hover)
function triggerSmall({ text = "Aide contextuelle" } = {}) {
  return `<div class="tt-trigger">
    <button class="tt-trigger__btn" type="button" aria-label="Info">${ICON_INFO}</button>
    <div class="tt-popup tt-popup--hover">
      ${tooltipSmall({ text })}
    </div>
  </div>`;
}

// Trigger interactif large (clic)
function triggerLarge(opts = {}) {
  return `<div class="tt-trigger">
    <button class="tt-trigger__btn tt-trigger__btn--click" type="button" aria-label="Voir la liste">${ICON_INFO}</button>
    <div class="tt-popup tt-popup--click">
      ${tooltipLarge(opts)}
    </div>
  </div>`;
}

// ── Script d'interactivité ──
export const script = `
  // Large tooltip : ouvrir/fermer au clic
  document.addEventListener("click", (e) => {
    // Fermer via la croix
    const closeBtn = e.target.closest(".tt__close");
    if (closeBtn) {
      const popup = closeBtn.closest(".tt-popup");
      if (popup) popup.classList.remove("tt-popup--open");
      return;
    }

    // Toggle via le bouton trigger
    const triggerBtn = e.target.closest(".tt-trigger__btn--click");
    if (triggerBtn) {
      const trigger = triggerBtn.closest(".tt-trigger");
      const popup = trigger?.querySelector(".tt-popup--click");
      if (popup) {
        // Fermer tous les autres
        document.querySelectorAll(".tt-popup--open").forEach(p => {
          if (p !== popup) p.classList.remove("tt-popup--open");
        });
        popup.classList.toggle("tt-popup--open");
      }
      return;
    }

    // Clic extérieur : fermer tout
    if (!e.target.closest(".tt-popup")) {
      document.querySelectorAll(".tt-popup--open").forEach(p => p.classList.remove("tt-popup--open"));
    }
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Small — hover",
    description: "Bulle simple au survol d'une icône « i ». Texte seul.",
    render: () => `<div class="tt-demo-row">
      <div>
        <div class="tt-demo-label">Survoler l'icône</div>
        ${triggerSmall({ text: "Nom du libelle" })}
      </div>
      <div>
        <div class="tt-demo-label">Texte long</div>
        ${triggerSmall({ text: "Intervention prévue le 15 avril 2026" })}
      </div>
    </div>`,
  },
  {
    label: "Large — clic",
    description: "Panneau avec header, liste et tags. Ouvert au clic, fermé par la croix.",
    render: () => `<div class="tt-demo-row">
      <div>
        <div class="tt-demo-label">Cliquer l'icône</div>
        ${triggerLarge()}
      </div>
      <div>
        <div class="tt-demo-label">Plus d'items</div>
        ${triggerLarge({
            title: "Intervenants",
            items: [
              { label: "HENRI, Bernard", tag: "Secteur A" },
              { label: "KEULEYAN, Luc", tag: "Secteur B" },
              { label: "POIRE, Pomme", tag: "Secteur A" },
            ],
          })}
      </div>
    </div>`,
  },
];
