import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice';
import courseReducer from '../features/courses/state/course.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
