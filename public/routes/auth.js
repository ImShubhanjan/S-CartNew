const router = require('express').Router();
const User = require('../models/User');
const cryptoJs = require('crypto-js');
//register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        //encrypt password
        password: cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
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
        !user && res.status(401).json("You have entered wrong credentials");

        const hashedPassword = cryptoJs.AES.decrypt(user.password, process.env.PASS_SECRET);
        const OriginalPassword = hashedPassword.toString(cryptoJs.enc.Utf8);
        //check the password matches or not
        OriginalPassword !== req.body.password && res.status(401).json("You have entered wrong credentials");
        //if everything is good, send status 200
        const{password, ...others} = user._doc;
        res.status(200).json(others);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router