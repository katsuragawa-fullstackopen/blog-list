// import packages
const http = require("http");

// import modules
const app = require("./app");
const { PORT } = require("./utils/config");
const { info } = require("./utils/logger");

// create server and run
const server = http.createServer(app);
server.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
