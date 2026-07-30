# Modal

Dialog overlay with backdrop. 3 sizes: SM (alert/confirmation), MD (form), LG (multi-step wizard with sidebar navigation).

## Classes

- base: `orion-modal`
- backdrop: `orion-modal-backdrop`
- size: `orion-modal--sm` (600px) | `orion-modal--md` (700px) | `orion-modal--lg` (949px)
- elements:
  - `orion-modal__header` — top bar with title and close button
  - `orion-modal__title-group` — flex container for title + subtitle + tag
  - `orion-modal__title` — main title (16px/500)
  - `orion-modal__subtitle` — secondary text (16px/400, grey)
  - `orion-modal__header-tag` — inline badge in header (blue bg)
  - `orion-modal__header-alert` — SM-only: icon + close row
  - `orion-modal__header-alert-icon` — SM-only: info icon container
  - `orion-modal__close` — close button (22×22)
  - `orion-modal__content` — scrollable body area
  - `orion-modal__footer` — bottom bar with action buttons (68px height)
  - `orion-modal__footer-left` / `orion-modal__footer-right` — button groups
  - `orion-modal__btn` — local button base
  - `orion-modal__btn--filled` | `orion-modal__btn--tonal` | `orion-modal__btn--outlined` | `orion-modal__btn--danger` — button types
  - `orion-modal__body` — LG-only: flex container (sidebar + main)
  - `orion-modal__sidebar` — LG-only: left nav (269px)
  - `orion-modal__sidebar-title` — section label in sidebar
  - `orion-modal__sidebar-items` — step list container
  - `orion-modal__sidebar-item` — individual step
  - `orion-modal__sidebar-item--active` — current step (blue bg, bold)
  - `orion-modal__sidebar-item--disabled` — locked step (38% opacity)
  - `orion-modal__sidebar-item-left` — icon + label group
  - `orion-modal__sidebar-item-icon` — step icon (16px)
  - `orion-modal__sidebar-item-label` — step name
  - `orion-modal__sidebar-item-desc` — description shown on active step
  - `orion-modal__sidebar-item-tag` — status badge (e.g. done)
  - `orion-modal__sidebar-item-tag--done` — green check badge
  - `orion-modal__main` — LG-only: right content area

## Syntax

### SM (Alert / Confirmation)

```html
<div class="orion-modal-backdrop">
  <div class="orion-modal orion-modal--sm">
    <div class="orion-modal__header">
      <div class="orion-modal__header-alert">
        <div class="orion-modal__header-alert-icon">
          <span class="material-symbols-outlined" style="font-size:20px;line-height:1;">info</span>
        </div>
        <button class="orion-modal__close orion-modal__close-btn">
          <span class="material-symbols-outlined" style="font-size:22px;line-height:1;">close</span>
        </button>
      </div>
    </div>
    <div class="orion-modal__content">
      <p style="font-size:14px;line-height:20px;color:#1d2024;margin:0 0 4px;font-weight:500;">Supprimer cet élément ?</p>
      <p style="font-size:14px;line-height:20px;color:#48546d;margin:0;">Cette action est irréversible.</p>
    </div>
    <div class="orion-modal__footer">
      <div class="orion-modal__footer-left"></div>
      <div class="orion-modal__footer-right">
        <button class="orion-modal__btn orion-modal__btn--tonal orion-modal__close-btn">Annuler</button>
        <button class="orion-modal__btn orion-modal__btn--danger">Supprimer</button>
      </div>
    </div>
  </div>
</div>
```

### MD (Form)

```html
<div class="orion-modal-backdrop">
  <div class="orion-modal orion-modal--md">
    <div class="orion-modal__header">
      <div class="orion-modal__title-group">
        <span class="orion-modal__title">Ajouter un contact</span>
      </div>
      <button class="orion-modal__close orion-modal__close-btn">
        <span class="material-symbols-outlined" style="font-size:22px;line-height:1;">close</span>
      </button>
    </div>
    <div class="orion-modal__content">
      <!-- form content -->
    </div>
    <div class="orion-modal__footer">
      <div class="orion-modal__footer-left"></div>
      <div class="orion-modal__footer-right">
        <button class="orion-modal__btn orion-modal__btn--tonal orion-modal__close-btn">Annuler</button>
        <button class="orion-modal__btn orion-modal__btn--filled">Valider</button>
      </div>
    </div>
  </div>
</div>
```

### LG (Multi-step Wizard)

