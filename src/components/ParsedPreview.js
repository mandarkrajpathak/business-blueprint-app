import React from 'react';

const ParsedPreview = ({ file }) => (
  <div className="parsed-preview">
    <h3>File Preview</h3>
    <p><strong>Name:</strong> {file.name}</p>
    <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
    <p><strong>Type:</strong> {file.type}</p>
  </div>
);

export default ParsedPreview;
