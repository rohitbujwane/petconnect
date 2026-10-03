import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, PhoneCall, ArrowRight } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white text-xs py-2 px-4 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-bold tracking-wide uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Animal Rescue Hotline:
          </span>
          <span className="font-semibold text-rose-100 hidden md:inline">
            Spot an injured, trapped, or abused animal?
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="tel:+919822012345"
            className="flex items-center space-x-1 font-bold text-amber-200 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>1800-PET-HELP</span>
          </a>
          <span className="text-white/40">|</span>
          <Link
            to="/rescue/report"
            className="bg-white/20 hover:bg-white text-white hover:text-rose-700 px-2.5 py-1 rounded font-bold transition-all flex items-center space-x-1"
          >
            <span>Report Animal in Need</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
