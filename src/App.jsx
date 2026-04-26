import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { getToken, setToken, getProfile } from "./utils/api";

import Dashboard from "./pages/Dashboard";
import SubmitReport from "./pages/SubmitReport";
import MyReports from "./pages/MyReports";
import Analytics from "./pages/Analytics";
import CampusMap from "./pages/CampusMap";
import Guidance from "./pages/Guidance";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import AllReports from "./pages/AllReports";
import ManageReports from "./pages/ManageReports";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('student');
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toastNotification, setToastNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    const role = localStorage.getItem('userRole') || 'student';
    if (token) {
      setIsAuthenticated(true);
      setCurrentUserRole(role);
      // Fetch user profile
      getProfile().then(response => {
        setCurrentUser(response.data);
      }).catch(err => {
        console.error('Failed to fetch user profile:', err);
      });
    }
    setLoading(false);
  }, []);

  const addNotification = (payload) => {
    const notification = {
      _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'system',
      priority: payload.priority || 'Medium',
      read: false,
      createdAt: new Date().toISOString(),
      ...payload.meta,
    };
    setNotifications((prev) => [notification, ...prev]);
    setToastNotification(notification);
    window.setTimeout(() => setToastNotification(null), 4200);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const handleBellClick = () => {
    navigate('/notifications');
  };

  const handleLogin = async (userRole) => {
    setIsAuthenticated(true);
    setCurrentUserRole(userRole);
    localStorage.setItem('userRole', userRole);
    // Fetch user profile after login
    try {
      const response = await getProfile();
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user profile after login:', err);
    }
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setCurrentUserRole('student');
    setCurrentUser(null);
    navigate("/");
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const handleNavigation = (page) => {
    if (typeof page === 'object' && page.type === 'view-report') {
      setSelectedReport(page.report);
      navigate('/my-reports');
    } else {
      setSelectedReport(null);
      navigate(`/${page}`);
    }
  };

  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path === "/all-reports") return "all-reports";
    if (path === "/manage-reports") return "manage-reports";
    if (path === "/users") return "users";
    if (path === "/submit") return "submit";
    if (path === "/my-reports") return "my-reports";
    if (path === "/analytics") return "analytics";
    if (path === "/map") return "map";
    if (path === "/guidance") return "guidance";
    if (path === "/notifications") return "notifications";
    if (path === "/settings") return "settings";
    return "dashboard";
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/all-reports") return "All Reports";
    if (path === "/manage-reports") return "Manage Reports";
    if (path === "/users") return "Users";
    if (path === "/submit") return "Submit Report";
    if (path === "/my-reports") return "My Reports";
    if (path === "/analytics") return "Analytics";
    if (path === "/map") return "Campus Map";
    if (path === "/guidance") return "Guidance";
    if (path === "/notifications") return "Notifications";
    if (path === "/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        active={getActivePage()}
        onNav={handleNavigation}
        userRole={currentUserRole}
        currentUser={currentUser}
      />

      <div style={{ flex: 1, position: 'relative' }}>
        <TopBar
          title={getPageTitle()}
          onLogout={handleLogout}
          userRole={currentUserRole}
          unreadCount={notifications.filter((n) => !n.read).length}
          onBellClick={handleBellClick}
        />

        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard onNav={handleNavigation} onViewReport={setSelectedReport} userRole={currentUserRole} />}
          />
          <Route
            path="/all-reports"
            element={<AllReports onNav={handleNavigation} userRole={currentUserRole} />}
          />
          <Route
            path="/manage-reports"
            element={<ManageReports onNav={handleNavigation} userRole={currentUserRole} onNotify={addNotification} />}
          />
          <Route path="/users" element={<Users userRole={currentUserRole} />} />
          <Route
            path="/submit"
            element={<SubmitReport userRole={currentUserRole} onNotify={addNotification} />}
          />
          <Route
            path="/my-reports"
            element={<MyReports selectedReport={selectedReport} onClearReport={() => setSelectedReport(null)} onUpdateSelectedReport={setSelectedReport} userRole={currentUserRole} />}
          />
          <Route path="/analytics" element={<Analytics userRole={currentUserRole} />} />
          <Route path="/map" element={<CampusMap userRole={currentUserRole} />} />
          <Route path="/guidance" element={<Guidance userRole={currentUserRole} />} />
          <Route
            path="/notifications"
            element={
              <Notifications
                userRole={currentUserRole}
                notifications={notifications}
                setNotifications={setNotifications}
                markAsRead={markNotificationRead}
                markAllAsRead={markAllNotificationsRead}
                deleteNotification={deleteNotification}
              />
            }
          />
          <Route path="/settings" element={<Settings userRole={currentUserRole} />} />
          <Route
            path="*"
            element={<Dashboard onNav={handleNavigation} onViewReport={setSelectedReport} userRole={currentUserRole} />}
          />
        </Routes>

        {toastNotification && (
          <div style={{
            position: 'fixed',
            right: 20,
            bottom: 20,
            width: 320,
            zIndex: 999,
            boxShadow: '0 16px 34px rgba(15,23,42,0.18)',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '18px',
              border: '1px solid rgba(15,23,42,0.08)',
              padding: '18px 20px',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--brand-50)',
                fontSize: 20,
              }}>🔔</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--brand-800)', marginBottom: 4 }}>{toastNotification.title}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5 }}>{toastNotification.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
