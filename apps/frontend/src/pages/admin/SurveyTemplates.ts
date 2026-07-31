import type { Section, Question, SurveyOption, QuestionType } from "./AISurveyBuilder";

// Automatic Validation Rules based on keywords
export function getAutomaticValidation(label: string, variableName: string): { minNumeric?: string; maxNumeric?: string } {
  const lbl = label.toLowerCase();
  const vName = variableName.toLowerCase();

  if (lbl.includes("age") || vName.includes("age")) {
    return { minNumeric: "0", maxNumeric: "120" };
  }
  if (
    lbl.includes("household size") ||
    lbl.includes("number of usual members") ||
    lbl.includes("number of members") ||
    vName.includes("hh_size") ||
    vName.includes("household_size") ||
    vName.includes("member_count")
  ) {
    return { minNumeric: "1", maxNumeric: "50" };
  }
  if (lbl.includes("land area") || lbl.includes("holding") || vName.includes("land") || vName.includes("holding")) {
    return { minNumeric: "0", maxNumeric: "100000" };
  }
  if (lbl.includes("years of education") || lbl.includes("years of schooling") || vName.includes("education_years") || vName.includes("school_years")) {
    return { minNumeric: "0", maxNumeric: "30" };
  }
  if (
    lbl.includes("income") ||
    lbl.includes("earnings") ||
    lbl.includes("expenditure") ||
    lbl.includes("cost") ||
    lbl.includes("spent") ||
    lbl.includes("premium") ||
    lbl.includes("exp") ||
    vName.includes("income") ||
    vName.includes("earnings") ||
    vName.includes("exp") ||
    vName.includes("cost")
  ) {
    return { minNumeric: "0", maxNumeric: "10000000" };
  }
  return {};
}

// Helper to create UUIDs in browser
function uuid() {
  return "opt-" + Math.random().toString(36).substring(2, 11);
}

function createQuestion(
  type: QuestionType,
  label: string,
  helpText: string,
  code: string,
  varName: string,
  tag: string,
  refStd: string,
  options?: string[],
  required = true,
  dataType?: string
): Question {
  const finalDataType = dataType || (type === "number" ? "numeric" : "categorical");
  const autoVal = getAutomaticValidation(label, varName);
  
  let optArray: SurveyOption[] | undefined;
  if (options) {
    optArray = options.map((opt, idx) => ({
      id: uuid(),
      code: String(idx + 1),
      label: opt
    }));
  }

  return {
    id: "q-" + Math.random().toString(36).substring(2, 11),
    type,
    label,
    helpText,
    optionsSource: options ? "custom" : undefined,
    options: optArray,
    metadata: {
      questionCode: code,
      variableName: varName,
      dataType: finalDataType,
      classificationMapping: "",
      referenceStandard: refStd
    },
    validation: {
      required,
      min: "",
      max: "",
      minNumeric: autoVal.minNumeric || "",
      maxNumeric: autoVal.maxNumeric || "",
      regex: "",
      custom: ""
    },
    skipLogic: [],
    tag
  };
}

