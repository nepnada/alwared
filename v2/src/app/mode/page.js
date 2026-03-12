'use client';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

const CHECK_ICON = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>;

const MODES = [
    {
        id: 'urgence', title: 'Urgence', className: 'urgence',
        desc: 'Acces rapide aux informations critiques d\'un patient inconscient ou non-communicant',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5" /><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
        features: ['Allergies et contre-indications en priorite', 'Interactions medicamenteuses critiques', 'Conditions chroniques et traitements en cours']
    },
    {
        id: 'consultation', title: 'Consultation', className: 'consultation',
        desc: 'Consultation standard avec acces complet a l\'historique medical du patient',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>,
        features: ['Historique medical complet', 'Imagerie et documents', 'Saisie de nouvelles observations']
    },
    {
        id: 'suivi', title: 'Suivi', className: 'suivi',
        desc: 'Suivi d\'un patient chronique avec visualisation des tendances',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
        features: ['Evolution des marqueurs biologiques', 'Adherence au traitement', 'Alertes de suivi personnalisees']
    },
    {
        id: 'transfert', title: 'Transfert', className: 'transfert',
        desc: 'Patient transfere d\'un autre etablissement, synthese inter-hospitaliere',
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M18 8L22 12L18 16" /><path d="M2 12H22" /></svg>,
        features: ['Resume du dossier de transfert', 'Continuite des soins', 'Comparaison inter-etablissements']
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
                SihhaTek v2.0 — Outil d&apos;aide a la decision — La decision revient au medecin traitant — Conformite Loi 09-08 (CNDP)
            </footer>
        </>
    );
}
