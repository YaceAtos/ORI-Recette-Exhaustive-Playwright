// ══════════════════════════════════════════════════
// Breadcrumb
// ══════════════════════════════════════════════════

export const name = "Breadcrumb";
export const description = "Fil d'Ariane. De 2 à 5 niveaux, séparés par « / ». Le dernier niveau est actif (couleur foncée). Les niveaux intermédiaires sont cliquables.";

// ── Helpers ──
function renderBreadcrumb(items = []) {
  const parts = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const cls = isLast ? "bc__item bc__item--active" : "bc__item";
    const tag = isLast ? "span" : "a";
    const href = isLast ? "" : ` href="#" onclick="event.preventDefault()"`;
    return `<${tag} class="${cls}"${href}>${item}</${tag}>`;
  });

  return `<nav class="bc">${parts.join('<span class="bc__sep">/</span>')}</nav>`;
}

// ── CSS ──
export const styles = `
  .bc {
    display: flex;
    align-items: center;
    gap: 2px;
    font-family: 'Inter', sans-serif;
  }

  .bc__item {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0;
    color: #48546d;
    white-space: nowrap;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s;
  }

  .bc__item:hover {
    color: #1d2024;
    text-decoration: underline;
  }

  .bc__item--active {
    color: #1d2024;
    cursor: default;
  }

  .bc__item--active:hover {
    color: #1d2024;
  }

  .bc__sep {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #48546d;
    width: 13px;
    text-align: center;
    flex-shrink: 0;
    user-select: none;
  }
`;

// ── Script ──
export const script = null;

// ── Variants ──
export const variants = [
  {
    title: "2 niveaux",
    render: () => renderBreadcrumb(["Menu", "Collaborateurs"]),
  },
  {
    title: "3 niveaux",
    render: () => renderBreadcrumb(["Menu", "Collaborateurs", "Nahuel VAN-PEE"]),
  },
  {
    title: "5 niveaux",
    render: () => renderBreadcrumb(["Menu", "Collaborateurs", "Nahuel VAN-PEE", "Contrats", "CDI #1234"]),
  },
];
