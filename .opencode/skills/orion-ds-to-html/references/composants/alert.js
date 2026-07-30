// ══════════════════════════════════════════════════
// Alert
// ══════════════════════════════════════════════════

export const name = "Alert";
export const description = "Bannière d'alerte contextuelle. 4 types : Info (bleu), Warning (orange), Error (rouge), Success (vert). Avec icône, texte, liens d'action et bouton de fermeture optionnels.";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 20, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_INFO = mi('info', 20, 'alert__icon');
const ICON_WARNING = mi('warning', 20, 'alert__icon');
const ICON_ERROR = mi('error', 20, 'alert__icon');
const ICON_SUCCESS = mi('check_circle', 20, 'alert__icon');
const ICON_CLOSE = mi('close', 16, 'alert__close-icon');

// ── Tokens par type ──
const TYPES = {
  info:    { bg: "#e0e7ff", color: "#150792", linkColor: "#3e2bc5", icon: ICON_INFO },
  warning: { bg: "#fff4e5", color: "#8f2800", linkColor: "#8f2800", icon: ICON_WARNING },
  error:   { bg: "#ffe5e5", color: "#9f0712", linkColor: "#9f0712", icon: ICON_ERROR },
  success: { bg: "#e8fdef", color: "#017437", linkColor: "#015b2b", icon: ICON_SUCCESS },
};

// ── CSS ──
export const styles = `
  /* ── Base ── */
  .alert {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 6px 12px;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    position: relative;
  }

  /* ── Types ── */
  .alert--info    { background: #e0e7ff; }
  .alert--warning { background: #fff4e5; }
  .alert--error   { background: #ffe5e5; }
  .alert--success { background: #e8fdef; }

  /* ── Texte + icône gauche ── */
  .alert__body {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .alert__icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: block;
  }

  .alert--info    .alert__icon { color: #150792; }
  .alert--warning .alert__icon { color: #8f2800; }
  .alert--error   .alert__icon { color: #9f0712; }
  .alert--success .alert__icon { color: #017437; }

  .alert__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    white-space: nowrap;
  }

  .alert--info    .alert__text { color: #150792; }
  .alert--warning .alert__text { color: #8f2800; }
  .alert--error   .alert__text { color: #9f0712; }
  .alert--success .alert__text { color: #017437; }

  /* ── Actions (liens) ── */
  .alert__actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .alert__link {
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-decoration: underline;
    white-space: nowrap;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    outline: none;
  }

  .alert--info    .alert__link { color: #3e2bc5; }
  .alert--warning .alert__link { color: #8f2800; }
  .alert--error   .alert__link { color: #9f0712; }
  .alert--success .alert__link { color: #015b2b; }

  .alert__link:hover {
    opacity: 0.8;
  }

  /* ── Bouton fermer (croix) ── */
  .alert__close {
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

  .alert__close:hover {
    opacity: 0.7;
  }

  .alert__close-icon {
    width: 16px;
    height: 16px;
    display: block;
  }

  .alert--info    .alert__close-icon { color: #150792; }
  .alert--warning .alert__close-icon { color: #8f2800; }
  .alert--error   .alert__close-icon { color: #9f0712; }
  .alert--success .alert__close-icon { color: #017437; }

  /* ── Helpers démo ── */
  .alert-demo-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .alert .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Fonction de rendu ──
function alert({
  type = "info",
  text = "Informations supplémentaires requises pour contrat.",
  actions = null,
  closable = false,
} = {}) {
  const t = TYPES[type] || TYPES.info;

  const actionsHtml = actions
    ? `<div class="alert__actions">${actions.map(a => `<a class="alert__link" href="#">${a}</a>`).join("")}</div>`
    : "";

  const closeHtml = closable
    ? `<button class="alert__close" type="button" aria-label="Fermer">${ICON_CLOSE}</button>`
    : "";

  return `<div class="alert alert--${type}">
    <div class="alert__body">
      ${t.icon}
      <span class="alert__text">${text}</span>
    </div>
    ${actionsHtml}
    ${closeHtml}
  </div>`;
}

// ── Script d'interactivité ──
export const script = `
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".alert__close");
    if (closeBtn) {
      const alertEl = closeBtn.closest(".alert");
      if (alertEl) {
        alertEl.style.transition = "opacity 0.15s, transform 0.15s";
        alertEl.style.opacity = "0";
        alertEl.style.transform = "translateY(-4px)";
        setTimeout(() => alertEl.remove(), 150);
      }
    }
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "4 types",
    description: "Info, Warning, Error, Success. Chaque type a sa couleur et son icône.",
    render: () => `<div class="alert-demo-col">
      ${alert({ type: "info" })}
      ${alert({ type: "warning" })}
      ${alert({ type: "error" })}
      ${alert({ type: "success" })}
    </div>`,
  },
  {
    label: "Avec actions",
    description: "Liens d'action à droite de l'alerte.",
    render: () => `<div class="alert-demo-col">
      ${alert({ type: "info", actions: ["Consulter la fiche", "Associer un contrat"] })}
      ${alert({ type: "warning", actions: ["Consulter la fiche", "Associer un contrat"] })}
      ${alert({ type: "error", actions: ["Consulter la fiche"] })}
      ${alert({ type: "success", actions: ["Voir le détail"] })}
    </div>`,
  },
  {
    label: "Avec fermeture",
    description: "Croix à droite pour fermer l'alerte. Cliquer pour supprimer.",
    render: () => `<div class="alert-demo-col">
      ${alert({ type: "info", closable: true })}
      ${alert({ type: "warning", closable: true })}
      ${alert({ type: "error", closable: true })}
      ${alert({ type: "success", closable: true })}
    </div>`,
  },
  {
    label: "Complet",
    description: "Actions + bouton de fermeture combinés.",
    render: () => `<div class="alert-demo-col">
      ${alert({ type: "warning", text: "Contrat expiré depuis le 15/04/2026.", actions: ["Renouveler", "Voir le contrat"], closable: true })}
      ${alert({ type: "error", text: "Intervention non couverte par l'APA.", actions: ["Vérifier l'éligibilité"], closable: true })}
    </div>`,
  },
];
