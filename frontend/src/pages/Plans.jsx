import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Minus, ChevronDown, Plus, Zap, BookOpen, FlaskConical, GraduationCap, Lightbulb, Clock, FileText, Award } from 'lucide-react';
import { auth } from '../firebase/config';


const PLANS = [
  {
    id: 'explorer',
    tier: 'Plan 1',
    name: 'Explorer',
    tagline: 'Your entry point into structured research',
    price: 99,
    cta: 'Start Exploring',
    popular: false,
    icon: BookOpen,
    color: 'text-neutral-gray',
    features: [
      'Detailed problem statement document',
      'Curated literature review links',
      'Documented field observations',
      'PDF download included',
    ],
  },
  {
    id: 'analyst',
    tier: 'Plan 2',
    name: 'Analyst',
    tagline: 'Turn curiosity into a research direction',
    price: 999,
    cta: 'Start Analyzing',
    popular: true,
    icon: FlaskConical,
    color: 'text-accent',
    features: [
      'Everything in Explorer',
      'Proposed research methodologies',
      'Resource & equipment checklist',
      'Initial hypothesis framework',
      'Email support (48hr response)',
    ],
  },
  {
    id: 'researcher',
    tier: 'Plan 3',
    name: 'Researcher',
    tagline: 'Guided research with expert mentorship',
    price: 2999,
    cta: 'Begin Research',
    popular: false,
    icon: GraduationCap,
    color: 'text-neutral-gray',
    features: [
      'Everything in Analyst',
      '2 hours of 1-on-1 mentorship',
      'Data collection guidance',
      'Research design review',
      'Priority email support',
    ],
  },
  {
    id: 'scholar',
    tier: 'Plan 4',
    name: 'Scholar',
    tagline: 'Complete research pipeline to publication',
    price: 4999,
    cta: 'Publish Your Work',
    popular: false,
    icon: Award,
    color: 'text-neutral-gray',
    features: [
      'Everything in Researcher',
      'Paper drafting assistance',
      'Peer-review simulation session',
      'Journal submission support',
      'Certificate of Completion',
    ],
  },
  {
    id: 'innovator',
    tier: 'Plan 5',
    name: 'Innovator',
    tagline: 'End-to-end from research to patent filing',
    price: 29999,
    cta: 'File Your Patent',
    popular: false,
    icon: Lightbulb,
    color: 'text-neutral-gray',
    features: [
      'Everything in Scholar',
      'IPR legal consultation',
      'Full patent drafting support',
      'Filing fee support (T&C apply)',
      'Commercialization roadmap',
      'Dedicated project manager',
    ],
  },
];

// ─── Comparison Table ─────────────────────────────────────────────────────────

const COMPARE_FEATURES = [
  { feature: 'Problem statement document', plans: [true, true, true, true, true] },
  { feature: 'Literature review links', plans: [true, true, true, true, true] },
  { feature: 'Field observations PDF', plans: [true, true, true, true, true] },
  { feature: 'Research methodology guide', plans: [false, true, true, true, true] },
  { feature: 'Hypothesis framework', plans: [false, true, true, true, true] },
  { feature: 'Resource & equipment checklist', plans: [false, true, true, true, true] },
  { feature: 'Email support', plans: [false, true, true, true, true] },
  { feature: '1-on-1 mentorship (2 hrs)', plans: [false, false, true, true, true] },
  { feature: 'Data collection guidance', plans: [false, false, true, true, true] },
  { feature: 'Research design review', plans: [false, false, true, true, true] },
  { feature: 'Paper drafting assistance', plans: [false, false, false, true, true] },
  { feature: 'Peer-review simulation', plans: [false, false, false, true, true] },
  { feature: 'Journal submission support', plans: [false, false, false, true, true] },
  { feature: 'Certificate of Completion', plans: [false, false, false, true, true] },
  { feature: 'IPR legal consultation', plans: [false, false, false, false, true] },
  { feature: 'Full patent drafting', plans: [false, false, false, false, true] },
  { feature: 'Dedicated project manager', plans: [false, false, false, false, true] },
  { feature: 'Commercialization roadmap', plans: [false, false, false, false, true] },
];

