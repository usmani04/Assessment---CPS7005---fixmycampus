import { DUMMY_REPORTS as REPORTS } from '../data/reports';
import { CATEGORIES } from '../constants';

const catCounts = CATEGORIES
  .filter((c) => c !== 'All')
  .map((c) => ({ name: c, count: REPORTS.filter((r) => r.category === c).length }))
  .filter((c) => c.count > 0)
  .sort((a, b) => b.count - a.count);

const maxCat = Math.max(...catCounts.map((c) => c.count));

const trendData = [
  { month: 'Jan', count: 3 },
  { month: 'Feb', count: 5 },
  { month: 'Mar', count: 4 },
  { month: 'Apr', count: 8 },
  { month: 'May', count: 6 },
  { month: 'Jun', count: 2 },
];
const maxTrend = Math.max(...trendData.map((d) => d.count));

const hotspots = [
  { name: 'Block C',        count: 3, color: 'var(--brand-500)' },
  { name: 'Library',        count: 2, color: 'var(--amber-500)' },
  { name: 'Science Block',  count: 2, color: 'var(--blue-600)'  },
  { name: 'Main Building',  count: 1, color: 'var(--gray-500)'  },
];

const statusBreakdown = [
  { label: 'New',         count: 3, pct: 37, color: 'var(--blue-600)'  },
  { label: 'In Progress', count: 3, pct: 37, color: 'var(--amber-500)' },
  { label: 'Resolved',    count: 2, pct: 26, color: 'var(--brand-500)' },
];

function Card({ title, children }) {
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
      {children}
    </div>
  );
}

export default function Analytics() {
  return (
    <div style={{ padding: '28px 32px' }}>

      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

        {/* Category bar chart */}
        <Card title="Reports by Category">
          {catCounts.map((c) => (
            <div key={c.name} style={{ marginBottom: 14 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                marginBottom: 5,
                color: 'var(--gray-600)',
              }}>
                <span>{c.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-600)' }}>{c.count}</span>
              </div>
              <div style={{
                background: 'var(--brand-100)',
                borderRadius: 6,
                height: 8,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: 6,
                  background: 'linear-gradient(90deg, var(--brand-600), var(--brand-400))',
                  width: `${(c.count / maxCat) * 100}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Monthly trend bar chart */}
        <Card title="Monthly Report Trend">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 10,
            height: 150,
            paddingBottom: 24,
            position: 'relative',
          }}>
            {trendData.map((d) => (
              <div key={d.month} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                height: '100%',
                justifyContent: 'flex-end',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-600)' }}>
                  {d.count}
                </span>
                <div style={{
                  width: '100%',
                  borderRadius: '5px 5px 0 0',
                  background: d.month === 'Apr'
                    ? 'var(--brand-600)'
                    : 'var(--brand-200)',
                  height: `${(d.count / maxTrend) * 110}px`,
                  transition: 'height 0.5s ease',
                }} />
                <span style={{
                  fontSize: 11,
                  position: 'absolute',
                  bottom: 0,
                  fontWeight: d.month === 'Apr' ? 700 : 400,
                  color: d.month === 'Apr' ? 'var(--brand-600)' : 'var(--gray-400)',
                }}>{d.month}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Hotspot locations */}
        <Card title="Hotspot Locations">
          {hotspots.map((h, i) => (
            <div key={h.name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '10px 0',
              borderBottom: i < hotspots.length - 1 ? '1px solid var(--gray-100)' : 'none',
            }}>
              <div style={{
                width: 30, height: 30,
                borderRadius: '50%',
                background: 'var(--brand-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--brand-600)',
                border: '1px solid var(--brand-200)',
              }}>#{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--gray-700)' }}>
                  {h.name}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--gray-400)' }}>
                  {h.count} report{h.count !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: h.color,
                background: 'var(--brand-50)',
                padding: '4px 10px',
                borderRadius: 20,
              }}>{h.count}</div>
            </div>
          ))}
        </Card>

        {/* Status breakdown */}
        <Card title="Status Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {statusBreakdown.map((s) => (
              <div key={s.label}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  marginBottom: 6,
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--gray-700)' }}>
                    <span style={{
                      width: 10, height: 10,
                      borderRadius: '50%',
                      background: s.color,
                      display: 'inline-block',
                    }} />
                    {s.label}
                  </span>
                  <span style={{ color: 'var(--gray-500)', fontWeight: 500 }}>
                    {s.count} <span style={{ color: 'var(--gray-400)' }}>({s.pct}%)</span>
                  </span>
                </div>
                <div style={{
                  background: 'var(--gray-100)',
                  borderRadius: 6,
                  height: 10,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 6,
                    background: s.color,
                    width: `${s.pct}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 22,
            background: 'var(--brand-50)',
            border: '1px solid var(--brand-100)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: 13,
            color: 'var(--brand-700)',
            lineHeight: 1.6,
          }}>
            📈 <strong>Insight:</strong> 33% more reports filed this month compared to March.
          </div>
        </Card>
      </div>
    </div>
  );
}
