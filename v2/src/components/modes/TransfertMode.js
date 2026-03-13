'use client';
import { useState } from 'react';
import { MOCK_PATIENTS } from '@/data/mockData';

const patient = MOCK_PATIENTS[0];

/* ── SVG ICONS ── */
const ICN = {
    shield: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    lock: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
    link: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
    check: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>,
    doc: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>,
    warn: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    download: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    edit: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    history: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    qr: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /></svg>,
    building: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>,
};

const TRANSFER_STEPS = [
    { id: 1, label: 'Selection des informations', description: 'Choisir les donnees a partager' },
    { id: 2, label: 'Consentement patient', description: 'Validation par le patient' },
    { id: 3, label: 'Generation du dossier', description: 'Resume securise auto-genere' },
    { id: 4, label: 'Envoi & QR code', description: 'Code d\'acces temporaire' }
];

export default function TransfertMode() {
    const [step, setStep] = useState(1);
    const [selectedData, setSelectedData] = useState({
        conditions: true, medications: true, allergies: true,
        interactions: true, history: true, imaging: false, fullRecord: false
    });
    const [consent, setConsent] = useState(false);
    const [destination, setDestination] = useState('');
    const [motif, setMotif] = useState('');
    const [urgency, setUrgency] = useState('normal');
    const [transferGenerated, setTransferGenerated] = useState(false);

    const transferHistory = [
        { date: '10/01/2026', from: 'CHU Hassan II, Fes', to: 'CHR Meknes', motif: 'Consultation orthopedique', status: 'complete' },
        { date: '15/06/2025', from: 'Centre de Sante Medina', to: 'CHU Hassan II, Fes', motif: 'Urgence hypoglycemique', status: 'complete' }
    ];

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.building} Etablissement destinataire</h3>
                                <div className="form-group" style={{ marginBottom: 16 }}>
                                    <label className="form-label">Hopital / Clinique</label>
                                    <select className="form-select" style={{ width: '100%' }} value={destination} onChange={e => setDestination(e.target.value)}>
                                        <option value="">Selectionnez un etablissement</option>
                                        <option value="chr_meknes">CHR Meknes</option>
                                        <option value="chu_rabat">CHU Ibn Sina, Rabat</option>
                                        <option value="clinique_atlas">Clinique Atlas, Fes</option>
                                        <option value="hopital_ifrane">Hopital Provincial, Ifrane</option>
                                        <option value="autre">Autre etablissement</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ marginBottom: 16 }}>
                                    <label className="form-label">Motif du transfert</label>
                                    <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Decrivez le motif du transfert..." value={motif} onChange={e => setMotif(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Niveau d'urgence</label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {[
                                            { val: 'normal', label: 'Normal', badge: 'badge-neutral' },
                                            { val: 'urgent', label: 'Urgent', badge: 'badge-warning' },
                                            { val: 'critical', label: 'Critique', badge: 'badge-critical' }
                                        ].map(u => (
                                            <button key={u.val} className={`btn btn-sm ${urgency === u.val ? 'active' : 'btn-secondary'}`} onClick={() => setUrgency(u.val)}>
                                                <span className={`badge ${u.badge}`}>{u.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.doc} Donnees a partager</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[
                                        { key: 'conditions', label: 'Conditions actives', count: patient.conditions.length },
                                        { key: 'medications', label: 'Medicaments en cours', count: patient.medications.length },
                                        { key: 'allergies', label: 'Allergies connues', count: patient.allergies.length },
                                        { key: 'interactions', label: 'Interactions medicamenteuses', count: patient.interactions.length },
                                        { key: 'history', label: 'Historique medical', count: patient.history.length },
                                        { key: 'imaging', label: 'Imagerie & documents', count: 8 },
                                        { key: 'fullRecord', label: 'Dossier medical complet', count: null }
                                    ].map(item => (
                                        <label key={item.key} style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                            border: `1px solid ${selectedData[item.key] ? 'var(--primary-200)' : 'var(--border-default)'}`,
                                            background: selectedData[item.key] ? 'var(--primary-50)' : 'var(--bg-card)',
                                            cursor: 'pointer', transition: 'all var(--transition-fast)'
                                        }}>
                                            <input type="checkbox" checked={selectedData[item.key]} onChange={() => setSelectedData(prev => ({ ...prev, [item.key]: !prev[item.key] }))} style={{ width: 18, height: 18, accentColor: 'var(--primary-600)' }} />
                                            <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{item.label}</span>
                                            {item.count !== null && <span className="badge badge-neutral">{item.count}</span>}
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginTop: 16, padding: 12, background: 'var(--severity-info-bg)', border: '1px solid var(--severity-info-border)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <span style={{ flexShrink: 0, marginTop: 2 }}>{ICN.shield}</span>
                                    <p style={{ fontSize: 11, color: 'var(--severity-info)', lineHeight: 1.5 }}>
                                        <strong>Souverainete des donnees</strong> : Les donnees restent sur le DMP centralise du Ministere. L'etablissement destinataire recoit un <strong>acces temporaire</strong>, pas une copie.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 'var(--radius-full)',
                            background: 'var(--severity-warning-bg)', border: '3px solid var(--severity-warning)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px', color: 'var(--severity-warning)'
                        }}><span style={{ width: 36, height: 36, display: 'flex' }}>{ICN.lock}</span></div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Consentement du patient requis</h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                            Conformement a la Loi 09-08 (CNDP), le patient doit consentir explicitement au partage de ses donnees medicales avec l'etablissement destinataire.
                        </p>
                        <div className="card" style={{ textAlign: 'left', marginBottom: 20, padding: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Resume du partage :</div>
                            <ul style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2 }}>
                                <li>Patient : {patient.firstName} {patient.lastName} ({patient.id})</li>
                                <li>Destinataire : {destination || 'Non selectionne'}</li>
                                <li>Donnees : {Object.entries(selectedData).filter(([, v]) => v).length} categories selectionnees</li>
                                <li>Acces temporaire : 72 heures</li>
                                <li>Motif : {motif || 'Non specifie'}</li>
                            </ul>
                        </div>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 16, background: consent ? 'var(--severity-success-bg)' : 'var(--neutral-50)', border: `2px solid ${consent ? 'var(--severity-success)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left', transition: 'all var(--transition-fast)' }}>
                            <input type="checkbox" checked={consent} onChange={() => setConsent(!consent)} style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--severity-success)' }} />
                            <span style={{ fontSize: 13, lineHeight: 1.5 }}>
                                Je confirme que le patient <strong>{patient.firstName} {patient.lastName}</strong> a donne son consentement eclaire pour le partage temporaire de ses donnees medicales avec l'etablissement destinataire.
                            </span>
                        </label>
                    </div>
                );

            case 3:
                return (
                    <div className="fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.doc} Resume de transfert auto-genere</h3>
                        <div className="card">
                            <div className="card-body">
                                <pre style={{ fontSize: 12, lineHeight: 1.7, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', background: 'var(--neutral-50)', padding: 20, borderRadius: 'var(--radius-md)' }}>
                                    {`DOSSIER DE TRANSFERT MEDICAL
