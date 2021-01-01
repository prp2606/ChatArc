const { check, validationResult } = require("express-validator");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const user = require("../Models/user");

exports.signup = (req, res) => {
  // Validation check
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      field: errors.array()[0].param,
    });
  }

  // Saving user to database
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Unable to save user in Database",
      });
    }
    res.json({
      message: `You are successfully signed up ${user.username}`,
    });
  });
};

exports.signin = (req, res) => {
  const { username, password } = req.body;

  //   Validation check
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      field: errors.array()[0].param,
    });
  }

  User.findOne({ username }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user with such username is registered!",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Username or password dosen't match",
      });
    }

    // Creating token for user if signed in, on pasis of SECRET string
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // Put token in user's browser cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, username, email } = user;

    return res.json({
      token,
      message: "Welcome! You are signed in successfully",
      user: { _id, username, email },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  res.json({
    message: "User signed out successfully!!!",
  });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// Custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.userInfo && req.auth && req.userInfo._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "ACESS DENIED",
    });
  }
  next();
};
