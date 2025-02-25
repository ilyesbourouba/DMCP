const express = require("express");
const path = require("path");
// for the login system
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('./config/passport')(passport);
// hashing algorithm
const bcrypt = require('bcryptjs');

// for the Requests
const cors = require('cors');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(cors({
    origin: ['*'], // Replace with the frontend's domain
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
    allowedHeaders:'*', 
  }));

// setup the Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));

// setup sessions
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//setup static folder
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//setup routes
const loginRoutes = require("./routes/login");

app.use("/", loginRoutes);

//start the server
const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`Server Running on: ${process.env.HOST}${PORT}`)
);
