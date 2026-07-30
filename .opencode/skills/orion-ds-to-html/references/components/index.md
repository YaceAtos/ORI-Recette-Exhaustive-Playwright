# Orion Components

Load this file first. Then load only the component files you need for the current screen.

For each component, load **both** the doc (`components/{name}.md`) and the CSS (`css/{name}.css`). Always load `css/theme.css` first.

## Available Components

| Component | File | Tier | Description |
|-----------|------|------|-------------|
| Breadcrumb | `breadcrumb.md` | 1 | Navigation path trail (2-5 levels) |
| Button | `button.md` | 1 | Action triggers (filled, tonal, outlined, ghost) in 3 sizes |
| Button Icon | `button-icon.md` | 1 | Icon-only action button, 4 types × 3 sizes |
| Segmented Control | `segmented-control.md` | 1 | Toggle bar with mutually exclusive options |
| Tabs | `tabs.md` | 1 | Tab navigation with underline active indicator |
| Tag | `tag.md` | 1 | Status badge (6 colors × 2 sizes), optional icon |
| Alert | `alert.md` | 2 | Feedback banners (info, warning, error, success) with optional actions and close |
| Chips | `chips.md` | 2 | Selectable or removable filter pills |
| Drag & Drop | `drag-drop.md` | 2 | File upload drop zone (2 sizes, 3 states) |
| Pagination | `pagination.md` | 2 | Rows-per-page selector + page navigation |
| Planning Card Period | `planning-card-period.md` | 2 | Period blocks (congé, absence) in planning grid, hatched backgrounds |
| Search Bar | `search-bar.md` | 2 | Text input with search icon and clear button |
| Tooltip | `tooltip.md` | 2 | Small hover text or large click panel |
| Datepicker | `datepicker.md` | 3 | Calendar widget with month/year navigation and day selection |
| Expansion Panel | `expansion-panel.md` | 3 | Collapsible panel with header (tag, toggle, description, action) |
| Form Field | `form-field.md` | 3 | Input/select/textarea with floating label, error state, helper text |
| Modal | `modal.md` | 3 | Dialog in 3 sizes (SM/MD/LG); LG has sidebar step navigation |
| Planning Card | `planning-card.md` | 3 | Resource planning card (3 types × 4 sizes × 2 directions) |
| Result Card | `result-card.md` | 3 | Search result card with avatar, info columns, tags, actions |
| Row Item | `row-item.md` | 3 | Data row in lists/tables (6 structural types) |
| Sidebar | `sidebar.md` | 3 | Full navigation sidebar, collapsible, with sections |
| Sidebar Item | `sidebar-item.md` | 3 | Navigation item (2 levels, icon-only mode when collapsed) |

## Tier Guide

- **Tier 1 (Simple):** One syntax template + class table is enough. Quick read.
- **Tier 2 (Medium):** Has variant examples, optional elements, or JS behavior. Read the full doc.
- **Tier 3 (Complex):** Structure changes per variant. Has decision rules. Read carefully before generating.

## Usage Rules

- Always use `orion-*` CSS classes defined in `css/*.css`.
- Never invent class names. If a class doesn't exist, the component doesn't support it.
- For page layout and general spacing, use raw Tailwind utility classes (`flex`, `gap-4`, `p-8`, etc.).
- Component classes handle component-internal styling. Tailwind handles everything around them.
