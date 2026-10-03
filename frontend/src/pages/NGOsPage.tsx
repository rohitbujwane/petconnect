import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NGO } from '../types';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Heart,
  Globe,
  Bell
} from 'lucide-react';

export const NGOsPage: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('All');

  useEffect(() => {
    const fetchNGOs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (cityFilter !== 'All') params.append('city', cityFilter);

        const res = await api.get(`/ngos?${params.toString()}`);
        if (res.data.success) {
          setNgos(res.data.ngos);
        }
      } catch (err) {
        console.error('Error fetching NGOs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNGOs();
  }, [cityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-brand-800 rounded-3xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-emerald-100">
            Shelter & Advocacy Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
            Partner Welfare Organizations
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Discover verified animal welfare societies, community shelters, and non-profits dedicated to rescue, sterilization, and adoption drives across Maharashtra.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-bold">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          <span>Govt. Registered & Audited NGOs</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Region:</span>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none shadow-xs"
          >
            <option value="All">All Maharashtra</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nanded">Nanded</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{ngos.length}</strong> verified organizations
        </span>
      </div>

      {/* NGOs Cards */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-start space-x-4">
                  <img
                    src={ngo.logo}
                    alt={ngo.organizationName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold font-display text-slate-900">{ngo.organizationName}</h2>
                      {ngo.verified && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono">Reg: {ngo.registrationNumber}</p>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{ngo.address}, {ngo.city}</span>
                    </p>
                  </div>
                </div>

                {/* Stats Counters */}
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center shrink-0 w-full lg:w-auto">
                  <div>
                    <span className="text-xl font-black font-display text-brand-600">{ngo.totalRescues}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Rescues</span>
                  </div>
                  <div>
                    <span className="text-xl font-black font-display text-emerald-600">{ngo.totalAdoptions}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Adoptions</span>
                  </div>
                  <div>
                    <span className="text-xl font-black font-display text-purple-600">{ngo.activeVolunteers}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Volunteers</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {ngo.description}
              </p>

              {/* Events & Announcements Row */}
              {(ngo.events.length > 0 || ngo.announcements.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {ngo.events.map((ev) => (
                    <div key={ev.id} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Upcoming Welfare Event
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                      <p className="text-[11px] text-slate-600">{ev.description}</p>
                      <span className="text-[10px] text-emerald-800 font-semibold block pt-1">
                        📅 {ev.date} • 📍 {ev.location}
                      </span>
                    </div>
                  ))}

                  {ngo.announcements.map((an) => (
                    <div key={an.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Bell className="w-3 h-3" /> Shelter Announcement
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{an.title}</h4>
                      <p className="text-[11px] text-slate-600">{an.content}</p>
                      <span className="text-[10px] text-amber-800 font-semibold block pt-1">
                        Posted: {an.date}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-4 text-slate-600 font-medium">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {ngo.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {ngo.email}</span>
                </div>

                <a
                  href={`tel:${ngo.phone}`}
                  className="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  Contact Shelter
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
