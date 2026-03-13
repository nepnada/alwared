'use client';
import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MOCK_PATIENTS, HISTORY_TYPES, formatDate } from '@/data/mockData';

const BodyViewer3D = dynamic(() => import('@/components/BodyViewer3D').then(m => ({ default: m.BodyViewer3D })), { ssr: false });

const patient = MOCK_PATIENTS[0];

/* ── SVG ICONS ── */
const ICON = {
    overview: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
    history: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    docs: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3-3 3 3" /></svg>,
    body3d: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    ordonnance: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>,
    ai: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
    qr: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg>,
    ecg: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    scan: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>,
    radio: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="12" cy="12" r="5" /><line x1="12" y1="3" x2="12" y2="7" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    clipboard: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>,
    syringe: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>,
    chart: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>,
    warn: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    download: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    upload: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    user: <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
};

const sz = (icon, size) => <span style={{ display: 'inline-flex', width: size, height: size }}>{icon}</span>;

const TABS = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: ICON.overview },
    { id: 'history', label: 'Historique Medical', icon: ICON.history },
    { id: 'documents', label: 'Documents & IA', icon: ICON.docs },
    { id: '3d', label: 'Cartographie 3D', icon: ICON.body3d },
    { id: 'ordonnance', label: 'Ordonnance', icon: ICON.ordonnance },
    { id: 'ai', label: 'Analyse IA', icon: ICON.ai }
];

const AI_DOCUMENT_TYPES = [
    { id: 'ecg', title: 'ECG / Arythmie', icon: ICON.ecg, description: 'Analyse IA d\'ECG avec Explainable AI (GradCAM)', status: 'Modele entraine', badge: 'badge-success' },
    { id: 'echography', title: 'Echographie', icon: ICON.scan, description: 'L\'IA genere le rapport a partir de vos observations', status: 'Pret', badge: 'badge-info' },
    { id: 'radio', title: 'Radiologie', icon: ICON.radio, description: 'Rapport auto-genere a partir de l\'input medecin', status: 'Pret', badge: 'badge-info' },
    { id: 'surveillance', title: 'Fiche de surveillance', icon: ICON.clipboard, description: 'Fiche de surveillance reanimation auto-remplie', status: 'Template', badge: 'badge-neutral' },
    { id: 'traitement', title: 'Fiche de traitement', icon: ICON.syringe, description: 'Auto-generee depuis les medicaments prescrits', status: 'Auto', badge: 'badge-success' },
    { id: 'evaluation', title: 'Fiche d\'evaluation', icon: ICON.chart, description: 'Comparaison avec les etats precedents du patient', status: 'IA', badge: 'badge-info' }
];

