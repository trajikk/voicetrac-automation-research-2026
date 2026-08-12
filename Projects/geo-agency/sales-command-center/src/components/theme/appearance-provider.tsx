"use client";

import { createContext, useCallback, useContext, useState } from "react";
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  FONT_FAMILY_STORAGE_KEY,
  FONT_SIZE_STORAGE_KEY,
  isFontFamily,
  isFontSize,
  type FontFamily,
  type FontSize,
} from "@/lib/appearance";

interface AppearanceContextValue {
  fontFamily: FontFamily;
  fontSize: FontSize;
  setFontFamily: (font: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

function readInitialFont(): FontFamily {
  if (typeof window === "undefined") return DEFAULT_FONT_FAMILY;
  const stored = window.localStorage.getItem(FONT_FAMILY_STORAGE_KEY);
  return isFontFamily(stored) ? stored : DEFAULT_FONT_FAMILY;
}

function readInitialSize(): FontSize {
  if (typeof window === "undefined") return DEFAULT_FONT_SIZE;
  const stored = window.localStorage.getItem(FONT_SIZE_STORAGE_KEY);
  return isFontSize(stored) ? stored : DEFAULT_FONT_SIZE;
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [fontFamily, setFontFamilyState] = useState<FontFamily>(readInitialFont);
  const [fontSize, setFontSizeState] = useState<FontSize>(readInitialSize);

  const setFontFamily = useCallback((font: FontFamily) => {
    setFontFamilyState(font);
    localStorage.setItem(FONT_FAMILY_STORAGE_KEY, font);
    document.documentElement.setAttribute("data-font", font);
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
    document.documentElement.setAttribute("data-font-size", size);
  }, []);

  return (
    <AppearanceContext.Provider value={{ fontFamily, fontSize, setFontFamily, setFontSize }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used within an AppearanceProvider");
  return ctx;
}
