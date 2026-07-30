# Verification post-installation — Kit V2 du workspace IA Orion

> **Ce fichier est destine a l'assistant IA, pas a l'utilisateur.**
> Pour l'utiliser : ouvre OpenCode Desktop dans ton workspace Orion, joins ce fichier
> en piece jointe, et ecris simplement : **"execute cette verification"**.

---

## Contexte

L'utilisateur vient de mettre a jour son workspace en dezippant le kit V2 par-dessus
l'ancien (V1). Le dezip **ajoute et ecrase** les fichiers, mais **ne supprime jamais**
les anciens fichiers devenus obsoletes. Cette verification controle que :

1. Tous les fichiers V2 attendus sont **presents**
2. Les fichiers V1 obsoletes ont bien ete **supprimes** (sinon, lister lesquels)
3. La configuration Python locale est **valide** (pas ecrasee par une config d'un autre poste)
4. La connexion **MCP Atlassian** fonctionne (prerequis critique de la V2)

---

## Instructions pour l'assistant IA

**Tu es un assistant de verification. Execute les controles ci-dessous dans l'ordre,
en utilisant tes outils de lecture/liste de fichiers. Communique en francais.
A la fin, produis un tableau de synthese et un verdict clair. Ne modifie AUCUN fichier
de toi-meme — propose les actions, c'est l'utilisateur qui supprimera.**

---

## Controle A — Presence des fichiers V2 attendus

Verifie que chacun des elements suivants **existe** :

**Sous-agents** (`.opencode/agents/`) :
- [ ] `spec-writer.md`
- [ ] `maquette-generator.md`
- [ ] `confluence-explorer.md`
- [ ] `jira-explorer.md`
- [ ] `figma-explorer.md`

**Skills** (`.opencode/skills/`) :
- [ ] `orion-ds-to-html/` (avec `SKILL.md` + dossier `references/`)
- [ ] `orion-spec-explorer/`
- [ ] `orion-spec-sync/`
- [ ] `spec-golden-example/`
- [ ] `confluence-conventions/`
- [ ] `input-preprocessor/`

**Carte fonctionnelle** (`docs/`) :
- [ ] `INDEX.md`
- [ ] `00-contexte-produit.md`, `01-regles-transverses.md`
- [ ] `mp1-structure-marques.md` a `mp6-facturation-aides.md`
- [ ] `08-interfaces-flux.md`, `09-maquettes-figma.md`

**Configuration** :
- [ ] `opencode.json` contient un bloc `mcp` avec `atlassian-itsap-orion` (`enabled: true`)
- [ ] `AGENTS.md` present
- [ ] `guide-utilisation/GUIDE-UTILISATEUR.md` et `GUIDE-MISE-A-JOUR-V2.md` presents

> Si un element manque : le signaler. Cause probable = dezip incomplet ou dans le mauvais dossier.

---

## Controle B — Absence des fichiers V1 obsoletes

Le dezip ne supprime pas ces fichiers : ils faussent le comportement de l'assistant
s'ils restent. Verifie qu'ils sont **ABSENTS**. Pour chaque fichier **encore present**,
ajoute-le a la liste des suppressions a proposer a l'utilisateur :

| Fichier / Dossier a supprimer | Pourquoi |
|---|---|
| `.opencode/skills/design-system/` | Remplace par `orion-ds-to-html` |
| `.opencode/skills/maquette-golden-example/` | Fusionne dans `orion-ds-to-html` |
| `designSystemOrion.md` (racine) | Tokens migres dans la skill |
| `exempleDesignOrion.html` (racine) | Patterns CSS migres dans la skill |
| `README.md` (racine) | Perime — remplace par `guide-utilisation/` |
| `installation-lecture-fichiers.md` | Remplace par `workspace-docs/installation-lecture-fichiers_v2.md` |

> S'il reste des fichiers obsoletes, afficher la **liste exacte des chemins** a supprimer,
> avec une commande copiable. Ne PAS supprimer toi-meme.

---

## Controle C — Configuration Python locale

1. Verifie que `.opencode/memory/python-config.md` existe.
2. Lis le chemin Python qu'il contient.
3. Verifie que ce chemin correspond bien au **poste local de l'utilisateur** :
   - Sur Windows, le chemin doit ressembler a `C:\Users\...\python.exe` (et **pas** a un chemin
     macOS type `/usr/...` ou `/Library/...` — ce serait le signe d'un fichier ecrase par erreur).
4. Teste l'executable : `"<chemin>" --version` doit afficher Python 3.8+.
5. Teste les imports :
   `"<chemin>" -c "import pdfplumber, docx, openpyxl, pptx, markitdown; print('OK')"`

> Si `python-config.md` est absent, ou si le chemin est invalide / pointe vers un autre OS :
> indiquer a l'utilisateur de rejouer `workspace-docs/installation-lecture-fichiers_v2.md`.

---

## Controle D — Connexion MCP Atlassian (prerequis critique V2)

La V2 lit le detail fonctionnel **en direct sur Confluence**. Sans MCP, seuls le routage,
le glossaire et la nomenclature RG sont disponibles, pas le detail.

1. Verifie que `opencode.json` declare `atlassian-itsap-orion` (`enabled: true`).
2. Teste la connexion reelle via le sous-agent `confluence-explorer` : demande-lui une
   operation de lecture simple (ex : rechercher une page du projet ORI).
   - **Si ca repond** : MCP operationnel.
   - **Si ca echoue** (non authentifie, serveur injoignable) : signaler que l'utilisateur
     doit autoriser la connexion Atlassian dans OpenCode (premiere utilisation = ecran de consentement OAuth).

> Le MCP Figma (`figma-itsap-orion`, `127.0.0.1:3845`) est **optionnel** : utile seulement
> pour le mode Maquette a partir de Figma. Ne pas bloquer la verification s'il est absent.

---

## Controle E — Verdict

Produis un tableau de synthese :

| Controle | Statut | Action requise |
|---|---|---|
| A — Fichiers V2 presents | OK / KO | ... |
| B — Obsoletes supprimes | OK / a nettoyer | liste des chemins |
| C — Python local valide | OK / KO | ... |
| D — MCP Atlassian | OK / a autoriser | ... |

Puis un verdict en une ligne :
- **TOUT OK** : "Workspace V2 operationnel. Tu peux commencer a travailler."
- **ACTIONS RESTANTES** : lister les 1-3 actions concretes (supprimer X, rejouer l'install, autoriser Atlassian).

---

## Pour commencer — exemples d'utilisation des nouveautes V2

Une fois la verification au vert, voici quelques demandes simples pour prendre en main
les nouvelles capacites. **A copier-coller dans une nouvelle conversation** (une demande = une conversation pour les livrables) :

**1. Lister les US du sprint en cours (Jira)**
> « Liste les User Stories du sprint en cours sur le projet ORI, avec leur statut et leur assigne. »
> *(L'assistant delegue a `jira-explorer` et te renvoie un tableau synthetique.)*

**2. Resumer un macro-processus (Confluence live)**
> « Fais-moi un resume du MP4 (gestion commerciale) : les sous-processus, les regles cles et les ecrans concernes. »
> *(L'assistant route via la carte `docs/mp4-*.md`, puis lit le detail sur Confluence via `confluence-explorer`.)*

**3. Aller chercher une page Confluence precise**
> « Va chercher la page Confluence [colle ton lien ou l'ID] et resume-la-moi en 10 points. »
> *(Lecture isolee par `confluence-explorer`, sans saturer le contexte.)*

**4. Generer une maquette d'ecran**
> « Genere une maquette HTML de l'ecran [nom / code ecran]. » *(ou : « regarde le design sur Figma » + lien)*
> *(L'assistant delegue a `maquette-generator`, qui assemble le design system via `orion-ds-to-html`.)*

> Rappel : pour une **spec** ou une **maquette**, ouvre une **nouvelle conversation** par livrable
> (le circuit-breaker protege la qualite). Les questions rapides et resumes restent possibles a la suite.
