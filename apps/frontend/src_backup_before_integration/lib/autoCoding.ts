/**
 * Auto-Coding Engine for Survey Responses
 * Automatically codes text and categorical responses using MoSPI standards
 */

import { NCO_CODES, NIC_CODES, ISIC_CODES, searchClassificationCodes } from './classifications';
import type { ClassificationCode } from './classifications';

export interface AutoCodeResult {
  code: string;
  label: { en: string; hi: string };
  confidence: number;
  category?: string;
  alternativeCodes?: AutoCodeResult[];
}

/**
 * Keywords for NCO occupation coding
 */
const NCO_KEYWORDS: Record<string, string[]> = {
  'NCO-1120': ['manager', 'प्रबंधक', 'administration', 'प्रशासन', 'director', 'निदेशक'],
  'NCO-2142': ['civil engineer', 'सिविल इंजीनियर', 'engineer', 'इंजीनियर', 'construction engineer'],
  'NCO-2211': ['doctor', 'चिकित्सक', 'physician', 'डॉक्टर', 'medical practitioner'],
  'NCO-2221': ['nurse', 'नर्स', 'nursing', 'नर्सिंग'],
  'NCO-2330': ['teacher', 'शिक्षक', 'professor', 'प्रोफेसर', 'lecturer', 'व्याख्याता'],
  'NCO-2341': ['primary teacher', 'प्राथमिक शिक्षक', 'school teacher'],
  'NCO-2512': ['software developer', 'सॉफ्टवेयर डेवलपर', 'programmer', 'प्रोग्रामर', 'developer', 'डेवलपर'],
  'NCO-2514': ['programmer', 'प्रोग्रामर', 'coder', 'कोडर'],
  'NCO-3313': ['accountant', 'लेखाकार', 'accounting', 'लेखा'],
  'NCO-4110': ['clerk', 'क्लर्क', 'office clerk', 'कार्यालय क्लर्क'],
  'NCO-4211': ['bank teller', 'बैंक टेलर', 'banker', 'बैंकर'],
  'NCO-5120': ['cook', 'रसोइया', 'chef', 'शेफ'],
  'NCO-5223': ['salesperson', 'विक्रेता', 'sales', 'बिक्री', 'shop assistant'],
  'NCO-5230': ['cashier', 'कैशियर'],
  'NCO-6111': ['farmer', 'किसान', 'agriculture', 'कृषि', 'cultivator'],
  'NCO-7115': ['carpenter', 'बढ़ई'],
  'NCO-7212': ['welder', 'वेल्डर'],
  'NCO-8322': ['driver', 'चालक', 'taxi driver', 'टैक्सी चालक'],
  'NCO-8324': ['truck driver', 'ट्रक चालक', 'lorry driver'],
  'NCO-9111': ['domestic worker', 'घरेलू कार्यकर्ता', 'maid', 'नौकरानी', 'cleaner', 'सफाई कर्मचारी'],
  'NCO-9211': ['farm labourer', 'खेत मजदूर', 'agricultural labourer'],
  'NCO-9312': ['construction worker', 'निर्माण कार्यकर्ता', 'labourer', 'मजदूर'],
};

/**
 * Keywords for NIC industry coding
 */
const NIC_KEYWORDS: Record<string, string[]> = {
  'NIC-011': ['farming', 'खेती', 'crop growing', 'फसल उगाना'],
  'NIC-014': ['livestock', 'पशुधन', 'cattle', 'मवेशी', 'animal husbandry'],
  'NIC-03': ['fishing', 'मत्स्य पालन', 'aquaculture'],
  'NIC-05': ['coal mining', 'कोयला खनन', 'mining'],
  'NIC-10': ['food manufacturing', 'खाद्य विनिर्माण', 'food processing'],
  'NIC-13': ['textile', 'वस्त्र', 'garment', 'कपड़ा'],
  'NIC-20': ['chemical', 'रासायनिक', 'chemicals'],
  'NIC-21': ['pharmaceutical', 'फार्मास्युटिकल', 'medicine', 'दवा'],
  'NIC-26': ['electronics', 'इलेक्ट्रॉनिक्स', 'computer manufacturing'],
  'NIC-29': ['automobile', 'ऑटोमोबाइल', 'vehicle manufacturing', 'वाहन निर्माण'],
  'NIC-35': ['electricity', 'बिजली', 'power generation'],
  'NIC-41': ['construction', 'निर्माण', 'building construction'],
  'NIC-47': ['retail', 'खुदरा', 'shop', 'दुकान'],
  'NIC-49': ['transport', 'परिवहन', 'transportation', 'logistics'],
  'NIC-55': ['hotel', 'होटल', 'accommodation', 'आवास'],
  'NIC-56': ['restaurant', 'रेस्तरां', 'food service'],
  'NIC-62': ['IT services', 'आईटी सेवाएं', 'software', 'सॉफ्टवेयर', 'technology'],
  'NIC-64': ['banking', 'बैंकिंग', 'finance', 'वित्त'],
  'NIC-65': ['insurance', 'बीमा'],
  'NIC-68': ['real estate', 'रियल एस्टेट', 'property'],
  'NIC-85': ['education', 'शिक्षा', 'school', 'विद्यालय', 'college'],
  'NIC-86': ['health', 'स्वास्थ्य', 'hospital', 'अस्पताल', 'medical'],
};

