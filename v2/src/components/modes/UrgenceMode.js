'use client';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_PATIENTS, HISTORY_TYPES, formatDate } from '@/data/mockData';

const BodyViewer3D = dynamic(() => import('@/components/BodyViewer3D').then(m => ({ default: m.BodyViewer3D })), { ssr: false });

const patient = MOCK_PATIENTS[0];

/* ── SVG ICONS ── */
const ICN = {
    warn: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    ecg: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    doc: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>,
    heart: <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    user: <svg style={{ width: 32, height: 32 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    ai: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    send: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    msgCircle: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
};

function RegionDetail({ regionKey }) {
    const region = patient.bodyRegions[regionKey];
    if (!region) return null;
    const sevBadge = { critical: 'badge-critical', warning: 'badge-warning', caution: 'badge-neutral', stable: 'badge-success', info: 'badge-info' };
    const sevLabels = { critical: 'Critique', warning: 'Attention', caution: 'Surveillance', stable: 'Stable', info: 'Info' };
    return (
        <div className="region-card">
            <div className="region-card-title">
                <span className={`severity-dot ${region.severity === 'caution' ? 'warning' : region.severity}`} />
                {region.label}
                <span className={`badge ${sevBadge[region.severity] || 'badge-neutral'}`}>{sevLabels[region.severity]}</span>
            </div>
            {region.conditions.length > 0 && (<div className="region-card-body" style={{ marginTop: 8 }}><ul>{region.conditions.map((c, i) => <li key={i}>{c}</li>)}</ul></div>)}
            {region.medications?.length > 0 && (<div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>{region.medications.map((m, i) => <span key={i} className="tag">{m}</span>)}</div>)}
        </div>
    );
}

/* ── AI CHATBOT FOR URGENCE ── */
function UrgenceChatbot() {
    const [messages, setMessages] = useState([
        { role: 'system', text: `Assistant IA — Mode Urgence. Patient: ${patient.firstName} ${patient.lastName}, ${patient.age} ans. Groupe sanguin: ${patient.bloodType}. Allergies: ${patient.allergies.join(', ')}. Je suis pret a repondre a vos questions.' }` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const quickActions = [
        'Resume critique du patient',
        'Allergies et contre-indications',
        'Interactions medicamenteuses',
        'Protocole HTA urgente'
    ];

    const handleSend = (text) => {
        const q = text || input;
        if (!q.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: q }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            let response = '';
            if (q.toLowerCase().includes('resume') || q.toLowerCase().includes('critique')) {
                response = `RESUME CRITIQUE — ${patient.firstName} ${patient.lastName}\n\nPatient de ${patient.age} ans, ${patient.sex}\nGroupe sanguin: ${patient.bloodType}\n\nALLERGIES MAJEURES:\n${patient.allergies.map(a => `  - ${a}`).join('\n')}\n\nPATHOLOGIES ACTIVES:\n${patient.conditions.map(c => `  - ${c.name} (${c.severity}) — ${c.details}`).join('\n')}\n\nINTERACTIONS CRITIQUES:\n${patient.interactions.map(i => `  - ${i.drugs.join(' + ')}: ${i.risk}`).join('\n')}\n\nMEDICAMENTS EN COURS: ${patient.medications.length}\nContact urgence: ${patient.emergencyContact}`;
            } else if (q.toLowerCase().includes('allergi') || q.toLowerCase().includes('contre-indication')) {
                response = `ALLERGIES CONNUES:\n${patient.allergies.map(a => `  - ${a}`).join('\n')}\n\nCONTRE-INDICATIONS ABSOLUES:\n  - Penicilline et derives (amoxicilline, ampicilline)\n  - Sulfamides et derives\n  - Attention aux cephalosporines (allergie croisee possible ~10%)\n\nMEDICAMENTS A EVITER:\n  - Anti-inflammatoires: Ibuprofene (interaction Amlodipine)\n  - Gliclazide pendant Ramadan (risque hypo x7.5)`;
            } else if (q.toLowerCase().includes('interaction')) {
                response = `INTERACTIONS MEDICAMENTEUSES IDENTIFIEES:\n\n${patient.interactions.map(i => `[${i.severity.toUpperCase()}] ${i.drugs.join(' + ')}\n  Risque: ${i.risk}\n  Source: ${i.source}`).join('\n\n')}\n\nRECOMMANDATION: Surveillance renforcee de la frequence cardiaque (Amlodipine + Bisoprolol).`;
            } else if (q.toLowerCase().includes('protocole') || q.toLowerCase().includes('hta')) {
                response = `PROTOCOLE HTA URGENTE — Patient hypertendu stade 2\n\n1. Mesurer TA en position couchee et debout\n2. TA actuelle connue: 155/95 mmHg\n3. Traitement en cours: Amlodipine 10mg, Bisoprolol 5mg\n4. ATTENTION: Interaction Amlodipine + Bisoprolol (bradycardie)\n5. Surveiller FC — Ne pas descendre sous 50 bpm\n6. Si TA > 180/120: Nicardipine IV (attention allergies)\n7. ECG de controle recommande\n\nRappel: Allergies Penicilline et Sulfamides.`;
            } else {
                response = `Analyse en cours pour "${q}"...\n\nBasee sur le dossier de ${patient.firstName} ${patient.lastName}:\n- ${patient.conditions.length} pathologies actives identifiees\n- ${patient.medications.length} medicaments en cours\n- ${patient.interactions.length} interactions a surveiller\n\nPour une analyse plus precise, precisez votre question ou utilisez les raccourcis proposes.\n\nLa decision medicale finale revient au praticien.`;
            }
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="card" style={{ animation: 'fadeInUp 0.5s ease both', display: 'flex', flexDirection: 'column', height: 400 }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border-default)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ICN.ai} Assistant IA — Urgence
                </h3>
                <span className="badge badge-info">Local</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '8px 12px',
                        borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: msg.role === 'user' ? 'var(--primary-600)' : msg.role === 'system' ? 'var(--severity-info-bg)' : 'var(--neutral-100)',
                        color: msg.role === 'user' ? 'white' : 'var(--text-secondary)',
                        border: msg.role === 'system' ? '1px solid var(--severity-info-border)' : 'none',
                        fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                        fontFamily: msg.role === 'ai' ? "'IBM Plex Mono', monospace" : 'inherit'
                    }}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '8px 16px', background: 'var(--neutral-100)', borderRadius: '12px 12px 12px 2px', fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ animation: 'pulse 1s ease infinite' }}>Analyse en cours...</span>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '6px 12px', display: 'flex', gap: 4, flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)' }}>
                {quickActions.map((qa, i) => (
                    <button key={i} className="pill" style={{ fontSize: 10, padding: '3px 8px' }} onClick={() => handleSend(qa)}>{qa}</button>
                ))}
            </div>

            {/* Input */}
            <div style={{ padding: 8, borderTop: '1px solid var(--border-default)', display: 'flex', gap: 8 }}>
                <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, height: 36, fontSize: 12 }}
                    placeholder="Question rapide sur le patient..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-primary btn-sm" onClick={() => handleSend()} style={{ height: 36, width: 36, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {ICN.send}
                </button>
            </div>
        </div>
    );
}

