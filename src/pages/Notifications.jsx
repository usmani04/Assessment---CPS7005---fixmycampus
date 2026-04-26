import { useState, useEffect } from 'react';

export default function Notifications({
  userRole = 'admin',
  notifications: notificationsProp = [],
  setNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}) {
  const [localNotifications, setLocalNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const isExternal = typeof setNotifications === 'function';
  const notifications = isExternal ? notificationsProp : localNotifications;

  useEffect(() => {
    if (!isExternal) {
      setLoading(true);
      const timeout = setTimeout(() => {
        setLocalNotifications([
          {
            _id: '1',
            type: 'report',
            title: 'New Maintenance Report',
            message: 'Electrical issue reported in Room 101',
            priority: 'High',
            read: false,
            createdAt: '2024-01-15T10:30:00Z',
            reporter: 'Ali Hassan'
          },
          {
            _id: '2',
            type: 'status_update',
            title: 'Report Status Changed',
            message: 'Report #ABC123 status changed from New to In Progress',
            priority: 'Medium',
            read: true,
            createdAt: '2024-01-15T09:15:00Z',
            updatedBy: 'Admin User'
          },
          {
            _id: '3',
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance will occur tonight from 2-4 AM',
            priority: 'Low',
            read: false,
            createdAt: '2024-01-14T16:00:00Z',
          },
          {
            _id: '4',
            type: 'user',
            title: 'New User Registration',
            message: 'Sarah Ahmed has registered as a new user',
            priority: 'Low',
            read: true,
            createdAt: '2024-01-14T11:20:00Z',
          }
        ]);
        setLoading(false);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [notificationsProp]);

  const handleMarkAsRead = (notificationId) => {
    if (markAsRead) return markAsRead(notificationId);
    setLocalNotifications((prev) =>
      prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    if (markAllAsRead) return markAllAsRead();
    setLocalNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (notificationId) => {
    if (deleteNotification) return deleteNotification(notificationId);
    setLocalNotifications((prev) => prev.filter((n) => n._id !== notificationId));
  };

  const filteredNotifications = notifications.filter((n) =>
    filterType === 'All' || n.type === filterType
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'var(--red-500)';
      case 'Medium': return 'var(--amber-500)';
      case 'Low': return 'var(--green-500)';
      default: return 'var(--gray-500)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'report': return '📋';
      case 'status_update': return '🔄';
      case 'system': return '⚙️';
      case 'user': return '👤';
      default: return '📢';
    }
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          color: 'var(--brand-800)',
          margin: '0 0 4px',
        }}>Notifications</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>
          System notifications and updates ({unreadCount} unread)
        </p>
      </div>

      {/* Filters and Actions */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        marginBottom: 18,
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            fontSize: 13,
            color: 'var(--gray-700)',
            background: 'var(--surface-alt)',
            outline: 'none',
          }}
        >
          <option value="All">All Types</option>
          <option value="report">Reports</option>
          <option value="status_update">Status Updates</option>
          <option value="system">System</option>
          <option value="user">Users</option>
        </select>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            style={{
              background: 'var(--blue-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ✅ Mark All Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            padding: '48px',
            textAlign: 'center',
            color: 'var(--gray-400)',
            fontSize: 14,
          }}>
            {loading ? 'Loading notifications...' : 'No notifications match your filters.'}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--gray-100)',
                background: notification.read ? 'var(--surface)' : 'var(--blue-50)',
                transition: 'background 0.1s',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  fontSize: 20,
                  width: 32,
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  {getTypeIcon(notification.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h4 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      color: 'var(--brand-800)',
                      margin: 0,
                      fontWeight: notification.read ? 600 : 700,
                    }}>
                      {notification.title}
                    </h4>
                    <span style={{
                      background: getPriorityColor(notification.priority),
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      {notification.priority}
                    </span>
                    {!notification.read && (
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--blue-500)',
                        flexShrink: 0,
                      }}></span>
                    )}
                  </div>

                  <p style={{
                    fontSize: 13,
                    color: 'var(--gray-700)',
                    margin: '4px 0',
                    lineHeight: 1.4,
                  }}>
                    {notification.message}
                  </p>

                  <div style={{
                    fontSize: 11,
                    color: 'var(--gray-400)',
                    marginTop: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span>
                      {new Date(notification.createdAt).toLocaleString()}
                      {notification.reporter && ` • Reported by ${notification.reporter}`}
                      {notification.updatedBy && ` • Updated by ${notification.updatedBy}`}
                    </span>

                    <div style={{ display: 'flex', gap: 6 }}>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--blue-300)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            fontSize: 10,
                            color: 'var(--blue-600)',
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification._id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--red-300)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '3px 8px',
                          fontSize: 10,
                          color: 'var(--red-600)',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}