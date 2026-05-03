import React from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlanCard({ plan, isPopular, onSelect }) {
  return (
    <motion.div whileHover={{ y: -10 }}
      className={`relative p-8 rounded-3xl border flex flex-col h-full bg-neutral-white transition-shadow shadow-sm hover:shadow-lg ${
        isPopular ? 'border-accent border-2' : 'border-neutral-border/50'
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-neutral-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      
      <div className="mb-8 text-center border-b border-neutral-border/50 pb-8">
        <h3 className="text-xl font-bold text-primary mb-2">{plan.name}</h3>
        <p className="text-neutral-gray text-sm mb-4 h-10">{plan.description}</p>
        <div className="text-4xl font-playfair font-bold text-primary flex items-baseline justify-center">
          <span className="text-xl mr-1">₹</span>
          {plan.price.toLocaleString()}
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-neutral-dark">
            <Check size={18} className="text-accent shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onSelect(plan)}
        className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm mt-auto ${
          isPopular 
            ? 'bg-accent text-neutral-white hover:bg-accent-hover' 
            : 'bg-primary text-neutral-white hover:bg-primary-light'
        }`}
      >
        Get Started
      </button>
    </motion.div>
  );
}
