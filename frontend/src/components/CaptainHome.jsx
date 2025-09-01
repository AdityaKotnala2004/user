import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../context/SocketContext';
import axios from 'axios';
import EmergencyTrackingModal from './EmergencyTrackingModal';

const CaptainHome = () => {
  const { socket } = useContext(SocketContext);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [captainLocation, setCaptainLocation] = useState(null);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get captain location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setCaptainLocation(loc);
        updateCaptainLocation(loc.lat, loc.lng);
      },
      (error) => console.error('Error getting location:', error)
    );

    const watchId = navigator.geolocation.watchPosition((position) => {
      const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
      setCaptainLocation(loc);
      updateCaptainLocation(loc.lat, loc.lng);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Update captain location in backend
  const updateCaptainLocation = async (lat, lng) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/captains/update-location`,
        { location: { lat, lng } },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  // Listen for emergency alerts
  useEffect(() => {
    if (!socket) return;
    socket.on('emergency-alert', (emergencyData) => {
      console.log("🚨 Emergency received:", emergencyData);
      setEmergencyAlerts((prev) => [...prev, emergencyData]);
    });
    return () => socket.off('emergency-alert');
  }, [socket]);

  // Accept emergency
  const handleAcceptEmergency = async (emergencyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/emergency/accept`,
        { emergencyId },
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      const emergency = response.data.emergency;
      console.log("✅ Emergency accepted response:", emergency);

      // remove from alerts
      setEmergencyAlerts((prev) => prev.filter((alert) => alert._id !== emergencyId));

      // open modal
      setSelectedEmergency(emergency);
      setModalOpen(true);
    } catch (err) {
      console.error('❌ Error accepting emergency:', err.response?.data || err.message);
      alert('Failed to accept emergency request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Captain Dashboard</h1>

        {/* Alerts */}
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          🚨 Emergency Alerts ({emergencyAlerts.length})
        </h2>
        {emergencyAlerts.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-700">No active emergency requests</p>
          </div>
        ) : (
          emergencyAlerts.map((alert) => (
            <div key={alert._id} className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 text-lg mb-2">
                    🚑 {alert.emergencyType?.toUpperCase()} Emergency
                  </h3>
                  <p><strong>Patient:</strong> {alert.userFullName}</p>
                  <p><strong>Phone:</strong> {alert.userPhone}</p>
                  <p><strong>Description:</strong> {alert.description}</p>
                  <p className="text-sm text-red-600 mb-2">{alert.location?.address}</p>
                </div>
                <button
                  onClick={() => handleAcceptEmergency(alert.emergencyId || alert._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-lg"
                >
                  ✅ Accept
                </button>
              </div>
            </div>
          ))
        )}

        {/* Status */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Captain Status</h3>
          <p>Location: {captainLocation ? `${captainLocation.lat}, ${captainLocation.lng}` : 'Loading...'}</p>
          <p>Status: Active</p>
        </div>
      </div>

      {/* Emergency Tracking Modal */}
      <EmergencyTrackingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        emergencyData={selectedEmergency}
        captainLocation={captainLocation}
      />
    </div>
  );
};

export default CaptainHome;
