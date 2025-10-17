const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        const token = jwt.sign(
            {
                id: existingUser._id,
                name: existingUser.fullName.firstName
            },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        );

        // setting cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        });
        return res.status(200).json({ message: "Login successful", token });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
const register = async (req, res) => {
    try {
        const { username, fullName: { firstName, lastName }, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            username,
            fullname: {
                firstName,
                lastName
            },
            email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({
            id: newUser._id,
            name: newUser.fullname.firstName
        }, process.env.JWT_SECRET, { expiresIn: "10d" });
        
        // setting cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        });

        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { login, register };