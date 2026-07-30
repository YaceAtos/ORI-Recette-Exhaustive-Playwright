---
name: input-preprocessor
description: Regles de lecture et extraction de contenu pour les fichiers sources (PDF, Excel, Word, PowerPoint, images, texte) avec persistence dans _extraction.md et seuil de confiance
---

# Skill : Pretraitement des Fichiers d'Entree

Cette skill definit les regles de lecture et d'extraction de contenu pour chaque type de fichier source depose dans `mon-espace/[nom-du-sujet]/`.

L'objectif est de transformer tout fichier source en contenu structure exploitable pour la generation de specs ou de maquettes, et de **persister cette extraction** dans un fichier `_extraction.md` pour permettre le rework entre conversations.

---

## Regle generale — Verifier d'abord si une extraction existe

AVANT de lire les fichiers sources, **toujours verifier** si le fichier `mon-espace/[nom-du-sujet]/livrables-opencode/_extraction.md` existe deja.

### Si `_extraction.md` existe

1. Lire `_extraction.md`
2. Comparer la liste des fichiers documentes dans `_extraction.md` (section "Fichiers traites") avec les fichiers reellement presents dans `mon-espace/[nom-du-sujet]/` (hors `livrables-opencode/`)
3. **Si aucun nouveau fichier** : proposer a l'utilisateur de reutiliser l'extraction existante :
   > Une extraction precedente existe deja. Elle couvre les fichiers suivants : [liste]. Tu veux que je reutilise cette extraction, ou que je relise tout depuis le debut ?
4. **Si de nouveaux fichiers sont detectes** : signaler les nouveaux fichiers et ne lire que ceux-la. Completer `_extraction.md` avec les nouvelles extractions.

### Si `_extraction.md` n'existe pas

Processus normal : lire tous les fichiers, confirmer avec l'utilisateur, puis persister (voir sections suivantes).

---

## Lecture et extraction des fichiers sources

Ne jamais ignorer un fichier silencieusement. Si un fichier ne peut pas etre lu (format inconnu, fichier corrompu), le signaler explicitement a l'utilisateur.

### Documents texte — Lecture directe
| Format | Action |
|---|---|
| `.md` | Lire directement. C'est le format ideal pour les entrees. |
| `.txt` | Lire directement. |
| `.csv` | Lire directement. Interpreter comme donnees tabulaires. |
| `.html` | Lire directement. Peut servir de reference visuelle ou de source de contenu. |

### Documents Office — Extraction via Python

**IMPORTANT** : L'outil Read natif d'OpenCode ne peut PAS lire les fichiers binaires Office.
Utiliser Python avec les bibliotheques installees. Voir la section "Methode d'extraction des fichiers binaires" ci-dessous.

| Format | Bibliotheque Python | Action |
|---|---|---|
| `.xlsx` / `.xls` | openpyxl | Extraire les donnees tabulaires en preservant la structure des onglets. Identifier les en-tetes de colonnes. Resumer le contenu de chaque onglet en tableau markdown. |
| `.docx` / `.doc` | python-docx (import: docx) | Extraire le texte structure en preservant la hierarchie des titres (H1/H2/H3). Extraire les tableaux en format markdown. |
| `.pptx` / `.ppt` | python-pptx (import: pptx) | Extraire le contenu slide par slide. Pour chaque slide : titre + contenu textuel + description des elements visuels pertinents. |

### PDF — Extraction via Python

**IMPORTANT** : L'outil Read natif d'OpenCode ne peut PAS lire les fichiers PDF.
Utiliser Python avec pdfplumber. Voir la section "Methode d'extraction des fichiers binaires" ci-dessous.

| Format | Bibliotheque Python | Action |
|---|---|---|
| `.pdf` (texte) | pdfplumber | Extraire le texte structure. Preserver les tableaux et la hierarchie. |
| `.pdf` (scanne/images) | pdfplumber + Read natif (pour les images) | Tenter l'extraction texte avec pdfplumber. Si le resultat est vide ou incoherent, lire le PDF comme image avec l'outil Read natif pour decrire les elements visuels. **Avertissement automatique** : afficher "Ce fichier est un scan/image. Mon extraction peut etre imprecise. Verifie les elements cles." |

