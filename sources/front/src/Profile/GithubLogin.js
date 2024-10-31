import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import iconGithub from "./../assets/icons/64/github.png";

function toQuery(params, delimiter = "&") {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;
    if (index < keys.length - 1) {
      query += delimiter;
    }
    return query;
  }, "");
}

function toParams(query) {
  const q = query.replace(/^\??\//, "");

  return q.split("&").reduce((values, param) => {
    const [key, value] = param.split("=");
    values[key] = value;
    return values;
  }, {});
}

const useStyle = makeStyles((theme) => ({
  listItem: {
    width: "45vh",
    marginBottom: "2vh",
    boxShadow: "2px 2px 3px rgba(150, 150, 150, 1)",
  },
  serviceName: {
    fontSize: "2.5vh",
    marginLeft: "4vh",
  },
}));

class PopupWindow {
  constructor(id, url, options = {}) {
    this.id = id;
    this.url = url;
    this.options = options;
  }

  open() {
    const { url, id, options } = this;
    this.window = window.open(url, id, toQuery(options, ","));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this._iid = window.setInterval(() => {
        try {
          const popup = this.window;
          if (!popup || popup.closed !== false) {
            this.close();
            reject(new Error("The popup was closed"));
            return;
          }
          if (
            popup.location.href === this.url ||
            popup.location.pathname === "blank"
          ) {
            return;
          }
          const params = toParams(popup.location.search.replace(/^\?/, ""));
          resolve(params);
          this.close();
        } catch (error) {}
      }, 500);
    });
  }

  cancel() {
    if (this._iid) {
      window.clearInterval(this._iid);
      this._iid = null;
    }
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.then(...args);
  }

  static open(...args) {
    const popup = new this(...args);
    popup.open();
    popup.poll();
    return popup;
  }
}

export default function GithubLogin(props) {
  const { clientId, onSuccess, onFailure } = props;
  const scope = "user:email";

  const makeRequest = () => {
    const search = toQuery({
      clientId: clientId,
      scope: scope,
      redirectUri: "http://localhost:3000/",
    });
    const popup = PopupWindow.open(
      "github-oauth-authorize",
      `https://github.com/login/oauth/authorize?scope=${scope}&client_id=${clientId}`,
      { height: 600, width: 600 }
    );
    popup.then(
      (data) => onSuccess(data),
      (error) => onFailure(error)
    );
  };

  const classes = useStyle();
  return (
    <ListItem
      variant="outlined"
      button
      onClick={() => makeRequest()}
      className={classes.listItem}
    >
      <ListItemIcon>
        <img src={iconGithub} />
      </ListItemIcon>
      <ListItemText
        disableTypography
        className={classes.serviceName}
        primary="Github"
      />
    </ListItem>
  );
}
