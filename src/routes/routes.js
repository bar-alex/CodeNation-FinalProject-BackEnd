const { Router } = require('express');
const router = Router();
// const router = require('express').Router();
module.exports = router;


const {
    authToken,
} = require('../middleware/auth')

const {
    createRoute,
    deleteRoute, 
    updateRoute,
    getRoute,
} = require('./controllers');


// Create Route { route_name, title, activity_type, description, difficulty, distance, time, location, map_data} => {route}
router.post('/create', authToken, createRoute);

// Update Route { route_name, title, activity_type, description, difficulty, distance, time, location, map_data} => {route}
router.patch('/:route_name', authToken, updateRoute);

// Delete Route => success/failure
router.delete('/:route_name', authToken, deleteRoute);

// Get Route -- all => {route}
router.get('/all', getRoute);

// Get Route -- by route_name => {route}
router.get('/:route_name', getRoute);


