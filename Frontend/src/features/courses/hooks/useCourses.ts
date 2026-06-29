import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchCourses, fetchCourseById, clearCurrentCourse, enrollInCourse, checkEnrollment } from '../state/course.slice';

export const useCourses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, currentCourse, isEnrolled, isLoading, error } = useSelector((state: RootState) => state.course);

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

  const resetCurrentCourse = () => {
    dispatch(clearCurrentCourse());
  };

  return {
    courses,
    currentCourse,
    isEnrolled,
    isLoading,
    error,
    getCourses,
    getCourseById,
    enroll,
    verifyEnrollment,
    resetCurrentCourse,
  };
};
