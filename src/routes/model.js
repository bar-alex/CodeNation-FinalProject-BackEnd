
// route_name:     req.body.route_name,
// title:          req.body.title
// activity_type:  req.body.activity_type,
// cover_image:    req.body.cover_image,
// description:    req.body.description,
// difficulty:     req.body.difficulty,
// distance:       req.body.length,
// time:           req.body.time,
// location:       req.body.location,
// map_data:       req.body.map_data,


const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const routeSchema = new mongoose.Schema(
    {
        route_name: {
            type: String,
            trim: true,
            required: [true, "You must supply the unique name!"],
            unique: true,
        },
        activity_type: {
            type: String,
            enum: ['run', 'cycle', 'swim'],
            default: 'run',
            required: [true, "You must supply an activity_type ('run', 'cycle', 'swim')!"],
        },
        title: {
            type: String,
            trim: true,
            required: [true, "You must supply the title!"],
            unique: true,
        },
        cover_image: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        difficulty: {
            type: String,
            enum: ['easy', 'moderate', 'difficult'],
            default: 'easy',
        },
        distance: {
            type: Number,
        },
        time: {
            type: Number,
        },
        location: {
            type: String,
        },
        map_data: {
            type: String,
        }
    },
    {
        timestamps: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

routeSchema.plugin(uniqueValidator, {
    message: '{VALUE} is already in use',
});


// links to the 'activities' collection // Activity model
routeSchema.virtual('activities',{
    ref: 'Activity',
    localField: '_id',
    foreignField: 'routeId',
});


// will return the route for the provided route_name
routeSchema.statics.findByRouteName = async ({ route_name }) => {
    const route = await Route.findOne({ route_name });
    return !!route ? route :  null;
};


// will return the routes that have the provided the activity_type
routeSchema.statics.findByActivityType = async ({ activity_type }) => {
    // find routes by activity_type
    const routes = await Route.find({ activity_type });
    return !!routes && routes.length ? routes :  null;
};


// removed fields from return
routeSchema.methods.toJSON = function () {
    const route = this.toObject();
    return { ...route, __v: undefined };
};


const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
