const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";

const requireAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: no session token" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, email }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: invalid or expired session", error: err.message });
    }
};

module.exports = { requireAuth };
