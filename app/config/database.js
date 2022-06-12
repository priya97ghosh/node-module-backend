const mongoose = require("mongoose");
require('dotenv').config();

const mongoDb = process.env.MONGO_ATLAS_DATABASE;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDb, options);
        console.log('MongoDB connected!!');
    } catch (error) {
        console.log('Failed to connect to MongoDB', error);
    }
}

module.exports = connectDB;