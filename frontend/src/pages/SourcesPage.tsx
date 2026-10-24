import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ExternalLink, ShieldCheck, PhoneCall, ArrowRight, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar';
import type { LegalServiceInfo, QuechuaDialect } from '../types';
import { api } from '../services/api';

interface Props {
  currentDialect: QuechuaDialect;
  onSelectDialect: (d: QuechuaDialect) => void;
  primaryLang: 'qu' | 'es';
  onSelectPrimaryLang: (l: 'qu' | 'es') => void;
}

import { FALLBACK_LEGAL_SERVICES, FALLBACK_OFFICIAL_SOURCES, type LegalCorpusItem } from '../constants/legalData';

export const SourcesPage: React.FC<Props> = ({
  currentDialect,
  onSelectDialect,
  primaryLang,
  onSelectPrimaryLang
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sources, setSources] = useState<LegalCorpusItem[]>(FALLBACK_OFFICIAL_SOURCES);
  const [services, setServices] = useState<LegalServiceInfo[]>(FALLBACK_LEGAL_SERVICES);
  const [loading, setLoading] = useState(false);
  const [errorSources, setErrorSources] = useState(false);
  const [errorServices, setErrorServices] = useState(false);
  const [articleTabs, setArticleTabs] = useState<Record<number, string>>({});

  useEffect(() => {
    async function loadData() {
      if (sources.length === 0) setLoading(true);
      const [srcResult, srvResult] = await Promise.allSettled([
        api.getSources(),
        api.getServices()
      ]);

      if (srcResult.status === 'fulfilled' && Array.isArray(srcResult.value) && srcResult.value.length > 0) {
        setSources(srcResult.value as unknown as LegalCorpusItem[]);
        setErrorSources(false);
      } else if (sources.length === 0) {
        setSources(FALLBACK_OFFICIAL_SOURCES);
      }

      if (srvResult.status === 'fulfilled' && Array.isArray(srvResult.value) && srvResult.value.length > 0) {
        setServices(srvResult.value);
        setErrorServices(false);
      } else if (services.length === 0) {
        setServices(FALLBACK_LEGAL_SERVICES);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D3139] flex flex-col font-sans">
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
                {t('sources.services_title')}
              </h3>
              <p className="text-xs text-[#6C7381]">{t('sources.services_subtitle')}</p>
            </div>
          </div>

          {errorServices && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t('errors.load_services')}</span>
            </div>
          )}

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
                    <span>{t('sources.portal_link')}</span>
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
                {t('sources.laws_title')}
              </h3>
              <p className="text-xs text-[#6C7381]">{t('sources.laws_subtitle')}</p>
            </div>
          </div>

          {errorSources && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{t('errors.load_sources')}</span>
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">{t('sources.loading')}</div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {sources.map((src, i) => {
                const currentTab = articleTabs[i] || 'es';

                let tabContent = src.content_es || src.article_content || '';
                let tabLabel = 'Español Oficial';
                if (currentTab === 'sureno') {
                  tabContent = src.content_qu_chanka || src.content_es || '';
                  tabLabel = t('sources.tab_sureno') + ' (Chanka / Collao)';
                } else if (currentTab === 'central') {
                  tabContent = src.content_qu_central || src.content_qu_chanka || '';
                  tabLabel = t('sources.tab_central') + ' (Áncash / Huánuco / Junín)';
                } else if (currentTab === 'norteno') {
                  tabContent = src.content_qu_norteno || src.content_qu_chanka || '';
                  tabLabel = t('sources.tab_norteno') + ' (Cajamarca / Inkawasi)';
                } else if (currentTab === 'amazonico') {
                  tabContent = src.content_qu_amazonico || src.content_qu_chanka || '';
                  tabLabel = t('sources.tab_amazonico') + ' (Lamas / Napo)';
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
                        <span>{t('sources.official_verified')}</span>
                      </span>
                    </div>

                    {/* Selector de pestañas lingüísticas */}
                    <div className="flex flex-wrap items-center gap-1.5 my-3 pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 mr-1">{t('sources.version_label')}</span>
                      {(['es', 'sureno', 'central', 'norteno', 'amazonico'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setArticleTabs(prev => ({ ...prev, [i]: tab }))}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            currentTab === tab
                              ? 'bg-[#6B1D33] text-white shadow-xs'
                              : tab === 'es'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-[#FDF2F4] text-[#6B1D33] hover:bg-[#FCE7EC]'
                          }`}
                        >
                          {t(`sources.tab_${tab}`)}
                        </button>
                      ))}
                    </div>

                    <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#F0EAE1] my-3">
                      <div className="text-[10px] uppercase font-bold text-[#8E2B47] tracking-wider mb-1.5 flex items-center justify-between">
                        <span>{t('sources.text_in')} {tabLabel}</span>
                        {currentTab !== 'es' && (
                          <span className="text-slate-400 font-normal">{t('sources.draft_note')}</span>
                        )}
                      </div>
                      <p className="text-xs text-[#3E434D] leading-relaxed font-serif whitespace-pre-line">
                        {tabContent || '—'}
                      </p>
                    </div>

                    <a
                      href={src.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B1D33] hover:text-[#541427] hover:underline pt-1"
                    >
                      <span>{t('sources.spij_link')}</span>
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
            <span>{t('sources.footer_disclaimer')}</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-[#6B1D33] hover:text-[#541427] font-semibold flex items-center gap-1 hover:underline shrink-0"
          >
            <span>{t('sources.back_home')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
};
