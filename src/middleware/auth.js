
const jwt = require('jsonwebtoken');

const CustomError = require('../util/CustomError');
const User = require('../user/model');
const { jwtSecretKey } = require('../util/config');


// reads headers.authorization => req.user{}
exports.authToken = async (req, res, next) => {
    console.log("->authToken() is run");

    try {

        if (!req.headers.authorization) throw new CustomError(401, 'Unauthorized - missing token!');

        const token = req.headers.authorization;
        const { _id } = jwt.verify(token, jwtSecretKey);
        //console.log( '>> token',token,'jwtSecretKey',jwtSecretKey,'_id',_id );

        req.user = await User.findById(_id);
        if (!req.user) throw new CustomError(404, "User not found for the token");

        next();

    } catch(err) {
        if (['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(err.name))
            next( new CustomError(401, 'Unauthorized or Expired Token!') );
        else 
            next( err );
    } 

};


// gets the user for the token and compares the password with the one provided in auth_password
exports.authPassword = async (req, res, next) => {
    console.log("->authPassword() is run");
    
    // try {
        // body must have auth_password
        if (!req.body.auth_password) throw new CustomError(401, 'Unauthorized - missing auth_password!');

        // user's already attached to req
        const newUser = await User.findByCredentials({
                username: req.user.username, 
                password: req.body.auth_password
            });

        if (!newUser) throw new CustomError(401, 'Unauthorized for auth_password!');

        next();

    // } catch (err) {
    //     next(err);
    // }
};