import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, IconButton, Button,
  MenuItem, Select, InputAdornment, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
  FormControl, InputLabel, Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import jsPDF from "jspdf";
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// --- helper to clean up spoken text ---
const processSpokenText = (text) =>
  text
    .replace(/\bhash\b/gi, '#')
    .replace(/\bhyphen\b/gi, '-')
    .replace(/\bdot\b/i, '.')
    .replace(/\bslash\b/gi, '/')
    .replace(/\bcolon\b/gi, ':')
    .replace(/\bcomma\b/gi, ',')
    .replace(/\bat\b/gi, '@')
    .replace(/\bpercent\b/gi, '%')
    .replace(/\band\b/gi, '')
    .trim();

const SmartTextField = React.memo(({ label, name, formData, setField, multiline, rows, allowSnapshot }) => {
  const [showIcons, setShowIcons] = useState(false);
  const fileRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [pdfSrc, setPdfSrc] = useState(null);
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);
  const pageRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speechError, setSpeechError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPdfWorkerLoaded, setIsPdfWorkerLoaded] = useState(false);
  const [imgZoom, setImgZoom] = useState(1);
  const [imgRotation, setImgRotation] = useState(0);
  const [pdfScale, setPdfScale] = useState(1.2);
  const [pdfRotation, setPdfRotation] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);


  
  const isExtractButtonDisabled = !crop?.width || !crop?.height;

  let textValue = "";
let snapshotValue = null;

