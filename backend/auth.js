const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_here";
const signup = async (req, res) => {
    try {
        const { email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "user already exists",
                status: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            {
                id: newUser._id,
                email: newUser.email,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "user created successfully",
            token,
            userId: newUser._id,
            status: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error during signup",
            error: error.message,
            status: false
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No account found with that email.",
                status: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password. Please try again.",
                status: false
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            cartNo:user.cart.length,
            status: true
        });
        
    } catch (error) {
        return res.status(500).json({
            message: "Server error during login",
            error: error.message,
            status: false
        });
    }
};
const getuser=async(req,res)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(
            token,
            JWT_SECRET   
        )
        const currUser =await User.findById(decoded.id);
        return res.status(200).json({
            message:"user fetched successfully",
            success:true,
            data:currUser
        })
    }
    catch(err){
        res.status(401).json({
            error:err
        })
    }

}

module.exports = { signup, login,getuser };