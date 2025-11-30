"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RadialBar, RadialBarChart } from "recharts";
import { Globe2, GraduationCap, MessageCircle, MoveUpRight, Wallet, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type StudentProfile = {
  id: number;
  name: string;
  role: string;
  locationDegree: string;
  university: string;
  degree: string;
  year: string;
  support: string;
  languages?: string[];
  currentStatus?: string | null;
  fieldOfStudy?: string | null;
  jobRole?: string | null;
  financialSupportPerYear?: number | null;
  financialSupportDuration?: number | null;
  financialSupportReturn?: string | null;
  fieldScore?: number;
  behaviourScore?: number;
  financialScore?: number;
  overallScore?: number;
  description: string;
  stats: {
    field: number;
    finances: number;
    behaviour: number;
  };
  chart: "stacked" | "simple";
};

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

export function StudentCard({
  student,
  onChat,
}: {
  student: StudentProfile;
  onChat: (name: string) => void;
}) {
  const router = useRouter();
  const coverImageUrl =
    COVER_IMAGES[(student.id - 1 + COVER_IMAGES.length) % COVER_IMAGES.length];
  const firstName = student.name.split(" ")[0];

  const languagesLabel =
    (student.languages && student.languages.length
      ? student.languages.join(", ")
      : "Not specified") || "Not specified";

  const status = student.currentStatus ?? "Not specified";
  const normalizedStatus = student.currentStatus?.toLowerCase() ?? "";
  const showFieldOfStudy =
    normalizedStatus.includes("high school") ||
    normalizedStatus.includes("university") ||
    normalizedStatus.includes("working + studying");
  const showJobRole =
    normalizedStatus.includes("working + studying") ||
    normalizedStatus.includes("only working");

  const supportPerYearLabel =
    student.financialSupportPerYear != null
      ? String(student.financialSupportPerYear)
      : "Not specified";
  const supportDurationLabel =
    student.financialSupportDuration != null
      ? `${student.financialSupportDuration} years`
      : "Not specified";
  const supportReturnLabel = formatReturnModality(
    student.financialSupportReturn
  );

  return (
    <Link href={`/genie/students/${student.id}`}>
      <Card className="py-0 group cursor-pointer overflow-hidden rounded-3xl border border-[rgba(69,91,80,0.16)] bg-white/95 shadow-[0_14px_30px_rgba(37,64,49,0.06)] transition hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(37,64,49,0.16)]">
        {/* Cover */}
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <Image
            src={coverImageUrl}
            alt={student.name}
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#254031]/80 via-[#254031]/35 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-base sm:text-lg font-semibold text-white drop-shadow-sm">
                {student.name}
              </p>
              <p className="text-[11px] text-slate-100/90">
                {student.locationDegree}
              </p>
            </div>
            <Badge className="rounded-full bg-[#254031] px-3 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur">
              {student.role}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 sm:p-5 text-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-stretch">
            {/* Left: profile details */}
            <div className="w-full md:w-[100%] flex h-full flex-col gap-2">
              <div className="grid gap-3 sm:grid-cols-3">
                <InfoSection
                  icon={Globe2}
                  title="Country"
                >
                  <InfoRow label="Languages" value={languagesLabel} />
                  <InfoRow
                    label="Country"
                    value={student.locationDegree || "Not specified"}
                  />
                </InfoSection>

                <InfoSection
                  icon={GraduationCap}
                  title="Status & study"
                >
                  <InfoRow label="Status" value={status} />
                  {showFieldOfStudy && (
                    <InfoRow
                      label="Field of study"
                      value={student.fieldOfStudy || "Not specified"}
                    />
                  )}
                  {showJobRole && (
                    <InfoRow
                      label="Job role"
                      value={student.jobRole || "Not specified"}
                    />
                  )}
                </InfoSection>

                <InfoSection icon={Wallet} title="Financials">
                  <InfoRow
                    label="Per year"
                    value={supportPerYearLabel}
                  />
                  <InfoRow
                    label="Duration"
                    value={supportDurationLabel}
                  />
                  <InfoRow label="Return" value={supportReturnLabel} />
                </InfoSection>
              </div>

              <div
                className="text-xs leading-relaxed text-[#455B50] sm:mt-2"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {student.description}
              </div>
            </div>

            {/* Right: match panel */}
            <div className="w-full md:w-[50%] space-y-3 md:mt-0">
              {student.chart === "stacked" ? (
                <ChartRadialStacked
                  stats={student.stats}
                  overallScore={student.overallScore}
                />
              ) : (
                <ChartRadialSimple
                  stats={student.stats}
                  overallScore={student.overallScore}
                />
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 h-[42px] rounded-2xl border border-[rgba(69,91,80,0.16)] bg-white font-medium text-[#254031] transition-colors hover:bg-[#E5ECE7]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/genie/students/${student.id}`);
              }}
            >
              <MoveUpRight size={20} />
              View profile
            </button>
            <button
              type="button"
              className="w-full sm:w-1/2 h-[42px] flex items-center gap-2 justify-center rounded-2xl bg-[#254031] font-medium text-white transition-colors hover:bg-[#1c3125]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChat(student.name);
                router.push(`/genie/chat?student=${encodeURIComponent(student.name)}`);
              }}
            >
              <MessageCircle size={20} />
              Chat with {firstName}
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CompatibilityBlock({
  fieldScore,
  behaviourScore,
  financialScore,
  overallScore,
}: {
  fieldScore?: number;
  behaviourScore?: number;
  financialScore?: number;
  overallScore?: number;
}) {
  const fieldLabel =
    fieldScore !== undefined ? `${fieldScore.toFixed(1)}%` : "-";
  const behaviourLabel =
    behaviourScore !== undefined ? `${behaviourScore.toFixed(1)}%` : "-";
  const financialLabel =
    financialScore !== undefined ? `${financialScore.toFixed(1)}%` : "-";
  const overallLabel =
    overallScore !== undefined ? `${overallScore.toFixed(1)}%` : "-";

  return (
    <div className="flex w-full flex-col justify-between gap-3 rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] p-3 text-xs">
      <div>
        <div className="mb-1 text-[11px] font-semibold uppercase text-[#455B50]">
          Compatibility
        </div>
        <div className="space-y-1">
          <div className="flex items-center flex gap-2">
            <span>Passion</span>
            <span className="font-mono text-[#254031]">{fieldLabel}</span>
          </div>
          <div className="flex items-center flex gap-2">
            <span>Behaviour</span>
            <span className="font-mono text-[#254031]">{behaviourLabel}</span>
          </div>
          <div className="flex items-center flex gap-2">
            <span>Financial</span>
            <span className="font-mono text-[#254031]">{financialLabel}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="font-medium">Overall</span>
            <span className="font-mono font-semibold text-[#254031]">{overallLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatReturnModality(value: string | null | undefined): string {
  if (!value) return "Not specified";
  switch (value) {
    case "Philanthropy":
      return "Grant";
    case "Income_Share":
      return "Income share";
    case "Work_Back_Service":
      return "Work-back service";
    case "Unspecified":
      return "Unspecified";
    default:
      return value;
  }
}

type InfoSectionProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
};

function InfoSection({ icon: Icon, title, children }: InfoSectionProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] px-3 py-3">
      <div className="flex items-center gap-1">
        <div className="flex h-7 w-7 items-center justify-center text-[#254031]">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#455B50]">
          {title}
        </span>
      </div>
      <div className="space-y-1 text-xs text-[#254031]">{children}</div>
    </div>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[11px] text-[#455B50]">{label}</span>
      <span className="text-xs font-medium text-[#254031] text-right">
        {value}
      </span>
    </div>
  );
}

const chartConfig = {
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

function ChartCategoryLegend({
  field,
  finances,
  behaviour,
}: {
  field: number;
  finances: number;
  behaviour: number;
}) {
  return (
    <div className="mt-3 grid w-full grid-cols-3 gap-2 text-[11px]">
      <div className="flex items-center gap-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: chartConfig.field.color }}
        />
        <span className="text-[#455B50]">Passions</span>
        <span className="ml-auto font-semibold">{field}%</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: chartConfig.finances.color }}
        />
        <span className="text-[#455B50]">Finance</span>
        <span className="ml-auto font-semibold">{finances}%</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: chartConfig.behaviour.color }}
        />
        <span className="text-[#455B50]">Mindset</span>
        <span className="ml-auto font-semibold">{behaviour}%</span>
      </div>
    </div>
  );
}

