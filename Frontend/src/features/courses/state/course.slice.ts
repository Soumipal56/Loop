import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as courseApi from '../api/course.api';

export interface CourseState {
  courses: courseApi.Course[];
  currentCourse: courseApi.CourseDetail | null;
  enrolledCourses: courseApi.Course[];
  isEnrolled: boolean;
  isLoading: boolean;
  error: string | null;
  currentLesson: courseApi.Lesson | null;
  isLessonCompleted: boolean;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  isEnrolled: false,
  isLoading: false,
  error: null,
  currentLesson: null,
  isLessonCompleted: false,
};

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await courseApi.fetchCourses();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await courseApi.fetchCourseById(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course details');
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'course/enroll',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await courseApi.enrollInCourse(id);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll');
    }
  }
);

export const checkEnrollment = createAsyncThunk(
  'course/checkEnrollment',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await courseApi.checkEnrollment(id);
      return data.isEnrolled;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check enrollment');
    }
  }
);

export const fetchDashboardCourses = createAsyncThunk(
  'course/fetchDashboardCourses',
  async (_, { rejectWithValue }) => {
    try {
      const data = await courseApi.getEnrolledCoursesDashboard();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard courses');
    }
  }
);

export const fetchLessonById = createAsyncThunk(
  'course/fetchLessonById',
  async ({ courseId, lessonId }: { courseId: string; lessonId: string }, { rejectWithValue }) => {
    try {
      const data = await courseApi.getLessonById(courseId, lessonId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lesson');
    }
  }
);

export const completeLesson = createAsyncThunk(
  'course/completeLesson',
  async ({ courseId, lessonId }: { courseId: string; lessonId: string }, { rejectWithValue }) => {
    try {
      const data = await courseApi.markLessonComplete(courseId, lessonId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark lesson complete');
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.isEnrolled = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<courseApi.Course[]>) => {
        state.isLoading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Course By ID
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<courseApi.CourseDetail>) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Enroll
      .addCase(enrollInCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state) => {
        state.isLoading = false;
        state.isEnrolled = true;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check Enrollment
      .addCase(checkEnrollment.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.isEnrolled = action.payload;
      })
      // Fetch Dashboard Courses
      .addCase(fetchDashboardCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardCourses.fulfilled, (state, action: PayloadAction<courseApi.Course[]>) => {
        state.isLoading = false;
        state.enrolledCourses = action.payload;
      })
      .addCase(fetchDashboardCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Lesson By ID
      .addCase(fetchLessonById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentLesson = null;
      })
      .addCase(fetchLessonById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLesson = action.payload.lesson;
        state.isLessonCompleted = action.payload.isCompleted;
      })
      .addCase(fetchLessonById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete Lesson
      .addCase(completeLesson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeLesson.fulfilled, (state) => {
        state.isLoading = false;
        state.isLessonCompleted = true;
      })
      .addCase(completeLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
