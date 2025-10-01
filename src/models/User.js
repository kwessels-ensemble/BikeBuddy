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


// TODO - see if this is needed or another approach
// function to fire to encrypt password prior to saving in db -
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})


// TODO - see if this is needed or another approach
// static method to login user, comparing encrypted pass against db's encrypted pass
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne( { email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error('Incorrect password');
    } else {
        throw new Error('User does not exist');
    }
}

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;