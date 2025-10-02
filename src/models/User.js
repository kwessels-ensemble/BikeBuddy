import mongoose from "mongoose";
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// TODO- later add location field (optional)?

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})



const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;