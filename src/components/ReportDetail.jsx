import { useState, useEffect } from 'react';
import { statusBg, statusText, priorityColor, priorityBg } from '../utils/helpers';
import { updateReport, deleteReport, getReportById } from '../utils/api';
import Badge from '../components/Badge';

export default function ReportDetail({ report, onBack, onUpdate, onDelete, showActions = true }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: report.title,
    category: report.category,
    location: report.location,
    description: report.description,
    priority: report.priority,
    status: report.status,
  });

  useEffect(() => {
    setEditForm({
      title: report.title,
      category: report.category,
      location: report.location,
      description: report.description,
      priority: report.priority,
      status: report.status,
    });
  }, [report]);

  const [updateText, setUpdateText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!editForm.title.trim() || !editForm.category || !editForm.location.trim() || !editForm.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = { ...editForm };
      const trimmedUpdate = updateText.trim();
      if (trimmedUpdate) {
        payload.update = trimmedUpdate;
      }

      console.log('Sending update payload:', payload);
      const updated = await updateReport(report._id, payload);
      console.log('Update response:', updated);

      const latestReport = await getReportById(report._id);
      console.log('Latest report from server:', latestReport);

      const finalReport = latestReport || updated;
      if (onUpdate) onUpdate(finalReport);

      setEditForm({
        title: finalReport.title,
        category: finalReport.category,
        location: finalReport.location,
        description: finalReport.description,
        priority: finalReport.priority,
        status: finalReport.status,
      });
      setIsEditing(false);
      setUpdateText('');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteReport(report._id);
      if (onDelete) onDelete(report._id);
    } catch (error) {
      alert('Failed to delete report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const setEditValue = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '7px 16px',
            fontSize: 13,
            color: 'var(--gray-600)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back
        </button>

        {showActions && (
          <div style={{ display: 'flex', gap: 8 }}>
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background: 'var(--brand-600)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '7px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    background: 'var(--red-600)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '7px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  disabled={loading}
                  style={{
                    background: 'var(--brand-600)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '7px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '7px 16px',
                    fontSize: 13,
                    color: 'var(--gray-600)',
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

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
          {isEditing ? (
            <input
              value={editForm.title}
              onChange={(e) => setEditValue('title', e.target.value)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                color: 'var(--gray-900)',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                width: '100%',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          ) : (
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              color: 'var(--brand-800)',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {report.title}
            </h2>
          )}

          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Badge text={report.priority} color={priorityColor(report.priority)} bg={priorityBg(report.priority)} />
            <Badge text={report.status} color={statusText(report.status)} bg={statusBg(report.status)} />
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
              Category
            </label>
            {isEditing ? (
              <select
                value={editForm.category}
                onChange={(e) => setEditValue('category', e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: 14,
                  color: 'var(--gray-900)',
                  background: 'var(--surface-alt)',
                  outline: 'none',
                }}
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Structural">Structural</option>
                <option value="Heating">Heating</option>
                <option value="IT / Network">IT / Network</option>
                <option value="Furniture">Furniture</option>
                <option value="Vandalism">Vandalism</option>
              </select>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--gray-800)' }}>{report.category}</div>
            )}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
              Location
            </label>
            {isEditing ? (
              <input
                value={editForm.location}
                onChange={(e) => setEditValue('location', e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: 14,
                  color: 'var(--gray-900)',
                  background: 'var(--surface-alt)',
                  outline: 'none',
                }}
              />
            ) : (
              <div style={{ fontSize: 14, color: 'var(--gray-800)' }}>{report.location}</div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
            Description
          </label>
          {isEditing ? (
            <textarea
              value={editForm.description}
              onChange={(e) => setEditValue('description', e.target.value)}
              rows={4}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-900)',
                background: 'var(--surface-alt)',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          ) : (
            <div style={{ fontSize: 14, color: 'var(--gray-800)', lineHeight: 1.5 }}>{report.description}</div>
          )}
        </div>

        {/* Update Text (when editing) */}
        {isEditing && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
              Update Note (Optional)
            </label>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Add a note about what changed..."
              rows={2}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-900)',
                background: 'var(--surface-alt)',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Updates History */}
        {report.updates && report.updates.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, display: 'block' }}>
              Update History
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.updates.map((update, index) => (
                <div key={index} style={{
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 16px',
                }}>
                  <div style={{ fontSize: 13, color: 'var(--gray-700)', marginBottom: 4 }}>
                    {update.text}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                    {new Date(update.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div style={{
          borderTop: '1px solid var(--gray-200)',
          paddingTop: 16,
          fontSize: 12,
          color: 'var(--gray-400)',
        }}>
          <div>Submitted on {new Date(report.createdAt).toLocaleString()}</div>
          {report.reporter && (
            <div>By {report.reporter.name} ({report.reporter.email})</div>
          )}
        </div>
      </div>
    </div>
  );
}