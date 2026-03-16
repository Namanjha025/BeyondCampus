'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    // Check if user has already completed onboarding
    const checkOnboardingStatus = async () => {
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();

        // Only redirect if on the initial onboarding pages, not preparing
        const pathname = window.location.pathname;
        if (data.onboardingCompleted && !pathname.includes('/preparing')) {
          console.log('User already completed onboarding, redirecting to home');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
