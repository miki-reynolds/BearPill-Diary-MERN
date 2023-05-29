import express from 'express';
import * as moods from '../controllers/moodController.mjs';


const router = express.Router();

router.post('/', moods.createMood)
router.get('/', moods.retrieveMoods);
router.get('/:id', moods.retrieveMoodById);
router.put('/:id', moods.updateMoodById);
router.delete('/:id', moods.deleteMoodById);
router.delete('/', moods.deleteMoods);


export default router;