// ─── Add-ons ──────────────────────────────────────────────────────────────────

const ADDONS = [
  { icon: Clock, name: 'Extra Mentorship Hour', price: 499, desc: 'Book an additional 1-on-1 session with your assigned mentor.' },
  { icon: FileText, name: 'Plagiarism Report', price: 199, desc: 'Full Turnitin-style originality check for your research paper.' },
  { icon: Zap, name: 'Patent Search Report', price: 999, desc: 'Prior art search to verify the novelty of your innovation.' },
  { icon: Award, name: 'Research Poster Design', price: 599, desc: 'Professional A2 conference-ready poster designed for your work.' },
];

// ─── FAQs ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Can I upgrade my plan later?',
    a: 'Yes. You can upgrade at any time by paying the difference between your current plan and the target plan. Your existing deliverables and access are retained.',
  },
  {
    q: 'Is there a refund policy?',
    a: 'We offer a 7-day full refund on Plans 1, 2, and 3 if you have not downloaded or accessed any exclusive materials. Plans 4 and 5 are non-refundable once mentorship sessions begin.',
  },
  {
    q: 'Who are the mentors?',
    a: 'All mentors are verified researchers, professors, or doctoral candidates from reputable universities and research institutions. Each mentor is selected based on their publication history and domain expertise.',
  },
  {
    q: 'Can school students enroll?',
    a: 'Absolutely. GRIFA is specifically designed for curious minds from Class 8 onwards. Many of our most innovative submissions come from high school researchers tackling real-world problems.',
  },
  {
    q: 'How does payment work?',
    a: 'All payments are processed securely via Razorpay. We accept UPI, credit/debit cards, and net banking. You will receive a confirmation email and invoice within minutes of payment.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PricingCard({ plan, index, onEnroll }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`relative flex flex-col bg-neutral-white rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1.5 group ${
        plan.popular
          ? 'border-2 border-accent shadow-[0_8px_32px_rgba(26,86,219,0.18)]'
          : 'border border-neutral-border/60 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(26,86,219,0.10)]'
      }`}
     viewport={{ once: true }}>
      {plan.popular && (
        <div className="absolute -top-3.5 right-5">
          <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon + Tier + Name */}
      <div className="mb-5">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${plan.popular ? 'bg-accent/10 text-accent' : 'bg-neutral-offwhite text-neutral-gray'}`}>
          <plan.icon size={20} />
        </div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-gray/60 mb-0.5">{plan.tier}</p>
        <h3 className="text-2xl font-playfair font-bold text-primary">{plan.name}</h3>
        <p className="text-sm text-neutral-gray mt-1 leading-snug">{plan.tagline}</p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1 mb-6 pb-6 border-b border-neutral-border/50">
        <span className="text-lg font-bold text-neutral-gray/70 mb-1.5">₹</span>
        <span className="text-5xl font-playfair font-bold text-primary">
          {plan.price.toLocaleString('en-IN')}
        </span>
        <span className="text-sm text-neutral-gray mb-1.5 ml-1">/ one-time</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-grow mb-7">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-neutral-dark leading-snug">
            <Check size={15} className="text-accent shrink-0 mt-0.5 font-bold" strokeWidth={3} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onEnroll(plan)}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
          plan.popular
            ? 'bg-accent text-white hover:bg-accent-hover shadow-md shadow-accent/20'
            : 'bg-primary text-white hover:bg-primary-light'
        }`}
      >
        {plan.cta}
      </button>
    </motion.div>
  );
}


function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-border/60 rounded-2xl bg-neutral-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-neutral-offwhite transition-colors"
      >
        <span className="font-semibold text-primary">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-neutral-gray transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-neutral-gray leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Plans() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async (plan) => {
    if (!auth.currentUser) {
      alert("Please login to enroll in a plan.");
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      
      // 1. Create order
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId: plan.id, amount: plan.price })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create order');

      const { orderId, amount, currency } = data.data;

      // 2. Open Razorpay
      const options = {
        key: 'rzp_test_mock_key', // In real life, use your actual key
        amount: amount,
        currency: currency,
        name: 'GRIFA',
        description: `Enrollment for ${plan.name} Plan`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // 3. Verify payment
            const verifyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/enrollments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              navigate('/dashboard');
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            alert('Verification Error: ' + err.message);
          }
        },
        prefill: {
          name: auth.currentUser.displayName || '',
          email: auth.currentUser.email || ''
        },
        theme: {
          color: '#1A56DB'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-offwhite">
      <Helmet>
        <title>Plans &amp; Pricing | GRIFA</title>
        <meta name="description" content="Choose a research plan — from problem exploration to patent filing." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-primary pt-32 pb-20 text-center relative overflow-hidden">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
           viewport={{ once: true }}>
            <span className="inline-block text-[11px] uppercase tracking-widest font-bold text-accent-light bg-accent/10 border border-accent/20 px-3 py-1 rounded-full mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-5 leading-tight">
              Choose Your Research Path
            </h1>
            <p className="text-neutral-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              From understanding a problem to filing a global patent — GRIFA supports every stage of your research journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {PLANS.map((plan, i) => (
              <PricingCard key={plan.id} plan={plan} index={i} onEnroll={handleEnroll} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Compare Plans Table ── */}
      <section className="py-20 bg-neutral-white border-y border-neutral-border/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-3">Compare Plans</h2>
            <p className="text-neutral-gray">A full feature breakdown across all five research tiers.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-neutral-border/60">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="bg-neutral-offwhite border-b border-neutral-border/60">
                  <th className="text-left py-4 px-5 text-neutral-gray font-semibold text-xs uppercase tracking-wider w-1/3">Feature</th>
                  {PLANS.map(p => (
                    <th key={p.id} className="py-4 px-3 text-center">
                      <span className={`text-xs font-bold uppercase tracking-wider ${p.popular ? 'text-accent' : 'text-primary'}`}>
                        {p.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FEATURES.map((row, ri) => (
                  <tr
                    key={ri}
                    className={`border-b border-neutral-border/40 transition-colors hover:bg-neutral-offwhite/70 ${
                      ri % 2 === 0 ? 'bg-white' : 'bg-neutral-offwhite/40'
                    }`}
                  >
                    <td className="py-3.5 px-5 text-neutral-dark font-medium">{row.feature}</td>
                    {row.plans.map((included, ci) => (
                      <td key={ci} className="py-3.5 px-3 text-center">
                        {included ? (
                          <Check size={16} className="text-accent mx-auto" strokeWidth={3} />
                        ) : (
                          <Minus size={16} className="text-neutral-border mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section className="py-20 bg-neutral-offwhite">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-3">Build Your Own Pipeline</h2>
            <p className="text-neutral-gray max-w-xl mx-auto">
              Purchase individual research services as standalone add-ons and build a customized workflow on top of any plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADDONS.map((addon, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-neutral-white rounded-2xl p-6 border border-neutral-border/60 hover:border-accent/30 hover:shadow-[0_8px_24px_rgba(26,86,219,0.09)] transition-all group"
              >
                <div className="w-10 h-10 bg-accent/8 rounded-xl flex items-center justify-center mb-4 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <addon.icon size={20} />
                </div>
                <h4 className="font-bold text-primary mb-1">{addon.name}</h4>
                <p className="text-xs text-neutral-gray mb-4 leading-relaxed">{addon.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-playfair font-bold text-lg text-primary">₹{addon.price}</span>
                  <button className="flex items-center gap-1 text-xs font-bold text-accent border border-accent/30 hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={13} /> Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 bg-neutral-white border-t border-neutral-border/50">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-3">Frequently Asked Questions</h2>
            <p className="text-neutral-gray">Everything you need to know before you start.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
            Not sure which plan to pick?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Start with Explorer at ₹99 and upgrade anytime. There's no risk.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => handleEnroll(PLANS[0])} disabled={loading} className="px-8 py-3.5 bg-white text-accent font-bold rounded-xl hover:bg-neutral-offwhite transition-colors shadow-lg disabled:opacity-75">
              {loading ? 'Processing...' : 'Start with Explorer — ₹99'}
            </button>
            <a href="mailto:info@grifa.in" className="px-8 py-3.5 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Talk to Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
