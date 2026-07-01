import { Request, Response } from 'express';
import Stripe from 'stripe';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import mongoose from 'mongoose';

// Initialize Stripe with secret key from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

// @desc    Create a Stripe checkout session for course enrollment
// @route   POST /api/courses/:id/checkout
// @access  Private
export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;
    const userId = (req as any).user._id;

    if (!mongoose.isValidObjectId(courseId)) {
      res.status(400).json({ message: 'Invalid course ID' });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      res.status(400).json({ message: 'Already enrolled in this course' });
      return;
    }

    // Determine the frontend URL to redirect to after checkout
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.shortDescription,
            },
            unit_amount: course.price * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/courses/${courseId}?success=true`,
      cancel_url: `${frontendUrl}/courses/${courseId}?canceled=true`,
      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: error.message || 'Server Error during checkout session creation' });
  }
};

// @desc    Handle Stripe Webhooks
// @route   POST /api/webhooks/stripe
// @access  Public
export const handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    // req.body must be raw buffer for signature verification
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve userId and courseId from metadata
    const userId = session.metadata?.userId;
    const courseId = session.metadata?.courseId;

    if (userId && courseId) {
      try {
        // Create enrollment if it doesn't exist
        const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
        if (!existingEnrollment) {
          const enrollment = new Enrollment({
            user: userId,
            course: courseId,
          });
          await enrollment.save();
          console.log(`User ${userId} enrolled in course ${courseId} via Stripe webhook.`);
        }
      } catch (err) {
        console.error('Error creating enrollment from webhook:', err);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
