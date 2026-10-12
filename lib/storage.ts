import {
  INITIAL_MODULES,
  INITIAL_SCHEDULES,
  INITIAL_COMPLAINTS,
  ModuleItem,
  CounselingSchedule,
  AnonymousComplaint,
  MoodLog,
} from "./mock-data";

const STORAGE_KEYS = {
  MODULES: "sahabat_bk_modules",
  SCHEDULES: "sahabat_bk_schedules",
  COMPLAINTS: "sahabat_bk_complaints",
  MOODS: "sahabat_bk_moods",
  CURRENT_USER: "sahabat_bk_current_user",
};

export const getStoredModules = (): ModuleItem[] => {
  if (typeof window === "undefined") return INITIAL_MODULES;
  const raw = localStorage.getItem(STORAGE_KEYS.MODULES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(INITIAL_MODULES));
    return INITIAL_MODULES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_MODULES;
  }
};

export const saveStoredModules = (modules: ModuleItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
};

export const getStoredSchedules = (): CounselingSchedule[] => {
  if (typeof window === "undefined") return INITIAL_SCHEDULES;
  const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
    return INITIAL_SCHEDULES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_SCHEDULES;
  }
};

export const saveStoredSchedules = (schedules: CounselingSchedule[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
};

export const getStoredComplaints = (): AnonymousComplaint[] => {
  if (typeof window === "undefined") return INITIAL_COMPLAINTS;
  const raw = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_COMPLAINTS;
  }
};

export const saveStoredComplaints = (complaints: AnonymousComplaint[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
};

export const getStoredMoods = (): MoodLog[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEYS.MOODS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveMoodLog = (moodLog: MoodLog) => {
  if (typeof window === "undefined") return;
  const existing = getStoredMoods().filter((m) => m.date !== moodLog.date);
  existing.push(moodLog);
  localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(existing));
};
