const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface EvaluationResult {
  id: string;
  studentId: string;
  score: number;
  feedback: string;
}

export const getResults = async (): Promise<EvaluationResult[]> => {
  try {
    const res = await fetch(`${API_URL}/results`);
    if (!res.ok) throw new Error('Falha ao obter resultados');
    return await res.json();
  } catch (error) {
    console.error('getResults error:', error);
    return [];
  }
};
