import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScientistCard from '../components/ScientistCard';

export default function Scientists() {
  const [scientists, setScientists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/scientists`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setScientists(data.data);
        } else {
          console.error("Failed to load scientists");
        }
      })
      .catch(err => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  const disciplines = ['All', ...new Set(scientists.flatMap(s => s.disciplines))].sort();

  const filteredScientists = selectedDiscipline === 'All' 
    ? scientists 
    : scientists.filter(s => s.disciplines.includes(selectedDiscipline));

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
        {loading ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-playfair font-bold text-primary mb-2">Loading Scientists...</h3>
          </div>
        ) : filteredScientists.length > 0 ? (
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
