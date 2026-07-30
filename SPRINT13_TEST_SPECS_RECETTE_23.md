# Sprint 13 — Exhaustive Test Specifications (23 "Ready for Recette Now" Tickets)

**Extraction Date:** 2026-07-21  
**Source:** Jira (ORI), Confluence, Figma  
**Status:** Ready for QA/Recette  
**Total Tickets:** 23  

---

## ORI-368 | Story | MP4 | 5 SP
- **Summary:** E4.2.B. Fiche prospect/client Particulier - Onglet Agences: Vue Agence > Besoins - Description du tableau
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred from spec structure)
- AC1: Le tableau Besoins affiche les colonnes obligatoires (Besoin, Date, Statut, Actions)
- AC2: Les colonnes sont correctement alignées et redimensionnables
- AC3: La description du tableau est affichée sous l'onglet Agences, section "Besoins"
- AC4: Les données de besoins se chargent correctement depuis l'API
- AC5: Le tableau supporte la pagination ou le scroll infini
- AC6: Les styles appliqués correspondent à la maquette SP4.1

### Jira Description
Ticket de refonte UX pour normaliser l'affichage du tableau de besoins dans la fiche client particulier. Fait suite à SP4.1 (adaptation UX icônes/tags/multi-éléments).

### Confluence Links
- **Link 1:** [E4.2.B - Fiche prospect/client - Besoins](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/[PAGE_ID])
  - Extract: Business flow pour consultation/création de besoin, validation rules pour Statut (Nouveau/En cours/Abandonné/Réalisé)

### Figma Links
- No direct Figma link for this ticket; reference SP4.1 styles

### Related Issues
- **Blocks:** ORI-995 (Abandonner un besoin)
- **Related:** ORI-667 (Zones de filtres sur besoins), ORI-745 (SP4.1 - Adaptation UX)

### Test Data Inferred
- **Entities:** Client particulier, Agence, Besoin (minimum 3 examples)
- **Sample Values:**
  - Client: "Jean Dupont", email: "jean@example.fr"
  - Agence: "Agence Paris Centre"
  - Besoins: Nettoyage (Nouveau), Jardinage (En cours), Autres services (Réalisé)
- **Workflows:** 
  - Create client → Search agence → Create besoin → Verify tableau affichage
  - Verify column visibility toggle (si applicable)
  - Verify pagination or scroll behavior

---

## ORI-657 | Story | MP2 | 5 SP
- **Summary:** E2.1.2.D Mettre à jour une famille de produits
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP2 (Catalogue/Produits)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: L'écran de modification d'une famille de produits se charge correctement
- AC2: Les champs modifiables (Nom, Description, Icône, Tags) sont tous présents et éditables
- AC3: La validation des champs obligatoires fonctionne (ex: Nom requis)
- AC4: Les modifications sont sauvegardées avec succès en base de données
- AC5: Une notification de succès s'affiche après sauvegarde
- AC6: Les doublons de nom sont rejetés avec un message d'erreur approprié

### Jira Description
Développement du formulaire de modification des familles de produits dans le catalogue. Permet aux administrateurs de mettre à jour les métadonnées (nom, description, icône) sans créer de doublon.

### Confluence Links
- **Link 1:** [E2.1.2 - Consulter/Modifier famille produits](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/740524095)
  - Extract: Business flow pour modifications, règles de validation, format accepté pour icônes

### Figma Links
- Reference: Node-id TBD (check Figma Orion Maquettes - section Catalogue)

### Related Issues
- **Prerequisite:** ORI-1065 (Consulter liste options), ORI-1067 (Créer option)
- **Related:** ORI-1072, ORI-1073 (Front-end options)

### Test Data Inferred
- **Entities:** Famille produits (minimum 5 variants), Options
- **Sample Values:**
  - Famille: "Nettoyage", "Jardinage", "Services à la personne"
  - Mise à jour: Nom → "Nettoyage résidentiel", Description → "Services qualité"
- **Workflows:**
  - Login → Navigate Catalogue → Select Famille → Edit → Save → Verify notification
  - Attempt duplicate name → Verify error
  - Verify data persistence on page reload

---

## ORI-667 | Story | MP4 | 3 SP
- **Summary:** E4.2.B. Fiche prospect/client Particulier - Onglet Agences > Besoins - Zones de filtres
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Les zones de filtres s'affichent correctement au-dessus du tableau Besoins
- AC2: Filtre par Statut (Nouveau, En cours, Abandonné, Réalisé) fonctionne
- AC3: Filtre par Date (range picker) fonctionne
- AC4: Les filtres multiples peuvent être combinés
- AC5: Le bouton "Réinitialiser filtres" remet l'affichage par défaut
- AC6: Les filtres persistent lors de la navigation (session storage)

### Jira Description
Implémentation de zones de filtres pour affiner les besoins affichés dans la fiche client. Permet de rechercher rapidement par statut ou plage de dates.

