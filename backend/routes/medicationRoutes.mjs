import express from 'express';
import * as medications from '../controllers/medicationController.mjs';


const router = express.Router();

router.post('/', medications.createMed)
router.get('/', medications.retrieveMeds);
router.get('/:id', medications.retrieveMedById);
router.put('/:id', medications.updateMedById);
router.delete('/:id', medications.deleteMedById);
router.delete('/', medications.deleteMeds);


export default router;