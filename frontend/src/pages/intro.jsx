import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import medmapLogo from '../assets/logo.png';

const IntroScreen = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 500);
    const textTimer = setTimeout(() => setShowText(true), 1500);
    const navigateTimer = setTimeout(() => {
      navigate('/start');
    }, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 relative">
        <div
          className={`transition-all duration-1000 transform ${
            showLogo ? 'opacity-100 scale-100 animate-pulse-gentle' : 'opacity-0 scale-50'
          }`}
        >
          <img
            src={medmapLogo}
            alt="MedMap Logo"
            className={`w-32 h-32 md:w-40 md:h-40 object-contain ${
              showLogo ? 'animate-chainFloat' : ''
            }`}
          />
        </div>
      </div>

      {/* App Name */}
      <div
        className={`transition-all duration-800 transform ${
          showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary text-center mb-2">
          MedMap
        </h1>
        <p className="text-medmap-gray text-center text-lg">
          Your Emergency Medical Companion
        </p>
      </div>

      {/* Loading Indicator */}
      <div className="mt-12">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
