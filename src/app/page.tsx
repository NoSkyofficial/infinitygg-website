"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChevronDown, Menu, X, Users, ExternalLink, Twitter, Youtube, MessageCircle, Clock, Server, Zap, Shield, TrendingUp } from 'lucide-react';
import { SiDiscord } from "react-icons/si";
import AdminPanel from './components/AdminPanel';

// ==================== TYPES ====================
export interface SiteConfig {
  showProgressBar: boolean;
  progressValue: number;
  progressLabel: string;
  showStatus: boolean;
  showFAQ: boolean;
  showShopRedirect: boolean;
  showBetaBadge: boolean;
  heroTitle: string;
  heroLead: string;
  faqs: FAQ[];
  socialLinks: {
    discord: boolean;
    twitter: boolean;
    youtube: boolean;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface ServerStatus {
  playersOnline: number;
  maxPlayers: number;
  queue: number;
  status: 'online' | 'offline' | 'full';
}

// ==================== CONTEXT ====================
const ConfigContext = createContext<{
  config: SiteConfig;
  updateConfig: (config: SiteConfig) => Promise<void>;
  regulaminEditEnabled: boolean;
  setRegulaminEditEnabled: (enabled: boolean) => void;
}>({
  config: {
    showProgressBar: true,
    progressValue: 65,
    progressLabel: 'Etap beta',
    showStatus: true,
    showFAQ: true,
    showShopRedirect: true,
    showBetaBadge: true,
    heroTitle: 'Witaj na InfinityGG',
    heroLead: '',
    faqs: [],
    socialLinks: { discord: true, twitter: true, youtube: true }
  },
  updateConfig: async () => {},
  regulaminEditEnabled: false,
  setRegulaminEditEnabled: () => {}
});

// ==================== STATUS SERVICE ====================
class StatusService {
  private static pollingInterval: NodeJS.Timeout | null = null;
  
  static async fetchStatus(): Promise<ServerStatus> {
    return {
      playersOnline: Math.floor(Math.random() * 200) + 50,
      maxPlayers: 256,
      queue: Math.floor(Math.random() * 10),
      status: 'online'
    };
  }
  
  static startPolling(callback: (status: ServerStatus) => void, intervalMs = 15000) {
    this.stopPolling();
    
    const poll = async () => {
      try {
        const status = await this.fetchStatus();
        callback(status);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };
    
    poll();
    this.pollingInterval = setInterval(poll, intervalMs);
  }
  
  static stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

// ==================== ANIMATED BACKGROUND ====================
const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a] animate-gradient" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#26a69a]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#26a69a05_1px,transparent_1px),linear-gradient(to_bottom,#26a69a05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    </div>
  );
};

// ==================== COMPONENTS ====================

// Header Component
const Header: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { config } = useContext(ConfigContext);
  
