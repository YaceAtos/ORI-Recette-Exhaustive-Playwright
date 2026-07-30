---
name: docx-generate-edit
description: Use when the user wants to create, enrich, or update a Word document while preserving a provided DOCX template
---

# DOCX Template Workflows
To generate a new Word:
- If the user did not provide Markdown, first generate a clean intermediate Markdown version of the requested content, then use the converter or insertion helpers.
- New `.docx` from `.md` + template: use `convert_markdown_to_docx.py`.
- Exact converter call: `python convert_markdown_to_docx.py <input.md> <template.docx> [output.docx]`. Do not invent `--template` or swap argument order.
- If the user did not specify an existing template, use `template.docx` located in the skill folder. 
- Create `markdown_to_docx_config.json` in the working folder from the example config, then adjust it only if the target template needs different style mappings.

To update an existing Word:
- Update/insert inside an existing `.docx`: use `docx_insert_helper.py` and the example script pattern.
- For helper-based insertion scripts, make imports resolvable from the execution location. Reuse the skill `int2-ihm-scripts/` path explicitly if needed.

# SCRIPTS TO USE
  - `convert_markdown_to_docx.py` for a new `.docx` generated from Markdown + template
  - `markdown_to_docx_config.json` as the active style mapping, placed at the root of the working folder, next to the Markdown/output files
  - `int2-ihm-scripts/markdown_to_docx_config.example.json` as the config template to copy/adapt into the working folder
  - `docx_insert_helper.py` for inserting/updating styled content in an existing `.docx`
  - `example_insert_opencode_chapter.py` as the insertion pattern/example

# RULES
- Before changing styles, check the style names directly in the Word you target (whether the template or the existing Word)
- Heading numbering: the Atos template auto-numbers headings via the heading styles. Do NOT keep manual numbers in heading text — the converter strips a leading enumerator (`1.`, `2)`, `5.1`...) by default (`headings.strip_leading_number`, default `true`) to avoid double numbering (e.g. `5.1  1. Objet`). Set it to `false` only for a template whose heading styles do NOT auto-number.
- Markdown tables (GFM `| a | b |` + `|---|---|` separator) are rendered as real Word tables using the `styles.table` style (default `Table Grid`). If the template lacks that style, the table is created without an explicit style instead of failing.
- Do not use file `Read` on `.docx`; it is a binary file. Inspect `.docx` with `python-docx`
- On PowerShell, avoid complex or multiline `python -c` for DOCX inspection; use a short temporary `.py` script instead.
- On PowerShell, when writing temporary Python scripts with accents or other non-ASCII text, save them explicitly as UTF-8, for example with `Set-Content -Encoding utf8`.
- When printing Word text to the console, avoid raw Unicode failures on Windows terminal output. Prefer targeted checks, UTF-8-safe output, or file-level validation over dumping large raw paragraph ranges.
- After generation/update, check: list style, visible bullets/dashes, normal paragraph style, embedded images, and whether the target `.docx` is locked by Word.
- Prefer config changes for style mapping issues; edit Python only for real behavior gaps.

# VALIDATION CHECKS
If you detect the language is French, always do a double check to ensure the content added to the Word contains the correct accents and special characters.
