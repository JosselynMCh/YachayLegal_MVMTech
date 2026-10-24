import React, { useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { audioService } from '../services/audio';

interface Props {
  textToSpeak: string;
  lang?: string;
  label?: string;
}

export const AudioPlayer: React.FC<Props> = ({ textToSpeak, lang = 'es-PE', label = 'Uyariy / Escuchar' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    if (isPlaying) {
      audioService.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioService.speakText(textToSpeak, lang, () => {
        setIsPlaying(false);
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-sm ${
        isPlaying
          ? 'bg-[#FCE7EC] border-[#6B1D33] text-[#6B1D33] animate-pulse'
          : 'bg-[#FDF2F4] hover:bg-[#FCE7EC] border-[#F5E6EB] text-[#6B1D33] hover:border-[#6B1D33]/40'
      }`}
      title="Reproducir audio en voz pausada y clara"
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current text-[#6B1D33]" />
          <span>Sayachiy / Detener</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#6B1D33]" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