// 1. Health Survey (25-30 questions)
export function generateHealthSurvey() {
  const sec1Questions = [
    createQuestion("number", "What is the total number of usual members in your household?", "Living and dining together for past 6 months.", "HLTH_HH_01", "hh_size", "Household Info", "NSO-HH"),
    createQuestion("single_select", "What is the primary source of drinking water in the household?", "Main source.", "HLTH_HH_02", "drinking_water_source", "Household Info", "NSO-Core", ["Piped water into dwelling", "Public tap/standpost", "Tube well/borehole", "Protected well", "Unprotected source"]),
    createQuestion("single_select", "What type of latrine facility is used by household members?", "Sanitation check.", "HLTH_HH_03", "latrine_type", "Household Info", "NSO-Core", ["Flush to piped sewer", "Flush to septic tank", "Pit latrine", "Open defecation"]),
    createQuestion("number", "Average monthly household consumption expenditure (INR)?", "Expenditure metric.", "HLTH_HH_04", "monthly_expenditure", "Household Info", "NSO-Expenditure"),
    createQuestion("gps", "Record GPS coordinates of the household", "Confirm geography.", "HLTH_HH_05", "hh_gps", "Household Info", "LGD")
  ];

  const sec2Questions = [
    createQuestion("number", "What is the age of the member?", "Enter in completed years.", "HLTH_IND_01", "member_age", "Health Status", "NSO-Age"),
    createQuestion("single_select", "Gender of the member?", "Gender classification.", "HLTH_IND_02", "member_gender", "Health Status", "LGD-Sex", ["Male", "Female", "Third Gender"]),
    createQuestion("single_select", "State of general health of the member?", "Self-reported health status.", "HLTH_IND_03", "general_health", "Health Status", "NSO-Health", ["Excellent", "Very Good", "Good", "Fair", "Poor"]),
    createQuestion("single_select", "Was the member hospitalized overnight in the past 365 days?", "Inpatient check.", "HLTH_IND_04", "hospitalized_365", "Health Status", "NSO-Health", ["Yes", "No"]),
    createQuestion("single_select", "Did the member seek medical treatment as an outpatient in the past 15 days?", "Outpatient check.", "HLTH_IND_05", "treated_15days", "Health Status", "NSO-Health", ["Yes", "No"])
  ];

  const sec3Questions = [
    createQuestion("single_select", "Does the member suffer from diabetes?", "Chronic illness diagnosis.", "HLTH_CHR_01", "has_diabetes", "Chronic Diseases", "NFHS", ["Yes", "No"]),
    createQuestion("single_select", "Does the member suffer from hypertension (high blood pressure)?", "Chronic diagnosis.", "HLTH_CHR_02", "has_hypertension", "Chronic Diseases", "NFHS", ["Yes", "No"]),
    createQuestion("single_select", "Does the member suffer from any respiratory disease (e.g. Asthma, COPD)?", "Chronic diagnosis.", "HLTH_CHR_03", "has_respiratory", "Chronic Diseases", "NFHS", ["Yes", "No"]),
    createQuestion("number", "Duration of chronic illness treatment (in months)?", "How long has member been on medications.", "HLTH_CHR_04", "treatment_duration", "Chronic Diseases", "NFHS"),
    createQuestion("single_select", "What is the primary source of chronic disease medications?", "Pharmacy source.", "HLTH_CHR_05", "medication_source", "Chronic Diseases", "NSO-Health", ["Government Hospital", "Public Clinic/PHC", "Private Pharmacy", "Online Pharmacy", "None"])
  ];

  const sec4Questions = [
    createQuestion("single_select", "Type of facility visited for latest outpatient medical treatment?", "Facility type.", "HLTH_UTL_01", "op_facility_type", "Healthcare Utilization", "NSO-Health", ["Public Hospital", "Primary Health Centre (PHC)", "Private Clinic", "Private Charitable Hospital"]),
    createQuestion("number", "Distance to the medical facility (in Kilometers)?", "Access check.", "HLTH_UTL_02", "facility_distance", "Healthcare Utilization", "NSO-Health"),
    createQuestion("single_select", "Primary reason for choosing a private facility (if applicable)?", "Reason for private care.", "HLTH_UTL_03", "private_reason", "Healthcare Utilization", "NSO-Health", ["Government facility too far", "Poor quality in government facility", "Government facility medicines unavailable", "Doctor not present", "Always prefer private care", "Not applicable (visited public)"]),
    createQuestion("number", "Number of days hospitalized in last overnight stay?", "Length of stay.", "HLTH_UTL_04", "hospitalization_days", "Healthcare Utilization", "NSO-Health"),
    createQuestion("single_select", "Was any medical check-up conducted at school/office in past 365 days?", "Preventive care check.", "HLTH_UTL_05", "preventive_check", "Healthcare Utilization", "NSO-Health", ["Yes", "No"])
  ];

  const sec5Questions = [
    createQuestion("single_select", "Is the member covered under any health insurance scheme?", "Insurance status.", "HLTH_INS_01", "has_insurance", "Insurance Coverage", "NSO-Health", ["Yes", "No"]),
    createQuestion("single_select", "Is the member enrolled in Ayushman Bharat (PM-JAY)?", "Public scheme coverage.", "HLTH_INS_02", "enrolled_pmjay", "Insurance Coverage", "PMJAY", ["Yes", "No"]),
    createQuestion("single_select", "Type of health insurance coverage (if not PM-JAY)?", "Insurance type.", "HLTH_INS_03", "insurance_type", "Insurance Coverage", "NSO-Health", ["State Government Scheme", "Employer Supported Group Insurance", "Private Commercial Insurance", "None"]),
    createQuestion("number", "Annual premium paid for the health insurance (INR)?", "Premium cost.", "HLTH_INS_04", "insurance_premium", "Insurance Coverage", "NSO-Health"),
    createQuestion("number", "Maximum coverage limit of the insurance policy (INR)?", "Coverage limit.", "HLTH_INS_05", "insurance_limit", "Insurance Coverage", "NSO-Health")
  ];

  const sec6Questions = [
    createQuestion("number", "Out-of-pocket expenditure on medicines in past 15 days (INR)?", "Medicines expenditure.", "HLTH_EXP_01", "exp_medicines", "Health Expenditure", "NSO-Health"),
    createQuestion("number", "Out-of-pocket expenditure on doctor consultation in past 15 days (INR)?", "Consultation fees.", "HLTH_EXP_02", "exp_consultation", "Health Expenditure", "NSO-Health"),
    createQuestion("number", "Expenditure on diagnostics/tests in past 15 days (INR)?", "Lab fees.", "HLTH_EXP_03", "exp_diagnostics", "Health Expenditure", "NSO-Health"),
    createQuestion("number", "Medical expenditure on hospital bed/inpatient care in past 365 days (INR)?", "Inpatient expense.", "HLTH_EXP_04", "exp_inpatient", "Health Expenditure", "NSO-Health"),
    createQuestion("number", "Expenditure on transport for medical treatments in past 15 days (INR)?", "Conveyance.", "HLTH_EXP_05", "exp_transport", "Health Expenditure", "NSO-Health")
  ];

  // Configure skip logic
  // If hospitalized (sec2 q4: hospitalized_365) index 3 has value "No" (opt code "2"), jump to insurance or skip hospitalization questions
  const hospQuestion = sec2Questions[3];
  hospQuestion.skipLogic = [
    {
      id: "skip-hosp-1",
      operator: "equals",
      conditionValue: hospQuestion.options![1].id, // "No"
      targetQuestionId: "end_survey" // placeholder or next section
    }
  ];

  // If covered under health insurance (sec5 q1: has_insurance) is "No" (opt code "2"), skip premium and limit
  const insQuestion = sec5Questions[0];
  insQuestion.skipLogic = [
    {
      id: "skip-ins-1",
      operator: "equals",
      conditionValue: insQuestion.options![1].id, // "No"
      targetQuestionId: "end_survey"
    }
  ];

  const sections: Section[] = [
    { id: "sec-hlth-1", title: "Section 1: Household Information", isCollapsed: false, questions: sec1Questions },
    { id: "sec-hlth-2", title: "Section 2: Individual Health Profile", isCollapsed: false, questions: sec2Questions },
    { id: "sec-hlth-3", title: "Section 3: Chronic Diseases", isCollapsed: false, questions: sec3Questions },
    { id: "sec-hlth-4", title: "Section 4: Healthcare Service Utilization", isCollapsed: false, questions: sec4Questions },
    { id: "sec-hlth-5", title: "Section 5: Health Insurance Coverage", isCollapsed: false, questions: sec5Questions },
    { id: "sec-hlth-6", title: "Section 6: Out-of-pocket Health Expenditure", isCollapsed: false, questions: sec6Questions }
  ];

  // Resolve skip targets to actual ids
  hospQuestion.skipLogic[0].targetQuestionId = sec5Questions[0].id; // Jump to Section 5: Health Insurance
  insQuestion.skipLogic[0].targetQuestionId = sec6Questions[0].id; // Jump to Section 6: Expenditure

  return {
    title: "Household Health Assessment Survey",
    sections
  };
}

