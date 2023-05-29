import express from 'express';
import * as measurements from '../controllers/measurementController.mjs';


const router = express.Router();

router.post('/', measurements.createMeasurement)
router.get('/', measurements.retrieveMeasurements);
router.get('/:id', measurements.retrieveMeasurementById);
router.put('/:id', measurements.updateMeasurementById);
router.delete('/:id', measurements.deleteMeasurementById);
router.delete('/', measurements.deleteMeasurements);


export default router;