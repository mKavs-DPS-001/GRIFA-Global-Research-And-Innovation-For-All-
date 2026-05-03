import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Filter } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import { motion, AnimatePresence } from 'framer-motion';

export const ALL_PROBLEMS = [
  {
    id: 'speed-breakers',
    title: 'Newtonian Fluid Alternative to Asphalt Speed Breakers',
    description: 'Traditional speed breakers cause vehicle damage and discomfort. Can non-Newtonian fluids provide dynamic resistance based on vehicle speed? We are looking for researchers to test specific non-Newtonian mixtures under high-impact scenarios.',
    disciplines: ['Physics', 'Civil Engineering', 'Materials Science'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678901',
    views: 1250
  },
  {
    id: 'bus-stand',
    title: 'Safe & Budget-Friendly Snacks at Bus Stands',
    description: 'Creating a sustainable, hygienic business model for snack vendors at rural and semi-urban bus stands. This involves studying consumer behavior, food preservation, and supply chain logistics.',
    disciplines: ['Business', 'Food Tech', 'Public Health', 'Psychology'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678902',
    views: 840
  },
  {
    id: 'open-urination',
    title: 'Interdisciplinary Solutions to Open Urination',
    description: 'Addressing the behavioral, infrastructural, and psychological aspects of open urination in urban spaces. Why do people ignore public toilets? How can urban design passively discourage this?',
    disciplines: ['Psychology', 'Urban Planning', 'Sociology'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678903',
    views: 2100
  },
  {
    id: 'stray-dogs',
    title: 'Humane Management of Urban Stray Dog Populations',
    description: 'Developing data-driven, humane models for stray dog population control that factor in urban waste management, animal psychology, and public safety.',
    disciplines: ['Zoology', 'Urban Planning', 'Public Health'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678904',
    views: 3420
  },
  {
    id: 'language-barrier',
    title: 'Overcoming Medical Language Barriers in Rural Clinics',
    description: 'How can we design an intuitive, low-tech communication system for doctors and patients who do not share a common language in high-stress medical environments?',
    disciplines: ['Linguistics', 'Medicine', 'Design'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678905',
    views: 950
  },
  {
    id: 'smart-farming',
    title: 'Low-Cost Soil Moisture Sensors for Subsistence Farmers',
    description: 'Engineering a reliable, extremely low-cost soil moisture sensor using locally available materials to help subsistence farmers optimize water usage.',
    disciplines: ['Electronics', 'Agriculture', 'Programming'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678906',
    views: 1800
  }
];

export default function Problems() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');

  const disciplines = ['All', ...new Set(ALL_PROBLEMS.flatMap(p => p.disciplines))].sort();

  const filteredProblems = ALL_PROBLEMS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = selectedDiscipline === 'All' || p.disciplines.includes(selectedDiscipline);
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>Problems | GRIFA</title>
        <meta name="description" content="Browse real-world problems waiting for research and innovation." />
      </Helmet>

      {/* Header */}
      <div className="bg-primary py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral-white mb-4"
           viewport={{ once: true }}>
            Real Problems. Waiting for Real Solutions.
          </motion.h1>
          <motion.p initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-white/70 max-w-2xl mx-auto"
           viewport={{ once: true }}>
            Explore our database of documented real-world issues. Filter by your field of expertise and find where you can make an impact.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-neutral-white p-4 rounded-2xl shadow-sm border border-neutral-border/50">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray" size={20} />
            <input 
              type="text" 
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={20} className="text-neutral-gray hidden md:block" />
            <select 
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              className="w-full md:w-64 px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
            >
              {disciplines.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProblems.map((prob, i) => (
              <ProblemCard key={prob.id} problem={prob} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-playfair font-bold text-primary mb-2">No problems found</h3>
            <p className="text-neutral-gray">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedDiscipline('All'); }}
              className="mt-4 px-6 py-2 bg-accent text-neutral-white font-bold rounded-xl shadow-md hover:bg-accent-hover transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
