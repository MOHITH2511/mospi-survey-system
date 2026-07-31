import type { 
  User, 
  Survey, 
  SurveyResponse, 
  Region, 
  QuestionBankItem,
  SurveyBlock,
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'admin-1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@mospi.gov.in',
    phone: '+91 98765 43210',
    role: 'admin',
    regionCodes: ['IN'],
    lastActive: new Date('2026-02-08T10:30:00'),
  },
  {
    id: 'supervisor-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@mospi.gov.in',
    phone: '+91 98765 43211',
    role: 'supervisor',
    regionCodes: ['MH', 'DL'],
    lastActive: new Date('2026-02-08T09:15:00'),
  },
  {
    id: 'supervisor-2',
    name: 'Amit Patel',
    email: 'amit.patel@mospi.gov.in',
    phone: '+91 98765 43212',
    role: 'supervisor',
    regionCodes: ['GJ', 'RJ'],
    lastActive: new Date('2026-02-08T08:45:00'),
  },
  {
    id: 'enum-1',
    name: 'Sunita Devi',
    email: 'sunita.devi@mospi.gov.in',
    phone: '+91 98765 43213',
    role: 'enumerator',
    regionCodes: ['MH-MUM'],
    lastActive: new Date('2026-02-08T11:00:00'),
  },
  {
    id: 'enum-2',
    name: 'Ramesh Yadav',
    email: 'ramesh.yadav@mospi.gov.in',
    phone: '+91 98765 43214',
    role: 'enumerator',
    regionCodes: ['DL-ND'],
    lastActive: new Date('2026-02-08T10:45:00'),
  },
  {
    id: 'citizen-1',
    name: 'Anjali Verma',
    email: 'anjali.verma@example.com',
    phone: '+91 98765 43215',
    role: 'citizen',
    regionCodes: ['MH-MUM-001'],
  },
];

