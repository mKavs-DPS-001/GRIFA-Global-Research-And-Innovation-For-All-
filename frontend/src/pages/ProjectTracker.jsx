import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Search } from 'lucide-react';

const PROJECTS = [
  {
    id: 'prj-1',
    name: 'AI in Climate Research',
    lead: 'Dr. Ramesh Babu',
    institution: 'IISc Bangalore',
    progress: 65,
    status: 'active',
    lastUpdate: '2 days ago'
  },
  {
    id: 'prj-2',
    name: 'Quantum Computing Basics',
    lead: 'Prof. Meera Iyer',
    institution: 'IIT Madras',
    progress: 40,
    status: 'active',
    lastUpdate: '1 week ago'
  },
  {
    id: 'prj-3',
    name: 'Biomedical Signal Processing',
    lead: 'Dr. Arjun Nair',
    institution: 'AIIMS Delhi',
    progress: 80,
    status: 'active',
    lastUpdate: '3 hours ago'
  },
  {
    id: 'prj-4',
    name: 'Newtonian Fluid Speed Breakers',
    lead: 'Prof. Suresh S.',
    institution: 'REVA University',
    progress: 100,
    status: 'completed',
    lastUpdate: '1 month ago'
  }
];

export default function ProjectTracker() {
  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>Project Tracker | GRIFA</title>
        <meta name="description" content="Track the progress of ongoing research projects." />
      </Helmet>

      <div className="bg-primary py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral-white mb-4"
           viewport={{ once: true }}>
            Project Tracker
          </motion.h1>
          <motion.p initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-white/70 max-w-2xl mx-auto"
           viewport={{ once: true }}>
            Live updates on the progress of research initiatives funded and supported by the GRIFA platform.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-gray" size={20} />
            <input 
              type="text" 
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-neutral-white border border-neutral-border/50 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="px-4 py-2 rounded-full bg-primary text-neutral-white text-sm font-bold">All</button>
            <button className="px-4 py-2 rounded-full bg-neutral-white border border-neutral-border text-neutral-gray hover:bg-neutral-offwhite text-sm font-bold transition-colors">Active</button>
            <button className="px-4 py-2 rounded-full bg-neutral-white border border-neutral-border text-neutral-gray hover:bg-neutral-offwhite text-sm font-bold transition-colors">Completed</button>
          </div>
        </div>

        <div className="space-y-6">
          {PROJECTS.map((project, i) => (
            <motion.div key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-white p-6 rounded-3xl shadow-sm border border-neutral-border/50 hover:shadow-md transition-shadow"
             viewport={{ once: true }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-primary">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      project.status === 'active' 
                        ? 'bg-accent-light/50 text-accent' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-neutral-gray text-sm">Lead: <span className="font-semibold text-primary">{project.lead}</span> • {project.institution}</p>
                </div>
                <div className="text-right w-full md:w-auto">
                  <div className="text-sm text-neutral-gray mb-1 flex items-center justify-end gap-1">
                    <Activity size={14} /> Updated {project.lastUpdate}
                  </div>
                  <div className="text-2xl font-bold text-accent">{project.progress}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-neutral-offwhite rounded-full overflow-hidden border border-neutral-border/30">
                <motion.div initial={{ width: 0 }}
                  whileInView={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${project.status === 'completed' ? 'bg-primary' : 'bg-accent'}`}
                  viewport={{ once: true }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
