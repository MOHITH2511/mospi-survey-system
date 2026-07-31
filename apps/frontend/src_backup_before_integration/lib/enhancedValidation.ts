/**
 * Enhanced Real-time Validation Engine
 * Cross-field validation, inconsistency detection, and quality checks
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: string[];
}

export interface ValidationError {
  field: string;
  message: { en: string; hi: string };
  severity: 'error' | 'critical';
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: { en: string; hi: string };
  type: 'inconsistency' | 'unusual' | 'quality';
  code: string;
}

/**
 * Validate age-related consistency
 */
export function validateAgeConsistency(answers: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const age = parseInt(answers['age'] || answers['block-age'] || 0);
  const education = (answers['education'] || '').toLowerCase();
  const maritalStatus = (answers['marital_status'] || '').toLowerCase();
  const occupation = (answers['occupation'] || '').toLowerCase();

  if (age > 0) {
    // Check education vs age
    if (education.includes('postgraduate') || education.includes('phd')) {
      if (age < 22) {
        warnings.push({
          field: 'age',
          message: {
            en: 'Age seems low for postgraduate education. Please verify.',
            hi: 'स्नातकोत्तर शिक्षा के लिए आयु कम लग रही है। कृपया सत्यापित करें।',
          },
          type: 'inconsistency',
          code: 'AGE_EDUCATION_MISMATCH',
        });
      }
    }

    // Check working age
    if (occupation && occupation !== 'student') {
      if (age < 15) {
        errors.push({
          field: 'occupation',
          message: {
            en: 'Age is below minimum working age (15 years). Child labor is prohibited.',
            hi: 'आयु न्यूनतम कार्य आयु (15 वर्ष) से कम है। बाल श्रम निषिद्ध है।',
          },
          severity: 'critical',
          code: 'CHILD_LABOR',
        });
      }
      if (age > 75) {
        warnings.push({
          field: 'occupation',
          message: {
            en: 'Respondent is above typical retirement age but reports occupation. Please verify.',
            hi: 'उत्तरदाता सामान्य सेवानिवृत्ति आयु से अधिक है लेकिन व्यवसाय की रिपोर्ट करता है। कृपया सत्यापित करें।',
          },
          type: 'unusual',
          code: 'ELDERLY_EMPLOYED',
        });
      }
    }

    // Check marital status vs age
    if (maritalStatus === 'married' && age < 18) {
      errors.push({
        field: 'marital_status',
        message: {
          en: 'Age is below legal marriage age (18 years). This may indicate child marriage.',
          hi: 'आयु कानूनी विवाह आयु (18 वर्ष) से कम है। यह बाल विवाह का संकेत हो सकता है।',
        },
        severity: 'critical',
        code: 'UNDERAGE_MARRIAGE',
      });
    }

    // Check retirement benefits vs age
    const hasPension = answers['pension_status'] === 'yes';
    if (hasPension && age < 55) {
      warnings.push({
        field: 'pension_status',
        message: {
          en: 'Age is below typical retirement age but reports pension. Please verify.',
          hi: 'आयु सामान्य सेवानिवृत्ति आयु से कम है लेकिन पेंशन की रिपोर्ट करता है। कृपया सत्यापित करें।',
        },
        type: 'inconsistency',
        code: 'EARLY_PENSION',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate income-related consistency
 */
export function validateIncomeConsistency(answers: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const monthlyIncome = parseFloat(answers['monthly_income'] || 0);
  const occupation = (answers['occupation'] || '').toLowerCase();
  const education = (answers['education'] || '').toLowerCase();
  const householdSize = parseInt(answers['household_members'] || 1);

  if (monthlyIncome > 0) {
    // Unrealistically high income
    if (monthlyIncome > 1000000) { // > 10 lakh per month
      warnings.push({
        field: 'monthly_income',
        message: {
          en: 'Income is very high. Please verify the amount is correct.',
          hi: 'आय बहुत अधिक है। कृपया सत्यापित करें कि राशि सही है।',
        },
        type: 'unusual',
        code: 'HIGH_INCOME',
      });
    }

    // Income vs occupation consistency
    if (occupation.includes('student') && monthlyIncome > 50000) {
      warnings.push({
        field: 'monthly_income',
        message: {
          en: 'High income for student status. Please verify occupation or income.',
          hi: 'छात्र स्थिति के लिए उच्च आय। कृपया व्यवसाय या आय सत्यापित करें।',
        },
        type: 'inconsistency',
        code: 'STUDENT_HIGH_INCOME',
      });
    }

    // Income vs education consistency
    if ((education.includes('postgraduate') || education.includes('professional')) && monthlyIncome < 15000) {
      warnings.push({
        field: 'monthly_income',
        message: {
          en: 'Income seems low for high educational qualification. Please verify.',
          hi: 'उच्च शैक्षिक योग्यता के लिए आय कम लगती है। कृपया सत्यापित करें।',
        },
        type: 'unusual',
        code: 'LOW_INCOME_HIGH_EDU',
      });
    }

    // Per capita income check
    const perCapitaIncome = monthlyIncome / householdSize;
    if (perCapitaIncome < 1000) { // Below poverty line indicator
      warnings.push({
        field: 'monthly_income',
        message: {
          en: 'Per capita income is below poverty line. Additional welfare questions may be relevant.',
          hi: 'प्रति व्यक्ति आय गरीबी रेखा से नीचे है। अतिरिक्त कल्याण प्रश्न प्रासंगिक हो सकते हैं।',
        },
        type: 'quality',
        code: 'BELOW_POVERTY_LINE',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate employment-related consistency
 */
export function validateEmploymentConsistency(answers: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const employmentStatus = (answers['employment_status'] || '').toLowerCase();
  const occupation = answers['occupation'];
  const workingHours = parseFloat(answers['working_hours_per_week'] || 0);
  const monthlyIncome = parseFloat(answers['monthly_income'] || 0);

  // Check if unemployed but has occupation
  if (employmentStatus === 'unemployed' && occupation && occupation !== 'none') {
    errors.push({
      field: 'occupation',
      message: {
        en: 'Employment status is unemployed but occupation is provided. Please correct.',
        hi: 'रोजगार स्थिति बेरोजगार है लेकिन व्यवसाय प्रदान किया गया है। कृपया सही करें।',
      },
      severity: 'error',
      code: 'UNEMPLOYED_HAS_OCCUPATION',
    });
  }

  // Check if employed but no occupation
  if (employmentStatus === 'employed' && (!occupation || occupation === 'none')) {
    errors.push({
      field: 'occupation',
      message: {
        en: 'Employment status is employed but no occupation provided. Please specify.',
        hi: 'रोजगार स्थिति नियोजित है लेकिन कोई व्यवसाय प्रदान नहीं किया गया। कृपया निर्दिष्ट करें।',
      },
      severity: 'error',
      code: 'EMPLOYED_NO_OCCUPATION',
    });
  }

  // Check working hours
  if (workingHours > 0) {
    if (workingHours > 84) { // >12 hours/day
      warnings.push({
        field: 'working_hours_per_week',
        message: {
          en: 'Working hours exceed legal limits (>84 hours/week). Please verify.',
          hi: 'कार्य घंटे कानूनी सीमा (>84 घंटे/सप्ताह) से अधिक हैं। कृपया सत्यापित करें।',
        },
        type: 'unusual',
        code: 'EXCESSIVE_WORKING_HOURS',
      });
    }

    // Check if unemployed but has working hours
    if (employmentStatus === 'unemployed' && workingHours > 0) {
      errors.push({
        field: 'working_hours_per_week',
        message: {
          en: 'Employment status is unemployed but working hours provided. Please correct.',
          hi: 'रोजगार स्थिति बेरोजगार है लेकिन कार्य घंटे प्रदान किए गए हैं। कृपया सही करें।',
        },
        severity: 'error',
        code: 'UNEMPLOYED_HAS_HOURS',
      });
    }
  }

  // Check if employed but no income
  if (employmentStatus === 'employed' && monthlyIncome === 0) {
    warnings.push({
      field: 'monthly_income',
      message: {
        en: 'Employment status is employed but income is zero. Are you in unpaid work?',
        hi: 'रोजगार स्थिति नियोजित है लेकिन आय शून्य है। क्या आप अवैतनिक काम में हैं?',
      },
      type: 'inconsistency',
      code: 'EMPLOYED_ZERO_INCOME',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate household-related consistency
 */
export function validateHouseholdConsistency(answers: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const householdSize = parseInt(answers['household_members'] || 1);
  const rooms = parseInt(answers['rooms'] || 0);
  const householdIncome = parseFloat(answers['household_income'] || 0);
  const individualIncome = parseFloat(answers['monthly_income'] || 0);

  if (householdSize > 15) {
    warnings.push({
      field: 'household_members',
      message: {
        en: 'Household size is very large (>15). Please verify the count.',
        hi: 'परिवार का आकार बहुत बड़ा है (>15)। कृपया गिनती सत्यापित करें।',
      },
      type: 'unusual',
      code: 'LARGE_HOUSEHOLD',
    });
  }

  // Check overcrowding
  if (rooms > 0 && householdSize > 0) {
    const personsPerRoom = householdSize / rooms;
    if (personsPerRoom > 4) {
      warnings.push({
        field: 'rooms',
        message: {
          en: `Severe overcrowding detected (${personsPerRoom.toFixed(1)} persons/room). Housing adequacy concern.`,
          hi: `गंभीर भीड़भाड़ पाई गई (${personsPerRoom.toFixed(1)} व्यक्ति/कमरा)। आवास पर्याप्तता चिंता।`,
        },
        type: 'quality',
        code: 'OVERCROWDING',
      });
    }
  }

  // Check if individual income exceeds household income
  if (householdIncome > 0 && individualIncome > householdIncome) {
    errors.push({
      field: 'household_income',
      message: {
        en: 'Individual income cannot exceed household income. Please correct.',
        hi: 'व्यक्तिगत आय घरेलू आय से अधिक नहीं हो सकती। कृपया सही करें।',
      },
      severity: 'error',
      code: 'INCOME_LOGIC_ERROR',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate education consistency
 */
export function validateEducationConsistency(answers: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const age = parseInt(answers['age'] || 0);
  const education = (answers['education'] || '').toLowerCase();
  const currentlyStudying = (answers['currently_studying'] || '').toLowerCase() === 'yes';

  // Check if currently studying but education is complete
  if (currentlyStudying && (education.includes('graduate') || education.includes('phd'))) {
    // This is okay - could be pursuing higher degree
  }

  // Check age vs education completed
  if (age > 0 && age < 15 && education.includes('graduate')) {
    errors.push({
      field: 'education',
      message: {
        en: 'Age is too young for graduate education. Please verify age or education.',
        hi: 'स्नातक शिक्षा के लिए आयु बहुत कम है। कृपया आयु या शिक्षा सत्यापित करें।',
      },
      severity: 'error',
      code: 'AGE_EDUCATION_IMPOSSIBLE',
    });
  }

  // Check if above 25 and currently in primary school
  if (age > 25 && currentlyStudying && education.includes('primary')) {
    warnings.push({
      field: 'currently_studying',
      message: {
        en: 'Adult literacy program? Please verify education level.',
        hi: 'वयस्क साक्षरता कार्यक्रम? कृपया शिक्षा स्तर सत्यापित करें।',
      },
      type: 'unusual',
      code: 'ADULT_PRIMARY_EDUCATION',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Comprehensive validation of all answers
 */
export function comprehensiveValidation(answers: Record<string, any>): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  // Run all validation checks
  const ageResult = validateAgeConsistency(answers);
  const incomeResult = validateIncomeConsistency(answers);
  const employmentResult = validateEmploymentConsistency(answers);
  const householdResult = validateHouseholdConsistency(answers);
  const educationResult = validateEducationConsistency(answers);

  // Combine results
  allErrors.push(...ageResult.errors);
  allErrors.push(...incomeResult.errors);
  allErrors.push(...employmentResult.errors);
  allErrors.push(...householdResult.errors);
  allErrors.push(...educationResult.errors);

  allWarnings.push(...ageResult.warnings);
  allWarnings.push(...incomeResult.warnings);
  allWarnings.push(...employmentResult.warnings);
  allWarnings.push(...householdResult.warnings);
  allWarnings.push(...educationResult.warnings);

  // Generate suggestions based on warnings
  const suggestions: string[] = [];
  if (allWarnings.some(w => w.code === 'BELOW_POVERTY_LINE')) {
    suggestions.push('Consider asking about welfare scheme enrollment');
  }
  if (allWarnings.some(w => w.code === 'OVERCROWDING')) {
    suggestions.push('Ask about housing improvement schemes');
  }
  if (allWarnings.some(w => w.code === 'UNEMPLOYED_HAS_OCCUPATION')) {
    suggestions.push('Clarify employment status - may be self-employed or informal work');
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    suggestions,
  };
}

/**
 * Validate data quality based on paradata
 */
export function validateDataQuality(
  answers: Record<string, any>,
  paradata: {
    duration: number;
    location?: { latitude: number; longitude: number };
    revisionCount: number;
    questionTimings?: Record<string, number>;
  }
): {
  qualityScore: number;
  flags: string[];
  issues: string[];
} {
  const flags: string[] = [];
  const issues: string[] = [];
  let qualityScore = 100;

  // Check completion time
  const totalQuestions = Object.keys(answers).length;
  const avgTimePerQuestion = paradata.duration / totalQuestions;

  if (avgTimePerQuestion < 5) { // Less than 5 seconds per question
    flags.push('TOO_FAST_COMPLETION');
    issues.push('Survey completed too quickly - may indicate rushed or inattentive responses');
    qualityScore -= 20;
  }

  if (avgTimePerQuestion > 180) { // More than 3 minutes per question
    flags.push('VERY_SLOW_COMPLETION');
    issues.push('Survey took very long - may indicate difficulties or interruptions');
    qualityScore -= 10;
  }

  // Check revision count
  if (paradata.revisionCount > totalQuestions * 2) {
    flags.push('EXCESSIVE_REVISIONS');
    issues.push('Many answer revisions - may indicate uncertainty or confusion');
    qualityScore -= 15;
  }

  // Check pattern in answers (all same answer)
  const uniqueAnswers = new Set(Object.values(answers).map(v => String(v)));
  if (uniqueAnswers.size === 1) {
    flags.push('UNIFORM_RESPONSES');
    issues.push('All answers are identical - possible survey fraud or bot');
    qualityScore -= 40;
  }

  // Check for straight-lining in rating scales
  const ratingAnswers = Object.entries(answers)
    .filter(([key, _]) => key.includes('rating') || key.includes('scale'))
    .map(([_, value]) => value);
  
  if (ratingAnswers.length > 3) {
    const uniqueRatings = new Set(ratingAnswers);
    if (uniqueRatings.size === 1) {
      flags.push('STRAIGHT_LINING');
      issues.push('Same rating for all scale questions - may indicate lack of engagement');
      qualityScore -= 25;
    }
  }

  // Check GPS location changes (if available)
  // In production, would check against assigned location
  
  qualityScore = Math.max(0, qualityScore);

  return {
    qualityScore,
    flags,
    issues,
  };
}

/**
 * Generate validation report
 */
export function generateValidationReport(
  answers: Record<string, any>,
  paradata: any
): {
  overall: 'pass' | 'warning' | 'fail';
  validationResult: ValidationResult;
  qualityResult: ReturnType<typeof validateDataQuality>;
  recommendations: string[];
} {
  const validationResult = comprehensiveValidation(answers);
  const qualityResult = validateDataQuality(answers, paradata);

  const recommendations: string[] = [];

  // Determine overall status
  let overall: 'pass' | 'warning' | 'fail' = 'pass';
  
  if (validationResult.errors.length > 0 || qualityResult.qualityScore < 50) {
    overall = 'fail';
    recommendations.push('Manual review required before accepting this response');
  } else if (validationResult.warnings.length > 0 || qualityResult.qualityScore < 75) {
    overall = 'warning';
    recommendations.push('Review flagged items for accuracy');
  }

  // Add specific recommendations
  if (validationResult.errors.length > 0) {
    recommendations.push(`Fix ${validationResult.errors.length} critical error(s)`);
  }
  if (validationResult.warnings.length > 0) {
    recommendations.push(`Review ${validationResult.warnings.length} warning(s)`);
  }
  if (qualityResult.flags.includes('TOO_FAST_COMPLETION')) {
    recommendations.push('Re-interview respondent or verify with supervisor');
  }
  if (qualityResult.flags.includes('UNIFORM_RESPONSES')) {
    recommendations.push('Possible fraud - investigate enumerator or respondent');
  }

  return {
    overall,
    validationResult,
    qualityResult,
    recommendations,
  };
}
