# Testing Guide - AI-Powered Smart Survey Tool

This guide helps you verify all 155+ features are working correctly.

## 🚀 Quick Start

1. Open the application in your browser
2. You should see the Government of India portal homepage
3. The tricolor bar (orange-white-green) should be visible at the top

## ✅ Test Checklist

### 1. Authentication & Login Flow (5 tests)

#### Test 1.1: Login as Admin
```
✓ Click "Login" button on homepage
✓ Should navigate to /login page
✓ Select role: "Admin"
✓ Enter any phone number (e.g., +91 9876543210)
✓ Click "Send OTP"
✓ Toast notification should appear: "OTP sent successfully (Mock: 123456)"
✓ OTP input field should appear
✓ Enter OTP: 123456
✓ Click "Login"
✓ Toast should show: "Welcome, Dr. Rajesh Kumar!"
✓ Should redirect to /admin/dashboard
✓ URL should be: #/admin/dashboard
```

#### Test 1.2: Login Redirect
```
✓ While logged in as Admin, go to homepage (/)
✓ Should immediately redirect to /admin/dashboard
✓ Try accessing /login
✓ Should immediately redirect to /admin/dashboard
```

#### Test 1.3: Logout
```
✓ Click on user profile icon in header
✓ Click "Logout"
✓ Should redirect to homepage (/)
✓ "Login" button should now be visible in header
```

#### Test 1.4: Protected Routes
```
✓ Logout completely
✓ Try accessing #/admin/dashboard directly
✓ Should redirect to /login
✓ Try #/supervisor/dashboard
✓ Should redirect to /login
```

#### Test 1.5: Role-Based Access
```
✓ Login as Citizen
✓ Should redirect to /citizen/dashboard
✓ Login as Supervisor
✓ Should redirect to /supervisor/dashboard
✓ Login as Enumerator
✓ Should redirect to /enumerator/dashboard
```

### 2. India Choropleth Map (10 tests)

#### Test 2.1: Map Display (Admin Dashboard)
```
✓ Login as Admin
✓ View dashboard
✓ India map should be visible
✓ Map should show 28+ states with different colors
✓ Color legend should show 3 ranges:
  - Yellow: < 50%
  - Light Grey: 50-74%
  - Blue: ≥ 75%
```

#### Test 2.2: State Hover Tooltip
```
✓ Hover over Maharashtra (MH) on the map
✓ Tooltip should appear near mouse cursor
✓ Tooltip should show:
  - State name: Maharashtra
  - State code: MH
  - Completion rate: 78.6%
  - Completed count
  - Pending count
  - Flagged count
  - Last updated time
  - "Click to view districts" text
```

#### Test 2.3: Zoom Controls
```
✓ Click the "Zoom In" button (+ icon)
✓ Map should zoom in (states appear larger)
✓ Click "Zoom In" again
✓ Map should zoom in further
✓ Click "Zoom Out" button (- icon)
✓ Map should zoom out
✓ Click "Home" button (house icon)
✓ Map should reset to original view
```

#### Test 2.4: District Drill-Down
```
✓ Click on Maharashtra (MH) on the map
✓ State should highlight with blue border
✓ Map title should change to "Maharashtra - District Level Data"
✓ District table should appear below map showing:
  - Mumbai
  - Pune
  - Nagpur
  - Thane
  - Nashik
✓ Each district should show completion rate with color-coded badge
```

#### Test 2.5: District Data Table
```
✓ After clicking a state, verify district table has columns:
  - District name
  - Completed (green)
  - Pending (orange)
  - Completion Rate (colored badge)
✓ Table should have alternating row colors (white/light grey)
✓ Completion rate badges should match color scheme
```

#### Test 2.6: State Quick Stats Grid
```
✓ Below the map, verify grid of state cards
✓ Should show at least 24 states
✓ Each card should have:
  - Colored circle indicator
  - State code (e.g., MH, DL)
  - Completion percentage
✓ Click on a state card
✓ Should select that state and show districts
```

