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


// import React, { useRef, useEffect,useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// const PdfViewer = ({ pdf }) => {
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
import Modal from 'react-modal';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({ pdf }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!pdf) {
      return;
    }
  }, [pdf]);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }, content: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '800px', maxHeight: '90%', overflow: 'auto', padding: '0' } }}>
        <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '24px', lineHeight: '24px', padding: '0', backgroundColor: 'transparent', border: 'none', color: 'white' }}>×</button>
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%' }}>
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} canvasRef={canvasRef} />
            </Document>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PdfViewer;