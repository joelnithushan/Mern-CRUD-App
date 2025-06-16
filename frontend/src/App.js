import './App.css';
import Home from "./Components/Home/Home";
import { Routes, Route } from 'react-router-dom';
import AddUser from "./Components/AddUser/AddUser";
import Users from "./Components/UserDetails/Users";
import React from 'react';
import UpdateUser from "./Components/UpdateUser/UpdateUser";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Contactus from "./Components/Contactus/Contactus";
import Imguploder from './Components/Imguploder/Imguploder';
import SendPdf from './Components/SendPdf/SendPdf';
import { ToastContainer } from 'react-toastify'; // <-- Add this import
import 'react-toastify/dist/ReactToastify.css';  // <-- Add this import

function App() {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/mainhome' element={<Home />} />
        <Route path='/adduser' element={<AddUser />} />
        <Route path='/userdetails' element={<Users />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contactus' element={<Contactus />} />
        <Route path='/sendpdf' element={<SendPdf />} />
        <Route path='/imgpart' element={<Imguploder />} />
        <Route path='/userdetails/:id' element={<UpdateUser />} />
      </Routes>
    </div>
  );
}

export default App;
