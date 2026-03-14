'use client';
import { useState } from 'react';
import { MOCK_PATIENTS } from '@/data/mockData';

const patient = MOCK_PATIENTS[0];

/* ── SVG ICONS ── */
const ICN = {
    syringe: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>,
    chart: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
    check: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,
    pill: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>,
    drop: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>,
    warn: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    ai: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    lock: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    unlock: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>,
};

/* ── Glycemic data: today's cycle ── */
const TODAY_CYCLE = [
    { time: '06:00', value: 1.10, label: 'A jeun' },
    { time: '08:30', value: 1.82, label: 'Post petit-dej' },
    { time: '12:30', value: 1.20, label: 'Pre-dejeuner' },
    { time: '14:00', value: 2.10, label: 'Post-dejeuner' },
    { time: '18:30', value: 1.25, label: 'Pre-diner' },
    { time: '20:30', value: 1.90, label: 'Post-diner' },
];

/* ── Chart ── */
function GlycemicChart() {
    const range = { min: 0.5, max: 2.5 }; // Fixed scale so bars are proportional
    const barAreaH = 160;
    return (
        <div style={{ padding: '20px 20px 12px' }}>
            {/* Y-axis labels */}
            <div style={{ display: 'flex', gap: 0 }}>
                {/* Left scale */}
                <div style={{ width: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: barAreaH, paddingRight: 6, textAlign: 'right' }}>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>2.5</span>
                    <span style={{ fontSize: 9, color: 'var(--severity-critical)', fontWeight: 600 }}>1.26</span>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>0.5</span>
                </div>
                {/* Bars area */}
                <div style={{ flex: 1, height: barAreaH, borderLeft: '2px solid var(--border-default)', borderBottom: '2px solid var(--border-default)', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 8px' }}>
                    {/* Threshold line at 1.26 */}
                    <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${((1.26 - range.min) / (range.max - range.min)) * 100}%`, borderBottom: '2px dashed var(--severity-critical)', zIndex: 0 }} />
                    {TODAY_CYCLE.map((d, i) => {
                        const pct = ((d.value - range.min) / (range.max - range.min)) * 100;
                        const barH = Math.max(4, (pct / 100) * barAreaH);
                        const isHigh = d.value > 1.26;
                        const color = isHigh ? '#dc2626' : '#2563eb';
                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, width: 36 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>{d.value.toFixed(2)}</span>
                                <div style={{ width: 24, height: barH, background: `linear-gradient(180deg, ${color} 0%, ${color}55 100%)`, borderRadius: '4px 4px 0 0' }} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* X-axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginLeft: 36, marginTop: 6 }}>
                {TODAY_CYCLE.map((d, i) => (
                    <div key={i} style={{ textAlign: 'center', width: 36 }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{d.time}</div>
                        <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{d.label}</div>
                    </div>
                ))}
            </div>
            {/* Legend */}
            <div style={{ marginTop: 12, display: 'flex', gap: 20, justifyContent: 'center' }}>
                <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#2563eb', display: 'inline-block' }} /> Normal</span>
                <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#dc2626', display: 'inline-block' }} /> Hyperglycemie (&gt;1.26)</span>
            </div>
        </div>
    );
}

export default function SuiviMode() {
    const [patientAccessUnlocked, setPatientAccessUnlocked] = useState(false);

    return (
        <div className="fade-in" style={{ minHeight: 'calc(100vh - 80px)', padding: 24 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Patient header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="patient-photo" style={{ width: 44, height: 44, fontSize: 14 }}>YA</div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{patient.firstName} {patient.lastName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.id} — Suivi glycemique — Diabete Type 2</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge badge-critical">HbA1c: 7.3%</span>
                        <button className={`btn ${patientAccessUnlocked ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setPatientAccessUnlocked(!patientAccessUnlocked)} style={{ gap: 8 }}>
                            {patientAccessUnlocked ? ICN.unlock : ICN.lock}
                            {patientAccessUnlocked ? 'Portail actif' : 'Debloquer portail patient'}
                        </button>
                    </div>
                </div>

                {patientAccessUnlocked && (
                    <div className="alert alert-warning" style={{ marginBottom: 16, animation: 'fadeInUp 0.3s ease both' }}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        <div><div className="alert-title">Portail patient active</div><div className="alert-text">Le patient peut saisir ses glycemies depuis chez lui. Rappels automatiques par SMS.</div></div>
                    </div>
                )}

                {/* 3 KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                    <div className="card" style={{ padding: 20, animation: 'fadeInUp 0.2s ease both' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ color: 'var(--severity-success)' }}>{ICN.drop}</div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Glycemie a jeun (moy.)</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--severity-success)' }}>1.10 g/L</div>
                    </div>
                    <div className="card" style={{ padding: 20, animation: 'fadeInUp 0.3s ease both' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ color: 'var(--severity-critical)' }}>{ICN.syringe}</div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Post-prandiale (moy.)</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--severity-critical)' }}>1.76 g/L</div>
                    </div>
                    <div className="card" style={{ padding: 20, animation: 'fadeInUp 0.4s ease both' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <div style={{ color: 'var(--severity-warning)' }}>{ICN.chart}</div>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>HbA1c actuelle</span>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--severity-warning)' }}>7.3%</div>
                        <div style={{ fontSize: 10, color: 'var(--severity-success)', marginTop: 4 }}>↓ -1.2% en 12 mois</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* LEFT: Glycemic chart */}
                    <div className="card" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                        <div className="card-header">
                            <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.syringe} Cycle glycemique — Aujourd'hui</h3>
                        </div>
                        <GlycemicChart />
                        <div style={{ padding: '8px 20px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>[AIDE IA]</span>
                            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--severity-warning)' }}>Pics post-prandiaux a 14h et 20h30 — Suggerer ajustement repas</span>
                        </div>
                    </div>

                    {/* RIGHT: Checklist + Treatment */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Checklist du jour */}
                        <div className="card" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                            <div className="card-header">
                                <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.check} Suivi du jour</h3>
                                <span className="badge badge-info">5/7</span>
                            </div>
                            <div style={{ padding: 0 }}>
                                {[
                                    { text: 'Glycemie a jeun', done: true, val: '1.10 g/L', sev: 'success' },
                                    { text: 'Glycemie post-prandiale', done: true, val: '2.10 g/L', sev: 'critical' },
                                    { text: 'Gliclazide 60mg (matin)', done: true, val: 'Pris', sev: 'success' },
                                    { text: 'Metformine 1000mg (midi)', done: true, val: 'Pris', sev: 'success' },
                                    { text: 'Metformine 1000mg (soir)', done: false, val: 'En attente', sev: 'neutral' },
                                    { text: 'Activite physique 30min', done: false, val: 'Non fait', sev: 'warning' },
                                    { text: 'Hydratation 1.5L', done: true, val: '1.8L', sev: 'success' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${item.done ? 'var(--severity-success)' : 'var(--border-default)'}`, background: item.done ? 'var(--severity-success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                                            {item.done && <svg style={{ width: 10, height: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                        </div>
                                        <div style={{ flex: 1, fontSize: 13 }}>{item.text}</div>
                                        <span className={`badge badge-${item.sev}`}>{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Alert */}
                        <div style={{ padding: '12px 16px', background: 'var(--severity-warning-bg)', border: '1px solid var(--severity-warning-border)', borderRadius: 'var(--radius-md)', fontSize: 12, display: 'flex', alignItems: 'flex-start', gap: 8, animation: 'fadeInUp 0.5s ease both' }}>
                            {ICN.ai}
                            <div>
                                <strong>[AIDE IA]</strong> Hyperglycemie post-prandiale &gt;2.0 g/L detectee 3x cette semaine. Revoir apport glucidique du dejeuner. Prochain controle HbA1c dans 2 mois.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