#### Test 2.7: State Selection Toggle
```
✓ Click on Maharashtra
✓ District table should appear
✓ Click on Maharashtra again
✓ District table should disappear
✓ Should return to state view
```

#### Test 2.8: Multiple States
```
✓ Click on different states (DL, KA, TN, UP, GJ)
✓ Each should show different district data
✓ UP should show 7 districts
✓ DL should show 5 districts
✓ KA should show 5 districts
```

#### Test 2.9: Map Color Coding
```
✓ Verify states are colored by completion rate:
  - TN (81.0%) should be blue
  - KA (80.1%) should be blue
  - MH (78.6%) should be blue
  - WB (66.0%) should be light grey
  - UP (53.4%) should be light grey
  - RJ (52.3%) should be light grey
  - BR (42.6%) should be yellow
```

#### Test 2.10: State Labels
```
✓ At normal zoom, state labels (MH, DL, etc.) should be visible
✓ Labels should be centered on each state
✓ Labels should have white shadow for readability
✓ When zoomed in, labels may disappear or adjust
```

### 3. Survey Builder - Drag & Drop (15 tests)

#### Test 3.1: Access Survey Builder
```
✓ Login as Admin
✓ Click "Surveys" in sidebar
✓ Click "Create New Survey" button
✓ Should navigate to /admin/surveys/new
✓ Builder interface should load
```

#### Test 3.2: Survey Metadata
```
✓ Enter survey title (English): "Test Survey"
✓ Enter survey title (Hindi): "परीक्षण सर्वेक्षण"
✓ Enter description
✓ Enter objective
✓ Verify all fields are editable
```

#### Test 3.3: Question Types Palette
```
✓ Verify "Add Question" section shows buttons for:
  - Short Text
  - Long Text
  - Number
  - Email
  - Phone
  - Single Choice
  - Multi Choice
  - Dropdown
  - Date
  - File Upload
  - Consent
```

#### Test 3.4: Add Question
```
✓ Click "Short Text" button
✓ New question card should appear in the builder
✓ Question should have:
  - Grip handle icon (for dragging)
  - Question text: "New Question"
  - Settings button
  - Duplicate button
  - Delete button
✓ Badge should show "NEW" in blue
```

#### Test 3.5: Drag and Drop
```
✓ Add 3 questions (Short Text, Number, Single Choice)
✓ Click and hold the grip handle on the first question
✓ Drag it below the second question
✓ Release
✓ Question order should change
✓ Verify questions maintain their data
```

#### Test 3.6: Edit Question
```
✓ Click "Settings" icon on a question
✓ Side panel should open
✓ Edit question label (English)
✓ Edit question label (Hindi)
✓ Add help text
✓ Toggle "Required" switch
✓ Changes should reflect in the question card
```

#### Test 3.7: Add Validation
```
✓ Open question settings
✓ Scroll to "Validations" section
✓ Add validation (e.g., Min length for text)
✓ Add validation message (English & Hindi)
✓ Validation should show in settings panel
```

#### Test 3.8: Single Choice Options
```
✓ Add "Single Choice" question
✓ Open settings
✓ Should show option fields
✓ Edit option 1 label: "Option A"
✓ Click "Add Option"
✓ New option field should appear
✓ Add multiple options
✓ Delete an option
✓ Options should update
```

#### Test 3.9: AI Question Generation
```
✓ Scroll to "AI-Powered Generation" tab
✓ Enter prompt: "Generate demographic questions"
✓ Click "Generate Questions"
✓ Toast should show: "AI generated 3 questions"
✓ Questions should appear with purple "AI Suggested" badge
✓ Questions should include:
  - Age question
  - Gender question
  - Education question
```

