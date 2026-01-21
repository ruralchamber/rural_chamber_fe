// components/common/FooterWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  if (pathname.startsWith('/auth')) {
    return null;
  }

    if (pathname.startsWith('/connect-hub')) {
    return null;
  }
  
    if (pathname.startsWith('/donate')) {
    return null;
  }

      if (pathname.startsWith('/settings')) {
    return null;
  }
    if (pathname.startsWith('/legislation')) {
    return null;
  }

    if (pathname.startsWith('/subscription')) {
    return null;
  }

  if (pathname.startsWith('/admin') ) {
    return null;
  }

    if (pathname.startsWith('/client')) {
    return null;
  }

    if (pathname.startsWith('/update-profile')) {
    return null;
  }

    if (pathname.startsWith('/payment')) {
    return null;
  }

  return <Footer />;
}