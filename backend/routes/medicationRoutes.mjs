import express from 'express';
import { passport } from '../config/passport.mjs';
import * as medications from '../controllers/medicationController.mjs';


const router = express.Router();
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', medications.createMed)
router.get('/', medications.retrieveMeds);
router.get('/:id', medications.retrieveMedById);
router.put('/:id', medications.updateMedById);
router.delete('/:id', medications.deleteMedById);
router.delete('/', medications.deleteMeds);


export default router;