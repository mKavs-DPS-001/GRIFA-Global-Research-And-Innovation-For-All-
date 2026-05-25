import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-neutral-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-playfair font-bold text-neutral-white mb-1">GRIFA</h3>
            <p className="text-[10px] tracking-widest uppercase text-accent-light font-medium mb-4">Global Research & Innovation For All</p>
            <p className="text-sm text-neutral-white/60 mb-6 leading-relaxed">
              A structured research platform connecting real-world problems with students, researchers, and scientists globally.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.youtube.com/@grifaglobalresearchinnovat1573"
                target="_blank"
                rel="noreferrer"
                aria-label="GRIFA on YouTube"
                className="group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,0,0,0.15)';
                  e.currentTarget.style.border = '1px solid rgba(255,0,0,0.35)';
                  e.currentTarget.style.boxShadow = '0 0 18px rgba(255,0,0,0.2)';
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* YouTube SVG Logo */}
                <svg width="20" height="14" viewBox="0 0 22 16" fill="none" aria-hidden="true">
                  <path d="M21.54 2.5A2.76 2.76 0 0 0 19.6.54C17.9 0 11 0 11 0S4.1 0 2.4.54A2.76 2.76 0 0 0 .46 2.5 29 29 0 0 0 0 8a29 29 0 0 0 .46 5.5A2.76 2.76 0 0 0 2.4 15.46C4.1 16 11 16 11 16s6.9 0 8.6-.54a2.76 2.76 0 0 0 1.94-1.96A29 29 0 0 0 22 8a29 29 0 0 0-.46-5.5Z" fill="#FF0000"/>
                  <polygon points="8.75,11.5 14.5,8 8.75,4.5" fill="white"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-white/40 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'About', path: '/about' },
                { name: 'Problems', path: '/problems' },
                { name: 'Plans & Pricing', path: '/plans' },
                { name: 'Scientists', path: '/scientists' },
                { name: 'Contact', path: '/contact' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-neutral-white/60 hover:text-accent-light transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-white/40 mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { name: 'Research Programs', path: '/problems' },
                { name: 'Project Tracker', path: '/projects' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Dashboard', path: '/dashboard' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-neutral-white/60 hover:text-accent-light transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-white/40 mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent-light shrink-0 mt-0.5" />
                <span className="text-neutral-white/60 text-sm leading-relaxed">
                  Bengaluru, Karnataka, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent-light shrink-0" />
                <a href="mailto:enquiry@bydps.com" className="text-neutral-white/60 hover:text-accent-light transition-colors text-sm">
                  enquiry@bydps.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent-light shrink-0" />
                {/* TODO: Add real phone number */}
                <span className="text-neutral-white/60 text-sm">+91 XXXXX XXXXX</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-neutral-white/40">
          <p>&copy; {new Date().getFullYear()} GRIFA by DPSP. All rights reserved.</p>
          <p>
            Built by{' '}
            <span className="text-accent-light font-semibold">mKavs Global Tech</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
