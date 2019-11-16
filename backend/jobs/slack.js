const differenceInMinutes = require("date-fns").differenceInMinutes;
const getUnixTime = require("date-fns").getUnixTime;
const parser = require("cron-parser");
const { WebClient } = require("@slack/web-api");

const web = new WebClient();

module.exports = agenda => {
  agenda.define("slack schedule", async job => {
    const {
      statusText,
      statusEmoji,
      dndEnabled,
      intervalStartMinute,
      intervalStartHour,
      intervalEndMinute,
      intervalEndHour,
      intervalDay,
      timezone,
      token
    } = job.attrs.data;

    const startingDate = new Date(
      `1970-01-01 ${intervalStartHour}:${intervalStartMinute}`
    );
    const endingDate = new Date(
      `1970-01-01 ${intervalEndHour}:${intervalEndMinute}`
    );
    const diffInMinutes = differenceInMinutes(endingDate, startingDate);

    let expirationEpoch = 0;
    try {
      const options = {
        currentDate: new Date(),
        tz: timezone
      };
      const endCron = `0 ${intervalEndMinute} ${intervalEndHour} * * ${intervalDay}`;
      const interval = parser.parseExpression(endCron, options);

      expirationEpoch = getUnixTime(new Date(interval.next()));
    } catch (err) {
      console.error("Parser error: " + err.message);
    }

    try {
      web.users.profile.set({
        profile: {
          status_text: statusText,
          status_emoji: statusEmoji,
          status_expiration: expirationEpoch
        },
        token
      });
    } catch (error) {
      console.error("profile set", error);
    }

    if (dndEnabled) {
      try {
        web.dnd.setSnooze({
          num_minutes: diffInMinutes,
          token
        });
      } catch (error) {
        console.error("set snooze", error);
      }
    }
  });
};
