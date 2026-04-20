import { useState, useEffect } from 'react';
import { statusBg, statusText, priorityColor, priorityBg } from '../utils/helpers';
import { updateReport, deleteReport, getReportById } from '../utils/api';
import Badge from '../components/Badge';

const CATEGORIES = ['Electrical', 'Plumbing', 'Structural', 'Heating', 'IT / Network', 'Furniture', 'Vandalism'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const STATUSES   = ['New', 'In Progress', 'Resolved'];

export default function ReportDetail({
  report,
  onBack,
  onUpdate,
  onDelete,
  showActions = true,
  userRole = 'student',
}) {
  const [isEditing,  setIsEditing]  = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [editForm,   setEditForm]   = useState({
    title:       report.title,
    category:    report.category,
    location:    report.location,
    description: report.description,
    priority:    report.priority,
    status:      report.status,
  });

  useEffect(() => {
    setEditForm({
      title:       report.title,
      category:    report.category,
      location:    report.location,
      description: report.description,
      priority:    report.priority,
      status:      report.status,
    });
  }, [report._id]);

  const setField = (key, val) => setEditForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!editForm.title.trim() || !editForm.category || !editForm.location.trim() || !editForm.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const payload = { ...editForm };
      if (updateText.trim()) payload.update = updateText.trim();

      await updateReport(report._id, payload);

      const fresh = await getReportById(report._id);

      if (onUpdate) onUpdate(fresh);
      setIsEditing(false);
      setUpdateText('');
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) return;
    try {
      setLoading(true);
      await deleteReport(report._id);
      if (onDelete) onDelete(report._id);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:        '100%',
    border:       '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding:      '8px 12px',
    fontSize:     14,
    color:        'var(--gray-800)',
    background:   'var(--surface-alt)',
    outline:      'none',
    fontFamily:   'var(--font-body)',
    boxSizing:    'border-box',
  };

  const labelStyle = {
    fontSize:        11,
    fontWeight:      700,
    color:           'var(--gray-400)',
    textTransform:   'uppercase',
    letterSpacing:   0.8,
    marginBottom:    6,
    display:         'block',
  };

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Top action bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          style={{
            background:   'transparent',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding:      '7px 16px',
            fontSize:     13,
            color:        'var(--gray-600)',
            cursor:       'pointer',
          }}
        >
          ← Back
        </button>

        {showActions && (
          <>
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    background:   'var(--brand-600)',
                    color:        '#fff',
                    border:       'none',
                    borderRadius: 'var(--radius-md)',
                    padding:      '7px 18px',
                    fontSize:     13,
                    fontWeight:   600,
                    cursor:       'pointer',
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  style={{
                    background:   '#DC2626',
                    color:        '#fff',
                    border:       'none',
                    borderRadius: 'var(--radius-md)',
                    padding:      '7px 18px',
                    fontSize:     13,
                    fontWeight:   600,
                    cursor:       loading ? 'not-allowed' : 'pointer',
                    opacity:      loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Deleting…' : '🗑 Delete'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    background:   'var(--brand-600)',
                    color:        '#fff',
                    border:       'none',
                    borderRadius: 'var(--radius-md)',
                    padding:      '7px 18px',
                    fontSize:     13,
                    fontWeight:   600,
                    cursor:       loading ? 'not-allowed' : 'pointer',
                    opacity:      loading ? 0.7 : 1,
                  }}
                >
                  {loading ? 'Saving…' : '✅ Save Changes'}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setUpdateText(''); }}
                  style={{
                    background:   'transparent',
                    border:       '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding:      '7px 18px',
                    fontSize:     13,
                    color:        'var(--gray-600)',
                    cursor:       'pointer',
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Card */}
      <div style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding:      '32px 36px',
        maxWidth:     700,
        boxShadow:    'var(--shadow-sm)',
      }}>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 12 }}>
          {isEditing ? (
            <input
              value={editForm.title}
              onChange={(e) => setField('title', e.target.value)}
              style={{ ...inputStyle, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}
            />
          ) : (
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--brand-800)', margin: 0, lineHeight: 1.3 }}>
              {report.title}
            </h2>
          )}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Badge text={report.priority} color={priorityColor(report.priority)} bg={priorityBg(report.priority)} />
            <Badge text={report.status}   color={statusText(report.status)}      bg={statusBg(report.status)} />
          </div>
        </div>

        {/* Category + Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Category</label>
            {isEditing ? (
              <select value={editForm.category} onChange={(e) => setField('category', e.target.value)} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--gray-800)' }}>{report.category}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            {isEditing ? (
              <input value={editForm.location} onChange={(e) => setField('location', e.target.value)} style={inputStyle} />
            ) : (
              <div style={{ fontSize: 14, color: 'var(--gray-800)' }}>{report.location}</div>
            )}
          </div>
        </div>

        {/* Priority + Status (status only for staff/admin) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Priority</label>
            {isEditing ? (
              <select value={editForm.priority} onChange={(e) => setField('priority', e.target.value)} style={inputStyle}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            ) : (
              <div style={{ fontSize: 14, color: 'var(--gray-800)' }}>{report.priority}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            {isEditing && ['staff', 'admin'].includes(userRole) ? (
              <select value={editForm.status} onChange={(e) => setField('status', e.target.value)} style={inputStyle}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            ) : (
              <div style={{ marginTop: 4 }}>
                <Badge text={report.status} color={statusText(report.status)} bg={statusBg(report.status)} />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Description</label>
          {isEditing ? (
            <textarea
              value={editForm.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          ) : (
            <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.75, margin: 0 }}>
              {report.description}
            </p>
          )}
        </div>

        {/* Optional update note (shown only while editing) */}
        {isEditing && (
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Update Note (optional)</label>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder="Add a note about what changed, e.g. 'Replaced faulty part'…"
              rows={2}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
              This note will be saved in the update history below.
            </p>
          </div>
        )}

        {/* Update history */}
        {report.updates && report.updates.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Update History</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {report.updates.map((u, i) => (
                <div key={i} style={{
                  background:   'var(--brand-50)',
                  border:       '1px solid var(--brand-100)',
                  borderRadius: 'var(--radius-md)',
                  padding:      '12px 16px',
                }}>
                  {/* FIX: use u.message not u.text */}
                  <div style={{ fontSize: 13, color: 'var(--gray-700)', marginBottom: 4 }}>
                    {u.message}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                    {u.updatedBy?.name && <span>{u.updatedBy.name} · </span>}
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop:  '1px solid var(--border)',
          paddingTop: 14,
          fontSize:   12,
          color:      'var(--gray-400)',
          display:    'flex',
          flexDirection: 'column',
          gap: 3,
        }}>
          <span>Submitted {report.createdAt ? new Date(report.createdAt).toLocaleString() : '—'}</span>
          {report.reporter?.name && (
            <span>By {report.reporter.name} ({report.reporter.email})</span>
          )}
        </div>
      </div>
    </div>
  );
}
