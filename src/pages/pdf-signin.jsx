import  React,{ useState, useRef } from "react";
import { Document, Page, pdfjs, Annotation } from "react-pdf";
import { saveAs } from "file-saver";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SignaturePad from 'react-signature-canvas'
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';
import { PDFDocument, PDFContentStream, rgb,PDFImage } from 'pdf-lib';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const DraggableImage = ({ image }) => {
    const handleDrag = (e, ui) => {
      // Update the image position on drag
      image.x += ui.deltaX;
      image.y += ui.deltaY;
    };
  
    return (
      <Draggable
        defaultPosition={{ x: image.x, y: image.y }}
        position={null}
        onStop={handleDrag}
      >
        <img src={image.src} alt="signature" />
      </Draggable>
    );
  };
  

export default function PdfViewer() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [sigPosition, setSigPosition] = useState({ x: 0, y: 0 });
    const [sigSize, setSigSize] = useState({ width: 150, height: 50 });
      
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
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize()

            firstPage.drawImage(pngImage ,{
              x: 406,
              y: 653,
            //   x: sigPosition.x,
            //   y: sigPosition.y,
            });

        const pdfBytes = await pdfDoc.save()
const pdfFile = arrayBufferToFile(pdfBytes, 'example.pdf', 'application/pdf');
setFile(pdfFile);

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  saveAs(blob, 'pdf-lib_modification_example.pdf');
        }
    
        function onDocumentLoadSuccess({ numPages }) {
                setNumPages(numPages);
            }
        
            function onSavePdf() {
                    // saveAs(file, file.name);
                    // saveAs(pdfBytes);
                    // download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
                }
            
                const signatureRef = useRef();
            
                const handleSave = () => {
                        const signatureDataUrl = signatureRef.current.toDataURL();
                        setSignature(signatureDataUrl);
                    };

                    const handleDrag = (e, { x, y }) => {
                        setSigPosition({ x, y });
                        console.log({x,y});
                    };
                
                    const handleResize = (e, { size }) => {
                        setSigSize(size);
                    };
                
                    return (
                            <div>
                                <input type="file" onChange={onFileChange} />
                                {file && (
                                        <Document className="border-2 border-blue-500 w-min h-min" file={file} onLoadSuccess={onDocumentLoadSuccess}>
                                            <Page pageNumber={pageNumber}>
                                            {signature && (
                            <Draggable
                                position={sigPosition}
                                onStop={handleDrag}
                                bounds="parent"
                            >
                                {/* <Resizable
                                    size={sigSize}
                                    onResize={handleResize}
                                    height="100px"
                                    width="100px"
                                    bounds="parent"
                                > */}
                                    <img
                                        draggable={false}
                                        src={signature}
                                        alt="Signature"
                                        style={{
                                            position:'absolute',
                                            inset:'0',
                                            width: '100px',
                                            height: '100px',
                                            border: '2px solid black',
                                        }}
                                    />
                                {/* </Resizable> */}
                            </Draggable>
                        )}
                            
                    </Page>
                </Document>
            )}
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
            <button onClick={onSavePdf}>Save PDF</button>
            <Popup trigger={<button> Trigger</button>} modal>
                <SignaturePad
                    ref={signatureRef}
                    canvasProps={{ className: 'sigContainer' }}
                />
                <button onClick={handleSave}>
                    Save Signature
                </button>
            </Popup>
            <button onClick={handleAddText}>Add Text</button>
        </div>
    );
}