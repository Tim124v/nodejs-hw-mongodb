import express from 'express';
import cookieParser from 'cookie-parser';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, refreshSchema } from '../validation/authValidation.js';
import { registerController, loginController, refreshController, logoutController } from '../controllers/authController.js';

const router = express.Router();

router.use(cookieParser());

router.post('/register', validateBody(registerSchema), ctrlWrapper(registerController));
router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/refresh', ctrlWrapper(refreshController));
router.get('/refresh', ctrlWrapper(refreshController));
router.post('/logout', ctrlWrapper(logoutController));

export default router;


