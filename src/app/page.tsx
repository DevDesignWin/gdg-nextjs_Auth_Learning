'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/bg.jpg"
          alt="Background"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            INVESTOPIA
          </motion.div>
          
          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/login">
                <button className="px-6 py-2 bg-gray-700/50 hover:bg-gray-700/70 rounded-lg text-white transition">
                  Sign In
                </button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/signup">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:opacity-90 transition">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mt-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Master the Markets with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-10"
          >
            Learn trading strategies, get personalized coaching, and join our community of successful traders.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/learning">
                <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:opacity-90 transition font-medium">
                  Start Learning
                </button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/signup">
                <button className="px-8 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800/50 transition font-medium">
                  Join Free
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}