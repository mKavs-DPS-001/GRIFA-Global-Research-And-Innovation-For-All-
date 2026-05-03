import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldOff, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Floating Admin Mode toggle button.
 * Always visible in the bottom-right corner (above the WhatsApp button).
 * Lets any logged-in user (or even logged-out during dev) toggle admin mode.
 */
export default function AdminToggle() {
  const { isAdmin, adminOverride, toggleAdminMode } = useAuth();
  const [showLabel, setShowLabel] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-50 flex items-center justify-end gap-2">
      {/* Tooltip label — slides in on hover */}
      <AnimatePresence>
        {showLabel && (
          <motion.div initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.15 }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-lg pointer-events-none ${
              isAdmin
                ? 'bg-accent text-white'
                : 'bg-neutral-white text-primary border border-neutral-border'
            }`}
          >
            {isAdmin ? '✓ Admin Mode ON' : 'Enable Admin Mode'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button id="admin-mode-toggle"
        onClick={toggleAdminMode}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isAdmin ? 'Disable admin mode' : 'Enable admin mode'}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-200 ${
          isAdmin
            ? 'bg-accent text-white shadow-accent/30'
            : 'bg-neutral-white text-primary border-2 border-neutral-border hover:border-accent hover:text-accent'
        }`}
      >
        {isAdmin ? (
          <Shield size={20} strokeWidth={2} />
        ) : (
          <ShieldOff size={20} strokeWidth={2} className="opacity-60" />
        )}
      </motion.button>
    </div>
  );
}
