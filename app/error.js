'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>문제가 발생했습니다 😢</h2>
      <p>{error?.message}</p>
      <button
        style={{ marginTop: 20, padding: '8px 16px', borderRadius: 8, background: '#8B4513', color: '#fff' }}
        onClick={() => reset()}
      >
        새로고침
      </button>
    </div>
  );
} 