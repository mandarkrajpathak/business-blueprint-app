from docx import Document
from io import BytesIO

def parse_docx(contents: bytes):
    doc = Document(BytesIO(contents))
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    print("Total paragraphs:", len(paragraphs))
    print("Paragraphs:", paragraphs)

    requirements = []
    current = {}

    for line in paragraphs:
        if line.startswith("Business Process:"):
            current["business_process"] = line.replace("Business Process:", "").strip()
        elif line.startswith("Functional Requirement:"):
            current["functional_requirement"] = line.replace("Functional Requirement:", "").strip()
        elif line.startswith("SAP Module:"):
            current["sap_module"] = line.replace("SAP Module:", "").strip()
        elif line.startswith("Integration Point:"):
            current["integration_point"] = line.replace("Integration Point:", "").strip()
        elif line.startswith("RICEFW:"):
            current["ricefw"] = line.replace("RICEFW:", "").strip()
        elif line == "":
            if current:
                requirements.append(current)
                current = {}

    # Catch last block if not followed by empty line
    if current:
        requirements.append(current)

    print("Parsed Requirements:", requirements)
    return requirements
