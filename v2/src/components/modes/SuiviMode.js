'use client';
import { useState } from 'react';
import { MOCK_PATIENTS, formatDate } from '@/data/mockData';

const patient = MOCK_PATIENTS[0];

/* ── SVG ICONS ── */
const ICN = {
    syringe: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>,
    heart: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    clipboard: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /></svg>,
    chart: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
    bell: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>,
    lock: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    unlock: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>,
    warn: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    ai: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    check: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,
    pill: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>,
    info: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
};

const GLYCEMIC_DATA = [
    { time: '06:00', value: 1.1 }, { time: '08:00', value: 1.8 }, { time: '10:00', value: 1.4 },
    { time: '12:00', value: 1.2 }, { time: '14:00', value: 2.1 }, { time: '16:00', value: 1.5 },
    { time: '18:00', value: 1.3 }, { time: '20:00', value: 1.9 }, { time: '22:00', value: 1.4 }
];

const CHECKLISTS = {
    diabete: {
        title: 'Diabete — Mesures hygieno-dietetiques', icon: ICN.syringe,
        items: [
            { text: 'Mesure glycemique a jeun', frequency: 'Quotidien', done: true },
            { text: 'Mesure glycemique post-prandiale', frequency: 'Quotidien', done: true },
            { text: 'Activite physique (30 min marche)', frequency: 'Quotidien', done: false },
            { text: 'Regime pauvre en sucres rapides', frequency: 'Quotidien', done: true },
            { text: 'Controle HbA1c', frequency: 'Trimestriel', done: false },
            { text: 'Examen ophtalmologique', frequency: 'Annuel', done: false },
            { text: 'Examen podologique', frequency: 'Annuel', done: true }
        ]
    },
    hta: {
        title: 'HTA — Suivi tensionnel', icon: ICN.heart,
        items: [
            { text: 'Mesure tension arterielle matin', frequency: 'Quotidien', done: true },
            { text: 'Mesure tension arterielle soir', frequency: 'Quotidien', done: false },
            { text: 'Regime pauvre en sel (< 6g/jour)', frequency: 'Quotidien', done: true },
            { text: 'Activite physique moderee', frequency: '3x/semaine', done: false },
            { text: 'Limitation alcool', frequency: 'Quotidien', done: true },
            { text: 'Controle creatinine', frequency: 'Semestriel', done: false }
        ]
    },
    general: {
        title: 'Suivi general', icon: ICN.clipboard,
        items: [
            { text: 'Prise medicaments matin', frequency: 'Quotidien', done: true },
            { text: 'Prise medicaments soir', frequency: 'Quotidien', done: true },
            { text: 'Pesee hebdomadaire', frequency: 'Hebdomadaire', done: false },
            { text: 'Journal alimentaire', frequency: 'Quotidien', done: false }
        ]
    }
};

function GlycemicChart() {
    const maxVal = Math.max(...GLYCEMIC_DATA.map(d => d.value));
    const minVal = Math.min(...GLYCEMIC_DATA.map(d => d.value));
    const height = 200;
    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height, justifyContent: 'space-between', borderBottom: '2px solid var(--border-default)', borderLeft: '2px solid var(--border-default)', paddingLeft: 8, paddingBottom: 4, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${((1.26 - minVal) / (maxVal - minVal)) * 100}%`, borderBottom: '1px dashed var(--severity-warning)', zIndex: 0 }}>
                    <span style={{ position: 'absolute', left: -40, top: -8, fontSize: 9, color: 'var(--severity-warning)' }}>1.26</span>
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${((0.7 - minVal) / (maxVal - minVal)) * 100}%`, borderBottom: '1px dashed var(--severity-success)', zIndex: 0 }}>
                    <span style={{ position: 'absolute', left: -40, top: -8, fontSize: 9, color: 'var(--severity-success)' }}>0.70</span>
                </div>
                {GLYCEMIC_DATA.map((d, i) => {
                    const h = ((d.value - minVal) / (maxVal - minVal)) * (height - 20);
                    const isHigh = d.value > 1.26;
                    const isLow = d.value < 0.7;
                    const color = isHigh ? 'var(--severity-critical)' : isLow ? 'var(--severity-warning)' : 'var(--severity-success)';
                    return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color, marginBottom: 4 }}>{d.value}</span>
                            <div style={{ width: 24, height: h, background: `linear-gradient(180deg, ${color} 0%, ${color}44 100%)`, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', boxShadow: isHigh ? `0 0 8px ${color}66` : 'none' }} />
                            <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{d.time}</span>
                        </div>
                    );
                })}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'center' }}>
                <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span className="severity-dot success" /> Normal</span>
                <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span className="severity-dot critical" /> Hyperglycemie</span>
                <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><span className="severity-dot warning" /> Hypoglycemie</span>
            </div>
        </div>
    );
}

