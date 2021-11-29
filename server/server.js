const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const multer = require('multer');
const { server_start, mongoose_start } = require('./helpers/colorCLI')
require('dotenv').config();

const app = express();

// Image Storage
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // Windows doesn't accept ":" in filenames
        cb(null, new Date().getTime() + ' - ' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === "image/jpeg"){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: diskStorage, fileFilter}).single('myImage'));

// Mongoose
mongoose.connect(
    process.env.MONGO_URI,
    () => console.log(mongoose_start('MongoDB Connected'))
);

// Routes
app.use('/auth', require('./routes/user.routes'))
app.use('/collection', require('./routes/collection.routes'))

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(server_start(`Server running on ${PORT} port`)));