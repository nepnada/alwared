'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';

const UrgenceMode = dynamic(() => import('@/components/modes/UrgenceMode'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div> });
const ConsultationMode = dynamic(() => import('@/components/modes/ConsultationMode'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div> });
const SuiviMode = dynamic(() => import('@/components/modes/SuiviMode'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div> });
const TransfertMode = dynamic(() => import('@/components/modes/TransfertMode'), { ssr: false, loading: () => <div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div> });

function DashboardContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'consultation';

    const renderMode = () => {
        switch (mode) {
            case 'urgence': return <UrgenceMode />;
            case 'consultation': return <ConsultationMode />;
            case 'suivi': return <SuiviMode />;
            case 'transfert': return <TransfertMode />;
            default: return <ConsultationMode />;
        }
    };

    return (
        <>
            <Header mode={mode} patientName="Youssef El Amrani" patientId="PAT-2024-00147" />
            {renderMode()}
        </>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Chargement...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
