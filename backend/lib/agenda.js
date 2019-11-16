const Agenda = require("agenda");

const { mongoConnectionString } = require("./common");

const connectionOpts = {
  db: { address: mongoConnectionString, collection: "agendaJobs" }
};

const agenda = new Agenda(connectionOpts);
const jobTypes = ["slack"];

jobTypes.forEach(type => {
  require("../jobs/" + type)(agenda);
});

if (jobTypes.length) {
  agenda.start();
}

module.exports = agenda;