// 2. Employment Survey / Labour Force Survey (20-25 questions)
export function generateEmploymentSurvey() {
  const sec1Questions = [
    createQuestion("number", "What is the age of the household member?", "Enter in completed years.", "PLFS_DEM_01", "member_age", "Demographics", "NSO-Age"),
    createQuestion("single_select", "Gender of the member?", "Select category.", "PLFS_DEM_02", "member_gender", "Demographics", "LGD-Sex", ["Male", "Female", "Third Gender"]),
    createQuestion("number", "What is the total number of members in this household?", "Household size.", "PLFS_DEM_03", "hh_size", "Demographics", "NSO-HH"),
    createQuestion("single_select", "Highest general education level completed by the member?", "Education level.", "PLFS_DEM_04", "education_level", "Demographics", "NSO-Edu", ["Not Literate", "Primary Education", "Middle School", "Secondary/Class 10", "Higher Secondary/Class 12", "Graduate & Above"]),
    createQuestion("number", "Number of years of formal education completed?", "Total years of school/college.", "PLFS_DEM_05", "education_years", "Demographics", "NSO-Edu")
  ];

  const sec2Questions = [
    createQuestion("single_select", "What was your Principal Activity Status over the past 365 days?", "Activity classification.", "PLFS_USUAL_01", "usual_activity_status", "Usual Status", "NSO-Activity", ["Self-Employed (Own Account Worker)", "Regular Wage/Salaried Employee", "Casual Labor", "Unemployed (Seeking/Available)", "Out of Labor Force (Student/Household Duties)"]),
    createQuestion("dropdown", "Select Industry of Work (NIC 2-digit classification)?", "National Industrial Classification 2008.", "PLFS_USUAL_02", "work_nic_code", "Usual Status", "NIC-2008"),
    createQuestion("dropdown", "Select Occupation of Work (NCO 3-digit classification)?", "National Classification of Occupations 2015.", "PLFS_USUAL_03", "work_nco_code", "Usual Status", "NCO-2015"),
    createQuestion("number", "Usual Monthly Earnings from this Principal Activity (in INR)?", "Net monthly income.", "PLFS_USUAL_04", "usual_monthly_earnings", "Usual Status", "NSO-Income"),
    createQuestion("single_select", "What type of employment contract do you have?", "Employment security check.", "PLFS_USUAL_05", "employment_contract", "Usual Status", "NSO-Employment", ["Written contract (> 3 years)", "Written contract (1 to 3 years)", "Temporary/No Written Contract"]),
    createQuestion("multi_select", "Which Social Security Benefits are you eligible for?", "Welfare status.", "PLFS_USUAL_06", "social_security_benefits", "Usual Status", "NSO-Welfare", ["Provident Fund (PF)", "Gratuity", "Health Insurance/ESI", "None of these"])
  ];

  const sec3Questions = [
    createQuestion("single_select", "Did you work for at least 1 hour during the last 7 days?", "Weekly activity check.", "PLFS_CWS_01", "cws_worked_7days", "Weekly Status", "NSO-CWS", ["Yes", "No"]),
    createQuestion("number", "Total hours worked in the last 7 days?", "Actual hours.", "PLFS_CWS_02", "cws_hours_worked", "Weekly Status", "NSO-CWS"),
    createQuestion("number", "Daily wages received for casual work in reference week (INR)?", "Casual daily rate.", "PLFS_CWS_03", "cws_daily_wage", "Weekly Status", "NSO-Wage"),
    createQuestion("single_select", "Were you seeking or available for work during the last 7 days?", "Seeking employment status.", "PLFS_CWS_04", "cws_seeking_work", "Weekly Status", "NSO-CWS", ["Yes", "No"]),
    createQuestion("single_select", "Final Current Weekly Activity Status code?", "Weekly classification code.", "PLFS_CWS_05", "cws_status_code", "Weekly Status", "NSO-CWS", ["Employed", "Unemployed", "Out of Labor Force"])
  ];

  const sec4Questions = [
    createQuestion("single_select", "Type of enterprise in which you are employed?", "Enterprise type.", "PLFS_COND_01", "enterprise_type", "Work Conditions", "NSO-Enterprise", ["Proprietary/Partnership", "Public Sector/Govt", "Private Limited Company", "Cooperative Society", "Others"]),
    createQuestion("single_select", "Is the enterprise registered under any government authority?", "Formal sector check.", "PLFS_COND_02", "enterprise_registered", "Work Conditions", "NSO-Enterprise", ["Yes", "No", "Don't Know"]),
    createQuestion("number", "Distance from home to workplace (in Kilometers)?", "Commute check.", "PLFS_COND_03", "commute_distance", "Work Conditions", "NSO-Commute"),
    createQuestion("single_select", "Are you eligible for paid home/sick leave?", "Leave benefits check.", "PLFS_COND_04", "paid_leave_eligible", "Work Conditions", "NSO-Employment", ["Yes", "No"])
  ];

  // Skip logics
  // If Usual Activity Status is Out of Labor Force (sec2 q1 code 5), skip NIC/NCO/Income
  const usualActivityQ = sec2Questions[0];
  usualActivityQ.skipLogic = [
    {
      id: "skip-usual-activity",
      operator: "equals",
      conditionValue: usualActivityQ.options![4].id, // "Out of Labor Force"
      targetQuestionId: "end_survey"
    }
  ];

  // If did not work in last 7 days (sec3 q1 code 2: "No"), skip hours and wages
  const worked7daysQ = sec3Questions[0];
  worked7daysQ.skipLogic = [
    {
      id: "skip-worked-7days",
      operator: "equals",
      conditionValue: worked7daysQ.options![1].id, // "No"
      targetQuestionId: "end_survey"
    }
  ];

  const sections: Section[] = [
    { id: "sec-plfs-1", title: "Section A: Household Demographic Characteristics", isCollapsed: false, questions: sec1Questions },
    { id: "sec-plfs-2", title: "Section B: Principal Usual Activity Status (365 Days Reference)", isCollapsed: false, questions: sec2Questions },
    { id: "sec-plfs-3", title: "Section C: Current Weekly Activity Status (7 Days Reference)", isCollapsed: false, questions: sec3Questions },
    { id: "sec-plfs-4", title: "Section D: Conditions of Employment & Workplace Profile", isCollapsed: false, questions: sec4Questions }
  ];

  usualActivityQ.skipLogic[0].targetQuestionId = sec3Questions[0].id; // Jump to CWS
  worked7daysQ.skipLogic[0].targetQuestionId = sec3Questions[3].id; // Jump to Seeking Work

  return {
    title: "Periodic Labour Force Survey (PLFS)",
    sections
  };
}

