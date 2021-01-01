require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 2500;

// Routes
const authenticationRoutes = require("./Routes/authentication");
const userRoutes = require("./Routes/user");
const conversationRoutes = require("./Routes/conversation");

// Database Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch(() => {
    console.log("Database connection failed");
  });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use("/chat", authenticationRoutes);
app.use("/chat", userRoutes);
app.use("/chat", conversationRoutes);

// Listening to server
app.listen(port, () => {
  console.log(`ChatArc is running at ${port}`);
});
