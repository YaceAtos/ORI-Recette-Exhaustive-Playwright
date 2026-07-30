// ══════════════════════════════════════════════════
// Modal
// ══════════════════════════════════════════════════
// Sizes: sm (alert), md (standard), lg (multi-step)
// Parts: backdrop, header, content, footer, sidebar (lg)

export const name = "Modal";
export const description = "Modale à 3 tailles : sm (alerte/suppression), md (formulaire), lg (multi-étapes avec sidebar et navigation).";

// ── Icônes ──
const mi = (name, size = 16, cls = '') => `<span class="material-symbols-outlined${cls ? ' ' + cls : ''}" style="font-size:${size}px;line-height:1;">${name}</span>`;
const ICON_CLOSE = mi('close', 22);
const ICON_INFO = mi('info', 20);

// ── CSS ──
export const styles = `
  /* ══ Backdrop ══ */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.32);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  /* Demo: relative positioning */
  .modal-backdrop--demo {
    position: relative;
    inset: auto;
    min-height: 500px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 8px;
  }

  /* ══ Modal container ══ */
  .modal {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    box-shadow:
      0 8px 16px -4px rgba(0, 0, 0, 0.08),
      0 20px 40px -8px rgba(0, 0, 0, 0.12);
  }

  /* ── Sizes ── */
  .modal--sm { width: 600px; }
  .modal--md { width: 700px; }
  .modal--lg {
    width: 949px;
    max-height: 90vh;
  }

  /* ══ Header ══ */
  .modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e7e8e9;
    flex-shrink: 0;
  }

  .modal--sm .modal__header {
    padding: 24px 32px 16px 32px;
    border-bottom: none;
  }

  .modal--md .modal__header {
    padding: 16px 32px;
    height: 56px;
  }

  .modal--lg .modal__header {
    padding: 16px 20px;
    height: 56px;
  }

  .modal__title-group {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .modal__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: #181d27;
    white-space: nowrap;
  }

  .modal__subtitle {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: #48546d;
    white-space: nowrap;
  }

  .modal__header-tag {
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 4px 6px;
    border-radius: 6px;
    background: #e0e7ff;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #150792;
    white-space: nowrap;
  }

  /* SM header: icon info + close */
  .modal__header-alert {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .modal__header-alert-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    background: #e0e7ff;
    border-radius: 6px;
    color: #013aba;
  }

  .modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    color: #48546d;
    background: none;
    border: none;
    padding: 0;
    border-radius: 4px;
    transition: background 0.15s;
    flex-shrink: 0;
  }

  .modal__close:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  /* ══ Content ══ */
  .modal__content {
    flex: 1;
    overflow-y: auto;
  }

  .modal--sm .modal__content {
    padding: 0 32px;
    min-height: 112px;
  }

  .modal--md .modal__content {
    padding: 24px 32px;
    min-height: 100px;
  }

  .modal--lg .modal__content {
    padding: 24px 32px;
  }

  .modal__content-placeholder {
    font-size: 13px;
    color: #8e96a3;
    font-style: italic;
  }

  /* ══ Footer ══ */
  .modal__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
    height: 68px;
    border-top: 1px solid #e7e8e9;
    flex-shrink: 0;
  }

  .modal__footer-left,
  .modal__footer-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ══ Buttons (local) ══ */
  .modal__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 8px 14px;
    border-radius: 4px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    cursor: pointer;
    border: none;
    white-space: nowrap;
    transition: background 0.15s, opacity 0.15s;
  }

  .modal__btn--filled {
    background: #013aba;
    color: #ffffff;
  }
  .modal__btn--filled:hover { background: #0130a0; }

  .modal__btn--tonal {
    background: #eaf0ff;
    color: #263f7a;
  }
  .modal__btn--tonal:hover { background: #dce6ff; }

  .modal__btn--outlined {
    background: transparent;
    color: #48546d;
    border: 1px solid #dee2e9;
  }
  .modal__btn--outlined:hover { background: rgba(0, 0, 0, 0.04); }

  .modal__btn--danger {
    background: #b2271e;
    color: #ffffff;
  }
  .modal__btn--danger:hover { background: #9a211a; }

  /* ══ Body (lg layout) ══ */
  .modal__body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* ── Sidebar (lg) ── */
  .modal__sidebar {
    width: 269px;
    flex-shrink: 0;
    border-right: 1px solid #dee2e9;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
    background: #ffffff;
  }

  .modal__sidebar-title {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: #48546d;
  }

  .modal__sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .modal__sidebar-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s;
  }

  .modal__sidebar-item:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .modal__sidebar-item--active {
    background: #ccdcff;
  }

  .modal__sidebar-item--active:hover {
    background: #c0d4ff;
  }

  .modal__sidebar-item--disabled {
    opacity: 0.38;
    cursor: default;
  }

  .modal__sidebar-item--disabled:hover {
    background: transparent;
  }

  .modal__sidebar-item-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .modal__sidebar-item-icon {
    width: 16px;
    height: 16px;
    color: #48546d;
  }

  .modal__sidebar-item-label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #1d2024;
    white-space: nowrap;
  }

  .modal__sidebar-item--active .modal__sidebar-item-label {
    font-weight: 700;
  }

  .modal__sidebar-item-desc {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #48546d;
    padding-left: 22px;
    margin-top: 4px;
  }

  .modal__sidebar-item--active .modal__sidebar-item-desc {
    display: block;
  }

  .modal__sidebar-item-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .modal__sidebar-item-tag--done {
    background: #e8fdef;
    color: #0d7a3c;
  }

  /* ── Main (lg right side) ── */
  .modal__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .modal__main .modal__content {
    flex: 1;
    overflow-y: auto;
  }

  /* ══ Demo ══ */
  .modal-demo-grid {
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;
  }

  .modal-demo-label {
    font-size: 11px;
    font-weight: 500;
    color: #8e96a3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    text-align: center;
  }

  .modal .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
  }
`;

