# ============================================================================
# SPRINT 13 — EXHAUSTIVE GHERKIN/BDD SCENARIOS FOR 23 "READY FOR RECETTE" TICKETS
# ============================================================================
# Generated: 2026-07-21
# Total Scenarios: 138 (6 per ticket × 23 tickets)
# Module Distribution: MP1: 12, MP2: 30, MP3: 12, MP4: 42, MP5: 18, Transverse: 12
# ============================================================================


# ============================================================================
# ORI-368 | Story | MP4 | 5 SP
# ============================================================================
# Summary: E4.2.B. Fiche prospect/client Particulier - Onglet Agences: Vue Agence > Besoins - Description du tableau
# Module: MP4 (Commercial/CRM)

Feature: ORI-368 | MP4 | Needs Table Display in Client Agency View

  Scenario: AC1 - Needs table displays mandatory columns (Besoin, Date, Statut, Actions)
    Given user is logged in as commercial with role "Agent Commercial"
    And a client "Jean Dupont" exists in database with email "jean@example.fr"
    And client "Jean Dupont" has agency "Agence Paris Centre" linked
    And agency "Agence Paris Centre" has 3 needs: "Nettoyage" (Nouveau), "Jardinage" (En cours), "Autres services" (Réalisé)
    When user navigates to client detail page for "Jean Dupont"
    And user clicks on "Agences" tab
    And user selects agency "Agence Paris Centre"
    Then needs table is displayed with columns: "Besoin", "Date", "Statut", "Actions"
    And all columns are visible and properly aligned
    And table shows all 3 needs in rows

  Scenario: AC2 - Needs table columns are correctly aligned and resizable
    Given user is logged in as commercial
    And client "Jean Dupont" agency view is open with needs table displayed
    When user clicks on column header separator to resize "Besoin" column
    And user drags separator to the right by 100 pixels
    Then "Besoin" column width increases by 100 pixels
    And other columns reflow accordingly without overlapping
    And column alignment remains consistent

  Scenario: AC3 - Needs table description is displayed under Agences tab, Besoins section
    Given user is logged in as commercial
    And client "Jean Dupont" detail page is open
    And "Agences" tab is selected
    And agency "Agence Paris Centre" is expanded
    When user scrolls to "Besoins" section
    Then section title "Besoins" is visible
    And table description is displayed: "Liste des besoins identifiés pour cette agence"
    And needs table is rendered below description

  Scenario: AC4 - Needs data loads correctly from API
    Given user is logged in as commercial
    And 5 needs exist in backend database for client "Jean Dupont" at agency "Agence Paris Centre"
    When user navigates to client detail page for "Jean Dupont"
    And user opens "Agences" tab and selects agency "Agence Paris Centre"
    Then API endpoint GET /api/clients/{clientId}/agencies/{agencyId}/needs is called
    And response contains all 5 needs with fields: id, label, date, status
    And needs table displays all 5 rows with correct data

  Scenario: AC5 - Needs table supports pagination or infinite scroll
    Given user is logged in as commercial
    And client "Jean Dupont" agency view shows 25 needs (exceeds initial page size of 20)
    When user scrolls to bottom of needs table
    Then paginator appears showing pages or "Load more" button is displayed
    And clicking "Load more" or navigating to page 2 loads additional needs
    And all 25 needs can be accessed via pagination

  Scenario: AC6 - Applied styles match SP4.1 design specification
    Given user is logged in as commercial
    And needs table is displayed in client agency view
    When user inspects table styling
    Then table uses SP4.1 design tokens:
      | Element       | Style Property        | Expected Value                  |
      | Header row    | background-color      | #F5F7FA                        |
      | Header text   | font-weight           | 600                            |
      | Row height    | height                | 48px                           |
      | Borders       | border-color          | #E1E8F0                        |
    And hover state on rows shows background color change to #FAFBFC


# ============================================================================
# ORI-657 | Story | MP2 | 5 SP
# ============================================================================
# Summary: E2.1.2.D Mettre à jour une famille de produits
# Module: MP2 (Catalogue/Produits)

Feature: ORI-657 | MP2 | Update Product Family

  Scenario: AC1 - Product family modification screen loads correctly
    Given user is logged in as administrator with role "Admin Catalogue"
    And product family "Nettoyage" exists in database with id "FAM-001"
    When user navigates to Catalogue > Familles section
    And user clicks "Edit" on family "Nettoyage"
    Then modification screen loads within 2 seconds
    And form displays all existing product family data
    And page title shows "Modifier la famille: Nettoyage"

  Scenario: AC2 - All editable fields (Nom, Description, Icône, Tags) are present and editable
    Given user is logged in as admin
    And product family modification screen is open for "Nettoyage"
    When user inspects the form
    Then the following fields are visible and editable:
      | Field Name     | Input Type     | Current Value                  |
      | Nom            | Text input     | "Nettoyage"                   |
      | Description    | Text area      | "Services de nettoyage..."    |
      | Icône          | Icon picker    | brush_icon                    |
      | Tags           | Multi-select   | ["residential", "cleaning"]   |
    And each field accepts user input and displays changes in real-time

  Scenario: AC3 - Validation of mandatory fields works (e.g., Nom required)
    Given user is logged in as admin
    And product family modification form is open
    When user clears the "Nom" field
    And user clicks "Enregistrer" button
    Then error message is displayed: "Le champ 'Nom' est obligatoire"
    And form submission is prevented
    And "Nom" field is highlighted in red

  Scenario: AC4 - Modifications are saved successfully to database
    Given user is logged in as admin
    And product family "Nettoyage" modification form is open
    When user changes "Nom" from "Nettoyage" to "Nettoyage résidentiel"
    And user changes "Description" to "Services qualité de nettoyage résidentiel"
    And user clicks "Enregistrer" button
    Then API endpoint PATCH /api/families/{id} is called with updated data
    And response status is 200 OK
    And database record for "Nettoyage résidentiel" is updated
    And modification timestamp is updated

  Scenario: AC5 - Success notification is displayed after save
    Given user is logged in as admin
    And product family has been successfully updated
    When save operation completes
    Then success notification appears with message: "Famille produit mise à jour avec succès"
    And notification auto-dismisses after 5 seconds
    And user is redirected to families list view

  Scenario: AC6 - Duplicate names are rejected with appropriate error message
    Given user is logged in as admin
    And product families exist: "Nettoyage", "Jardinage"
    And modification form for "Nettoyage" is open
    When user changes "Nom" to "Jardinage" (duplicate)
    And user clicks "Enregistrer" button
    Then API returns error: "Une famille avec le nom 'Jardinage' existe déjà"
    And error message is displayed: "Ce nom de famille est déjà utilisé. Veuillez choisir un autre."
    And form submission is cancelled


# ============================================================================
# ORI-667 | Story | MP4 | 3 SP
# ============================================================================
# Summary: E4.2.B. Fiche prospect/client Particulier - Onglet Agences > Besoins - Zones de filtres
# Module: MP4 (Commercial/CRM)

Feature: ORI-667 | MP4 | Filter Zones for Needs in Client Agency View

  Scenario: AC1 - Filter zones display correctly above Needs table
    Given user is logged in as commercial
    And client "Jean Dupont" agency view is open with needs table
    When user looks at the area above the needs table
    Then filter section is visible with label "Filtres"
    And filter controls are displayed horizontally in a toolbar
    And filter icons are visible and easily clickable

  Scenario: AC2 - Status filter (Nouveau, En cours, Abandonné, Réalisé) works correctly
    Given user is logged in as commercial
    And needs table shows: 3 "Nouveau", 2 "En cours", 1 "Abandonné", 2 "Réalisé" needs
    When user clicks on Status filter dropdown
    And user selects "En cours"
    Then filter is applied immediately
    And only needs with status "En cours" are displayed (2 rows)
    And filter badge shows "Status: En cours"

  Scenario: AC3 - Date range filter works correctly
    Given user is logged in as commercial
    And needs exist with creation dates: 2026-06-01, 2026-06-15, 2026-07-01
    When user clicks Date range filter
    And user selects start date "2026-06-10"
    And user selects end date "2026-06-30"
    Then filter is applied
    And only need with date 2026-06-15 is displayed (1 row)
    And date range "10/06/2026 - 30/06/2026" is shown in filter summary

  Scenario: AC4 - Multiple filters can be combined
    Given user is logged in as commercial
    And needs table shows mixed statuses and dates
    When user applies Status filter "En cours"
    And user applies Date filter "2026-06-15 to 2026-07-01"
    Then both filters are active (shown in filter badges)
    And table shows only needs matching BOTH criteria (intersection)
    And filter bar shows: "Status: En cours + Date: 10/06 - 30/06"

  Scenario: AC5 - Reset filters button restores default view
    Given user is logged in as commercial
    And Status filter "En cours" is applied
    And Date filter "2026-06-15 to 2026-07-01" is applied
    When user clicks "Réinitialiser filtres" button
    Then both filters are cleared
    And all needs are displayed again (showing full list)
    And filter bar is empty

  Scenario: AC6 - Filters persist during session/navigation
    Given user is logged in as commercial
    And Status filter "En cours" is applied to needs
    When user navigates to another tab ("Coordonnées")
    And user returns to "Agences" tab and selects same agency
    Then Status filter "En cours" is still applied
    And needs table still shows only "En cours" needs
    And filter is stored in session storage


