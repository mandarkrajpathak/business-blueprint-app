from sap_nlp_mapper import suggest_sap_process_steps

# Sample requirements to test
test_requirements = [
    "System should allow 3-way matching",
    "Create PR and convert to PO",
    "Sales order should trigger delivery and billing",
    "Post vendor invoice and execute payment run",
    "Plan materials and create production order",
    "Perform quality inspection and log defects",
    "Create maintenance request and close order",
    "PO aging report for Ariba vendor sync",
    "System should verify invoice before payment",
    "Customer should receive invoice after delivery"
]

# Run tests
for req in test_requirements:
    result = suggest_sap_process_steps(req)
    print(f"\nRequirement: {req}")
    print(f"Matched Process: {result['process_name']}")
    print(f"Confidence: {result['confidence']}")
    print(f"Explanation: {result['explanation']}")
