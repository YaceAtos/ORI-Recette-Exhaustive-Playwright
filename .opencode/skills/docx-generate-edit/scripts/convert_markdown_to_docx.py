from __future__ import annotations

import io
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Union
from urllib.parse import urlparse

import requests
from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches
from PIL import Image


EMU_PER_INCH = 914400
DEFAULT_CONFIG = {
    "styles": {
        "title": "Heading 1",
        "heading": {
            "2": "Heading 2",
            "3": "Heading 3",
            "4": "Heading 4",
            "5": "Heading 5",
            "6": "Heading 6",
        },
        "paragraph": "Normal",
        "list": "List Paragraph",
        "caption": "Caption",
        "image": "Picture",
        "table": "Table Grid",
    },
    "lists": {
        "max_level": 2,
    },
    "headings": {
        "strip_leading_number": True,
    },
}

WORD_NAMESPACE = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": WORD_NAMESPACE}


HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")
LIST_RE = re.compile(r"^(\s*)[-*]\s+(.*)$")
IMAGE_RE = re.compile(r"^!\[(?P<alt>.*?)]\((?P<src>[^)]+)\)\s*$")
# Énumérateur manuel en tête de titre : "1. ", "2) ", "5.1 ", "3.2.1. "...
# Les styles de titre du template numérotent déjà automatiquement ; on retire
# le numéro manuel pour éviter la double numérotation (ex : "5.1  1. Objet").
LEADING_ENUM_RE = re.compile(r"^\s*\d+(?:\.\d+)*[.)]?\s+")
# Ligne de tableau GFM : contient au moins un '|' (hors échappé).
TABLE_ROW_RE = re.compile(r"^\s*\|?.*\|.*$")
# Ligne séparatrice GFM : ne contient que des |, -, :, espaces (ex: |---|:--:|).
TABLE_DELIM_RE = re.compile(r"^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$")
# Marqueurs d'emphase markdown à retirer du texte de cellule.
EMPHASIS_RE = re.compile(r"\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|`(.+?)`")


@dataclass(frozen=True)
class HeadingBlock:
    level: int
    text: str


@dataclass(frozen=True)
class ParagraphBlock:
    text: str


@dataclass(frozen=True)
class ListBlock:
    text: str
    level: int


@dataclass(frozen=True)
class ImageBlock:
    alt_text: str
    source: str


@dataclass(frozen=True)
class CaptionBlock:
    text: str


@dataclass(frozen=True)
class TableBlock:
    header: tuple[str, ...]
    rows: tuple[tuple[str, ...], ...]


Block = Union[HeadingBlock, ParagraphBlock, ListBlock, ImageBlock, CaptionBlock, TableBlock]


def _clean_cell(text: str) -> str:
    return text.strip()


def _split_table_row(line: str) -> list[str]:
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [_clean_cell(cell) for cell in line.split("|")]


