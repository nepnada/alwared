// ═══════════════════════════════════════════════════════════
// SihhaTek — useAI Hook (streaming Mistral via API route)
// ═══════════════════════════════════════════════════════════
'use client';
import { useState, useCallback, useRef } from 'react';
import { SYSTEM_PROMPTS, buildPatientContext } from '@/data/prompts';
import { MOCK_PATIENTS } from '@/data/mockData';

const patient = MOCK_PATIENTS[0];

/**
 * Hook pour interagir avec Mistral AI via la route /api/ai
 * @param {string} promptType - Cle dans SYSTEM_PROMPTS (ex: 'URGENCE_CHATBOT')
 * @returns {{ query, response, isStreaming, error, streamQuery }}
 */
export function useAI(promptType = 'AI_ANALYSIS') {
    const [response, setResponse] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    const streamQuery = useCallback(async (userMessage) => {
        if (!userMessage?.trim()) return;

        // Abort any previous stream
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setIsStreaming(true);
        setResponse('');
        setError(null);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt: SYSTEM_PROMPTS[promptType] || SYSTEM_PROMPTS.AI_ANALYSIS,
                    userMessage,
                    patientContext: buildPatientContext(patient)
                }),
                signal: controller.signal
            });

            // If the response is JSON (error), handle it
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                const data = await res.json();
                setError(data.error || 'Erreur inconnue');
                setIsStreaming(false);
                return;
            }

            // Parse SSE stream
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
                            setResponse(fullText);
                        }
                        if (parsed.error) {
                            setError(parsed.error);
                        }
                    } catch {
                        // Skip
                    }
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(`Erreur de connexion: ${err.message}`);
            }
        } finally {
            setIsStreaming(false);
        }
    }, [promptType]);

    const stopStream = useCallback(() => {
        if (abortRef.current) abortRef.current.abort();
        setIsStreaming(false);
    }, []);

    return { response, isStreaming, error, streamQuery, stopStream };
}
