'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  // Animation controls for scroll-triggered animations
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const teamMembers = [
    {
      name: "Debjeet Singha",
      role: "Backend Developer",
      image: "/images/debjeet.jpg",
     
    },
    {
      name: "Shaurya Pandit",
      role: "Backend Developer",
      image: "/images/shaurya.jpg",
     
    },
    {
      name: "Debojit Roy",
      role: "Frontend Developer",
      image: "/images/debojit.png",
     
    },
    {
      name: "Anurag Jyoti",
      role: "Frontend Developer",
      image: "/images/anurag.jpg",
     
    }
  ];


  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }

    // Auto-rotate team members
    const interval = setInterval(() => {
      setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [controls, isInView, teamMembers.length]);

  // Navigation links
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Stats", href: "#stats" },
    { name: "Demo", href: "#demo" },
    { name: "Pricing", href: "#pricing" },
    { name: "Team", href: "#team" }
  ];


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

      <div className="container mx-auto px-4 py-3 relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-7">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Image
                  src="/images/logo.png"
                  alt="Investopia Logo"
                  width={70}
                  height={70}
                  className="rounded-lg"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              >
                INVESTOPIA
              </motion.div>
            </div>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-6"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={link.href} className="text-gray-300 hover:text-white transition font-medium">
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/login">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white hover:opacity-90 transition">
                  Sign In
                </button>
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="text-center max-w-3xl mx-auto mt-24 mb-32">
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
              <Link href="/auth/signup">
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
        </section>

        {/* Need for the Product Section */}
        <section id="features" ref={ref} className="py-20">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Why Investopia is Essential for Traders
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              90% of traders fail within their first year. We're here to change that.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Insights",
                  desc: "Get real-time market analysis and predictions powered by advanced AI algorithms.",
                  icon: "🤖"
                },
                {
                  title: "Personalized Coaching",
                  desc: "1-on-1 sessions with expert traders tailored to your skill level.",
                  icon: "🎯"
                },
                {
                  title: "Community Support",
                  desc: "Join thousands of traders sharing strategies and insights daily.",
                  icon: "👥"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Financial Stats Section */}
        <section id="stats" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Financial Stats for India
            </h2>
            
            <div className="grid md:grid gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Financial literacy is crucial for India's development, with studies showing over 75% of Indian adults lacking adequate understanding of basic financial concepts. This comprehensive course is designed to bridge the knowledge gap and empower Indians from all backgrounds to take control of their financial future. The structure progresses from foundational concepts to advanced investment strategies, making it accessible for beginners while providing depth for those seeking to expand their financial knowledge.</h3>
                
              </motion.div>
              
              
            </div>
          </motion.div>
        </section>

        {/* Product Video Section */}
        <section id="demo" className="py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              See Investopia in Action
            </h2>
            
            <div className="aspect-w-16 aspect-h-9 bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
              {/* Replace with your actual video embed */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎥</div>
                  <h3 className="text-2xl font-semibold mb-2 text-white">Product Overview</h3>
                  <p className="text-gray-300">Watch how Investopia can transform your trading journey</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pricing Plans Section */}
        <section id="pricing" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Choose Your Plan
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Free",
                  price: "$0",
                  desc: "Start your trading journey",
                  features: [
                    "Basic market data",
                    "Community access",
                    "5 AI insights/month",
                    "Weekly webinars"
                  ],
                  buttonText: "Get Started",
                  popular: false
                },
                {
                  name: "Pro",
                  price: "$29",
                  desc: "For serious traders",
                  features: [
                    "Advanced analytics",
                    "50 AI insights/month",
                    "1 coaching session",
                    "Priority support",
                    "Daily webinars"
                  ],
                  buttonText: "Go Pro",
                  popular: true
                },
                {
                  name: "Premium",
                  price: "$99",
                  desc: "Maximum advantage",
                  features: [
                    "All Pro features",
                    "Unlimited AI insights",
                    "4 coaching sessions",
                    "24/7 VIP support",
                    "Custom strategies"
                  ],
                  buttonText: "Get Premium",
                  popular: false
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-xl overflow-hidden border ${
                    plan.popular 
                      ? "border-purple-500 shadow-lg shadow-purple-500/20" 
                      : "border-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="p-8 bg-gray-800/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-1 text-white">{plan.name}</h3>
                    <p className="text-gray-400 mb-4">{plan.desc}</p>
                    <div className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                      {plan.price}
                      <span className="text-lg text-gray-400">/mo</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Link href="/auth/signup">
                        <button className={`w-full py-3 rounded-lg font-medium ${
                          plan.popular
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        }`}>
                          {plan.buttonText}
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

       {/* Team Section */}
        <section id="team" className="py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Meet Our Expert Team
            </h2>
            
            <div className="relative h-96">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: index === currentTeamIndex ? 1 : 0,
                    scale: index === currentTeamIndex ? 1 : 0.8,
                    zIndex: index === currentTeamIndex ? 1 : 0
                  }}
                  transition={{ duration: 0.6 }}
                  className={`absolute inset-0 flex flex-col items-center justify-center ${
                    index === currentTeamIndex ? 'pointer-events-auto' : 'pointer-events-none'
                  }`}
                >
                  <div className="relative w-64 h-64 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="absolute inset-0 rounded-full overflow-hidden border-4 border-purple-500/30 shadow-lg shadow-purple-500/20"
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        transition: { duration: 20, repeat: Infinity, ease: "linear" }
                      }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/20"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-medium mb-2">
                      {member.role}
                    </p>
                 
                  </motion.div>
                </motion.div>
              ))}
              
              <div className="flex justify-center mt-8 space-x-2">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTeamIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      index === currentTeamIndex 
                        ? 'bg-purple-600 w-6' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`View team member ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>



        {/* Feedback Form Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
          >
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              We'd Love Your Feedback
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Help us improve Investopia by sharing your thoughts
            </p>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="feedback" className="block text-gray-300 mb-2">Feedback</label>
                <textarea 
                  id="feedback" 
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white"
                  placeholder="Your valuable feedback..."
                ></textarea>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2"
              >
                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition"
                >
                  Submit Feedback
                </button>
              </motion.div>
            </form>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src="/images/logo.png"
                    alt="Investopia Logo"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    INVESTOPIA
                  </div>
                </div>
                <p className="text-gray-400">
                  Empowering traders with AI-driven insights since 2025.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Features</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">API</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Integrations</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Documentation</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Guides</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Community</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">About</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Careers</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Privacy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2025 Investopia. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </footer>
      </div>
    </div>
  );
}