// console.log("hello");

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const path = require('path');
dotenv.config();

const staticPath = path.join(__dirname);
const viewsPath = path.join(__dirname+"/templates/views");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));

mongoose.
    connect(process.env.MONGO_URL)
    .then(() => console.log("Db Connected"))
    .catch((err) => {
        console.log(err);
    });

// app.get("/api/test", () => {
//     console.log("Test Success");
// });
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req,res) => {
    res.render("login", {message: null});
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started at PORT `);
});