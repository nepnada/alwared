'use client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    router.push('/search');
  };

  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 25% 25%, var(--primary-700) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--primary-700) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="page-center" style={{ background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f0f9ff 100%)' }}>
        <div className="fade-in-up">
          <div className="login-card">
            <div className="login-header">
              <img src="/logo.png" alt="Alwarid" style={{ height: 180, marginBottom: 8 }} />
              <p>Know the Patient in Seconds</p>
              <div style={{ marginTop: 16 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', background: 'var(--neutral-50)',
                  border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-full)',
                  fontSize: 12, color: 'var(--text-secondary)'
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: 'var(--primary-600)' }}>
                    <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9h1" /><path d="M9 13h1" /><path d="M9 17h1" />
                  </svg>
                  CHU Hassan II — Fes
                </span>
              </div>
            </div>
            <form className="login-body" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Identifiant medecin</label>
                <div style={{ position: 'relative' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }}>
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" className="form-input" style={{ width: '100%', paddingLeft: 40 }} placeholder="Ex: DR-00421" defaultValue="DR-00421" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'var(--text-muted)' }}>
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type="password" className="form-input" style={{ width: '100%', paddingLeft: 40 }} placeholder="Entrer le mot de passe" defaultValue="password123" />
                </div>
                <a href="#" style={{ fontSize: 12, color: 'var(--primary-700)', textAlign: 'right', display: 'block', marginTop: 'var(--space-1)' }}>Mot de passe oublie ?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 4 }}>
                Se connecter
              </button>
            </form>
            <div className="login-footer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, display: 'inline', verticalAlign: 'middle', marginRight: 4, color: 'var(--severity-warning)' }}>
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
              </svg>
              Outil d&apos;aide a la decision — La decision revient au medecin traitant
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
            Alwarid v2.0 — Region Fes-Meknes — Conformite Loi 09-08 (CNDP)
          </p>
        </div>
      </div>
    </>
  );
}
