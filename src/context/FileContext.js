// src/context/FileContext.js
import React, { createContext, useContext, useState } from "react";

const FileContext = createContext(null);

export function FilesProvider({ children }) {
  // files: list of File objects selected on the upload screen
  // extractedData: an object produced after OCR/parse (Form1 expects this)
  const [files, setFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);

  const value = {
    files,
    setFiles,
    extractedData,
    setExtractedData,
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

// hook for components
export function useFiles() {
  const ctx = useContext(FileContext);
  if (!ctx) {
    // Helpful for dev: throw or return defaults so components don't blow up silently
    // If you prefer non-throwing behavior, return defaults instead of throwing.
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return ctx;
}
