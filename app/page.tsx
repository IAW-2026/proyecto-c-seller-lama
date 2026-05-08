import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { PageContainer } from '@/components/ui/PageContainer';

const PRIMARY_COLOR = '#515922';

export default function Home() {
  // TODO: Cuando Clerk esté configurado, esta lógica debería ser:
  // if (isSignedIn) {
  //   redirect('/dashboard');
  // }
  
  return (
    <main className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-amber-50 border-b border-slate-200">
        <PageContainer>
          <div className="flex items-center justify-between py-6">
            <h1 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>
              LAMA seller app
            </h1>
            
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </PageContainer>
      </header>

      {/* Contenido principal */}
      <PageContainer>
        <div className="py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4" style={{ color: PRIMARY_COLOR }}>
              Bienvenido a LAMA seller app
            </h2>
            <p className="text-slate-600 text-lg mb-12">
              Inicia sesión o crea una cuenta para continuar
            </p>
            
            <Show when="signed-out">
              <div className="flex gap-4 justify-center">
                <SignInButton mode="modal">
                  <span 
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 border-2 inline-block cursor-pointer"
                    style={{ 
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR
                    }}
                  >
                    Iniciar sesión
                  </span>
                </SignInButton>
                <SignUpButton mode="modal">
                  <span 
                    className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-white inline-block cursor-pointer"
                    style={{ 
                      backgroundColor: PRIMARY_COLOR
                    }}
                  >
                    Registrarse
                  </span>
                </SignUpButton>
              </div>
            </Show>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
