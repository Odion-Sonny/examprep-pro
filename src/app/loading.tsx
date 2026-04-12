import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', width: '100vw', backgroundColor: 'var(--background)'
    }}>
      <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)', marginBottom: '16px' }} />
      <h2 style={{ color: 'var(--foreground)', fontSize: '20px', fontWeight: 500 }}>Configuring AI Assets...</h2>
    </div>
  );
}
