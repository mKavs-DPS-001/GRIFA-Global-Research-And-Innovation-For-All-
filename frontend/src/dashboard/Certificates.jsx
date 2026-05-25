import React from 'react';
import { CERTIFICATE } from './data';
import { GraduationCap, ArrowRight, Download, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Certificates() {
  const handleDownload = () => {
    alert("Certificate download coming soon");
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0B1F3A', margin: '0 0 4px' }}>My Certificates</h1>
      </div>

      {CERTIFICATE ? (
        <div style={{ maxWidth: 700 }}>
          <div style={{ 
            background: '#fff', borderRadius: 16, padding: 40, border: '2px solid #FBBF24', 
            boxShadow: '0 10px 30px rgba(251, 191, 36, 0.1)', textAlign: 'center', position: 'relative' 
          }}>
            <div style={{ marginBottom: 24 }}>
              {/* Fake seal SVG */}
              <svg width="80" height="80" viewBox="0 0 100 100" style={{ margin: '0 auto' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="5,5" />
                <circle cx="50" cy="50" r="35" fill="#FFFBEB" stroke="#FBBF24" strokeWidth="2" />
                <text x="50" y="55" fontFamily="serif" fontSize="16" fontWeight="bold" fill="#B45309" textAnchor="middle">GRIFA</text>
              </svg>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0B1F3A', margin: '0 0 8px', fontFamily: 'serif' }}>
              {CERTIFICATE.title}
            </h2>
            <p style={{ fontSize: 18, color: '#D97706', fontWeight: 600, margin: '0 0 24px' }}>
              {CERTIFICATE.tier}
            </p>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
              Issued on {CERTIFICATE.issued}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <button onClick={handleDownload} style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1,
              background: '#fff', border: '1px solid #E2E8F0', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#0B1F3A', cursor: 'pointer' 
            }}>
              <Download size={18} /> Download PDF
            </button>
            <a href="https://linkedin.com/in" target="_blank" rel="noopener noreferrer" style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1, textDecoration: 'none',
              background: '#0A66C2', border: 'none', padding: '12px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: '#fff' 
            }}>
              <Share2 size={18} /> Share to LinkedIn
            </a>
          </div>
        </div>
      ) : (
        <div style={{ 
          background: '#fff', borderRadius: 16, border: '1px dashed #CBD5E1', padding: 60, 
          textAlign: 'center', maxWidth: 600, margin: '0 auto', marginTop: 40 
        }}>
          <div style={{ width: 64, height: 64, background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#94A3B8' }}>
            <GraduationCap size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0B1F3A', margin: '0 0 8px' }}>No certificates yet.</h3>
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 24px', lineHeight: 1.5 }}>
            Complete your research pipeline to earn your first certificate. Certificates validate your research efforts and look great on college applications.
          </p>
          <Link to="/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
            Explore Plans <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
