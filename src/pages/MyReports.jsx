import { useState } from 'react';
import { DUMMY_REPORTS as REPORTS } from '../data/reports';
import { statusBg, statusText, priorityColor, priorityBg } from '../utils/helpers';
import Badge from '../components/Badge';

function ReportDetail({ report, onBack }) {
  return (
    <div style={{ padding: '28px 32px' }}>
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '7px 16px',
          fontSize: 13,
          color: 'var(--gray-600)',
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        ← Back to My Reports
      </button>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        maxWidth: 700,
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
          gap: 12,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            color: 'var(--brand-800)',
            margin: 0,
            lineHeight: 1.3,
          }}>
            {report.title}
          </h2>
          <Badge
            text={report.status}
            color={statusText(report.status)}
            bg={statusBg(report.status)}
          />
        </div>

        {/* Meta grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 24,
        }}>
          {[
            ['Category',  report.category],
            ['Location',  report.location],
            ['Priority',  report.priority],
            ['Reported',  report.date],
            ['Reporter',  report.reporter],
          ].map(([label, value]) => (
            <div key={label} style={{
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}>
              <div style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--gray-400)',
                letterSpacing: 0.8,
                marginBottom: 4,
                textTransform: 'uppercase',
              }}>{label}</div>
              <div style={{ fontSize: 14, color: 'var(--gray-800)', fontWeight: 500 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--gray-400)',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>Description</div>
          <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>
            {report.description}
          </p>
        </div>

        {/* Updates */}
        <div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--gray-400)',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>Update History</div>

          {report.updates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {report.updates.map((u, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: 'var(--brand-500)',
                    marginTop: 5,
                    flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 13.5, color: 'var(--gray-600)' }}>{u}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'var(--amber-50)',
              border: '1px solid var(--amber-100)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              fontSize: 13,
              color: '#92400E',
            }}>
              ⏳ No updates yet — the maintenance team has been notified.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyReports({ selectedReport, onClearReport }) {
  const [detail, setDetail] = useState(selectedReport || null);

  const viewReport = detail || selectedReport;

  if (viewReport) {
    return (
      <ReportDetail
        report={viewReport}
        onBack={() => { setDetail(null); onClearReport && onClearReport(); }}
      />
    );
  }

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          color: 'var(--brand-800)',
          margin: '0 0 4px',
        }}>My Submitted Reports</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>
          Showing your {REPORTS.slice(0, 4).length} most recent submissions
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {REPORTS.slice(0, 4).map((r) => (
          <div
            key={r.id}
            onClick={() => setDetail(r)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 22px',
              cursor: 'pointer',
              transition: 'box-shadow 0.15s, border-color 0.15s',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.borderColor = 'var(--brand-300)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              gap: 12,
            }}>
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-800)' }}>
                {r.title}
              </span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Badge text={r.priority} color={priorityColor(r.priority)} bg={priorityBg(r.priority)} />
                <Badge text={r.status} color={statusText(r.status)} bg={statusBg(r.status)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 18, fontSize: 12, color: 'var(--gray-400)' }}>
              <span>📍 {r.location}</span>
              <span>🏷 {r.category}</span>
              <span>📅 {r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
