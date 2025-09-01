import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import Captainlogin from './pages/Captainlogin';
import CaptainSignup from './pages/CaptainSignup';
import Home from './pages/Home';
import UserProtectWrapper from './pages/UserProtectWrapper';
import UserLogout from './pages/UserLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import CaptainLogout from './pages/CaptainLogout';
import Riding from './pages/Riding';
import PlanRide from './pages/PlanRide';
import ScheduleRide from './pages/ScheduleRide';
import CaptainRiding from './pages/CaptainRiding';
import 'remixicon/fonts/remixicon.css';
import IntroScreen from './pages/intro';
import UserDetails from './pages/userDetails';   // ✅ import userDetails page
import UserContext from './context/UserContext'; // ✅ Add this import

const App = () => {
  return (
    <div>
      <UserContext> {/* ✅ Wrap with UserContext Provider */}
        <Routes>
          <Route path="/" element={<IntroScreen />} />
          <Route path="/start" element={<Start />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />

          <Route path="/riding" element={<Riding />} />
          <Route path="/captain-riding" element={<CaptainRiding />} />
          <Route path="/captain-login" element={<Captainlogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />

          {/* ✅ User Protected Routes */}
          <Route
            path="/Home" // ✅ Changed from "/home" to "/Home" to match navigation
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/userDetails"
            element={
              <UserProtectWrapper>
                <UserDetails />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/user/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />

          {/* ✅ Captain Protected Routes */}
          <Route
            path="/captain-home"
            element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            }
          />
          <Route
            path="/plan-ride"
            element={
              <UserProtectWrapper>
                <PlanRide />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/schedule-ride"
            element={
              <UserProtectWrapper>
                <ScheduleRide />
              </UserProtectWrapper>
            }
          />
          <Route
            path="/captain/logout"
            element={
              <CaptainProtectWrapper>
                <CaptainLogout />
              </CaptainProtectWrapper>
            }
          />
        </Routes>
      </UserContext> {/* ✅ Close UserContext Provider */}
    </div>
  );
};

export default App;
