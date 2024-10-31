import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";
import { Card, Typography, Fab, Button, Divider } from "@material-ui/core";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import iconSpotify from "./../assets/icons/32/spotify.png";
import axios from "axios";

const qs = require("qs");

const useStyles = makeStyles((theme) => ({
  root1: {
    width: "100%",
    maxWidth: "60vh",
  },
  root2: {
    width: "100%",
    maxWidth: "60vh",
    maxHeight: "30vh",
    overflow: "auto",
  },
  card: {
    width: "30%",
    Height: "30vh",
    color: "#00000",
    borderRight: "1vh solid #00d95f",
    textAlign: "center",
    overflow: "visible",
  },
  headerDiv: {
    marginTop: "0.5vh",
    marginLeft: "-33vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  destroyButton: {
    position: "absolute",
    height: "4vh",
    width: "4vh",
    right: "98%",
    top: "-3%",
  },
  smallerIcon: {
    height: "2vh",
    width: "2vh",
  },
  icon: {
    height: "4.5vh",
    width: "4.5vh",
    marginRight: "3vh",
  },
  albumCover: {
    height: "5vh",
    width: "5vh",
  },
  link: {
    color: "inherit",
    textDecoration: "inherit",
  },
}));

function SpotifyArtistSongs(props) {
  const classes = useStyles();
  const {
    artist,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    accessToken,
    username,
    setDisplayWidgets,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [tracks, setTracks] = useState([]);

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  const getSongs = async () => {
    console.log("yes artist" + accessToken);
    var tracksArray = [];
    let itemBody = {
      q: artist,
      type: "artist",
    };
    const item = await axios.get("https://api.spotify.com/v1/search", {
      params: {
        q: artist,
        type: "artist",
      },
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const artistId = item.data.artists.items[0].id;
    console.log(artistId);
    const topTracks = await axios
      .get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
        params: {
          market: "FR",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        tracksArray = response.data.tracks;
      });
    var tmp = [];
    for (var i = 0; i < 5; i++) {
      tmp.push(tracksArray[i]);
    }
    console.log(tmp);
    setTracks(tmp);
  };

  const toMinutesAndSeconds = (time) => {
    var minutes = Math.floor(time / 60000);
    var seconds = ((time % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  useEffect(() => {
    getSongs();
    setInterval(getSongs, 60000 * refreshTime);
  }, []);

  console.log(`artist ${index}`);
  return (
    <Draggable grid={[25, 25]} bounds="parent">
      <Card className={classes.card}>
        {!canBeDeleted ? null : (
          <Fab
            color="secondary"
            className={classes.destroyButton}
            onClick={() => destroyWidget()}
            disabled={isDeleted}
          >
            <CloseIcon className={classes.smallerIcon} />
          </Fab>
        )}
        <div className={classes.headerDiv}>
          <img src={iconSpotify} className={classes.icon} />
          <Typography variant="h6">Artist Top Tracks</Typography>
        </div>
        <Typography variant="h4" style={{ marginTop: "1vh" }}>
          {artist}
        </Typography>
        <List className={classes.root1}>
          {tracks.map((index, key) => (
            <div key={key}>
              <a
                className={classes.link}
                target="_blank"
                href={index.external_urls.spotify}
              >
                <ListItem button alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={index.album.images[1].url}
                      className={classes.albumCover}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={index.name}
                    secondary={
                      <React.Fragment>
                        <Typography>
                          {toMinutesAndSeconds(index.duration_ms)}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </a>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      </Card>
    </Draggable>
  );
}

function SpotifyUserPlaylists(props) {
  const classes = useStyles();
  const {
    user,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    accessToken,
    username,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  const getPlaylists = async () => {
    console.log("yes playlists");
    console.log(accessToken);
    const list = await axios
      .get(`https://api.spotify.com/v1/users/${user}/playlists`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        setPlaylists(response.data.items);
      });
  };

  useEffect(() => {
    getPlaylists();
    setInterval(getPlaylists, 60000 * refreshTime);
  }, []);

  console.log(`playlist ${index}`);
  return (
    <Draggable grid={[25, 25]} bounds="parent">
      <Card className={classes.card}>
        {!canBeDeleted ? null : (
          <Fab
            color="secondary"
            className={classes.destroyButton}
            onClick={() => destroyWidget()}
            disabled={isDeleted}
          >
            <CloseIcon className={classes.smallerIcon} />
          </Fab>
        )}
        <div className={classes.headerDiv}>
          <img src={iconSpotify} className={classes.icon} />
          <Typography variant="h6">Public Playlists</Typography>
        </div>
        <Typography variant="h4" style={{ marginTop: "1vh" }}>
          {user}
        </Typography>
        <List className={classes.root2}>
          {playlists.map((index, key) => (
            <div key={key}>
              <a
                className={classes.link}
                target="_blank"
                href={index.external_urls.spotify}
              >
                <ListItem button align-items="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={index.images[0].url}
                      className={classes.albumCover}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={index.name}
                    secondary={
                      <React.Fragment>
                        <Typography>
                          {index.description.length === 0
                            ? "No description"
                            : index.description}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </a>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      </Card>
    </Draggable>
  );
}

export { SpotifyArtistSongs, SpotifyUserPlaylists };
