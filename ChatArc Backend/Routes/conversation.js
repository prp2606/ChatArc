const express = require("express");
const router = express.Router();

const { isSignedIn } = require("../Controllers/authentication");

const {
  getUserById,
  getParticularContactByUsername,
} = require("../Controllers/user");

const {
  startChating,
  initiateConversation,
  getConversation,
  deleteChats,
} = require("../Controllers/conversation");

const bodyParser = require("body-parser");

// Parameter Extracters
router.param("userId", getUserById);

// Create new conversation || C - Create
router.post(
  "/user/:userId/newConversation",
  bodyParser.text(),
  isSignedIn,
  initiateConversation
);

// Get existing Conversation || R - Read
router.post(
  "/user/:userId/getConversation",
  bodyParser.text(),
  isSignedIn,
  getConversation
);

// Start chatting in existing conversation || U - Update
router.post(
  "/user/:userId/startChating",
  bodyParser.text(),
  isSignedIn,
  startChating
);

// Delete conversation || D - Delete
router.post(
  "/user/:userId/deleteConversation",
  bodyParser.text(),
  isSignedIn,
  deleteChats
);

module.exports = router;
