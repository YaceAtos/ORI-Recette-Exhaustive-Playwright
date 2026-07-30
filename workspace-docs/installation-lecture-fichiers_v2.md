# Instructions d'installation — Lecture de fichiers sources (v2 — kit V2)

> **Ce fichier est destine a l'assistant IA, pas a l'utilisateur.**
> Pour l'utiliser : ouvre OpenCode Desktop, joins ce fichier en piece jointe,
> et ecris simplement : **"execute cette mise a jour"**

---

## Contexte

Le workspace IA Orion a besoin de Python et de quelques bibliotheques pour lire
les fichiers binaires (PDF, Word, Excel, PowerPoint). Sans ces prerequis,
l'assistant ne peut pas extraire le contenu des fichiers sources deposes dans
les dossiers de travail.

Ce script d'installation fait **deux choses** :
1. **Installe Python + bibliotheques** sur le poste (si absent)
2. **Ecrit le fichier `.opencode/memory/python-config.md`** pour que l'assistant
   sache localiser Python dans toutes les futures conversations

> **Nouveaute kit V2** : la configuration du workspace (`opencode.json` et la skill
> `input-preprocessor`) est desormais **livree deja configuree** dans le kit V2.
> Ce script n'a donc plus a patcher ces fichiers — il se limite a installer Python,
> les bibliotheques, et a ecrire `python-config.md`.

---

## Instructions pour l'assistant IA

**Tu es un assistant d'installation. Execute les etapes ci-dessous dans l'ordre,
sur le poste Windows de l'utilisateur. Communique en francais a chaque etape.
Si une etape echoue, explique clairement le probleme et propose une solution.**

**REGLES CRITIQUES :**
- Utilise TOUJOURS des chemins absolus pour appeler Python (jamais juste `python` nu apres une installation)
- Sur Windows, les variables d'environnement comme `%LOCALAPPDATA%` doivent etre resolues via le terminal
- Si une commande echoue, ne passe PAS silencieusement a la suite — signale le probleme
- Chaque etape doit afficher un message de statut a l'utilisateur (succes ou echec)

---

# PARTIE A — Installation de Python et des bibliotheques

## Etape 1 — Verifier si Python est deja installe

Tester les commandes suivantes **dans cet ordre**. S'arreter des que l'une fonctionne (affiche "Python 3.x.x" avec x >= 8) :

```
python --version
```

Si echec (commande introuvable, ouvre le Microsoft Store, ou version < 3.8), essayer :

```
python3 --version
```

Si echec, essayer :

```
py --version
```

Si echec, chercher Python dans les chemins d'installation connus sur Windows.
Executer chacune de ces commandes (arreter des que l'une fonctionne) :

```
dir "%LOCALAPPDATA%\Programs\Python\Python3*\python.exe" /b /s 2>nul
```

```
dir "%LOCALAPPDATA%\Microsoft\WindowsApps\python*.exe" /b /s 2>nul
```

```
dir "%APPDATA%\Python\Python3*\python.exe" /b /s 2>nul
```

**Si l'une de ces recherches retourne un chemin** :
- Tester ce chemin : `"<chemin_trouve>" --version`
- Si ca affiche une version Python 3.8+ : stocker ce chemin en memoire et afficher :
  "Python [version] detecte a [chemin]. Passage a l'etape 3."
- Passer directement a l'etape 3.

**Si Python est trouve via les commandes simples** (`python`, `python3`, ou `py`) :
- Afficher : "Python [version] est deja installe. Passage a l'etape 3."
- Passer a l'etape 3.

**Si aucune methode ne trouve Python** :
- Afficher : "Python n'est pas installe. Installation en cours..."
- Passer a l'etape 2.

---

## Etape 2 — Installer Python (si absent)

Essayer dans cet ordre. S'arreter des que l'une des methodes reussit.

### Methode A — winget (recommandee)

```
winget install Python.Python.3.12 --scope user --accept-package-agreements --accept-source-agreements --silent
```

Apres l'installation, **ne pas tester `python --version`** (le PATH n'est pas encore a jour
dans cette session). Passer directement a l'etape 3 qui localisera Python par chemin absolu.

Si `winget` n'est pas disponible ou echoue : passer a la methode B.

### Methode B — Telechargement direct

