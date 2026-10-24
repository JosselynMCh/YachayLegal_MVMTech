from typing import Dict, Any, List, Optional
from app.schemas.chat import (
    ChatRequest, ChatResponse, TranslationInfo, SourceCitation, ReferralService
)
from app.services.legal_guard import LegalGuard
from app.services.language_service import LanguageService
from app.services.retrieval_service import RetrievalService
from app.core import dialects
from app.core.config import settings

class AIService:
    """
    Paso 7 y Innovaciones 1 y 2 (PDF Pág. 8 & 11):
    Generación bilingüe con verificación estricta en dos etapas y control de significado
    respetando las 4 ramas del quechua en el Perú:
      - Quechua Sureño (Chanka, Cusco-Collao)
      - Quechua Central (Áncash, Huánuco, Junín, Pasco)
      - Quechua Norteño (Cajamarca, Inkawasi-Kañaris)
      - Quechua Amazónico (Lamas, Napo-Pastaza)
    
    Regla estricta: Si se selecciona Español, NO se asigna ni permite variante del quechua.
    """

    @classmethod
    def process_consultation(cls, request: ChatRequest) -> ChatResponse:
        user_query = request.query.strip()
        
        # 1. Detección y normalización lingüística
        detected_lang, confidence = LanguageService.detect_language(user_query)
        effective_lang = request.input_language if request.input_language in ("qu", "es") else detected_lang

        # REGLA ESTRICTA:
        # Si está seleccionado Español ('es'), NO se permite ni aplica variante de quechua.
        # Si está seleccionado Quechua ('qu'), se resuelve la variante dentro de las 4 ramas.
        if effective_lang == "es":
            dialect: Optional[str] = None
            branch: Optional[str] = None
            variant_desc: Optional[str] = None
        else:
            dialect = dialects.resolve_variant(request.dialect) or dialects.DEFAULT_VARIANT
            branch = dialects.get_branch(dialect)
            variant_desc = dialects.variant_label(dialect)

        # 2. Paso de Seguridad Jurídica & Guardrails (LegalGuard)
        is_blocked, block_reason, referral, explanation = LegalGuard.evaluate_query(user_query)
        if is_blocked:
            qu_blocked_msg = dialects.localized(
                "out_of_scope" if block_reason == "off_topic" else "unethical",
                dialect
            ) or "Kay tapukuyqa manam normas legales nisqapi kanchu."

            return ChatResponse(
                status=block_reason,
                input_language=effective_lang,
                detected_dialect=dialect,
                answer=explanation or "Consulta fuera de alcance legal.",
                translation=TranslationInfo(
                    language="qu" if effective_lang == "es" else "es",
                    dialect=dialect,
                    branch=branch,
                    text=qu_blocked_msg if effective_lang == "qu" else "Consulta en Español: fuera del alcance de orientación jurídica.",
                    validated=True,
                    notes=f"Variante: {variant_desc}" if variant_desc else "Español (sin variante quechua)"
                ),
                sources=[],
                limitations=["El sistema solo atiende normas y garantías legales oficiales del Perú."],
                requires_human_review=False,
                next_steps=["Reformula tu pregunta orientándola a tus derechos ante la policía, juzgados o violencia familiar."]
            )

        # 3. Normalización a búsqueda semántica interpretando según variante/rama
        normalized_search = (
            LanguageService.normalize_quechua_to_spanish_search(user_query, dialect=dialect) 
            if effective_lang == "qu" else user_query
        )

        # 4. Etapa 1 RAG: Búsqueda de Evidencia Oficial
        evidence_list, score = RetrievalService.search_evidence(normalized_search, dialect=dialect or "quechua_chanka")

        # 5. Control de Evidencia Mínima / Abstención Obligatoria (PDF Pág. 9 & 11)
        if not evidence_list or score < 0.18:
            qu_abstention = dialects.localized("abstention", dialect) or (
                "Manam tarinichu sut'i kamachikuyta kay tapukuymanta. "
                "Pantaykuna ama kananpaq, amachaq (abogado) oficialwan rimayta mañakuy."
            )

            return ChatResponse(
                status="insufficient_evidence",
                input_language=effective_lang,
                detected_dialect=dialect,
                normalized_query_es=normalized_search,
                answer=(
                    "No se encontró un artículo legal específico en la base oficial que responda con certeza tu duda. "
                    "Para evitar errores jurídicos, el sistema no inventa leyes y recomienda consultar a un defensor público oficial."
                ),
                translation=TranslationInfo(
                    language="qu" if effective_lang == "qu" else "es",
                    dialect=dialect,
                    branch=branch,
                    text=qu_abstention if effective_lang == "qu" else "Se activa abstención controlada: no se encontraron artículos oficiales con certeza suficiente.",
                    validated=True,
                    notes=f"Abstención formulada en {variant_desc}." if variant_desc else "Respuesta en Español. Variante quechua no aplica."
                ),
                sources=[],
                limitations=[
                    "No se encontraron normas aplicables con coincidencia verificable en el corpus actual.",
                    "La abstención previene alucinaciones o interpretaciones erróneas."
                ],
                requires_human_review=True,
                next_steps=[
                    "Contactar a la Defensa Pública gratuita del MINJUSDH al Fono 1884.",
                    "Revisar si tu duda corresponde a materia penal o de protección familiar."
                ],
                referral_service=referral or ReferralService(
                    name=settings.DEFENSA_PUBLICA_NOMBRE,
                    phone=settings.DEFENSA_PUBLICA_FONO,
                    description="Asistencia jurídica gratuita oficial del Estado peruano.",
                    official_url=settings.DEFENSA_PUBLICA_WEB,
                    is_urgent=False
                )
            )

        # 6. Etapa 2 RAG: Construcción de Respuesta Fundamentada
        primary_evidence = evidence_list[0]
        
        # Selección del texto en quechua validado según la rama y variante elegida
        if effective_lang == "es":
            # Si el usuario consulta en español, el texto principal es en español
            qu_text = None
            notes = "Consulta procesada en Español. Para seleccionar una de las 4 variantes de Quechua (Sureño, Central, Norteño, Amazónico), cambia el selector de idioma a Quechua."
        else:
            # Seleccionar la redacción según la rama del Quechua
            if branch == "central":
                qu_text = primary_evidence.get("content_qu_central") or primary_evidence.get("content_qu_chanka", "")
            elif branch == "norteno":
                qu_text = primary_evidence.get("content_qu_norteno") or primary_evidence.get("content_qu_chanka", "")
            elif branch == "amazonico":
                qu_text = primary_evidence.get("content_qu_amazonico") or primary_evidence.get("content_qu_chanka", "")
            else:
                # Rama sureña: Chanka o Cusco-Collao
                if dialect == "quechua_cusco_collao":
                    qu_text = primary_evidence.get("content_qu_collao") or primary_evidence.get("content_qu_chanka", "")
                else:
                    qu_text = primary_evidence.get("content_qu_chanka", "")

            notes = (
                f"Traducción preliminar adaptada a {variant_desc}. "
                "Borrador sujeto a validación comunitaria con hablantes nativos e intérpretes certificados del Ministerio de Cultura."
            )

        # Mapeo a citas oficiales estrictas
        sources_citations: List[SourceCitation] = []
        for ev in evidence_list:
            sources_citations.append(SourceCitation(
                document_id=ev["document_id"],
                title=ev["title"],
                issuer=ev["issuer"],
                article=ev["article"],
                article_content=ev["content_es"],
                official_url=ev["official_url"],
                publication_date=ev.get("publication_date")
            ))

        # Pasos prácticos según categoría
        if primary_evidence.get("category") == "debido_proceso":
            es_explanation = (
                f"De acuerdo con el {primary_evidence['article']} del {primary_evidence['title']}, "
                "si te encuentras ante la policía o fiscalía tienes derechos fundamentales protegidos por el Estado: "
                "1) Derecho a guardar silencio (no declarar sin tu abogado). "
                "2) Derecho a que te asignen un abogado defensor público gratuito si no cuentas con dinero. "
                "3) Derecho indispensable a ser asistido por un traductor o intérprete oficial si tu lengua materna es el quechua."
            )
            steps = [
                "Exige que te asignen un intérprete oficial en tu variante de quechua antes de firmar cualquier papel.",
                "Pide comunicarte de inmediato con un familiar y con un Defensor Público Gratuito del MINJUSDH (Fono 1884).",
                "No declares sin la presencia de tu abogado defensor."
            ]
            default_ref = ReferralService(
                name=settings.DEFENSA_PUBLICA_NOMBRE,
                phone=settings.DEFENSA_PUBLICA_FONO,
                description="Asistencia penal pública gratuita garantizada por el MINJUSDH.",
                official_url=settings.DEFENSA_PUBLICA_WEB,
                is_urgent=True
            )
        elif primary_evidence.get("category") == "violencia_familiar":
            es_explanation = (
                f"Conforme al {primary_evidence['article']} de la {primary_evidence['title']}, "
                "toda persona que sufra agresiones físicas o psicológicas puede presentar una denuncia inmediata "
                "en la comisaría, juzgado de paz o fiscalía sin costo alguno y sin necesitar la firma de un abogado. "
                "El juez debe dictar medidas de protección (como el alejamiento del agresor) en un plazo máximo de 24 a 72 horas."
            )
            steps = [
                "Acude a la comisaría más cercana o juzgado de paz letrado a denunciar el hecho verbalmente o por escrito.",
                "Llama sin costo a la Línea 100 del MIMP (atiende en quechua las 24 horas) para acompañamiento legal y psicológico.",
                "Solicita el retiro del agresor y medidas de prohibición de acercamiento para proteger tu integridad y la de tus hijos."
            ]
            default_ref = ReferralService(
                name=settings.LINEA_100_NOMBRE,
                phone=settings.LINEA_100,
                description="Línea gratuita de emergencia contra la violencia familiar (atiende en quechua).",
                official_url="https://www.gob.pe/linea100",
                is_urgent=True
            )
        elif primary_evidence.get("category") == "familia_alimentos":
            es_explanation = (
                f"Conforme al {primary_evidence['article']} del {primary_evidence['title']}, "
                "la pensión de alimentos comprende todo lo indispensable para el sustento, vivienda, vestido, "
                "educación, salud y recreación de los hijos menores o mayores con incapacidad. "
                "Para iniciar la demanda de pensión de alimentos no se requiere firma de abogado ni pagar aranceles judiciales en juzgados de paz letrados."
            )
            steps = [
                "Presenta una demanda de alimentos ante el Juzgado de Paz Letrado de tu distrito mediante el formulario oficial gratuito del Poder Judicial.",
                "Adjunta la partida de nacimiento del menor y constancias de gastos escolares, médicos o de vivienda.",
                "Puedes acudir al consultorio gratuito de Defensa Pública del MINJUSDH (Fono 1884) para que te redacten la demanda sin costo."
            ]
            default_ref = ReferralService(
                name=settings.DEFENSA_PUBLICA_NOMBRE,
                phone=settings.DEFENSA_PUBLICA_FONO,
                description="Consultorio jurídico gratuito del MINJUSDH para demandas de alimentos.",
                official_url=settings.DEFENSA_PUBLICA_WEB,
                is_urgent=False
            )
        elif primary_evidence.get("category") == "tierras_comunales":
            es_explanation = (
                f"De conformidad con el {primary_evidence['article']} de la {primary_evidence['title']}, "
                "las Comunidades Campesinas y Nativas tienen personería jurídica y autonomía organizativa y territorial. "
                "La propiedad comunal sobre sus tierras es imprescriptible y no puede ser despojada arbitrariamente por terceros ni embargada."
            )
            steps = [
                "Acude a la directiva comunal y a la Asamblea General de la comunidad para verificar las actas y linderos del título de propiedad comunal.",
                "Denuncia cualquier intento de usurpación o despojo ante la fiscalía provincial o la Defensoría del Pueblo.",
                "Coordina con el Ministerio de Desarrollo Agrario y Riego (MIDAGRI) para titulación y georreferenciación oficial."
            ]
            default_ref = ReferralService(
                name="Defensoría del Pueblo - Pueblos Indígenas y Comunidades",
                phone="0800-15-170",
                description="Protección de derechos colectivos y territoriales de comunidades originarias.",
                official_url="https://www.defensoria.gob.pe",
                is_urgent=False
            )
        elif primary_evidence.get("category") == "derecho_laboral":
            es_explanation = (
                f"Según el {primary_evidence['article']} de la {primary_evidence['title']}, "
                "si sufres un despido sin causa justa comprobada o sin procedimiento previo, se trata de un despido arbitrario. "
                "Tienes derecho a cobrar una indemnización equivalente a 1.5 remuneraciones por año laborado (hasta un tope de 12 sueldos) o reclamar la reposición si fuiste despedido de forma incausada o nula."
            )
            steps = [
                "Solicita una Constatación Policial de Despido en la comisaría del sector dentro de los 3 días de producido el hecho.",
                "Presenta una denuncia laboral ante la Superintendencia Nacional de Fiscalización Laboral (SUNAFIL) de forma virtual o presencial.",
                "Cuentas con un plazo máximo de 30 días hábiles para demandar la indemnización o reposición ante el Juzgado Laboral."
            ]
            default_ref = ReferralService(
                name="SUNAFIL - Fiscalización Laboral Gratuita",
                phone="0800-1-6872",
                description="Orientación y denuncias laborales gratuitas por despido arbitrario y falta de pago.",
                official_url="https://www.gob.pe/sunafil",
                is_urgent=False
            )
        else:
            es_explanation = (
                f"Según lo establecido en el {primary_evidence['article']} de la {primary_evidence['title']}, "
                "tienes el derecho constitucional inalienable a comunicarte y ser procesado en tu propio idioma nativo "
                "ante cualquier autoridad pública mediante un intérprete o traductor."
            )
            steps = [
                "Solicita formalmente a la autoridad que todas las diligencias cuenten con intérprete oficial.",
                "Puedes acudir a la Defensoría del Pueblo si una entidad vulnera tu derecho al uso de tu lengua quechua."
            ]
            default_ref = ReferralService(
                name="Defensoría del Pueblo del Perú",
                phone="0800-15-170",
                description="Línea de atención gratuita para proteger derechos ciudadanos e interculturales.",
                official_url="https://www.defensoria.gob.pe",
                is_urgent=False
            )

        return ChatResponse(
            status="answered",
            input_language=effective_lang,
            detected_dialect=dialect,
            normalized_query_es=normalized_search,
            answer=es_explanation,
            translation=TranslationInfo(
                language="qu" if effective_lang == "qu" else "es",
                dialect=dialect,
                branch=branch,
                text=qu_text,
                validated=False if effective_lang == "qu" else True,
                notes=notes
            ),
            sources=sources_citations,
            limitations=[
                "Esta orientación jurídica no sustituye el patrocinio de un abogado defensor particular o público en juicio.",
                "Las medidas procesales deben ser solicitadas formalmente ante la autoridad competente."
            ],
            requires_human_review=False,
            next_steps=steps,
            referral_service=referral or default_ref
        )
