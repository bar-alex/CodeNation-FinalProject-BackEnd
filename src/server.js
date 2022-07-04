require('dotenv').config();
const { port } = require('./util/config')
const { validationErrorHandler, errorHandler } = require('./util/error_handlers');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// catches errors from async functions, only necessary until express 5.0
require('express-async-errors');

// Connect to mongoose
require('./util/db_connection');

// the user routes
const userRouter = require('./user/routes');
const routeRouter = require('./routes/routes');  // the end-point routes (paths) of the router, in the 'activity routes' section
const activityRouter = require('./activity/routes');

const app = express();

app.use(morgan('combined'))


// this bit should give me access to the directory for the public folder - can i save images here ??
// const path = require('path');
// app.use(express.static(path.join(__dirname, './public')));


// not sure if i should add this, it would the the /api-help endpoint
// app.use('/api-info',express.static('api-info'));

app.use(express.json());
app.use(cors());

// base path
app.use('/', (req, res) => { res.send('Code Nation M37 API for final project!') });

// everything in the users router is prepended by the '/users'
app.use('/users', userRouter);

// everything in the routes router is prepended by the '/routes'
app.use('/routes', routeRouter);

// everything in the activities router is prepended by '/activities'
app.use('/activities', activityRouter);


// error handlers
app.use(validationErrorHandler);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})

