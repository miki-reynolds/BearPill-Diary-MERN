import * as meds from '../models/Medication.mjs';
import * as users from '../models/User.mjs';
import * as logger from '../utils/logger.mjs';


// CREATE controller ******************************************
const createMed = (req, res) => {
  const userId = req.user.id; 

  meds.createMed(
    req.body.name,
    req.body.dosage,
    req.body.unit,
    req.body.instructions,
    req.body.notes,
    req.body.current,
    req.body.date,
    userId
  )
    .then(med => {
      // associate the created medication with the user
      return users.addToMedicationsCollection(userId, med._id);
    })
    .then(updatedUser => {
      res.status(201).json(updatedUser);
    })
    .catch(error => {
      logger.error(error);
      if (error.errors && error.errors.name && error.errors.name.kind === "unique") {
        res.status(400).json({ error: "Medication with the same name already exists." });
      } else {
        res.status(500).json({ error: "Whoops, something went wrong with recording your medication today... Please try again or contact us if your issue persists!" });
      }
    });
};

// RETRIEVE controller ****************************************************
const retrieveMeds = (req, res) => {
  const userId = req.user.id; // Assuming you have the user ID available in the request

  meds.retrieveMeds(userId)
    .then(meds => {
      if (meds.length !== 0) {
        res.json(meds);
      } else {
        res.status(404).json({ Error: "No medications found..." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ Error: "Whoops, something went wrong with retrieving your medications... Please try again or contact us if your issue persists!" });
    });
};

// RETRIEVE by ID controller
const retrieveMedById = (req, res) => {
  const medId = req.params.id;
  const userId = req.user.id; // Assuming you have the user ID available in the request

  meds.retrieveMedByID(medId, userId)
    .then(med => {
      if (med !== null && med.user.equals(userId)) {
        res.json(med);
      } else {
        res.status(404).json({ Error: "No medication found..." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(400).json({ Error: "Whoops, something went wrong with retrieving your medication... Please try again or contact us if your issue persists!" });
    });
};

// UPDATE controller ************************************
const updateMedById = (req, res) => {
  const medId = req.params.id;
  const userId = req.user.id; // Assuming you have the user ID available in the request

  meds.retrieveMedByID(medId, userId)
    .then(med => {
      if (med === null || !med.user.equals(userId)) {
        throw new Error("No medication found...");
      }

      return meds.updateMed(
        medId, userId,
        req.body.name,
        req.body.dosage,
        req.body.unit,
        req.body.instructions,
        req.body.notes,
        req.body.current,
        req.body.date
      );
    })
    .then(updatedMed => {
      res.status(200).json(updatedMed);
    })
    .catch(error => {
      logger.error(error);
      if (error.errors && error.errors.name && error.errors.name.kind === "unique") {
        res.status(400).json({ error: "Medication with the same name already exists." });
      } else {
        res.status(500).json({ error: "Whoops, something went wrong with recording your medication today... Please try again or contact us if your issue persists!" });
      }
    });
};

// DELETE by ID Controller ******************************
const deleteMedById = (req, res) => {
  const medId = req.params.id;
  const userId = req.user.id; // Assuming you have the user ID available in the request

  meds.retrieveMedByID(medId, userId)
    .then(med => {
      if (med === null || !med.user.equals(userId)) {
        throw new Error("No medication found...");
      }
      return meds.deleteMedById(medId, userId);
    })
    .then(deletedCount => {
      if (deletedCount === 1) {
        // Remove the deleted medication from the user"s medications array
        return users.removeFromMedicationsCollection(userId, medId);
      } else {
        throw new Error("The medication document no longer exists");
      }
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      console.error(error);
      res.send({ error: "Whoops, something went wrong with deleting your medication... Please try again or contact us if your issue persists!" });
    });
};

// DELETE Controller ******************************
const deleteMeds = (req, res) => {
  const userId = req.user.id; // Assuming you have the user ID available in the request

  meds.deleteMeds(userId)
    .then(deletedCount => {
      if (deletedCount !== 0) {
        // Clear the user's medications array
        return users.resetMedicationsCollection(userId);
      } else {
        throw new Error("The Med document no longer exists");
      }
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      console.error(error);
      res.send({ error: "Whoops, something went wrong with deleting all your medications... Please try again or contact us if your issue persists!" });
    });
};


export {
    createMed,
    retrieveMeds,
    retrieveMedById,
    updateMedById,
    deleteMedById,
    deleteMeds
};
