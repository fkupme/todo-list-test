<template>
	<div class="task-filters">
		<div class="task-filters__buttons">
			<button
				v-for="filter in filters"
				:key="filter.value"
				class="task-filters__button"
				:class="{
					'task-filters__button--active': currentFilter === filter.value,
				}"
				@click="setFilter(filter.value)"
				type="button"
			>
				{{ filter.label }}
				<span class="task-filters__count">{{ getCount(filter.value) }}</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { FilterType } from "@/types";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const filters = [
	{ value: FilterType.ALL, label: "Все" },
	{ value: FilterType.ACTIVE, label: "Активные" },
	{ value: FilterType.COMPLETED, label: "Выполненные" },
];

const currentFilter = computed(() => store.state.currentFilter);

const getCount = (filter: FilterType) => {
	switch (filter) {
		case FilterType.ALL:
			return store.state.tasks.length;
		case FilterType.ACTIVE:
			return store.getters.activeTasksCount;
		case FilterType.COMPLETED:
			return store.getters.completedTasksCount;
		default:
			return 0;
	}
};

const setFilter = (filter: FilterType) => {
	store.dispatch("setFilter", filter);
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/typography";
@import "@/styles/mixins";

.task-filters {
	margin-bottom: $spacing-xl;
}

.task-filters__buttons {
	display: flex;
	gap: $spacing-sm;

	@include mobile {
		flex-direction: column;
	}
}

.task-filters__button {
	@include button-secondary;
	@include flex-between;
	gap: $spacing-sm;

	&--active {
		background-color: $primary-color;
		color: white;
		border-color: $primary-color;
	}

	@include mobile {
		width: 100%;
	}
}

.task-filters__count {
	background-color: rgba(255, 255, 255, 0.2);
	border-radius: $radius-sm;
	padding: 2px 6px;
	font-size: $text-xs;
	font-weight: $font-semibold;

	.task-filters__button:not(.task-filters__button--active) & {
		background-color: $background;
		color: $text-secondary;
	}
}
</style> 