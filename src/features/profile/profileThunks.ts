import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";
import { UpdateProfile, UserProfile } from "./profileTypes";

export const getuserProfile = createAsyncThunk<UserProfile, string>(
    'profile/getProfile',
    async (_userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/profile');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateProfile = createAsyncThunk<UserProfile, UpdateProfile>(
    'profile/updateProfile',
    async (data: UpdateProfile, { rejectWithValue }) => {
        try {
            const response = await api.put('/user/profile', data);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
)