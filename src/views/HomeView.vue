<template>
	<div class="home">
		<header class="home__header">
			<h1>Список задач</h1>
		</header>

		<main class="home__main">
			<ErrorMessage :message="error" @dismiss="clearError" />

			<AddTask />

			<TaskFilters />

			<TaskList />
		</main>
	</div>
</template>

<script setup lang="ts">
import AddTask from "@/components/AddTask.vue";
import TaskFilters from "@/components/TaskFilters.vue";
import TaskList from "@/components/TaskList.vue";
import ErrorMessage from "@/components/UI/ErrorMessage.vue";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const error = computed(() => store.state.error);

const clearError = () => {
	store.dispatch("clearError");
};

onMounted(() => {
	store.dispatch("fetchTasks");
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables";

.home {
	max-width: 800px;
	margin: 0 auto;
}

.home__header {
	text-align: center;
	margin-bottom: $spacing-2xl;
}

.home__header h1 {
	color: $text-primary;
	margin-bottom: $spacing-md;
}

.home__main {
	width: 100%;
}
</style>
