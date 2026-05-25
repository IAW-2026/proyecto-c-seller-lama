import { SignUp } from '@clerk/nextjs';
import { PageContainer } from '@/components/ui/PageContainer';

export default function SignUpPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-[#f6f1e7] to-white relative min-h-screen">
      {/* Spacer for fixed navbar */}
      <div className="h-14 md:h-[56px]" />
      <PageContainer>
        <div className="py-12 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="w-full max-w-md">
            {/* Branding */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-[#37413d] mb-1">
                LAMA seller
              </h1>
              <p className="text-[#6f7f6d] text-sm">
                Crea tu cuenta para comenzar
              </p>
            </div>

            {/* Clerk SignUp Form */}
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white rounded-xl shadow-lg border border-[#8fa18d]/10",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  dividerLine: "bg-[#8fa18d]/10",
                  dividerText: "text-[#6f7f6d]",
                  formFieldInput: "rounded-lg border-2 border-[#8fa18d]/20 focus:border-[#8fa18d]",
                  formButtonPrimary: "bg-[#8fa18d] hover:bg-[#6f7f6d] rounded-lg",
                  footerActionLink: "text-[#8fa18d] hover:text-[#6f7f6d]",
                  socialButtonsBlockButton: "border-[#8fa18d]/20 rounded-lg hover:border-[#8fa18d]/40",
                },
                variables: {
                  colorPrimary: "#8fa18d",
                  colorText: "#37413d",
                  colorBackground: "#f6f1e7",
                },
              }}
              fallbackRedirectUrl="/auth/redirect"
              forceRedirectUrl="/auth/redirect"
            />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
