import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Pet } from '../types';
import { PetCard } from '../components/pets/PetCard';
import { AIMatchModal } from '../components/pets/AIMatchModal';
import {
  Heart,
  Search,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Users,
  Building2,
  Sparkles,
  Bot,
  Compass,
  MessageCircle,
  CalendarCheck,
  CheckCircle,
  Quote
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [isAiMatchOpen, setIsAiMatchOpen] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get('/pets?adoptionStatus=Available');
        if (res.data.success) {
          setFeaturedPets(res.data.pets.slice(0, 6));
        }
      } catch (err) {
        console.error('Error loading featured pets:', err);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPets();
  }, []);

  const stats = [
    { label: 'Pets Available', value: '250+', icon: Heart, color: 'text-rose-600 bg-rose-50' },
    { label: 'Successful Adoptions', value: '1,420+', icon: CheckCircle, color: 'text-brand-600 bg-brand-50' },
    { label: 'Rescue Cases Handled', value: '3,890+', icon: ShieldCheck, color: 'text-amber-600 bg-amber-50' },
    { label: 'Registered Volunteers', value: '450+', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Partner NGOs', value: '35+', icon: Building2, color: 'text-purple-600 bg-purple-50' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Discover',
      desc: 'Browse verified rescue pets with complete medical, age, personality profiles, or use our explainable AI Compatibility Matcher.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Connect',
      desc: 'Submit a comprehensive digital adoption application and direct chat with shelters, foster parents, or verified NGOs.',
      icon: MessageCircle,
    },
    {
      number: '03',
      title: 'Meet',
      desc: 'Schedule in-person or shelter meet-and-greets to assess emotional bonding, playfulness, and household compatibility.',
      icon: CalendarCheck,
    },
    {
      number: '04',
      title: 'Adopt',
      desc: 'Finalize digital ownership transfer, receive initial veterinary health cards, and welcome your new family member home!',
      icon: Heart,
    },
  ];

  const services = [
    {
      title: 'Pet Adoption',
      desc: 'Ethical rehoming and adoption system connecting homeless pets with loving guardians.',
      link: '/pets',
      icon: Heart,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Lost & Found Radar',
      desc: 'Pinpoint missing pets on an interactive map and trigger instant community match claims.',
      link: '/lost-found',
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Animal Rescue',
      desc: '24/7 emergency dispatch reporting with Critical/High severity tracking and volunteer dispatch.',
      link: '/rescue',
      icon: AlertTriangle,
      color: 'from-rose-500 to-red-600',
    },
    {
      title: 'Pet Care & Passports',
      desc: 'Digital health records, vaccination histories, medication timelines, and scheduled care reminders.',
      link: '/pet-care',
      icon: ShieldCheck,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Veterinary Support',
      desc: 'Directory of certified veterinarians with online clinic appointment requests and advice.',
      link: '/vets',
      icon: Stethoscope,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Volunteer Network',
      desc: 'Join the frontline lifesavers community, earn emergency rescue badges, and log community hours.',
      link: '/volunteers',
      icon: Users,
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: 'NGO & Shelter Hub',
      desc: 'Integrated management tools for animal welfare organizations, adoption drives, and events.',
      link: '/ngos',
      icon: Building2,
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'PetCare AI Assistant',
      desc: 'Intelligent conversational pet health and welfare assistant with veterinary disclaimers.',
      link: '/pet-care/assistant',
      icon: Bot,
      color: 'from-emerald-600 to-green-700',
    },
  ];

  const stories = [
    {
      petName: 'Sheru',
      breed: 'Indie Rescue',
      adopter: 'Pooja Patil, Pune',
      text: 'Sheru was found shivering during monsoon with a leg injury. Thanks to Pet Connect, I tracked his recovery at Paws & Hope Foundation and adopted him. He brings endless happiness into our home!',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    },
    {
      petName: 'Leo',
      breed: 'Golden Retriever Mix',
      adopter: 'Karan Mehra, Mumbai',
      text: 'The AI compatibility matcher matched me with Leo based on my jogging routine and apartment layout. The 89% score was spot on — Leo is the most affectionate companion I could ever dream of.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    },
    {
      petName: 'Mimi',
      breed: 'Calico Cat',
      adopter: 'Sneha K., Sambhajinagar',
      text: 'Dr. Sharma treated Mimi after she was rescued from a drainage pipe. The adoption paperwork on Pet Connect took only two days. She loves curling up on my keyboard while I work!',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide animate-fade-in">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Maharashtra's Intelligent Animal Welfare Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-slate-900 tracking-tight leading-[1.1]">
                Find a Friend. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-600 to-teal-600">
                  Save a Life.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Pet Connect brings adopters, rescuers, NGOs, veterinarians, and pet lovers together to create safer and happier lives for animals through a single intelligent platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/pets"
                  className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-105 flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Pets</span>
                </Link>

                <button
                  onClick={() => setIsAiMatchOpen(true)}
                  className="px-5 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl font-bold text-sm transition-all hover:scale-105 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>AI Pet Matcher</span>
                </button>

                <Link
                  to="/lost-found"
                  className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl font-semibold text-sm transition-all shadow-xs"
                >
                  Report Lost Pet
                </Link>

                <Link
                  to="/rescue/report"
                  className="px-5 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl font-bold text-sm transition-all flex items-center space-x-1.5"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Report Animal in Need</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200/60">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Indian NGOs</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span>Veterinary Health Records</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>100% Free Adoption</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                    alt="Happy rescued puppy and kitten"
                    className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mb-1 inline-block">
                        Featured Rescue Story
                      </span>
                      <h2 className="text-lg font-bold font-display">Sheru & Friends</h2>
                      <p className="text-xs text-slate-200">Rescued from Maharashtra monsoons, now living happily in Pune.</p>
                    </div>
                  </div>
                </div>

                {/* Floating Compatibility Card */}
                <div className="absolute -bottom-6 -left-6 sm:bottom-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 max-w-[220px]">
                  <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    94%
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Match Score</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight block">Perfect Family & Lifestyle Fit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section with Counter Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow text-center space-y-2"
              >
                <div className={`w-10 h-10 mx-auto rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-display text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Pets Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <Heart className="w-4 h-4 fill-brand-600" />
              <span>Looking for Forever Homes</span>
            </div>
            <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              Featured Pets Available for Adoption
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every pet is medically examined, vaccinated, and nurtured with love.
            </p>
          </div>

          <Link
            to="/pets"
            className="flex items-center space-x-2 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-4 py-2 rounded-xl border border-brand-200 transition-colors"
          >
            <span>View All Available Pets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingPets ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      {/* How Pet Connect Works */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl mx-4 sm:mx-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Simple 4-Step Process</span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
              How Pet Connect Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Transforming traditional cumbersome shelter procedures into a transparent, safe, and joyful digital journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative group">
                  <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700/80 hover:border-brand-500 transition-all space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-black font-display text-brand-400/80">{step.number}</span>
                        <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold font-display text-white mb-2">{step.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Unified Digital Ecosystem</span>
          <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight">
            Our Core Welfare Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A comprehensive suite of tools built for adopters, shelters, veterinarians, and animal heroes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <Link
                key={idx}
                to={srv.link}
                className="group bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${srv.color} flex items-center justify-center text-white shadow-md shadow-brand-500/10 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-brand-600 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-1.5 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
                  <span>Explore service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Touching Journeys</span>
          <h2 className="text-3xl font-black font-display text-slate-900 tracking-tight">
            Happy Adoption Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Read how Pet Connect connected rescue animals with compassionate guardians across Maharashtra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.petName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {story.breed}
                  </div>
                </div>

                <Quote className="w-6 h-6 text-brand-500/40" />

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{story.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{story.petName}</h4>
                  <span className="text-[11px] text-slate-500">{story.adopter}</span>
                </div>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-14 text-white text-center shadow-xl space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-brand-100">
              Join Our Compassion Movement
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
              Every Pet Deserves a Loving Home.
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Whether you are ready to adopt, volunteer your weekends, or support an injured stray, your action can save a life today.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/pets"
                className="px-7 py-3.5 bg-white hover:bg-slate-100 text-brand-800 rounded-2xl font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                Adopt a Pet Now
              </Link>
              <Link
                to="/volunteers"
                className="px-7 py-3.5 bg-brand-800/80 hover:bg-brand-900 text-white border border-white/20 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Compatibility Match Modal */}
      <AIMatchModal isOpen={isAiMatchOpen} onClose={() => setIsAiMatchOpen(false)} />
    </div>
  );
};
