import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { slackRedirectUrl } from "../constants/common";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

const Navbar = ({ userData, logout }) => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Status Scheduler for Slack
        </Typography>
        {userData && userData.user && userData.user.name ? (
          <React.Fragment>
            <div>{`Welcome, ${userData.user.name}`}</div>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
          </React.Fragment>
        ) : (
          <div>
            <a
              href={`https://slack.com/oauth/authorize?scope=identity.basic&client_id=794589365041.801038089205s&redirect_uri=${slackRedirectUrl}`}
            >
              <img src="https://api.slack.com/img/sign_in_with_slack.png" />
            </a>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
