import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { io } from "../app.js";
import {transporter} from './user.controller.js'
import dotenv from "dotenv";

dotenv.config();



// Function to check and send reminders
const checkReminders = async () => {
  try {
    
    const currentTime = new Date();
    const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000); // 1 min ago
    
    // Convert to ISO string format up to minutes precision
    const currentTimeISO = currentTime.toISOString().slice(0, 16);
    const oneMinuteAgoISO = oneMinuteAgo.toISOString().slice(0, 16);
    
    const notes = await Note.find({ 
      reminder: { 
        $lte: currentTimeISO 
      } 
    });
    console.log('notes sendReminderwale');
    console.log(notes);
    
    for (const note of notes) {
      const userId = note.userId;

      // Check if user is online
      if (io.sockets.adapter.rooms.get(userId)) {
        // Send real-time notification
        io.to(userId).emit("reminder", {
          message: `Reminder: ${note.title}`,
          noteId: note._id
        });
        console.log('if ',note);
      } else {
        // Send email notification
        console.log('else ',note);
        
        const user = await User.findById(userId);
        if (user) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reminder Alert",
            text: `You have a reminder: ${note.title}`
          });
        }
      }

      // Optional: Remove reminder after sending
      await Note.findByIdAndUpdate(note._id, { $unset: { reminder: 1 } });
    }
  } catch (error) {
    console.error("Error checking reminders:", error);
  }
};

// Run reminder check every minute
// setInterval(checkReminders, 10000);