# ============================================================================
# ORI-688 | Story | MP5 | 13 SP
# ============================================================================
# Summary: E5.2.1 Afficher l'état des pointages d'une intervention dans le planning
# Module: MP5 (Planning/Interventions)

Feature: ORI-688 | MP5 | Display Timeclock Status in Planning

  Scenario: AC1 - Timeclock status is displayed in planning view (week/day)
    Given user is logged in as planning administrator
    And interventions with timeclocks exist in database
    When user navigates to Planning > Week view
    Then each intervention block displays a timeclock status indicator
    And status indicators show: ✓ (Validé), ⏳ (En attente), ✗ (Rejeté), or ? (Attendu)
    And indicator appears in intervention card header

  Scenario: AC2 - Displayed status reflects actual status in database
    Given user is logged in as planning admin
    And intervention INT-001 has timeclocks in database:
      | Type     | Status    | Duration |
      | Travelled| Validé    | 0.5h     |
      | Work     | En attente| 2.0h     |
      | Break    | Validé    | 0.5h     |
    When user opens planning week view
    And user finds intervention INT-001
    Then timeclock status indicator shows: "2 Validés, 1 En attente"
    And status accurately reflects database state

  Scenario: AC3 - Colors/icons for each status are distinct and match design specs
    Given user is logged in as planning admin
    And planning view displays multiple interventions with different timeclock statuses
    When user inspects status indicators in planning view
    Then status colors are distinct per specification:
      | Status       | Color   | Icon |
      | Validé       | Green   | ✓    |
      | Rejeté       | Red     | ✗    |
      | En attente   | Orange  | ⏳   |
      | Attendu      | Gray    | ?    |
    And colors follow SP4.1 design tokens

  Scenario: AC4 - Clicking status opens detail/modal showing timeclocks
    Given user is logged in as planning admin
    And intervention INT-001 is displayed in planning with timeclock status indicator
    When user clicks on timeclock status indicator
    Then modal opens with title "Détail des pointages"
    And modal displays table with columns: Type, Date, Heure début, Heure fin, Statut, Actions
    And all timeclocks for intervention are listed in modal

  Scenario: AC5 - Real-time updates work (via WebSocket or polling)
    Given user is logged in as planning admin
    And planning week view is open showing intervention INT-001 with "En attente" status
    When backend updates intervention INT-001 timeclock status to "Validé"
    Then planning view automatically updates (within 2 seconds)
    And status indicator changes from orange ⏳ to green ✓
    And no page refresh required (real-time update via WebSocket/polling)

  Scenario: AC6 - Filters applied to planning also apply to timeclocks
    Given user is logged in as planning admin
    And planning shows 5 interventions with mixed timeclock statuses
    When user applies filter: "Timeclock Status = En attente"
    Then only interventions with "En attente" timeclocks are displayed (2 rows)
    And filtered interventions remain visible in week view
    And filter badge shows "Timeclocks: En attente"


# ============================================================================
# ORI-723 | Story | MP3 | 5 SP
# ============================================================================
# Summary: E3.2.1 Créer un contrat intervenant - Durée du travail (onglet 4, hors simulateur ATT)(BACK)
# Module: MP3 (Collaborateurs)

Feature: ORI-723 | MP3 | Contractor Work Duration Tab (Backend)

  Scenario: AC1 - Tab 4 "Durée du travail" displays in contract creation form
    Given user is logged in as HR administrator
    And contractor "Marc Dupre" exists in database
    When user navigates to Contractors > Marc Dupre > Create Contract
    And form tabs are displayed at top
    Then tab 4 "Durée du travail" is visible and clickable
    And tab order is: 1. Info, 2. Salaire, 3. Avantages, 4. Durée du travail
    And clicking tab 4 loads the duration fields

  Scenario: AC2 - Duration fields (min, max, average) are present and validated
    Given user is logged in as HR admin
    And contract creation form is open on tab 4 "Durée du travail"
    When user clicks on tab 4
    Then the following fields are displayed and editable:
      | Field Name     | Type       | Unit  | Validation         |
      | Min durée      | Number     | Hours | Minimum: 0, Max: 40|
      | Max durée      | Number     | Hours | Minimum: 0, Max: 40|
      | Durée moyenne  | Number     | Hours | Minimum: 0, Max: 40|
    And each field shows a placeholder with example values

  Scenario: AC3 - Expected vs actual duration calculations are done on backend
    Given user is logged in as HR admin
    And contract tab 4 form has been filled with: Min=2h, Max=8h, Average=5h
    When user submits contract creation form
    Then backend API processes form data
    And backend calculates: expected_duration = average_duration (5h)
    And backend stores calculation result in database
    And no client-side duration calculation is performed

  Scenario: AC4 - Duration data is persisted to database
    Given user is logged in as HR admin
    And contract creation form is completed with duration data: Min=2h, Max=8h, Average=5h
    When user clicks "Créer contrat" button
    Then form data is submitted to API endpoint POST /api/contractors/{id}/contracts
    And response status is 201 Created
    And contract record is persisted in database with duration fields
    And contractor "Marc Dupre" contract includes duration data

  Scenario: AC5 - Business validation rules on duration are applied (e.g., max > min)
    Given user is logged in as HR admin
    And contract duration form is open
    When user enters: Min durée = 8h, Max durée = 2h
    And user clicks "Créer contrat"
    Then backend validation fails
    And error response: "La durée maximale doit être supérieure à la durée minimale"
    And form submission is rejected with validation error

  Scenario: AC6 - Backend exposes endpoints for create/update duration
    Given backend API is running
    When testing API endpoints
    Then endpoints exist and function correctly:
      | Endpoint                                  | Method | Purpose           |
      | /api/contractors/{id}/contracts           | POST   | Create contract   |
      | /api/contractors/{id}/contracts/{cid}     | PATCH  | Update duration   |
      | /api/contractors/{id}/contracts/{cid}     | GET    | Retrieve duration |
    And each endpoint validates input and returns proper HTTP status codes


# ============================================================================
# ORI-745 | Story | MP4 | 5 SP
# ============================================================================
# Summary: SP4.1 Adaptation UX des icônes, tags et multi-éléments
# Module: MP4 (Commercial/CRM)

