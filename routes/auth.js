const router = require('express').Router();
const User = require('../models/User');
const CryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
//register
router.post("/register", async (req, res) => {
    if(req.body.password !== req.body.conpassword){
        res.render("login", {message: "Password doesn't Match!!"});
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
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//login 

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        //check user exists or not
        !user && res.status(401).json("You have entered wrong credentialsuser");

        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET);
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        //check the password matches or not
        OriginalPassword !== req.body.password && res.status(401).json("You have entered wrong credentials!!!!");
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SECRET_KEY,
            { expiresIn: "2d" }); //after two days we would be able to use, we need to re login

        //if everything is good, send status 200
        const { password, ...others } = user._doc;
        res.status(201).json({ ...others, accessToken});
    }
    catch (err) {
        res.status(500).end();
    }
});

module.exports = router