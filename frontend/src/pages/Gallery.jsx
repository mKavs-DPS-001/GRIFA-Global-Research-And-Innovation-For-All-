import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  { id: 1, category: 'Research', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=70&auto=format', title: 'Laboratory Analysis' },
  { id: 2, category: 'Field Work', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=70&auto=format', title: 'Data Collection' },
  { id: 3, category: 'Campus', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=70&auto=format', title: 'DPS Campus' },
  { id: 4, category: 'Research', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=70&auto=format', title: 'Medical Research' },
  { id: 5, category: 'Field Work', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=70&auto=format', title: 'Community Survey' },
  { id: 6, category: 'Campus', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=70&auto=format', title: 'Student Collaboration' },
];

const CATEGORIES = ['All', 'Research', 'Field Work', 'Campus'];

export default function Gallery() {
  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All' 
    ? IMAGES 
    : IMAGES.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>Gallery | GRIFA</title>
        <meta name="description" content="Visuals from our research, field work, and campus." />
      </Helmet>

      <div className="bg-primary py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral-white mb-4"
           viewport={{ once: true }}>
            Gallery
          </motion.h1>
          <motion.p initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-white/70 max-w-2xl mx-auto"
           viewport={{ once: true }}>
            A glimpse into the real-world impact of GRIFA projects.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === cat 
                  ? 'bg-accent text-neutral-white shadow-md' 
                  : 'bg-neutral-white text-neutral-gray border border-neutral-border/50 hover:border-accent hover:text-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredImages.map(img => (
              <motion.div layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={img.id}
                className="relative group rounded-3xl overflow-hidden shadow-sm aspect-[4/3] bg-neutral-border"
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  width="400" height="300" loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-accent-light text-xs font-bold uppercase tracking-wider mb-1">{img.category}</span>
                  <h3 className="text-neutral-white font-bold text-lg">{img.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
