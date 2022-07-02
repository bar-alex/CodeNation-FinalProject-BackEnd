require('dotenv').config();
const { port } = require('./util/config')
const { validationErrorHandler, errorHandler } = require('./util/error_handlers');

const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const morgan = require('morgan');
=======
const morgan = require('morgan')

const { validationErrorHandler, errorHandler } = require('./util/error_handlers');
//const port = process.env.PORT || 5001;
const { port } = require('./util/config')
>>>>>>> b76a7cc75e7294865ccb60c23e3c5544daf0e282

// Connect to mongoose
require('./util/db_connection');

// the user routes
const userRouter = require('./user/routes');


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


// error handlers
app.use(validationErrorHandler);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`App is listening on port ${port}`);
})

