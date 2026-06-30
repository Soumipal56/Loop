import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchCourses, fetchCourseById, enrollInCourse, checkEnrollment, fetchDashboardCourses, clearCurrentCourse } from '../state/course.slice';

export const useCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, currentCourse, enrolledCourses, isEnrolled, isLoading, error } = useSelector((state: RootState) => state.course);

  const getCourses = () => {
    dispatch(fetchCourses());
  };

  const getCourseById = (id: string) => {
    dispatch(fetchCourseById(id));
  };

  const enroll = (id: string) => {
    return dispatch(enrollInCourse(id)).unwrap();
  };

  const verifyEnrollment = (id: string) => {
    dispatch(checkEnrollment(id));
  };

  const getDashboardCourses = useCallback(() => {
    return dispatch(fetchDashboardCourses()).unwrap();
  }, [dispatch]);

  const resetCurrentCourse = () => {
    dispatch(clearCurrentCourse());
  };

  return {
    courses,
    currentCourse,
    enrolledCourses,
    isEnrolled,
    isLoading,
    error,
    getCourses,
    getCourseById,
    enroll,
    verifyEnrollment,
    getDashboardCourses,
    resetCurrentCourse,
  };
};