#### Test 3.10: Question Bank
```
✓ Switch to "Question Bank" tab
✓ Should show list of standardized questions:
  - DEM-001: What is your age?
  - DEM-002: What is your gender?
  - HOU-001: Type of dwelling
  - EDU-001: Highest education level
  - EMP-001: Employment status
✓ Each should show usage count
✓ Click "Use" button on a question
✓ Question should be added to builder
```

#### Test 3.11: Duplicate Question
```
✓ Click "Duplicate" icon on any question
✓ Toast should show: "Question duplicated"
✓ New question should appear with same content
✓ New question should have different ID
```

#### Test 3.12: Delete Question
```
✓ Click "Delete" icon (trash) on any question
✓ Toast should show: "Question deleted"
✓ Question should disappear from builder
✓ Order numbers should adjust
```

#### Test 3.13: Preview Survey
```
✓ Click "Preview" button
✓ Should show modal with survey preview
✓ Questions should appear in order
✓ Should show as they would to respondents
✓ Close preview
```

#### Test 3.14: Save Survey
```
✓ Click "Save Draft" button
✓ Toast should show: "Survey saved as draft"
✓ Survey should be saved to store
```

#### Test 3.15: Publish Survey
```
✓ Click "Publish Survey" button
✓ Confirmation dialog should appear
✓ Click "Confirm"
✓ Toast should show: "Survey published successfully"
✓ Should redirect to /admin/surveys
✓ Survey should appear in list with "Live" badge
```

### 4. Citizen Survey Flow (20 tests)

#### Test 4.1: Start Survey
```
✓ Login as Citizen
✓ Dashboard should show available surveys
✓ Click "Start Survey" on "National Household Survey 2026"
✓ Should navigate to /citizen/surveys/survey-1/fill
```

#### Test 4.2: Consent Step - UI
```
✓ Should show consent page first
✓ Title: "Survey Consent"
✓ Shield icon should be visible
✓ Survey information card should show:
  - Survey name
  - Conducted by: Government of India
  - Estimated time: 15-20 minutes
```

#### Test 4.3: Consent Content
```
✓ Consent text should include:
  - Purpose of survey
  - Data confidentiality notice
  - "Your participation is voluntary"
  - Rights statement
✓ Download consent PDF button should be visible (mocked)
```

#### Test 4.4: Consent Checkbox
```
✓ Checkbox: "I have read and accept the consent"
✓ Click checkbox
✓ Should enable "Proceed" button
✓ Uncheck checkbox
✓ Should disable "Proceed" button
```

#### Test 4.5: Proceed to Prefill
```
✓ Check consent checkbox
✓ Click "Proceed to Survey"
✓ Should move to "Prefill & Verify" step
```

#### Test 4.6: Prefill Step - UI
```
✓ Title: "Verify Your Information"
✓ Description: "We have prefilled some data from government records"
✓ Progress should show "Step 2 of 4"
```

#### Test 4.7: Prefilled Data
```
✓ Name field should show "Anjali Verma" with blue "Prefilled" badge
✓ Age field should show "32" with blue "Prefilled" badge
✓ Fields should be editable
✓ "Data source: Government records" text should appear
```

#### Test 4.8: Verify Prefilled Data
```
✓ Click checkboxes next to prefilled fields
✓ Edit a prefilled field
✓ "Prefilled" badge should remain
✓ Verification checkbox should still work
✓ Click "Verify and Continue"
✓ Should move to survey questions
```

#### Test 4.9: Survey Step - UI
```
✓ Title should show survey name
✓ Progress bar should appear at top
✓ Progress should show "Question 1 of [total]"
✓ Progress percentage should show
✓ Question should display with label
```

#### Test 4.10: Question Navigation
```
✓ Answer first question
✓ Click "Next" button
✓ Should move to next question
✓ Progress should update (e.g., "Question 2 of 5")
✓ Click "Previous" button
✓ Should go back to previous question
✓ Previous answer should be preserved
```

#### Test 4.11: Question Types
```
✓ Short text question should show text input
✓ Number question should show number input
✓ Single choice should show radio buttons
✓ Multi-choice should show checkboxes
✓ Dropdown should show select menu
```

