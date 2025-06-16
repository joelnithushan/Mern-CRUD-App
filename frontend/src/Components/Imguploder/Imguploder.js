import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Imguploder() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const onImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const submitImg = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image to upload.");
      return;
    }

    if (!image.type.startsWith('image/')) {
      toast.error("Please select a valid image file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/uploadImg", formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      });

      toast.success("Image uploaded successfully!");
      setImage(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      getImage();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error uploading image";
      toast.error(errorMessage);
    }

    setUploading(false);
  };

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/getImg");
      setAllImage(result.data.data || []);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error fetching images";
      toast.error(errorMessage);
      setAllImage([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <>
      <Nav />
      <div className="container mt-4">
        <h1 className="mb-4 text-primary">Image Upload</h1>
        <form className="card p-4 mb-4 shadow" onSubmit={submitImg}>
          <div className="mb-3">
            <label htmlFor="img-upload" className="form-label">Select an image:</label>
            <input
              id="img-upload"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={onImgChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{backgroundColor:"black",color:"white"}} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </form>

        <div className="mt-4">
          <h4>Uploaded Images</h4>
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="mt-3">Loading images...</p>
            </div>
          ) : allImage.length === 0 ? (
            <p>No images uploaded yet.</p>
          ) : (
            <div className="row">
              {allImage.map((data) => (
                <div key={data._id} className="col-6 col-md-4 col-lg-3 mb-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`http://localhost:5000/files/${data.image}`}
                      className="card-img-top"
                      height={150}
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                      alt={data.image || 'Uploaded'}
                    />
                    <div className="card-body p-2">
                      <p className="card-text small text-truncate mb-0">{data.image}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Imguploder;
