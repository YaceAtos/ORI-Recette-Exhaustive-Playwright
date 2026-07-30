---
name: writing-skills
description: "Use when creating, editing, reviewing, or auditing a skill or agent definition (Agent Skills format, any harness). Triggers: 'cree un skill', 'ecris un skill', 'audite ce skill', 'revois cet agent', 'ce skill respecte-t-il les standards'."
---

# Writing Skills — Quality Standards

## Overview

Standards pour les skills au format Agent Skills (standard ouvert) — portable entre harnesses (OpenCode, Claude Code, Copilot...). Chaque skill doit etre decouvert par l'agent au bon moment, concis, et testable.

## When to Use / When NOT to Use

**Utiliser** : creer, editer, reviewer ou auditer un skill ou un agent au format Agent Skills, quel que soit le harness.

**Ne PAS utiliser** :
- Code metier / scripts applicatifs → deleguer a un agent dev
- Executer la tache-metier d'un skill existant (ce skill ecrit des skills, il ne les fait pas tourner)
- Choisir entre skill / agent / instructions persistantes / MCP → voir "Avant de creer : est-ce un skill ?" ci-dessous

## Avant de creer : est-ce un skill ?

Avant de creer un nouveau skill, determiner le bon outil :

| Besoin | Outil |
|--------|-------|
| Instructions domaine-specifiques chargees a la demande | **Skill** |
| Persona / modele / permissions propres a une tache | **Agent (subagent)** |
| Raccourci court one-shot declenche par l'utilisateur | **Command** (si le harness en a) |
| Regle transversale toujours active | **Instructions persistantes** (AGENTS.md, CLAUDE.md...) |
| Outil/service externe a invoquer | **Serveur MCP** |

Chemins concrets selon le harness (ex. OpenCode : `.opencode/skills/`). Le format SKILL.md (frontmatter `name` + `description`) est identique partout — voir agentskills.io.

> Charge ponctuel → skill. Comportement persistant → agent / instructions persistantes.

## Dependances

Rendre explicites les dependances externes (ne pas les masquer).

| Type | Exemple | Declarer dans |
|------|---------|---------------|
| Outil / CLI | d2, docker, ffmpeg | "Requirements" + check au demarrage |
| Lib de script | requirements.txt, package.json | fichier pinne (versions exactes) |
| Autre skill | depend du skill X | frontmatter `requires` (slug + raison) si supporte |
| MCP / service externe | API, endpoint | Requirements ; secret hors du skill |
| Environnement | version Python, OS, reseau | `compatibility` si supporte, sinon Requirements |

- Declarer le pourquoi, pas juste lister.
- Verifier les prerequis au demarrage ; echouer clair (comment installer).
- Minimiser : pas de script si la prose suffit.
- Degradation gracieuse si possible (fallback, defaut sain).
- Pre-condition dans la description quand l'activation en depend.

## Process

1. **Gather requirements** — poser a l'utilisateur :
   - Quelle tache/domaine le skill couvre ?
   - Quels cas d'usage specifiques ?
   - Faut-il des scripts executables ou juste des instructions ?
   - Materiaux de reference a inclure ?

2. **Draft the skill** — avant d'ecrire sur disque, montrer le diff a l'utilisateur et attendre son accord explicite.

   ```diff
   + ## Quick start
   + [exemple minimal]
   - ## Introduction
   - [prose inutile]
   ```

   **Regle** : aucune ecriture sur disque sans accord explicite ("ok", "go", "valide"). Si l'utilisateur n'a pas vu le diff → STOP.

3. **Review with user** — presenter le draft et demander validation avant commit.

## Mise a jour proactive

A la fin de toute session ou le skill a ete utilise, verifier :

1. **Un anti-pattern nouveau a ete rencontre ?** → l'ajouter au tableau Anti-patterns.
2. **Une regle implicite a ete appliquee ?** → la rendre explicite dans Process ou Checklist.
3. **Le skill depasse ~250 lignes ?** → smell test : du reference deguise en inline ? (pas un split automatique)

> Ne pas attendre que l'utilisateur demande une mise a jour. Proposer systematiquement : "Ce skill merite une mise a jour — go ?"

## Structure de fichiers

```
skill-name/
├── SKILL.md           # Instructions principales (requis)
├── REFERENCE.md       # Docs detaillees (si SKILL.md > 250 lignes)
├── EXAMPLES.md        # Exemples d'usage (si besoin)
└── int2-ihm-scripts/           # Scripts utilitaires (si besoin)
    └── helper.py
```

**Quand splitter** — juge au contenu, pas au compteur de lignes :
- **Inline** = tenu en memoire de travail tout du long (process, jugement, regles cles)
- **Reference-eligible** = recupere en bloc a une etape precise (specs, tables, gros template)
- Ex : un Template se copie en bloc au scaffold → candidat reference s'il est gros (40-50+ lignes) ; court → inline
- Contenu a domaines distincts → fichiers separes

**Quand ajouter des scripts** :
- Operation deterministe (validation, formatage, generation)
- Meme code genere a repetition → le bundler evite les tokens
- Gestion d'erreurs explicite necessaire

## Description (frontmatter)

La description est **la seule chose que l'agent voit** pour decider quel skill charger. Elle est listee dans le system prompt a cote de tous les autres skills.

**Objectif** : donner assez d'info pour savoir :
1. Ce que le skill fait (1ere phrase)
2. Quand/pourquoi le declencher (2e phrase, triggers)