```
curl -L -o "%TEMP%\python-installer.exe" https://www.python.org/ftp/python/3.12.8/python-3.12.8-amd64.exe
```

Puis lancer l'installation silencieuse (mode utilisateur, pas besoin de droits admin) :

```
"%TEMP%\python-installer.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_pip=1 Include_launcher=1
```

Attendre la fin (1-2 minutes). Ne pas tester `python --version` — passer directement a l'etape 3.

### Si aucune methode ne fonctionne

Afficher :

> L'installation automatique de Python n'a pas fonctionne (probablement une
> restriction du poste). Demande a ton service informatique d'installer
> Python 3.12 sur ton poste. Precise bien de cocher "Add to PATH" pendant
> l'installation. Une fois fait, relance ce fichier.

**S'arreter la. Ne pas continuer aux etapes suivantes.**

---

## Etape 3 — Localiser Python (chemin absolu)

**OBJECTIF** : obtenir le chemin absolu de l'executable Python. Ce chemin sera utilise
pour TOUTES les commandes suivantes et sera persiste dans la configuration du workspace.

**Si Python etait deja installe a l'etape 1** (commande `python`, `python3`, ou `py` fonctionnelle) :
- Executer `where python` (ou `where python3` / `where py` selon ce qui a fonctionne)
- Stocker le premier chemin retourne comme `PYTHON_PATH`
- Si `where` ne retourne rien, utiliser directement le nom de commande qui fonctionnait

**Si Python vient d'etre installe a l'etape 2** :
Le PATH n'est pas a jour dans cette session. Chercher l'executable dans les chemins connus :

```
dir "%LOCALAPPDATA%\Programs\Python\Python3*\python.exe" /b /s 2>nul
```

Si rien :
```
dir "%LOCALAPPDATA%\Microsoft\WindowsApps\python*.exe" /b /s 2>nul
```

Si rien :
```
dir "%APPDATA%\Python\Python3*\python.exe" /b /s 2>nul
```

**Des qu'un chemin est trouve** :
- Le tester : `"<chemin_trouve>" --version`
- Si ca fonctionne : stocker ce chemin comme `PYTHON_PATH`
- Afficher : "Python localise a : [PYTHON_PATH]"

**Si aucun chemin n'est trouve** (rare — uniquement si l'installation a echoue silencieusement) :
Afficher :

> Python a ete installe mais je ne le trouve pas sur le disque.
> Ferme et relance OpenCode Desktop, puis rejoins ce fichier et ecris :
> **"reprends l'installation a l'etape 3"**
>
> Le redemarrage permettra a OpenCode de voir Python dans le PATH.

**S'arreter la. Ne pas continuer.**

---

## Etape 4 — Verifier pip

