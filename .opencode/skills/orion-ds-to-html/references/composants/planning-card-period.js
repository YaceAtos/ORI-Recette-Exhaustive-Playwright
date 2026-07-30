// ══════════════════════════════════════════════════
// Planning Card Period
// ══════════════════════════════════════════════════
// Type: Astreinte | Absence
// Format: Vertical (sideline gauche), Horizontal (sideline gauche), Small (ligne)
// États: Default, Hover, Focus

export const name = "Planning Card Period";
export const description = "Carte période du planning. Types Astreinte (orange) et Absence (violet). 3 formats : Vertical, Horizontal, Small.";

// ── CSS ──
export const styles = `
  /* ══ Planning Card Period — base ══ */
  .pcp {
    position: relative;
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    cursor: default;
    font-family: 'Inter', sans-serif;
    outline: none;
    border: 2px solid transparent;
    transition: border-color 0.15s;
  }

  .pcp:hover,
  .pcp:focus {
    border-color: var(--pcp-color);
  }

  /* ── Sideline ── */
  .pcp__sideline {
    flex-shrink: 0;
    width: 4px;
    background: var(--pcp-color);
    border-radius: 2px 0 0 2px;
  }

  /* ── Body ── */
  .pcp__body {
    flex: 1;
    position: relative;
    min-width: 0;
    background: var(--pcp-hatched);
    background-size: 17px 17px;
    border-radius: 0 2px 2px 0;
  }

  /* ── Label ── */
  .pcp__label {
    position: relative;
    padding: 4px 6px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0;
    color: var(--pcp-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pcp__label-text {
    background: rgba(255, 255, 255, 0.85);
    padding: 0 2px;
    border-radius: 2px;
  }

  .pcp__time {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: inherit;
  }

  /* ══ Format: Vertical (sideline gauche) ══ */
  .pcp--vertical {
    flex-direction: row;
    width: 315px;
    min-height: 209px;
  }

  .pcp--vertical .pcp__sideline {
    width: 4px;
    height: auto;
    border-radius: 2px 0 0 2px;
  }

  .pcp--vertical .pcp__body {
    border-radius: 0 2px 2px 0;
  }

  /* ══ Format: Horizontal (sideline en haut) ══ */
  .pcp--horizontal {
    flex-direction: column;
    width: 315px;
    min-height: 209px;
  }

  .pcp--horizontal .pcp__sideline {
    width: 100%;
    height: 4px;
    border-radius: 2px 2px 0 0;
  }

  .pcp--horizontal .pcp__body {
    border-radius: 0 0 2px 2px;
  }

  /* ══ Format: Small (ligne fine) ══ */
  .pcp--small {
    width: 315px;
    border: none;
    border-radius: 0;
  }

  .pcp--small .pcp__sideline {
    display: none;
  }

  .pcp--small .pcp__body {
    border-top: 2px solid var(--pcp-color);
    border-radius: 0;
  }

  .pcp--small .pcp__label {
    padding: 2px 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pcp--small:hover .pcp__body,
  .pcp--small:focus .pcp__body {
    outline: 2px solid var(--pcp-color);
    outline-offset: -2px;
  }

  /* ══ Type: Astreinte ══ */
  .pcp--astreinte {
    --pcp-color: #8f2800;
    --pcp-hatched: repeating-linear-gradient(
      -45deg,
      #ffffff,
      #ffffff 6px,
      #fff4e5 6px,
      #fff4e5 12px
    );
  }

  /* ══ Type: Absence ══ */
  .pcp--absence {
    --pcp-color: #150792;
    --pcp-hatched: repeating-linear-gradient(
      -45deg,
      #ffffff,
      #ffffff 6px,
      #e0e7ff 6px,
      #e0e7ff 12px
    );
  }

  /* ══ Demo helpers ══ */
  .pcp-demo-row {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

// ── Fonction de rendu ──
function periodCard({
  type = "astreinte",
  format = "vertical",
  label = null,
  time = "",
} = {}) {
  const defaultLabel = type === "astreinte" ? "Astreinte" : "Absence";
  const displayLabel = label || defaultLabel;
  const cls = `pcp pcp--${format} pcp--${type}`;

  const timeHtml = time ? ` <span class="pcp__time">${time}</span>` : "";

  if (format === "small") {
    return `
      <div class="${cls}" tabindex="0">
        <div class="pcp__body">
          <div class="pcp__label"><span class="pcp__label-text">${displayLabel}${timeHtml}</span></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="${cls}" tabindex="0">
      <div class="pcp__sideline"></div>
      <div class="pcp__body">
        <div class="pcp__label"><span class="pcp__label-text">${displayLabel}${timeHtml}</span></div>
      </div>
    </div>
  `;
}

// ── Variants ──
export const variants = [
  {
    label: "Astreinte",
    description: "Vertical, Horizontal, Small. Survolez ou cliquez pour hover/focus.",
    render: () => `<div class="pcp-demo-row">
      ${periodCard({ type: "astreinte", format: "vertical" })}
      ${periodCard({ type: "astreinte", format: "horizontal" })}
      ${periodCard({ type: "astreinte", format: "small", time: "8:00 - 10:00" })}
    </div>`,
  },
  {
    label: "Absence",
    description: "Vertical, Horizontal, Small. Survolez ou cliquez pour hover/focus.",
    render: () => `<div class="pcp-demo-row">
      ${periodCard({ type: "absence", format: "vertical" })}
      ${periodCard({ type: "absence", format: "horizontal" })}
      ${periodCard({ type: "absence", format: "small" })}
    </div>`,
  },
];
