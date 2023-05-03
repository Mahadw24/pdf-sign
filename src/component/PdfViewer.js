// // import React, { useRef, useEffect } from 'react'
// // import pdfjsLib from 'pdfjs-dist';
// // // import pdfjsLib from "pdfjs-dist/build/pdf";
// // // import PDFjs from 'pdfjs-dist'

// // const PdfViewer = ({ pdf }) => {
// //     console.log(pdfjsLib);
// //     const canvasRef = useRef(null);
// //     useEffect(() => {
// //         if (!pdf) {
// //             return;
// //         }
// //         pdfjsLib.getDocument(pdf).promise.then((pdfDocument) => {
// //             const pageNumber = 1;
// //             pdfDocument.getPage(pageNumber).then((page) => {
// //                 const viewport = page.getViewport({ scale: 1.0 });
// //                 const canvas = canvasRef.current;
// //                 const context = canvas.getContext('2d');
// //                 canvas.height = viewport.height;
// //                 canvas.width = viewport.width;

// //                 const renderContext = {
// //                     canvasContext: context,
// //                     viewport: viewport,
// //                 }; ``
// //                 page.render(renderContext);
// //             });
// //         });
// //     }, [pdf]);

// //     return (
// //         <div>
// //             <canvas ref={canvasRef} />
// //             {/* pdfviewer */}
// //         </div>
// //     );
// // }

// // export default PdfViewer;


import React, { useRef, useEffect,useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ pdf }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!pdf) {
      return;
    }
    // ...
  }, [pdf]);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <div>
        <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={1} canvasRef={canvasRef} />
        </Document>
      </div>
      <div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default PdfViewer;