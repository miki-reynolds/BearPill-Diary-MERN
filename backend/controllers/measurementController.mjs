import * as measurements from '../models/Measurement.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller
const createMeasurement = async (req, res) => {
  const { name, number, upperNumber, lowerNumber, date } = req.body;
  const userId = req.user.id; 

  const type = number ? 'single' : 'double';

  measurements
    .createMeasurement(type, name, number, upperNumber, lowerNumber, date, userId)
    .then(measurement => {
      res.status(201).json(measurement);
    })
    .catch(error => {
      logger.error(error);
      if (error.errors && error.errors.name && error.errors.name.kind === "unique") {
        res.status(400).json({ error: "Measurement with the same name already exists." });
      } else {
        res.status(500).json({ error: "Whoops, something went wrong with recording your measurement today... Please try again or contact us if your issue persists!" });
      }
    });
};

// RETRIEVE controller
const retrieveMeasurements = (req, res) => {
  const userId = req.user.id;

  measurements
    .retrieveMeasurements(userId)
    .then(measurements => {
      if (measurements.length !== 0) {
        res.json(measurements);
      } else {
        res.status(404).json({ Error: 'No measurements found...' });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(400)
        .json({ Error: 'Whoops, something went wrong with retrieving your measurements... Please try again or contact us if your issue persists!' });
    });
};

// RETRIEVE by ID controller
const retrieveMeasurementById = (req, res) => {
  const measurementId = req.params.id;
  const userId = req.user.id; 

  measurements
    .retrieveMeasurementById(measurementId, userId)
    .then(measurement => {
      if (measurement) {
        res.json(measurement);
      } else {
        res.status(404).json({ Error: 'No measurements found...' });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(400)
        .json({ Error: 'Whoops, something went wrong with retrieving your measurement... Please try again or contact us if your issue persists!' });
    });
};

// UPDATE controller
const updateMeasurementById = (req, res) => {
  const measurementId = req.params.id;
  const { name, number, upperNumber, lowerNumber, date } = req.body;
  const userId = req.user.id;

  // const type = number ? 'single' : 'double';

  measurements
    .updateMeasurement(measurementId, userId, name, number, upperNumber, lowerNumber, date)
    .then(measurement => {
      if (measurement) {
        res.status(200).json(measurement);
      } else {
        res.status(404).json({ Error: 'The measurement document no longer exists' });
      }
    })
    .catch(error => {
      logger.error(error);
      if (error.errors && error.errors.name && error.errors.name.kind === "unique") {
        res.status(400).json({ error: "Measurement with the same name already exists." });
      } else {
        res.status(500).json({ error: "Whoops, something went wrong with recording your measurement today... Please try again or contact us if your issue persists!" });
      }
    });
};

// DELETE by ID Controller
const deleteMeasurementById = (req, res) => {
  const measurementId = req.params.id;
  const userId = req.user.id; 

  measurements
    .deleteMeasurementById(measurementId, userId)
    .then(deletedCount => {
      if (deletedCount === 1) {
        res.status(204).send();
      } else {
        res.status(404).json({ Error: 'The measurement document no longer exists' });
      }
    })
    .catch(error => {
      console.error(error);
      res.send({ error: 'Whoops, something went wrong with deleting your measurement... Please try again or contact us if your issue persists!' });
    });
};

// DELETE Controller
const deleteMeasurements = (req, res) => {
  const userId = req.user.id; 

  measurements
    .deleteMeasurements(userId)
    .then(deletedCount => {
      if (deletedCount !== 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ Error: 'The Measurement document no longer exists' });
      }
    })
    .catch(error => {
      console.error(error);
      res.send({ error: 'Whoops, something went wrong with deleting all your measurements... Please try again or contact us if your issue persists!' });
    });
};

export {
  createMeasurement,
  retrieveMeasurements,
  retrieveMeasurementById,
  updateMeasurementById,
  deleteMeasurementById,
  deleteMeasurements,
};
