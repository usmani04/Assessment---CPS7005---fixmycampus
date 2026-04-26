import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../utils/api';

export default function Users({ userRole = 'admin' }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    setShowCreateForm(true);
    setEditingUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowCreateForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser._id, userData);
        setUsers(prev => prev.map(u => u._id === editingUser._id ? updated : u));
      } else {
        const created = await createUser(userData);
        setUsers(prev => [...prev, created]);
      }
      setShowCreateForm(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to save user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    (filterRole === 'All' || user.role === filterRole) &&
    (user.name.toLowerCase().includes(search.toLowerCase()) ||
     user.email.toLowerCase().includes(search.toLowerCase()) ||
     user.department?.toLowerCase().includes(search.toLowerCase()))
  );

  const buildCsvRow = (row) => {
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const text = String(value).replace(/"/g, '""');
      return `"${text}"`;
    };

    return [
      row._id,
      row.name,
      row.email,
      row.role,
      row.department || '',
      row.studentId || '',
      row.createdAt ? new Date(row.createdAt).toLocaleString() : '',
    ].map(escapeCsv).join(',');
  };

  const exportFilteredUsers = () => {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Department', 'Student ID', 'Created At'];
    const rows = [headers.join(',')];
    filteredUsers.forEach((user) => rows.push(buildCsvRow(user)));

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `users_export_${new Date().toISOString().slice(0,10)}.csv`);
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
        }}>User Management</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>
          Create, update, and manage user accounts ({filteredUsers.length} of {users.length} users)
        </p>
      </div>

      {/* Filters and Actions */}
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
          placeholder="🔍 Search by name, email, or department…"
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
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
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
          <option value="All">All Roles</option>
          <option value="student">Students</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>
        <button
          onClick={exportFilteredUsers}
          style={{
            background: 'var(--green-600)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          disabled={filteredUsers.length === 0}
        >
          📄 Export CSV
        </button>
        <button
          onClick={handleCreateUser}
          style={{
            background: 'var(--brand-600)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ➕ Create User
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => { setShowCreateForm(false); setEditingUser(null); }}
        />
      )}

      {/* Users Table */}
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
              {['Name', 'Email', 'Role', 'Department', 'Student ID', 'Created', 'Actions'].map((h) => (
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
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                style={{ borderBottom: '1px solid var(--gray-100)', transition: 'background 0.1s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 16px', color: 'var(--gray-800)', fontWeight: 500 }}>
                  {user.name}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)', fontSize: 12 }}>
                  {user.email}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    background: user.role === 'admin' ? 'var(--brand-100)' :
                               user.role === 'staff' ? 'var(--blue-100)' : 'var(--green-100)',
                    color: user.role === 'admin' ? 'var(--brand-700)' :
                           user.role === 'staff' ? 'var(--blue-700)' : 'var(--green-700)',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-600)' }}>
                  {user.department || '—'}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-500)', fontSize: 12 }}>
                  {user.studentId || '—'}
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--gray-400)', fontSize: 12 }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleEditUser(user)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--blue-300)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '4px 8px',
                        fontSize: 11,
                        color: 'var(--blue-600)',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'var(--blue-50)';
                        e.target.style.borderColor = 'var(--blue-400)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = 'var(--blue-300)';
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
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
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} style={{
                  padding: '48px',
                  textAlign: 'center',
                  color: 'var(--gray-400)',
                  fontSize: 14,
                }}>
                  {loading ? 'Loading users...' : 'No users match your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Form Component
function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'student',
    studentId: user?.studentId || '',
    department: user?.department || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in name and email fields');
      return;
    }
    if (!user && !formData.password) {
      alert('Password is required for new users');
      return;
    }
    onSave(formData);
  };

  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      marginBottom: 18,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 16,
        color: 'var(--brand-800)',
        margin: '0 0 16px',
      }}>
        {user ? 'Edit User' : 'Create New User'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gray-400)',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 6,
              display: 'block',
            }}>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setField('name', e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-800)',
                background: 'var(--surface-alt)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
          <div>
            <label style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gray-400)',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 6,
              display: 'block',
            }}>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-800)',
                background: 'var(--surface-alt)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gray-400)',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 6,
              display: 'block',
            }}>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setField('role', e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-800)',
                background: 'var(--surface-alt)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gray-400)',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 6,
              display: 'block',
            }}>Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setField('department', e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-800)',
                background: 'var(--surface-alt)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--gray-400)',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 6,
              display: 'block',
            }}>Student ID</label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setField('studentId', e.target.value)}
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                fontSize: 14,
                color: 'var(--gray-800)',
                background: 'var(--surface-alt)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 6,
            display: 'block',
          }}>Password {user ? '(leave empty to keep current)' : '*'}</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setField('password', e.target.value)}
            placeholder={user ? 'Enter new password or leave empty' : 'Enter password'}
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: 14,
              color: 'var(--gray-800)',
              background: 'var(--surface-alt)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            required={!user}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 16px',
              fontSize: 13,
              color: 'var(--gray-600)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              background: 'var(--brand-600)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {user ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}