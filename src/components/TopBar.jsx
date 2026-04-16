export default function TopBar({ title, subtitle, onLogout }) {
  return (
    <div style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 21,
          fontWeight: 700,
          color: 'var(--brand-800)',
          letterSpacing: -0.4,
          margin: 0,
          lineHeight: 1.2,
        }}>{title}</h1>
        {subtitle && (
          <p style={{
            margin: '3px 0 0',
            fontSize: 12.5,
            color: 'var(--gray-500)',
          }}>{subtitle}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button style={{
          background: 'var(--brand-50)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '7px 14px',
          fontSize: 13,
          color: 'var(--brand-700)',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          🔔
          <span style={{
            background: 'var(--brand-500)',
            color: '#fff',
            borderRadius: 10,
            fontSize: 10,
            fontWeight: 700,
            padding: '1px 6px',
          }}>3</span>
        </button>

        <img
          src="/stmarys.png"
          alt="FixMyCampus logo"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '7px 14px',
              fontSize: 13,
              color: 'var(--gray-600)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--red-50)';
              e.target.style.borderColor = 'var(--red-300)';
              e.target.style.color = 'var(--red-600)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--gray-600)';
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
