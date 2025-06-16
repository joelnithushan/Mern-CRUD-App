import React from "react";
import Nav from "../Nav/Nav";
import 'bootstrap/dist/css/bootstrap.min.css';


function Home() {
  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div className="text-center">
          <h1 className="display-4 mb-3 text-primary">Welcome to Your MERN App</h1>
          <p className="lead mb-4">
            This is a modern MERN stack application. Easily manage users, upload PDFs and images, and explore more features!
          </p>
          <div className="d-flex justify-content-center gap-3 mb-5">
            <a href="/userdetails" className="btn btn-primary btn-lg">
              View Users
            </a>
            <a href="/adduser" className="btn btn-outline-primary btn-lg">
              Add User
            </a>
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">User Management</h5>
                <p className="card-text">
                  Add, update, and delete users. View all users in a responsive table.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Image Upload</h5>
                <p className="card-text">
                  Upload and view images instantly. All uploads are securely stored and displayed in a gallery.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">PDF Upload & Viewer</h5>
                <p className="card-text">
                  Upload PDF documents and view them directly in the browser with a modern PDF viewer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
