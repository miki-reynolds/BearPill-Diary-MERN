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
        logger.info("Successfully connected to MongoDB Moods collection using Mongoose.");
    }
});

// SCHEMA: Define the collection's schema.
const moodSchema = mongoose.Schema({
    mood: {
        type: String,
        required: true
    },
    scale: {
        type: Number,
        required: true,
        min: [1, "Empty values are not allowed"],
        max: [10, "On a scale of 1-10"]
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
const Mood = mongoose.model('Mood', moodSchema);

// CREATE model *****************************************
const createMood = async (mood, scale, date, userId) => {
    const newMood = new Mood({
        mood: mood,
        scale: scale,
        date: date,
        user: userId
    });
    return newMood.save();
};

// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const retrieveMoods = async (userId) => {
    const query = Mood.find({ user: userId });;
    return query.exec();
};

// RETRIEVE by ID
const retrieveMoodByID = async (moodId, userId) => {
    const query = Mood.findOne({ _id: moodId, user: userId });
    return query.exec();
};


// UPDATE model *****************************************************
const updateMood = async (moodId, userId, mood, scale, date) => {
    const query = Mood.findOneAndUpdate(
        { _id: moodId, user: userId },
        { mood, scale, date },
        { new: true }
    );
    // return { moodId, userId, mood, scale, date }
    return query.exec();
};


// DELETE model based on _id  *****************************************
const deleteMoodById = async (moodId, userId) => {
    const result = await Mood.deleteOne({ _id: moodId, user: userId });;
    return result.deletedCount;
};

 
// DELETE model based on _id  *****************************************
const deleteMoods = async (userId) => {
    const result = await Mood.deleteMany({ user: userId });;
    return result.deletedCount;
};


// Reformat schema Json representation
transformSchemaJSON(moodSchema);
  

// Export our variables for use in the controller file.
export { createMood, retrieveMoods, retrieveMoodByID, updateMood, deleteMoodById, deleteMoods };