export default function SuiviMode() {
    const [patientAccessUnlocked, setPatientAccessUnlocked] = useState(false);
    const [activeChecklists, setActiveChecklists] = useState(['diabete', 'hta']);

    const comparisons = [
        { metric: 'HbA1c', prev: '8.1%', current: '7.8%', trend: 'down', label: 'Amelioration' },
        { metric: 'TA systolique', prev: '160 mmHg', current: '150 mmHg', trend: 'down', label: 'Amelioration' },
        { metric: 'Poids', prev: '92 kg', current: '89 kg', trend: 'down', label: 'Perte' },
        { metric: 'LDL Cholesterol', prev: '1.6 g/L', current: '1.8 g/L', trend: 'up', label: 'Deterioration' },
        { metric: 'Creatinine', prev: '11 mg/L', current: '12 mg/L', trend: 'stable', label: 'Stable' }
    ];

    return (
        <div className="fade-in" style={{ minHeight: 'calc(100vh - 60px)', padding: 24 }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Patient Summary + Unlock */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="patient-photo" style={{ width: 44, height: 44, fontSize: 14 }}>YA</div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>{patient.firstName} {patient.lastName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{patient.id} — Suivi chronique</div>
                        </div>
                    </div>
                    <button className={`btn ${patientAccessUnlocked ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setPatientAccessUnlocked(!patientAccessUnlocked)} style={{ gap: 8 }}>
                        {patientAccessUnlocked ? ICN.unlock : ICN.lock}
                        {patientAccessUnlocked ? 'Acces patient actif' : 'Debloquer acces patient'}
                    </button>
                </div>

                {patientAccessUnlocked && (
                    <div className="alert alert-warning" style={{ marginBottom: 16, animation: 'fadeInUp 0.3s ease both' }}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        <div><div className="alert-title">Portail patient active</div><div className="alert-text">Le patient peut maintenant acceder a son suivi via le portail patient. Il recevra des notifications de rappel pour ses mesures.</div></div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* LEFT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="card" style={{ animation: 'fadeInUp 0.3s ease both' }}>
                            <div className="card-header">
                                <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.syringe} Cycle glycemique — Derniere saisie</h3>
                                <button className="btn btn-sm btn-secondary">+ Saisir valeurs</button>
                            </div>
                            <GlycemicChart />
                            <div className="card-footer">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Interpretation IA :</span>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--severity-warning)' }}>2 pics hyperglycemiques detectes (14h, 20h) — A titre indicatif</span>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ animation: 'fadeInUp 0.5s ease both' }}>
                            <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.chart} Comparaison entre visites</h3><span className="badge badge-info">vs derniere visite</span></div>
                            <div style={{ padding: 0 }}>
                                <table className="data-table"><thead><tr><th>Mesure</th><th>Precedent</th><th>Actuel</th><th>Evolution</th></tr></thead>
                                    <tbody>{comparisons.map((c, i) => (
                                        <tr key={i}><td style={{ fontWeight: 500 }}>{c.metric}</td><td className="text-mono">{c.prev}</td><td className="text-mono" style={{ fontWeight: 600 }}>{c.current}</td>
                                            <td><span className={`badge ${c.trend === 'up' ? 'badge-critical' : c.trend === 'down' ? 'badge-success' : 'badge-neutral'}`}>{c.label}</span></td>
                                        </tr>))}</tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card" style={{ animation: 'fadeInUp 0.6s ease both' }}>
                            <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.heart} Evolution tensionnelle</h3></div>
                            <div style={{ padding: 20 }}>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    {[
                                        { date: 'Jan 2025', sys: 160, dia: 100 },
                                        { date: 'Avr 2025', sys: 155, dia: 95 },
                                        { date: 'Jul 2025', sys: 152, dia: 94 },
                                        { date: 'Oct 2025', sys: 150, dia: 92 },
                                        { date: 'Jan 2026', sys: 150, dia: 92 }
                                    ].map((d, i) => (
                                        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                                <div style={{ height: 120, width: 24, background: 'var(--neutral-100)', borderRadius: 12, position: 'relative', overflow: 'hidden' }}>
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(d.sys / 200) * 100}%`, background: d.sys > 140 ? 'linear-gradient(180deg, var(--severity-critical) 0%, var(--severity-critical)44 100%)' : 'linear-gradient(180deg, var(--severity-success) 0%, var(--severity-success)44 100%)', borderRadius: '0 0 12px 12px', transition: 'height 0.6s ease' }} />
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 600 }}>{d.sys}/{d.dia}</span>
                                                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{d.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Checklists hygieno-dietetiques</h3>
                            <div className="pill-group">
                                {Object.entries(CHECKLISTS).map(([key, cl]) => (
                                    <button key={key} className={`pill ${activeChecklists.includes(key) ? 'active' : ''}`} onClick={() => setActiveChecklists(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])}>
                                        {cl.icon} {cl.title.split('—')[0].trim()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeChecklists.map(key => {
                            const cl = CHECKLISTS[key];
                            if (!cl) return null;
                            const doneCount = cl.items.filter(i => i.done).length;
                            return (
                                <div key={key} className="card" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                                    <div className="card-header">
                                        <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{cl.icon} {cl.title}</h3>
                                        <span className="badge badge-neutral">{doneCount}/{cl.items.length}</span>
                                    </div>
                                    <div style={{ padding: 0 }}>
                                        {cl.items.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', opacity: item.done ? 0.7 : 1 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: 'var(--radius-sm)', border: `2px solid ${item.done ? 'var(--severity-success)' : 'var(--border-default)'}`, background: item.done ? 'var(--severity-success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                                    {item.done && <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                                </div>
                                                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</div></div>
                                                <span className="badge badge-neutral">{item.frequency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="card" style={{ animation: 'fadeInUp 0.7s ease both' }}>
                            <div className="card-header">
                                <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.bell} Agent IA — Notifications</h3>
                                <span className="badge badge-info">Agentic AI</span>
                            </div>
                            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { type: 'warning', icon: ICN.warn, text: 'Pics hyperglycemiques repetes a 14h — suggerer ajustement repas midi', time: 'Il y a 2h' },
                                    { type: 'info', icon: ICN.pill, text: 'Rappel: controle HbA1c trimestriel non effectue depuis 4 mois', time: 'Il y a 1 jour' },
                                    { type: 'success', icon: ICN.check, text: 'Amelioration TA sur les 3 derniers mois — tendance positive', time: 'Il y a 3 jours' }
                                ].map((notif, i) => (
                                    <div key={i} style={{
                                        padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                        background: notif.type === 'warning' ? 'var(--severity-warning-bg)' : notif.type === 'success' ? 'var(--severity-success-bg)' : 'var(--severity-info-bg)',
                                        border: `1px solid ${notif.type === 'warning' ? 'var(--severity-warning-border)' : notif.type === 'success' ? 'var(--severity-success-border)' : 'var(--severity-info-border)'}`,
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: 12, flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>{notif.icon} {notif.text}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>{notif.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
