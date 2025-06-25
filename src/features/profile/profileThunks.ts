import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

export const getuserProfile = createAsyncThunk(
    'profile/getProfile',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/profile', { userId });
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async(data, { rejectWithValue }) => {
        try {
            const response = await api.put('/user/profile',  data );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
        }
    }
)