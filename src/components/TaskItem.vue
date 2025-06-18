<template>
	<li class="task-item" :class="{ 'task-item--completed': task.completed }">
		<div class="task-item__content">
			<label class="task-item__checkbox">
				<input
					type="checkbox"
					:checked="task.completed"
					@change="toggleStatus"
					:disabled="loading"
				/>
				<span class="task-item__checkmark"></span>
			</label>

			<div v-if="!isEditing" class="task-item__title" @dblclick="startEditing">
				{{ task.title }}
			</div>

			<input
				v-else
				ref="editInputRef"
				v-model="editTitle"
				class="task-item__edit-input"
				type="text"
				@blur="saveEdit"
				@keydown.enter="saveEdit"
				@keydown.escape="cancelEdit"
			/>
		</div>

		<div class="task-item__actions">
			<button
				v-if="!isEditing"
				class="task-item__delete"
				@click="handleDelete"
				:disabled="loading"
				type="button"
				title="Удалить задачу"
			>
				<LoadingSpinner v-if="loading" size="small" />
				<span v-else>×</span>
			</button>
		</div>
	</li>
</template>

<script setup lang="ts">
import { Task } from "@/types";
import { nextTick, ref } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "./UI/LoadingSpinner.vue";

interface Props {
	task: Task;
}

const props = defineProps<Props>();
const store = useStore();

const isEditing = ref(false);
const editTitle = ref("");
const editInputRef = ref<HTMLInputElement>();
const loading = ref(false);

const toggleStatus = async () => {
	loading.value = true;
	try {
		await store.dispatch("toggleTaskStatus", props.task.id);
	} catch (error) {
		console.error("Failed to toggle task status:", error);
	} finally {
		loading.value = false;
	}
};

const handleDelete = async () => {
	if (!confirm("Удалить эту задачу?")) return;

	loading.value = true;
	try {
		await store.dispatch("removeTask", props.task.id);
	} catch (error) {
		console.error("Failed to delete task:", error);
	} finally {
		loading.value = false;
	}
};

const startEditing = () => {
	editTitle.value = props.task.title;
	isEditing.value = true;
	nextTick(() => {
		editInputRef.value?.focus();
		editInputRef.value?.select();
	});
};

const saveEdit = async () => {
	if (editTitle.value.trim() && editTitle.value !== props.task.title) {
		try {
			await store.dispatch("updateTask", {
				id: props.task.id,
				updates: { title: editTitle.value.trim() },
			});
		} catch (error) {
			console.error("Failed to update task:", error);
		}
	}
	isEditing.value = false;
};

const cancelEdit = () => {
	isEditing.value = false;
	editTitle.value = "";
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/typography";
@import "@/styles/mixins";

.task-item {
	@include flex-between;
	padding: $spacing-md;
	background-color: $surface;
	border: 1px solid $border;
	border-radius: $radius-md;
	margin-bottom: $spacing-sm;
	transition: all 0.2s ease;

	&:hover {
		border-color: $border-hover;
		box-shadow: $shadow-sm;
	}

	&--completed {
		opacity: 0.7;

		.task-item__title {
			text-decoration: line-through;
			color: $text-secondary;
		}
	}
}

.task-item__content {
	@include flex-center;
	flex: 1;
	gap: $spacing-md;
	align-items: flex-start;
}

.task-item__checkbox {
	position: relative;
	cursor: pointer;
	margin-top: 2px;

	input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}
}

.task-item__checkmark {
	display: block;
	width: 20px;
	height: 20px;
	border: 2px solid $border;
	border-radius: $radius-sm;
	background-color: $surface;
	transition: all 0.2s ease;
	position: relative;

	&::after {
		content: "";
		position: absolute;
		display: none;
		left: 6px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	input:checked + & {
		background-color: $success-color;
		border-color: $success-color;

		&::after {
			display: block;
		}
	}

	input:disabled + & {
		opacity: 0.5;
		cursor: not-allowed;
	}
}

.task-item__title {
	flex: 1;
	cursor: pointer;
	word-break: break-word;
	line-height: $leading-relaxed;

	&:hover {
		color: $primary-color;
	}
}

.task-item__edit-input {
	@include input-base;
	flex: 1;
	font-size: $text-base;
	padding: $spacing-xs $spacing-sm;
}

.task-item__actions {
	margin-left: $spacing-sm;
}

.task-item__delete {
	@include flex-center;
	width: 32px;
	height: 32px;
	border: none;
	background-color: transparent;
	color: $text-muted;
	cursor: pointer;
	border-radius: $radius-sm;
	font-size: $text-xl;
	line-height: 1;
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background-color: #fef2f2;
		color: $error-color;
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
}
</style> 