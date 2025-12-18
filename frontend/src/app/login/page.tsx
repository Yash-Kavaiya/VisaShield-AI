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
    Loader2,
} from 'lucide-react';
import { Button, Input, Checkbox } from '@/components/ui';
import { APP_NAME, APP_TAGLINE, TRUST_BADGES, SECURITY_NOTICE } from '@/lib/constants';

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
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[45%] gradient-hero relative overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white font-heading">
                                    {APP_NAME}
                                </h1>
                                <p className="text-white/60 text-sm">{APP_TAGLINE}</p>
                            </div>
                        </div>
                        <p className="text-white/80 text-lg max-w-md leading-relaxed">
                            Trusted Immigration Intelligence for attorneys, officers, and legal professionals.
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="space-y-4">
                        <p className="text-white/60 text-sm uppercase tracking-wide">
                            Trusted & Certified
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <div className="trust-badge">
                                <ShieldCheck className="w-4 h-4" />
                                <span>FedRAMP Authorized</span>
                            </div>
                            <div className="trust-badge">
                                <Shield className="w-4 h-4" />
                                <span>SOC 2 Type II</span>
                            </div>
                            <div className="trust-badge">
                                <Award className="w-4 h-4" />
                                <span>USCIS Partner</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Eagle Silhouette */}
                    <div className="absolute right-0 bottom-0 w-96 h-96 opacity-5">
                        <svg viewBox="0 0 100 100" fill="white">
                            <path d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10 M50 20 C65 20 80 35 80 50 C80 65 65 80 50 80 C35 80 20 65 20 50 C20 35 35 20 50 20" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary-navy)] flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[var(--primary-navy)] font-heading">
                                {APP_NAME}
                            </h1>
                            <p className="text-gray-500 text-sm">{APP_TAGLINE}</p>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 font-heading">
                            Sign In to {APP_NAME}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Access your immigration case management portal
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@lawfirm.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
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
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <Checkbox
                                label="Remember this device"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                            />
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[var(--secondary-blue)] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            loading={loading}
                            leftIcon={!loading && <Lock className="w-4 h-4" />}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* SSO Options */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSSOLogin('login.gov')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-5 h-5 bg-[#112e51] rounded flex items-center justify-center">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Sign in with Login.gov
                            </span>
                        </button>

                        <button
                            onClick={() => handleSSOLogin('microsoft')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 21 21">
                                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                Sign in with Microsoft
                            </span>
                        </button>

                        <button
                            onClick={() => handleSSOLogin('google')}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">
                                Sign in with Google Workspace
                            </span>
                        </button>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/request-access"
                                className="text-[var(--secondary-blue)] hover:underline font-medium"
                            >
                                Request Access
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                        <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
                        <span>|</span>
                        <Link href="/security" className="hover:text-gray-600">Security</Link>
                    </div>

                    {/* Government Notice */}
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-800 leading-relaxed">
                                {SECURITY_NOTICE}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
