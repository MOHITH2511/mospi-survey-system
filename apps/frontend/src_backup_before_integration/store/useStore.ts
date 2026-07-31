import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Survey, 
  SurveyResponse, 
  Notification, 
  Language,
  Region,
  QuestionBankItem,
  EnumeratorPerformance,
  MapData
} from '../types';
import { mockSurveys, mockUsers, mockRegions, mockQuestionBank, mockResponses } from './mockData';

interface AppState {
  // Auth
  currentUser: User | null;
  language: Language;
  
  // Data
  surveys: Survey[];
  responses: SurveyResponse[];
  users: User[];
  regions: Region[];
  questionBank: QuestionBankItem[];
  notifications: Notification[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;
  
  // Survey actions
  createSurvey: (survey: Survey) => void;
  updateSurvey: (id: string, updates: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  publishSurvey: (id: string) => void;
  
  // Response actions
  createResponse: (response: SurveyResponse) => void;
  updateResponse: (id: string, updates: Partial<SurveyResponse>) => void;
  
  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  
  // Getters
  getSurveyById: (id: string) => Survey | undefined;
  getResponsesBySurveyId: (surveyId: string) => SurveyResponse[];
  getUsersByRole: (role: User['role']) => User[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      language: 'en',
      surveys: mockSurveys,
      responses: mockResponses,
      users: mockUsers,
      regions: mockRegions,
      questionBank: mockQuestionBank,
      notifications: [],
      
      setCurrentUser: (user) => set({ currentUser: user }),
      setLanguage: (lang) => set({ language: lang }),
      
      createSurvey: (survey) => set((state) => ({
        surveys: [...state.surveys, survey]
      })),
      
      updateSurvey: (id, updates) => set((state) => ({
        surveys: state.surveys.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      
      deleteSurvey: (id) => set((state) => ({
        surveys: state.surveys.filter(s => s.id !== id)
      })),
      
      publishSurvey: (id) => set((state) => ({
        surveys: state.surveys.map(s => 
          s.id === id 
            ? { ...s, status: 'live', publishedAt: new Date() } 
            : s
        )
      })),
      
      createResponse: (response) => set((state) => ({
        responses: [...state.responses, response]
      })),
      
      updateResponse: (id, updates) => set((state) => ({
        responses: state.responses.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications]
      })),
      
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      getSurveyById: (id) => {
        return get().surveys.find(s => s.id === id);
      },
      
      getResponsesBySurveyId: (surveyId) => {
        return get().responses.filter(r => r.surveyId === surveyId);
      },
      
      getUsersByRole: (role) => {
        return get().users.filter(u => u.role === role);
      },
    }),
    {
      name: 'gov-survey-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        language: state.language,
      }),
    }
  )
);
