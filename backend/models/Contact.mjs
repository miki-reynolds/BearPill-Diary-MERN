// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';
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
        res.status(500).json({ error: '500:Connection to the server failed.' });
    } else  {
        console.log('Successfully connected to MongoDB Contact collection using Mongoose.');
    }
});

// SCHEMA: Define the collection's schema.
const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Regular expression pattern to validate email
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                return emailRegex.test(value);
            },
            message: "Invalid email address"
        }
    },
    concernType: {
        type: String,
        required: true,
    },
    concernDetails: {
        type: String,
        maxlength: 1000
    },
    referrer: {
        type: Array,
        required: true,
    },
    recommend: {
        type: String,
        required: true
    }
});

// Compile the model from the schema.
const Contact = mongoose.model('Contact', contactSchema);

// CREATE model *****************************************
const createContact = async (name, email, concernType, concernDetails, referrer, recommend) => {
    const newContact = new Contact({
        name,
        email,
        concernType,
        concernDetails,
        referrer,
        recommend
    });
    return newContact.save();
};

// Reformat schema Json representation
transformSchemaJSON(contactSchema);


// Export our variables for use in the controller file.
export { createContact };