### Images — Description et analyse
| Format | Action |
|---|---|
| `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.bmp` | Lire avec l'outil de lecture de fichiers (qui supporte les images). Decrire en detail : disposition des elements, texte visible, couleurs, composants UI identifiables, flux de navigation apparent. **Avertissement automatique** : afficher "Cette image a ete analysee visuellement. Verifie que ma description correspond bien a ce que tu vois." |

---

## Methode d'extraction des fichiers binaires

### Principe

L'outil Read natif d'OpenCode ne peut PAS lire les fichiers binaires (PDF, DOCX, XLSX, PPTX).
Pour extraire le contenu de ces fichiers, il faut executer un **script Python** via le terminal Bash.

### Comment trouver Python

Suivre cette procedure dans l'ordre :

1. **Lire `.opencode/memory/python-config.md`** — si ce fichier existe, utiliser le chemin absolu documente dans la section "Chemin Python"
2. **Si le fichier n'existe pas** — tester les commandes : `python --version`, `python3 --version`, `py --version`
3. **Si aucune commande ne fonctionne** — chercher dans les chemins connus Windows :
   - `%LOCALAPPDATA%\Programs\Python\Python3*\python.exe`
   - `%LOCALAPPDATA%\Microsoft\WindowsApps\python*.exe`
   - `%APPDATA%\Python\Python3*\python.exe`
4. **Si Python n'est toujours pas trouve** — afficher :
   > Python n'est pas installe sur ce poste. Demande a l'utilisateur de joindre le fichier
   > `installation-lecture-fichiers.md` (a la racine du workspace) et d'ecrire "execute cette mise a jour".

### Regles d'encodage — OBLIGATOIRES sur Windows

Ces regles sont NON NEGOCIABLES. Le terminal Windows utilise l'encodage cp1252.
Imprimer du texte Unicode vers stdout provoque des crashes systematiques.

1. **JAMAIS** imprimer le contenu extrait vers stdout (`print()`)
2. **TOUJOURS** ecrire le resultat dans un fichier `.txt` ou `.md` encode en UTF-8 :
   `open(chemin, 'w', encoding='utf-8')`
3. **TOUJOURS** utiliser `glob.glob()` pour resoudre les chemins contenant des accents
   (ne pas passer de noms de fichiers accentues en argument console)
4. **TOUJOURS** lire le fichier de sortie avec l'outil Read natif apres execution du script

### Patron d'extraction — PDF

```python
import pdfplumber, glob, os
fichiers = glob.glob(r"mon-espace/<sujet>/*.pdf")
for f in fichiers:
    sortie = os.path.splitext(f)[0] + "_extraction.txt"
    with pdfplumber.open(f) as pdf:
        texte = "\n\n".join(page.extract_text() or "" for page in pdf.pages)
    with open(sortie, "w", encoding="utf-8") as out:
        out.write(texte)
    print(f"Extrait : {sortie}")
```

### Patron d'extraction — Word (.docx)

```python
import docx, glob, os
fichiers = glob.glob(r"mon-espace/<sujet>/*.docx")
for f in fichiers:
    sortie = os.path.splitext(f)[0] + "_extraction.txt"
    doc = docx.Document(f)
    texte = "\n".join(p.text for p in doc.paragraphs)
    with open(sortie, "w", encoding="utf-8") as out:
        out.write(texte)
    print(f"Extrait : {sortie}")
```

### Patron d'extraction — Excel (.xlsx)

```python
import openpyxl, glob, os
fichiers = glob.glob(r"mon-espace/<sujet>/*.xlsx")
for f in fichiers:
    sortie = os.path.splitext(f)[0] + "_extraction.txt"
    wb = openpyxl.load_workbook(f, data_only=True)
    lignes = []
    for nom_feuille in wb.sheetnames:
        ws = wb[nom_feuille]
        lignes.append(f"## Onglet : {nom_feuille}")
        for row in ws.iter_rows(values_only=True):
            lignes.append(" | ".join(str(c) if c is not None else "" for c in row))
    with open(sortie, "w", encoding="utf-8") as out:
        out.write("\n".join(lignes))
    print(f"Extrait : {sortie}")
```

