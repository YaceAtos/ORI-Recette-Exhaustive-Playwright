# REFERENCE — Regles detaillees et template CR

## Regles anti-hallucination (detail)

### R1 — Zero invention terminologique

**Interdit** : inventer un nom de concept, meme s'il semble logique.

| Situation | Mauvais reflexe | Bonne pratique |
|-----------|-----------------|----------------|
| Le transcript dit "le truc qui fait que quand tu changes en bas, ca remonte automatiquement en haut" | Inventer un nom : "Mecanisme de synchronisation ascendante" | Ecrire "Mecanisme ou un changement en bas se propage vers le haut [a confirmer : nom exact du mecanisme]" |
| Le transcript dit "le machin qui gere les comptes la" | Ecrire "Module de gestion des comptes" (terme invente) | Ecrire "Outil de gestion des comptes [a confirmer : nom exact]" |
| Un participant hesite entre 2 formulations | Choisir celle qui "sonne mieux" | Lister les 2 formulations avec verbatim |

### R2 — Verbatim > Interpretation

Quand un concept est complexe ou ambigu, inclure le verbatim entre guillemets :

```markdown
Marc precise le mecanisme : "en fait c'est le lien hierarchique qui determine si on peut deplacer l'element ou pas"
```

Cela permet au relecteur de **verifier** sans remonter au transcript.

### R3 — Distinguer les statuts de decision

Chaque point du CR doit porter un statut explicite :

| Statut | Marqueur | Quand l'utiliser |
|--------|----------|-----------------|
| Decision validee | **(Valide)** | Accord explicite de plusieurs participants dans le transcript |
| Discute sans conclusion | **(En discussion)** | Le sujet a ete aborde mais aucun accord explicite |
| Question ouverte | **(Question ouverte)** | Le transcript montre qu'on attend un retour/une info |
| Hors perimetre | **(Hors perimetre)** | Explicitement ecarte du scope |
| Reporte | **(Reporte)** | Decision explicitement remise a plus tard |

**Regle** : pour marquer **(Valide)**, il faut trouver dans le transcript un accord explicite (type "oui", "c'est bon", "on valide", "OK", "d'accord on part la-dessus"). Un monologue explicatif sans confirmation des autres n'est PAS une validation.

### R4 — Flagging obligatoire

Le tag `[a confirmer]` est obligatoire quand :
- Un terme est utilise sans etre clairement defini
- Un participant semble decrire un concept sans le nommer
- Une decision semble implicite mais n'est pas verbalisee clairement
- Le transcript est inaudible/tronque a un moment cle

### R5 — Pas de fusion de concepts

Si le transcript aborde 2 sujets proches mais distincts (ex: "droits d'acces" et "cone de visibilite"), ils restent en sections separees. Ne pas fusionner pour "simplifier".

### R6 — Attribution prudente

- N'attribuer une action qu'a une personne explicitement nommee
- Si le transcript dit "on va faire ca" sans preciser qui → ecrire "**[Responsable a confirmer]**"
- Ne pas deviner le role d'une personne a partir de son nom

### R7 — Contexte d'enonciation

Meme si un terme apparait litteralement dans le transcript, evaluer **comment** il est employe :

| Signal oral | Interpretation | Action |
|-------------|----------------|--------|
| "C'est ce qu'on appelle X" / "le X, donc..." | Terme definitif, assume | Utiliser tel quel |
| "On va dire que X serait..." / "genre un X quoi" / "le truc X la" | Terme exploratoire, hesitant | **Lister en Phase 2 pour clarification** |
| "Le X — enfin je sais pas comment on dit" | Terme explicitement incertain | **Lister en Phase 2 pour clarification** |
| X est dit une seule fois, jamais repris | Possiblement accidentel | **Lister en Phase 2 pour clarification** |

**Pourquoi** : un transcript oral contient des formulations provisoires que le locuteur n'utiliserait jamais a l'ecrit. Le modele ne doit pas les cristalliser en termes officiels.

**Exemple** :
- Transcript : "on va dire que profil minimum serait le droit de mettre..."
- Mauvais reflexe : nommer le concept "Profil minimum" dans le CR
- Bonne pratique : lister en Phase 2 → "Carole utilise le terme 'profil minimum' de maniere hesitante. Quel est le nom exact de ce mecanisme ?"

---

## Template CR (.md)

```markdown
# [Date] — [Type de reunion] — [Sujets principaux]

**Date** : [jour mois annee]
**Duree** : [si connue]
**Participants** : [liste confirmee]
**Absents excuses** : [si connu]

---

## 1. [Sujet 1 — Titre descriptif]

[Contexte en 1-2 phrases : qui presente, pourquoi on en parle]

### 1.1 [Sous-sujet]

| Point | Description | Statut |
|-------|-------------|--------|
| ... | ... | (Valide) / (En discussion) / (Question ouverte) |

> Verbatim cle : "[citation]" — [Prenom]

### 1.2 [Sous-sujet]

...

---

## N. Actions et prochaines etapes

| Responsable | Action | Echeance | Statut |
|-------------|--------|----------|--------|
| **Prenom** | [action precise] | [date si mentionnee] | A faire |
| **[A confirmer]** | [action] | — | A faire |

---

## Zones a confirmer

- [ ] [Point 1 flagge dans le CR]
- [ ] [Point 2 flagge dans le CR]
```

---

## Gestion du glossaire

Si l'utilisateur fournit un glossaire, l'utiliser comme **contrainte dure** :

- Tout terme du CR doit etre soit dans le glossaire, soit un mot courant du francais
- Si un terme du transcript semble correspondre a un terme du glossaire → utiliser le terme du glossaire
- Si aucune correspondance → flag `[a confirmer]` et proposer a l'utilisateur

### Exemple de glossaire attendu

```
Sprint = Iteration de 2 semaines
PO = Product Owner
US = User Story
DoD = Definition of Done
Backlog = Liste priorisee des items a realiser
MVP = Minimum Viable Product
```

---

## Checklist pre-livraison

Avant de presenter le CR a l'utilisateur, verifier :

- [ ] Aucun terme invente (tout est tracable dans le transcript ou le glossaire)
- [ ] Tous les "(Valide)" correspondent a un accord explicite
- [ ] Les zones d'ambiguite portent `[a confirmer]`
- [ ] Pas de participant fantome (non identifiable dans le transcript)
- [ ] Actions attribuees uniquement si le transcript est explicite
- [ ] Concepts abstraits accompagnes d'un verbatim de reference
- [ ] Statuts de decision explicites sur chaque point
