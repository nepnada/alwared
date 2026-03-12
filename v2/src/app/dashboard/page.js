'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { MOCK_PATIENTS, HISTORY_TYPES, formatDate } from '@/data/mockData';

// Dynamic import for 3D components (client-only)
const BodyViewer3D = dynamic(() => import('@/components/BodyViewer3D').then(m => ({ default: m.BodyViewer3D })), { ssr: false });
const BodyViewerMini = dynamic(() => import('@/components/BodyViewer3D').then(m => ({ default: m.BodyViewerMini })), { ssr: false });

const patient = MOCK_PATIENTS[0];

const TABS = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg> },
    { id: 'history', label: 'Historique Medical', icon: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> },
    { id: 'imagerie', label: 'Imagerie et Documents', icon: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg> },
    { id: 'body3d', label: 'Cartographie 3D', icon: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> },
    { id: 'ai', label: 'Analyse IA', icon: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg> },
];

function getTypeIcon(type) {
    const icons = {
        consultation: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /></svg>,
        analyse: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>,
        vaccination: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>,
        urgence: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5" /><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" /></svg>,
        imagerie: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>,
        operation: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>,
        medicament: <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>,
    };
    return icons[type] || icons.consultation;
}

function RegionDetail({ regionKey }) {
    const region = patient.bodyRegions[regionKey];
    if (!region) return null;

    const sevLabels = { critical: 'Critique', warning: 'Attention', caution: 'Surveillance', stable: 'Stable', info: 'Information' };
    const sevBadge = { critical: 'badge-critical', warning: 'badge-warning', caution: 'badge-neutral', stable: 'badge-success', info: 'badge-info' };

    return (
        <div className="region-card">
            <div className="region-card-title">
                <span className={`severity-dot ${region.severity === 'caution' ? 'warning' : region.severity}`} />
                {region.label}
                <span className={`badge ${sevBadge[region.severity] || 'badge-neutral'}`}>{sevLabels[region.severity]}</span>
            </div>
            {region.conditions.length > 0 && (
                <div className="region-card-body">
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Conditions</div>
                    <ul>{region.conditions.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
            )}
            {region.operations?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Operations</div>
                    {region.operations.map((op, i) => (
                        <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                            {op.name}<br /><span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{op.date} — {op.hospital} — {op.surgeon}</span>
                        </div>
                    ))}
                </div>
            )}
            {region.scans?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 6 }}>Imagerie</div>
                    {region.scans.map((s, i) => (
                        <div key={i} className="scan-thumb">
                            <div className="scan-thumb-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                            </div>
                            <div>
                                <div className="scan-title">{s.type}</div>
                                <div className="scan-meta">{s.date} — {s.lab}</div>
                                <div className="scan-meta">{s.doctor} — {s.result}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {region.medications?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4 }}>Medicaments</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {region.medications.map((m, i) => <span key={i} className="tag">{m}</span>)}
                    </div>
                </div>
            )}
            {region.notes && (
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}><em>{region.notes}</em></div>
            )}
        </div>
    );
}

