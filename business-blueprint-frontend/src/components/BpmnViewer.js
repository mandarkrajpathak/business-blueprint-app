import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js';

const BpmnViewer = ({ diagramXML }) => {
  const viewerRef = useRef(null);
  const bpmnViewer = useRef(null);

  useEffect(() => {
    if (!diagramXML) return;

    if (!bpmnViewer.current) {
      bpmnViewer.current = new BpmnJS({ container: viewerRef.current });
    }

    bpmnViewer.current.importXML(diagramXML, err => {
      if (err) {
        console.error('Failed to render BPMN diagram:', err);
      } else {
        bpmnViewer.current.get('canvas').zoom('fit-viewport');
      }
    });

    return () => {
      bpmnViewer.current?.destroy();
      bpmnViewer.current = null;
    };
  }, [diagramXML]);

  return <div ref={viewerRef} style={{ height: '500px', border: '1px solid #ccc' }} />;
};

export default BpmnViewer;
