// app/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to avoid hydration issues
const Home = dynamic(() => import('../components/Home'), { ssr: false });

export default function Page() {
  return <Home />;
}