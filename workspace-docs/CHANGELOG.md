# Historique des versions

Toutes les modifications notables du kit workspace sont documentees ici.

---

## [2.1.0] — 2026-06-26

### Nettoyage, fixes DOCX, modèle carte docs/ (pointeurs Confluence)

> Note : partie test automatisée sortie du kit (reportée V3). `docs/` passe d'une copie de spec à une **carte** (pointeurs `page_id` Confluence + nomenclature RG + pièges) ; détail lu en live via MCP Atlassian.

**Suppressions**
- `README.md` : perime (decrivait encore la structure v1 : `designSystemOrion.md`, skills `design-system`/`maquette-golden-example`, aucune mention de `docs/`, MCP ni sub-agents). Le guide a jour vit dans `guide-utilisation/`.
- Skill `cu-generator` et skill `orion-scenario-playwright` : reportees en V3 (partie test).
- Dossier `orion-test-auto/` (tests Playwright, fixtures, configs) : reporte en V3.

**Convertisseur DOCX — skill `docx-generate-edit` (1.0.0 → 1.1.0)**

Trois correctifs sur `convert_markdown_to_docx.py`, detectes sur des CR Word generes avec le template Atos (titres auto-numerotes) :
- **Double numerotation des titres** : les styles `Heading 1/2/3/4` du template numerotent automatiquement (ex. « 5.1 »), et le numero manuel du markdown (`## 1. Objet`) etait conserve → rendu « 5.1  1. Objet ». Le numero manuel en tete de titre est desormais retire (flag `headings.strip_leading_number`, defaut `true`).
- **Tableaux Markdown non rendus** : les lignes `| … |` etaient concatenees en paragraphe brut. Ajout d'un parsing GFM → tableau Word natif (style `styles.table`, defaut `Table Grid`, fallback gracieux).
- **Emphase inline litterale** (`**gras**`, `*italique*`, `` `code` ``) : ajout de `_add_inline_runs` (runs Word formates) sur paragraphes, listes et cellules.
- Fichiers : `int2-ihm-scripts/convert_markdown_to_docx.py`, `int2-ihm-scripts/markdown_to_docx_config.example.json` (+`styles.table`, +`headings`), `SKILL.md` (+2 regles). Propage a la copie registry du marketplace.

**Documentation `docs/` — alignement sur les macro-process (MP)**
- Renommage des 6 fichiers domaine pour aligner le nom sur le MP (resolvait une confusion BA : `07` ≠ MP7) :
  - `02-structure-marques` → `mp1-structure-marques`
  - `03-catalogue-produits` → `mp2-catalogue-produits`
  - `04-collaborateurs` → `mp3-collaborateurs`
  - `05-gestion-commerciale` → `mp4-gestion-commerciale`
  - `06-planning-interventions` → `mp5-planning-interventions`
  - `07-facturation-aides` → `mp6-facturation-aides`
- Transverses inchanges : `00-contexte-produit`, `01-regles-transverses`, `08-interfaces-flux`, `09-maquettes-figma`.
- References mises a jour. `INDEX.md` : colonne `#` → `MP / type`.

**`docs/` — modèle carte (pointeurs Confluence)**
- Chaque domaine (`mp1`→`mp6`, `08-interfaces-flux`, `mp5-cadre-operationnel`) = carte : Meta + tags + table `page_id` + nomenclature RG + pièges connus. Le corps fonctionnel n'est plus copié — lu en live via `confluence-explorer`. Pas de fallback offline (MCP requis pour le détail).
- Couche `parcours/` supprimée (16 fichiers). Socle conservé en copie (offline OK) : `00-contexte`, `01-regles-transverses`, `INDEX` (glossaire + nomenclature RG), `09-maquettes-figma` (node-id).
- `INDEX.md` : colonne `page_id racine` + index nomenclature RG → carte.

