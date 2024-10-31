import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React from "react";
import { navigate } from "@reach/router";
import Box from "@material-ui/core/Box";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PersonIcon from "@material-ui/icons/Person";
import userRequests from "../apiConnector";
import Cookies from "js-cookie";

const root = {
  marginTop: "5vh",
  margin: "1px",
  width: "50ch",
  alignItems: "center",
};

const icon = {
  marginTop: "4vh",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const submit = {
  marginTop: "7vh",
};

const iconPos = {
  marginRight: "10px",
};

const error = {
  position: "absolute",
  color: "red",
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      username: "",
      errorUsername: false,
      errorPassword: false,
      errorUsernameOnSubmit: false,
      errorPasswordOnSubmit: false,
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  handleValidation = () => {
    if (this.state.password === "") {
      if (this.state.errorPassword === false)
        this.setState({ errorPassword: true });
    } else {
      if (this.state.errorPassword === true)
        this.setState({ errorPassword: false });
    }
    if (this.state.username === "") {
      if (this.state.errorUsername === false)
        this.setState({ errorUsername: true });
    } else {
      if (this.state.errorUsername === true)
        this.setState({ errorUsername: false });
    }
  };

  hasError = () => {
    if (this.state.errorUsername || this.state.errorPassword) return true;
    return false;
  };

  checkSignUp = () => {
    this.handleValidation();
    if (this.hasError()) return false;
    return true;
  };

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit = async (event) => {
    console.log("yes");
    let request = await userRequests.getUserInDatabase(
      this.state.username,
      this.state.password
    );
    console.log(request);
    if (request === 0) {
      this.setState({
        errorUsernameOnSubmit: true,
        username: "",
        password: "",
      });
    } else if (request === 1) {
      this.setState({ errorPasswordOnSubmit: true, password: "" });
    } else {
      Cookies.set("refresh", true);
      navigate(`/home`, { state: { username: this.state.username } });
    }
  };

  render() {
    let signUpButton;

    if (this.checkSignUp()) {
      signUpButton = (
        <Button
          onClick={this.handleSubmit}
          fullWidth
          variant="contained"
          color="primary"
          className="button-submit"
          value="Submit"
        >
          Sign In
        </Button>
      );
    } else if (!this.checkSignUp()) {
      signUpButton = (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className="button-submit"
          value="Submit"
          disabled
        >
          Log In
        </Button>
      );
    }

    return (
      <div className="bg" style={{ backgroundImage: "./../../assets/bg2.jpg" }}>
        <div
          role="tabpanel"
          hidden={this.props.value !== this.props.index}
          id={`full-width-tabpanel-${this.props.index}`}
          aria-labelledby={`full-width-tab-${this.props.index}`}
        >
          {this.props.value === this.props.index && (
            <Box p={3}>
              <Container minWidth="xs ">
                <form className="yes" style={root} autoComplete="off">
                  <div className="no" style={icon}>
                    <PersonIcon fontSize="large" style={iconPos} />
                    <TextField
                      required
                      onChange={this.onChangeUsername}
                      variant="outlined"
                      fullWidth
                      id="username"
                      label="Username"
                      name="username"
                      autoComplete="username"
                      value={this.state.username}
                      error={this.state.errorUsernameOnSubmit}
                    />
                  </div>
                  {this.state.errorUsernameOnSubmit && (
                    <div className="error" style={error}>
                      Unknown username
                    </div>
                  )}
                  <div className="no" style={icon}>
                    <VpnKeyIcon fontSize="large" style={iconPos} />
                    <TextField
                      required
                      onChange={this.onChangePassword}
                      variant="outlined"
                      fullWidth
                      id="password"
                      label="Password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      value={this.state.password}
                      error={this.state.errorPasswordOnSubmit}
                    />
                  </div>
                  {this.state.errorPasswordOnSubmit && (
                    <div className="error" style={error}>
                      Incorrect password
                    </div>
                  )}
                  <div className="pl" style={submit}>
                    {signUpButton}
                  </div>
                </form>
              </Container>
            </Box>
          )}
        </div>
      </div>
    );
  }
}

export default Login;
