const mongoose = require('mongoose');
const constant = require('../utilities/constant');

const connectDB = async () => {
  try {
    await mongoose.connect(constant.mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(constant.connected);
  } catch (err) {
    console.log(constant.connectionErr, err);
    process.exit(1);  
  }
};

module.exports = connectDB;
