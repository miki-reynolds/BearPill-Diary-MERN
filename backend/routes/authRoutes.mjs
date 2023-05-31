import express from 'express';
import * as authController from '../controllers/authController.mjs';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.mjs';


const router = express.Router();

router.post('/sign-in', authController.signIn);
router.post('/sign-up', authController.signUp);
router.post('/admin/register', authorizationMiddleware, authController.createAdminAccount);


export default router;