#### Test 4.12: Required Validation
```
✓ Leave a required question empty
✓ Click "Next"
✓ Should show error: "This field is required"
✓ Should not proceed to next question
✓ Fill the answer
✓ Error should disappear
✓ Should proceed on next click
```

#### Test 4.13: Help Text
```
✓ Questions with help text should show grey text below label
✓ Help text should guide user on how to answer
```

#### Test 4.14: Bilingual Questions
```
✓ Switch language to Hindi in header
✓ Question labels should change to Hindi
✓ Options should change to Hindi
✓ Help text should change to Hindi
```

#### Test 4.15: Auto-save (Mocked)
```
✓ Answer a few questions
✓ Small text should appear: "Auto-saved at [time]"
✓ Indicates progress is being saved
```

#### Test 4.16: Submit Survey
```
✓ Answer all questions
✓ On last question, "Next" button should change to "Submit Survey"
✓ Click "Submit Survey"
✓ Loading indicator should appear briefly
✓ Should move to receipt step
```

#### Test 4.17: Receipt Step - UI
```
✓ Green checkmark icon should appear
✓ Title: "Survey Submitted Successfully"
✓ Subtitle: "Thank you for your participation"
✓ Receipt card should be visible
```

#### Test 4.18: Receipt Content
```
✓ Receipt should show:
  - Unique Receipt ID (RCT-[timestamp])
  - Survey name
  - Submitted on date and time
  - Total questions answered
  - Time taken to complete
✓ QR code placeholder should appear (mocked)
```

#### Test 4.19: Receipt Actions
```
✓ "Download Receipt" button should be visible
✓ Click download button
✓ Toast should show: "Receipt downloaded" (mocked)
✓ "Return to Dashboard" button should be visible
✓ Click return button
✓ Should navigate back to /citizen/dashboard
```

#### Test 4.20: Survey History
```
✓ After completing survey, check citizen dashboard
✓ Completed survey should appear in "My Survey History"
✓ Should show "Completed" status badge in green
✓ Should show completion date
✓ Should show receipt ID
```

### 5. Multilingual i18n (6 tests)

#### Test 5.1: Language Toggle
```
✓ Header should show "EN" button
✓ Click "EN"
✓ Should change to "हि" (Hindi)
✓ All visible text should change to Hindi
```

#### Test 5.2: Header Translation
```
✓ In English: "Government of India"
✓ Switch to Hindi
✓ Should show: "भारत सरकार"
✓ "Ministry..." should translate
✓ "AI-Powered Smart Survey Tool" should translate
```

#### Test 5.3: Dashboard Translation
```
✓ Login as Admin (English)
✓ Breadcrumb should show: "Admin" > "Dashboard"
✓ Switch to Hindi
✓ Breadcrumb should translate
✓ KPI cards should translate:
  - "Total Surveys" → "कुल सर्वेक्षण"
  - "Total Responses" → "कुल प्रतिक्रियाएं"
  - etc.
```

#### Test 5.4: Survey Questions
```
✓ Start a survey as citizen (English)
✓ Question: "What is your age?"
✓ Switch to Hindi
✓ Question: "आपकी आयु क्या है?"
✓ Switch back to English
✓ Should return to English
```

#### Test 5.5: Options Translation
```
✓ Single choice question with options:
  - English: Male, Female, Other
  - Hindi: पुरुष, महिला, अन्य
✓ Switch language
✓ Options should translate
```

#### Test 5.6: Persistence
```
✓ Set language to Hindi
✓ Refresh page
✓ Language should remain Hindi
✓ Login/logout
✓ Language preference should persist
```

### 6. Role-Based Dashboards (12 tests)

#### Test 6.1: Admin Dashboard - Layout
```
✓ Login as Admin
✓ Dashboard should show:
  - 4 KPI cards at top
  - India map in center-left
  - Response trend chart (line chart)
  - Survey status chart (bar chart)
  - Enumerator performance table
```

