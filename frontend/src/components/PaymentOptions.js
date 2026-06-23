// Payment Options Component with JazzCash and EasyPaisa (Locked/Pending)
// Author: AQIB AWAN

import React, { useState } from 'react';
import { FaLock, FaCheckCircle, FaClock, FaCreditCard, FaMobileAlt } from 'react-icons/fa';

const PaymentOptions = ({ selectedMethod, onMethodChange, showModal = false }) => {
  const [showNotification, setShowNotification] = useState(false);

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Stripe',
      icon: FaCreditCard,
      status: 'active',
      description: 'Credit / Debit Card',
      color: 'green',
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: FaMobileAlt,
      status: 'pending',
      description: 'Mobile Wallet - Coming Soon',
      color: 'gray',
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: FaMobileAlt,
      status: 'pending',
      description: 'Mobile Wallet - Coming Soon',
      color: 'gray',
    },
  ];

  const handleSelect = (method) => {
    if (method.status === 'pending') {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    onMethodChange(method.id);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          💰 Payment Method
        </h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
          Stripe Active
        </span>
      </div>

      {/* Payment Options */}
      <div className="space-y-3 mb-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isActive = method.status === 'active';
          const isSelected = selectedMethod === method.id;

          return (
            <button
              key={method.id}
              onClick={() => handleSelect(method)}
              disabled={method.status === 'pending'}
              type="button"
              className={`
                w-full flex items-center justify-between p-4 rounded-xl border-2
                transition-all duration-200
                ${
                  isActive
                    ? isSelected
                      ? 'border-green-600 bg-green-50'
                      : 'border-green-400 bg-green-50 hover:bg-green-100 hover:border-green-500'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                }
                ${isActive && !isSelected ? 'hover:shadow-md' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    {method.name}
                    {isActive && isSelected && (
                      <FaCheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {method.status === 'pending' ? (
                  <>
                    <FaLock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  </>
                ) : (
                  isSelected && (
                    <span className="text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">
                      Selected
                    </span>
                  )
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
        <FaClock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          <span className="font-medium">📌 JazzCash & EasyPaisa</span> are in
          development. We'll notify you when they're ready!
        </p>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <FaClock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Coming Soon! 🚀</p>
                <p className="text-xs mt-1">
                  JazzCash & EasyPaisa will be available soon. For now, please use Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Payment Method Dropdown (for minimal integration)
export const PaymentMethodDropdown = ({ value, onChange }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'jazzcash' || selectedValue === 'easypaisa') {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    onChange(e);
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 bg-[#25292e] text-white leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="stripe">💳 Stripe - Credit/Debit Card (Active)</option>
        <option value="jazzcash" disabled className="text-gray-400">
          📱 JazzCash (Coming Soon - Locked)
        </option>
        <option value="easypaisa" disabled className="text-gray-400">
          📱 EasyPaisa (Coming Soon - Locked)
        </option>
      </select>

      {showNotification && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-yellow-50 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-700 shadow-md z-10">
          <span className="font-medium">🔒 This payment method is coming soon!</span>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
