import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteUser, updateUser } from "../../utils/api/userApi";
import { BASE_URL } from "../../utils/constants";

// Update user-----------------------------------------------
export const userDeleteAction = createAsyncThunk(
  "users/deleteUser",
  async ({ userId }, thunkAPI) => {
    try {
      const { data } = await deleteUser(userId);

      thunkAPI.dispatch(userLogout());

      return data;
    } catch (error) {
      if (!error?.response)
        return thunkAPI.rejectWithValue("An unexpected error occurred..");
      console.log(error);
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
// Update user-----------------------------------------------
export const userUpdateAction = createAsyncThunk(
  "users/updateUser",
  async ({ name, bio, image }, thunkAPI) => {
    try {
      const { data } = await updateUser({ name, bio, image });

      return data;
    } catch (error) {
      if (!error?.response)
        return thunkAPI.rejectWithValue("An unexpected error occurred..");
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const userRegisterAction = createAsyncThunk(
  "users/register",
  async ({ user, remember }, thunkAPI) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/users`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      sessionStorage.setItem("user", JSON.stringify(data));
      if (remember) localStorage.setItem("token", data.token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      if (!error?.response)
        return thunkAPI.rejectWithValue("An unexpected error occurred..");

      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

//------------------------------------------------------------
export const userLoginAction = createAsyncThunk(
  "users/login",
  async ({ email, password, remember }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/users/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      sessionStorage.setItem("user", JSON.stringify(data));
      if (remember) localStorage.setItem("token", data.token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      return data;
    } catch (error) {
      if (!error?.response)
        return thunkAPI.rejectWithValue("An unexpected error occurred..");

      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

//------------------------------------------------------------

//------------------------------------------------------------
const userSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    auth: false,
    token: null,
    error: null,
    loading: false,

    deleteLoading: false,
    deleted: false,
    deleteError: null,

    updateLoading: false,
    updated: false,
    updateError: null,
  },
  // Reducers-------------------------------
  reducers: {
    userLogout: () => {
      sessionStorage.removeItem("user");
      localStorage.removeItem("token");
      return userSlice.getInitialState();
    },
    userSession: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.auth = true;
      state.error = null;
      state.loading = false;
    },
    userClearUpdated: (state) => {
      state.updated = false;
    },
  },

  // Register-----------------------------------------------
  extraReducers: (builder) => {
    builder.addCase(userRegisterAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userRegisterAction.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.auth = true;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(userRegisterAction.rejected, (state, action) => {
      state.error = action.payload || action.error;
      state.loading = false;
    });
    // Login-----------------------------------------------
    builder.addCase(userLoginAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userLoginAction.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.auth = true;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(userLoginAction.rejected, (state, action) => {
      state.error = action.payload || action.error;
      state.loading = false;
    });
    // Update user--------------------------------------------
    builder.addCase(userUpdateAction.pending, (state) => {
      state.updateLoading = true;
      state.updateError = null;
    });
    builder.addCase(userUpdateAction.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.updated = true;
      state.updateError = null;
      state.updateLoading = false;
    });
    builder.addCase(userUpdateAction.rejected, (state, action) => {
      state.updateError = action.payload || action.error;
      state.updateLoading = false;
      state.updated = false;
    });
    // Delete user--------------------------------------------
    builder.addCase(userDeleteAction.pending, (state) => {
      state.deleteLoading = true;
      state.deleteError = null;
    });
    builder.addCase(userDeleteAction.fulfilled, (state) => {
      return userSlice.getInitialState();
    });
    builder.addCase(userDeleteAction.rejected, (state, action) => {
      state.deleteError = action.payload || action.error;
      state.deleteLoading = false;
      state.deleted = false;
    });
  },
});

export const { userLogout, userSession, userClearUpdated } = userSlice.actions;

export default userSlice.reducer;
