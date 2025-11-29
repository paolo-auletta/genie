import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db/client";
import { students } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      user_id,
      name,
      surname,
      age,
      country,
      languages,
      current_status,
      current_field_of_study,
      job_role,
      financial_support_per_year,
      financial_support_duration,
      description,
    } = body ?? {};

    if (!user_id || typeof user_id !== "string") {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 },
      );
    }

    const ageInt =
      typeof age === "number" ? age : age ? parseInt(String(age), 10) : null;

    const financialSupportPerYearInt =
      typeof financial_support_per_year === "number"
        ? financial_support_per_year
        : financial_support_per_year
          ? parseInt(String(financial_support_per_year), 10)
          : null;

    const financialSupportDurationInt =
      typeof financial_support_duration === "number"
        ? financial_support_duration
        : financial_support_duration
          ? parseInt(String(financial_support_duration), 10)
          : null;

    const languagesArray: string[] = Array.isArray(languages)
      ? languages
      : languages
        ? [String(languages)]
        : [];

    await db
      .insert(students)
      .values({
        userId: user_id,
        name: name ?? null,
        surname: surname ?? null,
        age: ageInt,
        country: country ?? null,
        languages: languagesArray,
        currentStatus: current_status ?? null,
        currentFieldOfStudy: current_field_of_study ?? null,
        jobRole: job_role ?? null,
        financialSupportPerYear: financialSupportPerYearInt,
        financialSupportDuration: financialSupportDurationInt,
        description: description ?? null,
      })
      .onConflictDoUpdate({
        target: students.userId,
        set: {
          name: name ?? null,
          surname: surname ?? null,
          age: ageInt,
          country: country ?? null,
          languages: languagesArray,
          currentStatus: current_status ?? null,
          currentFieldOfStudy: current_field_of_study ?? null,
          jobRole: job_role ?? null,
          financialSupportPerYear: financialSupportPerYearInt,
          financialSupportDuration: financialSupportDurationInt,
          description: description ?? null,
        },
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/students:", error);
    return NextResponse.json(
      { error: "Failed to upsert user" },
      { status: 500 },
    );
  }
}