// Mock Regions (India States and Districts)
export const mockRegions: Region[] = [
  { id: '1', name: 'India', nameHi: 'भारत', code: 'IN', type: 'national', lgdCode: '000' },
  { id: '2', name: 'Maharashtra', nameHi: 'महाराष्ट्र', code: 'MH', type: 'state', parentCode: 'IN', lgdCode: '027' },
  { id: '3', name: 'Delhi', nameHi: 'दिल्ली', code: 'DL', type: 'state', parentCode: 'IN', lgdCode: '007' },
  { id: '4', name: 'Gujarat', nameHi: 'गुजरात', code: 'GJ', type: 'state', parentCode: 'IN', lgdCode: '024' },
  { id: '5', name: 'Rajasthan', nameHi: 'राजस्थान', code: 'RJ', type: 'state', parentCode: 'IN', lgdCode: '008' },
  { id: '6', name: 'Karnataka', nameHi: 'कर्नाटक', code: 'KA', type: 'state', parentCode: 'IN', lgdCode: '029' },
  { id: '7', name: 'Tamil Nadu', nameHi: 'तमिलनाडु', code: 'TN', type: 'state', parentCode: 'IN', lgdCode: '033' },
  { id: '8', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', code: 'UP', type: 'state', parentCode: 'IN', lgdCode: '009' },
  { id: '9', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', code: 'WB', type: 'state', parentCode: 'IN', lgdCode: '019' },
  { id: '10', name: 'Mumbai', nameHi: 'मुंबई', code: 'MH-MUM', type: 'district', parentCode: 'MH', lgdCode: '027-001' },
  { id: '11', name: 'Pune', nameHi: 'पुणे', code: 'MH-PUN', type: 'district', parentCode: 'MH', lgdCode: '027-002' },
  { id: '12', name: 'New Delhi', nameHi: 'नई दिल्ली', code: 'DL-ND', type: 'district', parentCode: 'DL', lgdCode: '007-001' },
];

// Mock Question Bank
export const mockQuestionBank: QuestionBankItem[] = [
  {
    id: 'qb-1',
    category: 'Demographics',
    standardCode: 'DEM-001',
    label: { en: 'What is your age?', hi: 'आपकी आयु क्या है?' },
    type: 'number',
    description: { en: 'Standard age question', hi: 'मानक आयु प्रश्न' },
    usageCount: 245,
    tags: ['demographics', 'standard'],
  },
  {
    id: 'qb-2',
    category: 'Demographics',
    standardCode: 'DEM-002',
    label: { en: 'What is your gender?', hi: 'आपका लिंग क्या है?' },
    type: 'single-choice',
    description: { en: 'Standard gender question', hi: 'मानक लिंग प्रश्न' },
    options: [
      { id: 'opt-1', label: { en: 'Male', hi: 'पुरुष' }, value: 'male' },
      { id: 'opt-2', label: { en: 'Female', hi: 'महिला' }, value: 'female' },
      { id: 'opt-3', label: { en: 'Other', hi: 'अन्य' }, value: 'other' },
    ],
    usageCount: 289,
    tags: ['demographics', 'standard'],
  },
  {
    id: 'qb-3',
    category: 'Housing',
    standardCode: 'HOU-001',
    label: { en: 'Type of dwelling', hi: 'आवास का प्रकार' },
    type: 'single-choice',
    description: { en: 'Type of housing unit', hi: 'आवास इकाई का प्रकार' },
    options: [
      { id: 'opt-4', label: { en: 'Independent House', hi: 'स्वतंत्र मकान' }, value: 'house' },
      { id: 'opt-5', label: { en: 'Apartment', hi: 'अपार्टमेंट' }, value: 'apartment' },
      { id: 'opt-6', label: { en: 'Slum', hi: 'झुग्गी' }, value: 'slum' },
    ],
    usageCount: 156,
    tags: ['housing', 'census'],
  },
  {
    id: 'qb-4',
    category: 'Education',
    standardCode: 'EDU-001',
    label: { en: 'Highest level of education completed', hi: 'शिक्षा का उच्चतम स्तर' },
    type: 'dropdown',
    description: { en: 'Educational attainment', hi: 'शैक्षिक उपलब्धि' },
    options: [
      { id: 'opt-7', label: { en: 'No formal education', hi: 'कोई औपचारिक शिक्षा नहीं' }, value: 'none' },
      { id: 'opt-8', label: { en: 'Primary', hi: 'प्राथमिक' }, value: 'primary' },
      { id: 'opt-9', label: { en: 'Secondary', hi: 'माध्यमिक' }, value: 'secondary' },
      { id: 'opt-10', label: { en: 'Graduate', hi: 'स्नातक' }, value: 'graduate' },
      { id: 'opt-11', label: { en: 'Post-graduate', hi: 'स्नातकोत्तर' }, value: 'postgraduate' },
    ],
    usageCount: 198,
    tags: ['education', 'standard'],
  },
  {
    id: 'qb-5',
    category: 'Employment',
    standardCode: 'EMP-001',
    label: { en: 'Current employment status', hi: 'वर्तमान रोजगार स्थिति' },
    type: 'single-choice',
    description: { en: 'Employment status', hi: 'रोजगार की स्थिति' },
    options: [
      { id: 'opt-12', label: { en: 'Employed', hi: 'नियोजित' }, value: 'employed' },
      { id: 'opt-13', label: { en: 'Self-employed', hi: 'स्व-नियोजित' }, value: 'self-employed' },
      { id: 'opt-14', label: { en: 'Unemployed', hi: 'बेरोजगार' }, value: 'unemployed' },
      { id: 'opt-15', label: { en: 'Student', hi: 'छात्र' }, value: 'student' },
      { id: 'opt-16', label: { en: 'Retired', hi: 'सेवानिवृत्त' }, value: 'retired' },
    ],
    usageCount: 223,
    tags: ['employment', 'labor'],
  },
  {
    id: 'qb-6',
    category: 'Demographics',
    standardCode: 'DEM-003',
    label: { en: 'Marital Status', hi: 'वैवाहिक स्थिति' },
    type: 'single-choice',
    description: { en: 'Current marital status', hi: 'वर्तमान वैवाहिक स्थिति' },
    options: [
      { id: 'opt-17', label: { en: 'Never Married', hi: 'कभी विवाहित नहीं' }, value: 'never-married' },
      { id: 'opt-18', label: { en: 'Currently Married', hi: 'वर्तमान में विवाहित' }, value: 'married' },
      { id: 'opt-19', label: { en: 'Widowed', hi: 'विधवा/विधुर' }, value: 'widowed' },
      { id: 'opt-20', label: { en: 'Divorced/Separated', hi: 'तलाकशुदा/अलग' }, value: 'divorced' },
    ],
    usageCount: 187,
    tags: ['demographics', 'standard'],
  },
  {
    id: 'qb-7',
    category: 'Demographics',
    standardCode: 'DEM-004',
    label: { en: 'Religion', hi: 'धर्म' },
    type: 'single-choice',
    description: { en: 'Religious affiliation', hi: 'धार्मिक संबद्धता' },
    options: [
      { id: 'opt-21', label: { en: 'Hindu', hi: 'हिन्दू' }, value: 'hindu' },
      { id: 'opt-22', label: { en: 'Muslim', hi: 'मुस्लिम' }, value: 'muslim' },
      { id: 'opt-23', label: { en: 'Christian', hi: 'ईसाई' }, value: 'christian' },
      { id: 'opt-24', label: { en: 'Sikh', hi: 'सिख' }, value: 'sikh' },
      { id: 'opt-25', label: { en: 'Buddhist', hi: 'बौद्ध' }, value: 'buddhist' },
      { id: 'opt-26', label: { en: 'Jain', hi: 'जैन' }, value: 'jain' },
      { id: 'opt-27', label: { en: 'Other', hi: 'अन्य' }, value: 'other' },
    ],
    usageCount: 165,
    tags: ['demographics', 'census'],
  },
  {
    id: 'qb-8',
    category: 'Demographics',
    standardCode: 'DEM-005',
    label: { en: 'Social Category', hi: 'सामाजिक श्रेणी' },
    type: 'single-choice',
    description: { en: 'Social group classification', hi: 'सामाजिक समूह वर्गीकरण' },
    options: [
      { id: 'opt-28', label: { en: 'Scheduled Caste (SC)', hi: 'अनुसूचित जाति' }, value: 'sc' },
      { id: 'opt-29', label: { en: 'Scheduled Tribe (ST)', hi: 'अनुसूचित जनजाति' }, value: 'st' },
      { id: 'opt-30', label: { en: 'Other Backward Class (OBC)', hi: 'अन्य पिछड़ा वर्ग' }, value: 'obc' },
      { id: 'opt-31', label: { en: 'General', hi: 'सामान्य' }, value: 'general' },
    ],
    usageCount: 154,
    tags: ['demographics', 'census'],
  },
  {
    id: 'qb-9',
    category: 'Housing',
    standardCode: 'HOU-002',
    label: { en: 'Number of rooms in dwelling', hi: 'आवास में कमरों की संख्या' },
    type: 'number',
    description: { en: 'Total rooms excluding bathroom and kitchen', hi: 'बाथरूम और रसोई को छोड़कर कुल कमरे' },
    usageCount: 142,
    tags: ['housing', 'census'],
  },
  {
    id: 'qb-10',
    category: 'Housing',
    standardCode: 'HOU-003',
    label: { en: 'Source of drinking water', hi: 'पेयजल का स्रोत' },
    type: 'single-choice',
    description: { en: 'Primary source of drinking water', hi: 'पेयजल का प्राथमिक स्रोत' },
    options: [
      { id: 'opt-32', label: { en: 'Piped water (tap)', hi: 'पाइप का पानी (नल)' }, value: 'piped' },
      { id: 'opt-33', label: { en: 'Tube well/Borewell', hi: 'ट्यूबवेल/बोरवेल' }, value: 'tubewell' },
      { id: 'opt-34', label: { en: 'Well', hi: 'कुआं' }, value: 'well' },
      { id: 'opt-35', label: { en: 'River/Canal/Pond', hi: 'नदी/नहर/तालाब' }, value: 'surface' },
      { id: 'opt-36', label: { en: 'Bottled water', hi: 'बोतलबंद पानी' }, value: 'bottled' },
    ],
    usageCount: 138,
    tags: ['housing', 'amenities'],
  },
  {
    id: 'qb-11',
    category: 'Housing',
    standardCode: 'HOU-004',
    label: { en: 'Type of toilet facility', hi: 'शौचालय सुविधा का प्रकार' },
    type: 'single-choice',
    description: { en: 'Toilet facility available', hi: 'उपलब्ध शौचालय सुविधा' },
    options: [
      { id: 'opt-37', label: { en: 'Flush toilet (own)', hi: 'फ्लश शौचालय (अपना)' }, value: 'flush-own' },
      { id: 'opt-38', label: { en: 'Flush toilet (shared)', hi: 'फ्लश शौचालय (साझा)' }, value: 'flush-shared' },
      { id: 'opt-39', label: { en: 'Pit latrine', hi: 'गड्ढे वाला शौचालय' }, value: 'pit' },
      { id: 'opt-40', label: { en: 'No facility', hi: 'कोई सुविधा नहीं' }, value: 'none' },
    ],
    usageCount: 145,
    tags: ['housing', 'sanitation'],
  },
  {
    id: 'qb-12',
    category: 'Employment',
    standardCode: 'EMP-002',
    label: { en: 'Occupation', hi: 'व्यवसाय' },
    type: 'text',
    description: { en: 'Current occupation (NCO-2015 coding available)', hi: 'वर्तमान व्यवसाय (NCO-2015 कोडिंग उपलब्ध)' },
    usageCount: 201,
    tags: ['employment', 'occupation', 'nco'],
  },
  {
    id: 'qb-13',
    category: 'Employment',
    standardCode: 'EMP-003',
    label: { en: 'Industry/Sector of work', hi: 'कार्य का उद्योग/क्षेत्र' },
    type: 'text',
    description: { en: 'Industry sector (NIC-2008 coding available)', hi: 'उद्योग क्षेत्र (NIC-2008 कोडिंग उपलब्ध)' },
    usageCount: 189,
    tags: ['employment', 'industry', 'nic'],
  },
  {
    id: 'qb-14',
    category: 'Employment',
    standardCode: 'EMP-004',
    label: { en: 'Monthly household income', hi: 'मासिक घरेलू आय' },
    type: 'single-choice',
    description: { en: 'Total monthly household income', hi: 'कुल मासिक घरेलू आय' },
    options: [
      { id: 'opt-41', label: { en: 'Less than ₹10,000', hi: '₹10,000 से कम' }, value: 'lt-10k' },
      { id: 'opt-42', label: { en: '₹10,000 - ₹25,000', hi: '₹10,000 - ₹25,000' }, value: '10-25k' },
      { id: 'opt-43', label: { en: '₹25,000 - ₹50,000', hi: '₹25,000 - ₹50,000' }, value: '25-50k' },
      { id: 'opt-44', label: { en: '₹50,000 - ₹1,00,000', hi: '₹50,000 - ₹1,00,000' }, value: '50-100k' },
      { id: 'opt-45', label: { en: 'More than ₹1,00,000', hi: '₹1,00,000 से अधिक' }, value: 'gt-100k' },
    ],
    usageCount: 212,
    tags: ['income', 'economic'],
  },
  {
    id: 'qb-15',
    category: 'Health',
    standardCode: 'HLT-001',
    label: { en: 'Health insurance coverage', hi: 'स्वास्थ्य बीमा कवरेज' },
    type: 'multiple-choice',
    description: { en: 'Type of health insurance (multiple)', hi: 'स्वास्थ्य बीमा का प्रकार (एकाधिक)' },
    options: [
      { id: 'opt-46', label: { en: 'Ayushman Bharat', hi: 'आयुष्मान भारत' }, value: 'ayushman' },
      { id: 'opt-47', label: { en: 'ESIC', hi: 'ईएसआईसी' }, value: 'esic' },
      { id: 'opt-48', label: { en: 'Private insurance', hi: 'निजी बीमा' }, value: 'private' },
      { id: 'opt-49', label: { en: 'No insurance', hi: 'कोई बीमा नहीं' }, value: 'none' },
    ],
    usageCount: 178,
    tags: ['health', 'insurance'],
  },
  {
    id: 'qb-16',
    category: 'Health',
    standardCode: 'HLT-002',
    label: { en: 'Access to healthcare facility', hi: 'स्वास्थ्य सुविधा तक पहुंच' },
    type: 'single-choice',
    description: { en: 'Distance to nearest healthcare center', hi: 'निकटतम स्वास्थ्य केंद्र की दूरी' },
    options: [
      { id: 'opt-50', label: { en: 'Within 1 km', hi: '1 किमी के भीतर' }, value: 'lt-1km' },
      { id: 'opt-51', label: { en: '1-5 km', hi: '1-5 किमी' }, value: '1-5km' },
      { id: 'opt-52', label: { en: '5-10 km', hi: '5-10 किमी' }, value: '5-10km' },
      { id: 'opt-53', label: { en: 'More than 10 km', hi: '10 किमी से अधिक' }, value: 'gt-10km' },
    ],
    usageCount: 156,
    tags: ['health', 'access'],
  },
  {
    id: 'qb-17',
    category: 'Income',
    standardCode: 'INC-001',
    label: { en: 'Sources of household income', hi: 'घरेलू आय के स्रोत' },
    type: 'multiple-choice',
    description: { en: 'All sources contributing to household income', hi: 'घरेलू आय में योगदान करने वाले सभी स्रोत' },
    options: [
      { id: 'opt-54', label: { en: 'Salary/Wages', hi: 'वेतन/मजदूरी' }, value: 'salary' },
      { id: 'opt-55', label: { en: 'Business/Self-employment', hi: 'व्यवसाय/स्वरोजगार' }, value: 'business' },
      { id: 'opt-56', label: { en: 'Agriculture', hi: 'कृषि' }, value: 'agriculture' },
      { id: 'opt-57', label: { en: 'Pension', hi: 'पेंशन' }, value: 'pension' },
      { id: 'opt-58', label: { en: 'Rental income', hi: 'किराया आय' }, value: 'rent' },
      { id: 'opt-59', label: { en: 'Remittances', hi: 'प्रेषण' }, value: 'remittances' },
    ],
    usageCount: 167,
    tags: ['income', 'economic'],
  },
  {
    id: 'qb-18',
    category: 'Education',
    standardCode: 'EDU-002',
    label: { en: 'School enrollment (children 6-18)', hi: 'स्कूल में नामांकन (6-18 वर्ष के बच्चे)' },
    type: 'single-choice',
    description: { en: 'Are all children aged 6-18 enrolled in school?', hi: 'क्या 6-18 वर्ष की आयु के सभी बच्चे स्कूल में नामांकित हैं?' },
    options: [
      { id: 'opt-60', label: { en: 'Yes, all enrolled', hi: 'हां, सभी नामांकित' }, value: 'all' },
      { id: 'opt-61', label: { en: 'Some enrolled', hi: 'कुछ नामांकित' }, value: 'some' },
      { id: 'opt-62', label: { en: 'None enrolled', hi: 'कोई नामांकित नहीं' }, value: 'none' },
      { id: 'opt-63', label: { en: 'No children in this age group', hi: 'इस आयु वर्ग में कोई बच्चे नहीं' }, value: 'na' },
    ],
    usageCount: 143,
    tags: ['education', 'children'],
  },
];

// Mock Survey Blocks
const demographicBlocks: SurveyBlock[] = [
  {
    id: 'block-1',
    type: 'consent',
    label: { en: 'Survey Consent', hi: 'सर्वेक्षण सहमति' },
    helpText: { 
      en: 'Please read and accept the consent to proceed', 
      hi: 'कृपया आगे बढ़ने के लिए सहमति पढ़ें और स्वीकार करें' 
    },
    required: true,
    validations: [
      { type: 'required', message: { en: 'Consent is required', hi: 'सहमति आवश्यक है' } }
    ],
    order: 0,
  },
  {
    id: 'block-2',
    type: 'short-text',
    label: { en: 'Full Name', hi: 'पूरा नाम' },
    helpText: { en: 'Enter your full name as per official records', hi: 'आधिकारिक रिकॉर्ड के अनुसार अपना पूरा नाम दर्ज करें' },
    required: true,
    validations: [
      { type: 'required', message: { en: 'Name is required', hi: 'नाम आवश्यक है' } }
    ],
    questionBankId: 'qb-1',
    order: 1,
  },
  {
    id: 'block-3',
    type: 'number',
    label: { en: 'Age', hi: 'आयु' },
    helpText: { en: 'Your age in completed years', hi: 'पूर्ण वर्षों में आपकी आयु' },
    required: true,
    validations: [
      { type: 'required', message: { en: 'Age is required', hi: 'आयु आवश्यक है' } },
      { type: 'min', value: 0, message: { en: 'Age must be positive', hi: 'आयु सकारात्मक होनी चाहिए' } },
      { type: 'max', value: 120, message: { en: 'Invalid age', hi: 'अमान्य आयु' } },
    ],
    questionBankId: 'qb-1',
    order: 2,
  },
  {
    id: 'block-4',
    type: 'single-choice',
    label: { en: 'Gender', hi: 'लिंग' },
    required: true,
    validations: [
      { type: 'required', message: { en: 'Gender is required', hi: 'लिंग आवश्यक है' } }
    ],
    options: [
      { id: 'g1', label: { en: 'Male', hi: 'पुरुष' }, value: 'male' },
      { id: 'g2', label: { en: 'Female', hi: 'महिला' }, value: 'female' },
      { id: 'g3', label: { en: 'Other', hi: 'अन्य' }, value: 'other' },
    ],
    questionBankId: 'qb-2',
    order: 3,
  },
  {
    id: 'block-5',
    type: 'dropdown',
    label: { en: 'Highest Education Level', hi: 'उच्चतम शिक्षा स्तर' },
    required: true,
    validations: [
      { type: 'required', message: { en: 'Education level is required', hi: 'शिक्षा स्तर आवश्यक है' } }
    ],
    options: [
      { id: 'e1', label: { en: 'No formal education', hi: 'कोई औपचारिक शिक्षा नहीं' }, value: 'none' },
      { id: 'e2', label: { en: 'Primary', hi: 'प्राथमिक' }, value: 'primary' },
      { id: 'e3', label: { en: 'Secondary', hi: 'माध्यमिक' }, value: 'secondary' },
      { id: 'e4', label: { en: 'Graduate', hi: 'स्नातक' }, value: 'graduate' },
      { id: 'e5', label: { en: 'Post-graduate', hi: 'स्नातकोत्तर' }, value: 'postgraduate' },
    ],
    questionBankId: 'qb-4',
    isAISuggested: true,
    order: 4,
  },
];

// Mock Surveys
export const mockSurveys: Survey[] = [
  {
    id: 'survey-1',
    title: { 
      en: 'National Household Survey 2026', 
      hi: 'राष्ट्रीय घरेलू सर्वेक्षण 2026' 
    },
    description: { 
      en: 'Comprehensive household demographic and socio-economic survey',
      hi: 'व्यापक घरेलू जनसांख्यिकीय और सामाजिक-आर्थिक सर्वेक्षण'
    },
    objective: {
      en: 'To collect comprehensive data on household demographics, education, employment, and living conditions across India',
      hi: 'भारत भर में घरेलू जनसांख्यिकी, शिक्षा, रोजगार और रहने की स्थिति पर व्यापक डेटा एकत्र करना'
    },
    status: 'live',
    version: 1,
    createdBy: 'admin-1',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-01'),
    publishedAt: new Date('2026-02-01'),
    blocks: demographicBlocks,
    assignments: [
      {
        id: 'assign-1',
        surveyId: 'survey-1',
        regionCodes: ['MH', 'DL', 'GJ'],
        channels: ['web', 'whatsapp', 'sms'],
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-03-31'),
        reminderFrequency: 7,
        targetResponses: 50000,
      }
    ],
    eligibilityCriteria: {
      en: 'All residents of India aged 18 years and above',
      hi: '18 वर्ष और उससे अधिक आयु के भारत के सभी निवासी'
    },
    faq: [
      {
        question: { en: 'Who should fill this survey?', hi: 'यह सर्वेक्षण किसे भरना चाहिए?' },
        answer: { en: 'Head of household or any adult member (18+) can fill this survey', hi: 'घर के मुखिया या कोई वयस्क सदस्य (18+) यह सर्वेक्षण भर सकता है' }
      },
      {
        question: { en: 'How long will it take?', hi: 'इसमें कितना समय लगेगा?' },
        answer: { en: 'Approximately 15-20 minutes', hi: 'लगभग 15-20 मिनट' }
      },
    ]
  },
  {
    id: 'survey-2',
    title: { 
      en: 'Employment and Labour Force Survey Q1 2026', 
      hi: 'रोजगार और श्रम बल सर्वेक्षण Q1 2026' 
    },
    description: { 
      en: 'Quarterly employment and unemployment statistics',
      hi: 'त्रैमासिक रोजगार और बेरोजगारी सांख्यिकी'
    },
    objective: {
      en: 'To assess current employment status, job search activities, and labor force participation',
      hi: 'वर्तमान रोजगार स्थिति, नौकरी खोज गतिविधियों और श्रम बल भागीदारी का आकलन करना'
    },
    status: 'upcoming',
    version: 1,
    createdBy: 'admin-1',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-25'),
    blocks: [
      {
        id: 'emp-1',
        type: 'single-choice',
        label: { en: 'Current Employment Status', hi: 'वर्तमान रोजगार स्थिति' },
        required: true,
        validations: [
          { type: 'required', message: { en: 'Required', hi: 'आवश्यक' } }
        ],
        options: [
          { id: 'e1', label: { en: 'Employed', hi: 'नियोजित' }, value: 'employed' },
          { id: 'e2', label: { en: 'Unemployed', hi: 'बेरोजगार' }, value: 'unemployed' },
          { id: 'e3', label: { en: 'Self-employed', hi: 'स्व-नियोजित' }, value: 'self-employed' },
        ],
        questionBankId: 'qb-5',
        order: 0,
      }
    ],
    assignments: [
      {
        id: 'assign-2',
        surveyId: 'survey-2',
        regionCodes: ['IN'],
        channels: ['web', 'call', 'ai-avatar'],
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        reminderFrequency: 7,
        targetResponses: 100000,
      }
    ],
  },
  {
    id: 'survey-3',
    title: { 
      en: 'Consumer Price Index Survey', 
      hi: 'उपभोक्ता मूल्य सूचकांक सर्वेक्षण' 
    },
    description: { 
      en: 'Monthly price collection for inflation measurement',
      hi: 'मुद्रास्फीति माप के लिए मासिक मूल्य संग्रह'
    },
    objective: {
      en: 'To collect retail prices of essential commodities for CPI calculation',
      hi: 'सीपीआई गणना के लिए आवश्यक वस्तुओं के खुदरा मूल्य एकत्र करना'
    },
    status: 'closed',
    version: 2,
    createdBy: 'admin-1',
    createdAt: new Date('2025-12-01'),
    updatedAt: new Date('2026-01-01'),
    publishedAt: new Date('2025-12-15'),
    blocks: [],
    assignments: [],
  },
];

// Mock Responses
export const mockResponses: SurveyResponse[] = [
  {
    id: 'resp-1',
    surveyId: 'survey-1',
    userId: 'citizen-1',
    answers: {
      'block-1': true,
      'block-2': 'Anjali Verma',
      'block-3': 32,
      'block-4': 'female',
      'block-5': 'graduate',
    },
    status: 'completed',
    consentGiven: true,
    consentTimestamp: new Date('2026-02-05T10:00:00'),
    startedAt: new Date('2026-02-05T10:00:00'),
    submittedAt: new Date('2026-02-05T10:18:23'),
    paradata: {
      startTime: new Date('2026-02-05T10:00:00'),
      endTime: new Date('2026-02-05T10:18:23'),
      duration: 1103,
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
        accuracy: 10,
      },
      deviceInfo: {
        type: 'mobile',
        os: 'Android 14',
        browser: 'Chrome Mobile',
        deviceId: 'device-001',
      },
      networkStatus: 'online',
      revisionCount: 2,
    },
    qualityFlags: [],
  },
];

// Mock map data for India states - codes match GeoJSON state codes
export const mockMapData = [
  { regionCode: 'MH', regionName: 'Maharashtra', completed: 4523, pending: 1234, completionRate: 78.6 },
  { regionCode: 'DL', regionName: 'Delhi', completed: 3421, pending: 879, completionRate: 79.5 },
  { regionCode: 'GJ', regionName: 'Gujarat', completed: 3890, pending: 1456, completionRate: 72.7 },
  { regionCode: 'RJ', regionName: 'Rajasthan', completed: 2345, pending: 2134, completionRate: 52.3 },
  { regionCode: 'KA', regionName: 'Karnataka', completed: 4012, pending: 998, completionRate: 80.1 },
  { regionCode: 'TN', regionName: 'Tamil Nadu', completed: 4789, pending: 1123, completionRate: 81.0 },
  { regionCode: 'UP', regionName: 'Uttar Pradesh', completed: 5234, pending: 4567, completionRate: 53.4 },
  { regionCode: 'WB', regionName: 'West Bengal', completed: 3678, pending: 1892, completionRate: 66.0 },
  { regionCode: 'MP', regionName: 'Madhya Pradesh', completed: 3456, pending: 2345, completionRate: 59.6 },
  { regionCode: 'AP', regionName: 'Andhra Pradesh', completed: 3234, pending: 1456, completionRate: 68.9 },
  { regionCode: 'TG', regionName: 'Telangana', completed: 2890, pending: 987, completionRate: 74.6 },
  { regionCode: 'BR', regionName: 'Bihar', completed: 2567, pending: 3456, completionRate: 42.6 },
  { regionCode: 'OR', regionName: 'Odisha', completed: 2345, pending: 1678, completionRate: 58.3 },
  { regionCode: 'KL', regionName: 'Kerala', completed: 3567, pending: 876, completionRate: 80.3 },
  { regionCode: 'JH', regionName: 'Jharkhand', completed: 1890, pending: 2134, completionRate: 46.9 },
  { regionCode: 'AS', regionName: 'Assam', completed: 2234, pending: 1567, completionRate: 58.8 },
  { regionCode: 'PB', regionName: 'Punjab', completed: 2456, pending: 1234, completionRate: 66.6 },
  { regionCode: 'CG', regionName: 'Chhattisgarh', completed: 1789, pending: 1456, completionRate: 55.1 },
  { regionCode: 'HR', regionName: 'Haryana', completed: 2678, pending: 987, completionRate: 73.1 },
  { regionCode: 'JK', regionName: 'Jammu and Kashmir', completed: 1567, pending: 1234, completionRate: 55.9 },
  { regionCode: 'UK', regionName: 'Uttarakhand', completed: 1456, pending: 876, completionRate: 62.4 },
  { regionCode: 'HP', regionName: 'Himachal Pradesh', completed: 1234, pending: 678, completionRate: 64.5 },
  { regionCode: 'GA', regionName: 'Goa', completed: 890, pending: 234, completionRate: 79.2 },
  { regionCode: 'TR', regionName: 'Tripura', completed: 678, pending: 456, completionRate: 59.8 },
  { regionCode: 'SK', regionName: 'Sikkim', completed: 567, pending: 345, completionRate: 62.2 },
  { regionCode: 'AR', regionName: 'Arunachal Pradesh', completed: 789, pending: 567, completionRate: 58.2 },
  { regionCode: 'NL', regionName: 'Nagaland', completed: 456, pending: 234, completionRate: 66.1 },
  { regionCode: 'MN', regionName: 'Manipur', completed: 523, pending: 298, completionRate: 63.7 },
  { regionCode: 'MZ', regionName: 'Mizoram', completed: 412, pending: 189, completionRate: 68.5 },
  { regionCode: 'ML', regionName: 'Meghalaya', completed: 678, pending: 412, completionRate: 62.2 },
];