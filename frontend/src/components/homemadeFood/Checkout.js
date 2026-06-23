import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartAPI, getCartAPI } from '../../store/cartSlice'; // Using Redux actions for cart
import { getStudentDataAPI } from '../../store/studentSlice'; // Using Redux actions for student
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Cookies from 'js-cookie'; // Importing js-cookie library
import axios from 'axios'; // Importing axios library
import Footer from '../Footer';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentMethodDropdown } from '../PaymentOptions';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { kitchenId } = useLocation().state;

  // Get student and cart data from Redux
  const studentData = useSelector(state => state.student.data);
  const cartItems = useSelector(state => state.cart.carts.find(cart => cart.kitchenId === kitchenId));

  const [paymentMethod, setPaymentMethod] = useState('stripe'); // Default payment method (lowercase)
  const [phoneNumber, setPhoneNumber] = useState(''); // Editable phone number
  const [address, setAddress] = useState(''); // Editable address

  // Fetch student and cart data when component mounts
  useEffect(() => {
    dispatch(getStudentDataAPI()); // Fetch student data via Redux
    dispatch(getCartAPI()); // Fetch cart data via Redux
  }, [dispatch]);

  useEffect(() => {
    if (studentData) {
      setPhoneNumber(studentData.phone_number); // Set initial phone number
      setAddress(studentData.address); // Set initial address
    }
  }, [studentData]);

  const handleCheckout = async () => {
    if (studentData && cartItems && cartItems.items.length > 0 && paymentMethod) {
      const totalQuantity = cartItems.items.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = cartItems.totalPrice;
      const kitchenOwnerId = cartItems.kitchenId;
      const kitchenName = cartItems.kitchenName;

      // Constructing the order data to send to the backend
      const orderData = {
        kitchenOwnerId,
        kitchenName,
        deliveryAddress: address, // Use updated address
        dishes: cartItems.items.map(item => ({
          id: item.productId._id, // Map productId correctly
          name: item.productId.name, // Product name
          quantity: item.quantity, // Quantity
          price: item.productId.price, // Price
        })),
        totalQuantity,
        totalPrice,
        paymentMethod,
      };

      try {
        const token = Cookies.get('token');
        const response = await axios.post('http://localhost:5000/api/order/create', orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          const stripe = await loadStripe('pk_test_51Pt35iP2ehImy2wSPgITh4dPbPxSQaKYGG8Q8D15WGMIMgZpxIgxVPwZEY0p2qv27KKLxahchM2xDmrc4dziYhR300d87CUntQ');
          await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
        } else {
          console.error('Error creating order:', response.data.message);
          alert('Error creating order: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout. Please try again.');
      }
    } else {
      alert('Please complete all fields before proceeding with the payment.');
    }
  };

  const handleCancel = () => {
    navigate('/cart'); // Navigate back to the cart page
  };

  if (!cartItems) return <div>No cart items found!</div>;

  return (
    <>
      <div className='bg-[#1E201E]'>
  <Navbar module={'food'} />
  <div className="container border-b border-[#59636e] mx-auto pt-32 text-white">
    <h2 className="text-2xl text-center font-bold mb-4">Checkout</h2>
    <form 
      className="max-w-lg mx-auto mb-5 bg-[#25292e] border border-[#59636e] text-white p-8 rounded shadow-lg"
      style={{ maxHeight: '500px', overflowY: 'auto' }} // Scrollable form
    >
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={`${studentData.first_name} ${studentData.last_name}`}
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          value={phoneNumber} // Use state variable for phone number
          onChange={(e) => setPhoneNumber(e.target.value)} // Update phone number state
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="address">Address (Your Current Address)</label>
        <input
          id="address"
          type="text"
          value={address} // Use state variable for address
          onChange={(e) => setAddress(e.target.value)} // Update address state
          className="shadow border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {cartItems && (
        <>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="kitchenName">Kitchen Name</label>
            <input
              id="kitchenName"
              type="text"
              value={cartItems.kitchenName}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="totalQuantity">Total Quantity</label>
            <input
              id="totalQuantity"
              type="text"
              value={cartItems.items.reduce((acc, item) => acc + item.quantity, 0)}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="totalPrice">Total Price</label>
            <input
              id="totalPrice"
              type="text"
              value={`PKR ${cartItems.totalPrice.toFixed(2)}`}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </>
      )}
      <div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2" htmlFor="paymentMethod">Payment Method</label>
        <PaymentMethodDropdown
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleCheckout}
          className="bg-black hover:bg-[#25292e] border border-[#59636e] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Complete Payment
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-black hover:bg-[#25292e] border border-[#59636e] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
  <Footer />
</div>

    </>
  );
};

export default Checkout;
