import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import Dashboard from "./pages/Dashboard";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports";

export default function App() {
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar active="" onNav={handleNavigation} />

      <div style={{ flex: 1 }}>
        <TopBar title="" />

        <Routes>
          <Route path="/dashboard" element={<Dashboard onNav={handleNavigation} onViewReport={() => {}} />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="*" element={<Dashboard onNav={handleNavigation} onViewReport={() => {}} />} />
        </Routes>
      </div>
    </div>
  );
}
