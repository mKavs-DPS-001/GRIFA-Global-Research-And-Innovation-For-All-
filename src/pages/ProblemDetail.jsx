import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';
import { ALL_PROBLEMS } from './Problems';
import EnquiryForm from '../components/EnquiryForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemDetail() {
  const { id } = useParams();
  const problem = ALL_PROBLEMS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Problem not found</h2>
          <Link to="/problems" className="text-accent font-bold hover:underline">Return to Problems</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>{problem.title} | GRIFA</title>
        <meta name="description" content={problem.description} />
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/problems" className="inline-flex items-center gap-2 text-neutral-gray hover:text-accent font-medium mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Problems
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {problem.disciplines.map(d => (
                  <span key={d} className="px-3 py-1 bg-accent-light text-accent font-bold text-xs rounded-full uppercase tracking-wide">
                    {d}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6 leading-tight">
                {problem.title}
              </h1>
              <p className="text-lg text-neutral-dark leading-relaxed">
                {problem.description}
              </p>
            </motion.div>

            {/* Video */}
            <motion.div initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            className="rounded-3xl overflow-hidden shadow-sm border border-neutral-border/50 bg-[#0B1F3A] relative pt-[56.25%]"
             viewport={{ once: true }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/25"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                <span className="text-white/40 text-sm font-semibold tracking-widest uppercase">Video Coming Soon</span>
              </div>
            </motion.div>

            {/* Interdisciplinary Breakdown */}
            <div className="bg-neutral-white p-8 rounded-3xl border border-neutral-border/50 shadow-sm">
              <h3 className="text-2xl font-playfair font-bold text-primary mb-6 flex items-center gap-3">
                <Users className="text-accent" /> Interdisciplinary Breakdown
              </h3>
              <div className="space-y-6">
                {problem.disciplines.map((disc, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1">
                      <CheckCircle className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-1">{disc} Perspective</h4>
                      <p className="text-sm text-neutral-gray">
                        Researchers from {disc.toLowerCase()} can contribute by analyzing the problem through their unique frameworks and proposing specialized solutions that integrate with the whole.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <EnquiryForm defaultProblem={problem.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
