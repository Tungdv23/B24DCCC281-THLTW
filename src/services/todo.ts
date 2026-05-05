export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string; // ISO date
  priority?: 'Cao' | 'Trung bình' | 'Thấp';
  tags?: string[];
  status: TaskStatus;
  createdAt?: string;
}

const KEY = 'todo_tasks_v1';

function load(): Task[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Task[] : [];
  } catch (e) {
    return [];
  }
}

function save(data: Task[]) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
}

let tasks: Task[] = load();
let idCounter = tasks.reduce((m, r) => Math.max(m, r.id), 0);

export async function getTasks(): Promise<Task[]> {
  tasks = load();
  return [...tasks];
}

export async function addTask(payload: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const rec: Task = { id: ++idCounter, createdAt: new Date().toISOString(), ...payload } as Task;
  tasks.unshift(rec);
  save(tasks);
  return rec;
}

export async function updateTask(id: number, payload: Partial<Task>): Promise<Task | undefined> {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return undefined;
  tasks[idx] = { ...tasks[idx], ...payload };
  save(tasks);
  return tasks[idx];
}

export async function deleteTask(id: number): Promise<boolean> {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  save(tasks);
  return true;
}

export async function clearTasks(): Promise<boolean> {
  tasks = [];
  save(tasks);
  return true;
}

export async function reorderTasks(newList: Task[]): Promise<void> {
  tasks = newList;
  save(tasks);
}
