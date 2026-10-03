import React from 'react';
import { PetCareAIChatbot } from '../components/chat/PetCareAIChatbot';
import { Bot, Sparkles, ShieldCheck, Heart, Stethoscope, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PetCareAIPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Knowledge-Powered Animal Welfare Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight">
          PetCare AI Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ask questions about puppy feeding, core feline vaccines, emergency first aid, adoption prep, and stray welfare protocols.
        </p>
      </div>

      {/* Main Chatbot Component */}
      <div className="max-w-4xl mx-auto">
        <PetCareAIChatbot />
      </div>

      {/* Quick Informational Topic Cards */}
      <div className="max-w-4xl mx-auto pt-6 border-t border-slate-200/80">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
          Popular Pet Knowledge Topics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Vaccine Schedules</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Understand DHPPiL, Anti-Rabies, and Tricat timelines to protect companions from deadly viral contagions.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">First Aid & Triage</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Step-by-step guidance on gentle muzzling, pressure bandaging, and spinal stability when rescuing injured strays.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">3-3-3 Adoption Prep</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              How to puppy-proof your apartment and help rescue animals decompress during their first 3 months home.
            </p>
          </div>
        </div>

        {/* Emergency disclaimer callout */}
        <div className="mt-8 p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-xs text-rose-900">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>
              <strong>Life-Threatening Emergency?</strong> Don't wait for chat responses. Rush immediately to an animal hospital or report to emergency rescue squad.
            </span>
          </div>
          <Link
            to="/rescue/report"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors"
          >
            Report Rescue Now
          </Link>
        </div>
      </div>
    </div>
  );
};
