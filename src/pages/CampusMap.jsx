export default function CampusMap() {

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              color: 'var(--brand-800)',
              margin: '0 0 3px',
            }}>Campus Issue Map</h3>
            <p style={{ fontSize: 12, color: 'var(--gray-400)', margin: 0 }}>
              Explore the campus with live OpenStreetMap tiles and street-level detail.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            {[['New', '#2563EB'], ['In Progress', '#D97706'], ['Resolved', '#2A9D6A']].map(([s, c]) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--gray-500)' }}>
                <span style={{
                  width: 10, height: 10,
                  borderRadius: '50%',
                  background: c,
                  display: 'inline-block',
                }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* OpenStreetMap overview */}
        <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
          <iframe
            title="Campus map overview"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-0.3355%2C51.4495%2C-0.3305%2C51.4525&layer=mapnik&marker=51.4508%2C-0.3330"
            style={{ width: '100%', height: '100%', border: '0' }}
            allowFullScreen
            loading="lazy"
          />
          <div style={{
            position: 'absolute',
            left: 16,
            bottom: 16,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 14px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
            maxWidth: 320,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--brand-800)',
              marginBottom: 6,
            }}>OpenStreetMap Campus Overview</div>
            <div style={{ fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.6 }}>
              This overview is centered on St Mary’s University Twickenham, London. Zoom in or drag the map to explore the campus area.
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          padding: '11px 24px',
          background: 'var(--brand-50)',
          borderTop: '1px solid var(--border)',
          fontSize: 12,
          color: 'var(--brand-700)',
        }}>
          💡 The map overview now uses **OpenStreetMap** for live street tiles and campus context.
        </div>
      </div>
    </div>
  );
}
