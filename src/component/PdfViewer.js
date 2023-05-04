// import React, { useRef, useEffect, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { PDFDocument } from 'pdf-lib';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const PdfViewer = ({ pdf, signature }) => {
//   const canvasRef = useRef(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   useEffect(() => {
//     if (!pdf || !signature) {
//       return;
//     }

//     async function embedSignature() {
//       const existingPdfBytes = await fetch(pdf).then((res) => res.arrayBuffer());
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       const pngImageBytes = await fetch(signature).then((res) => res.arrayBuffer());
//       const pngImage = await pdfDoc.embedPng(pngImageBytes);

//       const { width, height } = pdfDoc.getPages()[pdfDoc.getPages().length - 1].getSize();
//       const pngDims = pngImage.scale(0.5);
//       const x = width - pngDims.width - 50;
//       const y = 50;

//       const lastPage = pdfDoc.getPages()[pdfDoc.getPages().length - 1];
//       lastPage.drawImage(pngImage, {
//         x,
//         y,
//         width: pngDims.width,
//         height: pngDims.height,
//       });

//       const modifiedPdfBytes = await pdfDoc.save();
//       const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
//       const newPdf = URL.createObjectURL(blob);
//       // window.open(newPdf, '_blank');
//       window.location.href = newPdf;
//     }

//     embedSignature();
//   }, [pdf, signature]);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div>
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
  const [pdfBytes, setPdfBytes] = useState(null);

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
      setPdfBytes(modifiedPdfBytes);
    }

    embedSignature();
  }, [pdf, signature]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      {pdfBytes ? (
        <Document file={{ data: pdfBytes }}>
          {[...Array(numPages)].map((_, i) => (
            <Page key={`page_${i + 1}`} pageNumber={i + 1} />
          ))}
        </Document>
      ) : null}
    </div>
  );
};

export default PdfViewer;