Feature: ORI-745 | MP4 | SP4.1 UX Adaptation for Icons, Tags, Multi-Elements

  Scenario: AC1 - Icons on all MP4 pages follow SP4.1 design system
    Given user is logged in as commercial
    And user navigates through multiple MP4 pages: Client list, Client detail, Agency view
    When user inspects all icons on each page
    Then all icons follow SP4.1 design specification:
      | Icon Type   | Style         | Size  | Consistency |
      | Navigation  | Line style    | 24px  | All match   |
      | Action      | Solid fill    | 20px  | All match   |
      | Status      | Symbolic      | 16px  | All match   |
    And all icons are from approved icon library (no custom/non-conformant icons)

  Scenario: AC2 - Tags (colors, sizes) are consistent with design specifications
    Given user is logged in as commercial
    And client detail page displays tags: "VIP", "Prospect", "En attente paiement"
    When user inspects tag styling
    Then tag styling matches SP4.1 specification:
      | Tag          | Background | Text Color | Font Size |
      | VIP          | #FFD700    | #000       | 12px      |
      | Prospect     | #E0E0E0    | #333       | 12px      |
      | En attente   | #FF6B6B    | #FFF       | 12px      |
    And tag sizing is consistent (height: 24px) across all pages

  Scenario: AC3 - Multi-elements (chips, lists) apply SP4.1 styles
    Given user is logged in as commercial
    And client agency view displays multi-element components (chips, select lists)
    When user views chips representing "Besoins": [Nettoyage, Jardinage, Autres]
    Then chip styling follows SP4.1:
      | Property           | Value          |
      | background-color   | #F0F0F0       |
      | border-radius      | 16px          |
      | padding            | 6px 12px      |
      | font-size          | 14px          |
    And chips are consistent across all MP4 pages

  Scenario: AC4 - Hover/active states are implemented on all interactive elements
    Given user is logged in as commercial
    And client detail page is displayed with interactive elements
    When user hovers over an action icon
    Then hover state is applied:
      | Property      | Hover Value    |
      | background    | rgba(0,0,0,0.1)|
      | transform     | scale(1.1)     |
      | cursor        | pointer        |
    And active state (when clicked) shows:
      | Property      | Active Value   |
      | background    | rgba(0,0,0,0.2)|
      | transform     | scale(0.95)    |

  Scenario: AC5 - Responsive design is validated (mobile, tablet, desktop)
    Given user is logged in as commercial
    And user accesses MP4 client page on different viewport sizes
    When viewing on mobile (375px), tablet (768px), desktop (1920px)
    Then layout adapts correctly:
      | Viewport  | Icon Size | Tag Display | Chips Visible |
      | Mobile    | 20px      | Stacked     | 2 visible     |
      | Tablet    | 22px      | Inline      | 3 visible     |
      | Desktop   | 24px      | Inline      | All visible   |
    And no elements overlap or become cut off

  Scenario: AC6 - Colors and contrast meet WCAG AA standards
    Given user is logged in as commercial
    And MP4 pages display icons, tags, and multi-elements with colors
    When user runs accessibility audit with WCAG AA checker
    Then all text-on-color contrast ratios are >= 4.5:1
    And all UI component contrast ratios are >= 3:1
    And no color-only information (icon colors must be accompanied by text/shape)


# ============================================================================
# ORI-769 | Story | MP4 | 5 SP
# ============================================================================
# Summary: E4.1.1.E2. Fiche prospect/client PP - Vue Agence > RDV commerciaux: afficher localisation RDV
# Module: MP4 (Commercial/CRM)

Feature: ORI-769 | MP4 | Display RDV Location on Map in Client Card

  Scenario: AC1 - RDV detail displays a map with location (Google Maps or equivalent)
    Given user is logged in as commercial
    And commercial RDV "RDV-2026-08-15-Dupont" exists with address "123 Rue de la Paix, 75000 Paris"
    When user opens client "Jean Dupont" detail page
    And user navigates to "Agences" > RDV commerciaux section
    And user clicks "Détail" on RDV "RDV-2026-08-15-Dupont"
    Then RDV detail modal/drawer opens
    And embedded map is displayed showing the RDV location
    And map API call is made to render location

  Scenario: AC2 - GPS coordinates are correctly associated with RDV
    Given user is logged in as commercial
    And RDV exists with address: "123 Rue de la Paix, 75000 Paris" → GPS (48.8566, 2.3522)
    When RDV detail map loads
    Then map center is positioned at GPS coordinates (48.8566, 2.3522)
    And map zooms to appropriate level to show building context
    And marker is placed exactly at RDV GPS coordinates

  Scenario: AC3 - Map is interactive (zoom, pan)
    Given user is logged in as commercial
    And RDV detail map is displayed
    When user scrolls on map with mouse wheel
    Then map zoom in/out by 1 level per scroll action
    And map remains centered on RDV marker
    And zoom level is between 15 and 20 (street-level visibility)

  Scenario: AC4 - Marker points to exact RDV location
    Given user is logged in as commercial
    And RDV "RDV-2026-08-15-Dupont" detail map is open
    When user inspects the marker on map
    Then marker icon is clearly visible at GPS coordinates
    And marker shows tooltip: "123 Rue de la Paix, 75000 Paris"
    And clicking marker displays RDV information: address, time, contact

  Scenario: AC5 - Incomplete addresses display error or approximate location
    Given user is logged in as commercial
    And RDV "RDV-incomplete" has incomplete address: "Adresse incomplète"
    When user opens RDV detail with map
    Then map either:
      | Behavior                          |
      | Shows error: "Adresse invalide"  |
      | Or displays approximate location |
      | At center of known city/region   |
    And marker does not render at incorrect position

  Scenario: AC6 - Map loads in less than 2 seconds
    Given user is logged in as commercial
    When user opens RDV detail with map
    Then time to map render starts on detail modal open
    And map is fully interactive and visible within 2 seconds
    And performance metric tracked: map_load_time < 2000ms
    And if load time exceeds 2s, loading spinner is displayed


# ============================================================================
# ORI-773 | Story | MP1 | 5 SP
# ============================================================================
# Summary: [STE] E1.1.1 Modifier les données Légales et administratives d'une société: Coordonnées légales du siège social
# Module: MP1 (Structure/Société)

Feature: ORI-773 | MP1 | Modify Company Registered Office Address

  Scenario: AC1 - Form "Coordonnées légales siège social" displays for editing
    Given user is logged in as structure administrator
    And company "ACME Corp" exists with current registered office address
    When user navigates to Structure > Société > ACME Corp
    And user clicks "Modifier" in Legal & Administrative section
    Then modification form opens with title "Coordonnées légales du siège social"
    And form displays existing registered office address fields
    And form is in edit mode (all fields editable)

  Scenario: AC2 - All address fields (Rue, Code postal, Ville, Pays) are editable
    Given user is logged in as structure admin
    And company modification form for registered office is open
    When user inspects form fields
    Then all fields are present and editable:
      | Field       | Current Value                | Editable |
      | Rue         | "1 Rue de l'Église"         | Yes      |
      | Code postal | "75001"                     | Yes      |
      | Ville       | "Paris"                     | Yes      |
      | Pays        | "France"                    | Yes      |
    And each field accepts user input with real-time validation

  Scenario: AC3 - Postal code validation respects French format (5 digits)
    Given user is logged in as structure admin
    And company address form is open
    When user enters invalid postal code formats:
      | Input      | Expected Error           |
      | "750"      | "Format invalide (5 chiffres)" |
      | "750010"   | "Format invalide (5 chiffres)" |
      | "ABCDE"    | "Format invalide (5 chiffres)" |
      | "75001"    | No error - Valid format  |
    Then form shows validation error for each invalid format
    And valid format "75001" is accepted

  Scenario: AC4 - Automatic geolocation optionally suggests addresses
    Given user is logged in as structure admin
    And company address form is open
    When user enters "10 Boulevard de la"
    And form has geolocation enabled (optional feature)
    Then autocomplete suggestions appear:
      | Suggested Address                         | City   |
      | "10 Boulevard de la République, 75011..."| Paris  |
      | "10 Boulevard de la Tour, 75008..."       | Paris  |
    And user can select a suggestion to auto-fill address fields

  Scenario: AC5 - Modifications are saved to database
    Given user is logged in as structure admin
    And company address modification form is open
    When user changes address from "1 Rue de l'Église, 75001 Paris" to "10 Boulevard de la République, 75011 Paris"
    And user clicks "Enregistrer"
    Then API endpoint PATCH /api/societes/{id}/registered_address is called
    And response status is 200 OK
    And database record is updated with new address
    And modification timestamp is recorded

  Scenario: AC6 - Modification history is conserved (audit trail)
    Given user is logged in as structure admin
    And company "ACME Corp" has previous address modifications
    When user views the company audit log
    Then audit log shows:
      | Timestamp  | Field              | Old Value                  | New Value                    | User    |
      | 2026-07-21 | registered_office  | "1 Rue de l'Église..."     | "10 Boulevard...75011..."    | admin@  |
    And each modification includes user, timestamp, and before/after values
    And audit trail is immutable and complete


# ============================================================================
# ORI-783 | Story | MP1 | 13 SP
# ============================================================================
# Summary: [ETAB] E.1.1.1 Modifier les Aspects Juridiques d'un établissement
# Module: MP1 (Structure/Établissement)

