const MongoClient = require("mongodb").MongoClient;
const url = require("url");
const Sentry = require("@sentry/node");

let cachedDb = null;

const mongoConnectionString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV;

const connectToDatabase = async uri => {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db(url.parse(uri).pathname.substr(1));

  cachedDb = db;
  return db;
};

const initSentry = () => {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  Sentry.init({
    dsn: process.env.SENTRY_BACKEND_DSN
  });
};

module.exports = {
  mongoConnectionString,
  connectToDatabase,
  initSentry
};
