<template>
	<div v-if="message" class="error-message">
		<span class="error-message__text">{{ message }}</span>
		<button
			v-if="dismissible"
			class="error-message__close"
			@click="$emit('dismiss')"
			type="button"
		>
			×
		</button>
	</div>
</template>

<script setup lang="ts">
interface Props {
	message: string | null;
	dismissible?: boolean;
}

withDefaults(defineProps<Props>(), {
	dismissible: true,
});

defineEmits<{
	dismiss: [];
}>();
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/typography";
@import "@/styles/mixins";

.error-message {
	@include flex-between;
	padding: $spacing-sm $spacing-md;
	background-color: #fef2f2;
	border: 1px solid #fecaca;
	border-radius: $radius-md;
	color: $error-color;
	font-size: $text-sm;
	margin-bottom: $spacing-md;
}

.error-message__text {
	flex: 1;
}

.error-message__close {
	background: none;
	border: none;
	color: $error-color;
	font-size: $text-lg;
	cursor: pointer;
	padding: 0;
	margin-left: $spacing-sm;
	line-height: 1;

	&:hover {
		opacity: 0.7;
	}
}
</style> 