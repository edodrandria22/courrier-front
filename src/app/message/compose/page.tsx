import { ComposeForm } from '@/features/messages/components/form/ComposeForm'
import { redirect } from 'next/navigation'

interface ComposePageProps {
  searchParams: Promise<{ courrierId?: string; reference?: string; objet?: string }>
}

export default async function ComposePage({ searchParams }: ComposePageProps) {
  const { courrierId, reference, objet } = await searchParams
  const id = Number(courrierId)

  if (!courrierId || isNaN(id) || id <= 0) {
    redirect('/message/courrier/receive')
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-8 flex justify-center">
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ComposeForm
            courrierId={id}
            courrierReference={reference}
            courrierObjet={objet}
          />
        </div>
      </main>
    </div>
  )
}
