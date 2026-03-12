'use client';
import Link from 'next/link';

export default function Header({ showMode, modeName, patientName, patientId, showBackToSearch }) {
    return (
        <header className="app-header">
            <Link href="/" className="app-logo" style={{ textDecoration: 'none' }}>
                <div className="app-logo-mark">S</div>
                <span className="app-logo-text">SihhaTek</span>
            </Link>
            <div className="app-header-right">
                {showMode && (
                    <span className={`mode-badge ${modeName || 'urgence'}`}>
                        <svg style={{ width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5" />
                            <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7" />
                        </svg>
                        {modeName ? modeName.charAt(0).toUpperCase() + modeName.slice(1) : 'Urgence'}
                    </span>
                )}
                {patientName && (
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {patientName}{' '}
                        {patientId && <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>{patientId}</span>}
                    </div>
                )}
                <div className="disclaimer-bar">
                    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" /><path d="M12 17h.01" />
                    </svg>
                    La decision revient au medecin traitant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="user-avatar">MA</div>
                    {!showBackToSearch && (
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>Dr. M. Aloui</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Urgentiste</div>
                        </div>
                    )}
                    <Link href="/" className="btn btn-ghost btn-icon" title="Deconnexion" style={{ color: 'var(--text-muted)', marginLeft: 4 }}>
                        <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </Link>
                </div>
            </div>
        </header>
    );
}
