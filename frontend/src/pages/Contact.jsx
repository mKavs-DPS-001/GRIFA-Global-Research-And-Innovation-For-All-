import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MapPin, Phone, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://grifa.bydps.com'}/api/v1/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message');
      }
    } catch(err) {
      setStatus('error');
      setErrorMessage('Network error, please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-offwhite pt-24 pb-20">
      <Helmet>
        <title>Contact | GRIFA</title>
        <meta name="description" content="Get in touch with the GRIFA team." />
      </Helmet>

      <div className="bg-primary py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-playfair font-bold text-neutral-white mb-4"
           viewport={{ once: true }}>
            Get in Touch
          </motion.h1>
          <motion.p initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-white/70 max-w-2xl mx-auto"
           viewport={{ once: true }}>
            Have questions about a problem statement, a research plan, or looking to collaborate? We'd love to hear from you.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-neutral-white p-8 rounded-3xl shadow-sm border border-neutral-border/50">
              <h3 className="text-2xl font-playfair font-bold text-primary mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent-light p-3 rounded-xl text-accent">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Location</h4>
                    <p className="text-neutral-gray">Delhi Public School, Electronic City, Bengaluru, Karnataka — 560100</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent-light p-3 rounded-xl text-accent">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Email</h4>
                    <p className="text-neutral-gray">info@grifa.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent-light p-3 rounded-xl text-accent">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Phone</h4>
                    <p className="text-neutral-gray">+91 XXXXX XXXXX {/* TODO: Add real phone number */}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Card */}
            <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-8 rounded-3xl shadow-md text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Chat with us on WhatsApp</h3>
                <p className="text-white/80">Get instant answers to your queries.</p>
              </div>
              <a 
                href="https://wa.me/91XXXXXXXXXX" 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-[#128C7E] p-4 rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                <MessageCircle size={32} />
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-sm border border-neutral-border/50 bg-neutral-white h-64 w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x3bae6b62d3a39151%3A0xe54e60bc210cd041!2sDelhi%20Public%20School%2C%20Electronic%20City!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="DPS Electronic City Map"
              ></iframe>
            </div>
          </div>

          {/* Form */}
          <div className="bg-neutral-white p-8 lg:p-10 rounded-3xl shadow-sm border border-neutral-border/50">
            <h3 className="text-2xl font-playfair font-bold text-primary mb-6">Send a Message</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {status === 'success' && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                  <CheckCircle size={20} /> Message sent successfully! We will get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl">
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">Message</label>
                <textarea name="message" required value={formData.message} onChange={handleChange} rows="5" className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent resize-none" placeholder="Your message..."></textarea>
              </div>
              <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-all flex justify-center items-center gap-2 shadow-md disabled:bg-neutral-gray">
                {status === 'loading' ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
