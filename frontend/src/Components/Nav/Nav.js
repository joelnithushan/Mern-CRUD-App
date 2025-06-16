import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css'; // Import the custom CSS for navbar styling

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/mainhome">
          MERN CURD APP
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/mainhome">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adduser">Add User</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userdetails">User Details</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contactus">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sendpdf">Send PDF</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/imgpart">Photos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