#### Test 6.2: Admin Dashboard - KPIs
```
✓ Total Surveys card:
  - Should show count (e.g., "3 Active / 3 Total")
  - Should show green up arrow
  - Icon: ClipboardList
✓ Total Responses card:
  - Should show count (e.g., "1,234")
  - Should show "+23 today"
  - Icon: Users
✓ Completion Rate card:
  - Should show percentage (e.g., "68.5%")
  - Should show trend
  - Icon: TrendingUp
✓ Quality Score card:
  - Should show percentage (e.g., "94.2%")
  - Should show flagged count
  - Icon: Shield
```

#### Test 6.3: Admin Dashboard - Charts
```
✓ Response Trend chart:
  - Should show 7-day line chart
  - X-axis: dates (Feb 2-8)
  - Y-axis: response counts
  - Line should be blue
  - Hover should show tooltip with exact values
✓ Survey Status chart:
  - Should show bar chart
  - Categories: Live, Upcoming, Closed
  - Bars should be color-coded (green, blue, grey)
```

#### Test 6.4: Admin Sidebar Navigation
```
✓ Sidebar should show menu items:
  - Dashboard (active)
  - Surveys
  - Assignments
  - Question Bank
  - Supervisors
  - Analytics
✓ Click each menu item
✓ Should navigate to respective page (or show coming soon)
```

#### Test 6.5: Supervisor Dashboard - Layout
```
✓ Login as Supervisor
✓ Dashboard should show:
  - Region-specific KPIs
  - Field team performance cards
  - Quality flags summary
  - Enumerator list with stats
  - Map filtered to supervisor's regions
```

#### Test 6.6: Supervisor Dashboard - Quality Flags
```
✓ Quality flags section should show:
  - GPS Mismatch count
  - Too Fast Completions count
  - Inconsistent Answers count
  - Total flagged responses
✓ Each flag type should have icon and color
✓ Click on a flag should filter data (mocked)
```

#### Test 6.7: Supervisor Dashboard - Field Teams
```
✓ Enumerator performance section should list:
  - Enumerator name
  - Assigned count
  - Completed count
  - Quality score
  - Average time
✓ Each enumerator should be clickable
✓ Should show performance trends
```

#### Test 6.8: Enumerator Dashboard - Layout
```
✓ Login as Enumerator
✓ Dashboard should show:
  - Today's assignments card
  - Completed today card
  - Pending callbacks card
  - Assignment list table
  - Quick action buttons
```

#### Test 6.9: Enumerator Dashboard - Assignments
```
✓ Assignment list should show:
  - Household ID
  - Survey name
  - Address
  - Status (Pending, In Progress, Completed)
  - Action buttons (Start, Resume, View)
✓ Status should be color-coded
✓ Click "Start" should begin survey (mocked)
```

#### Test 6.10: Enumerator Dashboard - Callbacks
```
✓ Callbacks section should list:
  - Respondent name
  - Household ID
  - Scheduled time
  - Reason for callback
  - Call button
✓ Click call button
✓ Should show call interface (mocked)
```

#### Test 6.11: Citizen Dashboard - Layout
```
✓ Login as Citizen
✓ Dashboard should show:
  - Welcome message with user name
  - Available surveys section
  - My survey history section
  - Statistics cards
```

#### Test 6.12: Citizen Dashboard - Available Surveys
```
✓ Available surveys section should list:
  - Survey title (EN/HI based on language)
  - Survey description
  - Estimated time
  - "Start Survey" button
  - Status badge (if in progress)
✓ Click "Start Survey"
✓ Should navigate to survey fill page
```

### 7. Additional Features (10 tests)

#### Test 7.1: Search Functionality
```
✓ Go to Admin > Surveys
✓ Search input should be visible
✓ Type "Household"
✓ Survey list should filter to show only matching surveys
✓ Clear search
✓ All surveys should reappear
```

