const User = require('./model');
const CustomError = require('../util/CustomError');

// will login the user, will return the token or error
// req = { username, password }
exports.loginUser = async (req, res, next) => {
    console.log('->loginUser() is run');
    // error handling is taken care of upper level
    const user = await User.findByCredentials( req.body );
    if (!user) throw new CustomError(404, "Invalid email or password");

    const token = await user.generateAuthToken();
    res.json({user, token});
};


// will create the user in the database, will return the user and the token
exports.createUser = async (req, res, next) => {
    console.log('->createUser() is run');
    try{
        const newUser = {
            username:    req.body.username,
            password:    req.body.password,
            email:       req.body.email,
            full_name:   req.body.full_name,
            is_disabled: false,      // maybe, later
            is_admin:    false,      // maybe, later 
        }

        const user = new User(newUser);
        await user.save();

        const token = user.generateAuthToken();
        res.status(201).json({ user, token });
    }catch(err){
        next(err);
    }
};


// will update a user in the database, will return the user
// uses th id got from the token // (stretch) or a username
exports.updateUser = async (req, res, next) => {
    console.log('->updateUser() is run');
    try{
        // already have user in req.user from authToken
        const user = await User.findById(req.user._id);
        // change fields if they're provided
        if (req.body.password)  user.password = req.body.password;
        if (req.body.email)     user.email = req.body.email; 
        if (req.body.full_name) user.full_name = req.body.full_name;
        // save - will run validators
        await user.save()
        // send back the changed user
        res.json( user );

    } catch (err){
        next(err);
    }
};


// will delete a user in the database all all its activities
// uses the id gto from the token // (stretch) or a username
exports.deleteUser = async (req, res, next) => {
    console.log('->deleteUser() is run');
    try{
        // already have user in req.user from authToken
        const result = await User.deleteOne({ _id: req.user._id });
        
        // return ok if user was deleted, otherwise throw error
        if (result.deletedCount === 1)
            res.send({message: `User ${req.user.username} was deleted`});
        else 
            throw new CustomError(500, `User ${req.user.username} was not deleted // deletedCount = ${result.deletedCount}`);
        
    } catch (err){
        next(err);
    }
};


// will return teh data from a user, its activities (maybe rivals and more)
// uses a username if provided as a parameter, or the id from the token
exports.getUser = async (req, res, next) => {
    console.log('->getUser() is run');
    // if parameter was passed that's the user i return
    const user = (req.params?.username) 
        ? await User.findOne( {username: req.params.username} ).exec()      // for /user/:username
        : await User.findById( req.user.id );                               // for /user/

    res.json(user);
}



// more functions for various reports could be here
// the leaderboard report {filter on nothing, on date range, or route}
// 


// module.exports = {
//     loginUser,
//     createUser,
//     updateUser,
//     deleteUser,
//     getUser
// }