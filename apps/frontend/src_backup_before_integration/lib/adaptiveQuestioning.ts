/**
 * AI-Driven Adaptive Questioning Engine
 * Infers respondent traits and personalizes follow-up questions dynamically
 */

import type { SurveyBlock, QuestionType } from '../types';

export interface RespondentProfile {
  age?: number;
  gender?: string;
  occupation?: string;
  industry?: string;
  education?: string;
  location?: string;
  income?: string;
  employmentStatus?: string;
  householdSize?: number;
  maritalStatus?: string;
}

export interface AdaptiveQuestion {
  id: string;
  type: QuestionType;
  label: { en: string; hi: string };
  reason: string; // Why this question is being asked
  priority: number; // 1-10, higher = more important
  relevanceScore: number; // 0-1, how relevant based on profile
}

/**
 * Infer respondent traits from answers
 */
export function inferRespondentTraits(answers: Record<string, any>): RespondentProfile {
  const profile: RespondentProfile = {};

  // Infer age
  if (answers['age'] || answers['block-age']) {
    const age = parseInt(answers['age'] || answers['block-age']);
    if (!isNaN(age)) {
      profile.age = age;
    }
  }

  // Infer education level
  if (answers['education'] || answers['block-education']) {
    profile.education = answers['education'] || answers['block-education'];
  }

  // Infer occupation
  if (answers['occupation'] || answers['block-occupation']) {
    profile.occupation = (answers['occupation'] || answers['block-occupation']).toLowerCase();
  }

  // Infer employment status
  if (answers['employment'] || answers['employment_status']) {
    profile.employmentStatus = (answers['employment'] || answers['employment_status']).toLowerCase();
  }

  // Infer household size
  if (answers['household_members'] || answers['family_size']) {
    const size = parseInt(answers['household_members'] || answers['family_size']);
    if (!isNaN(size)) {
      profile.householdSize = size;
    }
  }

  // Infer marital status
  if (answers['marital_status']) {
    profile.maritalStatus = answers['marital_status'].toLowerCase();
  }

  // Infer gender
  if (answers['gender'] || answers['block-gender']) {
    profile.gender = (answers['gender'] || answers['block-gender']).toLowerCase();
  }

  return profile;
}

/**
 * Generate adaptive follow-up questions based on respondent profile
 */
