import { useState } from 'react';
import { statusBg, statusText } from '../utils/helpers';
import Badge from '../components/Badge';

const PINS = [
  { id: 1, x: 175, y: 115, label: 'Block C',        reports: 3, status: 'In Progress' },
  { id: 2, x: 335, y: 75,  label: 'Library',        reports: 2, status: 'New'         },
  { id: 3, x: 480, y: 195, label: 'Science Block',  reports: 1, status: 'Resolved'    },
  { id: 4, x: 260, y: 255, label: 'Main Building',  reports: 2, status: 'In Progress' },
  { id: 5, x: 415, y: 305, label: 'Canteen',        reports: 1, status: 'In Progress' },
  { id: 6, x:  95, y: 275, label: 'South Campus',   reports: 1, status: 'New'         },
];

const BUILDINGS = [
  { x: 115, y: 75,  w: 145, h: 90,  label: 'Block C',       bg: '#E0F4EC' },
  { x: 285, y: 45,  w: 130, h: 70,  label: 'Library',       bg: '#DBEAFE' },
  { x: 440, y: 150, w: 115, h: 80,  label: 'Science Block', bg: '#EDE9FE' },
  { x: 190, y: 210, w: 155, h: 78,  label: 'Main Building', bg: '#FEF3C7' },
  { x: 368, y: 265, w: 100, h: 68,  label: 'Canteen',       bg: '#FFE4E6' },
  { x:  38, y: 235, w: 110, h: 70,  label: 'South Campus',  bg: '#F0FDF4' },
];

export default function CampusMap() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              color: 'var(--brand-800)',
              margin: '0 0 3px',
            }}>Campus Issue Map</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', margin: 0 }}>
              Click a pin to see report details for that location
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            {[['New', '#2563EB'], ['In Progress', '#D97706'], ['Resolved', '#2A9D6A']].map(([s, c]) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--gray-500)' }}>
                <span style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: c,
                  display: 'inline-block',
                }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Map canvas */}
        <div style={{
          position: 'relative',
          height: 400,
          background: 'linear-gradient(135deg, var(--brand-50) 0%, #EFF6FF 100%)',
          overflow: 'hidden',
        }}>
          {/* Grid lines */}
          {[100, 200, 300, 400, 500].map((x) => (
            <div key={x} style={{ position: 'absolute', left: x, top: 0, bottom: 0, borderLeft: '1px dashed rgba(42,157,106,0.1)' }} />
          ))}
          {[100, 200, 300].map((y) => (
            <div key={y} style={{ position: 'absolute', top: y, left: 0, right: 0, borderTop: '1px dashed rgba(42,157,106,0.1)' }} />
          ))}

          {/* Buildings */}
          {BUILDINGS.map((b) => (
            <div key={b.label} style={{
              position: 'absolute',
              left: b.x, top: b.y,
              width: b.w, height: b.h,
              background: b.bg,
              border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gray-700)',
                textAlign: 'center',
                padding: '0 8px',
              }}>{b.label}</span>
            </div>
          ))}

          {/* Pins */}
          {PINS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
              title={p.label}
              style={{
                position: 'absolute',
                left: p.x - 14,
                top: p.y - 14,
                width: 28, height: 28,
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                background: statusBg(p.status),
                border: '3px solid #fff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: 10,
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(-45deg) scale(1.25)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(-45deg) scale(1)'}
            >
              <span style={{
                display: 'block',
                transform: 'rotate(45deg)',
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                textAlign: 'center',
                lineHeight: '22px',
              }}>{p.reports}</span>
            </button>
          ))}

          {/* Tooltip */}
          {selected && (
            <div style={{
              position: 'absolute',
              left: Math.min(selected.x + 24, 480),
              top: Math.max(selected.y - 30, 10),
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 18px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 20,
              minWidth: 180,
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--brand-800)',
                marginBottom: 8,
              }}>{selected.label}</div>
              <Badge text={selected.status} color={statusText(selected.status)} bg={statusBg(selected.status)} />
              <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 8 }}>
                {selected.reports} active report{selected.reports !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{
          padding: '11px 24px',
          background: 'var(--brand-50)',
          borderTop: '1px solid var(--border)',
          fontSize: 12,
          color: 'var(--brand-700)',
        }}>
          💡 In the full version this map will use <strong>Leaflet.js</strong> with real GPS coordinates for your campus.
        </div>
      </div>
    </div>
  );
}
