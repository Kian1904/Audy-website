/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  MessageCircle, 
  Clock, 
  Smile, 
  Send, 
  ArrowRight, 
  Lock, 
  CheckCircle, 
  Info, 
  Sparkles, 
  Leaf, 
  HelpCircle,
  QrCode,
  Users,
  Compass,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';

interface CurhatService {
  id: string;
  name: string;
  priceText: string;
  priceVal: number;
  durationText: string;
  durationVal: number;
  description: string;
  emoji: string;
  colorClass: string;
}

const SERVICES: CurhatService[] = [
  {
    id: 'percintaan',
    name: 'Masalah Percintaan',
    priceText: '25k',
    priceVal: 25000,
    durationText: '15 menit',
    durationVal: 15,
    description: 'Bicarakan kegelisahan romantis Anda, dilema asmara, ketidakpastian hubungan, patah hati, atau mencari pemahaman baru bersama Audia yang berempati tinggi.',
    emoji: '💖',
    colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300 text-rose-800'
  },
  {
    id: 'keluarga',
    name: 'Masalah Keluarga',
    priceText: '10k',
    priceVal: 10000,
    durationText: '10 menit',
    durationVal: 10,
    description: 'Ruang aman tanpa penghakiman untuk menuangkan beban pikiran atas dinamika keluarga, miskomunikasi, atau konflik ekspektasi orang tua.',
    emoji: '🏠',
    colorClass: 'bg-amber-50 border-amber-100 hover:border-amber-300 text-amber-800'
  },
  {
    id: 'keuangan',
    name: 'Masalah Keuangan',
    priceText: '10k',
    priceVal: 10000,
    durationText: '10 menit',
    durationVal: 10,
    description: 'Curahkan kecemasan finansial, tekanan gaya hidup, atau beban memikirkan masa depan secara tenang untuk mengurai stres emosional Anda.',
    emoji: '💵',
    colorClass: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-800'
  },
  {
    id: 'kerjaan',
    name: 'Masalah Kerjaan',
    priceText: '10k',
    priceVal: 10000,
    durationText: '10 menit',
    durationVal: 10,
    description: 'Hadapi burnout kerja, tekanan atasan, ketidakcocokan karir, drama lingkungan kerja, atau rasa ragu melangkah ke keputusan karir yang baru.',
    emoji: '💼',
    colorClass: 'bg-blue-50 border-blue-100 hover:border-blue-300 text-blue-800'
  },
  {
    id: 'gabut',
    name: 'Gabut',
    priceText: '5k',
    priceVal: 5000,
    durationText: '5 menit',
    durationVal: 5,
    description: 'Sedang bosan dan butuh teman mengobrol yang ramah, hangat, dan interaktif? Mari ngobrol santai tanpa topik berat untuk mencairkan kejenuhan Anda.',
    emoji: '☕',
    colorClass: 'bg-stone-100 border-stone-200 hover:border-stone-400 text-stone-800'
  },
  {
    id: 'galau',
    name: 'Galau',
    priceText: '15k',
    priceVal: 15000,
    durationText: '10 menit',
    durationVal: 10,
    description: 'Merasakan kekosongan hati, kerinduan, atau kepenatan emosional mendalam yang sulit diceritakan ke sahabat dekat. Di sini, perasaan Anda divalidasi.',
    emoji: '☁️',
    colorClass: 'bg-purple-50 border-purple-100 hover:border-purple-300 text-purple-800'
  }
];

