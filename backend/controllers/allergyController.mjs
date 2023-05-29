import * as allergies from '../models/Allergy.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller ******************************************
const createAllergy = (req, res) => { 
    allergies.createAllergy(
        req.body.name, 
        req.body.reactions, 
        req.body.notes, 
        req.body.current, 
        req.body.date
        )
        .then(allergy => {
            res.status(201).json(allergy);
        })
        .catch(error => {
            logger.error(error);
            if (error.code === 11000) { // Check for duplicate key error code
                res.status(400).json({ error: 'Allergy with the same name already exists.' });
            } else {
                res.status(500).json({ error: "Whoops, something went wrong with recording your allergy today... Please try again or contact us if your issue persists!" });
            }
        });
};


// RETRIEVE controller ****************************************************
const retrieveAllergies = (req, res) => {
    allergies.retrieveAllergies()
        .then(allergies => { 
            if (allergies !== null) {
                res.json(allergies);
            } else {
                res.status(404).json({ Error: 'No allergies found...' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Whoops, something went wrong with retrieving your allergies... Please try again or contact us if your issue persists!" });
        });
};


// RETRIEVE by ID controller
const retrieveAllergyById = (req, res) => {
    allergies.retrieveAllergyByID(req.params.id)
    .then(allergy => { 
        if (allergy !== null) {
            res.json(allergy);
        } else {
            res.status(404).json({ Error: 'No allergies found...' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: '"Whoops, something went wrong with retrieving your allergy... Please try again or contact us if your issue persists!" ' });
    });
};


// UPDATE controller ************************************
const updateAllergyById = (req, res) => {
    allergies.updateAllergy(
        req.params.id,
        req.body.name, 
        req.body.reactions, 
        req.body.notes, 
        req.body.current, 
        req.body.date
    )
    .then(allergy => {
        res.status(200).json(allergy);
    })
    .catch(error => {
        logger.error(error);
        if (error.code === 11000) { // Check for duplicate key error code
            res.status(400).json({ error: 'Allergy with the same name already exists.' });
        } else {
            res.status(400).json({ error: "Whoops, something went wrong with updating your allergy today... Please try again or contact us if your issue persists!" });
        }
    });
};

// DELETE by IDController ******************************
const deleteAllergyById = (req, res) => {
    allergies.deleteAllergyById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The allergy document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting your allergy... Please try again or contact us if your issue persists!" });
        });
};


// DELETE Controller ******************************
const deleteAllergies = (req, res) => {
    allergies.deleteAllergies()
        .then(deletedCount => {
            if (deletedCount !== 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The Allergy document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting all your allergies... Please try again or contact us if your issue persists!" });
        });
};


export { createAllergy, retrieveAllergies, retrieveAllergyById, updateAllergyById, deleteAllergyById, deleteAllergies };