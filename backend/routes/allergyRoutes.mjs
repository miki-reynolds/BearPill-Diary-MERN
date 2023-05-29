import express from 'express';
import * as allergies from '../controllers/allergyController.mjs';


const router = express.Router();

router.post('/', allergies.createAllergy)
router.get('/', allergies.retrieveAllergies);
router.get('/:id', allergies.retrieveAllergyById);
router.put('/:id', allergies.updateAllergyById);
router.delete('/:id', allergies.deleteAllergyById);
router.delete('/', allergies.deleteAllergies);


export default router;