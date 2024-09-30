import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, DirectionsRenderer, Marker, OverlayView, useLoadScript } from '@react-google-maps/api';
import { FaMapMarkerAlt } from "react-icons/fa";
import ResidentNav from '../../../../component/Resident/ResidentNav';
import ResidentHeader from '../../../../component/Resident/ResidentHeader';

const EvacuationMap = () => {
  const EvacuationCenter = { lat: 14.488511949151476, lng: 120.89696535750531 };
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [travelInfo, setTravelInfo] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [residentData, setResidentData] = useState(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Add your API key in environment variables
    libraries: ['places'],
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.profilepic) {
        user.profilepic = user.profilepic.replace(/\\/g, '/'); // Adjust path for correct URL
      }
      const capitalizeWords = (str) =>
        str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      const firstName = capitalizeWords(user.firstName);
      const lastName = capitalizeWords(user.lastName);
      const middleInitial = user.middleName ? `${capitalizeWords(user.middleName.charAt(0))}.` : '';
      setUserName(`${firstName} ${middleInitial} ${lastName}`);
      setResidentData(user);
      setUserRole(user.roleinHousehold);
    }

    // Request user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (isLoaded && window.google) {
            getDirections(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, [isLoaded]);

  const getDirections = useCallback(async (userLat, userLng) => {
    // Ensure that google.maps is available before calling DirectionsService
    if (!window.google || !window.google.maps) {
      console.error('Google Maps not loaded yet.');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: { lat: userLat, lng: userLng },
      destination: EvacuationCenter,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(results);

    // Extract the travel time and distance for custom InfoWindow
    if (results.routes[0] && results.routes[0].legs[0]) {
      const leg = results.routes[0].legs[0];
      const midpoint = {
        lat: (leg.start_location.lat() + leg.end_location.lat()) / 2,
        lng: (leg.start_location.lng() + leg.end_location.lng()) / 2,
      };
      setTravelInfo({
        duration: leg.duration.text,
        distance: leg.distance.text,
        position: midpoint, // Position it at the midpoint of the route
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen scrollbar-thick overflow-y-auto h-64">
      <div className="resident-header" style={{ zIndex: 1000 }}>
        <ResidentHeader 
          userName={userName} 
          userRole={userRole} 
          handleLogout={handleLogout} 
          profilePic={residentData?.profilepic} 
        />
      </div>
      <div className="flex flex-1">
        <ResidentNav residentData={residentData} />
        <div className="flex-grow" style={{ height: '100%' }}>
          <GoogleMap
            center={userLocation || EvacuationCenter}
            zoom={14}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{ draggable: true }} // Map is navigable
          >
            {userLocation && (
              <Marker position={userLocation} icon={null} /> 
            )}
            <Marker position={EvacuationCenter} icon={null} />
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: '#0000FF', // Blue line color
                    strokeWeight: 6, // Thicker line
                    strokeOpacity: 0.7,
                    zIndex: 1,
                  },
                  suppressMarkers: false, // Ensure custom markers show
                  preserveViewport: true, // Keep the map navigable without re-centering
                  draggable: false,
                  suppressInfoWindows: true, // Prevent default InfoWindow from appearing
                }}
              />
            )}
            {travelInfo && (
              <OverlayView
                position={travelInfo.position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '5px',
                    padding: '5px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    fontSize: '12px',
                    textAlign: 'center',
                    width: '80px',
                    zIndex: '100',
                    transform: 'translateY(-40px)', // Move it above the route
                  }}
                >
                  <span role="img" aria-label="car">🚗</span> {travelInfo.duration}<br />{travelInfo.distance}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-10px',
                      left: '50%',
                      width: '0',
                      height: '0',
                      borderLeft: '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop: '10px solid white',
                      transform: 'translateX(-50%)',
                    }}
                  />
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;
