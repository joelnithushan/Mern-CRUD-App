import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PdfComp({ pdfFile }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onDocumentLoadError(error) {
    toast.error(`Error loading PDF: ${error.message}`);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  return (
    <div className="mt-4">
      {pdfFile ? (
        <div className="card shadow-sm p-3">
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
          <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
            <button
              className="btn btn-outline-primary btn-sm"
              disabled={pageNumber <= 1}
              onClick={() => changePage(-1)}
            >
              Prev
            </button>
            <span>
              Page <strong>{pageNumber}</strong> of <strong>{numPages}</strong>
            </span>
            <button
              className="btn btn-outline-primary btn-sm"
              disabled={pageNumber >= numPages}
              onClick={() => changePage(1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-muted">PDF File Not Available</p>
      )}
    </div>
  );
}

export default PdfComp;