// 3. Household Survey (20-30 questions)
export function generateHouseholdSurvey() {
  const sec1Questions = [
    createQuestion("number", "What is the total number of usual members in your household?", "Roster size.", "HCES_DEM_01", "hh_size", "Demographics", "NSO-HH"),
    createQuestion("single_select", "What is the social group of the household?", "Social group classification.", "HCES_DEM_02", "social_group", "Demographics", "LGD", ["Scheduled Tribe (ST)", "Scheduled Caste (SC)", "Other Backward Class (OBC)", "Others"]),
    createQuestion("single_select", "What is the primary religion of the household?", "Religion classification.", "HCES_DEM_03", "religion", "Demographics", "NSO-Core", ["Hinduism", "Islam", "Christianity", "Sikhism", "Buddhism", "Others"]),
    createQuestion("single_select", "What type of structure does this dwelling reside in?", "Observe construction materials.", "HCES_DEM_04", "dwelling_structure", "Demographics", "Census-2011", ["Pucca (Brick & Cement)", "Semi-Pucca", "Kutcha"]),
    createQuestion("single_select", "What is the primary source of energy for cooking?", "Main energy source.", "HCES_DEM_05", "cooking_energy", "Demographics", "NSO-HCES", ["LPG", "Biogas/Piped Gas", "Firewood/Coal", "Others"]),
    createQuestion("single_select", "What is the primary source of energy for lighting?", "Lighting check.", "HCES_DEM_06", "lighting_energy", "Demographics", "NSO-HCES", ["Electricity", "Solar Energy", "Kerosene", "Others"])
  ];

  const sec2Questions = [
    createQuestion("number", "Monthly Cereals Consumption Quantity (in Kilograms)?", "Combined rice, wheat, millets.", "HCES_FOD_01", "cereal_qty", "Food Consumption", "NSO-Food"),
    createQuestion("number", "Total Household Expenditure on Cereals (in INR)?", "Monetary spend on cereals.", "HCES_FOD_02", "cereal_exp", "Food Consumption", "NSO-Food"),
    createQuestion("number", "Monthly Pulses Consumption Quantity (in Kilograms)?", "Pulses consumed.", "HCES_FOD_03", "pulse_qty", "Food Consumption", "NSO-Food"),
    createQuestion("number", "Total Household Expenditure on Pulses (in INR)?", "Monetary spend on pulses.", "HCES_FOD_04", "pulse_exp", "Food Consumption", "NSO-Food"),
    createQuestion("number", "Expenditure on Milk & Dairy Products (in INR)?", "Monthly dairy spend.", "HCES_FOD_05", "dairy_exp", "Food Consumption", "NSO-Food"),
    createQuestion("number", "Expenditure on Fresh Vegetables & Fruits (in INR)?", "Monthly produce spend.", "HCES_FOD_06", "produce_exp", "Food Consumption", "NSO-Food"),
    createQuestion("number", "Total Food Monthly Expenditure (in INR)?", "Aggregated food expenses.", "HCES_FOD_07", "total_food_exp", "Food Consumption", "NSO-Food")
  ];

  const sec3Questions = [
    createQuestion("number", "Monthly Expenditure on Clothing & Bedding (in INR)?", "Estimated clothing expenditure.", "HCES_NFD_01", "clothing_exp", "Non-Food", "NSO-NonFood"),
    createQuestion("number", "Monthly Expenditure on Education (in INR)?", "Fees, books, coaching.", "HCES_NFD_02", "education_exp", "Non-Food", "NSO-NonFood"),
    createQuestion("number", "Monthly Expenditure on Medical & Out-patient Care (in INR)?", "Medicines, checkups.", "HCES_NFD_03", "medical_op_exp", "Non-Food", "NSO-NonFood"),
    createQuestion("number", "Monthly Expenditure on Electricity & Fuel (in INR)?", "Utility charges.", "HCES_NFD_04", "electricity_exp", "Non-Food", "NSO-NonFood"),
    createQuestion("number", "Monthly Expenditure on Conveyance & Travel (in INR)?", "Conveyance costs.", "HCES_NFD_05", "conveyance_exp", "Non-Food", "NSO-NonFood"),
    createQuestion("number", "Expenditure on Purchase of Durable Goods in past 365 Days (in INR)?", "TV, Fridge, Vehicles, etc.", "HCES_NFD_06", "durables_exp_annual", "Non-Food", "NSO-NonFood"),
    createQuestion("number", "Total Monthly Household Consumption Expenditure (INR)?", "Overall consumption.", "HCES_NFD_07", "total_consumption_exp", "Non-Food", "NSO-Summary")
  ];

  return {
    title: "Household Consumer Expenditure Survey (HCES)",
    sections: [
      { id: "sec-hces-1", title: "Section A: Household Demographic Particulars", isCollapsed: false, questions: sec1Questions },
      { id: "sec-hces-2", title: "Section B: Food Consumption & Monthly Expenditures", isCollapsed: false, questions: sec2Questions },
      { id: "sec-hces-3", title: "Section C: Non-Food Items & Durables Expenditure", isCollapsed: false, questions: sec3Questions }
    ]
  };
}

// 4. Agriculture Survey (30-40 questions)
export function generateAgricultureSurvey() {
  const sec1Questions = [
    createQuestion("number", "Total agricultural land area owned (in Hectares)?", "Area owned.", "AGRI_OWN_01", "land_owned", "Land Ownership", "Agri-Census"),
    createQuestion("number", "Land area leased-in (in Hectares)?", "Area leased-in.", "AGRI_OWN_02", "land_leased_in", "Land Ownership", "Agri-Census"),
    createQuestion("number", "Land area leased-out (in Hectares)?", "Area leased-out.", "AGRI_OWN_03", "land_leased_out", "Land Ownership", "Agri-Census"),
    createQuestion("number", "Total net sown area (in Hectares)?", "Net sown area.", "AGRI_OWN_04", "net_sown_area", "Land Ownership", "Agri-Census"),
    createQuestion("single_select", "Primary Land Category of operational holdings?", "Irrigation class.", "AGRI_OWN_05", "land_category", "Land Ownership", "Agri-Census", ["Wholly Irrigated", "Partially Irrigated", "Rainfed"]),
    createQuestion("single_select", "Tenancy Status of operational holdings?", "Tenancy status.", "AGRI_OWN_06", "tenancy_status", "Land Ownership", "Agri-Census", ["Owner Cultivator", "Tenant Cultivator", "Shared Cultivator"]),
    createQuestion("single_select", "Primary source of irrigation used?", "Irrigation source.", "AGRI_OWN_07", "irrigation_source", "Land Ownership", "Agri-Census", ["Canals", "Tube wells/Borewells", "Tanks", "Rainfed"]),
    createQuestion("multi_select", "Crops grown in Kharif season?", "Kharif crops.", "AGRI_OWN_08", "crops_kharif", "Land Ownership", "Agri-Census", ["Rice", "Maize", "Cotton", "Sugarcane", "Jowar"]),
    createQuestion("multi_select", "Crops grown in Rabi season?", "Rabi crops.", "AGRI_OWN_09", "crops_rabi", "Land Ownership", "Agri-Census", ["Wheat", "Barley", "Mustard", "Gram"]),
    createQuestion("single_select", "Do you use chemical fertilizers (Urea, DAP, NPK)?", "Chemical fertilizer check.", "AGRI_OWN_10", "use_fertilizer", "Land Ownership", "Agri-Census", ["Yes", "No"])
  ];

  const sec2Questions = [
    createQuestion("number", "Cost incurred on high yield seeds in past year (INR)?", "Seeds cost.", "AGRI_INP_01", "cost_seeds", "Inputs & Costs", "Agri-Input"),
    createQuestion("number", "Cost incurred on fertilizers and manure in past year (INR)?", "Fertilizer cost.", "AGRI_INP_02", "cost_fertilizer", "Inputs & Costs", "Agri-Input"),
    createQuestion("number", "Cost incurred on irrigation fuel/charges in past year (INR)?", "Irrigation cost.", "AGRI_INP_03", "cost_irrigation", "Inputs & Costs", "Agri-Input"),
    createQuestion("number", "Cost incurred on hired labor wages in past year (INR)?", "Labor wages.", "AGRI_INP_04", "cost_labor", "Inputs & Costs", "Agri-Input"),
    createQuestion("number", "Hire charges for farm machinery/tractors in past year (INR)?", "Machinery rental.", "AGRI_INP_05", "cost_machinery", "Inputs & Costs", "Agri-Input"),
    createQuestion("number", "Institutional credit/agricultural loan amount taken (INR)?", "Credit check.", "AGRI_INP_06", "loan_amount", "Inputs & Costs", "Agri-Input"),
    createQuestion("single_select", "Primary source of agricultural loan?", "Loan source.", "AGRI_INP_07", "loan_source", "Inputs & Costs", "Agri-Input", ["Cooperative Bank", "Commercial Bank", "Regional Rural Bank (RRB)", "Money Lender", "No Loan"]),
    createQuestion("number", "Annual rate of interest (%)?", "Interest rate.", "AGRI_INP_08", "interest_rate", "Inputs & Costs", "Agri-Input"),
    createQuestion("number", "Total market value of crops sold in past year (INR)?", "Yield revenue.", "AGRI_INP_09", "crop_value_sold", "Inputs & Costs", "Agri-Input"),
    createQuestion("single_select", "Agency to which crops were primarily sold?", "Market agency.", "AGRI_INP_10", "agency_sold", "Inputs & Costs", "Agri-Input", ["APMC Mandi", "Local Private Trader", "Farming Cooperative", "Direct to Consumer"])
  ];

  const sec3Questions = [
    createQuestion("number", "Number of cattle/cows owned?", "Cattle count.", "AGRI_MAC_01", "cattle_count", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Number of buffaloes owned?", "Buffalo count.", "AGRI_MAC_02", "buffalo_count", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Number of sheep and goats owned?", "Sheep/goats count.", "AGRI_MAC_03", "sheep_count", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Daily milk yield of livestock (in Litres)?", "Milk yield.", "AGRI_MAC_04", "milk_yield", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Daily quantity of milk sold (in Litres)?", "Milk sold.", "AGRI_MAC_05", "milk_sold", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Number of Tractors owned?", "Tractor count.", "AGRI_MAC_06", "tractor_count", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Number of Power Tillers owned?", "Tiller count.", "AGRI_MAC_07", "tiller_count", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Number of Combine Harvesters owned?", "Harvester count.", "AGRI_MAC_08", "harvester_count", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Annual household income from livestock (INR)?", "Livestock revenue.", "AGRI_MAC_09", "livestock_income", "Livestock & Assets", "Agri-Asset"),
    createQuestion("number", "Annual household income from non-farm operations (INR)?", "Non-farm revenue.", "AGRI_MAC_10", "non_farm_income", "Livestock & Assets", "Agri-Asset")
  ];

  // Skips
  // If land owned is 0 (sec1 q1), skip net sown area and irrigation questions
  const landOwnedQ = sec1Questions[0];
  landOwnedQ.skipLogic = [
    {
      id: "skip-land-owned",
      operator: "equals",
      conditionValue: "0",
      targetQuestionId: "end_survey"
    }
  ];

  // If loan source is "No Loan" (sec2 q7 code 5), skip interest rate
  const loanSourceQ = sec2Questions[6];
  loanSourceQ.skipLogic = [
    {
      id: "skip-loan-source",
      operator: "equals",
      conditionValue: loanSourceQ.options![4].id, // "No Loan"
      targetQuestionId: "end_survey"
    }
  ];

  const sections: Section[] = [
    { id: "sec-agri-1", title: "Section A: Land Ownership & Irrigation", isCollapsed: false, questions: sec1Questions },
    { id: "sec-agri-2", title: "Section B: Agricultural Inputs & Production Cost", isCollapsed: false, questions: sec2Questions },
    { id: "sec-agri-3", title: "Section C: Farm Machinery & Livestock Owned", isCollapsed: false, questions: sec3Questions }
  ];

  landOwnedQ.skipLogic[0].targetQuestionId = sec2Questions[5].id; // Jump to Institutional credit/loan
  loanSourceQ.skipLogic[0].targetQuestionId = sec2Questions[8].id; // Jump to crop value sold

  return {
    title: "Agricultural Census & Land Holding Survey",
    sections
  };
}

