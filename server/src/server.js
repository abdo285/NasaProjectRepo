const http = require("http");
const PORT = process.env.PORT || 8080;
require("dotenv").config();
const { mongoConnect } = require("./services/mongo");
const app = require("./app.js");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");
// Create a server object:
const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  // Set up our server so it will listen on the port
  server.listen(PORT, function (error) {
    // Checking any error occur while listening on port
    if (error) {
      console.log("Something went wrong", error);
    }
    // Else sent message of listening
    else {
      console.log("Server is listening on port " + PORT);
    }
  });
};
startServer();
