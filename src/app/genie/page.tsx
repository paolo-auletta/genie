"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  StudentCard,
  type StudentProfile,
} from "@/app/components/student-card";
import { DM_Serif_Display } from "next/font/google";

const playfair = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

type DiscoverProfile = {
  userId: string;
  name: string | null;
  surname: string | null;
  age: number | null;
  country: string | null;
  languages: string[] | null;
  currentStatus: string | null;
  currentFieldOfStudy: string | null;
  jobRole: string | null;
  financialSupportPerYear: number | null;
  financialSupportDuration: number | null;
  financialSupportReturn: string | null;
  description: string | null;
};

type DiscoverResult = {
  student_id: string;
  user: string | null;
  field_score: number;
  behaviour_score: number;
  financial_score: number;
  overall_match: number;
  summary_field: string | null;
  summary_behaviour: string | null;
  user_id?: string | null;
  profile: DiscoverProfile | null;
};

type DiscoverResponse = {
  queries: {
    query_field?: string;
    query_behaviour?: string;
    [key: string]: unknown;
  };
  results: DiscoverResult[];
};

type DiscoverSearchParams = {
  believerText: string;
  age: string;
  country: string[];
  languages: string[];
  currentStatus: string[];
  fieldOfStudy: string[];
  jobRole: string[];
  financialSupportPerYear: string;
  financialSupportDuration: string;
  financialSupportReturn: string[];
};

