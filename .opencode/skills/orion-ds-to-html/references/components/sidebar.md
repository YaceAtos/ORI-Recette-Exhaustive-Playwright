# Sidebar

Full sidebar navigation component. Expanded (232px) / collapsed (82px icon-only) modes. Sections with headers, collapsible children, sticky footer.

## Classes

- base: `orion-sb`
- state: `data-expanded="true|false"` attribute on root
- elements:
  - `orion-sb__header` — top bar with logo + toggle button
  - `orion-sb__logo` — logo container (hidden when collapsed)
  - `orion-sb__toggle` — expand/collapse button (36×36, blue bg)
  - `orion-sb__nav` — scrollable nav container
  - `orion-sb__section-label` — section header text (12px/500, #7a859b)
  - `orion-sb__nav-item` — level 1 nav item container
  - `orion-sb__nav-item--selected` — selected L1 item (blue bg, bold)
  - `orion-sb__nav-item--open` — expanded with children visible
  - `orion-sb__nav-item--child-selected` — parent of selected child (blue bg, bold)
  - `orion-sb__nav-item--footer` — settings item in footer
  - `orion-sb__nav-item-row` — clickable row (icon + label + chevron)
  - `orion-sb__nav-icon` — 16×16 item icon
  - `orion-sb__nav-label` — item text (14px/400)
  - `orion-sb__nav-chevron` — expand arrow (rotates 180° when open)
  - `orion-sb__nav-children` — child items container (hidden by default)
  - `orion-sb__nav-child` — level 2 child item (margin-left 24px)
  - `orion-sb__nav-child--selected` — selected child (#eaf0ff bg, weight 500)
  - `orion-sb__nav-child-label` — child text (14px/400)
  - `orion-sb__footer` — sticky bottom section (border-top)

## Syntax

### Expanded Sidebar

```html
<aside class="orion-sb" data-expanded="true">
  <div class="orion-sb__header">
    <div class="orion-sb__logo"><!-- Orion logo SVG --></div>
    <button class="orion-sb__toggle" title="Réduire la sidebar">
      <!-- chevron_left SVG -->
    </button>
  </div>
  <nav class="orion-sb__nav">
    <!-- Item without children (selected) -->
    <div class="orion-sb__nav-item orion-sb__nav-item--selected" data-nav-id="planning" data-has-children="false">
      <div class="orion-sb__nav-item-row">
        <span class="orion-sb__nav-icon"><!-- calendar SVG --></span>
        <span class="orion-sb__nav-label">Planning</span>
      </div>
    </div>

    <!-- Section header -->
    <div class="orion-sb__section-label">Membres</div>

    <!-- Item with children -->
    <div class="orion-sb__nav-item" data-nav-id="clients" data-has-children="true">
      <div class="orion-sb__nav-item-row">
        <span class="orion-sb__nav-icon"><!-- person SVG --></span>
        <span class="orion-sb__nav-label">Clients</span>
        <span class="orion-sb__nav-chevron"><!-- chevron_down SVG --></span>
      </div>
      <div class="orion-sb__nav-children" data-parent="clients">
        <div class="orion-sb__nav-child" data-child-id="clients-prospects" data-parent-id="clients">
          <span class="orion-sb__nav-child-label">Clients & prospects</span>
        </div>
        <div class="orion-sb__nav-child" data-child-id="devis-contrats" data-parent-id="clients">
          <span class="orion-sb__nav-child-label">Devis & contrats</span>
        </div>
      </div>
    </div>
  </nav>
  <div class="orion-sb__footer">
    <div class="orion-sb__nav-item orion-sb__nav-item--footer" data-nav-id="parametres" data-has-children="false">
      <div class="orion-sb__nav-item-row">
        <span class="orion-sb__nav-icon"><!-- settings SVG --></span>
        <span class="orion-sb__nav-label">Paramètres</span>
      </div>
    </div>
  </div>
</aside>
```

## Behavior (JS)

Toggle expand/collapse, item selection, child menu open/close.

```js
document.querySelectorAll(".orion-sb").forEach((sidebar) => {
  // Toggle expand/collapse
  const toggleBtn = sidebar.querySelector(".orion-sb__toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = sidebar.getAttribute("data-expanded") === "true";
      sidebar.setAttribute("data-expanded", isExpanded ? "false" : "true");
      // Swap chevron icon direction
    });
  }

  // Tooltips for collapsed mode
  sidebar.querySelectorAll(".orion-sb__nav-item-row").forEach((row) => {
    const label = row.querySelector(".orion-sb__nav-label");
    if (label) row.setAttribute("data-tooltip", label.textContent);
  });

  function clearSelection() {
    sidebar.querySelectorAll(".orion-sb__nav-item--selected").forEach(el => el.classList.remove("orion-sb__nav-item--selected"));
    sidebar.querySelectorAll(".orion-sb__nav-item--child-selected").forEach(el => el.classList.remove("orion-sb__nav-item--child-selected"));
    sidebar.querySelectorAll(".orion-sb__nav-child--selected").forEach(el => el.classList.remove("orion-sb__nav-child--selected"));
  }

  // Level 1 click
  sidebar.querySelectorAll(".orion-sb__nav-item").forEach((navItem) => {
    const row = navItem.querySelector(".orion-sb__nav-item-row");
    const hasChildren = navItem.getAttribute("data-has-children") === "true";
    row.addEventListener("click", () => {
      if (hasChildren) {
        const wasOpen = navItem.classList.contains("orion-sb__nav-item--open");
        if (!wasOpen) {
          sidebar.querySelectorAll(".orion-sb__nav-item--open").forEach(el => {
            if (el !== navItem) el.classList.remove("orion-sb__nav-item--open");
          });
        }
        navItem.classList.toggle("orion-sb__nav-item--open");
        clearSelection();
        navItem.classList.add("orion-sb__nav-item--child-selected");
        if (!wasOpen) {
          const firstChild = navItem.querySelector(".orion-sb__nav-child");
          if (firstChild) firstChild.classList.add("orion-sb__nav-child--selected");
        }
      } else {
        clearSelection();
        sidebar.querySelectorAll(".orion-sb__nav-item--open").forEach(el => el.classList.remove("orion-sb__nav-item--open"));
        navItem.classList.add("orion-sb__nav-item--selected");
      }
    });
  });

  // Level 2 click
  sidebar.querySelectorAll(".orion-sb__nav-child").forEach((child) => {
    child.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentId = child.getAttribute("data-parent-id");
      const parentItem = sidebar.querySelector('.orion-sb__nav-item[data-nav-id="' + parentId + '"]');
      clearSelection();
      if (parentItem) parentItem.classList.add("orion-sb__nav-item--child-selected");
      child.classList.add("orion-sb__nav-child--selected");
    });
  });
});
```

## Rules

- The sidebar **pushes page content** when expanding/collapsing — it is NOT an overlay.
- Expanded width: 232px. Collapsed width: 82px. Height: 832px (or viewport).
- Background: #f8f9fb. Right border: 1px solid #e7e8e9.
- Transition: width 0.25s cubic-bezier(.4,0,.2,1).
- Collapsed mode: labels, chevrons, and child labels are hidden (`display:none`). Nav items become 40×40 centered icons.
- Collapsed tooltips: `::after` pseudo-element with `data-tooltip` attribute, dark bg, appears on hover.
- Section labels in collapsed mode: become thin divider lines (border-top #e7e8e9).
- Selected L1: bg #ccdcff, label weight 700. Parent of selected child: same.
- Selected L2 child: bg #eaf0ff, label weight 500.
- Chevron rotates 180° when `orion-sb__nav-item--open`.
- Children container: `display:none` by default, `display:flex` when parent has `--open`.
- Children are indented with `margin-left: 24px`.
- Footer (Paramètres) is sticky at bottom with `border-top: 1px solid #e7e8e9`.
- Toggle button: 36×36, bg #eaf0ff, color #3366cc, hover bg #ccdcff.
- Icons use inline SVGs (16×16), not Material Symbols.
- Scrollbar: 4px width, thumb #d0d5dd.
