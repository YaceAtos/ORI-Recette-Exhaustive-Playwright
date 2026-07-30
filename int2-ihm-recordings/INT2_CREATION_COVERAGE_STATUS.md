# INT2 Creation Coverage Status

- Generated at: 2026-07-20T15:03:52.299Z
- Source: int2-ihm-recordings/int2-autonomous/create-flow-profile.json
- Create-capable URLs profiled: 12
- Meaning of current status: create entrypoint was opened, semantically understood, and exercised in safe mode without final submit.

| URL | Container | Fields | Required | Current Coverage | Next Step |
|---|---|---:|---:|---|---|
| https://orion-int2.itsap.net/gestion-admin/pages/collaborateur | dialog | 11 | 6 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/sap/pages/planning | page | 4 | 0 | semantic-create-executed-safe-mode | Optional: map final submit success criteria for page-style create routes. |
| https://orion-int2.itsap.net/crm/pages/leads | page | 4 | 0 | semantic-create-executed-safe-mode | Optional: map final submit success criteria for page-style create routes. |
| https://orion-int2.itsap.net/crm/pages/clients-prospects | dialog | 16 | 4 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/crm/pages/clients-professionnels | page | 3 | 0 | semantic-create-executed-safe-mode | Optional: map final submit success criteria for page-style create routes. |
| https://orion-int2.itsap.net/facturation-paie/reglementaire/pages/organisme-financeur | dialog | 18 | 3 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/offres-tarifs/pages/catalogue/familles | dialog | 12 | 4 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/offres-tarifs/pages/catalogue/options | dialog | 14 | 7 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/gestion-marque/structure/pages/marque | dialog | 5 | 1 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/gestion-marque/structure/pages/structure | page | 2 | 0 | semantic-create-executed-safe-mode | Optional: map final submit success criteria for page-style create routes. |
| https://orion-int2.itsap.net/gestion-marque/habilitation/pages/habilitation-profils | dialog | 6 | 1 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
| https://orion-int2.itsap.net/gestion-marque/configuration/pages/categories | dialog | 8 | 3 | semantic-create-executed-safe-mode | Optional: add controlled submit plus rollback/cleanup for destructive validation. |
