import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js';

const BpmnViewer = ({ diagramXML }) => {
  const containerRef = useRef(null);
  const bpmnViewer = useRef(null);

  useEffect(() => {
    bpmnViewer.current = new BpmnJS({ container: containerRef.current });
    if (diagramXML) {
      bpmnViewer.current.importXML(diagramXML).catch(err => console.error(err));
    }
    return () => bpmnViewer.current.destroy();
  }, [diagramXML]);

  return <div ref={containerRef} style={{ height: '500px', border: '1px solid #ccc' }} />;
};

export default BpmnViewer;
