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
import SignatureCanvas from 'react-signature-canvas'

const PdfSignature = ({ pdf }) => {
    const [signature, setSignature] = useState(null);
    const signatureRef = useRef();

    const handleSave = () => {
      const signatureDataUrl = signatureRef.current.toDataURL();
      console.log(signatureDataUrl);
    };

    const canvasStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        border:'2px solid yellow'
    };
  
    return (
      <div style={{ position: 'relative' }}>
        <PdfViewer pdf={pdf} />
        <div style={canvasStyle}>
            <SignatureCanvas
                ref={signatureRef}
                penColor="black"
                canvasProps={{ width: '100%', height: '100%', className: 'signatureCanvas' }}
            />
        </div>
        {signature && (
          <button style={{ position: 'absolute', bottom: 20, right: 20 }} onClick={handleSave}>
            Save Signature
          </button>
        )}
      </div>
    );
  }
  
export default PdfSignature;