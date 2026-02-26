<script lang="ts">
	import AuthForm from '$lib/compenents/auth/AuthForm.svelte';

	type Props = {
		form?: AuthFormData;
	};

	const { form }: Props = $props();
</script>

<AuthForm mode="signup" {form} />