/**
 * Auto-code occupation based on text input
 */
export function autoCodeOccupation(text: string, language: 'en' | 'hi' = 'en'): AutoCodeResult | null {
  if (!text || text.trim().length < 2) return null;

  const lowerText = text.toLowerCase();
  const matches: AutoCodeResult[] = [];

  // 1. Exact keyword matching
  for (const [code, keywords] of Object.entries(NCO_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        const ncoCode = NCO_CODES.find(c => c.code === code);
        if (ncoCode) {
          matches.push({
            code: ncoCode.code,
            label: ncoCode.label,
            confidence: 0.9,
            category: ncoCode.category,
          });
          break;
        }
      }
    }
  }

  // 2. Fuzzy search in all NCO codes
  if (matches.length === 0) {
    const fuzzyMatches = searchClassificationCodes(text, NCO_CODES, language);
    fuzzyMatches.slice(0, 3).forEach(code => {
      matches.push({
        code: code.code,
        label: code.label,
        confidence: 0.6,
        category: code.category,
      });
    });
  }

  if (matches.length === 0) return null;

  // Return best match with alternatives
  const [bestMatch, ...alternatives] = matches;
  return {
    ...bestMatch,
    alternativeCodes: alternatives.slice(0, 2), // Top 2 alternatives
  };
}

/**
 * Auto-code industry based on text input
 */
export function autoCodeIndustry(text: string, language: 'en' | 'hi' = 'en'): AutoCodeResult | null {
  if (!text || text.trim().length < 2) return null;

  const lowerText = text.toLowerCase();
  const matches: AutoCodeResult[] = [];

  // 1. Exact keyword matching
  for (const [code, keywords] of Object.entries(NIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        const nicCode = NIC_CODES.find(c => c.code === code);
        if (nicCode) {
          matches.push({
            code: nicCode.code,
            label: nicCode.label,
            confidence: 0.9,
            category: nicCode.category,
          });
          break;
        }
      }
    }
  }

  // 2. Fuzzy search in all NIC codes
  if (matches.length === 0) {
    const fuzzyMatches = searchClassificationCodes(text, NIC_CODES, language);
    fuzzyMatches.slice(0, 3).forEach(code => {
      matches.push({
        code: code.code,
        label: code.label,
        confidence: 0.6,
        category: code.category,
      });
    });
  }

  if (matches.length === 0) return null;

  // Return best match with alternatives
  const [bestMatch, ...alternatives] = matches;
  return {
    ...bestMatch,
    alternativeCodes: alternatives.slice(0, 2),
  };
}

/**
 * Auto-code ISIC based on industry description
 */
export function autoCodeISIC(text: string, language: 'en' | 'hi' = 'en'): AutoCodeResult | null {
  if (!text || text.trim().length < 2) return null;

  const fuzzyMatches = searchClassificationCodes(text, ISIC_CODES, language);
  
  if (fuzzyMatches.length === 0) return null;

  const [bestMatch, ...alternatives] = fuzzyMatches;
  return {
    code: bestMatch.code,
    label: bestMatch.label,
    confidence: 0.7,
    category: bestMatch.category,
    alternativeCodes: alternatives.slice(0, 2).map(code => ({
      code: code.code,
      label: code.label,
      confidence: 0.5,
      category: code.category,
    })),
  };
}

/**
 * Auto-code education level
 */
export function autoCodeEducation(text: string, language: 'en' | 'hi' = 'en'): string {
  const lowerText = text.toLowerCase();

  const educationMap: Record<string, string[]> = {
    'EDU-01': ['illiterate', 'निरक्षर', 'no education', 'कोई शिक्षा नहीं'],
    'EDU-02': ['primary', 'प्राथमिक', 'class 1', 'कक्षा 1', 'class 5'],
    'EDU-03': ['middle', 'मध्य', 'class 6', 'कक्षा 6', 'class 8'],
    'EDU-04': ['secondary', 'माध्यमिक', 'class 9', 'कक्षा 9', 'class 10'],
    'EDU-05': ['higher secondary', 'उच्च माध्यमिक', 'class 11', 'कक्षा 11', 'class 12', 'intermediate'],
    'EDU-06': ['graduate', 'स्नातक', 'bachelor', 'degree', 'डिग्री', 'b.a', 'b.sc', 'b.com'],
    'EDU-07': ['postgraduate', 'स्नातकोत्तर', 'master', 'मास्टर', 'm.a', 'm.sc', 'm.com', 'mba'],
    'EDU-08': ['phd', 'doctorate', 'डॉक्टरेट', 'doctoral'],
  };

  for (const [code, keywords] of Object.entries(educationMap)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return code;
      }
    }
  }

  return 'EDU-99'; // Unknown/Other
}

