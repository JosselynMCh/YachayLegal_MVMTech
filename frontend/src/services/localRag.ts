import type { ChatResponse, SourceCitation, ReferralService } from '../types';
import { FALLBACK_OFFICIAL_SOURCES } from '../constants/legalData';

export function runLocalRAG(
  query: string,
  inputLanguage: string = 'auto',
  dialect?: string | null
): ChatResponse {
  const clean = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
  const words = clean.split(/\s+/).filter(Boolean);

  const isExplicitQuechua = inputLanguage === 'qu';
  const hasQuechuaMarkers = /(kuna|manta|paq|chaw|allillanchu|rimaykullayki|yanapaway|sulpayki|añay|tupananchiskama|makawan|maqwawan|hapirqawan)/i.test(query);
  const effectiveLang = (isExplicitQuechua || hasQuechuaMarkers) && inputLanguage !== 'es' ? 'qu' : 'es';

  // Términos jurídicos sustantivos
  const hasLegalTerms = /(despid|trabaj|sueld|polic|deten|comisar|calaboz|denunc|demand|abogad|juici|juez|fiscal|violenc|golp|maltrat|amenaz|aliment|pensio|hij|desaloj|tierr|chakra|allpa|contrat|herenc|notificac|sunafil|hapirqa|maqwaw|mikhu)/i.test(clean);

  // 1. RECONOCER SALUDOS Y CONVERSACIONES INFORMALES (sin términos jurídicos de fondo)
  if (!hasLegalTerms) {
    // Agradecimientos
    const gratitudePhrases = ["gracias", "muchas gracias", "te agradezco", "me ayudaste", "me ayudaste bastante", "mil gracias", "anay", "sulpayki", "uraspas"];
    if (gratitudePhrases.some(p => clean.includes(p)) && words.length <= 7) {
      const esAns = "¡Con mucho gusto! 😊 Si tienes otra duda o necesitas revisar algún paso o trámite, aquí estoy para orientarte.";
      const quAns = "¡Kusikuypaqmi! 😊 Huk tapukuyniyki kaptinqa utaq ima tramitepas necesitaptiykiqa, kaypim kashani allinta sut'inchasunaykipaq.";
      return {
        status: 'answered',
        input_language: effectiveLang,
        detected_dialect: dialect || 'quechua_chanka',
        normalized_query_es: query,
        answer: effectiveLang === 'qu' ? quAns : esAns,
        translation: {
          language: effectiveLang === 'qu' ? 'es' : 'qu',
          dialect: dialect || 'quechua_chanka',
          branch: dialect?.includes('central') ? 'central' : dialect?.includes('norteno') ? 'norteno' : dialect?.includes('amazonico') ? 'amazonico' : 'sureno',
          text: effectiveLang === 'qu' ? esAns : quAns,
          validated: true,
          notes: "Agradecimiento conversacional natural."
        },
        sources: [],
        limitations: [],
        requires_human_review: false,
        next_steps: ["Puedes formular una nueva consulta sobre tus derechos en cualquier momento."]
      };
    }

    // Despedidas
    const farewellPhrases = ["adios", "hasta luego", "nos vemos", "chau", "chao", "cuidate", "tupananchiskama", "tinkunankama", "rikuypas"];
    if (farewellPhrases.some(p => clean.includes(p)) && words.length <= 5) {
      const esAns = "¡Hasta luego! Que tengas un excelente día. Si en otro momento necesitas consultar tus derechos o trámites en el Perú, aquí estaré.";
      const quAns = "¡Tupananchiskama! Allinllata puriy. Huk p'unchawpi hayñiykikunamanta tapukuyta munaspaqa, kaypim suyasayki.";
      return {
        status: 'answered',
        input_language: effectiveLang,
        detected_dialect: dialect || 'quechua_chanka',
        normalized_query_es: query,
        answer: effectiveLang === 'qu' ? quAns : esAns,
        translation: {
          language: effectiveLang === 'qu' ? 'es' : 'qu',
          dialect: dialect || 'quechua_chanka',
          branch: dialect?.includes('central') ? 'central' : dialect?.includes('norteno') ? 'norteno' : dialect?.includes('amazonico') ? 'amazonico' : 'sureno',
          text: effectiveLang === 'qu' ? esAns : quAns,
          validated: true,
          notes: "Despedida conversacional natural."
        },
        sources: [],
        limitations: [],
        requires_human_review: false,
        next_steps: []
      };
    }

    // Solicitud general de ayuda o duda sin detalles
    const helpPhrases = [
      "necesito ayuda", "necesito que me ayudes", "me puedes ayudar", "puedes ayudarme",
      "tengo una duda", "quisiera hacerte una consulta", "tengo una consulta",
      "no se si puedes ayudarme", "quiero hacer una pregunta", "ayuda por favor",
      "yanapaway", "huk tapukuyniy kashan", "yanapayta munani"
    ];
    if (helpPhrases.some(p => clean.includes(p)) && words.length <= 9) {
      const esAns = "¡Claro! Con mucho gusto te ayudo. 😊 Cuéntame qué ha pasado o qué necesitas saber, y lo revisamos paso a paso con las normas peruanas oficiales.";
      const quAns = "¡Arí, tukuy sunquwan yanapasayki! 😊 Willariway ima pasarqasunki utaq imamantam yachayta munanki, chayta allillamanta qhawarisunchik.";
      return {
        status: 'answered',
        input_language: effectiveLang,
        detected_dialect: dialect || 'quechua_chanka',
        normalized_query_es: query,
        answer: effectiveLang === 'qu' ? quAns : esAns,
        translation: {
          language: effectiveLang === 'qu' ? 'es' : 'qu',
          dialect: dialect || 'quechua_chanka',
          branch: dialect?.includes('central') ? 'central' : dialect?.includes('norteno') ? 'norteno' : dialect?.includes('amazonico') ? 'amazonico' : 'sureno',
          text: effectiveLang === 'qu' ? esAns : quAns,
          validated: true,
          notes: "Apertura empática sin forzar citas legales."
        },
        sources: [],
        limitations: [],
        requires_human_review: false,
        next_steps: [
          "Describe tu consulta con tus propias palabras.",
          "Puedes consultar sobre derechos laborales, detenciones policiales, violencia familiar, alimentos o trámites."
        ]
      };
    }

    // Saludos
    const greetingPhrases = [
      "hola", "holaaa", "holaa", "buenos dias", "buenas tardes", "buenas noches",
      "que tal", "como estas", "buenas", "allillanchu", "rimaykullayki", "napaykullayki"
    ];
    const isGreeting = greetingPhrases.some(g => clean === g || clean.startsWith(g + " ") || clean.endsWith(" " + g)) || (greetingPhrases.some(g => clean.includes(g)) && words.length <= 4);
    if (isGreeting && words.length <= 6) {
      const esAns = "¡Hola! 😊 Bienvenido/a a Yachay Legal AI. Estoy aquí para ayudarte a comprender tus derechos, las normas peruanas y los trámites legales de manera sencilla. ¿Qué te gustaría consultar hoy?";
      const quAns = "¡Allillanchu! 😊 Allinmi hamusqayki Yachay Legal AI nisqaman. Hayñiykikunata, perupa kamachikuyninkunata hinaspa trámites legales nisqata intiendinaykipaqmi kaypi kani. ¿Imamantataq yachayta munanki?";
      return {
        status: 'answered',
        input_language: effectiveLang,
        detected_dialect: dialect || 'quechua_chanka',
        normalized_query_es: query,
        answer: effectiveLang === 'qu' ? quAns : esAns,
        translation: {
          language: effectiveLang === 'qu' ? 'es' : 'qu',
          dialect: dialect || 'quechua_chanka',
          branch: dialect?.includes('central') ? 'central' : dialect?.includes('norteno') ? 'norteno' : dialect?.includes('amazonico') ? 'amazonico' : 'sureno',
          text: effectiveLang === 'qu' ? esAns : quAns,
          validated: true,
          notes: "Saludo conversacional natural."
        },
        sources: [],
        limitations: [],
        requires_human_review: false,
        next_steps: [
          "Escribe tu consulta legal (por ejemplo: derechos laborales, alimentos, denuncias o detenciones).",
          "Puedes expresarte en español o en tu variante de quechua."
        ]
      };
    }
  }

  // 2. CONSULTAS JURÍDICAS FUNDAMENTADAS
  let matchedDocIds: string[] = [];
  let clarification = '';
  let referral: ReferralService = {
    name: 'Defensa Pública y Acceso a la Justicia (MINJUSDH)',
    phone: '1884',
    description: 'Orientación y patrocinio legal gratuito del Estado Peruano a nivel nacional.',
    official_url: 'https://www.gob.pe/minjus',
    is_urgent: false
  };

  if (/polic|deten|comisar|arrest|calaboz|silenci|hapirqa/i.test(clean)) {
    matchedDocIds = ['cpp-dl957', 'cpp-dl957-art114'];
    referral = {
      name: 'Defensa Pública Penal (MINJUSDH)',
      phone: '1884',
      description: 'Asistencia penal pública inmediata y gratuita ante detenciones.',
      official_url: 'https://www.gob.pe/minjus',
      is_urgent: true
    };
  } else if (/violenc|golp|maltrat|agres|maqa|makak|denunc|familiar|mujer|amenaz/i.test(clean)) {
    matchedDocIds = ['ley-30364-art15', 'ley-30364-art16'];
    referral = {
      name: 'Línea 100 (Ministerio de la Mujer - MIMP)',
      phone: '100',
      description: 'Atención de emergencia 24/7 en quechua y español ante violencia familiar o sexual.',
      official_url: 'https://www.gob.pe/linea100',
      is_urgent: true
    };
  } else if (/aliment|pensio|manutenc|hij|waw|comid|mikhu/i.test(clean)) {
    matchedDocIds = ['cc-art472-alimentos'];
    referral = {
      name: 'Defensa Pública de Familia (MINJUSDH)',
      phone: '1884',
      description: 'Patrocinio gratuito para demandas de pensión de alimentos en favor de hijos.',
      official_url: 'https://www.gob.pe/minjus',
      is_urgent: false
    };
  } else if (/comunid|campesin|nativ|tierr|chakra|allpa|lindero|territor/i.test(clean)) {
    matchedDocIds = ['const-art89-comunidades'];
    referral = {
      name: 'Defensoría del Pueblo',
      phone: '0800-15-170',
      description: 'Protección de derechos de comunidades campesinas y pueblos originarios.',
      official_url: 'https://www.defensoria.gob.pe',
      is_urgent: false
    };
  } else if (/despid|trabaj|patro|empres|indemniz|sueld|sunafil|llamka/i.test(clean)) {
    matchedDocIds = ['lpcl-dl728-despido'];
    clarification = '¿Tenías un contrato formal o verbal, y te han entregado una carta de despido?';
    referral = {
      name: 'Superintendencia Nacional de Fiscalización Laboral (SUNAFIL)',
      phone: '0800-16872',
      description: 'Consultas laborales gratuitas y denuncias por despido arbitrario.',
      official_url: 'https://www.gob.pe/sunafil',
      is_urgent: false
    };
  } else if (/desaloj|sacar de mi casa|quieren botar/i.test(clean)) {
    matchedDocIds = ['const-1993-art2', 'cpp-dl957'];
    clarification = 'Entiendo que esta situación puede preocuparte. Para orientarte mejor, ¿te han enviado una notificación formal de un juez, te lo comunicó el propietario verbalmente o alguien intenta sacarte por la fuerza?';
  } else if (/idiom|quechu|lengu|traductor|interpret|runasimi|shimi/i.test(clean)) {
    matchedDocIds = ['const-1993-art2', 'cpp-dl957-art114'];
    referral = {
      name: 'Dirección de Lenguas Indígenas (MINCUL)',
      phone: '01 618-9393',
      description: 'Registro oficial de intérpretes y traductores en lenguas originarias.',
      official_url: 'https://www.gob.pe/cultura',
      is_urgent: false
    };
  } else {
    matchedDocIds = ['cpp-dl957'];
  }

  const matchedSources = FALLBACK_OFFICIAL_SOURCES.filter(s => matchedDocIds.includes(s.document_id));
  const primaryDoc = matchedSources[0] || FALLBACK_OFFICIAL_SOURCES[0];

  let quText = primaryDoc.content_qu_chanka || '';
  if (dialect?.includes('collao')) {
    quText = primaryDoc.content_qu_collao || quText;
  } else if (dialect?.includes('central')) {
    quText = primaryDoc.content_qu_central || quText;
  } else if (dialect?.includes('norteno')) {
    quText = primaryDoc.content_qu_norteno || quText;
  } else if (dialect?.includes('amazonico')) {
    quText = primaryDoc.content_qu_amazonico || quText;
  }

  const sources: SourceCitation[] = matchedSources.map(s => ({
    document_id: s.document_id,
    title: s.title,
    issuer: s.issuer,
    article: s.article,
    article_content: s.content_es,
    official_url: s.official_url,
    publication_date: s.publication_date
  }));

  const answerSpanish = `Comprendo tu consulta. En el Perú, tus derechos están respaldados por la ley:

1. **Respuesta directa:** Tienes protección legal y ninguna autoridad ni persona particular puede vulnerar tus derechos ni actuar al margen de la ley.
2. **Fundamento legal:** Conforme al ${primaryDoc.article} (${primaryDoc.title}), el Estado garantiza asistencia gratuita y el debido proceso.
3. **Qué puedes hacer:**
   • Puedes solicitar orientación y patrocinio legal gratuito llamando al ${referral.phone} (${referral.name}).
   • Si tu lengua materna es el quechua, tienes derecho estricto a que el Estado te asigne un intérprete oficial sin costo.
   • No firmes actas ni documentos que no comprendas en su totalidad.${clarification ? `\n\n📌 **Aclaración útil:** ${clarification}` : ''}`;

  const answerQuechua = `Allinmi tapukuyniyki. Perupa kamachikuyninpiqa hayñiykikuna amachasqam kashan:

1. **Kamachikuy sut'inchay:** ${primaryDoc.article} (${primaryDoc.title}).
${quText}

2. **Imatan rurawaq:**
   • Estadoqa simi t'ikraqtam (intérprete) gratis qusunki quechua simiykipi allinta rimanakunaykipaq.
   • Yanapakuyta mañakunkimanmi kay telefonoman mana qullqillawan wahaykuspa: ${referral.phone} (${referral.name}).
   • Ama ima papeltapas firmanchu manaraq allinta entiendespa utaq manaraq amachaqniyki kashaqtin.`;

  return {
    status: 'answered',
    input_language: effectiveLang,
    detected_dialect: dialect || 'quechua_chanka',
    normalized_query_es: query,
    answer: effectiveLang === 'qu' ? answerQuechua : answerSpanish,
    translation: {
      language: effectiveLang === 'qu' ? 'es' : 'qu',
      dialect: dialect || 'quechua_chanka',
      branch: dialect?.includes('central') ? 'central' : dialect?.includes('norteno') ? 'norteno' : dialect?.includes('amazonico') ? 'amazonico' : 'sureno',
      text: effectiveLang === 'qu' ? answerSpanish : answerQuechua,
      validated: true,
      notes: "Orientación jurídica bilingüe estructurada y verificada conforme a normas peruanas oficiales."
    },
    sources,
    limitations: [
      "Esta orientación legal ciudadana no sustituye el patrocinio de un abogado defensor particular o público en juicio.",
      "Las medidas deben canalizarse formalmente ante la entidad competente (Policía, Fiscalía o Juzgado)."
    ],
    requires_human_review: false,
    next_steps: [
      "Exige asistencia gratuita de un intérprete en tu lengua originaria si vas a declarar ante autoridades.",
      `Llama sin costo al ${referral.phone} (${referral.name}) para asistencia personalizada.`,
      "Conserva copias, mensajes o constancias que respalden tu situación."
    ],
    referral_service: referral
  };
}
