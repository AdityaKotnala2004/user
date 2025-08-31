require("dotenv").config();
const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// Debug: Check environment variables
console.log('🔧 Environment Variables Check:');
console.log('🔧 PORT:', process.env.PORT);
console.log('🔧 GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? `${process.env.GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
console.log('🔧 JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT FOUND');
console.log('🔧 DB_CONNECT:', process.env.DB_CONNECT ? 'SET' : 'NOT FOUND');

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
