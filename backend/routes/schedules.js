const express = require("express");
const ObjectID = require("mongodb").ObjectID;
const router = express.Router();

const agenda = require("../lib/agenda");
const { mongoConnectionString, connectToDatabase } = require("../lib/common");

router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).send({ message: "No userId supplied" });
  }

  try {
    const db = await connectToDatabase(mongoConnectionString);
    const documents = await db
      .collection("agendaJobs")
      .find({
        "data.userId": userId
      })
      .toArray();

    const schedules = documents
      ? documents.map(d => ({
          id: d._id,
          intervalDay: d.data.intervalDay,
          intervalStartHour: d.data.intervalStartHour,
          intervalStartMinute: d.data.intervalStartMinute,
          intervalEndHour: d.data.intervalEndHour,
          intervalEndMinute: d.data.intervalEndMinute,
          statusText: d.data.statusText,
          statusEmoji: d.data.statusEmoji
        }))
      : [];
    res.status(200).send(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

router.post("/add", async (req, res) => {
  const {
    name,
    schedules,
    timezone,
    statusText,
    statusEmoji,
    dndEnabled,
    token,
    userId
  } = req.body;

  if (!(userId && token && timezone && name)) {
    res.status(400).send({ message: "Required params not supplied" });
  }

  const activeSchedules = Object.values(schedules).filter(
    s => s.active === true
  );

  if (!(activeSchedules && activeSchedules.length > 0)) {
    res.status(400).send({ message: "No active schedules supplied" });
  }

  const jobs = activeSchedules.map(schedule => {
    const {
      intervalDay,
      intervalStartMinute,
      intervalStartHour,
      intervalEndMinute,
      intervalEndHour
    } = schedule;
    const cron = `0 ${intervalStartMinute} ${intervalStartHour} * * ${intervalDay}`;
    const job = agenda.create("slack schedule", {
      userId,
      name,
      statusText,
      statusEmoji,
      dndEnabled,
      intervalDay,
      intervalStartMinute,
      intervalStartHour,
      intervalEndMinute,
      intervalEndHour,
      timezone,
      token
    });
    job.repeatEvery(cron, { timezone, skipImmediate: true });
    return job.save();
  });

  try {
    await Promise.all(jobs);
  } catch (e) {
    console.error("Error saving job to collection", e);
    res.status(500).send({});
  }
  res.status(201).send({});
});

router.post("/delete", async (req, res) => {
  const { id } = req.body;

  try {
    const db = await connectToDatabase(mongoConnectionString);
    await db
      .collection("agendaJobs")
      .deleteOne({ _id: new ObjectID(id.toString()) });

    res.sendStatus(200);
  } catch (e) {
    console.error("Error removing job from collection");
    res.sendStatus(500);
  }
});

module.exports = router;
