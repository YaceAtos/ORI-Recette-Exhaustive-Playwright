# Mail template - pre requis pour jouer les 3 scenarios full business

Objet: Pre requis indispensables pour execution reelle des scenarios transverses INT2

Bonjour,

Pour pouvoir jouer les 3 scenarios transverses en mode reel (PP domicile, Pro multi-sites, SAAD sante), nous avons besoin des pre requis ci-dessous. Sans ces elements, les tests IHM peuvent tourner partiellement mais la preuve metier complete ne peut pas etre validee.

## 1) Acces et securite
- Endpoint metier d orchestration disponible pour les actions chain/action/payload.
- Secret d authentification valide pour cet endpoint (Bearer ou x-api-key).
- Droits applicatifs complets sur MP1 MP2 MP3 MP4 MP5 MP6 pour le compte de test.

## 2) Preconditionnement de donnees
- Jeu de donnees de reference stable et rejouable:
  - structure marque societe agence
  - produits et options
  - collaborateurs
  - clients PP et Pro
  - OF CDA PAP
- Capacite de creation et de cleanup automatique entre executions.

## 3) Capacites metier backend obligatoires
- Seed initial par chaine (creation/restitution des IDs de travail).
- Cleanup final par chaine (suppression ou rollback).
- Creation de series d interventions.
- Declenchement batch RRULE et controle generation 12 mois.
- Lecture/mise a jour/annulation interventions via identifiants techniques.

## 4) Integrations externes a rendre disponibles
- SIRENE (enrichissement forme juridique + code APE).
- INS/INSi/iCanopee (cycle de statut complet).
- DMP (publication et verification de disponibilite).
- Kafka (verification d emission des evenements attendus).

## 5) Observabilite et preuves
- Logs exploitables par correlationId pour chaque action.
- Traces d appels et statuts metier horodates.
- Canal de preuve pour evenements asynchrones (Kafka, batch, INS, DMP).

## 6) Definition de done pour accepter une execution full business
- 3 chaines executees bout en bout sans bypass.
- Toutes etapes metier valides avec preuves (pas seulement IHM).
- Artifacts video MP4 + traces techniques + resultat de verification.

## 7) Priorite de mise en place (ordre recommande)
1. Endpoint orchestration + auth valide.
2. Seed et cleanup stables.
3. RRULE et interventions.
4. SIRENE, INS, DMP.
5. Kafka verification.

Merci.
