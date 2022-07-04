// routeId, userId, date, distance, time_taken, pace,

const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const activitySchema = new mongoose.Schema({
    route_name: {
        type: String,
        trim: true,
        required: [true, "You must supply the unique name!"],
        unique: true,
    },
    

    title: {
        type: String,
        trim: true,
        required: [true, "You must supply the title!"],
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: 
})



route_name:     req.body.route_name,
title:          req.body.title
description:    req.body.description,
type:           req.body.type,
difficulty:     req.body.difficulty,
length:         req.body.length,
time:           req.body.time,
location:       req.body.location,
map_data:       req.body.map_data,


userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
},
