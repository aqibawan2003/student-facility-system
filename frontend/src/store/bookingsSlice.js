import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Thunk to book a bed
export const bookRoom = createAsyncThunk('bookings/bookRoom', async ({ hostelId, roomId, bed, paymentData }, { rejectWithValue }) => {
  console.log("hostelId",hostelId);
  console.log("roomId",roomId);
  console.log("bed",bed);
  console.log("paymentData",paymentData);
  const token = Cookies.get('token');
  try {
    const response = await axios.post(`http://localhost:5000/api/bookings/book/${hostelId}/${roomId}/${bed}`, { bed, paymentData }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { roomId, bed: response.data };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk to fetch all bookings
export const fetchBookings = createAsyncThunk('bookings/fetchBookings', async (_, { rejectWithValue }) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.get(`http://localhost:5000/api/bookings/HostelOwnerBookedBeds`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('fetchBookings for hostelowner:', response.data);
    return response.data; // Raw bookings data from the backend
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Thunk to unbook a bed
export const unbookRoom = createAsyncThunk('bookings/unbookRoom', async ({ roomId, bedId }, { rejectWithValue }) => {
  const token = Cookies.get('token');
  try {
    const response = await axios.delete(`http://localhost:5000/api/bookings/unbookBed`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { roomId, bedId }
    });
    return { roomId, bedId };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for fetching booked rooms
export const fetchBookedRooms = createAsyncThunk(
  'bookings/fetchBookedRooms',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching booked rooms');
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:5000/api/bookings/booked-rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('fetch Bookings:', response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: {}, // Stores bookings by roomId
    loading: false,
    error: null,
    bookedRooms: [],
    status: 'idle'
  },
  reducers: {
    // Reducer to remove a bed from the booking history
    removeRoomFromHistory: (state, action) => {
      const { hostelId, roomId, bedNumber } = action.payload;
      const hostel = state.bookings[hostelId];
      if (hostel) {
        const room = hostel.find(room => room._id === roomId);
        if (room) {
          room.beds = room.beds.filter(bed => bed.bed_number !== bedNumber);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Book Room
      .addCase(bookRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookRoom.fulfilled, (state, action) => {
        const { roomId, bed } = action.payload;
        if (!state.bookings[roomId]) {
          state.bookings[roomId] = { beds: [] };
        }
        state.bookings[roomId].beds.push(bed);
        state.loading = false;
      })
      .addCase(bookRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Booking failed';
      })

      // Unbook Room
      .addCase(unbookRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unbookRoom.fulfilled, (state, action) => {
        const { roomId, bedId } = action.payload;
        const room = state.bookings[roomId];
        if (room) {
          const bedIndex = room.beds.findIndex((bed) => bed._id === bedId);
          if (bedIndex !== -1) {
            room.beds[bedIndex].isBooked = false;
            room.beds[bedIndex].bookedBy = null;
            room.beds[bedIndex].bookingDate = null;
            room.beds[bedIndex].paymentStatus = 'pending';
          }
        }
        state.loading = false;
      })
      .addCase(unbookRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to unbook room';
      })

      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.data.reduce((acc, booking) => {
          acc[booking.room_id] = {
            beds: booking.beds,
            // You can also add any other details if needed
          };
          return acc;
        }, {}); // Transform the raw bookings array into an object with room_id keys
        state.loading = false;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      })

      // Fetch Booked Rooms
      .addCase(fetchBookedRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookedRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookedRooms = action.payload;
      })
      .addCase(fetchBookedRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch booked rooms';
      });
  }
});

export const { removeRoomFromHistory } = bookingsSlice.actions;
export default bookingsSlice.reducer;
