// Global loading skeleton — shown while client-side store hydrates from localStorage
export default function Loading() {
  return (
    <div className="page-container" style={{ paddingTop: '2rem' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '1rem',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        {/* Header skeleton */}
        <div style={{ height: 44, width: '40%', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }} />
        <div style={{ height: 20, width: '25%', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }} />

        {/* Cards skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 100, background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>

        {/* Content skeleton */}
        <div style={{ height: 280, background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', marginTop: '0.5rem' }} />
      </div>
    </div>
  );
}
