// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Screens
import HomeScreen from "./screens/HomeScreen";
import RoleSelectScreen from "./screens/RoleSelectScreen";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ManagerForgotScreen from "./screens/ManagerForgotScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import ManagerOTPVerificationScreen from "./screens/ManagerOTPVerificationScreen"; // Updated import
import RegisterScreen from "./screens/RegisterScreen";
import ManagerDashboardScreen from "./screens/ManagerDashboardScreen";
import EmployeeDashboardScreen from "./screens/EmployeeDashboardScreen";
import EmployeeSetUpScreen from "./screens/EmployeeSetUpScreen";
import EmployeeFairsDoneScreen from "./screens/EmployeeFairsDoneScreen";
import EmployeeRejectedFairScreen from "./screens/EmployeeRejectedFairScreen";
import EmployeeInfoScreen from "./screens/EmployeeInfoScreen";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Screens */}
        <Route path="/employee-info" element={<EmployeeInfoScreen />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/role" element={<RoleSelectScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/manager-forgot" element={<ManagerForgotScreen />} />
        <Route path="/forgot-password/otp" element={<OTPVerificationScreen />} />
        <Route
          path="/manager-forgot/otp"
          element={<ManagerOTPVerificationScreen />}
        /> {/* Manager OTP */}
        <Route path="/register" element={<RegisterScreen />} />

        {/* Manager & Employee Dashboards */}
        <Route path="/dashboard/manager" element={<ManagerDashboardScreen />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboardScreen />} />

        {/* Employee setup screens */}
        <Route
          path="/employee-setup"
          element={<EmployeeSetUpScreen />}
        />
        <Route path="/employee-fairs-done" element={<EmployeeFairsDoneScreen />} />
        <Route path="/employee-rejected-fair" element={<EmployeeRejectedFairScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
