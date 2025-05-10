/**
 * Routes för auktorisation
 */
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Anslut till MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
console.log("Ansluten till MongoDB");
}).catch((error) => {
    console.error("Problem vid anslutning till MongoDB...");
});

// User model
const User = require("../models/User");

// Add a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validera input
        if (!username || !password) {
            return res.status(400).json({ error: "Felaktig inmatning - ange både användarnamn och lösenord." });
        }

        const user = await User.register(username, password);

        res.status(201).json({ message: "Användare skapad" });

    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ error: "Användarnamn finns redan" });
        } else {
            res.status(500).json({ error: "Fel uppstod på servern" });
        }
    }
});


router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({error: "Felaktig inmatning - ange både användarnamn och lösenord."});
        }

        const user = await User.findOne( {username });
        if(!user) {
            return res.status(401).json({ error : "Ogiltigt användarnamn!" });
        }

        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch) {
            return res.status(401).json({ error : "Ogiltigt lösenord!" });
        } else {

            const payload = { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const response = {
                message: "Användare inloggad!",
                token: token,
                created: user.created,
            }
            res.status(200).json({ response });
        }

    } catch(error) {
        res.status(500).json({ error: "Fel uppstod på servern"});
    }
});

module.exports = router;