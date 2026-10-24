from typing import Tuple, Optional
from app.schemas.chat import ReferralService
from app.core.config import settings

class LegalGuard:
    """
    Innovación 3 (PDF Pág. 11): Detector de Incertidumbre, Límites Jurídicos y Derivación.
    Previene alucinaciones, detecta situaciones de riesgo urgente y garantiza
    que el sistema no sustituya la defensa letrada humana.
    """

    OFF_TOPIC_KEYWORDS = [
        "receta", "cocina", "fútbol", "chiste", "poema", "clima", "musica", 
        "videojuegos", "comprar criptomonedas", "bitcoin"
    ]

    UNETHICAL_OR_ILLEGAL_KEYWORDS = [
        "sobornar", "coima", "falsificar", "arma ilegal", "mineria ilegal evadir", 
        "engañar al juez", "mentir en juicio", "escapar de la policia"
    ]

    URGENT_VIOLENCE_KEYWORDS = [
        "golpeando", "me pega", "pega a mis hijos", "amenaza de muerte", "cuchillo",
        "violencia física", "violencia sexual", "maqwawan", "wañuchiwayta munan", "maqaway"
    ]

    POLICE_DETENTION_KEYWORDS = [
        "detenido", "comisaría", "esposado", "policía me arrestó", "calabozo",
        "hap'irqawan", "preso", "fiscal me acusa"
    ]

    @classmethod
    def evaluate_query(cls, query: str) -> Tuple[bool, Optional[str], Optional[ReferralService], Optional[str]]:
        """
        Retorna:
        - is_blocked: bool
        - reason: "off_topic" | "unethical" | "urgent_violence" | "detention" | None
        - referral: ReferralService | None
        - custom_explanation: Mensaje adaptado
        """
        q_lower = query.lower()

        # 1. Fuera de alcance
        for kw in cls.OFF_TOPIC_KEYWORDS:
            if kw in q_lower:
                return (
                    True, 
                    "off_topic", 
                    None,
                    "Kay sistemaqa normas legales peruanas nisqamanta willanapaqmi. / Este sistema está diseñado exclusivamente para consultas sobre normas jurídicas peruanas y derechos ciudadanos."
                )

        # 2. Asuntos ilícitos o contrarios a la ley
        for kw in cls.UNETHICAL_OR_ILLEGAL_KEYWORDS:
            if kw in q_lower:
                return (
                    True,
                    "unethical",
                    None,
                    "Mana allin ruraykunamantaqa manam yanapaykuchu. / El sistema no brinda orientación para evadir la justicia ni cometer actos ilícitos. Las normas peruanas sancionan estos actos."
                )

        # 3. Violencia urgente (Línea 100 prioridad inmediata)
        for kw in cls.URGENT_VIOLENCE_KEYWORDS:
            if kw in q_lower:
                ref = ReferralService(
                    name=settings.LINEA_100_NOMBRE,
                    phone=settings.LINEA_100,
                    description="Servicio gratuito y confidencial del MIMP disponible las 24 horas para atención ante violencia física, psicológica o sexual.",
                    official_url="https://www.gob.pe/linea100",
                    is_urgent=True
                )
                return (
                    False,
                    "urgent_violence",
                    ref,
                    "Urgente: Si estás en peligro inmediato o sufriendo violencia, busca protección ahora mismo. La Línea 100 atiende en quechua las 24 horas sin costo."
                )

        # 4. Detención policial / Debido proceso penal (Defensa Pública MINJUSDH)
        for kw in cls.POLICE_DETENTION_KEYWORDS:
            if kw in q_lower:
                ref = ReferralService(
                    name=settings.DEFENSA_PUBLICA_NOMBRE,
                    phone=settings.DEFENSA_PUBLICA_FONO,
                    description="Defensa penal pública gratuita del Ministerio de Justicia. Tienes derecho a un abogado y a un intérprete oficial en tu lengua.",
                    official_url=settings.DEFENSA_PUBLICA_WEB,
                    is_urgent=True
                )
                return (
                    False,
                    "detention",
                    ref,
                    "Importante: En caso de detención policial, la ley garantiza tu derecho a guardar silencio y a contar con un abogado defensor público gratuito e intérprete en tu idioma."
                )

        # Consulta legal estándar dentro del alcance
        return (False, None, None, None)
