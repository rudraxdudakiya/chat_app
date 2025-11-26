import User from "../models/User.model.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/util.js";

export const signup = async (req, res) => {
    const {fullname, email, password} = req.body;

    try {
        if(!fullname || !email || !password) { // check if all fields are provided
            return res.status(400).json({message: "All fields are required"});
        }
        
        if(password.length < 6) { // minimum 6 characters
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) { // validate email format using regex
            return res.status(400).json({message: "Invalid email format"});
        }

        const user = await User.findOne({email});
        if(user) { // check if user with the same email already exists
            return res.status(400).json({message: "User with this email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // hash the password
        
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        });

        if(newUser) {
            const savedUser = await newUser.save(); 
            generateToken(savedUser._id, res); // generate token for the new user
            return res.status(201).json({
                _id: savedUser._id,
                fullname: savedUser.fullname,
                email: savedUser.email,
                profilePicture: savedUser.profilePicture,
            });
        } else {
            return res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password) { 
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const Password = await bcrypt.compare(password, user.password);
        if(!Password) {
            return res.status(400).json({message: "Invalid Credentials"});
        }
        generateToken(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.log("Error in login controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 }); // clear the cookie
    res.status(200).json({message: "Logged out successfully"});
}