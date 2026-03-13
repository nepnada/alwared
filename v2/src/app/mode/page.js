'use client';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

const CHECK_ICON = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>;

const MODES = [
    {
        id: 'urgence', title: 'Urgence', className: 'urgence',
        desc: 'Acces rapide aux informations critiques d\'un patient inconscient ou non-communicant',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /><line x1="12" y1="2" x2="12" y2="5" /></svg>,
        features: ['Allergies et contre-indications en priorite', 'Interactions medicamenteuses critiques', 'Chatbot IA urgentiste integre']
    },
    {
        id: 'consultation', title: 'Consultation', className: 'consultation',
        desc: 'Consultation standard avec acces complet a l\'historique medical du patient',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>,
        features: ['Documents & IA (ECG, echo, radio)', 'Ordonnance QR code (pilote Kenitra)', 'Analyse IA du dossier']
    },
    {
        id: 'suivi', title: 'Suivi', className: 'suivi',
        desc: 'Suivi d\'un patient chronique avec visualisation des tendances',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
        features: ['Cycle glycemique avec interpretation IA', 'Checklists hygieno-dietetiques', 'Comparaison entre visites']
    },
    {
        id: 'transfert', title: 'Transfert', className: 'transfert',
        desc: 'Patient transfere d\'un autre etablissement, synthese inter-hospitaliere',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
        features: ['Selection securisee des donnees', 'Consentement patient (Loi 09-08)', 'QR code d\'acces temporaire']
    }
];

export default function ModePage() {
    const router = useRouter();

    return (
        <>
            <Header showBackToSearch />
            <main className="fade-in-up" style={{ maxWidth: 880, margin: '0 auto', padding: '40px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Selection du mode</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Choisissez le contexte de consultation pour adapter l&apos;interface</p>
                </div>

                {/* Patient summary */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                    background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)', marginBottom: 32
                }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-50)',
                        color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 15, flexShrink: 0
                    }}>YA</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>Youssef El Amrani</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PAT-2024-00147 — 58 ans, Homme — Groupe sanguin A+</div>
                    </div>
                    <span className="badge badge-critical">3 alertes actives</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => router.push('/search')}>
                        <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                        Changer
                    </button>
                </div>

                {/* Mode grid */}
                <div className="mode-grid">
                    {MODES.map((mode, i) => (
                        <div
                            key={mode.id}
                            className={`mode-card ${mode.className} card-interactive`}
                            onClick={() => router.push(`/dashboard?mode=${mode.id}`)}
                            style={{ animationDelay: `${i * 80}ms`, animation: 'fadeInUp 0.5s ease both' }}
                        >
                            <div className="mode-card-top">
                                <div className="mode-card-icon">{mode.icon}</div>
                                <div>
                                    <h3>{mode.title}</h3>
                                    <p>{mode.desc}</p>
                                </div>
                            </div>
                            <div className="features">
                                {mode.features.map((f, j) => (
                                    <div key={j} className="feature-item">{CHECK_ICON} {f}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="page-footer">
                Alwarid v2.0 — Outil d&apos;aide a la decision — La decision revient au medecin traitant — Conformite Loi 09-08 (CNDP)
            </footer>
        </>
    );
}
