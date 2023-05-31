// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import uniqueValidator from 'mongoose-unique-validator';
import * as logger from '../utils/logger.mjs';
import { transformSchemaJSON } from '../utils/utils.mjs';


// Connect based on the .env file parameters.
mongoose.connect(process.env.MONGODB_CONNECT_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once('open', (err) => {
  if (err) {
    res.status(500).json({ error: '500: Connection to the server failed.' });
  } else {
    logger.info('Successfully connected to MongoDB Measurements collection using Mongoose.');
  }
});


// Measurement model
const measurementSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['single', 'double']
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: Number,
    required: function () {
      return this.type === 'single';
    }
  },
  upperNumber: {
    type: Number,
    required: function () {
      return this.type === 'double';
    }
  },
  lowerNumber: {
    type: Number,
    required: function () {
      return this.type === 'double';
    }
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Measurement = mongoose.model('Measurement', measurementSchema);

// CREATE methods
const createMeasurement = async (type, name, number, upperNumber, lowerNumber, date, userId) => {
  const measurement = new Measurement({
    type,
    name,
    number,
    upperNumber,
    lowerNumber,
    date,
    user: userId
  });
  return measurement.save();
};

// RETRIEVE methods
const retrieveMeasurements = async (userId) => {
  const query = Measurement.find({ user: userId });
  return query.exec();
};

const retrieveMeasurementById = async (measurementId, userId) => {
  const query = Measurement.findOne({ _id: measurementId, user: userId });
  return query.exec();
};

// UPDATE methods
const updateMeasurement = async (measurementId, userId, name, number, upperNumber, lowerNumber, date) => {
  const query = Measurement.findOneAndUpdate(
    { _id: measurementId, user: userId },
    { name, number, upperNumber, lowerNumber, date },
    { new: true }
  );
  return query.exec();
};

// DELETE methods
const deleteMeasurementById = async (measurementId, userId) => {
  const result = await Measurement.deleteOne({ _id: measurementId, user: userId });
  return result.deletedCount;
};

const deleteMeasurements = async (userId) => {
  const result = await Measurement.deleteMany({ user: userId });
  return result.deletedCount;
};

// Reformat schema JSON representation
transformSchemaJSON(measurementSchema);

measurementSchema.plugin(uniqueValidator);

// Export our variables for use in the controller file.
export {
  createMeasurement,
  retrieveMeasurements,
  retrieveMeasurementById,
  updateMeasurement,
  deleteMeasurementById,
  deleteMeasurements
};


// Another approach for creating single/double, but it will create 2 ids for an obj, 1 parent and 1 nested and userId will be nested as well.
// // Schema for single number measurements
// const singleNumberMeasurementSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     // unique: true
//   },
//   number: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now
//   },
//   single: {
//     type: Boolean,
//     default: true,
//     required: true,
//     immutable: true
//   },
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// });

// // Schema for double number measurements
// const doubleNumberMeasurementSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     // unique: true
//   },
//   upperNumber: {
//     type: Number,
//     required: true
//   },
//   lowerNumber: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now
//   },
//   single: {
//     type: Boolean,
//     default: false,
//     required: true,
//     immutable: true
//   },
//     user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// });

// // Single Number Measurement model
// const SingleNumberMeasurement = mongoose.model('SingleNumberMeasurement', singleNumberMeasurementSchema);
// // Double Number Measurement model
// const DoubleNumberMeasurement = mongoose.model('DoubleNumberMeasurement', doubleNumberMeasurementSchema);

// // Measurement model
// const measurementSchema = new mongoose.Schema({
//     singleNumber: {
//       type: singleNumberMeasurementSchema,
//       required: false
//     },
//     doubleNumber: {
//       type: doubleNumberMeasurementSchema,
//       required: false
//     }
// });
  
// // Index for name field in singleNumber sub-document
// measurementSchema.index({ 'singleNumber.name': 1 }, { unique: true, sparse: true });

// // Index for name field in doubleNumber sub-document
// measurementSchema.index({ 'doubleNumber.name': 1 }, { unique: true, sparse: true });

// const Measurement = mongoose.model('Measurement', measurementSchema);


// // CREATE methods
// const createSingleNumberMeasurement = async (name, number, date, single, userId) => {
//   const newSingleNumberMeasurement = new SingleNumberMeasurement({ name, number, date, single, user: userId });
//   const measurement = new Measurement({ singleNumber: newSingleNumberMeasurement });
//   return measurement.save();
// };

// const createDoubleNumberMeasurement = async (name, upperNumber, lowerNumber, date, single, userId) => {
//   const newDoubleNumberMeasurement = new DoubleNumberMeasurement({ name, upperNumber, lowerNumber, date, single, user: userId });
//   const measurement = new Measurement({ doubleNumber: newDoubleNumberMeasurement });
//   return measurement.save();
// };

// // RETRIEVE methods
// const retrieveMeasurements = async (userId) => {
//   const query = Measurement.find({
//     $or: [
//       { 'singleNumber.user': userId },
//       { 'doubleNumber.user': userId }
//     ]
//   });
//   return query.exec();
// };


// const retrieveMeasurementById = async (measurementId, userId) => {
//   const query = Measurement.findOne(
//     {
//       $or: [
//         { 'singleNumber._id': measurementId, 'singleNumber.user': userId },
//         { 'doubleNumber._id': measurementId, 'doubleNumber.user': userId }
//       ]
//     }
//   );
//   return query.exec();
// };



// // UPDATE methods
// const updateSingleNumberMeasurement = async (singleId, userId, name, number, date, single) => {
//   const query = Measurement.findOneAndUpdate(
//     { _id: singleId, user: userId },
//     { name, number, date, single },
//     { new: true }
//   );
//   return query.exec();
// };

// const updateDoubleNumberMeasurement = async (doubleId, userId, name, upperNumber, lowerNumber, date, single) => {
//   const query = Measurement.findOneAndUpdate(
//     { _id: doubleId, user: userId },
//     { name, upperNumber, lowerNumber, date, single },
//     { new: true }
//   );
//   return query.exec();
// };

// // DELETE methods
// const deleteMeasurementById = async (measurementId, userId) => {
//   const result = await Measurement.deleteOne({ _id: measurementId, user: userId });
//   return result.deletedCount;
// };

// const deleteMeasurements = async (userId) => {
//   const result = await Measurement.deleteMany({     $or: [
//     { 'singleNumber.user': userId },
//     { 'doubleNumber.user': userId }
//   ] });
//   return result.deletedCount;
// };

// // Reformat schema JSON representation
// transformSchemaJSON(singleNumberMeasurementSchema);
// transformSchemaJSON(doubleNumberMeasurementSchema);

// measurementSchema.plugin(uniqueValidator);


// // Export our variables for use in the controller file.
// export {
//   createSingleNumberMeasurement,
//   createDoubleNumberMeasurement,
//   retrieveMeasurements,
//   retrieveMeasurementById,
//   updateSingleNumberMeasurement,
//   updateDoubleNumberMeasurement,
//   deleteMeasurementById,
//   deleteMeasurements
// };


// /**
//  * The sparse option is used when defining indexes in Mongoose to control how the index handles documents that do not have the indexed field.

// In MongoDB, when you create an index on a field, MongoDB will exclude documents that do not have a value for that field from the index. By default, if a document doesn't have the indexed field, it won't be included in the index, and querying based on that field won't return those documents.

// The sparse option allows you to specify whether the index should include documents that don't have a value for the indexed field. When sparse is set to true, documents without the indexed field will be excluded from the index. When sparse is set to false (which is the default), documents without the indexed field will be included in the index with a null value.
//  */