import { CourrierForm } from '@/features/courriers/components/form/CourrierForm';

export default function CourrierPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <CourrierForm />
            </div>
        </main>
    );
}