import express from 'express';
import { 
  getAllCourses, 
  getCourseById, 
  enrollCourse, 
  checkEnrollment,
  getEnrolledCourses
} from '../controllers/course.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(getAllCourses);
router.route('/enrolled').get(protect, getEnrolledCourses);
router.route('/:id').get(getCourseById);
router.route('/:id/enroll').post(protect, enrollCourse);
router.route('/:id/enrollment-status').get(protect, checkEnrollment);

export default router;
