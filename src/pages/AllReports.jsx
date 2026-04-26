import { useState, useEffect } from 'react';
import { CATEGORIES, STATUSES } from '../constants';
import {
  statusColor,
  statusBg,
  statusText,
  priorityColor,
  priorityBg,
} from '../utils/helpers';
import { getReports, updateReport, deleteReport } from '../utils/api';
import Badge from '../components/Badge';

export default function AllReports({ onNav = () => {}, userRole = 'student' }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');

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

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Update local state immediately for better UX
      setReports(prev => prev.map(r => r._id === reportId ? { ...r, status: newStatus } : r));

      await updateReport(reportId, { status: newStatus });
      await fetchReports(); // Refresh the list to ensure consistency
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update report status');
      // Revert the local change on error
      await fetchReports();
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) return;
    try {
      await deleteReport(reportId);
      await fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete report');
    }
  };

  const filtered = reports.filter((r) =>
    (filterStatus === 'All' || r.status === filterStatus) &&
    (filterCat === 'All' || r.category === filterCat) &&
    (
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter?.name?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const buildCsvRow = (row) => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const text = String(value).replace(/"/g, '""');
      return `"${text}"`;
    };

    return [
      row._id,
      row.title,
      row.reporter?.name,
      row.reporter?.email,
      row.category,
      row.location,
      row.status,
      row.priority,
      row.createdAt ? new Date(row.createdAt).toLocaleString() : '',
    ].map(escapeCsv).join(',');
  };

  const exportFilteredReports = () => {
    const headers = ['Report ID', 'Title', 'Reporter', 'Reporter Email', 'Category', 'Location', 'Status', 'Priority', 'Created At'];
    const rows = [headers.join(',')];
    filtered.forEach((report) => rows.push(buildCsvRow(report)));

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reports_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          color: 'var(--brand-800)',
          margin: '0 0 4px',
        }}>All Reports</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>
          View and manage all maintenance reports ({filtered.length} of {reports.length} reports)
        </p>
      </div>

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
          onClick={exportFilteredReports}
          style={{
            background: 'var(--green-600)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          disabled={filtered.length === 0}
        >
          📄 Export CSV
        </button>
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
              {['#', 'Title', 'Reporter', 'Category', 'Location', 'Status', 'Priority', 'Date', 'Actions'].map((h) => (
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
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)', fontSize: 12 }}>
                  {r.reporter?.name || 'Unknown'}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>{r.category}</td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-500)', fontSize: 12 }}>{r.location}</td>
                <td style={{ padding: '12px 16px' }}>
                  {userRole === 'admin' ? (
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 8px',
                        fontSize: 12,
                        background: statusBg(r.status),
                        color: statusText(r.status),
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <Badge text={r.status} color={statusText(r.status)} bg={statusBg(r.status)} />
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Badge text={r.priority} color={priorityColor(r.priority)} bg={priorityBg(r.priority)} />
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontSize: 12 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDeleteReport(r._id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--red-300)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 8px',
                        fontSize: 11,
                        color: 'var(--red-600)',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--red-50)';
                        e.target.style.borderColor = 'var(--red-400)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'var(--red-300)';
                      }}
                    >
                      🗑 Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{
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