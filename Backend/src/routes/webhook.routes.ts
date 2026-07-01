import express from 'express';
import { handleStripeWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

// The webhook handler requires the raw body, which is configured in app.ts
router.post('/stripe', handleStripeWebhook);

export default router;
