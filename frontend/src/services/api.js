import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout - the Oracle is taking longer than usual to respond'));
    }
    
    if (error.response) {
      return Promise.reject(new Error(error.response.data?.error || 'An unexpected error occurred'));
    }
    
    if (error.request) {
      return Promise.reject(new Error('Network error - unable to reach the Oracle'));
    }
    
    return Promise.reject(error);
  }
);

export const oracleAPI = {
  async askQuestion(question, sessionId = null, enhancement = null) {
    const payload = {
      question: question.trim(),
      sessionId
    };
    
    if (enhancement) {
      payload.enhancement = enhancement;
    }
    
    return await api.post('/ask', payload);
  },

  async getOracleState() {
    return await api.get('/oracle-mood');
  },

  async provideFeedback(questionId, rating) {
    return await api.post('/feedback', {
      questionId,
      rating
    });
  },

  async getHistory(sessionId, limit = 10) {
    return await api.get(`/history/${sessionId}?limit=${limit}`);
  },

  async getAnalytics(days = 7) {
    return await api.get(`/analytics?days=${days}`);
  },

  async getStatus() {
    return await api.get('/status');
  }
};

export default api;