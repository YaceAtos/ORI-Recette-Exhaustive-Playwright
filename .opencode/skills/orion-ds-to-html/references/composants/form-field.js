// ══════════════════════════════════════════════════
// Form Field (Outlined)
// ══════════════════════════════════════════════════
// Type: input | select | textarea
// States: default, hover, focus, disabled
// Options: filled, error, trailing icon, helper text

export const name = "Form Field";
export const description = "Champ de formulaire outlined. Types input, select, textarea. Label flottant, icône trailing libre, helper text optionnel.";

// ── Icônes (Material Symbols) ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_CALENDAR = mi('calendar_today', 16, 'ff__trailing-icon');
const ICON_CHEVRON = mi('keyboard_arrow_down', 16, 'ff__trailing-icon');
const ICON_CHECK = mi('check', 16, 'ff__dropdown-check');
const ICON_RESIZE = `<svg class="ff__resize-handle" width="12" height="12" viewBox="0 0 12 12" fill="none">
  <path d="M10 2L2 10" stroke="#48546d" stroke-width="1" stroke-linecap="round"/>
  <path d="M10 6L6 10" stroke="#48546d" stroke-width="1" stroke-linecap="round"/>
  <path d="M10 10L10 10" stroke="#48546d" stroke-width="1" stroke-linecap="round"/>
</svg>`;