function OverviewTab() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, padding: 24, maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="patient-info-card">
                    <div className="patient-info-header">
                        <div className="patient-photo">YA</div>
                        <div><div className="patient-name">{patient.firstName} {patient.lastName}</div><div className="patient-id">{patient.id}</div></div>
                    </div>
                    <div className="patient-info-grid">
                        <div className="patient-info-item"><div className="label">Age</div><div className="value">{patient.age} ans</div></div>
                        <div className="patient-info-item"><div className="label">Sexe</div><div className="value">{patient.sex}</div></div>
                        <div className="patient-info-item"><div className="label">Gr. sanguin</div><div className="value">{patient.bloodType}</div></div>
                        <div className="patient-info-item"><div className="label">Taille</div><div className="value">{patient.height}</div></div>
                        <div className="patient-info-item"><div className="label">Poids</div><div className="value">{patient.weight}</div></div>
                        <div className="patient-info-item"><div className="label">Ville</div><div className="value">{patient.city}</div></div>
                    </div>
                    <div style={{ padding: 12, borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Allergies</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{patient.allergies.map((a, i) => <span key={i} className="badge badge-critical">{a}</span>)}</div>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--severity-critical)' }}>{sz(ICON.warn, 18)}</span> Alertes critiques
                </h2>
                {patient.interactions.map((inter, i) => (
                    <div key={i} className={`alert alert-${inter.severity}`}>
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        <div><div className="alert-title">{inter.drugs.join(' + ')}</div><div className="alert-text">{inter.risk}</div><div className="source-tag" style={{ marginTop: 4 }}>Source : {inter.source}</div></div>
                    </div>
                ))}
                <div className="card"><div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600 }}>Conditions actives</h3></div>
                    <div style={{ padding: 0 }}>
                        <table className="data-table"><thead><tr><th>Condition</th><th>Depuis</th><th>Statut</th></tr></thead>
                            <tbody>{patient.conditions.map((c, i) => (<tr key={i}><td style={{ fontWeight: 500 }}>{c.name}</td><td>{c.since}</td><td><span className={`badge badge-${c.severity}`}>{c.severity === 'critical' ? 'Critique' : 'Attention'}</span></td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
                <div className="card"><div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600 }}>Medicaments en cours</h3></div>
                    <div style={{ padding: 0 }}>
                        <table className="data-table"><thead><tr><th>Medicament</th><th>Posologie</th><th>Indication</th></tr></thead>
                            <tbody>{patient.medications.map((m, i) => (<tr key={i}><td style={{ fontWeight: 500 }}>{m.name}</td><td>{m.dosage}</td><td>{m.purpose}</td></tr>))}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HistoryTab() {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? patient.history : patient.history.filter(h => h.type === filter);
    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600 }}>Historique Medical</h2>
                <div className="pill-group">
                    {['all', ...Object.keys(HISTORY_TYPES)].map(t => (
                        <button key={t} className={`pill ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t === 'all' ? 'Tout' : HISTORY_TYPES[t]?.label}</button>
                    ))}
                </div>
            </div>
            <div className="timeline">
                {filtered.map((entry, i) => {
                    const typeInfo = HISTORY_TYPES[entry.type] || { label: entry.type, color: 'info' };
                    return (
                        <div key={i} className="timeline-item" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className={`timeline-dot ${typeInfo.color}`}><svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                            <div className="timeline-content">
                                <div className="timeline-date">{formatDate(entry.date)}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}><div className="timeline-title">{entry.title}</div><span className={`badge badge-${typeInfo.color}`}>{typeInfo.label}</span></div>
                                <div className="timeline-meta">{sz(ICON.user, 12)} {entry.doctor} — {entry.hospital}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{entry.details}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function DocumentsAITab() {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [aiInput, setAiInput] = useState('');
    const [generatedReport, setGeneratedReport] = useState('');

    const generateReport = (docType) => {
        if (docType === 'echography') {
            setGeneratedReport(`RAPPORT D'ECHOGRAPHIE\n══════════════════\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\nOperateur: Dr. M. Aloui\n\nINDICATION:\n${aiInput || 'Contrôle de suivi'}\n\nRESULTATS:\n• Foie: Steatose hepatique grade 1, taille normale\n• Vesicule biliaire: Alithiasique, paroi fine\n• Voies biliaires: Non dilatees\n• Pancreas: Homogene, de taille normale\n• Rate: Homogene, 11 cm\n• Reins: Taille normale, bonne differenciation cortico-medullaire\n• Aorte abdominale: Calibre normal\n\nCONCLUSION:\nSteatose hepatique grade 1 stable. Pas de complication.\nExamen a correler aux donnees cliniques et biologiques.\n\nATTENTION : Ce rapport a ete genere par l'IA a partir de vos observations.\nLa decision finale revient au medecin.`);
        } else if (docType === 'radio') {
            setGeneratedReport(`RAPPORT DE RADIOLOGIE\n══════════════════\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\nRadiologue: Dr. M. Aloui\n\nTYPE D'EXAMEN: Radiographie thoracique (face)\n\nINDICATION:\n${aiInput || 'Bilan de routine'}\n\nDESCRIPTION:\n• Parenchyme pulmonaire: Pas de foyer de condensation\n• Silhouette cardiaque: Taille normale (ICT < 0.5)\n• Mediastin: Pas d'elargissement\n• Coupoles diaphragmatiques: Regulieres\n• Cadre osseux: Integre\n\nCONCLUSION:\nRadiographie thoracique sans anomalie significative.\n\nATTENTION : Rapport genere par IA — Validation medicale requise.`);
        } else if (docType === 'surveillance') {
            setGeneratedReport(`FICHE DE SURVEILLANCE — REANIMATION\n════════════════════════════════\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\nService: Reanimation — CHU Hassan II\n\nCONSTANTES (a remplir toutes les heures):\n┌─────────┬──────┬───────┬──────┬──────┬──────────┬───────┐\n│ Heure   │  TA  │ Pouls │ SpO2 │ Temp │ Diurese  │ GCS   │\n├─────────┼──────┼───────┼──────┼──────┼──────────┼───────┤\n│ 08:00   │      │       │      │      │          │       │\n│ 09:00   │      │       │      │      │          │       │\n│ 10:00   │      │       │      │      │          │       │\n└─────────┴──────┴───────┴──────┴──────┴──────────┴───────┘\n\nTRAITEMENTS EN COURS:\n${patient.medications.map(m => `• ${m.name} — ${m.dosage}`).join('\n')}\n\nALLERGIES: ${patient.allergies.join(', ')}\nGROUPE SANGUIN: ${patient.bloodType}\n\nTemps economise: ~1h30 grace a l'automatisation`);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{sz(ICON.ai, 20)} Documents & IA</h2>
                <span className="badge badge-info">Agentic AI</span>
            </div>

            {!selectedDoc ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {AI_DOCUMENT_TYPES.map(doc => (
                        <div key={doc.id} className="card card-interactive" onClick={() => setSelectedDoc(doc)} style={{ padding: 20, cursor: 'pointer' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-700)', marginBottom: 12 }}>{sz(doc.icon, 20)}</div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.title}</h3>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{doc.description}</p>
                            <span className={`badge ${doc.badge}`}>{doc.status}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="fade-in">
                    <button className="btn btn-ghost" onClick={() => { setSelectedDoc(null); setGeneratedReport(''); setAiInput(''); }} style={{ marginBottom: 16 }}>
                        <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg> Retour aux documents
                    </button>
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>{sz(selectedDoc.icon, 20)} {selectedDoc.title}</h3>
                            <span className={`badge ${selectedDoc.badge}`}>{selectedDoc.status}</span>
                        </div>
                        <div className="card-body">
                            {selectedDoc.id === 'ecg' ? (
                                <div>
                                    <div style={{ background: 'linear-gradient(135deg, var(--severity-critical-bg) 0%, #fff1f2 100%)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16, border: '1px solid var(--severity-critical-border)' }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>{sz(ICON.ecg, 18)} Analyse ECG — Explainable AI (GradCAM)</h4>
                                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>Uploadez un ECG pour obtenir une analyse par notre modele IA entraine avec visualisation GradCAM des zones d'interet.</p>
                                        <div style={{ border: '2px dashed var(--severity-critical-border)', borderRadius: 'var(--radius-md)', padding: 40, textAlign: 'center' }}>
                                            <div style={{ width: 40, height: 40, margin: '0 auto 8px', color: 'var(--severity-critical)', opacity: 0.5 }}>{sz(ICON.upload, 40)}</div>
                                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Glissez un fichier ECG ici ou cliquez pour upload</p>
                                            <button className="btn btn-primary" style={{ marginTop: 12, background: 'var(--severity-critical)' }}>Charger ECG</button>
                                        </div>
                                    </div>
                                    <div className="alert alert-warning">
                                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                                        <div><div className="alert-title">Modele en cours d'integration</div><div className="alert-text">Le modele ECG / arythmie sera integre prochainement avec les donnees de test fournies.</div></div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="form-group" style={{ marginBottom: 16 }}>
                                        <label className="form-label">Vos observations / input</label>
                                        <textarea className="form-textarea" style={{ minHeight: 120 }} placeholder={`Decrivez vos observations pour la generation du rapport de ${selectedDoc.title.toLowerCase()}...`} value={aiInput} onChange={e => setAiInput(e.target.value)} />
                                    </div>
                                    <button className="btn btn-primary" onClick={() => generateReport(selectedDoc.id)} style={{ marginBottom: 16, gap: 6 }}>
                                        {sz(ICON.ai, 14)} Generer le rapport IA
                                    </button>
                                    {generatedReport && (
                                        <div style={{ background: 'var(--neutral-50)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 20, marginTop: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <span className="badge badge-success">Rapport genere</span>
                                                <button className="btn btn-sm btn-secondary" style={{ gap: 4 }}>{sz(ICON.download, 14)} Ajouter au dossier</button>
                                            </div>
                                            <pre style={{ fontSize: 12, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{generatedReport}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrdonnanceTab() {
    const [prescriptions, setPrescriptions] = useState(patient.medications.map(m => ({ ...m, selected: true })));
    const [showQR, setShowQR] = useState(false);

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600 }}>Ordonnance Numerique</h2>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Base sur le pilote CNSS Kenitra — Ordonnance QR code</p>
                </div>
                <span className="badge badge-info">Pilote Kenitra 2026</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
                <div className="card">
                    <div className="card-header">
                        <h3 style={{ fontSize: 14, fontWeight: 600 }}>Prescription</h3>
                        <button className="btn btn-sm btn-secondary">+ Ajouter medicament</button>
                    </div>
                    <div style={{ padding: 0 }}>
                        {prescriptions.map((med, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <input type="checkbox" checked={med.selected} onChange={() => setPrescriptions(prev => prev.map((p, j) => j === i ? { ...p, selected: !p.selected } : p))} style={{ width: 18, height: 18, accentColor: 'var(--primary-600)' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{med.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{med.dosage} — {med.purpose}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>QR Code Pharmacie</h3>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Le pharmacien scanne ce QR code pour acceder a la prescription. Le code est desactive apres delivrance.</p>
                        {!showQR ? (
                            <button className="btn btn-primary btn-lg" onClick={() => setShowQR(true)} style={{ width: '100%', gap: 8 }}>{sz(ICON.qr, 16)} Generer QR Ordonnance</button>
                        ) : (
                            <div className="fade-in">
                                <div style={{ width: 200, height: 200, margin: '0 auto 16px', background: 'white', borderRadius: 'var(--radius-md)', border: '3px solid var(--primary-600)', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)', padding: 12, gap: 2 }}>
                                    {Array.from({ length: 64 }).map((_, i) => (<div key={i} style={{ background: Math.random() > 0.5 ? 'var(--primary-800)' : 'white', borderRadius: 1 }} />))}
                                </div>
                                <div className="badge badge-success" style={{ marginBottom: 8 }}>Actif — En attente de delivrance</div>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Enregistre sur le DMP (Dossier Medical Patient)</p>
                                <p style={{ fontSize: 10, color: 'var(--severity-warning)', marginTop: 4 }}>Code desactive automatiquement apres delivrance</p>
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: 16, padding: 16, background: 'var(--severity-info-bg)', border: '1px solid var(--severity-info-border)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--severity-info)', marginBottom: 4 }}>Pilote CNSS Kenitra</div>
                        <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Systeme d'ordonnance numerique avec QR code lance en mars 2026. Generalisation nationale prevue avril-juin 2026.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIAnalysisTab() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const examplePrompts = ['Resume complet du dossier patient', 'Contre-indications pour ce patient?', 'Interactions medicamenteuses a surveiller', 'Historique des pathologies cardiovasculaires'];
    const handleQuery = (query) => {
        const q = query || prompt;
        setPrompt(q);
        setResponse(`Analyse IA — Dossier de ${patient.firstName} ${patient.lastName}\n═══════════════════════════════════════\n\nBased on the patient's medical record:\n\n• Patient de ${patient.age} ans avec ${patient.conditions.length} pathologies actives\n• Pathologies principales: ${patient.conditions.map(c => c.name).join(', ')}\n• ${patient.medications.length} medicaments en cours\n• ${patient.interactions.length} interactions medicamenteuses identifiees\n• Allergies connues: ${patient.allergies.join(', ')}\n\nCeci est une analyse indicative. La decision medicale finale revient au praticien.`);
    };
    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>{sz(ICON.ai, 20)} Analyse IA du Dossier</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Interrogez le dossier patient avec l'IA. Aucune donnee n'est envoyee a l'exterieur.</p>
            <div className="card" style={{ marginBottom: 16 }}><div className="card-body">
                <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Posez une question sur le dossier du patient..." value={prompt} onChange={e => setPrompt(e.target.value)} />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>{examplePrompts.map((p, i) => <button key={i} className="pill" onClick={() => handleQuery(p)}>{p}</button>)}</div>
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => handleQuery()}>Analyser</button>
            </div></div>
            {response && (<div className="card fade-in"><div className="card-header"><span className="badge badge-success">Reponse IA</span></div>
                <div className="card-body"><pre style={{ fontSize: 13, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{response}</pre></div>
            </div>)}
        </div>
    );
}

export default function ConsultationMode() {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedRegion, setSelectedRegion] = useState(null);
    return (
        <div style={{ minHeight: 'calc(100vh - 60px)' }}>
            <div className="tab-nav">
                {TABS.map(tab => (
                    <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'history' && <HistoryTab />}
            {activeTab === 'documents' && <DocumentsAITab />}
            {activeTab === 'ordonnance' && <OrdonnanceTab />}
            {activeTab === 'ai' && <AIAnalysisTab />}
            {activeTab === '3d' && (
                <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '120px 1fr 320px', gap: 20 }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 8 }}>Anatomie</div>
                        {['Externe', 'Musculaire', 'Squelette', 'Organes'].map(l => (<button key={l} className={`btn btn-sm btn-secondary ${l === 'Externe' ? 'active' : ''}`} style={{ width: '100%', marginBottom: 6 }}>{l}</button>))}
                    </div>
                    <div style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-default)', height: 550, position: 'relative', overflow: 'hidden' }}>
                        <Suspense fallback={<div className="skeleton" style={{ width: '100%', height: '100%' }} />}><BodyViewer3D onRegionSelect={setSelectedRegion} regions={patient.bodyRegions} /></Suspense>
                    </div>
                    <div>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{selectedRegion ? patient.bodyRegions[selectedRegion]?.label : 'Selectionnez une zone'}</h3>
                        {selectedRegion && patient.bodyRegions[selectedRegion] && (
                            <div className="fade-in">
                                <span className={`badge badge-${patient.bodyRegions[selectedRegion].severity === 'caution' ? 'warning' : patient.bodyRegions[selectedRegion].severity}`} style={{ marginBottom: 12 }}>{patient.bodyRegions[selectedRegion].severity}</span>
                                {patient.bodyRegions[selectedRegion].conditions.length > 0 && (<div style={{ marginTop: 12 }}><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Conditions</div><ul style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{patient.bodyRegions[selectedRegion].conditions.map((c, i) => <li key={i}>- {c}</li>)}</ul></div>)}
                                {patient.bodyRegions[selectedRegion].medications?.length > 0 && (<div style={{ marginTop: 12 }}><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Medicaments</div><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{patient.bodyRegions[selectedRegion].medications.map((m, i) => <span key={i} className="tag">{m}</span>)}</div></div>)}
                            </div>
                        )}
                        {!selectedRegion && <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Cliquez sur le modele 3D pour voir les details medicaux.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}
