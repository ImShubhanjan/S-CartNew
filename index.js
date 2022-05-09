// console.log("hello");

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const path = require('path');
const User = require('./models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
dotenv.config();

const staticPath = path.join(__dirname);
const viewsPath = path.join(__dirname+"/templates/views");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));

mongoose.
    connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected!!!"))
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
    res.render("index", {status: "loggedOut"});
});

app.get("/register", (req,res) => {
    res.render("register", {message: null, status: "loggedOut"});
});

app.post("/register", async (req, res) => {
    if(req.body.password !== req.body.conpassword){
        res.render("register", {message: "Password doesn't Match!!"});
        return;
    }
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //encrypt password
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.render("register", {message: "User Added Successfully!!"});
        //res.status(201).json(savedUser);
    }
    catch (err) {
        res.render("register", {message: "User is already Registered!!"});
        //res.status(500).json(err);
    }
});

app.get("/login", (req,res) => {
    res.render("login", {message: null, status: "loggedOut"});
})

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        //check user exists or not
        if(!user){
            res.render("login", {message: "You have entered wrong credentialsuser", status: "loggedOut"})
            //res.status(401).json("You have entered wrong credentialsuser");
            return;
        }

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET);
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        //check the password matches or not
        if(OriginalPassword !== req.body.password){
            res.render("login", {message: "You have entered wrong credentials!!!!", status: "loggedOut"})
            //res.status(401).json("You have entered wrong credentials!!!!");
            return;
        }
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }); //after two days we would be able to use, we need to re login

        //if everything is good, send status 200
        const { password, ...others } = user._doc;
        res.render("index", {status: "loggedIn"});
        //res.status(201).json({ ...others, accessToken});
    }
    catch (err) {
        res.status(500).end();
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started at PORT 3000`);
});