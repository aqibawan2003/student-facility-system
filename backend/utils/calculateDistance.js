const geolib = require('geolib');

// Function to calculate distance between two coordinates
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const distanceInMeters = geolib.getDistance(
        { latitude: lat1, longitude: lng1 },
        { latitude: lat2, longitude: lng2 }
    );
    return geolib.convertDistance(distanceInMeters, 'km');  // Convert to kilometers
};

module.exports = calculateDistance;
