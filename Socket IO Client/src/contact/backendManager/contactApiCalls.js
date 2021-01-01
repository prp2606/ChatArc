import { ChatArcAPI } from "../../backend";

export const getContacts = (userId, token) => {
  return fetch(`${ChatArcAPI}/user/${userId}/contacts`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const createContact = (userId, token, petName, actualUsername) => {
  const requestBagage = `{"petName": "${petName}", "actualUsername": "${actualUsername}"}`;

  return fetch(`${ChatArcAPI}/user/${userId}/createContact`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: requestBagage,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteContact = (userId, token, petName) => {
  return fetch(`${ChatArcAPI}/user/${userId}/deleteContact`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: petName,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
