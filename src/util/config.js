const requiredEnvVariables = ['JWT_SECRET_KEY', 'MONGO_URI'];

const missingEnvVariables = requiredEnvVariables.filter(
    (envVar) => !process.env[envVar]
);

if (missingEnvVariables.length) 
    throw new Error(`⚠ Missing environment variables ${missingEnvVariables}`);


// {jwtSecretKey, port, mongoDBUrl}
module.exports = {
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    port:         process.env.PORT || 5001,
    mongoDbUri:   process.env.MONGO_URI,
};


