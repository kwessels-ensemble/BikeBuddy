import mongoose from "mongoose";
import locationSchema from '../schemas/location';

const Schema = mongoose.Schema;

const savedRideSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    type: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    location: {
        type: locationSchema,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        required: true
    }

}, {timestamps: true})


const SavedRide = mongoose.models.SavedRide || mongoose.model("SavedRide", savedRideSchema);

export default SavedRide;