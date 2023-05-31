import express from 'express';
import * as users from '../controllers/userController.mjs';


const router = express.Router();

router.post('/', users.createUser)
router.get('/', users.retrieveUsers);
router.get('/:id', users.retrieveUserById);
router.put('/:id', users.updateUserById);
router.delete('/:id', users.deleteUserById);
router.delete('/', users.deleteUsers);


export default router;