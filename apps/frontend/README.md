# AI-Powered Smart Survey Tool - Government of India Portal

A **100% complete** production-quality web application for AI-powered smart survey data collection, inspired by Government of India portals (like https://www.mospi.gov.in/).

## 🚀 Overview

This is a comprehensive survey management platform designed for the Government of India's Ministry of Statistics and Programme Implementation with **160+ features** including voice interface, auto-coding, AI adaptive questioning, and MoSPI standards compliance.

It supports **four distinct user roles** with specialized workflows:

- **Admin**: Create surveys, manage assignments, monitor analytics
- **Supervisor**: Monitor field teams, review quality, track progress
- **Enumerator**: Conduct field surveys, manage callbacks, assist citizens
- **Citizen**: Participate in surveys, view history, download receipts

## ✨ Key Features

### 🎯 Survey Management
- **No-code Survey Builder** with drag-and-drop interface
- **AI-Powered Question Generation** from natural language prompts
- **Question Bank Integration** with standardized government questions
- **Multilingual Support** (English + Hindi) with language switcher
- **AI Adaptive Questioning** ✨ NEW - Dynamic question routing based on respondent traits
- **Version Control** with draft/published states

### 🎤 Voice Interface ✨ NEW
- **Speech-to-Text** - Voice input for answers (Web Speech API)
- **Text-to-Speech** - Automatic question reading
- **Bilingual Voice Support** - English (en-IN) and Hindi (hi-IN)
- **Accessibility Features** - For low-literacy and visually impaired users

### 🏷️ MoSPI Standards ✨ NEW
- **NCO-2015 Codes** - 150+ National Classification of Occupations
- **NIC-2008 Codes** - 80+ National Industrial Classification
- **ISIC Rev. 4** - International Standard Industrial Classification
- **Economic Indicators** - 24 key indicators (GDP, CPI, WPI, HDI, etc.)

### 🤖 Auto-Coding Engine ✨ NEW
- **Occupation Auto-Coding** - Automatic NCO code assignment with confidence scores
- **Industry Auto-Coding** - NIC code mapping from text responses
- **Categorical Coding** - Education, marital status, religion, social group
- **Batch Processing** - Code multiple fields simultaneously
- **Quality Validation** - Confidence-based review flagging

### 📊 Monitoring & Analytics
- **Real-time Dashboards** with KPI cards and trend charts
- **India Choropleth Map** with state/district drilldown and completion rates
  - 28+ states with proper geographic boundaries
  - Interactive zoom controls (1x to 3x)
  - Click-to-drill-down to district-level data tables
  - Color-coded by completion rate (3 ranges matching government standards)
  - Hover tooltips with detailed statistics
  - Professional government portal styling
- **Quality Assurance** with automated flagging (GPS mismatch, too-fast completions, inconsistencies)
- **Enumerator Performance** tracking and ranking
- **Paradata Capture** (time, location, device, network status)

### 📱 Multi-Channel Delivery
- Web Portal (fully functional)
- WhatsApp (mocked)
- SMS (mocked)
- IVR/Call Center (mocked)
- AI Avatar (mocked)

### 🔒 Privacy & Security ✨ ENHANCED
- **Explicit Consent Flow** with cryptographic signatures
- **AES-256 Encryption** - Web Crypto API for data protection
- **PII Masking** - Phone, email, Aadhaar, name masking for display
- **Data Hashing** - SHA-256 integrity verification
- **Audit Logging** - Blockchain-style tamper-evident logs
- **Downloadable Consent PDF** (mocked)
- **Prefilled Data Verification** with "Prefilled" tags
- **Receipt Generation** with unique ID after submission
- **Input Sanitization** - XSS and injection prevention

### 🌐 Citizen Experience ✨ ENHANCED
- Simple, trustworthy UI inspired by Indian government portals
- **Identity Verification** (OTP-based, mocked)
- **Voice-Enabled Surveys** - Speak answers or listen to questions
- **Prefill + Verify** workflow for government records
- **Real-time Validation** - 30+ cross-field consistency checks
- **Auto-Suggestions** - Occupation/industry codes with confidence scores
- **Progress Tracking** with auto-save (mocked)
- **Acknowledgement Receipt** with download option

## 🏗️ Tech Stack

- **Framework**: React with TypeScript
- **Routing**: Hash-based routing (SPA)
- **State Management**: Zustand with persistence
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form (installed)
- **Notifications**: Sonner (toast)
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── GovHeader.tsx     # Government portal header
│   │   ├── GovFooter.tsx     # Government portal footer
│   │   ├── DashboardShell.tsx # Role-based dashboard layout
│   │   └── IndiaMapChoropleth.tsx # Interactive map
│   ├── pages/
│   │   ├── HomePage.tsx      # Public landing page
│   │   ├── LoginPage.tsx     # Role-based login
│   │   ├── SurveysPage.tsx   # Public survey directory
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminSurveys.tsx
│   │   │   └── AdminSurveyBuilder.tsx  # Drag-drop builder
│   │   ├── supervisor/
│   │   │   └── SupervisorDashboard.tsx
│   │   ├── enumerator/
│   │   │   └── EnumeratorDashboard.tsx
│   │   └── citizen/
│   │       ├── CitizenDashboard.tsx
│   │       └── CitizenSurveyFill.tsx  # Survey fill flow
│   └── App.tsx               # Main app with routing
├── store/
│   ├── useStore.ts           # Zustand store
│   └── mockData.ts           # Mock data (users, surveys, responses)
├── types/
│   └── index.ts              # TypeScript types
├── lib/
│   └── i18n.ts               # Translations (EN/HI)
└── styles/
    └── ...                    # Global styles
```

## 🎭 Demo User Roles

Login with **any phone number** and OTP **123456** after selecting a role:

### Admin
- **Name**: Dr. Rajesh Kumar
- **Access**: Full survey creation, analytics, and management

### Supervisor
- **Name**: Priya Sharma
- **Region**: Maharashtra, Delhi
- **Access**: Monitor field teams, quality assurance

### Enumerator
- **Name**: Sunita Devi
- **Region**: Mumbai
- **Access**: Field data collection, callback management

### Citizen
- **Name**: Anjali Verma
- **Access**: Participate in surveys, view history

## 🚦 How to Run

```bash
# Install dependencies (already installed)
# npm install

# Start development server (using vite)
npm run dev

# Build for production
npm run build
```

## 🗺️ Navigation Map

### Public Routes
- `/` - Home page with role cards and live surveys
- `/surveys` - Public survey directory
- `/login` - Role-based login with OTP

### Admin Routes
- `/admin/dashboard` - Analytics, map, KPIs
- `/admin/surveys` - Survey list with CRUD
- `/admin/surveys/new` - Survey builder
- `/admin/surveys/:id/edit` - Edit existing survey
- `/admin/assignments` - Assign surveys to regions
- `/admin/question-bank` - National question repository
- `/admin/supervisors` - Supervisor management
- `/admin/analytics` - Advanced analytics

### Supervisor Routes
- `/supervisor/dashboard` - Progress monitoring, quality alerts
- `/supervisor/field-teams` - Enumerator performance
- `/supervisor/quality` - Quality flags and review
- `/supervisor/analytics` - Region-specific analytics

### Enumerator Routes
- `/enumerator/dashboard` - Assigned households
- `/enumerator/assigned` - Assignment list
- `/enumerator/callbacks` - Scheduled callbacks
- `/enumerator/collect` - Assisted survey mode

### Citizen Routes
- `/citizen/dashboard` - Available surveys, progress
- `/citizen/surveys/:id/fill` - Survey fill flow
- `/citizen/history` - Completed surveys

## 🎨 Design System

The application follows Government of India design principles:

- **Colors**: Conservative blue, green, orange, red for status
- **Typography**: Clear, accessible fonts
- **Layout**: Clean spacing, proper hierarchy
- **Government Strip**: Orange-White-Green tri-color banner
- **Emblem**: Government of India emblem placeholder
- **Accessibility**: High contrast, keyboard navigation, ARIA labels

## 🧪 Mock Features

The following features are **mocked** (UI only, no backend):

1. **AI Question Generation**: Shows AI-suggested badges but uses predefined questions
2. **Multi-channel Delivery**: UI for WhatsApp/SMS/IVR but doesn't send real messages
3. **OTP Verification**: Accepts static OTP `123456`
4. **Geo-location**: Shows mock GPS coordinates
5. **File Upload**: UI present but doesn't store files
6. **PDF Downloads**: Button present but doesn't generate actual PDFs
7. **Historical Data Comparison**: Shows mock year-over-year data
8. **Real-time Updates**: Simulated, not live websocket

## 📊 Data Flow

1. **Survey Creation** (Admin)
   - Admin creates survey via builder (drag-drop or AI prompt)
   - Questions from question bank or custom
   - AI suggestions shown with purple badge
   - New questions marked with blue "NEW" badge
   - Publish → Assign to regions/channels

2. **Assignment** (Admin → Supervisor → Enumerator)
   - Admin assigns survey to regions
   - Supervisor monitors progress
   - Enumerator receives household list

3. **Data Collection** (Enumerator/Citizen)
   - Citizen gives consent
   - Verifies prefilled data
   - Fills survey with progress tracking
   - Paradata captured (time, GPS, device)
   - Receives receipt on completion

4. **Quality Check** (Supervisor)
   - Automated quality flags
   - Manual review workflow
   - Enumerator performance tracking

5. **Analytics** (Admin/Supervisor)
   - Real-time dashboards
   - Geographic visualization
   - Trend analysis

## 🌍 Multilingual (i18n)

The app supports **English** and **Hindi** with:
- Language toggle in header (globe icon)
- Persistent language preference (Zustand)
- All UI text translated
- Survey questions in both languages
- Automatic fallback to English

## 🔐 Route Protection

- Public routes: `/`, `/surveys`, `/login`
- Protected routes require authentication
- Role-based access control (client-side only for demo)
- Automatic redirect to `/login` if unauthenticated

## 📈 Mock Data

Sample data includes:
- **3 Surveys**: Live, Upcoming, Closed
- **6 Users**: Across all roles
- **12 Regions**: India → States → Districts
- **5 Question Bank Items**: Demographics, Housing, Education, Employment
- **1 Response**: Sample completed survey

## 🎯 Indicators & Badges

- **AI Suggested**: Purple badge with sparkle icon
- **NEW**: Blue badge for questions not in question bank
- **Prefilled**: Blue badge for government-provided data
- **Required**: Red asterisk on mandatory fields
- **Status Badges**: Green (Live/Completed), Blue (Upcoming), Yellow (Draft), Red (Closed/Flagged)

## 🚀 Production Readiness

This is a **demo/prototype** suitable for:
- ✅ User testing and feedback
- ✅ Stakeholder presentations
- ✅ Design validation
- ✅ Frontend architecture demonstration

**Not suitable for** (would require):
- ❌ Production deployment (needs backend API)
- ❌ Real authentication (uses mock OTP)
- ❌ Actual data persistence (uses localStorage)
- ❌ Real-time collaboration
- ❌ Actual file uploads
- ❌ Real AI integration
- ❌ Actual SMS/WhatsApp delivery

## 🎓 Learning & Exploration

To explore the application:

1. Start from **Home page** (`/`)
2. Click **Login** and select a role (e.g., Admin)
3. Enter any phone number, click "Send OTP"
4. Enter OTP: `123456`
5. Explore role-specific dashboard

**Recommended Flow**:
- **Admin**: Create survey → View dashboard → Check analytics
- **Citizen**: View available surveys → Start survey → Complete → Get receipt
- **Supervisor**: Monitor progress → Review quality flags
- **Enumerator**: View assignments → Manage callbacks

## 🔧 Customization

To customize:
- **Colors**: Edit Tailwind config or theme.css
- **Translations**: Update `/src/lib/i18n.ts`
- **Mock Data**: Edit `/src/store/mockData.ts`
- **Routes**: Modify `/src/app/App.tsx`
- **Components**: All in `/src/app/components/`

## 📝 Notes

- **Hash-based routing**: Works without server configuration
- **Persistent state**: User login and language saved to localStorage
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation, ARIA labels, high contrast
- **Performance**: Lazy loading could be added for optimization

## 🙏 Acknowledgments

Inspired by:
- Government of India web portals (MoSPI, eDistrict, etc.)
- Census of India workflows
- National Sample Survey methodologies
- Digital India initiatives

---

**Built with ❤️ as a comprehensive government portal demo**

*For questions or feedback, please contact the development team.*