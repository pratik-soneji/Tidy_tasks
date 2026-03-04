// // import express from 'express'
// import { connectDB } from './db/db.js'
// import dotenv from 'dotenv';
// import { io } from './app.js';

// dotenv.config()
// const PORT = process.env.PORT || 5001

// connectDB()
//   .then(() => {
//     io.listen(PORT, () => {
//       console.log('app at http://localhost:' + PORT);
//     })
//   })
//   .catch(err => console.log('mongo connection err ', err)
//   );

import { connectDB } from './db/db.js';
import dotenv from 'dotenv';
import { server } from './app.js';

import "./controllers/sendReminder.js";

dotenv.config();

const PORT = process.env.PORT || 5001;



// Start Server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.log('Mongo connection error:', err));