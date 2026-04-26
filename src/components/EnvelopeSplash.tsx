import { useState } from 'react';
import { Heart } from 'lucide-react';

interface EnvelopeSplashProps {
  onOpen: () => void;
}

export default function EnvelopeSplash({ onOpen }: EnvelopeSplashProps) {
  const [phase, setPhase] = useState<'idle' | 'flap' | 'card' | 'zoom' | 'done'>('idle');

  const handleOpen = () => {
    if (phase !== 'idle') return;
    setPhase('flap');
    setTimeout(() => setPhase('card'), 700);
    setTimeout(() => setPhase('zoom'), 1800);
    setTimeout(() => {
      onOpen();
      setPhase('done');
    }, 2800);
  };

  if (phase === 'done') return null;

  const isAnimating = phase !== 'idle';

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        phase === 'zoom' ? 'scale-[8] opacity-0 pointer-events-none' : 'scale-100 opacity-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at center, #fefce8 0%, #fef9c3 60%, #fde047 100%)' }}
    >
      {/* Corner Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute top-0 left-0 w-40 h-40 text-yellow-300 opacity-40" viewBox="0 0 100 100" fill="none">
          <path d="M0 0 Q50 0 50 50 Q50 0 100 0" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q0 50 50 50 Q0 50 0 100" stroke="currentColor" strokeWidth="1" />
          <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="25" cy="5" r="2" fill="currentColor" opacity="0.4" />
          <circle cx="5" cy="25" r="2" fill="currentColor" opacity="0.4" />
        </svg>
        <svg className="absolute bottom-0 right-0 w-40 h-40 text-yellow-300 opacity-40 rotate-180" viewBox="0 0 100 100" fill="none">
          <path d="M0 0 Q50 0 50 50 Q50 0 100 0" stroke="currentColor" strokeWidth="1" />
          <path d="M0 0 Q0 50 50 50 Q0 50 0 100" stroke="currentColor" strokeWidth="1" />
          <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5" />
          <circle cx="25" cy="5" r="2" fill="currentColor" opacity="0.4" />
          <circle cx="5" cy="25" r="2" fill="currentColor" opacity="0.4" />
        </svg>
      </div>

      {/* Top label */}
      <p className={`text-yellow-700/80 text-xs uppercase tracking-[0.35em] mb-10 font-semibold transition-all duration-500 ${
        isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
      }`}>
        A Wedding Invitation
      </p>

      {/* Envelope wrapper */}
      <div
        className={`relative cursor-pointer select-none transition-transform duration-500 ${
          !isAnimating ? 'hover:scale-105 hover:-translate-y-1' : ''
        }`}
        style={{ perspective: '1200px' }}
        onClick={handleOpen}
      >
        {/* Drop shadow */}
        <div className={`absolute -bottom-4 left-8 right-8 h-5 bg-yellow-900/15 rounded-full blur-lg transition-all duration-700 ${
          isAnimating ? 'opacity-0 scale-75' : 'opacity-100'
        }`} />

        {/* ─── Envelope Body ─── */}
        <div
          className="relative w-[340px] h-[220px] md:w-[580px] md:h-[370px]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* === LAYER 1 — Envelope back (base) === */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fefce8] to-[#fef9c3] rounded-2xl shadow-2xl border border-yellow-100" style={{ zIndex: 1 }} />

          {/* === LAYER 2 — Invitation card (hidden inside initially) === */}
          <div
            className="absolute left-5 right-5 bg-white rounded-xl flex flex-col items-center justify-center shadow-xl overflow-hidden transition-all duration-700 ease-out"
            style={{
              top: '10px',
              bottom: '8px',
              zIndex: isAnimating ? 15 : 2,
              opacity: isAnimating ? 1 : 0,
              transform: (phase === 'card' || phase === 'zoom') ? 'translateY(-52%)' : 'translateY(0)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300" />
            <div className="flex flex-col items-center px-6 py-5 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-3 shadow-md">
                <span className="text-white font-serif text-xs md:text-sm font-bold">AJ & M</span>
              </div>
              <p className="text-[10px] md:text-xs text-yellow-600 uppercase tracking-[0.2em] font-bold mb-1">Together with their families</p>
              <h2 className="font-serif text-xl md:text-3xl text-gray-900 leading-tight font-semibold">
                April Jean <span className="text-yellow-500">&</span> Macdenver
              </h2>
              <div className="flex items-center gap-3 my-2 md:my-3">
                <div className="h-px w-12 bg-yellow-300" />
                <Heart className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <div className="h-px w-12 bg-yellow-300" />
              </div>
              <p className="text-xs md:text-sm text-gray-600 tracking-wide">Request the honor of your presence</p>
              <p className="text-xs md:text-sm font-bold text-yellow-700 tracking-wider mt-1">May 30, 2026 • Nasugbu, Batangas</p>
            </div>
          </div>

          {/* === LAYER 3 — Envelope front panels (cover the card when idle) === */}
          {/* Bottom V flap */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              zIndex: 8,
              clipPath: 'polygon(0 50%, 50% 100%, 100% 50%, 100% 100%, 0 100%)',
              background: 'linear-gradient(to bottom, #fef9c3, #fde047)',
            }}
          />
          {/* Left & right side panels */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              zIndex: 8,
              clipPath: 'polygon(0 0, 0 65%, 50% 100%, 100% 65%, 100% 0, 50% 45%)',
              background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
            }}
          />


          {/* === LAYER 4 — Top flap (rotates open on click) === */}
          <div
            className="absolute top-0 left-0 right-0 rounded-t-2xl overflow-hidden"
            style={{
              height: '55%',
              zIndex: 9,
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              transition: isAnimating ? 'transform 0.7s ease-in-out' : 'transform 0.3s',
              transform: isAnimating ? 'rotateX(-175deg)' : 'rotateX(0deg)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(to bottom, #fef9c3, #facc15)',
            }}
          />

          {/* === LAYER 5 — Wax seal (disappears on open) === */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
            style={{
              zIndex: 20,
              opacity: isAnimating ? 0 : 1,
              transform: `translate(-50%, -50%) scale(${isAnimating ? 0 : 1})`,
            }}
          >
            <div className="absolute inset-[-4px] rounded-full border border-yellow-400/30 animate-ping opacity-20" />
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #fde047, #ca8a04)',
                boxShadow: '0 4px 14px rgba(202,138,4,0.45), inset 0 1px 3px rgba(255,240,150,0.5)',
                border: '2px solid #a16207',
              }}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-yellow-900 font-serif text-[10px] md:text-xs font-bold tracking-tight">April</span>
                <div className="w-6 h-px bg-yellow-800/50 my-0.5" />
                <span className="text-yellow-900 font-serif text-[10px] md:text-xs font-bold tracking-tight">&amp; Mac</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`mt-12 flex flex-col items-center gap-2 transition-all duration-500 ${
        isAnimating ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100 translate-y-0'
      }`}>
        <div className="flex flex-col items-center gap-0.5 mb-1">
          <div className="w-4 h-px bg-yellow-500/50" />
          <div className="w-7 h-px bg-yellow-500/50" />
          <div className="w-4 h-px bg-yellow-500/50" />
        </div>
        <p className="text-yellow-900/70 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">Click to Open</p>
      </div>
    </div>
  );
}
