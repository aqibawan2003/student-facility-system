// HostelList.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HostelCard from './HostelCard';
import Navbar from '../Navbar';
import axios from 'axios';
import HostelMap from './HostelMap';

// Shimmer effect component for loading state
const SkeletonCard = () => (
  <div className="w-full p-2 sm:w-1/2 md:w-1/3">
    <div className="max-w-sm rounded overflow-hidden shadow-lg animate-pulse bg-gray-800">
      <div className="bg-gray-700 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

const HostelList = () => {
  const [filters, setFilters] = useState({
    university: '',
    facility: '',
    maxDistance: '',
  });
  const [filteredHostels, setFilteredHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all hostels on initial load
  useEffect(() => {
    const fetchHostels = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/hostel/getAllHostels');
        if (response.data && response.data.success) {
          setFilteredHostels(response.data.data || []);
        } else {
          setError('Failed to load hostels');
        }
      } catch (error) {
        console.error('Error fetching hostels:', error);
        setError('Failed to load hostels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHostels();
  }, []);

  // Fetch filtered hostels from the API based on query parameters
  const fetchFilteredHostels = async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching with query: ${queryParams}`);
      
      // Log the exact URL being called
      const requestUrl = `http://localhost:5000/hostel/getFilteredHostels?${queryParams}`;
      console.log('Making request to:', requestUrl);
      
      const response = await axios.get(requestUrl);
      console.log('Response received:', response);
      
      if (response.data && response.data.success) {
        setFilteredHostels(response.data.data || []);
        setSearchPerformed(true);
        
        if (response.data.data.length === 0) {
          setError('No hostels found matching your criteria. Try adjusting your search.');
        }
      } else {
        setError(response.data.message || 'Failed to retrieve results');
      }
    } catch (error) {
      console.error('Error fetching filtered hostels:', error);
      
      // Log more detailed error information
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setError(`Server error (${error.response.status}): ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        setError('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError('Failed to search hostels. Please try again later.');
      }
      
      setFilteredHostels([]);
    } finally {
      setLoading(false);
    }
  };

  // When the page loads or query parameters in the URL change, fetch filtered hostels
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const university = params.get('university') || '';
    const facility = params.get('facility') || '';
    const maxDistance = params.get('maxDistance') || '';

    setFilters({ university, facility, maxDistance });

    if (university || facility || maxDistance) {
      fetchFilteredHostels(params.toString());
    }
  }, [location.search]);

  // Handle form input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Update the URL with the query parameters when the user clicks the search button
  const handleSearch = () => {
    // Filter out empty parameters
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    const queryParams = new URLSearchParams(cleanedFilters).toString();
    navigate(`?${queryParams}`);
  };

  return (
    <>
      <Navbar module={'hostel'} />
      <div className="p-4 bg-[#697565] w-full pt-28">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <div className="flex flex-col gap-4 mb-4  mt-6 md:mb-0 md:ml-24 md:flex-row">
            <input
              type="text"
              name="university"
              placeholder="Enter the name of the university"
              value={filters.university || ''}
              onChange={handleFilterChange}
              className="border-2 border-blue-500 rounded p-2 mr-2 text-wrap w-full md:w-60"
            />
            <select
              name="facility"
              className="border-2 border-blue-500 rounded p-2 mr-2 w-full md:w-60"
              value={filters.facility}
              onChange={handleFilterChange}
            >
              <option value="">All Facilities</option>
              <option value="Wi-Fi">Wi-Fi</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Meals">Meals</option>
              <option value="Parking">Parking</option>
            </select>
            <input
              type="number"
              name="maxDistance"
              placeholder="Max Distance (km)"
              value={filters.maxDistance || ''}
              onChange={handleFilterChange}
              className="border-2 border-blue-500 rounded p-2 w-full md:w-60"
              min="0"
            />
            <button
              className="bg-[#697565] text-white p-2 border-2 hover:bg-[#25292e] rounded ml-2 w-full md:w-auto"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex flex-wrap">
          {loading
            ? Array(6)
                .fill(0)
                .map((_, index) => <SkeletonCard key={index} />)
            : filteredHostels.length > 0
            ? filteredHostels.map((hostel) => (
                <div key={hostel._id} className="w-full p-2 sm:w-1/2 md:w-1/3">
                  <HostelCard hostel={hostel} />
                </div>
              ))
            : !loading && (
              <p className="text-white w-full text-center text-xl mt-6">No hostels found</p>
            )}
        </div>
        
        {filteredHostels.length > 0 && (
          <HostelMap hostels={filteredHostels} searchPerformed={searchPerformed} />
        )}
      </div>
    </>
  );
};

export default HostelList;
