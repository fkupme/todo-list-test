import { Task } from '@/types';

const STORAGE_KEY = 'todo-tasks';

let nextId = 1;

const mockTasks: Task[] = [
	{ id: nextId++, title: 'Изучить Vue 3', completed: false },
	{ id: nextId++, title: 'Настроить Vuex', completed: true },
	{ id: nextId++, title: 'Создать компоненты', completed: false },
];

const delay = (min: number, max: number): Promise<void> => {
	const ms = Math.random() * (max - min) + min;
	return new Promise(resolve => setTimeout(resolve, ms));
};

const shouldFail = (): boolean => {
	return Math.random() < 0.05;
};

const getStoredTasks = (): Task[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const tasks = JSON.parse(stored);
			nextId = Math.max(...tasks.map((t: Task) => t.id), 0) + 1;
			return tasks;
		}
	} catch (e) {
		console.warn('Failed to load tasks from localStorage:', e);
	}
	return mockTasks;
};

const storeTasks = (tasks: Task[]): void => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
	} catch (e) {
		console.warn('Failed to save tasks to localStorage:', e);
	}
};

let tasks = getStoredTasks();

export const getTasks = async (): Promise<Task[]> => {
	await delay(500, 1000);

	if (shouldFail()) {
		throw new Error('Не удалось загрузить задачи');
	}

	return [...tasks];
};

export const addTask = async (title: string): Promise<Task> => {
	await delay(300, 500);

	if (shouldFail()) {
		throw new Error('Не удалось добавить задачу');
	}

	if (!title.trim()) {
		throw new Error('Название задачи не может быть пустым');
	}

	const newTask: Task = {
		id: nextId++,
		title: title.trim(),
		completed: false,
	};

	tasks.push(newTask);
	storeTasks(tasks);

	return { ...newTask };
};

export const deleteTask = async (id: number): Promise<void> => {
	await delay(200, 400);

	if (shouldFail()) {
		throw new Error('Не удалось удалить задачу');
	}

	const index = tasks.findIndex(task => task.id === id);
	if (index === -1) {
		throw new Error('Задача не найдена');
	}

	tasks.splice(index, 1);
	storeTasks(tasks);
};

export const updateTask = async (
	id: number,
	updates: Partial<Task>
): Promise<Task> => {
	await delay(200, 400);

	if (shouldFail()) {
		throw new Error('Не удалось обновить задачу');
	}

	const task = tasks.find(t => t.id === id);
	if (!task) {
		throw new Error('Задача не найдена');
	}

	Object.assign(task, updates);
	storeTasks(tasks);

	return { ...task };
};
