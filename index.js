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
const BoysProduct = require('./models/BoysProduct');
const GirlsProduct = require('./models/GirlsProduct');
const KidsProduct = require('./models/KidsProduct');
const GiftsProduct = require('./models/GiftsProduct');
dotenv.config();

const staticPath = path.join(__dirname);
const viewsPath = path.join(__dirname + "/templates/views");

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
    const items = await Product.find({ category: "sample" });
    if (!req.cookies.jwt) {
        return res.render("index", { status: "loggedOut", items: items, quantity: null });
    }
    const userCart = await Cart.find({ username: req.cookies.username });
    if (userCart[0] == undefined) {
        return res.render("index", { status: "loggedIn", items: items, quantity: null })
    }
    const cartQuantity = userCart[0].products.length;
    res.render("index", { status: "loggedIn", items: items, quantity: cartQuantity })
});

//boys ----------------------------------------------------
app.get("/boys", async (req, res) => {
    const boysItems = await Product.find({ category: "boys" });
    if (!req.cookies.jwt) {
        return res.render("boys", { status: "loggedOut", boysItems: boysItems });
    }
    const userCart = await Cart.find({ username: req.cookies.username });
    //console.log(userCart)
    if (userCart.length == 0) {
        return res.render("boys", { status: "loggedIn", boysItems: boysItems, quantity: null });
    }
    const cartQuantity = userCart[0].products.length;
    res.render("boys", { status: "loggedIn", boysItems: boysItems, quantity: cartQuantity });
});

app.post("/addproductforboys", async (req, res) => {
    try {
        const boysproduct = new Product({
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            itemPrice: req.body.itemPrice,
            category: "boys"
        });

        await boysproduct.save();
        res.status(201).send("Boys Item Added Successfully");
    }
    catch (err) {
        res.status(500).send("Something went Wrong");
    }
});

// app.post("/deleteproductfromboys", async (req,res) => {
//     try {
//         const deleteBoy = new BoysProduct({
//             itemName: req.body.itemName
//         });
//         await deleteBoy.deleteOne();
//         res.status(201).send(`Deleted ${deleteBoy}`);
//     }
//     catch(err) {
//         res.status(500).send("Something went Wrong");
//     }
// });
//-----------------------------------------------------------

//girls-------------------------------------------------
app.get("/girls", async (req, res) => {
    const girlsItems = await Product.find({ category: "girls" });
    if (!req.cookies.jwt) {
        return res.render("girls", { status: "loggedOut", girlsItems: girlsItems });
    }
    const userCart = await Cart.find({ username: req.cookies.username });
    if (userCart.length == 0) {
        return res.render("girls", { status: "loggedIn", girlsItems: girlsItems, quantity: null });
    }
    const cartQuantity = userCart[0].products.length;
    res.render("girls", { status: "loggedIn", girlsItems: girlsItems, quantity: cartQuantity });
});

app.post("/addproductforgirls", async (req, res) => {
    try {
        const girlsproduct = new Product({
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            itemPrice: req.body.itemPrice,
            category: "girls"
        });
        await girlsproduct.save();
        res.status(201).send("Girls Item added Successfully");
    }
    catch (err) {
        res.status(500).send("Something went wrong!");
    }
});
//-----------------------------------------------------
//kids-------------------------------------------------
app.get("/kids", async (req, res) => {
    const kidsItems = await Product.find({ category: "kids" });
    if (!req.cookies.jwt) {
        return res.render("kids", { status: "loggedOut", kidsItems: kidsItems });
    }
    const userCart = await Cart.find({ username: req.cookies.username });
    if (userCart.length == 0) {
        return res.render("kids", { status: "loggedIn", kidsItems: kidsItems, quantity: null });
    }
    const cartQuantity = userCart[0].products.length;
    res.render("kids", { status: "loggedIn", kidsItems: kidsItems, quantity: cartQuantity });
});

app.post("/addproductforkids", async (req, res) => {
    try {
        const kidsproducts = new Product({
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            itemPrice: req.body.itemPrice,
            category: "kids"
        });
        await kidsproducts.save();
        res.status(201).send("Kids Item added Successfully");
    }
    catch (err) {
        res.status(500).send("Something went wrong!");
    }
});
//-------------------------------------------------------------
//gifts-------------------------------------------------------
app.get("/gifts", async (req, res) => {
    const giftsItems = await Product.find({ category: "gifts" });
    if (!req.cookies.jwt) {
        return res.render("gifts", { status: "loggedOut", giftsItems: giftsItems });
    }
    const userCart = await Cart.find({ username: req.cookies.username });
    if (userCart.length == 0) {
        return res.render("gifts", { status: "loggedIn", giftsItems: giftsItems, quantity: null });
    }
    const cartQuantity = userCart[0].products.length;
    res.render("gifts", { status: "loggedIn", giftsItems: giftsItems, quantity: cartQuantity });
});

