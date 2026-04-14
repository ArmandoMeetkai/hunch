import { NavBar } from "@/components/ui/nav-bar";
import { PageTransition } from "@/components/page-transition";
import { OnboardingGuard } from "@/components/onboarding-guard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <NavBar />
      {/* Content area: offset for desktop sidebar, bottom padding for mobile nav */}
      <main className="min-h-screen pb-20 md:pl-24 md:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
    </OnboardingGuard>
  );
}
