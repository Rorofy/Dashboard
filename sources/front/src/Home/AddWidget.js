import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Card,
  CardActionArea,
  Button,
  DialogContentText,
  FormControl,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import TimerIcon from "@material-ui/icons/Timer";
import "./AddWidget.css";
import iconYoutube from "./../assets/icons/64/youtube.png";
import iconSpotify from "./../assets/icons/64/spotify.png";
import iconGithub from "./../assets/icons/64/github.png";
import iconWeather from "./../assets/icons/64/weather.png";
import iconMoney from "./../assets/icons/64/money.png";
import { YoutubeSubCount, YoutubeLastVideo } from "../Widgets/YoutubeWidgets";
import {
  SpotifyArtistSongs,
  SpotifyUserPlaylists,
} from "../Widgets/SpotifyWidgets";
import { GithubUserRepos, GithubRepoPushs } from "../Widgets/GithubWidgets";
import MoneyConverter from "../Widgets/MoneyWidget";
import WeatherForecast from "../Widgets/WeatherWidget";
import userRequests from "../apiConnector";

const useStyles = makeStyles((theme) => ({
  dialogCard: {
    position: "absolute",
    top: "20%",
    width: "55vh",
  },
  errorDialog: {
    position: "absolute",
    top: "20%",
    width: "25vh",
    justifyContent: "center",
    textAlign: "center",
  },
  iconTimer: {
    width: "6vh",
    height: "6vh",
    marginRight: "5vh",
    marginLeft: "2vh",
    marginTop: "0.5vh",
    marginBottom: "-0.5vh",
  },
}));

function WidgetSelection(props) {
  const {
    title,
    subtitle,
    widget1,
    widget2,
    icon,
    displayWidgets,
    setDisplayWidgets,
    handleClose,
    accessToken,
    username,
  } = props;

  const [openConfig, setOpenConfig] = useState(false);
  const [type, setType] = useState(0);

  const handleConfig = (newType) => {
    setType(newType);
    setOpenConfig(true);
  };

  return (
    <div>
      {openConfig === false && (
        <div>
          <DialogTitle>
            <div className="header">
              <h1 className="title">{title}</h1>
              <h2 className="subTitle">{subtitle}</h2>
            </div>
          </DialogTitle>
          <DialogContent dividers>
            <Card className="serviceCard" variant="outlined">
              <CardActionArea
                className="serviceCardAction"
                onClick={() => handleConfig(0)}
              >
                <img src={icon} className="widgetIcon" />
                <Typography className="serviceText">{widget1}</Typography>
              </CardActionArea>
            </Card>
            <Card className="serviceCard" variant="outlined">
              <CardActionArea
                className="serviceCardAction"
                onClick={() => handleConfig(1)}
              >
                <img src={icon} className="widgetIcon" />
                <Typography className="serviceText">{widget2}</Typography>
              </CardActionArea>
            </Card>
          </DialogContent>
        </div>
      )}
      {openConfig === true && (
        <WidgetConfig
          type={type}
          title={title}
          subtitle="Configure Widget"
          icon={icon}
          global={title}
          displayWidgets={displayWidgets}
          setDisplayWidgets={setDisplayWidgets}
          handleClose={handleClose}
          accessToken={accessToken}
          username={username}
        />
      )}
    </div>
  );
}

