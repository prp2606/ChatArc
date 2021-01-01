const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();

const {
  isSignedIn,
  isAuthenticated,
} = require("../Controllers/authentication");

const {
  getUserById,
  updateMe,
  deleteMe,
  getUserContacts,
  createContact,
  deleteContact,
  getParticularContactByUsername,
  getPetnameByActualUser,
  getUser,
  getContactName,
} = require("../Controllers/user");

// Parameter Extracters
router.param("userId", getUserById);

// Test route
// router.get("/user/:userId/:contactId", getContactName);

// User Operations
router.get("/user/:userId", getUser);
router.put("/user/:userId/update", isSignedIn, updateMe);
router.delete("/user/:userId/delete", isSignedIn, deleteMe);

// Contact CRUD Operations
router.get("/user/:userId/contacts", isSignedIn, getUserContacts);
router.post("/user/:userId/getContact", isSignedIn, getPetnameByActualUser);
router.post(
  "/user/:userId/createContact",
  bodyParser.text(),
  isSignedIn,
  createContact
);
// router.put("/user/:userId/updateContact", isSignedIn, updateContact);
router.delete(
  "/user/:userId/deleteContact",
  bodyParser.text(),
  isSignedIn,
  deleteContact
);

module.exports = router;
