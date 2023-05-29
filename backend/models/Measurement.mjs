// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
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

// Schema for single number measurements
const singleNumberMeasurementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  single: {
    type: Boolean,
    default: true,
    required: true,
    immutable: true
  }
});

// Schema for double number measurements
const doubleNumberMeasurementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  upperNumber: {
    type: Number,
    required: true
  },
  lowerNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  single: {
    type: Boolean,
    default: false,
    required: true,
    immutable: true
  }
});

// Single Number Measurement model
const SingleNumberMeasurement = mongoose.model('SingleNumberMeasurement', singleNumberMeasurementSchema);

// Double Number Measurement model
const DoubleNumberMeasurement = mongoose.model('DoubleNumberMeasurement', doubleNumberMeasurementSchema);

// Measurement model
const MeasurementSchema = new mongoose.Schema({
    singleNumber: {
      type: singleNumberMeasurementSchema,
      required: false
    },
    doubleNumber: {
      type: doubleNumberMeasurementSchema,
      required: false
    }
});
  
// Index for name field in singleNumber sub-document
MeasurementSchema.index({ 'singleNumber.name': 1 }, { unique: true, sparse: true });

// Index for name field in doubleNumber sub-document
MeasurementSchema.index({ 'doubleNumber.name': 1 }, { unique: true, sparse: true });

const Measurement = mongoose.model('Measurement', MeasurementSchema);


// CREATE methods
const createSingleNumberMeasurement = async (name, number, date, single) => {
  const newSingleNumberMeasurement = new SingleNumberMeasurement({ name, number, date, single });
  const measurement = new Measurement({ singleNumber: newSingleNumberMeasurement });
  return measurement.save();
};

const createDoubleNumberMeasurement = async (name, upperNumber, lowerNumber, date, single) => {
  const newDoubleNumberMeasurement = new DoubleNumberMeasurement({ name, upperNumber, lowerNumber, date, single });
  const measurement = new Measurement({ doubleNumber: newDoubleNumberMeasurement });
  return measurement.save();
};

// RETRIEVE methods
const retrieveMeasurements = async () => {
  const query = Measurement.find();
  return query.exec();
};

const retrieveMeasurementById = async (_id) => {
  const query = Measurement.findById(_id);
  return query.exec();
};

// UPDATE methods
const updateSingleNumberMeasurement = async (_id, name, number, date, single) => {
  const result = await Measurement.updateOne(
    { _id },
    { singleNumber: { name, number, date, single } }
  );
  return { _id, name, number, date, single };
};

const updateDoubleNumberMeasurement = async (_id, name, upperNumber, lowerNumber, date, single) => {
  const result = await Measurement.updateOne(
    { _id },
    { doubleNumber: { name, upperNumber, lowerNumber, date, single } }
  );
  return { _id, name, upperNumber, lowerNumber, date, single };
};

// DELETE methods
const deleteMeasurementById = async (_id) => {
  const result = await Measurement.deleteOne({ _id });
  return result.deletedCount;
};

const deleteMeasurements = async () => {
  const result = await Measurement.deleteMany({});
  return result.deletedCount;
};

// Reformat schema JSON representation
transformSchemaJSON(singleNumberMeasurementSchema);
transformSchemaJSON(doubleNumberMeasurementSchema);

// Export our variables for use in the controller file.
export {
  createSingleNumberMeasurement,
  createDoubleNumberMeasurement,
  retrieveMeasurements,
  retrieveMeasurementById,
  updateSingleNumberMeasurement,
  updateDoubleNumberMeasurement,
  deleteMeasurementById,
  deleteMeasurements
};


/**
 * The sparse option is used when defining indexes in Mongoose to control how the index handles documents that do not have the indexed field.

In MongoDB, when you create an index on a field, MongoDB will exclude documents that do not have a value for that field from the index. By default, if a document doesn't have the indexed field, it won't be included in the index, and querying based on that field won't return those documents.

The sparse option allows you to specify whether the index should include documents that don't have a value for the indexed field. When sparse is set to true, documents without the indexed field will be excluded from the index. When sparse is set to false (which is the default), documents without the indexed field will be included in the index with a null value.
 */