require('dotenv').config();
const { User } = require("../Model/UserModel/UserModel");
const jwt = require("jsonwebtoken");

const checkuserdetails = async (req, resp, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return resp.status(404).json({ message: "Token is not found" });

        const payload = jwt.verify(token, process.env.JSON_SECRET_KEY);
        if (!payload || !payload.id) {
            return resp.status(401).json({ message: "Token is not valid" });
        }

        if (payload.executiveid) {
            const existingShopkeeper = await User.findOne({ _id: payload.executiveid }).select("-password");
            if (!existingShopkeeper) return resp.status(401).json({ message: "Unauthorized user" });

            const existingUser = await User.findOne({ _id: payload.id }).select("-password");
            if (!existingUser) return resp.status(401).json({ message: "Unauthorized user" });

            req.user = existingShopkeeper;
            req.Executive = existingUser;
        } else {
            const existingUser = await User.findOne({ _id: payload.id }).select("-password");
            if (!existingUser) return resp.status(401).json({ message: "Unauthorized user" });

            req.user = existingUser;
        }

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return resp.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = checkuserdetails;
