import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isSignedIn } from "../user/backendManager";
import {
  deleteChat,
  getContactName,
  getConversation,
  initiateConversation,
  startChating,
} from "./backendManager/conversationApiCalls";

import io from "socket.io-client";
import "./conversation.css";

const audio = new Audio("ding.mp3");

const Conversations = ({ match }) => {
  const [conversation, setConversation] = useState([]);

  const { user, token } = isSignedIn();

  const ENDPOINT = "localhost:9000";
  let socket;

  let chatPage = document.getElementsByClassName("chatPage");
  let chatContainer = document.getElementById("chatContainer");
  let sendContainer = document.getElementById("sendContainer");
  let msg = document.getElementById("msg");
  let thiss = "THIS";

  // Socket IO client connections
  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("joined", user._id);

    return () => {
      socket.off();
    };
  }, [ENDPOINT]);

  // Socket IO Real time chating implementation
  useEffect(() => {
    chatPage[0].style.display = "block";
    sendContainer.style.display = "block";

    sendContainer.addEventListener("submit", (event) => {
      event.preventDefault();

      if (msg.value) {
        let message = document.createElement("div");
        message.classList.add("right");
        message.classList.add("message");
        message.innerText = msg.value;
        chatContainer.appendChild(message);

        chatingPreload(match.params.actualUser, msg.value);

        socket.emit("sendMessage", {
          messageBody: msg.value,
          to: match.params.actualUser,
        });
      }

      msg.value = "";
    });

    socket.on("recieveMessage", (messageBody) => {
      console.log("message recieved at client", messageBody);

      audio.play();

      let message = document.createElement("div");
      message.classList.add("left");
      message.classList.add("message");
      message.innerText = messageBody;

      chatContainer.appendChild(message);
    });
  }, [thiss]);

  const initiateConversationHelper = (actualUser) => {
    initiateConversation(user._id, token, actualUser).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        document.getElementById("ichat").style.display = "none";
      }
    });
  };

  const deleteChatHelper = () => {
    let confirm = prompt("Are you sure? [YES/NO]");

    if (confirm) {
      deleteChat(user._id, token, match.params.actualUser).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          chatingPreload(
            match.params.actualUser,
            "Previous conversations are deleted"
          );

          let message = document.createElement("div");
          message.classList.add("right");
          message.classList.add("message");
          message.innerText =
            "Previous conversations are deleted! Refresh to see changes";

          chatContainer.appendChild(message);
        }
      });
    } else {
      alert("Action terminated");
    }
  };

  const preload = (actualUser) => {
    getConversation(user._id, token, actualUser).then((data) => {
      if (data.error) {
        let initiateChatButton = document.createElement("button");
        initiateChatButton.id = "ichat";
        initiateChatButton.innerText = "Initiate Chat";
        initiateChatButton.onclick = initiateConversationHelper(actualUser);

        chatContainer.appendChild(initiateChatButton);
        console.log(data.error);
      } else {
        setConversation(data);
      }
    });
  };

  useEffect(() => {
    preload(match.params.actualUser);
  }, []);

  const chatingPreload = (actualUser, messageBody) => {
    startChating(user._id, token, actualUser, messageBody).then((data) => {
      if (data.error) {
        console.log(data.error);
      }
    });
  };

  return (
    <div>
      <div className="actionButtons">
        <Link to="/contacts">
          <button
            onClick={() => {
              chatContainer.innerText = "";
              chatContainer.innerHTMLs = "";
              chatContainer.style.display = "none";

              sendContainer.style.display = "none";
            }}
            className="button"
          >
            Back
          </button>
        </Link>
        <button onClick={deleteChatHelper} className="button">
          Delete Chat
        </button>
      </div>
      <div className="chatPage">
        <div id="chatContainer">
          {conversation &&
            conversation.map((message, index) => {
              let className = message.from === user._id ? "right" : "left";
              className += " message";
              return (
                <div key={index} className={className}>
                  {message.messageBody}
                </div>
              );
            })}
        </div>
        <p className="previous">PREVIOUS CHATS</p>
      </div>
    </div>
  );
};

export default Conversations;
