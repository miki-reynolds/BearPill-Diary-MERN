import express from 'express';
import * as contacts from '../controllers/contactController.mjs';


const router = express.Router();

router.post('/', contacts.createContact)


export default router;