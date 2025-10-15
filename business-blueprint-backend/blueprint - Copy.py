def map_to_blueprint(requirements):
    blueprint = {
        "business_processes": [],
        "gap_analysis": [],
        "configuration": [],
        "ricefw": [],
        "integration": [],
        "security": []
    }

    for req in requirements:
        bp = {
            "business_process": req["business_process"],
            "sap_module": req["sap_module"],
            "functional_requirement": req["functional_requirement"],
            "integration_point": req.get("integration_point", ""),
            "ricefw": req.get("ricefw", "")
        }
        blueprint["business_processes"].append(bp)

        blueprint["gap_analysis"].append({
            "requirement": req["functional_requirement"],
            "standard_coverage": "To be assessed",
            "gap": "To be identified",
            "resolution": "Pending"
        })

        blueprint["configuration"].append({
            "sap_module": req["sap_module"],
            "object": "To be mapped",
            "custom_fields": [],
            "validations": []
        })

        blueprint["ricefw"].append({
            "type": "To be classified",
            "description": req.get("ricefw", ""),
            "linked_requirement": req["functional_requirement"],
            "owner": "To be assigned"
        })

        blueprint["integration"].append({
            "source": "To be defined",
            "target": "SAP S/4HANA",
            "data_object": req.get("integration_point", ""),
            "protocol": "To be defined"
        })

    return blueprint
