import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./Routes/userRoutes.js";
import messageRoutes from "./Routes/MessagesRoutes.js";
import connectDB from "./db.js";
import { Server } from "socket.io";
dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Api working");
});

app.use("/api/auth", usersRoutes);
app.use("/api/message", messageRoutes);
const server = app.listen(port, () => {
  console.log(`Server connected to port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "https://chatboxfr.netlify.app",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
      
      if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-received", data.message);
    }
  });
});
