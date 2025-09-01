import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '300px' };

const EmergencyTrackingModal = ({ isOpen, onClose, emergencyData, captainLocation }) => {
  const [mapCenter, setMapCenter] = useState(null);

  useEffect(() => {
    if (emergencyData?.location && captainLocation) {
      const centerLat = (emergencyData.location.lat + captainLocation.lat) / 2;
      const centerLng = (emergencyData.location.lng + captainLocation.lng) / 2;
      setMapCenter({ lat: centerLat, lng: centerLng });
    } else if (emergencyData?.location) {
      setMapCenter(emergencyData.location);
    }
  }, [emergencyData, captainLocation]);

  if (!isOpen || !emergencyData) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Emergency Tracking</h2>
          <button onClick={onClose} className="text-gray-600 text-2xl font-bold">×</button>
        </div>

        <div className="p-4 bg-red-50 border-b">
          <p><strong>Patient:</strong> {emergencyData.userFullName}</p>
          <p><strong>Phone:</strong> {emergencyData.userPhone}</p>
          <p><strong>Type:</strong> {emergencyData.emergencyType}</p>
          <p><strong>Address:</strong> {emergencyData.location?.address}</p>
          <p><strong>Distance:</strong> {emergencyData.distanceInfo?.distance?.text || 'Calculating...'}</p>
          <p><strong>ETA:</strong> {emergencyData.distanceInfo?.duration?.text || 'Calculating...'}</p>
        </div>

        <div className="h-80">
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={13}>
              <Marker position={emergencyData.location} />
              {captainLocation && <Marker position={captainLocation} />}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

export default EmergencyTrackingModal;
