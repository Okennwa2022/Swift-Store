const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true, // Ensure this is set to true
        unique: true,   // Ensure this is set to true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
});


const User = mongoose.model("User", UserSchema);
module.exports = User;