### Patron d'extraction — PowerPoint (.pptx)

```python
import pptx, glob, os
fichiers = glob.glob(r"mon-espace/<sujet>/*.pptx")
for f in fichiers:
    sortie = os.path.splitext(f)[0] + "_extraction.txt"
    prs = pptx.Presentation(f)
    lignes = []
    for i, slide in enumerate(prs.slides, 1):
        lignes.append(f"## Slide {i}")
        for shape in slide.shapes:
            if shape.has_text_frame:
                lignes.append(shape.text)
    with open(sortie, "w", encoding="utf-8") as out:
        out.write("\n".join(lignes))
    print(f"Extrait : {sortie}")
```

### Alternative — markitdown (tout-en-un)

La bibliotheque `markitdown` de Microsoft peut extraire le contenu de PDF, DOCX, XLSX, PPTX
en une seule commande. Utiliser en alternative si un patron specifique echoue :

```python
from markitdown import MarkItDown
md = MarkItDown()
result = md.convert("<chemin_du_fichier>")
with open("<chemin_sortie>.md", "w", encoding="utf-8") as out:
    out.write(result.text_content)
```

---

## Confirmation de lecture obligatoire

Apres avoir lu tous les fichiers, et **AVANT** de passer a la redaction ou generation, afficher un resume de lecture a l'utilisateur :

```
## Fichiers lus dans mon-espace/[nom-du-sujet]/

| Fichier | Type | Confiance | Resume |
|---|---|---|---|
| cadrage-MP4.pdf | PDF texte | Haute | Document de cadrage SP4.1, 12 pages, 3 schemas |
| notes.md | Markdown | Haute | Notes de reunion du 10/03, points ouverts identifies |
| screenshot-ecran.png | Image | Moyenne | Capture d'ecran d'un formulaire, texte partiellement lisible |
```

**Attendre la validation de l'utilisateur** avant de continuer. L'utilisateur peut :
- Confirmer ("c'est bon, continue")
- Signaler un fichier mal lu ("le PDF contenait aussi un tableau page 8")
- Indiquer un fichier manquant ("il manque le compte-rendu de la reunion")

---

## Priorisation des sources

Quand le dossier contient **3 fichiers ou plus**, demander a l'utilisateur :

> Quel est le document principal / le plus fiable ? En cas de contradiction entre les sources, lequel fait reference ?

Cette information permet de resoudre les incoherences entre documents (ex : une note de reunion contredit un document de cadrage officiel).

---

## Persistence de l'extraction — Fichier `_extraction.md`

**Apres validation de l'utilisateur**, generer ou mettre a jour le fichier `mon-espace/[nom-du-sujet]/livrables-opencode/_extraction.md`.

### Structure du fichier

```markdown
# Extraction des fichiers sources
> Fichier genere automatiquement par l'assistant. Ne pas supprimer.
> Il permet de reutiliser l'extraction dans les conversations suivantes sans relire tous les fichiers.
>
> Derniere mise a jour : [JJ mois AAAA]
> Fichiers traites : [liste des noms de fichiers separes par des virgules]

---

## Fichier : [nom-du-fichier-1.ext]
- **Type** : [categorie du fichier]
- **Confiance** : [Haute / Moyenne / Basse]
- **Contenu principal** : [resume en 1-2 phrases]
- **Elements cles extraits** :
  - [element 1]
  - [element 2]
- **Points d'attention** : [elements manquants, zones floues, etc.]

### Contenu detaille
[contenu extrait structure en markdown]

---

## Fichier : [nom-du-fichier-2.ext]
[meme structure]
```

### Regles de persistence
- **Creer** le fichier apres la premiere extraction validee par l'utilisateur
- **Completer** le fichier si de nouveaux fichiers sont ajoutes au dossier (ajouter les nouvelles sections, mettre a jour la date et la liste des fichiers traites)
- **Ne jamais ecraser** une extraction existante sauf si l'utilisateur demande explicitement de tout relire ("relis tout depuis le debut")
- Le fichier `_extraction.md` n'est **pas** un livrable — c'est un fichier technique intermediaire. Il n'est pas versionne (pas de suffixe _vN).

