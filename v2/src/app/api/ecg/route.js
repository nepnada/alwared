import { NextResponse } from 'next/server';

const FLASK_URL = process.env.ECG_API_URL || 'http://localhost:5050';

export async function POST(request) {
    try {
        const body = await request.json();

        const response = await fetch(`${FLASK_URL}/api/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Flask API error' }));
            return NextResponse.json(error, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: `Impossible de joindre le serveur ECG (${FLASK_URL}). Lancez: cd T-MECA/interface && python app.py` },
            { status: 503 }
        );
    }
}
