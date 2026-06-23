const HostelOwner = require('../../models/hostelowner/Hostelowner');

// Helper function to extract numeric distance from strings like "5km"
const extractNumericDistance = (distanceStr) => {
  if (!distanceStr) return null;
  const match = distanceStr.match(/\d+/);  // Extract numeric part from the string
  return match ? parseFloat(match[0]) : null;  // Convert to a number if it exists
};

// Controller to get filtered hostels based on university name and distance
const getFilteredHostels = async (req, res, next) => {
  try {
    console.log('Query:', req.query);
    const { university, facility, maxDistance } = req.query;

    if (!university && !maxDistance && !facility) {
      return res.status(400).json({
        success: false,
        message: 'At least one filter criteria is required',
      });
    }

    let filter = {};

    // Filter by university in nearby institutes (array of objects)
    if (university) {
      // Make the search more flexible by using a partial match
      filter['nearby_institutes'] = {
        $elemMatch: { 
          university: { $regex: new RegExp(university.split(' ').join('.*'), 'i') } 
        },  // Case-insensitive search with flexibility for word ordering
      };
    }

    // Add facility filter if provided
    if (facility && facility !== '') {
      filter['facilities'] = { $regex: new RegExp(facility, 'i') };
    }

    console.log('Filter query:', JSON.stringify(filter));

    // First, get all hostels matching the base criteria (university and/or facility)
    try {
      const allHostels = await HostelOwner.find(filter)
        .select('hostel_name hostel_address hostel_lat hostel_lng hostel_type hostel_description hostel_picture facilities nearby_institutes')
        .populate({
          path: 'rooms',
          select: 'name capacity price availability description imageUrls',
        });
      
      console.log(`Found ${allHostels.length} hostels matching base criteria`);

      // If no hostels found with base criteria, return empty result
      if (allHostels.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: 'No hostels match the search criteria'
        });
      }

      // If maxDistance is provided, filter further by distance
      if (maxDistance) {
        const maxDist = parseFloat(maxDistance);
        if (!isNaN(maxDist)) {
          // Filter hostels by distance within the range (0 to maxDistance)
          const filteredHostels = allHostels.filter((hostel) => {
            const nearbyInstitutes = hostel.nearby_institutes || [];

            // Check if any nearby institute matches the university and distance
            return nearbyInstitutes.some((institute) => {
              // If university filter is provided, check for university match
              const universityMatches = !university || 
                institute.university.toLowerCase().includes(university.toLowerCase());
              
              const instituteDistance = extractNumericDistance(institute.distance);  // Extract numeric distance

              // If distance is valid, check if it's within the range (0 to maxDistance)
              return universityMatches && instituteDistance !== null && instituteDistance <= maxDist;
            });
          });

          console.log(`After distance filtering: ${filteredHostels.length} hostels`);

          // Return filtered results, even if empty
          return res.status(200).json({
            success: true,
            data: filteredHostels,
          });
        }
      }

      // If no maxDistance provided or it's invalid, return hostels based on university/facility only
      return res.status(200).json({
        success: true,
        data: allHostels,
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while searching hostels',
        error: dbError.message
      });
    }
  } catch (error) {
    console.error('Error fetching filtered hostels:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while searching hostels',
      error: error.message
    });
  }
};

module.exports = getFilteredHostels;
