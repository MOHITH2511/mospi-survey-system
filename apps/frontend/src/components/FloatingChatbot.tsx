import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  MessageSquare,
  X,
  Minus,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Info,
  ChevronUp,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const getPageName = (path: string): string => {
  if (path === "/" || path === "") return "Portal Home Page";
  if (path === "/login") return "Login Page";
  if (path === "/admin") return "Nodal Officer Dashboard";
  if (path === "/admin/survey-builder") return "AI Survey Builder";
  if (path === "/admin/import") return "Survey Import Center";
  if (path === "/admin/question-bank") return "Question Bank";
  if (path === "/admin/registry") return "Survey Registry";
  if (path === "/admin/publish") return "Deployment Center";
  if (path === "/admin/monitoring") return "Monitoring Hub";
  if (path === "/admin/insights") return "AI Insights Panel";
  if (path === "/admin/users") return "User Management";
  if (path === "/citizen") return "Citizen Portal Dashboard";
  if (path === "/citizen/survey") return "Voice Survey Engine";
  if (path === "/citizen/complete") return "Survey Complete";
  if (path === "/supervisor") return "Supervisor Hub";
  if (path === "/supervisor/quality-flags") return "Quality Flag Manager";
  if (path === "/supervisor/audit-logs") return "System Audit Logs";
  if (path === "/supervisor/validation") return "Validation Queue";
  if (path === "/enumerator") return "Enumerator Dashboard";
  return "Portal Page";
};

const getSuggestions = (path: string): string[] => {
  const defaults = [
    "What is Census?",
    "What is NSS?",
    "What is PLFS?",
    "What is a Household Survey?",
    "Explain Stratified Sampling.",
    "What is NSO?",
    "How are surveys validated?"
  ];
  if (path === "/admin") return ["What is NSO?", "Explain Stratified Sampling.", "How are surveys validated?"];
  if (path === "/admin/survey-builder") return ["What is a Household Survey?", "How are surveys validated?", "What is PLFS?"];
  if (path === "/admin/import") return ["What is NSS?", "What is Census?"];
  if (path === "/admin/question-bank") return ["Explain Stratified Sampling.", "What is PLFS?"];
  if (path === "/admin/registry") return ["What is NSO?", "What is NSS?"];
  if (path === "/admin/publish") return ["How are surveys validated?", "What is PLFS?"];
  if (path === "/admin/monitoring") return ["How are surveys validated?", "What is a Household Survey?"];
  if (path === "/admin/insights") return ["What is NSS?", "Explain Stratified Sampling."];
  if (path === "/admin/users") return ["What is NSO?", "How are surveys validated?"];
  return defaults;
};

