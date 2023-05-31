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
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
});

// Compile the model from the schema.
const Allergy = mongoose.model('Allergy', allergySchema);

// CREATE model *****************************************
const createAllergy = async (name, reactions, notes, current, date, userId) => {
    const newAllergy = new Allergy({
        name, reactions, notes, current, date, user: userId
    });
    return newAllergy.save();
};

// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const retrieveAllergies = async (userId) => {
    const query = Allergy.find({ user: userId });
    return query.exec();
};

// RETRIEVE by ID
const retrieveAllergyByID = async (allergyId, userId) => {
    const query = Allergy.findOne({ _id: allergyId, user: userId });
    return query.exec();
};

// UPDATE model *****************************************************
const updateAllergy = async (allergyId, userId, name, reactions, notes, current, date) => {
    const query = Allergy.findOneAndUpdate(
        { _id: allergyId, user: userId },
        { name, reactions, notes, current, date },
        { new: true }
    );
    return query.exec();
}

// DELETE model based on _id  *****************************************
const deleteAllergyById = async (allergyId, userId) => {
    const result = await Allergy.deleteOne({ _id: allergyId, user: userId });
    return result.deletedCount;
};

// DELETE model *****************************************
const deleteAllergies = async (userId) => {
    const result = await Allergy.deleteMany({ user: userId });
    return result.deletedCount;
};

// Reformat schema Json representation
transformSchemaJSON(allergySchema);
  
allergySchema.plugin(uniqueValidator);


// Export our variables for use in the controller file.
export {
  createAllergy, retrieveAllergies, retrieveAllergyByID, updateAllergy, deleteAllergyById, deleteAllergies
};