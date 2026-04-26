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
import ImageWithLoading from './ImageWithLoading';
import EnvelopeSplash from './EnvelopeSplash';



// Prenup photos data
const prenupPhotos = [
  { id: '1', url: '/images/prenup/JCM_1670.jpg', caption: 'Two hearts, one love' },
  { id: '2', url: '/images/prenup/JCM_1391.jpg', caption: 'The beginning of forever' },
  { id: '3', url: '/images/prenup/JCM_1504.jpg', caption: 'Love in every glance' },
  { id: '4', url: '/images/prenup/JCM_1808.jpg', caption: 'Together is our favorite place' },
  { id: '5', url: '/images/prenup/JCM_2125.jpg', caption: 'Written in the stars' },
  { id: '6', url: '/images/prenup/JCM_2127.jpg', caption: 'A love story for the ages' },
  { id: '7', url: '/images/prenup/JCM_2178.jpg', caption: 'Forever starts now' },
  { id: '8', url: '/images/prenup/JCM_2249.jpg', caption: 'My heart found its home' },
  { id: '9', url: '/images/prenup/JCM_2258.jpg', caption: 'Love beyond words' },
  { id: '10', url: '/images/prenup/JCM_2504.jpg', caption: 'Endless love' },
  { id: '11', url: '/images/prenup/JCM_2508.jpg', caption: 'Soulmates forever' },
  { id: '12', url: '/images/prenup/JCM_2600.jpg', caption: 'Our happily ever after' },
  { id: '13', url: '/images/prenup/JCM_1648.jpg', caption: 'Finding peace in your arms' },
  { id: '14', url: '/images/prenup/JCM_1732.jpg', caption: 'Hand in hand towards our future' },
  { id: '15', url: '/images/prenup/JCM_1821.jpg', caption: 'With you, life is beautiful' },
  { id: '16', url: '/images/prenup/JCM_1916.jpg', caption: 'Every moment with you is a treasure' },
  { id: '17', url: '/images/prenup/JCM_1918.jpg', caption: 'Laughter is the melody of our love' },
  { id: '18', url: '/images/prenup/JCM_2048.jpg', caption: 'In each other, we found world' },
  { id: '19', url: '/images/prenup/JCM_2096.jpg', caption: 'Your smile is my favorite view' },
  { id: '20', url: '/images/prenup/JCM_2183.jpg', caption: 'A lifetime of adventures awaits' },
  { id: '21', url: '/images/prenup/JCM_2239.jpg', caption: 'Best friends turned soulmates' },
  { id: '22', url: '/images/prenup/JCM_2452.jpg', caption: 'Wrapped in your love' },
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
  const [hasOpened, setHasOpened] = useState(false);

  // Disable scroll when splash is visible
  useEffect(() => {
    if (!hasOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [hasOpened]);

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
    <div className={`min-h-screen bg-yellow-50/30 ${!hasOpened ? 'h-screen overflow-hidden' : ''}`}>
      {!hasOpened && <EnvelopeSplash onOpen={() => setHasOpened(true)} />}
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-yellow-500 fill-yellow-500" />
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
                      ? 'text-yellow-500'
                      : 'text-gray-600 hover:text-yellow-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
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
                      ? 'bg-yellow-50 text-yellow-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {/* Admin Panel hidden — use Ctrl/⌘ + Alt + A to open */}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithLoading
            src="/images/hero.jpg"
            priority={true}
            alt="Prenup Photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20 pb-32 md:pb-24">
          <p className="text-yellow-200/90 text-sm md:text-base font-light tracking-[0.4em] uppercase mb-6 animate-fade-in">
            ✦ We're Getting Married ✦
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-4 drop-shadow-lg leading-tight">
            April Jean
            <span className="block text-yellow-300 text-4xl md:text-5xl lg:text-6xl font-light italic my-2">&amp;</span>
            Macdenver
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/90 mt-6 mb-2">
            <div className="h-px w-12 bg-yellow-300/60" />
            <div className="flex items-center gap-2 text-base md:text-lg">
              <Calendar className="w-4 h-4 text-yellow-300" />
              <span>May 30, 2026</span>
            </div>
            <div className="h-px w-12 bg-yellow-300/60" />
          </div>
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-8">
            <MapPin className="w-3.5 h-3.5 text-yellow-300" />
            <span>Nasugbu, Batangas</span>
          </div>

          {/* Countdown */}
          <CountdownTimer targetDate="2026-05-30T08:30:00" />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => scrollToSection('rsvp')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              RSVP Now
            </button>
            <button
              onClick={() => scrollToSection('our-story')}
              className="px-8 py-4 rounded-full bg-white/15 border border-white/30 text-white font-medium hover:bg-white/25 backdrop-blur-sm transition-all"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Floating animated scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2 animate-bounce-slow">
            <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-white/70 animate-scroll-dot" />
            </div>
            <svg className="w-4 h-4 text-white/50 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 md:py-32 bg-white relative overflow-hidden">
        {/* Background flourish */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-50 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-semibold tracking-[0.3em] uppercase text-xs mb-3">Our Journey Together</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Our Love Story</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-yellow-300" />
              <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <div className="h-px w-16 bg-yellow-300" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-3xl -z-10" />
              <ImageWithLoading
                src="/images/story.jpg"
                alt="Our Story"
                className="rounded-2xl shadow-2xl w-full"
              />
              {/* Floating date badge */}
              <div className="absolute -bottom-5 -right-5 bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 rounded-2xl p-4 shadow-xl">
                <p className="font-serif text-xl font-bold leading-none">May 30</p>
                <p className="text-xs font-semibold tracking-wider mt-1">2026</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Timeline item */}
              {[
                {
                  icon: <Heart className="w-5 h-5 text-yellow-600" />,
                  title: 'How We Met',
                  text: `Our paths first crossed in 2017 during the school intramurals where we became friends. Years passed and life went on, but we eventually found our way back to each other. It all started again with a simple Facebook message about some grapes—and a small conversation that turned into something deeper. From shy chats to unwavering support, we've grown from a distant memory into a beautiful, lasting reality.`,
                },
                {
                  icon: <Calendar className="w-5 h-5 text-yellow-600" />,
                  title: 'The First Date',
                  text: `Our first date was at Lasema, a Korean sauna. At the time, I was about to go back to Cebu for work, so it felt like time was slipping away. But in that quiet space, we talked, laughed, and forgot everything else for a while. That day became the start of something special—turning what could have been a goodbye into the beginning of our story.`,
                },
                {
                  icon: <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
                  title: 'The Proposal',
                  text: `On November 8, during a simple breakfast together, Macdenver found the perfect moment to ask April Jean to spend forever with him. As we sat on the floor, Korean-style, I nervously hid the ring under the table, my heart racing as I reached for it. But the moment I saw her smile, everything else faded—it melted my heart. And with that, our journey to forever truly began.`,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-yellow-100 group-hover:bg-yellow-200 transition-colors flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-gray-800 mb-1.5">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prenup Photos Section */}
      <section id="prenup" className="py-20 md:py-32 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-medium tracking-widest uppercase mb-2">Captured Moments</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Our Prenup Photos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A collection of our most cherished moments captured during our prenuptial photoshoot. 
              Each photo tells a story of our love.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-400 mx-auto rounded-full mt-4" />
          </div>

          <PhotoCarousel photos={prenupPhotos} autoPlay={true} interval={5000} />
        </div>
      </section>

      {/* Guest Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-yellow-500 font-medium tracking-widest uppercase mb-2">Share Your Memories</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Guest Photo Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Help us capture every moment! Upload your photos from our celebration 
              and browse memories shared by other guests.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-400 mx-auto rounded-full mb-8" />
            
            {new Date() < new Date('2026-05-30') ? (
              <div className="inline-flex flex-col items-center gap-4">
                <div className="px-6 py-3 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Upload will be available on May 30, 2026
                </div>
                <p className="text-xs text-gray-400">Can't wait to see your photos from our big day!</p>
              </div>
            ) : (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-500 text-white font-medium hover:from-yellow-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Camera className="w-5 h-5" />
                Upload Your Photos
              </button>
            )}
          </div>

          <PhotoGallery 
            photos={guestPhotos} 
            title={`Guest Photos (${guestPhotos.length})`}
          />
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 md:py-32 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-yellow-500 font-medium tracking-widest uppercase mb-2">Be Our Guest</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">RSVP</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We would be honored to have you celebrate our special day with us. 
              Please let us know if you can attend by filling out the form below.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-400 mx-auto rounded-full mt-4" />
          </div>

          <RSVPForm />
        </div>
      </section>

      {/* Wedding Details Section */}
      <section id="details" className="py-20 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-50 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-50 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-semibold tracking-[0.3em] uppercase text-xs mb-3">Join Us</p>
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4">Wedding Details</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-yellow-300" />
              <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <div className="h-px w-16 bg-yellow-300" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Ceremony Card */}
            <div className="relative flex flex-col h-full bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-xl p-10 border border-yellow-100 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 transition-colors">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-gray-800 text-center mb-6">The Ceremony</h3>
              <div className="flex-1 flex flex-col">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                      <p className="font-medium text-gray-700">May 30, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Time</p>
                      <p className="font-medium text-gray-700">8:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Venue</p>
                      <p className="font-medium text-gray-700">St. Francis Xavier Parish - Archdiocese of Lipa</p>
                      <p className="text-sm text-gray-400">Nasugbu, Batangas</p>
                    </div>
                  </div>
                </div>
                
                {/* Clickable Map Link */}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=St.+Francis+Xavier+Parish+-+Archdiocese+of+Lipa+Nasugbu+Batangas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block relative rounded-2xl overflow-hidden border border-yellow-100 shadow-lg group/map transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="h-48 bg-yellow-50/50">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.57723964923!2d120.63002127592476!3d14.074720986348604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd77b789181185%3A0x67503927622998a1!2sSt.%20Francis%20Xavier%20Parish!5e0!3m2!1sen!2sph!4v1714135400000!5m2!1sen!2sph" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, pointerEvents: 'none' }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  {/* Overlay for interaction hint */}
                  <div className="absolute inset-0 bg-yellow-900/0 group-hover/map:bg-yellow-900/10 transition-colors flex items-end justify-center pb-8">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl opacity-0 group-hover/map:opacity-100 transition-all transform translate-y-2 group-hover/map:translate-y-0 text-yellow-700 text-xs font-bold flex items-center gap-2">
                       <MapPin className="w-3.5 h-3.5" />
                       View on Google Maps
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Reception Card */}
            <div className="relative flex flex-col h-full bg-gradient-to-br from-yellow-50 to-white rounded-3xl shadow-xl p-10 border border-yellow-100 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 transition-colors">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-gray-800 text-center mb-6">The Reception</h3>
              <div className="flex-1 flex flex-col">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                      <p className="font-medium text-gray-700">May 30, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Venue</p>
                      <p className="font-medium text-gray-700">Brides Residence</p>
                      <p className="text-sm text-gray-400">El Paso, Brgy. Lumbangan, Nasugbu, Batangas</p>
                    </div>
                  </div>
                </div>

                {/* Clickable Map Link for Reception */}
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=14.045241,120.648405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto block relative rounded-2xl overflow-hidden border border-yellow-100 shadow-lg group/map transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="h-48 bg-yellow-50/50">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3865.111816!2d120.648405!3d14.045241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTTCsDAyJzQyLjkiTiAxMjDCsDM4JzU0LjMiRQ!5e0!3m2!1sen!2sph!4v1714136000000!5m2!1sen!2sph" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0, pointerEvents: 'none' }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  {/* Overlay for interaction hint */}
                  <div className="absolute inset-0 bg-yellow-900/0 group-hover/map:bg-yellow-900/10 transition-colors flex items-end justify-center pb-8">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl opacity-0 group-hover/map:opacity-100 transition-all transform translate-y-2 group-hover/map:translate-y-0 text-yellow-700 text-xs font-bold flex items-center gap-2">
                       <MapPin className="w-3.5 h-3.5" />
                       View on Google Maps
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden text-white py-20"
        style={{ background: 'linear-gradient(135deg, #1c1a14 0%, #2d2712 50%, #1c1a14 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-yellow-300/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Monogram */}
            <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-7 h-7 text-yellow-400 fill-yellow-400/40" />
            </div>

            <h3 className="font-serif text-4xl text-white">
              April Jean
              <span className="block text-yellow-300 text-2xl font-light italic my-2">&amp;</span>
              Macdenver
            </h3>
            <p className="text-gray-400 text-sm tracking-widest uppercase mb-10">May 30, 2026 · Nasugbu, Batangas</p>

            <div className="flex flex-wrap items-center justify-center gap-1 mb-10">
              {['Home','Our Story','Photos','Gallery','RSVP','Details'].map((label, i) => {
                const ids = ['home','our-story','prenup','gallery','rsvp','details'];
                return (
                  <button
                    key={label}
                    onClick={() => scrollToSection(ids[i])}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-yellow-300 hover:bg-white/5 rounded-lg transition-all"
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent mb-8" />

            <p className="text-gray-500 text-sm">Made with <span className="text-yellow-400">♥</span> for our special day</p>
            <p className="text-gray-600 text-xs mt-2">© 2026 April Jean &amp; Macdenver Wedding</p>
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

