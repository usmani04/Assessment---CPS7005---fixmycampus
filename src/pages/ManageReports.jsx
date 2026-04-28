import { useState, useEffect } from 'react';
import { CATEGORIES, STATUSES, PRIORITIES } from '../constants';
import {
  statusColor,
  statusBg,
  statusText,
  priorityColor,
  priorityBg,
} from '../utils/helpers';
import { getReports, updateReport, deleteReport } from '../utils/api';
import Badge from '../components/Badge';

export default function ManageReports({ onNav = () => {}, userRole = 'admin', onNotify }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedReports, setSelectedReports] = useState([]);

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

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedReports.length === 0) {
      alert('Please select reports to update');
      return;
    }

    try {
      const promises = selectedReports.map(id => updateReport(id, { status: newStatus }));
      await Promise.all(promises);
      setSelectedReports([]);
      await fetchReports();
    } catch (error) {
      console.error('Failed to update reports:', error);
      alert('Failed to update selected reports');
    }

    if (onNotify) {
      onNotify({
        title: 'Report Status Updated',
        message: `${selectedReports.length} report(s) were moved to ${newStatus}.`,
        type: 'status_update',
        priority: 'Medium',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReports.length === 0) {
      alert('Please select reports to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedReports.length} report(s)? This cannot be undone.`)) return;

    try {
      const promises = selectedReports.map(id => deleteReport(id));
      await Promise.all(promises);
      setSelectedReports([]);
      await fetchReports();
    } catch (error) {
      console.error('Failed to delete reports:', error);
      alert('Failed to delete selected reports');
    }
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filtered.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filtered.map(r => r._id));
    }
  };

  const filtered = reports.filter((r) =>
    (filterStatus === 'All' || r.status === filterStatus) &&
    (filterCat === 'All' || r.category === filterCat) &&
    (filterPriority === 'All' || r.priority === filterPriority) &&
    (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter?.name?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          color: 'var(--brand-800)',
          margin: '0 0 4px',
        }}>Manage Reports</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>
          Advanced report management with bulk operations ({filtered.length} of {reports.length} reports)
        </p>
      </div>

      {/* Bulk Actions Bar */}
      {selectedReports.length > 0 && (
        <div style={{
          background: 'var(--brand-50)',
          border: '1px solid var(--brand-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 18px',
          marginBottom: 18,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--brand-700)' }}>
            {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <select
              onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '6px 10px',
                fontSize: 12,
                background: '#fff',
                color: '#111',
                outline: 'none',
                WebkitTextFillColor: '#111',
                MozTextFillColor: '#111',
              }}
              defaultValue=""
            >
              <option value="" style={{ color: '#111', background: '#fff' }}>Change Status</option>
              {STATUSES.map((s) => <option key={s} value={s} style={{ color: '#111', background: '#fff' }}>{s}</option>)}
            </select>
            <button
              onClick={handleBulkDelete}
              style={{
                background: 'var(--red-600)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🗑 Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
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
          placeholder="🔍 Search by title, location, or reporter name…"
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
          <option value="All">All Status</option>
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
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
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
          <option value="All">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <button
          onClick={fetchReports}
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
          🔄 Refresh
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
              <th style={{
                padding: '11px 16px',
                textAlign: 'left',
                fontWeight: 600,
                color: 'var(--brand-700)',
                fontSize: 11.5,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
                width: 40,
              }}>
                <input
                  type="checkbox"
                  checked={selectedReports.length === filtered.length && filtered.length > 0}
                  onChange={handleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              {['#', 'Title', 'Reporter', 'Category', 'Location', 'Status', 'Priority', 'Date'].map((h) => (
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
                <td style={{ padding: '12px 16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(r._id)}
                    onChange={() => handleSelectReport(r._id)}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontWeight: 600 }}>
                  {r._id?.slice(-6).toUpperCase()}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-800)', fontWeight: 500, maxWidth: 200 }}>
                  {r.title}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)', fontSize: 12 }}>
                  {r.reporter?.name || 'Unknown'}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>{r.category}</td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-500)', fontSize: 12 }}>{r.location}</td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge text={r.status} color={statusText(r.status)} bg={statusBg(r.status)} />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge text={r.priority} color={priorityColor(r.priority)} bg={priorityBg(r.priority)} />
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontSize: 12 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--gray-400)',
                  fontSize: 14,
                }}>
                  {loading ? 'Loading reports...' : 'No reports match your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}