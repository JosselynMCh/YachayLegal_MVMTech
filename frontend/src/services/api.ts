import type { ChatResponse, LegalServiceInfo, QualityMetrics, SourceCitation } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  async checkHealth(): Promise<{ status: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async sendConsultation(
    query: string,
    inputLanguage: string = 'auto',
    dialect?: string | null
  ): Promise<ChatResponse> {
    const payload: { query: string; input_language: string; dialect: string | null } = {
      query,
      input_language: inputLanguage,
      dialect: inputLanguage === 'es' ? null : (dialect || 'quechua_chanka')
    };

    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Error en el servidor: ${res.statusText}`);
    }
    return await res.json();
  },

  async getDialects(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/dialects`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getSources(): Promise<SourceCitation[]> {
    const res = await fetch(`${API_BASE_URL}/sources`);
    if (!res.ok) throw new Error('Error al cargar fuentes oficiales');
    return await res.json();
  },

  async getServices(): Promise<LegalServiceInfo[]> {
    const res = await fetch(`${API_BASE_URL}/services`);
    if (!res.ok) throw new Error('Error al cargar servicios oficiales');
    return await res.json();
  },

  async getVoiceSamples(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/voice/samples`);
    if (!res.ok) return [];
    return await res.json();
  },

  async getMetrics(): Promise<QualityMetrics> {
    const res = await fetch(`${API_BASE_URL}/admin/metrics`);
    if (!res.ok) throw new Error('Error al obtener métricas');
    return await res.json();
  },

  async submitFeedback(userQuery: string, issueType: string, comment?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_query: userQuery, issue_type: issueType, comment }),
    });
    return await res.json();
  },

  async submitReview(data: {
    query: string;
    suggested_qu: string;
    reviewer_name: string;
    is_approved?: boolean;
    notes?: string;
    dialect?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al registrar revisión');
    return await res.json();
  },

  async transcribeAudio(audioBlob: Blob, dialect?: string): Promise<{ transcription: string; confidence: number }> {
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'grabacion.webm');
    if (dialect) formData.append('dialect', dialect);

    const res = await fetch(`${API_BASE_URL}/voice/transcribe`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Error al transcribir audio');
    return await res.json();
  }
};
