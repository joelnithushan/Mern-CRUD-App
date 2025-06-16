import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { pdfjs } from 'react-pdf';
import PdfComp from './PdfComp';
import Nav from '../Nav/Nav';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function SendPdf() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [allPdf, setAllPdf] = useState([]);
  const [pdfFile, setPDFFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getpdf();
  }, []);

  const getpdf = async () => {
    try {
      const result = await axios.get('http://localhost:5000/getFile');
      setAllPdf(result.data.data || []);
    } catch (err) {
      setAllPdf([]);
      toast.error("Error fetching PDFs");
    }
  };

  const submitPdf = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warn('Please enter a PDF title');
      return;
    }
    if (!file) {
      toast.error('Please select a PDF file');
      return;
    }
    if (file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('file', file);

    try {
      const result = await axios.post('http://localhost:5000/uploadfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result.data.status === 200) {
        toast.success('Upload Success');
        setTitle('');
        setFile(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        getpdf();
      } else {
        toast.error(result.data.message || 'Upload Failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error uploading file';
      toast.error(errorMessage);
    }
    setUploading(false);
  };

  const showPdf = (pdf) => {
    setPDFFile(`http://localhost:5000/files/${pdf}`);
  };

  return (
    <>
      <Nav />
      <div className="container mt-4">
        <h1 className="text-primary mb-4">PDF Upload</h1>
        <form className="card p-4 mb-4 shadow" onSubmit={submitPdf}>
          <div className="mb-3">
            <label htmlFor="pdf-title" className="form-label">PDF Title</label>
            <input
              id="pdf-title"
              type="text"
              className="form-control"
              placeholder="Enter PDF Title"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pdf-file" className="form-label">Select PDF File</label>
            <input
              id="pdf-file"
              type="file"
              className="form-control"
              accept="application/pdf"
              required
              onChange={e => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{backgroundColor:"black",color:"white"}} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </form>

        <div>
          <h4>PDF Details</h4>
          {allPdf.length === 0 ? (
            <p>No PDFs uploaded yet.</p>
          ) : (
            allPdf.map((data) => (
              <div key={data._id} className="card mb-2 p-3">
                <h5>Title: {data.title}</h5>
                <button className="btn btn-outline-primary btn-sm" onClick={() => showPdf(data.pdf)}>
                  Show PDF
                </button>
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <PdfComp pdfFile={pdfFile} />
        </div>
      </div>
    </>
  );
}

export default SendPdf;
