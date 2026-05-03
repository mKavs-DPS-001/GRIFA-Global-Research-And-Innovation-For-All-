import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScientistCard from '../components/ScientistCard';

const ALL_SCIENTISTS = [
  {
    id: 's1', name: 'Dr. Researcher A', institution: 'IISc Bangalore', expertise: 'Advanced Materials & Fluid Dynamics', disciplines: ['Physics', 'Materials Science'],
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=70&auto=format'
  },
  {
    id: 's2', name: 'Dr. Researcher B', institution: 'GCU', expertise: 'Environmental Psychology & Urban Behavior', disciplines: ['Psychology', 'Sociology'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=70&auto=format'
  },
  {
    id: 's3', name: 'Prof. Researcher C', institution: 'REVA University', expertise: 'Sustainable Civil Engineering', disciplines: ['Civil Engineering', 'Architecture'],
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=70&auto=format'
  },
  {
    id: 's4', name: 'Dr. Researcher D', institution: 'IIT Bombay', expertise: 'AI in Healthcare', disciplines: ['Programming', 'Medicine'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=70&auto=format'
  },
  {
    id: 's5', name: 'Prof. Researcher E', institution: 'Oxford University', expertise: 'Computational Linguistics', disciplines: ['Language', 'Programming'],
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=70&auto=format'
  },
  {
    id: 's6', name: 'Dr. Researcher F', institution: 'Stanford Univ.', expertise: 'Hospitality Management Strategies', disciplines: ['Hotel Management', 'Business'],
    photoUrl: 'https://images.unsplash.com/photo-1508214751196-bfd1414e4cb1?w=600&q=70&auto=format'
  }
];

export default function Scientists() {
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const disciplines = ['All', ...new Set(ALL_SCIENTISTS.flatMap(s => s.disciplines))].sort();

  const filteredScientists = selectedDiscipline === 'All' 
    ? ALL_SCIENTISTS 
    : ALL_SCIENTISTS.filter(s => s.disciplines.includes(selectedDiscipline));

  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>Scientists | GRIFA</title>
        <meta name="description" content="Meet the experts ready to collaborate with you." />
      </Helmet>

      <div className="bg-primary py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral-white mb-4"
           viewport={{ once: true }}>
            Minds Behind the Solutions
          </motion.h1>
          <motion.p initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-white/70 max-w-2xl mx-auto"
           viewport={{ once: true }}>
            Collaborate with leading researchers from prestigious institutions worldwide.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 bg-neutral-white p-2 rounded-full shadow-sm border border-neutral-border/50 overflow-x-auto w-full md:w-auto">
            {disciplines.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDiscipline(d)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedDiscipline === d 
                    ? 'bg-accent text-neutral-white' 
                    : 'text-neutral-gray hover:bg-neutral-offwhite'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredScientists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredScientists.map((scientist, i) => (
              <ScientistCard key={scientist.id} scientist={scientist} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-playfair font-bold text-primary mb-2">No scientists found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
