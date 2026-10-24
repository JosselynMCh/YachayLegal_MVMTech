"""
Registro de ramas y variantes del quechua hablado en el Perú.

Clasificación usada (simplificada para el prototipo):
  - Quechua Sureño   (Chanka, Cusco-Collao)
  - Quechua Central  (Áncash, Huánuco-Pasco, Junín-Lima)
  - Quechua Norteño  (Cajamarca, Inkawasi-Kañaris)
  - Quechua Amazónico (Lamista, Napo-Pastaza)

IMPORTANTE: los textos en quechua de este proyecto son BORRADORES. Deben ser
validados por hablantes nativos de cada variante e intérpretes acreditados antes
de cualquier uso oficial. El sistema lo indica explícitamente en cada respuesta.
"""
from typing import Any, Dict, Optional

BRANCHES: Dict[str, Dict[str, Any]] = {
    "sureno": {
        "label": "Quechua Sureño",
        "regions": ["Ayacucho", "Huancavelica", "Apurímac", "Cusco", "Puno", "Arequipa", "Moquegua"],
        "description": "La rama más difundida. Comprende el Chanka y el Cusco-Collao.",
    },
    "central": {
        "label": "Quechua Central",
        "regions": ["Junín", "Pasco", "Huánuco", "Áncash", "Lima (parte)"],
        "description": "Marca la 1.ª persona con alargamiento vocálico (-aa) y usa sufijos como -chaw y -tsu.",
    },
    "norteno": {
        "label": "Quechua Norteño",
        "regions": ["Cajamarca", "Lambayeque (Inkawasi-Kañaris)"],
        "description": "Variedades de Cajamarca y de Inkawasi-Kañaris.",
    },
    "amazonico": {
        "label": "Quechua Amazónico",
        "regions": ["Loreto", "San Martín", "Amazonas", "Madre de Dios"],
        "description": "Variedades de selva (quechua lamista, kichwa del Napo y Pastaza).",
    },
}

VARIANTS: Dict[str, Dict[str, Any]] = {
    "quechua_chanka": {
        "branch": "sureno", "label": "Chanka", "iso": "quy",
        "regions": ["Ayacucho", "Huancavelica", "Apurímac"],
        "features": "Sin aspiradas ni glotalizadas; progresivo -chka-; 1.ª pl. inclusiva -nchik; subordinador -pti-.",
    },
    "quechua_cusco_collao": {
        "branch": "sureno", "label": "Cusco-Collao", "iso": "quz",
        "regions": ["Cusco", "Puno", "Arequipa", "Moquegua", "Apurímac (parte)"],
        "features": "Aspiradas (ph, kh, qh) y glotalizadas (p', k', q'); progresivo -sha-; -nchis; subordinador -qti-.",
    },
    "quechua_central_ancash": {
        "branch": "central", "label": "Áncash (Huaylas-Conchucos)", "iso": "qwh",
        "regions": ["Áncash"],
        "features": "Locativo -chaw; negación -tsu; 1.ª pl. -ntsik; 1.ª persona con vocal larga.",
    },
    "quechua_central_huanuco_pasco": {
        "branch": "central", "label": "Huánuco-Pasco", "iso": "qub",
        "regions": ["Huánuco", "Pasco"],
        "features": "Rasgos centrales: -chaw, -tsu, objeto de 2.ª persona -shu-.",
    },
    "quechua_central_junin_lima": {
        "branch": "central", "label": "Junín-Lima (Wanka, Yauyos)", "iso": "qvw",
        "regions": ["Junín", "Lima (parte)"],
        "features": "Rasgos centrales; en Wanka la r suele pronunciarse l (limay = hablar).",
    },
    "quechua_norteno_cajamarca": {
        "branch": "norteno", "label": "Cajamarca", "iso": "qvc",
        "regions": ["Cajamarca"],
        "features": "Progresivo -chka-; locativo -pi; léxico propio del norte (parlay).",
    },
    "quechua_norteno_inkawasi": {
        "branch": "norteno", "label": "Inkawasi-Kañaris", "iso": "quf",
        "regions": ["Lambayeque"],
        "features": "Variedad norteña de Lambayeque con rasgos propios.",
    },
    "quechua_amazonico_lamas": {
        "branch": "amazonico", "label": "Lamista (San Martín)", "iso": "qvs",
        "regions": ["San Martín", "Amazonas"],
        "features": "Sin oposición k/q; pronombre ñuka; participio -shka.",
    },
    "quechua_amazonico_napo": {
        "branch": "amazonico", "label": "Napo-Pastaza (Loreto)", "iso": "qvo",
        "regions": ["Loreto", "Madre de Dios"],
        "features": "Kichwa amazónico: ñuka, imashina, finalidad -nkapak, subordinador -kpi-.",
    },
}

DEFAULT_VARIANT = "quechua_chanka"

_ALIASES = {
    "chanka": "quechua_chanka",
    "collao": "quechua_cusco_collao",
    "cusco_collao": "quechua_cusco_collao",
    "quechua_collao": "quechua_cusco_collao",
}


def resolve_variant(variant: Optional[str]) -> Optional[str]:
    """Devuelve un id de variante válido o None."""
    if not variant:
        return None
    v = variant.strip().lower()
    v = _ALIASES.get(v, v)
    return v if v in VARIANTS else None