function DashboardInner() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'urgence';
    const [activeTab, setActiveTab] = useState('overview');
    const [historyFilter, setHistoryFilter] = useState('all');
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [uploadOpen, setUploadOpen] = useState(false);

    const filteredHistory = historyFilter === 'all'
        ? patient.history
        : patient.history.filter(h => h.type === historyFilter);

    const allScans = [];
    Object.values(patient.bodyRegions).forEach(region => {
        region.scans.forEach(scan => allScans.push({ ...scan, regionLabel: region.label }));
    });
    allScans.sort((a, b) => b.date.localeCompare(a.date));

    const handleRegionSelect = (key) => {
        setSelectedRegion(key);
        if (activeTab !== 'body3d') setActiveTab('body3d');
    };

    return (
        <>
            <Header showMode modeName={mode} patientName="Youssef El Amrani" patientId="PAT-2024-00147" />

            {/* Tab Nav */}
            <nav className="tab-nav">
                {TABS.map(tab => (
                    <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            {/* TAB: Overview */}
            {activeTab === 'overview' && (
                <div className="fade-in" style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
                    <div className="overview-grid">
                        <div className="overview-left">
                            {/* Patient Info */}
                            <div className="patient-info-card">
                                <div className="patient-info-header">
                                    <div className="patient-photo">YA</div>
                                    <div>
                                        <div className="patient-name">Youssef El Amrani</div>
                                        <div className="patient-id">PAT-2024-00147</div>
                                    </div>
                                </div>
                                <div className="patient-info-grid">
                                    {[
                                        ['Age', '58 ans'], ['Sexe', 'Homme'], ['Gr. sanguin', 'A+'],
                                        ['Taille', '174 cm'], ['Poids', '89 kg'], ['Ville', 'Fes']
                                    ].map(([label, value]) => (
                                        <div key={label} className="patient-info-item">
                                            <div className="label">{label}</div>
                                            <div className="value">{value}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)' }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 6 }}>Allergies</div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {patient.allergies.map(a => <span key={a} className="badge badge-critical">{a}</span>)}
                                    </div>
                                </div>
                            </div>

                            {/* Mini 3D */}
                            <div className="card body-mini-preview" onClick={() => setActiveTab('body3d')}>
                                <Suspense fallback={<div className="skeleton" style={{ width: '100%', height: '100%' }} />}>
                                    <BodyViewerMini onRegionSelect={handleRegionSelect} regions={patient.bodyRegions} />
                                </Suspense>
                                <div className="body-mini-overlay">
                                    <button className="btn btn-secondary btn-sm">Ouvrir la cartographie 3D</button>
                                </div>
                            </div>
                        </div>

                        <div className="overview-right">
                            {/* Alerts */}
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <svg style={{ width: 18, height: 18, color: 'var(--severity-critical)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
                                    </svg>
                                    Alertes critiques
                                </h3>
                                <div className="alert-list">
                                    {patient.interactions.map((inter, i) => (
                                        <div key={i} className={`alert alert-${inter.severity}`}>
                                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
                                            </svg>
                                            <div className="alert-content">
                                                <div className="alert-title">{inter.drugs.join(' + ')}</div>
                                                <div className="alert-text">{inter.risk}</div>
                                                <div className="source-tag" style={{ marginTop: 6 }}>Source : {inter.source}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Conditions */}
                            <div className="card">
                                <div className="card-header"><h3 style={{ fontSize: 14, fontWeight: 600 }}>Conditions actives</h3></div>
                                <div className="card-body" style={{ padding: 0 }}>
                                    <table className="data-table">
                                        <thead><tr><th>Condition</th><th>Depuis</th><th>Statut</th></tr></thead>
                                        <tbody>
                                            {patient.conditions.map((c, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</td>
                                                    <td className="text-mono">{c.since}</td>
                                                    <td><span className={`badge badge-${c.severity === 'critical' ? 'critical' : 'warning'}`}>{c.severity === 'critical' ? 'Critique' : 'Attention'}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Medications */}
                            <div className="card">
                                <div className="card-header">
                                    <h3 style={{ fontSize: 14, fontWeight: 600 }}>Medicaments en cours</h3>
                                    <span className="badge badge-neutral">{patient.medications.length} medicaments</span>
                                </div>
                                <div className="card-body" style={{ padding: 0 }}>
                                    <table className="data-table">
                                        <thead><tr><th>Medicament</th><th>Posologie</th><th>Indication</th></tr></thead>
                                        <tbody>
                                            {patient.medications.map((m, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{m.name}</td>
                                                    <td>{m.dosage}</td>
                                                    <td>{m.purpose}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: History */}
            {activeTab === 'history' && (
                <div className="fade-in" style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Historique Medical</h2>
                        <div className="pill-group">
                            {['all', 'consultation', 'vaccination', 'operation', 'imagerie', 'analyse', 'urgence'].map(type => (
                                <button key={type} className={`pill ${historyFilter === type ? 'active' : ''}`} onClick={() => setHistoryFilter(type)}>
                                    {type === 'all' ? 'Tout' : HISTORY_TYPES[type]?.label || type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="timeline">
                        {filteredHistory.map((entry, i) => {
                            const typeInfo = HISTORY_TYPES[entry.type] || { label: entry.type, color: 'info' };
                            return (
                                <div key={i} className="timeline-item" style={{ animationDelay: `${i * 50}ms` }}>
                                    <div className={`timeline-dot ${typeInfo.color}`}>{getTypeIcon(entry.type)}</div>
                                    <div className="timeline-content">
                                        <div className="timeline-date">{formatDate(entry.date)}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                            <div className="timeline-title">{entry.title}</div>
                                            <span className={`badge badge-${typeInfo.color}`}>{typeInfo.label}</span>
                                        </div>
                                        <div className="timeline-meta">
                                            <svg style={{ width: 12, height: 12, color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            {entry.doctor} — {entry.hospital}
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{entry.details}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: Imagerie */}
            {activeTab === 'imagerie' && (
                <div className="fade-in" style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Imagerie et Documents</h2>
                        <button className="btn btn-primary" onClick={() => setUploadOpen(true)}>
                            <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                            </svg>
                            Ajouter un document
                        </button>
                    </div>
                    <div className="image-grid">
                        {allScans.map((scan, i) => (
                            <div key={i} className="image-card" style={{ animationDelay: `${i * 60}ms`, animation: 'fadeInUp 0.4s ease both' }}>
                                <div className="image-card-preview">
                                    <svg style={{ width: 32, height: 32 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                </div>
                                <div className="image-card-info">
                                    <div className="image-title">{scan.type}</div>
                                    <div className="image-meta">{formatDate(scan.date)}</div>
                                    <div className="image-meta">{scan.lab}</div>
                                    <div className="image-meta">{scan.doctor}</div>
                                    <div style={{ marginTop: 4 }}><span className="tag" style={{ fontSize: 10 }}>{scan.regionLabel}</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB: 3D Body */}
            {activeTab === 'body3d' && (
                <div className="body-3d-full" style={{ animation: 'fadeIn 0.3s ease both' }}>
                    <div className="body-3d-viewport">
                        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><div className="skeleton" style={{ width: 200, height: 300 }} /></div>}>
                            <BodyViewer3D onRegionSelect={handleRegionSelect} regions={patient.bodyRegions} />
                        </Suspense>
                        <div className="viewport-sidebar">
                            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 4, padding: '0 8px' }}>Anatomie</div>
                            {['Externe', 'Musculaire', 'Squelette', 'Organes'].map((layer, i) => (
                                <button key={layer} className={`layer-toggle ${i === 0 ? 'active' : ''}`}>{layer}</button>
                            ))}
                        </div>
                        <div className="viewport-controls-bar">
                            <button className="btn btn-secondary btn-sm active">Face</button>
                            <button className="btn btn-secondary btn-sm">Dos</button>
                            <button className="btn btn-secondary btn-sm">Profil</button>
                            <button className="btn btn-secondary btn-sm">Reset</button>
                            <button className="btn btn-secondary btn-sm">Auto-rotation</button>
                        </div>
                    </div>
                    <div className="body-3d-sidebar" id="body3dSidebar">
                        <h3>{selectedRegion ? patient.bodyRegions[selectedRegion]?.label || 'Region' : 'Selectionnez une zone'}</h3>
                        {!selectedRegion && (
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                Cliquez sur une partie du corps 3D pour afficher les details medicaux associes.
                            </p>
                        )}
                        {selectedRegion && <RegionDetail regionKey={selectedRegion} />}
                        <div style={{ marginTop: 16 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--text-muted)', marginBottom: 8 }}>Legende</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="severity-dot critical" /> Critique</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="severity-dot warning" /> Attention</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--severity-warning)', opacity: .6, flexShrink: 0 }} /> Surveillance</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="severity-dot success" /> Stable</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="severity-dot info" /> Information</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: AI */}
            {activeTab === 'ai' && (
                <div className="fade-in" style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Analyse IA</h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                        Decrivez les symptomes observes. L&apos;IA croisera avec le dossier patient pour mettre en evidence les informations pertinentes.
                    </p>
                    <div className="ai-prompt-area">
                        <div className="ai-prompt-input-row">
                            <textarea className="form-textarea" placeholder="Decrivez les symptomes du patient..." style={{ border: 'none', minHeight: 80, flex: 1 }} />
                            <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                                <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                Analyser
                            </button>
                        </div>
                        <div className="ai-example-chips">
                            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 4 }}>Exemples :</span>
                            {['Quelles sont les allergies ?', 'Interactions medicamenteuses ?', 'Antecedents cardiovasculaires ?', 'Patient peut-il jeuner ?'].map(q => (
                                <button key={q} className="ai-chip" onClick={(e) => {
                                    const textarea = e.target.closest('.ai-prompt-area').querySelector('textarea');
                                    if (textarea) textarea.value = q;
                                }}>{q}</button>
                            ))}
                        </div>
                        <div className="ai-response-area">
                            <div className="empty-state" style={{ padding: 40 }}>
                                <svg style={{ width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                                </svg>
                                <h3>En attente d&apos;une requete</h3>
                                <p>Saisissez les symptomes ou posez une question pour recevoir une analyse contextuelle du dossier patient.</p>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        marginTop: 16, padding: '12px 16px', background: 'var(--severity-warning-bg)',
                        border: '1px solid var(--severity-warning-border)', borderRadius: 'var(--radius-md)',
                        fontSize: 12, color: 'var(--severity-warning)', display: 'flex', alignItems: 'center', gap: 8
                    }}>
                        <svg style={{ width: 16, height: 16, flexShrink: 0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
                        </svg>
                        Cet outil est une aide a la decision. La decision finale revient au medecin traitant.
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {uploadOpen && (
                <div className="modal-overlay open" onClick={() => setUploadOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Ajouter un document</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setUploadOpen(false)}>
                                <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="upload-zone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" />
                                </svg>
                                <div className="upload-zone-text">Glissez un fichier ici ou cliquez pour parcourir</div>
                                <div className="upload-zone-sub">PNG, JPG, PDF, DICOM — Max 50 Mo</div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Type de document</label>
                                <select className="form-select">
                                    <option>Scanner</option><option>Radiographie</option><option>IRM</option>
                                    <option>Echographie</option><option>ECG</option><option>Photo</option><option>Analyse biologique</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setUploadOpen(false)}>Annuler</button>
                            <button className="btn btn-primary">Envoyer</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div className="skeleton" style={{ width: 200, height: 20 }} /></div>}>
            <DashboardInner />
        </Suspense>
    );
}
