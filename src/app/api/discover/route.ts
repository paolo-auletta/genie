import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/client";
import { students } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

const BACKEND_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      believer_text,
      field_of_study,
      country,
      languages,
      current_status,
      job_role,
      age,
      financial_support_per_year,
      financial_support_duration,
      financial_support_return,
    } = body ?? {};

    if (!believer_text || typeof believer_text !== "string") {
      return NextResponse.json(
        { error: "believer_text is required" },
        { status: 400 },
      );
    }

    const matchRes = await fetch(`${BACKEND_URL}/match-students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        believer_text,
        field_of_study: Array.isArray(field_of_study)
          ? field_of_study
          : field_of_study
          ? [field_of_study]
          : null,
        country: Array.isArray(country)
          ? country
          : country
          ? [country]
          : null,
        languages: Array.isArray(languages)
          ? languages
          : languages
          ? [languages]
          : null,
        current_status: Array.isArray(current_status)
          ? current_status
          : current_status
          ? [current_status]
          : null,
        job_role: Array.isArray(job_role)
          ? job_role
          : job_role
          ? [job_role]
          : null,
        age: typeof age === "number" ? age : null,
        financial_support_per_year: financial_support_per_year ?? null,
        financial_support_duration: financial_support_duration ?? null,
        financial_support_return: Array.isArray(financial_support_return)
          ? financial_support_return
          : financial_support_return
          ? [financial_support_return]
          : null,
      }),
    });

    if (!matchRes.ok) {
      const text = await matchRes.text();
      return NextResponse.json(
        { error: text || "Failed to match students" },
        { status: 502 },
      );
    }

    type BackendMatchItem = {
      student_id: string;
      user?: string | null;
      [key: string]: unknown;
    };

    type BackendMatchResponse = {
      queries?: Record<string, unknown>;
      combined_results?: BackendMatchItem[];
    };

    const data = (await matchRes.json()) as BackendMatchResponse;
    const combined: BackendMatchItem[] = Array.isArray(data?.combined_results)
      ? data.combined_results
      : [];

    const userIds = Array.from(
      new Set(
        combined
          .map((item: any) => item.user || item.student_id)
          .filter(Boolean),
      ),
    ) as string[];

    let profilesById: Record<string, (typeof students.$inferSelect) | undefined> = {};

    if (userIds.length) {
      const profiles = await db
        .select()
        .from(students)
        .where(inArray(students.userId, userIds));

      profilesById = Object.fromEntries(
        profiles.map((p) => [p.userId, p] as const),
      );
    }

    const results = combined.map((item) => {
      const userId = (item.user as string | null) ?? (item.student_id as string);
      return {
        ...item,
        user_id: userId,
        profile: userId ? profilesById[userId] ?? null : null,
      };
    });

    return NextResponse.json({
      queries: data?.queries ?? {},
      results,
    });
  } catch (error) {
    console.error("Error in /apigenie/:", error);
    return NextResponse.json(
      { error: "Failed to discover students" },
      { status: 500 },
    );
  }
}
