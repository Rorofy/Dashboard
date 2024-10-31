import React, { useState, useEffect } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import { makeStyles } from "@material-ui/core/styles";
import Draggable from "react-draggable";
import ReactPlayer from "react-player";
import { Card, Typography, Fab, Button, Hidden } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import iconYoutube from "../assets/icons/32/youtube.png";
import userRequests from "../apiConnector";

const API_KEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

const useStyles = makeStyles((theme) => ({
  card: {
    width: "25%",
    minHeight: "22vh",
    borderRight: "1vh solid #ff0000",
    color: "#00000",
    textAlign: "center",
    overflow: "visible",
  },
  lastVideoCard: {
    width: "25%",
    minHeight: "39.5vh",
    borderRight: "1vh solid #ff0000",
    color: "#00000",
    textAlign: "center",
    overflow: "visible",
  },
  headerDiv: {
    marginTop: "0.5vh",
    marginLeft: "-20vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerDiv2: {
    marginTop: "0.5vh",
    marginLeft: "-27vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subNbr: {
    fontSize: "3.5vw",
  },
  destroyButton: {
    position: "absolute",
    height: "4vh",
    width: "4vh",
    right: "94%",
    top: "-8%",
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
  wrapper: {
    position: "relative",
    marginTop: "1vh",

    paddingTop: "56.25%"
  },
  player: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  },
}));

function YoutubeSubCount(props) {
  const classes = useStyles();
  const {
    youtuber,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    username,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [count, setCount] = useState(0);
  var channelID = null;

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  const getSubscribers = async () => {
    const ret = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "channel",
          maxResults: "1",
          q: youtuber,
          key: API_KEY,
        },
        method: "GET",
      }
    );
    channelID = ret.data.items[0].id.channelId;

    const ret2 = await axios.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        params: {
          part: "statistics",
          id: channelID,
          key: API_KEY,
        },
        method: "GET",
      }
    );
    setCount(ret2.data.items[0].statistics.subscriberCount);
  };

  useEffect(() => {
    getSubscribers();
    setInterval(getSubscribers, 60000 * refreshTime);
  }, []);

  console.log(`subscribers ${index}`);
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
          <img src={iconYoutube} className={classes.icon} />
          <Typography variant="h6">Subscribers count</Typography>
        </div>
        <Typography variant="h4" style={{ marginTop: "1vh" }}>
          {youtuber}
        </Typography>
        <Typography className={classes.subNbr}>
          <NumberFormat
            value={count}
            displayType={"text"}
            thousandSeparator={true}
          />
        </Typography>
      </Card>
    </Draggable>
  );
}

function YoutubeLastVideo(props) {
  const classes = useStyles();
  const {
    youtuber,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    username,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [videoUrl, setUrl] = useState("");
  var channelID = null;

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  const getLastVideo = async () => {
    const ret = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          type: "channel",
          maxResults: "1",
          q: youtuber,
          key: API_KEY,
        },
        method: "GET",
      }
    );
    channelID = ret.data.items[0].id.channelId;

    const ret2 = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: channelID,
          maxResults: "1",
          order: "date",
          type: "video",
          key: API_KEY,
        },
        method: "GET",
      }
    );
    setUrl(`https://www.youtube.com/watch?v=${ret2.data.items[0].id.videoId}`);
  };
  useEffect(() => {
    getLastVideo();
    setInterval(getLastVideo, 60000 * refreshTime);
  }, []);

  console.log(`video ${index}`);
  return (
    <Draggable grid={[25, 25]} bounds="parent">
      <Card className={classes.lastVideoCard}>
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
        <div className={classes.headerDiv2}>
          <img src={iconYoutube} className={classes.icon} />
          <Typography variant="h6">Last Video</Typography>
        </div>
        <Typography variant="h4" style={{ marginTop: "1vh" }}>
          {youtuber}
        </Typography>
        <div className={classes.wrapper}>
          <ReactPlayer
            width="100%"
            height="100%"
            controls={true}
            className={classes.player}
            url={videoUrl}
          />
        </div>
      </Card>
    </Draggable>
  );
}

export { YoutubeSubCount, YoutubeLastVideo };
