'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Shield,
    Eye,
    EyeOff,
    Lock,
    ShieldCheck,
    Award,
    AlertTriangle,
} from 'lucide-react';
import { Button, Input, Checkbox } from '@/components/ui';
import { APP_NAME, APP_TAGLINE, TRUST_BADGES, SECURITY_NOTICE } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberDevice, setRememberDevice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate login
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Demo: Accept any credentials
        router.push('/dashboard');
    };

    const handleSSOLogin = (provider: string) => {
        setLoading(true);
        // Simulate SSO redirect
        setTimeout(() => {
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div className="min-h-screen flex text-slate-800 bg-white">
            {/* Left Panel - Branding (45%) */}
            <div className="hidden lg:flex lg:w-[50%] gradient-hero relative overflow-hidden flex-col justify-between p-12">
                {/* Background Pattern - Eagle Watermark */}
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
                    <svg viewBox="0 0 100 100" fill="white">
                        <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 M50 20 C65 20 80 35 80 50 C80 65 65 80 50 80 C35 80 20 65 20 50 C20 35 35 20 50 20" />
                    </svg>
                </div>
                {/* Geometric Overlay */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                {/* 1. Logo Section */}
                <div className="relative z-10 pt-12">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shadow-lg shadow-black/10">
                            <Shield className="w-9 h-9 text-white drop-shadow-md" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white font-heading tracking-tight">
                                {APP_NAME}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* 2. Text Hierarchy & Graphic Element Placeholder */}
                <div className="relative z-10 space-y-18">
                    {/* Circle Design Element - Improved */}
                    <div className="w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-12 animate-[spin_60s_linear_infinite]">
                        <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-white/40" />
                        </div>
                    </div>

                    <div>
                        <p className="text-white/70 text-sm uppercase tracking-[0.15em] font-medium mb-3">
                            {APP_TAGLINE}
                        </p>
                        <p className="text-white/90 text-2xl font-light leading-relaxed max-w-md">
                            Trusted Immigration Intelligence for attorneys, officers, and legal professionals.
                        </p>
                    </div>
                </div>

                {/* 3. Trust Badges */}
                <div className="relative z-10 pb-12">
                    <p className="text-white/60 text-xs uppercase tracking-[0.2em] font-semibold mb-5 pl-1">
                        Trusted & Certified
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10">
                            <ShieldCheck className="w-4 h-4 text-white" />
                            <span className="text-[13px] font-medium text-white">FedRAMP Authorized</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10">
                            <Shield className="w-4 h-4 text-white" />
                            <span className="text-[13px] font-medium text-white">SOC 2 Type II</span>
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/10">
                            <Award className="w-4 h-4 text-white" />
                            <span className="text-[13px] font-medium text-white">USCIS Partner</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form (50%) */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white min-h-screen">
                <div className="w-full max-w-[440px] transition-all duration-300">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-navy)] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-[var(--primary-navy)] font-heading">
                            {APP_NAME}
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="mb-12">
                        <h2 className="text-[32px] font-semibold text-[#1a1a1a] font-heading tracking-tight leading-tight">
                            Sign In to {APP_NAME}
                        </h2>
                        <p className="text-[#6b7280] mt-3 text-[16px]">
                            Access your immigration case management portal
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@lawfirm.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="h-12 border-gray-300 focus:border-[#1E5AA8] focus:ring-[#1E5AA8]/10 text-base"
                            />

                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="h-12 border-gray-300 focus:border-[#1E5AA8] focus:ring-[#1E5AA8]/10 text-base"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <Checkbox
                                label="Remember this device"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                            />
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-[#1E5AA8] hover:text-[#164280] hover:underline transition-colors block"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#0A2647] hover:bg-[#1E3A5F] text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-base"
                            loading={loading}
                            leftIcon={!loading && <Lock className="w-4 h-4" />}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* SSO Options */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => handleSSOLogin('login.gov')}
                            className="flex items-center justify-center gap-3 px-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-12"
                            title="Sign in with Login.gov"
                        >
                            <div className="w-6 h-6 bg-[#112e51] rounded flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Login.gov</span>
                        </button>

                        <button
                            onClick={() => handleSSOLogin('microsoft')}
                            className="flex items-center justify-center gap-3 px-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-12"
                            title="Sign in with Microsoft"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 21 21">
                                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Microsoft</span>
                        </button>

                        <button
                            onClick={() => handleSSOLogin('google')}
                            className="flex items-center justify-center gap-3 px-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors h-12"
                            title="Sign in with Google"
                        >
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Google</span>
                        </button>
                    </div>

                    {/* Footer Links & Warning */}
                    <div className="mt-12">
                        <div className="flex flex-col items-center gap-6">
                            <p className="text-sm text-gray-500">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/request-access"
                                    className="text-[#1E5AA8] hover:text-[#164280] font-semibold hover:underline transition-colors"
                                >
                                    Request Access
                                </Link>
                            </p>

                            <div className="flex items-center gap-6 text-[13px] text-gray-400">
                                <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                                <span className="text-gray-300">|</span>
                                <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                                <span className="text-gray-300">|</span>
                                <Link href="/security" className="hover:text-gray-600 transition-colors">Security</Link>
                            </div>
                        </div>

                        {/* Warning Banner - Critical Fix */}
                        <div className="mt-8 flex items-start gap-4 p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
                            <p className="text-[13px] leading-[1.5] text-[#92400E] font-medium">
                                {SECURITY_NOTICE.message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
