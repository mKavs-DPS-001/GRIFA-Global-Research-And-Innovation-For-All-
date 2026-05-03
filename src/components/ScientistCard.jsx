import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, GraduationCap } from 'lucide-react';

export default function ScientistCard({ scientist, index }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-neutral-white rounded-3xl p-6 shadow-sm border border-neutral-border/50 hover:shadow-lg hover:border-accent-light transition-all flex flex-col items-center text-center group"
    >
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-neutral-offwhite shadow-sm group-hover:border-accent transition-colors">
        <img 
          src={scientist.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(scientist.name)}&background=0B1F3A&color=FFFFFF&size=150`} 
          alt={scientist.name} 
          width="128" height="128" loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      
      <h3 className="text-xl font-bold text-primary mb-1">{scientist.name}</h3>
      <div className="flex items-center justify-center gap-1 text-accent mb-3 text-sm font-medium">
        <GraduationCap size={16} />
        <span>{scientist.institution}</span>
      </div>
      
      <p className="text-neutral-gray text-sm mb-4 h-10 line-clamp-2">
        {scientist.expertise}
      </p>

      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {scientist.disciplines?.map((disc, i) => (
          <span 
            key={i} 
            className="px-2 py-1 bg-accent-light text-accent text-[10px] font-bold rounded-md uppercase tracking-wider"
          >
            {disc}
          </span>
        ))}
      </div>

      <button className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 text-primary hover:bg-primary hover:text-neutral-white transition-colors font-medium text-sm">
        <Mail size={16} />
        Collaborate
      </button>
    </motion.div>
  );
}
