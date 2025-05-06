/**
 * Routes for auth
 */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to database...");
});

// User model
const User = require("../models/User");

// Add a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Invalid input, send username and password" });
        }

        const user = await User.register(username, password);

        res.status(201).json({ message: "User created" });

    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ error: "Username already exists" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});


// Login user
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if(!username || !password) {
            return res.status(400).json({error: "Invalid input, send username and password"});
        }
        // Check credentials

        // Does user exist?
        const user = await User.findOne( {username });
        if(!user) {
            return res.status(401).json({ error : "Incorrect username/password!" });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(401).json({ error : "Incorrect username/password!" });
        } else {
            // create JWT
            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const response = {
                message: "User logged in!",
                token: token,
                created: user.created,
            }
            res.status(200).json({ response });
        }

    } catch(error) {
        res.status(500).json({ error: "Server error"});
    }
    console.log("Login called...");
});

module.exports = router;