import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { Link, navigate } from "@reach/router";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonIcon from "@material-ui/icons/Person";
import userRequests from "../apiConnector";

const root = {
  marginTop: "3vh",
  margin: "1px",
  width: "50ch",
  alignItems: "center",
};

const icon = {
  marginTop: "2vh",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
};

const submit = {
  marginTop: "5vh",
};

const iconPos = {
  marginRight: "10px",
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",
      errorUsername: false,
      errorEmail: false,
      errorPassword: false,
    };

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
  }

  handleValidation = () => {
    if (this.state.email === "") {
      if (this.state.errorEmail === false) this.setState({ errorEmail: true });
    } else {
      if (this.state.errorEmail === true) this.setState({ errorEmail: false });
    }
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
    if (
      this.state.errorUsername ||
      this.state.errorEmail ||
      this.state.errorPassword
    )
      return true;
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

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  refreshPage() {
    userRequests.addUserDatabase(
      this.state.email,
      this.state.password,
      this.state.username
    );
    window.location.reload(true);
  }

  render() {
    let signUpButton;

    if (this.checkSignUp()) {
      signUpButton = (
        <Button
          onClick={() => this.refreshPage()}
          fullWidth
          variant="contained"
          color="primary"
          className="button-submit"
          value="Submit"
        >
          Sign Up
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
          Sign Up
        </Button>
      );
    }

    return (
      <div
        role="tabpanel"
        hidden={this.props.value !== this.props.index}
        id={`full-width-tabpanel-${this.props.index}`}
        aria-labelledby={`full-width-tab-${this.props.index}`}
      >
        {this.props.value === this.props.index && (
          <Box p={3}>
            <Container minWidth="xs">
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
                  />
                </div>
                <div className="no" style={icon}>
                  <AccountCircleIcon fontSize="large" style={iconPos} />
                  <TextField
                    required
                    onChange={this.onChangeEmail}
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={this.state.email}
                  />
                </div>
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
                  />
                </div>
                <div className="pl" style={submit}>
                  {signUpButton}
                </div>
              </form>
            </Container>
          </Box>
        )}
      </div>
    );
  }
}

export default SignUp;
