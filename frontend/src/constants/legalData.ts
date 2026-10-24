import type { LegalServiceInfo } from '../types';

export interface LegalCorpusItem {
  document_id: string;
  title: string;
  issuer: string;
  official_url: string;
  article: string;
  publication_date?: string;
  category?: string;
  content_es?: string;
  content_qu_chanka?: string;
  content_qu_collao?: string;
  content_qu_central?: string;
  content_qu_norteno?: string;
  content_qu_amazonico?: string;
  article_content?: string;
}

export const FALLBACK_LEGAL_SERVICES: LegalServiceInfo[] = [
  {
    id: "defensa-publica",
    name: "Defensa Pública y Acceso a la Justicia (MINJUSDH)",
    phone: "1884",
    channel: "Fono 1884 (Gratuito a nivel nacional)",
    languages: ["Español", "Quechua", "Aymara"],
    coverage: "Nacional - 34 Direcciones Distritales",
    description: "Defensa penal pública gratuita obligatoria para imputados y víctimas en situación de vulnerabilidad o falta de recursos.",
    official_url: "https://www.gob.pe/minjus"
  },
  {
    id: "linea-100",
    name: "Línea 100 - Ayuda contra la violencia familiar y sexual (MIMP)",
    phone: "100",
    channel: "Línea telefónica 100 (Atención 24/7 sin costo)",
    languages: ["Español", "Quechua Chanka", "Quechua Collao", "Aymara"],
    coverage: "Nacional",
    description: "Servicio telefónico gratuito especializado en brindar información, orientación, consejería y soporte emocional a personas afectadas por violencia familiar o sexual.",
    official_url: "https://www.gob.pe/linea100"
  },
  {
    id: "defensoria-pueblo",
    name: "Defensoría del Pueblo del Perú",
    phone: "0800-15-170",
    channel: "Línea gratuita 0800-15-170",
    languages: ["Español", "Quechua"],
    coverage: "Nacional - Oficinas Defensoriales",
    description: "Protección y defensa de derechos fundamentales de las personas y supervisión del cumplimiento de los deberes de la administración estatal.",
    official_url: "https://www.defensoria.gob.pe"
  }
];

