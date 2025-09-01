import React from 'react';

const EmergencyPopUp = ({ emergency, onAccept, onDecline, setEmergencyPopupPanel }) => {
  console.log('EmergencyPopUp received emergency data:', emergency);
  
  const getEmergencyTypeIcon = (type) => {
    switch (type) {
      case 'medical':
        return '🏥';
      case 'accident':
        return '🚨';
      case 'other':
        return '⚠️';
      default:
        return '🚨';
    }
  };

  const getEmergencyTypeColor = (type) => {
    switch (type) {
      case 'medical':
        return 'bg-red-500';
      case 'accident':
        return 'bg-orange-500';
      case 'other':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl w-full max-w-md p-6 transform transition-transform duration-300">
        {/* Close button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setEmergencyPopupPanel(false)}
            className="w-12 h-1.5 bg-gray-300 rounded-full"
          ></button>
        </div>

        {/* Emergency Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getEmergencyTypeColor(emergency.emergencyType)} text-white text-2xl mb-3`}>
            {getEmergencyTypeIcon(emergency.emergencyType)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">EMERGENCY ALERT!</h2>
          <p className="text-red-600 font-semibold">Immediate response required</p>
        </div>

        {/* User Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {emergency.userFullName ? emergency.userFullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{emergency.userFullName || 'Unknown User'}</h3>
              <p className="text-sm text-gray-600">Emergency Type: {emergency.emergencyType || 'Unknown'}</p>
            </div>
          </div>
          
          {emergency.description && (
            <div className="bg-white rounded p-3 border-l-4 border-red-500">
              <p className="text-gray-700 text-sm">{emergency.description}</p>
            </div>
          )}
        </div>

        {/* Location Information */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              📍
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">Emergency Location</h4>
              {emergency.location && emergency.location.address ? (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-800 bg-white p-2 rounded border-l-4 border-blue-500">
                    {emergency.location.address}
                  </p>
                  {emergency.location.lat && emergency.location.lng && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>Coordinates: {emergency.location.lat.toFixed(4)}, {emergency.location.lng.toFixed(4)}</p>
                    </div>
                  )}
                </div>
              ) : emergency.location && emergency.location.lat && emergency.location.lng ? (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <p className="text-sm text-gray-600">Getting address...</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: {emergency.location.lat.toFixed(4)}, {emergency.location.lng.toFixed(4)}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Location unavailable</p>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Updated Time Information */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            Requested at: {emergency.requestedAt ? new Date(emergency.requestedAt).toLocaleString() : 'Unknown time'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAccept}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg"
          >
            🚑 ACCEPT EMERGENCY
          </button>
          
          <button
            onClick={onDecline}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Decline
          </button>
        </div>

        {/* Warning */}
        <div className="mt-4 text-center">
          <p className="text-xs text-red-600 font-medium">
            ⚠️ This is a high-priority emergency request
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPopUp;
