import React from 'react'

const FileUpload = ({ onFileChange }) => {
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        onFileChange(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
}

export default FileUpload;