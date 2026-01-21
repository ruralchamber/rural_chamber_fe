// components/common/HeaderWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Don't show header on auth pages
  if (pathname.startsWith('/auth')) {
    return null;
  }

    if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Navbar />;
}