// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import uniqueValidator from 'mongoose-unique-validator';
import * as logger from '../utils/logger.mjs';
import { transformSchemaJSON } from '../utils/utils.mjs';


// Connect based on the .env file parameters.
mongoose.connect(
  process.env.MONGODB_CONNECT_STRING,
  { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
  if (err) {
    res.status(500).json({ error: "500: Connection to the server failed." });
  } else {
    logger.info("Successfully connected to MongoDB Medications collection using Mongoose.");
  }
});

// SCHEMA: Define the collection's schema.
// TODO: Reminder feature (3rd party, Firebase)
const medSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  dosage: {
    type: Number,
    required: true,
    min: [1, "Empty values are not allowed"]
  },
  unit: {
    type: String,
    required: true,
    default: "mg"
  },
  instructions: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  current: {
    type: Boolean,
    required: true,
    default: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Compile the model from the schema.
const Medication = mongoose.model('Medication', medSchema);

// CREATE model *****************************************
const createMed = async (name, dosage, unit, instructions, notes, current, date, userId) => {
  const newMed = new Medication({
    name, dosage, unit, instructions, notes, current, date, user: userId
  });
  return newMed.save();
};

// RETRIEVE models *****************************************
// Retrieve medications for a specific user
const retrieveMeds = async (userId) => {
  const query = Medication.find({ user: userId });
  return query.exec();
};

// RETRIEVE by ID
const retrieveMedByID = async (medId, userId) => {
  const query = Medication.findOne({ _id: medId, user: userId });
  return query.exec();
};

// UPDATE model *****************************************************
const updateMed = async (medId, userId, name, dosage, unit, instructions, notes, current, date) => {
  const query = Medication.findOneAndUpdate(
    { _id: medId, user: userId },
    { name, dosage, unit, instructions, notes, current, date },
    { new: true }
  );
  return query.exec();
};

// DELETE model based on _id  *****************************************
const deleteMedById = async (medId, userId) => {
  const result = await Medication.deleteOne({ _id: medId, user: userId });
  return result.deletedCount;
};

// DELETE model *****************************************
const deleteMeds = async (userId) => {
  const result = await Medication.deleteMany({ user: userId });
  return result.deletedCount;
};

// Reformat schema Json representation
transformSchemaJSON(medSchema);

medSchema.plugin(uniqueValidator);


// Export our variables for use in the controller file.
export {
    createMed, retrieveMeds, retrieveMedByID, updateMed, deleteMedById, deleteMeds
};