#### Test 7.2: Filter by Status
```
✓ On Surveys page, click filter dropdown
✓ Select "Live"
✓ Only live surveys should show
✓ Select "Draft"
✓ Only draft surveys should show
✓ Select "All"
✓ All surveys should show
```

#### Test 7.3: Notifications (Mocked)
```
✓ Click bell icon in header
✓ Dropdown should show notifications:
  - "New survey assigned" - 2 hours ago
  - Badge should show count (3)
✓ Click on a notification
✓ Should show detail or navigate (mocked)
```

#### Test 7.4: User Profile Menu
```
✓ Click on user avatar/name in header
✓ Dropdown should show:
  - User name
  - User role
  - "Profile" option
  - "Logout" option
✓ Click "Profile"
✓ Should show profile page or modal (mocked)
```

#### Test 7.5: Breadcrumb Navigation
```
✓ Go to Admin > Surveys > Create New
✓ Breadcrumb should show: Admin > Surveys > New
✓ Click "Surveys" in breadcrumb
✓ Should navigate back to surveys list
✓ Click "Admin" in breadcrumb
✓ Should navigate to admin dashboard
```

#### Test 7.6: Responsive Design
```
✓ Resize browser to tablet size (768px)
✓ Sidebar should collapse or hide
✓ Menu icon should appear
✓ KPI cards should stack vertically
✓ Map should remain responsive
✓ Resize to mobile (375px)
✓ All content should be accessible
✓ Forms should be single column
```

#### Test 7.7: Toast Notifications
```
✓ Perform any action (save, delete, etc.)
✓ Toast should appear in top-right
✓ Toast should auto-dismiss after 3-5 seconds
✓ Toast should be dismissible by clicking X
✓ Multiple toasts should stack
```

#### Test 7.8: Loading States
```
✓ When navigating between pages, check for loading indicators
✓ Buttons should show loading state when clicked
✓ Forms should disable during submission
✓ Skeleton loaders should appear for data (if implemented)
```

#### Test 7.9: Error Handling
```
✓ Try to access non-existent survey: #/citizen/surveys/invalid-id/fill
✓ Should show error message or redirect to dashboard
✓ Try to access non-existent route: #/invalid-route
✓ Should show 404 page
✓ 404 page should have "Go back home" link
```

#### Test 7.10: Data Persistence
```
✓ Login as Admin
✓ Create a new survey (save as draft)
✓ Logout
✓ Refresh page
✓ Login again
✓ Survey should still exist in drafts
✓ Complete a survey as Citizen
✓ Response should persist in store
```

## 🎯 Feature Verification Summary

After completing all tests above, verify:

- ✅ **155+ features tested**
- ✅ **Authentication working** (login, logout, role-based redirect)
- ✅ **India map working** (display, hover, zoom, drill-down, districts)
- ✅ **Survey builder working** (drag-drop, AI generation, question bank)
- ✅ **Citizen flow working** (consent → prefill → survey → receipt)
- ✅ **Multilingual working** (EN ⇄ HI switching and persistence)
- ✅ **All 4 role dashboards working** (Admin, Supervisor, Enumerator, Citizen)
- ✅ **Navigation working** (breadcrumbs, sidebar, protected routes)
- ✅ **State management working** (Zustand persistence)
- ✅ **UI components working** (charts, tables, forms, modals)

## 🐛 Bug Reporting

If you find any issues during testing, note:
1. Which test failed?
2. What was the expected behavior?
3. What actually happened?
4. Steps to reproduce
5. Browser and screen size

## 📝 Notes

- All backend features (APIs, file uploads, SMS) are **mocked**
- OTP is always **123456**
- Data persists in **localStorage**
- Some features show "Coming Soon" placeholders
- District data is only available for 7 major states

## ✅ Expected Test Results

**All tests should PASS**. If any test fails, it indicates an implementation issue that needs fixing.

---

**Happy Testing! 🎉**
