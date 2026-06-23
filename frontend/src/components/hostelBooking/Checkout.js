import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { processPayment } from '../../store/paymentSlice';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Modal from 'react-modal';
import PaymentOptions from '../PaymentOptions';

// Set Modal styles
Modal.setAppElement('#root'); // Important for accessibility

const CheckoutModal = ({ isOpen, onClose, bed, room, hostelOwnerId, onSuccess }) => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idCard, setIdCard] = useState('');
  const [idCardError, setIdCardError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();

  // Validate ID Card (without dashes and exactly 13 digits)
  const validateIdCard = (value) => {
    const numericValue = value.replace(/-/g, ''); // Remove any dashes
    if (numericValue.length !== 13) {
      setIdCardError('ID card must be exactly 13 digits');
    } else {
      setIdCardError('');
    }
    setIdCard(numericValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user has provided a valid ID card number
    if (!idCard || idCardError) {
        alert('Please enter a valid 13-digit ID card number');
        return;
    }

    // Set payment processing state
    setPaymentProcessing(true);

    if (!stripe || !elements) {
        console.error('Stripe.js has not loaded yet.');
        return;
    }

    const cardElement = elements.getElement(CardElement);

    // Create a Payment Method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: studentName,
            email: studentEmail,
            phone: phoneNumber,
        },
    });

    if (error) {
        console.error('Payment method creation error:', error);
        alert('Failed to create payment method. Please try again.');
        setPaymentProcessing(false);
        return;
    }

    // Payment data to be sent to the backend
    const paymentData = {
        paymentMethodId: paymentMethod.id,
        amount: room.price * 100, // Stripe uses cents
        description: `Booking bed ${bed.bed_number} in room ${room.name}`,
        hostelOwnerId,
        roomId: room._id,
        bed,
    };

    try {
        // Dispatching payment processing action to the backend
        const response = await dispatch(processPayment(paymentData)).unwrap();
        console.log('Payment response:', response);

        if (response.success) {
            // If the payment requires further authentication
            if (response.requiresAction) {
                const { clientSecret } = response;

                // Confirm the payment action
                const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

                if (confirmError) {
                    console.error('Payment confirmation error:', confirmError);
                    alert('Payment confirmation failed. Please try again.');
                } else {
                    alert('Payment successful! Status: Paid');
                    onSuccess(response.paymentData); // Trigger success callback
                }
            } else {
                // Direct payment success
                alert('Payment successful! Status: Paid');
                onSuccess(response.paymentData); // Trigger success callback
            }
        } else {
            alert('Payment failed. Please try again.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('An error occurred during payment. Please try again.');
    } finally {
        setPaymentProcessing(false); // Reset payment processing state
    }
};


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Checkout for Bed {bed.bed_number}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">ID Card Number</label>
            <input
              type="text"
              value={idCard}
              onChange={(e) => validateIdCard(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
              required
            />
            {idCardError && <p className="text-red-500 text-xs italic">{idCardError}</p>}
          </div>

          {/* Payment Method Selection */}
          <div className="mb-4">
            <PaymentOptions
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Card Details</label>
            <CardElement className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                paymentProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? 'Processing...' : 'Pay'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