===========================
Reference: TRF-2026-4782
Date: ${new Date().toLocaleDateString('fr-FR')}

PATIENT
Nom: ${patient.lastName} ${patient.firstName}
ID: ${patient.id}
Age: ${patient.age} ans | Sexe: ${patient.sex}
Groupe sanguin: ${patient.bloodType}

ALLERGIES: ${patient.allergies.join(', ')}

MOTIF DE TRANSFERT
${motif || 'Consultation specialisee'}
Urgence: ${urgency.toUpperCase()}

CONDITIONS ACTIVES
${patient.conditions.map(c => `- ${c.name} (depuis ${c.since}) — ${c.details}`).join('\n')}

MEDICAMENTS EN COURS
${patient.medications.map(m => `- ${m.name} — ${m.dosage} (${m.purpose})`).join('\n')}

INTERACTIONS CRITIQUES
${patient.interactions.map(i => `[!] ${i.drugs.join(' + ')} : ${i.risk}`).join('\n')}

DERNIERS EXAMENS
- Bilan sanguin (08/01/2026) : HbA1c 7.8%, Creatinine 12mg/L
- ECG (20/06/2024) : Arythmie sinusale
- Echo cardiaque (05/07/2024) : FE 55%

ACCES TEMPORAIRE: 72 heures
CONFORMITE: Loi 09-08 (CNDP) — Consentement patient obtenu

