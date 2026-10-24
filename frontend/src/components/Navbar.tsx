import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, Home, Globe, ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import type { QuechuaDialect } from '../types';
import { QUECHUA_BRANCHES, getVariantInfo } from '../constants/dialects';

interface Props {
  currentDialect: QuechuaDialect;
  onSelectDialect: (d: QuechuaDialect) => void;
  primaryLang: 'qu' | 'es';
  onSelectPrimaryLang: (l: 'qu' | 'es') => void;
  activePage?: 'inicio' | 'asistente' | 'preguntas' | 'nosotros' | 'fuentes';
}

export const Navbar: React.FC<Props> = ({
  currentDialect,
  onSelectDialect,
  primaryLang,
  onSelectPrimaryLang,
  activePage
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  // Determinar página activa según ruta si no viene explícita
  const current = activePage || (() => {
    if (location.pathname === '/') return 'inicio';
    if (location.pathname === '/assistant') return 'asistente';
    if (location.pathname === '/sources') return 'fuentes';
    if (location.pathname === '/admin') return 'nosotros';
    return 'inicio';
  })();

  const FAQ_LIST = [
    {
      qu: "Policiakunam hap'irqawan, ¿imatan rurayman?",
      es: "¿Qué derechos tengo si la policía me detiene en comisaría?",
      desc: "Tienes derecho a guardar silencio, a que te asignen un intérprete oficial en tu lengua quechua y a un defensor público gratuito (Art. 71 CPP)."
    },
    {
      qu: "Qosaymi maqwawan wasiypi, ¿maytan risaq yanapakuy mañakuq?",
      es: "¿Cómo solicitar medidas de protección inmediata frente a violencia familiar?",
      desc: "Puedes denunciar sin costo y sin necesidad de abogado en la comisaría o juzgado. El juez debe dictar medidas de protección en 24 a 72 horas (Ley 30364)."
    },
    {
      qu: "Taripaqpa (juez) ñawpaqenpi, ¿quechua simiypichu rimayman?",
      es: "¿Tengo derecho a que el juicio o audiencia sea en mi idioma?",
      desc: "Sí. La Constitución (Art. 2 inc. 19) y el Código Procesal Penal garantizan el uso de tu propio idioma y auxilio de intérprete oficial gratuito."
    }
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* 1. Logotipo Oficial Yachay Legal AI */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-12 h-12 flex items-center justify-center text-[#6B1D33] group-hover:scale-105 transition-transform">
              <Scale className="w-9 h-9 stroke-[1.8]" />
            </div>
            <div>
              <div className="font-serif-title font-bold text-2xl text-[#6B1D33] tracking-tight leading-none">
                Yachay Legal AI
              </div>
              <div className="text-[12px] text-[#7A8290] font-medium tracking-wide mt-1">
                Tu derecho, en tu idioma
              </div>
            </div>
          </div>

          {/* 2. Barra de Navegación Central */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-[14px] font-semibold text-[#5B616E]">
            {/* Inicio */}
            <button 
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 relative py-2 transition-colors ${
                current === 'inicio' ? 'text-[#6B1D33]' : 'hover:text-[#6B1D33]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
              {current === 'inicio' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6B1D33] rounded-full" />
              )}
            </button>

            {/* Asistente */}
            <button 
              onClick={() => navigate('/assistant')}
              className={`flex items-center gap-1.5 relative py-2 transition-colors ${
                current === 'asistente' ? 'text-[#6B1D33]' : 'hover:text-[#6B1D33]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Asistente Jurídico</span>
              {current === 'asistente' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6B1D33] rounded-full" />
              )}
            </button>

            {/* Preguntas frecuentes */}
            <button 
              onClick={() => setShowFaqModal(true)}
              className={`relative py-2 transition-colors ${
                current === 'preguntas' ? 'text-[#6B1D33]' : 'hover:text-[#6B1D33]'
              }`}
            >
              <span>Preguntas frecuentes</span>
              {current === 'preguntas' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6B1D33] rounded-full" />
              )}
            </button>

            {/* Sobre nosotros / Métricas */}
            <button 
              onClick={() => navigate('/admin')}
              className={`relative py-2 transition-colors ${
                current === 'nosotros' ? 'text-[#6B1D33]' : 'hover:text-[#6B1D33]'
              }`}
            >
              <span>Sobre nosotros</span>
              {current === 'nosotros' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6B1D33] rounded-full" />
              )}
            </button>

            {/* Fuentes legales */}
            <button 
              onClick={() => navigate('/sources')}
              className={`relative py-2 transition-colors ${
                current === 'fuentes' ? 'text-[#6B1D33]' : 'hover:text-[#6B1D33]'
              }`}
            >
              <span>Fuentes legales</span>
              {current === 'fuentes' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#6B1D33] rounded-full" />
              )}
            </button>
          </nav>

          {/* 3. Selector de Idioma en Píldora */}
          {/* 3. Selector de Idioma en Píldora */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white hover:border-[#6B1D33]/40 text-xs font-semibold text-[#3E434D] transition-all shadow-xs"
              title="Cambiar idioma o variante dialectal"
            >
              <Globe className="w-4 h-4 text-[#6B1D33]" />
              <span>
                {primaryLang === 'qu'
                  ? `Quechua · ${getVariantInfo(currentDialect)?.label.split('(')[0].trim() || 'Sureño'}`
                  : 'Español (Perú)'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl py-2.5 z-50 text-xs">
                <div className="px-3.5 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Idioma de Consulta
                </div>
                <div className="px-2 space-y-1 my-1">
                  <button
                    onClick={() => {
                      onSelectPrimaryLang('es');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
                      primaryLang === 'es' ? 'text-[#6B1D33] font-bold bg-[#FDF2F4] border border-[#6B1D33]/20' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">Español (Perú)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Sin variante dialectal quechua</div>
                    </div>
                    {primaryLang === 'es' && <span className="text-[#6B1D33] font-bold">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      onSelectPrimaryLang('qu');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
                      primaryLang === 'qu' ? 'text-[#6B1D33] font-bold bg-[#FDF2F4] border border-[#6B1D33]/20' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">Quechua (Runasimi)</div>
                      <div className="text-[10px] text-slate-500 font-normal">Permite seleccionar entre las 4 ramas del Perú</div>
                    </div>
                    {primaryLang === 'qu' && <span className="text-[#6B1D33] font-bold">✓</span>}
                  </button>
                </div>

                <div className="border-t border-slate-100 my-2" />

                <div className="px-3.5 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider flex items-center justify-between">
                  <span>Variantes del Quechua</span>
                  {primaryLang === 'qu' && <span className="text-[9px] text-[#6B1D33] font-semibold">4 Ramas del Perú</span>}
                </div>

                {/* Regla: Si está seleccionado Español, NO se permite elegir variante */}
                {primaryLang === 'es' ? (
                  <div className="mx-3 my-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                    <p className="font-semibold text-slate-600 mb-0.5">🔒 No aplica en Español</p>
                    <p className="text-[10px] text-slate-400">
                      Para elegir entre Quechua Sureño, Central, Norteño o Amazónico, primero selecciona <strong>Quechua (Runasimi)</strong> como idioma arriba.
                    </p>
                  </div>
                ) : (
                  <div className="px-2 space-y-3 mt-1.5">
                    {QUECHUA_BRANCHES.map(branch => (
                      <div key={branch.id} className="rounded-xl border border-slate-100 p-2 bg-[#FBFBFC]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[11px] text-[#6B1D33]">{branch.label}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600 font-medium">
                            {branch.regions[0]}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-1.5 line-clamp-1">{branch.description}</p>
                        <div className="space-y-1">
                          {branch.variants.map(variant => {
                            const isSelected = currentDialect === variant.id;
                            return (
                              <button
                                key={variant.id}
                                onClick={() => {
                                  onSelectDialect(variant.id);
                                  setShowLanguageDropdown(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between ${
                                  isSelected 
                                    ? 'bg-[#6B1D33] text-white font-bold shadow-xs' 
                                    : 'text-slate-700 hover:bg-white hover:shadow-xs'
                                }`}
                              >
                                <span className="truncate pr-1">{variant.label}</span>
                                {isSelected && <span>✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Preguntas Frecuentes */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#FDF2F4] text-[#6B1D33]">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-title text-xl font-bold text-[#6B1D33]">
                    Preguntas Frecuentes Jurídicas (Sapa kuti tapukuykuna)
                  </h3>
                  <p className="text-xs text-[#7A8290]">Consultas recurrentes con respaldo del SPIJ y defensa pública</p>
                </div>
              </div>
              <button
                onClick={() => setShowFaqModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              {FAQ_LIST.map((faq, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setShowFaqModal(false);
                    navigate('/assistant', { state: { initialQuery: faq.qu } });
                  }}
                  className="p-4 rounded-2xl bg-[#F8F9FA] hover:bg-[#FDF2F4] border border-slate-200/80 hover:border-[#6B1D33]/30 cursor-pointer transition-all group"
                >
                  <div className="font-bold text-xs text-[#6B1D33] mb-0.5">
                    "{faq.qu}"
                  </div>
                  <div className="font-semibold text-xs text-[#2D3139] mb-1">
                    {faq.es}
                  </div>
                  <div className="text-[11px] text-[#5B616E] leading-relaxed">
                    {faq.desc}
                  </div>
                  <div className="text-[10px] text-[#8E2B47] font-bold mt-2 flex items-center gap-1 group-hover:underline">
                    <span>Consultar esta pregunta en el Asistente</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFaqModal(false)}
                className="px-5 py-2 text-xs font-semibold text-[#5B616E] hover:text-[#2D3139] rounded-xl hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
