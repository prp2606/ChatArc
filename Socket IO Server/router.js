const express = require("express");
const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.send("HEllo! I am socket io server side!");
});

module.exports = router;
