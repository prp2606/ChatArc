import { ChatArcAPI } from "../../backend";

export const getContactName = (userId, token) => {
  return fetch(`${ChatArcAPI}/user/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const getConversation = (userId, token, actualUser) => {
  return fetch(`${ChatArcAPI}/user/${userId}/getConversation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: actualUser,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const startChating = (userId, token, actualUser, messageBody) => {
  const requestBagage = `{"actualUser": "${actualUser}","messageBody": "${messageBody}"}`;

  return fetch(`${ChatArcAPI}/user/${userId}/startChating`, {
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

export const initiateConversation = (userId, token, actualUser) => {
  return fetch(`${ChatArcAPI}/user/${userId}/newConversation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: actualUser,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const deleteChat = (userId, token, actualUser) => {
  return fetch(`${ChatArcAPI}/user/${userId}/deleteConversation`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: actualUser,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
