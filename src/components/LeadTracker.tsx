'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LeadTrackerContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('lead_origem', ref);
    }
  }, [searchParams]);

  return null;
}

export function LeadTracker() {
  return (
    <Suspense fallback={null}>
      <LeadTrackerContent />
    </Suspense>
  );
}
