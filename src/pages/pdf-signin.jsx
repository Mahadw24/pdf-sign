// import React, { useState, useRef } from "react";
// import { Document, Page, pdfjs, Annotation } from "react-pdf";
// import { saveAs } from "file-saver";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import Popup from "reactjs-popup";
// import "reactjs-popup/dist/index.css";
// import SignaturePad from "react-signature-canvas";
// import { ResizableBox } from "react-resizable";
// import "react-resizable/css/styles.css";
// // import "react-resizable/css/size.css";

// import Draggable from "react-draggable";
// import { PDFDocument, PDFContentStream, rgb, PDFImage } from "pdf-lib";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// export default function PdfViewer() {
//   const handleRef = useRef(null);
//   const [file, setFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(0);
//   const [sigPosition, setSigPosition] = useState({ x: 0, y: 0 });
//   const [sigSize, setSigSize] = useState({ width: 100, height: 100 });

//   // Helper function to convert data URL to Blob object
//   function dataURLtoBlob(dataURL) {
//     const parts = dataURL.split(",");
//     const mimeType = parts[0].match(/:(.*?);/)[1];
//     const b64 = atob(parts[1]);
//     let n = b64.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = b64.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mimeType });
//   }

//   function dataURLtoBlob(dataURL) {
//     const parts = dataURL.split(",");
//     const mimeType = parts[0].match(/:(.*?);/)[1];
//     const b64 = atob(parts[1]);
//     let n = b64.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = b64.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mimeType });
//   }

//   function onFileChange(event) {
//     setFile(event.target.files[0]);
//     setPageNumber(1);
//   }

//   const [signature, setSignature] = useState(null);

//   function arrayBufferToFile(buffer, fileName, fileType) {
//     const blob = new Blob([buffer], { type: fileType });
//     return new File([blob], fileName, { type: fileType });
//   }

//   const handleAddText = async () => {
//     const existingPdfBytes = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);
//     const signatureBlob = dataURLtoBlob(signature);
//     const signatureBytes = await signatureBlob.arrayBuffer();
//     const pngImage = await pdfDoc.embedPng(signatureBytes);

//     console.log(pageNumber);
//     const pages = pdfDoc.getPages();
//     const Page = pages[pageNumber - 1];
//     const { width, height } = Page.getSize();

//     const realWidth = Math.round(width);
//     const realHeight = Math.round(height);

//     const mywidth = realWidth - sigPosition.x;
//     const myheight = realHeight - sigPosition.y;

//     const w = realWidth - mywidth;
//     const h = realHeight - myheight;

//     console.log(
//       sigPosition.x,
//       realWidth,
//       mywidth,
//       sigPosition.y,
//       realHeight,
//       myheight
//     );

//     Page.drawImage(pngImage, {
//       x: w,
//       // y: h,
//       // x: mywidth,
//       y: myheight - 100,
//       // x: sigPosition.x,
//       // y: sigPosition.y,
//       // x: realWidth - mywidth,
//       // y: realHeight - myheight,
//       width: 100,
//       height: 100,
//     });

//     const pdfBytes = await pdfDoc.save();
//     const pdfFile = arrayBufferToFile(
//       pdfBytes,
//       "example.pdf",
//       "application/pdf"
//     );
//     setFile(pdfFile);
//     const blob = new Blob([pdfBytes], { type: "application/pdf" });
//     saveAs(blob, "pdf-lib_modification_example.pdf");
//   };

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   const signatureRef = useRef();

//   const handleSave = () => {
//     const signatureDataUrl = signatureRef.current.toDataURL();
//     setSignature(signatureDataUrl);
//   };

//   const handleDrag = (e, { x, y }) => {
//     setSigPosition({ x, y });
//   };

//   return (
//     <div>
//       {file && (
//         <Document
//           className="border-2 border-blue-500 w-min h-min"
//           file={file}
//           onLoadSuccess={onDocumentLoadSuccess}
//         >
//           <Page pageNumber={pageNumber}>
//             {signature && (
//               <Draggable
//                 position={sigPosition}
//                 onStop={handleDrag}
//                 cancel=".react-resizable-handle"
//               >
//                 <ResizableBox
//                   width={100}
//                   height={100}
//                   maxConstraints={[400, 400]}
//                 >
//                   <img
//                     draggable={false}
//                     src={signature}
//                     alt="Signature"
//                     className="border-2 border-red-900 p-0 m-0 absolute top-0 left-0 h-full w-full object-contain"
//                   />
//                 </ResizableBox>
//               </Draggable>
//             )}
//           </Page>
//         </Document>
//       )}
//       <input type="file" onChange={onFileChange} />
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>
//       <button
//         disabled={pageNumber <= 1}
//         onClick={() => setPageNumber(pageNumber - 1)}
//       >
//         Previous
//       </button>
//       <button
//         disabled={pageNumber >= numPages}
//         onClick={() => setPageNumber(pageNumber + 1)}
//       >
//         Next
//       </button>
//       <Popup trigger={<button> Trigger</button>} modal>
//         <SignaturePad
//           ref={signatureRef}
//           canvasProps={{ className: "sigContainer" }}
//         />
//         <button onClick={handleSave}>Save Signature</button>
//       </Popup>
//       <button onClick={handleAddText}>Add Text</button>
//     </div>
//   );
// }

