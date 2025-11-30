"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GraduationCap, MapPin, Award } from "lucide-react";
import { RadialBar, RadialBarChart } from "recharts";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

type StudentDetail = {
  displayName: string;
  country: string | null;
  currentStatus: string | null;
  fieldOfStudy: string | null;
  jobRole: string | null;
  age: number | null;
  languages: string[];
  description: string;
  summaryField: string | null;
  summaryBehaviour: string | null;
  financialSupportPerYear: number | null;
  financialSupportDuration: number | null;
  financialSupportReturn: string | null;
  scores: {
    overall: number;
    field: number;
    behaviour: number;
    finances: number;
  };
};

const MOCK_CV = [
  {
    title: "BSc Computer Science",
    subtitle: "University program",
    period: "2023 - Present",
    description:
      "Studying core computer science topics with a focus on AI and data-intensive applications.",
  },
  {
    title: "Part-time software role",
    subtitle: "Tech startup",
    period: "2022 - Present",
    description:
      "Contributing to product features, debugging, and collaborating in a small engineering team.",
  },
];

const MOCK_PROJECTS = [
  {
    title: "Scholarship tracking dashboard",
    description:
      "Built a small web app to track scholarships, deadlines, and documents, used by a group of classmates.",
  },
  {
    title: "Open-source contribution",
    description:
      "Contributed bug fixes and documentation improvements to a popular JavaScript library.",
  },
  {
    title: "Community mentoring",
    description:
      "Volunteered as a mentor for younger students applying to universities abroad.",
  },
];

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
] as const;

