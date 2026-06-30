import mongoose from "mongoose";
import { config } from "../config/config.js";

import Course from "../models/course.model.js";
import Chapter from "../models/chapter.model.js";
import Lesson from "../models/lesson.model.js";

// Since finding a highly structured free course API with chapters and lessons is rare,
// we construct robust dummy data here to act as our "free API" data for testing.
const mockCourses = [
  {
    title: "Advanced React Patterns",
    shortDescription:
      "Master React by learning advanced design patterns and performance optimization.",
    description:
      "This comprehensive course takes you beyond the basics of React. You will learn about Higher-Order Components, Render Props, Compound Components, and the latest React features. Perfect for developers looking to build scalable and maintainable applications.",
    price: 3999,
    chapters: [
      {
        title: "Introduction to Patterns",
        lessons: [
          {
            title: "Why patterns matter",
            duration: "5:00",
            videoUrl: "https://example.com/video1",
          },
          {
            title: "React component lifecycle refresher",
            duration: "12:30",
            videoUrl: "https://example.com/video2",
          },
        ],
      },
      {
        title: "Compound Components",
        lessons: [
          {
            title: "Building a Toggle component",
            duration: "15:45",
            videoUrl: "https://example.com/video3",
          },
          {
            title: "Flexible compound components",
            duration: "18:20",
            videoUrl: "https://example.com/video4",
          },
        ],
      },
      {
        title: 'Custom Hooks Architecture',
        lessons: [
          { title: 'Rules of Hooks', duration: '6:30', videoUrl: 'https://example.com/video12' },
          { title: 'Building useFetch', duration: '18:40', videoUrl: 'https://example.com/video13' },
          { title: 'Advanced hook patterns', duration: '21:15', videoUrl: 'https://example.com/video14' }
        ]
      },
      {
        title: 'State Management Deep Dive',
        lessons: [
          { title: 'Redux Toolkit Essentials', duration: '25:00', videoUrl: 'https://example.com/video15' },
          { title: 'Zustand vs Redux', duration: '18:30', videoUrl: 'https://example.com/video16' },
          { title: 'Server State with React Query', duration: '30:15', videoUrl: 'https://example.com/video17' },
          { title: 'React Query Mutations', duration: '15:20', videoUrl: 'https://example.com/video18' },
          { title: 'Optimistic Updates', duration: '22:45', videoUrl: 'https://example.com/video19' }
        ]
      },
      {
        title: 'Testing React Applications',
        lessons: [
          { title: 'Jest and React Testing Library', duration: '15:10', videoUrl: 'https://example.com/video20' },
          { title: 'Testing Custom Hooks', duration: '12:30', videoUrl: 'https://example.com/video21' },
          { title: 'Mocking APIs with MSW', duration: '28:15', videoUrl: 'https://example.com/video22' },
          { title: 'E2E Testing with Cypress', duration: '35:00', videoUrl: 'https://example.com/video23' }
        ]
      },
      {
        title: 'Advanced Routing',
        lessons: [
          { title: 'React Router v6 Architecture', duration: '18:20', videoUrl: 'https://example.com/video24' },
          { title: 'Data Loaders and Actions', duration: '24:10', videoUrl: 'https://example.com/video25' },
          { title: 'Nested Routes and Layouts', duration: '14:45', videoUrl: 'https://example.com/video26' }
        ]
      },
      {
        title: 'Next.js Transition',
        lessons: [
          { title: 'Why Next.js?', duration: '12:00', videoUrl: 'https://example.com/video27' },
          { title: 'Server Components vs Client Components', duration: '26:30', videoUrl: 'https://example.com/video28' },
          { title: 'App Router Deep Dive', duration: '32:15', videoUrl: 'https://example.com/video29' },
          { title: 'Data Fetching in Next.js', duration: '21:50', videoUrl: 'https://example.com/video30' }
        ]
      }
    ],
  },
  {
    title: "Node.js Microservices",
    shortDescription: "Build scalable backend systems with Node.js and Docker.",
    description:
      "Learn how to architect, build, and deploy microservices using Node.js. We cover inter-service communication, event-driven architecture with RabbitMQ, and containerization using Docker and Kubernetes.",
    price: 6499,
    chapters: [
      {
        title: "Architecture Overview",
        lessons: [
          {
            title: "Monolith vs Microservices",
            duration: "10:00",
            videoUrl: "https://example.com/video5",
          },
          {
            title: "Designing service boundaries",
            duration: "20:15",
            videoUrl: "https://example.com/video6",
          },
        ],
      },
      {
        title: "Inter-Service Communication",
        lessons: [
          { title: "REST vs gRPC vs Messaging", duration: "25:30", videoUrl: "https://example.com/video33" },
          { title: "Building an API Gateway", duration: "18:45", videoUrl: "https://example.com/video34" },
          { title: "Handling Network Failures", duration: "15:20", videoUrl: "https://example.com/video35" },
        ],
      },
      {
        title: "Event-Driven Architecture",
        lessons: [
          { title: "Introduction to RabbitMQ", duration: "22:10", videoUrl: "https://example.com/video36" },
          { title: "Publish/Subscribe Pattern", duration: "19:05", videoUrl: "https://example.com/video37" },
          { title: "Idempotency and Dead Letter Queues", duration: "28:50", videoUrl: "https://example.com/video38" },
        ],
      },
      {
        title: "Docker & Containerization",
        lessons: [
          { title: "Dockerizing Node.js apps", duration: "16:40", videoUrl: "https://example.com/video39" },
          { title: "Multi-stage builds", duration: "12:15", videoUrl: "https://example.com/video40" },
          { title: "Docker Compose for local dev", duration: "21:30", videoUrl: "https://example.com/video41" },
        ],
      },
      {
        title: "Kubernetes & Deployment",
        lessons: [
          { title: "K8s Architecture 101", duration: "35:00", videoUrl: "https://example.com/video42" },
          { title: "Deployments and Services", duration: "24:10", videoUrl: "https://example.com/video43" },
          { title: "Ingress Controllers", duration: "18:25", videoUrl: "https://example.com/video44" },
        ],
      },
    ],
  },
  {
    title: "UI/UX Design for Developers",
    shortDescription: "Improve your apps with better design fundamentals.",
    description:
      "Stop building ugly apps. This course covers color theory, typography, spacing, and user psychology specifically tailored for software developers who want to improve their design sense.",
    price: 0, // Free course
    chapters: [
      {
        title: "Foundations",
        lessons: [
          {
            title: "Color theory for coders",
            duration: "14:20",
            videoUrl: "https://example.com/video7",
          },
          {
            title: "Typography rules",
            duration: "11:10",
            videoUrl: "https://example.com/video8",
          },
        ],
      },
      {
        title: "Layout and Spacing",
        lessons: [
          { title: "The 8-point Grid System", duration: "16:45", videoUrl: "https://example.com/video45" },
          { title: "Whitespace is your friend", duration: "12:30", videoUrl: "https://example.com/video46" },
          { title: "Responsive layout patterns", duration: "21:10", videoUrl: "https://example.com/video47" },
        ],
      },
      {
        title: "Component Design",
        lessons: [
          { title: "Designing perfect buttons", duration: "10:15", videoUrl: "https://example.com/video48" },
          { title: "Accessible Form Inputs", duration: "19:20", videoUrl: "https://example.com/video49" },
          { title: "Cards and Containers", duration: "14:40", videoUrl: "https://example.com/video50" },
        ],
      },
      {
        title: "Advanced Interactions",
        lessons: [
          { title: "Micro-interactions and Animations", duration: "25:30", videoUrl: "https://example.com/video51" },
          { title: "Loading states and skeletons", duration: "15:00", videoUrl: "https://example.com/video52" },
          { title: "Error states and feedback", duration: "18:45", videoUrl: "https://example.com/video53" },
        ],
      },
    ],
  },
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

    console.log("Courses seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Seed error: ${error}`);
    process.exit(1);
  }
};

seedData();