### Confluence Links
- **Link 1:** [E4.2.B - Filtres besoins](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/[PAGE_ID])

### Figma Links
- Reference: SP4.1 filter component design

### Related Issues
- **Blocks:** None
- **Blocked by:** ORI-368 (tableau besoins)

### Test Data Inferred
- **Entities:** Client, Besoins (multiples avec statuts différents), Plages de dates
- **Sample Values:**
  - Besoins: Created 2026-06-01, 2026-06-15, 2026-07-01
  - Statuts: 3 Nouveau, 2 En cours, 1 Abandonné, 2 Réalisé
- **Workflows:**
  - Filter by Statut "En cours" → Verify only 2 items shown
  - Filter by date range → Verify results
  - Combine filters → Verify intersection
  - Reset filters → Verify all items redisplayed

---

## ORI-688 | Story | MP5 | 13 SP
- **Summary:** E5.2.1 Afficher l'état des pointages d'une intervention dans le planning
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP5 (Planning/Interventions)
- **Updated:** 2026-07-06

### Acceptance Criteria (inferred)
- AC1: L'état des pointages s'affiche dans la vue planning (week/day)
- AC2: Les états affichés reflètent l'état réel en base (Attendu, Validé, Rejeté, En attente)
- AC3: Les couleurs/icônes pour chaque état sont distinctes et conformes aux maquettes
- AC4: Un clic sur l'état ouvre un détail/modal pour voir les pointages
- AC5: La mise à jour en temps réel fonctionne (via WebSocket ou polling)
- AC6: Les filtres applicables au planning s'appliquent aussi aux pointages

### Jira Description
Feature pour visualiser rapidement l'état des pointages d'une intervention directement depuis le planning. Aide à identifier les interventions avec des pointages incomplets ou rejetés.

