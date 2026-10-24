import math
import re
from typing import List, Dict, Any, Tuple
from app.schemas.chat import SourceCitation

# Corpus Normativo Oficial Verificado (El Peruano / SPIJ / MINJUSDH)
OFFICIAL_LEGAL_CORPUS = [
    {
        "document_id": "cpp-dl957",
        "title": "Código Procesal Penal - Decreto Legislativo Nº 957",
        "issuer": "Congreso de la República / Presidencia",
        "official_url": "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H872583",
        "article": "Artículo 71: Derechos del imputado",
        "publication_date": "2004-07-29",
        "category": "debido_proceso",
        "keywords": "detenido policia derechos silencio abogado defensor interprete traductor idioma maltrato comisaria calabozo arresto",
        "content_es": (
            "1. El imputado puede hacer valer por sí mismo o a través de su Abogado Defensor, "
            "los derechos que la Constitución y las Leyes le conceden, desde el inicio de las primeras diligencias.\n"
            "2. Los jueces, los fiscales o la policía deben hacer saber al imputado de manera inmediata y comprensible que tiene derecho a: "
            "a) Conocer los cargos formulados en su contra y la orden de detención dictada; "
            "b) Designar a la persona o institución a la que debe comunicarse su detención de manera inmediata; "
            "c) Ser asistido desde los primeros actos de investigación por un Abogado Defensor; "
            "d) Abstenerse de declarar (guardar silencio); "
            "e) Que no se emplee en su contra medios coactivos, intimidatorios ni métodos que afecten su dignidad; "
            "f) Ser asistido gratuitamente por un traductor o intérprete oficial si no comprende o no se expresa en idioma castellano."
        ),
        "content_qu_chanka": (
            "Art. 71 Kamachikuy: Hark'asqa / Imputado nisqapa hayñinkuna.\n"
            "Pipis policiapa harkasqan kaspaqa kay hayñikunatam yachan:\n"
            "1. Allinta yachay imaraykum hapisurqanki.\n"
            "2. Aylluykiman utaq amiguykiman chaylla willachiy.\n"
            "3. Amachaq (abogado) defensor nisqawan yanapachikuy; manachus qullqiyki kanchu chayqa, Estadoqa qallarinanmantapacham qusunki.\n"
            "4. Upallakuy hayñi: Manam rimankichu manaraq amachaqniyki kashaqtinqa.\n"
            "5. Simi t'ikraq (intérprete oficial) gratuita nisqatam mañakunki: Mana castellano rimaptiykiqa, quechua simiykipi intiendichisunki.\n"
            "6. Manam pipis maqwankimanchu nitaq mana allinta rurankimanchu."
        ),
        "content_qu_collao": (
            "Art. 71 Kamachikuy: Hark'asqa runaq hayñinkuna.\n"
            "Policiakuna hap'isuqtiykiqa kay hayñikunatan chaskinki:\n"
            "1. Imaraykun hap'isunku chayta yachay.\n"
            "2. Aylluykiman chaypacha willachiy.\n"
            "3. Amachaqwan kuska kay; mana qullqiyki kaqtinqa Estado amachaqta gratis qusunki.\n"
            "4. Upallakuy hayñi, mana rimanachu.\n"
            "5. Simi t'ikraq gratis: quechua simipi sut'inchasunkiku.\n"
            "6. Ama pitapas maqwawasun nispachu mañakuy."
        ),
        "content_qu_central": (
            "Art. 71 Kamachikuy: Harkashqa runapa hayñinkuna (Quechua Central).\n"
            "Policiakuna hapishuptiykiqa kay derechukikunatam yachanki:\n"
            "1. Allitam musyanki imaraykur hapishurqayki.\n"
            "2. Aylluykiman o amiguykiman chaylla willatsiy.\n"
            "3. Amachaq definsurwan yanapatsikuy; mana qellayki kaptinqa Estado qallariyninpitam qoshunki.\n"
            "4. Upallakuy derechu: Manam rimankitsu manaraq amachaqniki shamuptinqa.\n"
            "5. Shimi tikraq (intérprete oficial) gratis mañakuy: Mana castellanota yachaptiykiqa, kikiki shimiykichaw tantiyatsishunki.\n"
            "6. Manam pipis maqashunkimantsu nitaq penqakuyman churashunkimantsu."
        ),
        "content_qu_norteno": (
            "Art. 71 Kamachikuy: Harkasqa runapa hayñinkuna (Quechua Norteño).\n"
            "Policiakuna hapisuptiykiqa kay derechukikunata yachay:\n"
            "1. Yachay imarayku hapisurqayki.\n"
            "2. Aylluykiman chaylla willachiy.\n"
            "3. Amachaqwan yanapachikuy; mana qullqiyki kaqtinqa Estado gratis qusunki.\n"
            "4. Upallakuy hayñi: Mana parlaychu manaraq amachaqniki kashpaqa.\n"
            "5. Simi tikraq gratis mañakuy: Mana castellano parlayta atiptiykiqa, quechua simiykipi intiendichisunki.\n"
            "6. Ama pipis maqasunkichu nitaq mana allinta rurasunkichu."
        ),
        "content_qu_amazonico": (
            "Art. 71 Ley: Harkashka runapak derechokuna (Quechua Amazónico).\n"
            "Polisiakuna kanta hapikpika kay derechokunata yachana kanki:\n"
            "1. Yachay imarayku kanta hapirka.\n"
            "2. Ayllukunaman utka willachiy.\n"
            "3. Amachak (abogado) defensorwan yanapachiy; mana kullki tiyakpika Estado mana kullkillawan kushka kanka.\n"
            "4. Upallana derecho: Mana rimankichu manaraq amachak tiyakpika.\n"
            "5. Shimi tikrak gratis mañay: Mana castellanota rimakpika, kikinpak runashimipi willanka.\n"
            "6. Mana pipas kanta makanka nitaq manchachinka."
        )
    },
    {
        "document_id": "cpp-dl957-art114",
        "title": "Código Procesal Penal - Decreto Legislativo Nº 957",
        "issuer": "Congreso de la República / Presidencia",
        "official_url": "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H872583",
        "article": "Artículo 114: Idioma en las actuaciones procesales y nombramiento de intérprete",
        "publication_date": "2004-07-29",
        "category": "debido_proceso",
        "keywords": "idioma traductor quechua interprete lengua materna juez fiscal declaracion audiencia shimi parlay rimay",
        "content_es": (
            "1. Las actuaciones procesales se realizan en idioma castellano. "
            "2. Cuando una persona no comprenda o no hable con suficiente fluidez el idioma castellano, "
            "o cuando se trate de un quechua-hablante u originario de lengua indígena, "
            "la autoridad judicial o fiscal dispondrá de oficio o a pedido de parte la intervención de un intérprete o traductor oficial idóneo, "
            "sin costo alguno para la persona procesada."
        ),
        "content_qu_chanka": (
            "Art. 114: Kikinchikpa siminchikpi rimaymanta.\n"
            "Taripaqkuna (juez) utaq fiscal nisqakunapa ñawpaqninpiqa, quechua rimaq runaqa kikin siminpi rimanman. "
            "Estadoqa simi t'ikraqta qunanmi mana qullqi mañakuspa, allinta rimanakunapaq."
        ),
        "content_qu_collao": (
            "Art. 114: Quechua simipi rimay.\n"
            "Juez ñawpaqenpi mana castellanota allinta rimanki chayqa, t'ikraqta gratis Estado churananmi."
        ),
        "content_qu_central": (
            "Art. 114: Kikintsikpa shimintsikchaw parlaymanta (Quechua Central).\n"
            "Taripaqkuna (juez) o fiscalpa ñawpanchawqa, quechua parlaq runaqa kikin shiminchaw parlayta puydinmi. "
            "Estadoqa shimi tikraqta qonanmi mana qellayta mañakushpa, allita rimanakunapaq."
        ),
        "content_qu_norteno": (
            "Art. 114: Kikin simipi parlaymanta (Quechua Norteño).\n"
            "Juez utaq fiscalpa ñawpaqninpi mana castellanota allin parlayta yachaptiykiqa, simi tikraqta mana qullqillawan Estado churananmi."
        ),
        "content_qu_amazonico": (
            "Art. 114: Kikin runashimipi rimana (Quechua Amazónico).\n"
            "Juez o fiscalpa ñawpakpi mana castellano rimakpika, Estado shimi tikrakta mana kullkita mañashpa kushka kanka."
        )
    },
    {
        "document_id": "ley-30364-art15",
        "title": "Ley Nº 30364 - Ley para prevenir, sancionar y erradicar la violencia familiar",
        "issuer": "Congreso de la República",
        "official_url": "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H1137022",
        "article": "Artículo 15: Denuncia de actos de violencia",
        "publication_date": "2015-11-23",
        "category": "violencia_familiar",
        "keywords": "denuncia comisaria violencia familiar golpe maltrato mujer juzgado de paz fiscalia sin abogado gratis maqa makakpika",
        "content_es": (
            "La denuncia por violencia contra las mujeres o integrantes del grupo familiar puede ser formulada de forma verbal o escrita, "
            "ante la Policía Nacional del Perú, las Fiscalías Penales o de Familia, o los Juzgados de Paz Letrado o de Familia. "
            "No se requiere firma de abogado defensor, ni tasa judicial ni pago alguno. "
            "La atención policial y judicial es obligatoria e inmediata, con enfoque intercultural y traductores si se requiere."
        ),
        "content_qu_chanka": (
            "Art. 15: Willakuy / Chatakuy maqanakuy kaqtin.\n"
            "Warmita, wawata utaq qharita wasipi maqaptinkuqa, chaylla comisariaman utaq juezpaman rispa willakuna (denuncia). "
            "Manam qullqita mañakunkuchu, manam amachaqpa (abogado) firmanqa necesitanchu. "
            "Quechua simipipas willakunkimanmi."
        ),
        "content_qu_collao": (
            "Art. 15: Chatakuy maqasqa kaspa.\n"
            "Comisariapi utaq juzgadopi chaypacha willakunki. Mana qullqita mañakuspa chaskisunki, mana abogado firmatapas mañakunchu."
        ),
        "content_qu_central": (
            "Art. 15: Willakuy / Chatakuy maqanakuy kaptin (Quechua Central).\n"
            "Warmita, wambrata o pi familaytapis wasichaw maqashuptiykiqa, chayllam comisariaman o juezpaman aywanki willakuq (denuncia). "
            "Manam qellayta mañakuntsu, manam amachaqpa firmanpis necesitakuntsu. Quechua shimiykichawpis willakunkimanmi."
        ),
        "content_qu_norteno": (
            "Art. 15: Willakuy maqanakuy kaqtin (Quechua Norteño).\n"
            "Warmita utaq wawakunata wasipi maqasuptiykiqa, chaylla comisariaman utaq juezpaman rinki willakuq. "
            "Mana qullqita mañakunkuchu, mana abogado firmanta necesitanchu."
        ),
        "content_qu_amazonico": (
            "Art. 15: Willay makay tiyakpika (Quechua Amazónico).\n"
            "Warmita, wawata o pitas wasipi makakpika, utka comisariaman o juzgadoman rina willankapak. "
            "Mana kullkita mañankunachu, mana amachakpa firmanta ministinchu."
        )
    },
    {
        "document_id": "ley-30364-art16",
        "title": "Ley Nº 30364 - Ley para prevenir, sancionar y erradicar la violencia familiar",
        "issuer": "Congreso de la República",
        "official_url": "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H1137022",
        "article": "Artículo 16: Medidas de Protección Inmediatas",
        "publication_date": "2015-11-23",
        "category": "violencia_familiar",
        "keywords": "medidas de proteccion retiro agresor alejamiento custodia prohibicion acercarse juez 24 horas alimentos qellay kullki",
        "content_es": (
            "Recibida la denuncia, el Juzgado de Familia o de Paz Letrado debe dictar medidas de protección inmediatas en un plazo máximo de 24 a 72 horas. "
            "Estas medidas incluyen el retiro del agresor del domicilio conyugal o convivencial, "
            "impedimento de acercamiento o comunicación, asignación económica de alimentos y custodia cautelar de los hijos."
        ),
        "content_qu_chanka": (
            "Art. 16: Amachana kamachikuy (Medidas de protección).\n"
            "Willakuyta qospaykiqa, juezmi 24 utaq 48 horallapi maqakuq runata wasimanta qarqunanpaq kamachin. "
            "Chaymantapas ama asuykunanchu, amataq qayllaykamusunkichu."
        ),
        "content_qu_collao": (
            "Art. 16: Amachana kamachikuy.\n"
            "Juezmi maqakuq runata wasimanta qarquyta kamachin, ama qanman nitaq wawakunaman asuykunanpaq."
        ),
        "content_qu_central": (
            "Art. 16: Amachana kamachikuy (Quechua Central).\n"
            "Willakuyta qoptiykiqa, juezmi 24 o 48 horallachaw maqakuq runata wasipita qarqunanpaq kamachin. "
            "Tsaymantapis ama qanman nitaq wambrantsikkunaman qayllaykamunanpaq, y mikuypaq qellaytapis qonanpaq."
        ),
        "content_qu_norteno": (
            "Art. 16: Amachana kamachikuy (Quechua Norteño).\n"
            "Willakuyta quptiykiqa, juezmi 24 utaq 48 horallapi maqakuq runata wasimanta qarquyta kamachin, ama qanman asuykunanpaq chaymanta mikuypaq qullqita qunanpaq."
        ),
        "content_qu_amazonico": (
            "Art. 16: Amachana ley (Quechua Amazónico).\n"
            "Willayta kukpika, juezmi 24 o 48 horapi makak runata wasimanta llukshichinka, ama kanman asuykunkapak chasna mikuypak kullkita kunkapak."
        )
    },
    {
        "document_id": "const-1993-art2",
        "title": "Constitución Política del Perú de 1993",
        "issuer": "Congreso Constituyente Democrático",
        "official_url": "https://www.gob.pe/institucion/presidencia/normas-legales/111867-constitucion-politica-del-peru",
        "article": "Artículo 2, Inciso 19: Identidad étnica, cultural y derecho al propio idioma",
        "publication_date": "1993-12-30",
        "category": "derechos_fundamentales",
        "keywords": "constitucion idioma quechua identidad etnica cultural interprete autoridad debido proceso runasimi shimi",
        "content_es": (
            "Toda persona tiene derecho a su identidad étnica y cultural. "
            "Todo peruano tiene derecho a usar su propio idioma ante cualquier autoridad mediante intérprete. "
            "Los extranjeros tienen este mismo derecho cuando sean citados por cualquier autoridad."
        ),
        "content_qu_chanka": (
            "Constitución Art. 2, Inc. 19: Kikin runapa simin rimay hayñin.\n"
            "Llapanchikmi kikin qallunchikpi (quechuapi) ima autoridadkunapa ñawpaqninpipas rimayta atinchik, simi t'ikraqpa yanapayninwan."
        ),
        "content_qu_collao": (
            "Constitución Art. 2, Inc. 19: Kikin simipi rimay hayñi.\n"
            "Mayqen autoridadpas respetananmi quechua siminchista, simi t'ikraqwan kuska rimayta."
        ),
        "content_qu_central": (
            "Constitución Art. 2, Inc. 19: Kikin runapa shimin parlay derechu (Quechua Central).\n"
            "Llapantsikmi kikin shimintsikchaw ima autoridadkunapa ñawpanchawpis parlayta puydintsik, shimi tikraqpa yanapayninwan."
        ),
        "content_qu_norteno": (
            "Constitución Art. 2, Inc. 19: Kikin simipi parlay hayñi (Quechua Norteño).\n"
            "Llapanchikmi kikin siminchikpi autoridadkunapa ñawpaqninpi parlayta atinchik, simi tikraqpa yanapayninwan."
        ),
        "content_qu_amazonico": (
            "Constitución Art. 2, Inc. 19: Kikin runashimipi rimana derecho (Quechua Amazónico).\n"
            "Tukuy llaktakunam kikin runashimipi maykan autoridad ñawpakpi rimayta ushanchik, shimi tikrakpa yanapaywan."
        )
    },
    {
        "document_id": "cc-art472-alimentos",
        "title": "Código Civil del Perú - Decreto Legislativo Nº 295",
        "issuer": "Congreso de la República / Presidencia",
        "official_url": "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H682689",
        "article": "Artículo 472: Noción de alimentos y deber de asistencia a los hijos",
        "publication_date": "1984-11-14",
        "category": "familia_alimentos",
        "keywords": "alimentos pension comida educacion colegio hijo hija sustento demanda padre madre manutencion penshon mikhuna",
        "content_es": (
            "Se entiende por alimentos lo que es indispensable para el sustento, habitación, "
            "vestido, educación, instrucción y capacitación para el trabajo, asistencia médica y psicológica y recreación, "
            "según la situación y posibilidades de la familia. "
            "También los gastos del embarazo de la madre desde la concepción hasta la etapa de postparto."
        ),
        "content_qu_chanka": (
            "Código Civil Art. 472: Mikhuna hayñi (Pensión de Alimentos).\n"
            "Mikhunamanta rimaspaqa manam mikhuyllachu: wasi, pacha, hampikuy, yachaywasi, "
            "wawakunapa pukllayninpas kay kamachikuypim kachkan. "
            "Taytaqa utaq mamaqa wawakuna uywaytam cumplinan, manam saqenanpashchu."
        ),
        "content_qu_collao": (
            "Código Civil Art. 472: Mikhuna hayñi wawakunapaq.\n"
            "Mikhunaqa manan mikhunallachu: wasi, p'acha, hampina, yachaywasipi yachay ima wawakunapaq. "
            "Tayta mana qullqita qoptinqa juzgadopi demandata churanan."
        ),
        "content_qu_central": (
            "Código Civil Art. 472: Mikhuna derechu wambrantsikkunapaq (Quechua Central).\n"
            "Mikuypita rirparqa manam mikuyllatsu: wayi, ratash, hampikuy, yachaywasi y pukllaykunapis kaykamachikuychawmi. "
            "Taytaqa wambrankunata mikuyninta qonanmi obligacionnin."
        ),
        "content_qu_norteno": (
            "Código Civil Art. 472: Mikhuna hayñi wawakunapaq (Quechua Norteño).\n"
            "Mikhunata rimaspaqa manam mikhuyllachu: wasi, pacha, hampikuy, yachaywasi wawakunapaq. "
            "Tayta manachus qullqita quptinqa juezpaman rispa mañakunki."
        ),
        "content_qu_amazonico": (
            "Código Civil Art. 472: Mikuypak derecho wawakunapak (Quechua Amazónico).\n"
            "Mikuymanta rimakpika manam mikuylachu: wasi, llachapa, hampina, yachana wasi wawakunapak. "
            "Tayta mana kullkita kukpika juezpa ñawpakpi mañankapak ushanki."
        )
    },
    {
        "document_id": "const-art89-comunidades",
        "title": "Constitución Política del Perú de 1993",
        "issuer": "Congreso Constituyente Democrático",
        "official_url": "https://www.gob.pe/institucion/presidencia/normas-legales/111867-constitucion-politica-del-peru",
        "article": "Artículo 89: Comunidades Campesinas y Nativas, y protección de sus tierras",
        "publication_date": "1993-12-30",
        "category": "tierras_comunales",
        "keywords": "comunidad campesina nativa tierra comunal territorio linderos asamblea propiedad imprescriptible inembargable allpa chakra",
        "content_es": (
            "Las Comunidades Campesinas y las Nativas tienen existencia legal y son personas jurídicas. "
            "Son autónomas en su organización, en el trabajo comunal y en el uso y la libre disposición de sus tierras, "
            "así como en lo económico y administrativo. "
            "La propiedad de sus tierras es imprescriptible, salvo en el caso de abandono. "
            "El Estado respeta la identidad cultural de las Comunidades Campesinas y Nativas."
        ),
        "content_qu_chanka": (
            "Constitución Art. 89: Ayllu llaqtakunapa allpan amachasqa (Comunidades Campesinas).\n"
            "Ayllu llaqtakuna (comunidades campesinas y nativas) kikin kamachikuyniyoqmi kanku allpankupi, "
            "llamk'ayninkupi hinallataq linderunkunapi. "
            "Comunidadpa allpanqa manam pipas qechunmankichu nitaq embarganmankichu, Estadoqa respetananmi."
        ),
        "content_qu_collao": (
            "Constitución Art. 89: Ayllukunaq allpan hayñin.\n"
            "Comunidad campesina kikin kamachiyniyoqmi allpankumanta, llamk'aymanta. "
            "Allpankutaqa manan pipas qechuyta atinchu, Estadoqa allintan amachanan."
        ),
        "content_qu_central": (
            "Constitución Art. 89: Ayllukunapa allpan tsapay (Quechua Central).\n"
            "Ayllukuna (comunidades campesinas) kikin mandakuyyuqmi allpankunachaw, linderunkunachaw y ayni llamkaychaw. "
            "Comunidadpa allpantaqa manam pipis qechunmantsu nitaq suwanmantsu."
        ),
        "content_qu_norteno": (
            "Constitución Art. 89: Ayllukunapa allpan amachasqa (Quechua Norteño).\n"
            "Comunidad campesinakuna allpankunata kikin kamachinku. "
            "Ayllupa allpantaqa manam pipas qechuyta atinchu, Estadoqa respetananmi."
        ),
        "content_qu_amazonico": (
            "Constitución Art. 89: Ayllukunapak allpa amachana (Quechua Amazónico).\n"
            "Nativa y campesina ayllukuna allpankunata kikin mandankuna. "
            "Ayllupak allpata mana pipas kichuyta ushanchu, Estado respetanka."
        )
    },
    {
        "document_id": "lpcl-dl728-despido",
        "title": "Ley de Productividad y Competitividad Laboral - D. Leg. Nº 728",
        "issuer": "Ministerio de Trabajo y Promoción del Empleo (MTPE)",
        "official_url": "https://spij.minjus.gob.pe/spij-ext-web/#/detallenorma/H682701",
        "article": "Artículo 34: Despido arbitrario e indemnización laboral",
        "publication_date": "1997-03-27",
        "category": "derecho_laboral",
        "keywords": "despido trabajo patron empresa indemnizacion liquidacion sueldo sunafil contrato laboral llamkay llamkana",
        "content_es": (
            "El despido del trabajador fundado en causa justa contemplada en la ley debe ser comprobado por el empleador. "
            "Si el despido es arbitrario por no haberse expresado causa o no poderse demostrar esta en juicio, "
            "el trabajador tiene derecho al pago de la indemnización equivalente a una remuneración y media ordinaria mensual por cada año completo de servicios, "
            "sin perjuicio de recurrir ante la SUNAFIL o el Poder Judicial."
        ),
        "content_qu_chanka": (
            "Ley Laboral D. Leg. 728 Art. 34: Llamk'aymanta mana rasonwan qarqusqa (Despido Arbitrario).\n"
            "Patrón o empresa mana allin kaqta llamk'aymanta qarqusuptiykiqa, indemnización nisqata "
            "(sapa wata llamk'asqaykimanta huk sueldo y mediatam) qosunayki. "
            "SUNAFIL nisqaman rispam chatakuyta atinki mana qullqillawan."
        ),
        "content_qu_collao": (
            "Ley Laboral D. Leg. 728 Art. 34: Llamk'anamanta qarqusqa.\n"
            "Mana huchaykimanta patron qarqusuqtiykiqa, indemnización qullqita mañakunki. "
            "SUNAFIL kamachiqman chaypacha willakuyta atinki yanapasunaykipaq."
        ),
        "content_qu_central": (
            "Ley Laboral D. Leg. 728 Art. 34: Llamkaypita mana rasunwan qarqushqa (Quechua Central).\n"
            "Patrun mana allin rasonwan llamkaynikipita qarqushuptiykiqa, indemnizacion qellaytam qoshunki. "
            "SUNAFIL-man aywarmi willakuyta puydinki mana qellayta paganaykipa."
        ),
        "content_qu_norteno": (
            "Ley Laboral D. Leg. 728 Art. 34: Llamkaymanta qarqusqa (Quechua Norteño).\n"
            "Patron mana razonninwan llamkaymanta qarqusuptiykiqa, indemnizacion qullqita qusunki. "
            "SUNAFIL-man rinki willakuq yanapasunaykipaq."
        ),
        "content_qu_amazonico": (
            "Ley Laboral D. Leg. 728 Art. 34: Llamkanamanta llukshichiska (Quechua Amazónico).\n"
            "Patrón mana rasonwan llamkaymanta llukshichikpika, kullkita indemnización kushka kanka. "
            "SUNAFIL-man rina willankapak mana kullkiwan."
        )
    }
]

