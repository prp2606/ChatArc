import React, { useState } from "react";
import { signup } from "./backendManager/index";
import { Link } from "react-router-dom";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    error: "",
    success: false,
  });

  const { username, email, password, error, success } = userData;

  const handleChanges = (property) => (event) => {
    setUserData({
      ...userData,
      error: false,
      [property]: event.target.value,
    });
  };

  const talkToBackend = (event) => {
    event.preventDefault();
    setUserData({ ...userData, error: false });
    signup({ username, email, password })
      .then((data) => {
        if (data.error) {
          setUserData({ ...userData, error: data.error, success: false });
        } else {
          setUserData({
            ...userData,
            username: "",
            email: "",
            password: "",
            error: "",
            success: true,
          });
        }
      })
      .catch(console.log("ERROR IN SIGNUP"));
  };

  const successMessage = () => {
    return (
      <div style={{ backgroundColor: "#16e516", padding: "10px, 0px" }}>
        <p style={{ display: success ? "" : "none", textAlign: "center" }}>
          You are successfully signed up. Hope you enjoy ChatArc
        </p>
        <p
          style={{
            display: success ? "" : "none",
            textAlign: "center",
            paddingTop: "0px",
          }}
        >
          Login{" "}
          <Link to="/signin" style={{ color: "#595959" }}>
            here
          </Link>
        </p>
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div style={{ backgroundColor: "#ff3d3d", padding: "10px, 0px" }}>
        <p style={{ display: error ? "" : "none", textAlign: "center" }}>
          {error}
        </p>
      </div>
    );
  };

  const signUpForm = () => {
    return (
      <div className="outerForm">
        <div className="adjust">
          <div>
            <h1>SignUp</h1>
            <h3>Welcome to ChatArc</h3>
          </div>
          <form autocomplete="off" className="authForm">
            <label for="username"></label>
            <input
              type="text"
              id="username"
              className="formInput"
              placeholder="Choose a username"
              value={username}
              onChange={handleChanges("username")}
              autoFocus
            />
            <label for="email"></label>
            <input
              type="email"
              id="email"
              className="formInput"
              placeholder="Give your email"
              value={email}
              onChange={handleChanges("email")}
            />
            <label for="password"></label>
            <input
              type="password"
              id="password"
              className="formInput"
              placeholder="Password"
              value={password}
              onChange={handleChanges("password")}
            />

            <button onClick={talkToBackend} className="button">
              Sign Up
            </button>
          </form>
          <div className="navigate">
            Already have an account? Login{" "}
            <Link to="/signin" style={{ color: "#7eacac" }}>
              here
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
    </div>
  );
};

export default Signup;
