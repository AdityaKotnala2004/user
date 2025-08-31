const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");
const port = process.env.PORT || 3000;

const server = http.createServer(app);
require("dotenv").config();
initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
