import * as meds from '../models/Medication.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller ******************************************
const createMed = (req, res) => { 
    meds.createMed(
        req.body.name, 
        req.body.dosage, 
        req.body.unit, 
        req.body.instructions, 
        req.body.notes, 
        req.body.current, 
        req.body.date
        )
        .then(med => {
            res.status(201).json(med);
        })
        .catch(error => {
            logger.error(error);
            if (error.code === 11000) { // Check for duplicate key error code
                res.status(400).json({ error: 'Medication with the same name already exists.' });
            } else {
                res.status(500).json({ error: "Whoops, something went wrong with recording your medication today... Please try again or contact us if your issue persists!" });
            }
        });
};


// RETRIEVE controller ****************************************************
const retrieveMeds = (req, res) => {
    meds.retrieveMeds()
        .then(meds => { 
            if (meds !== null) {
                res.json(meds);
            } else {
                res.status(404).json({ Error: 'No medications found...' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Whoops, something went wrong with retrieving your medications... Please try again or contact us if your issue persists!" });
        });
};


// RETRIEVE by ID controller
const retrieveMedById = (req, res) => {
    meds.retrieveMedByID(req.params.id)
    .then(med => { 
        if (med !== null) {
            res.json(med);
        } else {
            res.status(404).json({ Error: 'No medications found...' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: '"Whoops, something went wrong with retrieving your medication... Please try again or contact us if your issue persists!" ' });
    });
};


// UPDATE controller ************************************
const updateMedById = (req, res) => {
    meds.updateMed(
        req.params.id,
        req.body.name, 
        req.body.dosage, 
        req.body.unit, 
        req.body.instructions, 
        req.body.notes, 
        req.body.current, 
        req.body.date
    )
    .then(med => {
        res.status(200).json(med);
    })
    .catch(error => {
        logger.error(error);
        if (error.code === 11000) { // Check for duplicate key error code
            res.status(400).json({ error: 'Medication with the same name already exists.' });
        } else {
            res.status(500).json({ error: "Whoops, something went wrong with recording your medication today... Please try again or contact us if your issue persists!" });
        }
    });
};

// DELETE by IDController ******************************
const deleteMedById = (req, res) => {
    meds.deleteMedById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The medication document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting your medication... Please try again or contact us if your issue persists!" });
        });
};


// DELETE Controller ******************************
const deleteMeds = (req, res) => {
    meds.deleteMeds()
        .then(deletedCount => {
            if (deletedCount !== 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The Med document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting all your medications... Please try again or contact us if your issue persists!" });
        });
};


export { createMed, retrieveMeds, retrieveMedById, updateMedById, deleteMedById, deleteMeds };