  useEffect(() => {
    if (config.showStatus) {
      StatusService.startPolling(setServerStatus);
      return () => StatusService.stopPolling();
    }
  }, [config.showStatus]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const socialIcons = [
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.gg/infinitygg', enabled: config.socialLinks.discord },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/infinitygg', enabled: config.socialLinks.twitter },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@infinitygg', enabled: config.socialLinks.youtube }
  ];
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-[#26a69a]/20 shadow-lg shadow-[#26a69a]/5' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={onAdminClick}
              className="flex items-center space-x-3 group"
            >
              <img 
                src="/logo.png" 
                alt="InfinityGG Logo" 
                className="w-10 h-10 rounded-lg group-hover:scale-110 transition-transform"
              />
              <span className="text-xl font-bold text-white group-hover:text-[#26a69a] transition-colors">
                InfinityGG
              </span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-[#26a69a] transition-colors relative group">
              Strona Główna
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#26a69a] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="/regulamin" className="text-gray-300 hover:text-[#26a69a] transition-colors relative group">
              Regulamin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#26a69a] group-hover:w-full transition-all duration-300" />
            </a>
            <a href="/wip" className="text-gray-300 hover:text-[#26a69a] transition-colors relative group">
              Whitelist
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#26a69a] group-hover:w-full transition-all duration-300" />
            </a>
            {config.showShopRedirect && (
              <a href="/sklep" className="text-gray-300 hover:text-[#26a69a] transition-colors relative group">
                Sklep
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#26a69a] group-hover:w-full transition-all duration-300" />
              </a>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {config.showStatus && serverStatus && (
              <div className="flex items-center space-x-2 text-sm bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/20 px-4 py-2 rounded-full hover:border-[#26a69a]/40 transition-all group">
                <div className="w-2 h-2 rounded-full bg-[#26a69a] animate-pulse" />
                <Users className="w-4 h-4 text-[#26a69a]" />
                <span className="text-white font-semibold">{serverStatus.playersOnline}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">{serverStatus.maxPlayers}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {socialIcons.filter(s => s.enabled).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#26a69a] transition-all p-2 hover:bg-[#26a69a]/10 rounded-lg"
                  title={social.name}
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-[#26a69a] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-[#26a69a]/20">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
              Strona Główna
            </a>
            <a href="/regulamin" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
              Regulamin
            </a>
            {config.showShopRedirect && (
              <a href="/sklep" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
                Sklep
              </a>
            )}
            
            <div className="flex items-center space-x-3 pt-3 border-t border-[#26a69a]/20">
              {socialIcons.filter(s => s.enabled).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#26a69a] transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Progress Bar Component
const ProgressBar: React.FC = () => {
  const { config } = useContext(ConfigContext);
  
  if (!config.showProgressBar) return null;
  
  return (
    <div className="sticky top-16 z-40 bg-gray-900/50 backdrop-blur-sm border-b border-[#26a69a]/20 py-4 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#26a69a]/5 to-transparent animate-shimmer" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#26a69a] animate-pulse" />
            <span className="text-sm font-semibold text-[#26a69a]">{config.progressLabel}</span>
          </div>
          <span className="text-sm font-bold text-[#26a69a] tabular-nums">{config.progressValue}%</span>
        </div>
        
        <div className="relative w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-[#26a69a]/20 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div
            className="relative h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${config.progressValue}%`,
              background: 'linear-gradient(90deg, #26a69a 0%, #00897b 50%, #26a69a 100%)',
              boxShadow: '0 0 20px rgba(38, 166, 154, 0.5), inset 0 1px 1px rgba(255,255,255,0.3)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#26a69a]/50 to-transparent animate-pulse" />
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-2 text-center">
          Trwają intensywne prace nad serwerem
        </p>
      </div>
    </div>
  );
};

// Hero Section
const Hero: React.FC = () => {
  const { config } = useContext(ConfigContext);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 px-4 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.5s ease-out'
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#26a69a15_1px,transparent_1px),linear-gradient(to_bottom,#26a69a15_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {config.showBetaBadge && (
          <div className="inline-flex items-center space-x-2 bg-[#26a69a]/10 border border-[#26a69a]/30 rounded-full px-4 py-2 mb-8 backdrop-blur-sm animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-[#26a69a] animate-pulse" />
            <span className="text-[#26a69a] text-sm font-medium">Serwer BETA dostępny już teraz</span>
          </div>
        )}
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          {config.heroTitle.split(' ').map((word, i) => (
            <span 
              key={i}
              className="inline-block hover:text-[#26a69a] transition-colors cursor-default mr-3"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {word}
            </span>
          ))}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {config.heroLead}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="https://discord.gg/infinitygg"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#26a69a]/30 hover:shadow-[#26a69a]/50 hover:scale-105"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#26a69a] to-[#00897b] opacity-0 group-hover:opacity-100 blur transition-opacity" />
            <SiDiscord className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Dołącz na Discord</span>
          </a>
          
          <a
            href="#info"
            className="group inline-flex items-center justify-center px-8 py-4 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm border border-[#26a69a]/30 hover:border-[#26a69a]/50 text-white font-semibold rounded-xl transition-all hover:scale-105"
          >
            Dowiedz się więcej
            <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Value Cards
const ValueCards: React.FC = () => {
  const cards = [
    {
      icon: Server,
      title: 'Stabilność',
      description: 'Nowoczesna infrastruktura zapewniająca płynną rozgrywkę bez lagów i rozłączeń.',
      color: 'from-[#26a69a] to-[#00897b]'
    },
    {
      icon: Users,
      title: 'Społeczność',
      description: 'Aktywna i przyjazna społeczność graczy, którzy tworzą niezapomniane historie RP.',
      color: 'from-[#26a69a] to-[#1a8f84]'
    },
    {
      icon: TrendingUp,
      title: 'Rozwój',
      description: 'Ciągły rozwój serwera, nowe funkcje i regularne aktualizacje zawartości.',
      color: 'from-[#00897b] to-[#26a69a]'
    }
  ];
  
  return (
    <section id="info" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Dlaczego <span className="text-[#26a69a]">InfinityGG</span>?
          </h2>
          <p className="text-gray-400 text-lg">Poznaj powody, dla których gracze wybierają nasz serwer</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-8 hover:border-[#26a69a]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#26a69a]/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#26a69a]/0 to-[#26a69a]/0 group-hover:from-[#26a69a]/5 group-hover:to-transparent transition-all duration-300" />
              
              <div className={`relative w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                <card.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#26a69a] transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Accordion
const FAQAccordion: React.FC = () => {
  const { config } = useContext(ConfigContext);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  if (!config.showFAQ || config.faqs.length === 0) return null;
  
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chcesz wiedzieć <span className="text-[#26a69a]">więcej</span>?
          </h2>
          <p className="text-gray-400 text-lg">Najczęściej zadawane pytania</p>
        </div>
        
        <div className="space-y-4">
          {config.faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="group bg-gray-900/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl overflow-hidden hover:border-[#26a69a]/40 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#26a69a]/5 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-white group-hover:text-[#26a69a] transition-colors pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#26a69a] transition-all flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-5 border-t border-[#26a69a]/20 bg-gray-900/30">
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gray-900/80 backdrop-blur-sm border-t border-[#26a69a]/20 py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              InfinityGG
            </h3>
            <p className="text-gray-400 text-sm">
              InfinityGG to serwer RP GTA V, gdzie liczy się historia Twojej postaci, stabilna rozgrywka i kultura RP.​ Dołącz i sprawdź, dokąd zaprowadzi Cię ta historia.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Społeczność</h3>
            <div className="space-y-2">
              <a href="https://discord.gg/infinitygg" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                Discord
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Dokumenty</h3>
            <div className="space-y-2">
              <a href="/regulamin" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                Regulamin
              </a>
              <a href="/tos" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                Terms of Service
              </a>
              <a href="/privacy" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#26a69a]/20 pt-8 space-y-3">
          <p className="text-gray-500 text-xs text-center">
            InfinityGG IS NOT APPROVED, SPONSORED OR ENDORSED BY ROCKSTAR GAMES.
          </p>
          <p className="text-gray-500 text-xs text-center">
            InfinityGG NIE JEST AUTORYZOWANE, SPONSOROWANE ANI WSPIERANE PRZEZ ROCKSTAR GAMES.
          </p>
          <p className="text-gray-400 text-sm text-center mt-4">
            © {year} InfinityGG. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main App
export default function InfinityGGWebsite() {
  const [config, setConfig] = useState<SiteConfig>({
    showProgressBar: true,
    progressValue: 65,
    progressLabel: 'Etap beta',
    showStatus: true,
    showFAQ: true,
    showShopRedirect: true,
    showBetaBadge: true,
    heroTitle: 'Witaj na InfinityGG',
    heroLead: '',
    faqs: [],
    socialLinks: { discord: true, twitter: true, youtube: true }
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [regulaminEditEnabled, setRegulaminEditEnabled] = useState(false);
  const [authToken, setAuthToken] = useState('');
  
  useEffect(() => {
    // Load config from API on mount
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Failed to load config:', err));
      
    // Check if regulamin edit was enabled
    const editEnabled = sessionStorage.getItem('regulaminEditEnabled') === 'true';
    const token = sessionStorage.getItem('adminAuthToken') || '';
    setRegulaminEditEnabled(editEnabled);
    setAuthToken(token);
  }, []);
  
  const updateConfig = async (newConfig: SiteConfig) => {
    const token = authToken || sessionStorage.getItem('adminAuthToken') || '';
    
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newConfig)
    });
    
    if (response.ok) {
      setConfig(newConfig);
    } else {
      throw new Error('Failed to save config');
    }
  };
  
  const enableRegulaminEdit = () => {
    const token = authToken || sessionStorage.getItem('adminAuthToken') || ADMIN_PASS_HASH;
    sessionStorage.setItem('regulaminEditEnabled', 'true');
    sessionStorage.setItem('adminAuthToken', token);
    setRegulaminEditEnabled(true);
    setAuthToken(token);
  };
  
  return (
    <ConfigContext.Provider value={{ config, updateConfig, regulaminEditEnabled, setRegulaminEditEnabled }}>
      <div className="min-h-screen">
        <AnimatedBackground />
        <Header onAdminClick={() => setShowAdmin(true)} />
        <ProgressBar />
        <Hero />
        <ValueCards />
        <FAQAccordion />
        <Footer />
        
        {showAdmin && (
          <AdminPanel 
            config={config} 
            updateConfig={updateConfig}
            onClose={() => setShowAdmin(false)} 
            onEnableRegulaminEdit={enableRegulaminEdit}
          />
        )}
        
        <style jsx global>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
          }
          
          .animate-shimmer {
            animation: shimmer 3s infinite;
          }
          
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }
        `}</style>
      </div>
    </ConfigContext.Provider>
  );
}

const ADMIN_PASS_HASH = process.env.NEXT_PUBLIC_ADMIN_PASS_HASH || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
