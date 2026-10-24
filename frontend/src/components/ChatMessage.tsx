import React, { useState } from 'react';
import type { MessageItem } from '../types';
import { LegalSourceCard } from './LegalSourceCard';
import { AudioPlayer } from './AudioPlayer';
import { 
  AlertTriangle, 
  PhoneCall, 
  Flag, 
  CheckCircle, 
  ChevronRight, 
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { api } from '../services/api';
import { getVariantLabel } from '../constants/dialects';

interface Props {
  message: MessageItem;
}

export const ChatMessage: React.FC<Props> = ({ message }) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [issueType, setIssueType] = useState('bad_translation');
  const [feedbackNote, setFeedbackNote] = useState('');

  const isUser = message.sender === 'user';
  const chatResponse = message.chatResponse;

  const handleReportError = async () => {
    try {
      await api.submitFeedback(message.content, issueType, feedbackNote);
      setFeedbackSent(true);
      setShowFeedbackModal(false);
    } catch {
      alert('No se pudo enviar el reporte.');
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-5">
        <div className="max-w-2xl bg-[#6B1D33] text-white rounded-3xl rounded-tr-md px-6 py-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-[11px] text-[#F8D7E0] font-semibold">
            <span>Qam / Tú ({message.language === 'qu' ? 'Quechua' : 'Español'})</span>
          </div>
          <p className="text-sm font-medium leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  // Mensaje del Asistente Yachay Legal AI
  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-4xl w-full bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] relative">
        {/* Cabecera del mensaje */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF2F4] border border-[#F8E1E6] flex items-center justify-center text-[#6B1D33]">
              <Scale className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <span className="font-serif-title text-base font-bold text-[#6B1D33] block leading-none">
                Yachay Legal AI
              </span>
              <span className="text-[11px] text-[#7A8290] font-medium mt-0.5 block">
                Orientación jurídica con RAG verificable oficial
              </span>
            </div>
          </div>

          {chatResponse?.status === 'insufficient_evidence' && (
            <span className="inline-flex items-center gap-1.5 bg-[#FEF6E7] text-[#9A6208] border border-[#FDE5B5] text-[11px] font-bold px-3 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Abstención Responsable (Sin evidencia suficiente)</span>
            </span>
          )}

          {chatResponse?.status === 'answered' && (
            <span className="inline-flex items-center gap-1.5 bg-[#E8F6EE] text-[#20724F] border border-[#D4EEDB] text-[11px] font-bold px-3 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Fundamentado en Leyes Oficiales</span>
            </span>
          )}
        </div>

        {/* 1. SECCIÓN 1: Explicación sencilla en Quechua */}
        {chatResponse?.translation?.text && (
          <div className="bg-[#FAF8F5] border border-[#F0EAE1] rounded-2xl p-5 mb-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2 text-[#6B1D33] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#8E2B47]" />
                <span>1. Sut'i willakuy Quechua simipi</span>
                {chatResponse.translation.dialect && (
                  <span className="text-[10px] lowercase first-letter:uppercase px-2.5 py-0.5 rounded-full bg-[#6B1D33]/10 text-[#6B1D33] font-semibold border border-[#6B1D33]/20">
                    {getVariantLabel(chatResponse.translation.dialect)}
                  </span>
                )}
              </div>
              <AudioPlayer 
                textToSpeak={chatResponse.translation.text} 
                lang="es-PE" 
                label="Quechuapi uyariy" 
              />
            </div>
            <p className="text-sm text-[#2D3139] font-medium leading-relaxed whitespace-pre-line">
              {chatResponse.translation.text}
            </p>
            {chatResponse.translation.notes && (
              <p className="text-[11px] text-[#7A8290] mt-3 italic flex items-center gap-1.5 pt-2 border-t border-[#F0EAE1]">
                <Info className="w-3.5 h-3.5 text-[#8E2B47] shrink-0" />
                <span>{chatResponse.translation.notes}</span>
              </p>
            )}
          </div>
        )}

        {/* 2. SECCIÓN 2: Explicación en Español */}
        <div className="bg-[#F8F9FA] border border-slate-200/80 rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-[#5B616E] text-xs font-bold uppercase tracking-wider">
              2. Explicación directa en Español
            </span>
            <AudioPlayer 
              textToSpeak={chatResponse?.answer || message.content} 
              lang="es-PE" 
              label="Escuchar en Español" 
            />
          </div>
          <p className="text-sm text-[#3E434D] leading-relaxed font-normal">
            {chatResponse?.answer || message.content}
          </p>
        </div>

        {/* 3. SECCIÓN 3: Fundamento legal verificable (Normas del SPIJ) */}
        {chatResponse?.sources && chatResponse.sources.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5B616E] mb-3 flex items-center gap-2">
              <span>3. Fundamento legal y normas consultadas</span>
              <span className="text-[10px] bg-slate-100 text-[#4E5562] px-2 py-0.5 rounded-full font-mono border border-slate-200">
                {chatResponse.sources.length} artículo(s)
              </span>
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {chatResponse.sources.map((src, i) => (
                <LegalSourceCard key={i} source={src} />
              ))}
            </div>
          </div>
        )}

        {/* 4. SECCIÓN 4: Siguiente paso y orientación procesal */}
        {chatResponse?.next_steps && chatResponse.next_steps.length > 0 && (
          <div className="bg-[#EEF1FD]/60 border border-[#E2E6FA] rounded-2xl p-5 mb-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D47A8] mb-2.5">
              4. Pasos a seguir (Imakunatam ruranayki)
            </h4>
            <ul className="space-y-2">
              {chatResponse.next_steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2D3139] font-medium leading-relaxed">
                  <ChevronRight className="w-4 h-4 text-[#4853B8] shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tarjeta de Derivación Oficial Humana (Línea 100 / Fono 1884) */}
        {chatResponse?.referral_service && (
          <div className={`rounded-2xl p-5 mb-5 border shadow-sm ${
            chatResponse.referral_service.is_urgent
              ? 'bg-[#FDF2F4] border-[#F8D7E0]'
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  chatResponse.referral_service.is_urgent 
                    ? 'bg-[#FCE7EC] text-[#6B1D33]' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E2B47] block mb-0.5">
                    {chatResponse.referral_service.is_urgent ? 'Canal de Ayuda Gratuito Urgente' : 'Orientación Legal Oficial'}
                  </span>
                  <h5 className="text-sm font-bold text-[#2D3139]">{chatResponse.referral_service.name}</h5>
                  <p className="text-xs text-[#5B616E] mt-0.5 leading-relaxed">{chatResponse.referral_service.description}</p>
                </div>
              </div>

              <a
                href={`tel:${chatResponse.referral_service.phone}`}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm shrink-0 transition-all ${
                  chatResponse.referral_service.is_urgent
                    ? 'bg-[#6B1D33] hover:bg-[#541427] text-white shadow-[#6B1D33]/20 hover:scale-[1.02]'
                    : 'bg-slate-800 hover:bg-slate-900 text-white'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Llamar al {chatResponse.referral_service.phone}</span>
              </a>
            </div>
          </div>
        )}

        {/* Footer: Trazabilidad y Botón de Reporte */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-[#7A8290]">
          <span>Trazabilidad: Algoritmo RAG verificado contra fuentes oficiales del Estado Peruano.</span>
          {!feedbackSent ? (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 text-[#5B616E] hover:text-[#6B1D33] font-semibold transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-[#8E2B47]" />
              <span>Reportar respuesta incorrecta</span>
            </button>
          ) : (
            <span className="text-[#20724F] font-bold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Reporte recibido para revisión jurídica</span>
            </span>
          )}
        </div>

        {/* Modal de Feedback */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl">
              <h3 className="font-serif-title text-lg font-bold text-[#6B1D33] mb-1.5">
                Reportar error jurídico o lingüístico
              </h3>
              <p className="text-xs text-[#5B616E] mb-4">
                Tu reporte ayuda a nuestros validadores jurídicos y quechua-hablantes a auditar la respuesta.
              </p>

              <label className="text-xs font-semibold text-[#2D3139] block mb-1">Tipo de problema:</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-[#F8F9FA] border border-slate-200 text-[#2D3139] text-xs rounded-xl p-2.5 mb-3 focus:outline-none focus:border-[#6B1D33]"
              >
                <option value="bad_translation">Traducción imprecisa o quechua no natural</option>
                <option value="incorrect_law">Artículo o norma no aplicable al caso</option>
                <option value="unclear_explanation">Explicación confusa o incompleta</option>
                <option value="should_abstain">El sistema debió abstenerse y derivar a un abogado</option>
              </select>

              <label className="text-xs font-semibold text-[#2D3139] block mb-1">Detalle (opcional):</label>
              <textarea
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={3}
                className="w-full bg-[#F8F9FA] border border-slate-200 text-[#2D3139] text-xs rounded-xl p-2.5 mb-4 focus:outline-none focus:border-[#6B1D33]"
                placeholder="Indica qué concepto debería corregirse..."
              />

              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5B616E] hover:text-[#2D3139] rounded-xl hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReportError}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-[#6B1D33] hover:bg-[#541427] text-white shadow-md shadow-[#6B1D33]/20"
                >
                  Enviar reporte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
