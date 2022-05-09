const User = require('../models/User');
const { verifyToken, verifyTokenAndAuthorize } = require('./verifyToken');

const router = require('express').Router();

router.put("/:id", verifyTokenAndAuthorize, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SECRET
            ).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id, 
                {
                $set: req.body,
            }, 
            { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
});



module.exports = router




// //get method
// router.get("/usertest", (req, res) => {
//     res.send("user test");
// });
// //post method
// router.post("/userposttest", (req,res) => {
//     const username = req.body.username;
//     const email = req.body.email;
//     // console.log(username);
//     res.send(`The Username is ${username} with email id ${email}`);
// });
