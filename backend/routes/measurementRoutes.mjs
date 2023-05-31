import express from 'express';
import { passport } from '../config/passport.mjs';
import * as measurements from '../controllers/measurementController.mjs';


const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', measurements.createMeasurement)
router.get('/', measurements.retrieveMeasurements);
router.get('/:id', measurements.retrieveMeasurementById);
router.put('/:id', measurements.updateMeasurementById);
router.delete('/:id', measurements.deleteMeasurementById);
router.delete('/', measurements.deleteMeasurements);


export default router;