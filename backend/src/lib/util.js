import JWT from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = JWT.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });   
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS for 7 days
        httpOnly: true, // accessible only by web server
        sameSite: "strict", // CSRF protection
        secure: process.env.NODE_ENV === "production", // set to true in production = https
    })
    return token;
}