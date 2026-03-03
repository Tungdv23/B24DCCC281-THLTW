export type Lesson = {
  id: string
  ngay: string
  time: number
  noidung: string
  note: string
};

export type Subject = {
  id: string;
  name: string;
  lessons: Lesson[];
};

export type Data = {
  subjects: Subject[];
  targets: Record<string, number>;
};

export const STORAGE_KEY = 'datacuaMaus';

export const loadData = (): Data => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { subjects: [], targets: {} };
    return JSON.parse(raw) as Data;
  } catch {
    return { subjects: [], targets: {} };
  }
};

export const saveData = (d: Data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

export const uid = () => Math.random().toString(36).slice(2, 9);
