// ══════════════════════════════════════════════════
// Sidebar Item
// ══════════════════════════════════════════════════

export const name = "Sidebar Item";
export const description = "Élément de navigation latérale. Deux niveaux hiérarchiques, états sélectionné/hover/focus/disabled, mode icon-only, icône leading/trailing, tag de statut et description optionnelle.";

// ── Icônes ──
const ICON_WORK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M13.33 4.67H10.67V3.33C10.67 2.6 10.07 2 9.33 2H6.67C5.93 2 5.33 2.6 5.33 3.33V4.67H2.67C1.93 4.67 1.34 5.27 1.34 6V12.67C1.34 13.4 1.93 14 2.67 14H13.33C14.07 14 14.67 13.4 14.67 12.67V6C14.67 5.27 14.07 4.67 13.33 4.67ZM6.67 3.33H9.33V4.67H6.67V3.33ZM13.33 12.67H2.67V6H13.33V12.67Z" fill="currentColor"/>
</svg>`;

const ICON_CHECK = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M8 1.33C4.32 1.33 1.33 4.32 1.33 8C1.33 11.68 4.32 14.67 8 14.67C11.68 14.67 14.67 11.68 14.67 8C14.67 4.32 11.68 1.33 8 1.33ZM6.67 11.33L3.33 8L4.27 7.06L6.67 9.45L11.73 4.39L12.67 5.33L6.67 11.33Z" fill="currentColor"/>
</svg>`;

const ICON_CHEVRON_DOWN = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M4.94 5.53L8 8.58L11.06 5.53L12 6.47L8 10.47L4 6.47L4.94 5.53Z" fill="currentColor"/>
</svg>`;

// ── Helpers ──
function renderItem({
  label = "Condition de travail",
  description = "",
  level = 1,
  selected = false,
  iconOnly = false,
  showLeadingIcon = true,
  showTrailingIcon = false,
  showTag = false,
  showDescription = false,
  state = "default",
} = {}) {
  const isDisabled = state === "disabled";

  // --- Container classes ---
  const containerCls = ["si"];
  if (level === 2) containerCls.push("si--level-2");
  if (selected) containerCls.push("si--selected");
  if (iconOnly) containerCls.push("si--icon-only");
  if (state === "hover") containerCls.push("si--hover");
  if (state === "focus") containerCls.push("si--focus");
  if (isDisabled) containerCls.push("si--disabled");

  // --- Leading icon ---
  const leadingIconHtml = showLeadingIcon
    ? `<span class="si__icon si__icon--leading">${ICON_WORK}</span>`
    : "";

  // --- Trailing icon ---
  const trailingIconHtml = showTrailingIcon
    ? `<span class="si__icon si__icon--trailing">${ICON_CHEVRON_DOWN}</span>`
    : "";

  // --- Tag ---
  const tagHtml = showTag && !iconOnly && !selected
    ? `<span class="si__tag"><span class="si__tag-icon">${ICON_CHECK}</span></span>`
    : "";

  // --- Description ---
  const descHtml = showDescription && !iconOnly && description
    ? `<p class="si__description">${description}</p>`
    : "";

  // --- Icon only ---
  if (iconOnly) {
    return `<div class="${containerCls.join(" ")}">
      <div class="si__item">
        <span class="si__icon si__icon--leading">${ICON_WORK}</span>
      </div>
    </div>`;
  }

  // --- Full item ---
  return `<div class="${containerCls.join(" ")}">
    <div class="si__item">
      <div class="si__content">
        <div class="si__label-row">
          <div class="si__label-left">
            ${leadingIconHtml}
            <span class="si__label">${label}</span>
          </div>
          ${trailingIconHtml}
          ${tagHtml}
        </div>
        ${descHtml}
      </div>
    </div>
  </div>`;
}

// ── CSS ──
export const styles = `
  /* ── Container ── */
  .si {
    display: flex;
    align-items: stretch;
    border-radius: 6px;
    width: 229px;
    font-family: 'Inter', sans-serif;
    position: relative;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s;
  }

  /* ── Item inner ── */
  .si__item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    border-radius: 6px;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  /* ── Content wrapper ── */
  .si__content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  /* ── Label row ── */
  .si__label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    width: 100%;
  }

  .si__label-left {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  /* ── Label ── */
  .si__label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #1d2024;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Icons ── */
  .si__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #1d2024;
  }

  .si__icon--trailing {
    color: #48546d;
  }

  /* ── Tag (petit badge vert avec check) ── */
  .si__tag {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 6px;
    background: #e8fdef;
    flex-shrink: 0;
    height: 24px;
  }

  .si__tag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #16a34a;
  }

  /* ── Description ── */
  .si__description {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #48546d;
    margin: 0;
  }

  /* ═══════════ STATES ═══════════ */

  /* ── Default (level 1, non sélectionné) ── */
  .si {
    background: #ffffff;
  }

  /* ── Selected level 1 ── */
  .si--selected {
    background: #ccdcff;
  }

  .si--selected .si__label {
    font-weight: 700;
  }

  /* ── Selected level 2 ── */
  .si--selected.si--level-2 {
    background: #eaf0ff;
  }

  .si--selected.si--level-2 .si__label {
    font-weight: 500;
  }

  /* ── Hover ── */
  .si--hover::after,
  .si:not(.si--disabled):hover::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: #1d2024;
    opacity: 0.08;
    pointer-events: none;
  }

  /* ── Focus ── */
  .si--focus::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: #1d2024;
    opacity: 0.1;
    pointer-events: none;
  }

  /* ── Disabled ── */
  .si--disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }

  .si--disabled .si__tag {
    background: #fafafa;
    border: 1px solid #e7e8e9;
  }

  .si--disabled .si__tag-icon {
    color: #9ca3af;
  }

  /* ═══════════ ICON ONLY ═══════════ */
  .si--icon-only {
    width: 40px;
    height: 40px;
  }

  .si--icon-only .si__item {
    padding: 12px;
    justify-content: center;
  }
