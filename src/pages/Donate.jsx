import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

const DONATION_TIERS = [
  { amount: 500, label: 'Supports Data Collection' },
  { amount: 1500, label: 'Funds Lab Equipment' },
  { amount: 5000, label: 'Sponsors a Researcher' },
  { amount: 'Custom', label: 'Any amount helps' }
];

export default function Donate() {
  const [selectedTier, setSelectedTier] = useState(1500);
  const [customAmount, setCustomAmount] = useState('');

  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>Donate | GRIFA</title>
        <meta name="description" content="Support real-world research initiatives." />
      </Helmet>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Info Side */}
          <div>
            <div className="w-16 h-16 bg-accent-light text-accent rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Heart size={32} />
            </div>
            <motion.h1 initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6"
             viewport={{ once: true }}>
              Fuel the Future of <span className="text-accent italic">Innovation</span>
            </motion.h1>
            <p className="text-lg text-neutral-gray mb-8">
              Your contribution directly funds researchers, students, and scientists working to solve the most pressing, undocumented problems in our communities.
            </p>
            
            <div className="space-y-4">
              {[
                '100% of funds go directly to active research projects.',
                'Receive quarterly impact reports and tracking dashboards.',
                'Tax deduction benefits applicable (80G).'
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-accent/10 p-1 rounded-full text-accent">
                    <ChevronRight size={16} />
                  </div>
                  <p className="text-neutral-dark font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <motion.div initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-white p-8 rounded-3xl shadow-lg border border-neutral-border/50"
           viewport={{ once: true }}>
            <h3 className="text-2xl font-bold text-primary mb-6">Make a Donation</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {DONATION_TIERS.map((tier, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedTier(tier.amount);
                    if (tier.amount !== 'Custom') setCustomAmount('');
                  }}
                  className={`p-4 rounded-2xl text-center border-2 transition-all ${
                    selectedTier === tier.amount 
                      ? 'border-accent bg-accent-light/30 text-accent shadow-sm' 
                      : 'border-neutral-border/50 text-neutral-gray hover:border-accent-light hover:bg-neutral-offwhite'
                  }`}
                >
                  <div className="font-bold text-xl mb-1">
                    {typeof tier.amount === 'number' ? `₹${tier.amount}` : tier.amount}
                  </div>
                  <div className="text-xs">{tier.label}</div>
                </button>
              ))}
            </div>

            {selectedTier === 'Custom' && (
              <div className="mb-6 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray font-bold">₹</span>
                <input 
                  type="number" 
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full pl-8 pr-4 py-4 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent font-bold"
                />
              </div>
            )}

            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent" />
              <input type="text" placeholder="PAN Number (for 80G)" className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>

            <button className="w-full py-4 bg-accent text-neutral-white font-bold rounded-xl hover:bg-accent-hover transition-colors shadow-md">
              Proceed to Donate securely
            </button>
            <p className="text-center text-xs text-neutral-gray mt-4">
              Secured by Razorpay. 128-bit encryption.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
