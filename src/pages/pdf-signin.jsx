import React, { useState, useRef } from "react";
import { Document, Page, pdfjs, Annotation, StandardFonts } from "react-pdf";
import { saveAs } from "file-saver";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import SignaturePad from "react-signature-canvas";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

import Draggable from "react-draggable";
import { PDFDocument, PDFContentStream, rgb, PDFImage } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer() {
  const [showButtonForSave, setShowButtonForSave] = useState(false);
  const [witnessPopup, setWitnessPopup] = useState(false);
  const [witnessDetailsPopup, setWitnessDetailsPopup] = useState(false);
  const [signatureForWitness, setSignatureForWitness] = useState(false);
  const [open, setOpen] = useState(false);
  const [signaturePad, setSignaturePad] = useState(false);
  const [uploadPicOfSignature, setUploadedPicForSignature] = useState(null);
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [browseSignaturePad, setBrowseSignaturePad] = useState(false);
  const [textSignature, setTextSignature] = useState(false);
  const signatureRef = useRef();
  const [witnessDetails, setWitnessDetails] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [signature, setSignature] = useState({
    employeeSignature: null,
    witnessSignature: null,
  });
  const [witnessName, setWitnessName] = useState({
    firstName: "",
    lastName: "",
  });
  const [signatureType, setSignatureType] = useState({
    employee: "",
    witness: "",
  });

  const setPopup = () => {
    setOpen(true);
  };
  const handleSignaturePad = () => {
    setOpen(false);
    setSignaturePad(true);
  };
  const handleBrowseSignaturePad = () => {
    setOpen(false);
    setBrowseSignaturePad(true);
  };

  // const [textSignaturePad, setTextSignaturePad] = useState({
  //   employeeText: "",
  //   witnessText: "",
  // });

  const [textSignaturePad, setTextSignaturePad] = useState("");

  const handleTextSignaturePad = () => {
    setOpen(false);
    // setTextSignaturePad(true);
    setTextSignature(true);
  };

  const [sigPosition, setSigPosition] = useState({
    employee: { x: 0, y: 0 },
    witness: { x: 0, y: 0 },
    witnessname: { x: 0, y: 0 },
    witnessaddress: { x: 0, y: 0 },
  });

  const [sigSize, setSigSize] = useState({
    employee: { width: 50, height: 50 },
    witness: { width: 50, height: 50 },
  });

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

  function arrayBufferToFile(buffer, fileName, fileType) {
    const blob = new Blob([buffer], { type: fileType });
    return new File([blob], fileName, { type: fileType });
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleSave = () => {
    const signatureDataUrl = signatureRef.current.toDataURL();
    {
      signatureForWitness == true
        ? setSignature({ ...signature, witnessSignature: signatureDataUrl })
        : setSignature({ ...signature, employeeSignature: signatureDataUrl });
    }
    {
      signatureForWitness == true
        ? setSignatureType({ ...signatureType, witness: "drawSignature" })
        : setSignatureType({ ...signatureType, employee: "drawSignature" });
    }
    setSignaturePad(false);
    if (signatureForWitness) {
      setWitnessPopup(false);
      setShowButtonForSave(true);
    } else {
      setWitnessPopup(true);
    }
  };

  function handleSignatureSelected(event) {
    setUploadedPicForSignature(URL.createObjectURL(event.target.files[0]));
  }

  function handletextSignature(event) {
    setTextSignaturePad({
      ...textSignaturePad,
      witnessText: signatureForWitness
        ? event.target.value
        : textSignaturePad.witnessText,
      employeeText: signatureForWitness
        ? textSignaturePad.employeeText
        : event.target.value,
    });
  }

  function handleSaveSignatureAsImage() {
    {
      signatureForWitness == true
        ? setSignature({
            ...signature,
            witnessSignature: uploadPicOfSignature,
          })
        : setSignature({
            ...signature,
            employeeSignature: uploadPicOfSignature,
          });
    }
    {
      signatureForWitness == true
        ? setSignatureType({
            ...signatureType,
            witness: "imageSignature",
          })
        : setSignatureType({
            ...signatureType,
            employee: "imageSignature",
          });
    }
    setSignaturePad(false);
    if (signatureForWitness) {
      setWitnessPopup(false);
      setShowButtonForSave(true);
      setBrowseSignaturePad(false);
    } else {
      setWitnessPopup(true);
      setBrowseSignaturePad(false);
    }
  }

  function handleSaveSignatureAsText() {
    {
      signatureForWitness == true
        ? setSignature({
            ...signature,
            witnessSignature: textSignaturePad,
            // witnessSignature: textSignaturePad.witnessText,
          })
        : setSignature({
            ...signature,
            employeeSignature: textSignaturePad,
            // employeeSignature: textSignaturePad.employeeText,
          });
    }
    {
      signatureForWitness == true
        ? setSignatureType({
            ...signatureType,
            witness: "textSignature",
          })
        : setSignatureType({
            ...signatureType,
            employee: "textSignature",
          });
    }
    if (signatureForWitness) {
      setTextSignature(false);
      setShowButtonForSave(true);
    } else {
      setTextSignature(false);
      setWitnessPopup(true);
    }
  }

  function handleBrowseSignatrePadCancel() {
    setBrowseSignaturePad(false);
    setOpen(true);
  }
  function handleTextSignatureCancel() {
    setTextSignature(false);
    setOpen(true);
  }

  const handleAddText = async () => {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const Page = pages[pageNumber - 1];
    const { width, height } = Page.getSize();

    const realWidth = Math.round(width);
    const realHeight = Math.round(height);

    const mywidthforemployee = realWidth - sigPosition.employee.x;
    const myheightforemployee = realHeight - sigPosition.employee.y;

    const mywidthforwitness = realWidth - sigPosition.witness.x;
    const myheightforwitness = realHeight - sigPosition.witness.y;

    const mywidthforwitnessName = realWidth - sigPosition.witnessname.x;
    const myheightforwitnessName = realHeight - sigPosition.witnessname.y;

    const mywidthforwitnessAddress = realWidth - sigPosition.witnessaddress.x;
    const myheightforwitnessAddress = realHeight - sigPosition.witnessaddress.y;


    const wforemployee = realWidth - mywidthforemployee;
    const hforemployee = realHeight - myheightforemployee;

    const wforwitnessname = realWidth - mywidthforwitnessName;
    const hforwitnessname = realHeight - myheightforwitnessName;

    const wforwitnessaddress = realWidth - mywidthforwitnessAddress;
    const hforwitnessaddress = realHeight - myheightforwitnessAddress;

    const wforwitness = realWidth - mywidthforwitness;
    const hforwitness = realHeight - myheightforemployee;

    if (signatureType.employee == "drawSignature") {
      const signatureBlobForEmployee = dataURLtoBlob(
        signature.employeeSignature
      );
      const signatureBytesForEmployee =
        await signatureBlobForEmployee.arrayBuffer();
      const pngImageForEmployee = await pdfDoc.embedPng(
        signatureBytesForEmployee
      );
      Page.drawImage(pngImageForEmployee, {
        x: wforemployee,
        y: realHeight - sigPosition.employee.y - sigSize.employee.height - 1,
        width: sigSize.employee.width,
        height: sigSize.employee.height,
      });
    } else if (signatureType.employee == "imageSignature") {
      const pngImageBytesForEmployee = await (
        await fetch(signature.employeeSignature)
      ).arrayBuffer();
      const pngImageForEmployee = await pdfDoc.embedPng(
        pngImageBytesForEmployee
      );
      Page.drawImage(pngImageForEmployee, {
        x: wforemployee,
        y: realHeight - sigPosition.employee.y - sigSize.employee.height - 1,
        width: sigSize.employee.width,
        height: sigSize.employee.height,
      });
    } else if (signatureType.employee == "textSignature") {
      Page.drawText(signature.employeeSignature, {
        x: wforemployee,
        y: realHeight - sigPosition.employee.y - 16,
        size: 14,
        // font: StandardFonts.Helvetica,
        color: rgb(0, 0, 0),
      });
    }

    if (signatureType.witness == "drawSignature") {
      const signatureBlobForWitness = dataURLtoBlob(signature.witnessSignature);
      const signatureBytesForWitness =
        await signatureBlobForWitness.arrayBuffer();
      const pngImageForWitness = await pdfDoc.embedPng(
        signatureBytesForWitness
      );
      Page.drawImage(pngImageForWitness, {
        x: wforwitness,
        y: realHeight - sigPosition.witness.y - sigSize.witness.height - 1,
        width: sigSize.witness.width,
        height: sigSize.witness.height,
      });
    } else if (signatureType.witness == "imageSignature") {
      const pngImageBytesForWitness = await (
        await fetch(signature.witnessSignature)
      ).arrayBuffer();
      const pngImageForWitness = await pdfDoc.embedPng(pngImageBytesForWitness);
      Page.drawImage(pngImageForWitness, {
        x: wforwitness,
        y: realHeight - sigPosition.witness.y - sigSize.witness.height - 1,
        width: sigSize.witness.width,
        height: sigSize.witness.height,
      });
    } else if (signatureType.witness == "textSignature") {
      Page.drawText(signature.witnessSignature, {
        x: wforwitness,
        y: realHeight - sigPosition.witness.y - 16,
        size: 12,
        // font: StandardFonts.Helvetica,
        color: rgb(0, 0, 0),
      });
    }
    // Page.drawText("HelloName", {
    Page.drawText(witnessName.firstName + witnessName.lastName, {
      x: wforwitnessname,
      // x: 20,
      y: realHeight - sigPosition.witnessname.y - 16,
      // y: 200,
      size: 12,
      color: rgb(0, 0, 0),
    });
    // Page.drawText("HelloAddress", {
    Page.drawText(witnessDetails.addressLine1+witnessDetails.addressLine2 , {
      x: wforwitnessaddress,
      // x: 40,
      y: realHeight - sigPosition.witnessaddress.y - 16,
      // y: 300,
      size:12,
      color:rgb(0,0,0),
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

  return (
    <>
      <div className="flex items-center justify-center">
        {file && (
          <Document
            className="w-min h-min"
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber}>
              {signature && (
                <>
                  <Draggable
                    position={sigPosition.employee}
                    onStop={(e, { x, y }) => {
                      setSigPosition({
                        ...sigPosition,
                        employee: { x: x, y: y },
                      });
                    }}
                    cancel=".react-resizable-handle"
                  >
                    {signatureType.employee == "drawSignature" ||
                    signatureType.employee == "imageSignature" ? (
                      <div className=" p-0 m-0 absolute top-0 left-0">
                        <ResizableBox
                          width={sigSize.employee.width}
                          height={sigSize.employee.height}
                          maxConstraints={[400, 400]}
                          minConstraints={[50, 50]}
                          lockAspectRatio={true}
                          onResize={(event, { size }) => {
                            setSigSize({
                              ...sigSize,
                              employee: {
                                width: size.width,
                                height: size.height,
                              },
                            });
                          }}
                          className="p-0 m-0 border-2 border-blue-500 w-screen h-screen"
                        >
                          <img
                            draggable={false}
                            src={signature.employeeSignature}
                            alt="Signature"
                            style={{
                              width: sigSize.employee.width,
                              height: sigSize.employee.height,
                            }}
                          />
                        </ResizableBox>
                      </div>
                    ) : (
                      <div className=" p-0 m-0 absolute top-0 left-0 border-2 border-red-800">
                        <h1 className="text-[14px]">
                          {signature.employeeSignature}
                        </h1>
                      </div>
                    )}
                  </Draggable>
                  <Draggable
                    position={sigPosition.witness}
                    onStop={(e, { x, y }) => {
                      setSigPosition({
                        ...sigPosition,
                        witness: { x: x, y: y },
                      });
                    }}
                    cancel=".react-resizable-handle"
                  >
                    {signatureType.witness == "drawSignature" ||
                    signatureType.witness == "imageSignature" ? (
                      <div className=" p-0 m-0 absolute top-0 left-0">
                        <ResizableBox
                          width={sigSize.witness.width}
                          height={sigSize.witness.height}
                          maxConstraints={[400, 400]}
                          minConstraints={[50, 50]}
                          lockAspectRatio={true}
                          onResize={(event, { size }) => {
                            setSigSize({
                              ...sigSize,
                              witness: {
                                width: size.width,
                                height: size.height,
                              },
                            });
                          }}
                          // onResize={handleResizeStop}
                          className="p-0 m-0 border-2 border-blue-500 w-screen h-screen"
                        >
                          <img
                            draggable={false}
                            src={signature.witnessSignature}
                            alt="Signature"
                            style={{
                              width: sigSize.witness.width,
                              height: sigSize.witness.height,
                            }}
                          />
                        </ResizableBox>
                      </div>
                    ) : (
                      <div className=" p-0 m-0 absolute top-0 left-0 border-2 border-red-800">
                        <h1 className="text-[14px]">
                          {signature.witnessSignature}
                        </h1>
                      </div>
                    )}
                  </Draggable>

                  <Draggable
                    position={sigPosition.witnessname}
                    onStop={(e, { x, y }) => {
                      setSigPosition({
                        ...sigPosition,
                        witnessname: { x: x, y: y },
                      });
                    }}
                    cancel=".react-resizable-handle"
                  >
                    <div className=" p-0 m-0 absolute top-0 left-0 border-2 border-red-800">
                      <h1 className="text-[12px]">
                        {witnessName.firstName} {witnessName.lastName}
                      </h1>
                    </div>
                  </Draggable>

                  <Draggable
                    position={sigPosition.witnessaddress}
                    onStop={(e, { x, y }) => {
                      setSigPosition({
                        ...sigPosition,
                        witnessaddress: { x: x, y: y },
                      });
                    }}
                    cancel=".react-resizable-handle"
                  >
                    <div className=" p-0 m-0 absolute top-0 left-0 border-2 border-red-800">
                      <h1 className="text-[12px]">
                        {witnessDetails.addressLine1} { witnessDetails.addressLine2}
                      </h1>
                    </div>
                  </Draggable>
                </>
              )}
            </Page>
          </Document>
        )}
      </div>
      <div className="absolute top-72 right-[440px]">
        {showButtonForSave === false ? (
          <button
            className="p-5 flex flex-wrap w-28 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest mb-6"
            onClick={setPopup}
          >
            FILL & SIGN
            <img src="/signPen.svg" alt="" />
          </button>
        ) : (
          <button
            className="p-5 flex flex-wrap w-28 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest mb-6"
            onClick={handleAddText}
          >
            SEND
          </button>
        )}
        <button className="p-5 flex flex-wrap w-28 h-28 items-center justify-center rounded-md text-white bg-black tracking-widest">
          CANCEL
        </button>
      </div>
      <input type="file" onChange={onFileChange} />
      <Popup
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
        closeOnDocumentClick={true}
        modal
      >
        <div className="flex items-center justify-around flex-col h-full w-full z-10 rounded-xl bg-[#EDEDED]/50 backdrop-filter">
          {signatureForWitness == true ? (
            <h1 className="tracking-widest text-2xl">WITNESS SIGNATURE</h1>
          ) : (
            <h1 className="tracking-widest text-2xl">SIGNATURE</h1>
          )}
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
      </Popup>
      <Popup
        open={signaturePad}
        setOpen={setSignaturePad}
        onClose={() => setSignaturePad(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-[#EDEDED]/50 backdrop-filter">
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
        onClose={() => setBrowseSignaturePad(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-[#EDEDED]/50 backdrop-filter">
          <h1 className="text-xl mx-34 tracking-widest my-2">SIGNATURE</h1>
          <label
            htmlFor="signature-upload"
            className="w-[425px] h-[250px] border-2 rounded-xl border-white text-white cursor-pointer flex items-center justify-center"
          >
            BROWSE SIGNATURE
            <input
              type="file"
              accept="image/jpeg, image/png"
              id="signature-upload"
              onChange={handleSignatureSelected}
              className="hidden"
            />
          </label>

          <div className="w-60 flex justify-around my-3">
            <button
              onClick={handleBrowseSignatrePadCancel}
              className="text-xl"
            >
              CANCEL
            </button>
            <button onClick={handleSaveSignatureAsImage} className="text-xl">
              UPLOAD
            </button>
          </div>
        </div>
      </Popup>
      <Popup open={textSignature} modal closeOnDocumentClick={true}>
        <div className="flex flex-col items-center bg-[#EDEDED]/50 backdrop-filter">
          <h1 className="text-xl mx-34 tracking-widest my-2">SIGNATURE</h1>
          <textarea
            onChange={(e) => setTextSignaturePad(e.target.value)}
            placeholder="TYPE SIGNATURE"
            className="border w-[425px] h-[75px] rounded-xl px-2 py-1 text-black"
            style={{
              color: "black",
              backgroundColor: "white",
              resize: "none",
              outline: "none",
              boxShadow: "none",
              border: "1px solid #ccc",
            }}
          />
          <div className="w-60 flex justify-around my-3">
            <button
              onClick={handleTextSignatureCancel}
              className="text-xl"
            >
              CANCEL
            </button>
            <button onClick={handleSaveSignatureAsText} className="text-xl">
              ADD
            </button>
          </div>
        </div>
      </Popup>
      <Popup
        open={witnessPopup}
        onClose={() => setWitnessPopup(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-[#EDEDED]/50 backdrop-filter">
          <h1 className="text-2xl mx-34 tracking-widest my-4">
            WITNESS DETAILS
          </h1>

          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-4">
            <input
              type="text"
              placeholder="FIRST NAME"
              class="text-center focus:outline-none flex-1 bg-transparent text-2xl .placeholder-black"
              onChange={(e) => {
                e.preventDefault();
                setWitnessName({ ...witnessName, firstName: e.target.value });
              }}
            />
          </div>

          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-4">
            <input
              type="text"
              placeholder="LAST NAME"
              class="text-center focus:outline-none flex-1 bg-transparent text-2xl"
              onChange={(e) => {
                e.preventDefault();
                setWitnessName({ ...witnessName, lastName: e.target.value });
              }}
            />
          </div>

          <div className="w-52 flex justify-between my-3">
            <button onClick={() => {setWitnessPopup(false); setOpen(true)}}>CANCEL</button>
            <button
              onClick={() => {
                setWitnessDetailsPopup(true);
                setWitnessPopup(false);
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </Popup>
      <Popup
        open={witnessDetailsPopup}
        onClose={() => setWitnessDetailsPopup(false)}
        modal
        closeOnDocumentClick={true}
      >
        <div className="flex flex-col items-center bg-[#EDEDED]/50 backdrop-filter rounded-xl">
          <h1 className="text-2xl mx-34 tracking-widest my-4">
            WITNESS DETAILS
          </h1>
          <h1 className="text-2xl">
            {witnessName.firstName} {witnessName.lastName}
          </h1>

          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-2">
            <input
              type="text"
              placeholder="ADDRESS 1 (PROPERTY NUMBER / NAME)"
              class="text-center focus:outline-none flex-1 bg-transparent text-xl .placeholder-black"
              onChange={(e) => {
                e.preventDefault();
                setWitnessDetails({
                  ...witnessDetails,
                  witnessDetails,
                  addressLine1: e.target.value,
                });
              }}
            />
          </div>

          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-2">
            <input
              type="text"
              placeholder="ADDRESS 2 (STREET / ROAD NAME)"
              class="text-center focus:outline-none flex-1 bg-transparent text-xl"
              onChange={(e) => {
                e.preventDefault();
                setWitnessDetails({
                  ...witnessDetails,
                  addressLine2: e.target.value,
                });
              }}
            />
          </div>
          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-2">
            <input
              type="text"
              placeholder="CITY"
              class="text-center focus:outline-none flex-1 bg-transparent text-xl"
              onChange={(e) => {
                e.preventDefault();
                setWitnessDetails({
                  ...witnessDetails,
                  city: e.target.value,
                });
              }}
            />
          </div>
          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-2">
            <input
              type="text"
              placeholder="STATE REGION"
              class="text-center focus:outline-none flex-1 bg-transparent text-xl"
              onChange={(e) => {
                e.preventDefault();
                setWitnessDetails({
                  ...witnessDetails,
                  state: e.target.value,
                });
              }}
            />
          </div>
          <div class="border-2 border-[#EDEDED] flex items-center w-[425px] h-[75px] rounded-xl mb-2">
            <input
              type="text"
              placeholder="ZIP CODE / POST CODE"
              class="text-center focus:outline-none flex-1 bg-transparent text-xl"
              onChange={(e) => {
                e.preventDefault();
                setWitnessDetails({
                  ...witnessDetails,
                  zipCode: e.target.value,
                });
              }}
            />
          </div>

          <div className="w-52 flex justify-between my-3">
            <button onClick={() => { setWitnessPopup(true); setWitnessDetailsPopup(false) }}>CANCEL</button>
            <button
              onClick={() => {
                setOpen(true);
                setWitnessDetailsPopup(false);
                setSignatureForWitness(true);
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}