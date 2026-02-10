"use client";

import { useState, useCallback } from "react";
import type { SurveyData } from "@/types/survey";
import { MATRIX_ROWS } from "@/lib/survey-data";
import SurveySection1 from "./SurveySection1";
import SurveySection2 from "./SurveySection2";

interface CustomSurveyProps {
  initialData?: SurveyData | null;
  onSubmit: (data: SurveyData) => Promise<void>;
}

export default function CustomSurvey({
  initialData,
  onSubmit,
}: CustomSurveyProps) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<SurveyData>(() => ({
    reason: initialData?.reason ?? [],
    reasonOther: initialData?.reasonOther ?? "",
    expectation: initialData?.expectation ?? [],
    expectationOther: initialData?.expectationOther ?? "",
    highschool_science: initialData?.highschool_science ?? [],
    highschool_scienceOther: initialData?.highschool_scienceOther ?? "",
    university_courses: initialData?.university_courses ?? "",
    science_interest: initialData?.science_interest ?? "",
    science_attitude: initialData?.science_attitude ?? {},
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const updateData = useCallback((partial: Partial<SurveyData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(partial).forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const validateSection1 = (): boolean => {
    const err: Record<string, string> = {};
    if (!data.reason?.length) err.reason = "1번 문항에 응답해 주세요.";
    if (!data.expectation?.length) err.expectation = "2번 문항에 응답해 주세요.";
    if (!data.highschool_science?.length)
      err.highschool_science = "3번 문항에 응답해 주세요.";
    const courses = (data.university_courses ?? "").trim();
    if (!courses) err.university_courses = "4번 문항에 응답해 주세요.";
    const interest = (data.science_interest ?? "").trim();
    if (!interest) err.science_interest = "5번 문항에 응답해 주세요.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateSection2 = (): boolean => {
    const missing = MATRIX_ROWS.filter(
      (r) => !data.science_attitude?.[r.value as keyof typeof data.science_attitude]
    );
    if (missing.length > 0) {
      setErrors({
        science_attitude: "모든 문항에 응답해 주세요. (미응답 행이 있습니다)",
      });
      return false;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next.science_attitude;
      return next;
    });
    return true;
  };

  const handleNext = () => {
    if (page === 0 && !validateSection1()) return;
    setPage(1);
  };

  const handlePrev = () => setPage(0);

  const handleSubmit = async () => {
    if (!validateSection2()) return;
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-frame pb-10">
      {page === 0 && (
        <SurveySection1
          data={data}
          onChange={updateData}
          errors={errors}
        />
      )}
      {page === 1 && (
        <SurveySection2
          data={data}
          onChange={updateData}
          errors={errors}
        />
      )}

      {/* 하단 버튼 영역: 스크린샷처럼 큰 오렌지 버튼 + 아이콘 */}
      <div className="flex gap-3 justify-center mt-8 flex-wrap">
        {page === 1 ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="px-6 py-3.5 rounded-xl font-semibold border-2 transition-opacity hover:opacity-90"
              style={{
                borderColor: "var(--secondary)",
                color: "var(--secondary)",
                background: "var(--card-bg)",
              }}
            >
              이전
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--primary)" }}
            >
              {submitting ? "제출 중…" : "제출하기"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}