function MoneyWidgetConfig(props) {
  const classes = useStyles();
  const {
    title,
    subtitle,
    icon,
    displayWidgets,
    setDisplayWidgets,
    handleClose,
    username,
  } = props;
  const [refreshTime, setTime] = useState("");
  const [first, setFirst] = useState();
  const [second, setSecond] = useState("");

  var tmp = [...displayWidgets];

  const createMoney = (first, second, refreshTime) => {
    if (second.length === 0) return;
    const widget = {
      name: "money-converter",
      content: (
        <MoneyConverter
          currency={second}
          refreshTime={refreshTime}
          canBeDeleted={false}
        />
      ),
    };
    tmp.push(widget);
    userRequests.affectWidgetsDatabase(username, widget, "add", -1);
    setDisplayWidgets(tmp);
    handleClose();
  };

  return (
    <div>
      <DialogTitle>
        <div className="header">
          <h1 className="title">{title}</h1>
          <h2 className="subTitle">{subtitle}</h2>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Card className="moneyCard" variant="outlined">
          <img src={icon} className="moneyIcon" />
          <div className="configInput">
            <FormControl className="moneySelect">
              <InputLabel>Converted currency</InputLabel>
              <Select
                value={second}
                onChange={(e) => setSecond(e.target.value)}
              >
                <MenuItem value={"GBP"}>GBP (Pound)</MenuItem>
                <MenuItem value={"USD"}>USD (US dollar)</MenuItem>
                <MenuItem value={"INR"}>INR (Rupee)</MenuItem>
                <MenuItem value={"AUD"}>AUD (AU dollar)</MenuItem>
                <MenuItem value={"CAD"}>CAD (CA dollar)</MenuItem>
                <MenuItem value={"SGD"}>SGD (SG dollar)</MenuItem>
                <MenuItem value={"XBT"}>XBT (Bitcoin)</MenuItem>
                <MenuItem value={"ARS"}>ARS (Peso)</MenuItem>
                <MenuItem value={"CHF"}>CHF (Swiss franc)</MenuItem>
                <MenuItem value={"HKD"}>HKD (HK dollar)</MenuItem>
                <MenuItem value={"AED"}>AED (AE dirham)</MenuItem>
                <MenuItem value={"BRL"}>BRL (BR real)</MenuItem>
                <MenuItem value={"JPY"}>JPY (JP yen)</MenuItem>
                <MenuItem value={"KRW"}>KRW (KR won)</MenuItem>
                <MenuItem value={"MXN"}>MXN (MX peso)</MenuItem>
                <MenuItem value={"NOK"}>NOK (NO krone)</MenuItem>
                <MenuItem value={"NZD"}>NZD (NZ dollar)</MenuItem>
                <MenuItem value={"QAR"}>QAR (QA rial)</MenuItem>
                <MenuItem value={"RUB"}>RUB (RU ruble)</MenuItem>
                <MenuItem value={"THB"}>THB (TH baht)</MenuItem>
                <MenuItem value={"TWD"}>TWD (TW dollar)</MenuItem>
                <MenuItem value={"FRF"}>FRF (FR franc)</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Card>
        <Card className="serviceCard" variant="outlined">
          <TimerIcon className={classes.iconTimer} />
          <TextField
            required
            type="number"
            id="refreshTime"
            label="Refresh Time (in minutes)"
            value={refreshTime}
            className="configInput"
            onChange={(e) => setTime(e.target.value)}
          />
        </Card>
        <div className="createButton">
          <Button
            variant="contained"
            color="primary"
            onClick={() => createMoney(first, second, refreshTime)}
          >
            Create widget
          </Button>
        </div>
      </DialogContent>
    </div>
  );
}

