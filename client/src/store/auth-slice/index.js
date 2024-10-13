import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state with error handling added
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
};

// Helper function to process fulfilled states
const handleAuthFulfilled = (state, action) => {
  state.isLoading = false;
  state.user = action.payload.success ? action.payload.user : null;
  state.isAuthenticated = action.payload.success;
  state.error = null; // Clear errors on success
};

// Helper function to process rejected states
const handleAuthRejected = (state, action) => {
  state.isLoading = false;
  state.user = null;
  state.isAuthenticated = false;
  state.error = action.error.message; // Store the error message
};

// Async thunk for user registration
export const registerUser = createAsyncThunk("/auth/register", async (formData) => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/register",
    formData,
    { withCredentials: true }
  );
  return response.data;
});

// Async thunk for user login
export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    formData,
    { withCredentials: true }
  );
  return response.data;
});

// Async thunk for user logout
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.post(
    "http://localhost:5000/api/auth/logout",
    {},
    { withCredentials: true }
  );
  return response.data;
});

// Async thunk for checking if the user is authenticated
export const checkAuth = createAsyncThunk("/auth/checkauth", async () => {
  const response = await axios.get(
    "http://localhost:5000/api/auth/check-auth",
    {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
  return response.data;
});

// Auth slice with extraReducers for handling async actions
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null; // Reset any previous errors
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, handleAuthRejected)

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, handleAuthRejected)

      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, handleAuthFulfilled)
      .addCase(checkAuth.rejected, handleAuthRejected)

      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Clear any previous errors
      });
  },
});

// Export the `setUser` action and the auth slice reducer
export const { setUser } = authSlice.actions;
export default authSlice.reducer;
