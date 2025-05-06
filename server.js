/** 
 * TestApplikation för registrering och inloggning
 */
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.use(cors());

// Routes
app.use("/api", authRoutes);

// Protected routes
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: `Välkommen ${req.user.username}` });
});

// Validate Token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Not authorized for this route - token missing!" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Not valid JWT" });
        }

        // Lägg till användardata i request-objektet
        req.user = payload;
        next();
    });
}

// Starta applikationen
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})