import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

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
        <Marker position={currentPosition} />
      </GoogleMap>
    </LoadScript>
  );
};

// ---------- Captain Home ----------
const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  // Build proper name string
  const captainName =
    captain?.firstname && captain?.lastname
      ? `${captain.firstname} ${captain.lastname}`
      : captain?.username || "Captain";

  useEffect(() => {
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, []);

  socket.on("new-ride", (data) => {
    setRide(data);
    setRidePopupPanel(true);
  });

  async function confirmRide() {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  }

  useGSAP(
    function () {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, { transform: "translateY(0)" });
      } else {
        gsap.to(ridePopupPanelRef.current, { transform: "translateY(100%)" });
      }
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePopupPanel]
  );

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "C";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-screen relative overflow-hidden bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="w-full flex items-center justify-between p-4 shadow-md bg-white">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
            {getInitials(captainName)}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">
              Welcome back, {captainName}!
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
      <div className="m-4 rounded-2xl overflow-hidden shadow-lg border border-purple-500 h-2/5">
        <div className="bg-purple-600 text-white px-4 py-2 font-semibold">
          Current Location
        </div>
        <div className="h-full w-full">
          <LiveTracking />
        </div>
      </div>

      {/* Captain Details (below map, unchanged) */}
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      {/* Ride Popup Panel */}
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Popup Panel */}
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
