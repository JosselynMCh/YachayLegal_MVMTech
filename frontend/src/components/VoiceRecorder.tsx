import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Sparkles, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { QuechuaDialect } from '../types';

interface Props {
  onConfirmTranscription: (text: string) => void;
  disabled?: boolean;
  primaryLang?: 'qu' | 'es';
  dialect?: QuechuaDialect;
}

// Tipado básico para la Web Speech Recognition API
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

function createSpeechRecognition(): ISpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return new SR();
}

export const VoiceRecorder: React.FC<Props> = ({
  onConfirmTranscription,
  disabled = false,
  primaryLang = 'qu',
  dialect = 'quechua_chanka'
}) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const speechSupported = isSpeechRecognitionSupported();

  // Limpiar reconocimiento al desmontar
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Preguntas demo según idioma y dialecto
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
    setVoiceError(null);

    if (!speechSupported) {
      // Fallback: texto de demo
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sample = primaryLang === 'es'
          ? "¿Cuáles son mis derechos si la policía me detiene sin orden judicial?"
          : dialect.includes('central')
            ? "Polisiakunam hapimarqan, ¿imataraq rurashaq kikïpa shimïchaw?"
            : dialect.includes('amazonico')
              ? "Ñukata wasipi makawarkami, ¿comisariapi yanapayta mañayta ushanichu?"
              : dialect.includes('norteno')
                ? "Comisariapi hapisuptiykiqa, ¿abogadu gratuituta quwankumanchu quechua parlaptiy?"
                : "Policiakunam hap'irqawan, ¿imatan rurayman?";
        setTranscription(sample);
        setShowConfirmation(true);
      }, 1500);
      return;
    }

    // Web Speech Recognition real
    const recognition = createSpeechRecognition();
    if (!recognition) return;

    // Intentar usar el idioma apropiado; quechua no tiene soporte oficial en la mayoría de navegadores → fallback a es-PE
    recognition.lang = primaryLang === 'es' ? 'es-PE' : 'es-PE'; // es-PE como proxy
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscription(result);
      setShowConfirmation(true);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        setVoiceError(t('voice.permission_denied'));
      } else if (event.error === 'no-speech') {
        // Sin voz detectada: mostrar preset
        setVoiceError(null);
        setTranscription('');
      } else {
        setVoiceError(t('voice.mic_error'));
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setVoiceError(t('voice.mic_error'));
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSelectPreset = (presetText: string) => {
    setTranscription(presetText);
    setShowConfirmation(true);
    setVoiceError(null);
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
      {!speechSupported && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t('voice.no_support')}</span>
        </div>
      )}

      {voiceError && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {!showConfirmation ? (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={disabled}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all duration-200 border ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse border-rose-600'
                : 'bg-[#FDF2F4] hover:bg-[#FCE7EC] text-[#6B1D33] border-[#F5E6EB] hover:border-[#6B1D33]/40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isRecording ? t('voice.listening') : t('voice.start')}
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>{t('voice.listening')}</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-[#6B1D33]" />
                <span>{t('voice.start')}</span>
              </>
            )}
          </button>

          {/* Selector de preguntas demo */}
          <div className="w-full sm:flex-1 relative">
            <select
              onChange={(e) => {
                if (e.target.value) handleSelectPreset(e.target.value);
                e.target.value = '';
              }}
              defaultValue=""
              className="w-full bg-white border border-slate-200 text-[#5B616E] text-xs rounded-2xl px-3.5 py-3 focus:outline-none focus:border-[#6B1D33] cursor-pointer shadow-sm"
            >
              <option value="" disabled>
                {primaryLang === 'qu' ? t('voice.preset_placeholder_qu') : t('voice.preset_placeholder_es')}
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
        /* Confirmación y edición previa antes de consultar */
        <div className="bg-white border border-[#6B1D33]/40 rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#6B1D33] text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{t('voice.review_label')}</span>
            </div>
            <span className="text-[10px] bg-[#FDF2F4] text-[#6B1D33] border border-[#F5E6EB] px-2.5 py-0.5 rounded-full font-semibold">
              {primaryLang === 'qu' ? t('voice.detected_qu') : t('voice.detected_es')}
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
              <span>{t('voice.cancel')}</span>
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#6B1D33] hover:bg-[#541427] text-white flex items-center gap-1.5 shadow-md shadow-[#6B1D33]/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('voice.confirm')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
