import { FilterType } from './Filter';
import { Task } from './Task';

export interface RootState {
	tasks: Task[];
	currentFilter: FilterType;
	loading: boolean;
	error: string | null;
}

export interface TaskMutations {
	SET_TASKS: Task[];
	ADD_TASK: Task;
	DELETE_TASK: number;
	UPDATE_TASK: { id: number; updates: Partial<Task> };
	SET_FILTER: FilterType;
	SET_LOADING: boolean;
	SET_ERROR: string | null;
}