```html
<div class="orion-modal-backdrop">
  <div class="orion-modal orion-modal--lg" style="height:949px;max-height:90vh;">
    <div class="orion-modal__header">
      <div class="orion-modal__title-group">
        <span class="orion-modal__title">Créer une série</span>
        <span class="orion-modal__subtitle">Intervention</span>
        <span class="orion-modal__header-tag">Récurrent</span>
      </div>
      <button class="orion-modal__close orion-modal__close-btn">
        <span class="material-symbols-outlined" style="font-size:22px;line-height:1;">close</span>
      </button>
    </div>
    <div class="orion-modal__body">
      <div class="orion-modal__sidebar">
        <span class="orion-modal__sidebar-title">Label</span>
        <div class="orion-modal__sidebar-items">
          <!-- Step: done -->
          <div class="orion-modal__sidebar-item" data-step="0">
            <div style="display:flex;flex-direction:column;flex:1;min-width:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div class="orion-modal__sidebar-item-left">
                  <span class="material-symbols-outlined orion-modal__sidebar-item-icon" style="font-size:16px;line-height:1;">work_outline</span>
                  <span class="orion-modal__sidebar-item-label">Informations</span>
                </div>
                <div class="orion-modal__sidebar-item-tag orion-modal__sidebar-item-tag--done">
                  <span class="material-symbols-outlined" style="font-size:16px;line-height:1;">task_alt</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Step: active -->
          <div class="orion-modal__sidebar-item orion-modal__sidebar-item--active" data-step="1">
            <div style="display:flex;flex-direction:column;flex:1;min-width:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div class="orion-modal__sidebar-item-left">
                  <span class="material-symbols-outlined orion-modal__sidebar-item-icon" style="font-size:16px;line-height:1;">phone</span>
                  <span class="orion-modal__sidebar-item-label">Contact</span>
                </div>
              </div>
              <div class="orion-modal__sidebar-item-desc">Lorem Ipsum</div>
            </div>
          </div>
          <!-- Step: disabled -->
          <div class="orion-modal__sidebar-item orion-modal__sidebar-item--disabled" data-step="2">
            <div style="display:flex;flex-direction:column;flex:1;min-width:0;">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <div class="orion-modal__sidebar-item-left">
                  <span class="material-symbols-outlined orion-modal__sidebar-item-icon" style="font-size:16px;line-height:1;">contact_page</span>
                  <span class="orion-modal__sidebar-item-label">Documents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="orion-modal__main">
        <div class="orion-modal__content">
          <!-- step content -->
        </div>
        <div class="orion-modal__footer">
          <div class="orion-modal__footer-left">
            <button class="orion-modal__btn orion-modal__btn--outlined orion-modal__close-btn">Précédent</button>
          </div>
          <div class="orion-modal__footer-right">
            <button class="orion-modal__btn orion-modal__btn--tonal">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Behavior (JS)

Close on backdrop click or close button. LG sidebar step navigation with active state switching.

```js
document.addEventListener("click", (e) => {
  // Close button
  const closeBtn = e.target.closest(".orion-modal__close-btn");
  if (closeBtn) {
    const backdrop = closeBtn.closest(".orion-modal-backdrop");
    if (backdrop) backdrop.style.display = "none";
  }

  // Sidebar step click (LG)
  const stepItem = e.target.closest(".orion-modal__sidebar-item:not(.orion-modal__sidebar-item--disabled)");
  if (stepItem) {
    const sidebar = stepItem.closest(".orion-modal__sidebar-items");
    if (!sidebar) return;
    sidebar.querySelectorAll(".orion-modal__sidebar-item").forEach(el => {
      el.classList.remove("orion-modal__sidebar-item--active");
      const desc = el.querySelector(".orion-modal__sidebar-item-desc");
      if (desc) desc.style.display = "none";
    });
    stepItem.classList.add("orion-modal__sidebar-item--active");
    const desc = stepItem.querySelector(".orion-modal__sidebar-item-desc");
    if (desc) desc.style.display = "block";
  }
});
```

## Rules

- SM: no header border, alert icon top-left, use `--danger` for destructive confirm.
- MD: header has bottom border, title-group with title only.
- LG: sidebar 269px, steps can be done/active/disabled. Footer is inside `__main`, not at modal root.
- LG navigation: level-1 steps block until completed. Level-3 steps (optional) are always accessible once prior level-1 steps are done.
- LG sub-steps: when inside a sub-step, footer navigation (Précédent/Suivant) is hidden. Reappears when returning to main step view.
- LG validation: missing required fields → sidebar step shows error state "Champs non conformes", fields show inline error.
- First step in LG: no left button, only "Suivant" on right.
- Close button uses `orion-modal__close-btn` class for JS targeting — add it to any element that should close the modal.
- All icons use Material Symbols Outlined with `font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20`.

## Confirmation Patterns

Use SM modals for confirmation dialogs. Match the type to the action:

| Type | Context | Action |
|------|---------|--------|
| Warning | Quitter sans enregistrer | Annuler / Quitter |
| Warning | Quitter sans terminer (tunnel incomplet) | Annuler / Quitter |
| Error | Suppression destructive | Annuler / Supprimer (`--danger`) |

Field validation errors are **never** shown in a modal — use inline `orion-ff--error` on each field instead.

## Wizard Step Levels (LG)

Each step in an LG wizard has a level that determines navigation and validation:

| Level | Constraint | Navigation | Header message |
|-------|-----------|------------|----------------|
| 1 — Required to navigate | Fields required to proceed | Next tabs disabled, previous accessible | "Tous les champs sont obligatoires (*)" |
| 2 — Required to save | Fields required to save | Free navigation, Error tag on incomplete tabs | "Les champs obligatoires (*) sont nécessaires pour enregistrer" + completion rate |
| 3 — Optional | No required fields | Free, can be skipped | "Tous les champs sont facultatifs" |
