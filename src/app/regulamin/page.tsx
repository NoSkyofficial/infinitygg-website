"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Edit, Eye, Bold, Italic, List, ListOrdered, Heading1, Heading2, AlertCircle } from 'lucide-react';
import LegalLayout from '../components/LegalLayout';

interface LegalSection {
  id: string;
  title: string;
  content: string | React.ReactNode;
  subsections?: LegalSection[];
}

export default function RegulaminPage() {
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContent, setEditingContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Load regulamin data
  useEffect(() => {
    loadRegulamin();
    
    // Check if edit mode was enabled from admin panel
    const editEnabled = sessionStorage.getItem('regulaminEditEnabled') === 'true';
    if (editEnabled) {
      setIsEditMode(true);
      sessionStorage.removeItem('regulaminEditEnabled');
    }
  }, []);
  
  const loadRegulamin = async () => {
    try {
      const response = await fetch('/api/regulamin');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Failed to load regulamin:', error);
    }
  };
  
  const handleStartEdit = () => {
    // Convert sections to HTML for editing
    const html = sectionsToHTML(sections);
    setEditingContent(html);
    setIsEditMode(true);
  };
  
  const handleCancelEdit = () => {
    if (hasChanges && !confirm('Masz niezapisane zmiany. Czy na pewno chcesz wyjść?')) {
      return;
    }
    setIsEditMode(false);
    setEditingContent('');
    setHasChanges(false);
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      const authToken = sessionStorage.getItem('adminAuthToken') || '';
      
      // Convert HTML back to sections structure
      const newSections = htmlToSections(editingContent);
      
      const response = await fetch('/api/regulamin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newSections)
      });
      
      if (response.ok) {
        setSections(newSections);
        setIsEditMode(false);
        setEditingContent('');
        setHasChanges(false);
        alert('Regulamin zapisany pomyślnie!');
      } else {
        alert('Błąd podczas zapisywania regulaminu');
      }
    } catch (error) {
      console.error('Failed to save regulamin:', error);
      alert('Błąd podczas zapisywania regulaminu');
    } finally {
      setSaving(false);
    }
  };
  
  const sectionsToHTML = (sections: LegalSection[]): string => {
    let html = '';
    
    sections.forEach((section, index) => {
      html += `<div class="section" data-id="${section.id}">`;
      html += `<h2 class="section-title">${index + 1}. ${section.title}</h2>`;
      html += `<div class="section-content">${typeof section.content === 'string' ? section.content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') : ''}</div>`;
      
      if (section.subsections && section.subsections.length > 0) {
        html += '<div class="subsections">';
        section.subsections.forEach((subsection, subIndex) => {
          html += `<div class="subsection" data-id="${subsection.id}">`;
          html += `<h3 class="subsection-title">${index + 1}.${subIndex + 1} ${subsection.title}</h3>`;
          html += `<div class="subsection-content">${typeof subsection.content === 'string' ? subsection.content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>') : ''}</div>`;
          html += '</div>';
        });
        html += '</div>';
      }
      
      html += '</div>';
    });
    
    return html;
  };
  
  const htmlToSections = (html: string): LegalSection[] => {
    // Simple parser - in production you'd want a more robust solution
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sectionElements = doc.querySelectorAll('.section');
    
    const sections: LegalSection[] = [];
    
    sectionElements.forEach((sectionEl) => {
      const id = sectionEl.getAttribute('data-id') || '';
      const titleEl = sectionEl.querySelector('.section-title');
      const contentEl = sectionEl.querySelector('.section-content');
      const subsectionsEl = sectionEl.querySelector('.subsections');
      
      const title = titleEl?.textContent?.replace(/^\d+\.\s*/, '') || '';
      const content = contentEl?.innerHTML || '';
      
      const section: LegalSection = {
        id,
        title,
        content: content.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').trim()
      };
      
      if (subsectionsEl) {
        const subsectionElements = subsectionsEl.querySelectorAll('.subsection');
        section.subsections = [];
        
        subsectionElements.forEach((subEl) => {
          const subId = subEl.getAttribute('data-id') || '';
          const subTitleEl = subEl.querySelector('.subsection-title');
          const subContentEl = subEl.querySelector('.subsection-content');
          
          const subTitle = subTitleEl?.textContent?.replace(/^\d+\.\d+\s*/, '') || '';
          const subContent = subContentEl?.innerHTML || '';
          
          section.subsections!.push({
            id: subId,
            title: subTitle,
            content: subContent.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n').trim()
          });
        });
      }
      
      sections.push(section);
    });
    
    return sections;
  };
  
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditingContent(editorRef.current.innerHTML);
      setHasChanges(true);
    }
  };
  
  if (isEditMode) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a]" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl" />
        </div>
        
        {/* Editor Header */}
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-[#26a69a]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Edit className="w-6 h-6 text-[#26a69a]" />
                <h1 className="text-2xl font-bold text-white">
                  Edytor Regulaminu
                </h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-[#26a69a]/20 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-lg transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Zapisywanie...' : 'Zapisz'}
                </button>
              </div>
            </div>
            
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-lg p-2">
              <button
                onClick={() => execCommand('bold')}
                className="p-2 hover:bg-[#26a69a]/20 rounded text-gray-300 hover:text-[#26a69a] transition-colors"
                title="Pogrubienie (Ctrl+B)"
              >
                <Bold className="w-5 h-5" />
              </button>
              <button
                onClick={() => execCommand('italic')}
                className="p-2 hover:bg-[#26a69a]/20 rounded text-gray-300 hover:text-[#26a69a] transition-colors"
                title="Kursywa (Ctrl+I)"
              >
                <Italic className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-[#26a69a]/20" />
              <button
                onClick={() => execCommand('formatBlock', '<h2>')}
                className="p-2 hover:bg-[#26a69a]/20 rounded text-gray-300 hover:text-[#26a69a] transition-colors"
                title="Nagłówek 2"
              >
                <Heading1 className="w-5 h-5" />
              </button>
              <button
                onClick={() => execCommand('formatBlock', '<h3>')}
                className="p-2 hover:bg-[#26a69a]/20 rounded text-gray-300 hover:text-[#26a69a] transition-colors"
                title="Nagłówek 3"
              >
                <Heading2 className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-[#26a69a]/20" />
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 hover:bg-[#26a69a]/20 rounded text-gray-300 hover:text-[#26a69a] transition-colors"
                title="Lista wypunktowana"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 hover:bg-[#26a69a]/20 rounded text-gray-300 hover:text-[#26a69a] transition-colors"
                title="Lista numerowana"
              >
                <ListOrdered className="w-5 h-5" />
              </button>
              <div className="flex-1" />
              {hasChanges && (
                <div className="flex items-center space-x-2 text-yellow-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Niezapisane zmiany</span>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Editor Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-900/80 backdrop-blur-md border border-[#26a69a]/30 rounded-2xl p-8 shadow-xl">
            <div
              ref={editorRef}
              contentEditable
              className="prose prose-invert max-w-none min-h-[600px] focus:outline-none"
              dangerouslySetInnerHTML={{ __html: editingContent }}
              onInput={(e) => {
                setEditingContent(e.currentTarget.innerHTML);
                setHasChanges(true);
              }}
              style={{
                color: '#e5e7eb',
                lineHeight: '1.75'
              }}
            />
          </div>
          
          <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-1">Wskazówki edycji:</p>
                <ul className="space-y-1 text-blue-300/80">
                  <li>• Użyj paska narzędzi aby formatować tekst</li>
                  <li>• Zachowaj strukturę sekcji i podsekcji</li>
                  <li>• Pamiętaj o zapisaniu zmian przed wyjściem</li>
                  <li>• Edytuj ostrożnie - zmiany będą widoczne dla wszystkich użytkowników</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx global>{`
          .prose h2 {
            color: #26a69a;
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          
          .prose h3 {
            color: #26a69a;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .prose p {
            margin-bottom: 1rem;
            color: #d1d5db;
          }
          
          .prose ul, .prose ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            color: #d1d5db;
          }
          
          .prose li {
            margin-bottom: 0.5rem;
          }
          
          .prose strong {
            color: #26a69a;
            font-weight: 600;
          }
          
          .prose em {
            color: #9ca3af;
          }
          
          .section, .subsection {
            margin-bottom: 2rem;
          }
          
          .section-title, .subsection-title {
            color: #26a69a !important;
          }
          
          .subsections {
            margin-left: 2rem;
            margin-top: 1rem;
          }
        `}</style>
      </div>
    );
  }
  
  // Normal view
  return <LegalLayout title="Regulamin" lastUpdated="21 października 2024" sections={sections} />;
}
