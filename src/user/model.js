const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../util/config');

// needed ?
// const { promisify } = require('util'); // https://www.npmjs.com/package/util.promisify
// const jwtSign = promisify(jwt.sign);


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        required: [true, "You must supply the username!"], 
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: [true, "You must supply the password!"],
    },

    email: {
        type: String,
        trim: true,
        required: [true, "You must supply the email!"],
        unique: true,
        validate: {
            validator: (v) => v.indexOf('@')>-1
                && v.indexOf('@')<v.indexOf('.')
                && v.indexOf(' ')===-1,
            message: (props) => `${props.value} doesn't appear to be a valid email`,
        }
    },
    full_name: {
        type: String,
        trim: true,        
        required: [true, "You must supply the full name!"],
    },

    is_disabled: {
        type: Boolean,
        default: false,
    },
    is_admin: {
        type: Boolean,
        default: false,
    }
});


// gets reid of the 11000 error from mongoDb
userSchema.plugin(uniqueValidator, {
    message: '{VALUE} is already in use',
});

// links to the 'activities' collection // Activity model
userSchema.virtual('activities',{
    ref: 'Activity',
    localField: '_id',
    foreignField: 'userId',
});

// hook, pre-save
userSchema.pre('save', async function(){
    try {
        if (this.isModified('password'))
            this.password = await bcrypt.hash(this.password,8)
    } catch (e) {
        console.log('userSchema.pre(save) error: ',e);
        throw e;
    }
})

// find by username and password -- returns null if not found or doesn't match password (static, doesn't have this)
userSchema.statics.findByCredentials = async ({ username, password }) => {
    try {
        const user = await User.findOne({ username });
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch ? user : null;
    } catch (e) {
        console.log('userSchema.findByCredentials error: ',e);
        throw e;
    }
};

// must be run on an instance, this refers to the document itself
userSchema.methods.generateAuthToken = function() {
    try { 
        //const result = jwtSign({ _id: this._id }, jwtSecretKey, { expiresIn: '30d' }); // monthly logins ^^
        const result = jwt.sign( { _id: this._id }, jwtSecretKey, { expiresIn: '30d' } ); // monthly logins ^^
        return result
    } catch (e) {
        console.log('userSchema.generateAuthToken error: ',e);
        throw e;
    }
};

// gets a JSON for the document ?! -- maybe i won't need it
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    // will take ou
    return { ...user, password: undefined, __v: undefined };
};



const User = mongoose.model("User",userSchema);

module.exports = User;


// User.Activity
// User.findByCredentials( {username, password} ) => User/null if password matches for the user
// User.generateAuthToken() => token for this user
// User.toJSON() => json object of User, with password and _v set to undefined
