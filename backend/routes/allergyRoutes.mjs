import express from 'express';
import { passport } from '../config/passport.mjs';
import * as allergies from '../controllers/allergyController.mjs';


const router = express.Router();

// Apply authentication middleware to all routes in the router
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', allergies.createAllergy);
router.get('/', allergies.retrieveAllergies);
router.get('/:id', allergies.retrieveAllergyById);
router.put('/:id', allergies.updateAllergyById);
router.delete('/:id', allergies.deleteAllergyById);
router.delete('/', allergies.deleteAllergies);


export default router;
