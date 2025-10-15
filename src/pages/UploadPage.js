import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import BpmnViewer from '../components/BpmnViewer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_FILE_SIZE_MB = 5;

const UploadPage = () => {
  const [projectName, setProjectName] = useState('');
  const [module, setModule] = useState('');
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = acceptedFiles => {
    const selected = acceptedFiles[0];
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }
    setFile(selected);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
  });

  const handleUpload = async () => {
    if (!file || !projectName || !module) {
      toast.warning("Please fill all fields and select a file");
      return;
    }

    const formData = new FormData();
    formData.append('project_name', projectName);
    formData.append('module', module);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      const reader = response.body.getReader();
      const contentLength = +response.headers.get('Content-Length') || 1;
      let receivedLength = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        setUploadProgress(Math.round((receivedLength / contentLength) * 100));
      }

      const fullBlob = new Blob(chunks);
      const text = await fullBlob.text();
      const result = JSON.parse(text);

      setUploadResult(result);
      toast.success("Upload and parse successful");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Check backend logs.");
    }
  };

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
      toast.success("Export successful");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed.");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Upload Requirement Document</h2>

      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />

      <input
        type="text"
        placeholder="SAP Module"
        value={module}
        onChange={e => setModule(e.target.value)}
        style={{ marginBottom: '10px', width: '100%', padding: '8px' }}
      />

      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <p>Drag & drop a .docx file here, or click to browse</p>
        {file && (
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#555' }}>
            Selected file: {file.name}
          </p>
        )}
      </div>

      <button onClick={handleUpload} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Upload and Parse
      </button>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginTop: '10px', width: '100%', backgroundColor: '#eee', borderRadius: '4px' }}>
          <div style={{
            width: `${uploadProgress}%`,
            backgroundColor: '#007bff',
            height: '8px',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      )}

      {/* SAP Requirements */}
      {uploadResult?.blueprint?.sap_requirements?.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>SAP Requirements</h3>
          {uploadResult.blueprint.sap_requirements.map((req, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
              <p><strong>Business Process:</strong> {req.business_process}</p>
              <p><strong>Functional Requirement:</strong> {req.functional_requirement}</p>
              <p><strong>Classification:</strong> {req.classification || "SAP"}</p>
              <p><strong>Suggested SAP Process:</strong> {req.sap_process_suggestion} (Confidence: {req.sap_process_confidence})</p>
              <p><strong>Explanation:</strong> {req.sap_process_explanation}</p>

              {req.sap_process_roles?.length > 0 && (
                <p><strong>Roles:</strong> {req.sap_process_roles.join(', ')}</p>
              )}

              {req.sap_process_steps?.length > 0 && (
                <div>
                  <strong>Process Steps:</strong>
                  <ol style={{ marginLeft: '20px' }}>
                    {req.sap_process_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Non-SAP Requirements */}
      {uploadResult?.blueprint?.non_sap_requirements?.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Non-SAP Requirements</h3>
          {uploadResult.blueprint.non_sap_requirements.map((req, index) => (
            <div key={index} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '6px', backgroundColor: '#fff' }}>
              <p><strong>Business Process:</strong> {req.business_process}</p>
              <p><strong>Functional Requirement:</strong> {req.functional_requirement}</p>
              <p><strong>Classification:</strong> Non-SAP</p>
              <p><strong>Note:</strong> {req.sap_process_explanation}</p>
            </div>
          ))}
        </div>
      )}

      {/* Export Button */}
      {uploadResult?.blueprint && (
        <button onClick={handleExport} style={{ marginTop: '30px', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Export Blueprint Document
        </button>
      )}

      {/* BPMN Viewer (optional) */}
      {uploadResult?.bpmn_xml && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>BPMN Diagram</h3>
          <BpmnViewer diagramXML={uploadResult.bpmn_xml} />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
