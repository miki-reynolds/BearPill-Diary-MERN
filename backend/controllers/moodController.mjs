import * as moods from '../models/Mood.mjs';


// CREATE controller ******************************************
const createMood = (req, res) => { 
    moods.createMood(
        req.body.mood, 
        req.body.scale, 
        req.body.date
        )
        .then(mood => {
            res.status(201).json(mood);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: "Whoops, something went wrong with recording your mood today... Please try again or contact us if your issue persists!" });
        });
};


// RETRIEVE controller ****************************************************
const retrieveMoods = (req, res) => {
    moods.retrieveMoods()
        .then(moods => { 
            if (moods !== null) {
                res.json(moods);
            } else {
                res.status(404).json({ Error: 'No moods found...' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: "Whoops, something went wrong with retrieving your moods... Please try again or contact us if your issue persists!" });
        });
};


// RETRIEVE by ID controller
const retrieveMoodById = (req, res) => {
    moods.retrieveMoodByID(req.params.id)
    .then(mood => { 
        if (mood !== null) {
            res.json(mood);
        } else {
            res.status(404).json({ Error: 'No moods found...' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: '"Whoops, something went wrong with retrieving your mood... Please try again or contact us if your issue persists!" ' });
    });
};


// UPDATE controller ************************************
const updateMoodById = (req, res) => {
    moods.updateMood(
        req.params.id, 
        req.body.mood, 
        req.body.scale, 
        req.body.date
    )
    .then(mood => {
        res.status(200).json(mood);
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({ error: "Whoops, something went wrong with updating your mood... Please try again or contact us if your issue persists!" });
    });
};

// DELETE by IDController ******************************
const deleteMoodById = (req, res) => {
    moods.deleteMoodById(req.params.id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The mood document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting your mood... Please try again or contact us if your issue persists!" });
        });
};


// DELETE Controller ******************************
const deleteMoods = (req, res) => {
    moods.deleteMoods()
        .then(deletedCount => {
            if (deletedCount !== 0) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'The mood document no longer exists' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: "Whoops, something went wrong with deleting all your moods... Please try again or contact us if your issue persists!" });
        });
};


export { createMood, retrieveMoods, retrieveMoodById, updateMoodById, deleteMoodById, deleteMoods };