**Skills**
- `orion-spec-explorer` réécrit : router via carte → lire le détail en live (Confluence/Figma MCP), sourcé `page_id`, en respectant les pièges (doublons, pages `A SUPPRIMER`/vides, brouillons).
- `orion-spec-sync` réduit à la validation des pointeurs (`page_id` existants), sans re-copie de contenu. Retrait du renvoi `orion-scenario-playwright` (skill supprimée).

**AGENTS.md**
- § « Priorité des sources » : routage par la carte locale ; **détail fonctionnel = Confluence live** via `confluence-explorer` (sourcé). MCP = prérequis critique. Retrait des références `README.md` (→ `guide-utilisation/`) et `parcours`.

**opencode.json**
- Bloc `mcp` reformaté. Connexions inchangées (Atlassian + Figma local conservé).

---

## [2.0.0] — 2026-06-09

### Refonte architecturale — Orchestrateur + Sub-agents

**Architecture**
- **AGENTS.md devient un routeur leger** (188 lignes vs 419 avant). Il detecte l'intention, resout le sujet, et delegue le travail aux sub-agents specialises.
- **Sub-agents spec-writer et maquette-generator** : les processus Spec et Maquette migrent dans des sub-agents autonomes (Sonnet 4.6). L'orchestrateur injecte les preferences utilisateur et le contexte, puis le sub-agent gere l'integralite du processus.
- **Sub-agents confluence-explorer et figma-explorer** : isolent la consommation de tokens MCP du contexte principal. Lisent les sources distantes et retournent des resumes compacts.

**Design system**
- **Nouvelle skill `orion-ds-to-html`** : remplace `design-system` + `maquette-golden-example`. Architecture modulaire avec 23 fichiers CSS pre-valides et 23 fiches composants individuelles.
- **CSS modulaire** : assemblage depuis des fichiers individuels (theme.css + composants necessaires uniquement). Economie de contexte massive, resultats plus coherents.

**Contexte fonctionnel**
- **Nouveau dossier `docs/`** : glossaire, regles transverses, domaines fonctionnels, parcours utilisateur. Remplace les sections en dur dans AGENTS.md.
- **Skill `orion-spec-explorer`** : navigation progressive dans le corpus fonctionnel sans tout charger en memoire.

**Connexions**
- **MCP Atlassian** : lecture pages Confluence, issues Jira
- **MCP Figma** : exploration fichiers de design, screenshots

**Nouveaux fichiers**
- `.opencode/agents/spec-writer.md` : sub-agent redaction de specs (Sonnet 4.6, 30 steps)
- `.opencode/agents/maquette-generator.md` : sub-agent generation maquettes HTML (Sonnet 4.6, 30 steps)
- `.opencode/agents/confluence-explorer.md` : sub-agent navigation Confluence
- `.opencode/agents/figma-explorer.md` : sub-agent exploration Figma
- `.opencode/skills/orion-ds-to-html/` : skill complete design system modulaire
- `.opencode/skills/orion-spec-explorer/` : skill navigation corpus fonctionnel
- `docs/` : corpus fonctionnel Orion (10 fichiers domaine + 16 parcours)

**Suppressions**
- Skill `design-system` (remplacee par `orion-ds-to-html`)
- Skill `maquette-golden-example` (criteres integres dans `orion-ds-to-html`)
- Fichier `designSystemOrion.md` (tokens integres dans la skill)
- Glossaire, regles transverses, conventions techniques dans AGENTS.md (migres vers `docs/`)

**Fichiers modifies**
- `AGENTS.md` : reecrit en routeur leger (419 → 185 lignes, -56%)
- `opencode.json` : ajout connexions MCP Atlassian et Figma

**Securite MCP**
- **Figma** : acces lecture seule. Aucune modification possible.
- **Confluence/Jira** : lecture libre, ecriture/modification uniquement apres confirmation explicite de l'utilisateur. Garde-fou redonde dans AGENTS.md + chaque sub-agent.
- **Publication Confluence** : le spec-writer propose de publier la spec sur Confluence apres validation. Jamais automatique.

