const router = require('express').Router();

//register

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