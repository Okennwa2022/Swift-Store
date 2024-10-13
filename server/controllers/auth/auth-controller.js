const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
const { userName, email, password } = req.body;

try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
    return res.status(400).json({
        success: false,
        message: "User already exists with this email! Please try again",
    });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
    userName,
    email,
    password: hashPassword,
    });

    await newUser.save();

    res.status(201).json({
    success: true,
    message: "Registration successful",
    });
} catch (e) {
    // Handle duplicate key errors explicitly
    if (e.code === 11000) {
    const field = Object.keys(e.keyValue)[0];
    return res.status(400).json({
        success: false,
        message: `User with the same ${field} already exists!`,
    });
    }
    console.error("Error during user registration:", e);
    res.status(500).json({
    success: false,
    message: "An error occurred during registration",
    });
}
};


//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide both email and password.",
        });
    }

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({
                success: false,
                message: "User does not exist. Please register first.",
            });
        }

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password! Please try again.",
            });
        }

        const token = jwt.sign(
            {
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                userName: checkUser.userName,
            },
            process.env.CLIENT_SECRET_KEY || "CLIENT_SECRET_KEY",
            { expiresIn: "60m" }
        );

        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production' 
        }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName,
            },
        });
    } catch (e) {
        console.error("Error during login:", e);
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
        });
    }
};



//logout

const logoutUser = (req, res) => {
res.clearCookie("token").json({
success: true,
message: "Logged out successfully!",
});
};

//auth middleware
const authMiddleware = async (req, res, next) => {
const token = req.cookies.token;
if (!token) {
return res.status(401).json({
success: false,
message: "Unauthorized access! No token provided.",
});
}

try {
const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY || "CLIENT_SECRET_KEY");
req.user = decoded;
next();
} catch (error) {
res.status(401).json({
success: false,
message: "Unauthorized access! Invalid token.",
});
}
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };