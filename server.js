const express = require("express");
const morgan = require("morgan");
const connectDB = require("./src/db/mongo");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
//logger
app.use(morgan("dev"));
//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//ejs
app.set("views", "./src/views");
app.set("view engine", "ejs");

// connect to db
connectDB();

app.post("/", (req, res) => {
    res.status(200).send({ message: "api is working" });
})

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

module.exports = app;
