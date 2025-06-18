<template>
	<div class="task-list">
		<div v-if="loading && tasks.length === 0" class="task-list__loading">
			<LoadingSpinner />
			<span>Загрузка задач...</span>
		</div>

		<div v-else-if="tasks.length === 0" class="task-list__empty">
			<div class="task-list__empty-icon">📝</div>
			<h3>{{ emptyMessage }}</h3>
			<p v-if="currentFilter === 'all'">Добавьте вашу первую задачу выше</p>
		</div>

		<transition-group v-else name="task" tag="ul" class="task-list__items">
			<TaskItem v-for="task in tasks" :key="task.id" :task="task" />
		</transition-group>
	</div>
</template>

<script setup lang="ts">
import { FilterType } from "@/types";
import { computed } from "vue";
import { useStore } from "vuex";
import TaskItem from "./TaskItem.vue";
import LoadingSpinner from "./UI/LoadingSpinner.vue";

const store = useStore();

const tasks = computed(() => store.getters.filteredTasks);
const currentFilter = computed(() => store.state.currentFilter);
const loading = computed(() => store.getters.isLoading);

const emptyMessage = computed(() => {
	switch (currentFilter.value) {
		case FilterType.ACTIVE:
			return "Нет активных задач";
		case FilterType.COMPLETED:
			return "Нет выполненных задач";
		default:
			return "Нет задач";
	}
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/typography";
@import "@/styles/mixins";

.task-list__loading {
	@include flex-center;
	flex-direction: column;
	gap: $spacing-md;
	padding: $spacing-2xl;
	text-align: center;
	color: $text-secondary;
}

.task-list__empty {
	text-align: center;
	padding: $spacing-2xl;
	color: $text-secondary;
}

.task-list__empty-icon {
	font-size: 4rem;
	margin-bottom: $spacing-lg;
}

.task-list__empty h3 {
	margin-bottom: $spacing-sm;
	color: $text-primary;
}

.task-list__items {
	list-style: none;
	padding: 0;
	margin: 0;
}

.task-enter-active,
.task-leave-active {
	transition: all 0.3s ease;
}

.task-enter-from {
	opacity: 0;
	transform: translateY(-20px);
}

.task-leave-to {
	opacity: 0;
	transform: translateX(20px);
}

.task-move {
	transition: transform 0.3s ease;
}
</style> 