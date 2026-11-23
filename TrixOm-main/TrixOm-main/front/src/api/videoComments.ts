const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface Comment {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export const getVideoComments = async (videoId: string): Promise<Comment[]> => {
  try {
    const res = await fetch(`${API_URL}/videos/${videoId}/comments`);
    if (!res.ok) throw new Error('Falha ao obter comentários do vídeo');
    return await res.json();
  } catch (error) {
    console.error('getVideoComments error:', error);
    return [];
  }
};
