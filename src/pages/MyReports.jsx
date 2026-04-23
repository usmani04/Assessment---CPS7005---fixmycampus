import { useState, useEffect } from 'react';
import { statusBg, statusText, priorityColor, priorityBg } from '../utils/helpers';
import { getMyReports } from '../utils/api';
import Badge from '../components/Badge';
import ReportDetail from '../components/ReportDetail';

export default function MyReports({ selectedReport, onClearReport, onUpdateSelectedReport, userRole = 'student' }) {
  const [reports, setReports] = useState([]);
  const [detail, setDetail] = useState(selectedReport || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedReport) {
      setDetail(selectedReport);
    }
  }, [selectedReport]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReport = async (updatedReport) => {
    setReports(prev => prev.map(r => r._id === updatedReport._id ? updatedReport : r));
    setDetail(updatedReport);
    if (onUpdateSelectedReport) onUpdateSelectedReport(updatedReport);
    await fetchReports();
  };

  const handleDeleteReport = (deletedId) => {
    setReports(prev => prev.filter(r => r._id !== deletedId));
    setDetail(null);
    if (onClearReport) onClearReport();
  };

  const viewReport = detail;

  if (viewReport) {
    return (
      <ReportDetail
        report={viewReport}
        onBack={() => { setDetail(null); if (onClearReport) onClearReport(); }}
        onUpdate={handleUpdateReport}
        onDelete={handleDeleteReport}
        userRole={userRole}
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
          Showing your {reports.length} submission{reports.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {reports.length === 0 ? (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--gray-500)',
          }}>
            {loading ? 'Loading reports...' : 'No reports submitted yet'}
          </div>
        ) : (
          reports.map((r) => (
            <div
              key={r._id}
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
                <span>{r.category}</span>
                <span>{r.location}</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
