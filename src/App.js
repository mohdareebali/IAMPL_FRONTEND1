// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FilesProvider } from "./context/FileContext"; // ✅ FIXED: Correct name

// Screens
import HomeScreen from "./screens/HomeScreen";
import RoleSelectScreen from "./screens/RoleSelectScreen";
import LoginScreen from "./screens/LoginScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ManagerForgotScreen from "./screens/ManagerForgotScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import ManagerOTPVerificationScreen from "./screens/ManagerOTPVerificationScreen"; 
import RegisterScreen from "./screens/RegisterScreen";
import ManagerDashboardScreen from "./screens/ManagerDashboardScreen";
import EmployeeDashboardScreen from "./screens/EmployeeDashboardScreen";
import EmployeeSetUpScreen from "./screens/EmployeeSetUpScreen";
import EmployeeFairsDoneScreen from "./screens/EmployeeFairsDoneScreen";
import EmployeeRejectedFairScreen from "./screens/EmployeeRejectedFairScreen";
import EmployeeInfoScreen from "./screens/EmployeeInfoScreen";
import ResetPassword from "./screens/ResetPassword";
import ManagerResetPassword from "./screens/ManagerResetPassword"; // <-- added

// New screens under src/screens1/
import FolderUploadScreen from "./screens1/FolderUploadScreen";
import Form1SetupScreen from "./screens1/Form1SetupScreen";
import Form2SetupScreen from "./screens1/Form2SetupScreen";
import Form3SetupScreen from "./screens1/Form3SetupScreen";

function App() {
  return (
    <FilesProvider> {/* ✅ Wrap app in FilesProvider */}
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
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/manager-forgot/otp"
            element={<ManagerOTPVerificationScreen />}
          />
          <Route path="/manager-reset-password" element={<ManagerResetPassword />} /> {/* <-- added */}
          <Route path="/register" element={<RegisterScreen />} />

          {/* Dashboards */}
          <Route path="/dashboard/manager" element={<ManagerDashboardScreen />} />
          <Route path="/dashboard/employee" element={<EmployeeDashboardScreen />} />

          {/* Employee setup screens */}
          <Route path="/employee-setup" element={<EmployeeSetUpScreen />} />
          <Route path="/employee-fairs-done" element={<EmployeeFairsDoneScreen />} />
          <Route path="/employee-rejected-fair" element={<EmployeeRejectedFairScreen />} />

          {/* Folder Upload & Forms */}
          <Route path="/folder-upload" element={<FolderUploadScreen />} />
          <Route path="/form1setup" element={<Form1SetupScreen />} />
          <Route path="/form2setup" element={<Form2SetupScreen />} />
          <Route path="/form3setup" element={<Form3SetupScreen />} />
        </Routes>
      </Router>
    </FilesProvider>
  );
}

export default App;
