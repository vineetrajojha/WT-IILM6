# StudymateAI — Agent Build Guideline
> Feed this entire file to your coding agent before starting any implementation.

---

## 🎯 Project Overview

**StudymateAI** is a modern, AI-assisted study planner for students. It helps students input their syllabus + exam dates, auto-generates a personalized timetable, tracks progress, and sends smart reminders.

**Stack:** React + Vite, Tailwind CSS, Framer Motion, Supabase (auth + database), React Query, Recharts, date-fns.

---

## 🎨 Design Direction

### Aesthetic: "Soft Futurism / Glassmorphism meets Editorial"
- **Vibe:** Webflow/Framer-quality. Think Linear.app meets Notion meets a premium SaaS dashboard.
- **Theme:** Dark-first. Deep navy/slate backgrounds (`#0A0F1E`, `#0D1526`) with luminous accent colors.
- **Accent Colors:**
  - Primary: `#6C63FF` (electric violet)
  - Secondary: `#00D4AA` (mint/teal)
  - Danger/Alert: `#FF6B6B`
  - Warning: `#FFB347`
  - Success: `#4ADE80`
- **Typography:**
  - Display: `"Clash Display"` or `"Cabinet Grotesk"` (from fontshare.com) — bold, geometric
  - Body: `"Satoshi"` or `"Plus Jakarta Sans"` — clean, readable
  - Mono (for countdowns/timers): `"JetBrains Mono"`
- **Visual Details:**
  - Glassmorphism cards: `backdrop-filter: blur(16px)`, semi-transparent borders
  - Gradient mesh background (animated subtle blobs)
  - Micro-animations on every interaction (Framer Motion)
  - Noise texture overlay (5% opacity SVG grain)
  - Glowing hover states on CTAs
  - Smooth page transitions between routes

---

