import React from 'react';

const EmergencyAccepted = ({ emergencyData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
            ✅
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Emergency Accepted!</h2>
          <p className="text-green-600 font-semibold">Help is on the way</p>
        </div>

        {/* Captain Information */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {emergencyData.captainName ? emergencyData.captainName.split(' ').map(n => n[0]).join('').toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{emergencyData.captainName || 'Captain'}</h3>
              <p className="text-sm text-gray-600">Phone: {emergencyData.captainPhone || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        {emergencyData.vehicleDetails && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Vehicle Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{emergencyData.vehicleDetails.vehicleType}</span>
              </div>
              <div>
                <span className="text-gray-600">Color:</span>
                <span className="ml-2 font-medium">{emergencyData.vehicleDetails.color}</span>
              </div>
              <div>
                <span className="text-gray-600">Plate:</span>
                <span className="ml-2 font-medium">{emergencyData.vehicleDetails.plate}</span>
              </div>
              <div>
                <span className="text-gray-600">Capacity:</span>
                <span className="ml-2 font-medium">{emergencyData.vehicleDetails.capacity}</span>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Arrival */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white">
              ⏱️
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Estimated Arrival</h4>
              <p className="text-sm text-gray-600">{emergencyData.estimatedArrival || 'Calculating...'}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">What to do next:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Stay calm and stay put</li>
            <li>• Keep your phone nearby</li>
            <li>• Wait for the captain to arrive</li>
            <li>• Follow any medical instructions given</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default EmergencyAccepted;
