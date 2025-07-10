import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';

interface Banner {
  _id: string;
  imageUrl: string;
  title: string;
}

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

export const fetchActiveBanners = createAsyncThunk<
  { banners: Banner[] },
  { type?: string; categoryId?: string } | undefined
>('banner/fetchActiveBanners', async (params, thunkAPI) => {
  try {
    const response = await api.post('/api/gateway', {
      route: "getActiveBanners",
      payload: { params }
    });
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch banners'
    );
  }
});


const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearBanners: (state) => {
      state.banners = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveBanners.fulfilled, (state, action: PayloadAction<{ banners: Banner[] }>) => {
        state.loading = false;
        state.banners = action.payload.banners;
      })
      .addCase(fetchActiveBanners.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { clearBanners } = bannerSlice.actions;
export default bannerSlice.reducer;
