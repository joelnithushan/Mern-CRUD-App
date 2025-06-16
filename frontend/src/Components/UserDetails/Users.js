import React, { useEffect, useState, useRef } from "react";
import Nav from "../Nav/Nav";
import axios from "axios";
import User from "../User/User";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const URL = "http://localhost:5000/users";

// Fetch all users from backend
const fetchHandler = async () => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch users");
  }
};

function Users() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);

  // For react-to-print v2.x and v3.x (works for both)
  const componentRef = useRef(null);

  useEffect(() => {
    fetchHandler()
      .then((data) => {
        setUsers(data.users || []);
        setAllUsers(data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        toast.error(err.message);
      });
  }, []);

  // Remove user from UI after delete
  const handleUserDelete = (deletedId) => {
    setUsers((prev) => prev.filter((u) => u._id !== deletedId));
    setAllUsers((prev) => prev.filter((u) => u._id !== deletedId));
    
  };

  // Print handler: works for react-to-print v2.x and v3.x
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Users Report",
    onAfterPrint: () => toast.info("Print Report Successfully Downloaded"),
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setUsers(allUsers);
      setNoResults(false);
      return;
    }
    const filtered = allUsers.filter((user) =>
      Object.values(user).some((field) =>
        (typeof field === "string" || typeof field === "number") &&
        field
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
    setUsers(filtered);
    setNoResults(filtered.length === 0);
  };

  const handleReset = () => {
    setUsers(allUsers);
    setSearchQuery("");
    setNoResults(false);
  };

  const handleSendReport = () => {
    const phoneNumber = "+94769423167";
    const message = 'Select the user report from here';
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    toast.info("WhatsApp message window opened");
  };

  return (
    <>
      <Nav />
      <div className="container mt-4">
        <h1 className="mb-4  text-center" style={{color:"black"}}>User Details Display Page</h1>
        <div className="row mb-3 justify-content-center">
          <div className="col-md-6">
            <div className="input-group">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                type="text"
                name="search"
                className="form-control"
                placeholder="Search by Name, Email, Age or Address"
                disabled={loading}
              />
              <button className="btn btn-primary" style={{backgroundColor:"black",color:"white"}} onClick={handleSearch} disabled={loading}>
                Search
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleReset}
                disabled={loading || (!searchQuery && users.length === allUsers.length)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="mb-3 d-flex justify-content-center gap-2">
          <button className="btn btn-success" onClick={handlePrint} disabled={!users.length}>
            Download Report
          </button>
          <button className="btn btn-info" onClick={handleSendReport} disabled={!users.length}>
            Send Whatsapp Message
          </button>
        </div>
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3">Loading users...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : noResults ? (
          <div className="alert alert-warning text-center">No Users Found</div>
        ) : (
          <div ref={componentRef} className="row" style={{color:"black"}}>
            {users.map((user) => (
              <div key={user._id || user.email} className="col-md-6 col-lg-4 mb-4" >
                <User user={user} onDelete={handleUserDelete} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Users;