## 🏗️ Application Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   └── Layout.jsx
│   ├── dashboard/
│   │   ├── StatsCards.jsx
│   │   ├── TodaySchedule.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── UpcomingExams.jsx
│   │   └── StudyStreak.jsx
│   ├── planner/
│   │   ├── SyllabusInput.jsx
│   │   ├── TimetableGrid.jsx
│   │   ├── SessionCard.jsx
│   │   └── AIGenerateModal.jsx
│   ├── subjects/
│   │   ├── SubjectCard.jsx
│   │   ├── TopicChecklist.jsx
│   │   └── AddSubjectModal.jsx
│   ├── analytics/
│   │   ├── WeeklyChart.jsx
│   │   ├── SubjectDistribution.jsx
│   │   └── HeatmapCalendar.jsx
│   ├── reminders/
│   │   ├── ReminderList.jsx
│   │   └── ReminderModal.jsx
│   └── ui/
│       ├── GlassCard.jsx
│       ├── ProgressBar.jsx
│       ├── Badge.jsx
│       ├── CountdownTimer.jsx
│       ├── AnimatedNumber.jsx
│       └── EmptyState.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Planner.jsx
│   ├── Subjects.jsx
│   ├── Analytics.jsx
│   ├── Reminders.jsx
│   └── Settings.jsx
├── hooks/
│   ├── useStudySessions.js
│   ├── useSubjects.js
│   ├── useReminders.js
│   └── useAuth.js
├── lib/
│   ├── supabase.js
│   ├── aiTimetable.js       ← timetable generation logic
│   └── utils.js
├── data/
│   └── dummyData.js         ← all seed/mock data
└── App.jsx
```

---

## 📄 Pages & Features

### 1. `/dashboard` — Home Dashboard
**Layout:** 3-column grid on desktop, stacked on mobile.

**Components:**
- **Hero greeting** — "Good morning, Rahul 👋" with current date + motivational quote (rotated daily)
- **Stats Row (4 cards):**
  - 📚 Hours studied this week: **24.5h**
  - ✅ Topics completed: **38 / 72**
  - 🔥 Study streak: **12 days**
  - ⏳ Next exam in: **Countdown timer (e.g. "8d 4h 22m")**
- **Today's Schedule** — timeline-style list of sessions for today with subject color-coding
- **Upcoming Exams** — ordered list with days remaining badge + urgency color (red < 7 days, yellow < 14, green otherwise)
- **Weekly Progress Chart** — Recharts AreaChart showing hours studied per day this week
- **AI Suggestion Banner** — "Based on your pace, you need 3 more hours on Organic Chemistry this week" with CTA

---

### 2. `/planner` — AI Timetable Generator
**This is the core feature.**

**Left Panel — Input Form:**
- Subject name input
- Topic list (add/remove chips)
- Exam date picker
- Estimated hours per topic (slider)
- Priority level (Low / Medium / High / Critical)
- Available study hours per day (time range picker: e.g. 6pm–10pm)
- "Generate My Timetable" CTA button

**Right Panel — Generated Timetable:**
- Weekly calendar grid (Mon–Sun, time slots as rows)
- Sessions rendered as colored blocks inside grid cells
- Each block shows: Subject icon, topic name, duration
- Drag-to-reschedule (react-beautiful-dnd or @dnd-kit/core)
- "Regenerate" button with AI sparkle icon

**AI Generation Logic (`lib/aiTimetable.js`):**
```js
// Algorithm (mock, no real AI API needed):
// 1. Calculate days until each exam
// 2. Allocate more sessions to high-priority / nearest-exam subjects
// 3. Distribute across available time slots
// 4. Apply spaced repetition: revisit topics every 3–4 days
// 5. Add 20% buffer days before each exam (revision sessions)
// 6. Return array of { date, subjectId, topic, duration, type: 'learn'|'revise' }
```

---

### 3. `/subjects` — Subject Manager
**Grid of subject cards**, each showing:
- Subject name + emoji icon
- Color-coded header
- Progress bar (topics done / total)
- Exam date + countdown
- "View Topics" expand button

**Topic Checklist (expanded view):**
- List of topics as checkboxes
- Each topic has: name, estimated hours, difficulty badge, notes field
- Completed topics get strikethrough + green check
- "Add Topic" inline input

---

### 4. `/analytics` — Progress Analytics
- **Weekly Study Hours** — AreaChart (last 4 weeks)
- **Subject Distribution** — DonutChart showing % time per subject
- **Daily Heatmap** — GitHub-style contribution heatmap (last 3 months)
- **Performance Score** — animated circular gauge (0–100)
- **Consistency Score** — streak tracking with calendar view
- **Productivity by Hour** — BarChart showing which hours of day are most productive

---

### 5. `/reminders` — Smart Reminders
**List of reminders**, categorized as:
- 📅 **Exam countdowns** — auto-generated from exam dates
- 📖 **Daily study reminders** — user-set (e.g. "Study at 7pm daily")
- ⚡ **AI smart nudges** — "You haven't studied Physics in 4 days"
- 🔄 **Revision reminders** — spaced repetition alerts

Each reminder card shows: icon, title, description, time, toggle on/off, snooze/dismiss actions.

**Add Reminder Modal:**
- Title, type (manual/exam/AI), datetime, repeat (daily/weekly/custom), linked subject

---

### 6. `/settings` — Preferences
- Profile: name, avatar, university, semester
- Study preferences: preferred hours, break interval (Pomodoro), daily goal
- Notification settings: email, browser push, in-app
- Theme: Dark (default), Light, System
- Data: Export timetable as PDF, Clear all data

---

## 🗄️ Supabase Schema

```sql
-- Users (extends Supabase Auth)
profiles (
  id uuid references auth.users,
  name text,
  avatar_url text,
  university text,
  semester int,
  daily_goal_hours float,
  study_start_time time,
  study_end_time time,
  streak_count int default 0,
  last_studied_at date,
  created_at timestamptz
)

-- Subjects
subjects (
  id uuid primary key,
  user_id uuid references profiles,
  name text,
  emoji text,
  color text,           -- hex color
  exam_date date,
  priority text,        -- 'low'|'medium'|'high'|'critical'
  total_hours_needed float,
  created_at timestamptz
)