if (allowSnapshot) {
  if (typeof formData === "object") {
    textValue = formData.text || "";
    snapshotValue = formData.snapshot || null;
  } else if (typeof formData === "string" && formData.startsWith("data:image")) {
    snapshotValue = formData;
  } else {
    textValue = formData || "";
  }
} else {
  textValue = formData || "";
}


  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    setIsPdfWorkerLoaded(true);
  }, []);

  const handleSpeechInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (ev) => {
      const processed = processSpokenText(ev.results[0][0].transcript || '');
// ✅ Append voice result
if (allowSnapshot) {
  // GD&T field → keep both text & snapshot
  setField(name, {
    ...(typeof formData === "object" ? formData : { snapshot: null }),
    text: ((typeof formData === "object" ? formData.text : formData) || "") + " " + processed
  });
} else {
  // Normal fields → just plain text
  setField(name, (formData || "") + " " + processed);
}


    };
    recognition.onerror = (ev) => {
      setSpeechError('Speech recognition error: ' + (ev.error || 'unknown'));
    };
    recognition.start();
  };

  const handleCameraClick = () => {
    fileRef.current?.click();
  };

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.type === 'application/pdf') {
      if (!isPdfWorkerLoaded) {
        setError('PDF viewer not ready yet.');
        return;
      }
      setPdfSrc(file);
      setPdfDialogOpen(true);
      setCrop(undefined);
      setPdfScale(1.2);
      setPdfRotation(0);
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result);
        setOpen(true);
        setCrop(undefined);
        setImgZoom(1);
        setImgRotation(0);
      };
            reader.onerror = (err) => {
        console.error('FileReader error:', err);
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Unsupported file type. Please select an image or PDF.');
    }
      // ✅ Important: reset file input so same file can be re-selected
  e.target.value = "";
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
    setCrop(undefined);
  };
    const onDocumentLoadError = useCallback((error) => {
      console.error('Failed to load PDF document:', error);
      setError('Failed to load PDF file. The file may be corrupted or invalid.');
      setPdfSrc(null);
    }, []);
  
    const onPageRenderSuccess = useCallback(() => {
      setCrop(undefined);
    }, []);
  


  const toBlobAsync = (canvas, type = 'image/jpeg', quality = 0.9) =>
    new Promise((resolve) => {
      if (!canvas.toBlob) {
        const dataURL = canvas.toDataURL(type, quality);
        const byteString = atob(dataURL.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        resolve(new Blob([ab], { type }));
      } else {
        canvas.toBlob((blob) => resolve(blob), type, quality);
      }
    });

  const handlePdfCropComplete = async () => {
    if (!pageRef.current || !crop?.width || !crop?.height) return;

    setLoading(true);
    setError(null);
    try {
      const canvas = pageRef.current;
      const scaleX = canvas.width / canvas.clientWidth;
      const scaleY = canvas.height / canvas.clientHeight;
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = Math.round(crop.width * scaleX);
      croppedCanvas.height = Math.round(crop.height * scaleY);
      const ctx = croppedCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        Math.round(crop.x * scaleX),
        Math.round(crop.y * scaleY),
        Math.round(crop.width * scaleX),
        Math.round(crop.height * scaleY),
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height
      );

      const croppedImageBlob = await toBlobAsync(croppedCanvas, 'image/jpeg', 0.9);
      const requestFormData = new FormData();
      requestFormData.append('cropped_image', croppedImageBlob, 'cropped.jpg');
      const response = await axios.post('http://127.0.0.1:5000/api/ocr-image', requestFormData);
      const extractedText = (response.data.extracted_text || '').trim();
    if (allowSnapshot) {
  // GD&T field → keep both text & snapshot
  setField(name, {
    ...(typeof formData === "object" ? formData : { snapshot: null }),
    text: ((typeof formData === "object" ? formData.text : formData) || "") + " " + extractedText
  });
} else {
  // Normal fields → just plain text
  setField(name, (formData || "") + " " + extractedText);
}


    } catch (error) {
      console.error('PDF OCR extraction failed:', error);
      if (error.response) {
        setError(`Server Error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('Network Error: The backend server is not running or is unreachable.');
      } else {
        setError(error.message || 'An unexpected error occurred during the OCR process.');
      }
    } finally {
      setLoading(false);
      setCrop(undefined);
      setPdfScale(1.2);
      setPdfRotation(0);
    }
  };

    const rotateCanvas = (srcCanvas, degrees) => {
    const out = document.createElement('canvas');
    const ctx = out.getContext('2d');
    const rad = (degrees % 360) * Math.PI / 180;

    if (degrees % 180 === 0) {
      out.width = srcCanvas.width;
      out.height = srcCanvas.height;
    } else {
      out.width = srcCanvas.height;
      out.height = srcCanvas.width;
    }

    ctx.translate(out.width / 2, out.height / 2);
    ctx.rotate(rad);
    ctx.drawImage(srcCanvas, -srcCanvas.width / 2, -srcCanvas.height / 2);
    return out;
  };

  const handleImageCropComplete = async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;

    setLoading(true);
    setError(null);
    try {
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
const cropCanvas = document.createElement('canvas');
cropCanvas.width = Math.round(crop.width * scaleX);
cropCanvas.height = Math.round(crop.height * scaleY);
const ctx = cropCanvas.getContext('2d');
ctx.drawImage(
  image,
  crop.x * scaleX,
  crop.y * scaleY,
  crop.width * scaleX,
  crop.height * scaleY,
  0,
  0,
  cropCanvas.width,
  cropCanvas.height
);

const finalCanvas = imgRotation ? rotateCanvas(cropCanvas, imgRotation) : cropCanvas;


      const croppedImageBlob = await toBlobAsync(finalCanvas, 'image/jpeg', 0.9);
      const requestFormData = new FormData();
      requestFormData.append('cropped_image', croppedImageBlob, 'cropped.jpg');
      const response = await axios.post('http://127.0.0.1:5000/api/ocr-image', requestFormData);
      const extractedText = (response.data.extracted_text || '').trim();
      if (allowSnapshot) {
  // GD&T field → keep both text & snapshot
  setField(name, {
    ...(typeof formData === "object" ? formData : { snapshot: null }),
    text: ((typeof formData === "object" ? formData.text : formData) || "") + " " + extractedText
  });
} else {
  // Normal fields → just plain text
  setField(name, (formData || "") + " " + extractedText);
}


    } catch (error) {
      console.error('OCR extraction failed:', error);
      if (error.response) {
        setError(`Server Error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        setError('Network Error: The backend server is not running or is unreachable.');
      } else {
        setError(error.message || 'An unexpected error occurred during the OCR process.');
      }
    } finally {
      setLoading(false);
      setCrop(undefined);
      setImgZoom(1);
      setImgRotation(0);
    }
  };

const handlePdfSnapshot = async () => {
  if (!pageRef.current || !crop?.width || !crop?.height) {
    setPdfDialogOpen(false);
    return;
  }

  const canvas = pageRef.current;
  const scaleX = canvas.width / canvas.clientWidth;
  const scaleY = canvas.height / canvas.clientHeight;

  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = Math.round(crop.width * scaleX);
  croppedCanvas.height = Math.round(crop.height * scaleY);

  const ctx = croppedCanvas.getContext('2d');
  ctx.drawImage(
    canvas,
    Math.round(crop.x * scaleX),
    Math.round(crop.y * scaleY),
    Math.round(crop.width * scaleX),
    Math.round(crop.height * scaleY),
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height
  );

  const snapshotUrl = croppedCanvas.toDataURL("image/png");

  if (allowSnapshot) {
    // ✅ Special handling for GD&T
    setField(name, {
      ...(typeof formData === "object" ? formData : { text: formData || "" }),
      snapshot: snapshotUrl
    });
  } else {
    // ✅ Other fields keep old behavior
    setField(name, snapshotUrl);
  }

  setPdfDialogOpen(false);
  setPdfSrc(null);
  setCrop(undefined);
};


return (
  <>
    {snapshotValue && (
      <Box sx={{ border: "1px solid #ccc", p: 1, textAlign: "center", mb: 1 }}>
        <img
          src={snapshotValue}
          alt="GD&T Snapshot"
          style={{ maxWidth: "100%", maxHeight: "120px", objectFit: "contain" }}
        />
      </Box>
    )}

    <TextField
      fullWidth
      size="small"
      label={label}
      value={textValue}
      onChange={(e) =>
        allowSnapshot
          ? setField(name, { text: e.target.value, snapshot: snapshotValue })
          : setField(name, e.target.value)
      }
      onFocus={() => setShowIcons(true)}
      onBlur={() => setTimeout(() => setShowIcons(false), 180)}
      multiline={multiline}
      rows={rows}
      InputProps={{
        endAdornment: showIcons && (
          <InputAdornment position="end">
            <IconButton size="small" onMouseDown={(e) => e.preventDefault()} onClick={handleSpeechInput}>
              <MicIcon sx={{ color: '#1976d2' }} />
            </IconButton>
            <IconButton size="small" onMouseDown={(e) => e.preventDefault()} onClick={handleCameraClick}>
              <CameraAltIcon sx={{ color: '#1976d2' }} />
            </IconButton>
          </InputAdornment>
        )
      }}
      disabled={loading}
    />


      
      <input
        ref={fileRef} type="file" accept="image/*, .pdf" capture="environment"
        style={{ display: 'none' }} onChange={onSelectFile}
      />

      {/* Dialog for Image Cropping */}
      <Dialog open={open} onClose={() => { setOpen(false); setImageSrc(null); setCrop(undefined); }} maxWidth="md" fullWidth>
        <DialogTitle>
          Crop Image for OCR
          {isExtractButtonDisabled && (
            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              Please select a crop area.
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Button startIcon={<ZoomOutIcon />} onClick={() => setImgZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))}>ZOOM OUT</Button>
            <Button startIcon={<ZoomInIcon />} onClick={() => setImgZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))}>ZOOM IN</Button>
            <Button startIcon={<RotateLeftIcon />} onClick={() => setImgRotation((r) => (r + 270) % 360)}>ROTATE -90°</Button>
            <Button startIcon={<RotateRightIcon />} onClick={() => setImgRotation((r) => (r + 90) % 360)}>ROTATE +90°</Button>
            <Button startIcon={<RestartAltIcon />} onClick={() => { setImgZoom(1); setImgRotation(0); }}>RESET</Button>
          </Box>
          {imageSrc && (
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop Me"
                style={{ width: `${imgZoom * 100}%`, display: 'block' }}
              />
            </ReactCrop>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); setImageSrc(null); setCrop(undefined); }} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleImageCropComplete}
            color="primary"
            variant="contained"
            disabled={isExtractButtonDisabled}
          >
            Extract Text
          </Button>
        </DialogActions>
      </Dialog>

