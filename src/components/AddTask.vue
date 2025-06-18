<template>
	<form class="add-task" @submit.prevent="handleSubmit">
		<div class="add-task__input-group">
			<input
				ref="inputRef"
				v-model="title"
				class="add-task__input"
				type="text"
				placeholder="Добавить новую задачу..."
				:disabled="loading"
				@keydown.escape="title = ''"
			/>
			<button
				class="add-task__button"
				type="submit"
				:disabled="!title.trim() || loading"
			>
				<LoadingSpinner v-if="loading" size="small" />
				<span v-else>Добавить</span>
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useStore } from "vuex";
import LoadingSpinner from "./UI/LoadingSpinner.vue";

const store = useStore();
const title = ref("");
const inputRef = ref<HTMLInputElement>();
const loading = ref(false);

const handleSubmit = async () => {
	if (!title.value.trim()) return;

	loading.value = true;

	try {
		await store.dispatch("createTask", title.value);
		title.value = "";
		await nextTick();
		inputRef.value?.focus();
	} catch (error) {
		console.error("Failed to create task:", error);
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/typography";
@import "@/styles/mixins";

.add-task {
	margin-bottom: $spacing-xl;
}

.add-task__input-group {
	display: flex;
	gap: $spacing-sm;

	@include mobile {
		flex-direction: column;
	}
}

.add-task__input {
	@include input-base;
	flex: 1;
}

.add-task__button {
	@include button-primary;
	min-width: 100px;

	@include mobile {
		width: 100%;
	}
}
</style> 