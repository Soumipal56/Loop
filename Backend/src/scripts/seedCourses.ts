import mongoose from 'mongoose';
import { config } from '../config/config.js';

import Course from '../models/course.model.js';
import Chapter from '../models/chapter.model.js';
import Lesson from '../models/lesson.model.js';

// Since finding a highly structured free course API with chapters and lessons is rare, 
// we construct robust dummy data here to act as our "free API" data for testing.
const mockCourses = [
  {
    title: 'Advanced React Patterns',
    shortDescription: 'Master React by learning advanced design patterns and performance optimization.',
    description: 'This comprehensive course takes you beyond the basics of React. You will learn about Higher-Order Components, Render Props, Compound Components, and the latest React features. Perfect for developers looking to build scalable and maintainable applications.',
    price: 3999,
    chapters: [
      {
        title: 'Introduction to Patterns',
        lessons: [
          { title: 'Why patterns matter', duration: '5:00', videoUrl: 'https://example.com/video1' },
          { title: 'React component lifecycle refresher', duration: '12:30', videoUrl: 'https://example.com/video2' }
        ]
      },
      {
        title: 'Compound Components',
        lessons: [
          { title: 'Building a Toggle component', duration: '15:45', videoUrl: 'https://example.com/video3' },
          { title: 'Flexible compound components', duration: '18:20', videoUrl: 'https://example.com/video4' }
        ]
      }
    ]
  },
  {
    title: 'Node.js Microservices',
    shortDescription: 'Build scalable backend systems with Node.js and Docker.',
    description: 'Learn how to architect, build, and deploy microservices using Node.js. We cover inter-service communication, event-driven architecture with RabbitMQ, and containerization using Docker and Kubernetes.',
    price: 6499,
    chapters: [
      {
        title: 'Architecture Overview',
        lessons: [
          { title: 'Monolith vs Microservices', duration: '10:00', videoUrl: 'https://example.com/video5' },
          { title: 'Designing service boundaries', duration: '20:15', videoUrl: 'https://example.com/video6' }
        ]
      }
    ]
  },
  {
    title: 'UI/UX Design for Developers',
    shortDescription: 'Improve your apps with better design fundamentals.',
    description: 'Stop building ugly apps. This course covers color theory, typography, spacing, and user psychology specifically tailored for software developers who want to improve their design sense.',
    price: 0, // Free course
    chapters: [
      {
        title: 'Foundations',
        lessons: [
          { title: 'Color theory for coders', duration: '14:20', videoUrl: 'https://example.com/video7' },
          { title: 'Typography rules', duration: '11:10', videoUrl: 'https://example.com/video8' }
        ]
      }
    ]
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing
    await Course.deleteMany();
    await Chapter.deleteMany();
    await Lesson.deleteMany();

    for (const courseData of mockCourses) {
      const createdCourse = await Course.create({
        title: courseData.title,
        shortDescription: courseData.shortDescription,
        description: courseData.description,
        price: courseData.price,
      });

      const courseChapters = [];

      let chapterOrder = 1;
      for (const chapterData of courseData.chapters) {
        const createdChapter = await Chapter.create({
          courseId: createdCourse._id,
          title: chapterData.title,
          order: chapterOrder++,
        });

        const chapterLessons = [];
        let lessonOrder = 1;
        for (const lessonData of chapterData.lessons) {
          const createdLesson = await Lesson.create({
            chapterId: createdChapter._id,
            title: lessonData.title,
            duration: lessonData.duration,
            videoUrl: lessonData.videoUrl,
            order: lessonOrder++,
          });
          chapterLessons.push(createdLesson._id);
        }

        createdChapter.lessons = chapterLessons;
        await createdChapter.save();
        courseChapters.push(createdChapter._id);
      }

      createdCourse.chapters = courseChapters;
      await createdCourse.save();
    }

    console.log('Courses seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seed error: ${error}`);
    process.exit(1);
  }
};

seedData();
