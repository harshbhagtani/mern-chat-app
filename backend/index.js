const express = require("express");
require("./config/database");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

app.use(cors());
dotenv.config();

const connectDb = require("./config/database");
const path = require("path");
connectDb();
console.log(process.env.MONGO_URI);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chatterrrr.netlify.app/",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);

const port = process.env.PORT || 3001;

//-----------deployment----------------//

const __dirname1 = path.resolve();

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server running");
  });
}

//-----------deployment----------------//

io.on("connection", (socket) => {
  console.log(`A new user joined with socketId: ${socket.id}`);

  socket.on("setup", (user) => {
    console.log(user._id);
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (roomid) => {
    socket.join(roomid);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", { roomId: room });
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("callUser", ({ userToCall, signalData, from }) => {
    socket.in(userToCall).emit("callUser", { signal: signalData, from });
  });

  socket.on("answerCall", ({ to, signalData }) => {
    socket.in(to).emit("callAccepted", signalData);
  });

  socket.on("newMessageSend", (newMessage) => {
    const chat = newMessage?.chat;

    if (chat) {
      chat?.users.forEach((user) => {
        if (newMessage.sender._id == user._id) {
        } else {
          console.log(user._id);
          io.to(user._id).emit("messageRecieved", newMessage);
        }
      });
    }
  });
});

server.listen(port, () => {
  console.log(`server is up on port: ${port}`);
});
