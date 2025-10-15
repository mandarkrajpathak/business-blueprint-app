import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportButtons = () => {
  const exportPDF = () => {
    const input = document.querySelector(".blueprint-preview");
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("business_blueprint.pdf");
    });
  };

  return <button onClick={exportPDF}>Export as PDF</button>;
};

export default ExportButtons;
