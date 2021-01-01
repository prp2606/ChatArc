import { ChatArcAPI } from "../../backend";

export const signup = (user) => {
  return fetch(`${ChatArcAPI}/signup`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const signin = (user) => {
  return fetch(`${ChatArcAPI}/signin`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// Method associated with signin method
export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
    next();
  }
};

export const signout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");

    return fetch(`${ChatArcAPI}/signout`, {
      method: "GET",
    })
      .then((response) => {
        console.log("SIGNOUT SUCCESS");
        return response.json();
      })
      .catch((err) => console.log(err));
  }
};

export const isSignedIn = () => {
  if (typeof window === "undefined") {
    return false;
  }

  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else {
    return false;
  }
};

export const updateUser = (userId, token, username, email, password) => {
  const requestBaggage = `"username": "${username}", "email": "${email}, "password": "${password}"`;

  return fetch(`${ChatArcAPI}/user/${userId}/update`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: requestBaggage,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteUser = (userId, token) => {
  return fetch(`${ChatArcAPI}/user/${userId}/delete`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
