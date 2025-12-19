'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search,
    Bell,
    HelpCircle,
    ChevronRight,
    Command,
    Lock,
    User,
    Settings,
    LogOut,
} from 'lucide-react';

interface HeaderProps {
    sidebarCollapsed?: boolean;
}

interface Breadcrumb {
    label: string;
    href?: string;
}

export default function Header({ sidebarCollapsed = false }: HeaderProps) {
    const pathname = usePathname();
    const [searchFocused, setSearchFocused] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationCount] = useState(3);

    const sidebarWidth = sidebarCollapsed ? 72 : 280;

    // Generate breadcrumbs from pathname
    const getBreadcrumbs = (): Breadcrumb[] => {
        const paths = pathname.split('/').filter(Boolean);
        const breadcrumbs: Breadcrumb[] = [{ label: 'Home', href: '/dashboard' }];

        let currentPath = '';
        paths.forEach((path, index) => {
            currentPath += `/${path}`;
            const label = path
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            breadcrumbs.push({
                label,
                href: index < paths.length - 1 ? currentPath : undefined,
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header
            className="fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 transition-all duration-300"
            style={{
                left: `${sidebarWidth}px`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
        >
            <div className="flex items-center justify-between h-full px-6">
                {/* Left: Breadcrumb */}
                <nav className="flex items-center text-sm" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        {breadcrumbs.map((crumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                                )}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Center: Search */}
                <div className="flex-1 max-w-xl mx-8">
                    <div
                        className={`relative flex items-center rounded-lg border transition-all ${searchFocused
                                ? 'border-[var(--secondary-blue)] ring-2 ring-[var(--secondary-blue)]/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search cases, applicants, or A-numbers..."
                            className="w-full pl-10 pr-20 py-2 text-sm bg-transparent focus:outline-none"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                        <div className="absolute right-3 flex items-center gap-1 text-xs text-gray-400">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Security Indicator */}
                    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        <span>Secure</span>
                    </div>

                    {/* Help */}
                    <button
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Help"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <button
                        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        {notificationCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-[var(--patriot-red)] rounded-full flex items-center justify-center">
                                {notificationCount}
                            </span>
                        )}
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-[var(--secondary-blue)] flex items-center justify-center">
                                <span className="text-white text-sm font-semibold">SM</span>
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">Sarah Mitchell</p>
                                <p className="text-xs text-gray-500">Attorney</p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {userMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setUserMenuOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">Sarah Mitchell</p>
                                        <p className="text-xs text-gray-500">s.mitchell@lawfirm.com</p>
                                    </div>
                                    <div className="py-1">
                                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <User className="w-4 h-4" />
                                            <span>Your Profile</span>
                                        </button>
                                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                    </div>
                                    <div className="py-1 border-t border-gray-100">
                                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
