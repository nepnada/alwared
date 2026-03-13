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

function RegionDetail({ regionKey, onViewScan }) {
    const region = patient.bodyRegions[regionKey];
    if (!region) return null;
    const sevBadge = { critical: 'badge-critical', warning: 'badge-warning', caution: 'badge-neutral', stable: 'badge-success', info: 'badge-info' };
    const sevLabels = { critical: 'Critique', warning: 'Attention', caution: 'Surveillance', stable: 'Stable', info: 'Info' };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className={`severity-dot ${region.severity === 'caution' ? 'warning' : region.severity}`} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{region.label}</span>
                <span className={`badge ${sevBadge[region.severity] || 'badge-neutral'}`}>{sevLabels[region.severity]}</span>
            </div>

            {/* Conditions */}
            {region.conditions.length > 0 && (
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 6 }}>Conditions</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.8 }}>
                        {region.conditions.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
            )}

            {/* Scans / Imagerie */}
            {region.scans?.length > 0 && (
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--primary-700)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {ICN.doc} Examens & Imagerie ({region.scans.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {region.scans.map((scan, i) => (
                            <div key={i} style={{ padding: '8px 10px', background: 'var(--neutral-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: 12 }}>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {scan.image && (
                                        <div onClick={() => onViewScan && onViewScan(scan)} style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', flexShrink: 0, border: '1px solid var(--border-default)' }}>
                                            <img src={scan.image} alt={scan.type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {scan.type}
                                            {scan.image && <span className="badge badge-info" style={{ fontSize: 9, cursor: 'pointer' }} onClick={() => onViewScan && onViewScan(scan)}>Voir image</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, color: 'var(--text-muted)', fontSize: 11, flexWrap: 'wrap' }}>
                                            <span>{formatDate(scan.date)}</span>
                                            <span>{scan.lab}</span>
                                            <span>{scan.doctor}</span>
                                        </div>
                                        <div style={{ marginTop: 3, fontSize: 11, color: 'var(--text-secondary)' }}>{scan.result}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Operations */}
            {region.operations?.length > 0 && (
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--severity-warning)', marginBottom: 6 }}>Chirurgies</div>
                    {region.operations.map((op, i) => (
                        <div key={i} style={{ padding: '6px 10px', background: 'var(--severity-warning-bg)', border: '1px solid var(--severity-warning-border)', borderRadius: 'var(--radius-md)', fontSize: 12, marginBottom: 4 }}>
                            <div style={{ fontWeight: 600 }}>{op.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(op.date)} — {op.hospital} — {op.surgeon}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Medications */}
            {region.medications?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {region.medications.map((m, i) => <span key={i} className="tag">{m}</span>)}
                </div>
            )}

            {/* Notes */}
            {region.notes && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-subtle)', paddingTop: 8 }}>{region.notes}</div>
            )}
        </div>
    );
}

/* ── AI CHATBOT FOR URGENCE ── */
function UrgenceChatbot() {
    const [messages, setMessages] = useState([
        { role: 'system', text: `Assistant IA — Mode Urgence. Patient: ${patient.firstName} ${patient.lastName}, ${patient.age} ans. Groupe sanguin: ${patient.bloodType}. Allergies: ${patient.allergies.join(', ')}. Je reponds a partir du dossier patient uniquement.` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState('');

    const quickActions = [
        'Resume critique du patient',
        'Allergies et contre-indications',
        'Interactions medicamenteuses',
        'Protocole HTA urgente'
    ];

    const handleSend = async (text) => {
        const q = text || input;
        if (!q.trim() || isTyping) return;
        setMessages(prev => [...prev, { role: 'user', text: q }]);
        setInput('');
        setIsTyping(true);
        setStreamingText('');

        try {
            const { buildPatientContext } = await import('@/data/prompts');
            const { SYSTEM_PROMPTS } = await import('@/data/prompts');
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt: SYSTEM_PROMPTS.URGENCE_CHATBOT,
                    userMessage: q,
                    patientContext: buildPatientContext(patient)
                })
            });

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                // API key not set or error — fall back to local
                throw new Error('fallback');
            }

            // Stream SSE response
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const data = line.slice(6).trim();
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            fullText += parsed.content;
                            setStreamingText(fullText);
                        }
                    } catch { }
                }
            }
            setMessages(prev => [...prev, { role: 'ai', text: fullText || 'Pas de reponse.' }]);
        } catch {
            // Fallback local (pas de cle API)
            const fallback = generateLocalResponse(q);
            // Typing animation
            for (let i = 0; i <= fallback.length; i += 3) {
                await new Promise(r => setTimeout(r, 8));
                setStreamingText(fallback.slice(0, i));
            }
            setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
        }
        setStreamingText('');
        setIsTyping(false);
    };

    const generateLocalResponse = (q) => {
        if (q.toLowerCase().includes('resume') || q.toLowerCase().includes('critique')) {
            return `RESUME CRITIQUE — ${patient.firstName} ${patient.lastName}\n\nPatient de ${patient.age} ans, ${patient.sex}\nGroupe sanguin: ${patient.bloodType}\n\nALLERGIES MAJEURES:\n${patient.allergies.map(a => `  - ${a}`).join('\n')}\n\nPATHOLOGIES ACTIVES:\n${patient.conditions.map(c => `  - ${c.name} (${c.severity}) — ${c.details}`).join('\n')}\n\nINTERACTIONS CRITIQUES:\n${patient.interactions.map(i => `  - ${i.drugs.join(' + ')}: ${i.risk}`).join('\n')}\n\nMEDICAMENTS EN COURS: ${patient.medications.length}\nContact urgence: ${patient.emergencyContact}\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('allergi') || q.toLowerCase().includes('contre-indication')) {
            return `ALLERGIES CONNUES:\n${patient.allergies.map(a => `  - ${a}`).join('\n')}\n\nCONTRE-INDICATIONS ABSOLUES:\n  - Penicilline et derives (amoxicilline, ampicilline)\n  - Sulfamides et derives\n  - Attention cephalosporines (allergie croisee ~10%)\n\nMEDICAMENTS A EVITER:\n  - Ibuprofene (interaction Amlodipine)\n  - Gliclazide pendant Ramadan (risque hypo x7.5)\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('interaction')) {
            return `INTERACTIONS MEDICAMENTEUSES:\n\n${patient.interactions.map(i => `[${i.severity.toUpperCase()}] ${i.drugs.join(' + ')}\n  Risque: ${i.risk}\n  Source: ${i.source}`).join('\n\n')}\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('protocole') || q.toLowerCase().includes('hta')) {
            return `PROTOCOLE HTA URGENTE\n\n1. TA connue: 155/95 mmHg\n2. Traitement: Amlodipine 10mg, Bisoprolol 5mg\n3. ATTENTION: Interaction→bradycardie\n4. Surveiller FC (ne pas descendre sous 50 bpm)\n5. Si TA >180/120: Nicardipine IV\n6. ECG de controle recommande\n7. Allergies: Penicilline, Sulfamides\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        }
        return `Dossier de ${patient.firstName} ${patient.lastName}:\n- ${patient.conditions.length} pathologies actives\n- ${patient.medications.length} medicaments\n- ${patient.interactions.length} interactions\n- Allergies: ${patient.allergies.join(', ')}\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
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
                    <div style={{ alignSelf: 'flex-start', padding: '8px 16px', background: 'var(--neutral-100)', borderRadius: '12px 12px 12px 2px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: "'IBM Plex Mono', monospace", maxWidth: '85%' }}>
                        {streamingText || <span style={{ animation: 'pulse 1s ease infinite', color: 'var(--text-muted)' }}>Analyse en cours...</span>}
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
    const [vitalsSaved, setVitalsSaved] = useState(false);
    const [vitalsAlert, setVitalsAlert] = useState(null);
    const [showProtocole, setShowProtocole] = useState(false);
    const [viewingScan, setViewingScan] = useState(null);

    const checkVitals = () => {
        const alerts = [];
        const v = vitals;
        if (v.ta_sys && Number(v.ta_sys) > 140) alerts.push(`TA systolique elevee: ${v.ta_sys} mmHg (>140)`);
        if (v.ta_dia && Number(v.ta_dia) > 90) alerts.push(`TA diastolique elevee: ${v.ta_dia} mmHg (>90)`);
        if (v.pouls && Number(v.pouls) < 50) alerts.push(`Bradycardie: ${v.pouls} bpm (<50) — Attention interaction Amlodipine+Bisoprolol`);
        if (v.pouls && Number(v.pouls) > 100) alerts.push(`Tachycardie: ${v.pouls} bpm (>100)`);
        if (v.spo2 && Number(v.spo2) < 95) alerts.push(`Desaturation: SpO2 ${v.spo2}% (<95)`);
        if (v.temp && Number(v.temp) > 38) alerts.push(`Fievre: ${v.temp}C (>38)`);
        if (v.temp && Number(v.temp) < 35) alerts.push(`Hypothermie: ${v.temp}C (<35)`);
        setVitalsAlert(alerts.length > 0 ? alerts : null);
        setVitalsSaved(true);
    };

    const isAbnormal = (key) => {
        const v = vitals[key];
        if (!v) return false;
        const n = Number(v);
        if (key === 'ta_sys') return n > 140 || n < 90;
        if (key === 'ta_dia') return n > 90 || n < 60;
        if (key === 'pouls') return n < 50 || n > 100;
        if (key === 'spo2') return n < 95;
        if (key === 'temp') return n > 38 || n < 35;
        return false;
    };

    const allHistory = patient.history;
    const urgentHistory = allHistory
        .filter(e => e.type === 'urgence' || e.type === 'operation')
        .sort((a, b) => b.date.localeCompare(a.date));
    const filteredOut = allHistory.length - urgentHistory.length;

    return (
        <div className="fade-in" style={{ minHeight: 'calc(100vh - 60px)' }}>
            {/* PROTOCOLE RAPIDE MODAL */}
            {showProtocole && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowProtocole(false)}>
                    <div className="card fade-in" style={{ width: 650, maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div className="card-header" style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 1 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--severity-critical)' }}>Protocole Rapide</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowProtocole(false)}><svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></button>
                        </div>
                        <div className="card-body">
                            <pre style={{ fontSize: 12, lineHeight: 1.8, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap' }}>{`PROTOCOLE RAPIDE — URGENCE
${'='.repeat(40)}
Date: ${new Date().toLocaleString('fr-FR')}

PATIENT: ${patient.firstName} ${patient.lastName}
ID: ${patient.id} | Age: ${patient.age} ans | Sexe: ${patient.sex}
GROUPE SANGUIN: ${patient.bloodType}

[!!!] ALLERGIES: ${patient.allergies.join(', ')}

CONSTANTES ACTUELLES:
  TA: ${vitals.ta_sys || '___'}/${vitals.ta_dia || '___'} mmHg
  Pouls: ${vitals.pouls || '___'} bpm
  SpO2: ${vitals.spo2 || '___'}%
  Temperature: ${vitals.temp || '___'}C

PATHOLOGIES ACTIVES:
${patient.conditions.map(c => `  [${c.severity.toUpperCase()}] ${c.name} — ${c.details}`).join('\n')}

MEDICAMENTS EN COURS:
${patient.medications.map(m => `  ${m.name} — ${m.dosage}`).join('\n')}

INTERACTIONS CRITIQUES:
${patient.interactions.map(i => `  [!] ${i.drugs.join(' + ')}: ${i.risk}`).join('\n')}

CONTACT URGENCE: ${patient.emergencyContact}

${'='.repeat(40)}
Genere par Alwarid — Outil d'aide a la decision`}</pre>
                        </div>
                        <div className="card-footer" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary" onClick={() => window.print()}>Imprimer</button>
                            <button className="btn btn-primary" onClick={() => setShowProtocole(false)}>Fermer</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SCAN IMAGE LIGHTBOX */}
            {viewingScan && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setViewingScan(null)}>
                    <div className="fade-in" style={{ maxWidth: 700, width: '90%', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '60vh' }}>
                            <img src={viewingScan.image} alt={viewingScan.type} style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain' }} />
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{viewingScan.type}</h3>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        <span>{formatDate(viewingScan.date)}</span>
                                        <span>{viewingScan.lab}</span>
                                        <span>{viewingScan.doctor}</span>
                                    </div>
                                    <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>{viewingScan.result}</div>
                                </div>
                                <button className="btn btn-ghost btn-icon" onClick={() => setViewingScan(null)}>
                                    <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    <button className="btn btn-lg" style={{ background: 'white', color: 'var(--severity-critical)', border: '2px solid var(--severity-critical)', fontWeight: 600, gap: 8 }} onClick={() => setShowProtocole(true)}>
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
                                                <input type="text" className="form-input" style={{ width: '100%', textAlign: 'center', fontWeight: 600, fontSize: 18, height: 48, borderColor: isAbnormal(v.key) ? 'var(--severity-critical)' : vitals[v.key] ? 'var(--severity-success)' : undefined, boxShadow: isAbnormal(v.key) ? '0 0 0 2px rgba(220,38,38,0.2)' : undefined }} placeholder={v.placeholder} value={vitals[v.key]} onChange={e => { setVitals(prev => ({ ...prev, [v.key]: e.target.value })); setVitalsSaved(false); }} />
                                                <span style={{ position: 'absolute', right: 8, bottom: -16, fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{v.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8, alignItems: 'center' }}>
                                <button className={`btn btn-sm ${vitalsSaved ? 'btn-secondary' : 'btn-primary'}`} onClick={checkVitals} style={{ gap: 6 }}>
                                    {vitalsSaved ? 'Enregistre' : 'Enregistrer les constantes'}
                                </button>
                                {vitalsSaved && !vitalsAlert && <span className="badge badge-success">Constantes normales</span>}
                            </div>
                            {vitalsAlert && vitalsSaved && (
                                <div className="alert alert-critical" style={{ margin: '0 16px 16px' }}>
                                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                    <div><div className="alert-title">Alertes detectees</div>{vitalsAlert.map((a, i) => <div key={i} className="alert-text">{a}</div>)}</div>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="card" style={{ animation: 'fadeInUp 0.8s ease both' }}>
                            <div className="card-header">
                                <h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>Evenements critiques</h3>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <span className="badge badge-critical">{urgentHistory.length} urgences/chirurgies</span>
                                    <span className="badge badge-neutral" title="Consultations dentaire, dermato, ophtalmo, ORL, pneumo, rhumato... filtrees">{filteredOut} filtres</span>
                                </div>
                            </div>
                            <div style={{ maxHeight: 350, overflowY: 'auto', padding: 16 }}>
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
                                {selectedRegion && <RegionDetail regionKey={selectedRegion} onViewScan={setViewingScan} />}
                            </div>
                        </div>

                        {/* AI Chatbot */}
                        <UrgenceChatbot />

                        {/* Quick Info */}
                        <div className="card" style={{ animation: 'fadeInUp 0.6s ease both' }}>
                            <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                                <div style={{ padding: 20, borderRight: '1px solid var(--border-subtle)' }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--severity-critical)', marginBottom: 8 }}>Contact urgence</div>
                                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{patient.emergencyContact}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Personne a contacter en cas d'urgence</div>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 8 }}>Morphologie</div>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-700)' }}>{patient.height}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Taille</div></div>
                                        <div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-700)' }}>{patient.weight}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Poids</div></div>
                                        <div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-700)' }}>{patient.bloodType}</div><div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Groupe</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
