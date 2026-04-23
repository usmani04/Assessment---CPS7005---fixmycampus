import { DUMMY_REPORTS as REPORTS } from '../data/reports';

export default function Sidebar({ active, onNav, userRole = 'student' }) {
  const newCount = REPORTS.filter((r) => r.status === 'New').length;

  const NAV_ITEMS = userRole === 'admin' ? [
    { id: 'dashboard',    label: 'Dashboard',      icon: '📊' },
    { id: 'all-reports',  label: 'All Reports',    icon: '📋' },
    { id: 'manage-reports', label: 'Manage Reports', icon: '⚙' },
    { id: 'users',        label: 'Users',          icon: '👥' },
    { id: 'map',          label: 'Map Overview',   icon: '📍' },
    { id: 'analytics',    label: 'Analytics',      icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '📢' },
    { id: 'settings',     label: 'Settings',       icon: '⚙' },
  ] : [
    { id: 'dashboard',    label: 'Dashboard',      icon: '📊' },
    { id: 'submit',       label: 'Submit Report',  icon: '＋' },
    { id: 'my-reports',   label: 'My Reports',     icon: '📄' },
    { id: 'analytics',    label: 'Analytics',      icon: '📈' },
    { id: 'map',          label: 'Campus Map',     icon: '🗺' },
    { id: 'guidance',     label: 'Guidance',       icon: '📖' },
    { id: 'settings',     label: 'Settings',       icon: '⚙' },
  ];

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
    }}>

      <div style={{
        padding: '28px 22px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img
            src="/stmarys.png"
            alt="FixMyCampus logo"
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'var(--surface)'
            }}
          />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: -0.3,
              lineHeight: 1.2,
            }}>FixMyCampus</div>
            <div style={{ color: 'var(--sidebar-text)', fontSize: 11, marginTop: 2 }}>
              Maintenance Portal
            </div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '18px 12px', flex: 1 }}>
        <div style={{
          color: 'rgba(142,189,165,0.5)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 1.4,
          padding: '0 10px',
          marginBottom: 10,
        }}>NAVIGATION</div>

        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                marginBottom: 3,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--sidebar-active)' : 'transparent',
                color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                textAlign: 'left',
                transition: 'all 0.15s',
                borderLeft: isActive
                  ? '3px solid var(--brand-400)'
                  : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--sidebar-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>
                {item.icon}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'dashboard' && newCount > 0 && (
                <span style={{
                  background: 'var(--brand-500)',
                  color: '#fff',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 8px',
                  minWidth: 20,
                  textAlign: 'center',
                }}>{newCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{
        padding: '16px 22px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            borderRadius: '50%',
            background: 'var(--brand-600)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
          }}>AH</div>
          <div>
            <div style={{ color: '#E2F5EC', fontSize: 13, fontWeight: 600 }}>
              Ali Hassan
            </div>
            <div style={{ color: 'var(--sidebar-text)', fontSize: 11 }}>
              Student · CS Dept.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
