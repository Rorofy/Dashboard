import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, navigate } from "@reach/router";
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
import PublishIcon from "@material-ui/icons/Publish";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import iconGithub from "./../assets/icons/32/github.png";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "60vh",
    maxHeight: "32vh",
    overflow: "auto",
  },
  link: {
    color: "inherit",
    textDecoration: "inherit",
  },
  card: {
    width: "30%",
    Height: "30vh",
    color: "#00000",
    borderRight: "1vh solid #212121",
    textAlign: "center",
    overflow: "visible",
  },
  //Divs
  headerDiv: {
    marginTop: "0.5vh",
    marginLeft: "-30vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  destroyButton: {
    position: "absolute",
    height: "4vh",
    width: "4vh",
    right: "97%",
    top: "-4%",
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
  iconCommit: {
    height: "3vh",
    width: "3vh",
    marginTop: "2vh",
    marginRight: "2vh",
  },
}));

function GithubUserRepos(props) {
  const classes = useStyles();
  const {
    user,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    username,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [reposArray, setReposArray] = useState([]);

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  const getRepos = async () => {
    const ret = await axios.get(`https://api.github.com/users/${user}/repos`, {
      method: "GET",
    });
    const tmp = [...ret.data];
    setReposArray(tmp);
  };
  useEffect(() => {
    getRepos();
    setInterval(getRepos, 60000 * refreshTime);
  }, []);

  console.log(`user ${index}`);
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
          <img src={iconGithub} className={classes.icon} />
          <Typography variant="h6">Public repositories </Typography>
        </div>
        <Typography variant="h4" style={{ marginTop: "1vh" }}>
          {user}
        </Typography>
        <List className={classes.root}>
          {reposArray.map((index, key) => (
            <div key={key}>
              <a className={classes.link} target="_blank" href={index.html_url}>
                <ListItem alignItems="flex-start" button>
                  <FolderSharedIcon className={classes.iconCommit} />
                  <ListItemText
                    primary={index.name}
                    secondary={
                      <React.Fragment>
                        <Typography>
                          {index.language} | {index.description}
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

function GithubRepoPushs(props) {
  const classes = useStyles();
  const {
    repo,
    canBeDeleted,
    refreshTime,
    widgetsArray,
    index,
    username,
    deleteWidget,
  } = props;
  const [isDeleted, setIsDeleted] = useState(false);
  const [commitsArray, setCommitsArray] = useState([]);
  const repoName = repo.substring(repo.indexOf("/") + 1);

  const destroyWidget = async () => {
    deleteWidget(index);
  };

  const getCommits = async () => {
    const ret = await axios.get(
      `https://api.github.com/repos/${repo}/commits`,
      {
        method: "GET",
      }
    );
    const tmp = [...ret.data];
    setCommitsArray(tmp);
    console.log(tmp);
  };
  useEffect(() => {
    getCommits();
    setInterval(getCommits, 60000 * refreshTime);
  }, []);

  console.log(`repo ${index}`);
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
          <img src={iconGithub} className={classes.icon} />
          <Typography variant="h6">Repository pushs </Typography>
        </div>
        <Typography variant="h4" style={{ marginTop: "1vh" }}>
          {repoName}
        </Typography>
        <List className={classes.root}>
          {commitsArray.map((index, key) => (
            <div key={key}>
              <ListItem alignItems="flex-start">
                <PublishIcon className={classes.iconCommit} />
                <ListItemText
                  primary={index.commit.message}
                  secondary={
                    <React.Fragment>
                      <Typography>{index.commit.committer.name}</Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
      </Card>
    </Draggable>
  );
}

export { GithubUserRepos, GithubRepoPushs };
