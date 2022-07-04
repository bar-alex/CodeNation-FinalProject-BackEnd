const Activity  = require('./model');
const User      = require('../user/model');
const Route     = require('../routes/model');

const CustomError = require('../util/CustomError');

// { userId, routeId, activity_type(run,cycle,swim), date_activity, distance, time_taken, pace, cal_burned }


exports.createActivity = async (req, res, next) => {
    console.log('->createActivity() is run');
    
    // already have the user from the token
    req.user.userId = req.user._id;

    const newActivity = {
        // if any are missing, it should throw error - this is the create
        userId:         req.user.userId, 
        routeId:        req.body.routeId, 
        activity_type:  req.body.activity_type, 
        date_activity:  req.body.date_activity, 
        distance:       req.body.distance, 
        time_taken:     req.body.time_taken, 
        pace:           req.body.pace,
        cal_burned:     req.body.cal_burned,
    }

    const activity = new Activity(newActivity);
    await activity.save();

    res.status(201).json({ activity });
};


// will update an activity in the database, will return the activity
// uses the :activity_id provided as a parameter
exports.updateActivity = async (req, res, next) => {
    console.log('->updateActivity() is run');

    // find the activity using the provided :activity_id
    const activity = await Activity.findOne({ _id: req.params.activity_id });
    
    // a check could be made here that the activity belongs to the tokenized user

    // is not found then that's an error
    if (!activity) throw new CustomError(404, `Activity with _id "${req.params.activity_id}" was not found in the database.`)

    // change fields if they're provided -- except userId and routeId
    //if (req.user.userId)        activity.userId         = req.user.userId;
    //if (req.body.routeId)       activity.routeId        = req.body.routeId;
    if (req.body.activity_type) activity.activity_type  = req.body.activity_type;
    if (req.body.date_activity) activity.date_activity  = req.body.date_activity;
    if (req.body.distance)      activity.distance       = req.body.distance;
    if (req.body.time_taken)    activity.time_taken     = req.body.time_taken;
    if (req.body.pace)          activity.pace           = req.body.pace;
    if (req.body.cal_burned)    cal_burned              = req.body.cal_burned;

    // save - will run validators
    await activity.save()

    // send back the changed user
    res.json( activity );
};


// will delete an activity in the database
// uses the :activity_id provided as a parameter
exports.deleteActivity = async (req, res, next) => {
    console.log('->deleteActivity() is run');

    const result = await Activity.deleteOne({ _id: req.params.activity_id });
    
    // a check could be made here that the activity belongs to the tokenized user

    // return ok if activity was deleted, otherwise throw error
    if (result.deletedCount === 1)
        res.send({message: `Activity with id ${req.params.activity_id} was deleted`});
    else 
        throw new CustomError(500, `Activity with id ${req.params.activity_id} was not deleted // deletedCount = ${result.deletedCount}`);
};


// will return the data from an activity
// -> /:activity_id     => retrieve a specific activity, for the provided id
exports.getActivityById = async (req, res, next) => {
    console.log('-> getActivityById() is run, ',
        '\n->   req.params: ', req.params,
        '\n->   req.query: ',req.query,
        '\n->   req.route.path: ',req.route.path);    

    // is endpoint (path) is /all then it will return an array with all the routes, 
    // otherwise a parameter of the name must ne specified
    const activity = await Activity.findById( req.params.activity_id ).exec();

    // if there's no routes, it didn't had the path nor the name
    if (!activity) throw new CustomError(400, `Activity was not found for the specified id "${req.params.activity_id}"`)

    console.log('-> getActivityById() will return: ',activity);

    res.json(activity);
}


// will return the a list of activities for self or for a specified user
// -> /user/self  => will retrieve a list for the tokenized user
// -> /user/:username => will retrieve a list for the user specified
// can use query parameters:  route_name, activity_type, date_start, date_end
exports.getActivities = async (req, res, next) => {
    console.log('-> getActivities() is run, ',
        '\n->   req.params: ', req.params,
        '\n->   req.query: ',req.query,
        '\n->   req.route.path: ',req.route.path);    

    // i'm getting the user id first
    const { _id: userId } = (req.route.path==='/user/self') ? req.user._id
        : (!!req.params.username) ? await User.findOne({ username: req.params.username })
        : { _id: undefined };

    if (!userId) throw new CustomError(400, `User id was not found for the :username / self provided`);

    // then i'm getting the route if route_name was provided
    const { _id: routeId } = (!!req.query.route_name)
        ? await Route.findByRouteName({ route_name: req.query.route_name })
        : { _id: undefined };

    // i'm getting date_start, date_end
    // const date_start = date_start || new Date(1900,01,01);
    // const date_end   = date_end   || new Date( Date.now() );

    // create the object for the find()
    let condObj = { userId: userId };

    if (routeId)                 condObj.routeId = routeId;
    if (req.query.activity_type) condObj.activity_type = req.query.activity_type;
    if (req.query.date_start)    condObj.date_activity = { '$gte': req.query.date_start};
    if (req.query.date_end)      condObj.date_activity = { ...condObj.date_activity, '$lte' : req.query.date_end};
    
    console.log('-> getActivities() condObj: ', condObj );
    const listActivities = await Activity.find( condObj ).exec();

    // console.log('-> getActivities() listActivities is query: count=',listActivities.count(),'getFilter', listActivities.getFilter());

    console.log('-> getActivities() listActivities returned: ');
    console.table(listActivities.map( x => {
        const {createdAt, updatedAt, userId, routeId, ...rest} = x._doc;
        return {...rest};
    }));

    res.json(listActivities);
}

