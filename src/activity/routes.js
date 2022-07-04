const { Router } = require('express');
const router = Router();
// const router = require('express').Router();
module.exports = router;


const {
    authToken,
} = require('../middleware/auth')

const {
    createActivity,
    deleteActivity, 
    updateActivity,
    getActivityById,
    getActivities,
} = require('./controllers');


// Create Activity { userId, routeId, activity_type(run,cycle,swim), date_activity, distance, time_taken, pace, cal_burned } => {activity}
router.post('/create', authToken, createActivity);

// Update Activity { userId, routeId, activity_type(run,cycle,swim), date_activity, distance, time_taken, pace, cal_burned } => {activity}
router.patch('/:activity_id', authToken, updateActivity);

// Delete Activity => success/failure
router.delete('/:activity_id', authToken, deleteActivity);

// Get Activity -- by activity_id => {activity}
router.get('/:activity_id', authToken, getActivityById);

// the following will allow query parameters to filter the returned activities
// query parameters: date_start, date_end, activity_type, route_name

// Get Activities -- a list of activities => [{activity},]
router.get('/user/self', authToken, getActivities);

// Get Activities -- a list of activities => [{activity},]
router.get('/user/:username', authToken, getActivities);


// here I can add other routes for aggregated data from the activities