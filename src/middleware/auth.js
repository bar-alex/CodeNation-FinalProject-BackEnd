
const jwt = require('jsonwebtoken');

const CustomError = require('../util/CustomError');
const User = require('../user/model');
const { jwtSecretKey } = require('../util/config');


// reads headers.authorization => req.user{}
exports.authToken = async (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError(401, 'Unauthorized!');

    try {
        const token = req.headers.authorization;
        const { _id } = await jwtVerify(token, jwtSecretKey)
    } catch (err) {
        throw new CustomError(401, 'Unauthorized or Expired Token!');
    }

    req.user = await User.findById(_id);
    if (!req.user) throw new CustomError(404, "User not found for the token")

    next();
};

