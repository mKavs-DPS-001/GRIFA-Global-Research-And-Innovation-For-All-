import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/problems/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProblem(data.data);
        }
      })
      .catch(err => console.error("Failed to fetch problem detail:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold text-primary">Loading Problem...</h2>
      </div>
    );
  }

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
              className="rounded-3xl overflow-hidden shadow-sm border border-neutral-border/50 relative pt-[56.25%]"
              viewport={{ once: true }}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 40%, #0d1a35 70%, #080f20 100%)' }}
              >
                {/* Subtle grid lines */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '48px 48px'
                }} />

                {/* Glow blob */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div style={{
                    width: '260px', height: '140px',
                    background: 'radial-gradient(ellipse, rgba(255,0,0,0.10) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                  }} />
                </div>

                {/* Play button with pulse ring */}
                <div className="relative flex items-center justify-center z-10">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute rounded-full"
                    style={{ width: 88, height: 88, border: '1.5px solid rgba(255,60,60,0.45)' }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0, 0.15] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    className="absolute rounded-full"
                    style={{ width: 110, height: 110, border: '1px solid rgba(255,60,60,0.2)' }}
                  />
                  {/* YouTube button */}
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <svg width="30" height="21" viewBox="0 0 22 16" fill="none">
                      <path d="M21.54 2.5A2.76 2.76 0 0 0 19.6.54C17.9 0 11 0 11 0S4.1 0 2.4.54A2.76 2.76 0 0 0 .46 2.5 29 29 0 0 0 0 8a29 29 0 0 0 .46 5.5A2.76 2.76 0 0 0 2.4 15.46C4.1 16 11 16 11 16s6.9 0 8.6-.54a2.76 2.76 0 0 0 1.94-1.96A29 29 0 0 0 22 8a29 29 0 0 0-.46-5.5Z" fill="#FF0000"/>
                      <polygon points="8.75,11.5 14.5,8 8.75,4.5" fill="white"/>
                    </svg>
                  </div>
                </div>

                {/* Label */}
                <div className="z-10 flex flex-col items-center gap-1.5">
                  <span className="text-white/85 text-xs font-semibold tracking-[0.2em] uppercase">
                    Coming Soon on YouTube
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/35 text-[11px] tracking-wider uppercase">Video in production</span>
                  </div>
                </div>
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
