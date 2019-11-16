const express = require("express");
const { WebClient } = require("@slack/web-api");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, redirect_uri } = req.body;
  const web = new WebClient();
  try {
    const token = await web.oauth.access({
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri
    });
    res.status(200).send(token);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
