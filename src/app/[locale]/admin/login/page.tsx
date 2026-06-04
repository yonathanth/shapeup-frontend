'use client';

import { useState, FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}/admin`);
    } catch (err) {
      const msg =
        err != null && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : 'Login failed. Please check your credentials.';
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/en">
            <Image src="/shapeup-logo 1.svg" alt="ShapeUp" width={56} height={56} className="opacity-80 hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-10">
          <div className="mb-8">
            <p className="text-xs font-black uppercase italic tracking-widest text-customBlue">Admin</p>
            <h1 className="mt-2 text-3xl font-black uppercase italic tracking-tighter text-white">Sign In</h1>
            <p className="mt-2 text-sm text-white/50">Secure access to the ShapeUp admin dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {errors.general && (
              <div className="border border-red-500/30 bg-red-500/10 rounded-lg p-3">
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-white/60">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                placeholder="admin@shapeup.com"
                className={`h-12 w-full border-2 bg-black px-4 text-white placeholder-white/30 transition-all focus:outline-none ${
                  errors.email ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-customBlue'
                }`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-0.5">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-white/60">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                placeholder="••••••••"
                className={`h-12 w-full border-2 bg-black px-4 text-white placeholder-white/30 transition-all focus:outline-none ${
                  errors.password ? 'border-red-500/60 focus:border-red-500' : 'border-white/10 focus:border-customBlue'
                }`}
              />
              {errors.password && <p className="text-xs text-red-400 mt-0.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-14 w-full items-center justify-center gap-2 bg-customBlue text-lg font-black uppercase tracking-tighter text-black transition-transform hover:-translate-y-1 hover:translate-x-1 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 flex justify-center">
            <Link href="/en" className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors">
              ← Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
