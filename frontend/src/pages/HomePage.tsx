import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe,
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  Users, 
  Mic, 
  Send, 
  Keyboard, 
  Info, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import type { QuechuaDialect } from '../types';
import { QUECHUA_BRANCHES } from '../constants/dialects';
import { Navbar } from '../components/Navbar';

interface Props {
  currentDialect: QuechuaDialect;
  onSelectDialect: (d: QuechuaDialect) => void;
  primaryLang: 'qu' | 'es';
  onSelectPrimaryLang: (l: 'qu' | 'es') => void;
}

export const HomePage: React.FC<Props> = ({
  currentDialect,
  onSelectDialect,
  primaryLang,
  onSelectPrimaryLang
}) => {
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'write'>('voice');
  const [isRecording, setIsRecording] = useState(false);

  const handleStartConsultation = (query?: string) => {
    const textToSubmit = (query || queryText).trim();
    if (textToSubmit) {
      navigate('/assistant', { state: { initialQuery: textToSubmit } });
    } else {
      navigate('/assistant');
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        let sampleQuery = "¿Cuáles son mis derechos si la policía me detiene sin motivo?";
        if (primaryLang === 'qu') {
          if (currentDialect.includes('central')) {
            sampleQuery = "Polisiakunam hapimarqan, ¿imataraq rurashaq kikïpa shimïchaw?";
          } else if (currentDialect.includes('amazonico')) {
            sampleQuery = "Ñukata wasipi makawarkami, ¿comisariapi yanapayta mañayta ushanichu?";
          } else if (currentDialect.includes('norteno')) {
            sampleQuery = "Comisariapi hapisuptiykiqa, ¿abogadu gratuituta quwankumanchu quechua parlaptiy?";
          } else {
            sampleQuery = "Policiakunam hap'irqawan, ¿imatan rurayman? ¿Pillapas yanapawanmanchu quechua simipi?";
          }
        }
        setQueryText(sampleQuery);
      }, 1200);
    }
  };

  const CATEGORIES = [
    {
      title: 'Derechos fundamentales',
      desc: 'Salud, educación, trabajo, igualdad, etc.',
      icon: Users,
      bgColor: 'bg-[#FCE7EC]',
      textColor: 'text-[#8E2B47]',
      borderColor: 'border-[#F5E6EB]',
      query: '¿Cuáles son mis derechos fundamentales si la autoridad no me atiende en mi idioma?'
    },
    {
      title: 'Procesos y trámites',
      desc: 'Cómo acceder a servicios del Estado y más.',
      icon: FileText,
      bgColor: 'bg-[#EEF1FD]',
      textColor: 'text-[#4853B8]',
      borderColor: 'border-[#E2E6FA]',
      query: '¿Cómo presentar una denuncia o reclamo ante una entidad pública?'
    },
    {
      title: 'Defensa pública',
      desc: 'Servicios de orientación legal gratuita.',
      icon: ShieldCheck,
      bgColor: 'bg-[#E8F6EE]',
      textColor: 'text-[#20724F]',
      borderColor: 'border-[#D4EEDB]',
      query: '¿Cómo solicito un abogado defensor público gratuito al MINJUSDH (Fono 1884)?'
    },
    {
      title: 'Normas y leyes',
      desc: 'Leyes, decretos y reglamentos actualizados.',
      icon: BookOpen,
      bgColor: 'bg-[#FDF3E5]',
      textColor: 'text-[#B06316]',
      borderColor: 'border-[#FAECD6]',
      query: '¿Qué dice la Ley 30364 sobre medidas de protección inmediata?'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D3139] flex flex-col font-sans">
      {/* 1. Header / Navbar Superior Universal */}
      <Navbar
        currentDialect={currentDialect}
        onSelectDialect={onSelectDialect}
        primaryLang={primaryLang}
        onSelectPrimaryLang={onSelectPrimaryLang}
        activePage="inicio"
      />


      {/* 2. Hero Section con Fondo_Yachay.png */}
      <section 
        className="relative bg-cover bg-right md:bg-center pt-10 pb-20 md:pb-28 overflow-hidden"
        style={{
          backgroundImage: "url('/Fondo_Yachay.png')",
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Soft gradient overlay on left for perfect text contrast while preserving image aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent pointer-events-none md:via-white/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px]">
            {/* Lado izquierdo: Textos y badges */}
            <div className="lg:col-span-7 z-10 max-w-xl">
              <h1 className="font-serif-title font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-[#541427] leading-[1.12] tracking-tight mb-5">
                La justicia también <br />
                habla tu idioma
              </h1>

              <p className="text-[15px] sm:text-[16px] text-[#555C68] font-normal leading-relaxed mb-8 max-w-lg">
                Yachay Legal AI te ayuda a comprender las normas peruanas con explicaciones claras, en español y quechua, y con fuentes oficiales verificables.
              </p>

              {/* 4 Badges de características en fila */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-semibold text-[#3B4049]">
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/90 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8E2B47]" />
                  <span className="text-[11px] sm:text-xs">Información confiable</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/90 shadow-sm">
                  <MessageSquare className="w-3.5 h-3.5 text-[#8E2B47]" />
                  <span className="text-[11px] sm:text-xs">En quechua y español</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/90 shadow-sm">
                  <FileText className="w-3.5 h-3.5 text-[#8E2B47]" />
                  <span className="text-[11px] sm:text-xs">Fuentes legales oficiales</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200/90 shadow-sm">
                  <Users className="w-3.5 h-3.5 text-[#8E2B47]" />
                  <span className="text-[11px] sm:text-xs">Orientación cuando lo necesites</span>
                </div>
              </div>
            </div>

            {/* Lado derecho: Espacio visual reservado para la ilustración original de Fondo_Yachay.png */}
            <div className="lg:col-span-5 relative flex justify-end items-start h-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 3. Tarjeta Flotante Principal de Consulta */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 w-full -mt-10 sm:-mt-14 mb-10">
        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-[0_16px_50px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          {/* Header de la tarjeta */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif-title font-bold text-xl sm:text-2xl text-[#6B1D33] tracking-tight">
                ¿En qué podemos orientarte?
              </h2>
              <p className="text-xs sm:text-sm text-[#6C7381] mt-0.5">
                {primaryLang === 'qu'
                  ? 'Tapukuyniykita rimariy utaq qillqamuy quechuapi (4 ramas del Perú respaldadas).'
                  : 'Escribe tu consulta jurídica en español o usa el micrófono para hablar.'}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              {primaryLang === 'es' ? (
                <div className="flex flex-col items-start sm:items-end">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-[#404652] shadow-xs">
                    <Globe className="w-3.5 h-3.5 text-[#6B1D33]" />
                    <span>Español (Perú)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-normal">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Variante Quechua: <strong className="font-semibold text-slate-500">No aplica en Español</strong></span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start sm:items-end">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#6B1D33]" />
                    <select
                      value={currentDialect}
                      onChange={(e) => onSelectDialect(e.target.value as QuechuaDialect)}
                      className="bg-white border border-slate-200 hover:border-[#6B1D33]/50 text-xs font-semibold text-[#404652] rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6B1D33]/10 cursor-pointer shadow-xs"
                      title="Selecciona una de las 4 ramas del quechua"
                    >
                      {QUECHUA_BRANCHES.map(branch => (
                        <optgroup key={branch.id} label={`${branch.label} (${branch.regions.slice(0, 3).join(', ')})`}>
                          {branch.variants.map(variant => (
                            <option key={variant.id} value={variant.id}>
                              {variant.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6B1D33] mt-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#6B1D33]" />
                    <span>Respuesta y vocabulario adaptados a la variante seleccionada</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Barra de Búsqueda / Input Grande */}
          <div className="bg-white border border-slate-200 hover:border-[#6B1D33]/50 focus-within:border-[#6B1D33] focus-within:ring-4 focus-within:ring-[#6B1D33]/5 rounded-2xl p-2 sm:p-2.5 flex items-center gap-3 transition-all shadow-xs mb-4">
            {/* Micrófono botón */}
            <button
              onClick={handleToggleVoice}
              className={`p-3 rounded-full transition-all shrink-0 ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-[#FDF2F4] text-[#6B1D33] hover:bg-[#FCE7EC]'
              }`}
              title="Hablar por voz en Quechua o Español"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Input de texto */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartConsultation();
                }}
                placeholder={
                  primaryLang === 'qu'
                    ? "Ejemplo en Quechua: Policiakunam hap'irqawan, ¿imatan rurayman? (Habla o escribe)"
                    : "Ejemplo: ¿Cuáles son mis derechos si la policía me detiene o intervienen sin motivo?"
                }
                className="w-full bg-transparent border-none text-[#2D3139] text-xs sm:text-sm focus:outline-none placeholder:text-[#9AA0AC] font-normal"
              />
            </div>

            {/* Botón Consultar */}
            <button
              onClick={() => handleStartConsultation()}
              className="bg-[#6B1D33] hover:bg-[#541427] text-white px-5 sm:px-7 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#6B1D33]/20 transition-all shrink-0 hover:scale-[1.01]"
            >
              <Send className="w-4 h-4" />
              <span>Consultar</span>
            </button>
          </div>

          {/* Selectores de Modo: Hablar (voz) vs Escribir */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setInputMode('voice');
                handleToggleVoice();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                inputMode === 'voice'
                  ? 'bg-[#FDF2F4] border border-[#6B1D33]/30 text-[#6B1D33]'
                  : 'bg-white border border-slate-200 text-[#555C68] hover:text-[#2D3139]'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#6B1D33]" />
              <span>Hablar (voz)</span>
            </button>

            <button
              onClick={() => setInputMode('write')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                inputMode === 'write'
                  ? 'bg-[#FDF2F4] border border-[#6B1D33]/30 text-[#6B1D33]'
                  : 'bg-white border border-slate-200 text-[#555C68] hover:text-[#2D3139]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Escribir</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Sección "También puedes consultar sobre:" (4 Tarjetas Horizontales) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-10">
        <h3 className="text-sm font-bold text-[#3B4049] mb-4">
          También puedes consultar sobre:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => {
            const IconComp = cat.icon;
            return (
              <button
                key={i}
                onClick={() => handleStartConsultation(cat.query)}
                className={`bg-white border ${cat.borderColor} hover:border-[#6B1D33]/50 rounded-2xl p-4 flex items-center justify-between text-left transition-all duration-200 hover:shadow-md group`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${cat.bgColor} ${cat.textColor} flex items-center justify-center shrink-0`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#24272E] group-hover:text-[#6B1D33] transition-colors truncate">
                      {cat.title}
                    </h4>
                    <p className="text-[11px] text-[#717886] truncate mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#6B1D33] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Banner Inferior de Advertencia Oficial y Enlaces */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 w-full mb-12 mt-auto">
        <div className="bg-[#F0F2F6]/90 border border-slate-200 rounded-2xl p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5D6472]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#6B1D33] shrink-0" />
            <span>
              Las respuestas se basan en fuentes oficiales del Estado Peruano. No reemplaza la asesoría de un abogado.
            </span>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="text-[#6B1D33] hover:text-[#541427] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>Conoce más sobre el proyecto</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