/**
 * Auto-code marital status
 */
export function autoCodeMaritalStatus(text: string, language: 'en' | 'hi' = 'en'): string {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('unmarried') || lowerText.includes('single') || lowerText.includes('अविवाहित')) {
    return 'MAR-01';
  } else if (lowerText.includes('married') || lowerText.includes('विवाहित')) {
    return 'MAR-02';
  } else if (lowerText.includes('widow') || lowerText.includes('widower') || lowerText.includes('विधवा') || lowerText.includes('विधुर')) {
    return 'MAR-03';
  } else if (lowerText.includes('divorced') || lowerText.includes('separated') || lowerText.includes('तलाकशुदा')) {
    return 'MAR-04';
  }

  return 'MAR-99'; // Unknown/Other
}

/**
 * Auto-code religion
 */
export function autoCodeReligion(text: string, language: 'en' | 'hi' = 'en'): string {
  const lowerText = text.toLowerCase();

  const religionMap: Record<string, string[]> = {
    'REL-01': ['hindu', 'हिंदू'],
    'REL-02': ['muslim', 'मुस्लिम', 'islam', 'इस्लाम'],
    'REL-03': ['christian', 'ईसाई', 'christianity'],
    'REL-04': ['sikh', 'सिख'],
    'REL-05': ['buddhist', 'बौद्ध', 'buddhism'],
    'REL-06': ['jain', 'जैन'],
    'REL-07': ['parsi', 'पारसी', 'zoroastrian'],
    'REL-08': ['jewish', 'यहूदी', 'judaism'],
    'REL-09': ['no religion', 'कोई धर्म नहीं', 'atheist', 'नास्तिक'],
  };

  for (const [code, keywords] of Object.entries(religionMap)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return code;
      }
    }
  }

  return 'REL-99'; // Other
}

/**
 * Auto-code caste/social group
 */
export function autoCodeSocialGroup(text: string, language: 'en' | 'hi' = 'en'): string {
  const lowerText = text.toLowerCase();

  const socialGroupMap: Record<string, string[]> = {
    'SG-01': ['scheduled caste', 'अनुसूचित जाति', 'sc', 'dalit'],
    'SG-02': ['scheduled tribe', 'अनुसूचित जनजाति', 'st', 'tribal'],
    'SG-03': ['obc', 'other backward class', 'अन्य पिछड़ा वर्ग'],
    'SG-04': ['general', 'सामान्य', 'unreserved'],
  };

  for (const [code, keywords] of Object.entries(socialGroupMap)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return code;
      }
    }
  }

  return 'SG-99'; // Not stated
}

/**
 * Auto-code multiple categorical responses in batch
 */
export function batchAutoCode(
  responses: Record<string, string>,
  fieldTypes: Record<string, 'occupation' | 'industry' | 'education' | 'marital' | 'religion' | 'social_group'>,
  language: 'en' | 'hi' = 'en'
): Record<string, any> {
  const codedResponses: Record<string, any> = {};

  for (const [field, value] of Object.entries(responses)) {
    const fieldType = fieldTypes[field];
    
    if (!fieldType || !value) {
      codedResponses[field] = { original: value, coded: null };
      continue;
    }

    switch (fieldType) {
      case 'occupation':
        codedResponses[field] = {
          original: value,
          coded: autoCodeOccupation(value, language),
        };
        break;
      case 'industry':
        codedResponses[field] = {
          original: value,
          coded: autoCodeIndustry(value, language),
        };
        break;
      case 'education':
        codedResponses[field] = {
          original: value,
          coded: autoCodeEducation(value, language),
        };
        break;
      case 'marital':
        codedResponses[field] = {
          original: value,
          coded: autoCodeMaritalStatus(value, language),
        };
        break;
      case 'religion':
        codedResponses[field] = {
          original: value,
          coded: autoCodeReligion(value, language),
        };
        break;
      case 'social_group':
        codedResponses[field] = {
          original: value,
          coded: autoCodeSocialGroup(value, language),
        };
        break;
      default:
        codedResponses[field] = { original: value, coded: null };
    }
  }

  return codedResponses;
}

/**
 * Validate auto-coded result quality
 */
export function validateAutoCodeQuality(result: AutoCodeResult | null): {
  isValid: boolean;
  requiresReview: boolean;
  message: string;
} {
  if (!result) {
    return {
      isValid: false,
      requiresReview: true,
      message: 'No matching code found',
    };
  }

  if (result.confidence >= 0.85) {
    return {
      isValid: true,
      requiresReview: false,
      message: 'High confidence auto-coding',
    };
  } else if (result.confidence >= 0.65) {
    return {
      isValid: true,
      requiresReview: true,
      message: 'Medium confidence - review recommended',
    };
  } else {
    return {
      isValid: true,
      requiresReview: true,
      message: 'Low confidence - manual review required',
    };
  }
}
