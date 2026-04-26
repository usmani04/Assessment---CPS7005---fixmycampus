import { useState, useEffect } from 'react';
import { getProfile, updateUser } from '../utils/api';

function Toggle({ label, desc, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid var(--gray-100)',
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--gray-700)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24,
          borderRadius: 12,
          border: 'none',
          background: value ? 'var(--brand-500)' : 'var(--gray-300)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3,
          left: value ? 22 : 3,
          width: 18, height: 18,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 26px',
      marginBottom: 18,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        color: 'var(--brand-800)',
        margin: '0 0 18px',
        fontWeight: 700,
      }}>{title}</h3>
      {children}
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
  });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [anonData, setAnonData] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        const userData = response.data;
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          studentId: userData.studentId || '',
          department: userData.department || '',
        });
        setUserId(userData._id);
        setNotifEmail(userData.notifEmail !== false);
        setAnonData(userData.anonData !== false);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const inputStyle = {
    width: '100%',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '9px 14px',
    fontSize: 13.5,
    color: 'var(--gray-700)',
    background: 'var(--surface-alt)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--gray-400)',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 5,
  };

  const handleSave = async () => {
    if (!userId) return;

    try {
      setError(null);
      await updateUser(userId, {
        name: profile.name,
        email: profile.email,
        studentId: profile.studentId,
        department: profile.department,
        notifEmail,
        anonData,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError('Failed to save settings');
      console.error('Save error:', err);
    }
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray-500)' }}>
            Loading profile...
          </div>
        )}

        {error && (
          <div style={{
            background: 'var(--red-50)',
            border: '1px solid var(--red-200)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: 20,
            color: 'var(--red-700)',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                color: 'var(--brand-800)',
                margin: '0 0 6px',
                fontWeight: 700,
              }}>⚙️ Settings</h2>
              <p style={{ color: 'var(--gray-500)', fontSize: 14, margin: 0 }}>
                Manage your account preferences and notification settings
              </p>
            </div>

        {/* Profile */}
        <Section title="👤 Profile">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['Full Name', 'name'],
              ['Email', 'email'],
              ['Student ID', 'studentId'],
              ['Department', 'department'],
            ].map(([label, key]) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  value={profile[key] || ''}
                  onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="🔔 Notifications">
          <Toggle
            label="Email notifications"
            desc="Receive an email when your report status changes"
            value={notifEmail}
            onChange={() => setNotifEmail(!notifEmail)}
          />
          <Toggle
            label="SMS notifications"
            desc="Receive a text message for urgent updates"
            value={notifSMS}
            onChange={() => setNotifSMS(!notifSMS)}
          />
        </Section>

        {/* Privacy */}
        <Section title="🔒 Privacy & Data">
          <Toggle
            label="Allow anonymised data use"
            desc="Your data may be used in anonymised trend reports"
            value={anonData}
            onChange={() => setAnonData(!anonData)}
          />
          <div style={{
            marginTop: 16,
            background: 'var(--brand-50)',
            border: '1px solid var(--brand-100)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: 13,
            color: 'var(--brand-700)',
            lineHeight: 1.6,
          }}>
            Your personal data is stored securely and never sold. View our full{' '}
            <span style={{ fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
              Privacy Policy
            </span>{' '}
            for details.
          </div>
        </Section>

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            background: saved ? 'var(--brand-500)' : 'var(--brand-600)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '13px',
            fontSize: 15,
            fontWeight: 700,
            transition: 'background 0.3s',
            letterSpacing: 0.2,
          }}
        >
          {saved ? '✓ Settings Saved!' : 'Save Settings'}
        </button>
          </>
        )}
      </div>
    </div>
  );
}
