import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchAllDishes = createAsyncThunk('kitchens/fetchAllDishes', async () => {
  const token = Cookies.get('token');
  const response = await axios.get('http://localhost:5000/api/dishes/getAllDishes', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const addItem = createAsyncThunk(
  'kitchens/addItem',
  async (itemDetails) => {
    const token = Cookies.get('token');
    const response = await axios.post('http://localhost:5000/api/dishes/createDish', itemDetails, {
      headers: { Authorization: `Bearer ${token}` },  
    });
    return response.data;
  }
);

export const updateItem = createAsyncThunk(
  'kitchens/updateItem',
  async ({ id, itemDetails }) => {
    const token = Cookies.get('token');
    const response = await axios.put(`http://localhost:5000/api/dishes/updateDish/${id}`, itemDetails, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const deleteItem = createAsyncThunk(
  'kitchens/deleteItem',
  async (id) => {
    const token = Cookies.get('token');
    await axios.delete(`http://localhost:5000/api/dishes/deleteDish/${id}`, {
      headers: { Authorization: `Bearer ${token}` }, 
    });
    return id;
  }
);

export const fetchItem = createAsyncThunk(
  'kitchens/fetchItem',
  async (id) => {
    const token = Cookies.get('token');
    const response = await axios.get(`http://localhost:5000/api/dishes/getDish/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const kitchenSlice = createSlice({
  name: 'kitchens',
  initialState: { dishes: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDishes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDishes.fulfilled, (state, action) => {
        state.dishes = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllDishes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.dishes.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.dishes.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.dishes[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.dishes = state.dishes.filter((item) => item._id !== action.payload);
      })
      .addCase(fetchItem.fulfilled, (state, action) => {
        const index = state.dishes.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.dishes[index] = action.payload;
        } else {
          state.dishes.push(action.payload);
        }
      });
  },
});

export default kitchenSlice.reducer;
