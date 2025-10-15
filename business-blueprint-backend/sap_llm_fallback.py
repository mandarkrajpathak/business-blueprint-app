import os
import google.generativeai as genai
import re
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")  # ✅ Use Gemini 2.5 Flash


def analyze_requirement_with_llm(requirement: dict):
    prompt = f"""
You are an enterprise systems expert specializing in SAP and non-SAP business processes.

Analyze the following business requirement and determine whether it is SAP-relevant or Non-SAP. If it is SAP-relevant, suggest the most appropriate SAP module, process name, roles involved, and steps. If it is Non-SAP, explain why and suggest the appropriate system or domain (e.g., HRMS, CRM, custom app).

Requirement:
Business Process: {requirement.get("business_process", "")}
Functional Requirement: {requirement.get("functional_requirement", "")}
SAP Module: {requirement.get("sap_module", "")}

Respond with:
- Classification: SAP / Non-SAP
- SAP Module (if applicable)
- Process Name (if applicable) <name>
- Roles Involved (if applicable) <comma-separated list> 
- Suggested Steps (if applicable)
- Confidence Level (0–1)
- Explanation <brief explanation>
"""

    response = model.generate_content(prompt)
    text = response.text

    # Extract fields using regex
    module = re.search(r"SAP Module:\s*(.*)", text)
    process = re.search(r"Process Name:\s*(.*)", text)
    roles = re.search(r"Roles Involved:\s*(.*)", text)
    confidence = re.search(r"Confidence Level:\s*(\d\.\d+)", text)
    explanation = re.search(r"Explanation:\s*(.*)", text)

    # Extract bullet steps
    steps = re.findall(r"\n[-*]\s+(.*)", text)

    return {
        "module": module.group(1).strip() if module else "Unknown",
        "process_name": process.group(1).strip() if process else "Unknown",
        "roles": [r.strip() for r in roles.group(1).split(",")] if roles else [],
        "steps": steps,
        "confidence": float(confidence.group(1)) if confidence else 0.5,
        "explanation": explanation.group(1).strip() if explanation else "LLM response could not be parsed"
    }