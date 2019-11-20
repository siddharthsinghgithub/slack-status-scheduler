import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import axios from "axios";

import { getStepContent } from "../steps";
import { steps, initialState } from "../../constants/data";
import { backendUrl } from "../../constants/common";
import { logEvent } from "../../utils/analytics";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddSchedule = ({
  data,
  setData,
  handleClose,
  open,
  userData,
  getSchedules
}) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {
    if (activeStep + 1 === steps.length) {
      await axios.post(`${backendUrl}/schedules/add`, {
        ...data,
        token: userData.token,
        userId: userData.id
      });
      setData(initialState);
      handleClose();
      setActiveStep(0);
      logEvent("SCHEDULES", "ADD_SCHEDULE");
      getSchedules();
    } else {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSetData = (field, value) => {
    setData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleSetScheduleActive = (day, value) => {
    setData(prevData => ({
      ...prevData,
      schedules: {
        ...prevData.schedules,
        [day]: {
          ...prevData.schedules[day],
          active: value
        }
      }
    }));
  };

  const handleSetScheduleDate = (day, startOrEnd, hour, minute) => {
    if (startOrEnd === "start") {
      setData(prevData => ({
        ...prevData,
        schedules: {
          ...prevData.schedules,
          [day]: {
            ...prevData.schedules[day],
            intervalStartHour: hour,
            intervalStartMinute: minute
          }
        }
      }));
    } else {
      setData(prevData => ({
        ...prevData,
        schedules: {
          ...prevData.schedules,
          [day]: {
            ...prevData.schedules[day],
            intervalEndHour: hour,
            intervalEndMinute: minute
          }
        }
      }));
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep !== steps.length && (
            <div>
              <Typography component="div" className={classes.instructions}>
                {getStepContent(
                  activeStep,
                  data,
                  handleSetData,
                  handleSetScheduleActive,
                  handleSetScheduleDate
                )}
              </Typography>
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions className={classes.actionButtons}>
        <Button onClick={handleClose}>Cancel</Button>
        <div>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            className={classes.backButton}
          >
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default AddSchedule;
