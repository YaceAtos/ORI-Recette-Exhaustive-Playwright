# App-Level UX Patterns

These patterns govern how Orion components are composed into full screens. Apply when generating complete pages.

## Navigation — Drawer vs Detail Page

| Criterion | Drawer | Detail page |
|-----------|--------|-------------|
| Content amount | Little | Lots |
| Parent context | Stays visible (left side) | Hidden |
| Max actions | 3 | Unlimited |
| Close | X button or grey zone click | Back navigation |
| Max content width | — | 1500px |
| Example | Planning, mapping | User profile |

**Context menus**: tables use "..." menu per row. Detail pages use "..." button top-right in header.

## Filters

Filters persist within a micro-service. **Lost** when switching micro-services (avoids cross-context confusion).

## Loading States

| Context | Component | Behavior |
|---------|-----------|----------|
| Full page | Progress bar | Top (below nav), indeterminate |
| Table/card data | Spinner | Centered in data zone |
| Modal opening | Bar + spinner | Modal opens immediately, spinner centered in content |
| Modal save action | Progress bar | 500ms delay, appears above buttons |
| Download | Progress bar | Top (below nav), indeterminate |
| Action buttons | — | Button becomes `disabled` + `cursor: wait` |
| Action complete | Snackbar | Success or error message (see alert.md) |

## Sensitive Data Masking

| Type | Display | Use case |
|------|---------|----------|
| A — Partial control | `+33 6 ** ** ** 89`, `n******@gmail.com` | Confirm existence without extraction |
| B — Absolute confidentiality | Lock icon + "Données restreintes" | GDPR, health, finance — access forbidden |

Classification A vs B is per user role, case by case.

**Block display rules:**
- **Mixed block** (visible + confidential data): keep block, mask restricted fields
- **100% confidential block**: remove block entirely
- **Creation form**: adapt wizard to permissions — hide inaccessible steps

## Deletion Flow

**From table**: row hover → "..." → "Supprimer" → confirmation modal (SM)
**From detail page**: header → "..." → "Supprimer" → confirmation modal (SM)

- Delete button visible only if user has permissions. Hidden if element is structurally non-deletable.
- **No dependencies**: standard SM confirmation modal
- **With dependencies**: informational SM modal listing conditions (e.g. "2 active contracts prevent deletion")

## Time Slots

**Minimal structure**: section title + "Ajouter une plage horaire" button. Expansion panel per day: label, start/end time, delete/add buttons.

**Maximal structure**: multiple slots per day, each with individual delete. Description in panel header (e.g. "Lundi, Mardi — indisponibilité — Remplissable").

**Contexts**: contractual hours (employee profile, with active/inactive toggle), opening hours (establishment), preferred contact hours (prospect/client).

## History

- Display as **table**, most recent first
- Default pagination: **15 rows**
- Structure: header (title + tags) → period → table (contextual columns) → footer "Exporter"
