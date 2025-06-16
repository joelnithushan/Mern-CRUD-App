import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import Nav from "../Nav/Nav";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Contactus() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_67h1dxi", "template_i2ndkkh", form.current, {
        publicKey: "BcMVBsp7s1umTajUK",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          toast.success("Message Sent Successfully");
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error("Message Sending Failed");
        }
      );
  };

  return (
    <>
      <Nav />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4 text-primary">Contact Us</h2>
                <form ref={form} onSubmit={sendEmail}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" name="user_name" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="user_email" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea name="message" className="form-control" rows={4} required />
                  </div>
                  <div className="d-grid">
                    <input type="submit" value="Send" className="btn btn-primary" />
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

export default Contactus;
