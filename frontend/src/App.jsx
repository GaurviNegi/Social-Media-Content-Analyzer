import React, { useState } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

const App = () => {
  // State variables to hold file, loading status, and  result
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");


  // Handle file drop event, setting the selected file in state
  const handleDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

   // Function to upload the file to the backend
  const uploadFile = async () => {
    if (!file) return alert("Please upload a file");
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data.text);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while processing the file.");
    } finally {
      setLoading(false);
    }
  };

  // Function to clear the selected file and result
  const clearSelection = () => {
    setFile(null);
    setResult("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Social Media 📱 Content Analyzer</h1>
      {/* Dropzone component to handle file drop */}
      <Dropzone onDrop={handleDrop} accept="image/*,application/pdf">
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 p-6 rounded-lg w-1/2 text-center cursor-pointer bg-white"
          >

            <input {...getInputProps()} />
            <p>Drag & drop a file here, or click to select a file</p>
          </div>
        )}
      </Dropzone>

      {/* Show the selected file name and icon */}
      {file && (
        <div className="mt-4 flex items-center">
          <span className="text-blue-500 mr-2">📄</span> {/* File Icon */}
          <span className="text-gray-700">{file.name}</span> {/* File Name */}
        </div>
      )}
  

      {/* upload button */}
      <button
        onClick={uploadFile}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>


      {/* Clear Button to reset file and result */}
      <button
        onClick={clearSelection}
        className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Clear
      </button>

      {/* result will be displayed here */}
      {result && (
        <div className="mt-6 p-4 bg-white shadow rounded w-1/2">
          <h2 className="font-bold">Extracted Text:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};

export default App;

