"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  COUNTRIES,
  LANGUAGES,
  FIELDS_OF_STUDY,
  CURRENT_STATUSES,
  JOB_ROLES,
  FINANCIAL_SUPPORT_RETURN_OPTIONS,
} from "@/constants/metadata";
import { Search, SlidersHorizontal, Wallet } from "lucide-react";
import { DM_Serif_Display } from "next/font/google";

const playfair = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

type DiscoverPreferences = {
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

const DEFAULT_PREFERENCES: DiscoverPreferences = {
  believerText: "",
  age: "",
  country: [],
  languages: [],
  currentStatus: [],
  fieldOfStudy: [],
  jobRole: [],
  financialSupportPerYear: "",
  financialSupportDuration: "",
  financialSupportReturn: [],
};

export default function DiscoverPreferencesPage() {
  const [prefs, setPrefs] = useState<DiscoverPreferences>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem("discover-preferences");
      if (!stored) return;

      const parsed = JSON.parse(stored) as Partial<
        DiscoverPreferences & {
          age?: string;
          country?: string | string[];
          currentStatus?: string | string[];
          fieldOfStudy?: string | string[];
          jobRole?: string | string[];
          financialSupportReturn?: string | string[];
        }
      >;

      setPrefs((current) => {
        const next: DiscoverPreferences = {
          ...current,
          ...parsed,
        };

        next.languages = Array.isArray(parsed.languages)
          ? parsed.languages
          : current.languages;

        if (Array.isArray(parsed.country)) {
          next.country = parsed.country;
        } else if (typeof parsed.country === "string" && parsed.country) {
          next.country = [parsed.country];
        }

        if (Array.isArray(parsed.currentStatus)) {
          next.currentStatus = parsed.currentStatus;
        } else if (
          typeof parsed.currentStatus === "string" &&
          parsed.currentStatus
        ) {
          next.currentStatus = [parsed.currentStatus];
        }

        if (Array.isArray(parsed.fieldOfStudy)) {
          next.fieldOfStudy = parsed.fieldOfStudy;
        } else if (
          typeof parsed.fieldOfStudy === "string" &&
          parsed.fieldOfStudy
        ) {
          next.fieldOfStudy = [parsed.fieldOfStudy];
        }

        if (Array.isArray(parsed.jobRole)) {
          next.jobRole = parsed.jobRole;
        } else if (typeof parsed.jobRole === "string" && parsed.jobRole) {
          next.jobRole = [parsed.jobRole];
        }

        if (Array.isArray(parsed.financialSupportReturn)) {
          next.financialSupportReturn = parsed.financialSupportReturn;
        } else if (
          typeof parsed.financialSupportReturn === "string" &&
          parsed.financialSupportReturn
        ) {
          next.financialSupportReturn = [parsed.financialSupportReturn];
        }

        if (typeof parsed.age === "string" && parsed.age) {
          next.age = parsed.age;
        }

        return next;
      });
    } catch {
    }
  }, []);

  const handleSave = () => {
    if (typeof window === "undefined") return;

    setSaving(true);
    setSaved(false);

    try {
      window.localStorage.setItem("discover-preferences", JSON.stringify(prefs));
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="w-full space-y-8 mx-auto max-w-5xl pt-8">
      <header className="space-y-2">
        <h1 className={`${playfair.className} text-2xl md:text-3xl font-semibold text-[#254031]`}>
          Search preferences
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Define your default filters for discovering students. These will be pre-filled and used on the Discover page
          so you can run searches in a single click.
        </p>
      </header>

      <Card className="border-[rgba(69,91,80,0.16)] shadow-[0_18px_40px_rgba(37,64,49,0.04)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#254031]">Default filters</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Tune these options to match the type of students you usually look for. You can always override them on a
            single search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="space-y-3 rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#254031]">
                  <Search className="h-4 w-4" />
                </div>

            {showCountryPicker ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                <div className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#455B50]">
                        Countries
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Tap to toggle the countries you want to include.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowCountryPicker(false)}
                    >
                      Done
                    </Button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {COUNTRIES.map((c) => {
                        const selected = prefs.country.includes(c);
                        return (
                          <Button
                            key={c}
                            type="button"
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            onClick={() =>
                              setPrefs((prev) => ({
                                ...prev,
                                country: selected
                                  ? prev.country.filter((item) => item !== c)
                                  : [...prev.country, c],
                              }))
                            }
                          >
                            {c}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#455B50]">
                    Search intent
                  </p>
                  <p className="text-xs text-[#455B50]">
                    Describe in your own words who you want to support. We will use this as the core signal to match
                    students.
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label htmlFor="believerText">Believer text</Label>
                <Textarea
                  id="believerText"
                  value={prefs.believerText}
                  onChange={(e) =>
                    setPrefs((prev) => ({
                      ...prev,
                      believerText: e.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Describe the ideal students you want to discover, their goals, background, and what you can offer..."
                />
                <p className="text-xs text-muted-foreground">
                  A clear believer text usually leads to more relevant matches.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#254031]">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#455B50]">
                    Profile filters
                  </p>
                  <p className="text-xs text-[#455B50]">
                    Narrow down by location, status, languages, and study path. Leave fields empty to keep them broad.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min={0}
                    value={prefs.age}
                    onChange={(e) =>
                      setPrefs((prev) => ({ ...prev, age: e.target.value }))
                    }
                    placeholder="Any"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty if age is not important.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Current status</Label>
                  <div className="flex flex-wrap gap-2">
                    {CURRENT_STATUSES.map((status) => {
                      const selected = prefs.currentStatus.includes(status);
                      return (
                        <Button
                          key={status}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setPrefs((prev) => ({
                              ...prev,
                              currentStatus: selected
                                ? prev.currentStatus.filter((s) => s !== status)
                                : [...prev.currentStatus, status],
                            }))
                          }
                        >
                          {status}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {prefs.currentStatus.length
                      ? `Selected: ${prefs.currentStatus.join(", ")}`
                      : "Select one or more statuses (optional)."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Countries</Label>
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex-1 text-xs text-muted-foreground">
                      {prefs.country.length
                        ? `Selected: ${prefs.country.join(", ")}`
                        : "Select one or more countries (optional)."}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCountryPicker(true)}
                    >
                      Edit selection
                    </Button>
                  </div>
                  {prefs.country.length ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {prefs.country.map((c) => (
                        <Button
                          key={c}
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() =>
                            setPrefs((prev) => ({
                              ...prev,
                              country: prev.country.filter((item) => item !== c),
                            }))
                          }
                        >
                          {c}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="space-y-2">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => {
                    const selected = prefs.languages.includes(lang);
                    return (
                      <Button
                        key={lang}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setPrefs((prev) => ({
                            ...prev,
                            languages: selected
                              ? prev.languages.filter((l) => l !== lang)
                              : [...prev.languages, lang],
                          }))
                        }
                      >
                        {lang}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {prefs.languages.length
                    ? `Selected: ${prefs.languages.join(", ")}`
                    : "Select one or more languages (optional)."}
                </p>
              </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Fields of study</Label>
                  <div className="flex flex-wrap gap-2">
                    {FIELDS_OF_STUDY.map((field) => {
                      const selected = prefs.fieldOfStudy.includes(field);
                      return (
                        <Button
                          key={field}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setPrefs((prev) => ({
                              ...prev,
                              fieldOfStudy: selected
                                ? prev.fieldOfStudy.filter((f) => f !== field)
                                : [...prev.fieldOfStudy, field],
                            }))
                          }
                        >
                          {field}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {prefs.fieldOfStudy.length
                      ? `Selected: ${prefs.fieldOfStudy.join(", ")}`
                      : "Select one or more fields (optional)."}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Job roles</Label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_ROLES.map((role) => {
                      const selected = prefs.jobRole.includes(role);
                      return (
                        <Button
                          key={role}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setPrefs((prev) => ({
                              ...prev,
                              jobRole: selected
                                ? prev.jobRole.filter((r) => r !== role)
                                : [...prev.jobRole, role],
                            }))
                          }
                        >
                          {role}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {prefs.jobRole.length
                      ? `Selected: ${prefs.jobRole.join(", ")}`
                      : "Select one or more job roles (optional)."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-[rgba(69,91,80,0.16)] bg-[#F3F6F4] px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#254031]">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#455B50]">
                    Financial filters
                  </p>
                  <p className="text-xs text-[#455B50]">
                    Optional filters to reflect how much support you are considering and in which form.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="financialSupportPerYear">Financial support per year</Label>
                  <Input
                    id="financialSupportPerYear"
                    type="number"
                    min={0}
                    value={prefs.financialSupportPerYear}
                    onChange={(e) =>
                      setPrefs((prev) => ({
                        ...prev,
                        financialSupportPerYear: e.target.value,
                      }))
                    }
                    placeholder="Any"
                  />
                  <p className="text-xs text-muted-foreground">
                    Approximate amount you are willing to provide per year.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financialSupportDuration">Financial support duration (years)</Label>
                  <Input
                    id="financialSupportDuration"
                    type="number"
                    min={0}
                    value={prefs.financialSupportDuration}
                    onChange={(e) =>
                      setPrefs((prev) => ({
                        ...prev,
                        financialSupportDuration: e.target.value,
                      }))
                    }
                    placeholder="Any"
                  />
                  <p className="text-xs text-muted-foreground">How many years of support you are considering.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Financial support return modalities</Label>
                <div className="flex flex-wrap gap-2">
                  {FINANCIAL_SUPPORT_RETURN_OPTIONS.map((opt) => {
                    const selected = prefs.financialSupportReturn.includes(opt);
                    return (
                      <Button
                        key={opt}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setPrefs((prev) => ({
                            ...prev,
                            financialSupportReturn: selected
                              ? prev.financialSupportReturn.filter((o) => o !== opt)
                              : [...prev.financialSupportReturn, opt],
                          }))
                        }
                      >
                        {opt}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {prefs.financialSupportReturn.length
                    ? `Selected: ${prefs.financialSupportReturn.join(", ")}`
                    : "Select one or more modalities (optional)."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save preferences"}
              </Button>
              {saved ? (
                <p className="text-xs text-muted-foreground">
                  Preferences saved. They will be applied automatically on the Discover page.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground sm:ml-2">
                  Changes are stored locally in this browser and can be updated anytime.
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
