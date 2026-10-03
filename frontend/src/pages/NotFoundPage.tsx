import React from 'react';
import { Link } from 'react-router-dom';
import { Dog, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto text-brand-600 border border-brand-200">
          <Dog className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black font-display text-slate-900">404</span>
          <h1 className="text-xl font-bold text-slate-800">Oops! Lost in the Dog Park?</h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The page you are looking for has wandered off like an adventurous puppy. Let's guide you back home.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <Link
            to="/"
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/pets"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Explore Pets
          </Link>
        </div>
      </div>
    </div>
  );
};