export function generateAdaptiveQuestions(
  profile: RespondentProfile,
  existingAnswers: Record<string, any>,
  surveyContext: 'employment' | 'health' | 'education' | 'housing' | 'general'
): AdaptiveQuestion[] {
  const questions: AdaptiveQuestion[] = [];

  // Employment-related adaptive questions
  if (surveyContext === 'employment' || profile.occupation) {
    if (profile.employmentStatus === 'employed' || profile.occupation) {
      // Ask about commute if employed
      if (!existingAnswers['commute_time']) {
        questions.push({
          id: 'adaptive-commute',
          type: 'single-choice',
          label: {
            en: 'How long does it take you to commute to work?',
            hi: 'आपको काम पर जाने में कितना समय लगता है?',
          },
          reason: 'Respondent is employed, commute time is relevant for work-life analysis',
          priority: 7,
          relevanceScore: 0.9,
        });
      }

      // Ask about work satisfaction
      if (!existingAnswers['job_satisfaction']) {
        questions.push({
          id: 'adaptive-job-satisfaction',
          type: 'rating',
          label: {
            en: 'On a scale of 1-10, how satisfied are you with your current job?',
            hi: '1-10 के पैमाने पर, आप अपनी वर्तमान नौकरी से कितने संतुष्ट हैं?',
          },
          reason: 'Employment satisfaction is key metric for labor force surveys',
          priority: 8,
          relevanceScore: 0.85,
        });
      }

      // Ask about skills if in tech/professional occupation
      if (profile.occupation && (
        profile.occupation.includes('engineer') ||
        profile.occupation.includes('developer') ||
        profile.occupation.includes('professional')
      )) {
        questions.push({
          id: 'adaptive-digital-skills',
          type: 'multi-choice',
          label: {
            en: 'Which digital skills do you use regularly in your work?',
            hi: 'आप अपने काम में किन डिजिटल कौशल का नियमित रूप से उपयोग करते हैं?',
          },
          reason: 'Professional occupation suggests digital skills usage',
          priority: 6,
          relevanceScore: 0.75,
        });
      }
    } else if (profile.employmentStatus === 'unemployed') {
      // Ask about job search activities
      if (!existingAnswers['job_search']) {
        questions.push({
          id: 'adaptive-job-search',
          type: 'single-choice',
          label: {
            en: 'Are you actively looking for work?',
            hi: 'क्या आप सक्रिय रूप से काम की तलाश कर रहे हैं?',
          },
          reason: 'Unemployment status detected, job search status is relevant',
          priority: 9,
          relevanceScore: 0.95,
        });
      }

      // Ask about last employment
      if (!existingAnswers['last_employment']) {
        questions.push({
          id: 'adaptive-last-employment',
          type: 'short-text',
          label: {
            en: 'When did you last work? (e.g., 6 months ago)',
            hi: 'आपने आखिरी बार कब काम किया? (उदाहरण: 6 महीने पहले)',
          },
          reason: 'Duration of unemployment is important for labor statistics',
          priority: 8,
          relevanceScore: 0.9,
        });
      }
    }
  }

  // Age-based adaptive questions
  if (profile.age) {
    // Youth (15-29)
    if (profile.age >= 15 && profile.age <= 29) {
      if (!existingAnswers['skill_training']) {
        questions.push({
          id: 'adaptive-skill-training',
          type: 'single-choice',
          label: {
            en: 'Have you received any vocational or skill training in the past 2 years?',
            hi: 'क्या आपने पिछले 2 वर्षों में कोई व्यावसायिक या कौशल प्रशिक्षण प्राप्त किया है?',
          },
          reason: 'Youth population, skill training is policy-relevant',
          priority: 7,
          relevanceScore: 0.8,
        });
      }
    }

    // Elderly (60+)
    if (profile.age >= 60) {
      if (!existingAnswers['pension_status']) {
        questions.push({
          id: 'adaptive-pension',
          type: 'single-choice',
          label: {
            en: 'Do you receive any pension or retirement benefits?',
            hi: 'क्या आपको कोई पेंशन या सेवानिवृत्ति लाभ मिलता है?',
          },
          reason: 'Elderly respondent, pension coverage is important social indicator',
          priority: 8,
          relevanceScore: 0.9,
        });
      }

      if (!existingAnswers['health_insurance']) {
        questions.push({
          id: 'adaptive-health-insurance',
          type: 'single-choice',
          label: {
            en: 'Do you have health insurance coverage?',
            hi: 'क्या आपके पास स्वास्थ्य बीमा है?',
          },
          reason: 'Elderly population, health insurance coverage is critical',
          priority: 9,
          relevanceScore: 0.95,
        });
      }
    }

    // Reproductive age women (15-49)
    if (profile.age >= 15 && profile.age <= 49 && profile.gender === 'female') {
      if (!existingAnswers['maternal_health'] && profile.maritalStatus === 'married') {
        questions.push({
          id: 'adaptive-maternal-health',
          type: 'single-choice',
          label: {
            en: 'Have you had access to maternal health services in the past 5 years?',
            hi: 'क्या आपको पिछले 5 वर्षों में मातृ स्वास्थ्य सेवाओं तक पहुंच मिली है?',
          },
          reason: 'Married woman of reproductive age, maternal health is MDG indicator',
          priority: 8,
          relevanceScore: 0.85,
        });
      }
    }
  }

  // Household size-based questions
  if (profile.householdSize && profile.householdSize > 5) {
    if (!existingAnswers['housing_adequacy']) {
      questions.push({
        id: 'adaptive-housing-adequacy',
        type: 'single-choice',
        label: {
          en: 'How many rooms does your household have for sleeping?',
          hi: 'सोने के लिए आपके घर में कितने कमरे हैं?',
        },
        reason: 'Large household size, housing adequacy is relevant for living standards',
        priority: 7,
        relevanceScore: 0.8,
      });
    }
  }

  // Education-based adaptive questions
  if (profile.education) {
    const educationLower = profile.education.toLowerCase();
    
    // Low education (primary or below)
    if (educationLower.includes('primary') || educationLower.includes('illiterate')) {
      if (!existingAnswers['digital_literacy']) {
        questions.push({
          id: 'adaptive-digital-literacy',
          type: 'single-choice',
          label: {
            en: 'Can you use a mobile phone for basic tasks (calls, messages)?',
            hi: 'क्या आप बुनियादी कार्यों (कॉल, संदेश) के लिए मोबाइल फोन का उपयोग कर सकते हैं?',
          },
          reason: 'Low formal education, digital literacy is important for inclusion',
          priority: 6,
          relevanceScore: 0.75,
        });
      }
    }

    // Higher education
    if (educationLower.includes('graduate') || educationLower.includes('postgraduate')) {
      if (!existingAnswers['skill_match']) {
        questions.push({
          id: 'adaptive-skill-match',
          type: 'single-choice',
          label: {
            en: 'Does your current work match your educational qualifications?',
            hi: 'क्या आपका वर्तमान काम आपकी शैक्षिक योग्यता से मेल खाता है?',
          },
          reason: 'Higher education detected, skill-job match is labor market indicator',
          priority: 7,
          relevanceScore: 0.8,
        });
      }
    }
  }

  // Sort by priority and relevance
  questions.sort((a, b) => {
    const scoreA = a.priority * a.relevanceScore;
    const scoreB = b.priority * b.relevanceScore;
    return scoreB - scoreA;
  });

  return questions;
}

/**
 * Determine next best question to ask based on context
 */
