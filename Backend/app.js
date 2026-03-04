import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import { Note } from "./models/note.model.js";
import { User } from "./models/user.model.js";
import { transporter } from "./controllers/user.controller.js";

const app = express();
const server = http.createServer(app);

// Enable CORS for Express
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Initialize Socket.io with proper CORS settings
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowed origins list
    methods: ["GET", "POST"],
  },
});


// Store active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  
  socket.on("user-online", (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} is now online.`);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} went offline.`);
        break;
      }
    }
  });

  socket.on("join-note-room", (noteId) => {
    socket.join(noteId);
  });

  socket.on("note-update", (note) => {
    io.to(note._id).emit("note-update", note);
  });
});

// Function to check reminders
const checkReminders = async () => {
  try {
    const currentTime = new Date();
    const notes = await Note.find({ reminder: { $lte: currentTime } });

    for (const note of notes) {
      const userId = note.userId.toString();
      const socketId = activeUsers.get(userId);

      if (socketId) {
        io.to(socketId).emit("reminder", note);
      } else {
        const user = await User.findById(userId);
        if (user) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reminder Alert",
            text: `You have a reminder: ${note.title}`,
          });
        }
      }

      await Note.findByIdAndUpdate(note._id, { $unset: { reminder: 1 } });
    }
  } catch (error) {
    console.error("Error checking reminders:", error);
  }
};
setInterval(checkReminders, 10000);

// Routes
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";

app.use("/user", userRouter);
app.use("/admin", adminRouter);

export { app, server, io };
