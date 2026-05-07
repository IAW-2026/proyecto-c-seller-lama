import Link from 'next/link';

export default function PanelPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Volver
          </Link>
          <h1 className="text-4xl font-bold">Panel de Administración</h1>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 text-slate-400">
          <p>Panel administrativo - En desarrollo</p>
        </div>
      </div>
    </main>
  );
}
