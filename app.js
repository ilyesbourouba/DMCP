const express = require("express");
const path = require("path");

const cors = require('cors');

const app = express();
require('dotenv').config();

app.use(cors());

app.use(cors({
    origin: ['https://streamsystem.com', 'https://streamapp.streamsystem.com/', 'http://127.0.0.1:3001/'], // Replace with your frontend's domain
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders:'*',
  }));
  
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));
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
