// import React,{ useState } from 'react'
// import PdfViewer from './PdfViewer';
// import SignatureCanvas from 'react-signature-canvas'

// const PdfSignature = ({ pdf }) => {
//     const [signature, setSignature] = useState(null);
  
//     const handleSave = () => {
//       const signatureDataUrl = signature.toDataURL();
//       console.log(signatureDataUrl);
//     };
  
//     return (
//       <div style={{ position: 'relative' }}>
//         <PdfViewer pdf={pdf} />
//         <SignatureCanvas
//           penColor="black"
//           canvasProps={{ width: 800, height: 600, className: 'signatureCanvas' }}
//           onEnd={() => {
//             setSignature(signatureRef.current);
//           }}
//         />
//         {signature && (
//           <button style={{ position: 'absolute', bottom: 20, right: 20 }} onClick={handleSave}>
//             Save Signature
//           </button>
//         )}
//       </div>
//     );
//   }
  
// export default PdfSignature


import React,{ useState,useRef } from 'react'
import PdfViewer from './PdfViewer';
import SignaturePad from 'react-signature-canvas'

const PdfSignature = ({ pdf }) => {
    const [signature, setSignature] = useState(null);
    const signatureRef = useRef();

    const handleSave = () => {
      const signatureDataUrl = signatureRef.current.toDataURL();
      setSignature(signatureDataUrl);
    };

    // const canvasStyle = {
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     width: '100%',
    //     height: '100%',
    //     zIndex: 10,
    // };
  
    return (
      <div style={{ position: 'relative' }}>
        <PdfViewer pdf={pdf} signature={signature} />
        <div className='z-30 border-2 border-blue-500'>
          <h1>Signature Pad</h1>
            <SignaturePad
                ref={signatureRef}
                canvasProps={{ className: 'sigContainer' }}
            />
        </div>
        {/* {signature && ( */}
          <button style={{ position: 'absolute', bottom: 20, right: 20 }} onClick={handleSave}>
            Save Signature
          </button>
          {/* {signature !== null ? 
          <img src={signature} alt="" />
          :
          ""
        } */}
        {/* )} */}
      </div>
    );
  }
  
export default PdfSignature;