const { Router } = require('express');
const router = Router();
// const router = require('express').Router();
module.exports = router;


// const router = require("express").Router();

const {
    authToken,
    authPassword
} = require('../middleware/auth')

const {
    loginUser,
    createUser,
    getUser,
    updateUser,
    deleteUser
} = require('./controllers');


// User Login, req = { username, password } => {user{}, token}
router.post('/login', loginUser);

// Create User { username, password, full_name, email} => {user{}, token}
router.post('/register', createUser);

// Get User -- for the token =>{user}
router.get('/self', authToken, getUser);

// Get User -- by username => {user}
router.get('/:username', authToken, getUser);

// Update User { auth_password, password, full_name, email} => {user{}, token}
router.patch('/update', authToken, authPassword, updateUser);

// Delete self { auth_password } => success/failure
router.delete('/delete', authToken, authPassword, deleteUser);


