export const dummyData = {
    profile: {
        name: "Rahul Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        university: "Delhi Technological University",
        semester: 6,
        streak_count: 12,
        daily_goal_hours: 4,
        study_start_time: "18:00",
        study_end_time: "22:00"
    },

    subjects: [
        { id: "sub-1", name: "Advanced Mathematics", icon: "ruler", color: "#6C63FF", exam_date: "2026-03-15", priority: "critical", progress: 62 },
        { id: "sub-2", name: "Organic Chemistry", icon: "flask", color: "#00D4AA", exam_date: "2026-03-20", priority: "high", progress: 45 },
        { id: "sub-3", name: "Data Structures", icon: "desktop", color: "#FF6B6B", exam_date: "2026-03-25", priority: "high", progress: 80 },
        { id: "sub-4", name: "Engineering Physics", icon: "atom", color: "#FFB347", exam_date: "2026-04-02", priority: "medium", progress: 30 },
        { id: "sub-5", name: "Technical Writing", icon: "pen-nib", color: "#4ADE80", exam_date: "2026-04-10", priority: "low", progress: 10 }
    ],

    topics: {
        "sub-1": [
            { id: "t-1-1", name: "Differential Equations", estimated_hours: 4, difficulty: "hard", is_completed: true },
            { id: "t-1-2", name: "Laplace Transforms", estimated_hours: 3, difficulty: "medium", is_completed: true },
            { id: "t-1-3", name: "Fourier Series", estimated_hours: 3, difficulty: "medium", is_completed: true },
            { id: "t-1-4", name: "Complex Analysis", estimated_hours: 5, difficulty: "hard", is_completed: false },
            { id: "t-1-5", name: "Vector Calculus", estimated_hours: 4, difficulty: "medium", is_completed: false },
            { id: "t-1-6", name: "Numerical Methods", estimated_hours: 3, difficulty: "easy", is_completed: false },
            { id: "t-1-7", name: "Linear Algebra", estimated_hours: 4, difficulty: "medium", is_completed: false },
            { id: "t-1-8", name: "Probability & Statistics", estimated_hours: 5, difficulty: "hard", is_completed: false }
        ],
        "sub-2": [
            { id: "t-2-1", name: "Alkanes", estimated_hours: 2, difficulty: "medium", is_completed: true },
            { id: "t-2-2", name: "Alkenes", estimated_hours: 3, difficulty: "hard", is_completed: false },
            { id: "t-2-3", name: "Benzene", estimated_hours: 2, difficulty: "hard", is_completed: false }
        ]
    },

    todaySessions: [
        { time: "6:00 PM", duration: "1h", subjectId: "sub-1", subjectName: "Adv. Maths", topic: "Complex Analysis", color: "#6C63FF", icon: "ruler", type: "learn" },
        { time: "7:00 PM", duration: "1h", subjectId: "sub-2", subjectName: "Org. Chemistry", topic: "Alkenes", color: "#00D4AA", icon: "flask", type: "revise" },
        { time: "8:00 PM", duration: "1.5h", subjectId: "sub-3", subjectName: "Data Structures", topic: "Graphs", color: "#FF6B6B", icon: "desktop", type: "practice" }
    ],

    weeklyHours: [
        { day: "Mon", hours: 3.5 },
        { day: "Tue", hours: 4.0 },
        { day: "Wed", hours: 2.5 },
        { day: "Thu", hours: 5.0 },
        { day: "Fri", hours: 3.0 },
        { day: "Sat", hours: 6.5 },
        { day: "Sun", hours: 2.0 }
    ],

    reminders: [
        { id: "r-1", title: "Advanced Maths Exam", type: "exam", icon: "calendar-blank", color: "#FF6B6B", description: "18 days left", time: "All Day", is_active: true },
        { id: "r-2", title: "Daily Study Session", type: "daily", icon: "clock", color: "#6C63FF", description: "Repeats daily", time: "6:00 PM", is_active: true },
        { id: "r-3", title: "Revise Differential Equations", type: "revision", icon: "book-open", color: "#FFB347", description: "Last studied 4 days ago", time: "Today", is_active: true },
        { id: "r-4", title: "Organic Chemistry nudge", type: "ai_nudge", icon: "sparkle", color: "#00D4AA", description: "Haven't touched in 3 days", time: "Suggested", is_active: true }
    ],

    stats: {
        hoursStudied: "24.5",
        topicsCompleted: 38,
        topicsTotal: 72,
        streakDays: 12,
        nextExamDays: 8,
        nextExamHours: 4
    }
};
