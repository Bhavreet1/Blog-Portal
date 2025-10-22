const express = require("express");
const morgan = require("morgan");
const connectDB = require("./src/db/mongo");
const dotenv = require("dotenv");
const postRoutes = require("./src/routes/post.route");
const authRoutes = require("./src/routes/auth.route");
const cookieParser= require("cookie-parser");
dotenv.config();
const app = express();

//cookies
app.use(cookieParser());

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

app.post("/api", (req, res) => {
    res.status(200).send({ message: "api is working" });
})

app.get("/api", (req, res) => {
    res.render("index" , {message: "Welcome to Blog Portal"})
})

//routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
