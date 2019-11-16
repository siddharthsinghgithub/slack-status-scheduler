import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import { KeyboardTimePicker } from "@material-ui/pickers";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "emoji-mart/css/emoji-mart.css";
import { Emoji, Picker } from "emoji-mart";

import timezones from "../constants/timezones";
import { days } from "../constants/data";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export function getStepContent(
  stepIndex,
  data,
  setData,
  setScheduleActive,
  setScheduleDate
) {
  const classes = useStyles();

  const handleDateChange = (day, startOrEnd, value) => {
    if (value) {
      const [hh, mm] = value.split(":");
      setScheduleDate(day, startOrEnd, hh, mm);
    }
  };

  const handleSetActive = key => event => {
    setScheduleActive(key, event.target.checked);
  };

  switch (stepIndex) {
    case 0:
      return (
        <React.Fragment>
          <TextField
            id="standard-basic"
            value={data.name}
            label="Name"
            margin="normal"
            onChange={e => setData("name", e.target.value)}
          />
        </React.Fragment>
      );
    case 1:
      return (
        <div>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Timezone</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.timezone}
                onChange={e => setData("timezone", e.target.value)}
              >
                {timezones.map(timezoneKey => (
                  <MenuItem key={timezoneKey} value={timezoneKey}>
                    {timezoneKey}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            {days.map(day => {
              const shh = data.schedules[day.key].intervalStartHour;
              const ehh = data.schedules[day.key].intervalEndHour;
              const smm = data.schedules[day.key].intervalStartMinute;
              const emm = data.schedules[day.key].intervalEndMinute;
              const sdate = new Date(`1970-01-01 ${shh}:${smm}:00`);
              const edate = new Date(`1970-01-01 ${ehh}:${emm}:00`);
              return (
                <FormControl className={classes.formControl} key={day.key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={data.schedules[day.key].active}
                        value="day"
                        onChange={handleSetActive(day.key)}
                      />
                    }
                    label={day.key}
                  />
                  <KeyboardTimePicker
                    set="apple"
                    margin="normal"
                    id="time-picker"
                    label="Start"
                    value={sdate}
                    onChange={(e, value) =>
                      handleDateChange(day.key, "start", value)
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                    ampm={false}
                  />
                  <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="End"
                    value={edate}
                    onChange={(e, value) =>
                      handleDateChange(day.key, "end", value)
                    }
                    KeyboardButtonProps={{
                      "aria-label": "change time"
                    }}
                    ampm={false}
                  />
                </FormControl>
              );
            })}
          </div>
        </div>
      );
    case 2:
      return (
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">
              Do Not Disturb
            </InputLabel>
            <Switch
              checked={data.dndEnabled}
              value="dndEnabled"
              inputProps={{ "aria-label": "secondary checkbox" }}
              onChange={(e, checked) => setData("dndEnabled", checked)}
            />
            <TextField
              id="standard-basic"
              label="Status Text"
              margin="normal"
              value={data.statusText}
              onChange={e => setData("statusText", e.target.value)}
            />
            <div>
              Emoji:
              <span
                dangerouslySetInnerHTML={{
                  __html: Emoji({
                    html: true,
                    emoji: data.statusEmoji,
                    set: "apple",
                    size: 24
                  })
                }}
              ></span>
            </div>
            <Picker
              recent={[""]}
              onSelect={e => setData("statusEmoji", e.colons)}
            />
          </FormControl>
        </div>
      );
    default:
      return "Unknown stepIndex";
  }
}
