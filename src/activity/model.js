// userId, 
// routeId, 
// activity_type(run,cycle,swim), 
// date_activity, 
// distance, 
// time_taken, 
// pace, 
// cal_burned

const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const activitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "userId must be supplied!"]
        },
        routeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Route',
        },
        activity_type: {
            type: String,
            enum: ['run', 'cycle', 'swim'],
            default: 'run',
            required: [true, "You must supply an activity_type ('run', 'cycle', 'swim')!"],
        },
        date_activity: {
            type: Date,
            default: () => new Date(),
            required: [true, "You must provide the date"],
        },
        distance: Number,
        time_taken: Number,
        pace: Number,
        cal_burned: Number,
    },
    {
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


// catch and create/update validation errors 
activitySchema.plugin(uniqueValidator, {
    message: '{VALUE} is already in use',
});


// users
activitySchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
});


// routes
activitySchema.virtual('route', {
    ref: 'Route',
    localField: 'routeId',
    foreignField: '_id',
});


// removed fields from return
activitySchema.methods.toJSON = function () {
    const activity = this.toObject();
    return { ...activity, __v: undefined };
};


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
