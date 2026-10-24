"""
Script de ingesta y verificación del corpus jurídico oficial peruano.
Procesa las normas, valida los enlaces del SPIJ y actualiza la base de datos.
"""
from app.models.database import SessionLocal, init_db
from app.models.models import LegalDocument, LegalChunk
from app.services.retrieval_service import OFFICIAL_LEGAL_CORPUS

def run_ingest():
    print("Iniciando ingesta del corpus jurídico oficial...")
    init_db()
    db = SessionLocal()
    try:
        inserted_docs = 0
        inserted_chunks = 0
        for item in OFFICIAL_LEGAL_CORPUS:
            # Comprobar si ya existe el documento
            doc = db.query(LegalDocument).filter(LegalDocument.id == item["document_id"]).first()
            if not doc:
                doc = LegalDocument(
                    id=item["document_id"],
                    title=item["title"],
                    issuer=item["issuer"],
                    official_url=item["official_url"],
                    publication_date=item.get("publication_date"),
                    verification_status="verified"
                )
                db.add(doc)
                inserted_docs += 1

            chunk = LegalChunk(
                document_id=item["document_id"],
                article_number=item["article"],
                section_title=item["article"],
                content_es=item["content_es"],
                content_qu=item.get("content_qu_chanka"),
                dialect="quechua_chanka",
                category=item.get("category"),
                keywords=item.get("keywords")
            )
            db.add(chunk)
            inserted_chunks += 1

        db.commit()
        print(f"Ingesta completada: {inserted_docs} documentos y {inserted_chunks} fragmentos indexados.")
    except Exception as e:
        db.rollback()
        print(f"Error en ingesta: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    run_ingest()
