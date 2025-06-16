import React, { useState } from 'react';
import Nav from '../Nav/Nav';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState, [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/register", user);
      if (res.data.status === "ok") {
        toast.success("User Registered Successfully");
        setUser({ name: "", email: "", password: "" });
        navigate("/userdetails");
      } else {
        setError(res.data.message || "Registration failed");
        toast.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4 " style={{color:"black"}}>User Register</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-control"
                      value={user.name} 
                      onChange={handleChange} 
                      placeholder="Enter Name" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-control"
                      value={user.email} 
                      onChange={handleChange} 
                      placeholder="Enter Email" 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      className="form-control"
                      value={user.password} 
                      onChange={handleChange} 
                      placeholder="Enter Password" 
                      required 
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary" style={{backgroundColor:"black",color:"white"}} disabled={loading}>
                      {loading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
