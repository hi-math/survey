"use client";

import type { SurveyData } from "@/types/survey";
import {
  SECTION1_TITLE,
  SECTION1_QUESTIONS,
  SECTION1_COMMENTS,
} from "@/lib/survey-data";

interface SurveySection1Props {
  data: SurveyData;
  onChange: (data: Partial<SurveyData>) => void;
  errors?: Record<string, string>;
}

export default function SurveySection1({
  data,
  onChange,
  errors = {},
}: SurveySection1Props) {
  const toggleChoice = (
    field: "reason" | "expectation" | "highschool_science",
    value: string
  ) => {
    const current = data[field] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ [field]: next });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium px-1 mb-2" style={{ color: "var(--text-muted)" }}>
        {SECTION1_TITLE}
      </p>

      {SECTION1_QUESTIONS.map((q) => (
        <div key={q.name} className="survey-question">
          <div className="survey-question-bar">
            {q.title}
          </div>
          <div className="survey-card-head">
            <div className="flex-1 min-w-0">
              <div className="space-y-2">
                {q.choices.map((c) => (
                  <label
                    key={c.value}
                    className="flex items-start gap-3 cursor-pointer rounded-xl p-2.5 hover:bg-black/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(data[q.name as keyof SurveyData] as string[] | undefined)?.includes(c.value) ?? false}
                      onChange={() =>
                        toggleChoice(
                          q.name as "reason" | "expectation" | "highschool_science",
                          c.value
                        )
                      }
                      className="mt-0.5 rounded border-2 w-5 h-5 flex-shrink-0"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <span className="text-sm" style={{ color: "var(--text)" }}>{c.text}</span>
                  </label>
                ))}
                <label className="flex items-start gap-3 cursor-pointer rounded-xl p-2.5 hover:bg-black/5 transition-colors mt-2 flex-wrap">
                  <input
                    type="checkbox"
                    checked={
                      (data[q.name as keyof SurveyData] as string[] | undefined)?.includes("other") ?? false
                    }
                    onChange={() => {
                      const current = (data[q.name as keyof SurveyData] as string[] | undefined) ?? [];
                      const hasOther = current.includes("other");
                      const next = hasOther
                        ? current.filter((v) => v !== "other")
                        : [...current, "other"];
                      onChange({ [q.name]: next });
                    }}
                    className="mt-0.5 rounded border-2 w-5 h-5 flex-shrink-0"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <span className="text-sm pt-0.5" style={{ color: "var(--text)" }}>{q.otherText}</span>
                  <input
                    type="text"
                    value={
                      (data[`${q.name}Other` as keyof SurveyData] as string | undefined) ?? ""
                    }
                    onChange={(e) =>
                      onChange({
                        [`${q.name}Other`]: e.target.value,
                      } as Partial<SurveyData>)
                    }
                    placeholder={q.otherPlaceholder ?? ""}
                    className="flex-1 min-w-[140px] rounded-xl border-2 px-3 py-2 text-sm"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--text)",
                    }}
                  />
                </label>
              </div>
              {errors[q.name] && (
                <p className="mt-2 text-sm" style={{ color: "var(--primary)" }}>
                  {errors[q.name]}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {SECTION1_COMMENTS.map((c) => (
        <div key={c.name} className="survey-question">
          <div className="survey-question-bar">
            {c.title}
          </div>
          <div className="survey-card-head">
            <div className="flex-1 min-w-0">
              <p className="text-sm whitespace-pre-line mb-3" style={{ color: "var(--text-muted)" }}>
                {c.description}
              </p>
              <textarea
                value={(data[c.name as keyof SurveyData] as string | undefined) ?? ""}
                onChange={(e) => onChange({ [c.name]: e.target.value })}
                placeholder={c.placeholder}
                rows={c.rows}
                className="w-full rounded-xl border-2 px-3 py-2 resize-y text-sm outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--secondary)]"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text)",
                }}
              />
              {errors[c.name] && (
                <p className="mt-2 text-sm" style={{ color: "var(--primary)" }}>
                  {errors[c.name]}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
