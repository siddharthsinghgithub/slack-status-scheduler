import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/router";
import Link from "next/link";

import Navbar from "../components/navbar";
import { initialState } from "../constants/data";
import { backendUrl, slackRedirectUrl } from "../constants/common";
import AddScheduleDialog from "../components/dialogs/addSchedule";

const useStyles = makeStyles(theme => ({
  schedules: { margin: "10px", padding: "20px" },
  schedule: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  instructions: {
    padding: "20px",
    margin: "10px 0px"
  }
}));

const Home = () => {
  const classes = useStyles();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [data, setData] = React.useState(initialState);
  const [userData, setUserData] = React.useState({});
  const [schedules, setSchedules] = React.useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserData(JSON.parse(userData));
    }
    getToken();
    const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (currentTimezone) {
      setData(prevData => ({ ...prevData, timezone: currentTimezone }));
    }
  }, []);

  useEffect(() => {
    getSchedules();
  }, [userData]);

  const getSchedules = async () => {
    if (!(userData && userData.email)) {
      return;
    }
    try {
      const { data } = await axios.get(
        `${backendUrl}/schedules?userId=${userData.id}`
      );
      setSchedules(data);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const getToken = async () => {
    if (!window) {
      return;
    }
    const { code } = qs.parse(window.location.search);
    if (!code) {
      return;
    }

    router.replace("/");

    try {
      const response = await axios.post(`${backendUrl}/auth`, {
        code,
        redirect_uri: slackRedirectUrl
      });
      const userData = response.data;
      setUserData(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const removeSchedule = async id => {
    if (!id) {
      return;
    }
    try {
      await axios.post(`${backendUrl}/schedules/delete`, {
        id
      });
      getSchedules();
    } catch (error) {
      console.error("error:", error);
    }
  };

  const logout = () => {
    setUserData();
    localStorage.removeItem("user");
  };

  return (
    <React.Fragment>
      <Navbar userData={userData} logout={logout} />
      <div className={classes.schedules}>
        {userData && userData.email ? (
          <React.Fragment>
            <div className={classes.schedule}>
              <Typography variant="h5" component="h3">
                Schedules
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
              >
                Add
              </Button>
            </div>
            <List component="nav" aria-label="secondary mailbox folders">
              {schedules &&
                schedules.map(schedule => (
                  <ListItem key={schedule.id}>
                    <ListItemText primary={`Day: ${schedule.intervalDay}`} />
                    <ListItemText
                      primary={`Start: ${schedule.intervalStartHour}:${schedule.intervalStartMinute}`}
                    />
                    <ListItemText
                      primary={`End: ${schedule.intervalEndHour}:${schedule.intervalEndMinute}`}
                    />
                    <ListItemText primary={`Status: ${schedule.statusText}`} />
                    <ListItemText primary={`Emoji: ${schedule.statusEmoji}`} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeSchedule(schedule.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </React.Fragment>
        ) : (
          <div>
            <Paper className={classes.instructions}>
              <Typography variant="h6">
                In this Slack app, you can set a schedule to automatically
                update status on Slack. <br /> Schedule deep work time or let
                your friends know that you are working remotely.
              </Typography>
              <Divider />
              <br />
              <Typography variant="subtitle2">
                You can create a new schedule by clicking on the add button and
                following a three-step process:
              </Typography>
              <ul>
                <li>1. add a name</li>
                <li>2. select active hours when the status is displayed</li>
                <li>3. choose the status text and emoji.</li>
              </ul>
            </Paper>
          </div>
        )}
        <Link href="/about">
          <a>About Page</a>
        </Link>
      </div>
      <AddScheduleDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        data={data}
        setData={setData}
        handleClose={handleDialogClose}
        userData={userData}
        getSchedules={getSchedules}
      />
    </React.Fragment>
  );
};

export default Home;
