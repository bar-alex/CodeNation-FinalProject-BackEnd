/** Response Error array
    [ 
    { 
        field: "email",
        message": "momensherif.2019@gmail.com is already in use"
    }, {}, {}, .. 
    ]
*/



exports.validationErrorHandler = (err, req, res, next) => {
    console.log(`\n-> validationErrorHandler() is run with \nerr: ${err}\n`);

    if (!err.errors) return next(err);

    const errorKeys = Object.keys(err.errors);

    // builds an array with (errorCode, errorMessage) from error objects
    const errors = errorKeys.reduce(
            (acc, key) => acc.concat({
                field: key,
                message: err.errors[key].message,
            })
        ,[]);

    // 422 Unprocessable Entity
    res.status(err.statusCode || 422).json(errors);
};


exports.errorHandler = (err, req, res, next) => {
    console.log(`-> errorHandler() is run with \nerr: ${err} \n`);

    err.statusCode = err.statusCode || 500;
    const handledError = err.statusCode < 500;

    res.status(err.statusCode).json({
        message: handledError ? err.message : 'Something went wrong!',
    });
};


// module.exports = {
//     validationErrorHandler,
//     errorHandler
// };

