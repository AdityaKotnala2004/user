import React from "react";

const RidePopUp = ({ ride, setRidePopupPanel }) => {
  // Remove auto popup logic
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">New Ride Request</h2>
      {ride && (
        <>
          <div className="mb-4">
            <p className="text-gray-600">From: {ride.pickup}</p>
            <p className="text-gray-600">To: {ride.destination}</p>
          </div>
          <button
            className="bg-primary text-white py-2 px-4 rounded w-full"
            onClick={() => setRidePopupPanel(false)}
          >
            Close
          </button>
        </>
      )}
    </div>
  );
};

export default RidePopUp;
