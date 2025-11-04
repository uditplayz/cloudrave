import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function FileUpload({ authToken, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      // STEP 1: Get Pre-Signed URL
      const apiRes = await axios.post(
        `${API_URL}/api/files/generate-upload-url`,
        {
          filename: selectedFile.name,
          filetype: selectedFile.type,
        },
        {
          headers: { 
            'x-auth-token': authToken,
            'Content-Type': 'application/json'
          },
        }
      );

      const { uploadUrl, s3Key } = apiRes.data;

      // STEP 2: Upload File Directly to S3
      await axios.put(uploadUrl, selectedFile, {
        headers: { 
          'Content-Type': selectedFile.type 
        },
      });

      // STEP 3: Finalize Upload with our Backend
      const finalizeRes = await axios.post(
        `${API_URL}/api/files/finalize-upload`,
        {
          originalFilename: selectedFile.name,
          s3Key,
          mimetype: selectedFile.type,
          fileSize: selectedFile.size,
        },
        { 
          headers: { 
            'x-auth-token': authToken,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (onUploadSuccess) {
        onUploadSuccess(finalizeRes.data);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setSelectedFile(null);
      event.target.reset();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange} 
          disabled={uploading} 
        />
        <button 
          type="submit" 
          disabled={!selectedFile || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FileUpload;