-- Topics
topics (
  id uuid primary key,
  subject_id uuid references subjects,
  name text,
  estimated_hours float,
  difficulty text,      -- 'easy'|'medium'|'hard'
  is_completed boolean default false,
  completed_at timestamptz,
  notes text,
  order_index int
)

-- Study Sessions
study_sessions (
  id uuid primary key,
  user_id uuid references profiles,
  subject_id uuid references subjects,
  topic_id uuid references topics,
  scheduled_at timestamptz,
  duration_minutes int,
  type text,            -- 'learn'|'revise'|'practice'
  is_completed boolean default false,
  actual_duration_minutes int,
  notes text,
  created_at timestamptz
)

-- Reminders
reminders (
  id uuid primary key,
  user_id uuid references profiles,
  title text,
  description text,
  type text,            -- 'exam'|'daily'|'ai_nudge'|'revision'
  subject_id uuid references subjects,
  remind_at timestamptz,
  repeat_pattern text,  -- 'none'|'daily'|'weekly'|'custom'
  is_active boolean default true,
  is_dismissed boolean default false
)
```

---

## 🧪 Dummy Data (pre-fill everything)

### User Profile
```js
{
  name: "Rahul Sharma",
  university: "Delhi Technological University",
  semester: 6,
  streak_count: 12,
  daily_goal_hours: 4,
  study_start_time: "18:00",
  study_end_time: "22:00"
}
```

### Subjects (5 subjects)
```js
[
  { name: "Advanced Mathematics", emoji: "📐", color: "#6C63FF", exam_date: "2026-03-15", priority: "critical" },
  { name: "Organic Chemistry", emoji: "⚗️", color: "#00D4AA", exam_date: "2026-03-20", priority: "high" },
  { name: "Data Structures", emoji: "💻", color: "#FF6B6B", exam_date: "2026-03-25", priority: "high" },
  { name: "Engineering Physics", emoji: "⚛️", color: "#FFB347", exam_date: "2026-04-02", priority: "medium" },
  { name: "Technical Writing", emoji: "✍️", color: "#4ADE80", exam_date: "2026-04-10", priority: "low" }
]
```

### Topics per Subject (~8–12 each)
For "Advanced Mathematics":
```js
["Differential Equations", "Laplace Transforms", "Fourier Series", "Complex Analysis", "Vector Calculus", "Numerical Methods", "Linear Algebra", "Probability & Statistics"]
```
(Generate similar lists for others.)

### Study Sessions (populate a full week + past 3 months for analytics)
- Create 2–4 sessions per day
- Mix of completed (past) and scheduled (future)
- Vary durations: 45min, 60min, 90min, 120min

### Weekly Hours Data (for charts)
```js
// Last 7 days
[
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 4.0 },
  { day: "Wed", hours: 2.5 },
  { day: "Thu", hours: 5.0 },
  { day: "Fri", hours: 3.0 },
  { day: "Sat", hours: 6.5 },
  { day: "Sun", hours: 2.0 }
]
```

### Reminders (8 items pre-filled)
```js
[
  { title: "Advanced Maths Exam", type: "exam", days_until: 18, is_active: true },
  { title: "Daily Study Session", type: "daily", time: "6:00 PM", repeat: "daily", is_active: true },
  { title: "Revise Differential Equations", type: "revision", description: "Last studied 4 days ago", is_active: true },
  { title: "Organic Chemistry hasn't been touched in 3 days", type: "ai_nudge", is_active: true },
  // ... 4 more
]
```

---

## ✨ Additional Features to Implement

### Core (Must-Have)
1. **Pomodoro Timer** — floating timer widget (25/5 min cycles), links to active session
2. **Session Logger** — after completing a session, rate difficulty + log actual time
3. **Syllabus PDF Parser** — drag-drop PDF, extract topic names (use PDF.js + simple text parsing)
4. **Progress Streaks** — fire animation on maintaining streak, confetti on milestones

### Advanced (Nice-to-Have)
5. **AI Study Tips** — per-subject tips based on difficulty + progress (hardcoded smart templates)
6. **Exam Countdown Widgets** — large bold countdowns on dashboard, shareable
7. **Study Group Mode** — share timetable via link (read-only public URL)
8. **Focus Mode** — fullscreen distraction-free Pomodoro with ambient noise options
9. **Timetable Export** — download as PDF / sync to Google Calendar (ical format)
10. **Dark/Light/AMOLED Themes** — with animated theme switcher
11. **Offline Mode** — service worker + localStorage fallback when no internet
12. **Mobile PWA** — installable, push notifications via web-push API
13. **AI Rebalance** — "I missed 2 days" button that redistributes remaining sessions
14. **Performance Insights** — "Your best study day is Saturday" personalized stats

---

## 🧩 Component Specs

### `GlassCard.jsx`
```jsx
// Reusable glass card with blur + border glow
// Props: children, className, glowColor (optional accent)
// Style: background: rgba(255,255,255,0.04), border: 1px solid rgba(255,255,255,0.08)
// backdrop-filter: blur(16px), border-radius: 16px
// Hover: border-color transitions to glowColor with box-shadow glow
```

### `CountdownTimer.jsx`
```jsx
// Props: targetDate (Date), size ('sm'|'md'|'lg')
// Shows: DD HH MM SS in monospace font
// Color shifts: green → yellow → red as exam approaches
// Pulse animation when < 24 hours
```

### `ProgressRing.jsx`
```jsx
// SVG circular progress ring
// Props: value (0-100), size, color, label
// Animated fill on mount (stroke-dasharray animation)
// Center text shows percentage
```

### `AnimatedNumber.jsx`
```jsx
// Counts up from 0 to target value on mount
// Uses requestAnimationFrame for smooth animation
// Props: value, duration (ms), prefix, suffix
```

### `TimetableGrid.jsx`
```jsx
// 7-column (days) x N-row (time slots) grid
// Time slots: 30-min intervals from 6am to 11pm
// Sessions as absolutely positioned colored blocks
// Hover tooltip: subject, topic, duration, type
// Empty slots have subtle hover highlight
```

---

## 🎭 Animations Checklist

Use **Framer Motion** for all animations:

- [ ] Page transitions: `AnimatePresence` + slide/fade between routes
- [ ] Dashboard cards: staggered `fadeInUp` on mount (delay: i * 0.1s)
- [ ] Stats numbers: count-up animation with spring easing
- [ ] Sidebar items: slide in from left with stagger
- [ ] Modal: scale + fade (0.8 → 1.0 scale, 0 → 1 opacity)
- [ ] Timetable sessions: bounce in on generation
- [ ] Progress bars: width animate from 0 on mount
- [ ] Streak flame: continuous pulse + scale animation
- [ ] Notification badge: ping animation (CSS)
- [ ] AI generate button: rotating gradient border while generating
- [ ] Toast notifications: slide in from top-right
- [ ] Checkbox completion: strikethrough + color fade

---

## 🔧 Supabase Setup Instructions (for agent)

```js
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Important:** 
- Enable Row Level Security on all tables
- Policies: users can only CRUD their own data (using `auth.uid() = user_id`)
- Enable Realtime on `study_sessions` and `reminders` tables
- Create a Supabase Edge Function for sending reminder emails (optional)
- Use Supabase Auth with email/password + Google OAuth

