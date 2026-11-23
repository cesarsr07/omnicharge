const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ClassData {
  id: string;
  name: string;
  mentorName: string;
  studentsCount: number;
}

export const getClassList = async (): Promise<ClassData[]> => {
  try {
    const res = await fetch(`${API_URL}/classes`);
    if (!res.ok) throw new Error('Falha ao buscar turmas');
    return await res.json();
  } catch (error) {
    console.error('getClassList error:', error);
    return [];
  }
};
