import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { Loader2 } from 'lucide-react';

const PLANS = [
  { id: 'plan-1', name: 'Plan 1 — Problem Statement', price: 99 },
  { id: 'plan-2', name: 'Plan 2 — Problem + Action', price: 999 },
  { id: 'plan-3', name: 'Plan 3 — Problem + Action + Research Assistance', price: 2999 },
  { id: 'plan-4', name: 'Plan 4 — Problem + Action + Research + Publication', price: 4999 },
  { id: 'plan-5', name: 'Plan 5 — Full Pipeline till IPR/Patent', price: 29999 }
];

export default function EnquiryForm({ defaultProblem = '' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    discipline: '',
    problemInterest: defaultProblem,
    planId: PLANS[0].id,
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (enquiryId, selectedPlan) => {
    const res = await loadRazorpay();
    
    if (!res) {
      setStatus({ type: 'error', message: 'Razorpay SDK failed to load. Are you online?' });
      return;
    }
    
    const options = {
      key: 'PLACEHOLDER_RAZORPAY_KEY',
      amount: selectedPlan.price * 100,
      currency: 'INR',
      name: 'GRIFA Platform',
      description: selectedPlan.name,
      handler: async function (response) {
        try {
          await addDoc(collection(db, 'payments'), {
            enquiryId,
            paymentId: response.razorpay_payment_id,
            amount: selectedPlan.price,
            planName: selectedPlan.name,
            timestamp: serverTimestamp(),
            status: 'completed'
          });
          
          setStatus({ type: 'success', message: 'Payment successful! Check your dashboard for access.' });
        } catch (error) {
          console.error("Error saving payment", error);
        }
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone
      },
      theme: {
        color: '#1A56DB' // Accent Blue
      }
    };
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const docRef = await addDoc(collection(db, 'enquiries'), {
        ...formData,
        timestamp: serverTimestamp(),
        paymentStatus: 'pending'
      });

      await emailjs.send(
        'PLACEHOLDER_SERVICE_ID',
        'PLACEHOLDER_TEMPLATE_ID',
        {
          to_name: 'DPSP Admin',
          from_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          problem: formData.problemInterest,
          plan: PLANS.find(p => p.id === formData.planId)?.name,
          message: formData.message
        },
        'PLACEHOLDER_PUBLIC_KEY'
      );

      const selectedPlan = PLANS.find(p => p.id === formData.planId);
      await handlePayment(docRef.id, selectedPlan);
      
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-white rounded-3xl p-8 shadow-sm border border-neutral-border/50 max-w-2xl mx-auto">
      <h3 className="text-2xl font-playfair font-bold text-primary mb-6">Submit Your Interest</h3>
      
      {status.message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${
          status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Full Name</label>
            <input 
              type="text" required name="fullName"
              value={formData.fullName} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Email</label>
            <input 
              type="email" required name="email"
              value={formData.email} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Phone Number</label>
            <input 
              type="tel" required name="phone"
              value={formData.phone} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Institution / Organisation</label>
            <input 
              type="text" required name="institution"
              value={formData.institution} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Discipline</label>
            <input 
              type="text" required name="discipline" placeholder="e.g. Psychology"
              value={formData.discipline} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">Problem of Interest</label>
            <input 
              type="text" required name="problemInterest"
              value={formData.problemInterest} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-primary mb-3 mt-4 border-t pt-4 border-neutral-border/50">Select Research Plan</label>
          <div className="space-y-2">
            {PLANS.map((plan) => (
              <label key={plan.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                formData.planId === plan.id ? 'border-accent bg-accent-light/30' : 'border-neutral-border hover:border-accent-light'
              }`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="radio" 
                    name="planId" 
                    value={plan.id}
                    checked={formData.planId === plan.id}
                    onChange={handleChange}
                    className="w-4 h-4 text-accent focus:ring-accent"
                  />
                  <span className="text-sm font-medium text-neutral-dark">{plan.name}</span>
                </div>
                <span className="font-bold text-primary">₹{plan.price.toLocaleString()}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-1 mt-4">Message / Query (Optional)</label>
          <textarea 
            name="message" rows="3"
            value={formData.message} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 rounded-xl bg-accent text-neutral-white font-bold text-lg hover:bg-accent-hover transition-all shadow-md flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Processing...</>
          ) : (
            'Proceed to Payment'
          )}
        </button>
      </form>
    </div>
  );
}
