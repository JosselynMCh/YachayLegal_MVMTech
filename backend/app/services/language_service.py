import re
from typing import Dict, Tuple, Optional
from app.core import dialects

class LanguageService:
    """
    Paso 8 y 8.1 (PDF Pág. 9): Flujo Lingüístico Controlado y Glosario Jurídico Especializado.
    Soporta las 4 ramas del quechua en el Perú:
      1. Quechua Sureño   (Chanka, Cusco-Collao)
      2. Quechua Central  (Áncash, Huánuco-Pasco, Junín-Lima)
      3. Quechua Norteño  (Cajamarca, Inkawasi-Kañaris)
      4. Quechua Amazónico (Lamista, Napo-Pastaza)
    con terminología verificada del MINJUSDH y MINCUL.
    """

    # Glosario Jurídico Oficial Quechua-Español multivariante
    LEGAL_GLOSSARY: Dict[str, Dict[str, str]] = {
        "hayñi": {"es": "derecho", "chanka": "hayñi", "collao": "derecho / hayñi", "central": "derechu / hayñi", "amazonico": "derecho / hayñi"},
        "amachaq": {"es": "abogado defensor", "chanka": "amachaq", "collao": "amachaq", "central": "amachaq / definsur", "amazonico": "amachak / abogado"},
        "simi t'ikraq": {"es": "intérprete / traductor", "chanka": "simi t'ikraq", "collao": "t'ikraq", "central": "shimi tikraq", "amazonico": "shimi tikrak"},
        "t'ikraq": {"es": "intérprete", "chanka": "simi t'ikraq", "collao": "t'ikraq", "central": "tikraq", "amazonico": "tikrak"},
        "chikllapuq": {"es": "traductor oficial", "chanka": "chikllapuq", "collao": "t'ikraq", "central": "shimi tikraq", "amazonico": "tikrak"},
        "chaninchay": {"es": "justicia", "chanka": "allin chaninchay", "collao": "chaninchay", "central": "chaninchay", "amazonico": "justicia / chaninchay"},
        "kamachikuy": {"es": "ley / norma / disposición legal", "chanka": "kamachikuy", "collao": "kamachikuy", "central": "kamachikuy / ley", "amazonico": "ley / kamachina"},
        "hap'irqawan": {"es": "me detuvieron / me apresaron", "chanka": "hapisqankum", "collao": "hap'irqawan", "central": "hapimarqan", "amazonico": "hapiwarka"},
        "hark'asqa": {"es": "detenido / privado de libertad", "chanka": "harkasqa", "collao": "hark'asqa", "central": "harkashqa", "amazonico": "harkashka"},
        "maqwawan": {"es": "me golpea / me agrede", "chanka": "maqawanmi", "collao": "maqwawan", "central": "maqaman", "amazonico": "makawan"},
        "chatakuy": {"es": "denunciar ante la autoridad", "chanka": "willakuy / chatakuy", "collao": "chatakuy", "central": "willakuy / chatakuy", "amazonico": "willay / chatay"},
        "amachana kamachikuy": {"es": "medida de protección judicial", "chanka": "amachana kamachikuy", "collao": "amachana kamachikuy", "central": "amachana kamachikuy", "amazonico": "amachana ley"},
        "upallakuy hayñi": {"es": "derecho a guardar silencio", "chanka": "upallakuy hayñi", "collao": "upallakuy hayñi", "central": "upallakuy derechu", "amazonico": "upallana derecho"},
        "yanapakuy": {"es": "asistencia / auxilio / defensa", "chanka": "yanapakuy", "collao": "yanapakuy", "central": "yanapakuy", "amazonico": "yanapay"},
        "comisaria": {"es": "comisaría policial", "chanka": "policiapa wasin / comisaría", "collao": "comisaría", "central": "comisaría", "amazonico": "comisaría"},
        "juez": {"es": "juez / magistrado", "chanka": "taripaq / juez", "collao": "juez / taripakuq", "central": "juez / taripakuq", "amazonico": "juez"},
        # Léxico específico por rama
        "qellay": {"es": "dinero / alimentos", "branch": "central"},
        "kullki": {"es": "dinero / pensión", "branch": "amazonico"},
        "qullqi": {"es": "dinero / alimentos", "branch": "sureno_norteno"},
        "qolqe": {"es": "dinero / alimentos", "branch": "collao"},
        "parlay": {"es": "hablar / declarar", "branch": "central_norteno"},
        "rimay": {"es": "hablar / declarar", "branch": "sureno"},
        "ñuka": {"es": "yo / a mí", "branch": "amazonico"},
    }

    # Marcadores morfofonéticos y léxicos del quechua (incluyendo las 4 ramas)
    QUECHUA_MARKERS = [
        # Sureño
        "mi", "m", "si", "s", "ña", "raq", "wan", "man", "pi", "pa", "ta", "kuna", 
        "rura", "ruwa", "yacha", "allin", "munan", "ripu", "kay", "chay", "pitaq",
        "imata", "maypi", "maytan", "llakisqa", "qhari", "warmi", "wawa", "mama", "tata",
        # Central (Áncash, Huánuco, Junín): locativo -chaw, negación -tsu, plural -kuna/-ntsik
        "tsu", "chaw", "aa", "rkaa", "ntsik", "shpa", "shuptiyki", "kanan", "qellay", "puydinki",
        # Norteño (Cajamarca, Inkawasi):
        "parlay", "chaymanta", "quspa",
        # Amazónico (San Martín, Loreto):
        "kpi", "pika", "nkapak", "shka", "ñuka", "kullki", "llakta", "ushanki", "kayay"
    ]

    @classmethod
    def detect_language(cls, text: str) -> Tuple[str, float]:
        """
        Retorna (idioma_detectado, confianza).
        Idioma: 'qu' (quechua) o 'es' (español).
        """
        words = re.findall(r'\b\w+\b', text.lower())
        if not words:
            return ("es", 1.0)

        quechua_score = 0
        total_words = len(words)

        for w in words:
            if w in cls.LEGAL_GLOSSARY:
                quechua_score += 2
                continue
            for marker in cls.QUECHUA_MARKERS:
                if w.endswith(marker) or w == marker:
                    quechua_score += 1
                    break

        confidence = min(quechua_score / max(total_words * 0.8, 1), 1.0)
        if confidence >= 0.22:
            return ("qu", confidence)
        return ("es", 1.0 - confidence)

    @classmethod
    def normalize_quechua_to_spanish_search(cls, query_qu: str, dialect: Optional[str] = None) -> str:
        """
        Traduce conceptos clave de la consulta en Quechua al Español
        para realizar el RAG sobre el corpus oficial peruano sin perder sentido jurídico,
        interpretando según la rama/variante del quechua seleccionada.
        """
        normalized = query_qu.lower()
        search_terms = []
        branch = dialects.get_branch(dialect) if dialect else None

        # Mapeo léxico general
        for qu_term, data in cls.LEGAL_GLOSSARY.items():
            if qu_term in normalized:
                search_terms.append(data["es"])

        # Concepto: Detención policial / derechos procesales (Art. 71 CPP)
        # Sureño: hap'i, hapisqa, harkasqa
        # Central: hapishuptiyki, hapishqa, harkashqa, harkashuptiyki
        # Amazónico: hapikpika, hapiwarka, hapishka
        # Norteño: hapisupki, hapisqa
        if any(w in normalized for w in [
            "hap'i", "hapi", "policia", "preso", "harkasqa", "hark'asqa", 
            "hapishuptiyki", "hapishqa", "hapikpika", "hapiwarka", "hapisuptiyki"
        ]):
            search_terms.extend(["detención policial", "derechos del imputado", "artículo 71", "abogado defensor gratuito", "silencio"])

        # Concepto: Violencia familiar / agresiones físicas o psicológicas (Ley 30364)
        # Sureño: maqwawan, maqasuptiyki, maqanakuy
        # Central: maqashuptiyki, maqaman, maqashpa
        # Amazónico: makakpika, makawarka, makawan
        # Norteño: makasuptiyki, maqasuptiyki
        if any(w in normalized for w in [
            "maqwa", "maqa", "violencia", "golpe", "makakpika", "makawarka", 
            "makawan", "maqashuptiyki", "maqaman", "makasuptiyki"
        ]):
            search_terms.extend(["violencia familiar", "medidas de protección", "denuncia comisaria", "ley 30364"])

        # Concepto: Idioma / intérprete / traducción oficial (Art. 114 CPP / Art. 2 Const)
        # Sureño: simi, rimay, qallu
        # Central: shimi, parlay, shimiykichaw
        # Amazónico: shimi, rimay, kikinpak shimipi
        # Norteño: rimay, parlay
        if any(w in normalized for w in [
            "simi", "shimi", "rimay", "parlay", "castellano", "idioma", 
            "interprete", "traductor", "shimiykichaw"
        ]):
            search_terms.extend(["traductor interprete idioma lengua materna", "debido proceso"])

        # Concepto: Alimentos / dinero de manutención (Art. 16 Ley 30364 / alimentos)
        # Sureño: qullqi, qolqe
        # Central: qellay
        # Amazónico: kullki
        if any(w in normalized for w in ["qullqi", "qolqe", "qellay", "kullki"]):
            search_terms.extend(["alimentos", "asignación económica", "medidas de protección"])

        if search_terms:
            return f"{query_qu} | " + " ".join(set(search_terms))
        return query_qu

    @classmethod
    def get_dialect_label(cls, dialect: Optional[str]) -> str:
        label = dialects.variant_label(dialect)
        return label if label else "Quechua General"
