import * as tasksApi from '@/api/tasks';
import { FilterType, RootState, Task } from '@/types';
import { createStore } from 'vuex';

export default createStore<RootState>({
	state: {
		tasks: [],
		currentFilter: FilterType.ALL,
		loading: false,
		error: null,
	},
	getters: {
		filteredTasks: state => {
			switch (state.currentFilter) {
				case FilterType.ACTIVE:
					return state.tasks.filter(task => !task.completed);
				case FilterType.COMPLETED:
					return state.tasks.filter(task => task.completed);
				default:
					return state.tasks;
			}
		},
		completedTasksCount: state => {
			return state.tasks.filter(task => task.completed).length;
		},
		activeTasksCount: state => {
			return state.tasks.filter(task => !task.completed).length;
		},
		isLoading: state => state.loading,
		hasError: state => !!state.error,
	},
	mutations: {
		SET_TASKS(state, tasks: Task[]) {
			state.tasks = tasks;
		},
		ADD_TASK(state, task: Task) {
			state.tasks.push(task);
		},
		DELETE_TASK(state, id: number) {
			state.tasks = state.tasks.filter(task => task.id !== id);
		},
		UPDATE_TASK(
			state,
			{ id, updates }: { id: number; updates: Partial<Task> }
		) {
			const task = state.tasks.find(t => t.id === id);
			if (task) {
				Object.assign(task, updates);
			}
		},
		SET_FILTER(state, filter: FilterType) {
			state.currentFilter = filter;
		},
		SET_LOADING(state, loading: boolean) {
			state.loading = loading;
		},
		SET_ERROR(state, error: string | null) {
			state.error = error;
		},
	},
	actions: {
		async fetchTasks({ commit }) {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			try {
				const tasks = await tasksApi.getTasks();
				commit('SET_TASKS', tasks);
			} catch (error) {
				commit(
					'SET_ERROR',
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				);
			} finally {
				commit('SET_LOADING', false);
			}
		},
		async createTask({ commit }, title: string) {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			try {
				const task = await tasksApi.addTask(title);
				commit('ADD_TASK', task);
			} catch (error) {
				commit(
					'SET_ERROR',
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				);
				throw error;
			} finally {
				commit('SET_LOADING', false);
			}
		},
		async removeTask({ commit }, id: number) {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			try {
				await tasksApi.deleteTask(id);
				commit('DELETE_TASK', id);
			} catch (error) {
				commit(
					'SET_ERROR',
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				);
				throw error;
			} finally {
				commit('SET_LOADING', false);
			}
		},
		async toggleTaskStatus({ commit }, id: number) {
			const state = this.state as RootState;
			const task = state.tasks.find(t => t.id === id);
			if (!task) return;

			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			try {
				const updatedTask = await tasksApi.updateTask(id, {
					completed: !task.completed,
				});
				commit('UPDATE_TASK', {
					id,
					updates: { completed: updatedTask.completed },
				});
			} catch (error) {
				commit(
					'SET_ERROR',
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				);
				throw error;
			} finally {
				commit('SET_LOADING', false);
			}
		},
		async updateTask(
			{ commit },
			{ id, updates }: { id: number; updates: Partial<Task> }
		) {
			commit('SET_LOADING', true);
			commit('SET_ERROR', null);

			try {
				const updatedTask = await tasksApi.updateTask(id, updates);
				commit('UPDATE_TASK', { id, updates });
			} catch (error) {
				commit(
					'SET_ERROR',
					error instanceof Error ? error.message : 'Неизвестная ошибка'
				);
				throw error;
			} finally {
				commit('SET_LOADING', false);
			}
		},
		setFilter({ commit }, filter: FilterType) {
			commit('SET_FILTER', filter);
		},
		clearError({ commit }) {
			commit('SET_ERROR', null);
		},
	},
	modules: {},
});
