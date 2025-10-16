from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from parser import parse_docx
from blueprint import generate_blueprint, export_blueprint_to_docx
from sap_nlp_mapper import suggest_sap_process_steps

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_file(
    project_name: str = Form(...),
    module: str = Form(...),
    file: UploadFile = File(...)
):
    contents = await file.read()
    parsed_requirements = parse_docx(contents)

    for req in parsed_requirements:
        suggestion = suggest_sap_process_steps(req)

        req["requirement_type"] = "SAP"
        req["sap_process_suggestion"] = suggestion["process_name"]
        req["sap_process_confidence"] = suggestion["confidence"]
        req["sap_process_steps"] = suggestion["steps"]
        req["sap_process_roles"] = suggestion["roles"]
        req["sap_process_explanation"] = suggestion["explanation"]
        req["matched_by"] = "LLM"

    blueprint = generate_blueprint(parsed_requirements, project_name, module)

    return {
        "parsed_requirements": parsed_requirements,
        "blueprint": blueprint
    }

@app.post("/export/")
async def export_blueprint(blueprint: dict):
    docx_buffer = export_blueprint_to_docx(blueprint)
    return StreamingResponse(
        docx_buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={blueprint['project_name']}_blueprint.docx"}
    )
