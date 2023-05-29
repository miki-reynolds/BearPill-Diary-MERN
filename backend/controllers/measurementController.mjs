import * as measurements from '../models/Measurement.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller ******************************************
const createMeasurement = async (req, res) => {
    const { name, number, upperNumber, lowerNumber, date, single } = req.body;
    // Single-Number Measurement
    if (single) {
        measurements.createSingleNumberMeasurement(name, number, date, single)
        .then(singleMeasurement => {
            res.status(201).json(singleMeasurement);
        })
        .catch(error => {
            logger.error(error);
            if (error.code === 11000) { // Check for duplicate key error code
                res.status(400).json({ error: 'Measurement with the same name already exists.' });
            } else {
                res.status(500).json({ error: "Whoops, something went wrong with recording your measurement today... Please try again or contact us if your issue persists!" });
            }
        });
    } // Double-Number Measurement
    else {
        measurements.createDoubleNumberMeasurement(name, upperNumber, lowerNumber, date, single)
        .then(doubleMeasurement => {
            res.status(201).json(doubleMeasurement);
        })
        .catch(error => {
            logger.error(error);
            if (error.code === 11000) { // Check for duplicate key error code
                res.status(400).json({ error: 'Measurement with the same name already exists.' });
            } else {
                res.status(500).json({ error: "Whoops, something went wrong with recording your measurement today... Please try again or contact us if your issue persists!" });
            }
        });
    }
};

// RETRIEVE controller ****************************************************
const retrieveMeasurements = (req, res) => {
    measurements.retrieveMeasurements()
        .then(measurements => { 
            if (measurements !== null) {
                res.json(measurements);
            } else {
                res.status(404).json({ Error: 'No measurements found...' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Whoops, something went wrong with retrieving your measurements... Please try again or contact us if your issue persists!" });
        });
};


// RETRIEVE by ID controller
const retrieveMeasurementById = (req, res) => {
    measurements.retrieveMeasurementById(req.params.id)
    .then(measurement => { 
        if (measurement !== null) {
            res.json(measurement);
        } else {
            res.status(404).json({ Error: 'No measurements found...' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: '"Whoops, something went wrong with retrieving your measurement... Please try again or contact us if your issue persists!" ' });
    });
};


// UPDATE controller ************************************
const updateMeasurementById = (req, res) => {
    const { id } = req.params;
    const { name, number, upperNumber, lowerNumber, date, single } = req.body;
  
    if (single) {
      measurements.updateSingleNumberMeasurement(id, name, number, date, single)
        .then(singleMeasurement => {
          res.status(200).json(singleMeasurement);
        })
        .catch(error => {
            logger.error(error);
            if (error.code === 11000) { // Check for duplicate key error code
                res.status(400).json({ error: 'Measurement with the same name already exists.' });
            } else {
                res.status(500).json({ error: "Whoops, something went wrong with recording your measurement today... Please try again or contact us if your issue persists!" });
            }
        });
    } else {
      measurements.updateDoubleNumberMeasurement(id, name, upperNumber, lowerNumber, date, single)
        .then(doubleMeasurement => {
          res.status(200).json(doubleMeasurement);
        })
        .catch(error => {
            logger.error(error);
            if (error.code === 11000) { // Check for duplicate key error code
                res.status(400).json({ error: 'Measurement with the same name already exists.' });
            } else {
                res.status(500).json({ error: "Whoops, something went wrong with recording your measurement today... Please try again or contact us if your issue persists!" });
            }
        });
    }
  };
  

// DELETE by IDController ******************************
const deleteMeasurementById = (req, res) => {
    measurements.deleteMeasurementById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The measurement document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting your measurement... Please try again or contact us if your issue persists!" });
        });
};


// DELETE Controller ******************************
const deleteMeasurements = (req, res) => {
    measurements.deleteMeasurements()
        .then(deletedCount => {
            if (deletedCount !== 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The Measurement document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting all your measurements... Please try again or contact us if your issue persists!" });
        });
};


export { createMeasurement, retrieveMeasurements, retrieveMeasurementById, updateMeasurementById, deleteMeasurementById, deleteMeasurements };