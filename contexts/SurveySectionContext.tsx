"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface SurveySectionState {
  sectionTitle: string | null;
  pageLabel: string | null;
}

interface SurveySectionContextValue extends SurveySectionState {
  setSectionTitle: (state: SurveySectionState) => void;
}

const SurveySectionContext = createContext<SurveySectionContextValue | null>(null);

export function SurveySectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SurveySectionState>({
    sectionTitle: null,
    pageLabel: null,
  });
  const setSectionTitle = useCallback((s: SurveySectionState) => setState(s), []);
  return (
    <SurveySectionContext.Provider value={{ ...state, setSectionTitle }}>
      {children}
    </SurveySectionContext.Provider>
  );
}

export function useSurveySection() {
  const ctx = useContext(SurveySectionContext);
  return ctx;
}
