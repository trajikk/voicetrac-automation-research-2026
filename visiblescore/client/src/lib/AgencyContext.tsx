import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type AgencySettings } from "./api.ts";

interface AgencyContextValue {
  settings: AgencySettings | null;
  refresh: () => void;
}

const AgencyContext = createContext<AgencyContextValue>({ settings: null, refresh: () => {} });

export function AgencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AgencySettings | null>(null);

  const refresh = useCallback(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return <AgencyContext.Provider value={{ settings, refresh }}>{children}</AgencyContext.Provider>;
}

export function useAgency() {
  return useContext(AgencyContext);
}
