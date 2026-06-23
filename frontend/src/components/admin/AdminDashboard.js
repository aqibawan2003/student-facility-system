import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [hostelOwners, setHostelOwners] = useState([]);
  const [kitchenOwners, setKitchenOwners] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    else if (activeTab === 'hostelOwners') fetchHostelOwners();
    else if (activeTab === 'kitchenOwners') fetchKitchenOwners();
    else if (activeTab === 'hostels') fetchHostels();
    else if (activeTab === 'kitchens') fetchKitchens();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  const fetchHostelOwners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/hostel-owners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHostelOwners(response.data);
    } catch (error) {
      console.error('Error fetching hostel owners:', error);
    }
    setLoading(false);
  };

  const fetchKitchenOwners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/kitchen-owners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKitchenOwners(response.data);
    } catch (error) {
      console.error('Error fetching kitchen owners:', error);
    }
    setLoading(false);
  };

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/hostels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHostels(response.data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    }
    setLoading(false);
  };

  const fetchKitchens = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/kitchens`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKitchens(response.data);
    } catch (error) {
      console.error('Error fetching kitchens:', error);
    }
    setLoading(false);
  };

  const approveHostelOwner = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/hostel-owners/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Hostel owner approved successfully!');
      fetchHostelOwners();
      fetchStats();
    } catch (error) {
      console.error('Error approving hostel owner:', error);
      alert('Failed to approve hostel owner');
    }
  };

  const rejectHostelOwner = async (id) => {
    if (window.confirm('Are you sure you want to reject and delete this hostel owner?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/hostel-owners/${id}/reject`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Hostel owner rejected successfully!');
        fetchHostelOwners();
        fetchStats();
      } catch (error) {
        console.error('Error rejecting hostel owner:', error);
        alert('Failed to reject hostel owner');
      }
    }
  };

  const approveKitchenOwner = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/admin/kitchen-owners/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Kitchen owner approved successfully!');
      fetchKitchenOwners();
      fetchStats();
    } catch (error) {
      console.error('Error approving kitchen owner:', error);
      alert('Failed to approve kitchen owner');
    }
  };

  const rejectKitchenOwner = async (id) => {
    if (window.confirm('Are you sure you want to reject and delete this kitchen owner?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/kitchen-owners/${id}/reject`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Kitchen owner rejected successfully!');
        fetchKitchenOwners();
        fetchStats();
      } catch (error) {
        console.error('Error rejecting kitchen owner:', error);
        alert('Failed to reject kitchen owner');
      }
    }
  };

  const banUser = async (id, type) => {
    if (window.confirm(`Are you sure you want to ban this ${type}?`)) {
      try {
        await axios.patch(`${API_BASE_URL}/api/admin/${type}s/${id}/ban`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`${type} banned successfully!`);
        if (type === 'student') fetchStudents();
        else if (type === 'hostel-owner') fetchHostelOwners();
        else if (type === 'kitchen-owner') fetchKitchenOwners();
      } catch (error) {
        console.error(`Error banning ${type}:`, error);
        alert(`Failed to ban ${type}`);
      }
    }
  };

  const deleteUser = async (id, type) => {
    if (window.confirm(`Are you sure you want to permanently delete this ${type}? This action cannot be undone.`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/${type}s/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`${type} deleted successfully!`);
        if (type === 'student') fetchStudents();
        else if (type === 'hostel-owner') fetchHostelOwners();
        else if (type === 'kitchen-owner') fetchKitchenOwners();
        fetchStats();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Failed to delete ${type}`);
      }
    }
  };

  const removeHostel = async (id) => {
    if (window.confirm('Are you sure you want to remove this hostel?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/hostels/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Hostel removed successfully!');
        fetchHostels();
        fetchStats();
      } catch (error) {
        console.error('Error removing hostel:', error);
        alert('Failed to remove hostel');
      }
    }
  };

  const removeKitchen = async (id) => {
    if (window.confirm('Are you sure you want to remove this kitchen?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/kitchens/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Kitchen removed successfully!');
        fetchKitchens();
        fetchStats();
      } catch (error) {
        console.error('Error removing kitchen:', error);
        alert('Failed to remove kitchen');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {['overview', 'students', 'hostelOwners', 'kitchenOwners', 'hostels', 'kitchens'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab === 'hostelOwners' ? 'Hostel Owners' : tab === 'kitchenOwners' ? 'Kitchen Owners' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalStudents || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Hostel Owners</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalHostelOwners || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Kitchen Owners</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalKitchenOwners || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Hostels</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalHostels || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Kitchens</h3>
              <p className="text-3xl font-bold text-pink-600">{stats.totalKitchens || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.totalBookings || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
              <p className="text-3xl font-bold text-red-600">{stats.totalOrders || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-2 border-orange-400">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Pending Hostel Owners</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingHostelOwners || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-2 border-orange-400">
              <h3 className="text-lg font-semibold text-orange-700 mb-2">Pending Kitchen Owners</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingKitchenOwners || 0}</p>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Students Management</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.first_name} {student.last_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              student.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {student.isBanned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {!student.isBanned && (
                              <button
                                onClick={() => banUser(student._id, 'student')}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Ban
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(student._id, 'student')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hostel Owners Tab */}
        {activeTab === 'hostelOwners' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hostel Owners Management</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hostelOwners.map((owner) => (
                        <tr key={owner._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.owner_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.first_name} {owner.last_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.hostel_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              owner.isBanned ? 'bg-red-100 text-red-800' :
                              owner.isApproved ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {owner.isBanned ? 'Banned' : owner.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {!owner.isApproved && !owner.isBanned && (
                              <>
                                <button
                                  onClick={() => approveHostelOwner(owner._id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectHostelOwner(owner._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {owner.isApproved && !owner.isBanned && (
                              <button
                                onClick={() => banUser(owner._id, 'hostel-owner')}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Ban
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(owner._id, 'hostel-owner')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kitchen Owners Tab */}
        {activeTab === 'kitchenOwners' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kitchen Owners Management</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kitchen Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {kitchenOwners.map((owner) => (
                        <tr key={owner._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.provider_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.first_name} {owner.last_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.kitchen_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{owner.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              owner.isBanned ? 'bg-red-100 text-red-800' :
                              owner.isApproved ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {owner.isBanned ? 'Banned' : owner.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {!owner.isApproved && !owner.isBanned && (
                              <>
                                <button
                                  onClick={() => approveKitchenOwner(owner._id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectKitchenOwner(owner._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {owner.isApproved && !owner.isBanned && (
                              <button
                                onClick={() => banUser(owner._id, 'kitchen-owner')}
                                className="text-orange-600 hover:text-orange-900"
                              >
                                Ban
                              </button>
                            )}
                            <button
                              onClick={() => deleteUser(owner._id, 'kitchen-owner')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hostels Tab */}
        {activeTab === 'hostels' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Hostels Management</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hostels.map((hostel) => (
                    <div key={hostel._id} className="border rounded-lg p-4">
                      <img
                        src={hostel.hostelPicture || '/images/hostel.jpg'}
                        alt={hostel.hostelName}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{hostel.hostelName}</h3>
                      <p className="text-sm text-gray-600">Type: {hostel.hostelType}</p>
                      <p className="text-sm text-gray-600">Owner: {hostel.hostel_owner_id?.first_name} {hostel.hostel_owner_id?.last_name}</p>
                      <button
                        onClick={() => removeHostel(hostel._id)}
                        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        Remove Hostel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kitchens Tab */}
        {activeTab === 'kitchens' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Kitchens Management</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kitchens.map((kitchen) => (
                    <div key={kitchen._id} className="border rounded-lg p-4">
                      <img
                        src={kitchen.kitchen_picture || '/images/kitchens.png'}
                        alt={kitchen.kitchen_name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{kitchen.kitchen_name}</h3>
                      <p className="text-sm text-gray-600">{kitchen.kitchen_description}</p>
                      <p className="text-sm text-gray-600">Owner: {kitchen.first_name} {kitchen.last_name}</p>
                      <button
                        onClick={() => removeKitchen(kitchen._id)}
                        className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                      >
                        Remove Kitchen
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
