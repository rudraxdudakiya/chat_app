import JWT from "jsonwebtoken";
import { ENV } from "./env";

export const generateToken = (userId, res) => {
    const {JWT_SECRET} = ENV;
    if(!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    } 
    
    const token = JWT.sign({userId}, JWT_SECRET, {
        expiresIn: "7d",
    });   
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS for 7 days
        httpOnly: true, // accessible only by web server
        sameSite: "strict", // CSRF protection
        secure: ENV.NODE_ENV === "production", // set to true in production = https
    })
    return token;
}