`;

// ── Script ──
export const script = null;

// ── Variants ──
const DESC_TEXT = "Renseignez les allergies, phobies ou contre-indications médicales.";

export const variants = [
  /* ── Level 1 — Non sélectionné ── */
  {
    title: "Level 1 — Default",
    render: () => `
      <div style="display:flex; flex-direction:column; gap:4px; background:#f5f5f5; padding:16px; border-radius:8px; width:280px;">
        ${renderItem({ showLeadingIcon: true, showTag: true })}
        ${renderItem({ showLeadingIcon: true, showTag: true, state: "hover" })}
        ${renderItem({ showLeadingIcon: true, showTag: true, state: "focus" })}
        ${renderItem({ showLeadingIcon: true, showTag: true, state: "disabled" })}
      </div>
    `,
  },
  {
    title: "Level 1 — Sélectionné",
    render: () => `
      <div style="display:flex; flex-direction:column; gap:4px; background:#f5f5f5; padding:16px; border-radius:8px; width:280px;">
        ${renderItem({ selected: true, showLeadingIcon: true, showDescription: true, description: DESC_TEXT })}
        ${renderItem({ selected: true, showLeadingIcon: true, showDescription: true, description: DESC_TEXT, state: "hover" })}
        ${renderItem({ selected: true, showLeadingIcon: true, showDescription: true, description: DESC_TEXT, state: "focus" })}
      </div>
    `,
  },
  /* ── Level 2 — Sélectionné ── */
  {
    title: "Level 2 — Sélectionné",
    render: () => `
      <div style="display:flex; flex-direction:column; gap:4px; background:#f5f5f5; padding:16px; border-radius:8px; width:280px;">
        ${renderItem({ level: 2, selected: true, showLeadingIcon: true, showDescription: true, description: DESC_TEXT })}
        ${renderItem({ level: 2, selected: true, showLeadingIcon: true, showDescription: true, description: DESC_TEXT, state: "hover" })}
        ${renderItem({ level: 2, selected: true, showLeadingIcon: true, showDescription: true, description: DESC_TEXT, state: "focus" })}
      </div>
    `,
  },
  /* ── Icon only ── */
  {
    title: "Icon only",
    render: () => `
      <div style="display:flex; gap:8px; background:#f5f5f5; padding:16px; border-radius:8px;">
        ${renderItem({ iconOnly: true })}
        ${renderItem({ iconOnly: true, selected: true })}
        ${renderItem({ iconOnly: true, state: "hover" })}
        ${renderItem({ iconOnly: true, state: "disabled" })}
      </div>
    `,
  },
  /* ── Avec trailing icon ── */
  {
    title: "Avec icône trailing (chevron)",
    render: () => `
      <div style="display:flex; flex-direction:column; gap:4px; background:#f5f5f5; padding:16px; border-radius:8px; width:280px;">
        ${renderItem({ showLeadingIcon: true, showTrailingIcon: true })}
        ${renderItem({ selected: true, showLeadingIcon: true, showTrailingIcon: true, showDescription: true, description: DESC_TEXT })}
      </div>
    `,
  },
  /* ── Sans leading icon ── */
  {
    title: "Sans icône leading",
    render: () => `
      <div style="display:flex; flex-direction:column; gap:4px; background:#f5f5f5; padding:16px; border-radius:8px; width:280px;">
        ${renderItem({ showLeadingIcon: false, showTag: true })}
        ${renderItem({ selected: true, showLeadingIcon: false, showDescription: true, description: DESC_TEXT })}
      </div>
    `,
  },
];