function WidgetConfig(props) {
  const classes = useStyles();
  const {
    type,
    title,
    subtitle,
    icon,
    global,
    displayWidgets,
    setDisplayWidgets,
    handleClose,
    accessToken,
    username,
  } = props;
  const [refreshTime, setTime] = useState("");
  const [name, setName] = useState();
  var label = null;

  var tmp = [...displayWidgets];

  if (title === "YouTube") label = "Youtube channel";
  if (title === "Spotify") {
    if (type === 0) label = "Artist";
    if (type === 1) label = "Spotify user";
  }
  if (title === "Github") {
    if (type === 0) label = "Github user";
    if (type === 1) label = "Github Repository";
  }
  if (title === "Weather") label = "City";

  const createWidget = (type, title, name, refreshTime) => {
    if (refreshTime.trim() == "") return;
    if (title === "YouTube") {
      if (type === 0) {
        label = "Youtube channel";
        const widget = {
          name: "youtube-subcount",
          content: (
            <YoutubeSubCount
              refreshTime={refreshTime}
              youtuber={name}
              canBeDeleted={false}
            />
          ),
        };
        tmp.push(widget);
        console.log(`way before ${username}`);
        userRequests.affectWidgetsDatabase(username, widget, "add", -1);
        console.log(tmp);
        setDisplayWidgets(tmp);
      }
      if (type === 1) {
        label = "Youtube channel";
        const widget = {
          name: "youtube-video",
          content: (
            <YoutubeLastVideo
              refreshTime={refreshTime}
              youtuber={name}
              canBeDeleted={false}
            />
          ),
        };
        tmp.push(widget);
        userRequests.affectWidgetsDatabase(username, widget, "add", -1);
        setDisplayWidgets(tmp);
      }
    }
    if (title === "Spotify") {
      if (type === 0) {
        label = "Artist";
        const widget = {
          name: "spotify-artist",
          content: (
            <SpotifyArtistSongs
              refreshTime={refreshTime}
              artist={name}
              canBeDeleted={false}
              accessToken={accessToken}
            />
          ),
        };
        tmp.push(widget);
        userRequests.affectWidgetsDatabase(username, widget, "add", -1);
        setDisplayWidgets(tmp);
      }
      if (type === 1) {
        label = "Spotify user";
        const widget = {
          name: "spotify-playlist",
          content: (
            <SpotifyUserPlaylists
              refreshTime={refreshTime}
              user={name}
              canBeDeleted={false}
              accessToken={accessToken}
            />
          ),
        };
        tmp.push(widget);
        userRequests.affectWidgetsDatabase(username, widget, "add", -1);
        setDisplayWidgets(tmp);
      }
    }
    if (title === "Github") {
      if (type === 0) {
        label = "Github user";
        const widget = {
          name: "github-user",
          content: (
            <GithubUserRepos
              refreshTime={refreshTime}
              user={name}
              canBeDeleted={false}
            />
          ),
        };
        tmp.push(widget);
        userRequests.affectWidgetsDatabase(username, widget, "add", -1);
        setDisplayWidgets(tmp);
      }
      if (type === 1) {
        label = "Github Repository";
        const widget = {
          name: "github-repo",
          content: (
            <GithubRepoPushs
              refreshTime={refreshTime}
              repo={name}
              canBeDeleted={false}
            />
          ),
        };
        tmp.push(widget);
        userRequests.affectWidgetsDatabase(username, widget, "add", -1);
        setDisplayWidgets(tmp);
      }
    }
    if (title === "Weather") {
      label = "City";
      const widget = {
        name: "weather-city",
        content: (
          <WeatherForecast
            refreshTime={refreshTime}
            city={name}
            canBeDeleted={false}
          />
        ),
      };
      tmp.push(widget);
      userRequests.affectWidgetsDatabase(username, widget, "add", -1);
      setDisplayWidgets(tmp);
    }
    console.log(displayWidgets.length);
    handleClose();
  };

  return (
    <div>
      <DialogTitle>
        <div className="header">
          <h1 className="title">{title}</h1>
          <h2 className="subTitle">{subtitle}</h2>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <Card className="serviceCard" variant="outlined">
          <img src={icon} className="serviceIcon" />
          <TextField
            required
            id="name"
            label={label}
            value={name}
            className="configInput"
            onChange={(e) => setName(e.target.value)}
          />
        </Card>
        <Card className="serviceCard" variant="outlined">
          <TimerIcon className={classes.iconTimer} />
          <TextField
            required
            type="number"
            id="refreshTime"
            label="Refresh Time (in minutes)"
            value={refreshTime}
            className="configInput"
            onChange={(e) => setTime(e.target.value)}
          />
        </Card>
        <div className="createButton">
          <Button
            variant="contained"
            color="primary"
            onClick={() => createWidget(type, title, name, refreshTime)}
          >
            Create widget
          </Button>
        </div>
      </DialogContent>
    </div>
  );
}

