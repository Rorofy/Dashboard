import axios from "axios";
const bcrypt = require("bcryptjs");
var sendRequest = require("http");

async function addUserDatabase(email, password, username) {
  const encryptPassword = bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(10),
    null
  );
  console.log(encryptPassword);

  const userDatas = JSON.stringify({
    email: email,
    password: encryptPassword,
    username: username,
  });

  const requestHeaders = {
    hostname: "localhost",
    port: "8000",
    path: "/",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": userDatas.length,
    },
  };

  let makeRequest = sendRequest.request(requestHeaders, (body) => {
    console.log(`return value : ${body.statusCode}`);
  });
  
  makeRequest.write(userDatas);
  makeRequest.end();
}

async function githubAuthentication(code) {
  var access = "";
  const answer = await axios
    .get(`http://localhost:8000/home/github/${code}`)
    .then((body) => {
      console.log(body.data.access);
      access = body.data.access;
      return access;
    });
  return answer;
}

async function spotifyAuthentication(code) {
  console.log(code);
  var access = "";
  var refresh = "";
  var expires = "";
  const answer = await axios
    .get(`http://localhost:8000/home/spotify/${code}`)
    .then((body) => {
      console.log(body.data.access);
      access = body.data.access;
      refresh = body.data.refresh;
      expires = body.data.expires;
      const query = {
        access: access,
        refresh: refresh,
        expires: expires,
      };
      return query;
    });
  return answer;
}

async function getUserInDatabase(username, password) {
  console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(10), null));
  const answer = await axios
    .get("http://localhost:8000")
    .then((body) => {
      var ite = 0;
      var returnValue = 0;
      for (; body.data[ite]; ite++) {
        if (body.data[ite].username === username) {
          console.log(`hum wtf ? ${body.data[ite].data[0].widgets}`);
          returnValue = 1;
        }
        if (
          body.data[ite].username === username &&
          bcrypt.compareSync(password, body.data[ite].password)
        ) {
          returnValue = 2;
          return returnValue;
        }
      }
      return returnValue;
    })
    .catch((fail) => console.log(fail));
  return answer;
}

async function addUserCredentials(type, accessToken, username) {
  const userData = JSON.stringify({
    accessToken: accessToken,
    type: type,
    username: username,
  });

  const header = {
    hostname: "localhost",
    port: "8000",
    path: "/home",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": userData.length,
    },
  };

  let makeRequest = sendRequest.request(header, (body) => {
    console.log(`return value : ${body}`);
  });

  makeRequest.write(userData);

  makeRequest.end();
}

async function affectWidgetsDatabase(
  username,
  widgetObject,
  requestType,
  index
) {
  console.log(widgetObject);
  console.log(`before ${username}`);
  const userDatas = JSON.stringify({
    username: username,
    widget: widgetObject,
    type: requestType,
    index: index,
  });
  console.log(userDatas);

  const headers = {
    hostname: "localhost",
    port: "8000",
    path: "/",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": userDatas.length,
    },
  };

  let makeRequest = sendRequest.request(headers, (body) => {
    console.log(`return value : ${body}`);
  });

  makeRequest.write(userDatas);

  makeRequest.end();
}

async function loadUserData(username) {
  const answer = await axios
    .get("http://localhost:8000")
    .then((body) => {
      var ite = 0;
      for (; body.data[ite]; ite++) {
        if (body.data[ite].username === username) {
          console.log(body.data[ite]);
          const cover = body.data[ite].cover;
          const google = body.data[ite].data[0].google;
          const spotify = body.data[ite].data[0].spotify;
          const github = body.data[ite].data[0].github;
          const widgets = body.data[ite].data[0].widgets;
          return { cover, google, spotify, github, widgets };
        }
      }
    })
    .catch((error) => console.log(error));
  return answer;
}

async function putUserCover(username, cover) {
  console.log(cover);
  const userDatas = JSON.stringify({
    username: username,
    cover: cover,
  });

  const headers = {
    hostname: "localhost",
    port: "8000",
    path: "/cover",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": userDatas.length,
    },
  };

  let makeRequest = sendRequest.request(headers, (body) => {
    console.log(`return value : ${body}`);
  });

  makeRequest.write(userDatas);

  makeRequest.end();
}

const userRequests = {
  addUserDatabase,
  getUserInDatabase,
  githubAuthentication,
  spotifyAuthentication,
  loadUserData,
  affectWidgetsDatabase,
  addUserCredentials,
  putUserCover,
};

export default userRequests;
