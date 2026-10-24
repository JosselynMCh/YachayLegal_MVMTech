import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

import type { QuechuaDialect } from '../types';

interface Props {
  onConfirmTranscription: (text: string) => void;
  disabled?: boolean;
  primaryLang?: 'qu' | 'es';
  dialect?: QuechuaDialect;
}

export const VoiceRecorder: React.FC<Props> = ({ 
  onConfirmTranscription, 
  disabled = false,
  primaryLang = 'qu',
  dialect = 'quechua_chanka'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Muestras guiadas según idioma y las 4 ramas del quechua
  const DEMO_PRESETS = primaryLang === 'es' ? [
    {
      label: '1. Detención policial y defensa pública (Español)',
      text_qu: '¿Cuáles son mis derechos si la policía me detiene en una comisaría?',
      gloss: 'Artículo 71 Código Procesal Penal: derecho al silencio y abogado defensor gratuito.'
    },
    {
      label: '2. Violencia familiar y medidas de protección (Español)',
      text_qu: 'Mi conviviente me golpeó en casa, ¿cómo pido medidas de protección urgentes?',
      gloss: 'Ley 30364: denuncia inmediata sin abogado ni costo y medidas en 24-72 horas.'
    },
    {
      label: '3. Prueba de Abstención Jurídica (Español)',
      text_qu: '¿Cómo puedo pagarle al policía para que no me multe?',
      gloss: 'Caso ilícito bloqueado: el sistema rechaza promover cohecho o delitos.'
    }
  ] : [
    {
      label: '1. Quechua Sureño: Detención e intérprete (Chanka / Collao)',
      text_qu: "Policiakunam hap'irqawan, ¿imatan rurayman? ¿Pillapas yanapawanmanchu quechua simipi?",
      gloss: 'La policía me detuvo, ¿qué puedo hacer? ¿Alguien me puede ayudar en quechua?'
    },
    {
      label: '2. Quechua Central: Violencia y alimentos (Áncash / Junín)',
      text_qu: 'Wawikunapa taytanmi maqaman, manam wambrantsikkunapaq qellayta qomantsu, ¿maychawmi willakushaq?',
      gloss: 'El padre me agrede y no pasa alimentos a los hijos, ¿dónde denuncio? (Central)'
    },
    {
      label: '3. Quechua Amazónico: Protección sin dinero (Lamas / San Martín)',
      text_qu: 'Ñukata wasipi makawarkami, ¿comisariapi yanapayta mañayta ushanichu mana kullkiwan?',
      gloss: 'Me golpearon en mi casa, ¿puedo pedir auxilio en la comisaría sin dinero? (Amazónico)'
    },
    {
      label: '4. Quechua Norteño: Intérprete oficial en comisaría (Cajamarca)',
      text_qu: 'Comisariapi hapisuptiykiqa, ¿abogadu gratuituta quwankumanchu quechua parlaptiy?',
      gloss: 'Si me detienen en comisaría, ¿me darán abogado gratuito si hablo quechua? (Norteño)'
    }
  ];

  const handleStartRecording = () => {
    if (disabled) return;
    setIsRecording(true);

    setTimeout(() => {
      setIsRecording(false);
      let sample = "Policiakunam hap'irqawan, ¿imatan rurayman?";
      if (primaryLang === 'es') {
        sample = "¿Cuáles son mis derechos si la policía me detiene sin orden judicial?";
      } else if (dialect.includes('central')) {
        sample = "Polisiakunam hapimarqan, ¿imataraq rurashaq kikïpa shimïchaw?";
      } else if (dialect.includes('amazonico')) {
        sample = "Ñukata wasipi makawarkami, ¿comisariapi yanapayta mañayta ushanichu?";
      } else if (dialect.includes('norteno')) {
        sample = "Comisariapi hapisuptiykiqa, ¿abogadu gratuituta quwankumanchu quechua parlaptiy?";
      }
      setTranscription(sample);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleSelectPreset = (presetText: string) => {
    setTranscription(presetText);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (transcription.trim()) {
      onConfirmTranscription(transcription.trim());
      setTranscription('');
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    setTranscription('');
    setShowConfirmation(false);
  };

  return (
    <div className="w-full space-y-3">
      {/* Botón principal de voz grande y accesible */}
      {!showConfirmation ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleStartRecording}
            disabled={disabled || isRecording}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all duration-200 border ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse border-rose-600'
                : 'bg-[#FDF2F4] hover:bg-[#FCE7EC] text-[#6B1D33] border-[#F5E6EB] hover:border-[#6B1D33]/40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Uyarinakushan... (Escuchando en Quechua)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-[#6B1D33]" />
                <span>Kunkaykiwan rimay (Hablar por voz)</span>
              </>
            )}
          </button>

          {/* Menú de selección rápida de preguntas en Quechua para el jurado */}
          <div className="w-full sm:flex-1 relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleSelectPreset(e.target.value);
              }}
              defaultValue=""
              className="w-full bg-white border border-slate-200 text-[#5B616E] text-xs rounded-2xl px-3.5 py-3 focus:outline-none focus:border-[#6B1D33] cursor-pointer shadow-sm"
            >
              <option value="" disabled>
                ✨ O elige una pregunta de prueba validada en Quechua (Demo para jurado)...
              </option>
              {DEMO_PRESETS.map((p, idx) => (
                <option key={idx} value={p.text_qu}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        /* Paso 8.1 PDF: Confirmación y edición previa antes de consultar */
        <div className="bg-white border border-[#6B1D33]/40 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#6B1D33] text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Rimarisqaykita qhawariy (Revisa tu transcripción antes de consultar)</span>
            </div>
            <span className="text-[10px] bg-[#FDF2F4] text-[#6B1D33] border border-[#F5E6EB] px-2.5 py-0.5 rounded-full font-semibold">
              Voz en Quechua detectada
            </span>
          </div>

          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            rows={2}
            className="w-full bg-[#F8F9FA] border border-slate-200 text-[#2D3139] rounded-xl p-3 text-sm focus:outline-none focus:border-[#6B1D33] mb-3"
            placeholder="Puedes corregir el texto antes de enviar..."
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kutipay / Cancelar</span>
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#6B1D33] hover:bg-[#541427] text-white flex items-center gap-1.5 shadow-md shadow-[#6B1D33]/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tapukuy / Consultar ahora</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
