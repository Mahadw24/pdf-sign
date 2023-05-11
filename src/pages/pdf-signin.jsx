import React, { useState, useRef } from "react";
import { Document, Page, pdfjs, Annotation, StandardFonts } from "react-pdf";
import { saveAs } from "file-saver";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import SignaturePad from "react-signature-canvas";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import fontkit from "@pdf-lib/fontkit";
// import "react-resizable/css/size.css";

import Draggable from "react-draggable";
import { PDFDocument, PDFContentStream, rgb, PDFImage } from "pdf-lib";
import ReactSignatureCanvas from "react-signature-canvas";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer() {
  const [signatureType, setSignatureType] = useState("Signature");
  const [open, setOpen] = useState(false);
  const setPopup = () => {
    setOpen(true);
  };
  const [signaturePad, setSignaturePad] = useState(false);
  const handleSignaturePad = () => {
    setSignaturePad(true);
  };
  const [browseSignaturePad, setBrowseSignaturePad] = useState(false);
  const handleBrowseSignaturePad = () => {
    setBrowseSignaturePad(true);
  };
  // const [textSignature,setTextSignature] = useState(null);

  const [textSignaturePad, setTextSignaturePad] = useState(false);

  const handleTextSignaturePad = () => {
    setTextSignaturePad(true);
  };

  const [uploadPicOfSignature, setUploadedPicForSignature] = useState(null);
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

  const handleAddText_2 = async () => {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImageBytes = await (await fetch(signature)).arrayBuffer(); // Load image file from URL or file input
    const pngImage = await pdfDoc.embedPng(pngImageBytes); // Embed the image in the PDF

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
      y: realHeight - sigPosition.y - sigSize.height - 1,
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

  const handleAddText_3 = async () => {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

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

    Page.drawText(signature, {
      x: w,
      y: realHeight - sigPosition.y - 16, // Adjust the Y coordinate to position the text as desired
      size: 14,
      // font: StandardFonts.Helvetica,
      color: rgb(0, 0, 0),
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

  function handleSignatureSelected(event) {
    setUploadedPicForSignature(URL.createObjectURL(event.target.files[0]));
  }
  function handletextSignature(event) {
    setTextSignaturePad(event.target.value);
    console.log(event.target.value);
  }

  return (
    <>
      <div className="flex items-center justify-center border-2 border-blue-500">
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
                  {signatureType != "Text" ? (
                    <div className=" p-0 m-0 absolute top-0 left-0">
                      <ResizableBox
                        width={sigSize.width}
                        height={sigSize.height}
                        maxConstraints={[400, 400]}
                        minConstraints={[100, 100]}
                        lockAspectRatio={true}
                        onResize={handleResizeStop}
                        className="p-0 m-0 border-2 border-blue-500 w-screen h-screen"
                      >
                        <img
                          draggable={false}
                          src={signature}
                          alt="Signature"
                          style={{
                            width: sigSize.width,
                            height: sigSize.height,
                          }}
                        />
                      </ResizableBox>
                    </div>
                  ) : (
                    <div className=" p-0 m-0 absolute top-0 left-0">
                      <h1 className="text-[14px]">{signature}</h1>
                    </div>
                  )}
                </Draggable>
              )}
            </Page>
          </Document>
        )}
        <div className="ml-10">
          <button
            className="p-5 flex flex-wrap w-28 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest mb-6"
            onClick={setPopup}
          >
            FILL & SIGN
            <img src="/signPen.svg" alt="" />
          </button>
          <button className="p-5 flex flex-wrap w-28 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest">
            CANCEL
          </button>
        </div>

        <input type="file" onChange={onFileChange} />
        {/* <p>
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
      <button onClick={handleAddText}>Add Text</button> */}
      </div>
      <Popup
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
        closeOnDocumentClick={true}
        modal
      >
        <div className=" flex items-center justify-around flex-col h-full w-full z-10 rounded-xl">
          <h1 className="tracking-widest text-2xl">SIGNATURE</h1>
          <div className="flex w-full justify-around items-center">
            <button
              className="p-5 flex flex-wrap w-36 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest"
              onClick={handleSignaturePad}
            >
              SIGN YOURSELF
              <img className="mt-2" src="/addSignature.svg" alt="" />
            </button>
            <button
              className="p-5 flex flex-wrap w-36 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest"
              onClick={handleBrowseSignaturePad}
            >
              UPLOAD SIGNATURE
              <img className="mt-2" src="/addSignature.svg" alt="" />
              <img src="/uploadSignature.svg" alt="" />
            </button>
            <button
              className="p-5 flex flex-wrap w-36 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest"
              onClick={handleTextSignaturePad}
            >
              TYPE SIGNATURE A B C
            </button>
          </div>
        </div>
        {/* <button onClick={handleSave}>Save Signature</button> */}
      </Popup>
      <Popup
        open={signaturePad}
        setOpen={setSignaturePad}
        onClose={() => setSignaturePad(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-gray-500 ">
          <h1 className="text-xl mx-34 tracking-widest my-2">SIGNATURE</h1>
          <SignaturePad
            ref={signatureRef}
            penColor="black"
            canvasProps={{ className: "sigContainer" }}
          />
          <div className="w-60 flex justify-around my-3">
            <button
              onClick={() => signatureRef.current.clear()}
              className="text-xl"
            >
              CLEAR
            </button>
            <button onClick={handleSave} className="text-xl">
              CREATE
            </button>
          </div>
        </div>
      </Popup>
      <Popup
        open={browseSignaturePad}
        setOpen={setBrowseSignaturePad}
        onClose={() => setBrowseSignaturePad(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-gray-500 ">
          <h1 className="text-xl mx-34 tracking-widest my-2">SIGNATURE</h1>
          {/* <SignaturePad
            ref={signatureRef}
            penColor="black"
            canvasProps={{ className: "sigContainer" }}
          /> */}
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleSignatureSelected}
            className="sigContainer"
          />
          <div className="w-60 flex justify-around my-3">
            <button onClick={() => setSignature(null)} className="text-xl">
              CANCEL
            </button>
            <button
              onClick={() => setSignature(uploadPicOfSignature)}
              className="text-xl"
            >
              UPLOAD
            </button>
          </div>
        </div>
        <button onClick={handleAddText_2}>Save</button>
      </Popup>
      <Popup
        open={textSignaturePad}
        setOpen={setTextSignaturePad}
        onClose={() => setTextSignaturePad(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-gray-500 ">
          <h1 className="text-xl mx-34 tracking-widest my-2">SIGNATURE</h1>
          {/* <SignaturePad
            ref={signatureRef}
            penColor="black"
            canvasProps={{ className: "sigContainer" }}
          /> */}
          <input
            type="text"
            onChange={handletextSignature}
            className="sigContainer"
          />
          <div className="w-60 flex justify-around my-3">
            <button onClick={() => setSignature(null)} className="text-xl">
              CANCEL
            </button>
            <button
              onClick={() => {
                setSignature(textSignaturePad);
                setSignatureType("Text");
              }}
              className="text-xl"
            >
              ADD
            </button>
          </div>
        </div>
        <button onClick={handleAddText_3}>Save</button>
      </Popup>
    </>
  );
}