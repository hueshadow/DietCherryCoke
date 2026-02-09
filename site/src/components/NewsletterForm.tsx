import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.status === 409) {
        setStatus('duplicate');
        return;
      }
      if (res.status === 429) {
        setStatus('error');
        setErrorMsg('Too many requests. Please try again later.');
        return;
      }
      if (!res.ok) throw new Error('Subscription failed');

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#22c55e22', border: '1px solid #22c55e44' }}>
        <p style={{ margin: 0, color: '#22c55e', fontSize: '14px', fontWeight: 500 }}>
          Thanks for subscribing! Check your inbox for a confirmation.
        </p>
      </div>
    );
  }

  if (status === 'duplicate') {
    return (
      <div style={{ padding: '12px 16px', borderRadius: '8px', background: '#3b82f622', border: '1px solid #3b82f644' }}>
        <p style={{ margin: 0, color: '#3b82f6', fontSize: '14px', fontWeight: 500 }}>
          You're already subscribed! We'll keep you updated.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
          placeholder="your@email.com"
          required
          style={{
            flex: 1, borderRadius: '6px', border: '1px solid #333',
            background: '#0a0a0a', padding: '8px 16px', fontSize: '14px',
            color: '#f5f5f5', outline: 'none',
          }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = '#e61e2b'; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = '#333'; }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          style={{
            borderRadius: '6px', border: 'none', background: '#e61e2b',
            padding: '8px 24px', fontSize: '14px', fontWeight: 500,
            color: 'white', cursor: status === 'loading' ? 'wait' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { if (status !== 'loading') (e.currentTarget as HTMLElement).style.background = '#ff2d3a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#e61e2b'; }}
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ margin: 0, color: '#ef4444', fontSize: '13px' }}>{errorMsg}</p>
      )}
    </form>
  );
}
