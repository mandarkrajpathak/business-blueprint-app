import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadForm = ({ onUpload }) => {
  const [projectName, setProjectName] = useState('');
  const [module, setModule] = useState('');
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0], projectName, module);
      }
    }
  });

  return (
    <div className="upload-form">
      <h2>Upload Requirement Document</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={e => setProjectName(e.target.value)}
      />
      <select value={module} onChange={e => setModule(e.target.value)}>
        <option value="">Select SAP Module</option>
        <option value="FI">FI</option>
        <option value="MM">MM</option>
        <option value="SD">SD</option>
        <option value="PP">PP</option>
      </select>
      <div {...getRootProps()} className="dropzone" style={{ border: '2px dashed #ccc', padding: '20px', marginTop: '10px' }}>
        <input {...getInputProps()} />
        <p>Drag & drop a file here, or click to browse</p>
      </div>
    </div>
  );
};

export default UploadForm;
