const user = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token." });
        }

        const exist = await user.findOne({ _id: decoded?.id }).select("-password");
        if (!exist) {
            return res.status(401).json({ message: "Unauthorized: User not found." });
        }
        req.user = exist;
        next();
        
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: " + err.message });
    }
}