---

## 📦 Package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.51.0",
    "framer-motion": "^11.3.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.427.0",
    "clsx": "^2.1.1",
    "pdfjs-dist": "^4.5.0"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 🖼️ UI Mockup Descriptions

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR (240px)          │  MAIN CONTENT                 │
│                          │                               │
│ 🎓 StudymateAI           │  Good morning, Rahul 👋       │
│                          │  Wednesday, Feb 25             │
│ ▣ Dashboard    ←active   │                               │
│ 📅 Planner               │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ 📚 Subjects              │  │ 24.5h│ │38/72 │ │ 🔥12 │ │8d 4h ││
│ 📊 Analytics             │  │Study │ │Topics│ │Streak│ │Exam  ││
│ 🔔 Reminders             │  └──────┘ └──────┘ └──────┘ └──────┘│
│ ⚙️ Settings              │                               │
│                          │  ┌─────────────┐ ┌──────────┐│
│ ─────────────────        │  │Today's      │ │Upcoming  ││
│ 🍅 Pomodoro Timer        │  │Schedule     │ │Exams     ││
│ [  25:00  ] [▶]          │  │             │ │          ││
│                          │  │ 6PM Maths   │ │📐 18d    ││
│ 📐 Maths Exam            │  │ 7PM Chem    │ │⚗️ 23d    ││
│ 18 days left             │  │ 8PM DSA     │ │💻 28d    ││
│                          │  └─────────────┘ └──────────┘│
│ Progress: ████░ 62%      │                               │
└─────────────────────────────────────────────────────────┘
```

### Planner Page
```
┌──────────────────────────────────────────────────────────┐
│  ADD SUBJECT FORM              │  WEEKLY TIMETABLE        │
│                                │                          │
│  Subject: [Organic Chemistry]  │  Mon  Tue  Wed  Thu  Fri │
│  Exam: [Mar 20, 2026]          │  ─────────────────────── │
│  Priority: [● Critical]        │  6PM  [📐] [⚗️]     [📐] │
│                                │  7PM       [💻] [⚗️]    │
│  Topics:                       │  8PM  [⚛️]      [💻]    │
│  + Alkanes    [2h] [Medium]    │  9PM  [⚗️] [📐]         │
│  + Alkenes    [3h] [Hard  ]    │                          │
│  + Benzene    [2h] [Hard  ]    │  [✨ Regenerate Plan]    │
│  + [Add topic...]              │                          │
│                                │  Sessions auto-fit to    │
│  [✨ Generate My Timetable]    │  your available hours    │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Development Sequence (for agent)

