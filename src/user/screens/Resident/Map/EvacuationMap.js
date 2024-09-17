import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import ResidentNav from '../../../../component/Resident/ResidentNav';
import ResidentHeader from '../../../../component/Resident/ResidentHeader';
import './map.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


const Routing = ({ userLocation, evacuationCenter, hideRouting }) => {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (!map || !userLocation) return;

    if (routingControl) {
      const container = routingControl.getContainer();
      if (container) {
        container.style.display = hideRouting ? 'block' : 'none' ;
      }
    } else {
      const control = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(evacuationCenter[0], evacuationCenter[1]),
        ],
        routeWhileDragging: false,
        createMarker: () => null,
      }).addTo(map);

      setRoutingControl(control);
    }
  }, [map, userLocation, evacuationCenter, hideRouting, routingControl]);

  return null;
};

const EvacuationMap = () => {
  const center = [14.488511949151476, 120.89696535750531];
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [residentData, setResidentData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showUserPopup, setShowUserPopup] = useState(true);
  const [showEvacuationPopup, setShowEvacuationPopup] = useState(true);
  const [hideRouting, setHideRouting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        if (user.profilepic) {
            user.profilepic = user.profilepic.replace(/\\/g, '/');
        }
        const capitalizeWords = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const firstName = capitalizeWords(user.firstName);
        const lastName = capitalizeWords(user.lastName);
        const middleInitial = user.middleName ? `${capitalizeWords(user.middleName.charAt(0))}.` : '';
        setUserName(`${firstName} ${middleInitial} ${lastName}`);
        setResidentData(user); 
        setUserRole(user.roleinHousehold);
    }

    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted' || result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error fetching the user's location:", error.message);
              alert("Please allow location access to use this feature.");
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else {
          alert("Location access denied by user. Please allow location access in your browser settings.");
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const userIcon = L.divIcon({
    html: `<div class="user-marker"><i class="fa fa-map-marker-alt"></i></div>`,
    shadowUrl: markerShadow,
    className: '', 
    iconSize: [24, 24], 
    popupAnchor: [-3, -5], 
  });

  const evacuationIcon = L.divIcon({
    html: `<div class="evacuation-marker"><i class="fa fa-map-marker-alt"></i></div>`,
    shadowUrl: markerShadow,
    className: '',
    iconSize: [24, 24], 
    popupAnchor: [-3, -5],
  });

  return (
    <div className="flex flex-col min-h-screen scrollbar-thick overflow-y-auto h-64">
      <div className="resident-header" style={{ zIndex: 1000 }}>
      <ResidentHeader userName={userName} userRole={userRole} handleLogout={handleLogout} />
      </div>
      <div className="flex flex-1">
      <ResidentNav residentData={residentData}/>
        <div className="map-container" style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {userLocation && (
              <Marker position={userLocation} icon={userIcon}>
                <Popup
                  permanent
                  closeButton={false}
                  autoClose={false}
                  closeOnEscapeKey={false}
                  closeOnClick={false}
                >
                  Your Location
                </Popup>
              </Marker>
            )}
            <Marker position={center} icon={evacuationIcon}>
              <Popup
                permanent
                closeButton={false}
                autoClose={false}
                closeOnEscapeKey={false}
                closeOnClick={false}
              >
                Evacuation Center<br />
              </Popup>
            </Marker>
            {userLocation && (
              <Routing userLocation={userLocation} evacuationCenter={center} hideRouting={hideRouting} />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;
