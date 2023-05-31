const express = require('express');
const cors = require('cors');
const app = express();
const multer = require("multer");
const path = require('node:path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const videoRoute = require('./routes/video');
const userRoute = require('./routes/auth');
require('dotenv').config();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/auth', userRoute);
app.use('/api/videos', videoRoute);

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
