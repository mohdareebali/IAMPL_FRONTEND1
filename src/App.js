import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import RoleSelectScreen from "./screens/RoleSelectScreen";
import LoginScreen from "./screens/LoginScreen";
import ManagerDashboardScreen from "./screens/ManagerDashboardScreen";
import EmployeeDashboardScreen from "./screens/EmployeeDashboardScreen";
import RegisterScreen from "./screens/RegisterScreen"; // add this
import EmployeeSetUpScreen from "./screens/EmployeeSetUpScreen"; // ✅ use same casing

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/role" element={<RoleSelectScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} /> {/* ✅ NEW */}
        <Route path="/dashboard/manager" element={<ManagerDashboardScreen />} />
        <Route path="/dashboard/employee" element={<EmployeeDashboardScreen />} />
        <Route path="/employee-setup" element={<EmployeeSetUpScreen />} /> {/* ✅ Fixed */}
      </Routes>
    </Router>
  );
}

export default App;
