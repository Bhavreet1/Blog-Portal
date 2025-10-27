const express = require("express");
const morgan = require("morgan");
const connectDB = require("./src/db/mongo");
const dotenv = require("dotenv");
const postRoutes = require("./src/routes/post.route");
const authRoutes = require("./src/routes/auth.route");
const cookieParser = require("cookie-parser");
const path = require("path");
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
// serve static files from /public (so /app.js is accessible as /app.js)
app.use(express.static(path.join(__dirname, "public")));

// connect to db
connectDB();

app.post("/api", (req, res) => {
    res.status(200).send({ message: "api is working" });
})

app.get("/", (req, res) => {
    res.render("home" , {message: "Welcome to Blog Portal"})
})

//routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
