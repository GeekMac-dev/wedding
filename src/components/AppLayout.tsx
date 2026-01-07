import { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Camera, Upload, ChevronDown, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PhotoCarousel from './PhotoCarousel';
import PhotoUpload from './PhotoUpload';
import PhotoGallery from './PhotoGallery';
import CountdownTimer from './CountdownTimer';
import RSVPForm from './RSVPForm';
import RSVPAdmin from './RSVPAdmin';
import AdminLogin from './AdminLogin';

// Prenup photos data
const prenupPhotos = [
  { id: '1', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746625848_17d12f1e.png', caption: 'The beginning of forever' },
  { id: '2', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746642730_bfb34c01.jpg', caption: 'Love in every glance' },
  { id: '3', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746642650_fdad9f6b.jpg', caption: 'Two hearts, one love' },
  { id: '4', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746650168_498167c8.png', caption: 'Together is our favorite place' },
  { id: '5', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746649514_c4bb9322.png', caption: 'Written in the stars' },
  { id: '6', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746646028_771943ca.jpg', caption: 'A love story for the ages' },
  { id: '7', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746651206_f51c17c9.png', caption: 'Forever starts now' },
  { id: '8', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746671931_8d9193dd.png', caption: 'My heart found its home' },
  { id: '9', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746670014_af750d11.jpg', caption: 'Love beyond words' },
  { id: '10', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746680454_6da814a9.png', caption: 'Our beautiful journey' },
  { id: '11', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746669599_7f18435e.jpg', caption: 'Endless love' },
  { id: '12', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746678918_cb102212.png', caption: 'Soulmates forever' },
  { id: '13', url: 'https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746676939_6e0a949f.png', caption: 'Our happily ever after' },
];

interface GuestPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  createdAt?: string;
}

export default function AppLayout() {
  const [activeSection, setActiveSection] = useState('home');
  const [guestPhotos, setGuestPhotos] = useState<GuestPhoto[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Fetch guest photos from Supabase
  const fetchGuestPhotos = async () => {
    const { data, error } = await supabase
      .from('wedding_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGuestPhotos(data.map(photo => ({
        id: photo.id,
        url: photo.file_url,
        caption: photo.caption,
        uploadedBy: photo.uploaded_by,
        createdAt: photo.created_at,
      })));
    }
  };

  useEffect(() => {
    fetchGuestPhotos();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key?.toLowerCase();
      const trigger = (e.ctrlKey || e.metaKey) && e.altKey && key === 'a';
      if (trigger) {
        e.preventDefault();
        setShowAdminModal(true);
        setIsAdminAuthenticated(false);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'our-story', label: 'Our Story' },
    { id: 'prenup', label: 'Prenup Photos' },
    { id: 'gallery', label: 'Guest Gallery' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'details', label: 'Wedding Details' },
  ];

  return (
    <div className="min-h-screen bg-rose-50/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span className="font-serif text-xl text-gray-800">AJ & M</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-rose-500'
                      : 'text-gray-600 hover:text-rose-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Photos
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-rose-50 text-rose-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {/* Admin Panel hidden — use Ctrl/⌘ + Alt + A to open */}
              <button
                onClick={() => {
                  setShowUploadModal(true);
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Photos
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746625848_17d12f1e.png"
            alt="Prenup Photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <p className="text-white/90 text-lg md:text-xl font-light tracking-widest uppercase mb-4 animate-fade-in">
            We're Getting Married
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            April Jean & Macdenver
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/90 text-lg md:text-xl">
            <Calendar className="w-5 h-5" />
            <span>May 30, 2026</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/80 mt-2">
            <MapPin className="w-4 h-4" />
            <span>The Grand Estate, California</span>
          </div>

          {/* Countdown - Dynamic */}
          <CountdownTimer targetDate="2026-06-15T15:00:00" />

          {/* CTA Button */}
          <button
            onClick={() => scrollToSection('rsvp')}
            className="mt-8 px-8 py-4 rounded-full bg-white text-rose-600 font-medium hover:bg-rose-50 transition-all shadow-lg hover:shadow-xl"
          >
            RSVP Now
          </button>

          {/* Scroll Indicator */}
          {/* <button
            onClick={() => scrollToSection('our-story')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors animate-bounce"
          >
            <ChevronDown className="w-8 h-8" />
          </button> */}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl" />
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rose-500 font-medium tracking-widest uppercase mb-2">Our Journey</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Our Love Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://d64gsuwffb70l.cloudfront.net/695dabdd5473eeaae1c08a56_1767746642730_bfb34c01.jpg"
                alt="Our Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-100 rounded-2xl -z-10" />
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-800 mb-2">How We Met</h3>
                  <p className="text-gray-600 leading-relaxed">
                    It was a beautiful autumn day when our paths crossed at a mutual friend's gathering. 
                    Little did we know that moment would change our lives forever. From the first conversation, 
                    we knew there was something special between us.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-800 mb-2">The First Date</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our first date was at a cozy little café downtown. We talked for hours, 
                    losing track of time as we discovered how much we had in common. 
                    That evening marked the beginning of countless adventures together.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-gray-800 mb-2">The Proposal</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Under a canopy of stars on a moonlit beach, James got down on one knee 
                    and asked Maria to spend forever with him. With tears of joy and a resounding "Yes!", 
                    our journey to forever officially began.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prenup Photos Section */}
      <section id="prenup" className="py-20 md:py-32 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rose-500 font-medium tracking-widest uppercase mb-2">Captured Moments</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Our Prenup Photos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A collection of our most cherished moments captured during our prenuptial photoshoot. 
              Each photo tells a story of our love.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full mt-4" />
          </div>

          <PhotoCarousel photos={prenupPhotos} autoPlay={true} interval={5000} />
        </div>
      </section>

      {/* Guest Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-500 font-medium tracking-widest uppercase mb-2">Share Your Memories</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Guest Photo Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Help us capture every moment! Upload your photos from our celebration 
              and browse memories shared by other guests.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full mb-8" />
            
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Camera className="w-5 h-5" />
              Upload Your Photos
            </button>
          </div>

          <PhotoGallery 
            photos={guestPhotos} 
            title={`Guest Photos (${guestPhotos.length})`}
          />
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 md:py-32 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-rose-500 font-medium tracking-widest uppercase mb-2">Be Our Guest</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">RSVP</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We would be honored to have you celebrate our special day with us. 
              Please let us know if you can attend by filling out the form below.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full mt-4" />
          </div>

          <RSVPForm />
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-rose-500 font-medium tracking-widest uppercase mb-2">Join Us</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Wedding Details</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ceremony Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border border-rose-100">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-gray-800 text-center mb-4">The Ceremony</h3>
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  <span>May 30, 2026</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-rose-400" />
                  <span>3:00 PM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <span>St. Mary's Chapel</span>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  123 Wedding Lane, California 90210
                </p>
              </div>
            </div>

            {/* Reception Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border border-rose-100">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-gray-800 text-center mb-4">The Reception</h3>
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-rose-400" />
                  <span>May 30, 2026</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5 text-rose-400" />
                  <span>6:00 PM</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <span>The Grand Estate Ballroom</span>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  456 Celebration Ave, California 90210
                </p>
              </div>
            </div>
          </div>

          {/* Dress Code */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-center border border-rose-100">
            <h3 className="font-serif text-2xl text-gray-800 mb-4">Dress Code</h3>
            <p className="text-gray-600 mb-6">
              We kindly request our guests to dress in formal attire. 
              Ladies in elegant gowns and gentlemen in suits or tuxedos.
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Formal</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-10 h-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Elegant Gowns</span>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Suits / Tuxedos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-10 h-10 text-rose-400 fill-rose-400 mx-auto mb-4" />
            <h3 className="font-serif text-3xl mb-2">April Jean & Macdenver</h3>
            <p className="text-gray-400 mb-8">May 30, 2026</p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-400 hover:text-white transition-colors">Home</button>
              <button onClick={() => scrollToSection('our-story')} className="text-gray-400 hover:text-white transition-colors">Our Story</button>
              <button onClick={() => scrollToSection('prenup')} className="text-gray-400 hover:text-white transition-colors">Photos</button>
              <button onClick={() => scrollToSection('gallery')} className="text-gray-400 hover:text-white transition-colors">Gallery</button>
              <button onClick={() => scrollToSection('rsvp')} className="text-gray-400 hover:text-white transition-colors">RSVP</button>
              <button onClick={() => scrollToSection('details')} className="text-gray-400 hover:text-white transition-colors">Details</button>
            </div>

            <p className="text-gray-500 text-sm">
              Made with love for our special day
            </p>
            <p className="text-gray-600 text-xs mt-2">
              © 2026 April Jean & Macdenver Wedding
            </p>
          </div>
        </div>
      </footer>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <PhotoUpload 
              onUploadComplete={() => {
                fetchGuestPhotos();
                setTimeout(() => setShowUploadModal(false), 2000);
              }} 
            />
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        !isAdminAuthenticated ? (
          <AdminLogin
            onClose={() => setShowAdminModal(false)}
            onSuccess={() => setIsAdminAuthenticated(true)}
          />
        ) : (
          <RSVPAdmin onClose={() => { setShowAdminModal(false); setIsAdminAuthenticated(false); }} />
        )
      )}
    </div>
  );
}
