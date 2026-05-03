import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemCard({ problem, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-neutral-white rounded-2xl overflow-hidden shadow-sm border border-neutral-border/50 hover:shadow-lg hover:border-accent-light transition-all group flex flex-col h-full"
    >
      {/* Video Coming Soon Placeholder */}
      <div className="relative pt-[56.25%] w-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-3"
          style={{ background: '#0B1F3A' }}
        >
          <PlayCircle size={48} className="text-white/30" strokeWidth={1.5} />
          <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">Video Coming Soon</span>
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
