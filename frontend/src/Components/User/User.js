import React, { forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Use forwardRef to allow react-to-print to attach a ref if ever needed
const User = forwardRef(({ user, onDelete }, ref) => {
  const { _id, name, email, age, address } = user;
  const navigate = useNavigate();

  const deleteHandler = () => {
    confirmAlert({
      title: "Delete User",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Yes",
          className: "btn btn-danger",
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:5000/users/${_id}`);
              toast.success("User deleted");
              if (onDelete) onDelete(_id); // Remove from UI instantly
            } catch (err) {
              toast.error("Failed to delete user");
            }
          }
        },
        {
          label: "No",
          className: "btn btn-secondary",
          onClick: () => {}
        }
      ]
    });
  };

  return (
    <div ref={ref} className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title text-primary">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">ID: {_id}</h6>
        <p className="card-text mb-1"><strong>Email:</strong> {email}</p>
        <p className="card-text mb-1"><strong>Age:</strong> {age}</p>
        <p className="card-text mb-3"><strong>Address:</strong> {address}</p>
        <Link to={`/userdetails/${_id}`} className="btn btn-outline-primary btn-sm me-2">
          Update
        </Link>
        <button onClick={deleteHandler} className="btn btn-danger btn-sm">
          Delete
        </button>
      </div>
    </div>
  );
});

export default User;
