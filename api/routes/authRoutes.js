const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/register", async (req, res) => {
    const name = req.body.name.toLowerCase();
    const email = req.body.email.toLowerCase();
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
        return res
            .status(401)
            .json({ message: "Name or email has already been taken" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "Success" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.PASSPORTSECRET,
            { expiresIn: 86400 }
        );

        res.json({ message: "Success", token: `Bearer ${token}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