---

## Gestion des echecs d'extraction

### Regle du seuil de confiance
Si tu n'es pas sur a **90% ou plus** de l'extraction d'un fichier :
1. **STOPPER** le traitement de ce fichier
2. Signaler le probleme a l'utilisateur avec le maximum de contexte :
   - Ce que tu as reussi a lire
   - Ce qui semble manquer ou flou
   - Ce dont tu as besoin pour continuer
3. Proposer des alternatives : "Peux-tu fournir une version texte de ce document ?" ou "Peux-tu confirmer que [ce que j'ai compris] est correct ?"

### Ne jamais inventer pour combler
Si une section d'un document est illisible ou ambigue, marquer `[Extraction incertaine — verifier avec le fichier source]` plutot que de deviner le contenu.

---

## Limites et recommandations

### Taille des fichiers
- **Fichiers volumineux (> 50 pages PDF, > 20 onglets Excel)** : Signaler a l'utilisateur que le fichier est volumineux et demander quelles sections sont prioritaires. Traiter par sections si necessaire.
- **Fichiers tres lourds en images** : Privilegier la description des elements cles plutot qu'une analyse exhaustive de chaque pixel.

---

## Fichiers a ignorer
- `.gitkeep` : fichiers techniques, ignorer silencieusement
- `.DS_Store`, `Thumbs.db` : fichiers systeme, ignorer silencieusement
- Dossier `livrables-opencode/` : ne pas lire les livrables precedents comme sources (sauf demande explicite de l'utilisateur). **Exception** : `_extraction.md` est lu en priorite (voir section "Regle generale").

---

## Fichiers joints dans le chat

Quand l'utilisateur joint un fichier directement dans le message (glisser-deposer, bouton d'attachement) au lieu de le deposer dans `mon-espace/[nom-du-sujet]/` :

**REGLE CRITIQUE : ne JAMAIS tenter de lire le contenu d'une piece jointe directement en memoire.** Certains formats (PDF, Office, images) ne sont pas lisibles directement depuis le message. Le seul flux fiable est : sauvegarder d'abord sur le disque, puis lire avec les outils de lecture de fichiers.

### Processus sequentiel obligatoire

1. **Verifier que le sujet est resolu** : si aucun sujet de travail n'a ete identifie dans la conversation, demander a l'utilisateur quel sujet il traite avant de continuer (voir AGENTS.md, section "Resolution du sujet de travail"). **Ne pas passer a l'etape 2 tant que le sujet n'est pas resolu.**
2. **Tenter de sauvegarder le fichier** dans `mon-espace/[nom-du-sujet]/` a la racine du dossier sujet
   - Si un fichier du meme nom existe deja dans le dossier, demander confirmation avant d'ecraser
3. **Si la sauvegarde reussit** : traiter le fichier sauvegarde (depuis le disque, pas depuis le message) via le processus normal de cette skill :
   - Appliquer les regles de lecture selon le type de fichier (voir sections ci-dessus)
   - Afficher le resume de lecture et attendre la validation de l'utilisateur
   - Mettre a jour `_extraction.md` si applicable (ajouter la nouvelle section, mettre a jour la date et la liste des fichiers traites)
4. **Si la sauvegarde echoue** (format non lisible depuis le message) : demander **immediatement et clairement** a l'utilisateur de deposer le fichier lui-meme dans le dossier. Un seul message, court et actionnable :

   > Je n'ai pas pu recuperer le fichier joint (limitation technique sur les PDF/fichiers binaires). J'ai cree le dossier de travail `mon-espace/[nom-du-sujet]/`. Depose le fichier dedans et dis-moi quand c'est fait — je prends le relai.

   **Pas de workarounds multiples, pas de propositions alternatives.** Un seul message clair avec le chemin exact du dossier.

### Regles

- **Ne jamais court-circuiter** : ne pas tenter de lire la piece jointe directement depuis le message, meme si le format semble lisible. Toujours tenter de sauvegarder d'abord.
- Le fichier joint est traite exactement comme s'il avait ete depose manuellement dans le dossier du sujet — aucune difference de traitement
- Cette regle s'applique a tous les modes (Spec, Maquette, Libre)
