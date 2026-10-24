from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_consultation_detention_quechua():
    response = client.post("/api/chat", json={
        "query": "Policiakunam hap'irqawan, ¿imatan rurayman?",
        "input_language": "qu",
        "dialect": "quechua_chanka"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "answered"
    assert len(data["sources"]) > 0
    assert "Artículo 71" in data["sources"][0]["article"]
    assert data["translation"]["text"] is not None

def test_consultation_domestic_violence():
    response = client.post("/api/chat", json={
        "query": "Qosaymi maqwawan wasiypi, ¿maytan risaq yanapakuy mañakuq?",
        "input_language": "qu",
        "dialect": "quechua_chanka"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "answered"
    assert "30364" in data["sources"][0]["title"]
    assert data["referral_service"]["phone"] == "100"

def test_guardrail_abstention_off_topic():
    response = client.post("/api/chat", json={
        "query": "Dame la receta para cocinar papa a la huancaina",
        "input_language": "es"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "off_topic"
    assert len(data["sources"]) == 0

def test_guardrail_abstention_insufficient_evidence():
    response = client.post("/api/chat", json={
        "query": "Quiero saber la ley sobre astronautas que viajan a Jupiter",
        "input_language": "es"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "insufficient_evidence"
    assert data["requires_human_review"] is True

def test_dialects_endpoint():
    response = client.get("/api/dialects")
    assert response.status_code == 200
    data = response.json()
    branch_ids = [b["id"] for b in data["branches"]]
    assert "sureno" in branch_ids
    assert "central" in branch_ids
    assert "norteno" in branch_ids
    assert "amazonico" in branch_ids

def test_spanish_mode_disallows_quechua_dialect():
    # Cuando se selecciona español, el backend NO asigna variante de quechua
    response = client.post("/api/chat", json={
        "query": "¿Cuáles son mis derechos si la policía me detiene?",
        "input_language": "es",
        "dialect": "quechua_central_ancash" # Enviado accidentalmente, debe anularse
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "answered"
    assert data["detected_dialect"] is None
    assert data["translation"]["dialect"] is None

def test_quechua_central_variant():
    response = client.post("/api/chat", json={
        "query": "Polisiakunam hapimarqan, ¿imataraq rurashaq kikïpa shimïchaw?",
        "input_language": "qu",
        "dialect": "quechua_central_ancash"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "answered"
    assert data["detected_dialect"] == "quechua_central_ancash"
    assert "Quechua Central" in data["translation"]["text"]

def test_quechua_amazonico_variant():
    response = client.post("/api/chat", json={
        "query": "Ñukata wasipi makawarkami, ¿comisariapi yanapayta mañayta ushanichu?",
        "input_language": "qu",
        "dialect": "quechua_amazonico_lamas"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "answered"
    assert data["detected_dialect"] == "quechua_amazonico_lamas"
    assert "Quechua Amazónico" in data["translation"]["text"]

def test_quechua_norteno_variant():
    response = client.post("/api/chat", json={
        "query": "Comisariapi hapisuptiykiqa, ¿abogadu gratuituta quwankumanchu quechua parlaptiy?",
        "input_language": "qu",
        "dialect": "quechua_norteno_cajamarca"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "answered"
    assert data["detected_dialect"] == "quechua_norteno_cajamarca"
    assert "Quechua Norteño" in data["translation"]["text"]
