import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import ambulanceImg from "../assets/ambulance.png"; // ✅ correct path
import { SocketContext } from "../context/SocketContext";

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
const LookingForAmbulance = ({ username, location }) => {
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
        <p className="font-semibold text-gray-700">{username}</p>
        <p className="text-gray-500 text-sm">{location}</p>
      </div>

      <div className="mt-4 animate-pulse text-gray-500">
        Searching nearby ambulances...
      </div>
    </div>
  );
};

// ---------- Home Component ----------
const Home = ({ user }) => {
  const { socket } = useContext(SocketContext);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [ambulanceMode, setAmbulanceMode] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Fetching...");
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation(
          `Lat: ${pos.coords.latitude.toFixed(
            3
          )}, Lng: ${pos.coords.longitude.toFixed(3)}`
        );
      },
      () => setCurrentLocation("Location unavailable")
    );
  }, []);

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

  const handleSOS = () => {
    setVehicleFound(true);
    setAmbulanceMode(true);

    const rideData = {
      username: user?.username,
      currentLocation: currentLocation,
    };

    // Emit the ride request through socket
    socket.emit("new-ride", rideData);
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
          <div className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
            {getInitials(user?.username)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">
              Welcome back, {user?.username}!
            </p>
            <p className="text-sm text-gray-500">Stay safe and connected</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="text-gray-600 hover:text-black text-sm font-medium flex items-center gap-1"
        >
          <i className="ri-logout-circle-r-line"></i> Sign Out
        </button>
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
            username={user?.username}
            location={currentLocation}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
