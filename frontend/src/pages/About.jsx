import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Lightbulb, Globe } from 'lucide-react';

const TEAM = [
  {
    id: 1,
    name: 'Team Member 1',
    role: 'Founder & CEO',
    org: 'mKavs Global Tech',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=70&auto=format'
  },
  {
    id: 2,
    name: 'Team Member 2',
    role: 'CTO & Admin Lead',
    org: 'mKavs Global Tech',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=70&auto=format'
  },
  {
    id: 3,
    name: 'Team Member 3',
    role: 'Academic Director',
    org: 'Delhi Public School',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=70&auto=format'
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>About | GRIFA</title>
        <meta name="description" content="Learn about our mission, vision, and the team behind GRIFA." />
      </Helmet>

      {/* Hero */}
      <div className="bg-primary py-20 mb-16 text-center">
        <div className="container mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral-white mb-6"
           viewport={{ once: true }}>
            Empowering Research <span className="text-accent-light italic">Globally</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-white/70 max-w-2xl mx-auto"
           viewport={{ once: true }}>
            We bridge the gap between everyday challenges and academic rigor, allowing researchers worldwide to solve real problems.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Target, title: 'Our Mission', desc: 'To document the undocumented problems of the developing world and present them as rigorous research statements.' },
            { icon: Lightbulb, title: 'Our Vision', desc: 'A world where academic research directly correlates with tangible improvements in everyday human life.' },
            { icon: Globe, title: 'Global Reach', desc: 'Connecting local issues observed in India with researchers, scientists, and students globally.' }
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-white p-8 rounded-3xl shadow-sm border border-neutral-border/50 text-center"
            >
              <div className="w-16 h-16 mx-auto bg-accent-light text-accent rounded-full flex items-center justify-center mb-6">
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-playfair font-bold text-primary mb-3">{item.title}</h3>
              <p className="text-neutral-gray">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-4">Meet The Team</h2>
          <p className="text-neutral-gray max-w-2xl mx-auto">
            The passionate individuals working to make GRIFA a reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <motion.div key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-white p-6 rounded-3xl shadow-sm border border-neutral-border/50 text-center group hover:shadow-md transition-shadow"
            >
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-accent-light group-hover:border-accent transition-colors">
                <img src={member.image} alt={member.name} width="160" height="160" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
              <p className="text-accent font-medium text-sm mb-1">{member.role}</p>
              <p className="text-neutral-gray text-xs">{member.org}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
