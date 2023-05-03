import FileUpload from '@/component/FileUpload';
import PdfSignature from '@/component/PdfSignature';
import React, { useState } from 'react'

const pdfSignIn = () => {
    const [pdf, setPdf] = useState(null);

    const handleFileChange = (file) => {
        setPdf(URL.createObjectURL(file));
    };

    return (
        <>
            <div>
                <FileUpload onFileChange={handleFileChange}/>
                {/* {pdf && <PdfSignature pdf={pdf} />} */}
                <PdfSignature pdf={pdf}/>
            </div>
        </>
    )
}

export default pdfSignIn;