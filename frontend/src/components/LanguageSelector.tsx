import React from 'react';
import { Globe, Lock } from 'lucide-react';
import type { QuechuaDialect } from '../types';
import { QUECHUA_BRANCHES } from '../constants/dialects';

interface Props {
  currentDialect: QuechuaDialect;
  onSelectDialect: (dialect: QuechuaDialect) => void;
  primaryLang: 'qu' | 'es';
  onSelectPrimaryLang: (lang: 'qu' | 'es') => void;
}

export const LanguageSelector: React.FC<Props> = ({
  currentDialect,
  onSelectDialect,
  primaryLang,
  onSelectPrimaryLang
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl p-1.5 px-3 shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B616E]">
        <Globe className="w-4 h-4 text-[#6B1D33]" />
        <span className="hidden sm:inline">Idioma:</span>
      </div>

      <div className="flex rounded-xl bg-[#F8F9FA] p-0.5 border border-slate-200">
        <button
          onClick={() => onSelectPrimaryLang('qu')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            primaryLang === 'qu'
              ? 'bg-[#6B1D33] text-white shadow-xs'
              : 'text-[#5B616E] hover:text-[#2D3139]'
          }`}
        >
          Quechua
        </button>
        <button
          onClick={() => onSelectPrimaryLang('es')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            primaryLang === 'es'
              ? 'bg-[#6B1D33] text-white shadow-xs'
              : 'text-[#5B616E] hover:text-[#2D3139]'
          }`}
        >
          Español
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 hidden sm:block" />

      {/* Regla estricta: Si está seleccionado Español, no debe permitir elegir variante de quechua */}
      {primaryLang === 'es' ? (
        <div 
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/90 border border-slate-200 text-slate-400 text-xs font-medium cursor-not-allowed select-none"
          title="Las variantes dialectales de Quechua no aplican al consultar en Español. Cambia el idioma a Quechua para elegir entre las 4 ramas."
        >
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Variante Quechua: <strong className="text-slate-500 font-semibold">No aplica en Español</strong></span>
        </div>
      ) : (
        <select
          value={currentDialect}
          onChange={(e) => onSelectDialect(e.target.value as QuechuaDialect)}
          className="bg-[#F8F9FA] border border-slate-200 text-[#3E434D] text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-[#6B1D33] font-medium cursor-pointer"
          title="Selecciona la rama y variante del Quechua para adecuar el significado, morfología y respuesta legal"
        >
          {QUECHUA_BRANCHES.map(branch => (
            <optgroup key={branch.id} label={`${branch.label} (${branch.regions.slice(0, 3).join(', ')})`}>
              {branch.variants.map(variant => (
                <option key={variant.id} value={variant.id}>
                  {variant.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}
    </div>
  );
};
