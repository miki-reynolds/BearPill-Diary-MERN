// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
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
    if(err){
        res.status(500).json({ error: "500: Connection to the server failed." });
    } else  {
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
    }
});

// Compile the model from the schema.
const Medication = mongoose.model('Medication', medSchema);

// CREATE model *****************************************
const createMed = async (name, dosage, unit, instructions, notes, current, date) => {
    const newMed = new Medication({
        name, dosage, unit, instructions, notes, current, date
    });
    return newMed.save();
};

// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const retrieveMeds = async () => {
    const query = Medication.find();
    return query.exec();
};

// RETRIEVE by ID
const retrieveMedByID = async (_id) => {
    const query = Medication.findById({ _id: _id });
    return query.exec();
};

// UPDATE model *****************************************************
const updateMed = async (_id, name, dosage, unit, instructions, notes, current, date) => {
    const result = await Medication.replaceOne({ _id: _id }, {
        name, dosage, unit, instructions, notes, current, date
    });
    return {
        _id: _id,
        name, dosage, unit, instructions, notes, current, date
    }
};

// DELETE model based on _id  *****************************************
const deleteMedById = async (_id) => {
    const result = await Medication.deleteOne({_id: _id});
    return result.deletedCount;
};

// DELETE model *****************************************
const deleteMeds = async () => {
    const result = await Medication.deleteMany({});
    return result.deletedCount;
};


// Reformat schema Json representation
transformSchemaJSON(medSchema);
  

// Export our variables for use in the controller file.
export { createMed, retrieveMeds, retrieveMedByID, updateMed, deleteMedById, deleteMeds };