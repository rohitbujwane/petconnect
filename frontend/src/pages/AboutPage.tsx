import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Stethoscope, Sparkles, Building2, Users, Compass, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Our Purpose & Vision
        </span>
        <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
          Connecting Hearts. Saving Lives.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Pet Connect is an AI-powered unified digital platform designed to bridge the gaps between pet adopters, independent rescuers, animal welfare organizations, and veterinarians in Maharashtra.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Ethical Pet Adoption</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating illegal back-alley breeding and commercial puppy mills by championing rescue adoption and Indie dog appreciation.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Explainable AI Matching</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Preventing tragic re-abandonment through multi-factor lifestyle, activity level, and living environment compatibility scoring.
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">24/7 Rapid Emergency Response</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Empowering citizens to report injured or trapped street animals with precise GPS coordinates directly to mobile volunteer squads.
          </p>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="p-8 bg-slate-900 text-white rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-black font-display text-brand-400">1,400+</div>
          <div className="text-xs text-slate-400 mt-1">Animals Adopted</div>
        </div>
        <div>
          <div className="text-3xl font-black font-display text-emerald-400">3,800+</div>
          <div className="text-xs text-slate-400 mt-1">Accident Rescues</div>
        </div>
        <div>
          <div className="text-3xl font-black font-display text-purple-400">35+</div>
          <div className="text-xs text-slate-400 mt-1">Partner NGOs</div>
        </div>
        <div>
          <div className="text-3xl font-black font-display text-amber-400">450+</div>
          <div className="text-xs text-slate-400 mt-1">Active Volunteers</div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/pets"
          className="inline-flex items-center space-x-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          <span>Meet Our Rescue Companions</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
