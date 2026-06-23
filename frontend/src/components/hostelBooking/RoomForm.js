// RoomForm.js
import React from 'react';

const RoomForm = ({
  roomDetails,
  handleChange,
  handleImageUrlChange,
  handleAddImageUrl,
  handleRemoveImageUrl,
  handleBedChange,
  handleAddBed,
  handleRemoveBed,
  handleSubmit,
  error,
  isEditing,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Room' : 'Add Room'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-2">Room Name</label>
        <input
          type="text"
          name="name"
          value={roomDetails.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Room Capacity</label>
        <input
          type="number"
          name="capacity"
          value={roomDetails.capacity}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Price per Month</label>
        <input
          type="number"
          name="price"
          value={roomDetails.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Availability</label>
        <select
          name="availability"
          value={roomDetails.availability}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value={true}>Available</option>
          <option value={false}>Not Available</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={roomDetails.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Room Images URLs</label>
        {roomDetails.imageUrls.map((url, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveImageUrl(index)}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImageUrl}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Image URL
        </button>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Beds</label>
        {roomDetails.beds.map((bed, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="number"
              value={bed.bed_number}
              onChange={(e) => handleBedChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveBed(index)}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove Bed
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddBed}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Bed
        </button>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isEditing ? 'Save Changes' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default RoomForm;