{/* PDF crop with zoom, rotate, reset, snapshot, extract */}
<Dialog
  open={pdfDialogOpen}
  onClose={() => { setPdfDialogOpen(false); setPdfSrc(null); setCrop(undefined); }}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    Crop PDF for OCR
    {isExtractButtonDisabled && (
      <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
        Please select a crop area.
      </Typography>
    )}
  </DialogTitle>

  <DialogContent dividers>
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2, flexWrap: "wrap" }}>
      <Button disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>PREVIOUS</Button>
      <Typography variant="body1" sx={{ alignSelf: "center" }}>
        Page {pageNumber} of {numPages}
      </Typography>
      <Button disabled={pageNumber >= numPages} onClick={() => setPageNumber((p) => p + 1)}>NEXT</Button>

      {/* Zoom controls */}
      <Button startIcon={<ZoomOutIcon />} onClick={() => setPdfScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}>ZOOM OUT</Button>
      <Button startIcon={<ZoomInIcon />} onClick={() => setPdfScale((s) => Math.min(3, +(s + 0.1).toFixed(2)))}>ZOOM IN</Button>

      {/* Rotate controls */}
      <Button startIcon={<RotateLeftIcon />} onClick={() => setPdfRotation((r) => (r + 270) % 360)}>ROTATE -90°</Button>
      <Button startIcon={<RotateRightIcon />} onClick={() => setPdfRotation((r) => (r + 90) % 360)}>ROTATE +90°</Button>

      {/* Reset */}
      <Button startIcon={<RestartAltIcon />} onClick={() => { setPdfScale(1.2); setPdfRotation(0); }}>RESET</Button>
    </Box>

    {/* PDF Viewer with Crop */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
        <Box>
          {pdfSrc && (
            <Document file={pdfSrc} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onRenderSuccess={onPageRenderSuccess}
                scale={pdfScale}
                rotate={pdfRotation}
                canvasRef={(el) => {
                  pageRef.current = el;
                }}
              />
            </Document>
          )}
        </Box>
      </ReactCrop>
    </Box>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => { setPdfDialogOpen(false); setPdfSrc(null); setCrop(undefined); }} color="secondary">
      Cancel
    </Button>

    {allowSnapshot && (
      <Button
        onClick={handlePdfSnapshot}
        disabled={isExtractButtonDisabled}
        variant="outlined"
      >
        Insert Snapshot
      </Button>
    )}

    <Button
      onClick={handlePdfCropComplete}
      color="primary"
      variant="contained"
      disabled={isExtractButtonDisabled}
    >
      Extract Text
    </Button>
  </DialogActions>
</Dialog>


      {/* Loading */}
      <Dialog open={loading}>
        <DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress /> <Typography>Extracting text...</Typography>
        </DialogContent>
      </Dialog>
      

      {/* Errors */}
      <Dialog open={!!error} onClose={() => setError(null)}><DialogTitle>Error</DialogTitle><DialogContent><Typography>{error}</Typography></DialogContent></Dialog>
      <Dialog open={!!speechError} onClose={() => setSpeechError(null)}><DialogTitle>Speech Error</DialogTitle><DialogContent><Typography>{speechError}</Typography></DialogContent></Dialog>
    </>
  );
});

