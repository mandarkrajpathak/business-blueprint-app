import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import BpmnViewer from '../components/BpmnViewer';

const UploadPage = () => {
  const [projectName, setProjectName] = useState('');
  const [module, setModule] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  const onDrop = async acceptedFiles => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('module', module);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log("Parsed Response:", result);
      setUploadResult(result);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Upload Requirement Document</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <select
        value={module}
        onChange={e => setModule(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      >
        <option value="">Select SAP Module</option>
        <option value="FI">FI</option>
        <option value="MM">MM</option>
        <option value="SD">SD</option>
        <option value="PP">PP</option>
      </select>
      <div {...getRootProps()} style={{ border: '2px dashed #aaa', padding: '20px', textAlign: 'center' }}>
        <input {...getInputProps()} />
        <p>Drag & drop a .docx file here, or click to browse</p>
      </div>

{/* ✅ Add this block right below the upload form */}
    {uploadResult && (
      <div style={{ marginTop: '20px' }}>
        <h3>Raw Response</h3>
        <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
      </div>
    )}

      {uploadResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Parsed Requirements</h3>
          <pre>{JSON.stringify(uploadResult.parsed_requirements, null, 2)}</pre>
        </div>
      )}


{/* Parsed Requirements */}
    {uploadResult?.parsed_requirements?.map((req, index) => (
      <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <strong>Business Process:</strong> {req.business_process} <br />
        <strong>Functional Requirement:</strong> {req.functional_requirement} <br />
        <strong>SAP Module:</strong> {req.sap_module} <br />
        <strong>Integration Point:</strong> {req.integration_point} <br />
        <strong>RICEFW:</strong> {req.ricefw}
      </div>
    ))}

    {/* Blueprint Preview */}
    {uploadResult?.blueprint && (
      <div style={{ marginTop: '20px' }}>
        <h3>Generated Blueprint</h3>
        <p><strong>Project:</strong> {uploadResult.blueprint.project_name}</p>
        <p><strong>Module:</strong> {uploadResult.blueprint.module}</p>
        {uploadResult.blueprint.business_processes.map((bp, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{bp.name}</strong><br />
            Functional Requirement: {bp.functional_requirement}<br />
            Integration Point: {bp.integration_point}<br />
            RICEFW: {bp.ricefw}
          </div>

        ))}
      </div>
    )}


{uploadResult?.bpmn_xml && (
  <div style={{ marginTop: '30px' }}>
    <h3>BPMN Diagram</h3>
    <BpmnViewer diagramXML={uploadResult.bpmn_xml} />
  </div>
)}



const handleExport = async () => {
  try {
    const response = await fetch('http://localhost:8000/export/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadResult.blueprint),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${uploadResult.blueprint.project_name}_blueprint.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

    </div>
  );
};



export default UploadPage;
