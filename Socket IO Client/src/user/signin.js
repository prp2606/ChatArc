import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate, signin } from "./backendManager/index";

import "./user.css";

const Signin = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    error: "",
    loading: "",
    doRedirect: false,
  });

  const { username, password, error, loading, doRedirect } = userData;

  const handleChanges = (property) => (event) => {
    setUserData({
      ...userData,
      [property]: event.target.value,
    });
  };

  const talkToBackend = (event) => {
    event.preventDefault();

    setUserData({
      ...userData,
      error: "",
      loading: true,
    });

    signin({ username, password })
      .then((data) => {
        if (data.error) {
          setUserData({
            ...userData,
            error: data.error,
            loading: false,
          });
        } else {
          authenticate(data, () => {
            setUserData({
              ...userData,
              username: "",
              password: "",
              error: "",
              loading: false,
              doRedirect: true,
            });
          });
        }
      })
      .catch(console.log("SIGN IN REQUEST FAILED"));
  };

  const performRedirect = () => {
    if (doRedirect) {
      return <Redirect to="/contacts" />;
    }
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

  const loadingMessage = () => {
    return (
      loading && (
        <div style={{ backgroundColor: "#16e516", padding: "10px, 0px" }}>
          <h2 style={{ textAlign: "center" }}>Loading...</h2>
        </div>
      )
    );
  };

  const signInForm = () => {
    return (
      <div className="outerForm">
        <div className="adjust">
          <div>
            <h1>SignIn</h1>
            <h3>Welcome to ChatArc</h3>
          </div>
          <form autoComplete="off" className="authForm">
            <label for="username"></label>
            <input
              type="text"
              id="username"
              className="formInput"
              placeholder="Enter your username"
              value={username}
              onChange={handleChanges("username")}
              autoFocus
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
              Sign In
            </button>
          </form>
          <div className="navigate">
            New to ChatArc! Signup{" "}
            <Link to="/signup" style={{ color: "#7eacac" }}>
              here
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {errorMessage()}
      {loadingMessage()}
      {signInForm()}
      {performRedirect()}
    </div>
  );
};

export default Signin;
