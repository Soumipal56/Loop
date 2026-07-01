import express from 'express';
import { 
  getAllCourses, 
  getCourseById, 
  enrollCourse, 
  checkEnrollment,
  getEnrolledCourses,
  getLessonById,
  markLessonComplete
} from '../controllers/course.controller.js';
import { createCheckoutSession } from '../controllers/payment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { arcjetBotProtect } from '../middlewares/arcjet.middleware.js';

const router = express.Router();

router.route('/').get(getAllCourses);
router.route('/enrolled').get(protect, getEnrolledCourses);
router.route('/:id').get(getCourseById);
router.route('/:id/checkout').post(protect, arcjetBotProtect, createCheckoutSession);
router.route('/:id/enroll').post(protect, enrollCourse);
router.route('/:id/enrollment-status').get(protect, checkEnrollment);
router.route('/:id/lessons/:lessonId').get(protect, getLessonById);
router.route('/:id/lessons/:lessonId/complete').post(protect, markLessonComplete);

export default router;