export default function UrgenceMode() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [vitals, setVitals] = useState({ ta_sys: '', ta_dia: '', pouls: '', spo2: '', temp: '' });

    const urgentHistory = [...patient.history]
        .sort((a, b) => {
            const priority = { urgence: 0, operation: 1 };
            const pA = priority[a.type] ?? 2;
            const pB = priority[b.type] ?? 2;
            if (pA !== pB) return pA - pB;
            return b.date.localeCompare(a.date);
        })
        .slice(0, 6);

    return (
        <div className="fade-in" style={{ minHeight: 'calc(100vh - 60px)' }}>
            {/* CRITICAL BANNER */}
            <div style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
                borderBottom: '2px solid var(--severity-critical-border)',
                padding: '16px 24px', animation: 'fadeInUp 0.3s ease both'
            }}>
                <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, var(--severity-critical) 0%, #991b1b 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 20, color: 'white', boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
                        }}>YA</div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700 }}>Youssef El Amrani</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'IBM Plex Mono', monospace" }}>PAT-2024-00147 — 58 ans, Homme</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div style={{ padding: '10px 20px', borderRadius: 'var(--radius-lg)', background: '#dc2626', color: 'white', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(220,38,38,0.4)', animation: 'pulse 2s ease infinite' }}>
                            {ICN.heart} Gr. sanguin : A+
                        </div>
                        <div style={{ padding: '10px 20px', borderRadius: 'var(--radius-lg)', background: '#dc2626', color: 'white', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 12px rgba(220,38,38,0.4)', animation: 'pulse 2s ease infinite', animationDelay: '0.3s' }}>
                            {ICN.warn} Allergies : Penicilline, Sulfamides
                        </div>
                    </div>
                    <button className="btn btn-lg" style={{ background: 'white', color: 'var(--severity-critical)', border: '2px solid var(--severity-critical)', fontWeight: 600, gap: 8 }}>
                        {ICN.doc} Protocole rapide
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                    {/* LEFT COLUMN */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Interactions */}
                        <div style={{ animation: 'fadeInUp 0.4s ease both' }}>
                            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--severity-critical)' }}>
                                {ICN.warn} Interactions medicamenteuses critiques
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {patient.interactions.map((inter, i) => (
                                    <div key={i} className={`alert alert-${inter.severity}`}>
                                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                        <div><div className="alert-title">{inter.drugs.join(' + ')}</div><div className="alert-text">{inter.risk}</div><div className="source-tag" style={{ marginTop: 4 }}>Source : {inter.source}</div></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Conditions */}
                        <div className="card" style={{ animation: 'fadeInUp 0.5s ease both' }}>
                            <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600 }}>Conditions actives</h3><span className="badge badge-critical">{patient.conditions.length} pathologies</span></div>
                            <div style={{ padding: 0 }}>
                                <table className="data-table"><thead><tr><th>Condition</th><th>Depuis</th><th>Detail</th><th>Statut</th></tr></thead>
                                    <tbody>{patient.conditions.map((c, i) => (<tr key={i}><td style={{ fontWeight: 500 }}>{c.name}</td><td className="text-mono">{c.since}</td><td style={{ fontSize: 12 }}>{c.details}</td><td><span className={`badge badge-${c.severity}`}>{c.severity === 'critical' ? 'Critique' : 'Attention'}</span></td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>

                        {/* Medications */}
                        <div className="card" style={{ animation: 'fadeInUp 0.6s ease both' }}>
                            <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600 }}>Medicaments en cours</h3><span className="badge badge-neutral">{patient.medications.length}</span></div>
                            <div style={{ padding: 0 }}>
                                <table className="data-table"><thead><tr><th>Medicament</th><th>Posologie</th><th>Indication</th></tr></thead>
                                    <tbody>{patient.medications.map((m, i) => (<tr key={i}><td style={{ fontWeight: 500 }}>{m.name}</td><td>{m.dosage}</td><td>{m.purpose}</td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>

                        {/* Vitals */}
                        <div className="card" style={{ animation: 'fadeInUp 0.7s ease both' }}>
                            <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: 'var(--severity-critical)' }}>{ICN.ecg}</span> Indicateurs vitaux</h3></div>
                            <div className="card-body">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                                    {[
                                        { key: 'ta_sys', label: 'TA Sys', unit: 'mmHg', placeholder: '120' },
                                        { key: 'ta_dia', label: 'TA Dia', unit: 'mmHg', placeholder: '80' },
                                        { key: 'pouls', label: 'Pouls', unit: 'bpm', placeholder: '72' },
                                        { key: 'spo2', label: 'SpO2', unit: '%', placeholder: '98' },
                                        { key: 'temp', label: 'Temp.', unit: 'C', placeholder: '37.2' }
                                    ].map(v => (
                                        <div key={v.key} className="form-group">
                                            <label className="form-label" style={{ textAlign: 'center' }}>{v.label}</label>
                                            <div style={{ position: 'relative' }}>
                                                <input type="text" className="form-input" style={{ width: '100%', textAlign: 'center', fontWeight: 600, fontSize: 18, height: 48 }} placeholder={v.placeholder} value={vitals[v.key]} onChange={e => setVitals(prev => ({ ...prev, [v.key]: e.target.value }))} />
                                                <span style={{ position: 'absolute', right: 8, bottom: -16, fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{v.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div style={{ animation: 'fadeInUp 0.8s ease both' }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Evenements recents (urgences prioritaires)</h3>
                            <div className="timeline">
                                {urgentHistory.map((entry, i) => {
                                    const typeInfo = HISTORY_TYPES[entry.type] || { label: entry.type, color: 'info' };
                                    return (
                                        <div key={i} className="timeline-item" style={{ animationDelay: `${i * 50}ms` }}>
                                            <div className={`timeline-dot ${typeInfo.color}`}><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                                            <div className="timeline-content">
                                                <div className="timeline-date">{formatDate(entry.date)}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}><div className="timeline-title">{entry.title}</div><span className={`badge badge-${typeInfo.color}`}>{typeInfo.label}</span></div>
                                                <div className="timeline-meta">{entry.doctor} — {entry.hospital}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{entry.details}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: 3D + Chatbot */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* 3D Viewer */}
                        <div style={{
                            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                            borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)',
                            height: 400, position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.4s ease both'
                        }}>
                            <Suspense fallback={<div className="skeleton" style={{ width: '100%', height: '100%' }} />}>
                                <BodyViewer3D onRegionSelect={setSelectedRegion} regions={patient.bodyRegions} />
                            </Suspense>
                            <div style={{ position: 'absolute', top: 12, left: 12, padding: '6px 12px', background: 'rgba(220,38,38,0.9)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: 11, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', backdropFilter: 'blur(6px)' }}>Mode urgence — Cliquez sur une zone</div>
                        </div>

                        {/* Region Detail */}
                        <div className="card" style={{ animation: 'fadeInUp 0.5s ease both' }}>
                            <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600 }}>{selectedRegion ? patient.bodyRegions[selectedRegion]?.label || 'Region' : 'Selectionnez une zone anatomique'}</h3></div>
                            <div className="card-body">
                                {!selectedRegion && (
                                    <div className="empty-state" style={{ padding: 20 }}>
                                        <div style={{ width: 32, height: 32, margin: '0 auto 8px', opacity: 0.3 }}>{ICN.user}</div>
                                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cliquez sur le modele 3D pour afficher les details.</p>
                                    </div>
                                )}
                                {selectedRegion && <RegionDetail regionKey={selectedRegion} />}
                            </div>
                        </div>

                        {/* AI Chatbot */}
                        <UrgenceChatbot />

                        {/* Quick Info */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, animation: 'fadeInUp 0.6s ease both' }}>
                            <div className="card" style={{ padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Contact urgence</div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{patient.emergencyContact}</div>
                            </div>
                            <div className="card" style={{ padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Morphologie</div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>Taille : {patient.height} — Poids : {patient.weight}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
