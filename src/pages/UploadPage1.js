import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import ParsedPreview from '../components/ParsedPreview';
import BlueprintPreview from '../components/BlueprintPreview';
import ExportButtons from '../components/ExportButtons';
import ExportDocx from '../components/ExportDocx';
import BpmnViewer from '../components/BpmnViewer';

const UploadPage = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [bpmnXml, setBpmnXml] = useState(null);

  const handleFileUpload = async (file, projectName, module) => {
    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('module', module);
    formData.append('file', file);

    const response = await fetch('http://localhost:8000/upload/', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setUploadedFile(file);

    const blueprintRes = await fetch('http://localhost:8000/generate-blueprint/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.parsed_requirements),
    });

    const blueprintData = await blueprintRes.json();
    setBlueprint(blueprintData);

    const bpmnRes = await fetch('http://localhost:8000/generate-bpmn/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.parsed_requirements),
    });

    const bpmnData = await bpmnRes.json();
    setBpmnXml(bpmnData.bpmn_xml);
  };

  return (
    <div>
      <UploadForm onUpload={handleFileUpload} />
      {uploadedFile && <ParsedPreview file={uploadedFile} />}
      {blueprint && (
        <>
          <BlueprintPreview blueprint={blueprint} />
          <ExportButtons />
          <ExportDocx blueprint={blueprint} />
        </>
      )}
      {bpmnXml && <BpmnViewer diagramXML={bpmnXml} />}
    </div>
  );
};

export default UploadPage;
