---
name: cr-reunion
description: Genere un compte-rendu de reunion structure (.md ou .docx) a partir d'un transcript brut. Use when 'CR de reunion', 'compte-rendu', 'transcript', 'generer un CR', 'meeting notes', 'CR atelier', ou fichier transcript (.docx/.txt/.vtt).
---

# Meeting CR — Compte-rendu anti-hallucination

## Regle d'or

> **JAMAIS inventer un terme, un concept ou un nom qui n'apparait pas explicitement dans le transcript.**

## When NOT to Use

- Notes deja structurees (pas un transcript brut)
- Reunion dont tu as assiste toi-meme (redige directement)
- Besoin d'un PV formel avec signatures (pas le scope de ce skill)
- Audio/video sans transcription textuelle prealable

## Workflow obligatoire

### Phase 1 — Extraction

Lire le transcript et extraire :
- Les **verbatims cles** (citations exactes qui portent une decision ou un concept)
- Les **sujets abordes** (liste brute)
- Les **decisions explicites** vs **questions ouvertes**
- Les **actions identifiees** (qui fait quoi)
- Les **doutes detectes** : termes ambigus (voir R7), decisions floues, attributions incertaines

Regle : a ce stade, ne rien reformuler. Extraire tel quel.

### Phase 2 — Proposition du plan + clarification

Presenter a l'utilisateur **en un seul message** :

**A) Le plan du CR** avec notes cles + choix format :

```
Plan propose :
1. [Sujet] — [decision X validee, question Y ouverte]
2. [Sujet] — [mecanisme Z, action W]
...
N. Actions et prochaines etapes

Format : .md (markdown) ou .docx (Word) ?
```

**B) Les doutes** (seulement s'il y en a) :

```
[N] points a clarifier :
1. Terme ambigu : [Prenom] dit "[verbatim]" → terme exact ?
2. Decision floue : [resume] → valide, en discussion, ou question ouverte ?
3. Contexte manquant : [terme/acronyme] non defini → c'est quoi ?
```

**Si aucun doute** → plan + format uniquement.

**Quoi lister comme doute** :
- Termes exploratoires ("on va dire que...", "le truc qui...")
- Concepts nommes une seule fois sans confirmation
- Decisions sans accord explicite des autres participants
- Attributions d'actions sans designation claire
- Acronymes/termes metier non definis

**Regles** :
- Attendre validation (plan + doutes + format) avant generation
- "Je sais pas" sur un doute → `[non resolu]` → "Zones a confirmer"
- Glossaire ou contexte fourni → source de verite

### Phase 3 — Generation

Generer le CR dans le format choisi :
- **.md** : sortie directe markdown
- **.docx** : generer via skill existant ou python-docx

Appliquer les regles strictes :
- [ ] Plan valide par l'utilisateur respecte
- [ ] Chaque terme correspond a la reponse utilisateur ou est explicite dans le transcript
- [ ] Chaque "Valide" correspond a un accord explicite
- [ ] Les points non resolus portent `[a confirmer]`
- [ ] Aucun participant fantome

### Phase 4 — Restitution

Presenter le CR. Si des `[a confirmer]` subsistent, les lister en fin de CR.

## Regles anti-hallucination

Detail complet : [REFERENCE.md](./REFERENCE.md)

| Regle | Resume |
|-------|--------|
| **R1** | Zero invention terminologique |
| **R2** | Verbatim > interpretation |
| **R3** | Distinguer : Valide / En discussion / Question ouverte / Hors perimetre |
| **R4** | Flagging `[a confirmer]` obligatoire si incertain |
| **R5** | Pas de fusion de concepts distincts |
| **R6** | Attribution prudente (qui dit quoi) |
| **R7** | Contexte d'enonciation : terme definitif vs exploratoire → si doute, clarifier en Phase 2 |

## Zones de risque

Concepts abstraits, terminologie metier specifique, mecanismes techniques → redoubler de prudence, citer verbatims.
