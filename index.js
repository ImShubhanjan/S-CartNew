// console.log("hello");

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const path = require('path');
const User = require('./models/User');
const Product = require("./models/Product");
const { Products, Cart } = require("./models/Cart");
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
dotenv.config();

const staticPath = path.join(__dirname);
const viewsPath = path.join(__dirname+"/templates/views");

app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(cookieParser());
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

app.get("/", async (req, res) => {
    // const items = [
    //     {
    //         itemId: "001",
    //         itemImage: "public/img/bag1.jpg",
    //         itemName: "Item1",
    //         itemPrice: "75"
    //     },
    //     {
    //         itemId: "002",
    //         itemImage: "public/img/bag2.jpg",
    //         itemName: "Item2",
    //         itemPrice: "75"
    //     },
    //     {
    //         itemId: "003",
    //         itemImage: "public/img/bag3.jpg",
    //         itemName: "Item3",
    //         itemPrice: "75"
    //     },
    //     {
    //         itemId: "004",
    //         itemImage: "public/img/bag4.jpg",
    //         itemName: "Item4",
    //         itemPrice: "75"
    //     }
    // ]
    const items = await Product.find();
    if(!req.cookies.jwt){
        return res.render("index", {status: "loggedOut", items: items});
    }
    res.render("index", {status: "loggedIn", items: items})
});

app.get("/register", (req,res) => {
    if(!req.cookies.jwt){
        return res.render("register", {message: null, status: "loggedOut"});
    }
    res.redirect("/");
});

app.post("/register", async (req, res) => {
    if(req.body.password !== req.body.conpassword){
        res.render("register", {message: "Password doesn't Match!!", status: "loggedOut"});
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
        res.render("register", {message: "User Added Successfully!!", status: "loggedOut"});
        //res.status(201).json(savedUser);
    }
    catch (err) {
        res.render("register", {message: "User is already Registered!!", status: "loggedOut"});
        //res.status(500).json(err);
    }
});

app.get("/login", (req,res) => {
    if(!req.cookies.jwt){
        return res.render("login", {message: null, status: "loggedOut"});
    }
    res.redirect("/");
})

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        //check user exists or not
        if(!user){
            res.render("login", {message: "You have entered Wrong Credentials", status: "loggedOut"})
            //res.status(401).json("You have entered wrong credentialsuser");
            return;
        }

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET);
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        //check the password matches or not
        if(OriginalPassword !== req.body.password){
            res.render("login", {message: "You have entered Wrong Credentials", status: "loggedOut"})
            //res.status(401).json("You have entered wrong credentials!!!!");
            return;
        }
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }); //after two days we can't use, we need to re login

        res.cookie("jwt", accessToken, { expires:new Date(Date.now() + 253402300000000), httpOnly:true });
        res.cookie("username", req.body.username, { expires:new Date(Date.now() + 253402300000000), httpOnly:true });

        //if everything is good, send status 200
        const { password, ...others } = user._doc;
        res.redirect("/");
        //res.status(201).json({ ...others, accessToken});
    }
    catch (err) {
        res.status(500).end();
    }
});

app.post("/addproduct", async (req, res) => {
    try{
        const product = new Product({
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            itemPrice: req.body.itemPrice
        });
    
        await product.save();
        res.status(201).send("Item Added Successfully");
    }
    catch(err){
        res.status(500).send("Something went Wrong");
    }

});

app.post("/addtocart/:itemid", async (req, res) => {
    const itemId = req.params.itemid;
    try{
        const query = await User.find({username: req.cookies.username});
        const userCart = await Cart.findOne({username: query[0].username});
        // console.log(userCart);
        if(userCart == null){
            const cart = new Cart({
                username: query[0].username
            })
            const userCart1 = await cart.save();
            const product = new Products({
                productId: itemId
            })
            userCart1.products.push(product);
            await userCart1.save();
        }else{
            const product = new Products({
                productId: itemId
            });
            userCart.products.push(product);
            await userCart.save();
        }
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }

})

app.get("/logout", (req,res) => {
    res.clearCookie("jwt");
    res.clearCookie("username");
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started at PORT 3000`);
});