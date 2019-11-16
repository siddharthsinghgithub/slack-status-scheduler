const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Status Scheduler for Slack API");
});

module.exports = router;
