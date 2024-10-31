import "./ProfilePopup.css";
import React, { useState } from "react";
import { Link } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Button,
  Chip,
} from "@material-ui/core";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import iconYoutube from "./../assets/icons/64/youtube.png";
import userRequests from "../apiConnector";
import GoogleLogin from "react-google-login";
import GithubLogin from "./GithubLogin";
import SpotifyLogin from "./SpotifyLogin";

var sendRequest = require("http");

const useStyles = makeStyles((theme) => ({
  dialogCard: {
    position: "absolute",
    top: "20%",
    height: "57vh",
  },
  userIcon: {
    width: "6vh",
    height: "6vh",
    color: "darkgrey",
  },
  whiteIcon: {
    color: "#ffffff",
  },
  listContainer: {
    width: "100%",
    maxWidth: "50vh",
  },
  listHeader: {
    fontSize: "3.5vh",
    marginBottom: "1.5vh",
  },
  serviceName: {
    fontSize: "2.5vh",
    marginLeft: "4vh",
  },
  listItem: {
    width: "45vh",
    marginBottom: "2vh",
    boxShadow: "2px 2px 3px rgba(150, 150, 150, 1)",
  },
  logoutButton: {
    position: "absolute",
    top: "91%",
    fontSize: "1.5vh",
    fontWeight: "bold",
    left: "42.5%",
  },
  chip: {
    position: "absolute",
    marginTop: "-7vh",
    right: "-15%",
    color: "white",
  },
  loggedChip: {
    position: "absolute",
    marginTop: "-7vh",
    right: "-15%",
    color: "white",
    background: "limegreen",
  },
}));

const LoggedChip = ({ logged }) => {
  const classes = useStyles();

  if (logged) {
    return (
      <Chip
        label="LOGGED"
        icon={<CheckIcon className={classes.whiteIcon} />}
        className={classes.loggedChip}
      />
    );
  }
  return (
    <Chip
      label="LOGGED"
      color="secondary"
      icon={<CloseIcon />}
      className={classes.chip}
    />
  );
};

export default function ProfilePopup(props) {
  const classes = useStyles();
  const {
    openPopup,
    setOpenPopup,
    userName,
    coverImg,
    youtube,
    spotify,
    github,
    setYoutube,
    setSpotify,
    setGithub,
  } = props;
  const [youtubeLogged, setYoutubeLogged] = useState(false);
  const [spotifyLogged, setSpotifyLogged] = useState(false);
  const [githubLogged, setGithubLogged] = useState(false);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState("");
  const [githubAccessToken, setGithubAccessToken] = useState("");
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const youtubeClientId =
    "77078160299-k9vf37ebaet0k2phpt6s3811vnraau1q.apps.googleusercontent.com";
  const githubClientId = "af14d39da038e3978430";
  const spotifyClientId = "7bc91382df86470ca2c58ed007c5efbf";

  const handleClose = () => {
    setOpenPopup(false);
  };

  const responseGoogle = (response) => {
    if (youtubeLogged === true) return;
    console.log(response.accessToken);
    setYoutubeAccessToken(response.accessToken);
    setYoutubeLogged(true);
    var tmp = [...youtube];
    tmp.push(response.accessToken);
    userRequests.addUserCredentials("youtube", response.accessToken, userName);
    setYoutube(tmp);
  };

  const responseSpotify = async (response) => {
    if (spotifyLogged === true) return;
    let req = await userRequests.spotifyAuthentication(response.code);
    console.log(`access = ${req.access}`);
    if (req.access.length !== 0) {
      setSpotifyAccessToken(req.access);
      setSpotifyLogged(true);
      var tmp = [...spotify];
      tmp.push(req.access);
      tmp.push(req.refresh);
      tmp.push(req.expires);
      userRequests.addUserCredentials(
        "spotify",
        { access: req.access, refresh: req.refresh, expires: req.expires },
        userName
      );
      setSpotify(tmp);
    }
  };

  const errorSpotify = (error) => {
    console.log(error);
  };

  const responseGithub = async (response) => {
    if (githubLogged === true) return;
    let req = await userRequests.githubAuthentication(response.code);
    console.log(`access = ${req}`);
    if (req && req.length !== 0) {
      setGithubAccessToken(req);
      setGithubLogged(true);
      var tmp = [...github];
      tmp.push(req);
      userRequests.addUserCredentials("github", req, userName);
      setGithub(tmp);
    }
  };

  const errorGithub = (error) => {
    console.log(error);
  };

  if (!youtubeLogged) {
    if (youtube[0] && youtube[0].length !== 0) setYoutubeLogged(true);
  }

  if (!spotifyLogged) {
    if (spotify[0] && spotify[0].length !== 0) setSpotifyLogged(true);
  }

  if (!githubLogged) {
    if (github[0] && github[0].length !== 0) setGithubLogged(true);
  }

  return (
    <StylesProvider injectFirst>
      <Dialog
        open={openPopup}
        onClose={handleClose}
        fullWidth={true}
        classes={{ paper: classes.dialogCard }}
      >
        <DialogTitle style={{ background: `center url(${coverImg})` }}>
          <div className="headerDiv">
            <Fab className="iconBtn">
              <PersonIcon className={classes.userIcon}></PersonIcon>
            </Fab>
            <h1 className="userName">{userName}</h1>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <div className="contentDiv">
            <List
              className={classes.listContainer}
              subheader={
                <ListSubheader className={classes.listHeader}>
                  Services
                </ListSubheader>
              }
            >
              <GoogleLogin
                clientId={youtubeClientId}
                render={(renderProps) => (
                  <ListItem
                    variant="outlined"
                    button
                    onClick={renderProps.onClick}
                    className={classes.listItem}
                  >
                    <ListItemIcon>
                      <img src={iconYoutube} />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      className={classes.serviceName}
                      primary="Youtube"
                    />
                  </ListItem>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
              <LoggedChip logged={youtubeLogged}></LoggedChip>
              <SpotifyLogin
                clientId={spotifyClientId}
                onSuccess={responseSpotify}
                onFailure={errorSpotify}
              />
              <LoggedChip logged={spotifyLogged}></LoggedChip>
              <GithubLogin
                clientId={githubClientId}
                onSuccess={responseGithub}
                onFailure={errorGithub}
              />
              <LoggedChip logged={githubLogged}></LoggedChip>
            </List>
            <Button
              variant="contained"
              color="secondary"
              className={classes.logoutButton}
              component={Link}
              to={"/"}
            >
              LOGOUT
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StylesProvider>
  );
}