export function getNextBestQuestion(
  profile: RespondentProfile,
  existingAnswers: Record<string, any>,
  remainingQuestions: SurveyBlock[],
  surveyContext: 'employment' | 'health' | 'education' | 'housing' | 'general'
): SurveyBlock | null {
  // First, try adaptive questions
  const adaptiveQuestions = generateAdaptiveQuestions(profile, existingAnswers, surveyContext);
  
  if (adaptiveQuestions.length > 0) {
    const topAdaptive = adaptiveQuestions[0];
    
    // Check if this adaptive question is more relevant than next regular question
    if (topAdaptive.relevanceScore > 0.8) {
      // Convert to SurveyBlock format
      return {
        id: topAdaptive.id,
        type: topAdaptive.type,
        label: topAdaptive.label,
        helpText: {
          en: `This question is asked based on your previous responses to better understand your situation.`,
          hi: `यह प्रश्न आपकी स्थिति को बेहतर ढंग से समझने के लिए आपकी पिछली प्रतिक्रियाओं के आधार पर पूछा जाता है।`,
        },
        required: false,
        validations: [],
        order: 999,
        isAISuggested: true,
      };
    }
  }

  // Otherwise, return next regular question
  return remainingQuestions[0] || null;
}

/**
 * Skip unnecessary questions based on profile
 */
export function shouldSkipQuestion(
  question: SurveyBlock,
  profile: RespondentProfile,
  existingAnswers: Record<string, any>
): { skip: boolean; reason?: string } {
  // Skip employment questions if retired
  if (profile.age && profile.age >= 65) {
    if (question.label.en.toLowerCase().includes('current job') || 
        question.label.en.toLowerCase().includes('workplace')) {
      return {
        skip: true,
        reason: 'Respondent is of retirement age',
      };
    }
  }

  // Skip education questions for elderly who have completed education
  if (profile.age && profile.age >= 60) {
    if (question.label.en.toLowerCase().includes('currently studying') ||
        question.label.en.toLowerCase().includes('school enrollment')) {
      return {
        skip: true,
        reason: 'Respondent is beyond typical education age',
      };
    }
  }

  // Skip childcare questions if no children
  if (profile.householdSize === 1 || (profile.maritalStatus === 'unmarried' && (!profile.age || profile.age < 25))) {
    if (question.label.en.toLowerCase().includes('children') ||
        question.label.en.toLowerCase().includes('childcare')) {
      return {
        skip: true,
        reason: 'Unlikely to have dependent children based on profile',
      };
    }
  }

  // Skip commute questions if unemployed
  if (profile.employmentStatus === 'unemployed') {
    if (question.label.en.toLowerCase().includes('commute') ||
        question.label.en.toLowerCase().includes('workplace')) {
      return {
        skip: true,
        reason: 'Respondent is not currently employed',
      };
    }
  }

  return { skip: false };
}

/**
 * Calculate completion efficiency score
 */
export function calculateEfficiencyScore(
  totalQuestions: number,
  questionsAnswered: number,
  questionsSkipped: number,
  timeSpent: number
): {
  score: number;
  efficiency: 'high' | 'medium' | 'low';
  timePerQuestion: number;
} {
  const timePerQuestion = timeSpent / questionsAnswered;
  const completionRate = questionsAnswered / totalQuestions;
  const skipRate = questionsSkipped / totalQuestions;

  // Score based on completion rate, skip rate, and time efficiency
  let score = completionRate * 100;
  score += skipRate * 10; // Bonus for intelligent skipping
  score -= Math.max(0, (timePerQuestion - 30) * 0.5); // Penalty for very slow responses

  score = Math.max(0, Math.min(100, score));

  let efficiency: 'high' | 'medium' | 'low';
  if (score >= 80) efficiency = 'high';
  else if (score >= 60) efficiency = 'medium';
  else efficiency = 'low';

  return {
    score: Math.round(score),
    efficiency,
    timePerQuestion: Math.round(timePerQuestion),
  };
}

/**
 * Generate summary insights about respondent
 */
export function generateRespondentInsights(profile: RespondentProfile): string[] {
  const insights: string[] = [];

  if (profile.age) {
    if (profile.age < 18) {
      insights.push('Minor - parental consent may be required');
    } else if (profile.age >= 15 && profile.age <= 29) {
      insights.push('Youth population segment - skill development focus');
    } else if (profile.age >= 60) {
      insights.push('Senior citizen - pension and healthcare focus');
    }
  }

  if (profile.education) {
    const edu = profile.education.toLowerCase();
    if (edu.includes('postgraduate') || edu.includes('phd')) {
      insights.push('Highly educated - detailed technical questions appropriate');
    } else if (edu.includes('illiterate') || edu.includes('primary')) {
      insights.push('Low formal education - simple language and assistance recommended');
    }
  }

  if (profile.employmentStatus === 'unemployed') {
    insights.push('Currently unemployed - job search and benefits questions relevant');
  } else if (profile.occupation) {
    const occ = profile.occupation.toLowerCase();
    if (occ.includes('manager') || occ.includes('director') || occ.includes('executive')) {
      insights.push('Management position - work-life balance questions relevant');
    } else if (occ.includes('labor') || occ.includes('worker')) {
      insights.push('Manual labor - workplace safety questions relevant');
    }
  }

  if (profile.householdSize && profile.householdSize > 6) {
    insights.push('Large household - resource adequacy questions important');
  }

  return insights;
}
