"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', padding: '24px', backgroundColor: 'var(--background)', color: 'var(--foreground)'
    }}>
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '24px' }} />
        <h2 style={{ marginBottom: '16px', fontSize: '24px' }}>Something went wrong!</h2>
        <p style={{ color: '#9ca3af', marginBottom: '32px' }}>
          We encountered an unexpected application error. This might be due to a poor network connection or a timeout from our AI servers.
        </p>
        <button
          onClick={() => reset()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '24px',
            background: 'var(--primary)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
