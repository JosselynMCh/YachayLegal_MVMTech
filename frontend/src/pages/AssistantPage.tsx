import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Loader2, Plus, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatMessage } from '../components/ChatMessage';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { Navbar } from '../components/Navbar';
import type { MessageItem, QuechuaDialect } from '../types';
import { getVariantInfo } from '../constants/dialects';
import { api } from '../services/api';

interface Props {
  currentDialect: QuechuaDialect;
  onSelectDialect: (d: QuechuaDialect) => void;
  primaryLang: 'qu' | 'es';
  onSelectPrimaryLang: (l: 'qu' | 'es') => void;
}

export const AssistantPage: React.FC<Props> = ({
  currentDialect,
  onSelectDialect,
  primaryLang,
  onSelectPrimaryLang
}) => {
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [emptyError, setEmptyError] = useState(false);

  // Verificar salud del backend al montar
  useEffect(() => {
    api.checkHealth().then(r => {
      setBackendOnline(r.status === 'ok');
    });
  }, []);

  // Inicialización con mensaje de bienvenida y manejo de consulta inicial de navegación
  useEffect(() => {
    const welcomeMsg: MessageItem = {
      id: 'welcome',
      sender: 'assistant',
      content: t('assistant.welcome'),
      language: primaryLang,
      timestamp: new Date().toLocaleTimeString(),
      chatResponse: {
        status: 'answered',
        input_language: primaryLang,
        answer: t('assistant.welcome'),
        translation: {
          language: 'qu',
          dialect: currentDialect,
          text: "Allillanchu. Yachay Legal AI nisqawanqa hayñiykikunatam yachanki: policiapi hap'isqa kaspa, wasipi maqanakuy kaqtin utaq quechua simiykipi justicia mañakunaykipaq.",
          validated: true,
          notes: "Bienvenida inicial bilingüe verificada."
        },
        sources: [],
        limitations: [
          "Esta herramienta brinda orientación jurídica basada en normas peruanas y no reemplaza a tu abogado defensor."
        ],
        requires_human_review: false,
        next_steps: [
          t('assistant.welcome')
        ]
      }
    };

    setMessages([welcomeMsg]);

    const initialQuery = (location.state as any)?.initialQuery;
    if (initialQuery) {
      // Pequeño delay para que el welcome message se renderice primero
      setTimeout(() => handleSend(initialQuery), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();

    // Validar campo vacío
    if (!textToSend) {
      setEmptyError(true);
      setTimeout(() => setEmptyError(false), 3000);
      return;
    }
    if (loading) return;

    setEmptyError(false);
    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      language: primaryLang,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.sendConsultation(
        textToSend,
        primaryLang,
        primaryLang === 'es' ? null : currentDialect
      );
      setBackendOnline(true);
      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        language: primaryLang,
        timestamp: new Date().toLocaleTimeString(),
        chatResponse: response
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setBackendOnline(false);
      const errorMsg: MessageItem = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content: t('assistant.error_connection'),
        language: 'es',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewQuery = () => {
    setMessages([]);
    setInputQuery('');
    // Re-añadir mensaje de bienvenida
    const welcomeMsg: MessageItem = {
      id: `welcome-${Date.now()}`,
      sender: 'assistant',
      content: t('assistant.welcome'),
      language: primaryLang,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages([welcomeMsg]);
  };

  const variantInfo = getVariantInfo(currentDialect);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#2D3139] flex flex-col font-sans">
      {/* Top Bar Header Universal */}
      <Navbar
        currentDialect={currentDialect}
        onSelectDialect={onSelectDialect}
        primaryLang={primaryLang}
        onSelectPrimaryLang={onSelectPrimaryLang}
        activePage="asistente"
      />

      {/* Banner de estado del backend */}
      {backendOnline === false && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs text-amber-800 font-semibold">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t('status.backend_offline')} — {t('status.offline_hint')}</span>
          </div>
        </div>
      )}

      {/* Franja de estado del idioma y variante */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2 text-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {primaryLang === 'es' ? (
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t('assistant.mode_spanish')} <strong>{t('assistant.mode_spanish_val')}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">{t('assistant.dialect_na')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#6B1D33] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#6B1D33] animate-pulse" />
              <span>{t('assistant.mode_quechua')} <strong>{t('assistant.mode_quechua_val')}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FDF2F4] border border-[#6B1D33]/20 text-[#6B1D33] font-bold">
                {variantInfo ? `${variantInfo.label} (${variantInfo.iso})` : 'Quechua Sureño'}
              </span>
            </div>
          )}
          <div className="text-[11px] text-slate-400">
            {primaryLang === 'qu'
              ? t('assistant.dialect_adapted')
              : t('home.dialect_hint')}
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 overflow-y-auto">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} primaryLang={primaryLang} />
        ))}

        {loading && (
          <div className="flex justify-start mb-6">
            <div className="bg-white border border-[#6B1D33]/30 rounded-3xl p-5 px-6 shadow-xs flex items-center gap-3 text-[#6B1D33] text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-[#6B1D33]" />
              <span>
                {primaryLang === 'qu'
                  ? t('assistant.loading_qu')
                  : t('assistant.loading_es')}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Control Deck */}
      <footer className="border-t border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 sticky bottom-0 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Botón Nueva Consulta */}
          {messages.length > 1 && !loading && (
            <div className="flex justify-end">
              <button
                onClick={handleNewQuery}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#6B1D33] border border-[#6B1D33]/30 hover:bg-[#FDF2F4] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('assistant.new_query')}</span>
              </button>
            </div>
          )}

          {/* Grabador por voz */}
          <VoiceRecorder
            onConfirmTranscription={handleSend}
            disabled={loading}
            primaryLang={primaryLang}
            dialect={currentDialect}
          />

          {/* Input de texto manual */}
          <div className={`flex items-center gap-2 bg-[#F8F9FA] border ${emptyError ? 'border-red-400 ring-4 ring-red-100' : 'border-slate-200 focus-within:border-[#6B1D33] focus-within:ring-4 focus-within:ring-[#6B1D33]/5'} focus-within:bg-white rounded-2xl p-2 px-4 transition-all shadow-xs`}>
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => { setInputQuery(e.target.value); setEmptyError(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={
                primaryLang === 'qu'
                  ? t('assistant.placeholder_qu')
                  : t('assistant.placeholder_es')
              }
              disabled={loading}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#2D3139] focus:outline-none placeholder:text-slate-400 font-normal"
              aria-label={primaryLang === 'qu' ? 'Tapukuy' : 'Campo de consulta jurídica'}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="p-2 sm:p-2.5 rounded-xl bg-[#6B1D33] hover:bg-[#541427] disabled:opacity-30 disabled:hover:bg-[#6B1D33] text-white transition-all shadow-sm shrink-0 cursor-pointer"
              aria-label="Enviar consulta"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Error de campo vacío */}
          {emptyError && (
            <p className="text-xs text-red-600 font-semibold pl-1">
              {t('errors.empty_query')}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
};