**Contexte**
L'ancien AGENTS.md (419 lignes) concentrait tout : orchestration, processus Spec complet, processus Maquette complet, glossaire, regles metier, conventions. Le cout en tokens etait eleve et le fichier etait difficile a maintenir. La nouvelle architecture separe les responsabilites : AGENTS.md route, les sub-agents executent, les skills fournissent les references, docs/ porte le contexte metier.

**Contexte**
L'ancienne approche obligeait l'assistant a lire 2900+ lignes de HTML et a en "reverse-engineer" le CSS a chaque maquette. Les resultats variaient d'une generation a l'autre car l'interpretation des tokens bruts est non-deterministe. La nouvelle approche fournit du CSS pre-valide par composant — l'assistant assemble au lieu d'interpreter, ce qui garantit une coherence visuelle systematique.

---

## [1.3.0] — 2026-03-18

### Fidelite visuelle des le premier jet

**Changement majeur**
- **Processus maquette en 2 phases** : la generation de maquettes suit desormais un processus explicite en 2 phases :
  - **Phase 1 — Coquille visuelle** : construction du CSS et du layout HTML en copiant/adaptant les patterns directement depuis `exempleDesignOrion.html` (source de verite CSS). Donnees minimales, focus sur le rendu visuel.
  - **Phase 2 — Contenu fonctionnel** : injection des donnees realistes, interactions JS, regles metier, validations.
- **Inversion de la hierarchie des references** : `exempleDesignOrion.html` devient la source CSS n°1 (patterns concrets assembles). `designSystemOrion.md` devient le dictionnaire de tokens de secours pour les cas non illustres.
- **Nouvelle contrainte "CSS extrait, pas interprete"** : le CSS doit etre extrait de l'exemple HTML et adapte, pas reconstruit a partir des tokens abstraits du design system.

**Contexte**
La maquette V1 "Cadre General" etait fonctionnellement complete mais visuellement eloignee du site en recette (20+ corrections CSS necessaires pour la V2). L'analyse a montre que le CSS etait reconstruit a partir des tokens abstraits du design system (fichier MD) au lieu d'etre extrait du fichier HTML de reference qui contient les valeurs concretes assemblees. Ce changement de workflow garantit que le premier jet est visuellement fidele.

**Fichiers modifies**
- `AGENTS.md` : reecriture des etapes 2 (chargement des references en 2 phases) et 4 (generation en 2 phases) du mode Maquette, ajout de la contrainte "CSS extrait, pas interprete"
- `.opencode/skills/design-system/SKILL.md` : inversion de la hierarchie des fichiers de reference (HTML n°1, MD n°2), ajout des sections cles avec numeros de lignes indicatifs

---

## [1.2.0] — 2026-03-15

### Fiabilisation anti-timeout et decouverte des skills

