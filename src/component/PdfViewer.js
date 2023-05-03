// import React, { useRef, useEffect,useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const PdfViewer = ({ pdf,signature }) => {
//   const canvasRef = useRef(null);
//   useEffect(() => {
//     if (!pdf) {
//       return;
//     }
//     // ...
//   }, [pdf]);

//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div>
//       <div>
//         <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
//           <Page pageNumber={1} canvasRef={canvasRef} />
//         </Document>
//       </div>
//       <div>
//         <canvas ref={canvasRef} />
//       </div>
//     </div>
//   );
// };

// export default PdfViewer;

import React, { useRef, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ pdf, signature }) => {
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (!pdf || !signature) {
      return;
    }

    async function embedSignature() {
      const existingPdfBytes = await fetch(pdf).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pngImageBytes = await fetch(signature).then((res) => res.arrayBuffer());
      const pngImage = await pdfDoc.embedPng(pngImageBytes);

      const { width, height } = pdfDoc.getPages()[pdfDoc.getPages().length - 1].getSize();
      const pngDims = pngImage.scale(0.5);
      const x = width - pngDims.width - 50;
      const y = 50;

      const lastPage = pdfDoc.getPages()[pdfDoc.getPages().length - 1];
      lastPage.drawImage(pngImage, {
        x,
        y,
        width: pngDims.width,
        height: pngDims.height,
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const newPdf = URL.createObjectURL(blob);
      window.open(newPdf, '_blank');
    }

    embedSignature();
  }, [pdf, signature]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>

    </div>
  );
};

export default PdfViewer;