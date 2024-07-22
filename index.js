const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;

const paymentRoute = require("./routes/paymentRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/dashpayz", paymentRoute);

const server = app.listen(
    PORT,
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`),
);


mongoose.connect(MONGODB_URL).then(() => {
    console.log("DB CONNECTED..");
}).catch((err) => console.log(err));