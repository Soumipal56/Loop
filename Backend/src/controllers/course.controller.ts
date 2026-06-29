import { Request, Response } from 'express';
import Course from '../models/course.model.js';
import '../models/chapter.model.js';
import '../models/lesson.model.js';
import Enrollment from '../models/enrollment.model.js';
import mongoose from 'mongoose';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({}).select('title shortDescription price');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching courses' });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Populate chapters and their lessons and exclude shortDescription/price
    const course = await Course.findById(req.params.id)
      .select('-shortDescription -price')
      .populate({
        path: 'chapters',
        populate: {
          path: 'lessons',
          model: 'Lesson',
        },
      });

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching course' });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;
    const userId = (req as any).user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      res.status(400).json({ message: 'Already enrolled in this course' });
      return;
    }

    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
    });

    const createdEnrollment = await enrollment.save();
    res.status(201).json(createdEnrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during enrollment' });
  }
};

// @desc    Check enrollment status
// @route   GET /api/courses/:id/enrollment-status
// @access  Private
export const checkEnrollment = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;
    const userId = (req as any).user._id;

    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    
    if (enrollment) {
      res.json({ isEnrolled: true, enrollment });
    } else {
      res.json({ isEnrolled: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error checking enrollment' });
  }
};
