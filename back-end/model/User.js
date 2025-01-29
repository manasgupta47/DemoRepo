const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  companyName: String,
  age: Number,
  dob: Date,
  image:  { data: Buffer, contentType: String } 
});

module.exports = mongoose.model('User', UserSchema);
