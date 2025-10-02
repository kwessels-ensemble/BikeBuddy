import mongoose from "mongoose";
const Schema = mongoose.Schema;


// TODO - update type/references etc on "userId"
// TODO- check types below Like url?, set types in a drop down
// location, etc.

const rideSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    link: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    notes: {
        type: String
    },
    location: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }

}, {timestamps: true})


const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);

export default Ride;