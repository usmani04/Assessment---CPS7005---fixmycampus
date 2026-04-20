import { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../constants';
import { createReport } from '../utils/api';

export default function SubmitReport() {
  const [form, setForm] = useState({
    title: '', category: '', location: '',
    description: '', priority: 'Medium',
    photo: '', consent: false,
  });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [refNum, setRefNum] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.category)           e.category    = 'Please select a category';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.description.trim()) e.description = 'Please describe the issue';
    if (!form.consent)            e.consent     = 'You must agree to data usage';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await createReport({
        title: form.title,
        category: form.category,
        location: form.location,
        description: form.description,
        priority: form.priority,
      });

      setRefNum(response.report._id);
      setSubmitted(true);
      setForm({
        title: '', category: '', location: '',
        description: '', priority: 'Medium',
        photo: '', consent: false,
      });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: '28px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '52px 48px',
          textAlign: 'center',
          maxWidth: 460,
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ fontSize: 60, marginBottom: 18 }}>✅</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--brand-700)',
            fontSize: 24,
            margin: '0 0 8px',
          }}>Report Submitted!</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 10 }}>
            Your reference number:
          </p>
          <div style={{
            background: 'var(--brand-50)',
            border: '1px solid var(--brand-200)',
            color: 'var(--brand-700)',
            fontWeight: 700,
            fontSize: 22,
            padding: '12px 28px',
            borderRadius: 'var(--radius-md)',
            display: 'inline-block',
            marginBottom: 24,
            letterSpacing: 1,
          }}>{refNum}</div>
          <p style={{ color: 'var(--gray-400)', fontSize: 13, marginBottom: 28, lineHeight: 1.6 }}>
            You'll be notified by email when the status changes.
            Track your report anytime from the Dashboard.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              background: 'var(--brand-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '11px 28px',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = (key) => ({
    width: '100%',
    border: `1px solid ${errors[key] ? 'var(--red-600)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '10px 14px',
    fontSize: 14,
    color: 'var(--gray-800)',
    background: 'var(--surface-alt)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
  });

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--gray-700)',
    marginBottom: 6,
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ marginBottom: 30 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              color: 'var(--brand-800)',
              margin: '0 0 6px',
            }}>Submit a Maintenance Report</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 13.5 }}>
              Fill in all required fields. The more detail you provide, the faster issues get resolved.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Report Title <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Broken radiator in Room 204"
              style={inputStyle('title')}
            />
            {errors.title && <p style={{ color: 'var(--red-600)', fontSize: 12, marginTop: 4 }}>{errors.title}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Category <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              style={inputStyle('category')}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p style={{ color: 'var(--red-600)', fontSize: 12, marginTop: 4 }}>{errors.category}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Location <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Block C, Floor 2, Room 204"
              style={inputStyle('location')}
            />
            {errors.location && <p style={{ color: 'var(--red-600)', fontSize: 12, marginTop: 4 }}>{errors.location}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Description <span style={{ color: 'var(--red-600)' }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              placeholder="Describe the issue clearly — when it started, how it affects the space…"
              style={{ ...inputStyle('description'), resize: 'vertical' }}
            />
            {errors.description && <p style={{ color: 'var(--red-600)', fontSize: 12, marginTop: 4 }}>{errors.description}</p>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {PRIORITIES.map((p) => {
                const colors = {
                  Low:    { border: 'var(--gray-400)',   text: 'var(--gray-600)',   bg: 'var(--gray-100)'   },
                  Medium: { border: 'var(--amber-500)',  text: 'var(--amber-600)',  bg: 'var(--amber-50)'   },
                  High:   { border: 'var(--red-600)',    text: 'var(--red-600)',    bg: 'var(--red-50)'     },
                };
                const isSelected = form.priority === p;
                const c = colors[p];
                return (
                  <button
                    key={p}
                    onClick={() => set('priority', p)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? c.border : 'var(--border)'}`,
                      background: isSelected ? c.bg : 'var(--surface)',
                      color: isSelected ? c.text : 'var(--gray-500)',
                      fontWeight: 600,
                      fontSize: 13,
                      transition: 'all 0.15s',
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Photo URL (optional)</label>
            <input
              value={form.photo}
              onChange={(e) => set('photo', e.target.value)}
              placeholder="https://…"
              style={inputStyle('photo')}
            />
          </div>

          <div style={{
            background: 'var(--brand-50)',
            border: `1px solid ${errors.consent ? 'var(--red-600)' : 'var(--brand-200)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            marginBottom: 24,
          }}>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set('consent', e.target.checked)}
                style={{ marginTop: 2, accentColor: 'var(--brand-600)' }}
              />
              <span style={{ fontSize: 13, color: 'var(--brand-800)', lineHeight: 1.6 }}>
                I agree that my name and contact details may be used to follow up on this report.
                Data is stored securely and never shared with third parties.{' '}
                <span style={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  Privacy Policy
                </span>
              </span>
            </label>
            {errors.consent && (
              <p style={{ color: 'var(--red-600)', fontSize: 12, marginTop: 6 }}>{errors.consent}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              background: 'var(--brand-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '13px',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            Submit Report →
          </button>
        </div>
      </div>
    </div>
  );
}