// 5. Education Survey (15-25 questions)
export function generateEducationSurvey() {
  const sec1Questions = [
    createQuestion("number", "What is the age of the member?", "Completed years.", "EDU_DEM_01", "member_age", "Demographics", "NSO-Age"),
    createQuestion("single_select", "Gender of the member?", "Select gender.", "EDU_DEM_02", "member_gender", "Demographics", "LGD-Sex", ["Male", "Female", "Third Gender"]),
    createQuestion("single_select", "Can the member read and write a simple message in any language with understanding?", "Basic literacy check.", "EDU_DEM_03", "is_literate", "Demographics", "NSO-Edu", ["Yes", "No"]),
    createQuestion("single_select", "Primary language spoken at home?", "Language profile.", "EDU_DEM_04", "primary_language", "Demographics", "NSO-Core", ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Other"]),
    createQuestion("number", "Number of years of formal education completed?", "Total years.", "EDU_DEM_05", "education_years", "Demographics", "NSO-Edu")
  ];

  const sec2Questions = [
    createQuestion("single_select", "What is the current enrolment status of the member?", "Current school status.", "EDU_ENR_01", "enrolment_status", "Enrolment & Attendance", "NSO-Edu", ["Currently Enrolled & Attending", "Enrolled but not Attending", "Ever Enrolled but Currently Drop-out", "Never Enrolled"]),
    createQuestion("single_select", "Current level of education being pursued?", "School level.", "EDU_ENR_02", "education_level_current", "Enrolment & Attendance", "NSO-Edu", ["Primary (1-5)", "Upper Primary (6-8)", "Secondary (9-10)", "Higher Secondary (11-12)", "Undergraduate/Degree", "Postgraduate & Above"]),
    createQuestion("single_select", "Type of educational institution currently attending?", "Private vs Govt.", "EDU_ENR_03", "institution_type", "Enrolment & Attendance", "NSO-Edu", ["Government School", "Government Aided School", "Private Un-aided School", "Madrasa/Non-formal School"]),
    createQuestion("number", "Distance from residence to the institution (in Kilometers)?", "Distance metric.", "EDU_ENR_04", "institution_distance", "Enrolment & Attendance", "NSO-Edu"),
    createQuestion("single_select", "Primary mode of transport used to reach the institution?", "Transport check.", "EDU_ENR_05", "transport_mode", "Enrolment & Attendance", "NSO-Edu", ["Walking", "Bicycle", "School Bus/Van", "Public Transport (Bus/Train)", "Two Wheeler/Personal Vehicle"])
  ];

  const sec3Questions = [
    createQuestion("number", "Annual tuition and admission fees paid (INR)?", "Tuition costs.", "EDU_EXP_01", "exp_tuition", "Expenditures", "NSO-Edu"),
    createQuestion("number", "Annual cost of books, stationery, and uniform (INR)?", "School supplies.", "EDU_EXP_02", "exp_supplies", "Expenditures", "NSO-Edu"),
    createQuestion("number", "Annual cost of private coaching/tuition (INR)?", "Coaching costs.", "EDU_EXP_03", "exp_coaching", "Expenditures", "NSO-Edu"),
    createQuestion("number", "Annual expenditure on transport to the institution (INR)?", "Transport costs.", "EDU_EXP_04", "exp_transport", "Expenditures", "NSO-Edu"),
    createQuestion("number", "Total annual educational expenditure for this member (INR)?", "Aggregated total.", "EDU_EXP_05", "total_education_exp", "Expenditures", "NSO-Edu")
  ];

  const sec4Questions = [
    createQuestion("number", "Age of dropping out from education?", "Age at drop out.", "EDU_DRP_01", "dropout_age", "Drop-out details", "NSO-Edu"),
    createQuestion("single_select", "Primary reason for dropping out/never enrolling?", "Drop out reason.", "EDU_DRP_02", "dropout_reason", "Drop-out details", "NSO-Edu", ["Financial constraints", "To participate in economic activities", "To attend domestic chores", "School too far", "Uninterested in studies", "Completed desired level"]),
    createQuestion("single_select", "Did the member receive free textbooks in the past school year?", "Social support.", "EDU_DRP_03", "free_textbooks", "Drop-out details", "NSO-Edu", ["Yes", "No"]),
    createQuestion("single_select", "Did the member receive free mid-day meals at the institution?", "Social support.", "EDU_DRP_04", "free_midday_meal", "Drop-out details", "NSO-Edu", ["Yes", "No"]),
    createQuestion("single_select", "Did the member receive any scholarship/stipend in past year?", "Scholarship status.", "EDU_DRP_05", "has_scholarship", "Drop-out details", "NSO-Edu", ["Yes", "No"])
  ];

  // Skips
  // If member is not literate (sec1 q3: is_literate is "No"), skip years of education
  const literateQ = sec1Questions[2];
  literateQ.skipLogic = [
    {
      id: "skip-literate",
      operator: "equals",
      conditionValue: literateQ.options![1].id, // "No"
      targetQuestionId: "end_survey"
    }
  ];

  // If enrolment status is "Never Enrolled" (sec2 q1 code 4), skip current level, tuition costs, and drop-out age
  const enrolmentQ = sec2Questions[0];
  enrolmentQ.skipLogic = [
    {
      id: "skip-enrolment",
      operator: "equals",
      conditionValue: enrolmentQ.options![3].id, // "Never Enrolled"
      targetQuestionId: "end_survey"
    }
  ];

  const sections: Section[] = [
    { id: "sec-edu-1", title: "Section A: Demographics & Literacy Status", isCollapsed: false, questions: sec1Questions },
    { id: "sec-edu-2", title: "Section B: Enrolment & Attendance Profile", isCollapsed: false, questions: sec2Questions },
    { id: "sec-edu-3", title: "Section C: Expenditure on Education", isCollapsed: false, questions: sec3Questions },
    { id: "sec-edu-4", title: "Section D: Drop-out Details & Support Systems", isCollapsed: false, questions: sec4Questions }
  ];

  literateQ.skipLogic[0].targetQuestionId = sec2Questions[0].id; // Jump to enrolment
  enrolmentQ.skipLogic[0].targetQuestionId = sec4Questions[1].id; // Jump to Reason for never enrolling (dropout_reason)

  return {
    title: "Household Social Consumption: Education Survey",
    sections
  };
}

// 6. Consumer Expenditure Survey (30-50 questions)
export function generateConsumerExpenditureSurvey() {
  const sec1Questions = [
    createQuestion("number", "What is the total number of usual members in your household?", "HH size.", "HCES_C_HH_01", "hh_size", "Household Profile", "NSO-HH"),
    createQuestion("single_select", "Sector of operation?", "Urban/Rural.", "HCES_C_HH_02", "sector", "Household Profile", "NSO-Core", ["Rural", "Urban"]),
    createQuestion("single_select", "State code identifier?", "Primary geographic state.", "HCES_C_HH_03", "state_code", "Household Profile", "LGD", ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "West Bengal", "Others"]),
    createQuestion("single_select", "Primary source of income for the household?", "Major livelihood.", "HCES_C_HH_04", "primary_livelihood", "Household Profile", "NSO-Core", ["Cultivation", "Salaried Employment", "Casual Labor", "Self Employed Non-Farm", "Pension/Rent/Remittances"]),
    createQuestion("single_select", "Do you possess a ration card (PDS)?", "PDS status.", "HCES_C_HH_05", "has_ration_card", "Household Profile", "NSO-Core", ["Yes - Antyodaya Anna Yojana (AAY)", "Yes - Priority Household (PHH)", "Yes - Non-Priority", "No"])
  ];

  const sec2Questions = [
    createQuestion("number", "Quantity of rice consumed in past 30 days (Kg)?", "Rice qty.", "HCES_C_FOD_01", "rice_qty", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on rice in past 30 days (INR)?", "Rice expenditure.", "HCES_C_FOD_02", "rice_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Quantity of wheat/atta consumed in past 30 days (Kg)?", "Wheat qty.", "HCES_C_FOD_03", "wheat_qty", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on wheat/atta in past 30 days (INR)?", "Wheat expenditure.", "HCES_C_FOD_04", "wheat_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on pulses (Arhar, Moong, Masur) in past 30 days (INR)?", "Pulses exp.", "HCES_C_FOD_05", "pulses_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on mustard/edible oil in past 30 days (INR)?", "Oil exp.", "HCES_C_FOD_06", "oil_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on egg, fish, and meat in past 30 days (INR)?", "Protein exp.", "HCES_C_FOD_07", "nonveg_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on liquid milk and milk products in past 30 days (INR)?", "Dairy exp.", "HCES_C_FOD_08", "milk_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on fresh vegetables in past 30 days (INR)?", "Vegetables exp.", "HCES_C_FOD_09", "vegetables_exp", "Food Expenses", "NSO-Food"),
    createQuestion("number", "Expenditure on fresh and dry fruits in past 30 days (INR)?", "Fruits exp.", "HCES_C_FOD_10", "fruits_exp", "Food Expenses", "NSO-Food")
  ];

  const sec3Questions = [
    createQuestion("number", "Expenditure on LPG cylinder/refills in past 30 days (INR)?", "LPG cost.", "HCES_C_FUL_01", "lpg_exp", "Fuel & Utilities", "NSO-Fuel"),
    createQuestion("number", "Electricity consumption charges paid in past 30 days (INR)?", "Electricity cost.", "HCES_C_FUL_02", "electricity_exp", "Fuel & Utilities", "NSO-Fuel"),
    createQuestion("number", "Expenditure on firewood, coal, and dung cakes (INR)?", "Biomass fuel cost.", "HCES_C_FUL_03", "biomass_exp", "Fuel & Utilities", "NSO-Fuel"),
    createQuestion("number", "Expenditure on petrol/diesel for private vehicles in past 30 days (INR)?", "Vehicle fuel.", "HCES_C_FUL_04", "vehicle_fuel_exp", "Fuel & Utilities", "NSO-Fuel"),
    createQuestion("number", "Expenditure on internet and mobile recharges in past 30 days (INR)?", "Telecom cost.", "HCES_C_FUL_05", "telecom_exp", "Fuel & Utilities", "NSO-Fuel")
  ];

  const sec4Questions = [
    createQuestion("number", "Expenditure on soaps, detergents, toiletries in past 30 days (INR)?", "Toiletries.", "HCES_C_NFD_01", "toiletries_exp", "Monthly Non-Food", "NSO-NonFood"),
    createQuestion("number", "Out-of-pocket medical outpatient expenses in past 30 days (INR)?", "Medical OP.", "HCES_C_NFD_02", "medical_op_exp", "Monthly Non-Food", "NSO-NonFood"),
    createQuestion("number", "Conveyance expenditure (bus, train, auto, taxi fares) in past 30 days (INR)?", "Commute expense.", "HCES_C_NFD_03", "commute_fares_exp", "Monthly Non-Food", "NSO-NonFood"),
    createQuestion("number", "Expenditure on newspapers, magazines, and stationery (INR)?", "Reading/stationery.", "HCES_C_NFD_04", "reading_stationery_exp", "Monthly Non-Food", "NSO-NonFood"),
    createQuestion("number", "Expenditure on entertainment, cable, and streaming services (INR)?", "Entertainment.", "HCES_C_NFD_05", "entertainment_exp", "Monthly Non-Food", "NSO-NonFood")
  ];

  const sec5Questions = [
    createQuestion("number", "Annual expenditure on clothing, fabrics, and tailoring (INR)?", "Clothing.", "HCES_C_ANN_01", "clothing_exp_annual", "Annual Non-Food", "NSO-NonFood"),
    createQuestion("number", "Annual expenditure on footwear (INR)?", "Footwear.", "HCES_C_ANN_02", "footwear_exp_annual", "Annual Non-Food", "NSO-NonFood"),
    createQuestion("number", "Annual expenditure on school/college fees and educational items (INR)?", "Education.", "HCES_C_ANN_03", "education_exp_annual", "Annual Non-Food", "NSO-NonFood"),
    createQuestion("number", "Medical expenditure on hospitalizations/inpatient care in past 365 days (INR)?", "Inpatient costs.", "HCES_C_ANN_04", "medical_ip_exp_annual", "Annual Non-Food", "NSO-NonFood"),
    createQuestion("number", "Total value of purchase of durables (AC, TV, Fridge, Auto) in past 365 days (INR)?", "Durable goods.", "HCES_C_ANN_05", "durables_exp_annual", "Annual Non-Food", "NSO-NonFood"),
    createQuestion("number", "Expenditure on residential house repair and maintenance in past 365 days (INR)?", "House repair.", "HCES_C_ANN_06", "house_repair_exp_annual", "Annual Non-Food", "NSO-NonFood"),
    createQuestion("number", "Total computed monthly consumption expenditure (INR)?", "Summary index.", "HCES_C_ANN_07", "total_consumption_exp", "Annual Non-Food", "NSO-Summary")
  ];

  return {
    title: "Household Consumer Expenditure Survey (HCES - Comprehensive)",
    sections: [
      { id: "sec-hces-c-1", title: "Section A: Household General Profile", isCollapsed: false, questions: sec1Questions },
      { id: "sec-hces-c-2", title: "Section B: Food Consumption & Expenditure (Past 30 Days)", isCollapsed: false, questions: sec2Questions },
      { id: "sec-hces-c-3", title: "Section C: Fuel, Utilities & Technology (Past 30 Days)", isCollapsed: false, questions: sec3Questions },
      { id: "sec-hces-c-4", title: "Section D: Miscellaneous Non-Food Items (Past 30 Days)", isCollapsed: false, questions: sec4Questions },
      { id: "sec-hces-c-5", title: "Section E: Education, Health & Durables (Past 365 Days)", isCollapsed: false, questions: sec5Questions }
    ]
  };
}