def get_branch(variant: Optional[str]) -> Optional[str]:
    v = resolve_variant(variant)
    return VARIANTS[v]["branch"] if v else None


def variant_label(variant: Optional[str]) -> Optional[str]:
    v = resolve_variant(variant)
    if not v:
        return None
    return f"{BRANCHES[VARIANTS[v]['branch']]['label']} · {VARIANTS[v]['label']}"


def text_key_for(variant: str) -> str:
    """Clave de texto: el Sureño tiene textos por variante; el resto, por rama."""
    branch = get_branch(variant)
    return variant if branch == "sureno" else branch


# Mensajes del sistema por variante (Sureño) o rama (resto). BORRADORES por validar.
MESSAGES: Dict[str, Dict[str, str]] = {
    "quechua_chanka": {
        "abstention": "Manam tarinichu chiqap kamachikuyta kay tapukuymanta. Ama pantanapaq, abogaduwan rimay: Defensa Pública 1884.",
        "out_of_scope": "Kay yanapakuyqa Perú suyupa leyninkunamanta willanapaqllam.",
        "unethical": "Manam yanapaykumanchu leyta pakaspa utaq qullqita qospa ruranakunapaq. Chayqa huchan.",
        "urgent": "Maqasuptiykiqa utaq manchachisuptiykiqa, kunallan Línea 100-man waqyay (mana qullqiyuq, 24 horas).",
        "detention": "Hapisuptiykiqa: upallakuyta atinki, abogaduta mañakuy (Defensa Pública 1884) hinaspa intérpreteta quechua simiykipi.",
    },
    "quechua_cusco_collao": {
        "abstention": "Manan tarinichu sut'i kamachikuyta kay tapukuymanta. Ama pantanapaq, abogadowan rimay: Defensa Pública 1884.",
        "out_of_scope": "Kay yanapakuyqa Perú suyuq kamachikuyninkunamanta willanapaqllan.",
        "unethical": "Manan yanapaykumanchu kamachikuyta pakaspa utaq qolqeta qospa ruwanakunapaq. Chayqa huchan.",
        "urgent": "Maqasuqtiykiqa utaq manchachisuqtiykiqa, kunallan Línea 100-man waqyay (gratis, 24 horas).",
        "detention": "Hap'isuqtiykiqa: upallakuyta atinki, abogadota mañakuy (Defensa Pública 1884) hinallataq intérpreteta runasimiykipi.",
    },
    "central": {
        "abstention": "Manam tarirqaatsu kay tapukuypaq allin leyta. Ama pantanapaq, abogaduwan parlay: Defensa Pública 1884.",
        "out_of_scope": "Kay yanapakuyqa Perú markapa leyninkunapaqllam.",
        "unethical": "Manam yanapashqaykitsu leyta pakashpa o qellayta qoshpa rurakunapaq. Tsayqa hucham.",
        "urgent": "Maqashuptiyki o manchachishuptiykiqa, kanannam Línea 100-man waqyay (mana qellayllam, 24 horas).",
        "detention": "Hapishuptiykiqa: upallakuyta puydinki, abogaduta mañakuy (Defensa Pública 1884) y intérpreteta kikiyki shimiykichaw.",
    },
    "norteno": {
        "abstention": "Mana tarinichu kay tapukuypaq allin leyta. Ama pantanapaq, abogaduwan rimay: Defensa Pública 1884.",
        "out_of_scope": "Kay yanapakuyqa Perú suyupa leyninkunapaqllam.",
        "unethical": "Mana yanapasaqchu leyta pakaspa utaq qullqita quspa rurakunapaq. Chayqa hucham.",
        "urgent": "Maqasuptiyki utaq manchachisuptiykiqa, kunanlla Línea 100-man waqyay (mana qullqillam, 24 horas).",
        "detention": "Hapisuptiykiqa: upallakuyta atinki, abogaduta mañakuy (Defensa Pública 1884) chaymanta intérpreteta kikiyki shimiykipi.",
    },
    "amazonico": {
        "abstention": "Mana tarinichu kay tapuypak alli leyta. Ama pantankapak, abogadowan rimay: Defensa Pública 1884.",
        "out_of_scope": "Kay yanapayka Perú llaktapak leykunapaklla kan.",
        "unethical": "Mana yanapanichu leyta pakashpa o kullkita kushpa rurankapak. Chayka hucha kan.",
        "urgent": "Kanta makakpika o manchachikpika, kunallata Línea 100-man kayay (mana kullkiwan, 24 horas).",
        "detention": "Kanta hapikpika: upalla tiyankapak ushanki, abogadota mañay (Defensa Pública 1884) chasna intérpreteta kikinpak shimipi.",
    },
}


def localized(message_key: str, variant: Optional[str]) -> Optional[str]:
    v = resolve_variant(variant)
    if not v:
        return None
    return MESSAGES.get(text_key_for(v), {}).get(message_key)


def registry_payload() -> Dict[str, Any]:
    """Estructura serializable para el frontend (/api/dialects)."""
    return {
        "default_variant": DEFAULT_VARIANT,
        "branches": [
            {
                "id": b_id,
                **b,
                "variants": [
                    {"id": v_id, **v} for v_id, v in VARIANTS.items() if v["branch"] == b_id
                ],
            }
            for b_id, b in BRANCHES.items()
        ],
    }
