const express = require("express");
const path = require("path");
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('dotenv').config();

// Initialize Express App
const app = express();

// Passport Configuration
require('./config/passport')(passport);

// CORS Configuration
app.use(cors({
    origin: '*', // Adjust to your frontend domain if needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setup View Engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Support for JSON body parsing

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
const loginRoutes = require("./routes/login");
const productsRoutes = require("./routes/products");
const categoryRoutes = require("./routes/category");
const packsRoutes = require("./routes/packs");

app.use("/", loginRoutes);
app.use("/products", productsRoutes);
app.use("/category", categoryRoutes);
app.use("/packs", packsRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'http://localhost:';

app.listen(PORT, () => console.log(`Server Running on: ${HOST}${PORT}`));