const MINDFUL_QUOTES = [
  "Napas Anda adalah jangkar Anda. Semua badai emosi ini adalah awan yang pasti akan berlalu.",
  "Tidak apa-apa untuk merasa tidak baik-baik saja. Menangis atau merasa lelah adalah bukti bahwa Anda adalah manusia yang tulus.",
  "Anda tidak harus memikul seluruh dunia di pundak Anda sendirian hari ini.",
  "Setiap perasaan yang Anda miliki saat ini adalah sah, nyata, dan layak didengarkan dengan penuh kelembutan.",
  "Terima kasih sudah bertahan sampai hari ini. Luangkan waktu sejenak untuk berterima kasih pada diri Anda sendiri.",
  "Kamu berharga. Kehadiranmu, ceritamu, dan kebahagiaanmu di masa depan sangatlah berarti."
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('curhatdy-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'light';
  });

  // Keep theme in sync with localStorage
  useEffect(() => {
    localStorage.setItem('curhatdy-theme', theme);
  }, [theme]);

  // Navigation active tab / scroll
  const [activeTab, setActiveTab] = useState<'beranda' | 'layanan' | 'pembayaran'>('beranda');

  // Interactive Price / Selection Calculator
  const [selectedService, setSelectedService] = useState<CurhatService>(SERVICES[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [userInitialVentText, setUserInitialVentText] = useState<string>('');
  
  // Custom interactive relief box states
  const [burdenInput, setBurdenInput] = useState<string>('');
  const [isReleasing, setIsReleasing] = useState<boolean>(false);
  const [didRelease, setDidRelease] = useState<boolean>(false);
  const [randomQuote, setRandomQuote] = useState<string>('');

  // Breathing simulation counter
  const [breathPhase, setBreathPhase] = useState<'Hirup' | 'Tahan' | 'Hembuskan'>('Hirup');
  const [breathVal, setBreathVal] = useState<number>(0); // 0 to 100 representing visual scale
  const [isBreathingGuided, setIsBreathingGuided] = useState<boolean>(true);

  // Breathing simulator cycle timing (every 4 seconds switch phase)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathingGuided) {
      let step = 0;
      interval = setInterval(() => {
        step = (step + 1) % 3;
        if (step === 0) {
          setBreathPhase('Hirup');
          setBreathVal(100);
        } else if (step === 1) {
          setBreathPhase('Tahan');
          setBreathVal(100);
        } else {
          setBreathPhase('Hembuskan');
          setBreathVal(20);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isBreathingGuided]);

  // Initial breath setup
  useEffect(() => {
    setBreathVal(80);
  }, []);

  // Handler for Release burden
  const handleReleaseBurden = (e: FormEvent) => {
    e.preventDefault();
    if (!burdenInput.trim()) return;

    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setDidRelease(true);
      const randomMsg = MINDFUL_QUOTES[Math.floor(Math.random() * MINDFUL_QUOTES.length)];
      setRandomQuote(randomMsg);
      // Pre-fill the curhat message in booking as well if they wish
      if (!userInitialVentText) {
        setUserInitialVentText(burdenInput);
      }
      setBurdenInput('');
    }, 1800);
  };

  const resetReleaseBox = () => {
    setDidRelease(false);
  };

  // Generate Telegram link helper
  const getTelegramLink = () => {
    const phoneNumber = '6289525817105'; // Raw Indonesian format (+62 895-2581-7105)
    return `https://t.me/+${phoneNumber}`;
  };

  // Generate Telegram message helper
  const getTelegramMessage = () => {
    const totalPriceText = `${(selectedService.priceVal * quantity / 1000)}k`;
    const totalDurationText = `${selectedService.durationVal * quantity} menit`;

    let customTextSegment = '';
    if (userInitialVentText.trim()) {
      customTextSegment = `\n\n*Pesan / Cerita Awal Saya:* _"${userInitialVentText.trim()}"_`;
    }

    return `Halo Audia (curhatdy), saya ingin memesan layanan curhat sebagai berikut:

*Layanan:* ${selectedService.name} ${selectedService.emoji}
*Durasi Sesi:* ${totalDurationText} (Multiplier x${quantity})
*Estimasi Kontribusi:* ${totalPriceText}
*Metode Pembayaran:* GoPay (Exclusive)${customTextSegment}

Mohon info jadwal slot kosongnya ya, terima kasih banyak Audia! ✨`;
  };

  // Safe clipboard helper
  const copyMessageToClipboard = () => {
    try {
      const msg = getTelegramMessage();
      navigator.clipboard.writeText(msg);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0E1411] text-[#E5ECE8] selection:bg-[#2F473A] selection:text-[#7AE5A7]' 
        : 'bg-[#FCFAF7] text-[#1E2522] selection:bg-[#E2ECE5] selection:text-[#274834]'
    }`}>
      
      {/* 1. Header Navigation Bar */}
      <header id="app-header" className={`sticky top-0 z-50 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all border-b ${
        theme === 'dark' 
          ? 'bg-[#0E1411]/90 border-[#1B2520]' 
          : 'bg-[#FCFAF7]/90 border-[#F0EAE1]'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm ${
              theme === 'dark' ? 'bg-[#52AD7A]' : 'bg-[#3D5E4E]'
            }`}>
              c
            </span>
            <div>
              <span className={`font-serif font-bold text-xl tracking-wide bg-gradient-to-r bg-clip-text text-transparent ${
                theme === 'dark' ? 'from-[#9EDFB8] to-[#51AA78]' : 'from-[#213229] to-[#3D5E4E]'
              }`}>
                curhatdy
              </span>
              <span className={`block text-[10px] tracking-wider font-mono -mt-1 ${
                theme === 'dark' ? 'text-[#7DA48F]' : 'text-[#717E77]'
              }`}>By Audia</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a 
              href="#hero-section" 
              onClick={() => setActiveTab('beranda')}
              className={`transition-colors py-1 ${
                theme === 'dark'
                  ? `hover:text-[#6ECC9E] ${activeTab === 'beranda' ? 'text-[#7EDFB0] border-b-2 border-[#52AD7A]' : 'text-[#9BB0A5]'}`
                  : `hover:text-[#274834] ${activeTab === 'beranda' ? 'text-[#2D453A] border-b-2 border-[#3D5E4E]' : 'text-[#4D5A52]'}`
              }`}
            >
              Beranda & Profil
            </a>
            <a 
              href="#pricelist" 
              onClick={() => {
                setActiveTab('layanan');
                const el = document.getElementById('pricelist');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`transition-colors py-1 ${
                theme === 'dark'
                  ? `hover:text-[#6ECC9E] ${activeTab === 'layanan' ? 'text-[#7EDFB0] border-b-2 border-[#52AD7A]' : 'text-[#9BB0A5]'}`
                  : `hover:text-[#274834] ${activeTab === 'layanan' ? 'text-[#2D453A] border-b-2 border-[#3D5E4E]' : 'text-[#4D5A52]'}`
              }`}
            >
              List Layanan & Harga
            </a>
            <a 
              href="#pembayaran-gopay" 
              onClick={() => {
                setActiveTab('pembayaran');
                const el = document.getElementById('pembayaran-gopay');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`transition-colors py-1 ${
                theme === 'dark'
                  ? `hover:text-[#6ECC9E] ${activeTab === 'pembayaran' ? 'text-[#7EDFB0] border-b-2 border-[#52AD7A]' : 'text-[#9BB0A5]'}`
                  : `hover:text-[#274834] ${activeTab === 'pembayaran' ? 'text-[#2D453A] border-b-2 border-[#3D5E4E]' : 'text-[#4D5A52]'}`
              }`}
            >
              Pembayaran
            </a>
          </nav>

          {/* Status Indicators, Theme Toggle & Direct Quick Button */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-[#18231E] border-[#2F4238] text-amber-300 hover:text-amber-200'
                  : 'bg-[#F2EDE2] border-[#EADFCB] text-stone-700 hover:text-stone-900'
              }`}
              title={theme === 'dark' ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              theme === 'dark'
                ? 'bg-[#152B1E] border-[#1D4A30] text-[#9EE5B9]'
                : 'bg-[#EBF4EE] border-[#D5E6DB] text-[#2A593E]'
            }`}>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              Audia Online
            </div>

            <a 
              id="header-cta-btn"
              href="#pricelist"
              className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95 flex items-center gap-1 ${
                theme === 'dark'
                  ? 'bg-[#3EB87F] hover:bg-[#2CA16A] text-[#0A1811]'
                  : 'bg-[#2E4A3E] hover:bg-[#1E332A] text-white'
              }`}
            >
              Pesan Jasa
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="pb-24">

        {/* 2. Hero Section */}
        <section id="hero-section" className={`relative pt-10 pb-16 px-4 sm:px-8 max-w-6xl mx-auto border-b ${
          theme === 'dark' ? 'border-[#1B2520]' : 'border-[#F0EAE1]'
        }`}>
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline */}
            <div className="lg:col-span-7 space-y-6">
              <div id="badge-welcome" className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                theme === 'dark' ? 'bg-[#18231E] text-[#6ECE9E]' : 'bg-[#EAE5DC] text-[#554A3B]'
              }`}>
                <Leaf className="w-3.5 h-3.5" />
                #1 Ruang Aman & Nyaman Untukmu
              </div>
              
              <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.12] font-semibold ${
                theme === 'dark' ? 'text-[#EFF6F2]' : 'text-[#1F2B24]'
              }`}>
                Beban pikiran terasa berat? <br />
                <span className={`italic font-normal ${theme === 'dark' ? 'text-[#5CD296]' : 'text-[#486B5A]'}`}>Berceritalah</span> di sini.
              </h1>

              <p className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
                theme === 'dark' ? 'text-[#A1B3A7]' : 'text-[#55635C]'
              }`}>
                Tidak ada teman dekat atau partner yang pas untuk mendengar keluh kesah Anda? 
                <strong className={`font-semibold ${theme === 'dark' ? 'text-[#64D89A]' : 'text-[#2F443A]'}`}> curhatdy</strong> hadir sebagai ruang tepercaya untuk mencurahkan rasa penat, kecemasan, 
                maupun keresahan hidup. Bersama <strong className={`font-semibold ${theme === 'dark' ? 'text-[#64D89A]' : 'text-[#2F443A]'}`}>Audia</strong>, setiap pesan Anda didengar penuh empati, tanpa penghakiman.
              </p>

              {/* Core Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div id="attr-privacy" className={`flex items-center gap-2.5 p-3 rounded-2xl border shadow-xs ${
                  theme === 'dark' ? 'bg-[#131B18] border-[#223027]' : 'bg-white border-[#EDE8DE]'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-[#EBF4F0] text-[#345946] flex items-center justify-center font-bold">
                    🛡️
                  </div>
                  <div>
                    <span className={`block text-xs font-bold ${theme === 'dark' ? 'text-[#EFF6F1]' : 'text-[#202924]'}`}>Privasi 100%</span>
                    <span className={`block text-[11px] ${theme === 'dark' ? 'text-[#8DA395]' : 'text-[#717E77]'}`}>Sangat Dijamin Aman</span>
                  </div>
                </div>

                <div id="attr-empathy" className={`flex items-center gap-2.5 p-3 rounded-2xl border shadow-xs ${
                  theme === 'dark' ? 'bg-[#131B18] border-[#223027]' : 'bg-white border-[#EDE8DE]'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] text-[#A67E4E] flex items-center justify-center font-bold">
                    💬
                  </div>
                  <div>
                    <span className={`block text-xs font-bold ${theme === 'dark' ? 'text-[#EFF6F1]' : 'text-[#202924]'}`}>Saran & Solusi</span>
                    <span className={`block text-[11px] ${theme === 'dark' ? 'text-[#8DA395]' : 'text-[#717E77]'}`}>Sesuai Kebutuhanmu</span>
                  </div>
                </div>

                <div id="attr-flexible" className={`flex items-center gap-2.5 p-3 rounded-2xl border shadow-xs ${
                  theme === 'dark' ? 'bg-[#131B18] border-[#223027]' : 'bg-white border-[#EDE8DE]'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-[#EDF0F7] text-[#41629E] flex items-center justify-center font-bold">
                    🚀
                  </div>
                  <div>
                    <span className={`block text-xs font-bold ${theme === 'dark' ? 'text-[#EFF6F1]' : 'text-[#202924]'}`}>Format Fleksibel</span>
                    <span className={`block text-[11px] ${theme === 'dark' ? 'text-[#8DA395]' : 'text-[#717E77]'}`}>Langsung Chat WA</span>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a 
                  href="#pricelist" 
                  className={`px-7 py-3.5 rounded-2xl font-semibold text-center transition-all hover:shadow-md active:scale-98 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-[#3EB87F] hover:bg-[#2CA16A] text-[#0A1811]'
                      : 'bg-[#3D5E4E] hover:bg-[#2C4539] text-white'
                  }`}
                >
                  Pilih Paket Curhat Sekarang
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#ruang-relaksasi" 
                  className={`px-7 py-3 text-center rounded-2xl font-medium transition-all active:scale-98 flex items-center justify-center gap-2 text-sm border ${
                    theme === 'dark'
                      ? 'bg-transparent hover:bg-[#18231E] text-[#5ED296] border-[#2F4238]'
                      : 'bg-transparent hover:bg-stone-100 text-[#3D5E4E] border-[#CBD7CE]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#C19B4C]" />
                  Coba Ruang Relaksasi (Gratis)
                </a>
              </div>
            </div>

            {/* Right Column: Audio Creator Profile Box */}
            <div className="lg:col-span-5">
              <div id="audia-creator-card" className={`border-2 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden ${
                theme === 'dark' ? 'bg-[#131B18] border-[#273F33]' : 'bg-[#FAF8F5] border-[#EADFCB]'
              }`}>
                
                {/* Decorative visual circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1ECE3] rounded-full filter blur-2xl opacity-40 -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FAF0E1] rounded-full filter blur-2xl opacity-40 -ml-10 -mb-10"></div>

                <div className="relative text-center">
                  {/* Persona avatar design made purely of Tailwind for beautiful presentation */}
                  <div className={`w-24 h-24 rounded-full mx-auto p-1 shadow-md mb-4 flex items-center justify-center relative bg-gradient-to-tr ${
                    theme === 'dark' ? 'from-[#3EB87F] to-[#1E3B2E]' : 'from-[#3D5E4E] to-[#6A8B7B]'
                  }`}>
                    <span className="text-white font-serif text-3xl font-extrabold select-none">A</span>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#3FB86F] border-2 border-white rounded-full flex items-center justify-center" title="Ready to listen">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    </div>
                  </div>

                  <span className={`text-xs font-bold uppercase tracking-widest block mb-1 ${
                    theme === 'dark' ? 'text-[#8EECAE]' : 'text-[#345946]'
                  }`}>MEMBERI SOLUSI & EMPATI</span>
                  <h3 className={`text-2xl font-serif font-bold mb-2 ${
                    theme === 'dark' ? 'text-[#EEFBF3]' : 'text-[#1F2B24]'
                  }`}>Audia</h3>
                  
                  {/* Creator quote block */}
                  <div className={`rounded-2xl p-4 text-sm italic leading-relaxed mb-4 text-left border ${
                    theme === 'dark' ? 'bg-[#0E1512]/80 border-[#1E2E25] text-[#ABBCAE]' : 'bg-white/80 border-[#F2ECE0] text-[#4E5B53]'
                  }`}>
                    "Setiap orang berhak memiliki tempat bercerita tanpa takut dihakimi. Kehadiran saya di curhatdy adalah untuk memastikan Anda mendapatkan kawan bicara yang tulus, saran yang jernih, dan solusi nyata dengan tingkat privasi 100% aman."
                  </div>

                  {/* Core Badges on Profile */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className={`px-2.5 py-1 rounded-full font-medium border ${
                      theme === 'dark' ? 'bg-[#182B1E] text-[#6CE791] border-[#22452F]' : 'bg-[#EEFAF0] text-[#1E5D2A] border-[#D5ECCF]'
                    }`}>🛡️ Jaminan Privasi 100%</span>
                    <span className={`px-2.5 py-1 rounded-full font-medium border ${
                      theme === 'dark' ? 'bg-[#2B2317] text-[#ECCAA4] border-[#443825]' : 'bg-[#FAF6EC] text-[#865F2F] border-[#EFDFCC]'
                    }`}>🤝 No Judgment</span>
                    <span className={`px-2.5 py-1 rounded-full font-medium border ${
                      theme === 'dark' ? 'bg-[#182333] text-[#93C3FC] border-[#23354E]' : 'bg-[#EDF3FA] text-[#2F5486] border-[#D2E2F1]'
                    }`}>💡 Pendengar Solutif</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>


        {/* 3. Breathing Companion (Ruang Relaksasi) */}
        <section id="ruang-relaksasi" className={`py-12 px-4 sm:px-8 border-b transition-all ${
          theme === 'dark' ? 'bg-[#121A15] border-[#1B2720]' : 'bg-[#F5F1EB] border-[#EBE3D7]'
        }`}>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-[#6A7B72]">
              <Compass className="w-4 h-4 text-[#3D5E4E] animate-spin" style={{ animationDuration: '8s' }} />
              Ruang Tenang & Relaksasi
            </div>
            
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${
              theme === 'dark' ? 'text-[#EFF6F2]' : 'text-[#1E2522]'
            }`}>
              Ambil Napas Sejenak Bersama Audia
            </h2>
            <p className={`text-sm sm:text-base max-w-xl mx-auto ${
              theme === 'dark' ? 'text-[#9CB39E]' : 'text-[#56655D]'
            }`}>
              Sebelum mulai mencurahkan isi hati Anda, sinkronkan napas Anda dengan panduan lembut di bawah ini untuk mengaktifkan ketenangan psikologis Anda.
            </p>

            <div className="py-6 flex flex-col items-center justify-center">
              
              {/* Pulsing visual circle representing inhalation/exhalation */}
              <div 
                id="breathing-circle-container"
                className="relative flex items-center justify-center mb-6"
              >
                {/* Secondary larger soft glow ring */}
                <div 
                  className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
                    theme === 'dark' ? 'bg-[#3EB87F]/10' : 'bg-[#3D5E4E]/10'
                  }`}
                  style={{
                    width: breathPhase === 'Hirup' ? '220px' : breathPhase === 'Tahan' ? '240px' : '150px',
                    height: breathPhase === 'Hirup' ? '220px' : breathPhase === 'Tahan' ? '240px' : '150px',
                  }}
                />

                {/* Primary circle container */}
                <div 
                  id="breathing-pulse-element"
                  className={`w-44 h-44 rounded-full text-white flex flex-col items-center justify-center transition-all duration-[4000ms] shadow-md z-10 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-tr from-[#1B3527] to-[#3EB87F] border border-[#3EB87F]/45' 
                      : 'bg-gradient-to-tr from-[#3D5E4E] to-[#4F7F68]'
                  }`}
                  style={{
                    transform: breathPhase === 'Hirup' ? 'scale(1.15)' : breathPhase === 'Tahan' ? 'scale(1.2)' : 'scale(0.85)',
                  }}
                >
                  <span className={`text-xs uppercase font-semibold tracking-wider opacity-90 ${
                    theme === 'dark' ? 'text-emerald-100' : 'text-emerald-50'
                  }`}>
                    {breathPhase === 'Hirup' ? 'Tarik Napas...' : breathPhase === 'Tahan' ? 'Tahan Napas...' : 'Hembuskan...'}
                  </span>
                  
                  <span className="font-serif text-xl font-bold mt-1">
                    {breathPhase === 'Hirup' ? 'Inhale' : breathPhase === 'Tahan' ? 'Hold' : 'Exhale'}
                  </span>

                  <span className="text-[10px] text-stone-100/70 mt-2">
                    Lakukan 4 detik
                  </span>
                </div>
              </div>

              {/* Status Indicator controls */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  id="toggle-breathe-btn"
                  onClick={() => setIsBreathingGuided(!isBreathingGuided)}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all hover:shadow-xs border ${
                    theme === 'dark'
                      ? 'bg-[#15231C] border-[#2E453A] hover:border-[#3EB87F] text-[#55D291]'
                      : 'bg-white border-stone-200 hover:border-[#3D5E4E] text-[#3D5E4E]'
                  }`}
                >
                  {isBreathingGuided ? '🛑 Pause Panduan' : '▶️ Mulai Panduan'}
                </button>
                <div className={`text-xs italic font-medium ${
                  theme === 'dark' ? 'text-[#8DA391]' : 'text-[#56655D]'
                }`}>
                  {isBreathingGuided ? 'Panduan Berjalan Otomatis... 🤍' : 'Panduan Berhenti.'}
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 4. Interactive Reliever (The Burden Releaser Box) - Experience Booster */}
        <section id="burden-box" className={`py-16 px-4 sm:px-8 max-w-4xl mx-auto border-b ${
          theme === 'dark' ? 'border-[#1B2520]' : 'border-[#F0EAE1]'
        }`}>
          <div className={`rounded-3xl p-6 sm:p-10 border shadow-xs relative ${
            theme === 'dark' ? 'bg-[#131B18] border-[#22352B]' : 'bg-white border-[#ECE6DB]'
          }`}>
            
            <div className="max-w-2xl mx-auto">
              
              {!didRelease ? (
                <form onSubmit={handleReleaseBurden} className="space-y-6">
                  
                  <div className="text-center space-y-2">
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                      theme === 'dark' ? 'text-[#E7C69D]' : 'text-[#A48259]'
                    }`}>Fitur Kesehatan Mental Instan</span>
                    <h2 className={`font-serif text-2xl sm:text-3xl font-semibold ${
                      theme === 'dark' ? 'text-[#EFF8F1]' : 'text-[#1F2521]'
                    }`}>
                      Lepaskan Penat di Pundakmu
                    </h2>
                    <p className={`text-xs sm:text-sm max-w-lg mx-auto ${
                      theme === 'dark' ? 'text-[#9AAEA2]' : 'text-[#6C7B72]'
                    }`}>
                      Tuliskan potongan kalimat, emosi negatif, kemarahan, atau perasaan tersumbat Anda di bawah ini secara anonim. Tekan tombol untuk melepasnya terbang tanpa dihakimi siapa pun.
                    </p>
                  </div>

                  <div className="relative">
                    <textarea
                      id="burden-input-textarea"
                      placeholder="Contoh: 'Saya lelah sekali harus selalu pura-pura bahagia di depan keluarga saya padahal aslinya...'"
                      value={burdenInput}
                      onChange={(e) => setBurdenInput(e.target.value)}
                      rows={5}
                      maxLength={500}
                      className={`w-full rounded-2xl border-2 p-4 text-sm sm:text-base focus:outline-hidden transition-all resize-none ${
                        theme === 'dark'
                          ? 'border-[#2D3E35] focus:border-[#3EB87F] bg-[#0E1411] text-[#E5ECE8] placeholder-[#536E5E]'
                          : 'border-[#E7E1D2] focus:border-[#3D5E4E] bg-[#FAFAF8] text-stone-800 placeholder-stone-400'
                      }`}
                    />
                    <div className={`absolute bottom-3 right-4 text-xs font-mono ${
                      theme === 'dark' ? 'text-[#7A8E82]' : 'text-[#919F95]'
                    }`}>
                      {burdenInput.length}/500 karakter
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1.5 text-xs ${
                      theme === 'dark' ? 'text-[#99A69D]' : 'text-[#7B8B81]'
                    }`}>
                      <Lock className="w-3.5 h-3.5 text-[#517E65]" />
                      Data aman, tidak disimpan di database server apa pun.
                    </div>
                    
                    <button
                      type="submit"
                      id="btn-release-burden"
                      disabled={isReleasing || !burdenInput.trim()}
                      className={`text-sm font-semibold py-3 px-6 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                        burdenInput.trim() 
                          ? theme === 'dark'
                            ? 'bg-[#3EB87F] hover:bg-[#2CA16A] text-[#0A1811] hover:shadow-md'
                            : 'bg-[#3D5E4E] hover:bg-[#2C4539] text-white hover:shadow-md' 
                          : theme === 'dark'
                            ? 'bg-[#17211C] text-[#32453B] cursor-not-allowed'
                            : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {isReleasing ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                          Melarutkan cerita Anda...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Lepaskan Beban Pikiran
                        </>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                <div id="relief-success" className="text-center space-y-6 py-6 animate-fadeIn">
                  
                  {/* Glowing empathy message */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl ${
                    theme === 'dark' ? 'bg-[#183525] text-[#55D285]' : 'bg-[#EBF7F0] text-[#256D41]'
                  }`}>
                    🕊️
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-serif text-2xl font-semibold ${
                      theme === 'dark' ? 'text-[#52D489]' : 'text-[#256D41]'
                    }`}>
                      Kalimat Anda Telah Dilarutkan
                    </h3>
                    <p className={`text-sm max-w-md mx-auto ${
                      theme === 'dark' ? 'text-[#A9BAAF]' : 'text-[#54645A]'
                    }`}>
                      Biarkan beban pikiran Anda memudar perlahan seperti debu ditiup angin sepoi. Anda pantas merasa rileks dan tenang.
                    </p>
                  </div>

                  {/* Comfort quote box from Audia */}
                  <div className={`border rounded-2xl p-5 italic text-sm max-w-lg mx-auto relative ${
                    theme === 'dark' ? 'bg-[#141E1A] border-[#342718] text-[#ECCAA4]' : 'bg-[#FCFAF7] border-[#ECD9BA] text-[#614D32]'
                  }`}>
                    <span className={`absolute top-1 left-2 text-3xl select-none ${
                      theme === 'dark' ? 'text-[#AA885B]' : 'text-[#E8C593]'
                    }`}>“</span>
                    <p className="relative z-10 px-4 py-2 font-medium">
                      {randomQuote}
                    </p>
                    <span className={`block mt-2 text-right text-xs font-semibold not-italic ${
                      theme === 'dark' ? 'text-[#99AAA0]' : 'text-[#828F87]'
                    }`}>
                      — Salam Hangat, Audia
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                    <button
                      type="button"
                      id="btn-reset-relief"
                      onClick={resetReleaseBox}
                      className={`text-xs font-semibold px-4 py-2 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'text-stone-300 hover:text-white border-[#2C3B31] hover:border-[#42594B]'
                          : 'text-stone-600 hover:text-stone-800 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      Tulis Beban Baru Lainnya
                    </button>
                    
                    <a
                      href="#pricelist"
                      className={`text-xs font-semibold px-5 py-2.5 rounded-xl transition-all ${
                        theme === 'dark'
                          ? 'bg-[#3EB87F] hover:bg-[#2CA16A] text-[#0A1811]'
                          : 'bg-[#2E4A3E] hover:bg-[#1C3027] text-white'
                      }`}
                    >
                      Lanjut Curhat Private Bersama Audia ✨
                    </a>
                  </div>

                </div>
              )}

            </div>
          </div>
        </section>


        {/* 5. Pricing Matrix section */}
        <section id="pricelist" className={`py-16 px-4 sm:px-8 max-w-6xl mx-auto border-b ${
          theme === 'dark' ? 'border-[#1B2520]' : 'border-[#F0EAE1]'
        }`}>
          
          <div className="text-center space-y-3 mb-10">
            <span className={`text-xs font-bold tracking-widest uppercase block ${
              theme === 'dark' ? 'text-[#3EB87F]' : 'text-[#3D5E4E]'
            }`}>
              Daftar Paket curhatdy
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl font-semibold ${
              theme === 'dark' ? 'text-[#EFF6F2]' : 'text-[#1C2420]'
            }`}>
              Pilih Paket & Rentang Waktu 
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-[#9CB3A3]' : 'text-[#526458]'
            }`}>
              Beritahu Audia apa yang paling menggelisahkan hati Anda saat ini. Pilih salah satu kategori masukan di bawah, hitung rancangan kontribusi, dan rasakan keringanan instan.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left grid: Service listings cards */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {SERVICES.map((serv) => {
                const isSelected = selectedService.id === serv.id;
                return (
                  <button
                    key={serv.id}
                    id={`service-card-${serv.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedService(serv);
                    }}
                    className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 relative group cursor-pointer ${
                      isSelected 
                        ? theme === 'dark'
                          ? 'border-[#3EB87F] bg-[#14211A] ring-2 ring-[#3EB87F]/10 shadow-md'
                          : 'border-[#3D5E4E] bg-white ring-2 ring-[#3D5E4E]/10 shadow-md' 
                        : theme === 'dark'
                          ? 'border-[#24352B] bg-[#111714] hover:border-[#334A3E] shadow-xs'
                          : 'border-[#EEEDED] bg-white hover:border-stone-300 shadow-xs'
                    }`}
                  >
                    {/* Selected Badge check icon overlay */}
                    {isSelected && (
                      <div className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-[#3EB87F]' : 'text-[#3D5E4E]'}`}>
                        <CheckCircle className={`w-5 h-5 ${
                          theme === 'dark' ? 'fill-[#0E1511] text-[#3EB87F]' : 'fill-emerald-50 text-emerald-800'
                        }`} />
                      </div>
                    )}

                    <div className="text-3xl mb-3">{serv.emoji}</div>
                    
                    <h3 className={`font-serif text-lg font-bold mb-1 transition-colors ${
                      theme === 'dark'
                        ? isSelected ? 'text-[#3EB87F]' : 'text-[#E8F5EE] group-hover:text-[#3EB87F]'
                        : isSelected ? 'text-[#3D5E4E]' : 'text-[#1E2522] group-hover:text-[#3D5E4E]'
                    }`}>
                      {serv.name}
                    </h3>

                    {/* Price and duration tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        theme === 'dark' ? 'bg-[#183321] text-[#6DE791]' : 'bg-[#EDFAF0] text-[#1E5D2A]'
                      }`}>
                        {serv.priceText}
                      </span>
                      <span className={`text-xs flex items-center gap-1 font-medium ${
                        theme === 'dark' ? 'text-[#8DAAA1]' : 'text-[#888E8A]'
                      }`}>
                        <Clock className="w-3 h-3 text-stone-400" />
                        {serv.durationText}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-[#8DA393]' : 'text-[#5D6B61]'
                    }`}>
                      {serv.description}
                    </p>

                  </button>
                );
              })}
            </div>

            {/* Right grid: Interactive Estimator Board */}
            <div id="booking-estimator-panel" className={`border-2 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs ${
              theme === 'dark' ? 'bg-[#131B18] border-[#253A2E]' : 'bg-[#FAF8F5] border-[#E7DECE]'
            }`}>
              
              <div className={`border-b pb-4 ${theme === 'dark' ? 'border-[#273F32]' : 'border-[#EDE3D0]'}`}>
                <span className={`text-[11px] font-bold uppercase tracking-wide block ${
                  theme === 'dark' ? 'text-[#E5C397]' : 'text-[#A48052]'
                }`}>
                  Kalkulator / Konfigurasi Sesi
                </span>
                <h3 className={`font-serif text-xl font-bold mt-0.5 ${
                  theme === 'dark' ? 'text-[#EFF6F1]' : 'text-stone-900'
                }`}>
                  Detail Estimasi Layanan
                </h3>
              </div>

              {/* Package Summary Box */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                theme === 'dark' ? 'bg-[#0E1411] border-[#22352A]' : 'bg-white border-[#EDE4D5]'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-[#8A9C91]' : 'text-stone-500'}`}>Paket Terpilih</span>
                    <h4 className={`font-serif text-base font-bold flex items-center gap-1.5 mt-0.5 ${
                      theme === 'dark' ? 'text-[#EFF8F2]' : 'text-[#1E2522]'
                    }`}>
                      <span>{selectedService.emoji}</span> {selectedService.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${theme === 'dark' ? 'text-[#8A9C91]' : 'text-stone-500'}`}>Tarif Dasar</span>
                    <span className={`block text-sm font-extrabold mt-0.5 ${
                      theme === 'dark' ? 'text-[#3EB87F]' : 'text-[#3D5E4E]'
                    }`}>
                      Rp {selectedService.priceVal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className={`flex items-center justify-between text-xs p-2.5 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-[#090E0C] border-[#1D2B22] text-[#8EA194]' 
                    : 'bg-[#FAF9F6] border-[#EDEAEA] text-stone-500'
                }`}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Waktu Sesi: <strong>{selectedService.durationText}</strong>
                  </span>
                  <span>
                    Metode: <strong>Chat/Voice call</strong>
                  </span>
                </div>
              </div>

              {/* Adjust Multiplier / Quantity */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <label className={`font-bold flex items-center gap-1 ${
                    theme === 'dark' ? 'text-[#E9F3EE]' : 'text-stone-800'
                  }`}>
                    Gandakan Durasi Sesi? 
                    <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold rounded-sm bg-yellow-105 text-yellow-850 bg-amber-100 text-amber-900">Extra</span>
                  </label>
                  <span className={`text-xs italic ${theme === 'dark' ? 'text-[#8AA191]' : 'text-stone-500'}`}>Maksimal 6x kelipatan</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      theme === 'dark'
                        ? 'border-[#2B3F32] bg-[#0E1411] text-stone-300 hover:text-white hover:bg-[#1A2620]'
                        : 'border-[#CBD7CE] bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    -
                  </button>
                  <div className={`flex-1 border text-center py-2 rounded-xl text-sm font-bold ${
                    theme === 'dark' 
                      ? 'bg-[#0E1411] border-[#2B3F32] text-slate-100'
                      : 'bg-white border-[#CBD7CE] text-stone-800'
                  }`}>
                    {quantity}x Sesi ({selectedService.durationVal * quantity} menit)
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(6, quantity + 1))}
                    disabled={quantity >= 6}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold transition-colors disabled:opacity-40 ${
                      theme === 'dark'
                        ? 'border-[#2B3F32] bg-[#0E1411] text-stone-300 hover:text-white hover:bg-[#1A2620]'
                        : 'border-[#CBD7CE] bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* User Initial Message field (directly injected to WhatsApp message text) */}
              <div className="space-y-2">
                <label className={`block text-xs sm:text-sm font-bold ${
                  theme === 'dark' ? 'text-[#E9F3EE]' : 'text-stone-800'
                }`}>
                  Pesan Awal untuk Audia (Opsional)
                </label>
                <textarea
                  id="estimator-vent-textarea"
                  rows={2}
                  value={userInitialVentText}
                  onChange={(e) => setUserInitialVentText(e.target.value)}
                  placeholder="Ceritakan sedikit tentang masalahmu agar langsung dipahami Audia saat chat dimulai..."
                  className={`w-full text-xs sm:text-sm rounded-xl border p-3 focus:outline-hidden transition-all resize-none ${
                    theme === 'dark'
                      ? 'border-[#2B3F32] focus:border-[#3EB87F] bg-[#0E1411]/90 text-stone-100 placeholder-[#566B5E]'
                      : 'border-[#CBD7CE] focus:border-[#3D5E4E] bg-white/80 text-stone-800 placeholder-stone-400'
                  }`}
                />
              </div>

              {/* Total Calculation Output */}
              <div className={`p-4 rounded-2xl border space-y-2.5 ${
                theme === 'dark' ? 'bg-[#132B1E] border-[#20422D] text-[#A6E8C2]' : 'bg-[#EBF4EE] border-[#CDE1D4] text-[#2E4A3E]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-[#9EEAA9]' : 'text-[#2E4A3E]'}`}>
                    Total Durasi Sesi:
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${theme === 'dark' ? 'text-[#BEF3D5]' : 'text-[#1F3D2E]'}`}>
                    {selectedService.durationVal * quantity} Menit
                  </span>
                </div>
                
                <div className={`flex items-center justify-between border-t pt-2 ${
                  theme === 'dark' ? 'border-[#20422D]' : 'border-[#CDE1D4]'
                }`}>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-[#9EEAA9]' : 'text-[#2E4A3E]'}`}>
                    Total Biaya Penyisihan:
                  </span>
                  <span className={`text-lg sm:text-xl font-extrabold ${theme === 'dark' ? 'text-[#55D285]' : 'text-[#113B22]'}`}>
                    Rp {(selectedService.priceVal * quantity).toLocaleString('id-ID')}
                  </span>
                </div>

                <div className={`text-[11px] max-w-full leading-relaxed p-2 rounded-lg border flex items-start gap-1.5 ${
                  theme === 'dark' 
                    ? 'bg-[#080E0B] border-[#1C3A27] text-[#89AA94]' 
                    : 'bg-white/45 border-[#CDE1D4]/40 text-[#426651]'
                }`}>
                  <Info className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${theme === 'dark' ? 'text-[#3EB87F]' : 'text-[#3D5E4E]'}`} />
                  <span>Sesi curhat akan berlangsung via Telegram, bisa menggunakan Media Chatting ketikan atau diskusikan via Voice Call.</span>
                </div>
              </div>

              {/* Booking CTA Button targeting the specific Telegram action */}
              <div className="space-y-2 pt-2">
                <a 
                  id="estimator-telegram-booking-btn"
                  href={getTelegramLink()}
                  onClick={copyMessageToClipboard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full font-semibold py-4 px-6 rounded-2xl shadow-xs text-center transition-all hover:shadow-md cursor-pointer block text-sm sm:text-base transform active:scale-98 ${
                    theme === 'dark'
                      ? 'bg-[#3EB87F] hover:bg-[#2CA16A] text-[#0A1811]'
                      : 'bg-[#1E3B2E] hover:bg-[#0E1E16] text-[#EDFAF2]'
                  }`}
                >
                  Pesan via Telegram (Mulai Chat) ⚡
                </a>
                
                <p className={`text-center text-[10px] font-mono tracking-tight uppercase ${
                  theme === 'dark' ? 'text-stone-400' : 'text-stone-500'
                }`}>
                  ⚡ Detail format pesanan akan otomatis tersalin ke clipboard!
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* 6. Jaminan Privasi Section */}
        <section id="privacy-guarantee-section" className={`py-16 px-4 border-b transition-all ${
          theme === 'dark' ? 'bg-[#0B100D] border-[#1D2B22]' : 'bg-white border-b border-[#F0EAE1]'
        }`}>
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center space-y-3 mb-10">
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider block w-fit mx-auto ${
                theme === 'dark' ? 'bg-[#183321] text-[#6DE791]' : 'bg-[#EAF3EC] text-[#294834]'
              }`}>
                🔒 JAMINAN PRIVASI AMAN 100%
              </span>
              <h2 className={`font-serif text-2xl sm:text-3xl font-semibold ${
                theme === 'dark' ? 'text-[#EFF8F2]' : 'text-stone-900'
              }`}>
                Rahasia Curhat Anda Dijamin Sepenuh Hati
              </h2>
              <p className={`text-xs sm:text-sm max-w-lg mx-auto ${
                theme === 'dark' ? 'text-[#9AAEA1]' : 'text-stone-500'
              }`}>
                Audia tahu betapa sensitifnya isi cerita dan identitas Anda. Oleh sebab itu, kami menetapkan standar kenyamanan tinggi.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              
              <div className={`p-5 sm:p-6 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#131B18] border-[#22352B]' : 'bg-[#FCFAF7] border-stone-200'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-3">
                  👤
                </div>
                <h4 className={`font-serif text-base sm:text-lg font-bold mb-1 ${
                  theme === 'dark' ? 'text-[#EFF8F2]' : 'text-stone-900'
                }`}>
                  100% Anonim Boleh Terjadi
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
                }`}>
                  Anda tidak wajib menyatakan nama asli. Anda bebas memakai inisial atau samaran apa saja demi kenyamanan mutlak saat bercerita.
                </p>
              </div>

              <div className={`p-5 sm:p-6 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#131B18] border-[#22352B]' : 'bg-[#FCFAF7] border-stone-200'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-lg mb-3">
                  🗑️
                </div>
                <h4 className={`font-serif text-base sm:text-lg font-bold mb-1 ${
                  theme === 'dark' ? 'text-[#EFF8F2]' : 'text-stone-900'
                }`}>
                  Pembersihan Riwayat Rutin
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
                }`}>
                  Begitu sesi curhat berakhir dan durasi habis, seluruh histori chat akan segera dibersihkan agar tidak meninggalkan jejak apa pun.
                </p>
              </div>

              <div className={`p-5 sm:p-6 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#131B18] border-[#22352B]' : 'bg-[#FCFAF7] border-stone-200'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg mb-3">
                  🚫
                </div>
                <h4 className={`font-serif text-base sm:text-lg font-bold mb-1 ${
                  theme === 'dark' ? 'text-[#EFF8F2]' : 'text-stone-900'
                }`}>
                  No Judgment Zone
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
                }`}>
                  Apapun jenis masalah Anda: cinta, keluarga, keuangan, ataupun sekadar kegalauan absurd, tidak ada yang disalahkan atau disepelekan.
                </p>
              </div>

              <div className={`p-5 sm:p-6 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#131B18] border-[#22352B]' : 'bg-[#FCFAF7] border-stone-200'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg mb-3">
                  🤐
                </div>
                <h4 className={`font-serif text-base sm:text-lg font-bold mb-1 ${
                  theme === 'dark' ? 'text-[#EFF8F2]' : 'text-stone-900'
                }`}>
                  Non-Disclosure Alami
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
                }`}>
                  Apa yang dibahas di curhatdy, SELALU tinggal di curhatdy. Tidak ada data yang dibagikan atau dijadikan konsumsi sosial media.
                </p>
              </div>

            </div>

            {/* Privacy trust statement bar */}
            <div className={`mt-8 border rounded-2xl p-4 text-center text-xs font-medium flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'bg-[#191F13] border-[#3E3321] text-[#ECD9BA]'
                : 'bg-[#FAF6EE] border-[#E9DEC9] text-[#735A36]'
            }`}>
              <ShieldCheck className="w-4.5 h-4.5 text-[#A58252] shrink-0" />
              <span>Privasi Anda adalah komitmen utama kami. Sesi Anda bebas kecemasan. Dijamin 100% aman!</span>
            </div>

          </div>
        </section>


        {/* 7. CUSTOM SECTION: GoPay Payment Method */}
        <section id="pembayaran-gopay" className={`py-16 px-4 border-b transition-all ${
          theme === 'dark' ? 'bg-[#121915] border-[#1C2621]' : 'bg-[#F5F2EC] border-[#EBE4D8]'
        }`}>
          <div className="max-w-4xl mx-auto">
            
            <div id="payment-custom-card" className={`border-2 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden ${
              theme === 'dark' ? 'bg-[#131B18] border-[#22352A]/60' : 'bg-white border-[#3D5E4E]/20'
            }`}>
              
              {/* GoPay styled subtle top accent band of blue */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#00AED6]"></div>

              <div className="grid md:grid-cols-12 gap-8 items-center">
                
                {/* Left col: Payments badge description */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'bg-[#00AED6]/15 text-[#33C4E5]' : 'bg-[#00AED6]/10 text-[#006E88]'
                    }`}>
                      ★ Custom Section: Official Payment Partner
                    </span>
                  </div>

                  <h3 className={`font-serif text-2xl sm:text-3xl font-bold ${
                    theme === 'dark' ? 'text-[#EFF8F2]' : 'text-[#1E2522]'
                  }`}>
                    Metode Pembayaran Resmi
                  </h3>

                  <p className={`text-xs sm:text-sm leading-relaxed ${
                    theme === 'dark' ? 'text-[#9AAEA2]' : 'text-[#526458]'
                  }`}>
                    Untuk memberikan kejelasan, efisiensi, dan jaminan keamanan transaksi, layanan <strong>curhatdy</strong> menetapkan metode pembayaran tunggal yang super praktis. Kami hanya melayani pembayaran via <strong>GoPay</strong>.
                  </p>

                  <div className={`p-4 rounded-2xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-[#0E1411] border-[#22352B]' : 'bg-[#F9F7F3] border-[#EDE4D5]'
                  }`}>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#294834] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">1</div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-[#E7EFEC]' : 'text-stone-700'}`}>
                        <strong>Pilih Sesi:</strong> Pilih paket di atas terlebih dahulu untuk mendapatkan kalkulasi nominal.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#294834] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">2</div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-[#E7EFEC]' : 'text-stone-700'}`}>
                        <strong>Transfer GoPay:</strong> Kirim dana ke saldo GoPay yang diberikan oleh Audia saat chat berlangsung.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#EAF2ED] text-[#294834] font-bold text-xs flex items-center justify-center mt-0.5 shrink-0">3</div>
                      <span className={`text-xs ${theme === 'dark' ? 'text-[#E7EFEC]' : 'text-stone-700'}`}>
                        <strong>Konfirmasi & Sesi Dimulai:</strong> Sesi curhat Anda akan langsung dimulai di ruangan chat pribadi.
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2.5 text-xs font-semibold p-3 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#0A262D] border-[#164D59] text-[#B5ECF7]' : 'bg-[#E5F7FB] border-[#C2ECF5] text-[#006E88]'
                  }`}>
                    <AlertCircle className="w-4 h-4 text-[#00AED6] shrink-0" />
                    <span>Hanya menerima pembayaran resmi GoPay demi mempercepat validasi manual oleh Audia.</span>
                  </div>

                </div>

                {/* Right col: Payment Interactive Visual Emblem */}
                <div className={`border rounded-2xl p-6 text-center space-y-4 md:col-span-5 ${
                  theme === 'dark' ? 'bg-[#0E1411] border-[#2B3F32]' : 'bg-[#FAF9F5] border-[#ECDDBF]'
                }`}>
                  
                  {/* Clean GoPay graphic symbol stylized via custom tailwind */}
                  <div className="bg-[#00AED6] text-white p-4 py-6 rounded-xl shadow-xs relative inline-block w-full">
                    {/* Circle representing GoPay app feel */}
                    <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center font-bold text-lg mb-2">
                      g
                    </div>
                    <div className="text-base font-extrabold tracking-wider uppercase font-sans">
                      gopay
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#B3EEFF] mt-1 font-semibold">
                      Exclusive Payment Partner
                    </div>
                  </div>

                  <div className={`space-y-1 p-3 rounded-xl border shadow-2xs ${
                    theme === 'dark' ? 'bg-[#131B18] border-[#22352A]' : 'bg-white border-stone-100'
                  }`}>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#A08865]">
                      Metode Pembayaran
                    </span>
                    <span className={`block text-sm font-extrabold ${theme === 'dark' ? 'text-[#3EB87F]' : 'text-[#294834]'}`}>
                      HANYA GOPAY (GOPAY ONLY)
                    </span>
                    <span className="block text-[10px] text-stone-400">
                      Satu-satunya metode untuk pembayaran jasa
                    </span>
                  </div>

                  <div className={`text-[11px] italic ${theme === 'dark' ? 'text-[#8AA291]' : 'text-stone-500'}`}>
                    "Konfirmasi pembayaran instan memudahkan saya menjadwalkan sesi Anda dengan sangat cepat."
                    <span className={`block font-bold mt-1 ${theme === 'dark' ? 'text-stone-300' : 'text-stone-600'}`}>— Audia</span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* 8. FAQ Section */}
        <section id="faq-section" className={`py-16 px-4 max-w-4xl mx-auto rounded-3xl my-10 border transition-all ${
          theme === 'dark' ? 'bg-[#131B18] border-[#22352B]' : 'bg-white border-stone-200'
        }`}>
          <div className="text-center space-y-2 mb-10">
            <h3 className={`font-serif text-2xl sm:text-3xl font-bold ${
              theme === 'dark' ? 'text-[#EFF5EE]' : 'text-[#1E2522]'
            }`}>
              Sering Ditanyakan (FAQ)
            </h3>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-[#8EABA0]' : 'text-stone-500'}`}>
              Menjawab rasa penasaran Anda sebelum memulai sesi curhat bersama Audia.
            </p>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1411] border-[#1D2B22]' : 'bg-[#FCFAF7] border-stone-100'
            }`}>
              <h4 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-[#EFF5EE]' : 'text-stone-900'}`}>
                Apakah curhat ini benar-benar rahasia?
              </h4>
              <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
              }`}>
                Tentu saja, kami menjamin privasi aman 100%! Setelah sesi berakhir, semua pesan, riwayat chat, dan catatan kecil dari sesi curhat Anda akan langsung dihapus bersih secara manual.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1411] border-[#1D2B22]' : 'bg-[#FCFAF7] border-stone-100'
            }`}>
              <h4 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-[#EFF5EE]' : 'text-stone-900'}`}>
                Bagaimana teknis jalannya curhat?
              </h4>
              <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
              }`}>
                Begitu pembayaran diverifikasi, Audia akan mengundang Anda ke ruang obrolan tertutup di Telegram. Anda bebas memulai dengan tulisan chat ketik biasa, mengirim pesan suara, atau berdiskusi via Voice Call jika memesan kelipatan sesi.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-[#0E1411] border-[#1D2B22]' : 'bg-[#FCFAF7] border-stone-100'
            }`}>
              <h4 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-[#EFF5EE]' : 'text-stone-900'}`}>
                Mengapa hanya menerima pembayaran via GoPay?
              </h4>
              <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${
                theme === 'dark' ? 'text-[#8DA393]' : 'text-stone-600'
              }`}>
                GoPay adalah dompet digital berlisensi resmi yang pendaftarannya mudah, tanpa biaya admin berlebihan, serta memiliki waktu transfer seketika (real-time). Ini membantu meyakinkan kenyamanan dalam audit pencatatan kontribusi Anda.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* 9. Prominent Sticky / Floating Action Footer Bottom Bar */}
      <footer id="app-footer" className="bg-[#1E2721] text-stone-300 py-12 px-4 sm:px-8 border-t border-[#2F3A32]">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="grid md:grid-cols-12 gap-8 items-center border-b border-[#2F3A32] pb-10">
            
            {/* CTA Prompt */}
            <div className="md:col-span-8 space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                Bandingkan, Pilih, dan Bagikan Bebanmu Bebas Cemas.
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                Temukan ketenangan emosional Anda hari ini. Hubungi Audia di Telegram ke nomor resmi <span className="text-[#3FB86F] font-bold">+62 895-2581-7105</span>. Bersama curhatdy, tidak ada cerita yang terlalu berat untuk diringankan.
              </p>
            </div>

            {/* Pulsing Highlight Custom Direct Button Requested by user */}
            <div className="md:col-span-4 flex flex-col items-stretch sm:items-end justify-center">
              
              <a 
                id="direct-telegram-final-btn"
                href="https://t.me/+6289525817105"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#0088cc] hover:bg-[#0077a3] text-white font-bold text-sm sm:text-base py-4 px-6 rounded-2xl transition-all shadow-md active:scale-95 text-center cursor-pointer animate-pulse"
                style={{ animationDuration: '3s' }}
              >
                <Send className="w-5 h-5 text-white" />
                <span>Hubungi Audia Sekarang</span>
              </a>

              <span className="block text-[11px] text-stone-400 mt-2 text-center sm:text-right w-full">
                No Telegram: +62 895-2581-7105
              </span>

            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-stone-400">
            
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <span className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center text-white font-serif font-bold text-xs">
                c
              </span>
              <span>
                © 2026 <strong>curhatdy</strong>. Crafted for modern minimalist empathy & relief. All rights reserved.
              </span>
            </div>

            {/* Custom footer tag showing privacy assurance */}
            <div className="flex items-center gap-3">
              <span className="text-stone-500">Privasi Aman 100% Guaranteed</span>
              <span className="text-stone-500">|</span>
              <span className="text-stone-500">Pembayaran Eksklusif GoPay</span>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}
