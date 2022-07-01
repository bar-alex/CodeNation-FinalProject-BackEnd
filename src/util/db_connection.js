// https://mongoosejs.com/docs/5.x/docs/deprecations.html
// { useNewUrlParser: true, useUnifiedTopology: true, }

// require("dotenv").config();
const mongoose = require("mongoose");

const { mongoDbUri } = require('./config');

const connection = async () => {
    try {
        // await mongoose.connect(process.env.MONGO_URI);
        await mongoose.connect( mongoDbUri );
        console.log("DB successfully connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
connection();