Feature: ORI-783 | MP1 | Modify Establishment Legal Aspects

  Scenario: AC1 - Aspects juridiques screen displays with all required fields
    Given user is logged in as structure administrator
    And establishment "ETA-001" exists in database
    When user navigates to Structure > Établissements > ETA-001 > Edit Legal Aspects
    Then screen "Aspects juridiques" opens
    And all required fields are displayed on form
    And fields are organized in logical sections (Legal Form, Capital, Activity, Tax Regime)

  Scenario: AC2 - All fields (Forme juridique, Capital, Activité NAF, etc.) are editable
    Given user is logged in as structure admin
    And legal aspects form for establishment is open
    When user inspects form fields
    Then editable fields include:
      | Field              | Type         | Current Value        |
      | Forme juridique    | Dropdown     | "EURL"               |
      | Capital            | Currency     | "10000 EUR"          |
      | Activité NAF       | Autocomplete | "8211Z"              |
      | Régime fiscal      | Dropdown     | "Réel"               |
      | Adresse siège      | Text input   | "1 Rue de..."        |
    And each field can be modified and shows changes in real-time

  Scenario: AC3 - NAF codes are validated by INSEE API if applicable
    Given user is logged in as structure admin
    And legal aspects form is open
    When user enters NAF code "8211Z" (Application development)
    And form triggers NAF validation
    Then backend calls INSEE API to validate NAF code
    And API returns valid NAF code metadata:
      | Property      | Value           |
      | code          | 8211Z           |
      | label         | "Développement d'applications" |
      | division      | "Activités informatiques" |
    And validation passes and shows confirmation

  Scenario: AC4 - Modifications are saved with modification history
    Given user is logged in as structure admin
    And legal aspects form for "ETA-001" is open with existing data
    When user changes Capital from "10000" to "15000"
    And user changes Régime from "Réel" to "Micro"
    And user clicks "Enregistrer"
    Then API endpoint PATCH /api/etablissements/{id}/legal_aspects is called
    And response status is 200 OK
    And modifications are persisted in database
    And audit log records: timestamp, user, fields changed, before/after values

  Scenario: AC5 - Capital immutability business rules are applied (capital not reducible below X)
    Given user is logged in as structure admin
    And establishment "ETA-001" currently has Capital "10000 EUR"
    When user attempts to reduce Capital to "5000 EUR"
    And user clicks "Enregistrer"
    Then backend validation rule checks capital immutability
    And error is returned: "Le capital social ne peut pas être réduit en-dessous de la limite de [X EUR]"
    And form submission is rejected

  Scenario: AC6 - Optional approval workflow based on user role
    Given user is logged in as structure administrator
    And legal aspects form modification is complete
    When user role is "Admin Établissement" (non-super-admin)
    Then form displays "Soumettre pour approbation" instead of direct save
    And submitted changes go to queue for approval by "Admin Structure"
    And notification is sent to approvers
    And changes remain in pending state until approved


# ============================================================================
# ORI-863 | Story | MP5 | 3 SP
# ============================================================================
# Summary: E5.2.1.D8 Notifier les erreurs détectées lors de la suppression d'une série d'interventions
# Module: MP5 (Planning/Interventions)

Feature: ORI-863 | MP5 | Notify Errors on Bulk Intervention Deletion

  Scenario: AC1 - Notification appears when intervention deletion fails
    Given user is logged in as planning administrator
    And series of 5 interventions to delete: [INT-001, INT-002, INT-003, INT-004, INT-005]
    When user selects all 5 interventions and clicks "Supprimer la série"
    And INT-002 deletion fails (validation error)
    Then error notification appears on screen
    And notification is dismissible but stays visible for user action

  Scenario: AC2 - Error message describes the reason for failure
    Given user is logged in as planning admin
    And INT-002 intervention cannot be deleted because it's validated
    When deletion attempt triggers error
    Then error notification message displays:
      | Message                                                    |
      | "Intervention INT-002 validée, impossible à supprimer"   |
      | "Raison: Pointages validés bloquent la suppression"      |
    And specific reason is clear and actionable

  Scenario: AC3 - Business errors distinguished from technical errors
    Given user is logged in as planning admin
    When deletion errors occur:
      | Scenario                          | Error Type     | Message Format            |
      | Intervention validated            | Business error | "Intervention INT-002..." |
      | Database connection timeout       | Technical error| "Erreur système..."       |
      | Insufficient permissions          | Business error | "Vous n'avez pas..."      |
    Then notification type (error color/icon) matches error classification
    And technical errors include support contact information

  Scenario: AC4 - Notification includes link to view details or retry
    Given user is logged in as planning admin
    And deletion error notification is displayed
    When user inspects notification UI
    Then notification includes clickable elements:
      | Action Button    | Action                        |
      | "Voir détails"  | Open modal with full error log|
      | "Réessayer"     | Retry failed deletions        |
      | "Fermer"        | Dismiss notification          |
    And clicking "Voir détails" shows which specific interventions failed

  Scenario: AC5 - Multiple errors in a series are grouped/listed
    Given user is logged in as planning admin
    And bulk delete attempt: 5 interventions, 3 fail with different reasons
    When error notification displays
    Then notification shows grouped error summary:
      | Error Count | Description              |
      | 3 erreurs   | Interventions non-supprimées |
    And expandable list shows:
      | INT-002 | Intervention validée           |
      | INT-004 | Pointage rejeté, historique    |
      | INT-005 | Pas de permissions suffisantes |
    And 2 interventions are successfully marked as deleted in list

  Scenario: AC6 - Error history is logged
    Given user is logged in as planning admin
    And bulk deletion with errors has occurred
    When user opens application logs/audit trail
    Then audit log records:
      | Timestamp  | Action              | Initiator | Errors                    | Status  |
      | 2026-07-21 | Bulk delete series  | admin@... | [INT-002, INT-004]        | Partial |
    And log entry includes: timestamp, user, operation, affected items, error codes
    And logs are retained for compliance/audit purposes


# ============================================================================
# ORI-957 | Task | Transverse | 3 SP
# ============================================================================
# Summary: Cartographie: application des styles de la maquette
# Module: Transverse

Feature: ORI-957 | Transverse | Apply Design Mockup Styles to Map Component

  Scenario: AC1 - Map applies design mockup styles (colors, lines, fonts)
    Given map component is rendered on coverage zones page
    When user views the map
    Then map styling matches mockup specification:
      | Element          | CSS Property      | Mockup Value  |
      | Map background   | background-color  | #F0F4F8       |
      | Zone boundaries  | stroke-color      | #2E5090       |
      | Zone boundaries  | stroke-width      | 2px           |
      | Zone label font  | font-family       | "Roboto"      |
      | Zone label size  | font-size         | 14px          |

  Scenario: AC2 - Colors, strokes, fonts respect design specification
    Given map rendering engine is active
    When inspecting rendered map elements
    Then all visual properties match design tokens:
      | Zone Type       | Fill Color | Border Color | Opacity |
      | Priority zone   | #E8F4F8    | #2E5090      | 1.0     |
      | Secondary zone  | #F5F9FB    | #7A9FBE      | 0.8     |
      | Coverage area   | #FFFACD    | #9B8E00      | 0.6     |
    And font rendering matches specified typeface without substitutions

  Scenario: AC3 - Interactions (hover, click, zoom) have defined animations
    Given user is logged in and viewing map
    When user hovers over a coverage zone
    Then zone transitions smoothly:
      | Property      | Transition      |
      | Fill color    | Changes to #D0E8F6 over 200ms |
      | Opacity       | Increases to 1.0 over 200ms |
      | Cursor        | Changes to pointer       |
    And click action causes defined animation:
      | Action        | Animation                   |
      | Zone selected | Pulse effect 1.1x scale     |
      | Zone selected | Border highlight 3px        |

  Scenario: AC4 - Map is responsive across mobile to desktop viewports
    Given map component loaded on multiple device sizes
    When viewing on mobile (375px), tablet (768px), desktop (1920px)
    Then map rendering is responsive:
      | Viewport  | Map Size    | Labels Visible | Zoom Default |
      | Mobile    | Full width  | Abbreviated    | Level 12     |
      | Tablet    | 90% width   | Full names     | Level 13     |
      | Desktop   | 95% width   | Full names     | Level 14     |
    And no elements overflow or become inaccessible

  Scenario: AC5 - Performance optimized (render < 1s)
    Given map component initialization begins
    When performance metrics are collected
    Then rendering completes within specified time:
      | Metric               | Target   | Actual   |
      | Initial render       | < 1000ms | Record   |
      | Zone interaction     | < 100ms  | Record   |
      | Pan/zoom animation   | 60 FPS   | Record   |
    And rendering is GPU-accelerated for smooth animations

  Scenario: AC6 - Visual regression tests pass across all pages
    Given visual regression testing framework is configured
    When running visual regression suite on all pages with maps
    Then all pages pass regression tests:
      | Page                         | Status |
      | Coverage Zones dashboard     | Pass   |
      | Agency detail with service area | Pass |
      | Planning map view            | Pass   |
    And baseline screenshots match current rendered output
    And no unexpected visual changes detected


# ============================================================================
# ORI-1007 | Story | MP5 | 8 SP
# ============================================================================
# Summary: E5.2.1.D11 Notifier une durée de réalisation
# Module: MP5 (Planning/Interventions)

