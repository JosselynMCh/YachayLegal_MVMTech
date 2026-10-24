import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import qu from './locales/qu.json';

// Recuperar idioma persistido en localStorage, con fallback a 'qu' (quechua por defecto)
const savedLang = localStorage.getItem('yachay_primary_lang') || 'qu';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      qu: { translation: qu }
    },
    lng: savedLang,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false  // React ya escapa por defecto
    },
    // No usar detector de idioma del navegador; el idioma lo controla la UI
    detection: undefined
  });

export default i18n;

/**
 * Cambia el idioma de la interfaz y lo persiste en localStorage.
 * Debe llamarse cada vez que el usuario cambie el idioma en la UI.
 */
export function changeLang(lang: 'es' | 'qu') {
  i18n.changeLanguage(lang);
  localStorage.setItem('yachay_primary_lang', lang);
}

/**
 * Recupera la selección de idioma guardada (o 'qu' por defecto).
 */
export function getSavedLang(): 'es' | 'qu' {
  const saved = localStorage.getItem('yachay_primary_lang');
  return (saved === 'es' || saved === 'qu') ? saved : 'qu';
}

/**
 * Recupera la variante quechua guardada (o 'quechua_chanka' por defecto).
 */
export function getSavedDialect(): string {
  return localStorage.getItem('yachay_dialect') || 'quechua_chanka';
}

/**
 * Persiste la variante quechua seleccionada.
 */
export function saveDialect(dialect: string) {
  localStorage.setItem('yachay_dialect', dialect);
}
