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
const routeRouter = require('./routes/routes')  // the end-point routes (paths) of the router, in the 'activity routes' section

const app = express();

app.use(morgan('combined'))


// this bit should give me access to the directory for the public folder - can i save images here ??
// const path = require('path');
// app.use(express.static(path.join(__dirname, './public')));


// not sure if i should add this, it would the the /api-help endpoint
// app.use('/api-info',express.static('api-info'));

app.use(express.json());
app.use(cors());

// michael's test 
// app.get('/', (rec, res)=> res.send("Hello World") );

// everything in the users router is prepended by the '/users'
app.use('/users', userRouter);

// everything in the routes router is prepended by the '/routes'
app.use('/routes', routeRouter);


// error handlers
app.use(validationErrorHandler);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})