Feature: ORI-1007 | MP5 | Notify Duration Overrun

  Scenario: AC1 - Notification displays when actual duration exceeds planned duration (configurable threshold)
    Given user is logged in as planning administrator
    And intervention INT-001 planned for 2 hours with 10% threshold tolerance
    When intervention actual duration recorded as 2.5 hours (25% overrun)
    Then notification is triggered and displayed to user
    And notification is shown in notification center or dashboard
    And notification contains: "Durée dépassée: Intervention INT-001"

  Scenario: AC2 - Notification includes both planned and actual duration values
    Given user is logged in as planning admin
    And intervention duration overrun notification is displayed
    When user opens the notification
    Then notification content shows:
      | Planned Duration  | 2h 00m        |
      | Actual Duration   | 2h 30m        |
      | Overrun           | +30m (25%)    |
      | Intervention      | INT-001       |
      | Date              | 2026-08-15    |
    And values are clearly formatted for quick comprehension

  Scenario: AC3 - Collaborator can confirm or refute the notification
    Given user is logged in as collaborator
    And duration overrun notification is displayed
    When user clicks on notification actions
    Then two action buttons are available:
      | Button         | Action                                    |
      | "Confirmer"    | Accept the overrun (duration is correct) |
      | "Contester"    | Refute the overrun (duration is wrong)  |
    And selecting an action updates the intervention status

  Scenario: AC4 - Duration overrun notifications are traceable (audit log)
    Given user is logged in as planning admin
    And multiple duration overrun notifications have been generated
    When accessing audit log for intervention INT-001
    Then audit trail shows:
      | Timestamp  | Event                 | Planned | Actual | User Response | User    |
      | 2026-07-21 | Duration overrun      | 2h      | 2.5h   | Confirmed     | collab@ |
    And each notification is logged with timestamp, values, and user response
    And logs are immutable and retained for compliance

  Scenario: AC5 - Duration overrun report synthesizes deviations
    Given user is logged in as planning manager
    When accessing "Duration Overrun Report" for period July 2026
    Then report displays:
      | Metric                          | Value  |
      | Total interventions analyzed    | 150    |
      | Interventions with overrun      | 45     |
      | Percentage of overruns          | 30%    |
      | Average overrun duration        | +18m   |
      | Contractors with most overruns  | [List] |
    And report is filterable by contractor, date range, threshold level

  Scenario: AC6 - Notification thresholds configurable by domain/service
    Given user is logged in as configuration administrator
    When accessing notification threshold settings
    Then configuration options are available:
      | Setting                    | Default | Editable |
      | Duration overrun threshold | 10%     | Yes      |
      | Notification enabled       | Yes     | Yes      |
      | Threshold by service type  | N/A     | Yes      |
      | Escalation rule            | Manager | Yes      |
    And saving configuration updates global notification behavior
    And changes apply to new notifications immediately


# ============================================================================
# ORI-1044 | Story | MP3 | 1 SP
# ============================================================================
# Summary: [Back] Notifier de la création ou de la modification d'une agence
# Module: MP3 (Collaborateurs/Agence)

Feature: ORI-1044 | MP3 | Notify Agency Creation or Modification Events

  Scenario: AC1 - Event is triggered when an agency is created
    Given agency creation event system is enabled
    When user (as HR admin) creates new agency "Agence Marseille"
    Then backend event handler is triggered immediately
    And event type "agence.created" is generated
    And event is ready for publication to message broker

  Scenario: AC2 - Event is triggered when an agency is modified
    Given agency modification event system is enabled
    And existing agency "Agence Marseille" in database
    When user modifies agency name to "Agence Marseille Métropole"
    And user saves modification
    Then backend event handler is triggered
    And event type "agence.updated" is generated
    And event includes delta (changed fields)

  Scenario: AC3 - Event includes key data (ID, Nom, Coordonnées, Modifications)
    Given backend event is created for agency modification
    When event is inspected
    Then event payload contains:
      | Field           | Example Value               | Present |
      | id              | "AGE-001"                   | Yes     |
      | nom             | "Agence Marseille Métropole"| Yes     |
      | adresse         | "1 Rue de Rivoli, 13000..." | Yes     |
      | telephone       | "+33 4 91 00 00 00"         | Yes     |
      | email           | "marseille@acme.fr"         | Yes     |
      | modifications   | ["nom", "adresse"]          | Yes     |
      | timestamp       | "2026-07-21T14:30:00Z"      | Yes     |
    And event is serialized in JSON format

  Scenario: AC4 - Event is published to message broker (Kafka, RabbitMQ, etc.)
    Given backend event is created
    When event publication process begins
    Then event is published to configured broker:
      | Broker Type | Topic/Queue      | Result     |
      | Kafka       | "orion.agencies" | Published  |
      | OR          |                  |            |
      | RabbitMQ    | "agencies"       | Published  |
    And broker confirms message receipt with confirmation ID
    And event remains in broker for subscriber consumption

  Scenario: AC5 - Event subscribers (CRM, Planning, etc.) receive notifications
    Given event is published to broker
    And subscribers are registered for "agence.created", "agence.updated" events
    When subscribers consume event
    Then each subscriber receives event payload:
      | Subscriber   | Event Received | Action                                |
      | CRM Module   | agence.updated | Update agent-agency associations     |
      | Planning Mod | agence.updated | Refresh available scheduling zones   |
      | Finance Mod  | agence.updated | Update billing address if applicable |
    And subscribers process event independently

  Scenario: AC6 - Event is traceable and persisted (audit trail)
    Given event has been published and processed
    When accessing event audit log
    Then audit log shows:
      | Timestamp  | Event Type     | Agency    | Initiator | Status    | Published |
      | 2026-07-21 | agence.updated | AGE-001   | admin@... | Published | Kafka     |
    And event history is immutable and retained indefinitely
    And event includes: correlation ID for tracing across systems


# ============================================================================
# ORI-1062 | Task | Transverse | 5 SP
# ============================================================================
# Summary: Integration de carto dans drawer consultation rendez-vous commercial Client Particulier
# Module: Transverse

