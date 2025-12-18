'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--cream-white)]">
            {/* Skip Link for Accessibility */}
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>

            {/* Sidebar */}
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Header */}
            <Header sidebarCollapsed={sidebarCollapsed} />

            {/* Main Content */}
            <main
                id="main-content"
                className={cn(
                    'pt-16 min-h-screen transition-all duration-300',
                    sidebarCollapsed ? 'pl-[72px]' : 'pl-[280px]'
                )}
            >
                <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
                    {children}
                </div>
            </main>

            {/* Government Footer Notice */}
            <footer
                className={cn(
                    'fixed bottom-0 right-0 py-2 px-4 bg-[var(--gray-50)] border-t border-gray-200 text-xs text-gray-500 transition-all duration-300',
                    sidebarCollapsed ? 'left-[72px]' : 'left-[280px]'
                )}
            >
                <div className="flex items-center justify-between max-w-[1440px] mx-auto">
                    <span>
                        An official technology partner portal | Last security audit: December 2025
                    </span>
                    <div className="flex items-center gap-4">
                        <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-700 transition-colors">Security</a>
                        <span className="text-gray-400">v1.0.0</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
