'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderOpen,
    Folder,
    Clock,
    CheckCircle,
    XCircle,
    Brain,
    BarChart3,
    FileText,
    ShieldCheck,
    Settings,
    ChevronDown,
    ChevronRight,
    Menu,
    LogOut,
    User,
    Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    children?: NavItem[];
    badge?: number;
}

const navItems: NavItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        id: 'cases',
        label: 'Cases',
        icon: FolderOpen,
        href: '/cases',
        children: [
            { id: 'all-cases', label: 'All Cases', icon: Folder, href: '/cases' },
            { id: 'pending', label: 'Pending Review', icon: Clock, href: '/cases?status=pending-review', badge: 12 },
            { id: 'approved', label: 'Approved', icon: CheckCircle, href: '/cases?status=approved' },
            { id: 'denied', label: 'Denied', icon: XCircle, href: '/cases?status=denied' },
        ],
    },
    {
        id: 'adjudicator',
        label: 'AI Adjudicator',
        icon: Brain,
        href: '/adjudicator',
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        href: '/analytics',
    },
    {
        id: 'documents',
        label: 'Documents',
        icon: FileText,
        href: '/documents',
    },
    {
        id: 'compliance',
        label: 'Compliance',
        icon: ShieldCheck,
        href: '/compliance',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        href: '/settings',
    },
];

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>(['cases']);

    const toggleExpand = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const isActive = (href: string) => {
        if (href === '/cases' && pathname === '/cases') return true;
        if (href !== '/cases' && pathname.startsWith(href)) return true;
        return pathname === href;
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen transition-all duration-300',
                collapsed ? 'w-[72px]' : 'w-[280px]'
            )}
            style={{ backgroundColor: 'var(--primary-navy)' }}
        >
            <div className="flex h-full flex-col">
                {/* Logo Section */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <h1 className="text-white font-bold text-lg truncate font-heading">
                                {APP_NAME}
                            </h1>
                            <p className="text-white/60 text-xs truncate">
                                {APP_TAGLINE}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <Menu className="w-5 h-5 text-white/80" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                {item.children ? (
                                    <>
                                        <button
                                            onClick={() => !collapsed && toggleExpand(item.id)}
                                            className={cn(
                                                'nav-item w-full',
                                                isActive(item.href) && 'active'
                                            )}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1 text-left text-sm font-medium">
                                                        {item.label}
                                                    </span>
                                                    {expandedItems.includes(item.id) ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </>
                                            )}
                                        </button>
                                        {!collapsed && expandedItems.includes(item.id) && (
                                            <ul className="mt-1 ml-6 space-y-1">
                                                {item.children.map((child) => (
                                                    <li key={child.id}>
                                                        <Link
                                                            href={child.href}
                                                            className={cn(
                                                                'nav-item text-sm',
                                                                isActive(child.href) && 'active'
                                                            )}
                                                        >
                                                            <child.icon className="w-4 h-4 flex-shrink-0" />
                                                            <span className="flex-1">{child.label}</span>
                                                            {child.badge && (
                                                                <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-[var(--patriot-red)] text-white">
                                                                    {child.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'nav-item',
                                            isActive(item.href) && 'active'
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        {!collapsed && (
                                            <span className="text-sm font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-white/10">
                    <div className={cn(
                        'flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer',
                        collapsed && 'justify-center'
                    )}>
                        <div className="w-9 h-9 rounded-full bg-[var(--secondary-blue)] flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                    Sarah Mitchell
                                </p>
                                <p className="text-white/60 text-xs truncate">
                                    Immigration Attorney
                                </p>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button className="nav-item w-full mt-2 text-white/60 hover:text-white">
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
