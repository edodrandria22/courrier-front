'use client'
import { useEffect, useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { MessageList } from '../components/list/MessageList';
import { LoadingScreen } from '@/components/loading/loading';

export const MessageTemplate = () => {
    const { messages, loading, fetchMessages} = useMessages('received');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleSelect = (id: string, checked: boolean) => {
        const next = new Set(selectedIds);
        checked ? next.add(id) : next.delete(id);
        setSelectedIds(next);
    };

    if (loading) return (
        <LoadingScreen label="Synchronisation en cours" />
    );

    return (
        <main className="flex-1 bg-background text-foreground min-h-screen">
            <div className="p-4 border-b border-border font-bold uppercase tracking-widest flex justify-between items-center">
                <span>Messages Reçus</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {messages?.length ?? 0}
                </span>
            </div>

            <div className="animate-in fade-in duration-500">
                <MessageList
                    messages={messages}
                    selectedIds={selectedIds}
                    onSelect={handleSelect}

                />
            </div>
        </main>
    );
}
