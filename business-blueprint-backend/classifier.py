def classify_requirement_type(text: str) -> str:
    sap_keywords = [
        "purchase order", "sales order", "goods receipt", "invoice", "material master",
        "vendor", "customer", "stock transfer", "pricing", "workflow", "SAP", "FI", "MM", "SD", "WM"
    ]
    text_lower = text.lower()
    return "SAP" if any(k in text_lower for k in sap_keywords) else "Non-SAP"
