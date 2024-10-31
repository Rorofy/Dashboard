var express = require("express");
var parser = require("body-parser");
var mongooseService = require("mongoose");
var cors = require("cors");
const axios = require("axios");
const fetch = require("node-fetch");
const querystring = require("querystring");
const qs = require("qs");
var fs = require("fs");

var port = 8000;

var options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000,
    },
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000,
    },
  },
};

var DATABASE_URL = "mongodb://mongo:27018/db_dashboard";

mongooseService.connect(DATABASE_URL, options);

var databse = mongooseService.connection;
databse.on("error", console.error.bind(console, "Database connection error"));
databse.once("open", function () {
  console.log("Connection ok");
});

var app = express();

app.use(cors());

var serverRouter = express.Router();

var userDatas = mongooseService.Schema({
  email: String,
  password: String,
  username: String,
  cover: { type: String, data: Buffer },
  data: [
    {
      google: {
        accessToken: String,
      },
      spotify: {
        accessToken: String,
        refreshToken: String,
        expires: Number,
      },
      github: {
        accessToken: String,
      },
      widgets: Array,
    },
  ],
});

var User = mongooseService.model("User", userDatas);

const githubClientId = "af14d39da038e3978430";
const githubClientSecret = "54a3c339e722234ad0040f06e347c393b6257ee8";

const spotifyClientId = "7bc91382df86470ca2c58ed007c5efbf";
const spotifyClientSecret = "390a5de8bf0c4b3db264e648aa2bf4d5";

serverRouter
  .route("/")
  .get(function (req, res) {
    console.log("GET");
    User.find(function (err, users) {
      if (err) {
        res.send(err);
      }
      res.json(users);
    });
  })
  .post(function (req, res) {
    console.log("POST");
    let user = new User();

    console.log(req.body);
    user.cover = null;
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;
    user.data = [
      {
        google: {
          accessToken: "",
        },
        spotify: {
          accessToken: "",
          refreshToken: "",
          expires: 0,
        },
        github: {
          accessToken: "",
        },
        widgets: [],
      },
    ];
    user.save(function (err) {
      if (err) res.send(err);
      res.send({ success: true, msg: "New User is now in your db" });
    });
  })
  .put(function (req, res) {
    console.log("put");
    /**
     * Request body informations :
     * username
     * widget --> widget to add
     * type --> type of request (add or remove)
     * index --> index of the widget to REMOVE (-1 if adding widget)
     */
    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) res.send(err);
      console.log(user);
      if (user && req.body.widget && req.body.type == "add")
        user.data[0].widgets.push(req.body.widget);
      if (user && req.body.type === "remove" && req.body.index !== -1) {
        // console.log(user.data[0].widgets[index]);
        user.data[0].widgets.splice(req.body.index, 1);
      }
      user.save(function (err) {
        if (err) res.send(err);
        res.send({ success: true, message: "Widgets successfully modified" });
      });
    });
  })
  .delete(function (req, res) {
    console.log("delete");
  });

const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + encodeURIComponent(data[key]))
    .join("&");
};

serverRouter
  .route("/home/github/:code")
  .get(function (req, res) {
    console.log("GET GH");
    console.log(req.params.code);
    const requestToken = req.params.code;
    axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${githubClientId}&client_secret=${githubClientSecret}&code=${requestToken}`,
      headers: {
        accept: "application/json",
      },
    }).then((response) => {
      const accessToken = response.data.access_token;
      console.log(accessToken);
      res.json({ access: accessToken });
    });
  })
  .post(function (req, res) {
    console.log("POST GH");
  })
  .put(function (req, res) {
    console.log("PUT GH");
  })
  .delete(function (req, res) {
    console.log("DELETE GH");
  });

serverRouter
  .route("/home/spotify/:code")
  .get(function (req, res) {
    console.log("SPOTIFY GET");
    console.log(req.params.code);
    let body = {
      grant_type: "authorization_code",
      code: req.params.code,
      redirect_uri: "http://localhost:3000/",
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret,
    };
    axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
      data: qs.stringify(body),
    }).then((response) => {
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;
      const expiresIn = response.data.expires_in;
      res.json({
        access: accessToken,
        refresh: refreshToken,
        expires: expiresIn,
      });
    });
  })
  .post(function (req, res) {
    console.log("SPOTIFY POST");
  })
  .put(function (req, res) {
    console.log("SPOTIFY PUT");
  })
  .delete(function (req, res) {
    console.log("SPOTIFY DELETE");
  });

serverRouter
  .route("/home")
  .get(function (req, res) {
    console.log("get home");
  })
  .post(function (req, res) {
    console.log("post home");
  })
  .put(function (req, res) {
    console.log(req.body);
    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) res.send(err);
      if (req.body.type === "youtube")
        user.data[0].google.accessToken = req.body.accessToken;
      if (req.body.type === "spotify") {
        user.data[0].spotify.accessToken = req.body.accessToken.access;
        user.data[0].spotify.refreshToken = req.body.accessToken.refresh;
        user.data[0].spotify.expires = req.body.accessToken.expires;
      }
      if (req.body.type === "github")
        user.data[0].github.accessToken = req.body.accessToken;
      user.save(function (err) {
        if (err) res.send(err);
        res.send({ success: true, message: "Widgets successfully modified" });
      });
    });
  });

serverRouter
  .route("/cover")
  .get(function (req, res) {
    console.log("get cover");
  })
  .post(function (req, res) {
    console.log("post cover");
  })
  .put(function (req, res) {
    console.log("put cover");
    console.log(req.body.cover);
    User.findOne({ username: req.body.username }, function (err, user) {
      if (err) res.send(err);
      user.cover.data = fs.readFileSync(req.body.cover);
      user.save(function (err) {
        if (err) res.send(err);
        res.send({ success: true, message: "New cover added in database" });
      });
    });
  });

serverRouter.route("/about.json").get(function (req, res) {
  var time = new Date().getTime();
  res.json({
    client: {
      host: "172.18.0.4:3000",
    },
    server: {
      current_time: time,
      services: [
        {
          name: "Youtube",
          widgets: [
            {
              name: "youtube_last_video",
              description: "Display youtube channel's last video.",
              params: [
                {
                  name: "channel",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
            {
              name: "youtube_subscribers_count",
              description: "Display youtube channel number of subscribers.",
              params: [
                {
                  name: "channel",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
          ],
        },
        {
          name: "Spotify",
          widgets: [
            {
              name: "spotify_artist_top_songs",
              description: "Display musical artist top songs.",
              params: [
                {
                  name: "artist",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
            {
              name: "spotify_user_playlists",
              description: "Display Spotify user public playlists.",
              params: [
                {
                  name: "user",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
          ],
        },
        {
          name: "Gihtub",
          widgets: [
            {
              name: "guthub_repo_last_commits",
              description: "Display Github repository last 30 commits.",
              params: [
                {
                  name: "repo",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
            {
              name: "github_user_public_repos",
              description: "Display Github user public repositories.",
              params: [
                {
                  name: "user",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
          ],
        },
        {
          name: "Weather",
          widgets: [
            {
              name: "city_temperature",
              description:
                "Display temperature and weather information for a city.",
              params: [
                {
                  name: "city",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
          ],
        },
        {
          name: "Money",
          widgets: [
            {
              name: "money_converter",
              description: "Converts Euros to selected currency.",
              params: [
                {
                  name: "currency",
                  type: "string",
                },
                {
                  name: "refresh_time",
                  type: "integer",
                },
              ],
            },
          ],
        },
      ],
    },
  });
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(serverRouter);

module.exports = User;

app.listen(port, () => console.log(`Server listening on port : ${port}`));