function ErrorPopup(props) {
  const classes = useStyles();
  const { openPopup, setOpenPopup, service } = props;

  const handleClose = () => {
    setOpenPopup(false);
  };

  return (
    <Dialog
      open={openPopup}
      onClose={handleClose}
      fullWidth={true}
      classes={{ paper: classes.errorDialog }}
    >
      <DialogTitle>Error</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Seems that you are not registered to the {service} service.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default function AddWidget(props) {
  const classes = useStyles();
  const {
    openWidgetAdder,
    setOpenWidgetAdder,
    displayWidgets,
    setDisplayWidgets,
    youtube,
    spotify,
    github,
    username,
  } = props;

  const [showYoutube, setShowYoutube] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showGithub, setShowGithub] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showMoney, setShowMoney] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [serviceError, setServiceError] = useState("");
  const [mainView, setMainView] = useState(true);

  const handleClose = () => {
    setShowYoutube(false);
    setShowSpotify(false);
    setShowGithub(false);
    setShowWeather(false);
    setShowMoney(false);
    setOpenWidgetAdder(false);
    setMainView(true);
  };

  const handleYoutubeClick = () => {
    if (youtube.length === 0) {
      setServiceError("YouTube");
      setOpenPopup(true);
    } else {
      setShowYoutube(true);
      setMainView(false);
    }
  };

  const handleSpotifyClick = () => {
    if (spotify.length === 0) {
      setServiceError("Spotify");
      setOpenPopup(true);
    } else {
      setShowSpotify(true);
      setMainView(false);
    }
  };

  const handleGithubClick = () => {
    if (github.length === 0) {
      setServiceError("Github");
      setOpenPopup(true);
    } else {
      setShowGithub(true);
      setMainView(false);
    }
  };

  const handleWeatherClick = () => {
    setShowWeather(true);
    setMainView(false);
  };

  const handleMoneyClick = () => {
    setShowMoney(true);
    setMainView(false);
  };

  return (
    <StylesProvider>
      <Dialog
        open={openWidgetAdder}
        onClose={handleClose}
        fullWidth={true}
        classes={{ paper: classes.dialogCard }}
      >
        {mainView === true && (
          <div>
            <DialogTitle>
              <div className="header">
                <h1 className="title">Add a new widget</h1>
                <h2 className="subTitle">Select service</h2>
              </div>
            </DialogTitle>
            <DialogContent dividers>
              <Card className="serviceCard" variant="outlined">
                <CardActionArea
                  className="serviceCardAction"
                  onClick={handleYoutubeClick}
                >
                  <img src={iconYoutube} className="serviceIcon" />
                  <div className="servicePos">
                    <Typography className="serviceText">YouTube</Typography>
                  </div>
                </CardActionArea>
              </Card>
              <Card className="serviceCard" variant="outlined">
                <CardActionArea
                  className="serviceCardAction"
                  onClick={handleSpotifyClick}
                >
                  <img src={iconSpotify} className="serviceIcon" />
                  <div className="servicePos">
                    <Typography className="serviceText">Spotify</Typography>
                  </div>
                </CardActionArea>
              </Card>
              <Card className="serviceCard" variant="outlined">
                <CardActionArea
                  className="serviceCardAction"
                  onClick={handleGithubClick}
                >
                  <img src={iconGithub} className="serviceIcon" />
                  <div className="servicePos">
                    <Typography className="serviceText">Github</Typography>
                  </div>
                </CardActionArea>
              </Card>
              <Card className="serviceCard" variant="outlined">
                <CardActionArea
                  className="serviceCardAction"
                  onClick={handleWeatherClick}
                >
                  <img src={iconWeather} className="serviceIcon" />
                  <div className="servicePos">
                    <Typography className="serviceText">Weather</Typography>
                  </div>
                </CardActionArea>
              </Card>
              <Card className="serviceCard" variant="outlined">
                <CardActionArea
                  className="serviceCardAction"
                  onClick={handleMoneyClick}
                >
                  <img src={iconMoney} className="serviceIcon" />
                  <div className="servicePos">
                    <Typography className="serviceText">Money</Typography>
                  </div>
                </CardActionArea>
              </Card>
            </DialogContent>
          </div>
        )}
        {showYoutube === true && (
          <WidgetSelection
            title="YouTube"
            subtitle="Select Widget"
            widget1="Subscribers count"
            widget2="Last video"
            icon={iconYoutube}
            displayWidgets={displayWidgets}
            setDisplayWidgets={setDisplayWidgets}
            handleClose={handleClose}
            username={username}
          />
        )}
        {showSpotify === true && (
          <WidgetSelection
            title="Spotify"
            subtitle="Select Widget"
            widget1="Artist's top songs"
            widget2="User's public playlists"
            icon={iconSpotify}
            displayWidgets={displayWidgets}
            setDisplayWidgets={setDisplayWidgets}
            handleClose={handleClose}
            accessToken={spotify[0]}
            username={username}
          />
        )}
        {showGithub === true && (
          <WidgetSelection
            title="Github"
            subtitle="Select Widget"
            widget1="User's public repositories"
            widget2="Repository last commits"
            icon={iconGithub}
            displayWidgets={displayWidgets}
            setDisplayWidgets={setDisplayWidgets}
            handleClose={handleClose}
            username={username}
          />
        )}
        {showWeather === true && (
          <WidgetConfig
            type={0}
            title="Weather"
            subtitle="Configure Widget"
            icon={iconWeather}
            displayWidgets={displayWidgets}
            setDisplayWidgets={setDisplayWidgets}
            handleClose={handleClose}
            username={username}
          />
        )}
        {showMoney === true && (
          <MoneyWidgetConfig
            title="Money"
            subtitle="Euro converter"
            icon={iconMoney}
            displayWidgets={displayWidgets}
            setDisplayWidgets={setDisplayWidgets}
            handleClose={handleClose}
            username={username}
          />
        )}
      </Dialog>
      <ErrorPopup
        service={serviceError}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      />
    </StylesProvider>
  );
}
