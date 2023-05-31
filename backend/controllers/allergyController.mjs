import * as allergies from '../models/Allergy.mjs';
import * as users from '../models/User.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller ******************************************
const createAllergy = (req, res) => {
  const userId = req.user.id;

  allergies.createAllergy(
    req.body.name,
    req.body.reactions,
    req.body.notes,
    req.body.current,
    req.body.date,
    userId
  )
    .then(allergy => {
      // Associate the created allergy with the user
      return users.addToAllergiesCollection(userId, allergy._id);
    })
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(error => {
      logger.error(error);
      if (error.errors && error.errors.name && error.errors.name.kind === 'unique') {
        res.status(400).json({ error: 'Allergy with the same name already exists.' });
      } else {
        res.status(500).json({ error: "Whoops, something went wrong with recording your allergy today... Please try again or contact us if your issue persists!" });
      }
    });
};

// RETRIEVE controller ****************************************************
const retrieveAllergies = (req, res) => {
  const userId = req.user.id;

  allergies.retrieveAllergies(userId)
    .then(allergies => {
      if (allergies.length !== 0) {
        res.json(allergies);
      } else {
        res.status(404).json({ Error: "No allergies found..." });
      }
    })
    .catch(error => {
      logger.error(error);
      res.status(400).json({ Error: "Whoops, something went wrong with retrieving your allergies... Please try again or contact us if your issue persists!" });
    });
};

// RETRIEVE by ID controller
const retrieveAllergyById = (req, res) => {
  const allergyId = req.params.id;
  const userId = req.user.id;

  allergies.retrieveAllergyByID(allergyId, userId)
    .then(allergy => {
      if (allergy !== null && allergy.user.equals(userId)) {
        res.json(allergy);
      } else {
        res.status(404).json({ Error: "No allergy found..." });
      }
    })
    .catch(error => {
      logger.error(error);
      res.status(400).json({ Error: "Whoops, something went wrong with retrieving your allergy... Please try again or contact us if your issue persists!" });
    });
};

// UPDATE controller ************************************
const updateAllergyById = (req, res) => {
  const allergyId = req.params.id;
  const userId = req.user.id;

  allergies.updateAllergy(
    allergyId,
    userId,
    req.body.name,
    req.body.reactions,
    req.body.notes,
    req.body.current,
    req.body.date
  )
    .then(updatedAllergy => {
      if (updatedAllergy === null) {
        throw new Error("No allergy found...");
      }

      res.status(200).json(updatedAllergy);
    })
    .catch(error => {
      logger.error(error);
      if (error.errors && error.errors.name && error.errors.name.kind === 'unique') {
        res.status(400).json({ error: 'Allergy with the same name already exists.' });
      } else {
        res.status(400).json({ error: "Whoops, something went wrong with updating your allergy today... Please try again or contact us if your issue persists!" });
      }
    });
};


// DELETE by IDController ******************************
const deleteAllergyById = (req, res) => {
  const allergyId = req.params.id;
  const userId = req.user.id;

  allergies.deleteAllergyById(allergyId, userId)
    .then(deletedCount => {
      if (deletedCount === 1) {
        // Remove the deleted allergy from the user's allergies array
        return users.removeFromAllergiesCollection(userId, allergyId);
      } else {
        throw new Error("The allergy document no longer exists");
      }
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      logger.error(error);
      res.status(500).json({ error: "Whoops, something went wrong with deleting your allergy... Please try again or contact us if your issue persists!" });
    });
};

// DELETE Controller ******************************
const deleteAllergies = (req, res) => {
  const userId = req.user.id;

  allergies.deleteAllergies(userId)
    .then(deletedCount => {
      if (deletedCount !== 0) {
        // Clear the user's allergies array
        return users.resetAllergiesCollection(userId);
      } else {
        throw new Error("The Allergy document no longer exists");
      }
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      logger.error(error);
      res.status(500).json({ error: "Whoops, something went wrong with deleting all your allergies... Please try again or contact us if your issue persists!" });
    });
};


export {
  createAllergy,
  retrieveAllergies,
  retrieveAllergyById,
  updateAllergyById,
  deleteAllergyById,
  deleteAllergies
};