// ── CSS ──
export const styles = `
  /* ══ Form Field base ══ */
  .ff {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: 'Inter', sans-serif;
  }

  .ff__wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 40px;
    background: #ffffff;
    border: 1px solid #7381a2;
    border-radius: 6px;
    transition: border-color 0.15s;
    cursor: text;
  }

  /* ── Label ── */
  .ff__label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
    pointer-events: none;
    transition: all 0.15s ease;
    background: transparent;
    padding: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 56px);
  }

  /* Label flottant (filled ou focus) */
  .ff--float .ff__label {
    top: 0;
    transform: translateY(-50%);
    font-size: 12px;
    line-height: 16px;
    padding: 0 4px;
    background: #ffffff;
    left: 12px;
    max-width: calc(100% - 32px);
  }

  /* ── Input ── */
  .ff__input {
    flex: 1;
    min-width: 0;
    height: 38px;
    padding: 0 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    color: #1d2024;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    border-radius: 6px;
  }

  .ff__input::placeholder {
    color: transparent;
  }

  .ff--float .ff__input::placeholder {
    color: #48546d;
  }

  /* Input avec trailing icon */
  .ff__input--with-trailing {
    padding-right: 0;
  }

  /* ── Select custom dropdown ── */
  .ff__select-trigger {
    flex: 1;
    min-width: 0;
    height: 38px;
    padding: 0 40px 0 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 38px;
    color: #1d2024;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    cursor: pointer;
    border-radius: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ff__select-trigger--placeholder {
    color: #48546d;
  }

  .ff__dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #ffffff;
    border-radius: 6px;
    box-shadow:
      0 2px 4px -2px rgba(0, 0, 0, 0.06),
      0 4px 8px -2px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: none;
    max-height: 240px;
    overflow-y: auto;
  }

  .ff--select-open .ff__dropdown {
    display: block;
  }

  .ff__dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    cursor: pointer;
    transition: background-color 0.1s;
  }

  .ff__dropdown-item:hover {
    background: rgba(29, 32, 36, 0.06);
  }

  .ff__dropdown-item--selected {
    font-weight: 500;
    background: rgba(29, 32, 36, 0.04);
  }

  .ff__dropdown-check {
    width: 16px;
    height: 16px;
    color: #013aba;
    flex-shrink: 0;
  }

  .ff__dropdown-item:not(.ff__dropdown-item--selected) .ff__dropdown-check {
    display: none;
  }

  /* ── Textarea ── */
  .ff--textarea .ff__wrapper {
    align-items: flex-start;
    min-height: 69px;
  }

  .ff--textarea .ff__label {
    top: 10px;
    transform: none;
  }

  .ff--textarea.ff--float .ff__label {
    top: 0;
    transform: translateY(-50%);
  }

  .ff__textarea {
    flex: 1;
    min-width: 0;
    min-height: 49px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    resize: vertical;
    border-radius: 6px;
  }

  .ff__textarea::placeholder {
    color: transparent;
  }

  .ff--float .ff__textarea::placeholder {
    color: #48546d;
  }

  .ff__resize-handle {
    position: absolute;
    right: 4px;
    bottom: 4px;
    pointer-events: none;
    color: #48546d;
  }

  /* ── Trailing icon ── */
  .ff__trailing {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 38px;
    color: #48546d;
    pointer-events: none;
  }

  .ff__trailing-icon {
    width: 16px;
    height: 16px;
  }

  /* Select chevron positionné */
  .ff--select .ff__trailing {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
  }

  /* ══ States ══ */

  /* ── Hover ── */
  .ff__wrapper:hover {
    border-color: #1d2024;
  }

  /* ── Focus ── */
  .ff--focus .ff__wrapper {
    border-width: 2px;
    border-color: #013aba;
  }

  .ff--focus .ff__label {
    color: #013aba;
  }

  .ff--focus .ff__trailing {
    color: #013aba;
  }

  .ff--focus .ff__input,
  .ff--focus .ff__select-trigger,
  .ff--focus .ff__textarea {
    /* Compenser le border 2px */
    height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .ff--focus.ff--textarea .ff__textarea {
    height: auto;
    min-height: 47px;
    padding: 7px 15px;
  }

  .ff--focus .ff__input {
    padding-left: 15px;
    padding-right: 15px;
  }

  .ff--focus .ff__select-trigger {
    padding-left: 15px;
  }

  /* ── Disabled ── */
  .ff--disabled .ff__wrapper {
    border-color: rgba(115, 129, 162, 0.38);
    cursor: default;
  }

  .ff--disabled .ff__wrapper:hover {
    border-color: rgba(115, 129, 162, 0.38);
  }

  .ff--disabled .ff__label {
    color: rgba(29, 32, 36, 0.38);
  }

  .ff--disabled .ff__input,
  .ff--disabled .ff__select-trigger,
  .ff--disabled .ff__textarea {
    color: rgba(29, 32, 36, 0.38);
    cursor: default;
  }

  .ff--disabled .ff__trailing {
    color: rgba(72, 84, 109, 0.38);
  }

  /* ── Error ── */
  .ff--error .ff__wrapper {
    border-color: #b2271e;
  }

  .ff--error .ff__wrapper:hover {
    border-color: #b2271e;
  }

  .ff--error .ff__label {
    color: #b2271e;
  }

  .ff--error .ff__trailing {
    color: #b2271e;
  }

  .ff--error.ff--focus .ff__wrapper {
    border-color: #b2271e;
  }

  .ff--error.ff--focus .ff__label {
    color: #b2271e;
  }

  .ff--error.ff--focus .ff__trailing {
    color: #b2271e;
  }

  /* ── Helper text ── */
  .ff__helper {
    margin-top: 4px;
    padding: 0 16px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #48546d;
  }

  .ff--error .ff__helper {
    color: #b2271e;
  }

  /* ══ Demo helpers ══ */
  .ff-demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px 20px;
    max-width: 800px;
  }

  .ff-demo-label {
    font-size: 11px;
    font-weight: 500;
    color: #8e96a3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .ff .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Script interactif ──
export const script = `
  document.addEventListener("focusin", (e) => {
    const input = e.target.closest(".ff__input, .ff__textarea");
    if (!input) return;
    const ff = input.closest(".ff");
    if (ff && !ff.classList.contains("ff--disabled")) {
      ff.classList.add("ff--focus", "ff--float");
    }
  });

  document.addEventListener("focusout", (e) => {
    const input = e.target.closest(".ff__input, .ff__textarea");
    if (!input) return;
    const ff = input.closest(".ff");
    if (!ff) return;
    ff.classList.remove("ff--focus");
    const hasValue = input.value && input.value.trim() !== "";
    if (!hasValue) {
      ff.classList.remove("ff--float");
    }
  });

  /* ── Custom select dropdown ── */
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".ff__select-trigger");
    if (trigger) {
      const ff = trigger.closest(".ff");
      if (ff && !ff.classList.contains("ff--disabled")) {
        // Toggle open
        const isOpen = ff.classList.contains("ff--select-open");
        // Close all other open selects first
        document.querySelectorAll(".ff--select-open").forEach(el => {
          el.classList.remove("ff--select-open", "ff--focus");
          if (!el.querySelector(".ff__select-trigger").textContent.trim()) {
            el.classList.remove("ff--float");
          }
        });
        if (!isOpen) {
          ff.classList.add("ff--select-open", "ff--focus", "ff--float");
        }
      }
      return;
    }

    const item = e.target.closest(".ff__dropdown-item");
    if (item) {
      const ff = item.closest(".ff");
      const triggerEl = ff.querySelector(".ff__select-trigger");
      const dropdown = ff.querySelector(".ff__dropdown");

      // Update selection
      dropdown.querySelectorAll(".ff__dropdown-item").forEach(i => i.classList.remove("ff__dropdown-item--selected"));
      item.classList.add("ff__dropdown-item--selected");

      // Update trigger text
      triggerEl.textContent = item.dataset.label;
      triggerEl.classList.remove("ff__select-trigger--placeholder");

      // Close & keep float
      ff.classList.remove("ff--select-open", "ff--focus");
      ff.classList.add("ff--float");
      return;
    }

    // Click outside — close all
    document.querySelectorAll(".ff--select-open").forEach(ff => {
      ff.classList.remove("ff--select-open", "ff--focus");
      if (!ff.querySelector(".ff__select-trigger").textContent.trim()) {
        ff.classList.remove("ff--float");
      }
    });
  });