**Regles** :
- Max 1024 chars
- 3e personne
- 1ere phrase : capacite ("Genere...", "Extrait...")
- 2e phrase : "Utiliser quand [triggers specifiques]"
- Inclure mots-cles concrets que l'utilisateur dirait
- Ne PAS resumer le workflow ou le livrable

```yaml
# BAD — trop vague, pas de triggers
description: "Aide pour les documents."

# BAD — resume le livrable
description: "Analyse une US Jira. Produit un .md structure avec comprehension metier, recap technique, zones de flou..."

# GOOD — capacite + triggers
description: "Analyse les grosses User Stories Jira en livrables structures. Utiliser quand l'utilisateur dit 'analyse cette US', 'decouper', ou fournit une US en PDF/docx."
```

## Template SKILL.md

```markdown
---
name: kebab-case
description: "Capacite en 1 phrase. Utiliser quand [triggers specifiques]."
---

# Titre

## Quick start
[Exemple minimal fonctionnel — montre le skill en action]

## When to Use / When NOT to Use
- Symptomes declenchants
- Anti-scope explicite

## Workflow
[Etapes du process avec checklists pour taches complexes]

## Advanced features
[Lien vers fichiers separes : See [REFERENCE.md](./REFERENCE.md)]
```

## Regles de concision

| Type de skill | Repere indicatif (smell test) |
|---------------|-----------------------|
| Skill frequent (charge souvent) | < 150 lignes |
| Skill standard | cible < 250 lignes |
| Skill avec heavy reference | corps < 250 lignes + fichiers separes |

> ~250 lignes = smell test (pas un gate) : si tu depasses, demande-toi s'il y a du reference deguise en inline. Seul hard gate : ~500 lignes (au-dela, split obligatoire). Le cout d'un skill = tokens en contexte, pas octets disque : ce qui est tenu en memoire tout du long reste inline, ce qui se recupere en bloc va en reference.

Techniques :
- Pas de prose explicative si l'agent sait deja
- Cible = LLM : couper la prose motivationnelle/pedagogique destinee a un humain. Garder le "pourquoi" UNIQUEMENT s'il evite une mauvaise application d'une regle non-evidente.
- Cross-references vers d'autres skills plutot que repetition
- Un excellent exemple > trois mediocres
- Fichiers separes pour contenu > 250 lignes

## Anti-patterns

| Anti-pattern | Correction |
|--------------|-----------|
| Description qui resume le workflow | Description = capacite + triggers uniquement |
| Narration ("En session du 3 oct, on a trouve...") | Pattern reutilisable |
| Exemples multi-langages | Un seul exemple excellent |
| Labels generiques (step1, helper2) | Noms semantiques |
| Reference deguise en inline (detail rare gonfle le corps) | Extraire le detail — juge au contenu, pas au compteur |
| Pas de "When NOT to use" | Toujours delimiter l'anti-scope |
| Info time-sensitive (dates, versions) | Contenu intemporel uniquement |
| Prose motivationnelle pour humain (le LLM le sait deja) | Imperatif actionnable seul |

## Checklist pre-commit

- [ ] `name` : kebab-case, lettres/chiffres/tirets uniquement
- [ ] `description` : 1ere phrase = capacite, 2e = "Use when...", < 1024 chars
- [ ] Si corps > ~250 lignes : smell test passe (pas de reference deguise en inline)
- [ ] "When NOT to use" present
- [ ] Un exemple concret (pas de template generique)
- [ ] Pas de narration ni de prose inutile
- [ ] Pas d'info time-sensitive
- [ ] Terminologie coherente
- [ ] Fichiers separes si reference > 250 lignes
- [ ] Scripts si operations deterministes repetees
- [ ] Bon outil verifie (skill vs agent vs command vs instructions persistantes vs MCP)
- [ ] Dependances externes declarees (outils, libs, autres skills, MCP) avec leur raison
- [ ] Diff montre avant ecriture, accord recu
- [ ] (Si partage large / scripts sensibles) Scan SkillSpector passe — sinon garde-fous agent suffisent

## Testing

Avant deploiement, verifier dans une session de test (subagent ou nouveau contexte) :

1. **Discovery** : prompt vague correspondant au domaine → le skill est-il selectionne ?
2. **Application** : tache concrete → la session produit-elle le bon output ?
3. **Anti-scope** : cas hors perimetre → le skill est-il ignore ?

Si un test echoue : ajuster description ou contenu, re-tester.

## Securite — garde-fous

Tout skill s'execute avec confiance implicite. En generant un skill, l'agent applique ces 6 regles universelles (script ou pas) :

1. Pas d'ordres caches qui detournent l'IA de sa mission
2. Pas d'envoi de donnees vers l'exterieur
3. Pas de collecte de secrets / mots de passe / cles
4. Validation humaine pour toute action destructrice (suppression, deploy, envoi)
5. Declencheur precis — pas de mots-cles trop generiques
6. Le skill fait seulement ce que sa description annonce (pas de scope creep)

Le createur n'a aucune commande a lancer : ces regles sont verifiees a la generation.

**Scan automatique (optionnel)** — pour un skill destine a etre partage largement, ou contenant des scripts sensibles, un dev peut lancer un scan SkillSpector ou l'integrer en CI. Setup et bareme → voir [SECURITY.md](./SECURITY.md).