**Phase 1 — Foundation**
1. Vite + React project setup with Tailwind, Framer Motion
2. Supabase client + auth (email + Google)
3. Layout shell: Sidebar + TopBar + routing
4. Dummy data file with all seed data
5. GlassCard, Badge, ProgressBar, CountdownTimer UI components

**Phase 2 — Core Pages**
6. Dashboard page (all widgets with dummy data)
7. Subjects page + Topic checklist
8. Planner page with timetable grid (static first)
9. AI timetable generation algorithm
10. Drag-to-reschedule sessions

**Phase 3 — Analytics & Reminders**
11. Analytics page with all charts (Recharts)
12. GitHub-style heatmap component (custom SVG)
13. Reminders page with CRUD
14. Smart reminder logic (days since last study)

**Phase 4 — Polish**
15. Pomodoro timer (floating widget)
16. PDF syllabus upload + parse
17. All Framer Motion animations
18. Toast notifications
19. Responsive mobile layout
20. PWA manifest + service worker

---

## ⚠️ Important Notes for Agent

1. **All pages must render with dummy data immediately** — no empty states on first load
2. **Supabase is read/write** — but gracefully fall back to dummy data if env vars not set
3. **No purple gradient on white** — strictly follow the dark navy + violet/teal color system
4. **Font loading** — use `@import` from Fontshare for Satoshi + Cabinet Grotesk (or CDN fallback)
5. **Mobile-first** — sidebar collapses to bottom nav on mobile
6. **Performance** — lazy-load pages with `React.lazy()`, virtualize long lists
7. **Accessibility** — proper ARIA labels, keyboard navigation for all interactive elements
8. **Error boundaries** — wrap each page in ErrorBoundary component

---

## 🔗 Key References
- Supabase docs: https://supabase.com/docs
- Framer Motion: https://www.framer.com/motion/
- Recharts: https://recharts.org/
- @dnd-kit: https://dndkit.com/
- Fontshare (Satoshi, Cabinet Grotesk): https://www.fontshare.com/

---

*This guideline covers the complete product. Build iteratively following the Phase sequence. Prioritize visual quality and working interactions over feature completeness.*
