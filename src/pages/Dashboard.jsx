import { useState, useEffect } from 'react';
import { CATEGORIES, STATUSES } from '../constants';
import {
  statusColor,
  statusBg,
  statusText,
  priorityColor,
  priorityBg,
} from '../utils/helpers';
import { getReports } from '../utils/api';
import Badge from '../components/Badge';

export default function Dashboard({ onNav = () => {}, onViewReport = () => {} }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat]       = useState('All');
  const [search, setSearch]             = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    total:      reports.length,
    newCount:   reports.filter((r) => r.status === 'New').length,
    inProgress: reports.filter((r) => r.status === 'In Progress').length,
    resolved:   reports.filter((r) => r.status === 'Resolved').length,
  };

  const filtered = reports.filter((r) =>
    (filterStatus === 'All' || r.status === filterStatus) &&
    (filterCat    === 'All' || r.category === filterCat) &&
    (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())
    )
  );

  const statCards = [
    { label: 'Total Reports',  value: counts.total,      icon: '📋', accent: 'var(--brand-600)', light: 'var(--brand-50)' },
    { label: 'New',            value: counts.newCount,   icon: '🔵', accent: 'var(--blue-600)',  light: 'var(--blue-50)'  },
    { label: 'In Progress',    value: counts.inProgress, icon: '🟡', accent: 'var(--amber-600)', light: 'var(--amber-50)' },
    { label: 'Resolved',       value: counts.resolved,   icon: '✅', accent: 'var(--brand-500)', light: 'var(--brand-50)' },
  ];

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginBottom: 28,
      }}>
        {statCards.map((c) => (
          <div key={c.label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px',
            boxShadow: 'var(--shadow-sm)',
            borderTop: `3px solid ${c.accent}`,
          }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: c.accent, lineHeight: 1 }}>
              {c.value}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--gray-500)', marginTop: 5 }}>
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
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
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  Search by title or location…"
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            fontSize: 13,
            flex: 1,
            minWidth: 200,
            outline: 'none',
            color: 'var(--gray-800)',
            background: 'var(--surface-alt)',
          }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
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
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button
          onClick={() => onNav('submit')}
          style={{
            background: 'var(--brand-600)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          + New Report
        </button>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--brand-50)', borderBottom: '1px solid var(--border)' }}>
              {['#', 'Title', 'Category', 'Location', 'Status', 'Priority', 'Date'].map((h) => (
                <th key={h} style={{
                  padding: '11px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: 'var(--brand-700)',
                  fontSize: 11.5,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r._id}
                style={{ borderBottom: '1px solid var(--gray-100)', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontWeight: 600 }}>
                  {r._id?.slice(-6).toUpperCase()}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-800)', fontWeight: 500, maxWidth: 200 }}>
                  {r.title}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>{r.category}</td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-500)', fontSize: 12 }}>{r.location}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge text={r.status} color={statusText(r.status)} bg={statusBg(r.status)} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge text={r.priority} color={priorityColor(r.priority)} bg={priorityBg(r.priority)} />
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--gray-400)',
                  fontSize: 14,
                }}>
                  No reports match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