def parse_markdown(markdown_text: str) -> list[Block]:
    blocks: list[Block] = []
    paragraph_lines: list[str] = []

    def flush_paragraph() -> None:
        if not paragraph_lines:
            return

        text = " ".join(line.strip() for line in paragraph_lines).strip()
        paragraph_lines.clear()
        if not text:
            return

        if text.startswith("*") and text.endswith("*") and len(text) > 2:
            blocks.append(CaptionBlock(text=text[1:-1].strip()))
            return

        blocks.append(ParagraphBlock(text=text))

    lines = markdown_text.splitlines()
    index = 0
    while index < len(lines):
        raw_line = lines[index]
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped:
            flush_paragraph()
            index += 1
            continue

        # Tableau GFM : ligne d'en-tête suivie d'une ligne séparatrice |---|---|.
        if (
            "|" in stripped
            and index + 1 < len(lines)
            and TABLE_DELIM_RE.match(lines[index + 1].strip())
            and TABLE_ROW_RE.match(stripped)
        ):
            flush_paragraph()
            header = tuple(_split_table_row(stripped))
            rows: list[tuple[str, ...]] = []
            index += 2  # saute en-tête + séparateur
            while index < len(lines) and lines[index].strip() and "|" in lines[index]:
                rows.append(tuple(_split_table_row(lines[index].strip())))
                index += 1
            blocks.append(TableBlock(header=header, rows=tuple(rows)))
            continue

        heading_match = HEADING_RE.match(stripped)
        if heading_match:
            flush_paragraph()
            level = len(heading_match.group(1))
            blocks.append(HeadingBlock(level=level, text=heading_match.group(2).strip()))
            index += 1
            continue

        image_match = IMAGE_RE.match(stripped)
        if image_match:
            flush_paragraph()
            blocks.append(ImageBlock(alt_text=image_match.group("alt").strip(), source=image_match.group("src").strip()))
            index += 1
            continue

        list_match = LIST_RE.match(line)
        if list_match:
            flush_paragraph()
            indent = len(list_match.group(1).replace("\t", "    "))
            blocks.append(ListBlock(text=list_match.group(2).strip(), level=min(indent // 2, 2)))
            index += 1
            continue

        paragraph_lines.append(stripped)
        index += 1

    flush_paragraph()
    return blocks


def clear_document_body(document: Document) -> None:
    body = document._element.body
    section_properties = body.sectPr
    for child in list(body):
        if child is section_properties:
            continue
        body.remove(child)


def load_config(config_path: Path | None) -> dict:
    config = json.loads(json.dumps(DEFAULT_CONFIG))
    if not config_path or not config_path.exists():
        return config

    user_config = json.loads(config_path.read_text(encoding="utf-8"))
    _deep_update(config, user_config)
    return config


def _deep_update(base: dict, overrides: dict) -> None:
    for key, value in overrides.items():
        if isinstance(value, dict) and isinstance(base.get(key), dict):
            _deep_update(base[key], value)
            continue
        base[key] = value


def resolve_list_num_id(template_path: Path, style_name: str, configured_num_id: int | None) -> int:
    if configured_num_id is not None:
        return int(configured_num_id)

    with zipfile.ZipFile(template_path) as archive:
        styles_root = ET.fromstring(archive.read("word/styles.xml"))

    style_id = None
    for style in styles_root.findall("w:style", NS):
        name = style.find("w:name", NS)
        if name is None:
            continue
        if name.get(f"{{{WORD_NAMESPACE}}}val") != style_name:
            continue
        style_id = style.get(f"{{{WORD_NAMESPACE}}}styleId")
        ppr = style.find("w:pPr", NS)
        if ppr is not None:
            num_pr = ppr.find("w:numPr", NS)
            if num_pr is not None:
                num_id = num_pr.find("w:numId", NS)
                if num_id is not None:
                    return int(num_id.get(f"{{{WORD_NAMESPACE}}}val"))
        break

    if style_id is None:
        raise ValueError(f"Unable to find list style '{style_name}' in template styles.")

    with zipfile.ZipFile(template_path) as archive:
        numbering_root = ET.fromstring(archive.read("word/numbering.xml"))

    style_abstract_num_id = None
    for abstract_num in numbering_root.findall("w:abstractNum", NS):
        for level in abstract_num.findall("w:lvl", NS):
            paragraph_style = level.find("w:pStyle", NS)
            if paragraph_style is None:
                continue
            if paragraph_style.get(f"{{{WORD_NAMESPACE}}}val") != style_id:
                continue
            style_abstract_num_id = abstract_num.get(f"{{{WORD_NAMESPACE}}}abstractNumId")
            break
        if style_abstract_num_id is not None:
            break

    if style_abstract_num_id is None:
        for num in numbering_root.findall("w:num", NS):
            num_id = int(num.get(f"{{{WORD_NAMESPACE}}}numId"))
            if num_id > 0:
                return num_id
        raise ValueError(f"Unable to resolve numId for list style '{style_name}'.")

    for num in numbering_root.findall("w:num", NS):
        abstract_num_id = num.find("w:abstractNumId", NS)
        if abstract_num_id is None:
            continue
        if abstract_num_id.get(f"{{{WORD_NAMESPACE}}}val") == style_abstract_num_id:
            return int(num.get(f"{{{WORD_NAMESPACE}}}numId"))

    raise ValueError(f"Unable to map abstract numbering for list style '{style_name}' to a numId.")


def resolve_image_bytes(source: str, markdown_path: Path) -> bytes:
    parsed = urlparse(source)
    if parsed.scheme in {"http", "https"}:
        response = requests.get(source, timeout=60)
        response.raise_for_status()
        return response.content

    image_path = (markdown_path.parent / source).resolve()
    return image_path.read_bytes()


def get_max_image_width_inches(document: Document) -> float:
    section = document.sections[-1]
    usable_width = section.page_width - section.left_margin - section.right_margin
    return usable_width / EMU_PER_INCH


def add_image(document: Document, image_bytes: bytes, max_width_inches: float, style: str) -> None:
    paragraph = document.add_paragraph(style=style)
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _set_explicit_paragraph_style(paragraph, paragraph.style.style_id)

    with Image.open(io.BytesIO(image_bytes)) as image:
        width_px, _ = image.size
        dpi = image.info.get("dpi", (96, 96))[0] or 96
        width_inches = width_px / dpi

    display_width = min(width_inches, max_width_inches)
    run = paragraph.add_run()
    run.add_picture(io.BytesIO(image_bytes), width=Inches(display_width))


def _add_inline_runs(paragraph, text: str) -> None:
    """Découpe le texte selon l'emphase markdown et crée des runs formatés.

    `**gras**` / `__gras__` -> gras, `*italique*` -> italique, `` `code` `` -> texte brut.
    """
    pos = 0
    for match in EMPHASIS_RE.finditer(text):
        if match.start() > pos:
            paragraph.add_run(text[pos:match.start()])
        content = next(group for group in match.groups() if group is not None)
        run = paragraph.add_run(content)
        if match.group(1) is not None or match.group(2) is not None:
            run.bold = True
        elif match.group(3) is not None:
            run.italic = True
        pos = match.end()
    if pos < len(text):
        paragraph.add_run(text[pos:])
    if not paragraph.runs:
        paragraph.add_run("")


def add_paragraph(document: Document, text: str, style: str) -> None:
    paragraph = document.add_paragraph(style=style)
    _add_inline_runs(paragraph, text)
    _set_explicit_paragraph_style(paragraph, paragraph.style.style_id)


def add_table(document: Document, header, rows, style: str) -> None:
    column_count = max([len(header)] + [len(row) for row in rows]) if header or rows else 0
    if column_count == 0:
        return

    table = document.add_table(rows=1, cols=column_count)
    try:
        table.style = style
    except (KeyError, ValueError):
        pass  # style absent du template : tableau sans style explicite

    def fill_row(cells, values, bold: bool) -> None:
        for col_index in range(column_count):
            value = values[col_index] if col_index < len(values) else ""
            cell = cells[col_index]
            cell.text = ""
            paragraph = cell.paragraphs[0]
            _add_inline_runs(paragraph, value)
            if bold:
                for run in paragraph.runs:
                    run.bold = True

    fill_row(table.rows[0].cells, list(header), bold=True)
    for row in rows:
        fill_row(table.add_row().cells, list(row), bold=False)


def add_list_paragraph(document: Document, text: str, level: int, style: str, num_id: int, max_level: int) -> None:
    paragraph = document.add_paragraph(style=style)
    _add_inline_runs(paragraph, text)
    _set_explicit_paragraph_style(paragraph, paragraph.style.style_id)
    _set_paragraph_numbering(paragraph, num_id, min(level, max_level))


def _set_explicit_paragraph_style(paragraph, style_id: str) -> None:
    ppr = paragraph._p.get_or_add_pPr()
    style_element = ppr.find(qn("w:pStyle"))
    if style_element is None:
        style_element = OxmlElement("w:pStyle")
        ppr.insert(0, style_element)
    style_element.set(qn("w:val"), style_id)


def _set_paragraph_numbering(paragraph, num_id: int, level: int) -> None:
    ppr = paragraph._p.get_or_add_pPr()
    num_pr = ppr.find(qn("w:numPr"))
    if num_pr is None:
        num_pr = OxmlElement("w:numPr")
        ppr.append(num_pr)

    ilvl = num_pr.find(qn("w:ilvl"))
    if ilvl is None:
        ilvl = OxmlElement("w:ilvl")
        num_pr.append(ilvl)
    ilvl.set(qn("w:val"), str(level))

    num_id_element = num_pr.find(qn("w:numId"))
    if num_id_element is None:
        num_id_element = OxmlElement("w:numId")
        num_pr.append(num_id_element)
    num_id_element.set(qn("w:val"), str(num_id))


def render_blocks(blocks: Iterable[Block], template_path: Path, markdown_path: Path, output_path: Path) -> None:
    document = Document(str(template_path))
    config = load_config(markdown_path.parent / "markdown_to_docx_config.json")
    clear_document_body(document)
    max_width_inches = get_max_image_width_inches(document)
    styles = config["styles"]
    heading_styles = styles["heading"]
    list_max_level = int(config["lists"]["max_level"])
    strip_heading_number = bool(config.get("headings", {}).get("strip_leading_number", True))
    list_num_id = resolve_list_num_id(template_path, styles["list"], config["lists"].get("num_id"))

    for block in blocks:
        if isinstance(block, HeadingBlock):
            style = styles["title"] if block.level == 1 else heading_styles.get(str(block.level), f"Heading {min(block.level, 9)}")
            text = block.text
            if strip_heading_number:
                text = LEADING_ENUM_RE.sub("", text, count=1).strip() or block.text
            add_paragraph(document, text, style)
            continue

        if isinstance(block, ParagraphBlock):
            add_paragraph(document, block.text, styles["paragraph"])
            continue

        if isinstance(block, ListBlock):
            add_list_paragraph(document, block.text, block.level, styles["list"], list_num_id, list_max_level)
            continue

        if isinstance(block, ImageBlock):
            image_bytes = resolve_image_bytes(block.source, markdown_path)
            add_image(document, image_bytes, max_width_inches, styles["image"])
            continue

        if isinstance(block, CaptionBlock):
            add_paragraph(document, block.text, styles["caption"])
            continue

        if isinstance(block, TableBlock):
            add_table(document, block.header, block.rows, styles.get("table", "Table Grid"))
            continue

    document.save(str(output_path))


def main() -> int:
    if len(sys.argv) not in {3, 4}:
        print("Usage: python convert_markdown_to_docx.py <input.md> <template.docx> [output.docx]")
        return 1

    markdown_path = Path(sys.argv[1]).resolve()
    template_path = Path(sys.argv[2]).resolve()
    output_path = Path(sys.argv[3]).resolve() if len(sys.argv) == 4 else markdown_path.with_suffix(".docx")

    blocks = parse_markdown(markdown_path.read_text(encoding="utf-8"))
    render_blocks(blocks, template_path, markdown_path, output_path)
    print(output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