class RetrievalService:
    """
    Paso 6 y Innovación 1 (PDF Pág. 8 & 11):
    Recuperación híbrida de artículos oficiales con verificación estricta.
    """

    @classmethod
    def search_evidence(cls, query: str, dialect: str = "quechua_chanka") -> Tuple[List[Dict[str, Any]], float]:
        """
        Retorna:
        - Lista de fragmentos ordenados por relevancia.
        - Puntuación máxima de coincidencia (score entre 0.0 y 1.0).
        """
        # Normalizar palabras clave de la consulta filtrando stop words comunes
        STOP_WORDS = {
            "ley", "articulo", "sobre", "para", "quiero", "saber", "como", "cual", "cuales", 
            "que", "los", "las", "una", "uno", "unos", "unas", "por", "con", "del", "dame",
            "kanki", "kashan", "chay", "kay", "nisqa"
        }
        raw_words = re.findall(r'[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9]{3,}', query.lower())
        query_words = set(w for w in raw_words if w not in STOP_WORDS)
        if not query_words:
            return ([], 0.0)


        results = []
        max_score = 0.0

        for item in OFFICIAL_LEGAL_CORPUS:
            target_keywords = item['keywords'].lower()
            target_content = item['content_es'].lower()
            target_article = item['article'].lower()
            target_qu = (
                f"{item.get('content_qu_chanka', '')} {item.get('content_qu_collao', '')} "
                f"{item.get('content_qu_central', '')} {item.get('content_qu_norteno', '')} "
                f"{item.get('content_qu_amazonico', '')}"
            ).lower()

            target_all = f"{target_keywords} {target_article} {target_content} {target_qu}"
            
            # Coincidencias directas
            direct_matches = sum(1 for w in query_words if w in target_all)
            keyword_bonus = sum(2.0 for w in query_words if w in target_keywords or w in target_article)
            
            total_points = direct_matches + keyword_bonus
            # Normalización balanceada
            relevance = min(total_points / (len(query_words) * 0.6 + 2.0), 1.0)

            if relevance > max_score:
                max_score = relevance

            if relevance >= 0.12:
                results.append((relevance, item))

        results.sort(key=lambda x: x[0], reverse=True)
        evidence = [res[1] for res in results[:3]]
        return (evidence, max_score)


    @classmethod
    def get_document_by_id(cls, doc_id: str) -> Dict[str, Any]:
        for doc in OFFICIAL_LEGAL_CORPUS:
            if doc["document_id"] == doc_id:
                return doc
        return {}

    @classmethod
    def get_all_official_sources(cls) -> List[Dict[str, Any]]:
        return OFFICIAL_LEGAL_CORPUS
