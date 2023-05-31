// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
import uniqueValidator from 'mongoose-unique-validator';
import * as logger from '../utils/logger.mjs';


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
        logger.info("Successfully connected to MongoDB Users collection using Mongoose.");
    }
});

// SCHEMA: Define the collection's schema.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                // Regular expression pattern to validate email
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                return emailRegex.test(value);
            },
            message: "Invalid email address"
        }
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
    medications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medication'
        }
    ],
    measurements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Measurement'
        }
    ],
    allergies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Allergy'
        }
    ],
    moods: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mood'
        }
    ],
});

// Compile the model from the schema.
const User = mongoose.model('User', userSchema);

// CREATE model *****************************************
const createUser = async (username, email, passwordHash) => {
    const newUser = new User({ username, email, passwordHash });
    return newUser.save();
};

// RETRIEVE models *****************************************
// Retrieve based on a filter and return a promise.
const retrieveUsers = async () => {
    const query = User.find();
    return query.exec();
};

// RETRIEVE by ID
const retrieveUserByID = async (_id) => {
    const query = User.findById({ _id: _id });
    return query.exec();
};

// RETRIEVE by email
const retrieveUserByEmail = async (email) => {
    const query = User.findOne({ email: email });
    return query.exec();
};

// RETRIEVE by username
const retrieveUserByUsername = async (username) => {
    const query = User.findOne({ username: username });
    return query.exec();
};

// RETRIEVE by username or email
const retrieveUserByUsernameOrEmail = (usernameOrEmail) => {
    const query = User.findOne({
        $or: [
            { username: usernameOrEmail },
            { email: usernameOrEmail }
        ]
    });
    return query.exec();
};

// UPDATE model *****************************************************
const updateUser = async (_id, username, passwordHash) => {
    const result = await User.replaceOne({ _id: _id }, { username, passwordHash});
    return { _id: _id, username, passwordHash }
};

// DELETE model based on _id  *****************************************
const deleteUserById = async (_id) => {
    const result = await User.deleteOne({_id: _id});
    return result.deletedCount;
};
 
// DELETE model based on _id  *****************************************
const deleteUsers = async () => {
    const result = await User.deleteMany({});
    return result.deletedCount;
};

// ADD TO MEDICATIONS model *****************************************************
const addToMedicationsCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $push: { medications: itemId } },
        { new: true }
    );
    return query.exec();
};

// ADD TO MEASUREMENTS model *****************************************************
const addToMeasurementsCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $push: { measurements: itemId } },
        { new: true }
    );
    return query.exec();
};

// ADD TO ALLERGIES model *****************************************************
const addToAllergiesCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $push: { allergies: itemId } },
        { new: true }
    );
    return query.exec();
};

// ADD TO MOODS model *****************************************************
const addToMoodsCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $push: { moods: itemId } },
        { new: true }
    );
    return query.exec();
};

// REMOVE FROM MEDICATIONS model *****************************************************
const removeFromMedicationsCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $pull: { medications: itemId } },
        { new: true }
    );
    return query.exec();
};

// REMOVE FROM MEASUREMENTS model *****************************************************
const removeFromMeasurementsCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $pull: { measurements: itemId } },
        { new: true }
    );
    return query.exec();
};

// REMOVE FROM ALLERGIES model *****************************************************
const removeFromAllergiesCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $pull: { allergies: itemId } },
        { new: true }
    );
    return query.exec();
};

// REMOVE FROM MOODS model *****************************************************
const removeFromMoodsCollection = (userId, itemId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $pull: { moods: itemId } },
        { new: true }
    );
    return query.exec();
};

// RESET MEDICATIONS model *****************************************************
const resetMedicationsCollection = (userId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $set: { medications: [] } },
        { new: true }
      )
    return query.exec();
};

// RESET MEASUREMENTS model *****************************************************
const resetMeasurementsCollection = (userId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $set: { measurements: [] } },
        { new: true }
      )
    return query.exec();
};

// RESET ALLERGIES model *****************************************************
const resetAllergiesCollection = (userId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $set: { allergies: [] } },
        { new: true }
      )
    return query.exec();
};

// RESET MOODS model *****************************************************
const resetMoodsCollection = (userId) => {
    const query = User.findByIdAndUpdate(
        userId,
        { $set: { moods: [] } },
        { new: true }
      )
    return query.exec();
};


// Reformat schema Json representation
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    }
  })

userSchema.plugin(uniqueValidator);


// Export our variables for use in the controller file.
export {
    User,
    createUser,
    retrieveUsers, retrieveUserByID, retrieveUserByEmail, retrieveUserByUsername, retrieveUserByUsernameOrEmail,
    updateUser,
    deleteUserById, deleteUsers,
    addToMedicationsCollection, addToMeasurementsCollection, addToAllergiesCollection, addToMoodsCollection,
    removeFromMedicationsCollection, removeFromMeasurementsCollection, removeFromAllergiesCollection, removeFromMoodsCollection,
    resetMedicationsCollection, resetMeasurementsCollection, resetAllergiesCollection, resetMoodsCollection
};