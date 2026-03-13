'use client';
import { useState, useRef, Suspense } from 'react';
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
    const [isGenerating, setIsGenerating] = useState(false);
    const [displayedReport, setDisplayedReport] = useState('');
    const [ecgFile, setEcgFile] = useState(null);
    const [ecgPreview, setEcgPreview] = useState(null);
    const [ecgAnalyzing, setEcgAnalyzing] = useState(false);
    const [ecgResult, setEcgResult] = useState(null);
    const [ecgSignalType, setEcgSignalType] = useState('Normal');
    const [ecgSamples, setEcgSamples] = useState(null);
    const [ecgXaiActive, setEcgXaiActive] = useState(false);
    const [addedToDossier, setAddedToDossier] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const ecgCanvasRef = useRef(null);

    const toggleSpeech = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { alert('Speech-to-text non supporte par ce navigateur. Utilisez Chrome.'); return; }
        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = true;
        recognition.interimResults = true;
        let finalTranscript = aiInput;
        recognition.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += (finalTranscript ? ' ' : '') + transcript;
                    setAiInput(finalTranscript);
                } else {
                    interim += transcript;
                }
            }
            if (interim) setAiInput(finalTranscript + (finalTranscript ? ' ' : '') + interim);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    // Typing animation for reports
    const typeReport = (fullText) => {
        setIsGenerating(true);
        setDisplayedReport('');
        let i = 0;
        const interval = setInterval(() => {
            i += 3;
            setDisplayedReport(fullText.slice(0, i));
            if (i >= fullText.length) { clearInterval(interval); setIsGenerating(false); }
        }, 8);
    };

    const handleEcgUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setEcgFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => { setEcgPreview(ev.target.result); };
        reader.readAsDataURL(file);
    };

    const analyzeEcg = async () => {
        setEcgAnalyzing(true);
        setEcgResult(null);
        setEcgXaiActive(false);
        try {
            // Load samples if not loaded yet
            let samples = ecgSamples;
            if (!samples) {
                const res = await fetch('/ecg-samples.json');
                samples = await res.json();
                setEcgSamples(samples);
            }
            const signalData = samples[ecgSignalType];
            if (!signalData) { setEcgAnalyzing(false); return; }

            const res = await fetch('/api/ecg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signal: signalData.signal }),
            });
            const data = await res.json();
            if (data.error) {
                alert(data.error);
                setEcgAnalyzing(false);
                return;
            }
            setEcgResult(data);
        } catch (err) {
            alert('Erreur connexion au serveur ECG. Lancez: cd T-MECA/interface && python app.py');
        }
        setEcgAnalyzing(false);
    };

    const generateReport = async (docType) => {
        setIsGenerating(true);
        setDisplayedReport('');
        setGeneratedReport('');
        setAddedToDossier(false);

        // Map doc types to system prompts
        const promptMap = {
            echography: 'REPORT_ECHO',
            radio: 'REPORT_RADIO',
            surveillance: 'REPORT_SURVEILLANCE',
            traitement: 'REPORT_TRAITEMENT',
            evaluation: 'REPORT_EVALUATION'
        };

        try {
            const { buildPatientContext, SYSTEM_PROMPTS } = await import('@/data/prompts');
            const promptKey = promptMap[docType] || 'AI_ANALYSIS';

            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt: SYSTEM_PROMPTS[promptKey],
                    userMessage: aiInput
                        ? `OBSERVATIONS DU MEDECIN (input principal pour l'aide a la decision) :\n${aiInput}\n\nGenere le rapport en integrant ces observations dans les sections appropriees.`
                        : `Genere un rapport complet de ${docType} pour ce patient. Base-toi sur son dossier medical. Les champs d'observation restent a completer par le medecin.`,
                    patientContext: buildPatientContext(patient)
                })
            });

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) throw new Error('fallback');

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
                            setDisplayedReport(fullText);
                        }
                    } catch { }
                }
            }
            setGeneratedReport(fullText);
            setIsGenerating(false);
        } catch {
            // Fallback: use local templates
            const report = getLocalReport(docType);
            setGeneratedReport(report);
            typeReport(report);
        }
    };

    const getLocalReport = (docType) => {
        if (docType === 'echography') return `RAPPORT D'ECHOGRAPHIE\n${'='.repeat(40)}\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\nOperateur: Dr. M. Aloui\n\nINDICATION:\n${aiInput || 'Controle de suivi'}\n\nRESULTATS:\n  Foie: Steatose hepatique grade 1, taille normale\n  Vesicule biliaire: Alithiasique, paroi fine\n  Voies biliaires: Non dilatees\n  Pancreas: Homogene, de taille normale\n  Rate: Homogene, 11 cm\n  Reins: Taille normale, bonne differenciation\n  Aorte abdominale: Calibre normal\n\n[AIDE IA] Steatose hepatique a correler avec le diabete type 2 du patient.\n\nCONCLUSION:\nSteatose hepatique grade 1 stable.\nA correler aux donnees cliniques et biologiques.\n\n[Rapport assiste par IA — Validation medicale requise]`;
        if (docType === 'radio') return `RAPPORT DE RADIOLOGIE\n${'='.repeat(40)}\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\nRadiologue: Dr. M. Aloui\n\nTYPE: Radiographie thoracique (face)\nTECHNIQUE: Cliche de face, debout, inspiration. R.I.P. satisfaisants.\n\nINDICATION:\n${aiInput || 'Bilan de routine'}\n\nCONSTATATIONS:\n  Parenchyme pulmonaire: Pas de foyer de condensation\n  Silhouette cardiaque: Taille normale (ICT < 0.5)\n  [AIDE IA] Patient hypertendu stade 2 — surveiller l'ICT\n  Mediastin: Pas d'elargissement\n  Plevre: Pas d'epanchement\n  Coupoles diaphragmatiques: Regulieres\n  Cadre osseux: Integre\n\nCONCLUSION:\nRadiographie thoracique sans anomalie significative.\n\n[Rapport assiste par IA — Validation medicale requise]`;
        if (docType === 'surveillance') return `FICHE DE SURVEILLANCE — REANIMATION\n${'='.repeat(40)}\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\nService: Reanimation — CHU Hassan II\n\nCONSTANTES (toutes les heures):\n  Heure | TA     | Pouls | SpO2 | Temp  | Diurese | GCS\n  08:00 | ___/___|  ___  | ___% | ___C  |  ___ml  | ___\n  09:00 | ___/___|  ___  | ___% | ___C  |  ___ml  | ___\n  10:00 | ___/___|  ___  | ___% | ___C  |  ___ml  | ___\n\nTRAITEMENTS EN COURS:\n${patient.medications.map(m => `  ${m.name} — ${m.dosage}`).join('\n')}\n\n[!] ALLERGIES: ${patient.allergies.join(', ')}\nGROUPE SANGUIN: ${patient.bloodType}\n[AIDE IA] Attention interaction Amlodipine+Bisoprolol: surveiller FC\n\nTemps economise: ~1h30 grace a l'automatisation IA\n\n[Fiche assistee par IA — Validation medicale requise]`;
        if (docType === 'traitement') return `FICHE DE TRAITEMENT\n${'='.repeat(40)}\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\n\nMEDICAMENTS PRESCRITS:\n${patient.medications.map((m, i) => `  ${i + 1}. ${m.name}\n     Posologie: ${m.dosage}\n     Indication: ${m.purpose}`).join('\n\n')}\n\n[!] ALLERGIES: ${patient.allergies.join(', ')}\n\nINTERACTIONS A SURVEILLER:\n${patient.interactions.map(i => `  [${i.severity.toUpperCase()}] ${i.drugs.join(' + ')}: ${i.risk}`).join('\n')}\n\n[AIDE IA] Adapter Gliclazide pendant Ramadan (risque hypo x7.5)\n\n[Fiche assistee par IA — Verification medicale requise]`;
        return `FICHE D'EVALUATION COMPARATIVE\n${'='.repeat(40)}\nPatient: ${patient.firstName} ${patient.lastName} (${patient.id})\nDate: ${new Date().toLocaleDateString('fr-FR')}\n\nEVOLUTION DES MARQUEURS:\n  HbA1c:       8.1% -> 7.8%  [AMELIORATION]\n  TA syst.:    160  -> 150   [AMELIORATION]\n  Poids:       92kg -> 89kg  [PERTE -3kg]\n  LDL Chol.:   1.6  -> 1.8   [DETERIORATION]\n  Creatinine:  11   -> 12    [STABLE]\n\nSCORE GLOBAL: Amelioration moderee\n\nPOINTS POSITIFS:\n  - Baisse HbA1c\n  - Perte de poids\n  - Meilleur controle tensionnel\n\nPOINTS DE VIGILANCE:\n  [AIDE IA] LDL en hausse: revoir dose atorvastatine\n  [AIDE IA] Neuropathie debutante: EMG annuel\n\n[Evaluation assistee par IA — Decision medicale requise]`;
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
                        <div key={doc.id} className="card card-interactive" onClick={() => {
                            setSelectedDoc(doc); setGeneratedReport(''); setDisplayedReport(''); setEcgFile(null); setEcgResult(null); setAddedToDossier(false); setAiInput('');
                            // Pre-load mock scanner images for demo
                            const mockImages = { echography: '/mock-echo.png', radio: '/mock-echo.png' };
                            if (mockImages[doc.id]) { setEcgPreview(mockImages[doc.id]); } else { setEcgPreview(null); }
                        }} style={{ padding: 20, cursor: 'pointer' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-700)', marginBottom: 12 }}>{sz(doc.icon, 20)}</div>
                            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{doc.title}</h3>
                            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>{doc.description}</p>
                            <span className={`badge ${doc.badge}`}>{doc.status}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="fade-in">
                    <button className="btn btn-ghost" onClick={() => { setSelectedDoc(null); setGeneratedReport(''); setDisplayedReport(''); setAiInput(''); setEcgFile(null); setEcgPreview(null); setEcgResult(null); setAddedToDossier(false); }} style={{ marginBottom: 16 }}>
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
                                    {/* ECG HEADER */}
                                    <div style={{ background: 'linear-gradient(135deg, var(--severity-critical-bg) 0%, #fff1f2 100%)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 16, border: '1px solid var(--severity-critical-border)' }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>{sz(ICON.ecg, 18)} Analyse ECG — T-MECA + IA Explicable (Grad-CAM)</h4>
                                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Modele ResNet18 + Multi-Spectral Attention entraine sur MIT-BIH. Selectionnez un type de battement et lancez l'analyse.</p>

                                        {/* Signal selector */}
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <select className="form-input" value={ecgSignalType} onChange={e => setEcgSignalType(e.target.value)} style={{ height: 38, fontSize: 13, minWidth: 200 }}>
                                                <option value="Normal">N — Normal Beat</option>
                                                <option value="Supraventricular">S — Supraventricular Ectopic</option>
                                                <option value="Ventricular">V — Ventricular Ectopic</option>
                                                <option value="Fusion">F — Fusion Beat</option>
                                                <option value="Unknown">Q — Unknown / Paced</option>
                                            </select>
                                            <button className="btn btn-primary" onClick={analyzeEcg} disabled={ecgAnalyzing} style={{ background: 'var(--severity-critical)', gap: 6, height: 38 }}>
                                                {sz(ICON.ai, 14)} {ecgAnalyzing ? 'Analyse en cours...' : 'Analyser avec IA (XAI)'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* ECG CHART + XAI */}
                                    {ecgResult && (
                                        <div className="fade-in">
                                            {/* XAI Toggle */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <button className={`btn ${ecgXaiActive ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setEcgXaiActive(!ecgXaiActive)} style={{ gap: 6, fontSize: 12 }}>
                                                    {sz(ICON.ai, 14)} {ecgXaiActive ? 'Desactiver overlay XAI' : 'Activer l\'assistance IA (XAI)'}
                                                </button>
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Signal: 187 points — MIT-BIH — 360 Hz</span>
                                            </div>

                                            {/* 1D ECG Chart with XAI overlay */}
                                            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 16, border: '2px solid var(--border-default)' }}>
                                                <svg viewBox="0 0 800 200" style={{ width: '100%', height: 200, display: 'block' }}>
                                                    {/* ECG paper grid — fine pink lines */}
                                                    {Array.from({ length: 11 }, (_, i) => i * 20).map(y => <line key={`hf${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#fecaca" strokeWidth="0.3" />)}
                                                    {Array.from({ length: 41 }, (_, i) => i * 20).map(x => <line key={`vf${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#fecaca" strokeWidth="0.3" />)}
                                                    {/* Major grid lines */}
                                                    {[0, 40, 80, 120, 160, 200].map(y => <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke="#fca5a5" strokeWidth="0.5" />)}
                                                    {Array.from({ length: 21 }, (_, i) => i * 40).map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="200" stroke="#fca5a5" strokeWidth="0.5" />)}

                                                    {/* XAI attention bands (background) */}
                                                    {ecgXaiActive && ecgResult.explainability?.gradcam_1d && (() => {
                                                        const cam = ecgResult.explainability.gradcam_1d;
                                                        const nonZeroSignalLen = ecgResult.signal.findIndex((v, i) => i > 10 && v === 0 && ecgResult.signal[i+1] === 0 && ecgResult.signal[i+2] === 0);
                                                        const sigLen = nonZeroSignalLen > 0 ? nonZeroSignalLen : cam.length;
                                                        return cam.slice(0, sigLen).map((score, i) => {
                                                            if (score < 0.3) return null;
                                                            const x = (i / sigLen) * 800;
                                                            const w = 800 / sigLen + 0.5;
                                                            const r = Math.min(255, Math.round(score * 400));
                                                            const g = Math.max(0, Math.round((1 - score) * 180));
                                                            return <rect key={`xai${i}`} x={x} y="0" width={w} height="200" fill={`rgba(${r},${g},0,${score * 0.35})`} />;
                                                        });
                                                    })()}

                                                    {/* ECG signal line */}
                                                    {(() => {
                                                        const sig = ecgResult.signal;
                                                        const cam = ecgResult.explainability?.gradcam_1d || [];
                                                        const nonZeroLen = sig.findIndex((v, i) => i > 10 && v === 0 && sig[i+1] === 0 && sig[i+2] === 0);
                                                        const sigLen = nonZeroLen > 0 ? nonZeroLen : sig.length;
                                                        const pts = sig.slice(0, sigLen).map((v, i) => {
                                                            const x = (i / sigLen) * 800;
                                                            const y = 180 - v * 160;
                                                            return `${x},${y}`;
                                                        });
                                                        if (!ecgXaiActive) {
                                                            return <polyline points={pts.join(' ')} fill="none" stroke="#1e293b" strokeWidth="1.5" />;
                                                        }
                                                        // Color segments by attention
                                                        const segs = [];
                                                        for (let i = 0; i < sigLen - 1; i++) {
                                                            const x1 = (i / sigLen) * 800, y1 = 180 - sig[i] * 160;
                                                            const x2 = ((i+1) / sigLen) * 800, y2 = 180 - sig[i+1] * 160;
                                                            const sc = cam[i] || 0;
                                                            const color = sc > 0.6 ? '#ef4444' : sc > 0.3 ? '#f59e0b' : '#22c55e';
                                                            const sw = sc > 0.6 ? 3 : sc > 0.3 ? 2 : 1.5;
                                                            segs.push(<line key={`s${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={sw} />);
                                                        }
                                                        return segs;
                                                    })()}
                                                </svg>
                                                {/* Legend */}
                                                {ecgXaiActive && (
                                                    <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
                                                        <span style={{ fontSize: 10, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 3, background: '#22c55e', display: 'inline-block', borderRadius: 2 }} /> Normal</span>
                                                        <span style={{ fontSize: 10, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 3, background: '#f59e0b', display: 'inline-block', borderRadius: 2 }} /> Attention moderee</span>
                                                        <span style={{ fontSize: 10, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 3, background: '#ef4444', display: 'inline-block', borderRadius: 2 }} /> Attention elevee (zone diagnostique)</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* RESULTS GRID */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                                {/* Prediction */}
                                                <div className="card" style={{ border: '2px solid var(--severity-critical-border)' }}>
                                                    <div className="card-header"><h4 style={{ fontSize: 14, fontWeight: 600 }}>Prediction IA</h4><span className="badge badge-critical">{(ecgResult.prediction.confidence * 100).toFixed(1)}%</span></div>
                                                    <div className="card-body">
                                                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--severity-critical)', marginBottom: 12 }}>{ecgResult.prediction.class_name}</div>
                                                        {/* Class probabilities */}
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                            {Object.entries(ecgResult.prediction.probabilities).map(([name, prob]) => {
                                                                const pct = (prob * 100).toFixed(1);
                                                                const isMax = name === ecgResult.prediction.class_name;
                                                                return (
                                                                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                                                                        <span style={{ width: 90, fontWeight: isMax ? 700 : 400, color: isMax ? 'var(--severity-critical)' : 'var(--text-muted)' }}>{name}</span>
                                                                        <div style={{ flex: 1, height: 8, background: 'var(--neutral-100)', borderRadius: 4, overflow: 'hidden' }}>
                                                                            <div style={{ width: `${pct}%`, height: '100%', background: isMax ? 'var(--severity-critical)' : 'var(--primary-400)', borderRadius: 4, transition: 'width 0.5s ease' }} />
                                                                        </div>
                                                                        <span style={{ width: 40, textAlign: 'right', fontWeight: isMax ? 700 : 400 }}>{pct}%</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Uncertainty + Referral */}
                                                <div className="card">
                                                    <div className="card-header"><h4 style={{ fontSize: 14, fontWeight: 600 }}>Incertitude (MC-Dropout)</h4><span className="badge badge-info">{ecgResult.uncertainty.mc_passes} passes</span></div>
                                                    <div className="card-body">
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                                                <span>Entropie predictive</span>
                                                                <span style={{ fontWeight: 600 }}>{ecgResult.uncertainty.predictive_entropy.toFixed(4)}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                                                <span>Epistemique (modele)</span>
                                                                <span style={{ fontWeight: 600 }}>{ecgResult.uncertainty.epistemic.toFixed(4)}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                                                <span>Aleatoire (donnees)</span>
                                                                <span style={{ fontWeight: 600 }}>{ecgResult.uncertainty.aleatoric.toFixed(4)}</span>
                                                            </div>
                                                            <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 'var(--radius-md)', background: ecgResult.uncertainty.should_refer ? 'var(--severity-critical-bg)' : 'var(--severity-success-bg)', border: `1px solid ${ecgResult.uncertainty.should_refer ? 'var(--severity-critical-border)' : 'var(--severity-success-border)'}`, fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                                                                {ecgResult.uncertainty.should_refer
                                                                    ? '⚠️ Incertitude elevee — Referral recommande'
                                                                    : '✅ Confiance haute — Pas de referral necessaire'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Report */}
                                            <div style={{ padding: 16, background: 'var(--severity-warning-bg)', border: '1px solid var(--severity-warning-border)', borderRadius: 'var(--radius-lg)', marginBottom: 16 }}>
                                                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>{sz(ICON.ai, 16)} Rapport IA Indicatif</h4>
                                                <p style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                                                    L'IA suggere une morphologie de type <strong>{ecgResult.prediction.class_name}</strong> avec <strong>{(ecgResult.prediction.confidence * 100).toFixed(1)}%</strong> de confiance,
                                                    {ecgXaiActive ? ' basee sur les zones en rouge/jaune du trace ci-dessus.' : ' activez l\'overlay XAI pour visualiser les zones diagnostiques.'}
                                                    {ecgResult.uncertainty.should_refer && ' L\'incertitude du modele est elevee — un avis specialise est recommande.'}
                                                    {' '}Entropie predictive: {ecgResult.uncertainty.predictive_entropy.toFixed(4)}.
                                                    {' '}Analyse basee sur {ecgResult.uncertainty.mc_passes} passes MC-Dropout.
                                                </p>
                                            </div>

                                            {/* DISCLAIMER */}
                                            <div style={{ padding: '10px 16px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 'var(--radius-md)', fontSize: 12, fontWeight: 600, textAlign: 'center', color: '#854d0e' }}>
                                                ⚠️ A titre indicatif — La decision finale revient au medecin
                                            </div>

                                            {/* Add to dossier */}
                                            <div style={{ marginTop: 12 }}>
                                                <button className={`btn ${addedToDossier ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setAddedToDossier(true)} style={{ gap: 6 }}>
                                                    {addedToDossier ? <>{sz(ICON.check, 14)} Ajoute au dossier</> : <>{sz(ICON.download, 14)} Ajouter au dossier patient</>}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {/* ═══ STANDARDIZED 3-SECTION LAYOUT ═══ */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

                                        {/* SECTION 1: Observations du medecin */}
                                        <div style={{ background: isListening ? 'rgba(239,68,68,0.05)' : 'var(--neutral-50)', borderRadius: 'var(--radius-lg)', padding: 20, border: isListening ? '2px solid rgba(239,68,68,0.4)' : '1px solid var(--border-default)', transition: 'all 0.3s ease' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-700)', fontSize: 13, fontWeight: 700 }}>1</div>
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 600 }}>Observations du medecin</div>
                                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Input clinique et notes d'examen</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={toggleSpeech}
                                                    style={{
                                                        width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                                        background: isListening ? '#ef4444' : 'var(--primary-100)',
                                                        color: isListening ? 'white' : 'var(--primary-700)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'all 0.2s ease',
                                                        animation: isListening ? 'pulse 1.5s ease infinite' : 'none',
                                                        boxShadow: isListening ? '0 0 0 4px rgba(239,68,68,0.2)' : 'none'
                                                    }}
                                                    title={isListening ? 'Arreter la dictee' : 'Dicter les observations'}
                                                >
                                                    <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill={isListening ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                                        <line x1="12" y1="19" x2="12" y2="22" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {isListening && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '4px 10px', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', fontSize: 11, color: '#ef4444', fontWeight: 500 }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s ease infinite' }} />
                                                    Dictee en cours — parlez naturellement en francais...
                                                </div>
                                            )}
                                            <textarea
                                                className="form-textarea"
                                                style={{ minHeight: 140, fontSize: 12 }}
                                                placeholder={`Decrivez vos observations cliniques pour ${selectedDoc.title.toLowerCase()}...\n\nExemples :\n- Douleur epigastrique depuis 3 jours\n- Controle post-operatoire\n- Bilan de suivi diabete\n\nOu cliquez le micro pour dicter`}
                                                value={aiInput}
                                                onChange={e => setAiInput(e.target.value)}
                                            />
                                        </div>

                                        {/* SECTION 2: Upload document appareil */}
                                        <div style={{ background: 'var(--neutral-50)', borderRadius: 'var(--radius-lg)', padding: 20, border: '1px solid var(--border-default)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--severity-info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--severity-info)', fontSize: 13, fontWeight: 700 }}>2</div>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>Document appareil</div>
                                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Upload depuis echographe, radio, scanner...</div>
                                                </div>
                                            </div>
                                            {!ecgPreview ? (
                                                <label style={{ border: '2px dashed var(--border-default)', borderRadius: 'var(--radius-md)', padding: 30, textAlign: 'center', display: 'block', cursor: 'pointer', background: 'white', transition: 'all 0.2s ease' }}>
                                                    <input type="file" accept="image/*,.pdf,.dcm" onChange={handleEcgUpload} style={{ display: 'none' }} />
                                                    <div style={{ width: 32, height: 32, margin: '0 auto 8px', color: 'var(--text-muted)', opacity: 0.5 }}>{sz(ICON.upload, 32)}</div>
                                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Cliquez ou deposez un fichier</p>
                                                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Images, PDF, DICOM</p>
                                                </label>
                                            ) : (
                                                <div>
                                                    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 8, border: '1px solid var(--border-default)' }}>
                                                        <img src={ecgPreview} alt="Document" style={{ width: '100%', display: 'block', maxHeight: 140, objectFit: 'contain', background: '#111' }} />
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <span className="badge badge-success">Recu de l'appareil</span>
                                                            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{ecgFile ? ecgFile.name : 'Sonoscape S80'}</span>
                                                        </div>
                                                        <button className="btn btn-ghost btn-sm" onClick={() => { setEcgPreview(null); setEcgFile(null); }}>Changer</button>
                                                    </div>
                                                    {/* Body region selector */}
                                                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Zone corporelle :</span>
                                                        <select className="form-input" style={{ flex: 1, fontSize: 12, height: 32, padding: '0 8px' }} defaultValue="chest">
                                                            <option value="head">Tete / Neurologie</option>
                                                            <option value="chest">Thorax / Cardiovasculaire</option>
                                                            <option value="abdomen">Abdomen / Metabolisme</option>
                                                            <option value="leftArm">Bras gauche</option>
                                                            <option value="rightArm">Bras droit</option>
                                                            <option value="leftLeg">Jambe gauche</option>
                                                            <option value="rightLeg">Jambe droite</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SECTION 3: Aide a la decision — AI BUTTON */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => generateReport(selectedDoc.id)}
                                            disabled={isGenerating}
                                            style={{ gap: 8, padding: '10px 20px' }}
                                        >
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {sz(ICON.ai, 14)}
                                            </div>
                                            {isGenerating ? 'Generation IA en cours...' : 'Aide a la decision'}
                                        </button>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: 400 }}>
                                            L'IA genere un rapport base sur le dossier patient et vos observations. Vous pouvez modifier le texte genere avant d'exporter.
                                        </div>
                                    </div>

                                    {/* ═══ AI OUTPUT — EDITABLE ═══ */}
                                    {(displayedReport || isGenerating) && (
                                        <div className="fade-in" style={{ border: '2px solid var(--primary-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                            {/* Header */}
                                            <div style={{ background: 'var(--primary-50)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--primary-200)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span className={`badge ${isGenerating ? 'badge-warning' : 'badge-success'}`}>{isGenerating ? 'Generation IA...' : 'Rapport genere'}</span>
                                                    {!isGenerating && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Modifiable par le medecin</span>}
                                                </div>
                                                {!isGenerating && (
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        {/* PDF Export */}
                                                        <button className="btn btn-sm btn-secondary" style={{ gap: 4 }} onClick={() => {
                                                            const printWin = window.open('', '_blank');
                                                            printWin.document.write(`<!DOCTYPE html><html><head><title>Rapport Medical — ${patient.firstName} ${patient.lastName}</title><style>
                                                                @page { size: A4; margin: 20mm; }
                                                                body { font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.7; color: #1a1a1a; padding: 20px; }
                                                                .header { text-align: center; border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 20px; }
                                                                .header h1 { font-size: 16px; color: #0d9488; margin: 0; letter-spacing: 1px; }
                                                                .header p { font-size: 10px; color: #666; margin: 4px 0 0; }
                                                                .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 9px; color: #999; text-align: center; }
                                                                .signature { margin-top: 50px; display: flex; justify-content: flex-end; }
                                                                .signature div { text-align: center; border-top: 1px solid #333; padding-top: 8px; width: 200px; font-size: 10px; }
                                                                pre { white-space: pre-wrap; word-wrap: break-word; }
                                                            </style></head><body>
                                                            <div class="header"><h1>ALWARID — RAPPORT MEDICAL</h1><p>CHU Hassan II, Fes — Systeme d'aide a la decision medicale assiste par IA</p></div>
                                                            <pre>${generatedReport}</pre>
                                                            <div class="signature"><div>Signature du medecin</div></div>
                                                            <div class="footer">Document genere par Alwarid — ${new Date().toLocaleString('fr-FR')}<br/>Ce document a ete assiste par IA et valide par le medecin traitant.</div>
                                                            </body></html>`);
                                                            printWin.document.close();
                                                            setTimeout(() => printWin.print(), 300);
                                                        }}>
                                                            <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                            PDF
                                                        </button>
                                                        {/* Word Export */}
                                                        <button className="btn btn-sm btn-secondary" style={{ gap: 4 }} onClick={() => {
                                                            const blob = new Blob([
                                                                `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><style>body{font-family:'Courier New',monospace;font-size:11pt;line-height:1.7;} h1{text-align:center;color:#0d9488;font-size:14pt;border-bottom:2pt solid #0d9488;padding-bottom:10pt;} .sub{text-align:center;font-size:9pt;color:#666;} .footer{margin-top:30pt;border-top:1pt solid #ddd;padding-top:8pt;font-size:8pt;color:#999;text-align:center;} pre{white-space:pre-wrap;}</style></head><body><h1>ALWARID — RAPPORT MEDICAL</h1><p class="sub">CHU Hassan II, Fes — Systeme d'aide a la decision medicale</p><pre>${generatedReport}</pre><div class="footer">Document genere par Alwarid — ${new Date().toLocaleString('fr-FR')}</div></body></html>`
                                                            ], { type: 'application/msword' });
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = `Rapport_${selectedDoc.title.replace(/\s/g, '_')}_${patient.lastName}_${new Date().toISOString().slice(0, 10)}.doc`;
                                                            a.click();
                                                            URL.revokeObjectURL(url);
                                                        }}>
                                                            <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" /><path d="M14 2v6h6" /><path d="M9 15l2 2 4-4" /></svg>
                                                            Word
                                                        </button>
                                                        {/* Add to dossier */}
                                                        <button className={`btn btn-sm ${addedToDossier ? 'btn-secondary' : 'btn-primary'}`} style={{ gap: 4 }} onClick={() => setAddedToDossier(true)}>
                                                            {addedToDossier ? <>{sz(ICON.check, 14)} Ajoute</> : <>{sz(ICON.download, 14)} Dossier</>}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Editable report content */}
                                            {isGenerating ? (
                                                <div style={{ padding: 20 }}>
                                                    <pre style={{ fontSize: 12, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{displayedReport}|</pre>
                                                </div>
                                            ) : (
                                                <textarea
                                                    style={{
                                                        width: '100%', minHeight: 400, padding: 20, border: 'none', outline: 'none', resize: 'vertical',
                                                        fontSize: 12, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace",
                                                        color: 'var(--text-secondary)', background: 'white'
                                                    }}
                                                    value={generatedReport}
                                                    onChange={e => setGeneratedReport(e.target.value)}
                                                />
                                            )}
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
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMed, setNewMed] = useState({ name: '', dosage: '', purpose: '' });

    const addMed = () => {
        if (!newMed.name) return;
        setPrescriptions(prev => [...prev, { ...newMed, selected: true }]);
        setNewMed({ name: '', dosage: '', purpose: '' });
        setShowAddForm(false);
    };
    const removeMed = (idx) => setPrescriptions(prev => prev.filter((_, i) => i !== idx));

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
                        <button className="btn btn-sm btn-secondary" onClick={() => setShowAddForm(!showAddForm)}>+ Ajouter medicament</button>
                    </div>
                    {showAddForm && (
                        <div className="fade-in" style={{ padding: 16, borderBottom: '2px solid var(--primary-200)', background: 'var(--primary-50)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                                <input className="form-input" placeholder="Nom du medicament" value={newMed.name} onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))} />
                                <input className="form-input" placeholder="Posologie" value={newMed.dosage} onChange={e => setNewMed(p => ({ ...p, dosage: e.target.value }))} />
                                <input className="form-input" placeholder="Indication" value={newMed.purpose} onChange={e => setNewMed(p => ({ ...p, purpose: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-sm btn-primary" onClick={addMed}>Ajouter</button>
                                <button className="btn btn-sm btn-ghost" onClick={() => setShowAddForm(false)}>Annuler</button>
                            </div>
                        </div>
                    )}
                    <div style={{ padding: 0 }}>
                        {prescriptions.map((med, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <input type="checkbox" checked={med.selected} onChange={() => setPrescriptions(prev => prev.map((p, j) => j === i ? { ...p, selected: !p.selected } : p))} style={{ width: 18, height: 18, accentColor: 'var(--primary-600)' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{med.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{med.dosage} — {med.purpose}</div>
                                </div>
                                <button className="btn btn-ghost btn-icon" onClick={() => removeMed(i)} style={{ color: 'var(--severity-critical)', padding: 4 }}>
                                    <svg style={{ width: 14, height: 14 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            </div>
                        ))}
                        {prescriptions.length === 0 && <div className="empty-state" style={{ padding: 20 }}><p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Aucun medicament. Cliquez "+ Ajouter" pour prescrire.</p></div>}
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
                                    {Array.from({ length: 64 }).map((_, i) => (<div key={i} style={{ background: ((i * 7 + 3) % 11) > 5 ? 'var(--primary-800)' : 'white', borderRadius: 1 }} />))}
                                </div>
                                <div className="badge badge-success" style={{ marginBottom: 8 }}>Actif — {prescriptions.filter(p => p.selected).length} medicaments</div>
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
    const [displayedResponse, setDisplayedResponse] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [usedMistral, setUsedMistral] = useState(false);
    const examplePrompts = ['Resume complet du dossier patient', 'Contre-indications pour ce patient?', 'Interactions medicamenteuses a surveiller', 'Risque si on prescrit Ibuprofene?', 'Quels examens sont dus?', 'Comparer les dernieres visites'];
    const handleQuery = async (query) => {
        const q = query || prompt;
        if (!q.trim() || isTyping) return;
        setPrompt(q);
        setIsTyping(true);
        setDisplayedResponse('');
        setUsedMistral(false);

        try {
            const { buildPatientContext, SYSTEM_PROMPTS } = await import('@/data/prompts');
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt: SYSTEM_PROMPTS.AI_ANALYSIS,
                    userMessage: q,
                    patientContext: buildPatientContext(patient)
                })
            });

            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) throw new Error('fallback');

            setUsedMistral(true);
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
                            setDisplayedResponse(fullText);
                        }
                    } catch { }
                }
            }
            setIsTyping(false);
        } catch {
            // Fallback: local responses
            const resp = getLocalAnalysis(q);
            let i = 0;
            const interval = setInterval(() => {
                i += 4;
                setDisplayedResponse(resp.slice(0, i));
                if (i >= resp.length) { clearInterval(interval); setIsTyping(false); }
            }, 6);
        }
    };

    const getLocalAnalysis = (q) => {
        if (q.toLowerCase().includes('resume') || q.toLowerCase().includes('dossier')) {
            return `RESUME DOSSIER — ${patient.firstName} ${patient.lastName}\n${'='.repeat(45)}\n\nIDENTITE\n  Age: ${patient.age} ans | Sexe: ${patient.sex} | Groupe: ${patient.bloodType}\n  Taille: ${patient.height} | Poids: ${patient.weight}\n\nALLERGIES: ${patient.allergies.join(', ')}\n\nPATHOLOGIES ACTIVES (${patient.conditions.length}):\n${patient.conditions.map(c => `  [${c.severity.toUpperCase()}] ${c.name} — ${c.details} (depuis ${c.since})`).join('\n')}\n\nMEDICAMENTS (${patient.medications.length}):\n${patient.medications.map(m => `  ${m.name} — ${m.dosage} (${m.purpose})`).join('\n')}\n\nINTERACTIONS CRITIQUES (${patient.interactions.length}):\n${patient.interactions.map(i => `  [!] ${i.drugs.join(' + ')}: ${i.risk}`).join('\n')}\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('contre-indication')) {
            return `CONTRE-INDICATIONS — ${patient.firstName} ${patient.lastName}\n${'='.repeat(45)}\n\nALLERGIES CONFIRMEES:\n  [ABSOLU] Penicilline et derives\n  [ABSOLU] Sulfamides\n\nCONTRE-INDICATIONS LIEES AUX PATHOLOGIES:\n  Diabete type 2:\n    - Corticoides systemiques\n    - Gliclazide pendant jeune prolonge\n  HTA stade 2:\n    - AINS prolonges\n    - Vasoconstricteurs nasaux\n\nALLERGIES CROISEES POSSIBLES:\n  - Cephalosporines (~10%)\n  - Thiazidiques (derives sulfamides)\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('interaction')) {
            return `INTERACTIONS MEDICAMENTEUSES\n${'='.repeat(45)}\n\n${patient.interactions.map(i => `[${i.severity.toUpperCase()}] ${i.drugs.join(' + ')}\n  Risque: ${i.risk}\n  Source: ${i.source}`).join('\n\n')}\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('ibuprofene') || q.toLowerCase().includes('prescrire')) {
            return `ANALYSE RISQUE — Prescription Ibuprofene\n${'='.repeat(45)}\n\nRISQUES:\n  [CRITIQUE] Interaction Ibuprofene + Amlodipine\n  [ATTENTION] Risque renal (patient diabetique)\n  [ATTENTION] Risque gastrique (${patient.age} ans)\n\nALTERNATIVES:\n  1. Paracetamol 1g\n  2. Tramadol 50mg\n  3. Infiltration locale\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        } else if (q.toLowerCase().includes('examen') || q.toLowerCase().includes('dus')) {
            return `EXAMENS DUS\n${'='.repeat(45)}\n\n  [EN RETARD] HbA1c trimestriel — du 08/04/2026\n  [DU] ECG de controle — dernier il y a 21 mois!\n  [PLANIFIE] Fond d'oeil annuel — Nov 2026\n  [PLANIFIE] Bilan lipidique — Juil 2026\n  [RECOMMANDE] EMG membres inferieurs\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
        }
        return `ANALYSE — "${q}"\n${'='.repeat(45)}\n\n  ${patient.conditions.length} pathologies actives\n  ${patient.medications.length} medicaments\n  ${patient.interactions.length} interactions\n  Allergies: ${patient.allergies.join(', ')}\n\n[Aide a la decision — La decision finale revient au medecin traitant]`;
    };

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>{sz(ICON.ai, 20)} Analyse IA du Dossier</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Interrogez le dossier patient avec l'IA. Aucune donnee n'est envoyee a l'exterieur.</p>
            <div className="card" style={{ marginBottom: 16 }}><div className="card-body">
                <textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Posez une question sur le dossier du patient..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleQuery())} />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>{examplePrompts.map((p, i) => <button key={i} className="pill" onClick={() => handleQuery(p)}>{p}</button>)}</div>
                <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => handleQuery()} disabled={isTyping}>{isTyping ? 'Analyse en cours...' : 'Analyser'}</button>
            </div></div>
            {(displayedResponse || isTyping) && (<div className="card fade-in"><div className="card-header"><span className={`badge ${isTyping ? 'badge-warning' : 'badge-success'}`}>{isTyping ? 'Analyse IA...' : 'Reponse IA'}</span><span className="badge badge-info">{usedMistral ? 'Mistral AI — RAG' : 'Local — Aucune donnee envoyee'}</span></div>
                <div className="card-body"><pre style={{ fontSize: 13, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{displayedResponse}{isTyping ? '|' : ''}</pre></div>
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
