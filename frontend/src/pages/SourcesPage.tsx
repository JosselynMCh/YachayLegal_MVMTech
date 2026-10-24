import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ExternalLink, ShieldCheck, PhoneCall, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import type { SourceCitation, LegalServiceInfo, QuechuaDialect } from '../types';
import { api } from '../services/api';

interface Props {
  currentDialect: QuechuaDialect;
  onSelectDialect: (d: QuechuaDialect) => void;
  primaryLang: 'qu' | 'es';
  onSelectPrimaryLang: (l: 'qu' | 'es') => void;
}

export const SourcesPage: React.FC<Props> = ({
  currentDialect,
  onSelectDialect,
  primaryLang,
  onSelectPrimaryLang
}) => {
  const navigate = useNavigate();
  const [sources, setSources] = useState<SourceCitation[]>([]);
  const [services, setServices] = useState<LegalServiceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [articleTabs, setArticleTabs] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const [srcData, srvData] = await Promise.all([
          api.getSources(),
          api.getServices()
        ]);
        setSources(srcData);
        setServices(srvData);
      } catch (e) {
        console.error('Error al cargar datos:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D3139] flex flex-col font-sans">
      {/* Top Header Universal Navbar */}
      <Navbar
        currentDialect={currentDialect}
        onSelectDialect={onSelectDialect}
        primaryLang={primaryLang}
        onSelectPrimaryLang={onSelectPrimaryLang}
        activePage="fuentes"
      />


      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-10">
        {/* Servicios de asistencia legal gratuita */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-xl bg-[#EEF1FD] text-[#4853B8]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#2D3139]">
                Canales Oficiales de Defensa y Auxilio Ciudadano
              </h3>
              <p className="text-xs text-[#6C7381]">Servicios públicos gratuitos con atención en Quechua y Español</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {services.map(srv => (
              <div 
                key={srv.id} 
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-[#6B1D33]/30"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E2B47] block mb-1">
                    {srv.channel}
                  </span>
                  <h4 className="text-sm font-bold text-[#2D3139] mb-2">{srv.name}</h4>
                  <p className="text-xs text-[#5B616E] mb-3 leading-relaxed">{srv.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {srv.languages.map((l, idx) => (
                      <span key={idx} className="text-[10px] bg-[#F8F9FA] text-[#4B5262] border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#20724F]">{srv.phone}</span>
                  <a
                    href={srv.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#6B1D33] hover:underline flex items-center gap-1"
                  >
                    <span>Portal Gob.pe</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Normas legales indexadas en el RAG */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-2 rounded-xl bg-[#FDF2F4] text-[#6B1D33]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title text-xl font-bold text-[#2D3139]">
                Leyes y Artículos Integrados en la Base Documental
              </h3>
              <p className="text-xs text-[#6C7381]">Normas oficiales analizadas por el sistema para responder consultas con rigor jurídico</p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Cargando base de conocimiento oficial...</div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {sources.map((src, i) => {
                const s = src as any;
                const currentTab = articleTabs[i] || 'es';

                let tabContent = s.content_es || s.article_content;
                let tabLabel = 'Español Oficial';
                if (currentTab === 'sureno') {
                  tabContent = s.content_qu_chanka;
                  tabLabel = 'Quechua Sureño (Chanka / Collao)';
                } else if (currentTab === 'central') {
                  tabContent = s.content_qu_central || s.content_qu_chanka;
                  tabLabel = 'Quechua Central (Áncash / Huánuco / Junín)';
                } else if (currentTab === 'norteno') {
                  tabContent = s.content_qu_norteno || s.content_qu_chanka;
                  tabLabel = 'Quechua Norteño (Cajamarca / Inkawasi)';
                } else if (currentTab === 'amazonico') {
                  tabContent = s.content_qu_amazonico || s.content_qu_chanka;
                  tabLabel = 'Quechua Amazónico (Lamas / Napo)';
                }

                return (
                  <div 
                    key={i} 
                    className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all hover:border-[#6B1D33]/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-bold text-[#8E2B47] uppercase tracking-wider block">
                          {src.issuer} {src.publication_date && `· ${src.publication_date}`}
                        </span>
                        <h4 className="text-base font-bold text-[#2D3139] mt-0.5">{src.title}</h4>
                        <h5 className="text-sm font-semibold text-[#4853B8] mt-1">{src.article}</h5>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-[#E8F6EE] border border-[#D4EEDB] text-[#20724F] text-xs px-3 py-1 rounded-full font-semibold shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Vigente SPIJ</span>
                      </span>
                    </div>

                    {/* Selector de pestañas entre Español y las 4 Ramas del Quechua */}
                    <div className="flex flex-wrap items-center gap-1.5 my-3 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">Versión lingüística:</span>
                      <button
                        onClick={() => setArticleTabs(prev => ({ ...prev, [i]: 'es' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          currentTab === 'es' ? 'bg-[#6B1D33] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Español
                      </button>
                      <button
                        onClick={() => setArticleTabs(prev => ({ ...prev, [i]: 'sureno' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          currentTab === 'sureno' ? 'bg-[#6B1D33] text-white shadow-xs' : 'bg-[#FDF2F4] text-[#6B1D33] hover:bg-[#FCE7EC]'
                        }`}
                      >
                        Sureño
                      </button>
                      <button
                        onClick={() => setArticleTabs(prev => ({ ...prev, [i]: 'central' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          currentTab === 'central' ? 'bg-[#6B1D33] text-white shadow-xs' : 'bg-[#FDF2F4] text-[#6B1D33] hover:bg-[#FCE7EC]'
                        }`}
                      >
                        Central
                      </button>
                      <button
                        onClick={() => setArticleTabs(prev => ({ ...prev, [i]: 'norteno' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          currentTab === 'norteno' ? 'bg-[#6B1D33] text-white shadow-xs' : 'bg-[#FDF2F4] text-[#6B1D33] hover:bg-[#FCE7EC]'
                        }`}
                      >
                        Norteño
                      </button>
                      <button
                        onClick={() => setArticleTabs(prev => ({ ...prev, [i]: 'amazonico' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          currentTab === 'amazonico' ? 'bg-[#6B1D33] text-white shadow-xs' : 'bg-[#FDF2F4] text-[#6B1D33] hover:bg-[#FCE7EC]'
                        }`}
                      >
                        Amazónico
                      </button>
                    </div>

                    <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#F0EAE1] my-3">
                      <div className="text-[10px] uppercase font-bold text-[#8E2B47] tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Texto en {tabLabel}</span>
                        {currentTab !== 'es' && <span className="text-slate-400 font-normal">Borrador preliminar sujeto a validación</span>}
                      </div>
                      <p className="text-xs text-[#3E434D] leading-relaxed font-serif whitespace-pre-line">
                        {tabContent}
                      </p>
                    </div>

                    <a
                      href={src.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B1D33] hover:text-[#541427] hover:underline pt-1"
                    >
                      <span>Consultar norma oficial en el Sistema Peruano de Información Jurídica (SPIJ)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer Banner */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 w-full mb-8 mt-auto">
        <div className="bg-[#F0F2F6]/90 border border-slate-200 rounded-2xl p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5D6472]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#6B1D33] shrink-0" />
            <span>
              Las fuentes corresponden a los textos oficiales publicados en el diario oficial El Peruano y el SPIJ del MINJUSDH.
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-[#6B1D33] hover:text-[#541427] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>Volver al Inicio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
