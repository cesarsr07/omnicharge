const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface Goal {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export const getGoals = async (): Promise<Goal[]> => {
  try {
    const res = await fetch(`${API_URL}/goals`);
    if (!res.ok) throw new Error('Falha ao buscar metas');
    return await res.json();
  } catch (error) {
    console.error('getGoals error:', error);
    return [];
  }
};
