# Guide de mise a jour — V2 du kit workspace IA Orion

> **Pour qui :** Business Analysts et Product Owners utilisant deja le workspace
> **Temps estime :** 5 minutes
>
> **Nouveau :** la réf. fonctionnelle `docs/` devient une *carte* (pointeurs Confluence + nomenclature RG + pièges) ; le détail est lu en direct sur Confluence → **MCP Atlassian requis**. Couche *parcours* retirée.

---

## Comment mettre a jour

### Etape 1 — Mettre a jour OpenCode Desktop (avant tout)

Avant de toucher au workspace, **mettez a jour OpenCode Desktop vers la derniere version**.
Les nouvelles versions sont stables et apportent plusieurs nouveautes utiles.

- Ouvrez OpenCode Desktop et installez la mise a jour proposee (ou telechargez la derniere version).
- Si aucune mise a jour n'est proposee, vous etes deja a jour.

> A faire en premier : certaines fonctionnalites de la V2 (sous-agents, MCP) profitent des dernieres versions.

### Etape 2 — Dezipper

Dezippez le nouveau fichier fourni **dans le meme dossier** que votre workspace actuel.

- Les fichiers existants seront **ecrases** par les nouvelles versions (c'est normal et voulu)
- Les fichiers nouveaux seront simplement **ajoutes**
- **Votre dossier `mon-espace/` n'est PAS touche** — vos fichiers de travail, vos specs et maquettes existantes sont preserves

### Etape 3 — Supprimer les fichiers obsoletes

Les fichiers suivants ne sont **plus utilises** par l'assistant. Vous pouvez les supprimer :

| Fichier / Dossier | Pourquoi c'est obsolete |
|---|---|
| `.opencode/skills/design-system/` | Remplace par la skill `orion-ds-to-html` |
| `.opencode/skills/maquette-golden-example/` | Criteres integres dans `orion-ds-to-html` |
| `designSystemOrion.md` (a la racine) | Tokens migres dans la skill sous forme de fichiers CSS |
| `exempleDesignOrion.html` (a la racine) | Patterns CSS integres dans la skill `orion-ds-to-html` |
| `README.md` (a la racine) | Perime (decrivait la structure v1). Le guide a jour vit dans `guide-utilisation/` |
| `installation-lecture-fichiers.md` (ancienne version) | Remplace par `workspace-docs/installation-lecture-fichiers_v2.md` |

> **Important** : le dezip **n'efface jamais** ces fichiers — il faut les supprimer a la main. Le fichier `verif-v2.md` (a jouer apres l'install) detecte automatiquement ceux qui restent et vous dit lesquels supprimer.

### Etape 4 — Redemarrer OpenCode (imperatif)

**Fermez completement OpenCode Desktop puis relancez-le.** C'est **obligatoire** : sans
redemarrage, l'assistant continue de tourner avec l'ancienne configuration en memoire
(anciens fichiers, anciennes skills) et la mise a jour ne sera pas prise en compte.

Apres le redemarrage, l'assistant detectera automatiquement les nouveaux fichiers a la
prochaine conversation. Vous pouvez alors jouer `verif-v2.md` pour controler l'installation.

---

## Ce qui a change (resume)

### Nouvelle architecture : orchestrateur + sous-agents

C'est le changement le plus important. L'assistant fonctionne desormais en **equipe** :

| Role | Modele | Ce qu'il fait |
|---|---|---|
| **Orchestrateur** (AGENTS.md) | Claude Opus | Comprend votre demande, identifie le mode (spec/maquette/libre), delegue au bon sous-agent |
| **Spec Writer** | Claude Sonnet | Lit vos sources, pose les questions, redige la spec, propose de publier sur Confluence |
| **Maquette Generator** | Claude Sonnet | Lit la spec, assemble le design system, genere la maquette HTML |
| **Confluence Explorer** | Claude Sonnet | Lit et resume les pages Confluence |
| **Jira Explorer** | Claude Sonnet | Lit et resume les tickets, US et sprints Jira (projet ORI) |
| **Figma Explorer** | Claude Sonnet | Explore et decrit les fichiers Figma |

**En pratique pour vous** : rien ne change. Vous demandez toujours "redige la spec" ou "genere la maquette" et l'assistant fait le reste. L'equipe travaille en coulisses.

### Nouveau : publication sur Confluence

Apres avoir genere une spec, l'assistant **propose** de la publier directement sur Confluence :

> "La spec est prete. Tu veux que je la publie sur Confluence ?"

Si vous confirmez, il cree ou met a jour la page. Si vous refusez, la spec reste en local dans `livrables-opencode/`.

