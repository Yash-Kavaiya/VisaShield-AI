'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const sidebarWidth = sidebarCollapsed ? 72 : 280;

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
                className="pt-16 min-h-screen transition-all duration-300"
                style={{ paddingLeft: `${sidebarWidth}px` }}
            >
                <div className="p-6 lg:p-8 max-w-[1440px] mx-auto pb-16">
                    {children}
                </div>
            </main>

            {/* Government Footer Notice - Fixed at bottom */}
            <footer
                className="fixed bottom-0 right-0 py-2 px-4 bg-[var(--gray-50)] border-t border-gray-200 text-xs text-gray-500 transition-all duration-300 z-30"
                style={{ left: `${sidebarWidth}px` }}
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
