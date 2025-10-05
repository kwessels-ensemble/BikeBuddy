import mongoose from "mongoose";
import locationSchema from '../schemas/location';

const Schema = mongoose.Schema;

// const locationSchema = new Schema({
//     city: {
//         type: String,
//         required: true
//     },
//     state: {
//         type: String,
//         required: true
//     },
//     coordinates: {
//         lat: {
//             type: Number
//         },
//         lng: {
//             type: Number
//         }
//     }
// },
// {_id: false}
// );

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
    tags: {
        type: Array
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