Executer (en utilisant le `PYTHON_PATH` de l'etape 3) :

```
"<PYTHON_PATH>" -m pip --version
```

**Si pip est disponible** : passer a l'etape 5.

**Si pip est absent** :
```
"<PYTHON_PATH>" -m ensurepip --upgrade
```

Reverifier :
```
"<PYTHON_PATH>" -m pip --version
```

Si toujours absent, afficher une erreur explicative et s'arreter.

---

## Etape 5 — Installer les bibliotheques d'extraction

Executer (en utilisant le `PYTHON_PATH` de l'etape 3) :

```
"<PYTHON_PATH>" -m pip install pdfplumber python-docx openpyxl python-pptx markitdown
```

Si l'installation echoue pour des problemes de droits, retenter avec `--user` :

```
"<PYTHON_PATH>" -m pip install --user pdfplumber python-docx openpyxl python-pptx markitdown
```

**Bibliotheques installees et leur role :**
| Bibliotheque | Import Python | Formats geres |
|---|---|---|
| pdfplumber | `pdfplumber` | PDF (.pdf) — texte et tableaux |
| python-docx | `docx` | Word (.docx) |
| openpyxl | `openpyxl` | Excel (.xlsx) |
| python-pptx | `pptx` | PowerPoint (.pptx) |
| markitdown | `markitdown` | PDF, Word, Excel, PowerPoint (alternative tout-en-un Microsoft) |

---

## Etape 6 — Verification finale des imports

Executer ce script de verification :

```
"<PYTHON_PATH>" -c "import pdfplumber; import docx; import openpyxl; import pptx; import markitdown; print('OK - Toutes les bibliotheques sont installees.')"
```

**Si la commande affiche "OK"** :
- Afficher : "Toutes les bibliotheques sont installees. Passage a la configuration du workspace."
- Passer a la PARTIE B.

**Si un import echoue** :
- Identifier quel import pose probleme
- Retenter l'installation de la bibliotheque concernee individuellement :
  `"<PYTHON_PATH>" -m pip install --user <nom_bibliotheque>`
- Reverifier l'import
- Si echec persistant : afficher le message d'erreur exact et proposer de contacter le support

---

# PARTIE B — Configuration du workspace

> **Rappel kit V2** : `opencode.json` et la skill `input-preprocessor` sont **deja
> configures dans le kit V2**. Il n'y a donc plus de patch a appliquer sur ces fichiers.
> Cette partie se limite a creer le fichier de configuration Python.

## Etape 7 — Creer le fichier de configuration Python

Creer le fichier `.opencode/memory/python-config.md` avec le contenu suivant.
**Remplacer les valeurs entre `<...>` par les valeurs reelles** obtenues aux etapes precedentes :

```markdown
# Configuration Python — Poste local

> Fichier genere automatiquement par le script d'installation.
> Ne pas supprimer. Utilise par l'assistant pour localiser Python a chaque conversation.

## Chemin Python
<PYTHON_PATH obtenu a l'etape 3>

## Version
<version affichee par python --version>

## Bibliotheques installees
- pdfplumber (PDF)
- python-docx / import: docx (Word)
- openpyxl (Excel)
- python-pptx / import: pptx (PowerPoint)
- markitdown (alternative tout-en-un Microsoft)

## Regles d'encodage (a respecter SYSTEMATIQUEMENT)
- Ne JAMAIS imprimer du texte extrait vers stdout (crash encoding Windows cp1252)
- TOUJOURS ecrire dans un fichier UTF-8 : open(chemin, 'w', encoding='utf-8')
- TOUJOURS utiliser glob.glob() pour les chemins avec accents
- TOUJOURS lire le fichier de sortie avec l'outil Read natif apres execution

## Date d'installation
<date du jour au format JJ mois AAAA>
```

### Gestion du cas "le fichier existe deja"

En kit V2, ce fichier **existe tres souvent deja** (poste deja configure, ou reinstallation).
Ce n'est PAS une erreur. Comportement attendu :

- **Si `.opencode/memory/python-config.md` n'existe pas** : le creer avec les valeurs obtenues.
- **Si le fichier existe deja** : l'**ecraser sans demander confirmation**. Les valeurs sont
  toutes re-derivees pendant cette execution (chemin Python, version, date), donc la nouvelle
  version est toujours a jour. Ne PAS conserver l'ancien contenu, ne PAS fusionner, ne PAS
  demander a l'utilisateur — ecraser directement.

> Ce fichier est purement technique et auto-genere. Il ne contient aucune donnee utilisateur
> a preserver. L'ecrasement est donc sans risque.

Apres la creation ou l'ecrasement, afficher :
- Si nouveau : "Configuration Python creee dans .opencode/memory/python-config.md"
- Si ecrase : "Configuration Python mise a jour dans .opencode/memory/python-config.md"

---

# PARTIE C — Confirmation finale

## Etape 8 — Message de succes

Afficher a l'utilisateur :

> **Installation terminee avec succes !**
>
> **Ce qui a ete installe :**
> - Python [version] a [chemin]
> - Bibliotheques : pdfplumber, python-docx, openpyxl, python-pptx, markitdown
>
> **Ce qui a ete configure :**
> - `.opencode/memory/python-config.md` — le chemin Python est persiste pour les futures conversations
>
> _Note : le kit V2 est deja livre configure (`opencode.json` et la skill `input-preprocessor`
> contiennent deja les instructions d'extraction Python). Ce script n'installe donc que Python,
> les bibliotheques, et le fichier `python-config.md`._
>
> **L'assistant IA peut maintenant lire les fichiers suivants :**
> - PDF (.pdf)
> - Word (.docx)
> - Excel (.xlsx)
> - PowerPoint (.pptx)
>
> **Aucun redemarrage necessaire.** Tu peux deposer tes fichiers sources dans
> `mon-espace/[ton-sujet]/` et commencer a travailler.
>
> **A ne faire qu'une seule fois par poste.** Si tu changes de poste, relance ce fichier.
