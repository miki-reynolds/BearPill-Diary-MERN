import * as moods from '../models/Mood.mjs';
import * as users from '../models/User.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller ******************************************
const createMood = (req, res) => {
  const userId = req.user.id;

  moods.createMood(
    req.body.mood,
    req.body.scale,
    req.body.date,
    userId
  )
    .then(mood => {
      // Associate the created mood with the user
      return users.addToMoodsCollection(userId, mood._id);
    })
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(error => {
      logger.error(error);
      res.status(400).json({ error: "Whoops, something went wrong with recording your mood today... Please try again or contact us if your issue persists!" });
    });
};

// RETRIEVE controller ****************************************************
const retrieveMoods = (req, res) => {
  const userId = req.user.id;

  moods.retrieveMoods(userId)
    .then(moods => {
      if (moods.length !== 0) {
        res.json(moods);
      } else {
        res.status(404).json({ Error: "No moods found..." });
      }
    })
    .catch(error => {
      logger.error(error);
      res.status(400).json({ Error: "Whoops, something went wrong with retrieving your moods... Please try again or contact us if your issue persists!" });
    });
};

// RETRIEVE by ID controller
const retrieveMoodById = (req, res) => {
  const moodId = req.params.id;
  const userId = req.user.id;

  moods.retrieveMoodByID(moodId, userId)
    .then(mood => {
      if (mood !== null && mood.user.equals(userId)) {
        res.json(mood);
      } else {
        res.status(404).json({ Error: "No mood found..." });
      }
    })
    .catch(error => {
      logger.error(error);
      res.status(400).json({ Error: "Whoops, something went wrong with retrieving your mood... Please try again or contact us if your issue persists!" });
    });
};

// UPDATE controller ************************************
const updateMoodById = (req, res) => {
  const moodId = req.params.id;
  const userId = req.user.id;

  moods.retrieveMoodByID(moodId, userId)
    .then(mood => {
      if (mood === null || !mood.user.equals(userId)) {
        throw new Error("No mood found...");
      }

      return moods.updateMood(
        moodId, userId,
        req.body.mood,
        req.body.scale,
        req.body.date
      );
    })
    .then(updatedMood => {
      res.status(200).json(updatedMood);
    })
    .catch(error => {
      logger.error(error);
      res.status(400).json({ error: "Whoops, something went wrong with updating your mood... Please try again or contact us if your issue persists!" });
    });
};

// DELETE by ID Controller ******************************
const deleteMoodById = (req, res) => {
  const moodId = req.params.id;
  const userId = req.user.id;

  moods.retrieveMoodByID(moodId, userId)
    .then(mood => {
      if (mood === null || !mood.user.equals(userId)) {
        throw new Error("No mood found...");
      }
      return moods.deleteMoodById(moodId, userId);
    })
    .then(deletedCount => {
      if (deletedCount === 1) {
        // Remove the deleted mood from the user's moods array
        return users.removeFromMoodsCollection(userId, moodId);
      } else {
        throw new Error("The mood document no longer exists");
      }
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      logger.error(error);
      res.status(500).json({ error: "Whoops, something went wrong with deleting your mood... Please try again or contact us if your issue persists!" });
    });
};

// DELETE Controller ******************************
const deleteMoods = (req, res) => {
  const userId = req.user.id;

  moods.deleteMoods(userId)
    .then(deletedCount => {
      if (deletedCount !== 0) {
        // Clear the user's moods array
        return users.resetMoodsCollection(userId);
      } else {
        throw new Error("The mood document no longer exists");
      }
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      logger.error(error);
      res.status(500).json({ error: "Whoops, something went wrong with deleting all your moods... Please try again or contact us if your issue persists!" });
    });
};


export {
  createMood,
  retrieveMoods,
  retrieveMoodById,
  updateMoodById,
  deleteMoodById,
  deleteMoods
};
