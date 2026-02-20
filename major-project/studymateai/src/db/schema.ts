import {
    pgTable,
    text,
    timestamp,
    integer,
    primaryKey,
    pgEnum,
    jsonb,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccountType } from "next-auth/adapters";

// --- Enums ---
export const planEnum = pgEnum("plan", ["free", "pro"]);
export const examStatusEnum = pgEnum("exam_status", ["active", "completed", "archived"]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const sessionStatusEnum = pgEnum("session_status", ["pending", "done", "partial", "skipped"]);
export const reminderChannelEnum = pgEnum("reminder_channel", ["email", "push"]);
export const reminderStatusEnum = pgEnum("reminder_status", ["pending", "sent", "failed"]);

// --- Auth Tables (NextAuth) ---
export const users = pgTable("users", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    plan: planEnum("plan").default("free").notNull(),
    timezone: text("timezone").default("UTC").notNull(),
    notifPrefs: jsonb("notif_prefs"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
    "accounts",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        primaryKey({ columns: [account.provider, account.providerAccountId] }),
    ]
);

export const authSessions = pgTable("auth_sessions", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verification_token",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// --- Application Tables ---
export const exams = pgTable("exams", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    subject: text("subject").notNull(),
    examDate: timestamp("exam_date", { mode: "date" }).notNull(),
    status: examStatusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const topics = pgTable("topics", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    examId: text("exam_id")
        .notNull()
        .references(() => exams.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    parentId: text("parent_id"),
    weight: integer("weight").notNull().default(1),
    difficulty: difficultyEnum("difficulty").default("medium").notNull(),
    orderIndex: integer("order_index").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    examId: text("exam_id")
        .notNull()
        .references(() => exams.id, { onDelete: "cascade" }),
    topicId: text("topic_id")
        .notNull()
        .references(() => topics.id, { onDelete: "cascade" }),
    scheduledDate: timestamp("scheduled_date", { mode: "date" }).notNull(),
    durationMins: integer("duration_mins").notNull(),
    status: sessionStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const progressLogs = pgTable("progress_logs", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    sessionId: text("session_id").references(() => sessions.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    notes: text("notes"),
    loggedAt: timestamp("logged_at", { mode: "date" }).defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const flashcards = pgTable("flashcards", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    topicId: text("topic_id")
        .notNull()
        .references(() => topics.id, { onDelete: "cascade" }),
    front: text("front").notNull(),
    back: text("back").notNull(),
    easeFactor: integer("ease_factor").default(250).notNull(),
    nextReviewAt: timestamp("next_review_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reminders = pgTable("reminders", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    examId: text("exam_id").references(() => exams.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    sendAt: timestamp("send_at", { mode: "date" }).notNull(),
    channel: reminderChannelEnum("channel").default("email").notNull(),
    status: reminderStatusEnum("status").default("pending").notNull(),
    payload: text("payload"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const streaks = pgTable("streaks", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => createId()),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: "cascade" }),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastStudiedAt: timestamp("last_studied_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
