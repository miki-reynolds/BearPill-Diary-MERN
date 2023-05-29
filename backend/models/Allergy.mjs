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
        logger.info("Successfully connected to MongoDB Allergies collection using Mongoose.");
    }
});

// SCHEMA: Define the collection's schema.
const allergySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    reactions: {
        type: String,
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
const Allergy = mongoose.model('Allergy', allergySchema);

// CREATE model *****************************************
const createAllergy = async (name, reactions, notes, current, date) => {
    const newAllergy = new Allergy({
        name, reactions, notes, current, date
    });
    return newAllergy.save();
};

// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const retrieveAllergies = async () => {
    const query = Allergy.find();
    return query.exec();
};

// RETRIEVE by ID
const retrieveAllergyByID = async (_id) => {
    const query = Allergy.findById({ _id: _id });
    return query.exec();
};

// UPDATE model *****************************************************
const updateAllergy = async (_id, name, reactions, notes, current, date) => {
    const result = await Allergy.replaceOne({ _id: _id }, {
        name, reactions, notes, current, date
    });
    return { 
        _id: _id,
        name, reactions, notes, current, date
    }
};

// DELETE model based on _id  *****************************************
const deleteAllergyById = async (_id) => {
    const result = await Allergy.deleteOne({_id: _id});
    return result.deletedCount;
};

// DELETE model *****************************************
const deleteAllergies = async () => {
    const result = await Allergy.deleteMany({});
    return result.deletedCount;
};


// Reformat schema Json representation
transformSchemaJSON(allergySchema);
  

// Export our variables for use in the controller file.
export { createAllergy, retrieveAllergies, retrieveAllergyByID, updateAllergy, deleteAllergyById, deleteAllergies };