**Securite** : l'assistant ne publiera JAMAIS sur Confluence/Jira sans votre confirmation explicite. Meme chose pour toute modification (editer une page, creer un ticket, ajouter un commentaire).

### Nouveau : connexion Confluence et Figma

L'assistant peut **aller chercher du contenu directement sur Confluence et Figma** :

| Ce que vous dites | Ce que l'assistant fait |
|---|---|
| "Va chercher la spec sur Confluence" | Lit la page et en fait un resume |
| "Regarde le design sur Figma" + lien | Explore le fichier et decrit la structure |
| *(pas de demande explicite)* | Si vos sources contiennent un lien, il **propose** d'aller voir |

> **Confluence (MCP Atlassian)** : requis pour le detail fonctionnel. A la premiere utilisation,
> OpenCode affiche un ecran de consentement Atlassian — autorisez la connexion.
>
> **Figma (MCP Figma)** : **optionnel**, utile uniquement pour le mode Maquette a partir de Figma.
> Prerequis pour l'activer : avoir **Figma installe en application bureau** (pas la version navigateur)
> et le **mode Dev** active. Sans cela, l'assistant travaille normalement a partir de vos autres sources.

### Nouveau : corpus fonctionnel dans `docs/`

Le glossaire metier, les regles transverses et le contexte fonctionnel sont maintenant documentes dans un dossier `docs/` dedie. Depuis la 2.1, `docs/` est une **carte** (pointeurs `page_id` Confluence + nomenclature RG + pieges connus) : le detail fonctionnel est lu en direct sur Confluence via MCP. L'assistant y accede automatiquement quand il a besoin de contexte fonctionnel.

### Nouveau : design system modulaire

La skill `orion-ds-to-html` remplace les anciennes skills `design-system` + `maquette-golden-example` :
- 23 fichiers CSS individuels pre-valides (un par composant)
- 23 fiches techniques composants
- L'assistant ne charge que ce dont il a besoin (plus leger, plus coherent)

---

## Ce qui n'a PAS change

- Votre facon de travailler (memes commandes, memes demandes)
- La structure `mon-espace/[sujet]/livrables-opencode/`
- La memoire utilisateur (preferences conservees entre conversations)
- Le circuit-breaker (une conversation = un sujet)
- Le versionnement des livrables (v1, v2, v3...)

---

## Structure des nouveaux fichiers

```
.opencode/
├── agents/
│   ├── spec-writer.md              ← Redige les specs (Sonnet)
│   ├── maquette-generator.md       ← Genere les maquettes (Sonnet)
│   ├── confluence-explorer.md      ← Lit Confluence (Sonnet)
│   ├── jira-explorer.md            ← Lit les tickets / sprints Jira (Sonnet)
│   └── figma-explorer.md           ← Explore Figma (Sonnet)
├── skills/
│   ├── orion-ds-to-html/           ← Design system modulaire (23 composants)
│   ├── orion-spec-explorer/        ← Navigation carte fonctionnelle (Confluence live)
│   ├── orion-spec-sync/            ← Validation des pointeurs Confluence
│   ├── spec-golden-example/        ← Standard qualite specs
│   ├── confluence-conventions/     ← Formatage Confluence
│   └── input-preprocessor/         ← Lecture fichiers binaires
docs/                               ← Carte fonctionnelle Orion (pointeurs Confluence)
├── INDEX.md                        ← Glossaire + nomenclature RG + index des domaines
├── 00-contexte / 01-regles-transverses ← Socle stable (consultable sans MCP)
└── mp1 a mp6 + 08 + 09-*.md        ← Cartes domaine (page_id + pieges)
```

---

## Securite : ce que l'assistant ne fera JAMAIS sans votre accord

| Action | Comportement |
|---|---|
| Modifier une page Confluence | Demande confirmation avant |
| Creer un ticket Jira | Demande confirmation avant |
| Publier une spec sur Confluence | Propose, attend votre "oui" |
| Modifier un fichier Figma | **Impossible** — acces lecture seule |
| Modifier les fichiers systeme du workspace | Avertissement + confirmation |

---

## En cas de probleme

Si l'assistant semble utiliser l'ancien comportement :
1. **Redemarrez OpenCode Desktop** (fermeture complete puis relance) — c'est la cause n°1 : la mise a jour n'est prise en compte qu'apres un redemarrage
2. Verifiez que les fichiers obsoletes sont supprimes (voir Etape 3)
3. Verifiez que vous etes sur la derniere version d'OpenCode Desktop (voir Etape 1)
4. Demarrez une **nouvelle conversation**
5. Jouez `verif-v2.md` pour un diagnostic complet

Si le probleme persiste, contactez votre referent IA.