export default function DiscoverPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<DiscoverResponse | null>(null);
  const [sortBy, setSortBy] = useState<
    "field" | "finances" | "behaviour" | "overall"
  >("overall");

  async function runDiscoverWithParams(params: DiscoverSearchParams) {
    if (!params.believerText) {
      setError(
        "Believer text is missing in your preferences. Please set it in the Preferences tab.",
      );
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          believer_text: params.believerText,
          field_of_study: params.fieldOfStudy.length ? params.fieldOfStudy : null,
          country: params.country.length ? params.country : null,
          languages: params.languages,
          current_status: params.currentStatus.length ? params.currentStatus : null,
          job_role: params.jobRole.length ? params.jobRole : null,
          age: params.age ? Number(params.age) : null,
          financial_support_per_year: params.financialSupportPerYear
            ? Number(params.financialSupportPerYear)
            : null,
          financial_support_duration: params.financialSupportDuration
            ? Number(params.financialSupportDuration)
            : null,
          financial_support_return: params.financialSupportReturn.length
            ? params.financialSupportReturn
            : null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to discover students");
      }

      const data = (await res.json()) as DiscoverResponse;
      setResponse(data);

      if (typeof window !== "undefined") {
        try {
          const payload = { params, response: data };
          window.localStorage.setItem(
            "discover-last-search",
            JSON.stringify(payload),
          );
        } catch {
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSearching(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("discover-preferences");
      if (!stored) {
        setError(
          "No saved preferences found. Please configure them in the Preferences tab first.",
        );
        return;
      }

      const prefs = JSON.parse(stored) as {
        believerText?: string;
        age?: string;
        country?: string | string[];
        languages?: string[];
        currentStatus?: string | string[];
        fieldOfStudy?: string | string[];
        jobRole?: string | string[];
        financialSupportPerYear?: string;
        financialSupportDuration?: string;
        financialSupportReturn?: string | string[];
      };

      const country = Array.isArray(prefs.country)
        ? prefs.country
        : prefs.country
        ? [prefs.country]
        : [];

      const currentStatus = Array.isArray(prefs.currentStatus)
        ? prefs.currentStatus
        : prefs.currentStatus
        ? [prefs.currentStatus]
        : [];

      const fieldOfStudy = Array.isArray(prefs.fieldOfStudy)
        ? prefs.fieldOfStudy
        : prefs.fieldOfStudy
        ? [prefs.fieldOfStudy]
        : [];

      const jobRole = Array.isArray(prefs.jobRole)
        ? prefs.jobRole
        : prefs.jobRole
        ? [prefs.jobRole]
        : [];

      const financialSupportReturn = Array.isArray(prefs.financialSupportReturn)
        ? prefs.financialSupportReturn
        : prefs.financialSupportReturn
        ? [prefs.financialSupportReturn]
        : [];

      const effective: DiscoverSearchParams = {
        believerText: prefs.believerText ?? "",
        age: prefs.age ?? "",
        country,
        languages: Array.isArray(prefs.languages) ? prefs.languages : [],
        currentStatus,
        fieldOfStudy,
        jobRole,
        financialSupportPerYear: prefs.financialSupportPerYear ?? "",
        financialSupportDuration: prefs.financialSupportDuration ?? "",
        financialSupportReturn,
      };

      if (!effective.believerText) {
        setError(
          "Believer text is missing in your preferences. Please set it in the Preferences tab.",
        );
        return;
      }

      try {
        const cachedRaw = window.localStorage.getItem("discover-last-search");
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as {
            params?: DiscoverSearchParams;
            response?: DiscoverResponse;
          };

          if (
            cached.params &&
            cached.response &&
            JSON.stringify(cached.params) === JSON.stringify(effective)
          ) {
            setResponse(cached.response);
            return;
          }
        }
      } catch {
      }

      void runDiscoverWithParams(effective);
    } catch {
      setError("Failed to load saved preferences.");
    }
  }, []);

  const queryField = response?.queries?.query_field as string | undefined;
  const queryBehaviour =
    response?.queries?.query_behaviour as string | undefined;

  const students: StudentProfile[] = (response?.results ?? []).map(
    (item, index) => {
      const profile = item.profile;

      const fullNameFromProfile = profile
        ? `${profile.name ?? ""} ${profile.surname ?? ""}`.trim()
        : "";

      const name =
        fullNameFromProfile ||
        (item.user as string | null) ||
        `Student ${index + 1}`;

      const country = profile?.country ?? null;
      const fieldOfStudy = profile?.currentFieldOfStudy ?? null;
      const supportPerYear = profile?.financialSupportPerYear ?? null;
      const supportDuration = profile?.financialSupportDuration ?? null;

      const supportLabel =
        supportPerYear != null
          ? `Approx. ${supportPerYear} per year${supportDuration != null ? ` for ${supportDuration} years` : ""}`
          : "Not specified";

      return {
        id: index + 1,
        name,
        role: profile?.currentStatus ?? "Student",
        locationDegree: country ?? "",
        university: country ? `Based in ${country}` : "",
        degree: fieldOfStudy || "Field not specified",
        year: "",
        support: supportLabel,
        languages: profile?.languages ?? [],
        currentStatus: profile?.currentStatus ?? null,
        fieldOfStudy,
        jobRole: profile?.jobRole ?? null,
        financialSupportPerYear: supportPerYear,
        financialSupportDuration: supportDuration,
        financialSupportReturn: profile?.financialSupportReturn ?? null,
        fieldScore: item.field_score,
        behaviourScore: item.behaviour_score,
        financialScore: item.financial_score,
        overallScore: item.overall_match,
        description:
          profile?.description ||
          item.summary_field ||
          item.summary_behaviour ||
          "No description provided.",
        stats: {
          field: Math.round(item.field_score ?? 0),
          finances: Math.round(item.financial_score ?? 0),
          behaviour: Math.round(item.behaviour_score ?? 0),
        },
        chart: "stacked",
      };
    },
  );

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === "overall") {
      const aOverall = a.overallScore ?? 0;
      const bOverall = b.overallScore ?? 0;
      return bOverall - aOverall;
    }
    return b.stats[sortBy] - a.stats[sortBy];
  });

  return (
    <div className="min-h-screen text-[#254031]">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 md:px-0">
        <header className="space-y-1">
          <h1 className={`${playfair.className} text-2xl md:text-3xl font-bold text-[#254031]`}>
            Discover students
          </h1>
          <p className="text-sm text-[#455B50]">
            Results based on your saved search preferences.
          </p>
        </header>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        {isSearching ? (
          <p className="text-sm text-muted-foreground">
            Searching for students based on your saved preferences...
          </p>
        ) : null}

        <div className="space-y-4">
          {response?.results?.length ? (
            <>
              <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
                <p className="text-[#455B50]">
                  {response.results.length} matching students
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground">Sorted by</span>
                  {([
                    ["overall", "Overall"],
                    ["field", "Field"],
                    ["finances", "Finances"],
                    ["behaviour", "Behaviour"],
                  ] as [
                    "field" | "finances" | "behaviour" | "overall",
                    string,
                  ][]).map(
                    ([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSortBy(key)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs transition",
                          sortBy === key
                            ? "border-[#254031] bg-[#254031] text-white"
                            : "border-slate-200 bg-white text-[#455B50] hover:border-[#254031]/40 hover:text-[#254031]",
                        )}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {sortedStudents.map((student) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onChat={() => {}}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base">No results yet</CardTitle>
                <CardDescription>
                  Configure your search preferences in the Preferences tab to
                  see matching students here.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
