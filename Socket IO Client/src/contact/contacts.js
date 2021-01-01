import React, { useEffect, useState } from "react";
import { deleteContact, getContacts } from "./backendManager/contactApiCalls";
import { deleteUser, isSignedIn, signout } from "../user/backendManager/index";
import { Link, Redirect } from "react-router-dom";
import Conversations from "../conversation/conversations";

import "./contact.css";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);

  const { user, token } = isSignedIn();

  let chatContainer = document.getElementById("chatContainer");
  let sendContainer = document.getElementById("sendContainer");

  const preload = () => {
    getContacts(user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setContacts(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  useEffect(() => {
    chatContainer.innerText = "";
    chatContainer.innerHTMLs = "";

    sendContainer.style.display = "none";
  }, []);

  const deleteContactHelper = (event) => {
    event.preventDefault();
    const petNameParent = event.target.parentElement;
    const petName = petNameParent.childNodes;

    const confirm = prompt("Are you sure? [YES/NO]");

    if (confirm === "YES") {
      deleteContact(user._id, token, petName[0].innerText).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          preload();
        }
      });
    } else {
      alert("Action terminated");
    }
  };

  const deleteMeHelper = (event) => {
    event.preventDefault();

    const confirm = prompt("Are you sure? [YES/NO]");

    if (confirm === "YES") {
      deleteUser(user._id, token).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          signout();
          return <Redirect to="/signup" />;
        }
      });
    } else {
      alert("Action terminated");
    }
  };

  return (
    <div className="outerContainer">
      <div className="actionButtons">
        <span
          onClick={() => {
            signout();
          }}
        >
          <Link to="/signin">
            <button className="button">Sign Out</button>
          </Link>
        </span>
        <Link to="/updateProfile">
          <span>
            <button className="button">Update profile</button>
          </span>
        </Link>
        <span onClick={deleteMeHelper}>
          <button className="button">Delete Account</button>
        </span>
      </div>
      <div className="adjust" style={{ margin: "50px auto" }}>
        <div>
          <h1>Contacts</h1>
          <h3>All your contacts appear here</h3>
        </div>
        {contacts.map((contact, index) => {
          return (
            <div key={index} className="contactLine">
              <span>{contact.petName}</span>
              <Link to={`/conversation/${contact.actualUser}`}>
                <span>
                  <button
                    className="button"
                    style={{
                      backgroundColor: "#5252d3",
                    }}
                    onClick={() => {
                      chatContainer.style.display = "none";

                      sendContainer.style.display = "none";
                    }}
                  >
                    Chat
                  </button>
                </span>
              </Link>
              <button
                onClick={deleteContactHelper}
                className="button"
                style={{
                  backgroundColor: "#5252d3",
                }}
              >
                Delete Contact
              </button>
            </div>
          );
        })}
        <Link to="/createContact">
          <button className="button">Create new contact</button>
        </Link>
      </div>
    </div>
  );
};

export default Contacts;
