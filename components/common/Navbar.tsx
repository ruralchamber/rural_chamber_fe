"use client";

import React, { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const NAVIGATION_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/services" },
  { label: "Events", href: "/events" },
  { label: "Membership", href: "/membership" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact-us" },
];

const LOGGED_IN_ITEMS = [
  { label: "Connect", href: "/connect-hub" },
  { label: "Legislation", href: "/legislation" },
  { label: "Events", href: "/client/events" },
  { label: "Economic Zone", href: "/client/economic-zone" }
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
    router.refresh();
  };

  const getFirstName = (fullName: string | undefined): string => {
    if (!fullName) return 'Account';
    return fullName.split(' ')[0];
  };

  const getInitials = (fullName: string | undefined): string => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const AuthButtons = () => (
    <>
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-center gap-2.5 text-gray-700 hover:text-[#9FC93B] transition-colors">
              <div className="flex items-center justify-center rounded-full bg-[#9FC93B] w-10 h-10 text-white font-semibold text-sm">
                {getInitials(user?.fullName)}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[15px] font-medium leading-tight">{getFirstName(user?.fullName)}</span>
                <span className="text-[12px] text-gray-500 leading-tight">{user?.email}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end">
            <div className="px-3 py-2 border-b">
              <p className="font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/subscription/profile" className="cursor-pointer w-full">
                Manage Subscription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer w-full">
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 w-10 h-10 text-gray-700 hover:border-[#9FC93B] hover:text-[#9FC93B] transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md bg-white border-2 border-[#9FC93B] px-6 py-2.5 text-[15px] font-medium text-[#9FC93B] hover:bg-[#9FC93B] hover:text-white transition-colors"
          >
            Join Us
          </Link>
        </>
      )}
    </>
  );

  const MobileAuthButtons = () => (
    <div className="pt-3 space-y-2">
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-gray-700 hover:text-[#9FC93B] transition-colors border border-gray-200 rounded-md">
              <div className="flex items-center justify-center rounded-full bg-[#9FC93B] w-10 h-10 text-white font-semibold text-sm">
                {getInitials(user?.fullName)}
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-[15px] font-medium leading-tight">{getFirstName(user?.fullName)}</span>
                <span className="text-[12px] text-gray-500 leading-tight">{user?.email}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end">
            <div className="px-3 py-2 border-b">
              <p className="font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href="/subscription/profile" className="cursor-pointer w-full">
                Manage Subscription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer w-full">
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="block w-full text-center rounded-md border-2 border-gray-300 bg-white px-4 py-2.5 text-[15px] font-medium text-gray-700 hover:border-[#9FC93B] hover:text-[#9FC93B] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="inline h-5 w-5 mr-2" />
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="block w-full text-center rounded-md bg-white border-2 border-[#9FC93B] px-4 py-2.5 text-[15px] font-medium text-[#9FC93B] hover:bg-[#9FC93B] hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Join Us
          </Link>
        </>
      )}
      
      <Link href="/donate" onClick={() => setIsMobileMenuOpen(false)}>
        <button className="w-full rounded-md bg-[#9FC93B] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#8AB82F] transition-colors">
          Donate
        </button>
      </Link>
    </div>
  );

  return (
    <nav className="relative z-20 bg-white shadow-sm">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-[90px] items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/logo2.png"
                alt="Rural Chamber Logo"
                width={200}
                height={100}
                className="object-cover cursor-pointer"
              />
            </Link>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {!isLoggedIn && NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[15px] font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-[#9FC93B]"
                    : "text-gray-700 hover:text-[#9FC93B]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn && (
              <div className="flex pr-44 items-center gap-8 mx-auto">
                {LOGGED_IN_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-[15px] font-medium transition-colors whitespace-nowrap ${
                      isActive(item.href)
                        ? "text-[#9FC93B]"
                        : "text-gray-700 hover:text-[#9FC93B]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            <AuthButtons />

            <Link href="/donate">
              <button className="rounded-md bg-[#9FC93B] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#8AB82F] transition-colors">
                Donate
              </button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {!isLoggedIn && NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-[#9FC93B] bg-green-50"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#9FC93B]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn && LOGGED_IN_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-[#9FC93B] bg-green-50"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#9FC93B]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <MobileAuthButtons />
          </div>
        </div>
      )}
    </nav>
  );
}