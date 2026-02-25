import { createId } from "@paralleldrive/cuid2";

export const dummyExams = [
    {
        id: "exam-1",
        userId: "user-1",
        subject: "Midterm Physics",
        examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "exam-2",
        userId: "user-1",
        subject: "Final Mathematics",
        examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export const dummyTopics = [
    {
        id: "topic-1",
        examId: "exam-1",
        title: "Classical Mechanics",
        parentId: null,
        weight: 1,
        difficulty: "hard",
        orderIndex: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: "topic-2",
        examId: "exam-1",
        title: "Electromagnetism",
        parentId: null,
        weight: 1,
        difficulty: "medium",
        orderIndex: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export const dummySessions = [
    {
        id: "session-1",
        examId: "exam-1",
        topicId: "topic-1",
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        durationMins: 120,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

export const dummyFlashcards = [
    {
        id: "flashcard-1",
        topicId: "topic-1",
        front: "What is Newton's second law?",
        back: "F = ma",
        easeFactor: 250,
        nextReviewAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];
