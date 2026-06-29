import { Router } from 'express';
import { register, login, verifyOTP, getMe, logout, resendOTP } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { registerValidator, loginValidator, otpValidator, resendOtpValidator } from '../validators/auth.validator.js';

const router = Router();

router.post('/register', ...registerValidator, validateRequest, register);
router.post('/login', ...loginValidator, validateRequest, login);
router.post('/verify-otp', ...otpValidator, validateRequest, verifyOTP);
router.post('/resend-otp', ...resendOtpValidator, validateRequest, resendOTP);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