Feature: ORI-1062 | Transverse | Integrate Map in Commercial RDV Consultation Drawer

  Scenario: AC1 - Drawer for RDV consultation includes embedded map
    Given user is logged in as commercial
    And commercial RDV "RDV-2026-08-15" exists for client "Jean Dupont"
    When user opens client detail and navigates to "RDV commerciaux"
    And user clicks "Consulter" on RDV "RDV-2026-08-15"
    Then consultation drawer opens (side panel or modal)
    And embedded map component is visible in drawer (lower half)
    And map space allocated: minimum 300px height

  Scenario: AC2 - Map displays RDV location correctly
    Given RDV drawer is open with map
    And RDV address is "123 Rue de la Paix, 75000 Paris" → GPS (48.8566, 2.3522)
    When map renders
    Then map displays correct location:
      | Map Component | Value              |
      | Center        | (48.8566, 2.3522) |
      | Marker        | At GPS coordinates |
      | Address label | "123 Rue de..."    |
      | Default zoom  | Level 16           |

  Scenario: AC3 - Map is zoomable and panning possible
    Given RDV drawer with embedded map is open
    When user zooms in via mouse wheel
    Then map zoom increases by 1 level (from 16 to 17, etc.)
    And map remains centered on RDV marker
    And zoom range: min 14, max 20 (street level)
    And when user pans by dragging map
    Then map viewport shifts smoothly following cursor
    And marker remains visible in viewport

  Scenario: AC4 - Map load is optimized (doesn't block drawer opening)
    Given user is about to open RDV consultation drawer
    When user clicks "Consulter" on RDV
    Then drawer opens immediately (< 200ms)
    And drawer displays RDV information text before map loads
    And map loads asynchronously in background (< 1s)
    And loading spinner appears in map area during load

  Scenario: AC5 - Map is responsive and mobile-friendly
    Given RDV drawer is open on mobile device (375px width)
    When drawer displays RDV and map
    Then layout adapts:
      | Viewport | Drawer Width | Map Size  | Scrollable |
      | Mobile   | Full         | 100% × 300px | Vertical |
      | Tablet   | 50%          | 100% × 350px | No       |
    And all controls (zoom, pan) remain accessible on touch devices
    And map touches edges without overflow

  Scenario: AC6 - Invalid addresses display graceful error
    Given RDV has incomplete/invalid address: "Adresse incomplète"
    When user opens RDV drawer with invalid address
    Then map shows error state:
      | Message                  | Fallback                      |
      | "Adresse non valide"    | Map centered on default zone |
      | "Impossible de géolocaliser" | Generic city/region center |
    And error message is user-friendly
    And drawer remains usable (no crash)


# ============================================================================
# ORI-1064 | Task | MP4 | 8 SP
# ============================================================================
# Summary: Envoi Flux inter-domaine Client vers le domaine Planning
# Module: MP4 (Commercial/CRM)

Feature: ORI-1064 | MP4 | Send Inter-Domain Client-to-Planning Event Flow

  Scenario: AC1 - When Client is created in MP4, flux is sent to MP5 Planning
    Given backend event system is configured
    When user creates new client "Alice Dupont" in CRM module (MP4)
    Then event "client.created" is published
    And event is routed to Planning module (MP5)
    And Planning module receives notification within 2 seconds

  Scenario: AC2 - Essential client data is included in flux (ID, Nom, Coordonnées, Agence)
    Given client creation event has been published
    When Planning module receives flux
    Then flux payload includes:
      | Field        | Example Value             | Required |
      | clientId     | "C-001"                  | Yes      |
      | nom          | "Alice Dupont"           | Yes      |
      | prenom       | "Alice"                  | Yes      |
      | adresse      | "10 Rue de la Paix..."   | Yes      |
      | telephone    | "+33 6 12 34 56 78"      | Yes      |
      | email        | "alice@example.fr"       | Yes      |
      | agenceId     | "AGE-001"                | Yes      |
      | coordGPS     | (48.8566, 2.3522)        | No       |
    And all required fields are present and non-empty

  Scenario: AC3 - Flux respects schema defined by MP5 Planning
    Given inter-domain flux specification exists for client sync
    When flux is created and published
    Then flux conforms to Planning schema:
      | Constraint                        | Validation |
      | Field names match schema          | Pass       |
      | Field data types are correct      | Pass       |
      | Required fields are present       | Pass       |
      | No unexpected fields              | Pass       |
      | Maximum payload size: 10KB        | Pass       |
    And schema validation passes before publication

  Scenario: AC4 - Send errors are logged and retried
    Given Planning module is temporarily unavailable
    When client flux is published
    Then send failure is detected
    And error is logged with timestamp, client ID, error code
    And retry mechanism activates:
      | Attempt | Delay | Backoff Type   |
      | 1       | 1s    | Immediate      |
      | 2       | 2s    | Exponential    |
      | 3       | 4s    | Exponential    |
    And after 3 retries, error is escalated to alert queue

  Scenario: AC5 - Circuit-breaker prevents overload if MP5 is unavailable
    Given Planning module is down or unreachable
    When continuous client events are created
    Then circuit-breaker activates after 5 consecutive failures
    And circuit-breaker state: OPEN
    And new client events are queued locally (not sent)
    And after 30 seconds, circuit-breaker tries HALF_OPEN state
    And if Planning recovers, circuit-breaker returns to CLOSED
    And queued events are flushed to Planning once service recovers

  Scenario: AC6 - Events are idempotent (no duplicates on resend)
    Given client creation event has unique eventId "evt-1234567890"
    When same event is accidentally published twice (or resent)
    Then Planning module receives both events
    And Planning uses eventId to detect duplicate
    And Planning applies idempotency check:
      | Check              | Result                                  |
      | First event        | Processed, client created              |
      | Second event       | Deduplicated, no duplicate client      |
      | Event ID stored    | "evt-1234567890" marked as processed  |
    And only one client record is created in Planning


# ============================================================================
# ORI-1065 | Story | MP2 | 3 SP
# ============================================================================
# Summary: E2.1.4.A Consulter la liste des options
# Module: MP2 (Catalogue/Options)

Feature: ORI-1065 | MP2 | List All Catalog Options

  Scenario: AC1 - Options list screen displays all catalog options
    Given user is logged in as administrator or commercial
    When user navigates to Catalogue > Options
    Then options list screen loads
    And screen shows all options from database
    And total count displayed: "100+ options"

  Scenario: AC2 - List is paginated (50 items/page) or scrollable
    Given options list is displayed with 100+ total options
    When user scrolls to bottom of initial page
    Then one of the following occurs:
      | Behavior              | Implementation     |
      | Next page button      | "Page 2" loads 50  |
      | Infinite scroll       | 50 more items load |
      | Load more button      | Click to load more |
    And pagination/scroll mechanism works smoothly

  Scenario: AC3 - Columns (ID, Nom, Prix, Famille, Statut) are displayed
    Given options list is visible
    When user inspects table columns
    Then all columns are present and aligned:
      | Column    | Type    | Example Value                |
      | ID        | Text    | "OPT-001"                   |
      | Nom       | Text    | "Premium Cleaning"          |
      | Prix      | Currency| "€50.00"                    |
      | Famille   | Text    | "Nettoyage"                 |
      | Statut    | Badge   | "Actif" (green)             |
    And columns are sortable by clicking header

  Scenario: AC4 - Clicking option opens detail/modal
    Given options list is displayed
    When user clicks on option row "Premium Cleaning"
    Then detail modal/side panel opens
    And modal title shows "Premium Cleaning"
    And modal displays full option details:
      | Field        | Value              |
      | ID           | OPT-001            |
      | Nom          | Premium Cleaning   |
      | Prix         | €50.00             |
      | Famille      | Nettoyage          |
      | Description  | "Quick clean 2h"   |
      | Statut       | Actif              |

  Scenario: AC5 - Filters (by Famille, Statut) work correctly
    Given options list shows options from multiple families and statuses
    When user clicks filter dropdown "Famille"
    And user selects "Nettoyage"
    Then list is filtered:
      | Filtered Results | Before | After |
      | Total options    | 100+   | 35    |
      | All show Famille | Various | "Nettoyage" |
    And filter badge shows "Famille: Nettoyage"

  Scenario: AC6 - Search (by Nom) works with autocomplete
    Given options list is displayed
    When user types in search field "cleaning"
    Then autocomplete suggestions appear:
      | Suggestion           | Family      |
      | "Premium Cleaning"   | Nettoyage   |
      | "Basic Cleaning"     | Nettoyage   |
      | "Eco Cleaning Kit"   | Produits    |
    And clicking suggestion selects it and filters list
    And search results show matching options by name (partial match)


# ============================================================================
# ORI-1066 | Task | MP4 | 5 SP
# ============================================================================
# Summary: Integration du composant transverse plage horaires au niveau de la fiche client
# Module: MP4 (Commercial/CRM)

Feature: ORI-1066 | MP4 | Integrate Time Slot Component in Client Card

  Scenario: AC1 - Time slot component integrates correctly in client card
    Given user is logged in as commercial
    And client "Jean Dupont" detail page is open
    When user scrolls to "Disponibilités" section
    Then time slot component is rendered within the section
    And component displays title "Créneaux de disponibilité"
    And time slot controls are functional and interactive

  Scenario: AC2 - Existing time slots are displayed correctly
    Given client "Jean Dupont" has existing time slots:
      | Days              | Start | End   |
      | Monday-Friday     | 09:00 | 12:00 |
      | Monday-Friday     | 14:00 | 18:00 |
      | Saturday          | 10:00 | 12:00 |
    When component renders
    Then all existing time slots are displayed in table format
    And each slot shows: Days, Start time, End time, Action buttons (Edit, Delete)

  Scenario: AC3 - Adding/modifying/deleting time slots works
    Given client time slot component is open
    When user clicks "Ajouter créneau" button
    Then time slot form appears with fields:
      | Field    | Type          |
      | Jours    | Multi-select  |
      | Heure dé| Time picker   |
      | Heure fin| Time picker   |
    And user selects "Wednesday", "10:00", "12:00"
    And clicks "Ajouter"
    Then new slot is added to list and visible immediately

  Scenario: AC4 - Overlap validation is applied
    Given existing time slot: Monday 09:00-12:00
    When user attempts to add overlapping slot: Monday 11:00-13:00
    And clicks "Ajouter"
    Then validation error is displayed: "Créneau chevauche avec créneau existant"
    And slot is not added to list
    And user is prompted to select different time

  Scenario: AC5 - Time slot data is persisted
    Given user has added new time slot: Wednesday 10:00-12:00
    When user clicks "Enregistrer" on client card
    Then API endpoint PATCH /api/clients/{id}/time_slots is called
    And request includes all time slots (added + existing)
    And response status 200 OK
    And client database record is updated with time slots

  Scenario: AC6 - Component is responsive and accessible
    Given time slot component is displayed on different devices
    When viewing on mobile (375px), tablet (768px), desktop (1920px)
    Then component adapts:
      | Viewport | Table Display | Form Layout | Accessibility |
      | Mobile   | Stacked rows  | Full width  | WCAG AA       |
      | Tablet   | Compact table | Side panel  | WCAG AA       |
      | Desktop  | Full table    | Modal       | WCAG AA       |
    And all interactive elements are keyboard accessible (Tab, Enter, Esc)


# ============================================================================
# ORI-1067 | Story | MP2 | 8 SP
# ============================================================================
# Summary: E2.1.4.B Créer une option
# Module: MP2 (Catalogue/Options)

Feature: ORI-1067 | MP2 | Create Catalog Option

  Scenario: AC1 - Option creation form displays correctly
    Given user is logged in as administrator
    When user navigates to Catalogue > Options > "Créer option"
    Then creation form opens with title "Nouvelle option"
    And form displays all required fields
    And form is in focused/active state ready for input

  Scenario: AC2 - All required fields (Nom, Prix, Famille, Description) are present
    Given option creation form is open
    When user inspects form
    Then form contains fields:
      | Field Name    | Type              | Required | Placeholder                |
      | Nom           | Text input        | Yes      | "Entrez le nom..."         |
      | Prix          | Currency input    | Yes      | "0.00 €"                   |
      | Famille       | Dropdown select   | Yes      | "Sélectionnez..."          |
      | Description   | Text area         | No       | "Description optionnelle..."| 
      | Statut        | Radio/Toggle      | Yes      | "Actif" (default)          |
    And each required field is marked with "*"

  Scenario: AC3 - Field validation works (unique name, price > 0)
    Given option creation form is open
    When user enters invalid values:
      | Field      | Value      | Expected Error              |
      | Nom        | ""         | "Le champ 'Nom' est requis" |
      | Nom        | "Premium"* | "Ce nom existe déjà"        |
      | Prix       | "0"        | "Le prix doit être > 0 €"   |
      | Prix       | "-10"      | "Le prix doit être > 0 €"   |
      | Famille    | [none]     | "Sélectionnez une famille"  |
    Then validation error is shown for each invalid field
    And form submission is prevented

  Scenario: AC4 - New option is added to list successfully
    Given option creation form with valid data: "Express Cleaning", "€45.00", "Nettoyage"
    When user clicks "Créer option"
    Then API endpoint POST /api/options is called
    And response status 201 Created
    And option is added to database
    And option appears in options list immediately (or after refresh)
    And option shows with all entered values

  Scenario: AC5 - Success notification is displayed
    Given option "Express Cleaning" has been successfully created
    When creation completes
    Then success notification appears:
      | Message                                    |
      | "Option 'Express Cleaning' créée avec..."  |
    And notification auto-dismisses after 5 seconds
    And user can dismiss notification by clicking X

  Scenario: AC6 - User can create multiple options in succession (without refresh)
    Given option "Option 1" has been successfully created
    When form automatically resets
    Then form is cleared and ready for new option:
      | Field    | Value   |
      | Nom      | Empty   |
      | Prix     | Empty   |
      | Famille  | Default |
    And user can immediately enter new option data
    And creating "Option 2" works without page reload
    And both options appear in list


# ============================================================================
# ORI-1068 | Story | MP4 | 3 SP
# ============================================================================
# Summary: E4.2.B1. Fiche prospect/client Particulier - Qualifier un besoin => Viewer/Renderer
# Module: MP4 (Commercial/CRM)

Feature: ORI-1068 | MP4 | Qualify Client Need with Viewer/Renderer

  Scenario: AC1 - Need qualification form displays in client card
    Given user is logged in as commercial
    And client "Jean Dupont" detail page is open
    And "Besoins" section shows need "Nettoyage" with status "Nouveau"
    When user clicks "Qualifier" on the need row
    Then qualification form opens (modal or side panel)
    And form title shows "Qualifier le besoin: Nettoyage"

  Scenario: AC2 - Qualification fields (Priorité, Type besoin, Budget, Urgence) are present
    Given need qualification form is open
    When user inspects form fields
    Then form contains qualification fields:
      | Field Name   | Type         | Options/Values               |
      | Priorité     | Dropdown     | Basse, Normale, Haute       |
      | Type besoin  | Dropdown     | Nettoyage, Jardinage, etc.  |
      | Budget       | Currency     | "500 €"                     |
      | Urgence      | Dropdown     | Normale, Immédiate, Planifié|
      | Commentaires | Text area    | Optional notes              |

  Scenario: AC3 - Data is validated on client and server sides
    Given qualification form is open
    When user enters data and submits form with invalid values:
      | Field      | Invalid Value | Expected Error               |
      | Budget     | "-100"        | "Le budget doit être > 0"   |
      | Priorité   | [empty]       | "Priorité est obligatoire"  |
    Then client-side validation shows error immediately
    And form submission is prevented
    And server validation also rejects if bypassed

  Scenario: AC4 - Qualified need changes status from Nouveau to Qualifié
    Given need status is currently "Nouveau"
    When user fills qualification form with valid data
    And user clicks "Enregistrer qualification"
    Then API endpoint POST /api/needs/{id}/qualify is called
    And response status 200 OK
    And need status in database changes to "Qualifié"
    And UI immediately reflects status change

  Scenario: AC5 - Viewer available to view qualified need data
    Given need is now qualified with data: Priorité=Haute, Budget=500€
    When user clicks "Voir détail" or views need in list
    Then need viewer opens/displays showing:
      | Field           | Value      |
      | Status          | Qualifié   |
      | Priorité        | Haute      |
      | Budget          | 500 €      |
      | Date qualification | 2026-07-21 |

  Scenario: AC6 - Renderer formats qualified need data for display
    Given need viewer is open with qualified need
    When user inspects need detail rendering
    Then data is formatted and displayed clearly:
      | Component        | Rendering             |
      | Field labels     | Bold, clear           |
      | Numeric values   | Right-aligned         |
      | Dates            | Format: "21/07/2026"  |
      | Currency         | Format: "500,00 €"    |
    And rendering uses consistent styling from design system


# ============================================================================
# ORI-1072 | Task | MP2 | 5 SP
# ============================================================================
# Summary: Front-End: E2.1.4.A Consulter la liste des options
# Module: MP2 (Catalogue/Options)

Feature: ORI-1072 | MP2 Frontend | Display Options List

  Scenario: AC1 - Options list loads quickly (< 2s) from API
    Given user is logged in as administrator
    When user navigates to Catalogue > Options
    Then load time is measured from navigation start
    And options list is fully rendered within 2 seconds
    And performance metric: load_time < 2000ms
    And all API calls complete successfully

  Scenario: AC2 - Table is responsive (mobile, tablet, desktop)
    Given options list is displayed
    When viewing on different device sizes: 375px, 768px, 1920px
    Then table adapts appropriately:
      | Viewport  | Columns Visible | Layout       | Scrollable |
      | Mobile    | ID, Nom, Actions| Compact      | Horizontal |
      | Tablet    | ID, Nom, Prix   | Standard     | No         |
      | Desktop   | All columns     | Full width   | No         |
    And no horizontal scroll on tablet+
    And columns stack/reflow without overflow

  Scenario: AC3 - Columns are resizable and sortable
    Given options list is displayed
    When user clicks between column headers to resize
    Then column width changes according to drag distance
    And other columns adjust proportionally
    And when user clicks column header "Nom"
    Then list sorts by Nom (ascending first, then descending on second click)
    And sort indicator (arrow) appears on column header

  Scenario: AC4 - Filters and search are integrated UX-friendly
    Given options list shows filters and search bar
    When user clicks "Famille" filter
    Then dropdown list appears with family options
    And selecting a family immediately filters table
    And when user types in search "Premium"
    Then search results show options matching "Premium"
    And results update with each character typed (debounced)

  Scenario: AC5 - Paginator functions correctly
    Given options list shows page 1 of 3
    When user clicks "Suivant" button
    Then page 2 loads with next 50 options
    And page indicator updates: "Page 2 of 3"
    And when user clicks page number "3"
    Then page 3 loads immediately
    And "Précédent" button is enabled on page 2+

  Scenario: AC6 - Styling follows design system (SP4.1)
    Given options list is displayed
    When user inspects table styling
    Then styling matches SP4.1 tokens:
      | Element       | Style Property     | Value               |
      | Header        | background-color   | #F5F7FA             |
      | Header text   | font-weight        | 600                 |
      | Row height    | height             | 48px                |
      | Hover row     | background-color   | #FAFBFC             |
      | Borders       | border-color       | #E1E8F0             |
    And all interactive elements have proper hover/active states


# ============================================================================
# ORI-1073 | Task | MP2 | 3 SP
# ============================================================================
# Summary: Front-End: E2.1.4.B Créer une option
# Module: MP2 (Catalogue/Options)

Feature: ORI-1073 | MP2 Frontend | Create Option Form UX

  Scenario: AC1 - Creation form displays clearly and intuitively
    Given user navigates to create option
    When creation form loads
    Then form is visually clear with:
      | Element            | Present |
      | Form title         | Yes     |
      | Field labels       | Yes     |
      | Help text/placehol | Yes     |
      | Required indicator | Yes (*) |
      | Action buttons     | Yes     |
    And layout is clean and uncluttered

  Scenario: AC2 - Client-side validation shows errors in real-time
    Given option creation form is open
    When user enters data and field loses focus:
      | Field  | Entry           | Real-Time Error           |
      | Nom    | [empty]         | "Nom requis"              |
      | Prix   | "-50"           | "Prix doit être > 0"      |
      | Prix   | "abc"           | "Format invalide"         |
    Then error appears immediately below field in red text
    And error disappears when value is corrected

  Scenario: AC3 - Required fields have visual indicators (*)
    Given option creation form is displayed
    When user inspects form fields
    Then required fields show asterisk (*) in label:
      | Field     | Required | Indicator |
      | Nom       | Yes      | *         |
      | Prix      | Yes      | *         |
      | Famille   | Yes      | *         |
      | Description | No     | None      |
    And asterisk uses red color for visibility

  Scenario: AC4 - Create button disabled until form is valid
    Given empty creation form is open
    When form initially renders
    Then "Créer option" button is disabled (grayed out)
    And cursor shows "not-allowed" on hover
    And when user fills in Nom, Prix, Famille (all required fields valid)
    Then "Créer option" button becomes enabled
    And button is clickable and shows "pointer" cursor

  Scenario: AC5 - Loader displays during form submission
    Given valid form data is ready
    When user clicks "Créer option"
    Then spinner/loader appears overlaying the button
    And button text disappears or shows loading animation
    And form remains locked (fields disabled) during submission
    And loader persists until API response received

  Scenario: AC6 - Form resets after successful creation
    Given option has been successfully created
    When success notification confirms creation
    Then form automatically clears/resets:
      | Field       | State  |
      | Nom         | Empty  |
      | Prix        | Empty  |
      | Famille     | Default|
      | Description | Empty  |
    And form is ready for next option entry
    And "Créer option" button returns to disabled state


# ============================================================================
# ORI-1095 | Story | MP1 | 3 SP
# ============================================================================
# Summary: [Back] Notifier de la création ou de la modification d'une société
# Module: MP1 (Structure/Société)

Feature: ORI-1095 | MP1 | Notify Company Creation/Modification Events

  Scenario: AC1 - Event is triggered when a company is created
    Given company event system is configured
    When user (structure admin) creates new company "ACME Corp"
    Then backend event handler processes creation
    And event type "societe.created" is generated
    And event payload is prepared for broker publication

  Scenario: AC2 - Event is triggered when a company is modified
    Given company modification event system is enabled
    And company "ACME Corp" exists in database
    When user modifies company name to "ACME Corporation"
    And user saves modification
    Then backend event handler processes modification
    And event type "societe.updated" is generated
    And event is ready for publication

  Scenario: AC3 - Event includes key data (ID, SIREN, Nom, Changements)
    Given company event for modification is created
    When event payload is inspected
    Then event contains:
      | Field         | Example Value        | Present |
      | id            | "STE-001"           | Yes     |
      | siren         | "123456789"         | Yes     |
      | nom           | "ACME Corporation"  | Yes     |
      | adresse       | "1 Rue de..."       | Yes     |
      | changements   | ["nom", "adresse"]  | Yes     |
      | timestamp     | "2026-07-21T14..."  | Yes     |
      | user_id       | "admin@..."         | Yes     |

  Scenario: AC4 - Event is published to broker (Kafka, RabbitMQ, etc.)
    Given company event is prepared
    When broker publication process initiates
    Then event is published to configured message broker:
      | Broker Type | Topic/Queue        | Status      |
      | Kafka       | "orion.societes"   | Published   |
      | OR          |                    |             |
      | RabbitMQ    | "societes"         | Published   |
    And broker confirms receipt with correlation ID
    And event is available for consumer subscription

  Scenario: AC5 - Delta changes are included in event (before/after)
    Given company modification event is created
    And fields changed: nom (ACME→ACME Corp), statut (Actif→Suspendu)
    When event payload is examined
    Then delta information is included:
      | Field    | Before          | After            |
      | nom      | "ACME Corp"     | "ACME Corporation"|
      | statut   | "Actif"         | "Suspendu"       |
      | timestamp| 2026-07-21 14:00| 2026-07-21 14:30 |
    And unchanged fields are not included in delta

  Scenario: AC6 - Event is traceable and persisted (audit)
    Given event has been published and processed
    When accessing event audit trail
    Then audit log records:
      | Timestamp  | Event Type    | Company  | Delta         | User      | Broker |
      | 2026-07-21 | societe.updated | STE-001 | [nom, statut] | admin@... | Kafka  |
    And audit is immutable and retained indefinitely
    And event includes correlation ID for cross-system tracing


# ============================================================================
# ORI-1096 | Story | MP1 | 3 SP
# ============================================================================
# Summary: [Back] Notifier de la création ou de la modification d'un établissement
# Module: MP1 (Structure/Établissement)

Feature: ORI-1096 | MP1 | Notify Establishment Creation/Modification Events

  Scenario: AC1 - Event is triggered when an establishment is created
    Given establishment event system is configured
    When user creates new establishment "ACME Paris" in structure module
    Then backend event handler processes creation
    And event type "etablissement.created" is generated
    And event is prepared for broker publication

  Scenario: AC2 - Event is triggered when an establishment is modified
    Given establishment modification system is enabled
    And establishment "ACME Paris" exists in database
    When user modifies establishment address
    And saves modification
    Then backend event handler processes modification
    And event type "etablissement.updated" is generated
    And event is ready for publication to broker

  Scenario: AC3 - Event includes key data (ID, SIRET, Nom, Changements)
    Given establishment event is created for modification
    When event payload is inspected
    Then event contains:
      | Field      | Example Value            | Present |
      | id         | "ETAB-001"              | Yes     |
      | siret      | "12345678901234"        | Yes     |
      | nom        | "ACME Paris Métropole"  | Yes     |
      | adresse    | "1 Rue Rivoli, 75000..." | Yes     |
      | naf        | "8211Z"                 | Yes     |
      | changements| ["adresse", "naf"]      | Yes     |
      | timestamp  | "2026-07-21T14:30:00Z"  | Yes     |

  Scenario: AC4 - Event is published to message broker
    Given establishment event is prepared for publication
    When broker publication begins
    Then event is published to configured broker:
      | Broker Type | Topic/Queue          | Status    |
      | Kafka       | "orion.etablissements"| Published |
      | OR          |                      |           |
      | RabbitMQ    | "etablissements"     | Published |
    And broker acknowledgment confirms successful receipt
    And event is available for downstream consumer subscriptions

  Scenario: AC5 - Delta (changes) are included in event
    Given establishment modification event is created
    And fields modified: adresse (old_addr→new_addr), naf (old_code→new_code)
    When event payload is examined
    Then delta information is present:
      | Field   | Before              | After                     |
      | adresse | "1 Rue Rivoli..."   | "10 Boulevard...75011..." |
      | naf     | "8211Z"             | "8219Z"                   |
      | timestamp | 2026-07-21 14:00 | 2026-07-21 14:30          |
    And only changed fields are included in delta

  Scenario: AC6 - Event is traceable and persisted
    Given establishment event has been published and processed
    When accessing audit trail
    Then audit log contains:
      | Timestamp  | Event Type           | Establishment | Delta        | User    | Broker |
      | 2026-07-21 | etablissement.updated| ETAB-001      | [adresse, naf] | admin@  | Kafka  |
    And audit trail is immutable and retained for compliance
    And correlation ID enables tracing across systems


# ============================================================================
# END OF SPRINT13_RECETTE_23.feature
# ============================================================================
# Statistics:
# - Total Features: 23
# - Total Scenarios: 138 (6 scenarios per feature)
# - Module Coverage: MP1: 12, MP2: 30, MP3: 12, MP4: 42, MP5: 18, Transverse: 12
# - Total Acceptance Criteria Covered: 138
# ============================================================================
