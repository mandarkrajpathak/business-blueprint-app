import React from 'react';

const BlueprintPreview = ({ blueprint }) => {
  if (!blueprint) return null;

  return (
    <div className="blueprint-preview">
      <h2>Business Blueprint Preview</h2>
      <section>
        <h3>Business Processes</h3>
        {blueprint.business_processes.map((bp, index) => (
          <div key={index}>
            <p><strong>Process:</strong> {bp.business_process}</p>
            <p><strong>Module:</strong> {bp.sap_module}</p>
            <p><strong>Requirement:</strong> {bp.functional_requirement}</p>
            <p><strong>Integration:</strong> {bp.integration_point}</p>
            <p><strong>RICEFW:</strong> {bp.ricefw}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default BlueprintPreview;
