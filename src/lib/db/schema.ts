import { pgEnum, pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import {
  COUNTRIES,
  LANGUAGES,
  CURRENT_STATUSES,
  JOB_ROLES,
} from "../../constants/metadata";

export const countryEnum = pgEnum("country_enum", COUNTRIES as [string, ...string[]]);

export const languageEnum = pgEnum("language_enum", LANGUAGES as [string, ...string[]]);

export const currentStatusEnum = pgEnum(
  "current_status_enum",
  CURRENT_STATUSES as [string, ...string[]],
);

export const jobRoleEnum = pgEnum(
  "job_role_enum",
  JOB_ROLES as [string, ...string[]],
);

export const students = pgTable("students", {
  userId: text("user_id").primaryKey(),
  name: text("name"),
  surname: text("surname"),
  age: integer("age"),
  country: countryEnum("country"),
  languages: languageEnum("languages").array(),
  currentStatus: currentStatusEnum("current_status"),
  currentFieldOfStudy: text("current_field_of_study"),
  jobRole: jobRoleEnum("job_role"),
  financialSupportPerYear: integer("financial_support_per_year"),
  financialSupportDuration: integer("financial_support_duration"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const genie = pgTable("genie", {
  userId: text("user_id").primaryKey(),
  name: text("name"),
  surname: text("surname"),
  country: countryEnum("country"),
  language: languageEnum("language"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type InsertUser = typeof students.$inferInsert;
export type SelectUser = typeof students.$inferSelect;
