'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GymTracker] Uncaught error:', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3rem' }}>⚠️</div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Có lỗi xảy ra</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
        {error.message || 'Đã xảy ra lỗi không mong đợi. Vui lòng thử lại.'}
      </p>
      <button
        className="btn btn-primary"
        onClick={reset}
        style={{ marginTop: '0.5rem' }}
      >
        Thử lại
      </button>
    </div>
  );
}