// ── Helpers ──

function modalSm({
  title = "Supprimer cet élément ?",
  body = "Cette action est irréversible. Toutes les données associées seront définitivement supprimées.",
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
} = {}) {
  return `
    <div class="modal modal--sm">
      <div class="modal__header">
        <div class="modal__header-alert">
          <div class="modal__header-alert-icon">${ICON_INFO}</div>
          <button class="modal__close modal__close-btn">${ICON_CLOSE}</button>
        </div>
      </div>
      <div class="modal__content">
        <p style="font-size:14px;line-height:20px;color:#1d2024;margin:0 0 4px;font-weight:500;">${title}</p>
        <p style="font-size:14px;line-height:20px;color:#48546d;margin:0;">${body}</p>
      </div>
      <div class="modal__footer">
        <div class="modal__footer-left"></div>
        <div class="modal__footer-right">
          <button class="modal__btn modal__btn--tonal modal__close-btn">${cancelLabel}</button>
          <button class="modal__btn modal__btn--danger">${confirmLabel}</button>
        </div>
      </div>
    </div>
  `;
}

function modalMd({
  title = "Lorem",
  body = "",
  confirmLabel = "Valider",
  cancelLabel = "Annuler",
} = {}) {
  return `
    <div class="modal modal--md">
      <div class="modal__header">
        <div class="modal__title-group">
          <span class="modal__title">${title}</span>
        </div>
        <button class="modal__close modal__close-btn">${ICON_CLOSE}</button>
      </div>
      <div class="modal__content">
        ${body || '<p class="modal__content-placeholder">Contenu du formulaire</p>'}
      </div>
      <div class="modal__footer">
        <div class="modal__footer-left"></div>
        <div class="modal__footer-right">
          <button class="modal__btn modal__btn--tonal modal__close-btn">${cancelLabel}</button>
          <button class="modal__btn modal__btn--filled">${confirmLabel}</button>
        </div>
      </div>
    </div>
  `;
}

