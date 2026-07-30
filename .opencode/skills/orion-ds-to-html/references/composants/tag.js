// ══════════════════════════════════════════════════
// Tag
// ══════════════════════════════════════════════════

export const name = "Tag";
export const description = "Badge de statut ou catégorie. 6 couleurs (Info, Success, Warning, Error, Neutral, Brand), 2 tailles (sm, lg), icône optionnelle à gauche.";

// ── Icône info (adaptée par couleur via currentColor) ──
const ICON_20 = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="tag__icon tag__icon--lg">
  <path d="M10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 5.4 14.6 1.67 10 1.67ZM10.83 14.17H9.17V9.17H10.83V14.17ZM10.83 7.5H9.17V5.83H10.83V7.5Z" fill="currentColor"/>
</svg>`;

const ICON_16 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="tag__icon tag__icon--sm">
  <path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM8.67 11.33H7.33V7.33H8.67V11.33ZM8.67 6H7.33V4.67H8.67V6Z" fill="currentColor"/>
</svg>`;

// ── Tokens par type ──
const TYPES = {
  info:    { bg: "#e0e7ff", color: "#150792" },
  success: { bg: "#e8fdef", color: "#017437" },
  warning: { bg: "#fff4e5", color: "#8f2800" },
  error:   { bg: "#ffe5e5", color: "#9f0712" },
  neutral: { bg: "#e6e8eb", color: "#1d2024" },
  brand:   { bg: "#eaf0ff", color: "#013aba" },
};

// ── CSS ──
export const styles = `
  /* ── Base ── */
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0;
    white-space: nowrap;
  }

  /* ── Tailles ── */
  .tag--sm {
    height: 24px;
    padding: 4px 6px;
  }

  .tag--lg {
    height: 32px;
    padding: 6px;
  }

  /* ── Couleurs ── */
  .tag--info    { background: #e0e7ff; color: #150792; }
  .tag--success { background: #e8fdef; color: #017437; }
  .tag--warning { background: #fff4e5; color: #8f2800; }
  .tag--error   { background: #ffe5e5; color: #9f0712; }
  .tag--neutral { background: #e6e8eb; color: #1d2024; }
  .tag--brand   { background: #eaf0ff; color: #013aba; }

  /* ── Icône ── */
  .tag__icon {
    flex-shrink: 0;
    display: block;
    color: inherit;
  }

  .tag__icon--lg {
    width: 20px;
    height: 20px;
  }

  .tag__icon--sm {
    width: 16px;
    height: 16px;
  }

  /* ── Helpers démo ── */
  .tag-demo-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .tag-demo-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

// ── Fonction de rendu ──
function tag({
  label = "Label",
  type = "info",
  size = "lg",
  showIcon = true,
} = {}) {
  const iconHtml = showIcon
    ? (size === "lg" ? ICON_20 : ICON_16)
    : "";

  return `<span class="tag tag--${type} tag--${size}">
    ${iconHtml}<span>${label}</span>
  </span>`;
}

// ── Variants ──
const ALL_TYPES = ["info", "success", "warning", "error", "neutral", "brand"];
const TYPE_LABELS = { info: "Info", success: "Success", warning: "Warning", error: "Error", neutral: "Neutral", brand: "Brand" };

export const variants = [
  {
    label: "Large — avec icône",
    description: "Taille lg (32px), toutes les couleurs, avec icône.",
    render: () => `<div class="tag-demo-row">
      ${ALL_TYPES.map(t => tag({ type: t, label: TYPE_LABELS[t] })).join("")}
    </div>`,
  },
  {
    label: "Small — avec icône",
    description: "Taille sm (24px), toutes les couleurs, avec icône.",
    render: () => `<div class="tag-demo-row">
      ${ALL_TYPES.map(t => tag({ type: t, size: "sm", label: TYPE_LABELS[t] })).join("")}
    </div>`,
  },
  {
    label: "Sans icône",
    description: "Tags sans icône, texte seul.",
    render: () => `<div class="tag-demo-row">
      ${ALL_TYPES.map(t => tag({ type: t, size: "sm", label: TYPE_LABELS[t], showIcon: false })).join("")}
    </div>`,
  },
];