`;

// ── Fonction de rendu ──
function field({
  type = "input",
  label = "Default label",
  value = "",
  placeholder = "Input",
  trailingIcon = null,
  disabled = false,
  error = false,
  helperText = "",
  id = "",
} = {}) {
  const filled = value !== "";
  const cls = [
    "ff",
    type === "textarea" ? "ff--textarea" : "",
    type === "select" ? "ff--select" : "",
    filled ? "ff--float" : "",
    disabled ? "ff--disabled" : "",
    error ? "ff--error" : "",
  ].filter(Boolean).join(" ");

  const fieldId = id || `ff-${Math.random().toString(36).slice(2, 8)}`;
  const disabledAttr = disabled ? "disabled" : "";

  let trailing = "";
  if (type === "select") {
    trailing = `<div class="ff__trailing">${ICON_CHEVRON}</div>`;
  } else if (trailingIcon) {
    trailing = `<div class="ff__trailing">${trailingIcon}</div>`;
  }

  let inputHtml = "";
  if (type === "textarea") {
    inputHtml = `<textarea class="ff__textarea" id="${fieldId}" placeholder="${placeholder}" ${disabledAttr}>${value}</textarea>`;
  } else if (type === "select") {
    const options = [
      { value: "1", text: "Input" },
      { value: "2", text: "Option 2" },
      { value: "3", text: "Option 3" },
    ];
    const selectedOpt = options.find(o => o.text === value);
    const displayText = selectedOpt ? selectedOpt.text : "";
    const triggerCls = filled ? "" : " ff__select-trigger--placeholder";
    const itemsHtml = options.map(o => {
      const sel = selectedOpt && o.value === selectedOpt.value ? " ff__dropdown-item--selected" : "";
      return `<div class="ff__dropdown-item${sel}" data-value="${o.value}" data-label="${o.text}"><span>${o.text}</span>${ICON_CHECK}</div>`;
    }).join("");
    inputHtml = `
      <div class="ff__select-trigger${triggerCls}" id="${fieldId}" tabindex="${disabled ? -1 : 0}">${displayText}</div>
      <div class="ff__dropdown">${itemsHtml}</div>
    `;
  } else {
    const trailingCls = trailing ? " ff__input--with-trailing" : "";
    inputHtml = `<input class="ff__input${trailingCls}" type="text" id="${fieldId}" value="${value}" placeholder="${placeholder}" ${disabledAttr} />`;
  }

  const helperHtml = helperText ? `<span class="ff__helper">${helperText}</span>` : "";

  return `
    <div class="${cls}">
      <div class="ff__wrapper">
        <label class="ff__label" for="${fieldId}">${label}</label>
        ${inputHtml}
        ${trailing}
      </div>
      ${helperHtml}
    </div>
  `;
}

// ── Variants pour la vitrine ──
export const variants = [
  {
    label: "Input",
    description: "Champ texte avec icône trailing libre. États : default, filled, disabled, error.",
    render: () => `<div class="ff-demo-grid">
      <div>
        <div class="ff-demo-label">Default</div>
        ${field({ trailingIcon: ICON_CALENDAR })}
      </div>
      <div>
        <div class="ff-demo-label">Filled</div>
        ${field({ value: "Input", trailingIcon: ICON_CALENDAR })}
      </div>
      <div>
        <div class="ff-demo-label">Disabled</div>
        ${field({ disabled: true, trailingIcon: ICON_CALENDAR })}
      </div>
      <div>
        <div class="ff-demo-label">Disabled filled</div>
        ${field({ value: "Input", disabled: true, trailingIcon: ICON_CALENDAR })}
      </div>
      <div>
        <div class="ff-demo-label">Error</div>
        ${field({ error: true, trailingIcon: ICON_CALENDAR, helperText: "Message d'erreur" })}
      </div>
      <div>
        <div class="ff-demo-label">Error filled</div>
        ${field({ value: "Input", error: true, trailingIcon: ICON_CALENDAR, helperText: "Message d'erreur" })}
      </div>
    </div>`,
  },
  {
    label: "Select",
    description: "Champ de sélection avec chevron. Mêmes états.",
    render: () => `<div class="ff-demo-grid">
      <div>
        <div class="ff-demo-label">Default</div>
        ${field({ type: "select" })}
      </div>
      <div>
        <div class="ff-demo-label">Filled</div>
        ${field({ type: "select", value: "Input" })}
      </div>
      <div>
        <div class="ff-demo-label">Disabled</div>
        ${field({ type: "select", disabled: true })}
      </div>
      <div>
        <div class="ff-demo-label">Error</div>
        ${field({ type: "select", error: true, helperText: "Sélection requise" })}
      </div>
    </div>`,
  },
  {
    label: "Textarea",
    description: "Zone de texte multiligne, resize vertical.",
    render: () => `<div class="ff-demo-grid">
      <div>
        <div class="ff-demo-label">Default</div>
        ${field({ type: "textarea" })}
      </div>
      <div>
        <div class="ff-demo-label">Filled</div>
        ${field({ type: "textarea", value: "Input" })}
      </div>
      <div>
        <div class="ff-demo-label">Disabled</div>
        ${field({ type: "textarea", disabled: true })}
      </div>
    </div>`,
  },
];