// ---- Main Form3 component ----
export default function Form3SetupScreen() {
  const [rows, setRows] = useState([{ id: 1 }]);
  // ⬇️ Add this at the top with your other states
const [ipsFile, setIpsFile] = useState(null);
const [ipsLoading, setIpsLoading] = useState(false);

  const [resultsValue, setResultsValue] = useState({});
  const [secondaryResults, setSecondaryResults] = useState({}); // New state for nested values
  const [extraField, setExtraField] = useState({});
  const [values, setValues] = useState({}); // holds all SmartTextField values
  const location = useLocation();
  const navigate = useNavigate();
  // ---- auto-scroll refs/hooks ----
const rowsEndRef = useRef(null);

useEffect(() => {
  if (rowsEndRef.current) {
    rowsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [rows]);  // rows is your state array
// --------------------------------


  const goToForm2 = () => {
    if (location.state && location.state.form2Data) {
      navigate("/form2setup", {
        state: {
          form2Data: location.state.form2Data,
        },
      });
    } else {
      navigate("/form2setup");
    }
  };
  
useEffect(() => {
    const savedFull = sessionStorage.getItem("form3Data");
    const savedTop = sessionStorage.getItem("form3Top");
    const fullSavedObj = savedFull ? JSON.parse(savedFull) : null;
    const topSavedObj = savedTop ? JSON.parse(savedTop) : {};

    const fromForm2 = {
      partNumber: location.state?.form2Data?.partNumber || topSavedObj.partNumber || "",
      partName: location.state?.form2Data?.partName || topSavedObj.partName || "",
      serialNumber: location.state?.form2Data?.serialNumber || topSavedObj.serialNumber || "",
      fairIdentifier: location.state?.form2Data?.fairIdentifier || topSavedObj.fairIdentifier || "",
    };

    try {
      sessionStorage.setItem("form3Top", JSON.stringify(fromForm2));
    } catch (e) {}

    // 🚩 Corrected Logic starts here
    let restoredValues = {};
    if (fullSavedObj) {
      // Restore all values from a full save
      restoredValues = {
        ...fullSavedObj,
        "top-0": fromForm2.partNumber,
        "top-1": fromForm2.partName,
        "top-2": fromForm2.serialNumber,
        "top-3": fromForm2.fairIdentifier,
      };
      
      // ✅ Count rows from the saved data and update the `rows` state
      let maxRowIndex = -1;
      Object.keys(fullSavedObj).forEach(key => {
        // Find keys that match the table cells, e.g., 'cell-0-1', 'cell-1-5', etc.
        const match = key.match(/^cell-char-(\d+)|cell-bubble-(\d+)|cell-(\d+)-(\d+)|req-desc-(\d+)|req-tol-(\d+)/);
        if (match) {
          const rowIndex = parseInt(match[1] || match[2] || match[3] || match[5] || match[6], 10);
          if (rowIndex > maxRowIndex) {
            maxRowIndex = rowIndex;
          }
        }
      });
      
      // If data for multiple rows was found, update the `rows` state
      if (maxRowIndex >= 0) {
        const newRows = Array.from({ length: maxRowIndex + 1 }, (_, i) => ({ id: i + 1 }));
        setRows(newRows);
      }
      
      // ✅ Also restore the `resultsValue` and `secondaryResults`
      const savedResultsValue = JSON.parse(sessionStorage.getItem("resultsValue") || "{}");
      const savedSecondaryResults = JSON.parse(sessionStorage.getItem("secondaryResults") || "{}");
      const savedExtraField = JSON.parse(sessionStorage.getItem("extraField") || "{}");
      
      setResultsValue(savedResultsValue);
      setSecondaryResults(savedSecondaryResults);
      setExtraField(savedExtraField);

    } else {
      // No full save yet, only initialize the top 4 fields
      restoredValues = {
        "top-0": fromForm2.partNumber,
        "top-1": fromForm2.partName,
        "top-2": fromForm2.serialNumber,
        "top-3": fromForm2.fairIdentifier,
      };
    }

    setValues(prev => ({ ...prev, ...restoredValues }));
  }, [location.state, setRows]); // Added setRows to the dependency array



  const performAction = (action) => {
    if (action === "save") {
      sessionStorage.setItem("form3Data", JSON.stringify(values));
      sessionStorage.setItem("resultsValue", JSON.stringify(resultsValue));
      sessionStorage.setItem("secondaryResults", JSON.stringify(secondaryResults));
      sessionStorage.setItem("extraField", JSON.stringify(extraField));

    // Also persist top 4 separately
    try {
      const top = {
        partNumber: values["top-0"] || "",
        partName: values["top-1"] || "",
        serialNumber: values["top-2"] || "",
        fairIdentifier: values["top-3"] || "",
      };
      sessionStorage.setItem("form3Top", JSON.stringify(top));
    } catch (e) {}

    alert("Form 3 data saved locally!");
  } else if (action === "back") {
    navigate("/form2setup", { state: { form3Data: values } });
    try {
      const top = {
        partNumber: values["top-0"] || "",
        partName: values["top-1"] || "",
        serialNumber: values["top-2"] || "",
        fairIdentifier: values["top-3"] || "",
      };
      sessionStorage.setItem("form3Top", JSON.stringify(top));
    } catch (e) {}
  } else if (action === "next") {
    navigate("/form4setup", { state: { form3Data: values } });
    try {
      const top = {
        partNumber: values["top-0"] || "",
        partName: values["top-1"] || "",
        serialNumber: values["top-2"] || "",
        fairIdentifier: values["top-3"] || "",
      };
      sessionStorage.setItem("form3Top", JSON.stringify(top));
    } catch (e) {}
  }
};




  const addRow = () => setRows(prev => [...prev, { id: prev.length + 1 }]);
 
  const deleteRow = (rowIndex) => {
       setRows(prev => prev.filter((_, i) => i !== rowIndex));
      setValues(prev => {
         const updated = { ...prev };
         Object.keys(updated).forEach(key => {
           if (key.startsWith(`cell-${rowIndex}-`)) {
             delete updated[key];
           }
         });
         return updated;
       });
       setResultsValue(prev => {
         const updated = { ...prev };
         delete updated[rowIndex];
         return updated;
       });
       setSecondaryResults(prev => {
         const updated = { ...prev };
         delete updated[rowIndex];
         return updated;
       });
       setExtraField(prev => {
         const updated = { ...prev };
         Object.keys(updated).forEach(key => {
           if (key.startsWith(`${rowIndex}-`)) {
             delete updated[key];
           }
         });
         return updated;
       });
     };
  const handleResultsChange = (rowIndex, value) => {
    setResultsValue(prev => ({ ...prev, [rowIndex]: value }));
    // Clear secondary results when the primary is changed
    setSecondaryResults(prev => ({ ...prev, [rowIndex]: null }));
  };

  const handleSecondaryResultsChange = (rowIndex, value) => {
    setSecondaryResults(prev => ({ ...prev, [rowIndex]: value }));
  };
  
  const handleCellChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleIpsUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIpsFile(file);
    setIpsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("http://127.0.0.1:5000/api/extract-text-stream", {
        method: "POST",
        body: formData,
      });
  
      if (!response.body) throw new Error("No response body");
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let firstBatch = true;
  
      const newRows = [];
      const newValues = {};
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
  
        // parse complete JSON objects as they arrive
        const parts = buffer.split(/}\s*,\s*/);
        for (let i = 0; i < parts.length - 1; i++) {
          const chunk = (i === 0 && firstBatch ? parts[i].replace(/^\{"extracted_data":\[/, "") : parts[i]) + "}";
          firstBatch = false;
          try {
            const item = JSON.parse(chunk);
            const idx = newRows.length;
            newRows.push({ id: idx + 1 });
            newValues[`cell-char-${idx}`] = item.operation || "";
            newValues[`cell-bubble-${idx}`] = item.feature_no || "";
            newValues[`cell-${idx}-1`] = item.drawing_ref || "";
            newValues[`req-desc-${idx}`] = item.description || "";
  
            // update UI incrementally
            setRows([...newRows]);
            setValues(prev => ({ ...prev, ...newValues }));
          } catch {
            // incomplete JSON fragment; wait for more data
          }
        }
  
        buffer = parts[parts.length - 1]; // leftover for next loop
      }
    } catch (err) {
      console.error("Streaming upload failed", err);
    } finally {
      setIpsLoading(false);
    }
  };
  
  
const handlePdfExport = () => {
    console.log('Values object:', values); // Add this line
  const doc = new jsPDF("p", "mm", "a4");
  let yPos = 15;
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica");
  doc.setTextColor(51, 51, 51);

  // ---------- Title ----------
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Form 3: Characteristic Accountability, Verification and Compatibility Evaluation",
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  yPos += 10;

  // ---------- Utility functions ----------
  const drawBox = (label, value, x, y, width, height) => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label, x + 2, y + 4);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(value || "", width - 4);
    doc.rect(x, y, width, height);
    doc.text(lines, x + 2, y + 8);
  };

  const calculateBoxHeight = (value, width, minHeight) => {
    const lines = doc.splitTextToSize(value || "", width - 4);
    const textHeight = lines.length * 4;
    return Math.max(minHeight, textHeight + 6);
  };

  // ---------- Top Fields ----------
  const fieldWidth = (pageWidth - margin * 2) / 4;
  const topFields = [
    { label: "1. Part Number", value: values["top-0"] || "" },
    { label: "2. Part Name", value: values["top-1"] || "" },
    { label: "3. Serial Number", value: values["top-2"] || "" },
    { label: "4. FAIR Identifier", value: values["top-3"] || "" },
  ];

  const maxTopHeight = Math.max(
    ...topFields.map((f) => calculateBoxHeight(f.value, fieldWidth, 10))
  );
  topFields.forEach((field, i) => {
    drawBox(
      field.label,
      field.value,
      margin + i * fieldWidth,
      yPos,
      fieldWidth,
      maxTopHeight
    );
  });
  yPos += maxTopHeight + 5;

  // ---------- Table Drawing ----------
  const headers = [
    "5. Char. No.",
    "6. Reference Location",
    "7. Characteristic Designator",
    "8. Requirement",
    "9. Results",
    "10. Tooling",
    "11. Nonconformance No.",
    "12. Comments",
  ];

