import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Loader2 } from 'lucide-react';
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

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // Inicialización con mensaje de bienvenida y manejo de consulta inicial de navegación
  useEffect(() => {
    const welcomeMsg: MessageItem = {
      id: 'welcome',
      sender: 'assistant',
      content: 'Allillanchu, tapukuyniykita rimariy utaq qillqamuy quechuapi utaq españolpi. / Bienvenido(a), formula tu duda legal por voz o texto.',
      language: primaryLang,
      timestamp: new Date().toLocaleTimeString(),
      chatResponse: {
        status: 'answered',
        input_language: 'qu',
        answer: 'Bienvenido a Yachay Legal AI. Puedes consultar sobre tus derechos ante la policía (Art. 71 CPP), medidas de protección frente a violencia familiar (Ley 30364) o el uso de tu idioma nativo ante jueces y fiscales.',
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
          "Habla con el micrófono o escribe una consulta clara sobre tu caso.",
          "Revisa los artículos legales oficiales que fundamentan cada respuesta."
        ]
      }
    };

    setMessages([welcomeMsg]);

    const initialQuery = (location.state as any)?.initialQuery;
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

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
      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        language: primaryLang,
        timestamp: new Date().toLocaleTimeString(),
        chatResponse: response
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content: 'No se pudo conectar con el motor RAG. Asegúrate de que el backend de FastAPI esté en ejecución en el puerto 8000.',
        language: 'es',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
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

      {/* Franja de estado del idioma y variante */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2 text-xs">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {primaryLang === 'es' ? (
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Modo actual: <strong>Español (Perú)</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-400">Variante quechua: <strong className="text-slate-500 font-semibold">No aplica en Español</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#6B1D33] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#6B1D33] animate-pulse" />
              <span>Modo actual: <strong>Quechua (Runasimi)</strong></span>
              <span className="text-slate-300">|</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FDF2F4] border border-[#6B1D33]/20 text-[#6B1D33] font-bold">
                {variantInfo ? `${variantInfo.label} (${variantInfo.iso})` : 'Quechua Sureño'}
              </span>
            </div>
          )}
          <div className="text-[11px] text-slate-400">
            {primaryLang === 'qu' 
              ? 'El léxico y las respuestas se adaptan a esta variante' 
              : 'Selecciona Quechua en la barra superior para activar las 4 ramas del Perú'}
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 overflow-y-auto">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex justify-start mb-6">
            <div className="bg-white border border-[#6B1D33]/30 rounded-3xl p-5 px-6 shadow-xs flex items-center gap-3 text-[#6B1D33] text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-[#6B1D33]" />
              <span>
                {primaryLang === 'qu'
                  ? 'Maskashan normas legales nisqapi... (Consultando corpus oficial del SPIJ y verificando evidencia)'
                  : 'Buscando en normas oficiales del SPIJ y verificando evidencia jurídica...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input Control Deck */}
      <footer className="border-t border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 sticky bottom-0 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Grabador por voz asistido adaptado a la variante */}
          <VoiceRecorder 
            onConfirmTranscription={handleSend} 
            disabled={loading}
            primaryLang={primaryLang}
            dialect={currentDialect}
          />

          {/* Input de texto manual alternativo */}
          <div className="flex items-center gap-2 bg-[#F8F9FA] border border-slate-200 focus-within:border-[#6B1D33] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6B1D33]/5 rounded-2xl p-2 px-4 transition-all shadow-xs">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={
                primaryLang === 'qu'
                  ? "Qillqay tapukuyniykita (Escribe tu duda en quechua)..."
                  : "Escribe tu consulta legal en español (ej. derechos del detenido, pensión de alimentos)..."
              }
              disabled={loading}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#2D3139] focus:outline-none placeholder:text-slate-400 font-normal"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputQuery.trim()}
              className="p-2 sm:p-2.5 rounded-xl bg-[#6B1D33] hover:bg-[#541427] disabled:opacity-30 disabled:hover:bg-[#6B1D33] text-white transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
