const createError = require("http-errors");
const Agendash = require("agendash");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const basicAuth = require("express-basic-auth");
require("dotenv").config();
const helmet = require("helmet");

const indexRouter = require("./routes/index");
const schedulesRouter = require("./routes/schedules");
const authRouter = require("./routes/auth");
const agenda = require("./lib/agenda");
const { initSentry } = require("./lib/common");

initSentry();

const app = express();
app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.json());

app.use(helmet());
app.use(
  "/dash",
  basicAuth({
    users: {
      [process.env.DASH_USERNAME]: process.env.DASH_PASSWORD
    },
    challenge: true
  }),
  Agendash(agenda)
);
app.use("/", indexRouter);
app.use("/schedules", schedulesRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
