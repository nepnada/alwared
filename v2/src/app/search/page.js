'use client';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { RECENT_PATIENTS } from '@/data/mockData';

export default function SearchPage() {
    const router = useRouter();

    return (
        <>
            <Header showBackToSearch />
            <main className="fade-in-up" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Recherche Patient</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Entrez l&apos;identifiant du patient ou scannez son QR code</p>
                </div>

                {/* Search bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                    <div className="search-input-wrapper" style={{ flex: 1 }}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <input type="text" className="form-input form-input-lg" style={{ width: '100%' }} placeholder="Identifiant patient (ex: PAT-2024-00147)" />
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={() => router.push('/mode')}>Rechercher</button>
                </div>

                {/* QR scan */}
                <button onClick={() => router.push('/mode')} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                    width: '100%', padding: 20, background: 'var(--bg-card)',
                    border: '2px dashed var(--border-default)', borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    transition: 'all 200ms ease', marginBottom: 32
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-400)'; e.currentTarget.style.background = 'var(--primary-50)'; e.currentTarget.style.color = 'var(--primary-700)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                        <rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" />
                        <path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" />
                        <path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" />
                    </svg>
                    Scanner un QR code patient
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
                    color: 'var(--text-muted)', fontSize: 12
                }}>
                    <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                    Patients recents
                    <span style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
                </div>

                {/* Recent patients */}
                <div className="card">
                    {RECENT_PATIENTS.map((p, i) => (
                        <div key={p.id} className="patient-list-item" onClick={() => router.push('/mode')} style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="patient-list-avatar">{p.initials}</div>
                            <div className="patient-list-info">
                                <div className="patient-list-name">{p.name}</div>
                                <div className="patient-list-meta">{p.id} — {p.age} ans, {p.sex === 'H' ? 'Homme' : 'Femme'}</div>
                                {p.useCase && <div style={{ fontSize: 11, color: 'var(--primary-600)', fontWeight: 500, marginTop: 2 }}>{p.useCase}</div>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.lastVisit}</div>
                                <span className={`badge badge-${p.alertLevel}`}>
                                    {p.alerts > 0 ? `${p.alerts} alerte${p.alerts > 1 ? 's' : ''}` : 'Stable'}
                                </span>
                                {p.specialty && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{p.specialty}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="page-footer">
                SihhaTek v2.0 — Outil d&apos;aide a la decision — La decision revient au medecin traitant — Conformite Loi 09-08 (CNDP)
            </footer>
        </>
    );
}
