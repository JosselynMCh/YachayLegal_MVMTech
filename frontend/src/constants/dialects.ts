import type { BranchInfo, QuechuaBranch, QuechuaDialect, VariantInfo } from '../types';

export const QUECHUA_BRANCHES: BranchInfo[] = [
  {
    id: 'sureno',
    label: 'Quechua Sureño',
    regions: ['Ayacucho', 'Huancavelica', 'Apurímac', 'Cusco', 'Puno', 'Arequipa', 'Moquegua'],
    description: 'La rama más difundida. Comprende el Chanka y el Cusco-Collao.',
    variants: [
      {
        id: 'quechua_chanka',
        branch: 'sureno',
        label: 'Chanka (Ayacucho/Huancavelica/Apurímac)',
        iso: 'quy',
        regions: ['Ayacucho', 'Huancavelica', 'Apurímac'],
        features: 'Sin aspiradas ni glotalizadas; progresivo -chka-; 1.ª pl. -nchik; subordinador -pti-.'
      },
      {
        id: 'quechua_cusco_collao',
        branch: 'sureno',
        label: 'Cusco-Collao (Cusco/Puno/Arequipa/Moquegua)',
        iso: 'quz',
        regions: ['Cusco', 'Puno', 'Arequipa', 'Moquegua', 'Apurímac'],
        features: "Aspiradas (ph, kh, qh) y glotalizadas (p', k', q'); progresivo -sha-; -nchis; subordinador -qti-."
      }
    ]
  },
  {
    id: 'central',
    label: 'Quechua Central',
    regions: ['Junín', 'Pasco', 'Huánuco', 'Áncash', 'Lima (provincias)'],
    description: 'Variedad central con alargamiento vocálico (-aa) y sufijos -chaw y -tsu.',
    variants: [
      {
        id: 'quechua_central_ancash',
        branch: 'central',
        label: 'Áncash (Huaylas - Conchucos)',
        iso: 'qwh',
        regions: ['Áncash'],
        features: 'Locativo -chaw; negación -tsu; 1.ª pl. -ntsik; 1.ª persona con vocal larga (-aa).'
      },
      {
        id: 'quechua_central_huanuco_pasco',
        branch: 'central',
        label: 'Huánuco - Pasco',
        iso: 'qub',
        regions: ['Huánuco', 'Pasco'],
        features: 'Rasgos centrales: -chaw, -tsu, objeto de 2.ª persona -shu-.'
      },
      {
        id: 'quechua_central_junin_lima',
        branch: 'central',
        label: 'Junín - Lima (Wanka / Yauyos)',
        iso: 'qvw',
        regions: ['Junín', 'Lima (parte)'],
        features: 'Rasgos centrales; en Wanka la r suele pronunciarse l (limay = hablar).'
      }
    ]
  },
  {
    id: 'norteno',
    label: 'Quechua Norteño',
    regions: ['Cajamarca', 'Lambayeque (Inkawasi-Kañaris)'],
    description: 'Variedades de Cajamarca y de Inkawasi-Kañaris.',
    variants: [
      {
        id: 'quechua_norteno_cajamarca',
        branch: 'norteno',
        label: 'Cajamarca',
        iso: 'qvc',
        regions: ['Cajamarca'],
        features: 'Progresivo -chka-; locativo -pi; léxico propio del norte (parlay).'
      },
      {
        id: 'quechua_norteno_inkawasi',
        branch: 'norteno',
        label: 'Inkawasi - Kañaris (Lambayeque)',
        iso: 'quf',
        regions: ['Lambayeque'],
        features: 'Variedad norteña de Lambayeque con rasgos propios y contacto regional.'
      }
    ]
  },
  {
    id: 'amazonico',
    label: 'Quechua Amazónico',
    regions: ['Loreto', 'San Martín', 'Amazonas', 'Madre de Dios'],
    description: 'Variedades de selva: quechua lamista y kichwa del Napo y Pastaza.',
    variants: [
      {
        id: 'quechua_amazonico_lamas',
        branch: 'amazonico',
        label: 'Lamista (San Martín / Amazonas)',
        iso: 'qvs',
        regions: ['San Martín', 'Amazonas'],
        features: 'Sin oposición k/q; pronombre ñuka; participio -shka; léxico amazónico.'
      },
      {
        id: 'quechua_amazonico_napo',
        branch: 'amazonico',
        label: 'Napo - Pastaza (Loreto / Madre de Dios)',
        iso: 'qvo',
        regions: ['Loreto', 'Madre de Dios'],
        features: 'Kichwa amazónico: ñuka, imashina, finalidad -nkapak, subordinador -kpi-.'
      }
    ]
  }
];

export const ALL_VARIANTS: VariantInfo[] = QUECHUA_BRANCHES.flatMap(b => b.variants);

export function getVariantInfo(dialectId: QuechuaDialect | string | undefined | null): VariantInfo | undefined {
  if (!dialectId) return undefined;
  return ALL_VARIANTS.find(v => v.id === dialectId);
}

export function getVariantLabel(dialectId: QuechuaDialect | string | undefined | null): string {
  const v = getVariantInfo(dialectId);
  if (!v) return 'Quechua General';
  const branch = QUECHUA_BRANCHES.find(b => b.id === v.branch);
  return `${branch ? branch.label + ' · ' : ''}${v.label}`;
}

export function getBranchByVariant(dialectId: QuechuaDialect | string | undefined | null): QuechuaBranch {
  const v = getVariantInfo(dialectId);
  return v ? v.branch : 'sureno';
}
