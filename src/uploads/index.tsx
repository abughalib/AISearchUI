import React, { useState, useRef } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";

interface ModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPLOAD_URL = "http://localhost:8000/handle_upload";

const uploadFiles = async (
  files: FileList,
  setUploadStatus: React.Dispatch<React.SetStateAction<string>>,
  table_name: string
) => {
  const formData = new FormData();

  formData.append("table_name", table_name);
  Array.from(files).forEach((file) => formData.append("files", file));

  try {
    setUploadStatus("Uploading...");
    const response: Response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const result = response.body;
    setUploadStatus("File uploaded successfully");
    console.log("File uploaded successfully: ", result);
  } catch (error) {
    console.error("Error uploading file: ", error);
    setUploadStatus("Error uploading file");
  }
};

const UploadWindow: React.FC<ModelProps> = ({ isOpen, onClose }) => {
  const currentTable = useTypedSelector(
    (state) => state.knowledgeReducer?.table_name || ""
  );

  const [uploadStatus, setUploadStatus] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModel = (e: React.MouseEvent) => {
    if (modalRef.current && e.target == modalRef.current) {
      onClose();
    }
  };

  const handleUploadClick = () => {
    const inputElement = document.getElementById(
      "file_input"
    ) as HTMLInputElement;

    if (inputElement) {
      const files: FileList = inputElement.files as FileList;
      if (files.length > 0) {
        uploadFiles(files, setUploadStatus, currentTable);
      } else {
        setUploadStatus("No file selected");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="upload_modal"
      ref={modalRef}
      onClick={closeModel}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-black dark:text-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium">Upload File</h3>
          <div className="mt-2 px-7 py-3">
            <input
              type="file"
              accept=".txt, application/pdf, .docx"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:border-blue-600 focus:outline-none"
              aria-describedby="file_input_help"
              id="file_input"
              multiple
            />
            <p className="text-sm text-gray-500" id="file_input_help">
              Select the files you want to upload
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="upload_button"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleUploadClick}
            >
              Upload
            </button>
            {uploadStatus && (
              <p className="text-sm text-red-500 mt-2">{uploadStatus}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadWindow;
