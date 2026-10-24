export const audioService = {
  speakText(text: string, lang: string = 'es-PE', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Síntesis de voz no soportada por el navegador.');
      return;
    }

    window.speechSynthesis.cancel(); // Detener audios anteriores

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Habla pausada y clara
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeechRecognitionSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
};
