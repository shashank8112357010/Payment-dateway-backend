const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;

const paymentRoute = require("./routes/paymentRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/dashpayz", paymentRoute);
app.use("/dashpayz/user", userRoute);

const server = app.listen(
    PORT,
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`),
);


mongoose.connect(MONGODB_URL).then(() => {
    console.log("DB CONNECTED..");
}).catch((err) => console.log(err));