const drawTable = () => {
    if (yPos + 20 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Characteristics", margin, yPos);
    yPos += 5;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const tableWidth = pageWidth - margin * 2;
    const colWidths = [
      tableWidth * 0.07, // Char. No.
      tableWidth * 0.15, // Ref Location
      tableWidth * 0.12, // Characteristic Designator
      tableWidth * 0.22, // Requirement
      tableWidth * 0.15, // Results
      tableWidth * 0.10, // Tooling
      tableWidth * 0.09, // Nonconformance
      tableWidth * 0.10, // Comments
    ];

    const headerHeight = 12;
    let x = margin;
    headers.forEach((header, i) => {
      doc.rect(x, yPos, colWidths[i], headerHeight);
      const headerLines = doc.splitTextToSize(header, colWidths[i] - 2);
      const headerYOffset = (headerHeight - headerLines.length * 3.5) / 2;
      doc.text(headerLines, x + 1, yPos + 4 + headerYOffset);
      x += colWidths[i];
    });
    yPos += headerHeight;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    rows.forEach((_, index) => {
      let results = resultsValue[index] || "";
      if (secondaryResults[index]) {
        results += ` - ${secondaryResults[index]}`;
      }
      
      const units = values[`req-units-${index}`] || "";
      let requirementText = [
        `Desc: ${values[`req-desc-${index}`] || ""}`,
      ].filter(line => !line.endsWith(": ")).join("\n");
      
      const tolType = values[`req-tol-${index}`];
      if (tolType) {
        requirementText += `\nTol: ${tolType}`;
      }

      if (tolType === "Symmetrical") {
        const nominal = values[`req-sym-nom-${index}`] || "";
        const tol = values[`req-sym-tol-${index}`] || "";
        requirementText += `\nNominal: ${nominal}`;
        requirementText += `\nHigh/Low Tol: ${tol}`;
      } else if (tolType === "Bilateral") {
        const nominal = values[`req-bilat-nom-${index}`] || "";
        const highTol = values[`req-bilat-high-${index}`] || "";
        const lowTol = values[`req-bilat-low-${index}`] || "";
        requirementText += `\nNominal: ${nominal}`;
        requirementText += `\nHigh Tol: ${highTol}`;
        requirementText += `\nLow Tol: ${lowTol}`;
      } else if (tolType === "Unilateral Upper") {
        const upper = values[`req-upper-${index}`] || "";
        requirementText += `\nUpper Specification: ${upper}`;
      } else if (tolType === "Unilateral Lower") {
        const lower = values[`req-lower-${index}`] || "";
        requirementText += `\nLower Specification: ${lower}`;
      } else if (tolType === "Basic Dimension") {
        const basic = values[`req-basic-${index}`] || "";
        requirementText += `\nBasic Value: ${basic}`;
      } else if (tolType === "Range Inclusive") {
        const rangeUp = values[`req-range-up-${index}`] || "";
        const rangeLow = values[`req-range-low-${index}`] || "";
        requirementText += `\nUpper Specification: ${rangeUp}`;
        requirementText += `\nLower Specification: ${rangeLow}`;
      }

      // **FIXED:** Add units after all tolerance text and before the GD&T text/snapshot
      if (units) {
          requirementText += `\nUnits: ${units}`;
      }
      
      const gdt = values[`req-gdt-${index}`];
      let gdtText = "";
      if (typeof gdt === "string" && !gdt.startsWith("data:image/")) {
        gdtText = gdt;
      } else if (gdt?.text) {
        gdtText = gdt.text;
      }
      if (gdtText) {
        requirementText += `\nGD&T: ${gdtText}`;
      }
      
      let hasImage = false;
      let gdtSnapshot = null;
      let gdtImageHeight = 20;

      if (gdt?.snapshot) {
        hasImage = true;
        gdtSnapshot = gdt.snapshot;
      }

      const designator = extraField[`${index}-2`] || "";

        const charNo1 = values[`cell-char-${index}`] || "";
        const charNo2 = values[`cell-bubble-${index}`] || ""; // <-- This is the correct key
        const charNoCombined = charNo2 ? `${charNo1}#${charNo2}` : charNo1;

const textLines = [
  doc.splitTextToSize(charNoCombined, colWidths[0] - 2), // Now uses the combined string
  doc.splitTextToSize(values[`cell-${index}-1`] || "", colWidths[1] - 2),
  doc.splitTextToSize(designator, colWidths[2] - 2),
  doc.splitTextToSize(requirementText, colWidths[3] - 2),
  doc.splitTextToSize(results, colWidths[4] - 2),
  doc.splitTextToSize(values[`cell-${index}-5`] || "", colWidths[5] - 2),
  doc.splitTextToSize(values[`cell-${index}-6`] || "", colWidths[6] - 2),
  doc.splitTextToSize(values[`cell-${index}-7`] || "", colWidths[7] - 2),
];
      
      const cellHeights = textLines.map((lines) => lines.length * 4.5);
      
      let requirementCellHeight = cellHeights[3];
      if (hasImage) {
        let tempImg = new Image();
        tempImg.src = gdtSnapshot;
        const aspectRatio = tempImg.height / tempImg.width;
        let imgWidth = colWidths[3] - 4;
        gdtImageHeight = imgWidth * aspectRatio;
        requirementCellHeight += gdtImageHeight + 5;
      }
      
      let rowHeight = Math.max(...cellHeights.slice(0, 3), ...cellHeights.slice(4), requirementCellHeight, 20);
      
      if (yPos + rowHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;

        // re-draw headers
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        let currentX = margin;
        headers.forEach((header, i) => {
          doc.rect(currentX, yPos, colWidths[i], headerHeight);
          const headerLines = doc.splitTextToSize(header, colWidths[i] - 2);
          const headerYOffset = (headerHeight - headerLines.length * 3.5) / 2;
          doc.text(headerLines, currentX + 1, yPos + 4 + headerYOffset);
          currentX += colWidths[i];
        });
        yPos += headerHeight;
        doc.setFont("helvetica", "normal");
      }

      // Draw row
      let currentX = margin;
      textLines.forEach((lines, i) => {
        doc.rect(currentX, yPos, colWidths[i], rowHeight);
        
        const textHeight = lines.length * 4.5;
        const verticalOffset = (rowHeight - textHeight) / 2;
        
        if (i === 3) {
           doc.text(lines, currentX + 1, yPos + 4);
        } else {
           doc.text(lines, currentX + 1, yPos + verticalOffset + 4);
        }

        currentX += colWidths[i];
      });

      if (hasImage) {
        const requirementCellX = margin + colWidths[0] + colWidths[1] + colWidths[2];
        const textHeightInCell = textLines[3].length * 4.5;
        const textYPos = yPos;
        
        try {
          let tempImg = new Image();
          tempImg.src = gdtSnapshot;
          const aspectRatio = tempImg.height / tempImg.width;
          let imgWidth = colWidths[3] - 4;
          let imgHeight = imgWidth * aspectRatio;

          doc.addImage(
            gdtSnapshot,
            "PNG",
            requirementCellX + 2,
            textYPos + textHeightInCell + 4,
            imgWidth,
            imgHeight
          );
        } catch (e) {
          doc.text("Image load error", requirementCellX + 2, textYPos + textHeightInCell + 10);
        }
      }

      yPos += rowHeight;
    });

    yPos += 5;
  };
  drawTable();

  // ---------- Save ----------
  doc.save("Form3_FAIR.pdf");
};
  

  const generateExcel = () => {
        const form1Data = [
          ["Form 1"],
          ["Field", "Value"],
          ["Part Number", values["top-0"] || ""],
          ["Part Name", values["top-1"] || ""],
          ["Serial Number", values["top-2"] || ""],
          ["FAIR ID", values["top-3"] || ""],
        ];
    
        const form3HeaderRow1 = [
          "Char. No.",
          "Reference Location",
          "Characteristic Designator",
          "Requirement",
          "",
          "",
          "",
          "Bonus Tolerance",
          "Results",
          "Designed / Qualified Tooling",
          "Nonconformance Number",
          "Comments",
        ];
    
        const form3HeaderRow2 = [
          "",
          "",
          "",
          "Description / Note text",
          "Specification",
          "GD&T Callout",
          "Unit of measurement",
          "",
          "",
          "",
          "",
          "",
        ];
    
        const form3Data = [
          ["Form 3 - Characteristic Accountability, Verification and Compatibility Evaluation"],
          form3HeaderRow1,
          form3HeaderRow2,
          ...rows.map((_, index) => {
            let results = resultsValue[index] || "";
            if (resultsValue[index] === "Attribute" || resultsValue[index] === "Variable") {
              results = secondaryResults[index] || "";
            }
    
            // Correctly retrieve the dropdown values based on the console output
            const characteristicDesignator = values[`cell-desig-${index}`] || ""; // Assuming this key for designator
            const specification = values[`req-tol-${index}`] || ""; 
            const unit = values[`req-units-${index}`] || "";
    
            // Specification handling and GD&T
            if (specification === "Tolerance") {
              const plusTolerance = values[`req-plus-tol-${index}`] || "";
              const minusTolerance = values[`req-minus-tol-${index}`] || "";
              results = `+${plusTolerance} / -${minusTolerance}`;
            } else if (specification === "Units") {
              results = values[`req-units-${index}`] || "";
            }
            
            let gdtText = "";
            const gdtValue = values[`req-gdt-${index}`];
            if (typeof gdtValue === "object" && gdtValue.text) {
              gdtText = gdtValue.text;
            } else if (typeof gdtValue === "string") {
              gdtText = gdtValue;
            }
    
            const bonusTolerance = values[`req-bonus-${index}`] || "";
            const charNo1 = values[`cell-char-${index}`] || "";
            const charNo2 = values[`cell-bubble-${index}`] || "";
            const combinedCharNo = charNo2 ? `${charNo1}#${charNo2}` : charNo1;
    
            return [
              combinedCharNo,
              values[`cell-${index}-1`] || "", 
              characteristicDesignator, 
              values[`req-desc-${index}`] || "", 
              specification, 
              gdtText, 
              unit, 
              bonusTolerance, 
              results, 
              values[`cell-${index}-5`] || "", 
              values[`cell-${index}-6`] || "", 
              values[`cell-${index}-7`] || ""
            ];
          })
        ];
    
        const wb = XLSX.utils.book_new();
        const form1Sheet = XLSX.utils.aoa_to_sheet(form1Data);
        const form3Sheet = XLSX.utils.aoa_to_sheet(form3Data);
    
        if (!form3Sheet["!merges"]) form3Sheet["!merges"] = [];
        form3Sheet["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } });
    
        form3Sheet["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 2, c: 0 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 1 }, e: { r: 2, c: 1 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 2 }, e: { r: 2, c: 2 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 3 }, e: { r: 1, c: 6 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 7 }, e: { r: 2, c: 7 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 8 }, e: { r: 2, c: 8 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 9 }, e: { r: 2, c: 9 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 10 }, e: { r: 2, c: 10 } });
        form3Sheet["!merges"].push({ s: { r: 1, c: 11 }, e: { r: 2, c: 11 } });
    
        XLSX.utils.book_append_sheet(wb, form1Sheet, "Form 1");
        XLSX.utils.book_append_sheet(wb, form3Sheet, "Form 3");
    
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Form3_FAIR.xlsx");
    };
    

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh', color: 'black' }}>
      <Typography variant="h6" gutterBottom>
        Form 3: Characteristic Accountability, Verification and Compatibility Evaluation
      </Typography>
      <Box mb={3}>
  <Typography variant="h6" gutterBottom>
    Upload IPS
  </Typography>
  <Button
    variant="outlined"
    component="label"
    disabled={ipsLoading}
    sx={{ mb: 2 }}
  >
    {ipsLoading ? "Processing..." : "Upload IPS"}
    <input type="file" hidden onChange={handleIpsUpload} accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.xlsm,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
  </Button>
</Box>

{ipsFile && (
  <Box mt={2}>
    <Typography
      variant="body2"
      sx={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
      onClick={() => window.open(URL.createObjectURL(ipsFile), "_blank")}
    >
      {ipsFile.name}
    </Typography>
  </Box>
)}
<Dialog open={ipsLoading}>
  <DialogContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <CircularProgress /> 
    <Typography>Extracting IPS data...</Typography>
  </DialogContent>
</Dialog>




      <Box mb={3} display="flex" flexWrap="wrap" gap={2}>
        {['1.Part Number', '2.Part Name', '3.Serial Number', '4.FAIR Identifier'].map((label, index) => (
          <Box key={index} sx={{ width: 220 }}>
            <SmartTextField
              label={label}
              name={`top-${index}`}
              formData={values[`top-${index}`] || ''}
              setField={handleCellChange}
            />
          </Box>
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'white', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'auto' }}>
        <TableHead>
  <TableRow>
    {[
      '5.Char. No.', '6.Reference Location', '7.Characteristic Designator',
      '8.Requirement', '9.Results', '10.Designed / Qualified Tooling',
      '11.Nonconformance Number', '12.Additional Data / Comments'
    ].map((header, i) => {
      if (header === '8.Requirement') {
        return (
          <TableCell
            key={i}
            sx={{
              color: 'black',
              fontWeight: 'bold',
              border: '1px solid #ddd',
              width: "400px",
              minWidth: "900px",
              textAlign: "center"
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {header}
            </Typography>
          </TableCell>
        );
      }

      if (header === '5.Char. No.') {
        return (
          <TableCell
            key={i}
            sx={{
              color: 'black',
              fontWeight: 'bold',
              border: '1px solid #ddd',
              width: "250px",    // ✅ wider than default
              minWidth: "70px", // ✅ ensures space even on smaller screens
              textAlign: "center"
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {header}
            </Typography>
          </TableCell>
        );
      }
      if (header === '6.Reference Location') {
        return (
          <TableCell
            key={i}
            sx={{
              color: 'black',
              fontWeight: 'bold',
              border: '1px solid #ddd',
              width: "250px",    // ✅ wider than default
              minWidth: "100px", // ✅ ensures space even on smaller screens
              textAlign: "center"
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {header}
            </Typography>
          </TableCell>
        );
      }
      if (
        header === '10.Designed / Qualified Tooling' ||
        header === '11.Nonconformance Number' ||
        header === '12.Additional Data / Comments'
      ) {
        return (
          <TableCell
            key={i}
            sx={{
              color: 'black',
              fontWeight: 'bold',
              border: '1px solid #ddd',
              width: "100px",   // ✅ you can tweak
              minWidth: "85px", // ✅ ensures readability
              textAlign: "center"
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {header}
            </Typography>
          </TableCell>
        );
      }
      
      return (
        <TableCell
          key={i}
          sx={{ color: 'black', fontWeight: 'bold', border: '1px solid #ddd' }}
        >
          {header}
        </TableCell>
      );
    })}
  </TableRow>

</TableHead>


          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                {Array(8).fill().map((_, colIndex) => {
                  const renderCell = () => {
                    if (colIndex === 0) { 
                        return (
                           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                             <SmartTextField
                                label="Operation No."
                                name={`cell-char-${rowIndex}`}
                                formData={values[`cell-char-${rowIndex}`] || ''} 
                                setField={handleCellChange}
                             />
                             <SmartTextField
                                 label="Baloon No"
                                 name={`cell-bubble-${rowIndex}`}
                                 formData={values[`cell-bubble-${rowIndex}`] || ''}
                                 setField={handleCellChange}
                             />
                           </Box>
                        );
                    }
                    if (colIndex === 2) {
                      return (
                        <FormControl fullWidth size="small">
                          <Select
                            value={extraField[`${rowIndex}-2`] || ''}
                            onChange={(e) => setExtraField(prev => ({
                              ...prev,
                              [`${rowIndex}-2`]: e.target.value
                            }))}
                            sx={{
                              color: 'black',
                              '.MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                              '.MuiSvgIcon-root': { color: 'black' }
                            }}
                          >
                            {['Minor', 'Note', 'Significant', 'Critical'].map(opt => (
                              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    }
                    if (colIndex === 3) {
                      return (
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2.5fr 0.8fr", // ✅ wider Specification, smaller Units
                            border: "1px solid #ddd",
                            "& > div": {
                              borderRight: "1px solid #ddd",
                              padding: 1,
                            },
                            "& > div:last-child": { borderRight: "none" },
                          }}
                        >
                          {/* Description */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold", display: "block", mb: 0.5, textAlign: "center",width: "100px",
                                minWidth: "100px", }}
                            >
                              Description
                            </Typography>
                            <SmartTextField
                              label=""
                              name={`req-desc-${rowIndex}`}
                              formData={values[`req-desc-${rowIndex}`] || ""}
                              setField={handleCellChange}
                              multiline
                              rows={3}
                            />
                          </Box>
                    
                          {/* Specification */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold", display: "block", mb: 0.5, textAlign: "center" }}
                            >
                              Specification
                            </Typography>
                    
                            <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                              <Select
                                value={values[`req-tol-${rowIndex}`] || ""}
                                onChange={(e) => handleCellChange(`req-tol-${rowIndex}`, e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value="">Tolerance Type</MenuItem>
                                <MenuItem value="Symmetrical">Symmetrical</MenuItem>
                                <MenuItem value="Bilateral">Bilateral</MenuItem>
                                <MenuItem value="Unilateral Upper">Unilateral Upper</MenuItem>
                                <MenuItem value="Unilateral Lower">Unilateral Lower</MenuItem>
                                <MenuItem value="Basic Dimension">Basic Dimension</MenuItem>
                                <MenuItem value="Range Inclusive">Range Inclusive</MenuItem>
                              </Select>
                            </FormControl>
                    
                            {/* Conditional fields */}
                            {values[`req-tol-${rowIndex}`] === "Symmetrical" && (
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <SmartTextField
                                  label="Nominal"
                                  name={`req-sym-nom-${rowIndex}`}
                                  formData={values[`req-sym-nom-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                                <SmartTextField
                                  label="High/Low Tol"
                                  name={`req-sym-tol-${rowIndex}`}
                                  formData={values[`req-sym-tol-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                              </Box>
                            )}
                    
                            {values[`req-tol-${rowIndex}`] === "Bilateral" && (
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <SmartTextField
                                  label="Nominal"
                                  name={`req-bilat-nom-${rowIndex}`}
                                  formData={values[`req-bilat-nom-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                                <SmartTextField
                                  label="High Tol"
                                  name={`req-bilat-high-${rowIndex}`}
                                  formData={values[`req-bilat-high-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                                <SmartTextField
                                  label="Low Tol"
                                  name={`req-bilat-low-${rowIndex}`}
                                  formData={values[`req-bilat-low-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                              </Box>
                            )}
                    
                            {values[`req-tol-${rowIndex}`] === "Unilateral Upper" && (
                              <SmartTextField
                                label="Upper Specification"
                                name={`req-upper-${rowIndex}`}
                                formData={values[`req-upper-${rowIndex}`] || ""}
                                setField={handleCellChange}
                              />
                            )}
                    
                            {values[`req-tol-${rowIndex}`] === "Unilateral Lower" && (
                              <SmartTextField
                                label="Lower Specification"
                                name={`req-lower-${rowIndex}`}
                                formData={values[`req-lower-${rowIndex}`] || ""}
                                setField={handleCellChange}
                              />
                            )}
                    
                            {values[`req-tol-${rowIndex}`] === "Basic Dimension" && (
                              <SmartTextField
                                label="Basic Value"
                                name={`req-basic-${rowIndex}`}
                                formData={values[`req-basic-${rowIndex}`] || ""}
                                setField={handleCellChange}
                              />
                            )}
                    
                            {values[`req-tol-${rowIndex}`] === "Range Inclusive" && (
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <SmartTextField
                                  label="Upper Specification"
                                  name={`req-range-up-${rowIndex}`}
                                  formData={values[`req-range-up-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                                <SmartTextField
                                  label="Lower Specification"
                                  name={`req-range-low-${rowIndex}`}
                                  formData={values[`req-range-low-${rowIndex}`] || ""}
                                  setField={handleCellChange}
                                />
                              </Box>
                            )}
                    
                            {/* GD&T Callout always visible */}
                            <SmartTextField
                              label="GD&T Callout"
                              
                              name={`req-gdt-${rowIndex}`}
                              formData={values[`req-gdt-${rowIndex}`] || ""}
                              setField={handleCellChange}
                              allowSnapshot // ✅ extra flag
                              sx={{ mt: 1 }}
                            />
                          </Box>
                    
                          {/* Units */}
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold", display: "block", mb: 0.5, textAlign: "center" }}
                            >
                              Units
                            </Typography>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={values[`req-units-${rowIndex}`] || ""}
                                onChange={(e) => handleCellChange(`req-units-${rowIndex}`, e.target.value)}
                                displayEmpty
                              >
                                <MenuItem value="">Units</MenuItem>
                                <MenuItem value="mm">mm</MenuItem>
                                <MenuItem value="in">in</MenuItem>
                                <MenuItem value="cm">cm</MenuItem>
                                <MenuItem value="deg">deg</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      );
                    }
                    
                    
                    
                    if (colIndex === 4) {
                      const mainDropdown = (
                        <FormControl fullWidth size="small">
                          <Select
                            value={resultsValue[rowIndex] || ''}
                            onChange={(e) => handleResultsChange(rowIndex, e.target.value)}
                            sx={{
                              color: 'black',
                              '.MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                              '.MuiSvgIcon-root': { color: 'black' }
                            }}
                          >
                            <MenuItem value="">- Select -</MenuItem>
                            <MenuItem value="Variable">Variable</MenuItem>
                            <MenuItem value="Attribute">Attribute</MenuItem>
                            <MenuItem value="Not Reportable">Not Reportable</MenuItem>
                          </Select>
                        </FormControl>
                      );

                      if (resultsValue[rowIndex] === 'Attribute') {
                        return (
                          <Box>
                            {mainDropdown}
                            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                               <InputLabel id={`attribute-label-${rowIndex}`}>Pass/Fail</InputLabel>
                                <Select
                                  labelId={`attribute-label-${rowIndex}`}
                                  value={secondaryResults[rowIndex] || ''}
                                  onChange={(e) => handleSecondaryResultsChange(rowIndex, e.target.value)}
                                  label="Pass/Fail"
                                  sx={{
                                    color: 'black',
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                                    '.MuiSvgIcon-root': { color: 'black' }
                                  }}
                                >
                                  <MenuItem value="Pass">Pass</MenuItem>
                                  <MenuItem value="Fail">Fail</MenuItem>
                                </Select>
                            </FormControl>
                          </Box>
                        );
                      } else if (resultsValue[rowIndex] === 'Variable') {
                        return (
                          <Box>
                            {mainDropdown}
                            <Box sx={{ mt: 1 }}>
                               <SmartTextField
                                 label="Enter Value"
                                 name={`secondary-result-${rowIndex}`}
                                 formData={secondaryResults[rowIndex] || ''}
                                 setField={(name, value) => handleSecondaryResultsChange(rowIndex, value)}
                                 size="small"
                                 sx={{
                                   '.MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' }
                                 }}
                               />
                            </Box>
                          </Box>
                        );
                      } else {
                        return mainDropdown;
                      }
                    }

                    return (
                      <SmartTextField
                        label=""
                        name={`cell-${rowIndex}-${colIndex}`}
                        formData={values[`cell-${rowIndex}-${colIndex}`] || ''}
                        setField={handleCellChange}
                        multiline={colIndex === 0 || colIndex === 1 || colIndex === 5 || colIndex === 6 || colIndex === 7}
    rows={colIndex === 7 ? 3 : 2} // Comments field taller
                      />
                    );
                  };

                  return (
                    <TableCell key={colIndex} sx={{ border: '1px solid #ddd' }}>
                      {renderCell()}
                    </TableCell>
                  );
                })}
                <TableCell sx={{ border: '1px solid #ddd', textAlign: 'center' }}>
                  {rowIndex === rows.length - 1 && (
                    <IconButton onClick={addRow} size="small" sx={{ color: 'black' }}>
                      <AddIcon />
                    </IconButton>
                  )}
                  
   
   
   <IconButton onClick={() => deleteRow(rowIndex)} size="small" sx={{ color: 'red' }}>
     <DeleteIcon />
   </IconButton>
 
                </TableCell>
              </TableRow>
            ))}
            <div ref={rowsEndRef} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          onClick={generateExcel}
          sx={{
            backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
          }}
        >
          Download
        </Button>
        
      <Button
  variant="outlined"
  onClick={handlePdfExport}
  sx={{
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': { backgroundColor: '#1565c0' },
  }}
>
  Download PDF
</Button>

<Button 
  variant="contained" 
  color="primary" 
  onClick={() => performAction("save")}
  sx={{ mr: 2 }}
>
  Save
</Button>



   <Button
     variant="outlined"
     onClick={goToForm2}
     sx={{
      backgroundColor: '#fff',
      color: '#1976d2',
      borderColor: '#1976d2',
      '&:hover': {
        backgroundColor: '#e3f2fd',
      },
     }}
   >
     Go to Form 2
   </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}