import React, { useState, useRef } from "react";
import { Document, Page, pdfjs, Annotation } from "react-pdf";
import { saveAs } from "file-saver";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import SignaturePad from "react-signature-canvas";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
// import "react-resizable/css/size.css";

import Draggable from "react-draggable";
import { PDFDocument, PDFContentStream, rgb, PDFImage } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer() {
  const handleRef = useRef(null);
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [sigPosition, setSigPosition] = useState({ x: 0, y: 0 });
  const [sigSize, setSigSize] = useState({ width: 100, height: 100 });

  // Helper function to convert data URL to Blob object
  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(",");
    const mimeType = parts[0].match(/:(.*?);/)[1];
    const b64 = atob(parts[1]);
    let n = b64.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = b64.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mimeType });
  }

  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(",");
    const mimeType = parts[0].match(/:(.*?);/)[1];
    const b64 = atob(parts[1]);
    let n = b64.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = b64.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mimeType });
  }

  function onFileChange(event) {
    setFile(event.target.files[0]);
    setPageNumber(1);
  }

  const [signature, setSignature] = useState(null);

  function arrayBufferToFile(buffer, fileName, fileType) {
    const blob = new Blob([buffer], { type: fileType });
    return new File([blob], fileName, { type: fileType });
  }

  const handleAddText = async () => {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const signatureBlob = dataURLtoBlob(signature);
    const signatureBytes = await signatureBlob.arrayBuffer();
    const pngImage = await pdfDoc.embedPng(signatureBytes);

    const pages = pdfDoc.getPages();
    const Page = pages[pageNumber - 1];
    const { width, height } = Page.getSize();

    const realWidth = Math.round(width);
    const realHeight = Math.round(height);

    console.log(`Real Width: ${realWidth}, Heigh: ${realHeight}`);

    const mywidth = realWidth - sigPosition.x;
    const myheight = realHeight - sigPosition.y;

    const w = realWidth - mywidth;
    const h = realHeight - myheight;

    console.log(
      `Implemented Width: ${w}, Heigh: ${
        realHeight - sigPosition.y - sigSize.height
      }`
    );

    const ResizableBoxHeight = sigSize.height / 4.685;

    Page.drawImage(pngImage, {
      x: w,
      // y: h,
      // x: mywidth,
      y: realHeight - sigPosition.y - sigSize.height - 1,
      // x: sigPosition.x,
      // y: sigPosition.y,
      // x: realWidth - mywidth,
      // y: realHeight - myheight,
      width: sigSize.width,
      height: sigSize.height,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfFile = arrayBufferToFile(
      pdfBytes,
      "example.pdf",
      "application/pdf"
    );
    setFile(pdfFile);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "pdf-lib_modification_example.pdf");
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const signatureRef = useRef();
  3000;

  const handleSave = () => {
    const signatureDataUrl = signatureRef.current.toDataURL();
    setSignature(signatureDataUrl);
  };

  const handleDrag = (e, { x, y }) => {
    setSigPosition({ x, y });
    console.log(`Dragged width: ${x},height:  ${y}`);
  };

  const handleResizeStop = (event, { size }) => {
    setSigSize({ width: size.width, height: size.height });
  };

  return (
    <div>
      {file && (
        <Document
          className="border-2 border-blue-500 w-min h-min"
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pageNumber}>
            {signature && (
              <Draggable
                position={sigPosition}
                onStop={handleDrag}
                cancel=".react-resizable-handle"
              >
                <div className=" p-0 m-0 absolute top-0 left-0">
                  <ResizableBox
                    width={sigSize.width}
                    height={sigSize.height}
                    maxConstraints={[150, 150]}
                    minConstraints={[100,100]}
                    onResizeStop={handleResizeStop}
                    className="p-0 m-0 border-2 border-blue-500 w-screen h-screen"
                    >
                    <img
                    draggable={false}
                    // width={sigSize.width}
                    // height={sigSize.height}
                      src={signature}
                      alt="Signature"
                      style={{
                        width: sigSize.width,
                        height: sigSize.height,
                      }}
                    />
                  </ResizableBox>
                </div>
              </Draggable>
            )}
          </Page>
        </Document>
      )}
      <input type="file" onChange={onFileChange} />
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button
        disabled={pageNumber <= 1}
        onClick={() => setPageNumber(pageNumber - 1)}
      >
        Previous
      </button>
      <button
        disabled={pageNumber >= numPages}
        onClick={() => setPageNumber(pageNumber + 1)}
      >
        Next
      </button>
      <Popup trigger={<button> Trigger</button>} modal>
        <SignaturePad
          ref={signatureRef}
          canvasProps={{ className: "sigContainer" }}
        />
        <button onClick={handleSave}>Save Signature</button>
      </Popup>
      <button onClick={handleAddText}>Add Text</button>
    </div>
  );
}
