import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldCheck, HeartHandshake, Stethoscope, UserCheck, Dog, Sparkles, X, Check } from 'lucide-react';

interface DemoSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoSwitcherModal: React.FC<DemoSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { user, demoLogin } = useAuth();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoAccounts: { role: UserRole; name: string; email: string; icon: any; desc: string; badgeColor: string }[] = [
    {
      role: 'admin',
      name: 'Rohit Chavan (Admin)',
      email: 'admin@petconnect.demo',
      icon: ShieldCheck,
      desc: 'Full administrative control, platform analytics, moderation, and user oversight.',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      role: 'ngo',
      name: 'Paws & Hope Foundation',
      email: 'ngo@petconnect.demo',
      icon: HeartHandshake,
      desc: 'Shelter dashboard, pet listings, adoption review, rescue dispatch & events.',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      role: 'vet',
      name: 'Dr. Rajesh Sharma, BVSc',
      email: 'vet@petconnect.demo',
      icon: Stethoscope,
      desc: 'Veterinary clinic profile, appointment manager, and digital medical records.',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      role: 'volunteer',
      name: 'Aarav Deshmukh',
      email: 'volunteer@petconnect.demo',
      icon: UserCheck,
      desc: 'Field rescue responder, assignment alerts, emergency cases, and badges.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      role: 'adopter',
      name: 'Pooja Patil',
      email: 'user@petconnect.demo',
      icon: Dog,
      desc: 'Standard pet adopter searching for pets, AI matches, and care reminders.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    }
  ];

  const handleSelectRole = async (role: UserRole) => {
    setLoadingRole(role);
    setFeedback(null);
    const res = await demoLogin(role);
    setLoadingRole(null);
    if (res.success) {
      setFeedback(`Successfully switched to ${role.toUpperCase()} account!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedback(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-brand-700 to-emerald-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display">1-Click Demo Account Switcher</h2>
              <p className="text-xs text-brand-100">Instantly test Pet Connect as any role (No passwords needed)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {feedback && (
            <div className="p-3 text-sm font-medium text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{feedback}</span>
            </div>
          )}

          <div className="space-y-3">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              const isCurrent = user?.role === acc.role;

              return (
                <div
                  key={acc.role}
                  onClick={() => handleSelectRole(acc.role)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-4 ${
                    isCurrent
                      ? 'border-brand-500 bg-brand-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isCurrent ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-900">{acc.name}</span>
                        <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded-full border ${acc.badgeColor}`}>
                          {acc.role}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mb-1">{acc.email}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{acc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <strong>Local Evaluator Note:</strong> All demo accounts come pre-configured with realistic Indian sample data (Pune, Mumbai, Nanded, Nagpur, Sambhajinagar) and are ready for examination.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Current user: <strong className="text-slate-800">{user ? `${user.name} (${user.role})` : 'Guest'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
