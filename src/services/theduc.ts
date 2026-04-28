const STORAGE_KEYS = {
	sessions: 'td_sessions_v1',
	metrics: 'td_metrics_v1',
	goals: 'td_goals_v1',
	exercises: 'td_exercises_v1',
};

function load<T>(key: string, fallback: T) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) as T : fallback;
	} catch (e) {
		return fallback;
	}
}

function save(key: string, data: any) {
	try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { /* ignore */ }
}

let trainingSessions = load(STORAGE_KEYS.sessions, [
	{ id: 1, date: '2026-04-20', type: 'Cardio', duration: 45, calories: 350, note: 'Chạy bộ', status: 'Hoàn thành' },
	{ id: 2, date: '2026-04-22', type: 'Strength', duration: 60, calories: 400, note: 'Tập tạ', status: 'Hoàn thành' },
]);

let healthMetrics = load(STORAGE_KEYS.metrics, [
	{ id: 1, date: '2026-04-22', weight: 68, height: 170, bmi: +(68 / ((170/100)*(170/100))).toFixed(1), heartRate: 60, sleepHours: 7 },
]);

let goals = load(STORAGE_KEYS.goals, [
	{ id: 1, title: 'Giảm 2kg trong 1 tháng', type: 'Giảm cân', targetValue: 2, currentValue: 0, unit: 'kg', deadline: '2026-05-28', status: 'Đang thực hiện' }
]);

let exercises = load(STORAGE_KEYS.exercises, [
	{ id: 1, title: 'Chạy bộ', groups: ['Legs', 'Cardio'], difficulty: 'Trung bình', caloriesPerHour: 600, description: 'Chạy ngoài trời hoặc máy.' },
	{ id: 2, title: 'Squat', groups: ['Legs'], difficulty: 'Khó', caloriesPerHour: 400, description: 'Squat với tạ hoặc thân trên.' },
]);

let trainingId = trainingSessions.reduce((m, r) => Math.max(m, r.id), 0);
let metricId = healthMetrics.reduce((m, r) => Math.max(m, r.id), 0);
let goalId = goals.reduce((m, r) => Math.max(m, r.id), 0);
let exerciseId = exercises.reduce((m, r) => Math.max(m, r.id), 0);

export async function getTrainingSessions() {
	return Promise.resolve([...trainingSessions]);
}

export async function addTrainingSession(payload: any) {
	const rec = { id: ++trainingId, ...payload };
	trainingSessions.unshift(rec);
	save(STORAGE_KEYS.sessions, trainingSessions);
	return Promise.resolve(rec);
}

export async function updateTrainingSession(id: number, payload: any) {
	const idx = trainingSessions.findIndex(x => x.id === id);
	if (idx !== -1) { trainingSessions[idx] = { ...trainingSessions[idx], ...payload }; save(STORAGE_KEYS.sessions, trainingSessions); }
	return Promise.resolve(trainingSessions[idx]);
}

export async function deleteTrainingSession(id: number) {
	const idx = trainingSessions.findIndex(x => x.id === id);
	if (idx !== -1) { trainingSessions.splice(idx, 1); save(STORAGE_KEYS.sessions, trainingSessions); }
	return Promise.resolve(true);
}

export async function getHealthMetrics() {
	return Promise.resolve([...healthMetrics]);
}

export async function addHealthMetric(payload: any) {
	const rec = { id: ++metricId, ...payload };
	healthMetrics.unshift(rec);
	save(STORAGE_KEYS.metrics, healthMetrics);
	return Promise.resolve(rec);
}

export async function updateHealthMetric(id: number, payload: any) {
	const idx = healthMetrics.findIndex(x => x.id === id);
	if (idx !== -1) { healthMetrics[idx] = { ...healthMetrics[idx], ...payload }; save(STORAGE_KEYS.metrics, healthMetrics); }
	return Promise.resolve(healthMetrics[idx]);
}

export async function deleteHealthMetric(id: number) {
	const idx = healthMetrics.findIndex(x => x.id === id);
	if (idx !== -1) { healthMetrics.splice(idx, 1); save(STORAGE_KEYS.metrics, healthMetrics); }
	return Promise.resolve(true);
}

// Goals
export async function getGoals() { return Promise.resolve([...goals]); }
export async function addGoal(payload: any) { const rec = { id: ++goalId, ...payload }; goals.unshift(rec); save(STORAGE_KEYS.goals, goals); return Promise.resolve(rec); }
export async function updateGoal(id: number, payload: any) { const idx = goals.findIndex(x => x.id === id); if (idx !== -1) { goals[idx] = { ...goals[idx], ...payload }; save(STORAGE_KEYS.goals, goals); } return Promise.resolve(goals[idx]); }
export async function deleteGoal(id: number) { const idx = goals.findIndex(x => x.id === id); if (idx !== -1) { goals.splice(idx, 1); save(STORAGE_KEYS.goals, goals); } return Promise.resolve(true); }

// Exercises
export async function getExercises() { return Promise.resolve([...exercises]); }
export async function addExercise(payload: any) { const rec = { id: ++exerciseId, ...payload }; exercises.unshift(rec); save(STORAGE_KEYS.exercises, exercises); return Promise.resolve(rec); }
export async function updateExercise(id: number, payload: any) { const idx = exercises.findIndex(x => x.id === id); if (idx !== -1) { exercises[idx] = { ...exercises[idx], ...payload }; save(STORAGE_KEYS.exercises, exercises); } return Promise.resolve(exercises[idx]); }
export async function deleteExercise(id: number) { const idx = exercises.findIndex(x => x.id === id); if (idx !== -1) { exercises.splice(idx, 1); save(STORAGE_KEYS.exercises, exercises); } return Promise.resolve(true); }
