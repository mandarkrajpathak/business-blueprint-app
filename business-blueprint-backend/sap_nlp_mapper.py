from sap_llm_fallback import analyze_requirement_with_llm

def suggest_sap_process_steps(requirement: dict):
    if not requirement.get("functional_requirement", "").strip():
        return {
            "process_name": "No input",
            "confidence": 0.0,
            "steps": [],
            "roles": [],
            "explanation": "Empty input"
        }

    llm_result = analyze_requirement_with_llm(requirement)
    return {
        "process_name": llm_result["process_name"],
        "confidence": llm_result["confidence"],
        "steps": llm_result["steps"],
        "roles": llm_result.get("roles", []),
        "explanation": f"LLM: {llm_result['explanation']}"
    }
