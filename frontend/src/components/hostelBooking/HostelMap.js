import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet CSS is imported
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';  // Import Leaflet Routing Machine

// Define custom icons for the university and hostels
const universityIcon = new L.Icon({
  iconUrl: '/images/marker.png',  // Correct path from public directory
  iconSize: [25, 41],
});

const hostelIcon = new L.Icon({
  iconUrl: '/images/hostelMarker.png',  // Correct path from public directory
  iconSize: [25, 41],
});

// Component to handle dynamic map center and zoom after search
const SetMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);  // Set the center and zoom of the map dynamically
    }
  }, [center, zoom, map]);
  return null;
};

// Add routing between university and hostel
const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let routingControl = null;

    // Ensure routing control is only added when start and end points exist
    if (start && end) {
      routingControl = L.Routing.control({
        waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
        routeWhileDragging: false,
        show: false,  // Hide top-right route details
        addWaypoints: false,  // Disable waypoint dragging
        lineOptions: {
          styles: [{ color: 'blue', opacity: 1, weight: 5 }],
        },
        createMarker: () => null,  // Do not show extra markers
      }).addTo(map);
    }

    // Cleanup function to remove routing control when component unmounts
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
};

const HostelMap = ({ hostels, searchPerformed }) => {
  // Default center is Lahore
  const defaultCenter = [31.5204, 74.3587];  // Default coordinates for Lahore
  const defaultZoom = 13;  // Default zoom level

  // If a university is found, center on the university and adjust the zoom to focus on a 5 km radius
  const university = hostels.length > 0 && hostels[0].nearby_institutes.length > 0
    ? hostels[0].nearby_institutes[0]
    : null;

  const center = university
    ? [university.university_lat || 31.5204, university.university_lng || 74.3587]
    : defaultCenter;

  const zoomLevel = university ? 16 : defaultZoom; // Adjust zoom to focus on a ~5 km radius when a university is found

  return (
    <div className="container mx-auto mt-8 p-4"> {/* Tailwind class for container and margin */}
      <MapContainer
        center={center}  // Center the map on the selected university or default to Lahore
        zoom={zoomLevel}
        className="w-full h-[500px] relative"  // Tailwind CSS for full-width and 500px height
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Use the SetMapView component */}
        <SetMapView center={center} zoom={zoomLevel} />

        {/* Conditionally render markers and routing after search */}
        {searchPerformed && hostels.map((hostel, index) => (
          <React.Fragment key={index}>
            {/* Hostel Marker */}
            {hostel.hostel_lat && hostel.hostel_lng && (
              <Marker position={[hostel.hostel_lat, hostel.hostel_lng]} icon={hostelIcon}>
                <Popup>
                  {hostel.hostel_name} <br />
                  Distance from University: {hostel.nearby_institutes[0]?.distance || 'N/A'}
                </Popup>
              </Marker>
            )}

            {/* University Marker */}
            {hostel.nearby_institutes.map((institute, idx) => (
              institute.university_lat && institute.university_lng && (
                <Marker
                  key={idx}
                  position={[institute.university_lat, institute.university_lng]}
                  icon={universityIcon}
                >
                  <Popup>{institute.university}</Popup>
                </Marker>
              )
            ))}

            {/* Add routing for each university-hostel pair */}
            {hostel.nearby_institutes[0] && (
              <RoutingMachine
                start={{
                  lat: hostel.nearby_institutes[0].university_lat,
                  lng: hostel.nearby_institutes[0].university_lng,
                }}
                end={{
                  lat: hostel.hostel_lat,
                  lng: hostel.hostel_lng,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default HostelMap;
