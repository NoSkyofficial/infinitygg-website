"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowUp, Home, Menu, X, Users, MessageCircle, Twitter, Youtube } from 'lucide-react';

interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSection[];
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

const LegalHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-[#26a69a]/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center space-x-3 group">
            <img 
              src="/logo.png" 
              alt="InfinityGG Logo" 
              className="w-10 h-10 rounded-lg group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-bold text-white group-hover:text-[#26a69a] transition-colors">
              Infinity<span className="text-[#26a69a]">GG</span>
            </span>
          </a>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-[#26a69a] transition-colors">
              Strona Główna
            </a>
            <a href="/wip" className="text-gray-300 hover:text-[#26a69a] transition-colors">
              Regulamin
            </a>
            <a href="/tos" className="text-gray-300 hover:text-[#26a69a] transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-gray-300 hover:text-[#26a69a] transition-colors">
              Privacy Policy
            </a>
          </div>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-[#26a69a] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-[#26a69a]/20">
          <div className="px-4 py-4 space-y-3">
            <a href="/" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
              Strona Główna
            </a>
            <a href="/regulamin" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
              Regulamin
            </a>
            <a href="/tos" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
              Terms of Service
            </a>
            <a href="/privacy" className="block text-gray-300 hover:text-[#26a69a] transition-colors py-2">
              Privacy Policy
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

const LegalFooter: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-[#26a69a]/20 py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              <span className="text-[#26a69a]">Infinity</span>GG
            </h3>
            <p className="text-gray-400 text-sm">
              Najlepszy serwer GTA V RolePlay w Polsce.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Społeczność</h3>
            <div className="space-y-2">
              <a href="https://discord.gg/infinitygg" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                Discord
              </a>
              <a href="https://twitter.com/infinitygg" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                Twitter
              </a>
              <a href="https://youtube.com/@infinitygg" className="block text-gray-400 hover:text-[#26a69a] text-sm transition-colors">
                YouTube
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

const TableOfContents: React.FC<{ sections: LegalSection[]; activeId: string }> = ({ sections, activeId }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <nav className="sticky top-24 bg-gray-900/80 backdrop-blur-md border border-[#26a69a]/30 rounded-2xl p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-[#26a69a] mb-4">Spis treści</h2>
      <ul className="space-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`text-left w-full hover:text-[#26a69a] transition-colors flex items-start group ${
                activeId === section.id ? 'text-[#26a69a] font-medium' : 'text-gray-400'
              }`}
            >
              <span className="mr-2 mt-1">{index + 1}.</span>
              <span className="flex-1">{section.title}</span>
            </button>
            
            {section.subsections && section.subsections.length > 0 && (
              <ul className="ml-6 mt-2 space-y-1.5">
                {section.subsections.map((subsection, subIndex) => (
                  <li key={subsection.id}>
                    <button
                      onClick={() => scrollToSection(subsection.id)}
                      className={`text-sm text-left w-full hover:text-[#26a69a] transition-colors flex items-start ${
                        activeId === subsection.id ? 'text-[#26a69a] font-medium' : 'text-gray-500'
                      }`}
                    >
                      <span className="mr-2">{index + 1}.{subIndex + 1}</span>
                      <span className="flex-1">{subsection.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Breadcrumbs: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
      <a href="/" className="hover:text-[#26a69a] transition-colors flex items-center">
        <Home className="w-4 h-4 mr-1" />
        Strona główna
      </a>
      <ChevronRight className="w-4 h-4" />
      <span className="text-[#26a69a]">{pageName}</span>
    </nav>
  );
};

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white p-3 rounded-full shadow-lg shadow-[#26a69a]/30 transition-all z-40 hover:scale-110"
          aria-label="Wróć na górę"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default function LegalLayout({ title, lastUpdated, sections }: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );
    
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
      
      section.subsections?.forEach((subsection) => {
        const subElement = document.getElementById(subsection.id);
        if (subElement) observer.observe(subElement);
      });
    });
    
    return () => observer.disconnect();
  }, [sections]);
  
  const renderContent = (content: string | React.ReactNode) => {
    if (typeof content === 'string') {
      return content.split('\n\n').map((paragraph, index) => (
        paragraph.trim() && (
          <p key={index} className="text-gray-300 leading-relaxed mb-4">
            {paragraph}
          </p>
        )
      ));
    }
    return content;
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl" />
      </div>
      
      <LegalHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs pageName={title} />
        
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          <aside className="hidden lg:block">
            <TableOfContents sections={sections} activeId={activeSection} />
          </aside>
          
          <main className="bg-gray-900/80 backdrop-blur-md border border-[#26a69a]/30 rounded-2xl p-8 lg:p-12 shadow-xl">
            <header className="mb-12 pb-8 border-b border-[#26a69a]/30">
              <h1 className="text-4xl font-bold text-white mb-4">
                <span className="text-[#26a69a]">{title}</span>
              </h1>
              <p className="text-gray-400">
                Ostatnia aktualizacja: <time className="text-[#26a69a]">{lastUpdated}</time>
              </p>
            </header>
            
            <div className="space-y-12">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-start group">
                    <span className="text-[#26a69a] mr-3">{index + 1}.</span>
                    <span className="group-hover:text-[#26a69a] transition-colors">{section.title}</span>
                  </h2>
                  
                  <div className="ml-8">
                    {renderContent(section.content)}
                  </div>
                  
                  {section.subsections && section.subsections.length > 0 && (
                    <div className="mt-8 space-y-8">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subsection.id} id={subsection.id} className="ml-8 scroll-mt-24">
                          <h3 className="text-xl font-semibold text-white mb-4 flex items-start group">
                            <span className="text-[#26a69a] mr-2">{index + 1}.{subIndex + 1}</span>
                            <span className="group-hover:text-[#26a69a] transition-colors">{subsection.title}</span>
                          </h3>
                          
                          <div className="ml-8">
                            {renderContent(subsection.content)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
            
            <footer className="mt-16 pt-8 border-t border-[#26a69a]/30">
              <p className="text-gray-400 text-sm">
                W razie pytań, skontaktuj się z nami przez{' '}
                <a href="https://discord.gg/infinitygg" className="text-[#26a69a] hover:text-[#00897b] transition-colors">
                  Discord
                </a>
                .
              </p>
            </footer>
          </main>
        </div>
      </div>
      
      <LegalFooter />
      <BackToTop />
    </div>
  );
}