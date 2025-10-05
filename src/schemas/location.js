import mongoose from "mongoose";
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    coordinates: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    }
},
{_id: false}
);

export default locationSchema;