export default function StudentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem("discover-last-search");
      if (!raw) {
        setError(
          "No Discover results found. Run a search in the Discover tab before opening a student profile.",
        );
        return;
      }

      const parsed = JSON.parse(raw) as { response?: DiscoverResponse };
      const response = parsed.response;
      if (!response || !Array.isArray(response.results)) {
        setError("Saved Discover results are not available.");
        return;
      }

      const index = Number(params.id) - 1;
      if (!Number.isFinite(index) || index < 0 || index >= response.results.length) {
        setError("This student could not be found in the latest Discover results.");
        return;
      }

      const item = response.results[index];
      const profile = item.profile;

      const fullNameFromProfile = profile
        ? `${profile.name ?? ""} ${profile.surname ?? ""}`.trim()
        : "";
      const displayName =
        fullNameFromProfile || (item.user as string | null) || `Student ${index + 1}`;

      const detail: StudentDetail = {
        displayName,
        country: profile?.country ?? null,
        currentStatus: profile?.currentStatus ?? null,
        fieldOfStudy: profile?.currentFieldOfStudy ?? null,
        jobRole: profile?.jobRole ?? null,
        age: profile?.age ?? null,
        languages: profile?.languages ?? [],
        description: profile?.description || "No description provided.",
        summaryField: item.summary_field ?? null,
        summaryBehaviour: item.summary_behaviour ?? null,
        financialSupportPerYear: profile?.financialSupportPerYear ?? null,
        financialSupportDuration: profile?.financialSupportDuration ?? null,
        financialSupportReturn: profile?.financialSupportReturn ?? null,
        scores: {
          overall: item.overall_match ?? 0,
          field: item.field_score ?? 0,
          behaviour: item.behaviour_score ?? 0,
          finances: item.financial_score ?? 0,
        },
      };

      setStudent(detail);
    } catch {
      setError("Failed to read cached Discover data.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12">
          <p className="text-sm text-slate-500">Loading student profile...</p>
        </main>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto flex max-w-5xl items-center justify-center px-4 py-12">
          <Card>
            <CardContent className="p-6 text-sm text-slate-700">
              <p className="font-medium">{error ?? "Student not found."}</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const firstName = student.displayName.split(" ")[0];
  const locationLabel = student.country ?? "Location not specified";
  const languagesLabel = student.languages.length
    ? student.languages.join(", ")
    : "Not specified";

  const supportPerYearLabel =
    student.financialSupportPerYear != null
      ? `${student.financialSupportPerYear}`
      : "Not specified";
  const supportDurationLabel =
    student.financialSupportDuration != null
      ? `${student.financialSupportDuration} years`
      : "Not specified";

  const initials = student.displayName
    .split(" ")
    .map((n) => n[0])
    .join("");
  const numericId = Number(params.id);
  const coverImageUrl =
    COVER_IMAGES[
      Number.isFinite(numericId)
        ? (numericId - 1 + COVER_IMAGES.length) % COVER_IMAGES.length
        : 0
    ];

  return (
    <div className="min-h-[520px] text-[#254031]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-fit text-xs text-[#455B50] transition-colors hover:text-[#254031]"
        >
          Back to results
        </button>

        <section className="overflow-hidden rounded-3xl border border-[rgba(69,91,80,0.16)] bg-white/95 shadow-[0_18px_40px_rgba(37,64,49,0.08)]">
          <div className="relative h-56 w-full overflow-hidden sm:h-64">
            <Image
              src={coverImageUrl}
              alt={student.displayName}
              fill
              sizes="(min-width: 768px) 900px, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#254031]/85 via-[#254031]/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#E5ECE7]/60 bg-[#F3F6F4]/10 text-lg font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.4)]">
                  {initials}
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold text-white">
                    {student.displayName}
                  </h1>
                  <p className="flex items-center gap-2 text-[11px] text-[#D2E0D8]">
                    <MapPin className="h-3 w-3" />
                    <span>{locationLabel}</span>
                  </p>
                  {student.currentStatus ? (
                    <p className="text-xs text-[#E5ECE7]">{student.currentStatus}</p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <div className="rounded-full bg-black/15 px-4 py-1 text-[11px] text-[#E5ECE7] backdrop-blur">
                  Overall match
                  <span className="ml-1 font-semibold">
                    {student.scores.overall.toFixed(1)}%
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="h-9 rounded-full bg-white px-4 text-xs font-medium text-[#254031] hover:bg-[#E5ECE7]"
                    onClick={() =>
                      router.push(
                        `/genie/chat?student=${encodeURIComponent(student.displayName)}`,
                      )
                    }
                  >
                    Chat with {firstName}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-6 py-6 md:px-8 md:py-7">
            <div className="space-y-4 text-sm text-[#455B50]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A9183] md:text-sm">
                Profile details
              </h2>
              <div className="grid gap-4 sm:grid-cols-5">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Field of study
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {student.fieldOfStudy ?? "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Current role
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {student.jobRole ?? student.currentStatus ?? "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Location
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {locationLabel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Age
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {student.age ?? "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Languages
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {languagesLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#455B50]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7A9183] md:text-sm">
                Financial support
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Support per year
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {supportPerYearLabel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Duration
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {supportDurationLabel}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A9183]">
                    Return modality
                  </p>
                  <p className="text-sm font-medium text-[#254031]">
                    {student.financialSupportReturn ?? "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <CompatibilityCard scores={student.scores} />
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <Card className="border-[rgba(69,91,80,0.16)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-[#254031]">Student story</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-[#455B50]">
                  {student.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-[rgba(69,91,80,0.16)]">
              <CardHeader>
                <CardTitle className="text-sm text-[#254031]">AI view on fit</CardTitle>
                <CardDescription className="text-xs text-[#455B50]">
                  Generated from the investor queries about field and behaviour.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-[#455B50]">
                {student.summaryField ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A9183]">
                      Field match
                    </p>
                    <p>{student.summaryField}</p>
                  </div>
                ) : null}
                {student.summaryBehaviour ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A9183]">
                      Behaviour match
                    </p>
                    <p>{student.summaryBehaviour}</p>
                  </div>
                ) : null}
                {!student.summaryField && !student.summaryBehaviour ? (
                  <p className="text-xs text-[#7A9183]">
                    No AI summaries are available for this student yet.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-[rgba(69,91,80,0.16)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-[#254031]">
                  <GraduationCap className="h-4 w-4 text-[#455B50]" />
                  CV
                </CardTitle>
                <CardDescription className="text-xs text-[#455B50]">
                  Example education and experience entries.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_CV.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-[#254031]">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#7A9183]">{item.period}</p>
                    </div>
                    <p className="text-xs text-[#7A9183]">{item.subtitle}</p>
                    <p className="text-xs text-[#455B50]">{item.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[rgba(69,91,80,0.16)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-[#254031]">
                  <Award className="h-4 w-4 text-[#455B50]" />
                  Personal projects & achievements
                </CardTitle>
                <CardDescription className="text-xs text-[#455B50]">
                  Mock examples of work and impact.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {MOCK_PROJECTS.map((project) => (
                  <div key={project.title} className="space-y-1">
                    <p className="text-sm font-medium text-[#254031]">
                      {project.title}
                    </p>
                    <p className="text-xs text-[#455B50]">{project.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

const compatibilityChartConfig = {
  field: {
    label: "Passions",
    color: "#254031",
  },
  finances: {
    label: "Finance",
    color: "#455B50",
  },
  behaviour: {
    label: "Mindset",
    color: "#A0B5A8",
  },
} satisfies ChartConfig;

function CompatibilityCard({
  scores,
}: {
  scores: StudentDetail["scores"];
}) {
  const chartData = [
    {
      name: "Passions",
      key: "field",
      value: scores.field,
      fill: compatibilityChartConfig.field.color,
    },
    {
      name: "Finance",
      key: "finances",
      value: scores.finances,
      fill: compatibilityChartConfig.finances.color,
    },
    {
      name: "Mindset",
      key: "behaviour",
      value: scores.behaviour,
      fill: compatibilityChartConfig.behaviour.color,
    },
  ];

  const centerValue = scores.overall.toFixed(1);

  return (
    <Card className="border-[rgba(69,91,80,0.16)] bg-[#F3F6F4]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-[#254031]">Compatibility overview</CardTitle>
        <CardDescription className="text-xs text-[#455B50]">
          Passions, mindset, and financial scores are each on a 0–100 scale.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex flex-1 items-center justify-center">
            <ChartContainer
              config={compatibilityChartConfig}
              className="relative h-[160px] w-full max-w-[260px] overflow-visible"
            >
              <RadialBarChart
                width={260}
                height={160}
                cx="50%"
                cy="75%"
                innerRadius={80}
                outerRadius={130}
                startAngle={180}
                endAngle={0}
                data={chartData}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <RadialBar
                  dataKey="value"
                  background
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex translate-y-3 items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-[#254031]">{centerValue}%</div>
                <div className="text-[11px] text-[#7A9183]">Overall</div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs text-[#455B50]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: compatibilityChartConfig.field.color }}
                />
                <span>Passions</span>
              </span>
              <span className="font-semibold">{scores.field.toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: compatibilityChartConfig.finances.color }}
                />
                <span>Finance</span>
              </span>
              <span className="font-semibold">{scores.finances.toFixed(0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: compatibilityChartConfig.behaviour.color }}
                />
                <span>Mindset</span>
              </span>
              <span className="font-semibold">{scores.behaviour.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
