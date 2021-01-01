import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isSignedIn, updateUser } from "./backendManager";

const UpdateMe = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { username, email, password } = userDetails;
  const { user, token } = isSignedIn();

  const initiate = () => {
    setUserDetails({ username: user.username, email: user.email });
  };

  useEffect(() => {
    initiate();
  }, []);

  const handleChanges = (property) => (event) => {
    setUserDetails({ ...userDetails, [property]: event.target.value });
  };

  const updateMeHelper = () => {
    updateUser(user._id, token, username, email, password).then((data) => {
      if (data.error) {
        setError(data.error);
        setSuccess(false);
      } else {
        setError("");
        setSuccess(true);
      }
    });
  };

  const successMessage = () => {
    return (
      <div style={{ backgroundColor: "#16e516", padding: "10px, 0px" }}>
        <p style={{ display: success ? "" : "none", textAlign: "center" }}>
          Your profile information is updated successfully!
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

  const updateMeForm = () => {
    return (
      <div className="outerForm">
        <div className="adjust">
          <div>
            <h1>Update Profile</h1>
          </div>
          <form autoComplete="off" className="authForm">
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
              placeholder="New Password"
              value={password}
              onChange={handleChanges("password")}
            />
          </form>
          <div>
            <button
              className="button"
              onClick={updateMeHelper}
              style={{ margin: "50px 40px" }}
            >
              Update
            </button>
            <Link to="/contacts">
              <button className="button" style={{ margin: "50px 40px" }}>
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {errorMessage()}
      {successMessage()}
      {updateMeForm()}
    </div>
  );
};

export default UpdateMe;
