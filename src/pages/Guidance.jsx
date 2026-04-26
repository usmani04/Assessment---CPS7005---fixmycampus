import { useState } from 'react';
import { DUMMY_GUIDANCE as GUIDANCE } from '../data/guidance';

export default function Guidance() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            color: 'var(--brand-800)',
            margin: '0 0 6px',
            fontWeight: 700,
          }}>📖 Reporting Guidance</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 14, margin: 0 }}>
            Learn how to submit effective maintenance reports and get issues resolved faster
          </p>
        </div>

        {/* Hero banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-800) 0%, var(--brand-600) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          marginBottom: 28,
          color: '#fff',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            margin: '0 0 8px',
            fontSize: 20,
          }}>Quick Tips for Better Reports</h3>
          <p style={{ margin: 0, color: '#fff', fontSize: 14, lineHeight: 1.65 }}>
            Read our guidance to submit better reports and get issues resolved faster.
            In an emergency, call campus security on{' '}
            <strong style={{ color: '#fff' }}>ext. 999</strong>.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ display: 'grid', gap: 10, marginBottom: 28 }}>
          {GUIDANCE.map((g) => (
            <div key={g.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              transition: 'border-color 0.15s',
              borderColor: open === g.id ? 'var(--brand-300)' : 'var(--border)',
            }}>
              <button
                onClick={() => setOpen(open === g.id ? null : g.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '17px 20px',
                  background: open === g.id ? 'var(--brand-50)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{g.icon}</span>
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 600,
                  color: open === g.id ? 'var(--brand-700)' : 'var(--gray-800)',
                }}>{g.title}</span>
                <span style={{
                  fontSize: 16,
                  color: 'var(--brand-400)',
                  transform: open === g.id ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.2s',
                  display: 'inline-block',
                }}>›</span>
              </button>

              {open === g.id && (
                <div style={{
                  padding: '0 20px 18px 56px',
                  fontSize: 13.5,
                  color: 'var(--gray-600)',
                  lineHeight: 1.75,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 14,
                }}>
                  {g.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Emergency callout */}
        <div style={{
          background: '#FFF5F5',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--red-600)',
            fontSize: 15,
            marginBottom: 6,
          }}>⚠️ Emergency Situations</div>
          <p style={{
            margin: 0,
            color: '#7F1D1D',
            fontSize: 13.5,
            lineHeight: 1.7,
          }}>
            If there is immediate danger — gas leak, flooding, electrical fire, or injury —
            do <strong>not</strong> use this form.
            Call campus security immediately on <strong>ext. 999</strong> or
            emergency services on <strong>999</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
