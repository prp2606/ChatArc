const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { signup, signin, signout } = require("../Controllers/authentication");

router.post(
  "/signup",
  [
    check("username")
      .isLength({ min: 5 })
      .withMessage("Username should be of at least 5 characters"),

    check("email").isEmail().withMessage("Enter a valid Email"),

    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should me of at least 5 characters"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("username")
      .isLength({ min: 5 })
      .withMessage("Username should be of at least 5 characters"),

    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should be of atleast 5 characters"),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
