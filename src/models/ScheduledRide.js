import mongoose from "mongoose";
import locationSchema from '../schemas/location.js';

const Schema = mongoose.Schema;

const rideDetailsSchema = new Schema({
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
        type: [String],
        default: []
        },
    notes: {
        type: String
        },
    location: {
        type: locationSchema,
        required: true
    }

    }, {_id: false});

const scheduledRideSchema = new Schema({
    rideId: {
        type: Schema.Types.ObjectId,
        ref: "SavedRides",
        required: false
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false,
        required: true
    },
    eventTime: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value > new Date(),
            message: "Event time must be in the future"
        }
    },
    timeZone: {
        type: String,
        required: true
    },
    participants:
        [{type: Schema.Types.ObjectId, ref: 'User'}]
    ,
    isCancelled: {
        type: Boolean,
        default: false,
        required: true
    },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    cancelledAt: {
        type: Date,
        required: false
    },
    cancellationReason: {
        type: String,
        required: false
    },
    rideDetails: rideDetailsSchema
}, {timestamps: true});



const ScheduledRide = mongoose.models.ScheduledRide || mongoose.model("ScheduledRide", scheduledRideSchema);

export default ScheduledRide;