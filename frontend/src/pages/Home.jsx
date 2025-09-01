import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import ambulanceImg from "../assets/ambulance.png"; 
import { SocketContext } from "../context/SocketContext";
import EmergencyAccepted from "../components/EmergencyAccepted";
import { UserDataContext } from "../context/UserContext";

// ---------- Map Component ----------
const containerStyle = { width: "100%", height: "100%" };

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrentPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });

    const watchId = navigator.geolocation.watchPosition((pos) => {
      setCurrentPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition}
        zoom={15}
      >
        {/* User marker only */}
        <Marker position={currentPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

// ---------- Ambulance Panel ----------
const LookingForAmbulance = ({ fullname, location }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Downward arrow above */}
      <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2"></div>

      <h2 className="text-xl font-bold text-gray-800">Looking for Ambulance</h2>
      <img
        src={ambulanceImg}
        alt="Ambulance"
        className="w-28 h-28 object-contain"
      />

      <div className="text-center">
        <p className="font-semibold text-gray-700">{fullname}</p>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>

      <div className="mt-4 animate-pulse text-gray-500">
        Searching nearby ambulances...
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [ambulanceMode, setAmbulanceMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Fetching...");
  const [emergencyAccepted, setEmergencyAccepted] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();

  // Debug: Check if user data is available
  useEffect(() => {
    console.log("User data in Home component:", user);
  }, [user]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoordinates({ lat, lng });
        setCurrentLocation(
          `Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`
        );
      },
      () => setCurrentLocation("Location unavailable")
    );
  }, []);

  // Socket event listeners for emergency
  useEffect(() => {
    if (!socket) return;

    // Join socket room for user
    if (user && user._id) {
      socket.emit("user-join", { userId: user._id });
    }

    // Listen for emergency acceptance
    socket.on("emergency-accepted", (data) => {
      console.log("Emergency accepted:", data);
      setEmergencyData(data);
      setEmergencyAccepted(true);
      setAmbulanceMode(false);
    });

    return () => {
      socket.off("emergency-accepted");
    };
  }, [socket, user]);

  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup: "User's current location",
          destination: "Hospital/ambulance destination",
          vehicleType: "ambulance",
          bookerPhone: "1234567890",
          riderPhone: "1234567890",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Ride created:", response.data);
    } catch (err) {
      console.error("Error creating ride:", err);
    }
  }

  const handleSOS = async () => {
    try {
      // Create emergency request
      const response = await axios.post(
        `http://localhost:4000/emergency/create`,
        {
          location: currentCoordinates,
          emergencyType: 'medical',
          description: 'Emergency medical assistance needed'
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Emergency created:", response.data);
      
      // Show ambulance mode
      setVehicleFound(true);
      setAmbulanceMode(true);

      // Emit emergency through socket with address if available
      if (socket) {
        socket.emit("emergency-sos", {
          emergencyId: response.data.emergency._id,
          userFullName: user?.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : 'Unknown User',
          location: response.data.emergency.location, // Use the complete location data from backend
          emergencyType: 'medical',
          description: 'Emergency medical assistance needed'
        });
      }

    } catch (err) {
      console.error("Error creating emergency:", err);
      alert("Failed to send emergency request. Please try again.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/"); // ✅ back to start page
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="w-full flex items-center justify-between p-4 shadow-md bg-white">
        <div className="flex items-center gap-3">
          {/* Avatar with initials */}
          <div className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
            {user?.fullname?.firstname && user?.fullname?.lastname ? 
              `${user.fullname.firstname.charAt(0).toUpperCase()}${user.fullname.lastname.charAt(0).toUpperCase()}` : 
              'US'
            }
          </div>
          <div>
            {/* Greeting with full name */}
            <p className="font-semibold text-gray-800 text-lg">
              Welcome back, {user?.fullname?.firstname && user?.fullname?.lastname ? 
                `${user.fullname.firstname} ${user.fullname.lastname}` : 
                'User'
              }!
            </p>
            <p className="text-sm text-gray-500">Stay safe and connected</p>
          
            
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="m-4 rounded-2xl overflow-hidden shadow-lg border border-purple-500 flex-1">
        <div className="bg-purple-600 text-white px-4 py-2 font-semibold">
          Current Location
        </div>
        <div className="h-full w-full">
          <LiveTracking />
        </div>
      </div>

      {/* SOS Button (hidden after trigger) */}
      {!vehicleFound && (
        <div className="m-4">
          <button
            onClick={handleSOS}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl text-lg font-bold shadow-lg active:scale-95 transition"
          >
            🚨 Emergency — Swipe to call SOS
          </button>
        </div>
      )}

      {/* Ambulance Panel */}
      {vehicleFound && ambulanceMode && (
        <div className="w-full bg-white rounded-t-3xl shadow-2xl p-6">
          <LookingForAmbulance
            fullname={user?.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : 'Unknown User'}
            location={currentLocation}
          />
        </div>
      )}

      {/* Emergency Accepted Popup */}
      {emergencyAccepted && emergencyData && (
        <EmergencyAccepted
          emergencyData={emergencyData}
          onClose={() => setEmergencyAccepted(false)}
        />
      )}
    </div>
  );
};

export default Home;