app.post("/addproductforgifts", async (req, res) => {
    try {
        const giftsproducts = new Product({
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            itemPrice: req.body.itemPrice,
            category: "gifts"
        });
        await giftsproducts.save();
        res.status(201).send("Gift Item added Successfully");
    }
    catch (err) {
        res.status(500).send("Something went wrong!");
    }
});
//------------------------------------------------------------

app.get("/register", (req, res) => {
    if (!req.cookies.jwt) {
        return res.render("register", { message: null, status: "loggedOut", quantity: null });
    }
    res.redirect("/");
});

app.post("/register", async (req, res) => {
    if (req.body.password !== req.body.conpassword) {
        res.render("register", { message: "Password doesn't Match!!", status: "loggedOut", quantity: null });
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
        res.render("register", { message: "User Added Successfully!!", status: "loggedOut", quantity: null });
        //res.status(201).json(savedUser);
    }
    catch (err) {
        res.render("register", { message: "User is already Registered!!", status: "loggedOut", quantity: null });
        //res.status(500).json(err);
    }
});

app.get("/login", (req, res) => {
    if (!req.cookies.jwt) {
        return res.render("login", { message: null, status: "loggedOut", quantity: null });
    }
    res.redirect("/");
})

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        //check user exists or not
        if (!user) {
            res.render("login", { message: "You have entered Wrong Credentials", status: "loggedOut", quantity: null })
            //res.status(401).json("You have entered wrong credentialsuser");
            return;
        }

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET);
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        //check the password matches or not
        if (OriginalPassword !== req.body.password) {
            res.render("login", { message: "You have entered Wrong Credentials", status: "loggedOut", quantity: null })
            //res.status(401).json("You have entered wrong credentials!!!!");
            return;
        }
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }); //after two days we can't use, we need to re login

        res.cookie("jwt", accessToken, { expires: new Date(Date.now() + 253402300000000), httpOnly: true });
        res.cookie("username", req.body.username, { expires: new Date(Date.now() + 253402300000000), httpOnly: true });

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
    try {
        const product = new Product({
            itemName: req.body.itemName,
            itemImage: req.body.itemImage,
            itemPrice: req.body.itemPrice,
            category: "sample"
        });

        await product.save();
        res.status(201).send("Item Added Successfully");
    }
    catch (err) {
        res.status(500).send("Something went Wrong");
    }
});

app.post("/addtocart/:itemid", async (req, res) => {
    const itemId = req.params.itemid;
    try {
        const query = await User.find({ username: req.cookies.username });
        const userCart = await Cart.findOne({ username: query[0].username });
        // console.log(userCart);
        if (userCart == null) {
            const cart = new Cart({
                username: query[0].username
            })
            const userCart1 = await cart.save();
            const product = new Products({
                productId: itemId
            })
            userCart1.products.push(product);
            await userCart1.save();
        } else {
            const product = new Products({
                productId: itemId
            });
            userCart.products.push(product);
            await userCart.save();
        }
        res.redirect("/");
    }
    catch (err) {
        console.log(err);
    }
});

app.get("/cart", async (req, res) => {
    if (!req.cookies.jwt) {
        return res.redirect("/")
    }
    const userCart = await Cart.find({ username: req.cookies.username });
    if (userCart.length == 0) {
        return res.render("cart", { status: "loggedIn", quantity: null });
    }
    const cartQuantity = userCart[0].products.length;

    let cart = [];
    const getProductDetails = async (productId) => {
        const productDetail = await Product.find({ _id: productId });
        let obj = {
            name: productDetail[0].itemName,
            image: productDetail[0].itemImage,
            price: productDetail[0].itemPrice
        };
        return obj;
    }
    const newFunc = async () => {
        for (let i = 0; i < userCart[0].products.length; i++) {
            const productId = userCart[0].products[0].productId;
            const details = await getProductDetails(productId);
            cart = [
                ...cart,
                details
            ]
        }
    }
    newFunc();
    console.log(cart);
    return res.render("cart", { status: "loggedIn", quantity: cartQuantity, products: cart });
})

app.get("/logout", (req, res) => {
    res.clearCookie("jwt");
    res.clearCookie("username");
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started at PORT 3000`);
});