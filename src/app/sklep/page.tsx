"use client";

import React, { useEffect, useState } from 'react';
import { ExternalLink, ShoppingBag, Sparkles, Shield, Zap } from 'lucide-react';

export default function SklepPage() {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = 'https://infinitygg.tebex.io';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleRedirect = () => {
    window.location.href = 'https://infinitygg.tebex.io';
  };
  
  const features = [
    {
      icon: Sparkles,
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a ultricies magna.'
    },
    {
      icon: Zap,
      title: 'Lorem Ipsum',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a ultricies magna.'
    },
    {
      icon: Shield,
      title: 'Bezpieczne płatności',
      description: 'Wszystkie transakcje zabezpieczone przez Tebex'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#26a69a]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>
      
      <div className="h-16" />
      
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <div className="relative bg-gray-900/80 backdrop-blur-md border border-[#26a69a]/30 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#26a69a]/5 to-transparent animate-pulse" />
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#26a69a] to-[#00897b] rounded-2xl mb-6 shadow-lg shadow-[#26a69a]/30 animate-bounce" style={{ animationDuration: '2s' }}>
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Sklep <span className="text-[#26a69a]">InfinityGG</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Wesprzyj rozwój serwera.
              </p>
              
              <div className="mb-8">
                <div className="inline-block bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/30 rounded-xl px-6 py-3">
                  <p className="text-gray-400 text-sm mb-1">Przekierowanie za</p>
                  <p className="text-4xl font-bold text-[#26a69a] tabular-nums">{countdown}</p>
                </div>
              </div>
              
              <button
                onClick={handleRedirect}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white text-lg font-semibold rounded-xl transition-all shadow-lg shadow-[#26a69a]/30 hover:shadow-[#26a69a]/50 hover:scale-105 mb-12"
              >
                Przejdź do sklepu teraz
                <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6 hover:border-[#26a69a]/40 transition-all"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-[#26a69a]/20 to-[#00897b]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <feature.icon className="w-6 h-6 text-[#26a69a]" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-[#26a69a]/20">
                <p className="text-gray-500 text-sm">
                  💳 Bezpieczne płatności przez <span className="text-[#26a69a]">Tebex</span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  ❓ Pytania? Napisz do nas na{' '}
                  <a href="https://discord.gg/infinitygg" className="text-[#26a69a] hover:text-[#00897b] transition-colors">
                    Discord
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/"
              className="text-gray-400 hover:text-[#26a69a] transition-colors text-sm"
            >
              ← Powrót na stronę główną
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}