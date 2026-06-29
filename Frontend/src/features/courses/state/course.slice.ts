import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as courseApi from '../api/course.api';

export interface CourseState {
  courses: courseApi.Course[];
  currentCourse: courseApi.CourseDetail | null;
  isEnrolled: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  isEnrolled: false,
  isLoading: false,
  error: null,
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
      return data; // { isEnrolled: boolean, ... }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check enrollment');
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
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
        state.isEnrolled = false;
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
      .addCase(checkEnrollment.fulfilled, (state, action: PayloadAction<{isEnrolled: boolean}>) => {
        state.isEnrolled = action.payload.isEnrolled;
      });
  },
});

export const { clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;
