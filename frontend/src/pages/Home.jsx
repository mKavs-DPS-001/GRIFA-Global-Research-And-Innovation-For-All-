import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb, Users, Video, FileText } from 'lucide-react';
import ProblemCard from '../components/ProblemCard';
import ScientistCard from '../components/ScientistCard';

const FEATURED_PROBLEMS = [
  {
    id: 'speed-breakers',
    title: 'Newtonian Fluid Alternative to Asphalt Speed Breakers',
    description: 'Traditional speed breakers cause vehicle damage and discomfort. Can non-Newtonian fluids provide dynamic resistance based on vehicle speed?',
    disciplines: ['Physics', 'Civil Engineering', 'Materials Science'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678901',
    views: 1250
  },
  {
    id: 'bus-stand',
    title: 'Safe & Budget-Friendly Snacks at Bus Stands',
    description: 'Creating a sustainable, hygienic business model for snack vendors at rural and semi-urban bus stands.',
    disciplines: ['Business', 'Food Tech', 'Public Health'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678902',
    views: 840
  },
  {
    id: 'open-urination',
    title: 'Interdisciplinary Solutions to Open Urination',
    description: 'Addressing the behavioral, infrastructural, and psychological aspects of open urination in urban spaces.',
    disciplines: ['Psychology', 'Urban Planning', 'Sociology'],
    videoUrl: 'https://www.youtube.com/watch?v=12345678903',
    views: 2100
  }
];

const FEATURED_SCIENTISTS = [
  {
    id: 's1',
    name: 'Dr. Researcher A',
    institution: 'IISc Bangalore',
    expertise: 'Advanced Materials & Fluid Dynamics',
    disciplines: ['Physics', 'Materials Science'],
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=70&auto=format'
  },
  {
    id: 's2',
    name: 'Dr. Researcher B',
    institution: 'GCU',
    expertise: 'Environmental Psychology & Urban Behavior',
    disciplines: ['Psychology', 'Sociology'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=70&auto=format'
  },
  {
    id: 's3',
    name: 'Prof. Researcher C',
    institution: 'REVA University',
    expertise: 'Sustainable Civil Engineering',
    disciplines: ['Civil Engineering', 'Architecture'],
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=70&auto=format'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Home | GRIFA</title>
        <meta name="description" content="Research That Actually Matters. Real problems. Real solutions. Real impact." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-primary overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-neutral-white mb-6"
           viewport={{ once: true }}>
            Research That <span className="text-accent-light italic">Actually</span> Matters
          </motion.h1>
          
          <motion.p initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-white/80 font-light mb-10"
           viewport={{ once: true }}>
            Real problems. Real solutions. Real impact.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
           viewport={{ once: true }}>
            <Link to="/problems" className="px-8 py-4 bg-accent text-neutral-white font-bold rounded-xl hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/20 flex items-center gap-2">
              Explore Problems <ArrowRight size={20} />
            </Link>
            <Link to="/plans" className="px-8 py-4 border-2 border-white/20 text-neutral-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              View Plans
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-offwhite py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Videos', value: '335+' },
              { label: 'Researchers', value: '110+' },
              { label: 'Disciplines', value: '5+' },
              { label: 'Real Problems', value: '100%' }
            ].map((stat, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-white p-6 rounded-2xl shadow-sm border border-neutral-border/50"
              >
                <div className="text-4xl md:text-5xl font-playfair font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-primary uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-neutral-offwhite border-t border-neutral-border/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">How It Works</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">From real-world observation to actionable research.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral-border/50 -translate-y-1/2 z-0"></div>

            {[
              { icon: Lightbulb, title: 'Problem Identified', desc: 'Real issues documented from everyday life.', step: '1' },
              { icon: Video, title: 'Video Published', desc: 'DPS shoots and uploads the problem to YouTube.', step: '2' },
              { icon: FileText, title: 'Form Submitted', desc: 'Researchers select a plan and submit interest.', step: '3' },
              { icon: Users, title: 'Research Begins', desc: 'Collaboration with scientists to find solutions.', step: '4' }
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center text-center bg-neutral-white p-6 rounded-2xl shadow-sm border border-neutral-border/50 pt-10"
              >
                <div className="absolute -top-5 w-10 h-10 bg-accent text-neutral-white rounded-full flex items-center justify-center font-bold shadow-md border-4 border-neutral-offwhite">
                  {item.step}
                </div>
                <div className="w-16 h-16 text-accent flex items-center justify-center mb-4">
                  <item.icon size={36} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-gray">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className="py-24 bg-neutral-white border-t border-neutral-border/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-playfair font-bold text-primary mb-4">Featured Problems</h2>
              <p className="text-neutral-gray">Explore some of the pressing issues waiting for a mind like yours.</p>
            </div>
            <Link to="/problems" className="hidden md:flex items-center gap-2 text-accent font-bold hover:text-accent-hover transition-colors">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {FEATURED_PROBLEMS.map((prob, i) => (
              <ProblemCard key={prob.id} problem={prob} index={i} />
            ))}
          </div>
          
          <div className="md:hidden text-center mt-8">
            <Link to="/problems" className="inline-flex items-center gap-2 text-accent font-bold border border-accent px-6 py-3 rounded-xl hover:bg-accent hover:text-neutral-white transition-colors">
              View All Problems
            </Link>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-24 bg-primary text-neutral-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-16 text-neutral-white">Interdisciplinary Approach</h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {['Language', 'Psychology', 'Programming', 'Architecture & Civil', 'Hotel Management'].map((disc, i) => (
              <motion.div key={i}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-4 md:px-8 md:py-6 rounded-2xl border border-white/20 cursor-pointer transition-colors hover:bg-accent hover:border-accent"
              >
                <span className="text-lg md:text-xl font-bold">{disc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scientists Spotlight */}
      <section className="py-24 bg-neutral-offwhite">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">Meet the Experts</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">Collaborate with leading scientists across top institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_SCIENTISTS.map((scientist, i) => (
              <ScientistCard key={scientist.id} scientist={scientist} index={i} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/scientists" className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent-hover transition-colors">
              View All Scientists <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-accent text-neutral-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8">
            Every problem needs a mind.
          </h2>
          <Link to="/problems" className="inline-block px-10 py-5 bg-neutral-white text-accent font-bold rounded-xl hover:bg-neutral-offwhite transition-all shadow-xl hover:scale-105">
            Find Your Problem Today
          </Link>
        </div>
      </section>
    </div>
  );
}
