import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isSignedIn } from "../user/backendManager";
import { createContact } from "./backendManager/contactApiCalls";

import "./contact.css";

const CreateContact = () => {
  const [contactDetail, setContactDetail] = useState({
    petname: "",
    actualUsername: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, token } = isSignedIn();
  const { petname, actualUsername } = contactDetail;

  let chatContainer = document.getElementById("chatContainer");
  let sendContainer = document.getElementById("sendContainer");

  useEffect(() => {
    chatContainer.style.display = "none";
    sendContainer.style.display = "none";
  }, []);

  const changeHandler = (property) => (event) => {
    setContactDetail({ ...contactDetail, [property]: event.target.value });
  };

  const createContactHelper = (event) => {
    event.preventDefault();
    createContact(user._id, token, petname, actualUsername).then((data) => {
      if (data.error) {
        setSuccess("");
        setError(data.error);
      } else {
        setError("");
        setSuccess(data);
        setContactDetail({ petname: "", actualUsername: "" });
      }
    });
  };

  const successMessage = () => {
    return (
      <div style={{ backgroundColor: "#16e516", padding: "10px, 0px" }}>
        <p
          style={{
            display: success ? "" : "none",
            textAlign: "center",
          }}
        >
          Contact saved successfully
        </p>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div style={{ backgroundColor: "#ff3d3d", padding: "10px, 0px" }}>
        <p
          style={{
            display: error ? "" : "none",
            textAlign: "center",
          }}
        >
          {error}
        </p>
      </div>
    );
  };

  const createContactForm = () => {
    return (
      <div className="outerForm">
        <div className="adjust">
          <div>
            <h1>Contacts</h1>
            <h3>Add new contact</h3>
          </div>
          <form autoComplete="off" className="authForm">
            <label for="petname">Pet-Name</label>
            <input
              id="petname"
              className="formInput"
              placeholder="Name you want to save with"
              value={petname}
              onChange={changeHandler("petname")}
              autoFocus
            />
            <label for="actualusername">Actual Username</label>
            <input
              id="actualusername"
              className="formInput"
              placeholder="Actual username of contact"
              value={actualUsername}
              onChange={changeHandler("actualUsername")}
            />

            <div>
              <button
                onClick={createContactHelper}
                className="button"
                style={{ margin: "50px 40px" }}
              >
                Add to contacts
              </button>
              <Link to="/contacts">
                <button className="button" style={{ margin: "50px 40px" }}>
                  Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>
        {successMessage()}
        {errorMessage()}
        {createContactForm()}
      </div>
    </div>
  );
};

export default CreateContact;
