const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const { server_start, mongoose_start } = require('./helpers/colorCLI')
require('dotenv').config();
const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Mongoose
mongoose.connect(
    process.env.MONGO_URI,
    () => console.log(mongoose_start('MongoDB Connected'))
);

// Routes
app.use('/auth', require('./routes/user.routes'))

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(server_start(`Server running on ${PORT} port`)));