export const FALLBACK_OFFICIAL_SOURCES: LegalCorpusItem[] = [
  {
    document_id: "cpp-dl957",
    title: "Código Procesal Penal - Decreto Legislativo Nº 957",
    issuer: "Congreso de la República / Presidencia",
    official_url: "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H872583",
    article: "Artículo 71: Derechos del imputado",
    publication_date: "2004-07-29",
    category: "debido_proceso",
    content_es: `1. El imputado puede hacer valer por sí mismo o a través de su Abogado Defensor, los derechos que la Constitución y las Leyes le conceden, desde el inicio de las primeras diligencias.
2. Los jueces, los fiscales o la policía deben hacer saber al imputado de manera inmediata y comprensible que tiene derecho a:
a) Conocer los cargos formulados en su contra y la orden de detención dictada;
b) Designar a la persona o institución a la que debe comunicarse su detención de manera inmediata;
c) Ser asistido desde los primeros actos de investigación por un Abogado Defensor;
d) Abstenerse de declarar (guardar silencio);
e) Que no se emplee en su contra medios coactivos, intimidatorios ni métodos que afecten su dignidad;
f) Ser asistido gratuitamente por un traductor o intérprete oficial si no comprende o no se expresa en idioma castellano.`,
    content_qu_chanka: `Art. 71 Kamachikuy: Hark'asqa / Imputado nisqapa hayñinkuna.
Pipis policiapa harkasqan kaspaqa kay hayñikunatam yachan:
1. Allinta yachay imaraykum hapisurqanki.
2. Aylluykiman utaq amiguykiman chaylla willachiy.
3. Amachaq (abogado) defensor nisqawan yanapachikuy; manachus qullqiyki kanchu chayqa, Estadoqa qallarinanmantapacham qusunki.
4. Upallakuy hayñi: Manam rimankichu manaraq amachaqniyki kashaqtinqa.
5. Simi t'ikraq (intérprete oficial) gratuita nisqatam mañakunki: Mana castellano rimaptiykiqa, quechua simiykipi intiendichisunki.
6. Manam pipis maqwankimanchu nitaq mana allinta rurankimanchu.`,
    content_qu_collao: `Art. 71 Kamachikuy: Hark'asqa runaq hayñinkuna.
Policiakuna hap'isuqtiykiqa kay hayñikunatan chaskinki:
1. Imaraykun hap'isunku chayta yachay.
2. Aylluykiman chaypacha willachiy.
3. Amachaqwan kuska kay; mana qullqiyki kaqtinqa Estado amachaqta gratis qusunki.
4. Upallakuy hayñi, mana rimanachu.
5. Simi t'ikraq gratis: quechua simipi sut'inchasunkiku.
6. Ama pitapas maqwawasun nispachu mañakuy.`,
    content_qu_central: `Art. 71 Kamachikuy: Harkashqa runapa hayñinkuna (Quechua Central).
Policiakuna hapishuptiykiqa kay derechukikunatam yachanki:
1. Allitam musyanki imaraykur hapishurqayki.
2. Aylluykiman o amiguykiman chaylla willatsiy.
3. Amachaq definsurwan yanapatsikuy; mana qellayki kaptinqa Estado qallariyninpitam qoshunki.
4. Upallakuy derechu: Manam rimankitsu manaraq amachaqniki shamuptinqa.
5. Shimi tikraq (intérprete oficial) gratis mañakuy: Mana castellanota yachaptiykiqa, kikiki shimiykichaw tantiyatsishunki.
6. Manam pipis maqashunkimantsu nitaq penqakuyman churashunkimantsu.`,
    content_qu_norteno: `Art. 71 Kamachikuy: Harkasqa runapa hayñinkuna (Quechua Norteño).
Policiakuna hapisuptiykiqa kay derechukikunata yachay:
1. Yachay imarayku hapisurqayki.
2. Aylluykiman chaylla willachiy.
3. Amachaqwan yanapachikuy; mana qullqiyki kaqtinqa Estado gratis qusunki.
4. Upallakuy hayñi: Mana parlaychu manaraq amachaqniki kashpaqa.
5. Simi tikraq gratis mañakuy: Mana castellano parlayta atiptiykiqa, quechua simiykipi intiendichisunki.
6. Ama pipis maqasunkichu nitaq mana allinta rurasunkichu.`,
    content_qu_amazonico: `Art. 71 Ley: Harkashka runapak derechokuna (Quechua Amazónico).
Polisiakuna kanta hapikpika kay derechokunata yachana kanki:
1. Yachay imarayku kanta hapirka.
2. Ayllukunaman utka willachiy.
3. Amachak (abogado) defensorwan yanapachiy; mana kullki tiyakpika Estado mana kullkillawan kushka kanka.
4. Upallana derecho: Mana rimankichu manaraq amachak tiyakpika.
5. Shimi tikrak gratis mañay: Mana castellanota rimakpika, kikinpak runashimipi willanka.
6. Mana pipas kanta makanka nitaq manchachinka.`
  },
  {
    document_id: "cpp-dl957-art114",
    title: "Código Procesal Penal - Decreto Legislativo Nº 957",
    issuer: "Congreso de la República / Presidencia",
    official_url: "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H872583",
    article: "Artículo 114: Idioma en las actuaciones procesales y nombramiento de intérprete",
    publication_date: "2004-07-29",
    category: "debido_proceso",
    content_es: `1. Las actuaciones procesales se realizan en idioma castellano.
2. Cuando una persona no comprenda o no hable con suficiente fluidez el idioma castellano, o cuando se trate de un quechua-hablante u originario de lengua indígena, la autoridad judicial o fiscal dispondrá de oficio o a pedido de parte la intervención de un intérprete o traductor oficial idóneo, sin costo alguno para la persona procesada.`,
    content_qu_chanka: `Art. 114: Kikinchikpa siminchikpi rimaymanta.
Taripaqkuna (juez) utaq fiscal nisqakunapa ñawpaqninpiqa, quechua rimaq runaqa kikin siminpi rimanman. Estadoqa simi t'ikraqta qunanmi mana qullqi mañakuspa, allinta rimanakunapaq.`,
    content_qu_collao: `Art. 114: Quechua simipi rimay.
Juez ñawpaqenpi mana castellanota allinta rimanki chayqa, t'ikraqta gratis Estado churananmi.`,
    content_qu_central: `Art. 114: Kikintsikpa shimintsikchaw parlaymanta (Quechua Central).
Taripaqkuna (juez) o fiscalpa ñawpanchawqa, quechua parlaq runaqa kikin shiminchaw parlayta puydinmi. Estadoqa shimi tikraqta qonanmi mana qellayta mañakushpa, allita rimanakunapaq.`,
    content_qu_norteno: `Art. 114: Kikin simipi parlaymanta (Quechua Norteño).
Juez utaq fiscalpa ñawpaqninpi mana castellanota allin parlayta yachaptiykiqa, simi tikraqta mana qullqillawan Estado churananmi.`,
    content_qu_amazonico: `Art. 114: Kikin runashimipi rimana (Quechua Amazónico).
Juez o fiscalpa ñawpakpi mana castellano rimakpika, Estado shimi tikrakta mana kullkita mañashpa kushka kanka.`
  },
  {
    document_id: "ley-30364-art15",
    title: "Ley Nº 30364 - Ley para prevenir, sancionar y erradicar la violencia familiar",
    issuer: "Congreso de la República",
    official_url: "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H1137022",
    article: "Artículo 15: Denuncia de actos de violencia",
    publication_date: "2015-11-23",
    category: "violencia_familiar",
    content_es: `La denuncia por violencia contra las mujeres o integrantes del grupo familiar puede ser formulada de forma verbal o escrita, ante la Policía Nacional del Perú, las Fiscalías Penales o de Familia, o los Juzgados de Paz Letrado o de Familia.
No se requiere firma de abogado defensor, ni tasa judicial ni pago alguno. La atención policial y judicial es obligatoria e inmediata, con enfoque intercultural y traductores si se requiere.`,
    content_qu_chanka: `Art. 15: Willakuy / Chatakuy maqanakuy kaqtin.
Warmita, wawata utaq qharita wasipi maqaptinkuqa, chaylla comisariaman utaq juezpaman rispa willakuna (denuncia). Manam qullqita mañakunkuchu, manam amachaqpa (abogado) firmanqa necesitanchu. Quechua simipipas willakunkimanmi.`,
    content_qu_collao: `Art. 15: Chatakuy maqasqa kaspa.
Comisariapi utaq juzgadopi chaypacha willakunki. Mana qullqita mañakuspa chaskisunki, mana abogado firmatapas mañakunchu.`,
    content_qu_central: `Art. 15: Willakuy / Chatakuy maqanakuy kaptin (Quechua Central).
Warmita, wambrata o pi familaytapis wasichaw maqashuptiykiqa, chayllam comisariaman o juezpaman aywanki willakuq (denuncia). Manam qellayta mañakuntsu, manam amachaqpa firmanpis necesitakuntsu. Quechua shimiykichawpis willakunkimanmi.`,
    content_qu_norteno: `Art. 15: Willakuy maqanakuy kaqtin (Quechua Norteño).
Warmita utaq wawakunata wasipi maqasuptiykiqa, chaylla comisariaman utaq juezpaman rinki willakuq. Mana qullqita mañakunkuchu, mana abogado firmanta necesitanchu.`,
    content_qu_amazonico: `Art. 15: Willay makay tiyakpika (Quechua Amazónico).
Warmita, wawata o pitas wasipi makakpika, utka comisariaman o juzgadoman rina willankapak. Mana kullkita mañankunachu, mana amachakpa firmanta ministinchu.`
  },
  {
    document_id: "ley-30364-art16",
    title: "Ley Nº 30364 - Ley para prevenir, sancionar y erradicar la violencia familiar",
    issuer: "Congreso de la República",
    official_url: "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H1137022",
    article: "Artículo 16: Medidas de Protección Inmediatas",
    publication_date: "2015-11-23",
    category: "violencia_familiar",
    content_es: `Recibida la denuncia, el Juzgado de Familia o de Paz Letrado debe dictar medidas de protección inmediatas en un plazo máximo de 24 a 72 horas.
Estas medidas incluyen el retiro del agresor del domicilio conyugal o convivencial, impedimento de acercamiento o comunicación, asignación económica de alimentos y custodia cautelar de los hijos.`,
    content_qu_chanka: `Art. 16: Amachana kamachikuy (Medidas de protección).
Willakuyta qospaykiqa, juezmi 24 utaq 48 horallapi maqakuq runata wasimanta qarqunanpaq kamachin. Chaymantapas ama asuykunanchu, amataq qayllaykamusunkichu.`,
    content_qu_collao: `Art. 16: Amachana kamachikuy.
Juezmi maqakuq runata wasimanta qarquyta kamachin, ama qanman nitaq wawakunaman asuykunanpaq.`,
    content_qu_central: `Art. 16: Amachana kamachikuy (Quechua Central).
Willakuyta qoptiykiqa, juezmi 24 o 48 horallachaw maqakuq runata wasipita qarqunanpaq kamachin. Tsaymantapis ama qanman nitaq wambrantsikkunaman qayllaykamunanpaq, y mikuypaq qellaytapis qonanpaq.`,
    content_qu_norteno: `Art. 16: Amachana kamachikuy (Quechua Norteño).
Willakuyta quptiykiqa, juezmi 24 utaq 48 horallapi maqakuq runata wasimanta qarquyta kamachin, ama qanman asuykunanpaq chaymanta mikuypaq qullqita qunanpaq.`,
    content_qu_amazonico: `Art. 16: Amachana ley (Quechua Amazónico).
Willayta kukpika, juezmi 24 o 48 horapi makak runata wasimanta llukshichinka, ama kanman asuykunkapak chasna mikuypak kullkita kunkapak.`
  },
  {
    document_id: "const-1993-art2",
    title: "Constitución Política del Perú de 1993",
    issuer: "Congreso Constituyente Democrático",
    official_url: "https://www.gob.pe/institucion/presidencia/normas-legales/111867-constitucion-politica-del-peru",
    article: "Artículo 2, Inciso 19: Identidad étnica, cultural y derecho al propio idioma",
    publication_date: "1993-12-30",
    category: "derechos_fundamentales",
    content_es: `Toda persona tiene derecho a su identidad étnica y cultural. Todo peruano tiene derecho a usar su propio idioma ante cualquier autoridad mediante intérprete. Los extranjeros tienen este mismo derecho cuando sean citados por cualquier autoridad.`,
    content_qu_chanka: `Constitución Art. 2, Inc. 19: Kikin runapa simin rimay hayñin.
Llapanchikmi kikin qallunchikpi (quechuapi) ima autoridadkunapa ñawpaqninpipas rimayta atinchik, simi t'ikraqpa yanapayninwan.`,
    content_qu_collao: `Constitución Art. 2, Inc. 19: Kikin simipi rimay hayñi.
Mayqen autoridadpas respetananmi quechua siminchista, simi t'ikraqwan kuska rimayta.`,
    content_qu_central: `Constitución Art. 2, Inc. 19: Kikin runapa shimin parlay derechu (Quechua Central).
Llapantsikmi kikin shimintsikchaw ima autoridadkunapa ñawpanchawpis parlayta puydintsik, shimi tikraqpa yanapayninwan.`,
    content_qu_norteno: `Constitución Art. 2, Inc. 19: Kikin simipi parlay hayñi (Quechua Norteño).
Llapanchikmi kikin siminchikpi autoridadkunapa ñawpaqninpi parlayta atinchik, simi tikraqpa yanapayninwan.`,
    content_qu_amazonico: `Constitución Art. 2, Inc. 19: Kikin runashimipi rimana derecho (Quechua Amazónico).
Tukuy llaktakunam kikin runashimipi maykan autoridad ñawpakpi rimayta ushanchik, shimi tikrakpa yanapaywan.`
  },
  {
    document_id: "cc-art472-alimentos",
    title: "Código Civil del Perú - Decreto Legislativo Nº 295",
    issuer: "Congreso de la República / Presidencia",
    official_url: "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H682689",
    article: "Artículo 472: Noción de alimentos y deber de asistencia a los hijos",
    publication_date: "1984-11-14",
    category: "familia_alimentos",
    content_es: `Se entiende por alimentos lo que es indispensable para el sustento, habitación, vestido, educación, instrucción y capacitación para el trabajo, asistencia médica y psicológica y recreación, según la situación y posibilidades de la familia.
También los gastos del embarazo de la madre desde la concepción hasta la etapa de postparto.`,
    content_qu_chanka: `Código Civil Art. 472: Mikhuna hayñi (Pensión de Alimentos).
Mikhunamanta rimaspaqa manam mikhuyllachu: wasi, pacha, hampikuy, yachaywasi, wawakunapa pukllayninpas kay kamachikuypim kachkan. Taytaqa utaq mamaqa wawakuna uywaytam cumplinan, manam saqenanpashchu.`,
    content_qu_collao: `Código Civil Art. 472: Mikhuna hayñi.
Wawakunapa kawsayninmi ñawpaqpi: mikhuna, p'acha, yachaywasi, hampikuna. Tayta-mamaqa chayta qonankupuni.`,
    content_qu_central: `Código Civil Art. 472: Mikhuy derechu (Quechua Central).
Wambrantsikkunapa mikuynin, kamantsik, yachaywasi y hampiyninqa manam qunqanatsu; tayta-mamam chayta qonan.`,
    content_qu_norteno: `Código Civil Art. 472: Mikhuna hayñi (Quechua Norteño).
Wawakunapa mikhunanta, pachanta, yachaywasinta taytaqa qunanpunim, mana saqispa.`,
    content_qu_amazonico: `Código Civil Art. 472: Mikuna derecho (Quechua Amazónico).
Wawakunapak mikunata, wasita, yachaywasita, hampita taytaka kunanpachami.`
  }
];