Ce resume a ete genere automatiquement par Alwarid.
Les donnees completes sont accessibles via le DMP centralise.`}
                                </pre>
                            </div>
                            <div className="card-footer" style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary" style={{ gap: 6 }}>{ICN.download} Telecharger PDF</button>
                                <button className="btn btn-secondary" style={{ gap: 6 }}>{ICN.edit} Modifier</button>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="fade-in" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
                        {!transferGenerated ? (
                            <div>
                                <div style={{
                                    width: 100, height: 100, borderRadius: 'var(--radius-full)',
                                    background: 'linear-gradient(135deg, var(--primary-100) 0%, var(--primary-200) 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px', color: 'var(--primary-700)',
                                    boxShadow: '0 8px 24px rgba(15,118,110,0.2)'
                                }}><span style={{ width: 44, height: 44, display: 'flex' }}>{ICN.link}</span></div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Pret a envoyer</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
                                    Un QR code d'acces temporaire sera genere pour l'etablissement destinataire.
                                </p>
                                <button className="btn btn-primary btn-lg" onClick={() => setTransferGenerated(true)} style={{ gap: 8 }}>
                                    {ICN.qr} Generer le QR de transfert
                                </button>
                            </div>
                        ) : (
                            <div className="fade-in">
                                <div style={{
                                    width: 220, height: 220, margin: '0 auto 20px',
                                    background: 'white', borderRadius: 'var(--radius-lg)',
                                    border: '4px solid var(--primary-600)',
                                    display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(10, 1fr)',
                                    padding: 16, gap: 2,
                                    boxShadow: '0 8px 32px rgba(15,118,110,0.2)'
                                }}>
                                    {Array.from({ length: 100 }).map((_, i) => (<div key={i} style={{ background: ((i * 13 + 7) % 17) > 7 ? 'var(--primary-800)' : 'white', borderRadius: 1 }} />))}
                                </div>
                                <div className="badge badge-success" style={{ fontSize: 13, padding: '6px 16px', marginBottom: 12 }}>Transfert envoye avec succes</div>
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                                    L'etablissement destinataire peut scanner ce QR code pour acceder au dossier.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--neutral-50)', padding: 16, borderRadius: 'var(--radius-md)', marginTop: 16 }}>
                                    <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>Acces temporaire</span><span style={{ fontWeight: 600 }}>72 heures</span></div>
                                    <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>Expiration</span><span style={{ fontWeight: 600 }}>{new Date(Date.now() + 72 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</span></div>
                                    <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>Audit trail</span><span className="badge badge-success">Actif</span></div>
                                </div>
                                <p style={{ fontSize: 10, color: 'var(--severity-warning)', marginTop: 12 }}>
                                    Les donnees restent sur le DMP centralise. L'etablissement recoit un acces, pas une copie.
                                </p>
                            </div>
                        )}
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="fade-in" style={{ minHeight: 'calc(100vh - 60px)', padding: 24 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Stepper */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
                    marginBottom: 32, padding: 20, background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)'
                }}>
                    {TRANSFER_STEPS.map((s, i) => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }} onClick={() => setStep(s.id)}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 'var(--radius-full)',
                                    background: step >= s.id ? 'var(--primary-600)' : 'var(--neutral-200)',
                                    color: step >= s.id ? 'white' : 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700, fontSize: 14, transition: 'all var(--transition-normal)',
                                    boxShadow: step === s.id ? '0 4px 12px rgba(15,118,110,0.3)' : 'none'
                                }}>{step > s.id ? <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : s.id}</div>
                                <span style={{ fontSize: 11, fontWeight: step === s.id ? 600 : 400, color: step === s.id ? 'var(--primary-700)' : 'var(--text-muted)', textAlign: 'center', maxWidth: 100 }}>{s.label}</span>
                            </div>
                            {i < TRANSFER_STEPS.length - 1 && (
                                <div style={{ width: 60, height: 2, background: step > s.id ? 'var(--primary-400)' : 'var(--neutral-200)', margin: '0 8px', marginBottom: 20, transition: 'background var(--transition-normal)' }} />
                            )}
                        </div>
                    ))}
                </div>

                {renderStep()}

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                    <button className="btn btn-secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} style={{ opacity: step === 1 ? 0.4 : 1 }}>
                        <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg> Precedent
                    </button>
                    <button className="btn btn-primary" onClick={() => setStep(Math.min(4, step + 1))} disabled={(step === 2 && !consent) || step === 4} style={{ opacity: (step === 2 && !consent) || step === 4 ? 0.4 : 1 }}>
                        {step === 3 ? 'Generer le transfert' : 'Suivant'} <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                </div>

                {/* Transfer History */}
                <div className="card" style={{ marginTop: 32, animation: 'fadeInUp 0.5s ease both' }}>
                    <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{ICN.history} Historique des transferts</h3></div>
                    <div style={{ padding: 0 }}>
                        <table className="data-table">
                            <thead><tr><th>Date</th><th>De</th><th>Vers</th><th>Motif</th><th>Statut</th></tr></thead>
                            <tbody>
                                {transferHistory.map((t, i) => (
                                    <tr key={i}>
                                        <td className="text-mono">{t.date}</td>
                                        <td>{t.from}</td>
                                        <td>{t.to}</td>
                                        <td>{t.motif}</td>
                                        <td><span className="badge badge-success">Termine</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