function modalLg({
  title = "Lorem",
  subtitle = "Ipsum",
  tag = "Label",
  steps = null,
  activeStep = 1,
  body = "",
  prevLabel = "Précédent",
  nextLabel = "Suivant",
} = {}) {
  const defaultSteps = steps || [
    { icon: "work_outline", label: "Informations", done: true },
    { icon: "phone", label: "Contact", desc: "Lorem Ipsum", active: true },
    { icon: "contact_page", label: "Documents", disabled: true },
  ];

  const sidebarItems = defaultSteps.map((s, i) => {
    const cls = [
      "modal__sidebar-item",
      s.active ? "modal__sidebar-item--active" : "",
      s.disabled ? "modal__sidebar-item--disabled" : "",
    ].filter(Boolean).join(" ");

    const tagHtml = s.done
      ? `<div class="modal__sidebar-item-tag modal__sidebar-item-tag--done">${mi('task_alt', 16)}</div>`
      : '';

    const descHtml = s.active && s.desc
      ? `<div class="modal__sidebar-item-desc">${s.desc}</div>`
      : '';

    return `
      <div class="${cls}" data-step="${i}">
        <div style="display:flex;flex-direction:column;flex:1;min-width:0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div class="modal__sidebar-item-left">
              <span class="material-symbols-outlined modal__sidebar-item-icon" style="font-size:16px;line-height:1;">${s.icon}</span>
              <span class="modal__sidebar-item-label">${s.label}</span>
            </div>
            ${tagHtml}
          </div>
          ${descHtml}
        </div>
      </div>
    `;
  }).join("");

  const tagHtml = tag ? `<span class="modal__header-tag">${tag}</span>` : '';
  const subtitleHtml = subtitle ? `<span class="modal__subtitle">${subtitle}</span>` : '';

  return `
    <div class="modal modal--lg" style="height:949px;max-height:90vh;">
      <div class="modal__header">
        <div class="modal__title-group">
          <span class="modal__title">${title}</span>
          ${subtitleHtml}
          ${tagHtml}
        </div>
        <button class="modal__close modal__close-btn">${ICON_CLOSE}</button>
      </div>
      <div class="modal__body">
        <div class="modal__sidebar">
          <span class="modal__sidebar-title">Label</span>
          <div class="modal__sidebar-items">
            ${sidebarItems}
          </div>
        </div>
        <div class="modal__main">
          <div class="modal__content">
            ${body || '<p class="modal__content-placeholder">Contenu de l\'étape</p>'}
          </div>
          <div class="modal__footer">
            <div class="modal__footer-left">
              <button class="modal__btn modal__btn--outlined modal__close-btn">${prevLabel}</button>
            </div>
            <div class="modal__footer-right">
              <button class="modal__btn modal__btn--tonal">${nextLabel}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Script ──
export const script = `
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest(".modal__close-btn");
    if (closeBtn) {
      const backdrop = closeBtn.closest(".modal-backdrop");
      if (backdrop && !backdrop.classList.contains("modal-backdrop--demo")) {
        backdrop.style.display = "none";
      }
    }

    // Sidebar step click (lg)
    const stepItem = e.target.closest(".modal__sidebar-item:not(.modal__sidebar-item--disabled)");
    if (stepItem) {
      const sidebar = stepItem.closest(".modal__sidebar-items");
      if (!sidebar) return;
      sidebar.querySelectorAll(".modal__sidebar-item").forEach(el => {
        el.classList.remove("modal__sidebar-item--active");
        const desc = el.querySelector(".modal__sidebar-item-desc");
        if (desc) desc.style.display = "none";
      });
      stepItem.classList.add("modal__sidebar-item--active");
      const desc = stepItem.querySelector(".modal__sidebar-item-desc");
      if (desc) desc.style.display = "block";
    }
  });
`;

// ── Variants ──
export const variants = [
  {
    label: "Small (Alerte)",
    description: "Modale d'alerte pour confirmations de suppression ou actions critiques.",
    render: () => `
      <div class="modal-backdrop modal-backdrop--demo">
        ${modalSm()}
      </div>
    `,
  },
  {
    label: "Medium (Standard)",
    description: "Modale standard pour formulaires et validations.",
    render: () => `
      <div class="modal-backdrop modal-backdrop--demo" style="min-height:400px;">
        ${modalMd({ title: "Ajouter un contact" })}
      </div>
    `,
  },
  {
    label: "Large (Multi-étapes)",
    description: "Modale à étapes avec sidebar de navigation et footer de navigation.",
    render: () => `
      <div class="modal-backdrop modal-backdrop--demo" style="min-height:700px;">
        ${modalLg({ title: "Créer une série", subtitle: "Intervention", tag: "Récurrent" })}
      </div>
    `,
  },
];
