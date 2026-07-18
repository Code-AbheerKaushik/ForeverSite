const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key_here";
const ADMIN_EMAIL = "abheerkaushik2@gmail.com";

const requireAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: no token" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.email !== ADMIN_EMAIL) {
            return res.status(403).json({ message: "Forbidden: admin access only" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: invalid token", error: err.message });
    }
};

module.exports = { requireAdmin };
