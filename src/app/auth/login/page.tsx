'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(value.endsWith('@gmail.com'));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setIsValidPassword(value.length >= 6); // Minimum 6 characters
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail || !isValidPassword) return;
    
    setIsSubmitting(true);
    // Simulate login process
    setTimeout(() => {
      router.push('/learning');
    }, 1000);
  };

  const isFormValid = isValidEmail && isValidPassword;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/chat-bg.jpg"
          alt="Chat background"
          fill
          className="object-cover"
          quality={80}
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700"
      >
        <h1 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Welcome Back
        </h1>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@gmail.com"
              required
            />
            {!isValidEmail && email && (
              <p className="mt-1 text-xs text-red-400">Please enter a valid @gmail.com address</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full bg-gray-700/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {!isValidPassword && password && (
              <p className="mt-1 text-xs text-red-400">Password must be at least 6 characters</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-3 rounded-lg font-medium transition ${
              isFormValid 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            } ${
              isSubmitting ? 'opacity-70' : ''
            }`}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}