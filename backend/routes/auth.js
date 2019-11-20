const express = require("express");
const { WebClient } = require("@slack/web-api");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, redirect_uri } = req.body;
  const web = new WebClient();
  try {
    const auth = await web.oauth.access({
      code,
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      redirect_uri
    });

    const userInfo = await web.users.profile.get({
      token: auth.access_token
    });
    res.status(200).send({
      id: auth.user_id,
      token: auth.access_token,
      email: userInfo.profile.email,
      image: userInfo.profile.image_24
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
