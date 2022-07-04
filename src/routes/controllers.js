const Route = require('./model');
const CustomError = require('../util/CustomError');

// { route_name, title, activity_type, cover_image, description, difficulty, distance, time, location, map_data}


exports.createRoute = async (req, res, next) => {
    console.log('->createRoute() is run');

    const newRoute = {
        // if any are missing, it should throw error - this is the create
        route_name:     req.body.route_name,
        title:          req.body.title,
        activity_type:  req.body.activity_type,
        cover_image:    req.body.cover_image,
        description:    req.body.description,
        difficulty:     req.body.difficulty,
        distance:       req.body.distance,
        time:           req.body.time,
        location:       req.body.location,
        map_data:       req.body.map_data,
    }

    const route = new Route(newRoute);
    await route.save();

    res.status(201).json({ route });
};


// will update a route in the database, will return the route
// uses the :route_name provided as a parameter
exports.updateRoute = async (req, res, next) => {
    console.log('->updateRoute() is run');

    // find the route using the provided :route_name
    const route = await Route.findOne({ route_name: req.params.route_name });
    
    // is not found then thats an error
    if (!route) throw new CustomError(404, `Route "${req.params.route_name}" was not found in the database.`)

    // change fields if they're provided
    if (req.body.route_name)    route.route_name    = req.body.route_name;
    if (req.body.title)         route.title         = req.body.title;
    if (req.body.activity_type) route.activity_type = req.body.activity_type;
    if (req.body.cover_image)   route.cover_image   = req.body.cover_image;
    if (req.body.description)   route.description   = req.body.description;
    if (req.body.difficulty)    route.difficulty    = req.body.difficulty;
    if (req.body.distance)      route.distance      = req.body.distance;
    if (req.body.time)          route.time          = req.body.time;
    if (req.body.location)      route.location      = req.body.location;
    if (req.body.map_data)      route.map_data      = req.body.map_data;

    // save - will run validators
    await route.save()

    // send back the changed user
    res.json( route );
};


// will delete a route in the database
// uses the :route_name provided as a parameter
exports.deleteRoute = async (req, res, next) => {
    console.log('->deleteRoute() is run');

    const result = await Route.deleteOne({ route_name: req.params.route_name });
    
    // return ok if route was deleted, otherwise throw error
    if (result.deletedCount === 1)
        res.send({message: `Route ${req.params.route_name} was deleted`});
    else 
        throw new CustomError(500, `Route ${req.params.route_name} was not deleted // deletedCount = ${result.deletedCount}`);
};


// will return the data from a route
// uses the :route_name provided as a parameter 
// or uses the /all endpoint to retrieve all in a list
exports.getRoute = async (req, res, next) => {
    console.log('-> getRoute() is run, ',
        '\n->   req.params: ',     req.params,
        '\n->   req.query: ',      req.query,
        '\n->   req.route.path: ', req.route.path);    

    // is endpoint (path) is /all then it will return an array with all the routes, 
    // otherwise a parameter of the name must ne specified
    const routes =  
          (req.route.path === '/all') ? await Route.find({}).exec() // for /routes/all 
        : (req.params?.route_name)    ? await Route.findOne( {route_name: req.params.route_name} ).exec()  // for /routes/:route_name
        : null;

    // if there's no routes, it didn't had the path nor the name
    if (!routes) throw new CustomError(400, `Route to return was not specified by :route_name or /all`)

    console.log('-> getRoute() will return: ',routes);

    res.json(routes);
}
