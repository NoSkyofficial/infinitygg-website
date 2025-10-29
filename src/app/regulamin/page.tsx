"use client";

import React, { useState, useEffect } from 'react';
import LegalLayout from '../components/LegalLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import FloatingEditButton from '@/components/FloatingEditButton';

interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSection[];
}

interface RegulationData {
  content: string;
  version: number;
  updatedAt: string;
  updatedBy: string;
  comment?: string;
}

// Funkcja parsująca HTML na strukturę sekcji
function parseHtmlToSections(html: string): LegalSection[] {
  if (!html || html.trim() === '') {
    return [
      {
        id: 'empty',
        title: 'Regulamin niedostępny',
        content: 'Regulamin jest obecnie w trakcie przygotowania. Prosimy sprawdzić później.',
      },
    ];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: LegalSection[] = [];

  // Znajdujemy wszystkie główne nagłówki (h1, h2)
  const mainHeadings = doc.querySelectorAll('h1, h2');
  
  mainHeadings.forEach((heading, index) => {
    const section: LegalSection = {
      id: `section-${index + 1}`,
      title: heading.textContent || `Sekcja ${index + 1}`,
      content: '',
      subsections: [],
    };

    // Zbieramy zawartość między tym a następnym nagłówkiem
    let currentElement = heading.nextElementSibling;
    let contentHtml = '';
    const subsections: LegalSection[] = [];
    let subsectionIndex = 0;

    while (currentElement && !['H1', 'H2'].includes(currentElement.tagName)) {
      // Jeśli to h3, tworzymy podsekcję
      if (currentElement.tagName === 'H3') {
        // Zapisz poprzednią zawartość jako główną treść sekcji
        if (contentHtml && subsections.length === 0) {
          section.content = <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
          contentHtml = '';
        }

        // Utwórz nową podsekcję
        const subsection: LegalSection = {
          id: `section-${index + 1}-${subsectionIndex + 1}`,
          title: currentElement.textContent || `Podsekcja ${subsectionIndex + 1}`,
          content: '',
        };

        // Zbierz zawartość podsekcji
        let subsectionContent = '';
        currentElement = currentElement.nextElementSibling;

        while (currentElement && !['H1', 'H2', 'H3'].includes(currentElement.tagName)) {
          subsectionContent += currentElement.outerHTML;
          currentElement = currentElement.nextElementSibling;
        }

        subsection.content = <div dangerouslySetInnerHTML={{ __html: subsectionContent }} />;
        subsections.push(subsection);
        subsectionIndex++;
        continue;
      }

      contentHtml += currentElement.outerHTML;
      currentElement = currentElement.nextElementSibling;
    }

    // Jeśli nie ma podsekcji, cała zawartość idzie do głównej treści
    if (subsections.length === 0 && contentHtml) {
      section.content = <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
    } else if (subsections.length > 0) {
      section.subsections = subsections;
      // Jeśli jest jeszcze jakaś zawartość po podsekcjach
      if (contentHtml) {
        section.content = <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
      }
    }

    // Jeśli sekcja nie ma ani contentu ani podsekcji, dodaj pustą zawartość
    if (!section.content && (!section.subsections || section.subsections.length === 0)) {
      section.content = '';
    }

    sections.push(section);
  });

  // Jeśli nie znaleziono żadnych nagłówków, pokaż cały HTML jako jedną sekcję
  if (sections.length === 0) {
    return [
      {
        id: 'main',
        title: 'Regulamin',
        content: <div dangerouslySetInnerHTML={{ __html: html }} />,
      },
    ];
  }

  return sections;
}

export default function RegulaminPage() {
  const [regulation, setRegulation] = useState<RegulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRegulation();
  }, []);

  const loadRegulation = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/regulations/public');
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać regulaminu');
      }

      const data = await response.json();
      setRegulation(data);
    } catch (err) {
      console.error('Error loading regulation:', err);
      setError('Nie udało się załadować regulaminu. Spróbuj ponownie później.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Ładowanie regulaminu..." />
      </div>
    );
  }

  if (error || !regulation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Błąd</h2>
          <p className="text-gray-400 mb-6">
            {error || 'Nie udało się załadować regulaminu'}
          </p>
          <button
            onClick={loadRegulation}
            className="px-6 py-3 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  const sections = parseHtmlToSections(regulation.content);
  const lastUpdated = new Date(regulation.updatedAt).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <LegalLayout
        title="Regulamin"
        lastUpdated={lastUpdated}
        sections={sections}
      />
      <FloatingEditButton />
    </>
  );
}