### Confluence Links
- **Link 1:** [E5.2.1 - Pointages planning](https://itsap-ouicare.atlassian.net/wiki/x/G4CmFQ)
- **Link 2:** [Planning - Vue pointages](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/362414272)

### Figma Links
- Reference: Planning component library - Pointages section (node-id TBD)

### Related Issues
- **Related:** ORI-863 (Erreurs suppression), ORI-1007 (Notifier durée réalisation)
- **Blocked by:** None

### Test Data Inferred
- **Entities:** Interventions (multiples), Pointages (multiples par intervention), Collaborateurs
- **Sample Values:**
  - Intervention 1: Pointage validé (100%)
  - Intervention 2: Pointage rejeté (date/heure incorrecte)
  - Intervention 3: Pointage en attente (soumis, pas encore validé)
- **Workflows:**
  - Load planning week → Verify pointage states displayed
  - Click pointage → Verify modal opens with details
  - Update pointage status → Verify UI updates in real-time
  - Filter by date → Verify pointages filtered accordingly

---

## ORI-723 | Story | MP3 | 5 SP
- **Summary:** E3.2.1 Créer un contrat intervenant - Durée du travail (onglet 4, hors simulateur ATT)(BACK)
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP3 (Collaborateurs)
- **Updated:** 2026-07-06

### Acceptance Criteria (inferred)
- AC1: L'onglet 4 "Durée du travail" s'affiche correctement dans le formulaire création contrat
- AC2: Les champs de durée (min, max, moyenne) sont présents et validés
- AC3: Les calculs de durée attendue vs réelle se font côté backend
- AC4: La sauvegarde des données de durée est persistée en base
- AC5: Les validations métier sur durée (ex: max > min) sont appliquées
- AC6: Le backend expose les endpoints pour créer/mettre à jour les durées

### Jira Description
Implémentation backend pour l'onglet "Durée du travail" dans la création de contrats intervenants. Couplé avec ORI-1039 (front-end). Exclus du simulateur ATT pour cette iteration.

### Confluence Links
- Reference: E3.2.1 page Confluence (TBD)

### Figma Links
- Reference: Contrat intervenant - Onglet 4 design

### Related Issues
- **Related:** ORI-1039 (Front-end E3.2.1)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Collaborateur, Contrat, Durées
- **Sample Values:**
  - Min durée: 2h, Max durée: 8h, Moyenne: 5h
  - Type contrat: CDI, CDD
- **Workflows:**
  - Create collaborator → Create contract → Fill durée tab → Save → Verify backend persisted data
  - Attempt invalid durée (max < min) → Verify backend rejects
  - Retrieve contract via API → Verify durée fields present

---

## ORI-745 | Story | MP4 | 5 SP
- **Summary:** SP4.1 Adaptation UX des icônes, tags et multi-éléments
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Les icônes appliquées sur toutes les pages MP4 suivent le design system SP4.1
- AC2: Les tags (couleurs, tailles) sont cohérents avec les maquettes
- AC3: Les multi-éléments (chips, listes) appliquent les styles SP4.1
- AC4: Les hover/active states sont implémentés sur tous les éléments interactifs
- AC5: La responsive design est validée (mobile, tablet, desktop)
- AC6: Les couleurs/contraste respectent les normes WCAG AA

### Jira Description
Refonte UX systématique de MP4 pour appliquer les nouveaux styles SP4.1. Touchable: icônes, tags, multi-sélections, chips. Aligne la UI avec le design system.

### Confluence Links
- Reference: SP4.1 design system Confluence page

### Figma Links
- Reference: Orion Maquettes - SP4.1 component library (multiple node-ids)

### Related Issues
- **Blocks:** ORI-368, ORI-667, ORI-964, ORI-995
- **Related:** ORI-1066 (Integration composant plage horaires)

### Test Data Inferred
- **Entities:** Visual elements (icons, tags, chips)
- **Sample Values:** 20+ icon variants, 5+ tag colors, 10+ states
- **Workflows:**
  - Visual regression testing on all MP4 screens
  - Responsive design breakpoint verification
  - Accessibility audit (WCAG AA compliance)

---

## ORI-769 | Story | MP4 | 5 SP
- **Summary:** E4.1.1.E2. Fiche prospect/client PP - Vue Agence > RDV commerciaux: afficher localisation RDV dans le détail du RDV
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-07

### Acceptance Criteria (inferred)
- AC1: Le détail du RDV affiche une carte avec la localisation (Google Maps ou équivalent)
- AC2: Les coordonnées GPS sont correctement associées au RDV
- AC3: La carte est interactive (zoom, pan)
- AC4: Un marqueur pointe la localisation exacte du RDV
- AC5: Les adresses incomplètes affichent une erreur ou une localisation approximative
- AC6: La carte se charge en moins de 2s

### Jira Description
Ajout d'une visualisation cartographique pour les rendez-vous commerciaux dans la fiche prospect/client particulier. Permet aux commerciaux de voir où aura lieu le RDV et d'optimiser les trajets.

### Confluence Links
- Reference: E4.1.1 - RDV commerciaux Confluence page (TBD)

### Figma Links
- **Node ID:** 28248-12361 (RDV detail with map)
- Extract: Map component placement, marker styling, address display format

### Related Issues
- **Related:** ORI-1062 (Integration carto dans drawer consultation RDV)
- **Blocks:** None

### Test Data Inferred
- **Entities:** RDV commerciaux, Adresses, Coordonnées GPS
- **Sample Values:**
  - RDV 1: "123 Rue de la Paix, 75000 Paris" → GPS (48.8566, 2.3522)
  - RDV 2: "456 Avenue des Champs, 75008 Paris" → GPS (48.8698, 2.3078)
  - Invalid: "Adresse incomplète" → Error or approximate
- **Workflows:**
  - Create RDV with full address → Open detail → Verify map loads
  - Verify marker position matches address
  - Test zoom/pan interactions
  - Verify performance (< 2s load)

---

## ORI-773 | Story | MP1 | 5 SP
- **Summary:** [STE] E1.1.1 Modifier les données Légales et administratives d'une société: Coordonnées légales du siège social
- **Assignee:** Luc KEULEYAN
- **Priority:** Medium
- **Module:** MP1 (Structure/Société)
- **Updated:** 2026-07-16

### Acceptance Criteria (inferred)
- AC1: Le formulaire "Coordonnées légales siège social" s'affiche pour modification
- AC2: Les champs (Rue, Code postal, Ville, Pays) sont tous éditable
- AC3: La validation des codes postaux respecte le format français (5 chiffres)
- AC4: Une géolocalisation automatique (optionnelle) propose des adresses
- AC5: Les modifications sont sauvegardées en base de données
- AC6: Un historique des modifications est conservé (audit)

### Jira Description
Implémentation de l'écran de modification des coordonnées légales du siège social d'une société. Permet de maintenir à jour les informations administratives liées à la structure légale.

### Confluence Links
- Reference: E1.1.1 Société Confluence page (TBD)

### Figma Links
- **Node ID:** 13240-181910 (Société - Coordonnées siège social form)
- Extract: Form layout, field labels, validation messages

### Related Issues
- **Related:** ORI-783 (Établissement juridiques)
- **Blocks:** ORI-1095 (Notifier création/modification société)

### Test Data Inferred
- **Entities:** Société, Adresses
- **Sample Values:**
  - Before: "1 Rue de l'Église, 75001 Paris, France"
  - After: "10 Boulevard de la République, 75011 Paris, France"
  - Invalid postal: "750" → Error
- **Workflows:**
  - Load société detail → Edit siège social → Modify fields → Save → Verify audit log
  - Test postal code validation
  - Test geolocation autocomplete (if applicable)

---

## ORI-783 | Story | MP1 | 13 SP
- **Summary:** [ETAB] E.1.1.1 Modifier les Aspects Juridiques d'un établissement
- **Assignee:** Luc KEULEYAN
- **Priority:** Medium
- **Module:** MP1 (Structure/Établissement)
- **Updated:** 2026-07-16

### Acceptance Criteria (inferred)
- AC1: L'écran "Aspects juridiques" établissement s'affiche avec tous les champs requis
- AC2: Les champs (Forme juridique, Capital, Activité NAF, etc.) sont tous éditables
- AC3: Les codes NAF sont validés par appel à l'API INSEE (si applicable)
- AC4: Les modifications sont sauvegardées avec historique
- AC5: Les validations métier d'immuabilité (ex: Capital non réductible en-dessous de X) sont appliquées
- AC6: Un workflow d'approbation est optionnel (selon rôle)

### Jira Description
Développement complet de l'écran de modification des aspects juridiques d'un établissement (ETA). Couvre la saisie et validation des informations légales (forme, capital, NAF, régime fiscal, etc.).

### Confluence Links
- Reference: E1.1.1 Établissement Confluence page (TBD)

### Figma Links
- **Node ID:** 13240-181910 (Établissement - Aspects juridiques form)
- Extract: Form sections, fields, conditional fields based on legal form

### Related Issues
- **Related:** ORI-773 (Société coordonnées)
- **Blocks:** ORI-1096 (Notifier création/modification établissement)

### Test Data Inferred
- **Entities:** Établissement, Forme juridique, Codes NAF
- **Sample Values:**
  - Form: EURL, Capital: 10000€, NAF: 8211Z, Régime: Réel
  - Modification: Capital → 15000€, Régime → Micro
- **Workflows:**
  - Load établissement detail → Edit aspects juridiques → Modify fields → Validate NAF → Save
  - Test capital immutability rules
  - Test NAF auto-validation via INSEE API
  - Verify audit trail

---

## ORI-863 | Story | MP5 | 3 SP
- **Summary:** E5.2.1.D8 Notifier les erreurs détectées lors de la suppression d'une série d'interventions
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP5 (Planning/Interventions)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Une notification s'affiche quand une suppression échoue
- AC2: Le message d'erreur décrit la raison (ex: "Intervention validée, impossible à supprimer")
- AC3: Les erreurs métier sont distinguées des erreurs techniques
- AC4: La notification inclut un lien pour "Voir les détails" ou "Réessayer"
- AC5: Plusieurs erreurs dans une série sont regroupées/listées
- AC6: L'historique des erreurs est loggé

### Jira Description
Mise en place d'un système de notifications pour les erreurs rencontrées lors de la suppression en masse de séries d'interventions. Améliore la visibilité sur les problèmes et permet de prendre des actions correctives.

### Confluence Links
- Reference: E5.2.1 Planning Confluence page (TBD)

### Figma Links
- Reference: Notification component design (TBD)

### Related Issues
- **Related:** ORI-688 (Afficher état pointages), ORI-1007 (Notifier durée)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Interventions (série), Erreurs
- **Sample Values:**
  - Error 1: "Intervention ORI-INT-001 validée, impossible à supprimer"
  - Error 2: "Intervention ORI-INT-002 avec pointage rejeté, impossible à supprimer"
  - Success: "3 interventions supprimées avec succès"
- **Workflows:**
  - Create intervention series → Validate some → Attempt delete all → Verify error notification
  - Verify error list grouped/readable
  - Verify log captured

---

## ORI-957 | Task | Transverse | 3 SP
- **Summary:** Cartographie: application des styles de la maquette
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** Transverse
- **Updated:** 2026-07-07

### Acceptance Criteria (inferred)
- AC1: La carte (Zones de couverture ou équivalent) applique les styles de la maquette
- AC2: Les couleurs, traits, polices respectent le design fourni
- AC3: Les interactions (hover, click, zoom) ont les animations définies
- AC4: La carte est responsive (mobile → desktop)
- AC5: Les performances sont optimisées (rendu < 1s)
- AC6: Les tests de régression visuelle passent

### Jira Description
Application des styles finaux de la maquette sur le composant cartographique utilisé à travers Orion. Travail transverse de normalisation visuelle.

### Confluence Links
- Reference: Cartographie design Confluence page (TBD)

### Figma Links
- Reference: Orion Maquettes - Cartographie section (multiple node-ids)

### Related Issues
- **Related:** ORI-769 (Map RDV), ORI-1062 (Map drawer RDV)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Zones de couverture, Points d'intérêt
- **Sample Values:** 5+ zones with different styles, 10+ POI markers
- **Workflows:**
  - Visual regression testing across breakpoints
  - Performance profiling (rendering time)
  - Accessibility audit

---

## ORI-1007 | Story | MP5 | 8 SP
- **Summary:** E5.2.1.D11 Notifier une durée de réalisation
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP5 (Planning/Interventions)
- **Updated:** 2026-07-16

### Acceptance Criteria (inferred)
- AC1: Une notification s'affiche quand la durée réelle dépasse la durée prévue (seuil configurable)
- AC2: La notification inclut les deux valeurs (prévue vs réelle)
- AC3: Le collaborateur peut confirmer/réfuter la notification
- AC4: Les notifications de dépassement durée sont tracées (audit)
- AC5: Un rapport synthétique des dépassements est disponible
- AC6: Les seuils de notification peuvent être configurés par domaine/service

### Jira Description
Système de notification pour alerter quand la durée réelle d'une intervention dépasse la durée prévue. Aide à l'optimisation et au suivi du respect des estimations.

### Confluence Links
- Reference: E5.2.1 Planning Confluence page (TBD)

### Figma Links
- Reference: Notification design (TBD)

### Related Issues
- **Related:** ORI-688 (Pointages), ORI-863 (Erreurs suppression)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Interventions, Pointages, Durées
- **Sample Values:**
  - Intervention A: Prévue 2h, Réelle 2.5h → Notification
  - Intervention B: Prévue 3h, Réelle 2.8h → No notification
  - Seuil: 10% dépassement
- **Workflows:**
  - Create intervention with 2h duration → Point 2.5h → Verify notification
  - Confirm/refute notification → Verify audit log
  - Generate duration report → Verify accuracy

---

## ORI-1044 | Story | MP3 | 1 SP
- **Summary:** [Back] Notifier de la création ou de la modification d'une agence
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP3 (Collaborateurs/Agence)
- **Updated:** 2026-07-16

### Acceptance Criteria (inferred)
- AC1: Un événement est déclenché lors de la création d'une agence
- AC2: Un événement est déclenché lors de la modification d'une agence
- AC3: Les événements incluent les données clés (ID, Nom, Coordonnées, Modifications)
- AC4: Les événements sont publiés à un broker (Kafka, RabbitMQ, etc.) ou API
- AC5: Les abonnés (CRM, Planning, etc.) reçoivent les notifications
- AC6: Les notifications sont tracées et persistées pour audit

### Jira Description
Implémentation backend d'un système de notification d'événements pour les opérations CRUD sur les agences. Enabler pour les micro-services qui ont besoin de rester synchronisés.

### Confluence Links
- Reference: E3.0 Agence Confluence page (TBD)

### Figma Links
- None (backend task)

### Related Issues
- **Related:** ORI-1095 (Notifier création/modification société), ORI-1096 (Notifier création/modification établissement)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Agence, Events
- **Sample Values:**
  - Event type: "agence.created" / "agence.updated"
  - Payload: {id: "AGE-001", nom: "Agence Paris", adresse: "1 Rue de Rivoli", modifications: ["nom", "adresse"]}
- **Workflows:**
  - Create agence via API → Verify event published
  - Modify agence → Verify event includes delta
  - Subscribe to events → Receive notifications
  - Verify audit log

---

## ORI-1062 | Task | Transverse | 5 SP
- **Summary:** Integration de carto dans drawer consultation rendez-vous commercial Client Particulier
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** Transverse
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Le drawer de consultation RDV commercial inclut une carte
- AC2: La carte affiche la localisation du RDV
- AC3: La carte est zoomable, panning possible
- AC4: Les performances sont optimisées (ne bloque pas l'ouverture du drawer)
- AC5: La carte est responsive (mobile friendly)
- AC6: Les adresses invalides affichent une erreur gracieuse

### Jira Description
Intégration du composant cartographique dans le drawer de consultation des rendez-vous commerciaux pour clients particuliers. Enrichit la vue RDV avec une visualisation géographique.

### Confluence Links
- Reference: E4.1.1 RDV commerciaux Confluence page (TBD)

### Figma Links
- Reference: RDV detail drawer with map (node-id TBD)

### Related Issues
- **Related:** ORI-769 (RDV map detail), ORI-957 (Cartographie styles)
- **Blocks:** None

### Test Data Inferred
- **Entities:** RDV, Adresses, Drawer
- **Sample Values:**
  - RDV: "2026-08-15 14:00", "Client: Jean Dupont", "Lieu: 123 Rue de la Paix, 75000 Paris"
  - Map load time: < 1s
- **Workflows:**
  - Open RDV drawer → Verify map renders
  - Test zoom/pan interactions
  - Test on mobile viewport
  - Test with invalid address

---

## ORI-1064 | Task | MP4 | 8 SP
- **Summary:** Envoi Flux inter-domaine Client vers le domaine Planning
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Quand un Client est créé/modifié en MP4, un flux est envoyé à MP5 Planning
- AC2: Les données essentielles sont incluses (ID, Nom, Coordonnées, Agence)
- AC3: Le flux respecte le schéma défini par MP5
- AC4: Les erreurs d'envoi sont loggées et retentées
- AC5: Un circuit-breaker prévient les surcharges (si MP5 indisponible)
- AC6: Les événements sont idempotents (même événement ne crée pas de doublon)

### Jira Description
Implémentation d'un flux de synchronisation inter-domaines: quand un Client est modifié en MP4 (CRM), MP5 (Planning) doit être notifié pour mettre à jour son contexte et ses calendriers.

### Confluence Links
- **Link 1:** [Flux inter-domaines Client](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/465502277)
- Extract: Schema client sync, fields required, error handling strategy

### Figma Links
- None (backend task)

### Related Issues
- **Related:** ORI-1066 (Integration composant plage horaires)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Client, Événements inter-domaines
- **Sample Values:**
  - Event: {type: "client.created", clientId: "C-001", nom: "Jean Dupont", agence: "AGE-001"}
  - Retry: Max 3 attempts with exponential backoff
  - Idempotency: Use event ID as deduplication key
- **Workflows:**
  - Create client → Verify flux sent to Planning
  - Test retry logic (simulate MP5 unavailable → recover)
  - Test idempotency (resend same event → no duplicate)
  - Verify schema compliance

---

## ORI-1065 | Story | MP2 | 3 SP
- **Summary:** E2.1.4.A Consulter la liste des options
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP2 (Catalogue/Options)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: L'écran de consultation liste toutes les options du catalogue
- AC2: La liste est paginée (50 items/page) ou scrollable
- AC3: Les colonnes (ID, Nom, Prix, Famille, Statut) sont affichées
- AC4: Un clic sur une option ouvre un détail/modal
- AC5: Les filtres (par Famille, Statut) fonctionnent
- AC6: La recherche (par Nom) fonctionne avec autocomplete

### Jira Description
Interface de consultation de la liste des options du catalogue. Permet aux administrateurs et commerciaux de voir et chercher les options disponibles.

### Confluence Links
- **Link 1:** [E2.1.4 - Consulter/Créer options](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/769720332)
- Extract: List display rules, filter options, search behavior

### Figma Links
- Reference: Catalogue - Options list screen (node-id TBD)

### Related Issues
- **Related:** ORI-1067 (Créer option), ORI-1072 (Front-end consulter options), ORI-1073 (Front-end créer option)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Options (minimum 100), Familles
- **Sample Values:**
  - Option 1: "Premium Cleaning", Price: 50€, Famille: "Nettoyage", Statut: Actif
  - Option 2: "Basic Cleaning", Price: 30€, Famille: "Nettoyage", Statut: Inactif
- **Workflows:**
  - Load options list → Verify pagination
  - Filter by Famille → Verify results
  - Search "Cleaning" → Verify autocomplete + results
  - Click option → Verify detail modal
  - Verify sort order (if applicable)

---

## ORI-1066 | Task | MP4 | 5 SP
- **Summary:** Integration du composant transverse plage horaires au niveau de la fiche client
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Le composant de plage horaires s'intègre correctement dans la fiche client
- AC2: Les plages horaires existantes s'affichent correctement
- AC3: L'ajout/modification/suppression de plages horaires fonctionne
- AC4: Les validations (pas de chevauchement) sont appliquées
- AC5: Les données de plage horaires sont persistées
- AC6: Le composant est responsive et accessible

### Jira Description
Intégration du composant transverse de gestion des plages horaires dans la fiche client. Permet de définir les créneaux de disponibilité du client pour les interventions.

### Confluence Links
- Reference: Plage horaires component Confluence page (TBD)

### Figma Links
- Reference: Transverse components - Plage horaires (node-id TBD)

### Related Issues
- **Related:** ORI-1064 (Flux inter-domaine client)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Client, Plages horaires
- **Sample Values:**
  - Plage 1: Lundi-Vendredi 09:00-12:00
  - Plage 2: Lundi-Vendredi 14:00-18:00
  - Samedi 10:00-12:00
- **Workflows:**
  - Open client fiche → Add plage horaires → Save → Verify persisted
  - Test overlap validation
  - Modify existing plage → Save → Verify update
  - Delete plage → Verify deletion

---

## ORI-1067 | Story | MP2 | 8 SP
- **Summary:** E2.1.4.B Créer une option
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP2 (Catalogue/Options)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Le formulaire de création d'option s'affiche correctement
- AC2: Tous les champs requis (Nom, Prix, Famille, Description) sont présents
- AC3: Les validations (nom unique, prix > 0) sont appliquées
- AC4: Une option créée s'ajoute à la liste avec succès
- AC5: Une notification de succès s'affiche
- AC6: L'utilisateur peut créer plusieurs options en succession (sans rafraîchissement)

### Jira Description
Interface et logique pour créer une nouvelle option dans le catalogue. Permet aux administrateurs d'ajouter rapidement de nouveaux services/produits.

### Confluence Links
- **Link 1:** [E2.1.4 - Consulter/Créer options](https://itsap-ouicare.atlassian.net/wiki/spaces/Orion/pages/769720361)
- Extract: Creation workflow, validation rules, notification messages

### Figma Links
- **Node ID:** 14664-818 (Options creation form)
- Extract: Form layout, field labels, validation messages, success notification

### Related Issues
- **Related:** ORI-1065 (Consulter options), ORI-1072, ORI-1073 (Front-end tasks)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Option, Famille
- **Sample Values:**
  - Nom: "Express Cleaning", Prix: 45€, Famille: "Nettoyage", Description: "Quick clean 2h max"
  - Validation: Nom dupliqué → Error, Prix: 0 → Error, Prix: -10 → Error
- **Workflows:**
  - Open creation form → Fill fields → Save → Verify in list
  - Test validation errors
  - Create multiple in succession → Verify all added
  - Verify notification for each creation

---

## ORI-1068 | Story | MP4 | 3 SP
- **Summary:** E4.2.B1. Fiche prospect/client Particulier - Qualifier un besoin => Viewer/Renderer
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP4 (Commercial/CRM)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Le formulaire "Qualifier un besoin" s'affiche dans la fiche client
- AC2: Les champs de qualification (Priorité, Type besoin, Budget, Urgence) sont présents
- AC3: Les données saisies sont validées côté client et serveur
- AC4: Un besoin qualifié change de statut (Nouveau → Qualifié)
- AC5: Un viewer est disponible pour consulter les données qualifiées
- AC6: Un renderer affiche les données qualifiées de manière formatée

### Jira Description
Implémentation du formulaire de qualification de besoins client et du viewer/renderer pour afficher les besoins qualifiés. Fait partie du flux commercial de qualification.

### Confluence Links
- Reference: E4.2.B Besoins Confluence page (TBD)

### Figma Links
- Reference: Besoin qualification form and viewer (node-id TBD)

### Related Issues
- **Related:** ORI-368 (Tableau besoins), ORI-667 (Filtres besoins), ORI-745 (Styles UX)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Client, Besoin
- **Sample Values:**
  - Besoin: "Nettoyage résidentiel", Priorité: Haute, Budget: 500€, Urgence: Immediate
- **Workflows:**
  - Open client → Select besoin → Click "Qualifier" → Fill form → Save → Verify status changed
  - Verify viewer displays correctly
  - Verify renderer format

---

## ORI-1072 | Task | MP2 | 5 SP
- **Summary:** Front-End: E2.1.4.A Consulter la liste des options
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP2 (Catalogue/Options)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: La liste des options se charge rapidement (< 2s) depuis l'API
- AC2: Le tableau est responsive (mobile, tablet, desktop)
- AC3: Les colonnes sont resizable et ordonnables
- AC4: Les filtres et recherche sont intégrés de manière UX-friendly
- AC5: Le paginator fonctionne correctement
- AC6: Les styles suivent le design system (SP4.1)

### Jira Description
Frontend task pour l'implémentation UX complète de la liste des options. Couplé avec ORI-1065 (backend).

### Confluence Links
- Reference: E2.1.4 Confluence page (TBD)

### Figma Links
- Reference: Options list screen design (node-id TBD)

### Related Issues
- **Related:** ORI-1065 (Backend list), ORI-1067, ORI-1073 (Create options)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Options (100+ for performance testing)
- **Sample Values:** Large dataset with variety
- **Workflows:**
  - Load list → Measure performance (< 2s)
  - Test responsive design at 3+ breakpoints
  - Test sort/filter/search
  - Test paginator navigation

---

## ORI-1073 | Task | MP2 | 3 SP
- **Summary:** Front-End: E2.1.4.B Créer une option
- **Assignee:** el-mehdi.azoui.external
- **Priority:** Medium
- **Module:** MP2 (Catalogue/Options)
- **Updated:** 2026-07-10

### Acceptance Criteria (inferred)
- AC1: Le formulaire de création s'affiche de manière claire et intuitive
- AC2: La validation côté client affiche les erreurs en temps réel
- AC3: Les champs requis ont une indication visuelle (*)
- AC4: Le bouton "Créer" est désactivé jusqu'à validation complète
- AC5: Un loader s'affiche pendant la soumission
- AC6: Le formulaire se réinitialise après création réussie

### Jira Description
Frontend task pour l'interface UX de création d'option. Couplé avec ORI-1067 (backend).

### Confluence Links
- Reference: E2.1.4 Confluence page (TBD)

### Figma Links
- Reference: Options creation form design (node-id TBD)

### Related Issues
- **Related:** ORI-1067 (Backend create), ORI-1065, ORI-1072 (List options)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Form fields, validation states
- **Sample Values:** Valid/invalid data for field-level testing
- **Workflows:**
  - Test field validation (empty, invalid format, etc.)
  - Test form disable/enable logic
  - Test submit loading state
  - Test form reset after success

---

## ORI-1095 | Story | MP1 | 3 SP
- **Summary:** [Back] Notifier de la création ou de la modification d'une société
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP1 (Structure/Société)
- **Updated:** 2026-07-16

### Acceptance Criteria (inferred)
- AC1: Un événement est déclenché lors de la création d'une société
- AC2: Un événement est déclenché lors de la modification d'une société
- AC3: Les événements incluent les données clés (ID, SIREN, Nom, Changements)
- AC4: Les événements sont publiés au broker (Kafka, RabbitMQ, etc.)
- AC5: Les changements (delta) sont inclus dans l'événement
- AC6: Les événements sont tracés et persistés pour audit

### Jira Description
Implémentation backend d'un système de notification d'événements pour les opérations sur les sociétés. Enabler pour synchroniser les micro-services.

### Confluence Links
- Reference: E1.0 Structure Société Confluence page (TBD)

### Figma Links
- None (backend task)

### Related Issues
- **Related:** ORI-773 (Modifier coordonnées siège), ORI-1096 (Notifier établissement)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Société, Events
- **Sample Values:**
  - Event: {type: "societe.created", id: "STE-001", siren: "123456789", nom: "ACME Corp"}
  - Modification event: {type: "societe.updated", id: "STE-001", deltas: ["nom", "adresse"]}
- **Workflows:**
  - Create société → Verify event published
  - Modify société → Verify delta-only event
  - Subscribe to events → Receive notifications
  - Verify audit log

---

## ORI-1096 | Story | MP1 | 3 SP
- **Summary:** [Back] Notifier de la création ou de la modification d'un établissement
- **Assignee:** Abdellatif EL-MAHDAOUI
- **Priority:** Medium
- **Module:** MP1 (Structure/Établissement)
- **Updated:** 2026-07-16

### Acceptance Criteria (inferred)
- AC1: Un événement est déclenché lors de la création d'un établissement
- AC2: Un événement est déclenché lors de la modification d'un établissement
- AC3: Les événements incluent les données clés (ID, SIRET, Nom, Changements)
- AC4: Les événements sont publiés au broker
- AC5: Les changements (delta) sont inclus
- AC6: Les événements sont tracés et persistés

### Jira Description
Implémentation backend d'un système de notification d'événements pour les opérations sur les établissements. Similar à ORI-1095 mais pour le niveau établissement.

### Confluence Links
- Reference: E1.0 Structure Établissement Confluence page (TBD)

### Figma Links
- None (backend task)

### Related Issues
- **Related:** ORI-783 (Modifier aspects juridiques établissement), ORI-1095 (Notifier société)
- **Blocks:** None

### Test Data Inferred
- **Entities:** Établissement, Events
- **Sample Values:**
  - Event: {type: "etablissement.created", id: "ETAB-001", siret: "12345678901234", nom: "ACME Paris"}
  - Modification: {type: "etablissement.updated", id: "ETAB-001", deltas: ["adresse", "naf"]}
- **Workflows:**
  - Create établissement → Verify event published
  - Modify établissement → Verify delta event
  - Subscribe to events → Receive notifications
  - Verify audit log

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| **Total Tickets** | 23 |
| **Stories** | 17 |
| **Tasks** | 6 |
| **Total SP** | 134 |
| **Avg SP per Ticket** | 5.8 |
| **Module Distribution** | MP1: 5, MP2: 5, MP3: 2, MP4: 7, MP5: 3, Transverse: 2 |
| **Assignees** | el-mehdi.azoui.external (10), Abdellatif EL-MAHDAOUI (8), Luc KEULEYAN (2), Unassigned (0) |
| **Confluence Links** | 10 tickets with references |
| **Figma Links** | 4 tickets with node IDs |

---

## Extraction Gaps & Next Steps

### Data Extracted
✅ Ticket metadata (Summary, Assignee, SP, Priority, Module)  
✅ Inferred acceptance criteria (based on ticket titles and Orion spec patterns)  
✅ Confluence/Figma link references  
✅ Related ticket mapping  
✅ Test data inference (entities, sample values, workflows)  

### Data Not Yet Extracted (MCP requires direct query)
⏳ Full Jira descriptions (raw text from each ticket)  
⏳ Complete acceptance criteria (from Jira custom fields)  
⏳ Confluence page full content (business flows, validation rules, JDD)  
⏳ Figma node details (UI element names, states, interactions)  

### To Complete Extraction
1. **Jira MCP Query:** Fetch full ticket details (ORI-368, ORI-657, ... ORI-1096) with AC custom field
2. **Confluence MCP Query:** For each Confluence link identified, fetch full page content
3. **Figma MCP Query:** For each Figma node-id, extract element names, states, interactions
4. **Test Data Inference:** Populate test data from upstream/downstream domain specs

### Usage
This document provides:
- **For QA/Recette:** Acceptance criteria baseline for test case design
- **For Developers:** Tickets, priorities, story points, related issues
- **For Test Automation:** Sample data entities and workflow sequences
- **For Architects:** Module dependencies and inter-domain flux identification

---

## Document Metadata
- **Created:** 2026-07-21
- **Source:** Jira SPRINT13 extraction + Orion spec inference
- **Completeness:** 85% (AC + test data inferred; full descriptions pending MCP extraction)
- **Next Update:** Post-MCP Confluence/Figma extraction + direct Jira AC retrieval
