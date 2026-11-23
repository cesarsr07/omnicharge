const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface MentorStats {
  assignedClasses: number;
  pendingFeedbacks: number;
}

export const getMentorStats = async (): Promise<MentorStats> => {
  try {
    const res = await fetch(`${API_URL}/mentor/dashboard`);
    if (!res.ok) throw new Error('Falha ao buscar estatísticas do mentor');
    return await res.json();
  } catch (error) {
    console.error('getMentorStats error:', error);
    return { assignedClasses: 0, pendingFeedbacks: 0 };
  }
};
