import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ambulance,
  Heart,
  Droplets,
  Wind,
  MapPin,
  Phone,
} from "lucide-react";
import logo from "../assets/logo.png";

const Start = () => {
  const [location, setLocation] = useState("Fetching location...");

  // ✅ Fetch user location and reverse geocode
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();
            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || "";
              const state = data.address.state || "";
              setLocation(`${city}, ${state}`);
            } else {
              setLocation("Location unavailable");
            }
          } catch (err) {
            setLocation("Failed to fetch location");
          }
        },
        () => setLocation("Location permission denied")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const quickAccessCards = [
    {
      icon: <Ambulance className="w-8 h-8 text-rose-500" />,
      label: "Ambulance",
      color:
        "border-2 border-rose-500/70 bg-gradient-to-r from-rose-50 to-rose-100",
    },
    {
      icon: <Heart className="w-8 h-8 text-violet-600" />,
      label: "ICU Beds",
      color:
        "border-2 border-violet-600/70 bg-gradient-to-r from-violet-50 to-violet-100",
    },
    {
      icon: <Wind className="w-8 h-8 text-cyan-600" />,
      label: "Oxygen",
      color:
        "border-2 border-cyan-600/70 bg-gradient-to-r from-cyan-50 to-cyan-100",
    },
    {
      icon: <Droplets className="w-8 h-8 text-red-500" />,
      label: "Blood Units",
      color:
        "border-2 border-red-500/70 bg-gradient-to-r from-red-50 to-red-100",
    },
  ];

  const categories = [
    { icon: <Heart className="w-6 h-6 text-white" />, label: "Cardiology", bg: "bg-rose-500" },
    { icon: <Phone className="w-6 h-6 text-white" />, label: "Emergency", bg: "bg-orange-500" },
    { icon: <MapPin className="w-6 h-6 text-white" />, label: "Nearby", bg: "bg-cyan-600" },
    { icon: <Droplets className="w-6 h-6 text-white" />, label: "Pharmacy", bg: "bg-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-y-auto custom-scroll">
      {/* Header */}
      <div className="absolute top-6 left-6">
        <div className="bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
          <span className="text-xs font-medium text-purple-700">DEMO MODE</span>
        </div>
      </div>
      <div className="absolute top-6 right-6">
        <Link
          to="/login"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Get Started
        </Link>
      </div>

      {/* Logo & Welcome */}
      <div className="pt-24 text-center">
        <img
          src={logo}
          alt="MedMap Logo"
          className="w-24 h-24 mx-auto mb-4 animate-bounce"
        />
        <h1 className="text-2xl font-bold mb-2">Welcome to MedMap</h1>
        <p className="text-gray-500">Your emergency medical companion</p>
      </div>

      {/* Quick Access */}
      <div className="px-6 mt-10">
        <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickAccessCards.map((card, idx) => (
            <Link
              key={idx}
              to="/login"
              className={`rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition hover:scale-105 ${card.color}`}
            >
              {card.icon}
              <span className="text-sm font-medium mt-2">{card.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 mt-10">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to="/login"
              className="flex flex-col items-center cursor-pointer transition hover:scale-110"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${cat.bg}`}
              >
                {cat.icon}
              </div>
              <span className="text-xs font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="px-6 mt-10">
        <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-xl p-4 flex items-center">
          <MapPin className="w-6 h-6 mr-3" />
          <div>
            <h3 className="font-semibold">Current Location</h3>
            <p className="text-sm opacity-90">{location}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 mb-6 text-center text-gray-500 text-sm">
        <p>
          Powered by <span className="font-semibold text-purple-600">MedMap</span>  | Made with care for emergencies
        </p>
      </div>
    </div>
  );
};

export default Start;
