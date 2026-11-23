const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface DashboardMetrics {
  totalStudents: number;
  totalClasses: number;
  completedGoals: number;
}

export const getDashboardData = async (): Promise<DashboardMetrics> => {
  try {
    const res = await fetch(`${API_URL}/dashboard`);
    if (!res.ok) throw new Error('Falha ao obter métricas');
    return await res.json();
  } catch (error) {
    console.error('getDashboardData error:', error);
    return { totalStudents: 0, totalClasses: 0, completedGoals: 0 };
  }
};
