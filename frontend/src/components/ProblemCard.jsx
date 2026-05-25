import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProblemCard({ problem, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-neutral-white rounded-2xl overflow-hidden shadow-sm border border-neutral-border/50 hover:shadow-lg hover:border-accent-light transition-all group flex flex-col h-full"
    >
      {/* Premium YouTube-style Video Placeholder */}
      <div className="relative pt-[56.25%] w-full overflow-hidden">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          style={{
            background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #0d1a35 70%, #080f20 100%)',
          }}
        >
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Glow blob */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{
              width: '160px', height: '90px',
              background: 'radial-gradient(ellipse, rgba(255,0,0,0.12) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }} />
          </div>

          {/* Play button with pulse ring */}
          <div className="relative flex items-center justify-center z-10">
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0, 0.25] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full"
              style={{ width: 64, height: 64, border: '1.5px solid rgba(255,60,60,0.5)' }}
            />
            {/* YouTube play button */}
            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              {/* YouTube logo shape */}
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M21.54 2.5A2.76 2.76 0 0 0 19.6.54C17.9 0 11 0 11 0S4.1 0 2.4.54A2.76 2.76 0 0 0 .46 2.5 29 29 0 0 0 0 8a29 29 0 0 0 .46 5.5A2.76 2.76 0 0 0 2.4 15.46C4.1 16 11 16 11 16s6.9 0 8.6-.54a2.76 2.76 0 0 0 1.94-1.96A29 29 0 0 0 22 8a29 29 0 0 0-.46-5.5Z" fill="#FF0000"/>
                <polygon points="8.75,11.5 14.5,8 8.75,4.5" fill="white"/>
              </svg>
            </div>
          </div>

          {/* Label */}
          <div className="z-10 flex flex-col items-center gap-1">
            <span className="text-white/80 text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ letterSpacing: '0.18em' }}>
              Coming Soon
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/35 text-[10px] tracking-wider uppercase">Video in production</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {problem.disciplines?.map((disc, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-accent-light text-accent text-xs font-semibold rounded-full"
            >
              {disc}
            </span>
          ))}
        </div>

        {/* Content */}
        <h3 className="text-xl font-playfair font-bold text-primary mb-2 line-clamp-2">
          {problem.title}
        </h3>
        <p className="text-neutral-gray text-sm mb-6 line-clamp-3 flex-grow">
          {problem.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-border/50">
          <div className="flex items-center text-neutral-gray text-sm gap-1">
            <Eye size={16} />
            <span>{problem.views || 0} views</span>
          </div>
          <Link 
            to={`/problems/${problem.id}`}
            className="flex items-center gap-1 text-primary font-bold hover:text-accent transition-colors"
          >
            I want to research this
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
