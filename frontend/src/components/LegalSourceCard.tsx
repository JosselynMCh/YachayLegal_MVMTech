import React from 'react';
import { ExternalLink, ShieldCheck, Scale } from 'lucide-react';
import type { SourceCitation } from '../types';

interface Props {
  source: SourceCitation;
}

export const LegalSourceCard: React.FC<Props> = ({ source }) => {
  return (
    <div className="bg-white border border-slate-200/90 hover:border-[#6B1D33]/40 rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FDF2F4] text-[#6B1D33] border border-[#F8E1E6]">
            <Scale className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E2B47] block">
              {source.issuer}
            </span>
            <h4 className="text-sm font-bold text-[#2D3139]">{source.article}</h4>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#E8F6EE] border border-[#D4EEDB] text-[#20724F] text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
          <ShieldCheck className="w-3 h-3" />
          <span>Oficial SPIJ</span>
        </div>
      </div>

      <p className="text-xs text-[#5B616E] font-medium mb-3">
        {source.title} {source.publication_date && <span className="text-slate-400">({source.publication_date})</span>}
      </p>

      {source.article_content && (
        <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-slate-200/60 mb-3 text-xs text-[#3E434D] leading-relaxed font-serif italic border-l-3 border-l-[#6B1D33]">
          "{source.article_content}"
        </div>
      )}

      <a
        href={source.official_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B1D33] hover:text-[#541427] hover:underline transition-colors"
      >
        <span>Ver en Sistema Peruano de Información Jurídica (SPIJ)</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};
