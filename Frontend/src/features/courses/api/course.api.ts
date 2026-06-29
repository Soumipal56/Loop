import axios from 'axios';

const API_URL = 'http://localhost:5000/api/courses';

export interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  price: number;
}

export interface Lesson {
  _id: string;
  title: string;
  duration: string;
  videoUrl: string;
  order: number;
}

export interface Chapter {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  description: string;
  chapters: Chapter[];
}

export const fetchCourses = async (): Promise<Course[]> => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const fetchCourseById = async (id: string): Promise<CourseDetail> => {
  const response = await axios.get(`${API_URL}/${id}`, { withCredentials: true });
  return response.data;
};

export const enrollInCourse = async (id: string): Promise<any> => {
  const response = await axios.post(`${API_URL}/${id}/enroll`, {}, { withCredentials: true });
  return response.data;
};

export const checkEnrollment = async (id: string): Promise<{ isEnrolled: boolean; enrollment?: any }> => {
  const response = await axios.get(`${API_URL}/${id}/enrollment-status`, { withCredentials: true });
  return response.data;
};
