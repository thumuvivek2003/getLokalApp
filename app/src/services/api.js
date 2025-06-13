const BASE_URL = 'https://testapi.getlokalapp.com/common';

export const fetchJobs = async (page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/jobs?page=${page}`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};