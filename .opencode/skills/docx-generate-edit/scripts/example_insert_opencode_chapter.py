from docx import Document

from docx_insert_helper import (
    InsertOptions,
    InsertPosition,
    ParagraphBlock,
    insert_blocks,
    resolve_paragraph_style,
)


def build_opencode_chapter() -> list[ParagraphBlock]:
    return [
        ParagraphBlock("Heading 3", "Chapitre complémentaire : OpenCode"),
        ParagraphBlock("Heading 4", "OpenCode, environnement d'assistance au développement"),
        ParagraphBlock(
            "Body Text",
            "OpenCode est un environnement de travail assisté par IA conçu pour accélérer les activités d'analyse, de développement, de vérification et de transformation documentaire. Son intérêt ne réside pas uniquement dans la génération de texte ou de code, mais dans sa capacité à opérer directement dans un espace de travail contrôlé, avec accès aux fichiers, aux scripts et aux outils nécessaires à l'exécution concrète des tâches.",
        ),
        ParagraphBlock(
            "Body Text",
            "Dans une démarche projet, OpenCode agit comme un assistant d'exécution capable de comprendre un besoin formulé en langage naturel, d'explorer le contenu disponible, d'identifier les éléments utiles, de proposer ou de réaliser les modifications attendues, puis de contrôler le résultat obtenu. Cette logique réduit les ruptures entre intention, production et vérification.",
        ),
        ParagraphBlock("Heading 4", "Une logique d'intervention orientée résultat"),
        ParagraphBlock(
            "Body Text",
            "L'un des apports majeurs d'OpenCode est son positionnement comme agent opérationnel et non comme simple interface conversationnelle. Il peut analyser une arborescence de travail, lire les fichiers pertinents, rechercher des occurrences, modifier des contenus, lancer des commandes de vérification et restituer une synthèse directement exploitable. Cette approche favorise un traitement plus rapide et plus fiable des demandes à faible ou moyenne complexité.",
        ),
        ParagraphBlock("Body Text", "Dans ce cadre, OpenCode peut notamment contribuer à :"),
        ParagraphBlock("List Paragraph", "la production et la mise à jour de contenus techniques ou fonctionnels ;"),
        ParagraphBlock("List Paragraph", "l'analyse de documents et la structuration d'informations utiles ;"),
        ParagraphBlock("List Paragraph", "la modification ciblée de fichiers sources ou de documents de travail ;"),
        ParagraphBlock("List Paragraph", "l'automatisation de tâches répétitives de contrôle, de transformation ou d'insertion ;"),
        ParagraphBlock("List Paragraph", "la vérification du résultat par exécution de scripts, contrôles ou tests adaptés au contexte."),
        ParagraphBlock("Heading 4", "Un cadre de travail maitrise et traçable"),
        ParagraphBlock(
            "Body Text",
            "OpenCode intervient dans un environnement borné, avec des outils explicitement mobilisés et des actions observables. Cette caractéristique est importante dans des contextes exigeant de la rigueur, car elle permet de limiter les opérations au périmètre utile, de conserver une cohérence de traitement et d'assurer une meilleure traçabilité des transformations réalisées.",
        ),
        ParagraphBlock(
            "Body Text",
            "Cette maîtrise du cadre d'exécution est particulièrement utile lorsque les travaux portent sur des documents sensibles, des livrables contractuels, des scripts techniques ou des contenus devant rester conformes à une structure existante. L'outil peut alors s'inscrire dans une logique d'assistance renforcée, sans perdre de vue les contraintes de qualité et de contrôle humain.",
        ),
        ParagraphBlock("Heading 4", "Un accélérateur pour la documentation et les livrables"),
        ParagraphBlock(
            "Body Text",
            "Dans la production documentaire, OpenCode permet de gagner du temps sur des opérations souvent coûteuses en charge : enrichissement d'un mémoire technique, ajout de chapitres complémentaires, harmonisation de formulations, extraction d'informations depuis des sources existantes ou encore génération de contenus structurellement cohérents avec un document de référence.",
        ),
        ParagraphBlock(
            "Body Text",
            "L'outil est ainsi pertinent pour soutenir la préparation de réponses à consultation, la consolidation de notes de cadrage, la formalisation de synthèses techniques ou la mise à jour rapide de documents à forte composante répétitive. Il permet d'augmenter la productivité tout en conservant un niveau de personnalisation adapté au besoin réel.",
        ),
        ParagraphBlock("Heading 4", "Un appui utile pour les équipes techniques"),
        ParagraphBlock(
            "Body Text",
            "Pour les équipes de développement, OpenCode apporte un soutien concret sur l'exploration d'un code existant, l'identification des points de modification, la réalisation de correctifs limités, la rédaction de scripts utilitaires et la vérification rapide des impacts. Il favorise une intervention ciblée, limite les manipulations dispersées et facilite la compréhension d'un contexte technique avant action.",
        ),
        ParagraphBlock(
            "Body Text",
            "Cette capacité est d'autant plus utile dans des environnements où les délais sont contraints et où la qualité d'exécution est déterminante. OpenCode ne se substitue pas à l'expertise métier ou à la responsabilité de validation, mais constitue un levier d'accélération, de clarification et de fiabilisation du travail quotidien.",
        ),
        ParagraphBlock("Heading 4", "Une complémentarité entre IA, outillage et supervision humaine"),
        ParagraphBlock(
            "Body Text",
            "La valeur d'OpenCode repose enfin sur l'articulation entre capacités d'IA, outillage d'exécution et supervision humaine. L'outil peut préparer, transformer, vérifier et documenter, tandis que l'utilisateur conserve la maîtrise de la décision, de l'orientation et de la validation finale. Cette complémentarité rend son usage particulièrement pertinent pour des activités où il faut à la fois aller vite, rester cohérent et conserver un haut niveau d'exigence.",
        ),
        ParagraphBlock(
            "Body Text",
            "Dans cette perspective, OpenCode peut être considéré comme un composant de productivité assistée au service de la qualité d'exécution. Son apport est maximal lorsqu'il est mobilisé sur des tâches concrètes, bornées et vérifiables, au sein d'un processus de travail déjà structuré, dans lequel il vient fluidifier la production sans affaiblir la maîtrise globale du livrable.",
        ),
    ]


def upsert_opencode_chapter(docx_path: str) -> None:
    blocks = build_opencode_chapter()
    heading = blocks[0].text
    document = Document(docx_path)
    paragraphs = list(document.paragraphs)

    for index, paragraph in enumerate(paragraphs):
        if paragraph.text.strip() != heading:
            continue

        chapter_paragraphs = paragraphs[index : index + len(blocks)]
        if len(chapter_paragraphs) < len(blocks):
            raise ValueError("OpenCode chapter found but is shorter than expected.")

        for target_paragraph, block in zip(chapter_paragraphs, blocks):
            target_paragraph.style = resolve_paragraph_style(document, block.style)
            target_paragraph.text = block.text

        document.save(docx_path)
        return

    insert_blocks(
        docx_path,
        blocks,
        position=InsertPosition(mode="end"),
        options=InsertOptions(
            page_break_before_first_block=True,
            skip_if_text_exists=heading,
        ),
    )


if __name__ == "__main__":
    target_path = r"C:\Users\a866280\docx_iter\AD Normandie - Memoire technique IA Generative.docx"

    upsert_opencode_chapter(target_path)

    print(f"OpenCode chapter insertion attempted for: {target_path}")
