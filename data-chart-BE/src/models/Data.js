const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  day: { type: Date, required: true },
  ageRange: { type: String, enum: ['15-25', '>25'], required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  A: Number,
  B: Number,
  C: Number,
  D: Number
});

module.exports = mongoose.model('Data', dataSchema);
