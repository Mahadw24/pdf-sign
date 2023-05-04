import { useState, useRef } from "react";
import { Document, Page, pdfjs, Annotation } from "react-pdf";
import { saveAs } from "file-saver";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SignaturePad from 'react-signature-canvas'
import { Resizable } from 'react-resizable';
import Draggable from 'react-draggable';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer() {
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onFileChange(event) {
        setFile(event.target.files[0]);
        setPageNumber(1);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function onSavePdf() {
        saveAs(file, file.name);
    }

    const [signature, setSignature] = useState(null);
    const signatureRef = useRef();

    const handleSave = () => {
        const signatureDataUrl = signatureRef.current.toDataURL();
        setSignature(signatureDataUrl);
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            {file && (
                <Document className="border-2 border-blue-500 w-min h-min" file={file} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber}>
                        {signature && (
                            <img
                                src={signature}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '100px',
                                    height: '50px',
                                    border:'2px solid black'
                                }}
                            />
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
        </div>
    );
}