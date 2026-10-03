import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Phone, Mail, MapPin, ExternalLink, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black font-display text-white tracking-tight">
                Pet<span className="text-brand-500">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting Hearts. Saving Lives. Pet Connect is an AI-powered unified digital ecosystem bringing together adopters, rescuers, veterinarians, and animal welfare organizations across India.
            </p>
            <div className="flex items-center space-x-3 text-xs text-brand-400 font-semibold bg-brand-950/60 border border-brand-800/40 p-3 rounded-xl max-w-sm">
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
              <span>Final Year Computer Science Engineering Capstone Project</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Adoption & Welfare</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/pets" className="hover:text-white transition-colors">Browse Available Pets</Link></li>
              <li><Link to="/lost-found" className="hover:text-white transition-colors">Lost & Found Radar</Link></li>
              <li><Link to="/rescue" className="hover:text-white transition-colors">Emergency Rescue Feed</Link></li>
              <li><Link to="/volunteers" className="hover:text-white transition-colors">Join as Volunteer</Link></li>
              <li><Link to="/ngos" className="hover:text-white transition-colors">Partner Organizations</Link></li>
            </ul>
          </div>

          {/* Care & Health */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Care & Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/pet-care/assistant" className="hover:text-white transition-colors">PetCare AI Assistant</Link></li>
              <li><Link to="/vets" className="hover:text-white transition-colors">Find a Veterinarian</Link></li>
              <li><Link to="/pet-care" className="hover:text-white transition-colors">Digital Health Records</Link></li>
              <li><Link to="/appointments" className="hover:text-white transition-colors">Book Clinic Visit</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Mission & Impact</Link></li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Emergency & Helpline</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>24/7 Rescue Dispatch: <strong className="text-white">+91 98220 12345</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>support@petconnect.org.in</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Maharashtra Hub: Pune • Mumbai • Nanded • Nagpur • Sambhajinagar</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Pet Connect. All rights reserved. Built with empathy for animal welfare.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-slate-400">About Us</Link>
            <Link to="/pet-care/assistant" className="hover:text-slate-400">AI Assistant</Link>
            <Link to="/rescue/report" className="hover:text-slate-400 text-rose-400 font-semibold">Report Rescue</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