const matchResponse = (query: string, _path: string): string => {
  const q = query.toLowerCase().trim();

  // Normalize by removing punctuation
  const cleanQ = q.replace(/[?,.:;\-_"'!()]/g, " ");
  const tokens = cleanQ.split(/\s+/).filter(t => t.length > 0);

  // Helper function for Levenshtein Distance
  const getLevenshteinDistance = (a: string, b: string): number => {
    const tmp: number[][] = [];
    for (let i = 0; i <= a.length; i++) {
      tmp[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
      tmp[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1, // deletion
          tmp[i][j - 1] + 1, // insertion
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
        );
      }
    }
    return tmp[a.length][b.length];
  };

  const stem = (word: string): string => {
    return word
      .replace(/ing$/, "")
      .replace(/ed$/, "")
      .replace(/es$/, "")
      .replace(/s$/, "")
      .replace(/ment$/, "")
      .replace(/ity$/, "")
      .replace(/tion$/, "");
  };

  // Helper function to check if word matches keyword (with spelling tolerance)
  const isWordMatch = (token: string, keyword: string): boolean => {
    if (token === keyword) return true;
    // For 3-letter acronyms / short words (e.g. NSO, NSS, CPI, IIP, GDP), require exact match to avoid false positive intersections
    if (token.length <= 3 || keyword.length <= 3) {
      // Allow specific known typos
      if (token === "rto" && keyword === "to") return true;
      return token === keyword;
    }

    const sToken = stem(token);
    const sKeyword = stem(keyword);

    if (sToken === sKeyword) return true;

    // Handle prefix/suffix overlap checks
    if (sToken.startsWith(sKeyword) || sKeyword.startsWith(sToken)) {
      // Avoid matching sub-abbreviations like 'what' matching 'whatsapp'
      const lenDiff = Math.abs(sToken.length - sKeyword.length);
      if (lenDiff <= 3) return true;
    }

    // Edit distance check for words >= 4 chars
    const distance = getLevenshteinDistance(sToken, sKeyword);
    const limit = Math.max(1, Math.floor(sKeyword.length / 4));
    if (distance <= limit) return true;

    // Specific check for common typos
    if (token === "surbey" && keyword === "survey") return true;
    if (token === "responce" && keyword === "response") return true;
    if (token === "enumertor" && keyword === "enumerator") return true;
    return false;
  };

  // Helper to check if any token matches a keyword
  const hasKeyword = (keyword: string): boolean => {
    return tokens.some(t => isWordMatch(t, keyword));
  };



  // 1. Greetings
  if (["hi", "hello", "hey", "namaskar", "namaste"].some(g => q.includes(g)) || q === "hi" || q === "hello") {
    return "Namaskar! I am your **MOSPI ASSISTANT**. I specialize in NSO socio-economic surveys, decennial census logistics, PLFS activity classifications, sampling designs, and data quality standards. How can I assist your statistical inquiries today?";
  }
  if (q.includes("how are you")) {
    return "I am operating at peak efficiency! How can I assist you with MoSPI statistical systems today?";
  }
  if (q.includes("thank") || q === "ok" || q === "okay") {
    return "You are welcome! Let me know if you need anything else on NSO surveys or sampling frames.";
  }
  if (["bye", "goodbye", "exit"].some(g => q.includes(g))) {
    return "Goodbye! Have a productive session on the MoSPI Portal.";
  }

  // 2. Specific "create" + topic triggers
  if (hasKeyword("create") || hasKeyword("make") || hasKeyword("build") || hasKeyword("generate") || hasKeyword("new")) {
    if (hasKeyword("health") || hasKeyword("medical")) {
      return "### Household Health & Healthcare Utilization Survey\n\n" +
             "- **Survey Title**: Household Health & Healthcare Utilization Survey\n" +
             "- **Survey Objective**: To evaluate household demographic profiles, identify chronic illness prevalence, assess outpatient and inpatient healthcare utilization, check health insurance coverage (e.g., Ayushman Bharat PM-JAY), and measure out-of-pocket health expenditures.\n" +
             "- **Recommended Question Count**: 25-30 Questions\n\n" +
             "#### Key Sections:\n" +
             "1. **Household Profile & Demographics**: Roster size, social group, primary source of drinking water, sanitation facilities.\n" +
             "2. **Individual Health Profile**: Age, gender, general health status, overnight hospitalization history (past 365 days).\n" +
             "3. **Chronic Diseases**: Diabetes, hypertension, respiratory ailments, treatment duration, and medication sources.\n" +
             "4. **Healthcare Service Utilization**: Outpatient/inpatient facility types visited, distance to facility, diagnostic tests, and travel modes.\n" +
             "5. **Insurance Coverage**: Enrolment in Ayushman Bharat (PM-JAY), commercial health policy limits, and premium costs.\n" +
             "6. **Out-of-Pocket Expenditure**: Money spent on medicines, consults, hospital stays, and travel.\n\n" +
             "#### Sample Questions & Validation Rules:\n" +
             "- **Q1**: What is the age of the household member?\n" +
             "  *Type*: Number | *Validation*: Age `0-120` | *Mandatory*: Yes\n" +
             "- **Q2**: What is the total number of usual members in your household?\n" +
             "  *Type*: Number | *Validation*: Household Size `1-50` | *Mandatory*: Yes\n" +
             "- **Q3**: Total out-of-pocket expenditure on inpatient care in past 365 days (INR)?\n" +
             "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: No";
    }

    if (hasKeyword("employ") || hasKeyword("job") || hasKeyword("labor") || hasKeyword("labour") || hasKeyword("work")) {
      return "### Periodic Labour Force Survey (PLFS) Draft\n\n" +
             "- **Survey Title**: Periodic Labour Force Survey (PLFS)\n" +
             "- **Survey Objective**: To estimate employment and unemployment indicators, identify industrial divisions (NIC-2008) and occupational groups (NCO-2015), measure monthly earnings, and evaluate workplace contracts.\n" +
             "- **Recommended Question Count**: 20-25 Questions\n\n" +
             "#### Key Sections:\n" +
             "1. **Demographics**: Household member profiles, highest education level completed, and years of education.\n" +
             "2. **Principal Usual Activity Status**: Activity status over past 365 days, industry NIC code, occupation NCO code, and usual monthly earnings.\n" +
             "3. **Current Weekly Activity Status**: Work status in last 7 days, total hours worked, daily wages, and seeking/availability status.\n" +
             "4. **Work Conditions**: Enterprise type, registration details, commute distance, and leave benefits.\n\n" +
             "#### Sample Questions & Validation Rules:\n" +
             "- **Q1**: Number of years of formal education completed?\n" +
             "  *Type*: Number | *Validation*: Years of Education `0-30` | *Mandatory*: Yes\n" +
             "- **Q2**: Usual Monthly Earnings from this Principal Activity (in INR)?\n" +
             "  *Type*: Number | *Validation*: Income `0-10000000` | *Mandatory*: Yes (if employed)\n" +
             "- **Q3**: What was your Principal Activity Status over the past 365 days?\n" +
             "  *Type*: Single Select | *Mandatory*: Yes";
    }

    if (hasKeyword("expenditure") || hasKeyword("consumption") || hasKeyword("hces") || hasKeyword("spend")) {
      return "### Comprehensive Household Consumer Expenditure Survey (HCES)\n\n" +
             "- **Survey Title**: Household Consumer Expenditure Survey (HCES - Comprehensive)\n" +
             "- **Survey Objective**: To collect detailed consumption data across specific food, fuel, clothing, educational, and durable items to determine Monthly Per Capita Consumer Expenditure (MPCE).\n" +
             "- **Recommended Question Count**: 30-50 Questions\n\n" +
             "#### Key Sections:\n" +
             "1. **Household Profile**: Sector (Rural/Urban), state code, primary livelihood, and PDS ration card details.\n" +
             "2. **Detailed Food Consumption**: Expenditures on rice, wheat, pulses, cooking oils, proteins, dairy, and fresh produce (past 30 days).\n" +
             "3. **Fuel & Utilities**: Spent on LPG refills, electricity bills, biomass fuel, vehicle fuel, and telecom recharges (past 30 days).\n" +
             "4. **Miscellaneous Non-Food**: Spent on toiletries, outpatient health, commute fares, and entertainment (past 30 days).\n" +
             "5. **Annual Non-Food & Durables**: Spent on clothing, footwear, tuition, inpatient health, durable goods, and home repairs (past 365 days).\n\n" +
             "#### Sample Questions & Validation Rules:\n" +
             "- **Q1**: What is the total number of usual members in your household?\n" +
             "  *Type*: Number | *Validation*: Household Size `1-50` | *Mandatory*: Yes\n" +
             "- **Q2**: Expenditure on rice in past 30 days (INR)?\n" +
             "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: Yes\n" +
             "- **Q3**: Total value of purchase of durables (AC, TV, Vehicle) in past 365 days (INR)?\n" +
             "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: No";
    }

    if (hasKeyword("household")) {
      return "### Household Consumer Expenditure Survey (HCES) Draft\n\n" +
             "- **Survey Title**: Household Consumer Expenditure Survey (HCES)\n" +
             "- **Survey Objective**: To collect data on household demographic profiles, social groups, utility profiles, and consumer expenditures on food, utilities, and durables.\n" +
             "- **Recommended Question Count**: 20-30 Questions\n\n" +
             "#### Key Sections:\n" +
             "1. **Demographic Profile**: Roster size, social group, religion, housing structure, and cooking/lighting energy sources.\n" +
             "2. **Food Expenditures**: Quantity and expenditure on cereals, pulses, milk, vegetables, and fruit consumed (past 30 days).\n" +
             "3. **Non-Food Expenditures**: Schooling fees, clothing, medical outpatient consults, travel, and utility bills (past 30 days).\n\n" +
             "#### Sample Questions & Validation Rules:\n" +
             "- **Q1**: What is the total number of usual members in your household?\n" +
             "  *Type*: Number | *Validation*: Household Size `1-50` | *Mandatory*: Yes\n" +
             "- **Q2**: Total Household Expenditure on Cereals (in INR)?\n" +
             "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: Yes\n" +
             "- **Q3**: What is the primary source of drinking water in the household?\n" +
             "  *Type*: Single Select | *Mandatory*: Yes";
    }

    if (hasKeyword("agri") || hasKeyword("farm") || hasKeyword("land") || hasKeyword("holding")) {
      return "### Agricultural Census & Land Holding Survey\n\n" +
             "- **Survey Title**: Agricultural Census & Land Holding Survey\n" +
             "- **Survey Objective**: To evaluate agricultural operational land holdings, irrigation sources, crop distributions, inputs and production costs, credit access, and livestock assets.\n" +
             "- **Recommended Question Count**: 30-40 Questions\n\n" +
             "#### Key Sections:\n" +
             "1. **Land Ownership & Irrigation**: Land area owned, leased-in, net sown area, irrigation sources, and crop patterns (Kharif/Rabi).\n" +
             "2. **Inputs & Costs**: Annual expenses on seeds, fertilizers, labor wages, machinery rental, credit amount, and crop market yields.\n" +
             "3. **Farm Assets & Livestock**: Cattle, buffalo, goat/sheep counts, daily milk production, machinery owned, and non-farm revenues.\n\n" +
             "#### Sample Questions & Validation Rules:\n" +
             "- **Q1**: Total agricultural land area owned (in Hectares)?\n" +
             "  *Type*: Number | *Validation*: Land Area `0-100000` | *Mandatory*: Yes\n" +
             "- **Q2**: Institutional credit / agricultural loan amount taken (INR)?\n" +
             "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: No\n" +
             "- **Q3**: Primary source of agricultural loan?\n" +
             "  *Type*: Single Select | *Mandatory*: Yes";
    }

    if (hasKeyword("educat") || hasKeyword("student") || hasKeyword("school") || hasKeyword("literacy")) {
      return "### Household Social Consumption: Education Survey\n\n" +
             "- **Survey Title**: Household Social Consumption: Education Survey\n" +
             "- **Survey Objective**: To capture literacy rates, current enrolment and school attendance characteristics, annual educational expenditures, and drop-out reasons.\n" +
             "- **Recommended Question Count**: 15-25 Questions\n\n" +
             "#### Key Sections:\n" +
             "1. **Demographics**: Member age, gender, literacy status, general language spoken, and years of formal education.\n" +
             "2. **Enrolment & Attendance**: Current school status, class level, public vs private school, commute distance, and transit modes.\n" +
             "3. **Educational Expenditure**: Annual fees, books/supplies, private tuition, transport cost, and total expenses.\n" +
             "4. **Drop-out Details**: Age of dropping out, primary drop-out reasons, and government support access (free meals/books).\n\n" +
             "#### Sample Questions & Validation Rules:\n" +
             "- **Q1**: What is the age of the member?\n" +
             "  *Type*: Number | *Validation*: Age `0-120` | *Mandatory*: Yes\n" +
             "- **Q2**: Number of years of formal education completed?\n" +
             "  *Type*: Number | *Validation*: Years of Education `0-30` | *Mandatory*: Yes\n" +
             "- **Q3**: Total annual educational expenditure for this member (INR)?\n" +
             "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: Yes";
    }

    // Survey Creation Step by Step / How to / Navigate / Procedure (Resolves the user query!)
    if (hasKeyword("how") || hasKeyword("procedure") || hasKeyword("step") || hasKeyword("navigate") || hasKeyword("where") || hasKeyword("guide") || hasKeyword("direction") || hasKeyword("process")) {
      return "### 📋 MoSPI Survey Creation Step-by-Step Procedure\n\n" +
             "You can create, customize, and publish surveys directly on this portal. Here is the exact procedure:\n\n" +
             "1. **Access the Builder**: Navigate to the **[AI Survey Builder](file:///admin/survey-builder)** page from the sidebar menu.\n" +
             "2. **Use AI Generation (Recommended)**: Click the blue **\"✨ Generate with AI\"** button at the top of the left panel. Type in your survey theme or objective (e.g. *General Socio-Economic Survey* or *Household Health Survey*), and the AI will automatically create sections, questions, and baseline validations in seconds!\n" +
             "3. **Add Sections manually**: Click **\"+ Add Section\"** to group your questions into sections (e.g., Demographics, Economic status).\n" +
             "4. **Add & Customize Questions**: Click on any question type in the left palette (e.g., Short Text, Number, Single/Multi-Select, GPS) to insert it. Select the question in the middle panel to customize its label, help text, and **Validation Rules** on the right side panel.\n" +
             "5. **Configure Validation & Metadata**: For each question, ensure the **Statistical Metadata** (Question Code, Variable Name, and Data Type) is filled to maintain national directory compliance.\n" +
             "6. **Review Quality Score**: Look at the **Quality Score** bar in the top toolbar. A score >= 50 is 'Good' and >= 80 is 'Excellent'. The system requires passing quality checks before publishing.\n" +
             "7. **Publish & Deploy**: Click **\"Publish Survey\"** on the top right. Once published, navigate to the **[Deployment Center](file:///admin/publish)** to deploy it via SMS, WhatsApp, or assign it to enumerators.";
    }

    // Default general survey creation draft
    return "### General Socio-Economic Survey Draft\n\n" +
           "- **Survey Title**: General Socio-Economic Survey\n" +
           "- **Survey Objective**: To compile baseline demographic structures, income/expenditure, and educational profiles across national zone sample frameworks.\n" +
           "- **Recommended Question Count**: 15-20 Questions\n\n" +
           "#### Suggested Sections:\n" +
           "1. **Household Profile**: Roster size, location, structure, size, cooking energy, drinking water.\n" +
           "2. **Demographics**: Age, gender, literacy, schooling history.\n" +
           "3. **Economic Particulars**: Usual employment, primary industry classification, monthly earnings.\n\n" +
           "#### Sample Questions & Validation Rules:\n" +
           "- **Q1**: What is the age of the member?\n" +
           "  *Type*: Number | *Validation*: Age `0-120` | *Mandatory*: Yes\n" +
           "- **Q2**: Number of years of formal education completed?\n" +
           "  *Type*: Number | *Validation*: Years of Education `0-30` | *Mandatory*: Yes\n" +
           "- **Q3**: Total monthly household consumption expenditure (INR)?\n" +
           "  *Type*: Number | *Validation*: Income/Expenditure `0-10000000` | *Mandatory*: Yes";
  }

  // 3. National Surveys & Acronyms
  if (hasKeyword("nss")) {
    return "The **National Sample Survey (NSS)** is a multi-subject, integrated, and continuing sample survey programme established by the Government of India in 1950. It conducts large-scale, scientific sample surveys across successive 'rounds' to collect socio-economic data required for national development planning and policy formulation. It is conducted by the National Statistical Office (NSO). Read more: [MoSPI NSS Portal](https://www.mospi.gov.in/national-sample-survey-office-nsso)";
  }
  if (hasKeyword("plfs") || (hasKeyword("labour") && hasKeyword("force"))) {
    return "The **Periodic Labour Force Survey (PLFS)** is designed to estimate key employment and unemployment indicators (Worker Population Ratio, Labour Force Participation Rate, Unemployment Rate). It provides quarterly estimates for urban areas in 'Current Weekly Status' (CWS) and annual estimates for rural/urban areas in both 'Usual Status' (ps+ss) and CWS. Read more: [MoSPI PLFS Portal](https://www.mospi.gov.in/periodic-labour-force-survey-plfs)";
  }
  if (hasKeyword("hces") || (hasKeyword("consumption") && hasKeyword("expenditure"))) {
    return "The **Household Consumption Expenditure Survey (HCES)** is designed to collect information on the consumption of goods and services by households. The results are primarily used for preparing the weighting diagram for the Consumer Price Index (CPI) and for updating macroeconomic base indicators and poverty estimates. Read more: [MoSPI HCES Portal](https://www.mospi.gov.in/household-consumption-expenditure-survey)";
  }
  if (hasKeyword("asi") || hasKeyword("industry") || hasKeyword("industries")) {
    return "The **Annual Survey of Industries (ASI)** is the principal source of industrial statistics in India. It provides statistical information to evaluate the growth, composition, and structure of the organized manufacturing sector, including activities related to manufacturing processes, repair services, gas, water supply, and cold storage. Read more: [MoSPI ASI Portal](https://www.mospi.gov.in/publication/annual-survey-industries)";
  }
  if (hasKeyword("census")) {
    return "The **Decennial Population Census** of India is the largest administrative and statistical exercise in the country, conducted under the Census Act, 1948:\n\n" +
           "- **Scope**: It represents a **complete enumeration** (100% coverage) of the population, capturing demographics, economic activity, literacy, housing, and household amenities.\n" +
           "- **Governance**: Executed by the Office of the Registrar General and Census Commissioner of India under the Ministry of Home Affairs (MHA).\n" +
           "- **Statistical Integration**: The master directories of Census villages and urban blocks serve as the vital sampling frames (First Stage Units) for all subsequent NSO sample surveys.\n" +
           "- **Official Portal**: Find publications on the [MoSPI Census Publications Section](https://www.mospi.gov.in/publication/census-india).";
  }

  // 4. Counts & Active Metrics
  if (hasKeyword("active") || hasKeyword("running") || hasKeyword("live") || hasKeyword("ongoing")) {
    if (hasKeyword("survey") || hasKeyword("surveys")) {
      return "There are **10 Active (live) surveys** currently collecting data:\n\n" +
             "1. **Periodic Labour Force Survey (PLFS) Q2 2026** (Code: `S-2026-PLFS`) — **Active** | Responses: 48,200\n" +
             "2. **Household Consumer Expenditure Survey (HCES) 2026** (Code: `S-2026-HCES`) — **Active** | Responses: 32,800\n" +
             "3. **Annual Survey of Industries (ASI) 2026** (Code: `S-2026-ASI`) — **Active** | Responses: 24,500\n" +
             "4. **Household Social Consumption: Health Survey** (Code: `S-2026-HLTH`) — **Active** | Responses: 18,700\n" +
             "5. **Digital Literacy Survey** (Code: `S-2026-DLIT`) — **Active** | Responses: 11,300\n" +
             "6. **Annual Survey of Unincorporated Sector Enterprises (ASUSE)** (Code: `S-2026-ASUSE`) — **Active**\n" +
             "7. **Time Use Survey (TUS)** (Code: `S-2026-TUS`) — **Active**\n" +
             "8. **Domestic Tourism Expenditure Survey (DTES)** (Code: `S-2026-DTES`) — **Active**\n" +
             "9. **National Household Travel Survey** (Code: `S-2026-TTRA`) — **Active**\n" +
             "10. **Agricultural Land & Holdings Survey** (Code: `S-2026-AGRI`) — **Active**\n\n" +
             "All 10 surveys are fully synchronized with the central MoSPI database and collecting real-time paradata.";
    }
  }

  if (hasKeyword("response") || hasKeyword("responses") || hasKeyword("collected")) {
    if (hasKeyword("how") || hasKeyword("count") || hasKeyword("number") || hasKeyword("total")) {
      return "Currently, **186,450 responses** have been collected across all active MoSPI surveys in the system. The primary breakdown includes:\n- **PLFS**: 48,200\n- **HCES**: 32,800\n- **ASI**: 24,500\n\nYou can explore detailed live collection metrics in the AI Insights Panel.";
    }
  }

  // 5. Topic Questions
  if (hasKeyword("health") || hasKeyword("medical")) {
    return "Here are the top 5 essential questions for a **Household Health Survey**:\n\n1. What is the age and gender of the household member?\n2. What is your general health status? (Excellent to Poor)\n3. Have you had any overnight hospitalizations in the past 365 days?\n4. What is the primary source of healthcare for the household? (Public, Private, Charitable)\n5. What was the total out-of-pocket expenditure on medicines and consultations in the past 30 days?\n\nFor proper relatable data and baseline questionnaires, check out [Google Scholar: Household Health Survey Questionnaire](https://scholar.google.com/scholar?q=household+health+survey+questionnaire) or the [WHO Health Surveys page](https://www.who.int/data/data-collection-tools/health-facility-assessments).";
  }

  if (hasKeyword("employ") || hasKeyword("job") || hasKeyword("labor") || hasKeyword("labour") || hasKeyword("work")) {
    return "Here are the top 5 essential questions for an **Employment & Labour Force Survey**:\n\n1. What was your principal activity status over the past 365 days?\n2. What was your activity status in the last 7 days? (Current Weekly Status)\n3. What is the primary industry (NIC-2008 code) of your workplace?\n4. What is your primary occupation (NCO-2015 code)?\n5. What are your usual monthly earnings from this principal activity?\n\nFor proper relatable data, view official ILO frameworks via [Google Scholar: Labour Force Survey Questionnaire](https://scholar.google.com/scholar?q=labour+force+survey+questionnaire+methodology) or the [ILO LFS Resources](https://ilostat.ilo.org/resources/lfs/).";
  }

  if (hasKeyword("agri") || hasKeyword("farm") || hasKeyword("land") || hasKeyword("holding") || hasKeyword("crop")) {
    return "Here are the top 5 essential questions for an **Agricultural & Land Holding Survey**:\n\n1. What is the total agricultural land area owned (in Hectares)?\n2. What is the primary source of irrigation for your cultivated land?\n3. Which major crops were cultivated during the last Kharif and Rabi seasons?\n4. What were the total expenses on inputs like seeds, fertilizers, and labor?\n5. How many heads of cattle and other livestock does the household currently own?\n\nFor proper relatable data and research, explore [Google Scholar: Agricultural Survey Methodologies](https://scholar.google.com/scholar?q=agricultural+survey+methodology+questionnaire) or standard questionnaires on the [FAO Agricultural Census page](https://www.fao.org/world-census-agriculture/en/).";
  }

  if (hasKeyword("education") || hasKeyword("school") || hasKeyword("student") || hasKeyword("literacy")) {
    return "Here are the top 10 essential questions for an **Education & Literacy Survey**:\n\n" +
           "1. What is the age and gender of the household member?\n" +
           "2. Can the member read and write with understanding in at least one language? (Literacy Status)\n" +
           "3. What is the highest level of education successfully completed?\n" +
           "4. Is the member currently attending any formal educational institution?\n" +
           "5. What type of institution is the member currently attending? (Government, Private Aided, Private Unaided)\n" +
           "6. What is the current course or level of enrollment?\n" +
           "7. What is the distance to the nearest primary/secondary school?\n" +
           "8. What was the total expenditure on education (tuition, books, transport) during the current academic year?\n" +
           "9. Has the member ever dropped out or discontinued their education? If yes, what was the primary reason?\n" +
           "10. Is the member receiving any scholarship, stipend, or free textbook assistance?\n\n" +
           "For proper relatable data, check out [Google Scholar: Education Survey Questionnaire](https://scholar.google.com/scholar?q=education+survey+questionnaire) or [UNESCO UIS Education Data](https://uis.unesco.org/).";
  }

  // 6. Best Practices & Guidelines
  if (hasKeyword("best") || hasKeyword("practice") || hasKeyword("practices") || hasKeyword("design") || hasKeyword("rule") || hasKeyword("tips") || hasKeyword("remember") || hasKeyword("points")) {
    return "### MoSPI Survey Design Best Practices:\n\n1. **Standard Classifications**: Always use standard national directories (NIC-2008 for industries, NCO-2015 for occupations, LGD codes for geography) to ensure comparability.\n2. **Strict Validation Constraints**: Apply robust logical limits (e.g., Age 0-120, Income >= 0) to catch field data entry errors instantly.\n3. **Skip Logic**: Utilize branching paths so respondents only answer relevant sections, reducing overall survey fatigue.\n4. **Pilot Testing**: Run a mock collection phase to verify all constraints before finalizing deployment.";
  }

  // 7. General Statistics & Portal Concepts
  if (hasKeyword("nso")) {
    return "The **National Statistical Office (NSO)** is the unified statistical wing of the Ministry of Statistics and Programme Implementation (MoSPI), Government of India, formed by merging the CSO and NSSO:\n\n" +
           "- **Field Operations Division (FOD)**: Operates a network of regional and sub-regional offices across the country to conduct physical field audits.\n" +
           "- **Survey Design and Research Division (SDRD)**: Standardizes concepts, designs sampling methodologies, and drafts statistical survey schedules.\n" +
           "- **Data Processing Division (DPD)**: Manages data validation, processing, tabulation, and generates official data releases.\n" +
           "- **Official Organisation**: View divisions and nodal contacts on [MoSPI NSO Portal](https://www.mospi.gov.in/national-statistical-office-nso).";
  }
  if (hasKeyword("sampling") || hasKeyword("stratified") || hasKeyword("sample")) {
    return "MoSPI surveys rely on **Stratified Multi-Stage Random Sampling** to guarantee geographic and socioeconomic representation:\n\n" +
           "- **First Stage Units (FSUs)**: The primary sampling units, consisting of villages (rural) and Urban Frame Survey (UFS) blocks (urban).\n" +
           "- **Ultimate Stage Units (USUs)**: Households selected systematically from a complete listing of all dwellings within the selected FSUs.\n" +
           "- **Stratification**: Strata are constructed within each district (rural and urban separately) to capture spatial and demographic variation.\n" +
           "- **Method of Selection**: FSUs are selected with Probability Proportional to Size (PPS), and USUs are chosen via Linear Systematic Sampling.\n" +
           "- **Official Sampling Manuals**: Visit the [NSO Survey Design & Research Division](https://www.mospi.gov.in/national-statistical-office-nso).";
  }
  if (hasKeyword("cpi") || hasKeyword("price") || hasKeyword("inflation")) {
    return "The **Consumer Price Index (CPI)** measures changes in the price level of a basket of consumer goods and services purchased by households:\n\n" +
           "- **Publishing Agency**: Released monthly by the National Statistical Office (NSO).\n" +
           "- **Categories**: Subdivided into Rural, Urban, and Combined indices.\n" +
           "- **Base Year**: Calculated using 2012 as the base reference.\n" +
           "- **Official CPI Reports**: Access direct press releases and indices on the [MoSPI CPI Portal](https://www.mospi.gov.in/cpi).";
  }
  if (hasKeyword("iip") || hasKeyword("production") || hasKeyword("index")) {
    return "The **Index of Industrial Production (IIP)** is a key economic indicator tracking industrial sector activity in India:\n\n" +
           "- **Publishing Agency**: Released monthly by the National Statistical Office (NSO).\n" +
           "- **Scope**: Measures volume changes in output across Manufacturing, Mining, and Electricity sectors.\n" +
           "- **Official Data**: Access monthly releases on the [MoSPI IIP Publications](https://www.mospi.gov.in/publication/index-industrial-production).";
  }
  if (hasKeyword("gdp") || hasKeyword("gva") || hasKeyword("growth")) {
    return "The NSO compiles and publishes estimates of **Gross Domestic Product (GDP)** and **Gross Value Added (GVA)**:\n\n" +
           "- **Reporting**: Released quarterly and annually at current and constant prices.\n" +
           "- **Compilation**: Handled by the National Accounts Division (NAD) under the NSO.\n" +
           "- **Official GDP Bulletins**: Find quarterly GDP press notes and annual accounts at [MoSPI National Accounts Statistics](https://www.mospi.gov.in/national-statistical-office-nso).";
  }
  if (hasKeyword("mplad") || hasKeyword("mplads")) {
    return "The **Member of Parliament Local Area Development Scheme (MPLADS)** is a central sector scheme administered by MoSPI:\n\n" +
           "- **Goal**: Enables MPs to recommend developmental works of local need in their constituencies (Rs. 5 Crore annually).\n" +
           "- **Areas**: Focuses on infrastructure, health, sanitation, drinking water, and education.\n" +
           "- **Official Guidelines**: Access rules, fund disbursement, and monitoring audits at [MoSPI MPLADS Portal](https://www.mospi.gov.in/mplads).";
  }

  // 8. Quality, Validation & Flags
  if (hasKeyword("validate") || hasKeyword("validation") || hasKeyword("check") || hasKeyword("quality")) {
    return "Data quality in SurveyOS is maintained using a multi-tiered **Statistical Validation Architecture**:\n\n" +
           "1. **Survey Builder Clearance**: Enforces category-level quality thresholds (e.g. minimum questions, sections) and mandatory metadata mappings (NIC/NCO variables) before a survey draft can be published.\n" +
           "2. **Real-time Question Constraints**: The client-side survey engine enforces numeric ranges (e.g., Age 0-120), text regex, and choice limits during data entry.\n" +
           "3. **Paradata Verification**: Automatically checks GPS boundaries (to confirm enumerator is inside the assigned FSU), completion speed (speeding alerts for completion < 90s), and device identity.\n" +
           "4. **Supervisory Quality Flags**: Identifies outliers, duplicates, and missing variables, sending them to the Supervisor Validation Queue for approval, rejection, or re-survey request.";
  }
  if (hasKeyword("flag") || hasKeyword("flags") || hasKeyword("reject") || hasKeyword("audit")) {
    return "**Quality Flags** are automatic alerts raised when:\n\n- A survey was completed suspiciously fast (< 2 minutes)\n- A voice transcript contains incoherent text\n- A numeric answer is far outside the expected range\n\nSupervisors review flagged submissions in the **Validation Queue** — they can approve, reject, or request a re-survey from the citizen.";
  }

  // 9. Deployment Channels
  if (hasKeyword("sms") || hasKeyword("twilio") || hasKeyword("whatsapp") || hasKeyword("channel") || hasKeyword("notification") || hasKeyword("deploy") || hasKeyword("publish")) {
    return "The **Deployment Center** supports 4 delivery channels:\n\n1. **SMS** — via Textbelt (free/key) or Twilio API\n2. **WhatsApp** — click-to-chat web link (no API key needed)\n3. **IVR Voice Call** — automated call to citizen's phone\n4. **Browser Push Notification** — desktop alert\n\nTo test delivery: scroll to the **Real-time SMS Integration** section, enter your mobile number, select a channel, and click Send.";
  }

  // 10. Users & Roles
  if (hasKeyword("role") || hasKeyword("roles") || hasKeyword("permission") || hasKeyword("user") || hasKeyword("users") || hasKeyword("login") || hasKeyword("access")) {
    return "The portal has **4 roles**:\n\n1. **Nodal Officer (Admin)** — Creates surveys, deploys channels, views insights, manages accounts\n2. **Supervisor** — Reviews flagged responses, manages audit logs, validates data\n3. **Field Enumerator** — Conducts surveys in the field with offline mode\n4. **Citizen** — Takes voice surveys and earns Digital India rewards";
  }
  if (hasKeyword("enumerator") || hasKeyword("field") || hasKeyword("investigator") || hasKeyword("staff")) {
    return "There are **4,850 Active Field Enumerators** currently deployed today (with **+124 deployed today**). They record real-time socio-economic and demographic responses, synchronized through offline mode and local storage caches.";
  }

  // 11. Platform Features & Pages
  if (hasKeyword("voice") || hasKeyword("speech") || hasKeyword("mic") || hasKeyword("speak") || hasKeyword("listen") || hasKeyword("hindi")) {
    return "The **Voice Survey Engine** uses your browser's Web Speech API:\n\n- Click the **Listen** icon to hear the question read aloud.\n- Click the **Mic** icon to dictate your answer in English or Hindi.\n- If the system mishears a word, you can tap the text area and correct it manually.\n- Switch languages using the toggle at the top of the survey card.";
  }
  if (hasKeyword("insight") || hasKeyword("insights") || hasKeyword("anomaly") || hasKeyword("anomalies") || hasKeyword("outlier") || hasKeyword("trend") || hasKeyword("regression") || hasKeyword("analysis")) {
    return "The **AI Insights Panel** runs automated analysis across all survey data:\n\n- Detects **anomalies** (e.g. responses submitted in under 2 minutes)\n- Flags **outlier values** in numeric fields\n- Extracts **citizen sentiment** from voice transcripts\n- Runs **multi-variable regression** on demographic data\n\nKey finding: South Zone response rates are **18% above the national average**.";
  }
  if (hasKeyword("offline") || hasKeyword("sync") || hasKeyword("internet") || hasKeyword("cache")) {
    return "**Offline Mode** is fully supported for Field Enumerators:\n\n- Survey forms are cached in local browser storage (IndexedDB).\n- All responses recorded offline are stored locally.\n- Once internet is restored, click **Sync Local Cache** on the Enumerator Dashboard to push all pending answers to the central server.";
  }
  if (hasKeyword("map") || hasKeyword("geographic") || hasKeyword("state")) {
    return "The **India Map** on the Dashboard is an interactive SVG visualization showing:\n\n- State-by-state response density (darker = more responses)\n- Hover over any state to see total responses and percentage\n- Structured per official survey specifications.";
  }
  if (hasKeyword("reward") || hasKeyword("rewards") || hasKeyword("points") || hasKeyword("receipt") || hasKeyword("pdf") || hasKeyword("benefit")) {
    return "Citizens earn **Digital India Reward Points** for completing surveys. These are redeemable for utility bill discounts and government service credits.\n\nAfter submitting, citizens can download an official **PDF Receipt** with a tamper-proof hash signature as proof of participation.";
  }
  if (hasKeyword("registry") || hasKeyword("version") || hasKeyword("schema") || hasKeyword("versions")) {
    return "The **Survey Registry** is MoSPI's master database of all survey schemas.\n\n- Published surveys are **read-only** to ensure data integrity.\n- To make changes, create a **new version** (e.g. v1.2) in the AI Survey Builder.\n- Draft versions can be edited freely before being deployed.";
  }
  if (hasKeyword("field") || hasKeyword("fields") || hasKeyword("question") || hasKeyword("questions") || hasKeyword("type") || hasKeyword("types")) {
    return "The AI Survey Builder supports **11 Question Types** for data collection:\n\n" +
           "1. **Text Inputs**: Short Text, Long Text\n" +
           "2. **Numeric**: Number (with strict min/max validation)\n" +
           "3. **Choice**: Single Select, Multi Select, Dropdown\n" +
           "4. **Media/Sensors**: GPS Location, Image Upload, Audio Response\n" +
           "5. **Complex**: Date, Matrix Question\n\n" +
           "All fields support skip logic branching and real-time validation constraints.";
  }
  if (hasKeyword("builder") || hasKeyword("template")) {
    return "In the **AI Survey Builder**:\n\n1. Type a natural language prompt (e.g. 'A rural health survey on immunization rates')\n2. Select the target language (English / Hindi / other)\n3. Click **Generate** — the AI produces structured questions automatically\n4. Edit, rearrange, or delete questions manually\n5. Save to the **Survey Registry** to deploy";
  }
  if (hasKeyword("mospi") || hasKeyword("ministry") || hasKeyword("about") || hasKeyword("portal")) {
    return "This is the **MoSPI Digital India Survey Portal** — built for the Ministry of Statistics and Programme Implementation, Government of India.\n\n" +
           "It digitizes national census operations with AI-generated survey forms, multi-language voice input, and automated quality scoring.\n\n" +
           "Visit the official website at [mospi.gov.in](https://www.mospi.gov.in) to explore their directory of services.";
  }
  if (hasKeyword("link") || hasKeyword("questionnaire") || hasKeyword("volume") || hasKeyword("schedule") || hasKeyword("download")) {
    return "Official MoSPI Questionnaires (commonly referred to as **Schedules** or **Volume II**) are published directly on the national database.\n\n" +
           "You can download the full volume of survey schedules, including PLFS and HCES instruments, from the official archive:\n" +
           "[MoSPI Survey Questionnaires & Schedules Volume](https://www.mospi.gov.in/web/mospi/download-reports)";
  }

  // General fallback
  return `I'm sorry, I couldn't find a specific answer for that. Please try asking a MoSPI survey-related question.`;
};

export default function FloatingChatbot() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reinitialize welcome message on route change
  useEffect(() => {
    const welcomeMsg: Message = {
      id: "welcome-" + Date.now(),
      sender: "bot",
      text: `Namaskar! I am your **MOSPI ASSISTANT**. You are on the **${getPageName(currentPath)}**. How can I help you today?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
  }, [currentPath]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isMinimized, isTyping]);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-IN";
    rec.onstart = () => setIsListening(true);
    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) setInputText((prev) => (prev ? prev + " " + transcript : transcript));
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;

    return () => recognitionRef.current?.abort();
  }, []);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  const toggleSpeechInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      if (window.speechSynthesis) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); }
      try { recognitionRef.current.start(); } catch (e) { console.error(e); }
    }
  };

  const speakMessage = (id: string, text: string) => {
    if (!window.speechSynthesis) return;
    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Focus input after sending
    setTimeout(() => inputRef.current?.focus(), 0);

    setTimeout(() => {
      const responseText = matchResponse(text, currentPath);
      
      const isFallback = responseText.startsWith("I'm sorry, I couldn't find a specific answer");

      if (isFallback) {
        // Attempt web search via Wikipedia API to find the answer live
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(text)}&format=json&origin=*`;
        
        fetch(searchUrl)
          .then(res => res.json())
          .then(searchData => {
            const results = searchData?.query?.search;
            if (results && results.length > 0) {
              const topResult = results[0];
              const title = topResult.title;
              const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
              
              return fetch(summaryUrl)
                .then(res => res.json())
                .then(summaryData => {
                  let botText = "";
                  if (summaryData && summaryData.extract) {
                    botText = `🌐 **Live Search (Wikipedia):**\n\n${summaryData.extract}\n\nRead more: [${title}](${summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`})`;
                  } else {
                    const snippetClean = topResult.snippet.replace(/<span class="searchmatch">/g, "").replace(/<\/span>/g, "");
                    botText = `🌐 **Live Search (Wikipedia snippet):**\n\n... ${snippetClean} ...\n\nRead more: [${title}](https://en.wikipedia.org/wiki/${encodeURIComponent(title)})`;
                  }
                  
                  const botMsg: Message = {
                    id: "b-" + Date.now(),
                    sender: "bot",
                    text: botText,
                    timestamp: new Date(),
                  };
                  setIsTyping(false);
                  setMessages((prev) => [...prev, botMsg]);
                });
            } else {
              throw new Error("No results found on Wikipedia");
            }
          })
          .catch(err => {
            console.error("Wikipedia search failed:", err);
            // Fallback to local response if network/search fails
            const botMsg: Message = {
              id: "b-" + Date.now(),
              sender: "bot",
              text: responseText,
              timestamp: new Date(),
            };
            setIsTyping(false);
            setMessages((prev) => [...prev, botMsg]);
          });
      } else {
        // Return local predefined response immediately
        const botMsg: Message = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: responseText,
          timestamp: new Date(),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
      }
    }, 700);
  };

  const resetChat = () => {
    if (window.speechSynthesis) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); }
    setIsTyping(false);
    const welcomeMsg: Message = {
      id: "welcome-" + Date.now(),
      sender: "bot",
      text: `Chat reset. I am ready! Ask me anything about the **${getPageName(currentPath)}**.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  };

  const suggestions = getSuggestions(currentPath);

  // Render bold text from **word** and link elements from [anchor](url) patterns
  const renderText = (text: string) => {
    return text.split("\n").map((line, lineIdx) => {
      const tokens: React.ReactNode[] = [];
      let remaining = line;
      let keyCounter = 0;

      while (remaining.length > 0) {
        const boldIndex = remaining.indexOf("**");
        const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const linkIndex = linkMatch ? remaining.indexOf(linkMatch[0]) : -1;

        if (boldIndex === -1 && linkIndex === -1) {
          tokens.push(remaining);
          break;
        }

        if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
          if (boldIndex > 0) {
            tokens.push(remaining.substring(0, boldIndex));
          }
          const closingBoldIndex = remaining.indexOf("**", boldIndex + 2);
          if (closingBoldIndex !== -1) {
            const boldText = remaining.substring(boldIndex + 2, closingBoldIndex);
            tokens.push(
              <strong key={`b-${lineIdx}-${keyCounter++}`} className="font-extrabold text-[#003366]">
                {boldText}
              </strong>
            );
            remaining = remaining.substring(closingBoldIndex + 2);
          } else {
            tokens.push(remaining.substring(boldIndex));
            break;
          }
        } else {
          const matchStr = linkMatch![0];
          const linkText = linkMatch![1];
          const linkUrl = linkMatch![2];

          if (linkIndex > 0) {
            tokens.push(remaining.substring(0, linkIndex));
          }

          tokens.push(
            <a
              key={`l-${lineIdx}-${keyCounter++}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-[#1E3A8A] hover:underline font-bold transition-colors"
            >
              {linkText}
            </a>
          );
          remaining = remaining.substring(linkIndex + matchStr.length);
        }
      }

      return (
        <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
          {tokens}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      {!isOpen && (
        <button
          id="chatbot-fab"
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#003366] to-[#1E3A8A] text-white shadow-lg shadow-blue-900/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 group"
          title="Open MOSPI ASSISTANT"
        >
          <div className="absolute inset-0 rounded-full bg-[#1E3A8A] opacity-30 group-hover:animate-ping" />
          <MessageSquare className="h-6 w-6 relative z-10" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white" />
          </span>
        </button>
      )}

      {/* ── Chatbot Window ── */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-[999] flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all duration-300 ease-out overflow-hidden ${
            isMinimized ? "h-14 w-72" : "h-[520px] w-96 max-h-[calc(100vh-100px)] max-w-[calc(100vw-32px)]"
          }`}
          style={{ boxShadow: "0 20px 40px -15px rgba(0,51,102,0.28)" }}
        >
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between bg-gradient-to-r from-[#003366] to-[#1E3A8A] px-4 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="h-4 w-4 text-blue-200" />
                </div>
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-[#003366]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold tracking-wider leading-none">MOSPI ASSISTANT</h3>
                <span className="text-[10px] text-blue-200/90 font-medium">AI Support Online</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={resetChat} className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors" title="Reset Chat">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <ChevronUp className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (window.speechSynthesis) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); }
                }}
                className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Context strip */}
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border-b border-slate-100 px-3 py-1.5">
                <Info className="h-3 w-3 text-blue-600" />
                <span className="text-[11px] text-slate-500 font-medium">Context:</span>
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] text-[#003366] font-bold">
                  {getPageName(currentPath)}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold ${
                        msg.sender === "user" ? "bg-slate-200 text-slate-600" : "bg-[#003366] text-white"
                      }`}
                    >
                      {msg.sender === "user" ? "ME" : "AI"}
                    </div>

                    <div className={`flex flex-col gap-0.5 ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[78%]`}>
                      <div
                        className={`relative group rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                          msg.sender === "user"
                            ? "bg-[#1E3A8A] text-white rounded-br-none"
                            : "bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-none"
                        }`}
                      >
                        {renderText(msg.text)}

                        {/* TTS button for bot messages */}
                        {msg.sender === "bot" && (
                          <button
                            onClick={() => speakMessage(msg.id, msg.text)}
                            className="absolute -right-7 top-1 p-1 rounded bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity"
                            title={speakingMsgId === msg.id ? "Stop" : "Read aloud"}
                          >
                            {speakingMsgId === msg.id
                              ? <VolumeX className="h-3 w-3 text-red-500 animate-pulse" />
                              : <Volume2 className="h-3 w-3" />
                            }
                          </button>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#003366] text-[9px] font-extrabold text-white">AI</div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#003366] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#003366] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#003366] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion chips */}
              {suggestions.length > 0 && (
                <div className="shrink-0 px-3 py-2 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1 px-0.5">
                    <HelpCircle className="h-3 w-3" />
                    <span>Quick Ask</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="shrink-0 rounded-full border border-blue-100 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 text-[11px] font-medium text-[#003366] transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input row */}
              <div className="shrink-0 border-t border-slate-200 bg-white p-3">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      id="chatbot-input"
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder={isListening ? "Listening… speak now" : "Ask MOSPI ASSISTANT…"}
                      disabled={isListening}
                      autoComplete="off"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-10 text-xs text-slate-800 placeholder-slate-400 focus:border-[#1E3A8A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A8A] disabled:opacity-60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={toggleSpeechInput}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                        isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      }`}
                      title={isListening ? "Stop listening" : "Voice input"}
                    >
                      {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003366] text-white shadow hover:bg-[#1E3A8A] transition-all hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:scale-100"
                    title="Send"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
