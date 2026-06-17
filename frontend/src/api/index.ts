import axios from 'axios';
import { SurveyDto } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export const uploadPdf = async (file: File): Promise<SurveyDto> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/parser/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const createSurvey = async (data: SurveyDto): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/surveys`, data);
  return response.data;
};

export const fetchSurveys = async (): Promise<any[]> => {
  const response = await axios.get(`${API_BASE_URL}/surveys`);
  return response.data;
};

export const fetchSurvey = async (id: string): Promise<any> => {
  const response = await axios.get(`${API_BASE_URL}/surveys/${id}`);
  return response.data;
};

export const updateSurvey = async (id: string, data: SurveyDto): Promise<any> => {
  const response = await axios.put(`${API_BASE_URL}/surveys/${id}`, data);
  return response.data;
};

export const fetchSurveyVersions = async (id: string): Promise<any[]> => {
  const response = await axios.get(`${API_BASE_URL}/surveys/${id}/versions`);
  return response.data;
};