**Changements majeurs**
- **Regle anti-timeout pour les maquettes** : toute maquette depassant 300 lignes est automatiquement decoupee en micro-etapes (~150 lignes max par operation Write/Edit). Processus structure : Plan → Validation utilisateur → Execution autonome → Verification finale. Fini les timeouts SSE sur les gros fichiers HTML.
- **Regle anti-timeout pour les specs** : meme logique appliquee aux specs volumineuses (> 5 sections fonctionnelles ou > 3 fichiers sources).
- **Mode "step by step"** : si l'utilisateur dit "step by step" ou "etape par etape", l'assistant bascule en mode pas-a-pas avec validation entre chaque etape (au lieu de l'execution autonome par defaut).

**Ameliorations**
- **Frontmatter YAML sur les 5 skills** : ajout des blocs `name` + `description` requis par le mecanisme natif de decouverte `skill()` d'OpenCode. Les skills etaient fonctionnelles mais invisibles au systeme de decouverte automatique.
- **Reprise sur timeout** : en cas de timeout en cours d'ecriture, l'assistant reprend exactement la ou il s'est arrete (le fichier sur disque contient deja le travail accompli), sans repartir de zero.
- **Placeholders commentes** : pendant l'ecriture incrementale, des commentaires-placeholders (`/* ---- CSS : voir etape N ---- */`, `<!-- HTML : voir etape N -->`) marquent les zones a remplir. Verification automatique en fin de processus qu'aucun placeholder ne subsiste.

**Contexte**
Ces changements font suite a des timeouts SSE repetes lors de la generation de la maquette "Cadre General" (2111 lignes). La decomposition manuelle en 14 etapes avait resolu le probleme — cette version automatise ce comportement pour qu'il s'applique systematiquement sans intervention utilisateur.

---

## [1.1.0] — 2026-03-13

### Simplification et restructuration

**Changements majeurs**
- **Agent unique** : plus besoin de selectionner un agent via Tab. L'assistant detecte automatiquement le mode de travail (Spec / Maquette / Libre) et pose la question si c'est ambigu.
- **Nouvelle structure `mon-espace/`** : remplacement de `inputs/` + `outputs/` par une structure "un dossier par sujet" avec les fichiers sources a la racine et les livrables dans `livrables-opencode/`.
- **Versionnement des livrables** : chaque livrable est suffixe `_vN` (spec_v1.md, spec_v2.md, maquette_v1.html...). Les versions precedentes sont conservees, jamais ecrasees.
- **Sujet exemple inclus** : `mon-espace/sujet-exemple-1/` contient des fichiers exemples pour comprendre la structure attendue.

**Ameliorations**
- Skill `input-preprocessor` renforcee :
  - Confirmation de lecture obligatoire avant de travailler (resume de ce qui a ete lu par fichier)
  - Seuil de confiance : si l'extraction est incertaine (< 90%), l'assistant stoppe et demande confirmation
  - Priorisation des sources : quand il y a 3+ fichiers, l'assistant demande quel est le document de reference
  - Avertissement automatique sur les images et PDF scannes
- Skills mises a jour pour refleter les nouveaux chemins (`mon-espace/` au lieu de `inputs/` + `outputs/`)
- README et guide de demarrage rapide simplifies (plus de reference aux agents Tab)

**Suppressions**
- Suppression du dossier `.opencode/agents/` (spec-writer.md et maquette-generator.md) — leur logique est fusionnee dans AGENTS.md
- Suppression des dossiers `inputs/` et `outputs/`

---

## [1.0.0] — 2026-03-08

### Premiere version du kit zip

**Nouveautes**
- Workspace pret a l'emploi (plus besoin de BOOTSTRAP.md)
- 2 agents specialises : Spec Writer et Maquette Generator
- 5 skills de reference :
  - `input-preprocessor` : lecture et extraction des fichiers sources (PDF, Excel, Word, PowerPoint, images)
  - `confluence-conventions` : structure et formatage des specs au standard Confluence Orion
  - `spec-golden-example` : criteres de qualite pour les specs (avec exemple E4.1.1.C3)
  - `design-system` : reference visuelle pour les maquettes (pointe vers designSystemOrion.md)
  - `maquette-golden-example` : criteres de qualite pour les maquettes
- Support des formats legacy Office (.xls, .doc, .ppt) en plus des formats modernes
- Memoire utilisateur persistante (preferences retenues entre conversations)
- Guide de demarrage rapide (1 page)
- README oriente BA/PO non-technique

**Ameliorations par rapport au workspace precedent**
- Suppression de la dependance MCP Confluence (token inaccessible, complexe a configurer)
- Conventions Confluence extraites d'exemples reels et integrees localement dans la skill
- Skill de pretraitement des entrees integree au niveau global (pas de 3e agent)
- Contrainte "Opus only" deplacee au niveau des agents (pas global)
- Skills ameliorees avec des criteres structures (plus de listes de citations)
- Circuit-breaker renforce sur les agents (protection qualite multi-livrable)
