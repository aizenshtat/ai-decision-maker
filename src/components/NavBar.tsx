'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Home, FileText, Layers, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Button from './ui/Button';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Decisions', href: '/decisions', icon: FileText },
    { name: 'Frameworks', href: '/frameworks', icon: Layers },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white dark:bg-gray-800">
            <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'bg-gray-900 dark:bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
          <nav className="flex justify-around">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'text-primary-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary-500'
                } flex flex-col items-center py-2`}
              >
                <item.icon className="h-6 w-6" aria-hidden="true" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Top bar */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Add search functionality here if needed */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              {/* Add user menu here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;