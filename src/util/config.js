const requiredEnvVariables = ['JWT_SECRET_KEY', 'MONGO_URI', 'PORT'];

// console.log('-> process.env: ',process.env);

const missingEnvVariables = requiredEnvVariables.filter(
    (envVar) => !process.env[envVar]
);

if (missingEnvVariables.length) 
    throw new Error(`⚠ Missing environment variables ${missingEnvVariables}`);

// {jwtSecretKey, port, mongoDBUrl}
module.exports = {
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    port:         process.env.PORT,
    mongoDbUri:   process.env.MONGO_URI,
};