function ChartRadialStacked({
  stats,
  overallScore,
}: {
  stats: { field: number; finances: number; behaviour: number };
  overallScore?: number;
}) {
  const { field, finances, behaviour } = stats;

  const chartData = [
    { name: "Field", key: "field", value: field, fill: chartConfig.field.color },
    {
      name: "Finances",
      key: "finances",
      value: finances,
      fill: chartConfig.finances.color,
    },
    {
      name: "Behaviour",
      key: "behaviour",
      value: behaviour,
      fill: chartConfig.behaviour.color,
    },
  ];

  const centerValue =
    overallScore !== undefined ? overallScore.toFixed(1) : String(field + finances + behaviour);

  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] p-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#455B50]">
            Match score
          </p>
          <p className="mt-1 text-sm font-semibold text-[#254031]">
            Profile fit
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center relative">
        <ChartContainer
          config={chartConfig}
          className="relative h-[150px] w-full max-w-[220px] overflow-visible"
        >
          <RadialBarChart
            width={220}
            height={150}
            cx="50%"
            cy="75%"
            innerRadius={70}
            outerRadius={120}
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
            <div className="text-xl font-bold text-[#254031]">
              {centerValue}%
            </div>
            <div className="text-[11px] text-[#455B50]">Overall</div>
          </div>
        </div>
      </div>
      <ChartCategoryLegend field={field} finances={finances} behaviour={behaviour} />
    </div>
  );
}

function ChartRadialSimple({
  stats,
  overallScore,
}: {
  stats: { field: number; finances: number; behaviour: number };
  overallScore?: number;
}) {
  const { field, finances, behaviour } = stats;

  const centerValue =
    overallScore !== undefined ? overallScore.toFixed(1) : String(field + finances + behaviour);

  const chartData = [
    { name: "Field", key: "field", value: field, fill: chartConfig.field.color },
    {
      name: "Finances",
      key: "finances",
      value: finances,
      fill: chartConfig.finances.color,
    },
    {
      name: "Behaviour",
      key: "behaviour",
      value: behaviour,
      fill: chartConfig.behaviour.color,
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] p-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#455B50]">
            Match score
          </p>
          <p className="mt-1 text-sm font-semibold text-[#254031]">
            Profile fit
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center relative">
        <ChartContainer
          config={chartConfig}
          className="relative h-[150px] w-full max-w-[220px] overflow-visible"
        >
          <RadialBarChart
            width={220}
            height={150}
            cx="50%"
            cy="75%"
            innerRadius={70}
            outerRadius={120}
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
            <div className="text-xl font-bold text-[#254031]">
              {centerValue}%
            </div>
            <div className="text-[11px] text-[#455B50]">Overall</div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-[#455B50]">
        Passions, mindset, and finance add up to 100%.
      </div>
      <ChartCategoryLegend field={field} finances={finances} behaviour={behaviour} />
    </div>
  );
}
