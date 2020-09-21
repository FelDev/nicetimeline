<style>
	div { 
		min-height: 100vh;
    display: flex;
    flex-direction: column;
	}
</style>

<script>
	import { cubicInOut } from 'svelte/easing'
	let duration = 200
	let delay = duration

	const transitionIn = () => ({
		duration,
		delay,
		easing: cubicInOut,
		css: (t) => `opacity: ${t}`,
	})

	const transitionOut = () => ({
		duration,
		delay: 0,
		easing: cubicInOut,
		css: (t) => `opacity: ${t}`,
	})
</script>

<div in:transitionIn out:transitionOut>
	<slot />
</div>