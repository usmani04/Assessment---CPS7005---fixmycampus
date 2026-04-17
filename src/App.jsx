import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import Dashboard from "./pages/Dashboard";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports";
import Analytics from "./pages/Analytics";
import CampusMap from "./pages/CampusMap";
import Guidance from "./pages/Guidance";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/submit") return "submit";
    if (path === "/my-reports") return "my-reports";
    if (path === "/analytics") return "analytics";
    if (path === "/map") return "map";
    if (path === "/guidance") return "guidance";
    if (path === "/settings") return "settings";
    return "dashboard";
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/submit") return "Submit Report";
    if (path === "/my-reports") return "My Reports";
    if (path === "/analytics") return "Analytics";
    if (path === "/map") return "Campus Map";
    if (path === "/guidance") return "Guidance";
    if (path === "/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active={getActivePage()} onNav={handleNavigation} />

      <div style={{ flex: 1 }}>
        <TopBar title={getPageTitle()} onLogout={handleLogout} />

        <Routes>
          <Route path="/dashboard" element={<Dashboard onNav={handleNavigation} onViewReport={() => {}} />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/guidance" element={<Guidance />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard onNav={handleNavigation} onViewReport={() => {}} />} />
        </Routes>
      </div>
    </div>
  );
}
