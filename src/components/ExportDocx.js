import React from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const ExportDocx = ({ blueprint }) => {
  const exportDocx = () => {
    const doc = new Document({
      sections: [{
        children: blueprint.business_processes.map(bp =>
          new Paragraph({
            children: [
              new TextRun(`Process: ${bp.business_process} | Module: ${bp.sap_module} | Requirement: ${bp.functional_requirement}`),
            ],
          })
        ),
      }],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "business_blueprint.docx");
    });
  };

  return <button onClick={exportDocx}>Export as DOCX</button>;
};

export default ExportDocx;