// 7. Tourism Survey (20-30 questions)
export function generateTourismSurvey() {
  const sec1Questions = [
    createQuestion("number", "What is the total number of usual members in your household?", "HH size.", "TUS_HH_01", "hh_size", "Household Particulars", "NSO-HH"),
    createQuestion("single_select", "Social group of the household?", "Social classification.", "TUS_HH_02", "social_group", "Household Particulars", "LGD", ["Scheduled Tribe (ST)", "Scheduled Caste (SC)", "Other Backward Class (OBC)", "Others"]),
    createQuestion("single_select", "Sector of operation?", "Urban/Rural.", "TUS_HH_03", "sector", "Household Particulars", "NSO-Core", ["Rural", "Urban"]),
    createQuestion("single_select", "Did any member of the household undertake any overnight trip in past 30 days?", "Overnight trip filter.", "TUS_HH_04", "has_overnight_trip", "Household Particulars", "NSO-Tourism", ["Yes", "No"]),
    createQuestion("single_select", "Did any member undertake any same-day trip in past 30 days?", "Same day trip check.", "TUS_HH_05", "has_sameday_trip", "Household Particulars", "NSO-Tourism", ["Yes", "No"])
  ];

  const sec2Questions = [
    createQuestion("number", "What is the age of the primary traveler?", " Traveler age.", "TUS_TRP_01", "traveler_age", "Trip Details", "NSO-Age"),
    createQuestion("single_select", "Primary purpose of the overnight trip?", "Main purpose.", "TUS_TRP_02", "trip_purpose", "Trip Details", "NSO-Tourism", ["Business", "Holiday/Leisure/Sightseeing", "Social (Visiting Friends/Relatives)", "Pilgrimage/Religious", "Medical Treatment", "Education/Training"]),
    createQuestion("number", "What was the duration of the trip (in nights)?", "Number of nights.", "TUS_TRP_03", "trip_nights", "Trip Details", "NSO-Tourism"),
    createQuestion("single_select", "What was the destination state of the trip?", "Destination check.", "TUS_TRP_04", "destination_state", "Trip Details", "LGD", ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Rajasthan", "Uttar Pradesh", "Other State"]),
    createQuestion("single_select", "Primary mode of transport used for the trip?", "Transport mode.", "TUS_TRP_05", "primary_transport", "Trip Details", "NSO-Tourism", ["Air", "Railways", "Bus (Public/Private)", "Personal Car/Taxi", "Two Wheeler"]),
    createQuestion("single_select", "Primary type of accommodation used during the stay?", "Stay type.", "TUS_TRP_06", "primary_accommodation", "Trip Details", "NSO-Tourism", ["Hotel", "Guest House/Dharamshala", "Stayed with Friends/Relatives", "Homestay/Airbnb", "Hospital", "Others"])
  ];

  const sec3Questions = [
    createQuestion("number", "Expenditure on transport for the trip (INR)?", "Travel fares/fuel.", "TUS_EXP_01", "exp_transport", "Trip Expenditure", "NSO-Tourism"),
    createQuestion("number", "Expenditure on accommodation/hotel stay (INR)?", "Hotel costs.", "TUS_EXP_02", "exp_accommodation", "Trip Expenditure", "NSO-Tourism"),
    createQuestion("number", "Expenditure on food, beverages, and dining out (INR)?", "Dining cost.", "TUS_EXP_03", "exp_food_dining", "Trip Expenditure", "NSO-Tourism"),
    createQuestion("number", "Expenditure on local sightseeing, guides, and entrance fees (INR)?", "Sightseeing.", "TUS_EXP_04", "exp_sightseeing", "Trip Expenditure", "NSO-Tourism"),
    createQuestion("number", "Expenditure on shopping during the trip (INR)?", "Shopping cost.", "TUS_EXP_05", "exp_shopping", "Trip Expenditure", "NSO-Tourism"),
    createQuestion("number", "Package tour operator charges (if fully/partially package) (INR)?", "Package cost.", "TUS_EXP_06", "exp_package_operator", "Trip Expenditure", "NSO-Tourism"),
    createQuestion("number", "Total computed expenditure on the trip (INR)?", "Aggregated total.", "TUS_EXP_07", "total_trip_exp", "Trip Expenditure", "NSO-Tourism")
  ];

  // Skips
  // If no overnight trip (sec1 q4: has_overnight_trip is "No"), skip Trip Details and Trip Expenditure
  const overnightQ = sec1Questions[3];
  overnightQ.skipLogic = [
    {
      id: "skip-overnight",
      operator: "equals",
      conditionValue: overnightQ.options![1].id, // "No"
      targetQuestionId: "end_survey"
    }
  ];

  const sections: Section[] = [
    { id: "sec-tus-1", title: "Section A: Household Particulars & Travel History", isCollapsed: false, questions: sec1Questions },
    { id: "sec-tus-2", title: "Section B: Overnight Trip Details (Most Recent Trip)", isCollapsed: false, questions: sec2Questions },
    { id: "sec-tus-3", title: "Section C: Tourism Destination Expenditures", isCollapsed: false, questions: sec3Questions }
  ];

  overnightQ.skipLogic[0].targetQuestionId = "end_survey"; // Jump to end of survey

  return {
    title: "Domestic Tourism Expenditure Survey (DTES)",
    sections
  };
}

// 8. Industry Survey (30-40 questions)
export function generateIndustrySurvey() {
  const sec1Questions = [
    createQuestion("short_text", "Name of the Industrial Factory / Establishment?", "Official factory name.", "ASI_FAC_01", "factory_name", "Establishment Info", "ASI"),
    createQuestion("single_select", "Registration status of the factory?", "Factory Act status.", "ASI_FAC_02", "registration_status", "Establishment Info", "ASI", ["Registered under Section 2m(i) of Factories Act", "Registered under Section 2m(ii)", "Registered under Bidi & Cigar Workers Act", "Unregistered"]),
    createQuestion("dropdown", "Select Industry classification (NIC 2-digit)?", "NIC-2008 code.", "ASI_FAC_03", "nic_2digit", "Establishment Info", "NIC-2008"),
    createQuestion("single_select", "Sector of operation?", "Urban/Rural.", "ASI_FAC_04", "sector", "Establishment Info", "ASI", ["Rural", "Urban"]),
    createQuestion("single_select", "State of operation?", "Geographic location.", "ASI_FAC_05", "state_code", "Establishment Info", "LGD", ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Haryana", "West Bengal", "Others"]),
    createQuestion("number", "Total number of days the factory worked in reference year?", "Operating days.", "ASI_FAC_06", "working_days_annual", "Establishment Info", "ASI")
  ];

  const sec2Questions = [
    createQuestion("number", "Average number of regular workers employed per day?", "Regular workforce.", "ASI_EMP_01", "regular_workers_count", "Employment & Labor", "ASI"),
    createQuestion("number", "Average number of contract workers employed per day?", "Contract labor.", "ASI_EMP_02", "contract_workers_count", "Employment & Labor", "ASI"),
    createQuestion("number", "Average number of supervisory and managerial staff per day?", "Managers/Supervisors.", "ASI_EMP_03", "supervisory_staff_count", "Employment & Labor", "ASI"),
    createQuestion("number", "Total man-days worked by all employees during reference year?", "Aggregated man-days.", "ASI_EMP_04", "total_mandays_annual", "Employment & Labor", "ASI"),
    createQuestion("number", "Total wages/salary paid to regular workers (INR)?", "Regular wages.", "ASI_EMP_05", "wages_regular_annual", "Employment & Labor", "ASI"),
    createQuestion("number", "Total wages/remuneration paid to contract workers (INR)?", "Contract labor cost.", "ASI_EMP_06", "wages_contract_annual", "Employment & Labor", "ASI"),
    createQuestion("number", "Employer's contribution to Provident Fund (PF) and Gratuity (INR)?", "Social security benefits.", "ASI_EMP_07", "employer_social_security_annual", "Employment & Labor", "ASI")
  ];

  const sec3Questions = [
    createQuestion("number", "Book value of fixed assets at the beginning of the year (INR)?", "Opening fixed assets.", "ASI_CAP_01", "fixed_assets_opening", "Capital & Inputs", "ASI"),
    createQuestion("number", "Total capital additions/purchases during reference year (INR)?", "Capital additions.", "ASI_CAP_02", "capital_additions_annual", "Capital & Inputs", "ASI"),
    createQuestion("number", "Book value of fixed assets at the close of the year (INR)?", "Closing fixed assets.", "ASI_CAP_03", "fixed_assets_closing", "Capital & Inputs", "ASI"),
    createQuestion("number", "Working capital at the beginning of the year (INR)?", "Working capital.", "ASI_CAP_04", "working_capital_opening", "Capital & Inputs", "ASI"),
    createQuestion("number", "Total expenditure on fuel and lubricants consumed (INR)?", "Fuel cost.", "ASI_CAP_05", "fuel_consumed_exp", "Capital & Inputs", "ASI"),
    createQuestion("number", "Total expenditure on raw materials consumed (INR)?", "Raw materials cost.", "ASI_CAP_06", "raw_materials_exp", "Capital & Inputs", "ASI"),
    createQuestion("number", "Electricity consumed quantity (in Kilowatt-Hours)?", "Electricity consumed.", "ASI_CAP_07", "electricity_qty_consumed", "Capital & Inputs", "ASI"),
    createQuestion("number", "Total charges paid for electricity purchased (INR)?", "Electricity cost.", "ASI_CAP_08", "electricity_purchased_exp", "Capital & Inputs", "ASI")
  ];

  const sec4Questions = [
    createQuestion("number", "Gross value of products sold during reference year (INR)?", "Sales revenue.", "ASI_OUT_01", "products_sold_value", "Production & Output", "ASI"),
    createQuestion("number", "Value of industrial by-products produced (INR)?", "By-products revenue.", "ASI_OUT_02", "byproducts_value", "Production & Output", "ASI"),
    createQuestion("number", "Charges received for services rendered to other units (INR)?", "Services revenue.", "ASI_OUT_03", "services_rendered_revenue", "Production & Output", "ASI"),
    createQuestion("number", "Gross value of output compiled (INR)?", "Gross output index.", "ASI_OUT_04", "gross_output_value", "Production & Output", "ASI")
  ];

  const sections: Section[] = [
    { id: "sec-asi-1", title: "Section A: Factory Profile & Identification Details", isCollapsed: false, questions: sec1Questions },
    { id: "sec-asi-2", title: "Section B: Employment, Wages, & Labor Cost Details", isCollapsed: false, questions: sec2Questions },
    { id: "sec-asi-3", title: "Section C: Capital Assets & Industrial Inputs", isCollapsed: false, questions: sec3Questions },
    { id: "sec-asi-4", title: "Section D: Production & Output Details", isCollapsed: false, questions: sec4Questions }
  ];

  return {
    title: "Annual Survey of Industries (ASI)",
    sections
  };
}

// 9. Labour Force Survey (same as Employment template)
export function generateLabourForceSurvey() {
  return generateEmploymentSurvey();
}
