import http from "http";
import app from "./app.js";
import cloudinary from "cloudinary";
import { setupChatSocket } from "./config/chatSocket.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const server = http.createServer(app);

setupChatSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server live`);
});
