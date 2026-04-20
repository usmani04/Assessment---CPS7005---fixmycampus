import { useState, useEffect } from 'react';
import { getAnalytics } from '../utils/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#3B82F6',
  '#059669',
  '#F59E0B',
  '#10B981',
  '#8B5CF6',
  '#EF4444',
  '#6B7280',
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Card({ title, children, height = '400px' }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        color: 'var(--brand-800)',
        margin: '0 0 18px',
        fontWeight: 700,
      }}>{title}</h3>
      <div style={{ width: '100%', height: height }}>
        {children}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '28px 32px', textAlign: 'center' }}>
        <div>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '28px 32px', textAlign: 'center', color: 'var(--red-600)' }}>
        <div>Error loading analytics: {error}</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div style={{ padding: '28px 32px', textAlign: 'center' }}>
        <div>No analytics data available</div>
      </div>
    );
  }

  const { byCategory, byStatus, byMonth, hotspots } = analyticsData;

  const catCounts = byCategory.map((item, index) => ({
    name: item._id,
    count: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const maxCat = Math.max(...catCounts.map(c => c.count), 1);

  const statusBreakdown = byStatus.map((item, index) => ({
    label: item._id,
    count: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const totalStatus = statusBreakdown.reduce((sum, item) => sum + item.count, 0);
  statusBreakdown.forEach(item => {
    item.pct = Math.round((item.count / totalStatus) * 100);
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendData = byMonth.map(item => ({
    month: monthNames[item._id.month - 1] + ' ' + item._id.year.toString().slice(-2),
    count: item.count,
    fullMonth: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`
  })).sort((a, b) => a.fullMonth.localeCompare(b.fullMonth));

  const maxTrend = Math.max(...trendData.map(d => d.count), 1);

  const hotspotData = hotspots.map((item, index) => ({
    name: item._id,
    count: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const categoryChartData = byCategory.map((item, index) => ({
    name: item._id,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const statusChartData = byStatus.map((item, index) => ({
    name: item._id,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const lineChartData = trendData.map(item => ({
    month: item.month,
    reports: item.count
  }));

  const areaChartData = trendData.map(item => ({
    month: item.month,
    reports: item.count
  }));

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 18,
        marginBottom: 28
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--brand-600)', marginBottom: 4 }}>
            {byCategory.reduce((sum, item) => sum + item.count, 0)}
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>Total Reports</div>
        </div>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#059669', marginBottom: 4 }}>
            {byStatus.find(s => s._id === 'Resolved')?.count || 0}
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>Resolved</div>
        </div>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>
            {byStatus.find(s => s._id === 'In Progress')?.count || 0}
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>In Progress</div>
        </div>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>
            {byStatus.find(s => s._id === 'New')?.count || 0}
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray-600)' }}>New Reports</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

        <Card title="Reports by Category" height="350px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Report Trend" height="350px">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

        <Card title="Status Breakdown" height="350px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Cumulative Report Trend" height="350px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                }}
              />
              <Area
                type="monotone"
                dataKey="reports"
                stroke="#8B5CF6"
                fill="url(#colorReports)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
        <Card title="Top Report Locations (Hotspots)" height="auto">
          {hotspotData.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: 'var(--gray-500)',
              fontSize: 16
            }}>
              No hotspot data available
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {hotspotData.map((location, index) => {
                const totalReports = hotspotData.reduce((sum, loc) => sum + loc.count, 0);
                const percentage = Math.round((location.count / totalReports) * 100);
                const medalEmoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index] || '*️⃣';
                
                return (
                  <div
                    key={location.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '16px',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
                  >
                    <div style={{
                      fontSize: 28,
                      minWidth: '50px',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}>
                      {medalEmoji}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--gray-800)',
                        marginBottom: 6,
                      }}>
                        {location.name}
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: 'var(--gray-200)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%',
                            backgroundColor: location.color,
                            width: `${percentage}%`,
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <span style={{
                          fontSize: 12,
                          color: 'var(--gray-600)',
                          fontWeight: 500,
                          minWidth: '35px',
                        }}>
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      minWidth: '60px',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: location.color,
                      }}>
                        {location.count}
                      </div>
                      <div style={{
                        fontSize: 11,
                        color: 'var(--gray-600)',
                        fontWeight: 500,
                      }}>
                        reports
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
